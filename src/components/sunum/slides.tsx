// The slides. Each one carries a single idea, laid out on the 1600×900 stage,
// plus Niri's line for it. Niri stands on one of two marks (see Deck): 'hero'
// on the right for the opening and the close, 'dock' bottom-left elsewhere, so
// every slide keeps that corner (x < 760, y > 700) free.
//
// The arc is the one a jury and investors look for: problem, why now, solution,
// product, trust, demo, market, competition, how it lives, where we are, what we
// will measure, roadmap, the ask. Numbers come from docs/PAZAR-ANALIZI.md with
// their sources on the slide; product numbers from the engine. Nothing here is
// invented: plans are labelled as plans, and people and institutions in the demo
// are fictional and the deck says so. No third-party brand names: categories only.

import type { CSSProperties, ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { Dir, Mood } from '../ui/Niri';
import { Contours, Tri } from '../ui/pafta';
import { SurveyFlag } from '../ui/kit';
import { LevelGlyph } from '../ui/primitives';
import { Bolt, Compass, Flame, Mark as BrandMark, Route, Shield } from '../ui/icons';
import { PUBLISH_THRESHOLD } from '../../lib/engine/canvas.ts';
import { GENESIS, sha256, shortHash } from '../../lib/engine/ledger.ts';
import { WEIGHTS } from '../../lib/engine/match.ts';
import { TIERS, XP } from '../../lib/engine/progress.ts';

export type Mark = 'hero' | 'dock';

export interface Slide {
  id: string;
  title: string;
  mark: Mark;
  /** Niri's line. `gear` is the league costume (climbing toward Zirve by the close); `turns` the twirl into it. */
  niri: { mood: Mood; line: string; point?: Dir; gear?: number; turns?: 1 | 2 };
  View: () => ReactNode;
}

/** The team fills this in before going on stage; until then the close shows a dashed placeholder. */
const TEAM: string[] = ['Sezer Uzun', 'Emirhan Açık'];

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

// ---------------------------------------------------------------- title

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

// ---------------------------------------------------------------- problem: two sides, sourced

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

// ---------------------------------------------------------------- why now: a timeline

function WhyNow() {
  const marks = [
    { when: 'Şubat 2024', value: '700’de 1', text: 'Diploma şartını kaldıran şirketlerde gerçekten değişen işe alım: bundan bile az.', src: 'Harvard Business School ve Burning Glass Institute' },
    { when: 'Ocak 2025', value: '%63', text: 'İşverenlerin dönüşümdeki 1 numaralı engeli: beceri açığı.', src: 'Dünya Ekonomik Forumu, İşlerin Geleceği 2025' },
    { when: 'Ağustos 2025', value: '%13', text: 'Yapay zekâya en açık mesleklerde 22–25 yaş istihdamındaki görece düşüş. Deneyimlilerde düşüş yok.', src: 'Stanford, ABD bordro verisi' },
  ];
  const COL = 344;
  return (
    <>
      <Heading>Neden şimdi?</Heading>
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
      <div className="s-in absolute w-[312px]" style={{ left: 112 + 3 * COL, top: 250, ...d(520) }}>
        <span className="relative block w-fit">
          <Ping size={70} />
          <Tri size={52} />
        </span>
        <p className="mt-[16px] text-[19px] font-bold text-indigo">Bugün</p>
        <p className="mt-[8px] text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink">Taşınabilir kanıtın açık standardı hazır.</p>
        <p className="mt-[12px] text-[21px] font-semibold leading-[1.32] text-ink-2">Open Badges 3.0, W3C doğrulanabilir kimlik bilgisi olarak.</p>
        <p className="mt-[14px] text-[21px] font-bold leading-[1.32] text-indigo">Ölçme aracını kurmanın zamanı.</p>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- solution: the one-sentence difference

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

// ---------------------------------------------------------------- live demo

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
        <p className="s-cap s-in mt-[4px]" style={d(320)}>
          Demodaki kişiler ve kurumlar kurgusal; GitHub ve DNS doğrulaması gerçek.
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

// ---------------------------------------------------------------- where we are: the honest table

function Today() {
  const real = ['Gerçek GitHub hesap sahipliği ve DNS TXT doğrulaması', 'Eşleşme, kanvas ve defter motoru otomatik testlerle', 'Açık kod, MIT lisansı'];
  const notYet = ['Gerçek kullanıcı, kurum ya da pilot: demo verisi kurgusal', 'Kalıcı veritabanı: veri şimdilik tarayıcıda', 'Kod dışı kanıt türleri'];
  return (
    <>
      <Heading width={1300}>Bugün neredeyiz?</Heading>
      <div className="s-in absolute left-[112px] top-[208px] w-[640px]" style={d(120)}>
        <p className="text-[19px] font-bold text-green-lip">Çalışıyor</p>
        <p className="mt-[6px] flex items-end gap-[18px]">
          <span className="num text-[96px] font-extrabold leading-none tracking-[-0.045em] text-ink">6 / 6</span>
          <span className="text-[23px] font-semibold leading-[1.3] text-ink-2">
            başvurudaki problem için
            <br />
            çalışan ekran
          </span>
        </p>
        <ul className="mt-[22px] flex flex-col gap-[12px] border-t-2 border-line pt-[18px]">
          {real.map((t) => (
            <li key={t} className="flex gap-[12px] text-[22px] font-semibold leading-snug text-ink-2">
              <Check size={24} strokeWidth={3.4} className="mt-[3px] shrink-0 text-green-lip" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="s-in absolute left-[848px] top-[208px] w-[640px] rounded-[18px] bg-bg-2 px-[30px] py-[24px]" style={d(260)}>
        <p className="text-[19px] font-bold text-ink-3">Henüz yok</p>
        <ul className="mt-[14px] flex flex-col gap-[14px]">
          {notYet.map((t) => (
            <li key={t} className="flex gap-[12px] text-[22px] font-semibold leading-snug text-ink-2">
              <span className="mt-[5px] shrink-0">
                <LevelGlyph level="S1" size={22} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <p className="s-in absolute left-[848px] top-[690px] w-[640px] text-[26px] font-extrabold leading-[1.25] tracking-[-0.02em] text-ink" style={d(420)}>
        Bir hackathon prototipi. Gerisini <span className="text-indigo">pilotta kanıtlayacağız.</span>
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

// ---------------------------------------------------------------- roadmap

function Roadmap() {
  const items = [
    { title: 'Kalıcılık', text: 'Gerçek hesaplar, kurum hesapları, kalıcı veritabanı' },
    { title: 'İlk ihtiyaç turu', text: 'Zemin360 ve GİRVAK ağındaki kurumlarla' },
    { title: 'Kod dışı kanıtlar', text: 'Tasarım, yayın (DOI) ve paket doğrulaması' },
    { title: 'Taşınabilir kanıt', text: 'Open Badges 3.0 ile platform dışına çıkan kayıt' },
    { title: 'Fon verene pilot raporu', text: 'Fonlu projeler için hazır hesap verebilirlik çıktısı' },
  ];
  const ROW = 116;
  return (
    <>
      <Heading width={560}>Finalden sonra: 4 ay</Heading>
      <p className="s-in absolute left-[112px] top-[200px] w-[520px] text-[28px] font-medium leading-[1.35] text-ink-3" style={d(100)}>
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

// ---------------------------------------------------------------- the ask

function Ask() {
  const asks = [
    { title: 'İlk ihtiyaç turuna kurum', text: 'Gerçek bir ihtiyacını kanvasa yazacak bir KOBİ, kamu birimi ya da STK.' },
    { title: 'Mentorluk', text: 'Kamu fonlu programların raporlaması, kurum tarafında benimseme, kişisel veri uyumu.' },
    { title: 'Kuluçka ve hibe yolu', text: 'Pilotu taşıyacak bir program ya da fon için yönlendirme.' },
  ];
  return (
    <>
      <Heading width={560}>Sizden üç şey istiyoruz</Heading>
      <p className="s-in absolute left-[112px] top-[262px] w-[540px] text-[28px] font-medium leading-[1.35] text-ink-3" style={d(100)}>
        En somutu: bu salondan bir kurumun gerçek bir ihtiyacı. İlk kanvası birlikte yazalım.
      </p>
      {asks.map((a, n) => (
        <div
          key={a.title}
          className="s-in absolute flex w-[728px] items-center gap-[28px] rounded-[18px] border-2 border-line px-[30px] py-[26px]"
          style={{ left: 760, top: 150 + n * 196, ...d(180 + n * 120) }}
        >
          <span className="shrink-0">
            <Tri size={78}>
              <span className="text-[28px] font-black leading-none text-white">{n + 1}</span>
            </Tri>
          </span>
          <div className="min-w-0">
            <p className="s-t !text-[30px]">{a.title}</p>
            <p className="mt-[6px] text-[22px] font-semibold leading-[1.32] text-ink-3">{a.text}</p>
          </div>
        </div>
      ))}
    </>
  );
}

// ---------------------------------------------------------------- close

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
        <p className="mt-[18px] text-[21px] font-semibold text-ink-3">Açık kaynak · MIT lisanslı</p>
      </div>
      <SurveyFlag size={96} delay={0.6} className="absolute left-[1478px] top-[694px]" />
    </>
  );
}

export const SLIDES: Slide[] = [
  { id: 'baslik', title: 'Beyan değil, kanıt', mark: 'hero', niri: { mood: 'wave', gear: 0, line: 'Merhaba, ben Niri! Bugün size haritamı göstereceğim.' }, View: Title },
  { id: 'problem', title: 'Problem', mark: 'dock', niri: { mood: 'sad', gear: 0, line: 'Gençler görünmüyor, kurumlar emin olamıyor.' }, View: Problem },
  { id: 'neden-simdi', title: 'Neden şimdi', mark: 'dock', niri: { mood: 'think', gear: 0, line: 'Kapı daralırken kanıt her zamankinden değerli.' }, View: WhyNow },
  { id: 'fark', title: 'Çözüm', mark: 'dock', niri: { mood: 'happy', gear: 1, line: 'Benim XP’m boş tıklamayla gelmez.' }, View: Difference },
  { id: 'dongu', title: 'Üç nesne, tek döngü', mark: 'dock', niri: { mood: 'think', gear: 1, line: 'İş bitince kanıtın bir basamak yükselir.' }, View: Objects },
  { id: 'iki-yuz', title: 'Genç ve kurum', mark: 'dock', niri: { mood: 'cheer', gear: 1, line: 'Gence oyun, kuruma ölçüm; ikisi de aynı kanıttan.' }, View: Faces },
  { id: 'guven', title: 'Neden güvenilir', mark: 'dock', niri: { mood: 'talk', gear: 2, line: 'Her puanımın nedenini sorabilirsiniz.' }, View: Trust },
  { id: 'demo', title: 'Canlı demo', mark: 'dock', niri: { mood: 'point', point: 'up', gear: 2, line: 'Lafı bırakalım, ekrana geçelim.' }, View: Demo },
  { id: 'pazar', title: 'Önce kim', mark: 'dock', niri: { mood: 'point', point: 'right', gear: 2, line: 'Haritayı en yakın tepeden çizmeye başlıyorum.' }, View: Market },
  { id: 'rekabet', title: 'Rekabet', mark: 'dock', niri: { mood: 'point', point: 'right', gear: 3, line: 'İkisinin buluştuğu köşe boştu. Oraya yerleştim.' }, View: Worlds },
  { id: 'model', title: 'Nasıl yaşar', mark: 'dock', niri: { mood: 'think', gear: 3, line: 'Gence ücret yok. Gerisini pilotta sınayacağız.' }, View: Model },
  { id: 'bugun', title: 'Bugün neredeyiz', mark: 'dock', niri: { mood: 'happy', gear: 3, line: 'Prototipim çalışıyor. Kullanıcılarımı pilotta bulacağım.' }, View: Today },
  { id: 'olcum', title: 'Pilotta ölçülecekler', mark: 'dock', niri: { mood: 'think', gear: 3, line: 'Rakam uydurmak yok; ölçüp size getireceğim.' }, View: Measure },
  { id: 'yol', title: 'Yol haritası', mark: 'dock', niri: { mood: 'point', point: 'right', gear: 3, line: 'Sıradaki nirengi noktalarım bunlar.' }, View: Roadmap },
  { id: 'istek', title: 'Sizden istediğimiz', mark: 'dock', niri: { mood: 'point', point: 'right', gear: 3, line: 'Bir ihtiyacınızı yazın, ilk pilotu birlikte kuralım.' }, View: Ask },
  { id: 'kapanis', title: 'Teşekkürler', mark: 'hero', niri: { mood: 'wave', gear: 4, turns: 2, line: 'Zirvedeyim! Teşekkürler, haritada görüşmek üzere.' }, View: Close },
];
