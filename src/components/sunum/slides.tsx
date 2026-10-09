// The slides. Each one carries a single idea, laid out on the 1600×900 stage,
// plus Niri's line for it. Niri stands on one of two marks (see Deck): 'hero'
// on the right for the opening and the close, 'dock' bottom-left elsewhere, so
// every slide keeps that corner (x < 760, y > 700) free.
//
// The twelve main slides follow the flow the organisers recommended: team, problem,
// for whom, evidence, solution, demo (the film), what the AI does, its before and
// after, the guard against wrong output, design decisions, done and left, close.
// After the close come appendix slides for questions. Numbers come from
// docs/PAZAR-ANALIZI.md with their sources on the slide; product numbers from the
// engine, and the AI slides run a real model answer through the product's own guard.
// Nothing here is invented: plans are labelled as plans, and people and institutions
// in the demo are fictional and the deck says so. No third-party brand names.

import { useState, type CSSProperties, type ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import type { Dir, Mood } from '../ui/Niri';
import { Contours, Tri } from '../ui/pafta';
import { SurveyFlag } from '../ui/kit';
import { LevelGlyph } from '../ui/primitives';
import { Bolt, Compass, Flame, Mark as BrandMark, Route, Shield } from '../ui/icons';
import type { Canvas } from '../../lib/types.ts';
import { assessCanvas, filledFields, PUBLISH_THRESHOLD, SAMPLE_COMPLAINT } from '../../lib/engine/canvas.ts';
import { cites, readModelDraft, readRulesDraft } from '../../lib/engine/ground.ts';
import { GENESIS, sha256, shortHash } from '../../lib/engine/ledger.ts';
import { WEIGHTS } from '../../lib/engine/match.ts';
import { TIERS, XP } from '../../lib/engine/progress.ts';
import { INVENTED_DECIDER, SAMPLE_READING } from './reading.ts';

export type Mark = 'hero' | 'dock';

export interface Slide {
  id: string;
  title: string;
  mark: Mark;
  /** Kept for questions: shown after the close, outside the twelve-step count. */
  appendix?: boolean;
  /** The view owns the whole stage (the film): Niri and the counter step aside. */
  bare?: boolean;
  /** Niri's line. `gear` is the league costume (climbing toward Zirve by the close); `turns` the twirl into it. */
  niri: { mood: Mood; line: string; point?: Dir; gear?: number; turns?: 1 | 2 };
  View: () => ReactNode;
}

const TEAM = ['Sezer Uzun', 'Emirhan Açık'];
const SITE = 'finetiontr.github.io/Nirengi';

/** The promo film, served from the site; Deck fetches it early so it starts at once. */
export const FILM = '/sunum/nirengi-tanitim-web.mp4';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;
const f = (n: number) => n.toLocaleString('tr-TR');

function Heading({ children, width = 1180, className = '' }: { children: ReactNode; width?: number; className?: string }) {
  return (
    <h2 className={`s-h s-in absolute left-[112px] top-[92px] ${className}`} style={{ maxWidth: width }}>
      {children}
    </h2>
  );
}

/** A figure's source, small and quiet under it. */
function Src({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`s-cap !text-[16px] ${className}`}>{children}</p>;
}

function Wordmark({ size }: { size: number }) {
  return (
    <span className="flex items-center" style={{ gap: size * 0.16 }}>
      <BrandMark size={size * 0.9} />
      <span className="font-black leading-none text-indigo" style={{ fontSize: size, letterSpacing: '-0.04em' }}>
        nirengi
      </span>
    </span>
  );
}

/** "You are here": two staggered ripple rings under a marker. */
function Ping({ tone = 'indigo', size = 90 }: { tone?: string; size?: number }) {
  return (
    <>
      <span className="ping-soft absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: size, height: size, background: `rgb(var(--${tone}) / 0.3)` }} />
      <span
        className="ping-soft absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: size, height: size, background: `rgb(var(--${tone}) / 0.2)`, animationDelay: '1.1s' }}
      />
    </>
  );
}

function Tag({ who, children }: { who: 'genc' | 'kurum' | 'plan'; children: ReactNode }) {
  const tone = who === 'genc' ? 'bg-cyan-tint text-cyan-lip' : who === 'kurum' ? 'bg-indigo-tint text-indigo' : 'bg-bg-3 text-ink-2';
  return <span className={`pill !px-[12px] !text-[17px] ${tone}`}>{children}</span>;
}

/** A real screen of the app, captured at 390 px, in a plain device frame. */
function Phone({ src, alt, width }: { src: string; alt: string; width: number }) {
  return (
    <div className="rounded-[40px] bg-[#16142a] p-[9px] ring-2 ring-line" style={{ width }}>
      <img src={src} alt={alt} width={780} height={1688} draggable={false} className="block h-auto w-full rounded-[31px]" />
    </div>
  );
}

// ---------------------------------------------------------------- 1. title and team

function Title() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Contours seed={2} x={0.86} y={0.78} rings={14} step={34} opacity={0.55} />
      </div>
      <div className="absolute left-[112px] top-[150px] w-[900px]">
        <div className="s-in">
          <Wordmark size={156} />
        </div>
        <p className="s-in mt-[44px] text-[84px] font-extrabold leading-none tracking-[-0.04em] text-ink" style={d(140)}>
          Beyan değil, kanıt.
        </p>
        <p className="s-in mt-[30px] max-w-[760px] text-[30px] font-medium leading-[1.35] text-ink-3" style={d(260)}>
          Gençlerin doğrulanmış işini kurumların ihtiyaçlarıyla buluşturan açık kaynak altyapı.
        </p>
      </div>
      <div className="s-in absolute left-[112px] top-[730px]" style={d(380)}>
        <p className="text-[28px] font-bold text-ink">{TEAM.join(' · ')}</p>
        <p className="s-cap mt-[8px]">Zemin360 Hackathon finali · İstanbul · Ekim 2026</p>
      </div>
      <SurveyFlag size={96} delay={0.6} className="absolute left-[1478px] top-[694px]" />
    </>
  );
}

// ---------------------------------------------------------------- 2. problem: two sides, sourced

function Problem() {
  return (
    <>
      <Heading width={1400}>Deneyim yoksa iş yok. İş yoksa deneyim yok.</Heading>

      {/* Genç: ends above Niri's corner. */}
      <div className="s-in absolute left-[112px] top-[214px] w-[640px]" style={d(120)}>
        <div className="flex items-center gap-[14px]">
          <Tag who="genc">Genç</Tag>
          <p className="s-t !text-[28px]">görünmüyor</p>
        </div>
        <p className="num mt-[22px] text-[104px] font-extrabold leading-none tracking-[-0.045em] text-ink">%23,3</p>
        <p className="mt-[12px] text-[24px] font-semibold leading-[1.3] text-ink-2">15–24 yaşta ne eğitimde ne istihdamda olanlar. 2024’te AB ülkeleriyle kıyaslandığında en yüksek oran.</p>
        <Src className="mt-[8px]">TÜİK, 2025 · Betam ve Eurostat, 2024</Src>
        <div className="mt-[22px] flex items-baseline gap-[18px] border-t-2 border-line pt-[18px]">
          <p className="num text-[44px] font-extrabold leading-none tracking-[-0.03em] text-ink">%13,0</p>
          <div>
            <p className="text-[21px] font-semibold leading-[1.3] text-ink-2">15–24 yaş işsizliği; genç kadınlarda %19,4</p>
            <Src>TÜİK, Ağustos 2026</Src>
          </div>
        </div>
      </div>

      {/* Kurum. */}
      <div className="s-in absolute left-[848px] top-[214px] w-[640px]" style={d(260)}>
        <div className="flex items-center gap-[14px]">
          <Tag who="kurum">Kurum</Tag>
          <p className="s-t !text-[28px]">emin olamıyor</p>
        </div>
        <p className="num mt-[22px] text-[104px] font-extrabold leading-none tracking-[-0.045em] text-ink">%71,0</p>
        <p className="mt-[12px] text-[24px] font-semibold leading-[1.3] text-ink-2">BİT uzmanı almakta zorlanan girişimlerin “ilgili iş deneyimi yok” diyen payı.</p>
        <Src className="mt-[8px]">TÜİK, Girişimlerde BİT Kullanımı 2025</Src>
        <div className="mt-[22px] flex items-baseline gap-[18px] border-t-2 border-line pt-[18px]">
          <p className="num text-[44px] font-extrabold leading-none tracking-[-0.03em] text-ink">%10,8</p>
          <div>
            <p className="text-[21px] font-semibold leading-[1.3] text-ink-2">10–49 çalışanlı girişimlerde BİT uzmanı çalıştıranlar</p>
            <Src>TÜİK, BİT bülteni 2026</Src>
          </div>
        </div>
      </div>

      <svg viewBox="0 0 4 470" width="4" height="470" className="absolute left-[798px] top-[214px]" aria-hidden="true">
        <path d="M2 2V468" stroke="rgb(var(--line-2))" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
      </svg>
    </>
  );
}

// ---------------------------------------------------------------- 3. for whom, and why it matters

