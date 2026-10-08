// Niri: the nirengi point as a character. A small survey-marker triangle that
// guides, reacts and celebrates. Pure SVG; the motion lives in niri.css and the
// few things CSS cannot do (random blinks, cursor gaze, event reactions) here.
// Every mood has a finished static pose, which is what reduced motion shows.

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import './niri.css';

export type Mood = 'idle' | 'happy' | 'cheer' | 'think' | 'wave' | 'sad' | 'point' | 'talk' | 'sleep';
export type Dir = 'left' | 'right' | 'up' | 'down';
export type Look = 'cursor' | Dir;

interface Props {
  mood?: Mood;
  size?: number;
  className?: string;
  /** Where the pupils go. 'cursor' follows the pointer (desktop); unset = the mood's own gaze. */
  look?: Look;
  /** Arm direction for mood 'point'. */
  point?: Dir;
  /** Reacts to feedback events, hover and click. Default: on from 64px up. */
  react?: boolean;
  /** Plays an entrance hop with a ground ripple on mount and whenever this value changes. */
  cue?: string | number;
  /** League costume, by tier index (TIERS in engine/progress.ts). Genç side only; unset = no costume. */
  gear?: number;
}

const c = (v: string) => `rgb(var(--${v}))`;
// The face is the same dark in both themes, so it is not a theme token.
const INK = 'rgb(37 35 56)';

// ---------------------------------------------------------------- arms

interface Arm {
  x: number;
  y: number;
  /** Degrees from hanging straight down; positive swings the left arm outward and up. */
  a: number;
  len: number;
}

const mirror = (l: Arm): Arm => ({ ...l, x: 120 - l.x, a: -l.a });
const pair = (l: Arm): [Arm, Arm] => [l, mirror(l)];
const HANG: [Arm, Arm] = pair({ x: 30, y: 74, a: 35, len: 17 });

function armsFor(mood: Mood, point: Dir): [Arm, Arm] {
  switch (mood) {
    case 'happy':
      return pair({ x: 30, y: 73, a: 50, len: 17 });
    case 'cheer':
      return pair({ x: 30, y: 66, a: 141, len: 25 });
    case 'wave':
      return [HANG[0], { x: 90, y: 66, a: -139, len: 21 }];
    case 'think':
      return [{ x: 30, y: 76, a: 24, len: 16 }, { x: 90, y: 72, a: -66, len: 18 }];
    case 'talk':
      return [{ x: 30, y: 74, a: 40, len: 17 }, { x: 90, y: 72, a: -55, len: 19 }];
    case 'sad':
      return pair({ x: 30, y: 77, a: 13, len: 16 });
    case 'sleep':
      return pair({ x: 30, y: 78, a: 20, len: 16 });
    case 'point':
      if (point === 'left') return [{ x: 30, y: 70, a: 92, len: 27 }, HANG[1]];
      if (point === 'up') return [HANG[0], { x: 90, y: 66, a: -166, len: 28 }];
      if (point === 'down') return [HANG[0], { x: 90, y: 74, a: -66, len: 30 }];
      return [HANG[0], { x: 90, y: 70, a: -92, len: 27 }];
    default:
      return HANG;
  }
}

function ArmShape({ arm, side, pointing, held }: { arm: Arm; side: 'l' | 'r'; pointing: boolean; held?: ReactNode }) {
  return (
    <g
      className={`n-arm n-arm-${side}${pointing ? ' n-arm-p' : ''}`}
      style={{ transform: `translate(${arm.x}px, ${arm.y}px) rotate(${arm.a}deg)`, '--len': arm.len } as CSSProperties}
    >
      <g className="n-arm-fx">
        <rect className="n-arm-seg" x="-4.5" y="0" width="9" height="17" fill={c('indigo')} />
        <circle r="4.5" fill={c('indigo')} />
        {/* the hand undoes the arm's angle, so a held tool stays upright in every pose */}
        {held && (
          <g className="n-held" style={{ transform: `translate(0px, ${arm.len}px) rotate(${-arm.a}deg)` }}>
            {held}
          </g>
        )}
        <circle className="n-arm-tip" cy="17" r="4.5" fill={c('indigo')} />
      </g>
    </g>
  );
}

// ---------------------------------------------------------------- gear

// One costume per league tier, all from the survey field: a flagging ribbon,
// a field hat, a bandana with a rolled map sheet, a helmet with the ranging
// pole, goggles with the summit flag. Headgear sits on the tip of the
// triangle and is drawn over the face; Pack is drawn behind the body; a Tool is
// held in the left hand, drawn around the hand's centre.

