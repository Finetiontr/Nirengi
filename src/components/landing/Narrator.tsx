// The sticky narrator for wide screens: one Niri that stays in the story's left rail
// and changes mood, words and costume as each section reaches the reading line. Every
// change is a twirl (Say → NiriTwirl), committed only once the reader settles on a
// section, so a fast scroll makes one turn instead of a flurry. It appears once the
// last stage Niri above the story (hero, then "who") has scrolled away and leaves
// before the closing band's Niri comes in, so there is never more than one on screen.
// The costume teaser (`niri:gear` events) can dress it up while the genç chapter is read.
// Phones and no-JS get inline bubbles instead.

import { useEffect, useRef, useState } from 'react';
import Say, { type Line } from './Say';

const WIDE = '(min-width: 1280px)';
const WIDER = '(min-width: 1600px)';
/** How long the reading line must stay in one section before Niri turns to it. */
const SETTLE_MS = 260;

export default function Narrator({ lines, tiers }: { lines: Line[]; tiers: Line[] }) {
  const [key, setKey] = useState(lines[0].key);
  const [on, setOn] = useState(false);
  const [size, setSize] = useState(104);
  const [dress, setDress] = useState<number | null>(null);
  // Each time the narrator comes back on screen it twirls in again.
  const [shows, setShows] = useState(0);
  const wasOn = useRef(false);

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('[data-narrate]')];
    const hero = [...document.querySelectorAll<HTMLElement>('[data-narrate-hero]')].at(-1);
    const end = document.querySelector<HTMLElement>('[data-narrate-end]');
    if (!sections.length) return;
    let raf = 0;
    let settle = 0;
    let want = '';
    const update = (now = false) => {
      raf = 0;
      if (!matchMedia(WIDE).matches) {
        setOn(false);
        return;
      }
      setSize(matchMedia(WIDER).matches ? 116 : 104);
      const vh = window.innerHeight;
      let cur = sections[0];
      for (const s of sections) if (s.getBoundingClientRect().top <= vh * 0.55) cur = s;
      const next = cur.dataset.narrate ?? lines[0].key;
      if (next !== want) {
        want = next;
        window.clearTimeout(settle);
        if (now) setKey(want);
        else settle = window.setTimeout(() => setKey(want), SETTLE_MS);
      }
      // The stage Niri stands about halfway down its sheet.
      const h = hero?.getBoundingClientRect();
      const heroGone = !h || h.top + h.height * 0.5 < 64;
      const endFar = !end || end.getBoundingClientRect().top > vh * 0.7;
      setOn(heroGone && endFar);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(() => update());
    };
    update(true);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
    };
  }, [lines]);

  // The costume teaser speaks through the narrator while its chapter is being read.
  useEffect(() => {
    const onGear = (e: Event) => setDress((e as CustomEvent<number>).detail);
    window.addEventListener('niri:gear', onGear);
    return () => window.removeEventListener('niri:gear', onGear);
  }, []);
  useEffect(() => setDress(null), [key]);

  useEffect(() => {
    if (on && !wasOn.current) setShows((n) => n + 1);
    wasOn.current = on;
  }, [on]);

  const base = lines.find((l) => l.key === key) ?? lines[0];
  const line = dress !== null && base.gear !== undefined ? (tiers[dress] ?? base) : base;
  return (
    <div
      aria-hidden="true"
      data-narrator=""
      className="sticky flex h-[340px] flex-col justify-end"
      style={{
        top: 'clamp(88px, calc(50vh - 170px), 300px)',
        opacity: on ? 1 : 0,
        visibility: on ? 'visible' : 'hidden',
        transition: `opacity 300ms ease, visibility 0s linear ${on ? 0 : 300}ms`,
      }}
    >
      <Say
        mood={line.mood}
        text={line.text}
        gear={line.gear}
        size={size}
        point="right"
        stack
        twirlKey={shows}
        turns={line.gear === undefined ? 0.5 : 1}
        className="pointer-events-auto w-full"
      />
    </div>
  );
}
