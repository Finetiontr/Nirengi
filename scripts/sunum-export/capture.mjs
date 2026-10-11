// Renders every slide of /sunum as layers for the PowerPoint
// export (see README.md). Per slide: the full frame (reference), the background (all
// `s-in` blocks and Niri hidden), every top-level `s-in` block alone on transparency,
// Niri alone and the bubble alone; then, for each further bubble on the slide, its full frame,
// Niri and the bubble again. Every bubble is held through the deck's #n.k address; the manifest
// carries how long each one stays (timing.ts) for build.py.
// The film slide has no Niri: it is shot on the video's poster and build.py embeds the video itself. Frames are 1920×1080 at 2× so
// the stage (1600×900, scaled 1.2) fills them exactly; build.py trims each layer to
// its alpha box and places it.
//
//   node capture.mjs [--url http://127.0.0.1:4321/sunum] [--out <dir>]
// Env: PLAYWRIGHT_DIR (folder holding node_modules/playwright), CHROME_PATH.

import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');
const arg = (name, fallback) => {
  const k = process.argv.indexOf(`--${name}`);
  return k > 0 ? process.argv[k + 1] : fallback;
};
const URL_ = arg('url', 'http://127.0.0.1:4321/sunum');
const OUT = resolve(arg('out', join(process.env.TEMP ?? '.', 'nirengi-sunum-layers')));

// Playwright from the repo if present, else from PLAYWRIGHT_DIR.
function loadPlaywright() {
  for (const base of [repo, process.env.PLAYWRIGHT_DIR].filter(Boolean)) {
    try {
      return createRequire(join(base, 'package.json'))('playwright');
    } catch {}
  }
  throw new Error('playwright not found: install it in the repo or set PLAYWRIGHT_DIR to a folder with node_modules/playwright');
}
const { chromium } = loadPlaywright();