const PAPER = 'rgb(255 248 228)';

function Headgear({ gear }: { gear: number }) {
  switch (gear) {
    case 0: // Zemin: the orange flagging ribbon that marks a point, tied round the tip
      return (
        <g className="n-gear" strokeLinejoin="round" strokeLinecap="round">
          <g className="n-flutter" style={{ transformOrigin: '60px 22px' }} fill="none" stroke={c('orange-lip')} strokeWidth="4.6">
            <path d="M58 24 50.5 36" />
            <path d="M62 24 70.5 35" />
          </g>
          <g fill={c('orange')} stroke={c('orange')} strokeWidth="3.6">
            <path d="M60 22 43.5 13 44.5 30.5Z" />
            <path d="M60 22 76.5 13 75.5 30.5Z" />
          </g>
          <path d="M58 21.5 47 16.5M62 21.5 73 16.5" stroke={c('orange-lip')} strokeWidth="2" opacity=".55" />
          <circle cx="60" cy="22" r="5" fill={c('orange-lip')} />
        </g>
      );
    case 1: // Tepe: a field hat with a wide brim
      return (
        <g className="n-gear">
          <path d="M42.5 33C41 8 44 3 60 3s19 5 17.5 30Z" fill={c('green')} />
          <path d="M42 25h36v7.5H42Z" fill={c('green-lip')} />
          <path d="M60 23 64.8 31h-9.6Z" fill={c('orange')} stroke={c('orange')} strokeWidth="1.8" strokeLinejoin="round" />
          <ellipse cx="60" cy="33.5" rx="32" ry="5.8" fill={c('green')} />
          <path d="M29.5 33.5q30.5 6 61 0" fill="none" stroke={c('green-lip')} strokeWidth="2.2" strokeLinecap="round" opacity=".7" />
          <path d="M50 7.5q-4.5 5-5 13" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" opacity=".35" />
        </g>
      );
    case 2: // Sırt: a bandana, knotted at the side with the tails in the wind
      return (
        <g className="n-gear" strokeLinejoin="round" strokeLinecap="round">
          <g className="n-flutter" style={{ transformOrigin: '38px 32px' }} fill={c('cyan')} stroke={c('cyan')} strokeWidth="3">
            <path d="M38 31 23 23.5 24.5 32.5Z" />
            <path d="M38 33 25 39.5 29.5 44Z" />
          </g>
          <path d="M43 25h34l5.2 12H37.8Z" fill={c('cyan')} stroke={c('cyan')} strokeWidth="3" />
          <g fill="#fff" opacity=".85">
            {[49, 60, 71].map((x) => (
              <path key={x} d={`M${x} 28.2l2.8 4.8h-5.6Z`} />
            ))}
          </g>
          <circle cx="38" cy="32" r="4.6" fill={c('cyan-lip')} />
        </g>
      );
    case 3: // Doruk: a climbing helmet with a head lamp
      return (
        <g className="n-gear">
          <path d="M38.5 36C36-6 84-6 81.5 36Z" fill={c('purple')} />
          <path d="M50 8.5q-6 6.5-7 16" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".35" />
          <path d="M37 35.5h46" stroke={c('purple-lip')} strokeWidth="6" strokeLinecap="round" />
          <circle className="n-lamp" cx="60" cy="23" r="6.6" fill={c('gold')} stroke={c('gold-lip')} strokeWidth="2.4" />
          <circle cx="58.4" cy="21.4" r="2.1" fill="#fff" opacity=".9" />
        </g>
      );
    case 4: // Zirve: snow goggles pushed up onto the forehead
      return (
        <g className="n-gear">
          <path d="M39.5 33.5h41" stroke={INK} strokeWidth="4.4" strokeLinecap="round" />
          <path d="M56 32h8" stroke={c('gold-lip')} strokeWidth="4.4" strokeLinecap="round" />
          {[50, 70].map((x) => (
            <g key={x}>
              <circle cx={x} cy="32" r="8" fill={c('cyan')} stroke={c('gold')} strokeWidth="3.6" />
              <path d={`M${x - 4.2} ${31}a4.6 4.6 0 0 1 4-3.6`} fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" opacity=".9" />
            </g>
          ))}
        </g>
      );
    default:
      return null;
  }
}

