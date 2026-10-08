// Renders every slide of /sunum as layers for the PowerPoint export (see README.md).
// Per slide: the full frame (reference), the background (all `s-in` blocks and Niri
// hidden), every top-level `s-in` block alone on transparency, Niri alone and the
// bubble alone. Frames are 1920×1080 at 2× so the stage (1600×900, scaled 1.2) fills
// them exactly; build.py trims each layer to its alpha box and places it.
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

const { NOTES } = await import(pathToFileURL(join(repo, 'src/components/sunum/notes.ts')).href);

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
await page.goto(`${URL_}#1`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// Step once forward and back so the first-visit key hint is gone.
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(300);
await page.keyboard.press('ArrowLeft');
await page.waitForTimeout(300);
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

const count = await page.evaluate(() => Number(document.querySelector('[aria-roledescription="slayt"]').getAttribute('aria-label').match(/\/\s*(\d+)/)[1]));
const slideIds = Object.keys(NOTES);
const manifest = { width: 3840, height: 2160, stage: { width: 1600, height: 900 }, slides: [] };

for (let n = 1; n <= count; n++) {
  await page.evaluate((n) => (location.hash = `#${n}`), n);
  await page.waitForFunction((n) => location.hash === `#${n}` && document.title.startsWith(`${n}.`), n);
  // Let late pieces (the survey flag, fonts in new weights) settle.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1600);

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
  await only('[data-x-niri]', 'niri.png');
  await only('[data-x-bubble]', 'bubble.png');

  await page.evaluate(() => {
    document.documentElement.classList.remove('x-clear');
    document.querySelectorAll('[data-x-layer],[data-x-niri],[data-x-bubble]').forEach((e) => {
      e.removeAttribute('data-x-layer');
      e.removeAttribute('data-x-niri');
      e.removeAttribute('data-x-bubble');
    });
  });

  const id = slideIds[n - 1];
  manifest.slides.push({ n, id, title: info.title, line: info.line, notes: NOTES[id] ?? null, layers: info.layers.map((l) => ({ ...l, file: `l${l.k}.png` })) });
  console.log(`${n}/${count} ${info.title}: ${info.layers.length} layers`);
}

writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
await browser.close();
console.log(`layers in ${OUT}`);
