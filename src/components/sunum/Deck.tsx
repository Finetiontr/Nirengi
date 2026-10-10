// The stage deck: one idea per slide, Niri on stage with one short line each.
// Twelve slides in the organisers' order; questions are answered from the notes.
// Keys: →, Space, PageDown next; ←, PageUp back; Home/End (the close); 1–9 and 0 jump;
// F fullscreen; B blanks the screen; T flips the theme for this visit; N opens the
// presenter window (/sunum?notlar) with the speaker notes, which follows the deck
// and can drive it. A click anywhere but a link or key advances. The slide number
// lives in the hash, so a reload or a shared link lands on the same slide.

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import StageNiri from './StageNiri';
import Presenter, { CHANNEL, type Msg } from './Presenter';
import { FILM, place, SLIDES, type Mark } from './slides';
import './sunum.css';

/** Where Niri stands: the box is anchored by its bottom-left corner on the 1600×900 stage. */
const MARKS: Record<Mark, { left: number; bottom: number; width: number; size: number; side: 'left' | 'right' }> = {
  hero: { left: 560, bottom: 92, width: 940, size: 240, side: 'left' },
  dock: { left: 64, bottom: 34, width: 690, size: 150, side: 'right' },
};

const last = SLIDES.length - 1;
const clamp = (i: number) => Math.max(0, Math.min(last, i));

function fromHash(): number {
  const n = Number.parseInt(location.hash.slice(1), 10);
  return Number.isFinite(n) ? clamp(n - 1) : 0;
}

function Stage() {
  const [i, setI] = useState(0);
  const [moved, setMoved] = useState(false);
  const [blank, setBlank] = useState(false);
  const [notice, setNotice] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const noticeTimer = useRef(0);

  const go = useCallback((n: number) => {
    setBlank(false);
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
    setI(fromHash());
    const onHash = () => setI(fromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // The presenter window follows the deck and can drive it.
  const channel = useRef<BroadcastChannel | null>(null);
  const iRef = useRef(i);
  iRef.current = i;
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(CHANNEL);
    channel.current = ch;
    ch.onmessage = (e: MessageEvent<Msg>) => {
      if (e.data.type === 'go') go(e.data.i);
      else if (e.data.type === 'hello') ch.postMessage({ type: 'at', i: iRef.current } satisfies Msg);
    };
    return () => {
      ch.close();
      channel.current = null;
    };
  }, [go]);
  useEffect(() => channel.current?.postMessage({ type: 'at', i } satisfies Msg), [i]);

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
    const want = `#${i + 1}`;
    if (location.hash !== want) history.replaceState(null, '', want);
    document.title = `${i + 1}. ${SLIDES[i].title} · nirengi sunum`;
  }, [i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      let hit = true;
      if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Enter') {
        // Enter on a focused link or key keeps its own meaning.
        if (k === 'Enter' && (e.target as HTMLElement).closest?.('a,button')) return;
        go(i + 1);
      } else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || k === 'Backspace') go(i - 1);
      else if (k === 'Home') go(0);
      else if (k === 'End') go(last);
      else if (/^[0-9]$/.test(k)) go(k === '0' ? 9 : Number(k) - 1);
      else if (k === 'f' || k === 'F') fullscreen();
      else if (k === 'n' || k === 'N') notes();
      else if (k === 'b' || k === 'B' || k === '.') setBlank((b) => !b);
      else if (k === 't' || k === 'T') {
        const d = document.documentElement;
        d.dataset.theme = d.dataset.theme === 'dark' ? 'light' : 'dark';
      } else hit = false;
      if (hit) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i, go, fullscreen, notes]);

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
  const View = slide.View;
  const mark = MARKS[slide.mark];
  const bare = !!slide.bare;

  return (
    <div ref={root} className="deck" onClick={onClick} onContextMenu={onContext}>
      <div className="stage">
        {!blank && (
          <>
            <section key={slide.id} className="absolute inset-0" aria-roledescription="slayt" aria-label={`${place(i)}: ${slide.title}`}>
              <View />
            </section>

          </>
        )}

        {/* Niri stays mounted across slides (a blank screen, the film) so every change is a twirl. */}
        <div className={`narrator ${blank || bare ? 'invisible' : ''}`} style={{ left: mark.left, bottom: mark.bottom, width: mark.width }} aria-live="polite">
          <StageNiri line={{ key: slide.id, ...slide.niri, text: slide.niri.line, size: mark.size, side: mark.side }} />
        </div>

        {/* A quiet counter: the talk's route so far as small survey markers. */}
        <div className={`absolute right-[48px] top-[34px] flex items-center gap-3 ${bare ? 'invisible' : ''}`} aria-hidden="true">
          <div className="flex items-end gap-[5px]">
            {SLIDES.map((s, n) => (
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

        {!moved && i === 0 && !blank && (
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
