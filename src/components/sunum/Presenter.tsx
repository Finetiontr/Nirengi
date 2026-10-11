// The presenter window (/sunum?notlar, or N on the deck): the slide on screen as Niri's bubbles,
// each with what to say under it and how long the bubble stays (the one on stage highlighted),
// the next slide, and a clock against the planned pace of the talk; from the close on (and in the
// appendix after it), short answers for the likely questions. It follows the deck over a
// BroadcastChannel and changes slides with the same keys.

import { useCallback, useEffect, useRef, useState } from 'react';
import { NOTES, QA } from './notes';
import { CLOSE, linesOf, paced, place, SLIDES } from './slides';
import { beatSec } from './timing';

export const CHANNEL = 'nirengi:sunum';
export type Msg = { type: 'at'; i: number; k: number } | { type: 'go'; i: number } | { type: 'hello' };

const last = SLIDES.length - 1;
const clamp = (i: number) => Math.max(0, Math.min(last, i));
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const secOf = (id: string) => NOTES[id]?.sec ?? 0;
/** Planned seconds before each slide starts. */
const START = SLIDES.reduce<number[]>((acc, s, n) => [...acc, n ? acc[n - 1] + secOf(SLIDES[n - 1].id) : 0], []);
/** The talk ends with the close; appendix pages have no planned time. */
const TOTAL = START[CLOSE] + secOf(SLIDES[CLOSE].id);

export default function Presenter() {
  const [i, setI] = useState(() => clamp((Number.parseInt(location.hash.slice(1), 10) || 1) - 1));
  const [k, setK] = useState(0);
  const [t0, setT0] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const channel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    document.title = 'Notlar · nirengi sunum';
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(CHANNEL);
    channel.current = ch;
    ch.onmessage = (e: MessageEvent<Msg>) => {
      if (e.data.type !== 'at') return;
      setI(clamp(e.data.i));
      setK(e.data.k);
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
    setK(0);
    channel.current?.postMessage({ type: 'go', i: next } satisfies Msg);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key;
      let hit = true;
      if (key === 'ArrowRight' || key === 'ArrowDown' || key === 'PageDown' || key === ' ') go(i + 1);
      else if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 'PageUp') go(i - 1);
      else if (key === 'Home') go(0);
      else if (key === 'End') go(CLOSE);
      else if (key === 'r' || key === 'R') setT0(Date.now());
      else hit = false;
      if (hit) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i, go]);

  const slide = SLIDES[i];
  const next = SLIDES[i + 1];
  const note = NOTES[slide.id];
  const stepped = paced(i);
  const elapsed = (now - t0) / 1000;
  const drift = elapsed - START[i];

  return (
    <div className="fixed inset-0 overflow-auto bg-bg text-ink-2">
      <div className="mx-auto flex min-h-full max-w-[1200px] flex-col gap-6 px-8 py-7">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-line pb-5">
          <div>
            <p className="mono text-[18px] font-bold text-ink-3">
              {place(i)}
              {stepped && ` · Niri ${k + 1} / ${linesOf(i).length}`}
            </p>
            <h1 className="text-[40px] font-extrabold leading-tight tracking-[-0.03em] text-ink">{slide.title}</h1>
          </div>
          <div className="text-right">
            <p className="mono text-[40px] font-bold leading-none text-ink">{mmss(elapsed)}</p>
            {slide.extra ? (
              <p className="mt-2 text-[16px] font-semibold text-ink-3">Ek sayfa: konuşmanın dışında, soru gelirse açılır · konuşma {mmss(TOTAL)}</p>
            ) : (
              <>
                <p className="mt-2 text-[16px] font-semibold text-ink-3">
                  Plan: başlangıç {mmss(START[i])} · süre {mmss(note?.sec ?? 0)} · toplam {mmss(TOTAL)}
                </p>
                <p className={`text-[16px] font-bold ${drift > 30 ? 'text-red-lip' : 'text-ink-3'}`}>
                  {Math.abs(drift) < 10 ? 'Tam zamanında' : drift > 0 ? `${mmss(drift)} geridesin` : `${mmss(-drift)} öndesin`}
                </p>
              </>
            )}
          </div>
        </header>

        <main className="grid flex-1 gap-8 md:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            {note?.key && (
              <p className="rounded-[18px] bg-indigo-tint px-5 py-4 text-[22px] font-bold leading-[1.35] text-indigo">
                <span className="block text-[15px] font-bold text-ink-3">Kritik nokta</span>
                {note.key}
              </p>
            )}
            {note?.lead && <p className="text-[20px] font-bold leading-[1.4] text-ink-3">{note.lead}</p>}
            {/* Niri's bubble, then what to say under it; the one on stage is ringed, the ones said are quiet. */}
            <ol className="flex flex-col gap-3">
              {(note?.beats ?? []).map((b, n) => {
                const live = stepped && n === k;
                const done = stepped && n < k;
                const when = b.at !== undefined ? mmss(b.at) : stepped ? `${beatSec(b.say).toFixed(1).replace('.', ',')} sn` : 'Cevap';
                return (
                  <li key={n} className={`rounded-[18px] px-5 py-4 ${live ? 'bg-bg ring-[3px] ring-indigo' : ''} ${done ? 'opacity-45' : ''}`}>
                    <p className={`flex items-baseline gap-3 text-[19px] font-extrabold leading-snug ${live ? 'text-indigo' : 'text-ink-3'}`}>
                      <span className="mono shrink-0 text-[15px] font-bold">{when}</span>
                      <span>“{b.text}”</span>
                    </p>
                    <p className={`mt-1 font-semibold leading-[1.4] text-ink ${b.at !== undefined ? 'text-[21px]' : 'text-[25px]'}`}>
                      {stepped && <span className="text-ink-3">Söyle: </span>}
                      {b.say}
                    </p>
                  </li>
                );
              })}
            </ol>
            {i >= CLOSE && (
              <section className="border-t-2 border-line pt-5">
                <h2 className="text-[18px] font-bold text-ink-3">Soru gelirse</h2>
                <dl className="mt-3 flex flex-col gap-4">
                  {QA.map((a) => (
                    <div key={a.q}>
                      <dt className="text-[20px] font-bold text-ink">{a.q}</dt>
                      <dd className="mt-1 text-[17px] font-semibold leading-[1.45] text-ink-2">{a.say.join(' ')}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>
          <aside className="flex flex-col gap-4">
            <div className="rounded-[18px] border-2 border-line px-5 py-4">
              <p className="text-[15px] font-bold text-ink-3">Sahnede</p>
              <p className="mt-1 text-[19px] font-semibold leading-snug text-ink-2">{slide.bare ? 'Film oynuyor.' : `Niri’nin balonu: “${linesOf(i)[k]}”`}</p>
            </div>
            <div className="rounded-[18px] bg-bg-2 px-5 py-4">
              <p className="text-[15px] font-bold text-ink-3">Sıradaki sayfa (→)</p>
              {next ? (
                <>
                  <p className="mt-1 text-[21px] font-bold leading-snug text-ink">
                    {place(i + 1)} · {next.title}
                  </p>
                  {!next.bare && <p className="mt-1 text-[17px] font-semibold leading-snug text-ink-2">“{linesOf(i + 1)[0]}”</p>}
                </>
              ) : (
                <p className="mt-1 text-[21px] font-bold leading-snug text-ink">Son slayt</p>
              )}
            </div>
          </aside>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-line pt-5">
          <p className="text-[15px] font-semibold text-ink-3">← → sayfa · R süreyi sıfırlar · sunum penceresi bu pencereyi izler</p>
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
