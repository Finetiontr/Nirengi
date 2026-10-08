// The slides. Each one carries a single idea, laid out on the 1600×900 stage,
// plus Niri's line for it. Niri stands on one of two marks (see Deck): 'hero'
// on the right for the opening and the close, 'dock' bottom-left elsewhere, so
// every slide keeps that corner (x < 760, y > 700) free.
//
// Numbers come from docs/PAZAR-ANALIZI.md with their sources; product numbers
// from the engine. Nothing here is invented: people and institutions in the
// demo are fictional and the deck says so.

import type { CSSProperties, ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { Dir, Mood } from '../ui/Niri';
import { Contours, Tri } from '../ui/pafta';
import { SurveyFlag } from '../ui/kit';
import { LevelGlyph } from '../ui/primitives';
import { Bolt, Compass, Flame, Mark as BrandMark, Route, Shield } from '../ui/icons';
import { PUBLISH_THRESHOLD } from '../../lib/engine/canvas.ts';
import { TIERS, XP } from '../../lib/engine/progress.ts';

export type Mark = 'hero' | 'dock';

export interface Slide {
  id: string;
  title: string;
  mark: Mark;
  niri: { mood: Mood; line: string; point?: Dir };
  View: () => ReactNode;
}

/** The team fills this in before going on stage; until then the close shows a dashed placeholder. */
const TEAM: string[] = [];

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;
const f = (n: number) => n.toLocaleString('tr-TR');

function Heading({ children, width = 1180, className = '' }: { children: ReactNode; width?: number; className?: string }) {
  return (
    <h2 className={`s-h s-in absolute left-[112px] top-[92px] ${className}`} style={{ maxWidth: width }}>
      {children}
    </h2>
  );
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

// ---------------------------------------------------------------- 1 title

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
      <p className="s-cap s-in absolute left-[112px] top-[800px]" style={d(380)}>
        Zemin360 Hackathon finali · İstanbul · Ekim 2026
      </p>
      <SurveyFlag size={96} delay={0.6} className="absolute left-[1478px] top-[694px]" />
    </>
  );
}

// ---------------------------------------------------------------- 2 problem

const STATS = [
  {
    value: '%71,0',
    text: 'BİT uzmanı almakta zorlanan girişimlerin “ilgili iş deneyimi yok” diyen payı',
    src: 'TÜİK, Girişimlerde BİT Kullanımı 2025',
  },
  {
    value: '%13,0',
    text: '15–24 yaş işsizliği; genç kadınlarda %19,4',
    src: 'TÜİK, Ağustos 2026',
  },
  {
    value: '%23,3',
    text: '15–24 yaşta ne eğitimde ne istihdamda olanlar',
    src: 'TÜİK, 2025',
  },
  {
    value: '700’de 1',
    text: 'Diploma şartını kaldıran şirketlerde gerçekten değişen işe alım: bundan bile az',
    src: 'Harvard Business School ve Burning Glass Institute, 2024',
  },
];

