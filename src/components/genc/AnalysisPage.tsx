// Analiz: Niri reads your week and your work, then says what to do next.
// Everything here comes from engine/insight.ts, so the advice moves with your state.

import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, Mail } from 'lucide-react';
import { currentMe, useAppState } from '../../lib/store.ts';
import { personInsight, type Advice, type Letter, type SkillRead } from '../../lib/engine/insight.ts';
import { progress } from '../../lib/engine/progress.ts';
import { skillLabel } from '../../lib/skills.ts';
import type { Person } from '../../lib/types.ts';
import Niri from '../ui/Niri';
import NiriSays from '../ui/NiriSays';
import { CountUp, Head, Sheet, Why } from '../ui/kit';
import { Bolt, CheckCircle, Flame, Shield } from '../ui/icons';
import { LevelBadge } from '../ui/primitives';
import { Contours, Tri } from '../ui/pafta';
import { WeekStrip } from '../app/matchbits';
import ClosestDoor from './ClosestDoor';

const firstName = (p: Person) => p.name.split(' ')[0];
const ease = [0.16, 1, 0.3, 1] as const;

/** One line Niri leads with, picked from the strongest signal of the week. */
function opener(l: Letter, rising: boolean) {
  if (l.met) return `Bu haftanın hedefi tamam. ${l.streak} haftadır düzenli üretiyorsun, bu çok iyi.`;
  if (l.verified) return `Bu hafta ${l.verified} işin doğrulandı. Kurumlar artık onları daha ağır sayıyor.`;
  if (rising) return 'Son üç ayda üretimin hızlandı. Bu ivme kurumların keşif listesinde öne çıkıyor.';
  if (l.active) return `Bu hafta ${l.active} gün ürettin. Hedefine ${l.goal - l.active} gün kaldı.`;
  return 'Bu hafta henüz üretim görmedim. Küçük bir adım bile seriyi başlatır.';
}

