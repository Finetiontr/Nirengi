// Niri turns around and comes back changed: a hop with a spin on the vertical axis,
// and the swap happens edge-on (at 90°), so a new mood, line or costume reads as a
// transformation instead of a cut. Under reduced motion it is a short crossfade.
//
//   <NiriTwirl k={`${scene}-${gear}`}><Niri mood={mood} gear={gear} /></NiriTwirl>

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useAnimate, useReducedMotion } from 'framer-motion';

interface Props {
  /** Change this to trigger the twirl; the children switch at the turn. Same key = live pass-through. */
  k: string | number;
  children: ReactNode;
  /** Full turns: 1 = one spin (default), 0.5 = a quick flip, 2 = a showy double. */
  turns?: 0.5 | 1 | 2;
  className?: string;
}

export default function NiriTwirl({ k, children, turns = 1, className = '' }: Props) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const reduce = useReducedMotion();
  // The key whose children are on screen; until the turn reaches 90° the old ones stay.
  const [at, setAt] = useState(k);
  const held = useRef(children);
  if (at === k) held.current = children;
  const run = useRef(0);

  useEffect(() => {
    const id = ++run.current;
    if (k === at) {
      // Back to the key on screen before the turn finished: settle where we are.
      if (scope.current) animate(scope.current, { rotateY: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 }, { duration: 0.15 });
      return;
    }
    const el = scope.current;
    if (!el) return setAt(k);
    (async () => {
      // A new key mid-turn: unwind to the nearest whole turn so the next spin starts square.
      const r = Number(el.style.transform.match(/rotateY\((-?[\d.]+)deg\)/)?.[1] ?? 0) % 360;
      if (r) animate(el, { rotateY: r > 180 ? r - 360 : r }, { duration: 0 });
      if (reduce) {
        await animate(el, { opacity: 0 }, { duration: 0.12 });
        if (id !== run.current) return;
        setAt(k);
        await animate(el, { opacity: 1 }, { duration: 0.18 });
        return;
      }
      // Crouch, spring up while turning edge-on, swap, land with a little overshoot.
      await animate(el, { scaleY: 0.86, scaleX: 1.08, y: 4, transformPerspective: 600 }, { duration: 0.1, ease: 'easeOut' });
      if (id !== run.current) return;
      await animate(el, { rotateY: 90, scaleY: 1.08, scaleX: 0.94, y: -26 }, { duration: 0.2, ease: [0.3, 0, 0.6, 1] });
      if (id !== run.current) return;
      setAt(k);
      // A half turn would land mirrored at 180°: come back in from the other edge instead.
      if (turns === 0.5) await animate(el, { rotateY: -90 }, { duration: 0 });
      await animate(el, { rotateY: turns === 0.5 ? 0 : 360 * turns, y: 0, scaleY: 1, scaleX: 1 }, { duration: 0.46, ease: [0.2, 0.9, 0.3, 1.2] });
      if (id !== run.current) return;
      await animate(el, { rotateY: 0 }, { duration: 0 });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k]);

  return (
    <span ref={scope} className={`inline-block will-change-transform ${className}`}>
      {at === k ? children : held.current}
    </span>
  );
}
