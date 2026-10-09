// "Niri'ye sor": the one small help button of either face. It opens a sheet with
// what this page is for, a way to replay the tour, and the glossary.

import { Sheet } from '../ui/kit';
import Niri from '../ui/Niri';
import { NiriFace, Pip } from './art';
import { glossaryFor, helpFor, type RouteKey } from './tours';
import type { Face } from './util';
import { openDefter } from '../genc/defter';
import { nowBarOn } from '../genc/NowBar';
import { useLift } from '../ui/lift';

interface Props {
  face: Face;
  route: RouteKey;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  /** This page has a tour to replay. */
  hasTour: boolean;
  /** Home page of this face; the fallback tour starts there. */
  home: string;
  onTour: () => void;
  onWelcome: () => void;
}

export default function Help({ face, route, open, onOpen, onClose, hasTour, home, onTour, onWelcome }: Props) {
  const bottom = useLift();
  // On genç pages the Şimdi bar carries the way in, so the key steps back there.
  const key = !(face === 'genc' && nowBarOn());
  return (
    <>
      {key && (
        <button
          type="button"
          onClick={onOpen}
          data-assistant
          aria-haspopup="dialog"
          className="no-print btn-line btn-sm fixed right-4 z-[44] !min-h-11 !gap-1.5 !pl-2.5 !pr-3.5 transition-[bottom] duration-200"
          style={{ bottom: `calc(env(safe-area-inset-bottom) + ${bottom}px)` }}
        >
          <NiriFace size={26} />
          Niri’ye sor
        </button>
      )}

      <Sheet open={open} onClose={onClose} title="Niri’ye sor">
        <div className="flex items-end gap-3">
          <Niri mood="talk" size={72} />
          <p className="relative mb-2 flex-1 rounded-[16px] border-2 border-line bg-bg px-3.5 py-2.5 text-[15px] font-bold leading-snug text-ink-2">
            <span className="absolute -left-[8px] bottom-4 h-3.5 w-3.5 rotate-45 border-b-2 border-l-2 border-line bg-bg" aria-hidden="true" />
            Takıldığın yerde buradayım. Önce bu sayfaya bakalım.
          </p>
        </div>

        <h3 className="mt-6 text-[17px] font-black text-ink">Bu sayfada ne yapabilirim?</h3>
        <ul className="mt-2 space-y-2">
          {helpFor(face, route).map((line) => (
            <li key={line} className="flex gap-2.5 text-[15px] font-semibold leading-relaxed text-ink-2">
              <span className="mt-[7px]">
                <Pip size={11} state="done" />
              </span>
              <span className="min-w-0 flex-1">{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-3">
          {hasTour ? (
            <button type="button" className="btn-primary btn-block" onClick={onTour}>
              Bu sayfayı bana göster
            </button>
          ) : (
            <a href={`${home}?tur=1`} className="btn-primary btn-block">
              Ana sayfayı bana göster
            </a>
          )}
          <button type="button" className="btn-line btn-block" onClick={onWelcome}>
            Baştan anlat
          </button>
          {face === 'genc' && (
            <button
              type="button"
              className="btn-line btn-block"
              onClick={() => {
                onClose();
                window.setTimeout(() => openDefter(), 200);
              }}
            >
              Niri’nin saha defteri
            </button>
          )}
          <button
            type="button"
            className="btn-quiet btn-block !text-ink-3"
            onClick={() => {
              onClose();
              window.dispatchEvent(new Event('nirengi:tour'));
            }}
          >
            Jüri için demo turu
          </button>
        </div>

        <h3 className="mt-8 text-[17px] font-black text-ink">Sözlük</h3>
        <p className="mt-1 text-[14px] font-semibold text-ink-3">Ekranlarda karşına çıkacak sözcükler, düz bir dille.</p>
        <dl className="mt-2 divide-y-2 divide-line">
          {glossaryFor(face).map((g) => (
            <div key={g.term} className="py-3">
              <dt className="flex items-center gap-2 text-[16px] font-black text-ink">
                <Pip size={12} state="now" />
                {g.term}
              </dt>
              <dd className="mt-1 pl-[22px] text-[15px] font-semibold leading-relaxed text-ink-3">{g.text}</dd>
            </div>
          ))}
        </dl>
      </Sheet>
    </>
  );
}
