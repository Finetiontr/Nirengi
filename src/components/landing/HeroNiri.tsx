// The hero's one orchestrated moment: Niri climbs the survey trail marker by marker,
// lands on the summit with a ripple and starts waving. Clicking Niri changes its line;
// hovering a door makes Niri comment on it.
//
// The climb hops from stop to stop in the sheet's own coordinates (the same px the
// markers are drawn in, inside the same scaled sheet), so every landing is exactly on
// a marker's tip at any width. The server markup stands on the summit; until the climb
// starts the climber, bubble and flag are hidden (with a failsafe in Hero.astro), and
// reduced motion shows the end pose at once.

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Niri, { type Mood } from '../ui/Niri';
import { emphasise } from './Say';

type Pt = [number, number];

const LINES = [
  'Merhaba, ben *Niri*! Bu sayfayı sana ben anlatacağım.',
  'Hihi, gıdıklandım! Üçgenim ama *köşelerim yumuşak*.',
  'Az önce dört noktadan geçip zirveye çıktım. *Sen de çıkabilirsin.*',
  'Bir kez daha dokunursan bayrağı ben dikerim. Şaka: *aşağı kaydır*, hikâye orada.',
];
const DOORS: Record<string, string> = {
  genc: 'Harika seçim! Seni *Bugün* ekranında bekliyorum.',
  kurum: 'Kurumlara kısa anlatırım: *gerekçeli liste, iki onaylı kayıt.*',
};