function Problem() {
  return (
    <>
      <Heading width={1400}>Deneyim yoksa iş yok. İş yoksa deneyim yok.</Heading>
      <div className="absolute left-[112px] top-[206px] grid w-[1376px] grid-cols-2 gap-[20px]">
        {STATS.map((s, n) => (
          <div key={s.value} className="s-in h-[222px] rounded-[18px] border-2 border-line bg-bg px-[32px] py-[22px]" style={d(120 + n * 90)}>
            <p className="num text-[70px] font-extrabold leading-none tracking-[-0.04em] text-ink">{s.value}</p>
            <p className="mt-[14px] text-[23px] font-semibold leading-[1.3] text-ink-2">{s.text}</p>
            <p className="s-cap mt-[8px] !text-[16px]">{s.src}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------- 3 two worlds

/** Positions on the map, 0–1 on each axis: x = how real the proof is, y = how habitual. */
const RIVALS = [
  { name: 'Oyunlaştırılmış öğrenme', x: 0.16, y: 0.84 },
  { name: 'İlan ve kariyer siteleri', x: 0.12, y: 0.2 },
  { name: 'Test ve bootcamp', x: 0.38, y: 0.36 },
  { name: 'Mikro staj', x: 0.72, y: 0.2 },
];

function Worlds() {
  const W = 740;
  const H = 440;
  const px = (x: number) => 40 + x * (W - 80);
  const py = (y: number) => H - 40 - y * (H - 80);
  return (
    <>
      <Heading width={1400}>İki dünya var, birbirine dokunmuyor.</Heading>
      <div className="absolute left-[112px] top-[244px] flex w-[560px] flex-col gap-[20px]">
        <div className="s-in rounded-[18px] border-2 border-line px-[26px] py-[22px]" style={d(120)}>
          <p className="s-t">Oyunlaştırılmış öğrenme</p>
          <p className="s-p mt-[8px] !text-ink-3">Seri, lig, XP. Alışkanlık kurar ama XP uygulamada kalır.</p>
        </div>
        <div className="s-in rounded-[18px] border-2 border-line px-[26px] py-[22px]" style={d(220)}>
          <p className="s-t">İşe alım platformları</p>
          <p className="s-p mt-[8px] !text-ink-3">CV, test skoru, katılım sertifikası. Tek seferlik bir eşik.</p>
        </div>
      </div>

      {/* The map: x from declared to verified real work, y from one-off to habit. */}
      <div className="s-in absolute left-[748px] top-[214px] w-[740px]" style={d(320)}>
        <div className="relative h-[440px] w-[740px] overflow-hidden rounded-[18px] border-2 border-line">
          <Contours seed={5} x={0.9} y={0.15} rings={10} step={34} opacity={0.4} />
          <div className="absolute right-0 top-0 h-1/2 w-1/2 bg-indigo-tint/60" />
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d={`M${W / 2} 16V${H - 16}M16 ${H / 2}H${W - 16}`} stroke="rgb(var(--line-2))" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
          </svg>
          {RIVALS.map((r) => (
            <div key={r.name} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: px(r.x), top: py(r.y) }}>
              <Tri size={40} state="locked" />
              <p className="mt-[6px] whitespace-nowrap rounded-[8px] bg-bg px-[8px] py-[2px] text-[19px] font-semibold text-ink-2">{r.name}</p>
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

// ---------------------------------------------------------------- 4 the difference

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

// ---------------------------------------------------------------- 5 three objects

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

// ---------------------------------------------------------------- 6 genç

function Genc() {
  const cards = [
    { icon: <Flame size={58} />, title: 'Haftalık hedef ve seri', text: 'Commit sayısı değil, üretim yaptığın gün sayılır.' },
    {
      icon: <Shield size={58} tier={4} />,
      title: 'Lig ve Niri’nin kostümleri',
      text: `Benzer seviyedekilerle haftalık lig, ${TIERS[0]}’den ${TIERS[TIERS.length - 1]}’ye ${TIERS.length} kademe.`,
    },
    { icon: <Route size={58} />, title: 'Açık kaynak görevleri', text: 'Gerçek “good first issue”lar. PR birleşince sayılır.' },
    { icon: <Compass size={58} />, title: 'Niri’nin analizi', text: 'Neyin eksik, nasıl gelişirsin: eşleşmediğinde nedenini görürsün.' },
  ];
  return (
    <>
      <Heading>Genç için: her hafta küçük ama gerçek bir adım</Heading>
      <div className="absolute left-[112px] top-[292px] grid w-[1376px] grid-cols-2 gap-[24px]">
        {cards.map((c, n) => (
          <div key={c.title} className="s-in flex h-[178px] items-center gap-[26px] rounded-[18px] border-2 border-line px-[30px]" style={d(120 + n * 90)}>
            {c.icon}
            <div className="min-w-0">
              <p className="s-t !text-[28px]">{c.title}</p>
              <p className="s-p mt-[6px] !text-[22px] !text-ink-3">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="s-cap s-in absolute left-[800px] top-[720px] w-[688px]" style={d(500)}>
        XP yalnızca dışarıda doğrulanabilen işten gelir; günde en fazla {f(XP.dailyCap)} XP.
      </p>
    </>
  );
}

// ---------------------------------------------------------------- 7 kurum

function Kurum() {
  const steps = [
    { title: 'Şikâyetten ihtiyaca', text: 'Muğlak bir dert, kanvasla ölçülebilir bir ihtiyaca dönüşür.' },
    { title: 'Gerekçeli kısa liste', text: 'İsimsiz inceleme: önce iş görünür. Her adayın yanında “neden bu uyum?”' },
    { title: 'Kadro yerine küçük pilot', text: 'İşe alım riski almadan, aşamaları belli kısa bir proje.' },
    { title: 'Hesap verebilir kayıt', text: 'Çift onaylı aşamalar, değiştirilemez defter, iki tarafın da görebildiği kayıt.' },
  ];
  const X = [170, 514, 858, 1202];
  return (
    <>
      <Heading width={1100}>Kurum için tek soru: ihtiyacını ne ölçüde çözer?</Heading>
      <svg viewBox="0 0 1376 120" width="1376" height="120" className="absolute left-[112px] top-[300px]" aria-hidden="true">
        <path
          
          d={`M${X[0]} 60H${X[3]}`}
          stroke="rgb(var(--indigo) / 0.55)"
          strokeWidth="5"
          strokeDasharray="2 14"
          strokeLinecap="round"
        />
      </svg>
      {steps.map((s, n) => (
        <div key={s.title} className="s-in absolute flex w-[316px] flex-col items-center text-center" style={{ left: 112 + X[n] - 158, top: 314, ...d(120 + n * 110) }}>
          <Tri size={88}>
            <span className="text-[30px] font-black leading-none text-white">{n + 1}</span>
          </Tri>
          <p className="s-t mt-[18px] !text-[27px]">{s.title}</p>
          <p className="s-p mt-[8px] !text-[21px] !text-ink-3">{s.text}</p>
        </div>
      ))}
    </>
  );
}

// ---------------------------------------------------------------- 8 live demo

function Demo() {
  const steps = [
    { who: 'Genç', text: 'GitHub hesabını bağlar, sahipliği kontrol edilir: kanıt Doğrulandı.' },
    { who: 'Kurum', text: `İhtiyacını kanvasla yazar; çözülebilirlik ${PUBLISH_THRESHOLD}’i geçince yayımlar.` },
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
      <Heading width={600} className="!text-[58px]">Şimdi iki pencereyle canlı gösterelim</Heading>
      <div className="absolute left-[112px] top-[332px] flex w-[560px] flex-col gap-[18px]">
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

// ---------------------------------------------------------------- 9 open source

function Open() {
  const principles = [
    { title: 'Açık kaynak', text: 'MIT lisanslı. Kod, kurallar ve formüller herkesin önünde.' },
    { title: 'Açıklanabilir', text: 'Her puanın formülü görünür. Kara kutu öneri yok.' },
    { title: 'Önyargıya kapalı', text: 'İlk temasta isim, okul, şehir görünmez. Önce iş.' },
  ];
  return (
    <>
      <Heading>Kamu yararı için açık bir altyapı</Heading>
      <div className="absolute left-[112px] top-[226px] grid w-[1376px] grid-cols-3 gap-[24px]">
        {principles.map((p, n) => (
          <div key={p.title} className="s-in rounded-[18px] border-2 border-line px-[28px] py-[24px]" style={d(100 + n * 90)}>
            <p className="s-t !text-[28px]">{p.title}</p>
            <p className="s-p mt-[8px] !text-[22px] !text-ink-3">{p.text}</p>
          </div>
        ))}
      </div>
      <div className="s-in absolute left-[112px] top-[440px] flex w-[1376px] gap-[40px] rounded-[18px] bg-bg-2 px-[32px] py-[26px]" style={d(400)}>
        <p className="s-t w-[300px] shrink-0 !text-[27px]">Gerçek mi, demo mu?</p>
        <div className="grid flex-1 grid-cols-2 gap-[32px]">
          <ul className="flex flex-col gap-[10px]">
            <li className="text-[18px] font-bold text-green-lip">Gerçek</li>
            {['GitHub doğrulaması', 'DNS TXT doğrulaması', 'Puanlar, eşleşme ve defter canlı hesaplanır'].map((t) => (
              <li key={t} className="flex gap-[10px] text-[21px] font-semibold leading-snug text-ink-2">
                <Check size={22} strokeWidth={3.4} className="mt-[3px] shrink-0 text-green-lip" />
                {t}
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-[10px]">
            <li className="text-[18px] font-bold text-ink-3">Demo</li>
            {['Kurumlar ve kişiler kurgusal', 'Veri şimdilik tarayıcıda tutulur'].map((t) => (
              <li key={t} className="flex gap-[10px] text-[21px] font-semibold leading-snug text-ink-2">
                <span className="mt-[5px] shrink-0">
                  <LevelGlyph level="S1" size={20} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- 10 roadmap

function Roadmap() {
  const items = [
    { title: 'Kalıcılık', text: 'Cloudflare D1 ve OAuth ile gerçek hesaplar' },
    { title: 'Kod dışı kanıtlar', text: 'Behance, Figma ve DOI doğrulaması' },
    { title: 'Taşınabilir kanıt', text: 'Open Badges 3.0 ile platform dışına çıkan kayıt' },
    { title: 'Fon verene pilot raporu', text: 'Fonlu projeler için hazır hesap verebilirlik çıktısı' },
    { title: 'İlk ihtiyaç turu', text: 'Zemin360 ve GİRVAK ağındaki kurumlarla' },
  ];
  const ROW = 116;
  return (
    <>
      <Heading width={560}>Finalden sonra</Heading>
      <p className="s-in absolute left-[112px] top-[192px] w-[520px] text-[28px] font-medium leading-[1.35] text-ink-3" style={d(100)}>
        Hackathon bir başlangıç noktası. Sıradaki beş nirengi noktası:
      </p>
      <svg viewBox={`0 0 60 ${ROW * 4}`} width="60" height={ROW * 4} className="absolute left-[790px] top-[150px]" aria-hidden="true">
        <path d={`M30 0V${ROW * 4}`} stroke="rgb(var(--line-2))" strokeWidth="5" strokeDasharray="2 14" strokeLinecap="round" />
      </svg>
      {items.map((it, n) => (
        <div key={it.title} className="s-in absolute flex items-center gap-[26px]" style={{ left: 790, top: 114 + n * ROW, ...d(160 + n * 100) }}>
          <span className="rounded-[8px] bg-bg">
            <Tri size={64} state="waiting">
              <span className="text-[22px] font-black leading-none text-ink-3">{n + 1}</span>
            </Tri>
          </span>
          <div>
            <p className="s-t !text-[28px]">{it.title}</p>
            <p className="mt-[2px] text-[21px] font-semibold text-ink-3">{it.text}</p>
          </div>
        </div>
      ))}
    </>
  );
}

// ---------------------------------------------------------------- 11 close

function Close() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Contours seed={7} x={0.86} y={0.78} rings={14} step={34} opacity={0.55} />
      </div>
      <div className="absolute left-[112px] top-[120px] w-[900px]">
        <p className="s-in text-[124px] font-extrabold leading-[0.98] tracking-[-0.045em] text-ink">
          Beyan değil,
          <br />
          <span className="text-indigo">kanıt.</span>
        </p>
        <div className="s-in mt-[36px]" style={d(200)}>
          <Wordmark size={64} />
        </div>
      </div>
      <div className="s-in absolute left-[112px] top-[540px] w-[600px]" style={d(360)}>
        <p className="text-[18px] font-bold text-ink-3">Ekip</p>
        {TEAM.length ? (
          <p className="mt-[4px] text-[26px] font-bold text-ink">{TEAM.join(' · ')}</p>
        ) : (
          <p className="mt-[8px] rounded-[14px] border-2 border-dashed border-line-2 px-[18px] py-[10px] text-[22px] font-semibold text-ink-3">Ekip adları buraya</p>
        )}
      </div>
      <SurveyFlag size={96} delay={0.6} className="absolute left-[1478px] top-[694px]" />
    </>
  );
}

export const SLIDES: Slide[] = [
  { id: 'baslik', title: 'Beyan değil, kanıt', mark: 'hero', niri: { mood: 'wave', line: 'Merhaba, ben Niri! Bugün size haritamı göstereceğim.' }, View: Title },
  { id: 'problem', title: 'Problem', mark: 'dock', niri: { mood: 'sad', line: 'Gençler görünmüyor, kurumlar emin olamıyor.' }, View: Problem },
  { id: 'iki-dunya', title: 'İki dünya', mark: 'dock', niri: { mood: 'point', point: 'right', line: 'İkisinin buluştuğu köşe boştu. Oraya yerleştim.' }, View: Worlds },
  { id: 'fark', title: 'Tek cümlelik fark', mark: 'dock', niri: { mood: 'happy', line: 'Benim XP’m boş tıklamayla gelmez.' }, View: Difference },
  { id: 'nesneler', title: 'Üç nesne', mark: 'dock', niri: { mood: 'think', line: 'İş bitince kanıtın bir basamak yükselir.' }, View: Objects },
  { id: 'genc', title: 'Genç tarafı', mark: 'dock', niri: { mood: 'cheer', line: 'Seri de lig de var; hepsini gerçek iş kazandırır.' }, View: Genc },
  { id: 'kurum', title: 'Kurum tarafı', mark: 'dock', niri: { mood: 'talk', line: 'Kurum ilan yazmaz; çözülecek bir ihtiyaç yazar.' }, View: Kurum },
  { id: 'demo', title: 'Canlı demo', mark: 'dock', niri: { mood: 'point', point: 'up', line: 'Lafı bırakalım, ekrana geçelim.' }, View: Demo },
  { id: 'acik', title: 'Açık kaynak', mark: 'dock', niri: { mood: 'happy', line: 'Kodum açık. Her puanımın nedenini sorabilirsiniz.' }, View: Open },
  { id: 'yol', title: 'Yol haritası', mark: 'dock', niri: { mood: 'point', point: 'right', line: 'Sıradaki nirengi noktalarım bunlar.' }, View: Roadmap },
  { id: 'kapanis', title: 'Teşekkürler', mark: 'hero', niri: { mood: 'wave', line: 'Teşekkürler! Haritada görüşmek üzere.' }, View: Close },
];
