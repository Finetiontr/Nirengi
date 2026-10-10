// nirengi's service worker, for the GitHub Pages build only. It keeps every page and asset of
// this version on the device, so the app installed on a phone opens without a network (the
// demo data already lives in the browser). Pages go to the network first, so a new deploy
// shows at once, and fall back to the copy kept here when the network is slow or gone. Built
// assets carry a hash in their name and are served from here first. scripts/pwa.mjs writes
// this build's version and file list in; films stream from the network and are never kept.
// Keeping a copy is best effort: when storage refuses one, the network answer still goes out.

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

/** The kept copy, or undefined; a storage error counts as nothing kept. */
async function kept(key, ignoreSearch = true) {
  try {
    return await (await caches.open(CACHE)).match(key, { ignoreSearch });
  } catch {
    return undefined;
  }
}

/** Keep a copy, never failing the caller. A redirected response cannot answer a navigation, so it is kept plain. */
async function keep(key, res) {
  try {
    const body = res.redirected ? new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: res.headers }) : res;
    await (await caches.open(CACHE)).put(key, body);
  } catch {
    /* storage full, busy or refused: the next visit tries again */
  }
}

self.addEventListener('install', (event) => {
  // A new version takes over at once; a page that comes from a broken older one must not wait for it.
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      // A file that fails to come down now is kept the first time it is opened.
      for (let i = 0; i < FILES.length; i += 8)
        await Promise.all(
          FILES.slice(i, i + 8).map(async (f) => {
            try {
              const res = await fetch(at(f), { cache: 'reload' });
              if (res.ok) await keep(at(f), res);
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
      try {
        for (const name of await caches.keys()) if (name.startsWith('nirengi-') && name !== CACHE) await caches.delete(name);
      } catch {
        /* an old copy that cannot be removed is only wasted space */
      }
      await self.clients.claim();
    })(),
  );
});

async function page(request) {
  const key = pageKey(request.url);
  const detail = detailKey(request.url);
  const net = fetch(request).then((res) => {
    if (res.ok) void keep(key, res.clone());
    return res;
  });
  const asDetail = async (res) => (res.status === 404 && detail ? ((await kept(detail)) ?? res) : res);
  const slow = new Promise((ok) => setTimeout(() => ok(null), WAIT_MS));
  const first = await Promise.race([net.catch(() => null), slow]);
  if (first) return asDetail(first);
  // Slow or offline: the copy kept here, else the network after all.
  const copy = (await kept(key)) ?? (detail ? await kept(detail) : undefined);
  if (copy) return copy;
  try {
    return await asDetail(await net);
  } catch {
    // Nothing kept for this address: the kept 404 page says so (and forwards runtime ids).
    return (await kept(at('404.html'))) ?? Response.error();
  }
}

async function asset(request) {
  const hit = await kept(request, false);
  const fresh = () =>
    fetch(request).then((res) => {
      if (res.ok && res.type === 'basic') void keep(request, res.clone());
      return res;
    });
  if (!hit) return fresh();
  // Hashed files never change; anything else is refreshed in the background for the next visit.
  if (!new URL(request.url).pathname.includes('/_astro/')) fresh().catch(() => undefined);
  return hit;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) return;
  // Films are streamed in ranges straight from the network.
  if (request.headers.has('range') || url.pathname.endsWith('.mp4')) return;
  // Whatever goes wrong in here, the plain network answer is the last word.
  const answer = request.mode === 'navigate' ? page(request) : asset(request);
  event.respondWith(answer.catch(() => fetch(request)));
});
