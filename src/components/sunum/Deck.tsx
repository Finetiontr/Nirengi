// The stage deck: one idea per slide, Niri on stage with two or three short bubbles a slide, each
// the headline of the line the team says next. The bubbles move on by themselves at the pace the
// team speaks (beats.ts); Niri is silent and the presenters only change slides.
// The organisers' twelve steps, then an appendix of detail pages after the close for questions.
// Keys: →, Space, Enter, PageDown or a click: next slide; ←, PageUp, Backspace or a right click: previous;
// Home/End (the close; → goes on into the appendix); 1–9 and 0 jump; P pauses or resumes the
// bubbles (and the film on its slide); F fullscreen; B blanks the screen; N opens the presenter
// window (/sunum?notlar), which follows the deck bubble by bubble and can drive it. The slide
// number lives in the hash, so a reload or a shared link lands on the same slide; #n.k holds
// bubble k of slide n (for the export).

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import StageNiri from './StageNiri';
import Presenter, { CHANNEL, type Msg } from './Presenter';
import { useBeats } from './beats';
import { CLOSE, FILM, linesOf, moodOf, place, SLIDES, TALK, type Mark } from './slides';
import './sunum.css';

/** Where Niri stands: the box is anchored by its bottom-left corner on the 1600×900 stage. */
const MARKS: Record<Mark, { left: number; bottom: number; width: number; size: number; side: 'left' | 'right' }> = {
  hero: { left: 560, bottom: 92, width: 940, size: 240, side: 'left' },
  dock: { left: 64, bottom: 34, width: 690, size: 150, side: 'right' },
};

const last = SLIDES.length - 1;
const clamp = (i: number) => Math.max(0, Math.min(last, i));

/** "#5" is slide 5; "#5.2" holds its second bubble. */
function fromHash(): { i: number; hold: number | null } {
  const [a, b] = location.hash.slice(1).split('.');
  const n = Number.parseInt(a, 10);
  const i = Number.isFinite(n) ? clamp(n - 1) : 0;
  const k = Number.parseInt(b ?? '', 10);
  return { i, hold: Number.isFinite(k) ? Math.max(0, Math.min(linesOf(i).length - 1, k - 1)) : null };
}

