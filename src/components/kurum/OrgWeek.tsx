// Kurum ana sayfasının üstü: "ihtiyaçlarım ne ölçüde karşılanıyor" in four plain facts,
// plus the Monday summary the live service would e-mail. Calm on purpose: no XP, no orange.

import { useState } from 'react';
import { Mail } from 'lucide-react';
import type { Org } from '../../lib/types.ts';
import type { OrgInsight } from '../../lib/engine/insight.ts';
import { skillLabel } from '../../lib/skills.ts';
import { Sheet, Why } from '../ui/kit';
import { Mark } from '../ui/primitives';
import { FIT_MIN } from './NeedBits';

interface Props {
  org: Org;
  ins: OrgInsight;
  /** New verified work in this org's skills over the last 7 days. */
  radar: { total: number; bySkill: { k: string; n: number }[] };
}

export default function OrgWeek({ org, ins, radar }: Props) {
  const [mail, setMail] = useState(false);
  const skills = ins.needs.reduce((n, r) => n + r.total, 0);
  const covered = ins.needs.reduce((n, r) => n + r.covered, 0);
  const facts = [
    {
      value: ins.open ? `${ins.answered}/${ins.open}` : '—',
      label: 'ihtiyacına uygun aday ya da süren proje var',
      tone: ins.open && ins.answered === ins.open ? 'text-green-lip' : 'text-ink',
    },
    {
      value: String(ins.waiting),
      label: ins.waiting ? `aşama onayını bekliyor · en eskisi ${ins.oldestWait} gün` : 'aşama onayını bekliyor',
      tone: ins.waiting ? 'text-indigo' : 'text-ink',
    },
    { value: String(ins.approvedWeek), label: 'aşama bu hafta onaylandı', tone: 'text-ink' },
    {
      value: skills ? `${covered}/${skills}` : '—',
      label: 'istediğin yetkinlik doğrulanmış işle karşılanıyor',
      tone: skills && covered === skills ? 'text-green-lip' : 'text-ink',
    },
  ];

  return (
    <section className="card mt-6 p-4 sm:p-5" aria-labelledby="hafta-ozet">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="hafta-ozet" className="h-sec">
          Bu hafta ihtiyaçların
        </h2>
        <span className="flex items-center gap-1">
          <Why title="Bu sayılar nereden geliyor?">
            <p className="text-[16px] font-bold text-ink-2">Hepsi kurumunun bugünkü durumundan hesaplanır; elle girilmiş bir sayı yoktur.</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] font-semibold text-ink-3">
              <li>Uygun aday: uyum puanı %{FIT_MIN} ve üstü olan genç. Deneme projesi süren ihtiyaçlar da karşılanmış sayılır.</li>
              <li>Onay bekleyen aşama: gencin teslim ettiği, senin henüz onaylamadığın aşamalar.</li>
              <li>Karşılanan yetkinlik: yayındaki ve denemedeki ihtiyaçlarının istediği her yetkinlik için, projeye açık gençlerden en az birinin o alanda Doğrulandı ya da Kurum onaylı işi var mı?</li>
            </ul>
          </Why>
          <button type="button" onClick={() => setMail(true)} className="btn-quiet btn-sm">
            <Mail className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />
            Pazartesi özeti
          </button>
        </span>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {facts.map((f) => (
          <li key={f.label} className="rounded-[16px] bg-bg-2 p-3">
            <span className={`num block text-[26px] font-black leading-none ${f.tone}`}>{f.value}</span>
            <span className="mt-1 block text-[13.5px] font-bold leading-snug text-ink-3">{f.label}</span>
          </li>
        ))}
      </ul>

      <Sheet open={mail} onClose={() => setMail(false)} title="Pazartesi özeti">
        <p className="text-[14px] font-bold text-ink-3">Canlı sürümde bu özet her pazartesi kurumun iletişim adresine gider. Bu demo e-posta göndermez; içerik bugünkü veriden üretildi.</p>
        <div className="mt-4 overflow-hidden rounded-[18px] border-2 border-line">
          <div className="flex items-center gap-3 border-b-2 border-line bg-bg-2 px-4 py-3">
            <Mark className="h-7 w-7" />
            <div className="text-[13px] font-bold text-ink-3">
              <p>
                <b className="text-ink-2">Kimden:</b> nirengi
              </p>
              <p>
                <b className="text-ink-2">Konu:</b> {org.name} · bu haftanın özeti
              </p>
            </div>
          </div>
          <div className="space-y-3 p-4 text-[15px] font-semibold leading-relaxed text-ink-2">
            <p>
              {ins.open ? (
                <>
                  Açık <b className="text-ink">{ins.open}</b> ihtiyacından <b className="text-ink">{ins.answered}</b> tanesine uygun aday ya da süren proje var.
                </>
              ) : (
                'Şu an açık bir ihtiyacın yok. Çözmek istediğin bir problemi yazarak başlayabilirsin.'
              )}
            </p>
            {ins.waiting > 0 && (
              <p>
                <b className="text-ink">{ins.waiting}</b> aşama onayını bekliyor; en eskisi {ins.oldestWait} gündür bekliyor.
              </p>
            )}
            {radar.total > 0 && (
              <p>
                Alanlarında son 7 günde <b className="text-ink">{radar.total}</b> yeni doğrulanmış iş geldi: {radar.bySkill.slice(0, 3).map((x) => `${skillLabel(x.k)} (${x.n})`).join(', ')}.
              </p>
            )}
            <ul className="space-y-1.5 border-t-2 border-line pt-3">
              {ins.needs.map((r) => (
                <li key={r.need.id} className="text-[14px]">
                  <b className="text-ink">{r.need.title}</b>
                  <br />
                  {r.pilot
                    ? `Deneme projesinde: ${r.pilot.approved}/${r.pilot.of} aşama onaylandı.`
                    : `${r.total} yetkinlikten ${r.covered} tanesi doğrulanmış işle karşılanıyor${r.fits ? `, ${r.fits} uygun aday (en iyi %${r.best}).` : '.'}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button type="button" onClick={() => setMail(false)} className="btn-primary btn-block mt-5">
          Tamam
        </button>
      </Sheet>
    </section>
  );
}
