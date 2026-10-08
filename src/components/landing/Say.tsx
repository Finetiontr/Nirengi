// Niri speaking one line of the landing. `*word*` marks the words that matter.
// The same line feeds the inline bubble (phones, no JS) and the sticky narrator.
// Niri never cuts from one line to the next: it twirls (NiriTwirl), comes back in the
// new mood and costume, and the bubble re-types once the turn has landed.

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Niri, { type Dir, type Mood } from '../ui/Niri';
import NiriTwirl from '../ui/NiriTwirl';

export interface Line {
  key: string;
  mood: Mood;
  text: string;
  /** League costume (genç side); unset = plain Niri. */
  gear?: number;
}

export const emphasise = (text: string): ReactNode[] => text.split('*').map((t, i) => (i % 2 ? <b key={i}>{t}</b> : t));

/** The first `n` characters of a `*marked*` line; the rest keeps its space but stays invisible. */
function typed(text: string, n: number): ReactNode[] {
  let left = n;
  return text.split('*').map((t, i) => {
    const shown = Math.max(0, Math.min(t.length, left));
    left -= shown;
    const body = (
      <>
        {t.slice(0, shown)}
        {shown < t.length && <span className="invisible">{t.slice(shown)}</span>}
      </>
    );
    return i % 2 ? <b key={i}>{body}</b> : <span key={i}>{body}</span>;
  });
}

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
// NiriTwirl's beats: a 100 ms crouch, then the turn (200 ms to edge-on, then a 460 ms
// eased spin that is visually down by about half way).
/** The turn starts: the bubble steps back. */
const TURN_MS = 100;
/** Niri has landed: the new line grows in and types. */
const LAND_MS = 600;
const TYPE_MS = 600;

export default function Say({
  mood,
  text,
  gear,
  size = 84,
  point = 'down',
  side = 'right',
  stack = false,
  from,
  turns = 1,
  twirlKey,
  className = '',
}: {
  mood: Mood;
  text: string;
  gear?: number;
  size?: number;
  point?: Dir;
  /** Bubble beside Niri (default) or, with `stack`, above it. */
  side?: 'right' | 'left';
  stack?: boolean;
  /** Costume to start in; once hydrated Niri twirls from it into `gear` (an inline section's entrance). */
  from?: number | null;
  turns?: 0.5 | 1 | 2;
  /** Changing it twirls Niri even when the line is the same (the narrator re-appearing). */
  twirlKey?: string | number;
  className?: string;
}) {
  // What is on screen: the entrance starts in `from`, then the line's own costume.
  const entering = from !== undefined;
  const [arrived, setArrived] = useState(!entering);
  const shownGear = arrived ? gear : (from ?? undefined);
  const k = `${twirlKey ?? ''}|${arrived ? text : 'from'}|${shownGear ?? '-'}`;

  useEffect(() => {
    if (!entering) return;
    const t = window.setTimeout(() => setArrived(true), reduced() ? 0 : 280);
    return () => window.clearTimeout(t);
  }, [entering]);

  // The bubble keeps the old words until Niri starts to turn, then waits for the landing
  // to grow again with the new line and type it.
  const [said, setSaid] = useState(text);
  const [n, setN] = useState(Infinity);
  const bubble = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (text === said) return;
    const el = bubble.current;
    const now = reduced();
    const out = window.setTimeout(() => {
      el?.removeAttribute('data-in');
      el?.setAttribute('data-out', '');
    }, now ? 0 : TURN_MS);
    const t = window.setTimeout(() => {
      setSaid(text);
      if (el) {
        el.removeAttribute('data-out');
        el.removeAttribute('data-in');
        el.getBoundingClientRect();
        el.setAttribute('data-in', '');
      }
    }, now ? 0 : LAND_MS);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Typing runs for every new line after the first paint (the server markup stays fully shown).
  const seen = useRef(said);
  useEffect(() => {
    if (seen.current === said || reduced()) return;
    seen.current = said;
    setN(0);
    const dur = Math.min(TYPE_MS, said.length * 18);
    let raf = 0;
    const t0 = performance.now() + 120;
    const tick = (t: number) => {
      const p = Math.max(0, Math.min(1, (t - t0) / dur));
      setN(p >= 1 ? Infinity : Math.floor(said.replaceAll('*', '').length * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [said]);

  const typing = n !== Infinity;
  const left = side === 'left';
  const tail = stack
    ? 'left-[38px] -bottom-[9px] border-b-2 border-r-2 border-line'
    : left
      ? 'bottom-4 -right-[9px] border-r-2 border-t-2 border-line'
      : 'bottom-4 -left-[9px] border-b-2 border-l-2 border-line';
  return (
    <div className={`flex ${stack ? 'flex-col items-start gap-4' : `items-end gap-3 ${left ? 'flex-row-reverse' : ''}`} ${className}`}>
      <NiriTwirl k={k} turns={turns} className={stack ? 'order-last ml-2' : ''}>
        <Niri mood={typing ? 'talk' : mood} size={size} point={point} gear={shownGear} />
      </NiriTwirl>
      <div
        ref={bubble}
        className={`say-bubble n-bubble relative min-w-0 rounded-[18px] border-2 border-line bg-bg px-4 py-3 ${stack ? 'w-full' : 'mb-4 flex-1'}`}
        data-in=""
        style={{ transformOrigin: stack ? '50px 100%' : `${left ? '100%' : '0'} calc(100% - 24px)` }}
      >
        <span className={`absolute h-4 w-4 rotate-45 bg-bg ${tail}`} aria-hidden="true" />
        <p className="text-[16px] font-semibold leading-snug text-ink-2">
          {typing ? (
            <>
              <span aria-hidden="true">{typed(said, n)}</span>
              <span className="sr-only">{said.replaceAll('*', '')}</span>
            </>
          ) : (
            emphasise(said)
          )}
        </p>
      </div>
    </div>
  );
}
