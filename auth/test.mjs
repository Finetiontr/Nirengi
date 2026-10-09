// Local checks for the auth worker: `node auth/test.mjs`. GitHub is never called;
// fetch is stubbed so the token exchange and revoke paths run offline.
import assert from 'node:assert/strict';
import worker from './worker.js';

const W = 'https://nirengi-auth.example.workers.dev';
const env = { GITHUB_CLIENT_ID: 'Iv1.test', GITHUB_CLIENT_SECRET: 'shh' };
const calls = [];
globalThis.fetch = async (url, init) => {
  calls.push({ url: String(url), init });
  if (String(url).includes('access_token')) return new Response(JSON.stringify({ access_token: 'gho_TEST' }));
  return new Response(null, { status: 204 });
};
const call = (path, init = {}, e = env) => worker.fetch(new Request(W + path, init), e);
const cookieOf = (res) => res.headers.get('Set-Cookie')?.split(';')[0].split('=').slice(1).join('=');

// health
assert.deepEqual(await (await call('/')).json(), { ok: true, configured: true });
assert.deepEqual(await (await call('/', {}, {})).json(), { ok: true, configured: false });

// login: allowlist
const back = 'https://finetiontr.github.io/Nirengi/kanit-bagla';
assert.equal((await call(`/login?return=${encodeURIComponent('https://evil.example/x')}`)).status, 400);
assert.equal((await call('/login')).status, 400);
let res = await call(`/login?return=${encodeURIComponent(back)}`);
assert.equal(res.status, 302);
const auth = new URL(res.headers.get('Location'));
assert.equal(auth.origin + auth.pathname, 'https://github.com/login/oauth/authorize');
assert.equal(auth.searchParams.get('client_id'), 'Iv1.test');
assert.equal(auth.searchParams.get('redirect_uri'), `${W}/callback`);
assert.equal(auth.searchParams.get('scope'), null);
assert.match(res.headers.get('Set-Cookie'), /HttpOnly; Secure; SameSite=Lax; Max-Age=600/);
const state = auth.searchParams.get('state');
const cookie = cookieOf(res);

// login without the secret: straight back with an error
res = await call(`/login?return=${encodeURIComponent('http://127.0.0.1:4321/kanit-bagla')}`, {}, {});
assert.equal(res.headers.get('Location'), 'http://127.0.0.1:4321/kanit-bagla#gh_error=config');

// callback: no cookie, bad state, denied, success
assert.equal((await call(`/callback?code=c&state=${state}`)).status, 400);
const withCookie = (q) => call(`/callback?${q}`, { headers: { Cookie: `nirengi_oauth=${cookie}` } });
assert.equal((await withCookie('code=c&state=nope')).headers.get('Location'), `${back}#gh_error=state`);
assert.equal((await withCookie(`error=access_denied&state=${state}`)).headers.get('Location'), `${back}#gh_error=denied`);
res = await withCookie(`code=c&state=${state}`);
assert.equal(res.headers.get('Location'), `${back}#gh_token=gho_TEST`);
assert.match(res.headers.get('Set-Cookie'), /Max-Age=0/);
const exchange = JSON.parse(calls.find((c) => c.url.includes('access_token')).init.body);
assert.equal(exchange.code, 'c');

// logout: CORS + revoke
assert.equal((await call('/logout', { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } })).status, 403);
res = await call('/logout', { method: 'OPTIONS', headers: { Origin: 'https://finetiontr.github.io' } });
assert.equal(res.status, 204);
assert.equal(res.headers.get('Access-Control-Allow-Origin'), 'https://finetiontr.github.io');
res = await call('/logout', { method: 'POST', headers: { Origin: 'http://localhost:4321', 'Content-Type': 'application/json' }, body: JSON.stringify({ token: 'gho_TEST' }) });
assert.equal(res.status, 204);
const revoke = calls.find((c) => c.init?.method === 'DELETE');
assert.equal(revoke.url, 'https://api.github.com/applications/Iv1.test/token');
assert.equal(JSON.parse(revoke.init.body).access_token, 'gho_TEST');

console.log('auth worker: all checks passed');
