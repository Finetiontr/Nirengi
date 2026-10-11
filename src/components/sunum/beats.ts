// Niri's bubbles move on by themselves while the team speaks: on entering a slide Niri turns and
// its first bubble types in; each bubble stays as long as the presenter takes to say its line at a
// calm pace plus a breath (timing.ts), then the next one comes. After a slide's last bubble Niri
// rests until the presenter moves on. Niri is silent; its mouth moves only while a bubble types in
// (the comic way of showing who speaks). P pauses and resumes the clock.

import { useCallback, useEffect, useRef, useState } from 'react';
import { NOTES } from './notes';
import { linesOf, paced, SLIDES } from './slides';
import { beatSec, TURN } from './timing';

/** How long a bubble takes to type in (StageNiri's pace): while it does, Niri's mouth moves. */
const typingSec = (text: string) => Math.min(1.1, text.length * 0.024);

export interface Beats {
  /** The bubble on stage. */
  k: number;
  /** A bubble is typing in: Niri's mouth moves. */
  talking: boolean;
  paused: boolean;
  /** P: pause or resume. */
  toggle: () => void;
}

/** Steps through slide `i`'s bubbles; `hold` keeps bubble `hold` up instead (a #n.k link, the export). */
export function useBeats(i: number, hold: number | null): Beats {
  // Beat and mouth belong to a slide: a render before the clock catches up never shows another slide's.
  const [beat, setBeat] = useState({ i, k: 0, talking: false });
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = false;
    setPaused(false);
    const k0 = hold ?? 0;
    const lines = linesOf(i);
    setBeat({ i, k: k0, talking: hold === null && paced(i) });
    if (hold !== null || !paced(i)) return;
    const says = NOTES[SLIDES[i].id].beats.map((b) => b.say);
    // Seconds counted while not paused, from entering the slide; when each bubble moves on.
    let k = 0;
    let t = 0;
    let due = TURN + beatSec(says[0]);
    let typed = typingSec(lines[0]);
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      if (!pausedRef.current) t += (now - last) / 1000;
      last = now;
      if (k + 1 < lines.length && t >= due) {
        k += 1;
        typed = t + typingSec(lines[k]);
        due = t + beatSec(says[k]);
        setBeat({ i, k, talking: true });
      } else if (t >= typed) setBeat((b) => (b.talking ? { ...b, talking: false } : b));
      if (k + 1 < lines.length || t < typed) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [i, hold]);

  const toggle = useCallback(() => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }, []);

  const mine = beat.i === i;
  return { k: mine ? beat.k : hold ?? 0, talking: mine && beat.talking && !paused, paused, toggle };
}