/** Niri's size at each stop: it grows as it nears the summit. */
const GROW = [0.5, 0.6, 0.7, 0.8, 1];
/** Where Niri's feet are in its box. */
const FEET = 0.9;
// One hop: crouch, fly, land, rest (ms).
const CROUCH = 80;
const FLY = 330;
const LAND = 130;
const REST = 170;

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function HeroNiri({ stops, size, sheet }: { stops: Pt[]; size: number; sheet: string }) {
  const [mood, setMood] = useState<Mood>('wave');
  const [line, setLine] = useState(0);
  const [door, setDoor] = useState<string | null>(null);
  const [cue, setCue] = useState<number | undefined>(undefined);
  const [landed, setLanded] = useState(true);
  const hold = useRef(0);
  const pos = useRef<HTMLDivElement>(null);
  const lift = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);

  const at = (i: number) => `translate(${stops[i][0] - size / 2}px, ${stops[i][1] - size * FEET}px)`;
  const grow = (i: number, sx = 1, sy = 1) => `scale(${GROW[i] * sx}, ${GROW[i] * sy})`;

  useIsoLayoutEffect(() => {
    const root = pos.current?.closest<HTMLElement>('[data-climb]');
    const p = pos.current;
    const l = lift.current;
    const b = body.current;
    if (!root || !p || !l || !b) return;
    const end = () => {
      root.setAttribute('data-go', '');
      root.setAttribute('data-landed', '');
      root.querySelector('.hero-flag')?.classList.add('c-flag');
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      end();
      return;
    }
    const marks = [...root.querySelectorAll<HTMLElement>('[data-mark] > *')];
    let stop = false;
    const run: Animation[] = [];
    const go = (el: HTMLElement, k: Keyframe[], o: KeyframeAnimationOptions) => {
      const a = el.animate(k, { fill: 'forwards', ...o });
      run.push(a);
      return a.finished;
    };
    const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

    setLanded(false);
    setMood('idle');
    p.style.transform = at(0);
    p.style.opacity = '0';
    b.style.transform = grow(0);
    root.setAttribute('data-go', '');

    (async () => {
      try {
        // Start once the first marker has popped in.
        await wait(Math.max(0, 450 - performance.now()));
        await go(p, [{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
        for (let i = 0; i < stops.length - 1 && !stop; i++) {
          await go(b, [{ transform: grow(i) }, { transform: grow(i, 1.12, 0.84) }], { duration: CROUCH, easing: 'ease-out' });
          const h = 34 + Math.abs(stops[i + 1][1] - stops[i][1]) * 0.5;
          await Promise.all([
            go(p, [{ transform: at(i) }, { transform: at(i + 1) }], { duration: FLY, easing: 'cubic-bezier(0.35, 0, 0.65, 1)' }),
            go(
              l,
              [
                { transform: 'translateY(0)', easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)' },
                { transform: `translateY(-${h}px)`, easing: 'cubic-bezier(0.6, 0, 0.8, 0.4)' },
                { transform: 'translateY(0)' },
              ],
              { duration: FLY },
            ),
            go(b, [{ transform: grow(i, 1.12, 0.84) }, { transform: grow(i, 0.92, 1.1), offset: 0.3 }, { transform: grow(i + 1, 0.96, 1.04), offset: 0.85 }, { transform: grow(i + 1, 1.14, 0.84) }], { duration: FLY }),
          ]);
          // The marker takes the weight.
          marks[i + 1]?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.1, 0.86)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'ease-out' });
          await go(b, [{ transform: grow(i + 1, 1.14, 0.84) }, { transform: grow(i + 1, 0.98, 1.03), offset: 0.6 }, { transform: grow(i + 1) }], { duration: LAND, easing: 'ease-out' });
          if (i < stops.length - 2) await wait(REST);
        }
      } catch {
        // Cancelled (unmounted): fall through to the end pose.
      }
      if (stop) return;
      end();
      setLanded(true);
      setMood('wave');
      setCue(1);
    })();
    return () => {
      stop = true;
      for (const a of run) a.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The two doors: Niri comments on whichever one the visitor is about to take.
  useEffect(() => {
    const doors = [...document.querySelectorAll<HTMLElement>('[data-door]')];
    const on = (e: Event) => setDoor((e.currentTarget as HTMLElement).dataset.door ?? null);
    const off = () => setDoor(null);
    for (const d of doors) {
      d.addEventListener('pointerenter', on);
      d.addEventListener('focus', on);
      d.addEventListener('pointerleave', off);
      d.addEventListener('blur', off);
    }
    return () => {
      for (const d of doors) {
        d.removeEventListener('pointerenter', on);
        d.removeEventListener('focus', on);
        d.removeEventListener('pointerleave', off);
        d.removeEventListener('blur', off);
      }
    };
  }, []);

  useEffect(() => () => window.clearTimeout(hold.current), []);

  const poke = () => {
    setDoor(null);
    setLine((i) => (i + 1 < LINES.length ? i + 1 : 1));
    setMood('happy');
    window.clearTimeout(hold.current);
    hold.current = window.setTimeout(() => setMood('wave'), 1400);
  };

  const text = door ? DOORS[door] : LINES[line];
  const shown: Mood = !landed ? mood : door ? (door === 'genc' ? 'cheer' : 'point') : mood;
  const last = stops.length - 1;
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className={`absolute left-0 top-0 origin-top-left ${sheet}`} style={{ width: 500, height: 420 }}>
        <div ref={pos} className="hero-climber absolute left-0 top-0" style={{ width: size, height: size, transform: at(last) }}>
          <div ref={lift}>
            <div ref={body} style={{ transformOrigin: `50% ${FEET * 100}%` }}>
              <button type="button" onClick={poke} className="pointer-events-auto block rounded-full" aria-label="Niri’ye dokun">
                <Niri mood={shown} size={size} point="left" cue={cue} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Niri's words, drawn at reading size (outside the scaled sheet). */}
      {landed && (
        <div className="hero-bubble pop absolute left-0 top-1 w-[48%]">
          <p
            key={text}
            aria-live="polite"
            className="n-bubble relative rounded-[16px] border-2 border-line bg-bg px-3 py-2 text-[14px] font-semibold leading-snug text-ink-2 sm:text-[15px]"
            data-in=""
            style={{ transformOrigin: '100% 50%' }}
          >
            <span className="absolute -right-[9px] top-[44%] h-4 w-4 rotate-45 border-r-2 border-t-2 border-line bg-bg" aria-hidden="true" />
            {emphasise(text)}
          </p>
        </div>
      )}
    </div>
  );
}
