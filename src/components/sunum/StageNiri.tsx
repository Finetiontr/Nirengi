// Niri on stage. Between slides Niri twirls into the next slide's mood and costume
// at a talking pace (about 1.2 s, slower than the app's NiriTwirl, so the room can
// follow it): the bubble steps back as the turn starts, and the new line grows in
// and types only once Niri has landed. A fast run of key presses skips the show and
// just swaps. Under reduced motion it is a short crossfade and no typing.

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

// The beats, in seconds: crouch, spring up to edge-on (the swap), land with the spin.
const CROUCH = 0.2;
const RISE = 0.36;
const LAND = 0.7;
/** The new bubble grows once the spin has settled. */
const LINE_DELAY = 80;
const TYPE_MS = 700;

const sleep = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

export default function StageNiri({ line }: { line: StageLine }) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const reduce = useReducedMotion();
  // What Niri wears and what the bubble says lag behind `line` until the turn allows.
  const [worn, setWorn] = useState(line);
  const [said, setSaid] = useState(line);
  const [out, setOut] = useState(false);
  const [n, setN] = useState(Infinity);
  const run = useRef(0);
  const busy = useRef(false);
  const born = useRef(0);
  useEffect(() => {
    born.current = performance.now();
  }, []);

  useEffect(() => {
    if (line.key === said.key && line.key === worn.key) return;
    const id = ++run.current;
    // Landing on a slide from the URL right after load: no show, just be there.
    if (performance.now() - born.current < 400) {
      setWorn(line);
      setSaid(line);
      return;
    }
    const el = scope.current;
    const alive = () => id === run.current;
    // Dropping data-out puts the grow-in animation back, so the bubble grows again.
    const speak = () => {
      setSaid(line);
      setOut(false);
    };
    (async () => {
      setOut(true);
      if (!el || reduce) {
        if (el) await animate(el, { opacity: 0 }, { duration: 0.12 });
        if (!alive()) return;
        setWorn(line);
        if (el) await animate(el, { opacity: 1 }, { duration: 0.18 });
        if (alive()) speak();
        return;
      }
      // Pressed again mid-turn: settle square and swap without the show.
      if (busy.current) {
        await animate(el, { rotateY: 0, y: 0, scaleX: 1, scaleY: 1 }, { duration: 0.14 });
        if (!alive()) return;
        setWorn(line);
        await sleep(160);
        if (alive()) speak();
        busy.current = false;
        return;
      }
      busy.current = true;
      await animate(el, { scaleY: 0.86, scaleX: 1.08, y: 4, transformPerspective: 700 }, { duration: CROUCH, ease: 'easeOut' });
      if (!alive()) return;
      await animate(el, { rotateY: 90, scaleY: 1.08, scaleX: 0.94, y: -34 }, { duration: RISE, ease: [0.3, 0, 0.6, 1] });
      if (!alive()) return;
      setWorn(line);
      await animate(el, { rotateY: 360 * (line.turns ?? 1), y: 0, scaleY: 1, scaleX: 1 }, { duration: LAND * (line.turns ?? 1), ease: [0.25, 0.6, 0.35, 1.1] });
      if (!alive()) return;
      await animate(el, { rotateY: 0 }, { duration: 0 });
      busy.current = false;
      await sleep(LINE_DELAY);
      if (alive()) speak();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line.key]);

  // Type the line in once it is said; the first line types too (before paint, so the
  // prerendered full line never flashes).
  useLayoutEffect(() => {
    if (reduce) {
      setN(Infinity);
      return;
    }
    const text = said.text;
    setN(0);
    const dur = Math.min(TYPE_MS, text.length * 20);
    let raf = 0;
    const t0 = performance.now() + 200;
    const tick = (t: number) => {
      const k = Math.max(0, Math.min(1, (t - t0) / dur));
      setN(k >= 1 ? Infinity : Math.floor(text.length * k));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [said, reduce]);

  const typing = n !== Infinity && !out;
  const left = worn.side === 'left';
  return (
    <div className={`flex items-end gap-3 ${left ? 'flex-row-reverse' : ''}`}>
      <span ref={scope} className="inline-block will-change-transform">
        <Niri mood={typing ? 'talk' : worn.mood} size={worn.size} point={worn.point} gear={worn.gear} cue="sahne" />
      </span>
      <div
        className="n-bubble stage-bubble relative mb-4 min-w-0 flex-1 rounded-[18px] border-2 border-line bg-bg px-4 py-3"
        data-in=""
        data-out={out ? '' : undefined}
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
