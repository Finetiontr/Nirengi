// "En yakın kapın": the need one verified piece of work away. The ring fills to
// today's fit, then a ghost arc shows where that one piece would take it.

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { State } from '../../lib/types.ts';
import type { PersonInsight } from '../../lib/engine/insight.ts';
import { skillLabel } from '../../lib/skills.ts';
import { useCountUp } from '../ui/kit';
import { Tri } from '../ui/pafta';

function Reach({ from, to, size = 88 }: { from: number; to: number; size?: number }) {
  const reduce = useReducedMotion();
  const shown = useCountUp(from);
  const sw = size * 0.12;
  const r = (size - sw) / 2;
  const len = 2 * Math.PI * r;
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }} role="img" aria-label={`Uyum bugün ${from}, bir işle ${to}`}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--bg-3))" strokeWidth={sw} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgb(var(--green))"
          strokeOpacity={0.35}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${(to / 100) * len} ${len}`}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: [0, 1, 0.55, 1] }}
          transition={{ delay: 0.9, duration: 1.6, repeat: reduce ? 0 : Infinity, repeatDelay: 1.4 }}
        />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--orange))" strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${(shown / 100) * len} ${len}`} />
      </svg>
      <span className="num font-black leading-none text-ink" style={{ fontSize: size * 0.28 }}>
        {shown}
      </span>
    </div>
  );
}

export default function ClosestDoor({ s, closest, more = false }: { s: State; closest: NonNullable<PersonInsight['closest']>; more?: boolean }) {
  const { match: m, skill, to } = closest;
  const org = s.orgs.find((o) => o.id === m.need.orgId);
  return (
    <section className="card relative overflow-hidden p-5" aria-labelledby="kapi">
      <div className="flex items-center gap-2">
        <Tri size={20} tone="orange" state="current" />
        <h2 id="kapi" className="h-sec">
          En yakın kapın
        </h2>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <Reach from={m.score} to={to} />
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-extrabold leading-snug text-ink">{m.need.title}</p>
          <p className="text-[13px] font-bold text-ink-3">{org?.name} · kurgusal demo kurumu</p>
          <p className="mt-2 text-[15px] font-bold leading-snug text-ink-2">
            <b className="text-ink">{skillLabel(skill)}</b> alanında bir doğrulanmış iş eklersen uyumun{' '}
            <b className="num text-ink">{m.score}</b> → <b className="num text-green-lip">{to}</b> olur.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href="/gorevler" className="btn-primary btn-sm">
          Bu alanda görev bul
        </a>
        <a href={`/ihtiyaclar/${m.need.id}`} className="btn-line btn-sm">
          İhtiyaca bak
        </a>
        {more && (
          <a href="/analiz" className="btn-quiet btn-sm ml-auto">
            Tüm analiz
            <ChevronRight className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
          </a>
        )}
      </div>
    </section>
  );
}
