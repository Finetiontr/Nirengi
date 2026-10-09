// Bottom offset shared by the floating pieces at the foot of the app shell.

import { useEffect, useState } from 'react';

/**
 * Bottom offset in px. It sits above the deck, rises above the demo tour panel
 * when that is open, and steps aside while the feedback bar shows (all three are
 * found in the DOM and measured, so a fresh mount gets it right too).
 */
export function useLift() {
  const [bottom, setBottom] = useState(20);
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const deck = document.querySelector<HTMLElement>('.dock');
      let n = deck?.getClientRects().length ? innerHeight - deck.getBoundingClientRect().top + 10 : 20;
      const panel = document.querySelector('aside[aria-label="Demo turu"]');
      if (panel) {
        const r = panel.getBoundingClientRect();
        if (r.width > 0) n = Math.max(n, innerHeight - r.top + 12);
      }
      // The feedback bar is anchored to the bottom whatever its height or offset: clear its layout top.
      // On flow screens it hangs from the top instead and leaves the foot alone.
      const bar = document.querySelector<HTMLElement>('.feedback-dock');
      if (bar && bar.offsetHeight && !document.documentElement.hasAttribute('data-flow')) n = Math.max(n, innerHeight - bar.offsetTop + 12);
      setBottom(n);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });
    // The deck changes height when the Şimdi line tucks away.
    const ro = new ResizeObserver(schedule);
    const deck = document.querySelector('.dock');
    if (deck) ro.observe(deck);
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      mo.disconnect();
      ro.disconnect();
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return bottom;
}
