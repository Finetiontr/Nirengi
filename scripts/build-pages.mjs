// npm run build:pages — static build for GitHub Pages without a cross-env dependency.
import { execSync } from 'node:child_process';

const env = { ...process.env, PAGES: '1', PAGES_BASE: process.env.PAGES_BASE ?? '/Nirengi' };
execSync('astro build', { stdio: 'inherit', env });
execSync('node scripts/pages-base.mjs', { stdio: 'inherit', env });
