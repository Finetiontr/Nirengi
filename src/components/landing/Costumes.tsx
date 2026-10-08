// A small teaser of Niri's league costumes: five tier keys, and Niri changes into the
// one you point at once the pointer rests (200 ms), with a soft crossfade. This card
// (with its own Niri) is the phone version; on wide screens the chips sit under the
// genç chapter's Niri instead (GencSay). The full collection lives on the league page.

import { useEffect, useState } from 'react';
import Niri from '../ui/Niri';
import { emphasise, useCrossfade, type Line } from './Say';

const REST_MS = 200;

/** The five league keys; `pick` fires on hover (mouse), focus and click. */
export function Chips({ tiers, gear, pick, className = '' }: { tiers: Line[]; gear: number; pick: (i: number) => void; className?: string }) {
  return (
    <div className={`flex-wrap gap-1 ${className}`} role="group" aria-label="Lig kıyafetleri">
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
  );
}

export default function Costumes({ tiers }: { tiers: Line[] }) {
  const [picked, setPicked] = useState(2);
  const [worn, setWorn] = useState(2);
  useEffect(() => {
    const t = window.setTimeout(() => setWorn(picked), REST_MS);
    return () => window.clearTimeout(t);
  }, [picked]);
  const [dressed, fade] = useCrossfade(worn);

  return (
    <div className="rounded-[20px] border-2 border-dashed border-orange/45 bg-bg/70 p-4 sm:p-5">
      <div className="flex items-center gap-4">
        <span className="shrink-0" aria-hidden="true">
          <span className="block transition-opacity duration-150 ease-out" style={{ opacity: fade }}>
            <Niri mood={dressed === 4 ? 'cheer' : 'happy'} size={84} gear={dressed} />
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-black leading-snug text-ink">Ligde tırmandıkça Niri giyinir.</p>
          <Chips tiers={tiers} gear={picked} pick={setPicked} className="mt-3 flex" />
        </div>
      </div>
      <p className="mt-3 min-h-[44px] text-[15px] font-semibold leading-snug text-ink-2" aria-live="polite">
        {emphasise(tiers[worn].text)}
      </p>
      <a href="/lig#niri-koleksiyonu" className="-ml-2 mt-2 inline-block rounded-full px-2 py-1 text-[15px] font-extrabold text-indigo transition-colors hover:bg-indigo-tint">
        Saha defterindeki bütün kıyafetler
      </a>
    </div>
  );
}