function ForWhom() {
  const rows = [
    {
      who: 'genc' as const,
      tag: 'Genç',
      title: 'Üreten ama kanıtı olmayan genç',
      text: 'Kod yazıyor, tasarlıyor; elindeki tek belge CV’deki beyan.',
      value: '~1 milyon',
      why: 'başvuru tek bir seçici programa; ~1.000 fellow ve mezun. Kapıdan girmeyenler de görünmeli.',
      src: 'GİRVAK Fellow, 10. yıl açıklaması',
      gets: ['Doğrulanmış kanıt', 'Gerçek bir kurumun ihtiyacı', 'İlk deneyim: küçük bir pilot'],
    },
    {
      who: 'kurum' as const,
      tag: 'Kurum',
      title: 'BİT uzmanı olmayan küçük kurum',
      text: 'KOBİ, kamu birimi, STK: ihtiyacı var, tarif edemiyor; kadro riskini alamıyor.',
      value: '3,93 milyon',
      why: 'girişim, %99,6’sı KOBİ. 10–49 çalışanlı girişimlerin yalnız %10,8’inde BİT uzmanı var.',
      src: 'TÜİK, KOBİ istatistikleri 2024 · BİT bülteni 2026',
      gets: ['Ölçülebilir bir ihtiyaç', 'Gerekçeli, isimsiz kısa liste', 'Çift onaylı pilot kaydı'],
    },
  ];
  const head = 'text-[19px] font-bold text-ink-3';
  return (
    <>
      <Heading width={1300}>Kim için, neden önemli?</Heading>
      <div className="s-in absolute left-[112px] top-[196px] grid w-[1376px] grid-cols-[460px_480px_1fr] gap-x-[48px]" style={d(60)}>
        <p className={head}>Kim</p>
        <p className={head}>Neden önemli</p>
        <p className={head}>Nirengi’de ne bulur</p>
      </div>
      {rows.map((r, n) => (
        <div
          key={r.tag}
          className="s-in absolute left-[112px] grid w-[1376px] grid-cols-[460px_480px_1fr] gap-x-[48px] border-t-2 border-line pt-[22px]"
          style={{ top: 238 + n * 232, ...d(160 + n * 160) }}
        >
          <div>
            <Tag who={r.who}>{r.tag}</Tag>
            <p className="mt-[12px] text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink">{r.title}</p>
            <p className="mt-[8px] text-[20px] font-semibold leading-[1.32] text-ink-3">{r.text}</p>
          </div>
          <div>
            <p className="num text-[52px] font-extrabold leading-none tracking-[-0.04em] text-ink">{r.value}</p>
            <p className="mt-[10px] text-[21px] font-semibold leading-[1.32] text-ink-2">{r.why}</p>
            <Src className="mt-[6px]">{r.src}</Src>
          </div>
          <ul className="flex flex-col gap-[12px] pt-[4px]">
            {r.gets.map((g) => (
              <li key={g} className="flex gap-[12px] text-[22px] font-bold leading-[1.25] text-ink">
                <Check size={24} strokeWidth={3.4} className={`mt-[2px] shrink-0 ${r.who === 'genc' ? 'text-cyan-lip' : 'text-indigo'}`} />
                {g}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

// ---------------------------------------------------------------- 4. evidence: data and our own research

function Evidence() {
  const marks = [
    { when: 'Şubat 2024', value: '700’de 1', text: 'Diploma şartını kaldıran şirketlerde gerçekten değişen işe alım: bundan bile az.', src: 'Harvard Business School ve Burning Glass Institute' },
    { when: 'Ocak 2025', value: '%63', text: 'İşverenlerin dönüşümdeki 1 numaralı engeli: beceri açığı.', src: 'Dünya Ekonomik Forumu, İşlerin Geleceği 2025' },
    { when: 'Ağustos 2025', value: '%13', text: 'Yapay zekâya en açık mesleklerde 22–25 yaş istihdamındaki görece düşüş. Deneyimlilerde düşüş yok.', src: 'Stanford, ABD bordro verisi' },
  ];
  const COL = 344;
  return (
    <>
      <Heading>Bunu nereden biliyoruz?</Heading>
      <p className="s-in absolute left-[112px] top-[180px] w-[1100px] text-[28px] font-medium leading-[1.35] text-ink-3" style={d(80)}>
        Beceriye bakma niyeti var, ölçme aracı yok. İlk deneyimin kapısı ise daralıyor.
      </p>
      <svg viewBox="0 0 1376 40" width="1376" height="40" className="absolute left-[112px] top-[262px]" aria-hidden="true">
        <path d={`M20 20H${COL * 3 + 20}`} stroke="rgb(var(--line-2))" strokeWidth="5" strokeDasharray="2 14" strokeLinecap="round" />
        <path d={`M${COL * 3 + 20} 20H1356`} stroke="rgb(var(--indigo) / 0.6)" strokeWidth="5" strokeDasharray="2 14" strokeLinecap="round" />
      </svg>
      {marks.map((m, n) => (
        <div key={m.when} className="s-in absolute w-[312px]" style={{ left: 112 + n * COL, top: 250, ...d(160 + n * 120) }}>
          <span className="block w-fit rounded-[8px] bg-bg">
            <Tri size={52} state="waiting" />
          </span>
          <p className="mt-[16px] text-[19px] font-bold text-ink-3">{m.when}</p>
          <p className="num mt-[6px] text-[76px] font-extrabold leading-none tracking-[-0.04em] text-ink">{m.value}</p>
          <p className="mt-[12px] text-[21px] font-semibold leading-[1.32] text-ink-2">{m.text}</p>
          <Src className="mt-[8px]">{m.src}</Src>
        </div>
      ))}
      <div className="s-in absolute w-[344px]" style={{ left: 112 + 3 * COL, top: 250, ...d(520) }}>
        <span className="relative block w-fit">
          <Ping size={70} />
          <Tri size={52} />
        </span>
        <p className="mt-[16px] text-[19px] font-bold text-indigo">Bizim araştırmamız</p>
        <p className="num mt-[6px] text-[76px] font-extrabold leading-none tracking-[-0.04em] text-ink">37</p>
        <p className="mt-[12px] text-[21px] font-semibold leading-[1.32] text-ink-2">
          platform ve program inceledik. Oyun ritmi, dışarıda doğrulanmış iş ve kurum imzası bir arada: Türkiye’de bulamadık.
        </p>
        <Src className="mt-[8px]">
          Kaynaklarıyla depoda: <span className="whitespace-nowrap">docs/PAZAR-ANALIZI.md</span>
        </Src>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- 5. the solution in one sentence, with its screens

function Solution() {
  const loop = [
    { name: 'Kanıt', text: 'Genç işini bağlar' },
    { name: 'İhtiyaç', text: 'Kurum ölçülebilir yazar' },
    { name: 'Pilot', text: 'İkisi onaylar' },
  ];
  return (
    <>
      <p className="s-in absolute left-[112px] top-[118px] w-[660px] text-[56px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink">
        Genç gerçek işiyle görünür, kurum ihtiyacını ölçülebilir yazar; ikisi <span className="text-indigo">küçük bir pilotta</span> buluşur.
      </p>
      <div className="s-in absolute left-[112px] top-[478px] w-[640px]" style={d(240)}>
        <div className="flex items-start">
          {loop.map((l, n) => (
            <div key={l.name} className="flex items-start">
              {n > 0 && <span className="mx-[14px] mt-[22px] h-[4px] w-[44px] rounded-full bg-line-2" />}
              <div className="flex w-[160px] flex-col items-start">
                <Tri size={52}>
                  <span className="text-[19px] font-black leading-none text-white">{n + 1}</span>
                </Tri>
                <p className="mt-[10px] text-[26px] font-extrabold leading-none text-ink">{l.name}</p>
                <p className="mt-[6px] text-[18px] font-semibold leading-[1.3] text-ink-3">{l.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-[22px] text-[21px] font-bold leading-[1.35] text-indigo">Onaylanan her aşama gencin profiline Kurum onaylı kanıt olarak döner.</p>
      </div>

      <figure className="s-in absolute left-[850px] top-[96px] flex flex-col items-center" style={d(160)}>
        <Phone src="/sunum/genc-bugun.webp" alt="Genç tarafı, Bugün ekranı: haftalık hedef, seri ve Şimdi şeridi" width={292} />
        <figcaption className="mt-[14px] flex items-center gap-[10px]">
          <Tag who="genc">Genç</Tag>
          <span className="s-cap">Bugün</span>
        </figcaption>
      </figure>
      <figure className="s-in absolute left-[1190px] top-[150px] flex flex-col items-center" style={d(300)}>
        <Phone src="/sunum/kurum-okuma.webp" alt="Kurum tarafı, ihtiyaç sihirbazı: Niri’nin metinden çıkardıkları" width={292} />
        <figcaption className="mt-[14px] flex items-center gap-[10px]">
          <Tag who="kurum">Kurum</Tag>
          <span className="s-cap">İhtiyaç taslağı</span>
        </figcaption>
      </figure>
    </>
  );
}

// ---------------------------------------------------------------- 6. the film, with the live demo as its fallback

function LiveDemo() {
  const steps = [
    { who: 'Genç', text: 'GitHub’a bağlanır, depolarını seçer: kanıt Doğrulandı.' },
    { who: 'Kurum', text: 'Derdini kendi sözleriyle yazar; Niri taslağa çevirir, her alanı cümlesine bağlar.' },
    { who: 'Kurum', text: 'İsimsiz adaylara bakar, “neden bu uyum?”u okur, pilot teklif eder.' },
    { who: 'İkisi', text: 'Genç teslim eder, kurum onaylar: aşama deftere mühürlenir.' },
    { who: 'Genç', text: 'Onaylanan aşama profilde Kurum onaylı kanıt olarak görünür.' },
  ];
  const tag = (who: string) => (who === 'Kurum' ? 'bg-indigo-tint text-indigo' : who === 'Genç' ? 'bg-cyan-tint text-cyan-lip' : 'bg-bg-3 text-ink-2');
  const windows = [
    { name: 'Kurum penceresi', path: '/kurum', note: 'Solda: ihtiyaç, adaylar, onay' },
    { name: 'Genç penceresi', path: '/bugun', note: 'Sağda: kanıt, teslim, profil' },
  ];
  return (
    <>
      <Heading width={600} className="!text-[58px]">Canlı gösterelim</Heading>
      <div className="absolute left-[112px] top-[220px] flex w-[560px] flex-col gap-[18px]">
        {windows.map((w, n) => (
          <div key={w.path} className="s-in flex items-center justify-between gap-4 rounded-[18px] border-2 border-line px-[24px] py-[18px]" style={d(120 + n * 100)}>
            <div>
              <p className="text-[26px] font-bold leading-tight text-ink">
                {w.name} <span className="mono text-[19px] font-semibold text-ink-3">{w.path}</span>
              </p>
              <p className="mt-[4px] text-[18px] font-semibold text-ink-3">{w.note}</p>
            </div>
            <a href={w.path} target="_blank" rel="noopener" className="btn-primary btn-lg shrink-0 !text-[19px]">
              Aç
            </a>
          </div>
        ))}
        <p className="s-cap s-in mt-[4px]" style={d(320)}>
          Demodaki kişiler ve kurumlar kurgusal; GitHub, DNS doğrulaması ve yapay zekâ taslağı gerçek.
        </p>
      </div>
      <ol className="absolute left-[760px] top-[120px] flex w-[728px] flex-col gap-[14px]">
        {steps.map((s, n) => (
          <li key={n} className="s-in flex items-start gap-[18px] rounded-[18px] border-2 border-line px-[22px] py-[16px]" style={d(200 + n * 90)}>
            <span className="mt-[2px] w-[30px] shrink-0 text-[28px] font-black leading-none text-indigo">{n + 1}</span>
            <div className="min-w-0">
              <span className={`pill !text-[16px] ${tag(s.who)}`}>{s.who}</span>
              <p className="mt-[6px] text-[22px] font-semibold leading-[1.3] text-ink-2">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

/** Plays on arrival and stays on its last frame. If the file can't load, the live demo panel takes its place. */
function Film() {
  const [failed, setFailed] = useState(false);
  if (failed) return <LiveDemo />;
  return (
    <video
      className="absolute inset-0 h-full w-full bg-bg object-contain"
      src={FILM}
      poster="/sunum/nirengi-tanitim.webp"
      autoPlay
      muted
      playsInline
      preload="auto"
      onError={() => setFailed(true)}
    />
  );
}

// ---------------------------------------------------------------- 7–9. the AI, computed from a real model answer

/** Niri's model on the sample text, through the product's guard; and the rules on the same text. */
const READ = readModelDraft(SAMPLE_COMPLAINT, SAMPLE_READING)!;
const RULES = readRulesDraft(SAMPLE_COMPLAINT);
const SENTENCES = SAMPLE_COMPLAINT.split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ])/);

const FIELD: [keyof Canvas, string][] = [
  ['current', 'Mevcut durum'],
  ['pain', 'Sorun'],
  ['painMetric', 'Sorunun ölçüsü'],
  ['outcome', 'Beklenen sonuç'],
  ['criteria', 'Başarı kriterleri'],
  ['constraints', 'Kısıtlar'],
  ['decisionMaker', 'Karar verici'],
  ['scope', 'Kapsam'],
];

/** Which sentences of the text (1-based) a field of the model's draft came from. */
const sourcesOf = (key: keyof Canvas) => [...new Set((READ.quotes[key] ?? []).map((q) => SENTENCES.findIndex((s) => cites(s, q)) + 1).filter((n) => n > 0))];

function Num({ n, dim = false }: { n: number; dim?: boolean }) {
  return (
    <span className={`mono inline-grid h-[26px] min-w-[26px] place-items-center rounded-[7px] px-[5px] text-[15px] font-bold leading-none ${dim ? 'bg-bg-3 text-ink-3' : 'bg-indigo-tint text-indigo'}`}>
      {n}
    </span>
  );
}

function AiWhat() {
  const used = new Set(FIELD.flatMap(([k]) => sourcesOf(k)));
  const rows = FIELD.filter(([k]) => k !== 'criteria').map(([k, label]) => ({
    key: k,
    label,
    value: k === 'constraints' ? READ.canvas.constraints.map((c) => c.text).join(' · ') : (READ.canvas[k] as string),
    from: sourcesOf(k),
  }));
  return (
    <>
      <Heading width={1300}>Yapay zekâ ne yapıyor?</Heading>
      <p className="s-in absolute left-[112px] top-[176px] w-[1340px] text-[25px] font-medium leading-[1.35] text-ink-3" style={d(80)}>
        Kurumun kendi sözlerini okur, yedi alanlı ihtiyaç kanvasına çevirir. Her alan, metindeki cümlesine bağlı gelir.
      </p>

      <div className="s-in absolute left-[112px] top-[246px] w-[620px] rounded-[18px] border-2 border-line bg-bg-2 px-[26px] py-[20px]" style={d(160)}>
        <p className="text-[18px] font-bold text-ink-3">Kurumun yazdığı</p>
        <p className="mt-[10px] text-[19px] font-medium leading-[1.55] text-ink-2">
          {SENTENCES.map((s, n) => {
            const [first, ...rest] = s.split(' ');
            return (
              <span key={n}>
                <span className="whitespace-nowrap">
                  <Num n={n + 1} dim={!used.has(n + 1)} /> {first}
                </span>{' '}
                {rest.join(' ')}{' '}
              </span>
            );
          })}
        </p>
      </div>

      <div className="s-in absolute left-[790px] top-[246px] w-[698px]" style={d(320)}>
        <div className="flex items-center justify-between gap-4">
          <p className="text-[18px] font-bold text-ink-3">Niri’nin taslağı</p>
          <span className="pill !text-[16px] bg-indigo-tint text-indigo">Gemma 4 26B · açık ağırlıklı model</span>
        </div>
        <ul className="mt-[8px]">
          {rows.map((r) => (
            <li key={r.key} className="flex gap-[16px] border-b-2 border-line py-[11px] last:border-b-0">
              <span className="flex w-[62px] shrink-0 gap-[4px] pt-[2px]">
                {r.from.map((n) => (
                  <Num key={n} n={n} />
                ))}
              </span>
              <div className="min-w-0">
                <p className="text-[16px] font-bold text-ink-3">{r.label}</p>
                <p className="text-[21px] font-bold leading-[1.25] text-ink">{r.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function AiDiff() {
  const added: Canvas = { ...READ.canvas, criteria: READ.suggestions.map((s, i) => ({ id: `c${i}`, text: s.text })) };
  const filled = { rules: new Set(filledFields(RULES.canvas)), model: new Set(filledFields(READ.canvas)) };
  const bars = [
    { name: 'Kural motoru', note: `${filled.rules.size} alan, kriter yok`, a: assessCanvas(RULES.canvas, RULES.skills), tone: 'ink-3' },
    { name: 'Açık model', note: `${filled.model.size} alan, ${READ.suggestions.length} kriter önerisi`, a: assessCanvas(READ.canvas, READ.skills), tone: 'indigo' },
    { name: 'Kurum önerileri ekleyince', note: `${READ.suggestions.length} kriter, “Ekle” ile`, a: assessCanvas(added, READ.skills), tone: 'green' },
  ];
  const cell = (on: boolean) =>
    on ? <Check size={26} strokeWidth={3.4} className="text-green-lip" /> : <span className="block h-[22px] w-[22px] rounded-full border-2 border-dashed border-line-2" />;
  return (
    <>
      <Heading width={1300}>Aynı metin: önce kurallar, şimdi model</Heading>

      <div className="s-in absolute left-[112px] top-[214px] w-[600px]" style={d(120)}>
        <div className="grid grid-cols-[1fr_120px_120px] items-end border-b-2 border-line pb-[10px] text-[18px] font-bold text-ink-3">
          <span>Kanvas alanı</span>
          <span className="text-center">Kurallar</span>
          <span className="text-center text-indigo">Model</span>
        </div>
        {FIELD.map(([k, label]) => (
          <div key={k} className="grid grid-cols-[1fr_120px_120px] items-center border-b-2 border-line py-[8px] last:border-b-0">
            <span className="text-[21px] font-semibold text-ink-2">{label}</span>
            <span className="grid place-items-center">{cell(filled.rules.has(k))}</span>
            <span className="grid place-items-center">
              {k === 'criteria' && READ.suggestions.length ? (
                <span className="pill !text-[15px] bg-indigo-tint text-indigo">{READ.suggestions.length} öneri</span>
              ) : (
                cell(filled.model.has(k))
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="absolute left-[800px] top-[214px] flex w-[688px] flex-col gap-[30px]">
        {bars.map((b, n) => (
          <div key={b.name} className="s-in" style={d(260 + n * 140)}>
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-[25px] font-bold leading-tight text-ink">{b.name}</p>
                <p className="mt-[2px] text-[18px] font-semibold text-ink-3">{b.note}</p>
              </div>
              <p className="num text-[56px] font-extrabold leading-none tracking-[-0.04em] text-ink">{b.a.score}</p>
            </div>
            <div className="relative mt-[12px] h-[18px] rounded-full bg-bg-3">
              <div className="h-full rounded-full" style={{ width: `${b.a.score}%`, background: `rgb(var(--${b.tone}))` }} />
              <span className="absolute top-[-8px] h-[34px] w-[4px] rounded-full bg-ink" style={{ left: `${PUBLISH_THRESHOLD}%` }} />
            </div>
            <p className={`mt-[8px] text-[18px] font-bold ${b.a.canPublish ? 'text-green-lip' : 'text-ink-3'}`}>{b.a.canPublish ? 'Yayımlanabilir' : 'Yayımlanamaz'}</p>
          </div>
        ))}
      </div>
      <p className="s-in absolute left-[800px] top-[760px] w-[688px] text-[19px] font-semibold leading-[1.35] text-ink-3" style={d(720)}>
        Puanları ürünün kendi netlik kuralları verdi; çizgi {PUBLISH_THRESHOLD} yayın eşiği. Sonuçlar testte sabit.
      </p>
    </>
  );
}

function AiGuard() {
  const bent = readModelDraft(SAMPLE_COMPLAINT, INVENTED_DECIDER)!;
  const refused = bent.rejected.find((r) => r.field === 'decisionMaker');
  const asked = bent.questions.find((q) => q.field === 'decisionMaker');
  const gates = [
    { title: 'Şemaya uyuyor mu?', text: 'Bilinen alanlar, beceriler, kısıt türleri' },
    { title: 'Alıntı metinde mi?', text: 'Her alan metinde birebir geçen bir cümleye dayanır' },
    { title: 'Sayı metinde mi?', text: 'Alandaki her sayıyı kurum yazmış olmalı' },
    { title: 'Kriter ölçülebilir mi?', text: 'Eşiği ya da teslimi olmayan kriter alınmaz' },
  ];
  const nets = [
    { title: 'Öneri, öneri olarak kalır', text: 'Başarı kriterleri kurum “Ekle” demeden kanvasa girmez.' },
    { title: 'Reddedilen görünür', text: 'Almadıklarım listesi: neyi neden almadığını kurum görür.' },
    { title: 'Model susarsa', text: 'Kota dolar ya da cevap gelmezse kural motoru aynı ekranı doldurur.' },
    { title: 'Metin saklanmaz', text: 'İstem ve şema sunucuda sabit; ekranda kişisel veri yazma uyarısı var.' },
  ];
  return (
    <>
      <Heading width={1300}>Model yanılırsa ne olur?</Heading>

      {/* The pipeline: the answer passes four gates before it reaches the canvas. */}
      <div className="s-in absolute left-[112px] top-[206px] flex w-[1376px] items-start" style={d(100)}>
        <div className="w-[130px] shrink-0 rounded-[14px] border-2 border-dashed border-line-2 px-[14px] py-[12px]">
          <p className="text-[19px] font-bold leading-tight text-ink">Modelin cevabı</p>
        </div>
        {gates.map((g, n) => (
          <div key={g.title} className="flex items-start">
            <span className="mx-[10px] mt-[26px] h-[4px] w-[24px] shrink-0 rounded-full bg-line-2" />
            <div className="w-[228px]">
              <Tri size={50}>
                <span className="text-[18px] font-black leading-none text-white">{n + 1}</span>
              </Tri>
              <p className="mt-[10px] whitespace-nowrap text-[21px] font-bold leading-tight text-ink">{g.title}</p>
              <p className="mt-[4px] text-[17px] font-semibold leading-[1.3] text-ink-3">{g.text}</p>
            </div>
          </div>
        ))}
        <span className="mx-[10px] mt-[26px] h-[4px] w-[24px] shrink-0 rounded-full bg-indigo" />
        <div className="w-[110px] shrink-0 rounded-[14px] bg-indigo px-[14px] py-[12px]">
          <p className="text-[19px] font-bold leading-tight text-white">Kanvas</p>
        </div>
      </div>

      {/* A case from the guard's own tests, computed here by the same code. */}
      <div className="s-in absolute left-[112px] top-[440px] w-[620px] rounded-[18px] border-2 border-line px-[26px] py-[20px]" style={d(300)}>
        <p className="text-[18px] font-bold text-ink-3">Testlerden bir örnek</p>
        <p className="mt-[10px] text-[21px] font-semibold leading-[1.35] text-ink-2">
          Model “Karar verici: <span className="font-bold text-ink">{refused?.value}</span>” yazıyor, kaynak olarak da “{INVENTED_DECIDER.decisionMaker.quote}” cümlesini gösteriyor.
        </p>
        <p className="mt-[12px] flex items-center gap-[10px] text-[21px] font-bold text-red-lip">
          <X size={24} strokeWidth={3.4} className="shrink-0" />
          {refused?.reason === 'quote' ? 'Bu cümle metinde yok: alan boş kalır.' : 'Alan boş kalır.'}
        </p>
        <p className="mt-[10px] text-[21px] font-bold leading-[1.35] text-indigo">Niri sorar: “{asked?.q}”</p>
      </div>

      <ul className="absolute left-[800px] top-[440px] flex w-[688px] flex-col gap-[18px]">
        {nets.map((n, k) => (
          <li key={n.title} className="s-in flex gap-[14px]" style={d(420 + k * 90)}>
            <Check size={26} strokeWidth={3.4} className="mt-[2px] shrink-0 text-green-lip" />
            <div>
              <p className="text-[23px] font-bold leading-tight text-ink">{n.title}</p>
              <p className="mt-[3px] text-[19px] font-semibold leading-[1.3] text-ink-3">{n.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

// ---------------------------------------------------------------- 10. design decisions

function Decisions() {
  const items = [
    { title: 'Her ekranda tek iş', text: 'İlk kez gelen kurum yöneticisi de genç de kaybolmasın: sihirbaz soruları tek tek sorar, ana eylem ilk ekranda durur.' },
    { title: 'Önce telefon', text: 'Her ekran önce 390 piksel genişlikte tasarlandı, sonra masaüstüne büyüdü; gezinme başparmağın altında.' },
    { title: 'Oyun yalnız genç tarafında', text: 'Genç ritim ister, kurum ölçüm. Kurum ekranında XP, lig ve seri yok; renkler de sakin.' },
    { title: 'Temasa kadar isimsiz', text: 'Kurum önce işi görür. İsim, okul ve şehir pilot teklifiyle açılır.' },
    { title: 'Niri yol gösterir, kimseyi bekletmez', text: 'İlk kullanımda kısa bir tur, sonra yalnız istenince. Sözü animasyonu beklemez; hareket azaltma tercihine uyar.' },
  ];
  return (
    <>
      <Heading width={1300}>Neden böyle tasarladık?</Heading>
      <ol className="absolute left-[112px] top-[192px] w-[1376px]">
        {items.map((it, n) => (
          <li key={it.title} className="s-in grid grid-cols-[64px_480px_1fr] items-start gap-x-[24px] border-t-2 border-line py-[13px]" style={d(120 + n * 90)}>
            <Tri size={44} state="waiting">
              <span className="text-[17px] font-black leading-none text-ink-3">{n + 1}</span>
            </Tri>
            <p className="pt-[6px] text-[28px] font-extrabold leading-[1.12] tracking-[-0.02em] text-ink">{it.title}</p>
            <p className="pt-[8px] text-[21px] font-semibold leading-[1.35] text-ink-3">{it.text}</p>
          </li>
        ))}
      </ol>
    </>
  );
}

// ---------------------------------------------------------------- 11. what we finished, what we left on purpose

function Done() {
  const done = [
    'Altı problemin altısına çalışan ekran',
    'GitHub uygulamasıyla depo, DNS TXT ile alan adı doğrulaması',
    'Açık modelle ihtiyaç taslağı ve onun denetimi',
    'Eşleşme, kanvas, defter ve denetim otomatik testli',
    'Telefon ve masaüstü, açık ve koyu tema',
  ];
  const left = [
    { title: 'Kalıcı veritabanı', text: 'Veri tarayıcıda kalır; gerçek kişisel veriyi pilotla ve KVKK uyumuyla açacağız.' },
    { title: 'Gerçek kullanıcı ve pilot', text: 'Demo kişileri ve kurumları kurgusal; ekranda öyle yazıyor.' },
    { title: 'Kod dışı kanıt', text: 'Önce kodu doğruladık; tasarım ve yayın sırada.' },
    { title: 'Her yerde yapay zekâ', text: 'Model yalnız ihtiyaç taslağında; analizler ve özetler kural tabanlı.' },
  ];
  const next = ['Kalıcılık', 'İlk ihtiyaç turu', 'Kod dışı kanıt', 'Open Badges 3.0', 'Fon verene rapor'];
  return (
    <>
      <Heading width={1376}>Neyi bitirdik, neyi bilerek bıraktık?</Heading>
      <div className="s-in absolute left-[112px] top-[206px] w-[620px]" style={d(120)}>
        <p className="text-[19px] font-bold text-green-lip">Bitti, canlıda çalışıyor</p>
        <ul className="mt-[14px] flex flex-col gap-[14px]">
          {done.map((t) => (
            <li key={t} className="flex gap-[12px] text-[23px] font-semibold leading-snug text-ink-2">
              <Check size={26} strokeWidth={3.4} className="mt-[2px] shrink-0 text-green-lip" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="s-in absolute left-[800px] top-[206px] w-[688px] rounded-[18px] bg-bg-2 px-[28px] py-[20px]" style={d(260)}>
        <p className="text-[19px] font-bold text-ink-3">Bilerek bıraktık</p>
        <ul className="mt-[10px] flex flex-col gap-[12px]">
          {left.map((l) => (
            <li key={l.title}>
              <p className="text-[22px] font-bold leading-tight text-ink">{l.title}</p>
              <p className="mt-[2px] text-[18px] font-semibold leading-[1.3] text-ink-3">{l.text}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="s-in absolute left-[800px] top-[660px] w-[688px]" style={d(420)}>
        <p className="text-[19px] font-bold text-ink-3">Finalden sonra 4 ay · plan</p>
        <div className="relative mt-[14px] grid grid-cols-5">
          <svg viewBox="0 0 688 10" width="688" height="10" className="absolute left-0 top-[20px]" aria-hidden="true">
            <path d="M40 5H560" stroke="rgb(var(--line-2))" strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" />
          </svg>
          {next.map((t, n) => (
            <div key={t} className="relative flex flex-col items-start">
              <span className="rounded-[8px] bg-bg">
                <Tri size={46} state="waiting">
                  <span className="text-[17px] font-black leading-none text-ink-3">{n + 1}</span>
                </Tri>
              </span>
              <p className="mt-[8px] pr-[8px] text-[18px] font-bold leading-[1.2] text-ink-2">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- 12. close: the one ask

function Close() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Contours seed={7} x={0.86} y={0.78} rings={14} step={34} opacity={0.55} />
      </div>
      <p className="s-in absolute left-[112px] top-[104px] w-[900px] text-[120px] font-extrabold leading-[0.98] tracking-[-0.045em] text-ink">
        Beyan değil,
        <br />
        <span className="text-indigo">kanıt.</span>
      </p>
      <p className="s-in absolute left-[112px] top-[392px] w-[640px] text-[32px] font-bold leading-[1.25] tracking-[-0.015em] text-ink-2" style={d(200)}>
        Tek isteğimiz: bu salondan bir kurumun gerçek bir ihtiyacı. <span className="text-indigo">İlk kanvası birlikte yazalım.</span>
      </p>
      <div className="s-in absolute left-[112px] top-[612px] w-[420px]" style={d(360)}>
        <Wordmark size={44} />
        <p className="mt-[14px] text-[26px] font-bold text-ink">{SITE}</p>
        <p className="mt-[8px] text-[21px] font-semibold text-ink-2">{TEAM.join(' · ')}</p>
        <p className="mt-[2px] text-[19px] font-semibold text-ink-3">Açık kaynak, MIT lisanslı</p>
      </div>
      <SurveyFlag size={96} delay={0.6} className="absolute left-[1478px] top-[694px]" />
    </>
  );
}

// ================================================================ appendix: for questions

// ---------------------------------------------------------------- the difference: every XP is a work receipt

function Zigzag({ flip = false }: { flip?: boolean }) {
  const teeth = 22;
  const w = 440 / teeth;
  let p = 'M0 12';
  for (let n = 0; n < teeth; n++) p += `L${n * w + w / 2} 2L${(n + 1) * w} 12`;
  return (
    <svg viewBox="0 0 440 14" width="440" height="14" className={`block ${flip ? 'rotate-180' : ''}`} aria-hidden="true">
      <path d={`${p}V14H0Z`} fill="rgb(var(--bg))" />
      <path d={p} fill="none" stroke="rgb(var(--line-2))" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function Difference() {
  const rows = [
    ['Üretim yaptığın gün', XP.activeDay],
    ['Doğrulanmış kanıt', XP.evidence],
    ['Kurum onaylı aşama', XP.milestone],
  ] as const;
  return (
    <>
      <div className="absolute left-[112px] top-[150px] w-[820px]">
        <p className="s-in text-[46px] font-bold leading-[1.15] tracking-[-0.03em] text-ink-3">Başka yerlerde XP uygulamanın içinde kalır.</p>
        <p className="s-in mt-[28px] text-[76px] font-extrabold leading-[1.04] tracking-[-0.04em] text-ink" style={d(260)}>
          Nirengi’de her XP bir <span className="text-indigo">iş makbuzudur.</span>
        </p>
      </div>

      <div className="s-in absolute left-[1040px] top-[118px] w-[440px] rotate-[2deg]" style={d(480)}>
        <Zigzag />
        <div className="border-x-2 border-line-2 bg-bg px-[34px] pb-[26px] pt-[18px]">
          <div className="flex items-center gap-[12px]">
            <Bolt size={40} />
            <p className="text-[26px] font-black tracking-[-0.02em] text-ink">XP makbuzu</p>
          </div>
          <div className="mt-[18px] border-t-2 border-dashed border-line-2" />
          {rows.map(([label, xp]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 py-[12px]">
              <span className="text-[22px] font-semibold text-ink-2">{label}</span>
              <span className="mono text-[24px] font-bold text-gold-ink">+{xp}</span>
            </div>
          ))}
          <div className="mt-[6px] border-t-2 border-dashed border-line-2" />
          <div className="flex items-baseline justify-between gap-4 pt-[14px]">
            <span className="text-[22px] font-semibold text-ink-2">Günlük tavan</span>
            <span className="mono text-[24px] font-bold text-ink">{XP.dailyCap}</span>
          </div>
          <div className="flex items-baseline justify-between gap-4 pt-[10px]">
            <span className="text-[22px] font-semibold text-ink-2">Boş tıklama</span>
            <span className="mono text-[24px] font-bold text-ink">0</span>
          </div>
          <p className="s-cap mt-[18px]">Her satırın arkasında bir PR, bir alan adı ya da bir kurum imzası var.</p>
        </div>
        <Zigzag flip />
      </div>
    </>
  );
}

// ---------------------------------------------------------------- the loop: three objects

function Objects() {
  return (
    <>
      <Heading>Üç nesne, tek döngü</Heading>
      <div className="absolute left-[112px] top-[226px] grid w-[1376px] grid-cols-3 gap-[28px]">
        <div className="s-in h-[392px] rounded-[18px] border-2 border-line px-[28px] py-[26px]" style={d(100)}>
          <p className="s-t">Kanıt</p>
          <p className="s-p mt-[6px] !text-[21px] !text-ink-3">Her iddia bir seviye taşır.</p>
          <ul className="mt-[22px] flex flex-col gap-[16px]">
            {(
              [
                ['S1', 'Beyan', 'kendi söylediğin'],
                ['S2', 'Doğrulandı', 'makine kontrol etti'],
                ['S3', 'Kurum onaylı', 'kurum imzaladı'],
              ] as const
            ).map(([lv, name, note]) => (
              <li key={lv} className="flex items-center gap-[14px]">
                <LevelGlyph level={lv} size={34} />
                <span>
                  <span className="block text-[24px] font-bold leading-tight text-ink">{name}</span>
                  <span className="block text-[19px] font-semibold text-ink-3">
                    <span className="mono">{lv}</span> · {note}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="s-in h-[392px] rounded-[18px] border-2 border-line px-[28px] py-[26px]" style={d(200)}>
          <p className="s-t">İhtiyaç</p>
          <p className="s-p mt-[6px] !text-[21px] !text-ink-3">İlan değil, 7 alanlı kanvas.</p>
          <p className="mt-[34px] text-[22px] font-bold text-ink-2">Çözülebilirlik puanı</p>
          <div className="relative mt-[14px] h-[22px] rounded-full bg-bg-3">
            <div className="h-full w-[82%] rounded-full bg-green" />
            <span className="absolute top-[-10px] h-[42px] w-[4px] rounded-full bg-indigo" style={{ left: `${PUBLISH_THRESHOLD}%` }} />
          </div>
          <p className="mt-[14px] text-[20px] font-semibold text-ink-3" style={{ paddingLeft: `calc(${PUBLISH_THRESHOLD}% - 70px)` }}>
            <span className="text-indigo">{PUBLISH_THRESHOLD}</span> yayın eşiği
          </p>
          <p className="s-p mt-[28px] !text-[21px]">Puan eşiği geçmeden ihtiyaç yayımlanmaz.</p>
        </div>

        <div className="s-in h-[392px] rounded-[18px] border-2 border-line px-[28px] py-[26px]" style={d(300)}>
          <p className="s-t">Pilot</p>
          <p className="s-p mt-[6px] !text-[21px] !text-ink-3">Aşamalar, çift onay.</p>
          <div className="mt-[30px] flex items-center">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center">
                {n > 1 && <span className="h-[4px] w-[28px] bg-line-2" />}
                <div className="flex h-[92px] w-[84px] flex-col items-center justify-center gap-[6px] rounded-[14px] border-2 border-line bg-bg-2">
                  <span className="mono text-[18px] font-bold text-ink-3">#{n}</span>
                  <span className="flex gap-[4px]">
                    <Check size={20} strokeWidth={3.4} className="text-green-lip" />
                    <Check size={20} strokeWidth={3.4} className="text-indigo" />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="s-p mt-[22px] !text-[21px]">
            Genç teslim eder, kurum onaylar. Kayıtlar <span className="mono text-[19px] font-bold">SHA-256</span> ile zincirlenir.
          </p>
        </div>
      </div>

      {/* The loop back: an approved milestone becomes Kurum onaylı evidence. */}
      <svg viewBox="0 0 1376 70" width="1376" height="70" className="absolute left-[112px] top-[628px]" aria-hidden="true">
        <path
          d="M1148 2C1148 50 1100 56 1000 56H330C236 56 226 50 226 6"
          fill="none"
          stroke="rgb(var(--indigo) / 0.6)"
          strokeWidth="4"
          strokeDasharray="2 12"
          strokeLinecap="round"
        />
        <path d="M214 18 226 2 238 18" fill="none" stroke="rgb(var(--indigo))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="s-in absolute left-[880px] top-[700px] w-[560px] text-[21px] font-bold text-indigo" style={d(500)}>
        Onaylanan aşama, profilde Kurum onaylı kanıt olur.
      </p>
    </>
  );
}

// ---------------------------------------------------------------- product: the two faces side by side

function Faces() {
  const genc = [
    { icon: <Flame size={44} />, title: 'Haftalık hedef ve seri', text: 'Commit sayısı değil, üretim yapılan gün sayılır.' },
    { icon: <Shield size={44} tier={4} />, title: 'Lig ve Niri’nin kostümleri', text: `Benzer seviyede haftalık lig, ${TIERS[0]}’den ${TIERS[TIERS.length - 1]}’ye.` },
    { icon: <Route size={44} />, title: 'Açık kaynak görevleri', text: 'Gerçek “good first issue”lar; PR birleşince sayılır.' },
    { icon: <Compass size={44} />, title: 'Niri’nin analizi', text: 'Eşleşmediğinde eksiğini ve sıradaki adımı görür.' },
  ];
  const kurum = [
    { title: 'Şikâyetten ihtiyaca', text: 'Muğlak bir dert, kanvasla ölçülebilir ihtiyaca döner.' },
    { title: 'Gerekçeli kısa liste', text: 'İsimsiz inceleme; her adayın yanında “neden bu uyum?”' },
    { title: 'Kadro yerine küçük pilot', text: 'İşe alım riski almadan, aşamaları belli kısa bir proje.' },
    { title: 'Hesap verebilir kayıt', text: 'Çift onaylı aşamalar, iki tarafın da gördüğü defter.' },
  ];
  const Row = ({ mark, title, text }: { mark: ReactNode; title: string; text: string }) => (
    <li className="flex items-center gap-[20px] border-t-2 border-line py-[16px] first:border-t-0">
      <span className="grid w-[48px] shrink-0 place-items-center">{mark}</span>
      <div className="min-w-0">
        <p className="text-[25px] font-bold leading-tight tracking-[-0.015em] text-ink">{title}</p>
        <p className="mt-[3px] text-[19px] font-semibold leading-[1.3] text-ink-3">{text}</p>
      </div>
    </li>
  );
  return (
    <>
      <Heading width={1300}>Aynı kanıt, iki yüz</Heading>
      <div className="s-in absolute left-[112px] top-[200px] w-[664px] rounded-[18px] border-2 border-line px-[28px] pb-[8px] pt-[22px]" style={d(120)}>
        <div className="flex items-center gap-[14px]">
          <Tag who="genc">Genç</Tag>
          <p className="s-t !text-[26px]">tanıdık bir oyun ritmi</p>
        </div>
        <ul className="mt-[8px]">
          {genc.map((c) => (
            <Row key={c.title} mark={c.icon} title={c.title} text={c.text} />
          ))}
        </ul>
      </div>
      <div className="s-in absolute left-[824px] top-[200px] w-[664px] rounded-[18px] border-2 border-line px-[28px] pb-[8px] pt-[22px]" style={d(260)}>
        <div className="flex items-center gap-[14px]">
          <Tag who="kurum">Kurum</Tag>
          <p className="s-t !text-[26px]">sakin bir ölçüm</p>
        </div>
        <ul className="mt-[8px]">
          {kurum.map((s, n) => (
            <Row
              key={s.title}
              mark={
                <Tri size={44}>
                  <span className="text-[17px] font-black leading-none text-white">{n + 1}</span>
                </Tri>
              }
              title={s.title}
              text={s.text}
            />
          ))}
        </ul>
      </div>
      <p className="s-cap s-in absolute left-[824px] top-[730px] w-[664px]" style={d(420)}>
        XP yalnızca dışarıda doğrulanabilen işten gelir; günde en fazla {f(XP.dailyCap)} XP. Kurum ekranında XP, lig ve seri yok.
      </p>
    </>
  );
}

// ---------------------------------------------------------------- trust: how matching works

/** A real three-link chain from the engine's own SHA-256, so the hashes on screen are honest. */
const CHAIN = (() => {
  let prev = GENESIS;
  return [
    { title: 'Aşama 1', genc: true, kurum: true },
    { title: 'Aşama 2', genc: true, kurum: true },
    { title: 'Aşama 3', genc: true, kurum: false },
  ].map((m) => {
    const hash = sha256(`${prev}|${m.title}|${m.genc ? 'teslim' : ''}|${m.kurum ? 'onay' : ''}`);
    prev = hash;
    return { ...m, hash: shortHash(hash) };
  });
})();

function Trust() {
  const parts = [
    { name: 'Kanıt', w: WEIGHTS.evidence, tone: 'indigo' },
    { name: 'Bağlam', w: WEIGHTS.context, tone: 'cyan' },
    { name: 'Kapasite', w: WEIGHTS.capacity, tone: 'purple' },
    { name: 'İş birliği geçmişi', w: WEIGHTS.history, tone: 'green' },
  ];
  const panel = 's-in absolute top-[214px] h-[452px] w-[442px] rounded-[18px] border-2 border-line px-[28px] py-[24px]';
  return (
    <>
      <Heading width={1300}>Neden güvenilir?</Heading>

      <div className={panel} style={{ left: 112, ...d(120) }}>
        <p className="s-t !text-[28px]">Açıklanabilir puan</p>
        <p className="mt-[6px] text-[20px] font-semibold leading-[1.3] text-ink-3">Dört parça, ağırlıklar açık.</p>
        <div className="mt-[26px] flex h-[30px] overflow-hidden rounded-full">
          {parts.map((p) => (
            <span key={p.name} className="h-full border-r-[3px] border-bg last:border-r-0" style={{ width: `${p.w * 100}%`, background: `rgb(var(--${p.tone}))` }} />
          ))}
        </div>
        <ul className="mt-[20px] flex flex-col gap-[10px]">
          {parts.map((p) => (
            <li key={p.name} className="flex items-center gap-[12px] text-[21px] font-semibold text-ink-2">
              <span className="h-[14px] w-[14px] shrink-0 rounded-[4px]" style={{ background: `rgb(var(--${p.tone}))` }} />
              <span className="flex-1">{p.name}</span>
              <span className="font-bold text-ink">
                <span className="mono">{f(p.w * 100)}</span> puan
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-[18px] text-[19px] font-bold leading-[1.3] text-indigo">Her adayın yanında: neden bu uyum, ne eksik.</p>
      </div>

      <div className={panel} style={{ left: 579, ...d(240) }}>
        <p className="s-t !text-[28px]">Temasa kadar kör</p>
        <p className="mt-[6px] text-[20px] font-semibold leading-[1.3] text-ink-3">Kurum önce işi görür; kimlik pilot teklifiyle açılır.</p>
        <div className="mt-[18px] rounded-[14px] border-2 border-line bg-bg-2 px-[20px] py-[14px]">
          <p className="text-[20px] font-bold text-ink">Aday 3</p>
          {[
            ['İsim', 150],
            ['Okul', 120],
            ['Şehir', 90],
          ].map(([k, w]) => (
            <div key={k} className="mt-[10px] flex items-center gap-[12px]">
              <span className="w-[64px] text-[18px] font-semibold text-ink-3">{k}</span>
              <span className="h-[16px] rounded-full bg-line-2" style={{ width: w as number }} />
            </div>
          ))}
          <div className="mt-[14px] flex flex-col gap-[8px] border-t-2 border-line pt-[12px]">
            <p className="flex items-center gap-[10px] text-[19px] font-semibold text-ink-2">
              <LevelGlyph level="S3" size={22} /> 1 kurum onaylı aşama
            </p>
            <p className="flex items-center gap-[10px] text-[19px] font-semibold text-ink-2">
              <LevelGlyph level="S2" size={22} /> 3 doğrulanmış iş
            </p>
          </div>
        </div>
        <p className="mt-[10px] text-[16px] font-bold text-ink-3">Örnek kart, kurgusal aday</p>
      </div>

      <div className={panel} style={{ left: 1046, ...d(360) }}>
        <p className="s-t !text-[28px]">Çift onaylı defter</p>
        <p className="mt-[6px] text-[20px] font-semibold leading-[1.3] text-ink-3">Kurcalanan kayıt zinciri kırar.</p>
        <ol className="mt-[20px] flex flex-col">
          {CHAIN.map((c, n) => (
            <li key={c.title} className="flex flex-col">
              {n > 0 && <span className="ml-[30px] h-[14px] w-[4px] bg-line-2" />}
              <div className="flex items-center justify-between gap-[12px] rounded-[14px] border-2 border-line bg-bg-2 px-[16px] py-[10px]">
                <div>
                  <p className="text-[19px] font-bold text-ink">{c.title}</p>
                  <p className="mono text-[15px] font-semibold text-ink-3">{c.hash}</p>
                </div>
                <span className="flex gap-[4px]">
                  <Check size={22} strokeWidth={3.4} className="text-green-lip" />
                  {c.kurum ? <Check size={22} strokeWidth={3.4} className="text-indigo" /> : <span className="h-[22px] w-[22px] rounded-full border-2 border-dashed border-line-2" />}
                </span>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-[14px] text-[16px] font-bold text-ink-3">Örnek zincir; özetler motorun kendi SHA-256’sıyla</p>
      </div>

      <p className="s-in absolute left-[848px] top-[716px] w-[640px] text-[21px] font-bold leading-[1.35] text-ink-2" style={d(500)}>
        Kod açık, MIT lisanslı: her formülü herkes okuyabilir.
      </p>
    </>
  );
}

// ---------------------------------------------------------------- market: who first, nested like a map inset

function Market() {
  return (
    <>
      <Heading width={600}>Önce kim?</Heading>
      <p className="s-in absolute left-[112px] top-[186px] w-[580px] text-[24px] font-medium leading-[1.4] text-ink-3" style={d(80)}>
        Mikro staj pazarının büyüklüğü için bağımsız bir kaynak bulamadık. Uydurma bir rakam yerine nereden başlayacağımızı gösteriyoruz.
      </p>

      {/* Genç side: the demand is already there. */}
      <div className="s-in absolute left-[112px] top-[372px] w-[580px] rounded-[18px] border-2 border-line px-[28px] py-[22px]" style={d(200)}>
        <div className="flex items-center gap-[14px]">
          <Tag who="genc">Genç</Tag>
          <p className="s-t !text-[26px]">talep zaten var</p>
        </div>
        <p className="mt-[14px] flex items-baseline gap-[14px]">
          <span className="num shrink-0 whitespace-nowrap text-[52px] font-extrabold leading-none tracking-[-0.04em] text-ink">~1 milyon</span>
          <span className="text-[22px] font-bold leading-[1.25] text-ink-3">başvuru, ~1.000 fellow ve mezun</span>
        </p>
        <p className="mt-[10px] text-[21px] font-semibold leading-[1.3] text-ink-2">Seçici programlara sığmayan gençler de kanıt biriktirebilmeli.</p>
        <Src className="mt-[6px]">GİRVAK Fellow, 10. yıl açıklaması</Src>
      </div>

      {/* Kurum side: rings from the first tour out to the whole market. */}
      <div className="s-in absolute left-[760px] top-[150px] h-[690px] w-[728px] rounded-[22px] border-2 border-dashed border-line-2 px-[30px] py-[24px]" style={d(160)}>
        <p className="text-[19px] font-bold text-ink-3">Ölçek</p>
        <p className="mt-[2px] flex items-baseline gap-[14px]">
          <span className="num text-[44px] font-extrabold leading-none tracking-[-0.03em] text-ink">3,93 milyon</span>
          <span className="text-[21px] font-semibold text-ink-2">girişim, %99,6’sı KOBİ</span>
        </p>
        <Src className="mt-[4px]">TÜİK, KOBİ istatistikleri 2024</Src>
      </div>
      <div className="s-in absolute left-[816px] top-[330px] h-[480px] w-[644px] rounded-[20px] border-2 border-line bg-bg-2 px-[30px] py-[22px]" style={d(300)}>
        <p className="text-[19px] font-bold text-ink-3">İlk pazar</p>
        <p className="mt-[4px] text-[25px] font-bold leading-[1.25] text-ink">BİT uzmanı olmayan küçük işletmeler, kamu birimleri, STK’lar</p>
        <p className="mt-[8px] text-[20px] font-semibold leading-[1.3] text-ink-2">
          10–49 çalışanlı girişimlerin yalnızca <span className="num font-extrabold text-ink">%10,8</span>’i BİT uzmanı çalıştırıyor.
        </p>
        <Src className="mt-[4px]">TÜİK, BİT bülteni 2026</Src>
      </div>
      <div className="s-in absolute left-[872px] top-[600px] h-[180px] w-[558px] overflow-hidden rounded-[18px] bg-indigo px-[30px] py-[22px]" style={d(440)}>
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <Contours seed={4} x={0.92} y={0.9} rings={8} step={26} opacity={0.35} color="white" />
        </div>
        <p className="relative text-[19px] font-bold text-white/80">İlk tur · plan</p>
        <p className="relative mt-[4px] text-[30px] font-extrabold leading-[1.15] tracking-[-0.02em] text-white">Zemin360 ve GİRVAK ağındaki kurumlar ve gençler</p>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- competition: categories only

/** Positions on the map, 0–1 on each axis: x = how real the proof is, y = how habitual. */
const RIVALS = [
  { name: 'Oyunlaştırılmış öğrenme', x: 0.16, y: 0.84 },
  { name: 'İlan ve kariyer siteleri', x: 0.12, y: 0.2 },
  { name: 'Test ve bootcamp', x: 0.38, y: 0.36 },
  { name: 'Açık inovasyon programları', x: 0.52, y: 0.1 },
  { name: 'Mikro staj', x: 0.8, y: 0.28 },
];

function Worlds() {
  const W = 740;
  const H = 440;
  const px = (x: number) => 40 + x * (W - 80);
  const py = (y: number) => H - 40 - y * (H - 80);
  const cards = [
    { title: 'Oyunlaştırılmış öğrenme', text: 'Alışkanlık kurar; ama XP uygulamada kalır.' },
    { title: 'İşe alım ve eşleşme', text: 'CV, test, sertifika: tek seferlik bir eşik.' },
  ];
  return (
    <>
      <Heading width={1400}>İki dünya var, birbirine dokunmuyor.</Heading>
      <div className="absolute left-[112px] top-[214px] flex w-[560px] flex-col gap-[16px]">
        {cards.map((c, n) => (
          <div key={c.title} className="s-in rounded-[18px] border-2 border-line px-[26px] py-[18px]" style={d(120 + n * 100)}>
            <p className="s-t !text-[27px]">{c.title}</p>
            <p className="s-p mt-[4px] !text-[21px] !text-ink-3">{c.text}</p>
          </div>
        ))}
        <div className="s-in rounded-[18px] bg-indigo-tint px-[26px] py-[18px]" style={d(320)}>
          <p className="s-t !text-[27px] !text-indigo">Boş köşe</p>
          <p className="s-p mt-[4px] !text-[21px]">Oyun ritmi, dışarıda doğrulanmış iş ve kurum imzası bir arada. Türkiye’de bu bileşimi sunan bir platform bulamadık.</p>
        </div>
      </div>

      {/* The map: x from declared to verified real work, y from one-off to habit. */}
      <div className="s-in absolute left-[748px] top-[214px] w-[740px]" style={d(240)}>
        <div className="relative h-[440px] w-[740px] overflow-hidden rounded-[18px] border-2 border-line">
          <Contours seed={5} x={0.9} y={0.15} rings={10} step={34} opacity={0.4} />
          <div className="absolute right-0 top-0 h-1/2 w-1/2 bg-indigo-tint/60" />
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d={`M${W / 2} 16V${H - 16}M16 ${H / 2}H${W - 16}`} stroke="rgb(var(--line-2))" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
          </svg>
          {RIVALS.map((r) => (
            <div key={r.name} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: px(r.x), top: py(r.y) }}>
              <Tri size={36} state="locked" />
              <p className="mt-[4px] whitespace-nowrap rounded-[8px] bg-bg px-[8px] py-[2px] text-[18px] font-semibold text-ink-2">{r.name}</p>
            </div>
          ))}
          <div className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: px(0.82), top: py(0.8) }}>
            <span className="relative block">
              <Ping />
              <Tri size={64} />
            </span>
            <p className="mt-[8px] rounded-[8px] bg-bg px-[10px] py-[2px] text-[26px] font-black tracking-[-0.03em] text-indigo">nirengi</p>
          </div>
        </div>
        <div className="mt-[12px] flex justify-between text-[18px] font-bold text-ink-3">
          <span>Beyan, katılım</span>
          <span>Dışarıda doğrulanmış gerçek iş</span>
        </div>
        <div className="absolute left-[-36px] top-0 flex h-[440px] w-[24px] flex-col items-center justify-between text-[18px] font-bold text-ink-3">
          <span className="[writing-mode:vertical-rl] rotate-180">Alışkanlık</span>
          <span className="[writing-mode:vertical-rl] rotate-180">Tek seferlik</span>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- sustainability: hypotheses, not revenue

function Model() {
  const promises = ['Gence ücret yok', 'Kod açık, MIT lisanslı', 'Kanıt gencindir'];
  const options = [
    { title: 'Kamu ve vakıf fonları', text: 'Fonlu gençlik ve istihdam programlarına hazır pilot raporu: kim, ne üretti, kim onayladı.' },
    { title: 'Kalkınma ajansları', text: 'Bölgesel ihtiyaç turları: yerel kurumun ihtiyacı, yerel gencin işi.' },
    { title: 'Üniversite kariyer merkezleri', text: 'Öğrencilerinin doğrulanmış kanıtlarını kendi sistemlerine alır.' },
    { title: 'Kurum tarafında barındırma ve destek', text: 'Çekirdek açık ve ücretsiz kalır; kurulum, barındırma ve ihtiyaç turu desteği isteyene hizmet.' },
  ];
  return (
    <>
      <Heading width={1300}>Nasıl yaşar?</Heading>
      <div className="s-in absolute left-[112px] top-[190px] flex gap-[14px]" style={d(80)}>
        {promises.map((p) => (
          <span key={p} className="flex items-center gap-[10px] rounded-full border-2 border-line px-[18px] py-[8px] text-[21px] font-bold text-ink-2">
            <Check size={22} strokeWidth={3.4} className="text-green-lip" />
            {p}
          </span>
        ))}
      </div>
      <div className="absolute left-[112px] top-[282px] grid w-[1376px] grid-cols-2 gap-[20px]">
        {options.map((o, n) => (
          <div key={o.title} className="s-in h-[158px] rounded-[18px] border-2 border-dashed border-line-2 px-[28px] py-[20px]" style={d(160 + n * 90)}>
            <div className="flex items-center justify-between gap-4">
              <p className="s-t !text-[27px]">{o.title}</p>
              <Tag who="plan">Hipotez</Tag>
            </div>
            <p className="s-p mt-[8px] !text-[21px] !text-ink-3">{o.text}</p>
          </div>
        ))}
      </div>
      <p className="s-in absolute left-[848px] top-[700px] w-[640px] text-[23px] font-bold leading-[1.35] text-ink" style={d(560)}>
        Bugün gelirimiz yok. Bunlar pilotta sınayacağımız seçenekler; henüz hiçbiri gelir değil.
      </p>
    </>
  );
}

// ---------------------------------------------------------------- impact: what the pilot will measure

function Measure() {
  const kpis = [
    { title: 'İlk doğrulanmış işe kadar', text: 'Kayıttan ilk Doğrulandı kanıta kaç gün geçiyor?', unit: 'gün' },
    { title: 'Yanıt bulan ihtiyaç', text: 'Yayımlanan ihtiyaçların kaçı pilota dönüşüyor?', unit: '%' },
    { title: 'Kurum onaylı aşama', text: 'Çift onaylanan aşamalar ve pilot tamamlanma oranı.', unit: 'adet' },
    { title: 'Eşleşmeyenin dönüşü', text: 'Eksik geri bildiriminden sonra yeni kanıt ekleyenler.', unit: '%' },
  ];
  return (
    <>
      <Heading width={1300}>Pilotta neyi ölçeceğiz?</Heading>
      <div className="absolute left-[112px] top-[214px] grid w-[1376px] grid-cols-4 gap-[20px]">
        {kpis.map((k, n) => (
          <div key={k.title} className="s-in flex h-[420px] flex-col rounded-[18px] border-2 border-line px-[24px] py-[24px]" style={d(120 + n * 100)}>
            {/* An empty dial: nothing measured yet. */}
            <div className="relative grid h-[120px] w-[120px] place-items-center">
              <svg viewBox="0 0 120 120" width="120" height="120" className="absolute inset-0" aria-hidden="true">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgb(var(--line-2))" strokeWidth="10" strokeDasharray="3 11" strokeLinecap="round" />
              </svg>
              <span className="text-[34px] font-black leading-none text-ink-3">?</span>
            </div>
            <p className="mt-[4px] text-[17px] font-bold text-ink-3">{k.unit}</p>
            <p className="mt-[16px] text-[26px] font-bold leading-[1.15] tracking-[-0.015em] text-ink">{k.title}</p>
            <p className="mt-[10px] text-[20px] font-semibold leading-[1.32] text-ink-3">{k.text}</p>
            <span className="mt-auto w-fit">
              <Tag who="plan">Pilotta ölçülecek</Tag>
            </span>
          </div>
        ))}
      </div>
      <p className="s-in absolute left-[848px] top-[702px] w-[640px] text-[23px] font-bold leading-[1.35] text-ink" style={d(560)}>
        Hedef rakam koymuyoruz. Önce taban çizgisini ölçüp kaynağıyla paylaşacağız.
      </p>
    </>
  );
}

export const SLIDES: Slide[] = [
  { id: 'baslik', title: 'Nirengi', mark: 'hero', niri: { mood: 'wave', gear: 0, line: 'Merhaba, ben Niri! Bugün size haritamı göstereceğim.' }, View: Title },
  { id: 'problem', title: 'Problem', mark: 'dock', niri: { mood: 'sad', gear: 0, line: 'Gençler görünmüyor, kurumlar emin olamıyor.' }, View: Problem },
  { id: 'kim-icin', title: 'Kim için', mark: 'dock', niri: { mood: 'think', gear: 0, line: 'Biri kanıt arıyor, öbürü güven.' }, View: ForWhom },
  { id: 'kanit', title: 'Kanıt', mark: 'dock', niri: { mood: 'think', gear: 1, line: 'Rakamları uydurmadım; kaynakları altında.' }, View: Evidence },
  { id: 'cozum', title: 'Çözüm', mark: 'dock', niri: { mood: 'happy', gear: 1, line: 'Kanıt, ihtiyaç, pilot: tek döngü.' }, View: Solution },
  { id: 'demo', title: 'Niri anlatıyor', mark: 'dock', bare: true, niri: { mood: 'cheer', gear: 2, line: 'Sahne benim! Ürünü telefonda göstereyim.' }, View: Film },
  { id: 'yz-ne', title: 'Yapay zekâ ne yapıyor', mark: 'dock', niri: { mood: 'talk', gear: 2, line: 'Derdini yaz, ben okuyayım. Uydurmam.' }, View: AiWhat },
  { id: 'yz-fark', title: 'Önce ve sonra', mark: 'dock', niri: { mood: 'happy', gear: 3, line: 'Aynı metinden daha dolu bir taslak.' }, View: AiDiff },
  { id: 'yz-onlem', title: 'Hatalı çıktıya karşı', mark: 'dock', niri: { mood: 'think', gear: 3, line: 'Metinde yoksa almam, sorarım.' }, View: AiGuard },
  { id: 'tasarim', title: 'Tasarım kararları', mark: 'dock', niri: { mood: 'cheer', gear: 3, line: 'Gence oyun, kuruma sakin bir ölçüm.' }, View: Decisions },
  { id: 'bitti', title: 'Bitti ve bırakılan', mark: 'dock', niri: { mood: 'happy', gear: 3, line: 'Prototipim çalışıyor. Gerisini pilotta kanıtlayacağım.' }, View: Done },
  { id: 'kapanis', title: 'Teşekkürler', mark: 'hero', niri: { mood: 'wave', gear: 4, turns: 2, line: 'Zirvedeyim! Teşekkürler, haritada görüşmek üzere.' }, View: Close },
  // Appendix: Niri keeps the Zirve costume.
  { id: 'fark', title: 'XP makbuzu', mark: 'dock', appendix: true, niri: { mood: 'happy', gear: 4, line: 'Benim XP’m boş tıklamayla gelmez.' }, View: Difference },
  { id: 'dongu', title: 'Üç nesne, tek döngü', mark: 'dock', appendix: true, niri: { mood: 'think', gear: 4, line: 'İş bitince kanıtın bir basamak yükselir.' }, View: Objects },
  { id: 'iki-yuz', title: 'Genç ve kurum', mark: 'dock', appendix: true, niri: { mood: 'cheer', gear: 4, line: 'Gence oyun, kuruma ölçüm; ikisi de aynı kanıttan.' }, View: Faces },
  { id: 'guven', title: 'Neden güvenilir', mark: 'dock', appendix: true, niri: { mood: 'talk', gear: 4, line: 'Her puanımın nedenini sorabilirsiniz.' }, View: Trust },
  { id: 'pazar', title: 'Önce kim', mark: 'dock', appendix: true, niri: { mood: 'point', point: 'right', gear: 4, line: 'Haritayı en yakın tepeden çizmeye başlıyorum.' }, View: Market },
  { id: 'rekabet', title: 'Rekabet', mark: 'dock', appendix: true, niri: { mood: 'point', point: 'right', gear: 4, line: 'İkisinin buluştuğu köşe boştu. Oraya yerleştim.' }, View: Worlds },
  { id: 'model', title: 'Nasıl yaşar', mark: 'dock', appendix: true, niri: { mood: 'think', gear: 4, line: 'Gence ücret yok. Gerisini pilotta sınayacağız.' }, View: Model },
  { id: 'olcum', title: 'Pilotta ölçülecekler', mark: 'dock', appendix: true, niri: { mood: 'think', gear: 4, line: 'Rakam uydurmak yok; ölçüp size getireceğim.' }, View: Measure },
];

/** How many slides the talk has; the rest are the appendix. */
export const MAIN = SLIDES.filter((s) => !s.appendix).length;

/** "3 / 12" in the talk, "Ek 2 / 8" in the appendix. */
export const place = (i: number) => (i < MAIN ? `${i + 1} / ${MAIN}` : `Ek ${i - MAIN + 1} / ${SLIDES.length - MAIN}`);
