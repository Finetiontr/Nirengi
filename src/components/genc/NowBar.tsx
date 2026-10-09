// Şimdi şeridi: the genç face's live bar at the foot of every page. Niri turns
// through what is open today (institution needs first, then your project and
// your week) one line at a time; a tap grows the bar into today's full list.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { currentMe, useAppState, useView } from '../../lib/store.ts';
import { needsForPerson, type Match } from '../../lib/engine/match.ts';
import { progress } from '../../lib/engine/progress.ts';
import { skillLabel } from '../../lib/skills.ts';
import type { Org, Person, State } from '../../lib/types.ts';
import NiriSays from '../ui/NiriSays';
import { Ring } from '../ui/kit';
import { Flame } from '../ui/icons';
import { Tri } from '../ui/pafta';
import { useLift } from '../ui/lift';
import { useTrap } from '../assistant/util';
import { useWorn } from './defter';

/** How long one line stays before the next slides in (ms). */
const DWELL = 4800;
const FRESH_MS = 3 * 86_400_000;

/** Flows keep the screen to themselves: no bar there. */
export const nowBarOn = () => !/\/kanit-bagla(\.html)?\/?$/.test(location.pathname);

interface Door {
  m: Match;
  org: Org;
  fresh: boolean;
}

interface Live {
  key: string;
  kind: 'summary' | 'need' | 'pilot' | 'goal';
  title: string;
  sub: string;
  href?: string;
  score?: number;
  count?: number;
  fresh?: boolean;
}

function doorsFor(s: State, me: Person): Door[] {
  return needsForPerson(s, me).map((m) => ({
    m,
    org: s.orgs.find((o) => o.id === m.need.orgId)!,
    fresh: !!m.need.publishedAt && Date.now() - Date.parse(m.need.publishedAt) < FRESH_MS,
  }));
}

function nextMilestone(s: State, me: Person) {
  const pilot = s.pilots.find((p) => p.personId === me.id && p.status === 'active');
  const i = pilot?.milestones.findIndex((m) => m.state === 'open') ?? -1;
  if (!pilot || i < 0) return null;
  return { pilot, i, org: s.orgs.find((o) => o.id === pilot.orgId)! };
}

/** The lines the bar turns through: the day's summary, the closest needs, then your own work. */
function liveLines(s: State, me: Person, doors: Door[]): Live[] {
  const needs: Live[] = doors.slice(0, 4).map((d) => ({
    key: d.m.need.id,
    kind: 'need',
    title: d.m.need.title,
    sub: `${d.org.name} · uyumun ${d.m.score}`,
    href: `/ihtiyaclar/${d.m.need.id}`,
    score: d.m.score,
    fresh: d.fresh,
  }));
  const own: Live[] = [];
  const ms = nextMilestone(s, me);
  if (ms)
    own.push({
      key: 'pilot',
      kind: 'pilot',
      title: `${ms.org.name} projende ${ms.i + 1}. aşama`,
      sub: ms.pilot.milestones[ms.i].title,
      href: `/pilotlar/${ms.pilot.id}`,
    });
  const p = progress(s, me);
  const left = Math.max(0, p.goal - p.active);
  if (!p.met && !p.rest && left > 0) own.push({ key: 'goal', kind: 'goal', title: `Haftalık hedefine ${left} gün kaldı`, sub: 'Bugün küçük bir adım yeter', href: '/gorevler' });

  const fresh = doors.filter((d) => d.fresh).length;
  const summary: Live = doors.length
    ? {
        key: 'summary',
        kind: 'summary',
        title: `Bugün ${doors.length} ihtiyaç açık`,
        sub: fresh ? `${fresh} yeni · en uygunu ${doors[0].org.name}` : `En uygunu ${doors[0].org.name}`,
        count: doors.length,
      }
    : { key: 'summary', kind: 'summary', title: 'Bugün açık ihtiyaç yok', sub: 'Yenisi gelince ilk burada görürsün', count: 0 };

  // Needs lead; your own lines slot in between so the bar never feels like an ad reel.
  const out = [summary, ...needs.slice(0, 2)];
  if (own[0]) out.push(own[0]);
  out.push(...needs.slice(2, 3));
  if (own[1]) out.push(own[1]);
  out.push(...needs.slice(3));
  return out;
}

const scoreTone = (v: number) => (v >= 75 ? 'green' : v >= 55 ? 'cyan' : 'indigo');

// ---------------------------------------------------------------- pieces