/** Sırt: a rolled map sheet (pafta) strapped on the back, poking out past the shoulder. */
function Pack({ gear }: { gear: number }) {
  if (gear !== 2) return null;
  return (
    <g className="n-gear" transform="rotate(36 86 46)">
      <rect x="79" y="10" width="14" height="56" rx="7" fill={PAPER} stroke="rgb(214 196 150)" strokeWidth="1.6" />
      <path d="M82.5 27q3.5-3 7 0M82.5 31q3.5-3 7 0" fill="none" stroke={c('orange')} strokeWidth="1.4" strokeLinecap="round" opacity=".8" />
      <ellipse cx="86" cy="11.5" rx="7" ry="3.2" fill="rgb(240 226 190)" stroke="rgb(214 196 150)" strokeWidth="1.4" />
      <path d="M86 11.5h3" stroke="rgb(180 160 110)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M79.5 20h13M79.5 40h13" stroke={c('cyan-lip')} strokeWidth="4.2" />
    </g>
  );
}

function Tool({ gear }: { gear: number }) {
  switch (gear) {
    case 3: // the ranging pole, red and white like the real thing
      return (
        <g className="n-gear">
          <path d="M-2.4 18 0 25 2.4 18Z" fill={c('ink-4')} />
          <rect x="-2.6" y="-60" width="5.2" height="79" rx="2" fill={c('red')} stroke={c('red-lip')} strokeWidth="1.2" />
          {[-50, -30, -10, 10].map((y) => (
            <rect key={y} x="-2" y={y} width="4" height="10" fill="#fff" />
          ))}
        </g>
      );
    case 4: // the summit flag
      return (
        <g className="n-gear">
          <rect x="-1.9" y="-62" width="3.8" height="84" rx="1.9" fill={c('indigo-lip')} />
          <g className="n-cloth">
            <path d="M-2 -58-28-48.5-2-39Z" fill={c('gold')} stroke={c('gold')} strokeWidth="3.4" strokeLinejoin="round" />
            <path d="M-6.5-52.5-15-48.5-6.5-44.5Z" fill={c('orange')} stroke={c('orange')} strokeWidth="1.6" strokeLinejoin="round" />
          </g>
          <circle cy="-63" r="3.4" fill={c('gold-lip')} />
        </g>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------- face

function Eyes({ kind }: { kind: 'round' | 'arc' | 'closed' }) {
  if (kind === 'arc')
    return (
      <g fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round">
        <path d="M39 57q8-9 16 0" />
        <path d="M65 57q8-9 16 0" />
      </g>
    );
  if (kind === 'closed')
    return (
      <g fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round">
        <path d="M39 55q8 8 16 0" />
        <path d="M65 55q8 8 16 0" />
      </g>
    );
  return (
    <g>
      {[47, 73].map((x) => (
        <g key={x} className="n-eye">
          <circle cx={x} cy="55" r="11" fill="#fff" />
          <g className="n-pupil">
            <circle cx={x} cy="55" r="5.6" fill={INK} />
            <circle cx={x - 2} cy="52.8" r="1.9" fill="#fff" />
          </g>
        </g>
      ))}
    </g>
  );
}

function Brows({ kind }: { kind: 'sad' | 'think' | 'up' }) {
  const d =
    kind === 'sad'
      ? ['M40 42 54 37', 'M66 37 80 42']
      : kind === 'think'
        ? ['M40 41q7-6 14-3', 'M67 44h11']
        : ['M40 41q7-5 14-1', 'M66 40q7-4 14 1'];
  return (
    <g fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
      {d.map((p) => (
        <path key={p} d={p} />
      ))}
    </g>
  );
}

function Mouth({ mood, surprised }: { mood: Mood; surprised: boolean }) {
  if (surprised) return <ellipse cx="60" cy="71" rx="3.2" ry="3.8" fill="none" stroke={INK} strokeWidth="3.2" />;
  switch (mood) {
    case 'cheer':
      return (
        <g>
          <path d="M51 69h18a9 9 0 0 1-18 0Z" fill={INK} />
          <path d="M55 74.5a5 3.2 0 0 1 10 0 7 7 0 0 1-10 0Z" fill={c('red')} />
        </g>
      );
    case 'talk':
      return (
        <g className="n-mouth-talk">
          <path d="M52 69h16a8 8 0 0 1-16 0Z" fill={INK} />
          <path d="M55.5 75.5a4.5 3 0 0 1 9 0 6 5 0 0 1-9 0Z" fill={c('red')} />
        </g>
      );
    case 'happy':
      return <path d="M51 68q9 10 18 0" fill="none" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />;
    case 'think':
      return <path d="M55 72h9" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />;
    case 'sad':
      return <path d="M53 74q7-7 14 0" fill="none" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />;
    case 'sleep':
      return <path d="M56 70q4 3 8 0" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />;
    default:
      return <path d="M53 69q7 7 14 0" fill="none" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />;
  }
}

// ---------------------------------------------------------------- behaviour

interface Over {
  mood?: Mood;
  look?: Dir;
  brows?: 'up';
}

const reducedMotion = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const FOLLOWERS: Mood[] = ['idle', 'wave', 'talk'];
/** Moods whose pupils may glance around on their own, with their resting gaze. */
const DRIFT: Partial<Record<Mood, [number, number]>> = { idle: [1.2, 0.8], wave: [1.2, 0.8], talk: [0.8, 0.4] };
const FIXED_GAZE: Mood[] = ['think', 'sad', 'point', 'sleep'];

export default function Niri({ mood = 'idle', size = 120, className = '', look, point = 'right', react, cue, gear }: Props) {
  const reactive = react ?? size >= 64;
  const root = useRef<SVGSVGElement>(null);
  const [over, setOver] = useState<Over | null>(null);
  const overRef = useRef<Over | null>(null);
  const moodRef = useRef(mood);
  const live = useRef(true); // on screen and tab visible
  const lastPointer = useRef(-Infinity);
  const holdTimer = useRef(0);
  const actTimer = useRef(0);
  const lastAct = useRef(-Infinity);
  const lastHover = useRef(-Infinity);
  const fixedGaze = useRef(false);

  const eff = over?.mood ?? mood;
  const gaze: Dir | undefined = over?.look ?? (look && look !== 'cursor' ? look : undefined);
  const follow = look === 'cursor' || (look === undefined && reactive && FOLLOWERS.includes(eff) && !over?.look);
  const arms = armsFor(eff, point);
  const eyeKind = eff === 'happy' || eff === 'cheer' ? 'arc' : eff === 'sleep' ? 'closed' : 'round';
  const brows = over?.brows ?? (eff === 'sad' ? 'sad' : eff === 'think' ? 'think' : null);

  useEffect(() => {
    moodRef.current = mood;
    overRef.current = over;
    fixedGaze.current = !!gaze || FIXED_GAZE.includes(eff);
  });

  /** One-shot body action (hop, tilt, perk), restartable. */
  const play = useCallback((act: string, ms: number) => {
    const el = root.current;
    if (!el) return;
    el.removeAttribute('data-act');
    el.getBoundingClientRect(); // restart the animation if the same act is already running
    el.setAttribute('data-act', act);
    lastAct.current = performance.now();
    window.clearTimeout(actTimer.current);
    actTimer.current = window.setTimeout(() => el.removeAttribute('data-act'), ms);
  }, []);

  /** A transient face/mood that falls back to the given mood afterwards. */
  const hold = useCallback((o: Over, ms: number) => {
    window.clearTimeout(holdTimer.current);
    setOver(o);
    holdTimer.current = window.setTimeout(() => setOver(null), ms);
  }, []);

  // A new mood or a reaction's gaze takes over from any glance the script had set.
  useEffect(() => {
    root.current?.style.removeProperty('--lx');
    root.current?.style.removeProperty('--ly');
  }, [eff, gaze]);

  // Entrance: one big hop with a ripple where it lands.
  useEffect(() => {
    if (cue === undefined || reducedMotion()) return;
    play('enter', 1000);
  }, [cue, play]);

  // Presence: pause everything off-screen and in hidden tabs; blinks and micro-actions.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    el.setAttribute('data-live', '');
    let inView = true;
    let tabOn = !document.hidden;
    const sync = () => {
      live.current = inView && tabOn;
      if (live.current) el.removeAttribute('data-paused');
      else el.setAttribute('data-paused', '');
    };
    const io = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      sync();
    });
    io?.observe(el);
    const onVis = () => {
      tabOn = !document.hidden;
      sync();
    };
    document.addEventListener('visibilitychange', onVis);

    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };
    const setGaze = (x: number | null, y = 0) => {
      if (x === null) {
        el.style.removeProperty('--lx');
        el.style.removeProperty('--ly');
      } else {
        el.style.setProperty('--lx', `${x}px`);
        el.style.setProperty('--ly', `${y}px`);
      }
    };

    if (!reducedMotion()) {
      const blink = () => {
        if (live.current) {
          el.setAttribute('data-blink', '');
          later(() => el.removeAttribute('data-blink'), 130);
          if (Math.random() < 0.2)
            later(() => {
              el.setAttribute('data-blink', '');
              later(() => el.removeAttribute('data-blink'), 120);
            }, 270);
        }
        later(blink, 2400 + Math.random() * 3600);
      };
      later(blink, 600 + Math.random() * 1200);

      // Micro-actions: the first one comes early so a visitor sees life straight away.
      let last = '';
      let first = true;
      let glancing = false;
      const micro = () => {
        const m = moodRef.current;
        const idle = m === 'idle';
        if (live.current && !overRef.current && (idle || ['wave', 'talk'].includes(m)) && !fixedGaze.current) {
          const watching = performance.now() - lastPointer.current < 4000;
          const pool = first && idle ? ['hop', 'tilt'] : idle ? ['look', 'hop', 'tilt', 'look'] : ['look'];
          const ok = pool.filter((a) => (idle ? a !== last : true) && !(a === 'look' && watching));
          if (ok.length) {
            const act = ok[Math.floor(Math.random() * ok.length)];
            last = act;
            if (act === 'hop') play('hop', 800);
            else if (act === 'tilt') {
              play('tilt', 1600);
              setGaze(-3, -1.5);
              later(() => setGaze(null), 1500);
            } else {
              glancing = true;
              setGaze(-3.6, 0.6);
              later(() => setGaze(3.6, 0.6), 700);
              later(() => {
                setGaze(null);
                glancing = false;
              }, 1500);
            }
          }
        }
        first = false;
        later(micro, 5000 + Math.random() * 5000);
      };
      later(micro, 1500 + Math.random() * 1000);

      // Tiny glances so the eyes are never perfectly still.
      const drift = () => {
        const base = DRIFT[moodRef.current];
        if (live.current && base && !overRef.current && !fixedGaze.current && !glancing && performance.now() - lastPointer.current > 4000)
          setGaze(base[0] + (Math.random() * 2 - 1) * 1.8, base[1] + (Math.random() * 2 - 1) * 1.1);
        later(drift, 1400 + Math.random() * 2400);
      };
      later(drift, 900 + Math.random() * 800);
    }

    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      timers.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(holdTimer.current);
      window.clearTimeout(actTimer.current);
    };
  }, [play]);

  // Cursor gaze: one throttled rAF per pointer move, clamped to the eye.
  useEffect(() => {
    const el = root.current;
    if (!follow || !el || reducedMotion() || !matchMedia('(pointer: fine)').matches) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const frame = () => {
      raf = 0;
      if (!live.current || overRef.current?.look) return;
      const r = el.getBoundingClientRect();
      const dx = px - (r.left + r.width / 2);
      const dy = py - (r.top + r.height * 0.46);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / (r.width * 1.2));
      el.style.setProperty('--lx', `${((dx / d) * k * 4.2).toFixed(2)}px`);
      el.style.setProperty('--ly', `${((dy / d) * k * 3.6).toFixed(2)}px`);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      px = e.clientX;
      py = e.clientY;
      lastPointer.current = performance.now();
      if (!raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
      el.style.removeProperty('--lx');
      el.style.removeProperty('--ly');
    };
  }, [follow]);

  // Reactions to the app's feedback bar.
  useEffect(() => {
    if (!reactive) return;
    const onFeedback = (e: Event) => {
      const tone = (e as CustomEvent<{ tone?: string }>).detail?.tone;
      const m = moodRef.current;
      if (m === 'sleep' || m === 'cheer' || !live.current) return;
      if (tone === 'good') {
        hold({ mood: 'happy' }, 1300);
        play('hop', 800);
      } else if (tone === 'bad') hold({ mood: 'sad' }, 1500);
      else if (tone === 'info') {
        hold({ look: 'up', brows: 'up' }, 1200);
        play('perk', 1200);
      }
    };
    window.addEventListener('nirengi:feedback', onFeedback);
    return () => window.removeEventListener('nirengi:feedback', onFeedback);
  }, [reactive, hold, play]);

  const onEnter = (e: React.PointerEvent) => {
    const now = performance.now();
    if (e.pointerType !== 'mouse' || overRef.current || now - lastHover.current < 3500) return;
    if (!['idle', 'think', 'point'].includes(moodRef.current)) return;
    lastHover.current = now;
    hold({ mood: 'wave' }, 1500);
  };

  const onClick = () => {
    if (performance.now() - lastAct.current < 500) return;
    if (moodRef.current === 'sleep') hold({ mood: 'idle', brows: 'up' }, 1800);
    play('hop', 800);
  };

  const surprised = over?.brows === 'up';
  const pointingArm = eff === 'point' ? (point === 'left' ? 0 : 1) : -1;
  const cheeks = eff === 'sad' ? 0.3 : eff === 'cheer' || eff === 'happy' ? 0.7 : 0.55;

  return (
    <svg
      ref={root}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`niri shrink-0 overflow-visible ${className}`}
      data-mood={eff}
      data-look={gaze}
      data-point={eff === 'point' ? point : undefined}
      role="img"
      aria-label="Niri"
      onPointerEnter={reactive ? onEnter : undefined}
      onClick={reactive ? onClick : undefined}
    >
      <ellipse className="n-shadow" cx="60" cy="113" rx="32" ry="5" fill="rgb(var(--ink) / 0.08)" />
      <ellipse className="n-ground" cx="60" cy="113" rx="24" ry="4" fill="none" stroke={c('indigo')} strokeWidth="2" />
      <g className="n-pose">
        <g className="n-loop">
          <g className="n-micro">
            <g className="n-breath">
              {gear !== undefined && <Pack gear={gear} />}
              <ArmShape arm={arms[0]} side="l" pointing={pointingArm === 0} held={gear !== undefined && gear >= 3 ? <Tool gear={gear} /> : undefined} />
              <ArmShape arm={arms[1]} side="r" pointing={pointingArm === 1} />
              {/* feet */}
              <ellipse cx="45" cy="108" rx="10" ry="6.5" fill={c('indigo-lip')} />
              <ellipse cx="75" cy="108" rx="10" ry="6.5" fill={c('indigo-lip')} />
              {/* body: a rounded triangle */}
              <path d="M60 15 105 97H15Z" fill={c('indigo')} stroke={c('indigo')} strokeWidth="18" strokeLinejoin="round" />
              <path d="M15 97h90" stroke={c('indigo-lip')} strokeWidth="18" strokeLinecap="round" opacity=".45" />
              {/* belly with the survey point */}
              <path d="M60 58 82 94H38Z" fill="rgb(255 255 255 / 0.2)" stroke="rgb(255 255 255 / 0.2)" strokeWidth="9" strokeLinejoin="round" />
              <circle className="n-ping" cx="60" cy="82" r="7.5" fill="none" stroke={c('orange')} strokeWidth="2" />
              <circle cx="60" cy="82" r="7.5" fill="#fff" />
              <circle cx="60" cy="82" r="4.6" fill={c('orange')} />
              {/* cheeks */}
              <ellipse cx="33" cy="70" rx="5.5" ry="3.4" fill={c('orange')} opacity={cheeks} />
              <ellipse cx="87" cy="70" rx="5.5" ry="3.4" fill={c('orange')} opacity={cheeks} />
              <Eyes key={eyeKind} kind={eyeKind} />
              {brows && <Brows kind={brows} />}
              <Mouth mood={eff} surprised={surprised} />
              {eff === 'sad' && <path className="n-tear" d="M81 66c-3.2 4.4-3.2 7.6 0 7.6s3.2-3.2 0-7.6Z" fill={c('cyan')} />}
              {gear !== undefined && <Headgear gear={gear} />}
            </g>
          </g>
        </g>
        {/* what Niri is thinking or dreaming, drawn so it never depends on a font */}
        {eff === 'think' && (
          <g fill={c('indigo')} opacity=".5">
            {[
              [86, 18, 2.6],
              [96, 7, 3.6],
              [108, -6, 5],
            ].map(([x, y, r], i) => (
              <circle key={i} className="n-dot" cx={x} cy={y} r={r} style={{ '--i': i } as CSSProperties} />
            ))}
          </g>
        )}
        {eff === 'sleep' && (
          <g fill="none" stroke={c('indigo')} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            {[
              [84, 16, 0.8],
              [95, 2, 1.05],
              [108, -14, 1.35],
            ].map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                <path className="n-z" d="M0 0h8L0 9h8" style={{ '--i': i } as CSSProperties} />
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
