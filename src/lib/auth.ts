/// <reference types="astro/client" />
// "GitHub'a bağlan": the visitor installs the Nirengi GitHub App and ticks, on GitHub's own
// install page, exactly which repositories (private ones too) institutions may see. GitHub
// sends them back with a one-time code; worker/ swaps it for a short-lived, read-only token
// that sees only those repositories. The token stays in this browser and is revoked on
// "Çıkış yap". Nobody types or pastes a key.

import { actions } from './store.ts';
import { ghToken, TOKEN_KEY } from './verify.ts';

/** The Nirengi GitHub App (public ids). Fixed with the app, whichever Cloudflare account runs the worker. */
const APP = { slug: 'nirengi360', clientId: 'Iv23litvWL33aCeVhOt5' };
/** worker/ address; set per deployment through the PUBLIC_API_URL build variable. */
const API = (import.meta.env.PUBLIC_API_URL ?? '').replace(/\/+$/, '');
const STATE_KEY = 'nirengi:gh-state';
const STATE_TTL = 15 * 60_000;

export const getToken = ghToken;
export const appReady = () => !!API && !!APP.clientId;

function setToken(t: string | null) {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode */
  }
}

export const forgetToken = () => setToken(null);

/** A one-time value that must come back from GitHub, so nobody can push their own account into this tab. */
function newState() {
  const s = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({ s, at: Date.now() }));
  } catch {
    /* private mode: the return will ask for a fresh sign-in */
  }
  return s;
}

function takeState(): string | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    localStorage.removeItem(STATE_KEY);
    const v = raw ? (JSON.parse(raw) as { s: string; at: number }) : null;
    return v && Date.now() - v.at < STATE_TTL ? v.s : null;
  } catch {
    return null;
  }
}

/** GitHub's install page: pick the account, then "All" or "Only select repositories". */
export const installUrl = () => `https://github.com/apps/${APP.slug}/installations/new?state=${newState()}`;

/** Already installed (another browser, or the token ran out): straight back, no questions on GitHub. */
export const signInUrl = () => `https://github.com/login/oauth/authorize?client_id=${APP.clientId}&state=${newState()}`;

/** Where the repository choice is changed later. */
export const manageUrl = () => `https://github.com/apps/${APP.slug}/installations/new`;

export type ReturnResult =
  | { kind: 'none' }
  | { kind: 'ok' }
  /** Back from GitHub without our state (e.g. installed from GitHub's own page): one sign-in finishes it. */
  | { kind: 'unverified' }
  /** An organisation owner still has to approve the install. */
  | { kind: 'requested' }
  | { kind: 'error'; reason: 'expired' | 'network' | 'config' | 'denied' };

/** Reads GitHub's redirect (?code&state&setup_action) once, cleans the address bar and connects. */
export async function completeReturn(): Promise<ReturnResult> {
  const q = new URLSearchParams(location.search);
  const code = q.get('code');
  const action = q.get('setup_action');
  const denied = q.get('error') === 'access_denied';
  if (!code && !action && !denied) return { kind: 'none' };
  history.replaceState(null, '', location.pathname + location.hash);
  if (denied) return { kind: 'error', reason: 'denied' };
  if (action === 'request') return { kind: 'requested' };
  const expected = takeState();
  if (!code || !expected || q.get('state') !== expected) return { kind: 'unverified' };
  if (!API) return { kind: 'error', reason: 'config' };
  try {
    const res = await fetch(`${API}/github/token`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
    const body = (await res.json()) as { token?: string; error?: string };
    if (!body.token) return { kind: 'error', reason: body.error === 'expired' ? 'expired' : body.error === 'config' ? 'config' : 'network' };
    setToken(body.token);
    return { kind: 'ok' };
  } catch {
    return { kind: 'error', reason: 'network' };
  }
}

/**
 * Revokes the token at GitHub (best effort) and forgets the connected account. The app stays
 * installed on GitHub until the visitor removes it there. The tab falls back to the sample
 * profile in place, so the page can say what happened.
 */
export function signOut() {
  const t = getToken();
  if (t && API)
    void fetch(`${API}/github/revoke`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: t }), keepalive: true }).catch(() => undefined);
  setToken(null);
  actions.signOut();
}
