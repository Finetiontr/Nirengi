// Niri speaking one line of the landing, in its own section. `*word*` marks the words
// that matter. Each section's Niri makes one calm entrance per page load: once the
// section is well in view (40% visible for a short settle, so scrolling past does
// nothing) Niri twirls into its costume at a readable pace, and only after it lands
// does the bubble grow and type. Later changes (the costume chips) queue the same way:
// one turn at a time, the bubble steps back at the turn and re-types after the landing.
// The server markup (and no JS, and reduced motion) shows the finished line at once.

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

/** What Niri shows; `pre` is the pose before the entrance (so even a plain Niri has a turn to make). */
type Scene = Omit<Line, 'key'> & { pre?: boolean };

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
const sceneKey = (s: Scene) => `${s.pre ? 'pre|' : ''}${s.gear ?? '-'}|${s.mood}|${s.text}`;

/** The landing's twirl pace (NiriTwirl `pace`): about 1.4 s from crouch to settled feet. */
export const PACE = 1.45;
/** When the turn itself starts (after the crouch): the bubble steps back then. */
const TURN_MS = 100 * PACE;
/** Typing: a calm pace per character, never longer than this in all. */
const CHAR_MS = 38;
const TYPE_CAP = 1600;
/** How much of the section must be in view, and for how long, before Niri enters. */
const SEEN = 0.4;
const SETTLE_MS = 250;

export default function Say({
  mood,
  text,
  gear,
  size = 84,
  wide = size + 20,
  point = 'down',
  side = 'right',
  from,
  turns = 1,
  watch,
  className = '',
  children,
}: {
  mood: Mood;
  text: string;
  gear?: number;
  size?: number;
  /** Niri's size from 1280px up. */
  wide?: number;
  point?: Dir;
  /** Which side of Niri the bubble sits on. */
  side?: 'right' | 'left';
  /** Costume Niri wears before its entrance (null = plain); unset = no entrance. */
  from?: number | null;
  turns?: 0 | 0.5 | 1 | 2;
  /** The element whose visibility starts the entrance (CSS selector of an ancestor); default Niri's own row. */
  watch?: string;
  className?: string;
  /** Extra content under the bubble (the costume chips). */
  children?: ReactNode;
}) {
  const target: Scene = { mood, text, gear };
  const entering = from !== undefined;

  // What Niri shows (the twirl heads here) and what the bubble says.
  const [niri, setNiri] = useState<Scene>(target);
  const [said, setSaid] = useState(text);
  const [bubble, setBubble] = useState(true);
  const [n, setN] = useState(Infinity);
  // Remounting the twirl (a new epoch) resets Niri without a spin.
  const [epoch, setEpoch] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const entered = useRef(!entering);
  const busy = useRef(false);
  const want = useRef(target);
  want.current = target;

  const [px, setPx] = useState(size);
  useIsoLayoutEffect(() => {
    if (matchMedia('(min-width: 1280px)').matches) setPx(wide);
  }, [wide]);

  // Hydrated: step back to the "before" pose, unseen, and wait for the section.
  useIsoLayoutEffect(() => {
    if (!entering || reduced()) {
      entered.current = true;
      return;
    }
    setNiri({ ...target, mood: 'idle', gear: from ?? undefined, pre: true });
    setBubble(false);
    setEpoch(1);
    const el = (watch && root.current?.closest<HTMLElement>(watch)) || root.current;
    if (!el) return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        const seen = e.intersectionRatio >= SEEN || e.intersectionRect.height >= window.innerHeight * SEEN;
        window.clearTimeout(t);
        if (!seen) return;
        t = window.setTimeout(() => {
          io.disconnect();
          entered.current = true;
          go(want.current);
        }, SETTLE_MS);
      },
      { threshold: [0, 0.2, SEEN, 0.6, 0.8, 1] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outTimer = useRef(0);
  const go = (s: Scene) => {
    busy.current = true;
    setNiri(s);
    window.clearTimeout(outTimer.current);
    outTimer.current = window.setTimeout(() => setBubble(false), TURN_MS);
  };

  // Niri has landed: the bubble grows with the new line and types; a queued scene goes next.
  const landed = () => {
    busy.current = false;
    window.clearTimeout(outTimer.current);
    const next = want.current;
    if (sceneKey(next) !== sceneKey(niri)) return go(next);
    setSaid(niri.text);
    setBubble(true);
    if (reduced()) return;
    const el = box.current;
    if (el) {
      el.removeAttribute('data-in');
      el.getBoundingClientRect();
      el.setAttribute('data-in', '');
    }
    const len = niri.text.replaceAll('*', '').length;
    setN(0);
    const dur = Math.min(TYPE_CAP, len * CHAR_MS);
    const t0 = performance.now() + 180;
    const tick = (now: number) => {
      const p = Math.max(0, Math.min(1, (now - t0) / dur));
      setN(p >= 1 ? Infinity : Math.floor(len * p));
      if (p < 1) typing.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(typing.current);
    typing.current = requestAnimationFrame(tick);
  };
  const typing = useRef(0);
  useEffect(() => () => cancelAnimationFrame(typing.current), []);

  // A new target from the parent (chips) after the entrance: one turn at a time.
  const key = sceneKey(target);
  useEffect(() => {
    if (!entered.current || busy.current || key === sceneKey(niri)) return;
    if (reduced()) {
      setNiri(target);
      setSaid(target.text);
      return;
    }
    cancelAnimationFrame(typing.current);
    setN(Infinity);
    go(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const talking = n !== Infinity;
  const left = side === 'left';
  return (
    <div ref={root} className={`flex items-end gap-3 ${left ? 'flex-row-reverse' : ''} ${className}`}>
      <NiriTwirl key={epoch} k={sceneKey(niri)} turns={turns} pace={PACE} onDone={landed}>
        <Niri mood={talking ? 'talk' : niri.mood} size={px} point={point} gear={niri.gear} />
      </NiriTwirl>
      <div className="mb-4 min-w-0 flex-1">
        <div
          ref={box}
          className="say-bubble n-bubble relative rounded-[18px] border-2 border-line bg-bg px-4 py-3"
          data-in=""
          data-hide={bubble ? undefined : ''}
          style={{ transformOrigin: `${left ? '100%' : '0'} calc(100% - 24px)` }}
        >
          <span
            className={`absolute bottom-4 h-4 w-4 rotate-45 bg-bg ${left ? '-right-[9px] border-r-2 border-t-2 border-line' : '-left-[9px] border-b-2 border-l-2 border-line'}`}
            aria-hidden="true"
          />
          <p className="text-[16px] font-semibold leading-snug text-ink-2">
            {talking ? (
              <>
                <span aria-hidden="true">{typed(said, n)}</span>
                <span className="sr-only">{said.replaceAll('*', '')}</span>
              </>
            ) : (
              emphasise(said)
            )}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
