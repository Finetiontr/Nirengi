// After pages-base: writes dist-pages/sw.js from src/sw.js with this build's version (a hash of
// every file it keeps) and the list of pages and assets to keep for offline use. Films stay out
// (they stream from the network), and so do font subsets for scripts the interface never shows.

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const OUT = 'dist-pages';

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const skip = (rel) => /\.(mp4|woff)$/.test(rel) || /-(vietnamese|cyrillic|greek)-/.test(rel) || rel === '.nojekyll' || rel === 'sw.js';

const hash = createHash('sha256');
const pages = new Set();
const assets = [];
let bytes = 0;
for (const f of walk(OUT).sort()) {
  const rel = relative(OUT, f).split(sep).join('/');
  if (skip(rel)) continue;
  const body = readFileSync(f);
  hash.update(rel).update(body);
  bytes += body.length;
  // Pages are kept under the address they are opened with: bugun.html and pilotlar/index.html as bugun and pilotlar.
  if (rel.endsWith('.html') && rel !== '404.html') pages.add(rel.replace(/\.html$/, '').replace(/(^|\/)index$/, ''));
  else assets.push(rel);
}

const version = hash.digest('hex').slice(0, 12);
const files = [...pages, ...assets];
const src = readFileSync('src/sw.js', 'utf8');
const out = src.replace("const VERSION = 'dev';", `const VERSION = '${version}';`).replace('const FILES = [];', `const FILES = ${JSON.stringify(files)};`);
if (out === src || !out.includes(version) || out.includes('const FILES = [];')) throw new Error('pwa: src/sw.js no longer has the VERSION / FILES lines to fill in');
writeFileSync(join(OUT, 'sw.js'), out);
console.log(`pwa: sw.js ${version} keeps ${pages.size} pages and ${assets.length} files (${(bytes / 1024 / 1024).toFixed(1)} MB before compression)`);
