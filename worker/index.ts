// nirengi-api: the one server piece of NİRENGİ. The site is static (GitHub Pages), but two
// things cannot run in the browser: turning the GitHub App's one-time code into a user token
// needs the app's client secret (and GitHub's token endpoint sends no CORS headers), and Niri's
// draft reader runs an open-weight model on Workers AI. Its only state is the real-use counter
// (stats.ts); it keeps no account-specific ids, so it can be redeployed to any Cloudflare account
// (see worker/README.md).
//
//   GET  /               → { ok, github, ai, stats }
//   GET  /stats          → { people, drafts, since }
//   POST /github/token   { code }  → { token, expiresAt } | { error }
//   POST /github/revoke  { token } → 204
//   POST /ai/draft       { text }  → { draft, model, label } | { error }

import { DRAFT_MODEL, draftRequest, MAX_TEXT, MODEL_LABEL, readModelOutput } from './draft.ts';
import type { Hit } from './stats.ts';
import { SAMPLE_COMPLAINT } from '../src/lib/engine/canvas.ts';

export { Stats } from './stats.ts';

export interface Env {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  /** Comma-separated site origins allowed to call the API. */
  ALLOWED_ORIGINS?: string;
  /** Workers AI: no key, the account's daily free allocation applies. */
  AI?: { run(model: string, input: unknown): Promise<unknown> };
  /** Per-visitor brake on /ai/draft, so one loop cannot use up the day's free allocation. */
  DRAFT_LIMIT?: { limit(o: { key: string }): Promise<{ success: boolean }> };
  /** Durable Object with the real-use counts (stats.ts). */
  STATS?: { idFromName(name: string): unknown; get(id: unknown): { fetch(url: string, init?: RequestInit): Promise<Response> } };
}

/** Lets a count finish after the answer has gone out. */
type Ctx = { waitUntil(p: Promise<unknown>): void };

const ROUTES = ['/github/token', '/github/revoke', '/ai/draft', '/stats'];

const UA = 'nirengi-api';

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });

function corsFor(req: Request, env: Env): Record<string, string> | null {
  const origin = req.headers.get('Origin') ?? '';
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean);
  if (!allowed.includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

const counter = (env: Env) => env.STATS!.get(env.STATS!.idFromName('nirengi'));

/** Add one to the real-use counter; a missed count never fails the request it rides on. */
async function count(env: Env, hit: Hit) {
  try {
    await counter(env).fetch('https://stats/hit', { method: 'POST', body: JSON.stringify(hit) });
  } catch {
    /* the counter is a side note */
  }
}

/** A keyed hash of the GitHub user id: the same person counts once, and the hash cannot be turned back into who they are. */
async function personKey(token: string, env: Env): Promise<string | null> {
  try {
    const res = await fetch('https://api.github.com/user', { headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'User-Agent': UA } });
    const id = res.ok ? ((await res.json()) as { id?: number }).id : undefined;
    if (!id) return null;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(env.GITHUB_CLIENT_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(`github:${id}`)));
    return [...mac.slice(0, 16)].map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;
  }
}

/** One-time code from the install/sign-in redirect → user token limited to the repositories picked on GitHub. */
async function exchange(code: string, env: Env, cors: Record<string, string>, later: (p: Promise<unknown>) => void) {
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
  const token = data.access_token;
  if (env.STATS) later(personKey(token, env).then((who) => (who ? count(env, { kind: 'person', who }) : undefined)));
  return json({ token, expiresAt }, 200, cors);
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

/** The kurum's own words → the model's raw draft. The prompt is fixed here; the site checks every field against the text. */
async function draft(text: string, env: Env, cors: Record<string, string>, visitor: string, later: (p: Promise<unknown>) => void) {
  if (text.length < 30 || text.length > MAX_TEXT) return json({ error: 'length' }, 400, cors);
  if (env.DRAFT_LIMIT && !(await env.DRAFT_LIMIT.limit({ key: visitor })).success) return json({ error: 'busy' }, 429, cors);
  let out: unknown;
  try {
    out = await env.AI!.run(DRAFT_MODEL, draftRequest(text));
  } catch (e) {
    // On the Workers Free plan the day's allocation simply runs out; nothing is billed.
    const quota = /neuron|daily|allocation|4006|3036/i.test(String((e as Error)?.message ?? e));
    return json({ error: quota ? 'quota' : 'model' }, 503, cors);
  }
  const d = readModelOutput(out);
  // The site's sample text is a demo, not a kurum's own words: it is read but not counted.
  if (d && env.STATS && text !== SAMPLE_COMPLAINT) later(count(env, { kind: 'draft' }));
  return d ? json({ draft: d, model: DRAFT_MODEL, label: MODEL_LABEL }, 200, cors) : json({ error: 'model' }, 502, cors);
}

export default {
  async fetch(req: Request, env: Env, ctx?: Ctx): Promise<Response> {
    const { pathname } = new URL(req.url);
    const github = !!(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);
    const later = (p: Promise<unknown>) => (ctx ? ctx.waitUntil(p) : void p);

    if (pathname === '/' && req.method === 'GET') return json({ ok: true, github, ai: !!env.AI, stats: !!env.STATS });
    if (!ROUTES.includes(pathname)) return json({ error: 'not_found' }, 404);

    const cors = corsFor(req, env);
    if (!cors) return json({ error: 'origin_not_allowed' }, 403);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    if (pathname === '/stats') {
      if (req.method !== 'GET') return json({ error: 'method_not_allowed' }, 405, cors);
      if (!env.STATS) return json({ error: 'config' }, 503, cors);
      return json(await (await counter(env).fetch('https://stats/read')).json(), 200, cors);
    }
    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, cors);

    if (pathname === '/ai/draft') {
      if (!env.AI) return json({ error: 'config' }, 503, cors);
      return draft(await readField(req, 'text'), env, cors, req.headers.get('CF-Connecting-IP') ?? 'anon', later);
    }
    if (!github) return json({ error: 'config' }, 503, cors);

    if (pathname === '/github/token') {
      const code = await readField(req, 'code');
      return code ? exchange(code, env, cors, later) : json({ error: 'code_missing' }, 400, cors);
    }
    const token = await readField(req, 'token');
    return token ? revoke(token, env, cors) : json({ error: 'token_missing' }, 400, cors);
  },
};
