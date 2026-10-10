// nirengi's service worker, for the GitHub Pages build only. It keeps every page and asset of
// this version on the device, so the app installed on a phone opens without a network (the
// demo data already lives in the browser). Pages go to the network first, so a new deploy
// shows at once, and fall back to the copy kept here when the network is slow or gone. Built
// assets carry a hash in their name and are served from here first. scripts/pwa.mjs writes
// this build's version and file list in; films stream from the network and are never kept.

const VERSION = 'dev';
const FILES = [];
const CACHE = `nirengi-${VERSION}`;
const SCOPE = new URL(self.registration.scope);
const at = (rel) => new URL(rel, SCOPE).href;
/** How long a page may take on the network before the kept copy is shown instead. */
const WAIT_MS = 3500;

/** One key per page however it is asked for: /x, /x/, /x.html and /x?id=… are the same page. */
function pageKey(url) {
  const u = new URL(url);
  let p = u.pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
  if (p.length > SCOPE.pathname.length) p = p.replace(/\/$/, '');
  return u.origin + p;
}

/** A detail page made at runtime (/pilotlar/<id>…) is the kept `_` page; it reads the id from the address. */
const DETAIL = /\/(ihtiyaclar|kart|pilotlar|profil)\/([^/]+)\/?$/;
function detailKey(url) {
  const m = new URL(url).pathname.match(DETAIL);
  return m && m[2] !== '_' ? at(`${m[1]}/_`) : null;
}

/** A response that came through a redirect cannot answer a navigation; keep a plain copy. */
async function plain(res) {
  if (!res.redirected) return res;
  return new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: res.headers });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // A file that fails to come down now is kept the first time it is opened.
      for (let i = 0; i < FILES.length; i += 8)
        await Promise.all(
          FILES.slice(i, i + 8).map(async (f) => {
            try {
              const res = await fetch(at(f), { cache: 'reload' });
              if (res.ok) await cache.put(at(f), await plain(res));
            } catch {
              /* offline during install */
            }
          }),
        );
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys()) if (name.startsWith('nirengi-') && name !== CACHE) await caches.delete(name);
      await self.clients.claim();
    })(),
  );
});

async function page(request) {
  const cache = await caches.open(CACHE);
  const key = pageKey(request.url);
  const net = fetch(request).then(async (res) => {
    if (res.ok) await cache.put(key, await plain(res.clone()));
    return res;
  });
  net.catch(() => undefined);
  const slow = new Promise((_, fail) => setTimeout(() => fail(new Error('slow')), WAIT_MS));
  const detail = detailKey(request.url);
  const asDetail = async (res) => (res.status === 404 && detail ? ((await cache.match(detail)) ?? res) : res);
  try {
    return await asDetail(await Promise.race([net, slow]));
  } catch {
    const kept = (await cache.match(key, { ignoreSearch: true })) ?? (detail ? await cache.match(detail) : undefined);
    if (kept) return kept;
    try {
      return await asDetail(await net);
    } catch {
      // Nothing kept for this address: the kept 404 page says so (and forwards runtime ids).
      return (await cache.match(at('404.html'))) ?? Response.error();
    }
  }
}

async function asset(request) {
  const cache = await caches.open(CACHE);
  const kept = await cache.match(request);
  const fresh = () =>
    fetch(request).then(async (res) => {
      if (res.ok && res.type === 'basic') await cache.put(request, res.clone());
      return res;
    });
  if (!kept) return fresh();
  // Hashed files never change; anything else is refreshed in the background for the next visit.
  if (!new URL(request.url).pathname.includes('/_astro/')) fresh().catch(() => undefined);
  return kept;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) return;
  // Films are streamed in ranges straight from the network.
  if (request.headers.has('range') || url.pathname.endsWith('.mp4')) return;
  if (request.mode === 'navigate') event.respondWith(page(request));
  else event.respondWith(asset(request));
});