export default function AnalysisPage() {
  const s = useAppState();
  const me = currentMe(s);
  const ins = personInsight(s, me);
  const hist = progress(s, me).history;
  const [mail, setMail] = useState(false);
  const reduce = useReducedMotion();
  const l = ins.letter;
  const asking = (skill: string) => s.needs.filter((n) => n.status === 'published' && n.skills.includes(skill)).map((n) => n.title);

  return (
    <div className="mx-auto max-w-[680px]">
      <NiriSays mood={l.met ? 'cheer' : 'think'} size={104} typing>
        <p className="text-[17px] font-extrabold text-ink">{firstName(me)}, haftanı ve işlerini okudum.</p>
        <p className="text-[15px] font-bold text-ink-3">{opener(l, ins.rising)}</p>
      </NiriSays>

      {/* N3: the weekly letter, the part of Nirengi that reaches you outside the site */}
      <section className="relative mt-5 overflow-hidden rounded-[22px] border-2 border-line bg-bg p-5" aria-labelledby="mektup">
        <Contours opacity={0.5} x={0.92} y={0.15} seed={7} />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <h1 id="mektup" className="h-sec">
              Niri’nin haftalık notu
            </h1>
            <button type="button" onClick={() => setMail(true)} className="chip transition-colors hover:border-indigo/40 hover:text-indigo">
              <Mail className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />
              E-postada gör
            </button>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Fact i={0} icon={<Flame size={30} dim={!l.active} />} value={<>{Math.min(l.active, l.goal)}/{l.goal}</>} label="gün üretim" />
            <Fact
              i={1}
              icon={<Bolt size={30} />}
              value={<CountUp value={l.xp} />}
              label={`XP · geçen hafta ${l.xpPrev}`}
            />
            <Fact i={2} icon={<CheckCircle size={30} />} value={<CountUp value={l.verified} />} label="iş doğrulandı" />
            <Fact i={3} icon={<Shield size={30} tier={2} />} value={l.rank ? `${l.rank}.` : '—'} label={`${l.league} Ligi`} />
          </ul>
          <p className="mt-4 text-[15px] font-bold text-ink-2">
            {l.newNeeds ? (
              <>
                Bu hafta sana uyan <b className="text-ink">{l.newNeeds} yeni ihtiyaç</b> yayımlandı.
              </>
            ) : (
              'Bu hafta sana uyan yeni bir ihtiyaç yayımlanmadı; yayımlanınca ilk sen duyarsın.'
            )}
          </p>
        </div>
      </section>

      {ins.closest && (
        <div className="mt-5">
          <ClosestDoor s={s} closest={ins.closest} />
        </div>
      )}

      <section className="mt-10" aria-labelledby="oneri">
        <Head
          title={<span id="oneri">Sıradaki adımların</span>}
          action={
            <Why title="Öneriler nasıl sıralanıyor?">
              <p className="text-[16px] font-bold text-ink-2">Önce bir kurumun seni beklediği işler gelir, sonra işini güçlendiren adımlar, en son haftalık ritmin.</p>
              <p className="mt-3 text-[15px] font-semibold text-ink-3">
                Beceri önerileri, yayındaki ihtiyaçlardaki eksiklerinden hesaplanır: aynı beceri ne kadar çok ihtiyacı açıyorsa o kadar yukarıda durur. Sayılar eşleşme motorunun o an verdiği puanlardır.
              </p>
            </Why>
          }
        />
        <ol className="mt-4 space-y-3">
          {ins.advice.slice(0, 4).map((a, i) => (
            <AdviceRow key={a.id} a={a} i={i} reduce={!!reduce} />
          ))}
        </ol>
      </section>

      <section className="mt-10" aria-labelledby="guclu">
        <Head title={<span id="guclu">Güçlü olduğun alanlar</span>} />
        {ins.skills.length ? (
          <ul className="card mt-4 divide-y-2 divide-line">
            {ins.skills.slice(0, 6).map((k, i) => (
              <SkillRow key={k.skill} k={k} i={i} />
            ))}
          </ul>
        ) : (
          <div className="card mt-4 flex items-center gap-4 p-5">
            <Niri mood="point" point="right" size={64} />
            <p className="flex-1 text-[15px] font-bold text-ink-2">Henüz bağlı bir işin yok. GitHub’ını bağlarsan güçlü olduğun alanları buraya çizerim.</p>
            <a href="/kanit-bagla" className="btn-primary btn-sm">
              Bağla
            </a>
          </div>
        )}
      </section>

      <section className="mt-10" aria-labelledby="aranan">
        <Head title={<span id="aranan">Kurumlar ne arıyor, sen neredesin</span>} action={<span className="text-[13px] font-bold text-ink-3">Kurumlar kurgusal demo</span>} />
        <ul className="mt-4 space-y-2">
          {ins.wanted.slice(0, 6).map((k) => {
            const lever = ins.levers.find((x) => x.skill === k.skill);
            const max = ins.wanted[0]?.demand || 1;
            return (
              <li key={k.skill} className="flex items-center gap-3 rounded-[14px] bg-bg-2 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-[15.5px] font-extrabold text-ink">
                    {skillLabel(k.skill)}
                    {k.level ? <LevelBadge level={k.level} /> : <span className="pill bg-bg-3 text-ink-3">Sende yok</span>}
                  </p>
                  {max > 1 && (
                    <div className="mt-1.5 flex items-center gap-1.5" aria-hidden="true">
                      {Array.from({ length: max }, (_, n) => (
                        <span key={n} className={`h-2 flex-1 rounded-full ${n < k.demand ? 'bg-ink-3' : 'bg-line'}`} style={{ maxWidth: 28 }} />
                      ))}
                    </div>
                  )}
                  <p className="mt-1 line-clamp-2 text-[13px] font-bold leading-snug text-ink-3">
                    {asking(k.skill).length > 1 ? `${asking(k.skill).length} ihtiyaç istiyor: ` : 'İsteyen: '}
                    {asking(k.skill).join(' · ')}
                  </p>
                </div>
                {lever && lever.gain > 0 && (
                  <span className="num shrink-0 rounded-full bg-green-tint px-2.5 py-1 text-[13px] font-black text-green-ink" title="Bu alanda bir doğrulanmış iş eklersen ihtiyaçlardaki toplam uyum artışı">
                    +{lever.gain}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card mt-10 p-5" aria-labelledby="duzen">
        <h2 id="duzen" className="h-sec">
          Son 10 haftan
        </h2>
        <p className="mt-1 text-[15px] font-bold text-ink-3">Kurumlar adayların düzenine bakıyor. Commit sayısı değil, üretim yaptığın haftalar görünür.</p>
        <div className="mt-4">
          <WeekStrip hist={hist} />
        </div>
      </section>

      <MailPreview open={mail} onClose={() => setMail(false)} me={me} l={l} advice={ins.advice[0]} />
    </div>
  );
}

function Fact({ i, icon, value, label }: { i: number; icon: ReactNode; value: ReactNode; label: string }) {
  return (
    <motion.li
      className="flex flex-col gap-1 rounded-[16px] bg-bg-2 p-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + i * 0.08, duration: 0.4, ease }}
    >
      {icon}
      <span className="num text-[24px] font-black leading-none text-ink">{value}</span>
      <span className="text-[13px] font-bold leading-tight text-ink-3">{label}</span>
    </motion.li>
  );
}

const TONE_TEXT: Record<Advice['tone'], string> = {
  indigo: 'text-indigo',
  orange: 'text-orange-ink',
  cyan: 'text-cyan-ink',
  green: 'text-green-ink',
  purple: 'text-purple',
};

function AdviceRow({ a, i, reduce }: { a: Advice; i: number; reduce: boolean }) {
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ delay: i * 0.07, duration: 0.4, ease }}
    >
      <a href={a.href} className="card-press flex items-center gap-4 p-4">
        <Tri size={44} tone={a.tone} state={i === 0 ? 'current' : 'done'}>
          <span className="num text-[15px] font-black text-white">{i + 1}</span>
        </Tri>
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-extrabold leading-snug text-ink">{a.title}</p>
          <p className="mt-0.5 text-[14px] font-bold leading-snug text-ink-3">{a.why}</p>
        </div>
        <span className={`hidden shrink-0 items-center gap-1 text-[14px] font-extrabold sm:inline-flex ${TONE_TEXT[a.tone]}`}>
          {a.cta}
          <ChevronRight className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-ink-3 sm:hidden" strokeWidth={3} aria-hidden="true" />
      </a>
    </motion.li>
  );
}

function SkillRow({ k, i }: { k: SkillRead; i: number }) {
  const reduce = useReducedMotion();
  return (
    <li className="flex items-center gap-4 px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-[15.5px] font-extrabold text-ink">
          {skillLabel(k.skill)}
          {k.level && <LevelBadge level={k.level} />}
        </p>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-bg-3">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `rgb(var(--${k.level === 'S1' ? 'line-2' : k.level === 'S3' ? 'indigo' : 'cyan'}))` }}
            initial={reduce ? false : { width: 0 }}
            whileInView={{ width: `${Math.round(k.score * 100)}%` }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.7, ease }}
          />
        </div>
      </div>
      <span className="w-[86px] shrink-0 text-right text-[13px] font-bold leading-tight text-ink-3">{k.demand ? `${k.demand} ihtiyaç istiyor` : 'şu an aranmıyor'}</span>
    </li>
  );
}

/** What the Monday e-mail would carry. The demo has no mail server, and says so. */
function MailPreview({ open, onClose, me, l, advice }: { open: boolean; onClose: () => void; me: Person; l: Letter; advice?: Advice }) {
  return (
    <Sheet open={open} onClose={onClose} title="Pazartesi e-postası">
      <p className="text-[14px] font-bold text-ink-3">Canlı sürümde bu not her pazartesi e-postayla gelir. Bu demo e-posta göndermez; içerik bugünkü verinden üretildi.</p>
      <div className="mt-4 overflow-hidden rounded-[18px] border-2 border-line">
        <div className="border-b-2 border-line bg-bg-2 px-4 py-3 text-[13px] font-bold text-ink-3">
          <p>
            <b className="text-ink-2">Kimden:</b> Niri · nirengi
          </p>
          <p>
            <b className="text-ink-2">Konu:</b> {l.met ? `Hedefin tamam, serin ${l.streak} hafta!` : `${firstName(me)}, bu hafta ${Math.max(0, l.goal - l.active)} gün kaldı`}
          </p>
        </div>
        <div className="flex gap-3 p-4">
          <Niri mood={l.met ? 'cheer' : 'wave'} size={56} />
          <div className="min-w-0 flex-1 space-y-2 text-[15px] font-semibold leading-relaxed text-ink-2">
            <p>Merhaba {firstName(me)},</p>
            <p>
              Geçen hafta <b className="text-ink">{l.xpPrev} XP</b> topladın, bu hafta şimdiden <b className="text-ink">{l.xp} XP</b>. {l.goal} günlük hedefinin {Math.min(l.active, l.goal)} günü tamam
              {l.rank ? `; ${l.league} Ligi’nde ${l.rank}. sıradasın` : ''}.
            </p>
            {advice && (
              <p>
                Bu hafta tek bir şey yapacaksan: <b className="text-ink">{advice.title}.</b> {advice.why}
              </p>
            )}
            <p>Haritanda görüşürüz,
              <br />
              Niri
            </p>
          </div>
        </div>
      </div>
      <button type="button" onClick={onClose} className="btn-primary btn-block mt-5">
        Tamam
      </button>
    </Sheet>
  );
}