const { NOTES, QA } = await import(pathToFileURL(join(repo, 'src/components/sunum/notes.ts')).href);
const { beatSec } = await import(pathToFileURL(join(repo, 'src/components/sunum/timing.ts')).href);

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
  colorScheme: 'light',
});
await ctx.addInitScript(() => {
  try {
    localStorage.setItem('nirengi:theme', 'light');
  } catch {}
});
const page = await ctx.newPage();
// A held bubble (#n.k) stays put and shows no key hints.
await page.goto(`${URL_}#1.1`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.mouse.move(0, 0);

// Export-only styles: a transparent page for the layer shots, and a class that
// hides the whole stage so only the element marked visible paints.
await page.addStyleTag({
  content: `
    html.x-clear, html.x-clear body, html.x-clear .deck { background: transparent !important; }
    html.x-clear .stage { visibility: hidden !important; }
    html.x-clear [data-x-show] { visibility: visible !important; }
    .deck { cursor: none !important; }
  `,
});

// notes.ts lists every slide in deck order.
const slideIds = Object.keys(NOTES);
const count = slideIds.length;
const manifest = { width: 3840, height: 2160, stage: { width: 1600, height: 900 }, qa: QA, slides: [] };

for (let n = 1; n <= count; n++) {
  await page.evaluate((n) => (location.hash = `#${n}.1`), n);
  await page.waitForFunction((n) => location.hash === `#${n}.1` && document.title.startsWith(`${n}.`), n);
  // Let late pieces (the survey flag, fonts in new weights) settle.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1600);

  // The film slide: note the video's length, stop it and show its poster (a src-less load does that).
  const film = await page.evaluate(() => {
    if (getComputedStyle(document.querySelector('.narrator')).visibility !== 'hidden') return null;
    const v = document.querySelector('.stage section video');
    const ms = v && Number.isFinite(v.duration) ? Math.round(v.duration * 1000) : 0;
    if (v) {
      v.pause();
      v.removeAttribute('src');
      v.load();
    }
    return { ms };
  });
  const bare = !!film;
  if (bare) await page.waitForTimeout(600);

  const dir = join(OUT, String(n).padStart(2, '0'));
  mkdirSync(dir, { recursive: true });
  const shot = (file, clear) => page.screenshot({ path: join(dir, file), omitBackground: clear, animations: 'disabled' });

  // Tag the layers in paint order; read each block's delay.
  const info = await page.evaluate(() => {
    const stage = document.querySelector('.stage');
    const section = stage.querySelector('section');
    const blocks = [...section.querySelectorAll('.s-in')].filter((e) => !e.parentElement.closest('.s-in'));
    const layers = blocks.map((el, k) => {
      el.setAttribute('data-x-layer', String(k));
      const d = getComputedStyle(el).getPropertyValue('--d').trim();
      return { k, delay: d ? parseFloat(d) : 0, text: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 60) };
    });
    const narrator = stage.querySelector('.narrator');
    narrator.querySelector('span.inline-block').setAttribute('data-x-niri', '');
    narrator.querySelector('.n-bubble').setAttribute('data-x-bubble', '');
    return { title: document.title.replace(/ · nirengi sunum$/, '').replace(/^\d+\.\s*/, ''), layers, line: narrator.querySelector('.n-bubble').textContent.trim() };
  });

  await shot('full.png', false);

  // Background: everything but the blocks and Niri.
  await page.evaluate(() => {
    document.querySelectorAll('[data-x-layer], .narrator').forEach((e) => (e.style.visibility = 'hidden'));
  });
  await shot('bg.png', false);
  await page.evaluate(() => {
    document.querySelectorAll('[data-x-layer], .narrator').forEach((e) => (e.style.visibility = ''));
    document.documentElement.classList.add('x-clear');
  });

  const only = async (sel, file) => {
    await page.evaluate((sel) => document.querySelector(sel).setAttribute('data-x-show', ''), sel);
    await shot(file, true);
    await page.evaluate((sel) => document.querySelector(sel).removeAttribute('data-x-show'), sel);
  };
  for (const l of info.layers) await only(`[data-x-layer="${l.k}"]`, `l${l.k}.png`);
  if (!bare) {
    await only('[data-x-niri]', 'niri.png');
    await only('[data-x-bubble]', 'bubble.png');
  }

  await page.evaluate(() => {
    document.documentElement.classList.remove('x-clear');
    document.querySelectorAll('[data-x-layer],[data-x-niri],[data-x-bubble]').forEach((e) => {
      e.removeAttribute('data-x-layer');
      e.removeAttribute('data-x-niri');
      e.removeAttribute('data-x-bubble');
    });
  });

  // Niri's further bubbles on this slide: only Niri and the bubble change. On the talk's slides
  // every bubble but the last moves on by itself after `adv` ms, as on the web.
  const id = slideIds[n - 1];
  const steps = bare || NOTES[id].beats.some((b) => b.at !== undefined) ? 1 : NOTES[id].beats.length;
  const adv = (k) => (NOTES[id].sec > 0 && k < steps - 1 ? Math.round(beatSec(NOTES[id].beats[k].say) * 1000) : null);
  const lines = [{ k: 0, line: info.line, full: 'full.png', niri: bare ? null : 'niri.png', bubble: bare ? null : 'bubble.png', adv: adv(0) }];
  for (let k = 1; k < steps; k++) {
    await page.evaluate(([n, k]) => (location.hash = `#${n}.${k + 1}`), [n, k]);
    await page.waitForFunction((text) => document.querySelector('.narrator .n-bubble')?.textContent.trim() === text, NOTES[id].beats[k].text);
    await page.waitForTimeout(500);
    await shot(`full-${k}.png`, false);
    await page.evaluate(() => {
      const narrator = document.querySelector('.stage .narrator');
      narrator.querySelector('span.inline-block').setAttribute('data-x-niri', '');
      narrator.querySelector('.n-bubble').setAttribute('data-x-bubble', '');
      document.documentElement.classList.add('x-clear');
    });
    await only('[data-x-niri]', `niri-${k}.png`);
    await only('[data-x-bubble]', `bubble-${k}.png`);
    await page.evaluate(() => {
      document.documentElement.classList.remove('x-clear');
      document.querySelectorAll('[data-x-niri],[data-x-bubble]').forEach((e) => {
        e.removeAttribute('data-x-niri');
        e.removeAttribute('data-x-bubble');
      });
    });
    lines.push({ k, line: NOTES[id].beats[k].text, full: `full-${k}.png`, niri: `niri-${k}.png`, bubble: `bubble-${k}.png`, adv: adv(k) });
  }
  manifest.slides.push({ n, id, bare, film_ms: film?.ms || null, title: info.title, lines, notes: NOTES[id] ?? null, layers: info.layers.map((l) => ({ ...l, file: `l${l.k}.png` })) });
  console.log(`${n}/${count} ${info.title}: ${info.layers.length} layers, ${lines.length} Niri lines`);
}

writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
await browser.close();
console.log(`layers in ${OUT}`);
