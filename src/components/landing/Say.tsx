// Niri speaking one line of the landing, in its own section, already dressed for it.
// `*word*` marks the words that matter. Once per page load, when the section is well in
// view (40% for a short settle), Niri eases its arm toward the section's focal point
// (CSS transitions in niri.css, no jump, no spin) while the bubble grows from its tail
// and types. Where Niri stands and points depends on the layout, so `wide` switches the
// side and the direction from a breakpoint up. A costume change from the parent (the
// genç chips) is a soft crossfade. The server markup (and no JS, and reduced motion)
// shows the finished pose and line at rest.

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Niri, { type Dir, type Mood } from '../ui/Niri';

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
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** A soft costume change: the old one fades out, the new one fades in. Returns what to show and its opacity. */
export function useCrossfade<T>(value: T, ms = 160): [T, number] {
  const [shown, setShown] = useState(value);
  const [on, setOn] = useState(true);
  useEffect(() => {
    if (value === shown) return;
    if (reduced()) return setShown(value);
    setOn(false);
    const t = window.setTimeout(() => {
      setShown(value);
      setOn(true);
    }, ms);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return [shown, on ? 1 : 0];
}

/** Typing: brisk per character, never longer than this in all. */
const CHAR_MS = 24;
const TYPE_CAP = 1100;
/** How much of the section must be in view, and for how long, before Niri points and talks. */
const SEEN = 0.4;
const SETTLE_MS = 120;

interface Stance {
  size: number;
  point: Dir;
  side: 'right' | 'left';
}

export default function Say({
  mood = 'point',
  text,
  gear,
  size = 84,
  point = 'down',
  side = 'right',
  wide,
  watch = 'section',
  className = '',
  children,
}: {
  /** The pose once Niri has entered (default: pointing at the section's focal point). */
  mood?: Mood;
  text: string;
  gear?: number;
  size?: number;
  /** Where the arm points (phones). */
  point?: Dir;
  /** Which side of Niri the bubble sits on (phones). */
  side?: 'right' | 'left';
  /** From `at` px up: Niri's size, aim and bubble side for the wide layout. */
  wide?: { at: number } & Partial<Stance>;
  /** The ancestor whose visibility starts the entrance (CSS selector). */
  watch?: string;
  className?: string;
  /** Extra content under the bubble (the costume chips). */
  children?: ReactNode;
}) {
  const narrow: Stance = { size, point, side };
  const [stance, setStance] = useState<Stance>(narrow);
  const [entered, setEntered] = useState(true);
  const [bubble, setBubble] = useState(true);
  const [n, setN] = useState(Infinity);
  const root = useRef<HTMLDivElement>(null);
  const typing = useRef(0);
  const [worn, fade] = useCrossfade(gear);

  // The wide stance follows the breakpoint.
  useIsoLayoutEffect(() => {
    if (!wide) return;
    const mq = matchMedia(`(min-width: ${wide.at}px)`);
    const pick = () => setStance(mq.matches ? { size: wide.size ?? size + 20, point: wide.point ?? point, side: wide.side ?? side } : narrow);
    pick();
    mq.addEventListener('change', pick);
    return () => mq.removeEventListener('change', pick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hydrated: stand at ease with the bubble held back until the section is in view.
  useIsoLayoutEffect(() => {
    if (reduced()) return;
    setEntered(false);
    setBubble(false);
    const el = root.current?.closest<HTMLElement>(watch) ?? root.current;
    if (!el) return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        // Out of view again before the settle ends: scrolling past, nothing happens.
        if (e.intersectionRatio < SEEN && e.intersectionRect.height < window.innerHeight * SEEN) {
          window.clearTimeout(t);
          t = 0;
          return;
        }
        if (t) return;
        t = window.setTimeout(() => {
          io.disconnect();
          setEntered(true);
          setBubble(true);
          const len = text.replaceAll('*', '').length;
          const dur = Math.min(TYPE_CAP, len * CHAR_MS);
          const t0 = performance.now() + 60;
          setN(0);
          const tick = (now: number) => {
            const p = Math.max(0, Math.min(1, (now - t0) / dur));
            setN(p >= 1 ? Infinity : Math.floor(len * p));
            if (p < 1) typing.current = requestAnimationFrame(tick);
          };
          typing.current = requestAnimationFrame(tick);
        }, SETTLE_MS);
      },
      { threshold: [0, 0.2, SEEN, 0.6, 0.8, 1] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
      cancelAnimationFrame(typing.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A new line from the parent (the chips) shows at once.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    cancelAnimationFrame(typing.current);
    setN(Infinity);
  }, [text]);

  const talking = n !== Infinity;
  const left = stance.side === 'left';
  return (
    <div ref={root} className={`flex items-end gap-3 ${left ? 'flex-row-reverse' : ''} ${className}`}>
      <span className="shrink-0 transition-opacity duration-150 ease-out" style={{ opacity: fade }}>
        <Niri mood={entered ? mood : 'idle'} size={stance.size} point={stance.point} gear={worn} />
      </span>
      <div className="mb-4 min-w-0 flex-1">
        <div
          className="say-bubble n-bubble relative rounded-[18px] border-2 border-line bg-bg px-4 py-3"
          data-in=""
          data-hide={bubble ? undefined : ''}
          style={{ transformOrigin: `${left ? '100%' : '0'} calc(100% - 24px)`, animationDelay: '0s' }}
        >
          <span
            className={`absolute bottom-4 h-4 w-4 rotate-45 bg-bg ${left ? '-right-[9px] border-r-2 border-t-2 border-line' : '-left-[9px] border-b-2 border-l-2 border-line'}`}
            aria-hidden="true"
          />
          <p className="text-[16px] font-semibold leading-snug text-ink-2">
            {talking ? (
              <>
                <span aria-hidden="true">{typed(text, n)}</span>
                <span className="sr-only">{text.replaceAll('*', '')}</span>
              </>
            ) : (
              emphasise(text)
            )}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