function Stage() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState<number | null>(null);
  const [moved, setMoved] = useState(false);
  const [blank, setBlank] = useState(false);
  const [notice, setNotice] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const noticeTimer = useRef(0);
  const beats = useBeats(i, hold);
  const k = beats.k;

  const go = useCallback((n: number) => {
    setBlank(false);
    setHold(null);
    setI((cur) => {
      const next = clamp(n);
      if (next !== cur) setMoved(true);
      return next;
    });
  }, []);

  const say = useCallback((text: string) => {
    setNotice(text);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3200);
  }, []);

  const fullscreen = useCallback(() => {
    const d = document;
    if (d.fullscreenElement) {
      d.exitFullscreen?.().catch(() => {});
      return;
    }
    const req = d.documentElement.requestFullscreen?.();
    if (!req) say('Tam ekran desteklenmiyor; tarayıcıda F11 ile aç.');
    else req.catch(() => say('Tam ekran açılamadı; F11 ile dene.'));
  }, [say]);

  // The hash is the source of truth on load and on back/forward.
  useEffect(() => {
    const read = () => {
      const h = fromHash();
      setI(h.i);
      setHold(h.hold);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  // The presenter window follows the deck and can drive it.
  const channel = useRef<BroadcastChannel | null>(null);
  const atRef = useRef({ i, k });
  atRef.current = { i, k };
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(CHANNEL);
    channel.current = ch;
    ch.onmessage = (e: MessageEvent<Msg>) => {
      if (e.data.type === 'go') go(e.data.i);
      else if (e.data.type === 'hello') ch.postMessage({ type: 'at', ...atRef.current } satisfies Msg);
    };
    return () => {
      ch.close();
      channel.current = null;
    };
  }, [go]);
  useEffect(() => channel.current?.postMessage({ type: 'at', i, k } satisfies Msg), [i, k]);

  const notes = useCallback(() => {
    const w = window.open(`/sunum?notlar#${i + 1}`, 'nirengi-notlar', 'width=1100,height=760');
    if (!w) say('Açılır pencere engellendi; /sunum?notlar adresini ayrı bir pencerede aç.');
  }, [i, say]);

  // The film streams from the site: fetch it once early so it starts at once on stage.
  useEffect(() => {
    const t = window.setTimeout(() => fetch(FILM).catch(() => {}), 2000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    // The prerendered stage also mounts first in the presenter window: leave its hash for it.
    if (new URLSearchParams(location.search).has('notlar')) return;
    const want = hold === null ? `#${i + 1}` : `#${i + 1}.${hold + 1}`;
    if (location.hash !== want) history.replaceState(null, '', want);
    document.title = `${i + 1}. ${SLIDES[i].title} · nirengi sunum`;
  }, [i, hold]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key;
      let hit = true;
      if (key === 'ArrowRight' || key === 'ArrowDown' || key === 'PageDown' || key === ' ' || key === 'Enter') {
        // Enter on a focused link or key keeps its own meaning.
        if (key === 'Enter' && (e.target as HTMLElement).closest?.('a,button')) return;
        go(i + 1);
      } else if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 'PageUp' || key === 'Backspace') go(i - 1);
      else if (key === 'Home') go(0);
      else if (key === 'End') go(CLOSE);
      else if (/^[0-9]$/.test(key)) go(key === '0' ? 9 : Number(key) - 1);
      else if (key === 'p' || key === 'P') {
        // On the film slide the film takes P itself.
        if (!SLIDES[i].bare) beats.toggle();
      } else if (key === 'f' || key === 'F') fullscreen();
      else if (key === 'n' || key === 'N') notes();
      else if (key === 'b' || key === 'B' || key === '.') setBlank((b) => !b);
      else hit = false;
      if (hit) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i, go, beats.toggle, fullscreen, notes]);

  // The cursor hides after a moment of stillness so it never sits on a slide.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let t = 0;
    const wake = () => {
      el.removeAttribute('data-idle');
      window.clearTimeout(t);
      t = window.setTimeout(() => el.setAttribute('data-idle', ''), 2500);
    };
    wake();
    window.addEventListener('pointermove', wake, { passive: true });
    return () => {
      window.removeEventListener('pointermove', wake);
      window.clearTimeout(t);
    };
  }, []);

  const onClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('a,button')) return;
    go(i + 1);
  };
  const onContext = (e: MouseEvent) => {
    e.preventDefault();
    go(i - 1);
  };

  const slide = SLIDES[i];
  const mark = MARKS[slide.mark];
  const bare = !!slide.bare;
  // The slide itself does not change while the bubbles move on: render it once per slide.
  const view = useMemo(() => {
    const View = SLIDES[i].View;
    return <View />;
  }, [i]);

  return (
    <div ref={root} className="deck" onClick={onClick} onContextMenu={onContext}>
      <div className="stage">
        {!blank && (
          <section key={slide.id} className="absolute inset-0" aria-roledescription="slayt" aria-label={`${place(i)}: ${slide.title}`}>
            {view}
          </section>
        )}

        {/* Niri stays mounted across slides (a blank screen, the film) so every change is a twirl. */}
        <div className={`narrator ${blank || bare ? 'invisible' : ''}`} style={{ left: mark.left, bottom: mark.bottom, width: mark.width }} aria-live="polite">
          <StageNiri line={{ key: `${slide.id}:${k}`, scene: slide.id, ...slide.niri, mood: beats.talking ? 'talk' : moodOf(i, k), text: linesOf(i)[k], size: mark.size, side: mark.side }} />
        </div>

        {/* A quiet counter: the talk's route so far as small survey markers; the appendix keeps them all filled. */}
        <div className={`absolute right-[48px] top-[34px] flex items-center gap-3 ${bare ? 'invisible' : ''}`} aria-hidden="true">
          {beats.paused && <span className="mono text-[17px] font-bold text-ink-3">duraklatıldı ·</span>}
          <div className="flex items-end gap-[5px]">
            {SLIDES.slice(0, TALK).map((s, n) => (
              <svg key={s.id} viewBox="0 0 12 11" width={n === i ? 16 : 11} height={n === i ? 15 : 10} className="block">
                <path
                  d="M6 1.2 11 10H1Z"
                  strokeLinejoin="round"
                  strokeWidth="1.6"
                  fill={n <= i ? 'rgb(var(--indigo))' : 'none'}
                  stroke={n <= i ? 'rgb(var(--indigo))' : 'rgb(var(--line-2))'}
                />
              </svg>
            ))}
          </div>
          <span className="mono text-[17px] font-bold text-ink-3">{place(i)}</span>
        </div>

        {!moved && i === 0 && hold === null && !blank && (
          <p className="s-in absolute bottom-[30px] left-[64px] flex items-center gap-2 text-[16px] font-semibold text-ink-3" style={{ '--d': '1400ms' } as CSSProperties}>
            <kbd className="s-kbd">→</kbd> ya da <kbd className="s-kbd">boşluk</kbd> ileri
            <span className="mx-2 text-line-2">·</span>
            <kbd className="s-kbd">F</kbd> tam ekran
            <span className="mx-2 text-line-2">·</span>
            <kbd className="s-kbd">N</kbd> konuşmacı notları
          </p>
        )}

        {notice && (
          <p role="status" className="s-in absolute bottom-[34px] left-1/2 -translate-x-1/2 rounded-[14px] border-2 border-line bg-bg px-5 py-3 text-[20px] font-bold text-ink-2">
            {notice}
          </p>
        )}
      </div>
    </div>
  );
}

/** The deck, or with ?notlar the presenter window that follows it. */
export default function Deck() {
  // Decided after hydration: the prerendered page is the stage.
  const [notes, setNotes] = useState(false);
  useEffect(() => setNotes(new URLSearchParams(location.search).has('notlar')), []);
  return notes ? <Presenter /> : <Stage />;
}
