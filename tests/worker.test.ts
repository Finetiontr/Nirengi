// The GitHub bridge in worker/index.ts, offline: fetch is stubbed, GitHub is never called.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { type Env } from '../worker/index.ts';

const API = 'https://nirengi-api.example.workers.dev';
const SITE = 'https://finetiontr.github.io';
const env: Env = { GITHUB_CLIENT_ID: 'Iv23test', GITHUB_CLIENT_SECRET: 'shh', ALLOWED_ORIGINS: `${SITE}, http://127.0.0.1:4321` };

type Call = { url: string; init?: RequestInit };
function stubGitHub(reply: (url: string) => Response) {
  const calls: Call[] = [];
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    return reply(String(url));
  }) as typeof fetch;
  return calls;
}

const post = (path: string, body: unknown, origin = SITE, e = env) =>
  worker.fetch(new Request(API + path, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }), e);

test('worker: health says whether GitHub is configured', async () => {
  assert.deepEqual(await (await worker.fetch(new Request(`${API}/`), env)).json(), { ok: true, github: true });
  assert.deepEqual(await (await worker.fetch(new Request(`${API}/`), {})).json(), { ok: true, github: false });
});

test('worker: only listed origins get an answer', async () => {
  stubGitHub(() => new Response('{}'));
  assert.equal((await post('/github/token', { code: 'x' }, 'https://evil.example')).status, 403);
  const pre = await worker.fetch(new Request(`${API}/github/token`, { method: 'OPTIONS', headers: { Origin: 'http://127.0.0.1:4321' } }), env);
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get('Access-Control-Allow-Origin'), 'http://127.0.0.1:4321');
});

test('worker: code becomes a token; the secret never leaves', async () => {
  const calls = stubGitHub(() => new Response(JSON.stringify({ access_token: 'ghu_TEST', expires_in: 28800, refresh_token: 'ghr_SECRET' })));
  const res = await post('/github/token', { code: 'abc' });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), SITE);
  const body = (await res.json()) as { token: string; expiresAt: string; refresh?: string };
  assert.equal(body.token, 'ghu_TEST');
  assert.ok(Date.parse(body.expiresAt) > Date.now());
  assert.ok(!JSON.stringify(body).includes('ghr_'), 'refresh token is not handed to the browser');
  assert.equal(calls[0].url, 'https://github.com/login/oauth/access_token');
  assert.deepEqual(JSON.parse(String(calls[0].init?.body)), { client_id: 'Iv23test', client_secret: 'shh', code: 'abc' });
});

test('worker: a used or expired code is reported plainly', async () => {
  stubGitHub(() => new Response(JSON.stringify({ error: 'bad_verification_code' })));
  const res = await post('/github/token', { code: 'old' });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'expired' });
  assert.equal((await post('/github/token', {})).status, 400);
});

test('worker: unconfigured worker refuses instead of calling GitHub', async () => {
  const calls = stubGitHub(() => new Response('{}'));
  const res = await post('/github/token', { code: 'abc' }, SITE, { ALLOWED_ORIGINS: SITE });
  assert.equal(res.status, 503);
  assert.equal(calls.length, 0);
});

test('worker: sign-out revokes the token with the app credentials', async () => {
  const calls = stubGitHub(() => new Response(null, { status: 204 }));
  const res = await post('/github/revoke', { token: 'ghu_TEST' });
  assert.equal(res.status, 204);
  assert.equal(calls[0].url, 'https://api.github.com/applications/Iv23test/token');
  assert.equal(calls[0].init?.method, 'DELETE');
  assert.equal(new Headers(calls[0].init?.headers).get('Authorization'), `Basic ${btoa('Iv23test:shh')}`);
});