/** Niri's face for the bar: it blinks, glances at each new line and gives a small hop. */
function LiveFace({ beat, ping }: { beat: string; ping: boolean }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-tint">
      {ping && !reduce && (
        <>
          <span className="ping-soft absolute inset-1 rounded-full" style={{ background: 'rgb(var(--indigo) / 0.3)' }} />
          <span className="ping-soft absolute inset-1 rounded-full" style={{ background: 'rgb(var(--indigo) / 0.2)', animationDelay: '1.1s' }} />
        </>
      )}
      <motion.svg
        key={beat}
        viewBox="0 0 32 32"
        width={32}
        height={32}
        className="relative"
        aria-hidden="true"
        initial={reduce ? false : { y: 0, rotate: 0 }}
        animate={reduce ? undefined : { y: [0, -5, 0, -1.5, 0], rotate: [0, -7, 3, 0, 0], scaleY: [1, 1.04, 0.94, 1.01, 1] }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], times: [0, 0.3, 0.6, 0.8, 1] }}
        style={{ transformOrigin: '50% 90%' }}
      >
        <path d="M16 4.5 28 26H4Z" fill="rgb(var(--indigo))" stroke="rgb(var(--indigo))" strokeWidth="4" strokeLinejoin="round" />
        <g className="niri-eye">
          <circle cx="12.6" cy="17.4" r="3.1" fill="#fff" />
          <circle cx="19.4" cy="17.4" r="3.1" fill="#fff" />
        </g>
        {/* Pupils glance towards the line, then settle. */}
        <motion.g initial={false} animate={reduce ? undefined : { x: [0, 1.3, 1.3, 0.5], y: [0, -0.3, -0.3, 0] }} transition={{ duration: 1.6, times: [0, 0.2, 0.75, 1] }}>
          <circle cx="13.1" cy="17.8" r="1.5" fill="#252338" />
          <circle cx="19.9" cy="17.8" r="1.5" fill="#252338" />
        </motion.g>
        <circle cx="9.3" cy="22" r="1.7" fill="rgb(var(--orange))" opacity=".6" />
        <circle cx="22.7" cy="22" r="1.7" fill="rgb(var(--orange))" opacity=".6" />
      </motion.svg>
    </span>
  );
}

/** Small fit ring that draws itself each time a need comes round. */
function MiniRing({ value }: { value: number }) {
  const size = 40;
  const sw = 5;
  const r = (size - sw) / 2;
  const reduce = useReducedMotion();
  return (
    <span className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--bg-3))" strokeWidth={sw} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`rgb(var(--${scoreTone(value)}))`}
          strokeWidth={sw}
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      </svg>
      <span className="num relative text-[13px] font-black text-ink">{value}</span>
    </span>
  );
}

function Accessory({ item }: { item: Live }) {
  if (item.kind === 'need') return <MiniRing value={item.score ?? 0} />;
  if (item.kind === 'pilot')
    return (
      <span className="grid h-10 w-10 shrink-0 place-items-center">
        <Tri size={30} tone="indigo" state="done" />
      </span>
    );
  if (item.kind === 'goal')
    return (
      <span className="grid h-10 w-10 shrink-0 place-items-center">
        <Flame size={30} className="flame-live" />
      </span>
    );
  return (
    <motion.span
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 520, damping: 22 }}
      className="num grid h-10 min-w-10 shrink-0 place-items-center rounded-full bg-indigo px-2 text-[17px] font-black text-white"
      style={{ boxShadow: '0 3px 0 rgb(var(--indigo-lip))' }}
    >
      {item.count}
    </motion.span>
  );
}

const lineVariants = {
  enter: (dir: number) => ({ y: dir * 22, opacity: 0, filter: 'blur(6px)' }),
  center: { y: 0, opacity: 1, filter: 'blur(0px)' },
  exit: (dir: number) => ({ y: dir * -22, opacity: 0, filter: 'blur(6px)' }),
};

const spring = { type: 'spring', stiffness: 420, damping: 34, mass: 0.9 } as const;

// ---------------------------------------------------------------- bar

