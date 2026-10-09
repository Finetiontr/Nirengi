import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// PAGES=1 (npm run build:pages) builds the static GitHub Pages copy into dist-pages;
// scripts/pages-base.mjs then moves every root-absolute URL under the repo path.
const pages = process.env.PAGES === '1';

export default defineConfig({
  site: pages ? 'https://finetiontr.github.io' : 'https://nirengi.app',
  integrations: [react()],
  devToolbar: { enabled: false },
  ...(pages ? { output: 'static', outDir: 'dist-pages', build: { format: 'file' } } : { output: 'server', adapter: node({ mode: 'standalone' }) }),
  // three.js is lazy-loaded only by the landing hero, so its chunk size is expected.
  vite: { plugins: [tailwindcss()], build: { chunkSizeWarningLimit: 700 } },
});
