// nirengi-api: the one server piece of NİRENGİ. The site is static (GitHub Pages), but turning
// the GitHub App's one-time code into a user token needs the app's client secret, and GitHub's
// token endpoint sends no CORS headers. This worker holds the secret and does only that, plus
// revoking a token on sign-out. It keeps no state and no account-specific ids, so it can be
// redeployed to any Cloudflare account (see worker/README.md).
//
//   GET  /               → { ok, github }
//   POST /github/token   { code }  → { token, expiresAt } | { error }
//   POST /github/revoke  { token } → 204

export interface Env {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  /** Comma-separated site origins allowed to call the API. */
  ALLOWED_ORIGINS?: string;
}

const UA = 'nirengi-api';

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });

function corsFor(req: Request, env: Env): Record<string, string> | null {
  const origin = req.headers.get('Origin') ?? '';
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean);
  if (!allowed.includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

async function readField(req: Request, name: string): Promise<string> {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const v = body[name];
    return typeof v === 'string' ? v.trim() : '';
  } catch {
    return '';
  }
}

/** One-time code from the install/sign-in redirect → user token limited to the repositories picked on GitHub. */
async function exchange(code: string, env: Env, cors: Record<string, string>) {
  let data: { access_token?: string; expires_in?: number; error?: string };
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': UA },
      body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code }),
    });
    data = await res.json();
  } catch {
    return json({ error: 'network' }, 502, cors);
  }
  if (!data.access_token) return json({ error: data.error === 'bad_verification_code' ? 'expired' : 'github' }, 400, cors);
  // The refresh token stays with GitHub: the site signs in again when this one runs out.
  const expiresAt = data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : null;
  return json({ token: data.access_token, expiresAt }, 200, cors);
}

async function revoke(token: string, env: Env, cors: Record<string, string>) {
  try {
    await fetch(`https://api.github.com/applications/${env.GITHUB_CLIENT_ID}/token`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Basic ${btoa(`${env.GITHUB_CLIENT_ID}:${env.GITHUB_CLIENT_SECRET}`)}`,
        'Content-Type': 'application/json',
        'User-Agent': UA,
      },
      body: JSON.stringify({ access_token: token }),
    });
  } catch {
    // Best effort: the token also runs out on its own within hours.
  }
  return new Response(null, { status: 204, headers: cors });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(req.url);
    const github = !!(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);

    if (pathname === '/' && req.method === 'GET') return json({ ok: true, github });
    if (pathname !== '/github/token' && pathname !== '/github/revoke') return json({ error: 'not_found' }, 404);

    const cors = corsFor(req, env);
    if (!cors) return json({ error: 'origin_not_allowed' }, 403);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, cors);
    if (!github) return json({ error: 'config' }, 503, cors);

    if (pathname === '/github/token') {
      const code = await readField(req, 'code');
      return code ? exchange(code, env, cors) : json({ error: 'code_missing' }, 400, cors);
    }
    const token = await readField(req, 'token');
    return token ? revoke(token, env, cors) : json({ error: 'token_missing' }, 400, cors);
  },
};