export default function NowBar() {
  const s = useAppState();
  const { persona } = useView();
  const me = currentMe(s);
  const bottom = useLift();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const pill = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  /** A swipe on the line must not also count as a tap that opens the panel. */
  const swiped = useRef(false);

  const doors = doorsFor(s, me);
  const lines = liveLines(s, me, doors);
  const cur = lines[i % lines.length];
  const anyFresh = doors.some((d) => d.fresh);

  const step = (d: number) => {
    setDir(d);
    setI((n) => (n + d + lines.length) % lines.length);
  };

  // Hand focus back to the bar once the panel has folded into it.
  useEffect(() => {
    if (open) wasOpen.current = true;
    else if (wasOpen.current) {
      wasOpen.current = false;
      window.setTimeout(() => pill.current?.focus({ preventScroll: true }), 60);
    }
  }, [open]);

  if (persona === 'org' || !nowBarOn()) return null;

  return (
    <>
      <div aria-hidden="true" className="h-14 lg:h-16" />
      <div
        className="no-print pointer-events-none fixed inset-x-0 z-[45] flex justify-center px-3 transition-[bottom] duration-200"
        style={{ bottom: `calc(env(safe-area-inset-bottom) + ${bottom}px)` }}
      >
        <AnimatePresence initial={false}>
          {!open && (
            <motion.button
              key="pill"
              ref={pill}
              type="button"
              layoutId="nowbar"
              onClick={() => {
                if (swiped.current) swiped.current = false;
                else setOpen(true);
              }}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
              onPointerLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              aria-haspopup="dialog"
              aria-expanded={false}
              aria-label={`Bugün: ${lines[0].title}. ${lines[0].sub}. Listeyi aç.`}
              className="pointer-events-auto relative flex w-full max-w-[520px] items-center gap-3 overflow-hidden border-2 border-line bg-bg py-1.5 pl-1.5 pr-2.5 text-left shadow-[0_12px_32px_-12px_rgb(0_0_0/0.3)] transition-colors hover:border-indigo/40"
              style={{ borderRadius: 30 }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={spring}
              whileTap={{ scale: 0.98 }}
            >
              <LiveFace beat={cur.key} ping={anyFresh} />

              {/* The turning line; a sideways swipe turns it by hand. */}
              <motion.span
                className="relative block h-[44px] min-w-0 flex-1 touch-pan-y overflow-hidden"
                drag={reduce ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                dragSnapToOrigin
                onDragStart={() => (swiped.current = true)}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -36) step(1);
                  else if (info.offset.x > 36) step(-1);
                }}
              >
                <AnimatePresence initial={false} custom={dir} mode="popLayout">
                  <motion.span
                    key={cur.key}
                    custom={dir}
                    variants={lineVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={spring}
                    className="absolute inset-0 flex flex-col justify-center"
                  >
                    <span className="flex min-w-0 items-center gap-1.5">
                      {cur.fresh && <span className="pill shrink-0 bg-indigo-tint !px-1.5 !py-0 text-[11px] text-indigo">Yeni</span>}
                      <span className="truncate text-[15px] font-extrabold leading-tight text-ink">{cur.title}</span>
                    </span>
                    <span className="truncate text-[13px] font-bold leading-tight text-ink-3">{cur.sub}</span>
                  </motion.span>
                </AnimatePresence>
              </motion.span>

              <AnimatePresence initial={false} mode="popLayout">
                <motion.span key={cur.key} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={spring}>
                  <Accessory item={cur} />
                </motion.span>
              </AnimatePresence>

              {/* Dwell line: when it fills, the next line comes in. Hover or focus holds it. */}
              {!reduce && lines.length > 1 && (
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-6 bottom-[3px] h-[3px] overflow-hidden rounded-full bg-bg-3">
                  <span
                    key={`${cur.key}-${i}`}
                    className="nowbar-fill block h-full origin-left rounded-full bg-indigo/45"
                    style={{ animationDuration: `${DWELL}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                    onAnimationEnd={() => step(1)}
                  />
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>{open && <Panel key="panel" s={s} me={me} doors={doors} bottom={bottom} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------- panel

function Panel({ s, me, doors, bottom, onClose }: { s: State; me: Person; doors: Door[]; bottom: number; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const drag = useDragControls();
  const reduce = useReducedMotion();
  const niri = useWorn(s, me);
  useTrap(box, onClose, true);

  const fresh = doors.filter((d) => d.fresh).length;
  const ms = nextMilestone(s, me);
  const p = progress(s, me);
  const left = Math.max(0, p.goal - p.active);
  const say = doors.length
    ? `Bugün ${doors.length} ihtiyaç açık${fresh ? `, ${fresh} tanesi yeni` : ''}. Sana en uygunu ${doors[0].org.name}.`
    : 'Bugün açık ihtiyaç yok. Yenisi gelince sana ilk ben söylerim.';

  const help = () => {
    onClose();
    window.setTimeout(() => window.dispatchEvent(new CustomEvent('nirengi:asistan', { detail: 'help' })), 280);
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[46] bg-ink/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="pointer-events-none fixed inset-x-0 z-[47] flex justify-center px-3" style={{ bottom: `calc(env(safe-area-inset-bottom) + ${bottom}px)` }}>
        <motion.div
          ref={box}
          layoutId="nowbar"
          role="dialog"
          aria-modal="true"
          aria-labelledby="simdi-baslik"
          data-assistant
          className="pointer-events-auto flex w-full max-w-[560px] flex-col overflow-hidden border-2 border-line bg-bg shadow-[0_18px_48px_-16px_rgb(0_0_0/0.45)]"
          style={{ borderRadius: 24, maxHeight: `calc(100dvh - ${bottom + 84}px)` }}
          transition={spring}
          drag="y"
          dragControls={drag}
          dragListener={false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.05, bottom: 0.7 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 90 || info.velocity.y > 650) onClose();
          }}
        >
          {/* Grab strip: pull down to fold the panel back into the bar. */}
          <div className="flex shrink-0 cursor-grab touch-none items-center justify-between gap-3 px-4 pb-1 pt-2.5 active:cursor-grabbing" onPointerDown={(e) => drag.start(e)}>
            <span className="w-11" />
            <span className="h-1.5 w-12 rounded-full bg-line-2" aria-hidden="true" />
            <button type="button" onClick={onClose} className="btn-quiet btn-sm !min-h-9 !px-2.5 !text-[13px]">
              Kapat
            </button>
          </div>

          <motion.div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: reduce ? 0 : 0.12, duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
          >
            <h2 id="simdi-baslik" className="sr-only">
              Bugün açık olanlar
            </h2>
            <NiriSays mood="point" point="down" size={72} gear={niri.gear} item={niri.item} typing>
              <p className="text-[16px] font-extrabold leading-snug text-ink">{say}</p>
            </NiriSays>

            {(ms || left > 0) && (
              <Stagger className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {ms && <Tile href={`/pilotlar/${ms.pilot.id}`} icon={<Tri size={28} tone="indigo" state="done" />} title={`${ms.i + 1}. aşamayı teslim et`} sub={`${ms.org.name} projen`} />}
                {left > 0 && !p.met && !p.rest && <Tile href="/gorevler" icon={<Flame size={30} className="flame-live" />} title={`Hedefine ${left} gün`} sub={`Haftada ${p.goal} gün hedefin var`} />}
              </Stagger>
            )}

            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <h3 className="text-[17px] font-black text-ink">Sana uyan ihtiyaçlar</h3>
              <span className="text-[13px] font-bold text-ink-3">Kurumlar kurgusal demo</span>
            </div>
            {doors.length ? (
              <Stagger className="mt-3 space-y-2.5">
                {doors.map((d) => (
                  <DoorRow key={d.m.need.id} d={d} />
                ))}
              </Stagger>
            ) : (
              <p className="mt-3 rounded-[16px] bg-bg-2 px-4 py-3 text-[15px] font-bold text-ink-3">Şu an yayında ihtiyaç yok. Bu arada görevlerle kanıtını güçlendirebilirsin.</p>
            )}
          </motion.div>

          <div className="flex shrink-0 items-center justify-between gap-2 border-t-2 border-line px-3 py-2">
            <button type="button" onClick={help} className="btn-quiet btn-sm !min-h-10">
              Niri’ye sor
            </button>
            <a href="/analiz" className="btn-quiet btn-sm !min-h-10">
              Tüm analiz
              <ChevronRight className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
}

const listVariants = { hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.16 } } };
const rowVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 460, damping: 32 } },
} as const;

function Stagger({ className, children }: { className: string; children: ReactNode }) {
  return (
    <motion.ul className={className} variants={listVariants} initial="hidden" animate="show">
      {children}
    </motion.ul>
  );
}

function Tile({ href, icon, title, sub }: { href: string; icon: ReactNode; title: string; sub: string }) {
  return (
    <motion.li variants={rowVariants}>
      <a href={href} className="card-press flex items-center gap-3 p-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-extrabold text-ink">{title}</span>
          <span className="block truncate text-[13px] font-bold text-ink-3">{sub}</span>
        </span>
      </a>
    </motion.li>
  );
}

function DoorRow({ d }: { d: Door }) {
  const gap = [...d.m.gaps].sort((a, b) => b.gain - a.gain)[0];
  return (
    <motion.li variants={rowVariants}>
      <a href={`/ihtiyaclar/${d.m.need.id}`} className="card-press flex items-center gap-3.5 p-3.5">
        <Ring value={d.m.score} size={54} />
        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[13px] font-bold text-ink-3">{d.org.name}</span>
            {d.fresh && <span className="pill shrink-0 bg-indigo-tint !px-1.5 !py-0 text-[11px] text-indigo">Yeni</span>}
          </span>
          <span className="mt-0.5 line-clamp-2 block text-[15.5px] font-extrabold leading-snug text-ink">{d.m.need.title}</span>
          {gap && gap.gain > 0 && (
            <span className="mt-1 block text-[13px] font-bold text-ink-3">
              {skillLabel(gap.skill)} alanında bir işle <b className="whitespace-nowrap text-green-lip">+{gap.gain} uyum</b>
            </span>
          )}
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-ink-3" strokeWidth={3} aria-hidden="true" />
      </a>
    </motion.li>
  );
}
