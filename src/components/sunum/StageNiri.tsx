// Niri on stage. A slide change never makes the room wait: the bubble stays up,
// gives a small pop and starts typing the new line at once, while Niri does a quick
// squash and half-turn (about 0.45 s). The new mood is on Niri's face from the first
// frame and stays there while the line types (no generic talking face in between, so
// a sad slide never flashes a grin); only the costume swaps at the edge-on moment. A full spin is kept for the Zirve close, and even that runs
// alongside the line. Fast key presses cancel the move in flight and land clean.
// Under reduced motion everything swaps instantly and the line is shown whole.

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAnimate, useReducedMotion } from 'framer-motion';
import Niri, { type Dir, type Mood } from '../ui/Niri';

export interface StageLine {
  key: string;
  mood: Mood;
  text: string;
  point?: Dir;
  gear?: number;
  turns?: 1 | 2;
  size: number;
  side: 'left' | 'right';
}

/** Typing pace: brisk, and never longer than this in total. */
const MS_PER_CHAR = 24;
const TYPE_CAP = 1100;
/** The first letters land while the bubble pops. */
const TYPE_DELAY = 40;

export default function StageNiri({ line }: { line: StageLine }) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const reduce = useReducedMotion();
  // Words and mood switch at once; the costume and size at the edge-on moment of the turn.
  const [worn, setWorn] = useState(line);
  const [said, setSaid] = useState(line);
  const [n, setN] = useState(Infinity);
  const [pop, setPop] = useState(0);
  const run = useRef(0);

  useEffect(() => {
    if (line.key === said.key && line.key === worn.key) return;
    const id = ++run.current;
    const alive = () => id === run.current;
    setSaid(line);
    setPop((p) => p + 1);
    const el = scope.current;
    if (!el || reduce) {
      setWorn(line);
      return;
    }
    (async () => {
      // Whatever was in flight, start the turn from where Niri is (no snap back).
      const spin = line.turns === 2;
      await animate(el, { scaleY: 0.88, scaleX: 1.07, y: 3, transformPerspective: 700 }, { duration: 0.08, ease: 'easeOut' });
      if (!alive()) return;
      await animate(el, { rotateY: 90, scaleY: 1.05, scaleX: 0.96, y: -16 }, { duration: 0.13, ease: [0.3, 0, 0.6, 1] });
      if (!alive()) return;
      setWorn(line);
      if (!spin) await animate(el, { rotateY: -90 }, { duration: 0 });
      if (!alive()) return;
      await animate(el, { rotateY: spin ? 360 : 0, y: 0, scaleY: 1, scaleX: 1 }, { duration: spin ? 0.42 : 0.24, ease: [0.2, 0.8, 0.3, 1.12] });
      if (!alive()) return;
      await animate(el, { rotateY: 0 }, { duration: 0 });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line.key]);

  // Type the line in as soon as it is said (before paint, so a whole line never flashes).
  useLayoutEffect(() => {
    if (reduce) {
      setN(Infinity);
      return;
    }
    const text = said.text;
    setN(0);
    const dur = Math.min(TYPE_CAP, text.length * MS_PER_CHAR);
    let raf = 0;
    const t0 = performance.now() + TYPE_DELAY;
    const tick = (t: number) => {
      const k = Math.max(0, Math.min(1, (t - t0) / dur));
      setN(k >= 1 ? Infinity : Math.max(1, Math.floor(text.length * k)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [said, reduce]);

  const left = said.side === 'left';
  return (
    <div className={`flex items-end gap-3 ${left ? 'flex-row-reverse' : ''}`}>
      <span ref={scope} className="inline-block will-change-transform">
        {/* No hover or click reactions on stage: they would put a passing face on Niri. */}
        <Niri mood={said.mood} point={said.point} size={worn.size} gear={worn.gear} react={false} cue="sahne" />
      </span>
      <div
        key={pop}
        className={`n-bubble relative mb-4 min-w-0 flex-1 rounded-[18px] border-2 border-line bg-bg px-4 py-3 ${pop ? 'stage-pop' : ''}`}
        data-in={pop ? undefined : ''}
        style={{ transformOrigin: `${left ? '100%' : '0'} calc(100% - 24px)` }}
      >
        <span
          className={`absolute bottom-4 h-4 w-4 rotate-45 bg-bg ${left ? '-right-[9px] border-r-2 border-t-2 border-line' : '-left-[9px] border-b-2 border-l-2 border-line'}`}
          aria-hidden="true"
        />
        <span className="block px-2 py-1 text-[29px] font-bold leading-[1.3] tracking-[-0.01em] text-ink">
          {n === Infinity ? (
            said.text
          ) : (
            <>
              <span aria-hidden="true">
                {said.text.slice(0, n)}
                <span className="invisible">{said.text.slice(n)}</span>
              </span>
              <span className="sr-only">{said.text}</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
