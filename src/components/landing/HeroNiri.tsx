// The hero's one orchestrated moment: Niri climbs the survey trail marker by marker,
// lands on the summit with a ripple and starts waving. Clicking Niri changes its line;
// hovering a door makes Niri comment on it. The climb is pure CSS (offset-path), so the
// server markup already ends on the summit; reduced motion shows that end pose at once.

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Niri, { type Mood } from '../ui/Niri';
import { emphasise } from './Say';

/** When the climb lands, in ms after navigation (matches .climb in Hero.astro). */
const LAND_MS = 2350;

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

export default function HeroNiri({ trail, size, sheet }: { trail: string; size: number; sheet: string }) {
  const [mood, setMood] = useState<Mood>('wave');
  const [line, setLine] = useState(0);
  const [door, setDoor] = useState<string | null>(null);
  const [cue, setCue] = useState<number | undefined>(undefined);
  const hold = useRef(0);

  // While climbing Niri looks up the hill; on landing it hops once and waves.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const left = LAND_MS - performance.now();
    if (left <= 0) return;
    setMood('idle');
    const t = window.setTimeout(() => {
      setMood('wave');
      setCue(1);
    }, left);
    return () => window.clearTimeout(t);
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
  const shown: Mood = door ? (door === 'genc' ? 'cheer' : 'point') : mood;
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className={`absolute left-0 top-0 origin-top-left ${sheet}`} style={{ width: 500, height: 420 }}>
        <div className="climb absolute left-0 top-0" style={{ width: size, height: size, offsetPath: `path('${trail}')` } as CSSProperties}>
          <div className="climb-hop">
            <button type="button" onClick={poke} className="pointer-events-auto block rounded-full" aria-label="Niri’ye dokun">
              <Niri mood={shown} size={size} point="left" cue={cue} />
            </button>
          </div>
        </div>
      </div>

      {/* Niri's words, drawn at reading size (outside the scaled sheet). */}
      <div className="pop absolute left-0 top-1 w-[48%]" style={{ animationDelay: '2.4s' }}>
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
    </div>
  );
}
