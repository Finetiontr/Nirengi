// nirengi-auth: the one server piece of NİRENGİ. GitHub's OAuth token exchange
// needs the client secret and has no CORS, so a static site cannot do it alone.
// This worker holds the secret, swaps the code for a token and hands the token
// back to the site in the URL fragment (never in a query string or a log).
//
//   GET  /                  → { ok, configured }
//   GET  /login?return=URL  → GitHub consent screen (public data only, no scopes)
//   GET  /callback          → back to URL#gh_token=… or URL#gh_error=…
//   POST /logout {token}    → revokes the token at GitHub (CORS for the site)

const ALLOWED = new Set([
  'https://finetiontr.github.io',
  'http://127.0.0.1:4321',
  'http://localhost:4321',
  'http://127.0.0.1:4399',
  'http://localhost:4399',
]);

const COOKIE = 'nirengi_oauth';
const UA = 'nirengi-auth';

/** @param {string | null} raw */
function allowedReturn(raw) {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (!ALLOWED.has(u.origin)) return null;
    u.hash = '';
    return u.toString();
  } catch {
    return null;
  }
}

/** @param {string} to @param {string} [cookie] */
function redirect(to, cookie) {
  const headers = new Headers({ Location: to, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
  if (cookie) headers.append('Set-Cookie', cookie);
  return new Response(null, { status: 302, headers });
}

/** @param {unknown} body @param {number} [status] @param {HeadersInit} [extra] */
function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra } });
}

/** @param {Request} req */
function cors(req) {
  const origin = req.headers.get('Origin') ?? '';
  if (!ALLOWED.has(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

/** @param {Request} req @param {string} name */
function readCookie(req, name) {
  for (const part of (req.headers.get('Cookie') ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

const b64url = {
  /** @param {string} s */
  enc: (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  /** @param {string} s */
  dec: (s) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))),
};

/** @param {string} value @param {number} maxAge */
const setCookie = (value, maxAge) => `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

/** @param {string} back @param {string} reason */
const fail = (back, reason) => redirect(`${back}#gh_error=${encodeURIComponent(reason)}`, setCookie('', 0));

/** @param {string} a @param {string} b */
function sameString(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export default {
  /** @param {Request} req @param {{ GITHUB_CLIENT_ID?: string, GITHUB_CLIENT_SECRET?: string }} env */
  async fetch(req, env) {
    const url = new URL(req.url);
    const configured = !!(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);

    if (url.pathname === '/' && req.method === 'GET') return json({ ok: true, configured });

    if (url.pathname === '/login' && req.method === 'GET') {
      const back = allowedReturn(url.searchParams.get('return'));
      if (!back) return json({ error: 'return_not_allowed' }, 400);
      if (!configured) return redirect(`${back}#gh_error=config`);
      const state = crypto.randomUUID().replace(/-/g, '');
      const auth = new URL('https://github.com/login/oauth/authorize');
      auth.searchParams.set('client_id', env.GITHUB_CLIENT_ID ?? '');
      auth.searchParams.set('redirect_uri', `${url.origin}/callback`);
      auth.searchParams.set('state', state);
      auth.searchParams.set('allow_signup', 'true');
      return redirect(auth.toString(), setCookie(`${state}.${b64url.enc(back)}`, 600));
    }

    if (url.pathname === '/callback' && req.method === 'GET') {
      const raw = readCookie(req, COOKIE);
      const dot = raw?.indexOf('.') ?? -1;
      let back = null;
      if (raw && dot > 0) {
        try {
          back = allowedReturn(b64url.dec(raw.slice(dot + 1)));
        } catch {
          back = null;
        }
      }
      // Without a cookie we do not know where to send the visitor; say so plainly.
      if (!raw || !back) return json({ error: 'session_expired' }, 400, { 'Set-Cookie': setCookie('', 0) });
      const state = url.searchParams.get('state') ?? '';
      if (!sameString(state, raw.slice(0, dot))) return fail(back, 'state');
      if (url.searchParams.get('error')) return fail(back, url.searchParams.get('error') === 'access_denied' ? 'denied' : 'github');
      const code = url.searchParams.get('code');
      if (!code) return fail(back, 'github');
      if (!configured) return fail(back, 'config');

      let token = '';
      try {
        const res = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': UA },
          body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: `${url.origin}/callback` }),
        });
        const data = /** @type {{ access_token?: string }} */ (await res.json());
        token = data.access_token ?? '';
      } catch {
        return fail(back, 'network');
      }
      if (!token) return fail(back, 'exchange');
      return redirect(`${back}#gh_token=${encodeURIComponent(token)}`, setCookie('', 0));
    }

    if (url.pathname === '/logout') {
      const headers = cors(req);
      if (!headers) return json({ error: 'origin_not_allowed' }, 403);
      if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
      if (req.method !== 'POST') return json({ error: 'method' }, 405, headers);
      let token = '';
      try {
        token = String((/** @type {{ token?: unknown }} */ (await req.json())).token ?? '');
      } catch {
        /* empty body */
      }
      if (token && configured) {
        // Best effort: a token that is already gone is fine too.
        await fetch(`https://api.github.com/applications/${env.GITHUB_CLIENT_ID}/token`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Basic ${btoa(`${env.GITHUB_CLIENT_ID}:${env.GITHUB_CLIENT_SECRET}`)}`,
            'Content-Type': 'application/json',
            'User-Agent': UA,
          },
          body: JSON.stringify({ access_token: token }),
        }).catch(() => undefined);
      }
      return new Response(null, { status: 204, headers });
    }

    return json({ error: 'not_found' }, 404);
  },
};
