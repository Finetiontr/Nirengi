// Kanıt bağla: the parts every step shares: the key, the survey markers on top, Niri’s
// one-line guide and the count of work by verification level.

import { Fragment, type ReactNode } from 'react';
import { Check, ExternalLink, Loader2 } from 'lucide-react';
import type { Level, Person } from '../../../lib/types.ts';
import { LEVELS } from '../../../lib/labels.ts';
import type { Mood } from '../../ui/Niri';
import NiriSays from '../../ui/NiriSays';
import { LevelBadge } from '../../ui/primitives';
import { TriMark } from '../../ui/TriMark';
import { type StepId, countBy } from './flow';

export function Key({
  label,
  href,
  external,
  onClick,
  disabled,
  busy,
  icon,
  className,
}: {
  label: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  busy?: boolean;
  icon?: ReactNode;
  className: string;
}) {
  const inner = (
    <>
      {busy ? <Loader2 className="h-5 w-5 animate-spin" strokeWidth={3} aria-hidden="true" /> : icon}
      {busy ? 'Kontrol ediliyor…' : label}
    </>
  );
  if (href)
    return (
      <a href={href} className={className} onClick={onClick} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
        {inner}
        {external && <ExternalLink className="h-4 w-4 opacity-80" strokeWidth={3} aria-hidden="true" />}
      </a>
    );
  return (
    <button type="button" disabled={disabled} aria-busy={busy} onClick={() => !busy && onClick?.()} className={`${className} ${busy ? 'pointer-events-none' : ''}`}>
      {inner}
    </button>
  );
}

/** Survey markers joined by a line: done = filled with a check, current = filled with a ripple, next = outline. */
export function Steps({ flow, reached }: { flow: StepId[]; reached: number }) {
  return (
    <div className="flex min-w-0 flex-1 items-center" role="progressbar" aria-label="Adımlar" aria-valuemin={0} aria-valuemax={flow.length} aria-valuenow={reached}>
      {flow.map((id, i) => {
        const done = i < reached;
        const current = i === reached;
        return (
          <Fragment key={id}>
            {i > 0 && (
              <span className="relative mx-1 h-[4px] min-w-2 flex-1 translate-y-[2px] overflow-hidden rounded-full bg-bg-3" aria-hidden="true">
                <span className={`absolute inset-0 origin-left rounded-full bg-indigo transition-transform duration-300 ease-out ${i <= reached ? 'scale-x-100' : 'scale-x-0'}`} />
              </span>
            )}
            <span key={done ? 'done' : current ? 'current' : 'next'} className={`relative grid h-8 w-8 shrink-0 place-items-center ${done ? 'pop' : ''}`} aria-hidden="true">
              {current && (
                <>
                  <span className="ping-soft absolute left-1/2 top-[62%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'rgb(var(--indigo) / 0.35)' }} />
                  <span className="ping-soft absolute left-1/2 top-[62%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'rgb(var(--indigo) / 0.25)', animationDelay: '1.1s' }} />
                </>
              )}
              {done || current ? (
                <TriMark size={current ? 30 : 26} color="indigo" lip={!current}>
                  {done ? <Check className="h-3 w-3 text-white" strokeWidth={4.5} /> : <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </TriMark>
              ) : (
                <TriMark size={26} color="ink-4" variant="outline" />
              )}
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}

/** Niri says what this step is for, in one sentence. */
export function Guide({ mood, children }: { mood: Mood; children: ReactNode }) {
  return (
    <NiriSays mood={mood} size={92} typing>
      <p className="text-[16px] font-extrabold leading-snug text-ink">{children}</p>
    </NiriSays>
  );
}

export function LevelCounts({ me }: { me: Person }) {
  return (
    <ul className="card divide-y-2 divide-line">
      {(['S1', 'S2', 'S3'] as Level[]).map((l) => {
        const n = countBy(me, l);
        return (
          <li key={l} className={`flex items-center justify-between gap-3 px-4 py-3 ${n ? '' : 'opacity-50'}`}>
            <LevelBadge level={l} />
            <span className="num text-[22px] font-black text-ink">
              {n}
              <span className="text-[14px] font-bold text-ink-3"> iş</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const weight = (l: Level) => LEVELS[l].weight.toLocaleString('tr-TR');

export const LEVEL_WHY = (
  <div className="space-y-3 text-[16px] font-bold text-ink-2">
    <p>
      <b>Beyan:</b> kendi sözün ve paylaştığın bağlantılar. Profilinde görünür ama eşleşmede en düşük ağırlığı taşır ({weight("S1")}).
    </p>
    <p>
      <b>Doğrulandı:</b> GitHub hesabının ya da alan adının senin olduğunu makine kontrol etti. Ağırlığı {weight("S2")}.
    </p>
    <p>
      <b>Kurum onaylı:</b> birlikte çalıştığın kurum bir aşamayı imzaladı. En güçlü kanıt ({weight("S3")}); deneme projesinden sonra oluşur.
    </p>
  </div>
);
