// "GitHub ile giriş yap": a real OAuth round trip through the nirengi-auth worker
// (auth/worker.js). The worker swaps GitHub's code for a token and sends the visitor
// back with #gh_token=… in the fragment. The token asks for no scopes: it proves the
// account is theirs and lifts GitHub's anonymous rate limit, nothing more.

import { actions } from './store.ts';
import { ghToken, TOKEN_KEY } from './verify.ts';

export const AUTH_URL: string = (import.meta.env.PUBLIC_AUTH_URL ?? '').replace(/\/+$/, '');
export const authReady = !!AUTH_URL;

export const getToken = ghToken;

function setToken(t: string | null) {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode */
  }
}

/** Path prefix the site is served under: '' locally, '/Nirengi' on GitHub Pages. */
export function basePath() {
  const p = location.pathname;
  return p === '/Nirengi' || p.startsWith('/Nirengi/') ? '/Nirengi' : '';
}

// Built from parts so the Pages build's path rewrite does not prefix them twice.
const pageUrl = (name: string) => `${location.origin}${basePath()}/${name}`;

export function signIn() {
  if (!authReady) return;
  location.assign(`${AUTH_URL}/login?return=${encodeURIComponent(pageUrl('kanit-bagla'))}`);
}

export type AuthReturn = { token: string } | { error: string } | null;

/** Reads what the worker put in the fragment, keeps the token and clears the address bar. */
export function consumeAuthHash(): AuthReturn {
  const h = new URLSearchParams(location.hash.slice(1));
  const token = h.get('gh_token');
  const error = h.get('gh_error');
  if (!token && !error) return null;
  history.replaceState(null, '', location.pathname + location.search);
  if (token) {
    setToken(token);
    return { token };
  }
  return { error: error! };
}

/** Drops the stored token without touching the profile (e.g. GitHub said it expired). */
export const forgetToken = () => setToken(null);

/**
 * Revokes the token (best effort) and forgets the connected account; the tab falls
 * back to the sample profile in place, so the page can say what happened.
 */
export function signOut() {
  const t = getToken();
  if (t && authReady)
    void fetch(`${AUTH_URL}/logout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: t }), keepalive: true }).catch(() => undefined);
  setToken(null);
  actions.signOut();
}
