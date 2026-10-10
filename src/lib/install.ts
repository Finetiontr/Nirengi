// Installing nirengi as an app. Where the browser offers its own install prompt (Chrome, Edge
// and Samsung Internet on Android, Chrome and Edge on a computer) the key raises it; where it
// does not (iPhone and iPad, browsers inside other apps, other menus) the key opens written
// steps; once nirengi runs from the home screen there is nothing to install. The prompt is
// caught in the page head (components/shell/Pwa.astro) before any island mounts.

import { useSyncExternalStore } from 'react';

/** app: running from the home screen; done: installed from this page just now. */
export type InstallWay = 'app' | 'done' | 'prompt' | 'ios' | 'inapp' | 'menu' | 'desktop';

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    __bip?: InstallPrompt | null;
    __installed?: boolean;
  }
}

/** Browsers inside other apps (Instagram, LinkedIn, TikTok…) cannot install; the page must open in the real browser first. */
const IN_APP = /FBAN|FBAV|Instagram|LinkedInApp|TikTok|musical_ly|Twitter|Snapchat|Pinterest|Line\/|GSA\//;

/** How this browser installs, from its user agent and what it has offered so far. */
export function installWay(ua: string, env: { standalone: boolean; installed?: boolean; prompt: boolean; touch: boolean }): InstallWay {
  if (env.standalone) return 'app';
  if (env.installed) return 'done';
  if (IN_APP.test(ua)) return 'inapp';
  if (env.prompt) return 'prompt';
  // iPadOS reports itself as a Mac; a touch screen gives it away.
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && env.touch)) return 'ios';
  if (/Android|Mobi/.test(ua)) return 'menu';
  return 'desktop';
}

export const isStandalone = () =>
  typeof window !== 'undefined' &&
  (matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);

const current = (): InstallWay =>
  installWay(navigator.userAgent, { standalone: isStandalone(), installed: !!window.__installed, prompt: !!window.__bip, touch: navigator.maxTouchPoints > 1 });

function subscribe(fire: () => void) {
  const mq = matchMedia('(display-mode: standalone)');
  addEventListener('nirengi:install', fire);
  mq.addEventListener('change', fire);
  return () => {
    removeEventListener('nirengi:install', fire);
    mq.removeEventListener('change', fire);
  };
}

/** The way this browser installs; 'desktop' before the page is hydrated. */
export function useInstallWay(): InstallWay {
  return useSyncExternalStore(subscribe, current, () => 'desktop');
}

/** Raise the browser's own prompt. Returns what the person chose, or null when there is no prompt to raise. */
export async function promptInstall(): Promise<'accepted' | 'dismissed' | null> {
  const p = window.__bip;
  if (!p) return null;
  // A prompt can be shown once; the browser offers a new one later if the person said no.
  window.__bip = null;
  dispatchEvent(new Event('nirengi:install'));
  await p.prompt();
  return (await p.userChoice).outcome;
}
