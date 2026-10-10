// After `PAGES=1 astro build`: the site lives under https://<org>.github.io/<repo>/, so
// every root-absolute URL in dist-pages moves under the repo path. Astro's own `base`
// is not used because the app compares Astro.url.pathname with plain routes; here the
// route literals and the live location.pathname both carry the prefix, so comparisons
// in client code stay consistent.
//
// Rewritten (in .html, .js, .css): a quote (plus `url(` in CSS, `url=` in HTML) right
// before /_astro/…, any file from public/, or any route from src/pages (/bugun,
// /pilotlar/…), plus the home link "/" where it is clearly a link (href, location.href, assign).

import { copyFileSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const BASE = (process.env.PAGES_BASE ?? '/Nirengi').replace(/\/+$/, '');
const OUT = 'dist-pages';

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// First path segment of every page (index → home, [param] dirs → their parent).
const routes = new Set(
  walk('src/pages')
    .map((f) => relative('src/pages', f).split(sep)[0].replace(/\.(astro|md|mdx|ts|js)$/, ''))
    .filter((r) => r && r !== 'index' && r !== '404' && !r.startsWith('[')),
);
const heads = ['_astro', ...readdirSync('public'), ...routes].map(escape).join('|');

// The segment must end the literal: followed by / ? # a quote, `)`, whitespace or a template `${`.
const TAIL = '(?=[/?#"\'`)\\s$]|$)';
const segFor = (lead) => new RegExp(`(${lead})/(${heads})${TAIL}`, 'g');
const SEG = {
  html: segFor('["\'`]|url='),
  css: segFor('["\'(]'),
  js: segFor('["\'`]'),
};
// Home: "/" exactly, only in link positions.
const HOME = /((?:href|location\.href)\s*[:=]\s*|assign\()(["'`])\/\2/g;
// Absolute canonical links (Astro's redirect pages) are built from the site's origin alone.
const CANON = /(<link rel="canonical" href="https?:\/\/[^/"]+)(\/[^"]*)"/g;

let files = 0;
let hits = 0;
for (const f of walk(OUT)) {
  if (!/\.(html|js|mjs|css)$/.test(f)) continue;
  const src = readFileSync(f, 'utf8');
  const seg = f.endsWith('.html') ? SEG.html : f.endsWith('.css') ? SEG.css : SEG.js;
  let n = 0;
  const out = src
    .replace(seg, (_, q, h) => (n++, `${q}${BASE}/${h}`))
    .replace(HOME, (_, pre, q) => (n++, `${pre}${q}${BASE}/${q}`))
    .replace(CANON, (all, origin, path) => (path.startsWith(`${BASE}/`) || !f.endsWith('.html') ? all : (n++, `${origin}${BASE}${path}"`)));
  if (n) {
    writeFileSync(f, out);
    files++;
    hits += n;
  }
}
// /pilotlar is both pilotlar.html and a folder of detail pages. Whichever one GitHub Pages
// picks (the file, or a redirect to /pilotlar/), the page must be there.
for (const f of walk(OUT)) {
  const dir = f.replace(/\.html$/, '');
  if (dir !== f && existsSync(dir) && statSync(dir).isDirectory() && !existsSync(join(dir, 'index.html'))) copyFileSync(f, join(dir, 'index.html'));
}
writeFileSync(join(OUT, '.nojekyll'), '');
console.log(`pages-base: ${hits} URLs moved under ${BASE}/ in ${files} files (routes: ${[...routes].join(', ')})`);
