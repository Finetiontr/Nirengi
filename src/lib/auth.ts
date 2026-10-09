// "GitHub'da izin ver": the visitor creates a read-only, fine-grained access key on
// GitHub's own permission page, picking there exactly which repositories to show, and
// pastes it here. The site is static (GitHub Pages), so everything runs in the browser:
// the key stays in this browser, goes only to api.github.com, and is revoked at GitHub
// on "Çıkış yap".

import { actions } from './store.ts';
import { ghToken, TOKEN_KEY } from './verify.ts';

export const getToken = ghToken;

function setToken(t: string | null) {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode */
  }
}

/**
 * GitHub's "new fine-grained token" page with name, description and a 30-day expiry
 * filled in. Repository choice cannot be pre-filled: the visitor picks it there.
 * Token names must be unique per account, so the name carries the minute it was made.
 */
export function grantUrl() {
  const d = new Date();
  const two = (n: number) => String(n).padStart(2, '0');
  const q = new URLSearchParams({
    name: `Nirengi ${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())} ${two(d.getHours())}.${two(d.getMinutes())}`,
    description: 'Nirengi: seçtiğin depoları kurumlara doğrulanmış kanıt olarak göstermek için yalnız okuma izni. Anahtar yalnız senin tarayıcında durur; istediğin an buradan silebilirsin.',
    expires_in: '30',
  });
  return `https://github.com/settings/personal-access-tokens/new?${q}`;
}

/** A fine-grained key: limited to the repositories picked on GitHub. */
export const isGrantKey = (t: string) => /^github_pat_[A-Za-z0-9_]{30,}$/.test(t.trim());
/** A classic key reaches the whole account; we turn it away and ask for a fine-grained one. */
export const isClassicKey = (t: string) => /^gh[pousr]_[A-Za-z0-9]{20,}$/.test(t.trim());

export const saveToken = (t: string) => setToken(t.trim());

/** Drops the stored key without touching the profile (e.g. GitHub said it expired). */
export const forgetToken = () => setToken(null);

/**
 * Revokes the key at GitHub (best effort; the credential revocation endpoint takes it
 * without any other login) and forgets the connected account. The tab falls back to
 * the sample profile in place, so the page can say what happened.
 */
export function signOut() {
  const t = getToken();
  if (t)
    void fetch('https://api.github.com/credentials/revoke', {
      method: 'POST',
      headers: { Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ credentials: [t] }),
      keepalive: true,
    }).catch(() => undefined);
  setToken(null);
  actions.signOut();
}
