// A small teaser of Niri's league costumes: five tier keys, and Niri twirls into the
// one you point at. On wide screens the sticky narrator is the Niri that changes (a
// `niri:gear` event), so there is still one Niri on screen; on phones the teaser has
// its own. The full collection lives on the league page.

import { useState } from 'react';
import Niri from '../ui/Niri';
import NiriTwirl from '../ui/NiriTwirl';
import { emphasise, type Line } from './Say';

export default function Costumes({ tiers }: { tiers: Line[] }) {
  const [gear, setGear] = useState(2);
  const pick = (i: number) => {
    if (i === gear) return;
    setGear(i);
    window.dispatchEvent(new CustomEvent('niri:gear', { detail: i }));
  };
  return (
    <div className="rounded-[20px] border-2 border-dashed border-orange/45 bg-bg/70 p-4 sm:p-5">
      <div className="flex items-center gap-4">
        <span className="say-inline shrink-0" aria-hidden="true">
          <NiriTwirl k={gear}>
            <Niri mood={gear === 4 ? 'cheer' : 'happy'} size={84} gear={gear} />
          </NiriTwirl>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-black leading-snug text-ink">Ligde tırmandıkça Niri giyinir.</p>
          <div className="mt-3 flex flex-wrap gap-1" role="group" aria-label="Lig kıyafetleri">
            {tiers.map((t, i) => (
              <button
                key={t.key}
                type="button"
                aria-pressed={i === gear}
                onClick={() => pick(i)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && pick(i)}
                onFocus={() => pick(i)}
                className={`inline-flex min-h-[40px] items-center gap-1 rounded-full border-2 px-2 text-[13.5px] font-extrabold transition-colors ${
                  i === gear ? 'border-orange bg-orange-tint text-orange-ink' : 'border-line bg-bg text-ink-3 hover:border-line-2'
                }`}
              >
                <svg viewBox="0 0 20 18" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M10 2 18 16H2Z" fill={`rgb(var(--t${i}))`} stroke={`rgb(var(--t${i}))`} strokeWidth="3" strokeLinejoin="round" />
                </svg>
                {t.key}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="say-inline mt-3 min-h-[44px] text-[15px] font-semibold leading-snug text-ink-2" aria-live="polite">
        {emphasise(tiers[gear].text)}
      </p>
      <a href="/lig#niri-koleksiyonu" className="-ml-2 mt-2 inline-block rounded-full px-2 py-1 text-[15px] font-extrabold text-indigo transition-colors hover:bg-indigo-tint">
        Saha defterindeki bütün kıyafetler
      </a>
    </div>
  );
}
