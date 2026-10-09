// The presenter window (/sunum?notlar, or N on the deck): the speaker notes for the
// slide on screen, what comes next, and a clock against the planned pace. It follows
// the deck over a BroadcastChannel and drives it with the same keys.

import { useCallback, useEffect, useRef, useState } from 'react';
import { NOTES } from './notes';
import { MAIN, place, SLIDES } from './slides';

export const CHANNEL = 'nirengi:sunum';
export type Msg = { type: 'at'; i: number } | { type: 'go'; i: number } | { type: 'hello' };

const last = SLIDES.length - 1;
const clamp = (i: number) => Math.max(0, Math.min(last, i));
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const secOf = (id: string) => NOTES[id]?.sec ?? 0;
/** Planned seconds before each slide starts; the plan covers the talk, not the appendix. */
const START = SLIDES.reduce<number[]>((acc, s, n) => [...acc, n ? acc[n - 1] + secOf(SLIDES[n - 1].id) : 0], []);
const TOTAL = START[MAIN - 1] + secOf(SLIDES[MAIN - 1].id);

export default function Presenter() {
  const [i, setI] = useState(() => clamp((Number.parseInt(location.hash.slice(1), 10) || 1) - 1));
  const [t0, setT0] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const channel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    document.title = 'Notlar · nirengi sunum';
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(CHANNEL);
    channel.current = ch;
    ch.onmessage = (e: MessageEvent<Msg>) => {
      if (e.data.type === 'at') setI(clamp(e.data.i));
    };
    ch.postMessage({ type: 'hello' } satisfies Msg);
    return () => ch.close();
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (location.hash !== `#${i + 1}`) history.replaceState(null, '', `${location.search}#${i + 1}`);
  }, [i]);

  const go = useCallback((n: number) => {
    const next = clamp(n);
    setI(next);
    channel.current?.postMessage({ type: 'go', i: next } satisfies Msg);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      let hit = true;
      if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ') go(i + 1);
      else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') go(i - 1);
      else if (k === 'Home') go(0);
      else if (k === 'End') go(MAIN - 1);
      else if (k === 'r' || k === 'R') setT0(Date.now());
      else hit = false;
      if (hit) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i, go]);

  const slide = SLIDES[i];
  const next = SLIDES[i + 1];
  const note = NOTES[slide.id];
  const elapsed = (now - t0) / 1000;
  const drift = elapsed - START[i];

  return (
    <div className="fixed inset-0 overflow-auto bg-bg text-ink-2">
      <div className="mx-auto flex min-h-full max-w-[1200px] flex-col gap-6 px-8 py-7">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-line pb-5">
          <div>
            <p className="mono text-[18px] font-bold text-ink-3">{place(i)}</p>
            <h1 className="text-[40px] font-extrabold leading-tight tracking-[-0.03em] text-ink">{slide.title}</h1>
          </div>
          <div className="text-right">
            <p className="mono text-[40px] font-bold leading-none text-ink">{mmss(elapsed)}</p>
            {i < MAIN ? (
              <>
                <p className="mt-2 text-[16px] font-semibold text-ink-3">
                  Plan: başlangıç {mmss(START[i])} · süre {mmss(note?.sec ?? 0)} · toplam {mmss(TOTAL)}
                </p>
                <p className={`text-[16px] font-bold ${drift > 30 ? 'text-red-lip' : 'text-ink-3'}`}>
                  {Math.abs(drift) < 10 ? 'Tam zamanında' : drift > 0 ? `${mmss(drift)} geridesin` : `${mmss(-drift)} öndesin`}
                </p>
              </>
            ) : (
              <p className="mt-2 text-[16px] font-semibold text-ink-3">Ek: soru-cevap için · End kapanışa döner</p>
            )}
          </div>
        </header>

        <main className="grid flex-1 gap-8 md:grid-cols-[1fr_320px]">
          <ul className="flex flex-col gap-4">
            {(note?.say ?? ['Bu slayt için not yok.']).map((t) => (
              <li key={t} className="flex gap-3 text-[26px] font-semibold leading-[1.4] text-ink">
                <span className="mt-[14px] h-[10px] w-[10px] shrink-0 rotate-45 rounded-[2px] bg-indigo" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <aside className="flex flex-col gap-4">
            <div className="rounded-[18px] border-2 border-line px-5 py-4">
              <p className="text-[15px] font-bold text-ink-3">Niri diyor</p>
              <p className="mt-1 text-[19px] font-semibold leading-snug text-ink-2">{slide.niri.line}</p>
            </div>
            <div className="rounded-[18px] bg-bg-2 px-5 py-4">
              <p className="text-[15px] font-bold text-ink-3">Sıradaki</p>
              <p className="mt-1 text-[21px] font-bold leading-snug text-ink">{next ? `${place(i + 1)} · ${next.title}` : 'Son slayt'}</p>
            </div>
          </aside>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-line pt-5">
          <p className="text-[15px] font-semibold text-ink-3">← → slayt · R süreyi sıfırlar · sunum penceresi bu pencereyi izler</p>
          <div className="flex gap-3">
            <button type="button" className="btn-line" onClick={() => go(i - 1)} disabled={i === 0}>
              Geri
            </button>
            <button type="button" className="btn-primary" onClick={() => go(i + 1)} disabled={i === last}>
              İleri
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
