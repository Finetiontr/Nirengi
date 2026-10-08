// A stage Niri that arrives changed: it shows `from` (plain by default) and, once its
// section is well in view (40% for a short settle), makes one calm twirl into its
// costume. Once per page load, never while the hero is still climbing; the server
// markup already wears the costume. Used where Niri stands alone on a drawing (the
// "who" sheet, watched by `watch`).

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Niri, { type Mood } from '../ui/Niri';
import NiriTwirl from '../ui/NiriTwirl';
import { PACE } from './Say';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function TwirlIn({
  mood,
  size,
  gear,
  from = null,
  turns = 1,
  watch = 'section',
}: {
  mood: Mood;
  size: number;
  gear: number;
  from?: number | null;
  turns?: 0 | 0.5 | 1 | 2;
  watch?: string;
}) {
  // 2 = dressed (server markup), 0 = waiting in `from` (no spin to get there), 1 = twirled in.
  const [stage, setStage] = useState(2);
  const root = useRef<HTMLSpanElement>(null);
  useIsoLayoutEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setStage(0);
    const el = root.current?.closest(watch);
    if (!el) return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        window.clearTimeout(t);
        if (e.intersectionRatio < 0.4 && e.intersectionRect.height < window.innerHeight * 0.4) return;
        const enter = () => {
          // The hero's climb is the page's first moment: wait for it to land.
          const hero = document.querySelector('[data-climb]');
          if (hero && !hero.hasAttribute('data-landed')) return (t = window.setTimeout(enter, 300));
          io.disconnect();
          setStage(1);
        };
        t = window.setTimeout(enter, 250);
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);
  return (
    <span ref={root} className="block w-full">
      <NiriTwirl key={stage === 2 ? 'ssr' : 'live'} k={stage} turns={turns} pace={PACE} className="!block w-full">
        <Niri mood={mood} size={size} gear={stage === 0 ? (from ?? undefined) : gear} />
      </NiriTwirl>
    </span>
  );
}
