// The stage deck: one idea per slide, Niri on stage with one short line each.
// Keys: →, Space, PageDown next; ←, PageUp back; Home/End; 1–9 and 0 jump;
// F fullscreen; B blanks the screen; T flips the theme for this visit.
// A click anywhere but a link or key advances. The slide number lives in the
// hash, so a reload or a shared link lands on the same slide.

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import NiriSays from '../ui/NiriSays';
import { SLIDES, type Mark } from './slides';
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

export default function Deck() {
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
      else if (k === 'b' || k === 'B' || k === '.') setBlank((b) => !b);
      else if (k === 't' || k === 'T') {
        const d = document.documentElement;
        d.dataset.theme = d.dataset.theme === 'dark' ? 'light' : 'dark';
      } else hit = false;
      if (hit) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i, go, fullscreen]);

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

  return (
    <div ref={root} className="deck" onClick={onClick} onContextMenu={onContext}>
      <div className="stage">
        {!blank && (
          <>
            <section key={slide.id} className="absolute inset-0" aria-roledescription="slayt" aria-label={`${i + 1} / ${SLIDES.length}: ${slide.title}`}>
              <View />
            </section>

            <div className="narrator" style={{ left: mark.left, bottom: mark.bottom, width: mark.width }} aria-live="polite">
              <NiriSays mood={slide.niri.mood} point={slide.niri.point} size={mark.size} side={mark.side} typing>
                <span className="block px-2 py-1 text-[29px] font-bold leading-[1.3] tracking-[-0.01em] text-ink">{slide.niri.line}</span>
              </NiriSays>
            </div>
          </>
        )}

        {/* A quiet counter: the route so far as small survey markers. */}
        <div className="absolute right-[48px] top-[34px] flex items-center gap-3" aria-hidden="true">
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
          <span className="mono text-[17px] font-bold text-ink-3">
            {i + 1} / {SLIDES.length}
          </span>
        </div>

        {!moved && i === 0 && !blank && (
          <p className="s-in absolute bottom-[30px] left-[64px] flex items-center gap-2 text-[16px] font-semibold text-ink-3" style={{ '--d': '1400ms' } as CSSProperties}>
            <kbd className="s-kbd">→</kbd> ya da <kbd className="s-kbd">boşluk</kbd> ileri
            <span className="mx-2 text-line-2">·</span>
            <kbd className="s-kbd">F</kbd> tam ekran
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
