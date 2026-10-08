// Saha defteri: Niri's field notebook, our own collection book. Surveyors keep a
// saha defteri with one numbered record per point; Niri keeps one page per
// costume and field tool it has earned with the person. Mounted once by the
// layout and only on the genç face; opened with openDefter() from defter.ts or a
// #defter / #defter-<sayfa> link.

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { currentMe, useAppState, useView } from '../../lib/store.ts';
import { TIERS } from '../../lib/engine/progress.ts';
import { fmtDate } from '../../lib/format.ts';
import Niri from '../ui/Niri';
import NiriTwirl from '../ui/NiriTwirl';
import { Contours } from '../ui/pafta';
import { useTrap } from '../assistant/util';
import { ENTRIES, markRead, pages, readMarks, stampDates, useDefterStore, wear, worn, type EntryId, type Page } from './defter';

const pad = (n: number) => String(n).padStart(2, '0');

function useWide() {
  const [wide, setWide] = useState(() => matchMedia('(min-width: 640px)').matches);
  useEffect(() => {
    const mq = matchMedia('(min-width: 640px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

/**
 * The graduated plate Niri stands on. Its ticks creep round slowly and whirl
 * when the page turns, in the direction of the turn.
 */
function Turntable({ turn, dir }: { turn: number; dir: number }) {
  const reduce = useReducedMotion();
  const off = useMotionValue(0);
  const speed = useRef(0.004);
  const BASE = 0.004;
  useEffect(() => {
    if (turn) speed.current = 0.16 * dir;
  }, [turn, dir]);
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const base = Math.sign(speed.current || 1) * BASE;
    speed.current = base + (speed.current - base) * Math.exp(-delta / 260);
    off.set(off.get() - delta * speed.current);
  });
  return (
    <svg viewBox="0 0 260 66" className="pointer-events-none absolute bottom-0 left-1/2 w-[min(78%,300px)] -translate-x-1/2 overflow-visible" aria-hidden="true">
      <ellipse cx="130" cy="38" rx="120" ry="25" fill="rgb(var(--line-2))" />
      <ellipse cx="130" cy="31" rx="120" ry="25" fill="rgb(var(--bg))" stroke="rgb(var(--line-2))" strokeWidth="3" />
      <motion.ellipse cx="130" cy="31" rx="106" ry="19.5" fill="none" stroke="rgb(var(--ink-4))" strokeWidth="5" strokeDasharray="1.6 8.4" style={{ strokeDashoffset: off }} />
      <ellipse cx="130" cy="31" rx="88" ry="14.5" fill="none" stroke="rgb(var(--line))" strokeWidth="2.5" />
      {/* the index mark at the front of the plate */}
      <path d="M130 50.5 135.5 59.5H124.5Z" fill="rgb(var(--indigo))" stroke="rgb(var(--indigo))" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

function Thumb({ page, worn: w, on, unread, onPick }: { page: Page; worn: ReturnType<typeof worn>; on: boolean; unread: boolean; onPick: () => void }) {
  const wearing = page.id === w.costume || page.id === w.tool;
  return (
    <li className="shrink-0">
      <button
        type="button"
        onClick={onPick}
        aria-current={on ? 'true' : undefined}
        aria-label={`No. ${pad(page.no)}, ${page.earned ? page.name : 'açılmamış sayfa'}${wearing ? ', Niri’de' : ''}${unread ? ', yeni' : ''}`}
        className={`relative flex w-[56px] flex-col items-center rounded-[12px] border-2 pb-1 pt-1.5 transition-colors ${on ? 'border-indigo bg-indigo-tint' : 'border-transparent hover:bg-bg-2'} ${unread ? 'df-new' : ''}`}
      >
        <Niri
          size={42}
          react={false}
          gear={page.kind === 'costume' ? page.gear : undefined}
          item={page.item}
          mood={page.kind === 'tool' ? 'wave' : 'idle'}
          className={page.earned ? 'n-still' : 'n-still df-ghost'}
        />
        <span className={`num mt-0.5 font-mono text-[11px] font-bold leading-none ${on ? 'text-indigo' : 'text-ink-3'}`}>{pad(page.no)}</span>
        {wearing && (
          <span className="absolute left-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-green text-white" aria-hidden="true">
            <Check className="h-3 w-3" strokeWidth={4} />
          </span>
        )}
      </button>
    </li>
  );
}

function Notebook({ start, onClose }: { start?: { entry?: EntryId }; onClose: () => void }) {
  const s = useAppState();
  const me = currentMe(s);
  useDefterStore();
  const list = pages(s, me);
  const w = worn(s, me, list);
  const wide = useWide();
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLOListElement>(null);
  useTrap(box, onClose, true);

  const pickStart = () => {
    // A named page, else the costume Niri wears now; new pages are marked on the index.
    const byId = start?.entry ? list.findIndex((p) => p.id === start.entry) : -1;
    return byId >= 0 ? byId : list.findIndex((p) => p.id === w.costume);
  };
  const [i, setI] = useState(pickStart);
  const [dir, setDir] = useState(1);
  const [turn, setTurn] = useState(0);
  const [cheer, setCheer] = useState(0);
  const [happy, setHappy] = useState(false);
  // The notebook opens on a blank turn, then Niri twirls onto the page.
  const [opened, setOpened] = useState(false);
  const page = list[i];
  const [unreadAtOpen] = useState(() => {
    const marks = readMarks();
    return new Set(list.filter((p) => p.earned && !marks.has(p.id)).map((p) => p.id));
  });

  // A new openDefter() while open jumps to its page.
  useEffect(() => {
    if (start?.entry) {
      const at = list.findIndex((p) => p.id === start.entry);
      if (at >= 0) setI(at);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  useEffect(() => {
    stampDates(list);
    box.current?.focus({ preventScroll: true });
    const t = window.setTimeout(() => setOpened(true), 140);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (page.earned) markRead(page.id);
    // Keep the current tab in view on phones.
    const li = strip.current?.querySelector<HTMLElement>('[aria-current="true"]');
    li?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }, [page.id, page.earned, reduce]);

  const go = (d: number) => {
    setDir(d);
    setTurn((t) => t + 1);
    setHappy(false);
    setI((x) => (x + d + list.length) % list.length);
  };
  const jump = (to: number) => {
    if (to === i) return;
    go(to > i ? 1 : -1);
    setI(to);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Swipe between pages on the stage.
  const down = useRef<{ x: number; y: number } | null>(null);
  const onDown = (e: ReactPointerEvent) => {
    down.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: ReactPointerEvent) => {
    const d = down.current;
    down.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(e.clientY - d.y) * 1.3) go(dx < 0 ? 1 : -1);
  };

  const wearing = page.id === w.costume || page.id === w.tool;
  const put = (id: EntryId | null) => {
    wear(me, id);
    if (id) {
      setCheer((c) => c + 1);
      setHappy(true);
    }
  };

  const size = wide ? 196 : 132;
  const label = page.kind === 'costume' ? `Lig kıyafeti · ${TIERS[page.gear ?? 0]}` : 'Saha aleti';
  // The stage shows the page on Niri as worn: a costume with the tool in hand, a tool with the costume on.
  const stageGear = page.kind === 'costume' ? page.gear : page.earned ? w.gear : undefined;
  const stageItem = page.kind === 'tool' ? page.item : page.earned ? w.item : undefined;
  const earnedCount = list.filter((p) => p.earned).length;
  const costumes = ENTRIES.filter((e) => e.kind === 'costume').length;

  // The action: inline on the right page on desktop, pinned above the index on phones.
  const action = (
    !page.earned ? (
      <a href={page.href} className="btn-line btn-block">
        {page.cta}
      </a>
    ) : page.kind === 'costume' ? (
      wearing ? (
        <p className="flex min-h-12 items-center justify-center gap-2 rounded-[12px] bg-green-tint px-4 text-[16px] font-extrabold text-green-lip">
          <Check className="h-5 w-5" strokeWidth={3.5} />
          Niri bunu giyiyor
        </p>
      ) : (
        <button type="button" className="btn-primary btn-block" onClick={() => put(page.id)}>
          Giy
        </button>
      )
    ) : wearing ? (
      <button type="button" className="btn-line btn-block" onClick={() => put(null)}>
        Elinden al
      </button>
    ) : (
      <button type="button" className="btn-primary btn-block" onClick={() => put(page.id)}>
        Eline ver
      </button>
    )
  );

  return (
    <motion.div className="fixed inset-0 z-[72] flex items-stretch justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" tabIndex={-1} className="absolute inset-0 bg-ink/45" aria-label="Defteri kapat" onClick={onClose} />
      <motion.div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby="defter-baslik"
        tabIndex={-1}
        className="relative flex h-full w-full flex-col overflow-hidden bg-bg outline-none sm:h-auto sm:max-h-[min(760px,94dvh)] sm:max-w-[920px] sm:rounded-[24px] sm:border-2 sm:border-line"
        initial={{ y: 36, opacity: 0, scale: 0.985 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, transition: { duration: 0.15 } }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      >
        <header className="flex items-center gap-3 border-b-2 border-line px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))] sm:px-6 sm:pt-4">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-extrabold leading-tight text-ink-3">Niri’nin</p>
            <h2 id="defter-baslik" className="text-[22px] font-black leading-tight tracking-[-0.02em] text-ink">
              Saha defteri
            </h2>
          </div>
          <span className="chip num shrink-0" title="Kazandığın sayfalar">
            {earnedCount}/{list.length} sayfa
          </span>
          <button type="button" className="btn-quiet btn-sm !min-h-11 !w-11 !px-0" onClick={onClose} aria-label="Defteri kapat">
            <X className="h-5 w-5" strokeWidth={3} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto sm:grid sm:grid-cols-2 sm:overflow-visible">
          {/* Left page: Niri on the plate */}
          <section
            className="df-grid relative h-[240px] touch-pan-y select-none overflow-hidden sm:h-auto sm:min-h-[440px]"
            onPointerDown={onDown}
            onPointerUp={onUp}
            onPointerCancel={() => (down.current = null)}
            aria-label="Niri"
          >
            <Contours color="indigo" opacity={0.1} x={0.82} y={0.2} seed={7} rings={6} step={34} />
            <p key={page.id} className="df-no absolute left-4 top-3 font-mono text-[15px] font-bold text-ink-3 sm:left-6 sm:top-5">
              No. <span className="text-[26px] text-ink">{pad(page.no)}</span>
              <span className="text-ink-3"> / {pad(list.length)}</span>
            </p>
            <div className="absolute inset-x-0 bottom-3 top-12 sm:bottom-8">
              <Turntable turn={turn} dir={dir} />
              <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: wide ? 2 : 0 }}>
                <NiriTwirl k={opened ? page.id : 'kapak'}>
                  {page.earned ? (
                    <Niri gear={stageGear} item={stageItem} size={size} mood={happy ? 'happy' : 'idle'} lively cue={cheer || undefined} cueAct="spin" />
                  ) : (
                    <Niri gear={stageGear} item={stageItem} size={size} react={false} className="n-still df-ghost" />
                  )}
                </NiriTwirl>
              </div>
            </div>
            <button type="button" onClick={() => go(-1)} aria-label="Önceki sayfa" className="btn-ink absolute left-3 top-1/2 !min-h-11 !w-11 -translate-y-1/2 !rounded-full !px-0">
              <ChevronLeft className="h-5 w-5" strokeWidth={3} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Sonraki sayfa" className="btn-ink absolute right-3 top-1/2 !min-h-11 !w-11 -translate-y-1/2 !rounded-full !px-0">
              <ChevronRight className="h-5 w-5" strokeWidth={3} />
            </button>
          </section>

          {/* Right page: the record */}
          <section className="df-seam px-5 pb-5 pt-4 sm:overflow-y-auto sm:px-7 sm:pt-7" aria-live="polite">
            <motion.div key={page.id} initial={{ opacity: 0, x: 14 * dir }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}>
              <p className="text-[13px] font-extrabold text-ink-3">{label}</p>
              <h3 className={`mt-0.5 text-[28px] font-black leading-tight tracking-[-0.02em] ${page.earned ? 'text-ink' : 'text-ink-3'}`}>{page.earned ? page.name : '???'}</h3>

              <figure className="relative mt-3 rounded-[18px] sm:mt-4 border-2 border-line bg-bg px-4 py-3">
                <span className="absolute -top-[9px] left-8 h-4 w-4 rotate-45 border-l-2 border-t-2 border-line bg-bg sm:-left-[9px] sm:top-5 sm:border-b-2 sm:border-t-0" aria-hidden="true" />
                <blockquote className="text-[16px] font-bold leading-snug text-ink-2">
                  {page.earned ? `“${page.lore}”` : 'Bu sayfa henüz boş. Açıldığında ne yazdığımı ilk sen okuyacaksın.'}
                </blockquote>
                <figcaption className="mt-1 text-[13px] font-extrabold text-indigo">Niri</figcaption>
              </figure>

              <dl className="mt-4 text-[15px] sm:mt-5">
                <div className="hidden grid-cols-[84px_1fr] gap-3 border-t-2 border-dashed border-line py-2.5 sm:grid">
                  <dt className="font-bold text-ink-3">Nokta</dt>
                  <dd className="font-mono font-bold text-ink-2">No. {pad(page.no)}</dd>
                </div>
                <div className="grid grid-cols-[84px_1fr] gap-3 border-t-2 border-dashed border-line py-2.5">
                  <dt className="font-bold text-ink-3">Nasıl</dt>
                  <dd className="font-bold text-ink-2">{page.how}</dd>
                </div>
                <div className="grid grid-cols-[84px_1fr] gap-3 border-y-2 border-dashed border-line py-2.5">
                  <dt className="font-bold text-ink-3">Durum</dt>
                  <dd className="font-bold">
                    {page.earned ? (
                      <span className="text-green-lip">Kazandın{page.at ? ` · ${fmtDate(page.at)}` : ''}</span>
                    ) : (
                      <span className="text-ink-3">
                        Henüz açılmadı
                        {page.near && <span className="block text-[14px]">{page.near}</span>}
                      </span>
                    )}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 hidden sm:block">
                {action}
                {page.earned && <p className="mt-2 text-center text-[13px] font-bold text-ink-3">Niri, Bugün ve Lig ekranlarında böyle görünür.</p>}
              </div>
            </motion.div>
          </section>
        </div>

        <div className="border-t-2 border-line bg-bg px-4 py-3 sm:hidden">{action}</div>

        {/* The index: every page by number; kıyafetler, then aletler */}
        <nav className="border-t-2 border-line px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2" aria-label="Defterin sayfaları">
          <ol ref={strip} className="flex items-stretch gap-1 overflow-x-auto px-1 sm:justify-center">
            {list.map((p, at) => (
              <Thumbs key={p.id} split={at === costumes}>
                <Thumb page={p} worn={w} on={at === i} unread={unreadAtOpen.has(p.id) && at !== i} onPick={() => jump(at)} />
              </Thumbs>
            ))}
          </ol>
        </nav>
      </motion.div>
    </motion.div>
  );
}

/** A thumb, with a divider before the first tool. */
function Thumbs({ split, children }: { split: boolean; children: ReactNode }) {
  return (
    <>
      {split && <li className="mx-1 w-[2px] shrink-0 self-stretch rounded-full bg-line" aria-hidden="true" />}
      {children}
    </>
  );
}

export default function SahaDefteri() {
  const genc = useView().persona !== 'org';
  const [open, setOpen] = useState<{ entry?: EntryId } | null>(null);

  useEffect(() => {
    const on = (e: Event) => setOpen({ entry: (e as CustomEvent<{ entry?: EntryId } | null>).detail?.entry });
    const fromHash = () => {
      const m = /^#defter(?:-([a-z]+))?$/.exec(location.hash);
      if (!m) return;
      history.replaceState(null, '', location.pathname + location.search);
      setOpen({ entry: m[1] as EntryId | undefined });
    };
    window.addEventListener('nirengi:defter', on);
    window.addEventListener('hashchange', fromHash);
    fromHash();
    return () => {
      window.removeEventListener('nirengi:defter', on);
      window.removeEventListener('hashchange', fromHash);
    };
  }, []);

  // Switching to the kurum face closes it: the notebook belongs to the genç side.
  useEffect(() => {
    if (!genc) setOpen(null);
  }, [genc]);

  if (!genc || typeof document === 'undefined') return null;
  return createPortal(<AnimatePresence>{open && <Notebook key="defter" start={open} onClose={() => setOpen(null)} />}</AnimatePresence>, document.body);
}
