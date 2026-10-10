// The slides. Each one carries a single idea in few words, laid out on the 1600×900
// stage, plus Niri's line for it; the team says the rest (notes.ts). Niri stands on
// one of two marks (see Deck): 'hero' on the right for the opening and the close,
// 'dock' bottom-left elsewhere, so every slide keeps that corner (x < 760, y > 700) free.
//
// The twelve slides follow the flow the organisers recommended: team, problem, for whom,
// evidence, solution, demo (the film), what the AI does, its before and after, the guard
// against wrong output, design decisions, done and left, close. Numbers come from
// docs/PAZAR-ANALIZI.md with their sources on the slide; product numbers from the engine,
// and the AI slides run a real model answer through the product's own guard. Nothing
// here is invented: plans are labelled as plans, and people and institutions in the demo
// are fictional and the deck says so. No third-party brand names.

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import type { Dir, Mood } from '../ui/Niri';
import { Contours, Tri } from '../ui/pafta';
import { SurveyFlag } from '../ui/kit';
import { Mark as BrandMark } from '../ui/icons';
import type { Canvas } from '../../lib/types.ts';
import { assessCanvas, filledFields, PUBLISH_THRESHOLD, SAMPLE_COMPLAINT } from '../../lib/engine/canvas.ts';
import { cites, readModelDraft, readRulesDraft } from '../../lib/engine/ground.ts';
import { INVENTED_DECIDER, SAMPLE_READING } from '../../lib/sample-reading.ts';

export type Mark = 'hero' | 'dock';

export interface Slide {
  id: string;
  title: string;
  mark: Mark;
  /** The view owns the whole stage (the film): Niri and the counter step aside. */
  bare?: boolean;
  /** Niri's line. `gear` is the league costume (climbing toward Zirve by the close); `turns` the twirl into it. */
  niri: { mood: Mood; line: string; point?: Dir; gear?: number; turns?: 1 | 2 };
  View: () => ReactNode;
}

const TEAM = ['Sezer Uzun', 'Emirhan Açık'];
const SITE = 'finetiontr.github.io/Nirengi';

/** The promo film, served from the site; Deck fetches it early so it starts at once. */
export const FILM = '/sunum/nirengi-film.mp4';
const POSTER = '/sunum/nirengi-film.webp';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

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

function Tag({ who, children }: { who: 'genc' | 'kurum'; children: ReactNode }) {
  const tone = who === 'genc' ? 'bg-cyan-tint text-cyan-ink' : 'bg-indigo-tint text-indigo';
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

/** A figure inside a sentence: the one thing the eye should land on. */
function Fig({ children }: { children: ReactNode }) {
  return <span className="num text-indigo">{children}</span>;
}

/** The dashed seam between the genç and kurum halves of a slide. */
function Seam({ top, height }: { top: number; height: number }) {
  return (
    <svg viewBox={`0 0 4 ${height}`} width="4" height={height} className="absolute left-[798px]" style={{ top }} aria-hidden="true">
      <path d={`M2 2V${height - 2}`} stroke="rgb(var(--line-2))" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
    </svg>
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

// ---------------------------------------------------------------- 2. problem: one sourced sentence per side

function Problem() {
  const rows = [
    { who: 'genc' as const, tag: 'Genç', text: <>Her 100 gençten <Fig>23’ü</Fig> ne okulda ne işte.</>, src: '15–24 yaş · TÜİK, 2025' },
    {
      who: 'kurum' as const,
      tag: 'Kurum',
      text: <>BİT uzmanı almakta zorlanan her 100 girişimden <Fig>71’i</Fig>: “ilgili iş deneyimi yok.”</>,
      src: 'TÜİK, Girişimlerde BİT Kullanımı 2025',
    },
  ];
  return (
    <>
      <Heading width={1400}>Deneyim yoksa iş yok. İş yoksa deneyim yok.</Heading>
      {rows.map((r, n) => (
        <div key={r.tag} className="s-in absolute left-[112px] w-[1300px]" style={{ top: 250 + n * 190, ...d(160 + n * 200) }}>
          <Tag who={r.who}>{r.tag}</Tag>
          <p className="mt-[14px] text-[46px] font-extrabold leading-[1.12] tracking-[-0.025em] text-ink">{r.text}</p>
          <Src className="mt-[8px]">{r.src}</Src>
        </div>
      ))}
    </>
  );
}

// ---------------------------------------------------------------- 3. for whom, and why it matters

function ForWhom() {
  const cols = [
    { who: 'genc' as const, tag: 'Genç', title: 'Üreten ama kanıtı olmayan genç', fact: <>Tek bir seçici programa <Fig>~1 milyon</Fig> başvuru. Kapıda kalan görünmüyor.</>, src: 'GİRVAK Fellow, 10. yıl açıklaması' },
    { who: 'kurum' as const, tag: 'Kurum', title: 'BİT uzmanı olmayan küçük kurum', fact: <>10–49 çalışanlı girişimlerin yalnız <Fig>%10,8</Fig>’inde BİT uzmanı var.</>, src: 'TÜİK, BİT bülteni 2026' },
  ];
  return (
    <>
      <Heading width={1300}>Kim için, neden önemli?</Heading>
      {cols.map((c, n) => (
        <div key={c.tag} className="s-in absolute top-[236px] w-[620px]" style={{ left: n ? 848 : 112, ...d(160 + n * 200) }}>
          <Tag who={c.who}>{c.tag}</Tag>
          <p className="mt-[16px] text-[46px] font-extrabold leading-[1.06] tracking-[-0.03em] text-ink">{c.title}</p>
          <p className="mt-[24px] text-[30px] font-semibold leading-[1.3] text-ink-2">{c.fact}</p>
          <Src className="mt-[10px]">{c.src}</Src>
        </div>
      ))}
      <Seam top={236} height={300} />
    </>
  );
}

// ---------------------------------------------------------------- 4. evidence: three findings, one ours

function Evidence() {
  const rows = [
    { value: '700’de 1', text: 'Diploma şartını kaldıran şirketlerde gerçekten değişen işe alım: bundan da az.', src: 'Harvard Business School ve Burning Glass Institute, 2024' },
    { value: '%63', text: 'İşverenlerin dönüşümdeki bir numaralı engeli: beceri açığı.', src: 'Dünya Ekonomik Forumu, İşlerin Geleceği 2025' },
    { value: '37', text: 'platform ve program inceledik. Oyun ritmi, doğrulanmış iş ve kurum imzasını bir arada sunanı Türkiye’de bulamadık.', src: 'Bizim araştırmamız, kaynaklarıyla: docs/PAZAR-ANALIZI.md', ours: true },
  ];
  return (
    <>
      <Heading>Bunu nereden biliyoruz?</Heading>
      <ol className="absolute left-[112px] top-[214px] w-[1376px]">
        {rows.map((r, n) => (
          <li key={r.value} className="s-in grid grid-cols-[300px_1fr] items-baseline gap-x-[40px] border-t-2 border-line py-[22px]" style={d(160 + n * 160)}>
            <p className={`num text-[76px] font-extrabold leading-none tracking-[-0.04em] ${r.ours ? 'text-indigo' : 'text-ink'}`}>{r.value}</p>
            <div>
              <p className="text-[28px] font-semibold leading-[1.3] text-ink-2">{r.text}</p>
              <Src className="mt-[6px]">{r.src}</Src>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

// ---------------------------------------------------------------- 5. the solution in one sentence, with its screens

function Solution() {
  const loop = ['Kanıt', 'İhtiyaç', 'Pilot'];
  return (
    <>
      <p className="s-in absolute left-[112px] top-[118px] w-[660px] text-[56px] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink">
        Genç gerçek işiyle görünür, kurum ihtiyacını ölçülebilir yazar; ikisi <span className="text-indigo">küçük bir pilotta</span> buluşur.
      </p>

      {/* The loop: three steps, and the approved milestone coming back as evidence. */}
      <div className="s-in absolute left-[112px] top-[486px] w-[570px]" style={d(240)}>
        <div className="flex items-start">
          {loop.map((name, n) => (
            <div key={name} className="flex items-start">
              {n > 0 && <span className="mt-[24px] h-[4px] w-[60px] rounded-full bg-line-2" />}
              <div className="flex w-[150px] flex-col items-center">
                <Tri size={56}>
                  <span className="text-[20px] font-black leading-none text-white">{n + 1}</span>
                </Tri>
                <p className="mt-[10px] text-[28px] font-extrabold leading-none text-ink">{name}</p>
              </div>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 570 60" width="570" height="60" className="mt-[4px] block" aria-hidden="true">
          <path d="M495 4V22Q495 48 469 48H101Q75 48 75 22V8" fill="none" stroke="rgb(var(--indigo))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M65 17 75 5 85 17" fill="none" stroke="rgb(var(--indigo))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-[4px] text-center text-[21px] font-bold text-indigo">Onaylanan aşama kanıta döner</p>
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
  const tag = (who: string) => (who === 'Kurum' ? 'bg-indigo-tint text-indigo' : who === 'Genç' ? 'bg-cyan-tint text-cyan-ink' : 'bg-bg-3 text-ink-2');
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

/**
 * Plays with its music on arrival and stays on its last frame. A browser that wants a
 * click before sound plays it muted, and one click on the film turns the sound on.
 * If the file can't load, the live demo panel takes its place.
 */
function Film() {
  const [failed, setFailed] = useState(false);
  const [silent, setSilent] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      setSilent(true);
      v.play().catch(() => {});
    });
  }, []);
  if (failed) return <LiveDemo />;
  return (
    <>
      <video
        ref={video}
        className="absolute inset-0 h-full w-full bg-bg object-contain"
        src={FILM}
        poster={POSTER}
        playsInline
        preload="auto"
        onError={() => setFailed(true)}
        onClick={(e) => {
          if (!silent || !video.current) return;
          e.stopPropagation();
          video.current.muted = false;
          setSilent(false);
        }}
      />
      {silent && (
        <p className="pointer-events-none absolute bottom-[28px] left-1/2 -translate-x-1/2 rounded-full bg-ink/80 px-[18px] py-[8px] text-[17px] font-bold text-bg">
          Ses için filme tıkla
        </p>
      )}
    </>
  );
}

// ---------------------------------------------------------------- 7–9. the AI, computed from a real model answer

/** Niri's model on the sample text, through the product's guard; and the rules on the same text. */
const READ = readModelDraft(SAMPLE_COMPLAINT, SAMPLE_READING)!;
const RULES = readRulesDraft(SAMPLE_COMPLAINT);
const SENTENCES = SAMPLE_COMPLAINT.split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ])/);

/** Three fields of the model's draft, each beside the kurum's sentence it came from. */
const SHOWN: [keyof Canvas, string][] = [
  ['painMetric', 'Sorunun ölçüsü'],
  ['outcome', 'Beklenen sonuç'],
  ['decisionMaker', 'Karar verici'],
];
const sentenceOf = (key: keyof Canvas) => SENTENCES.find((s) => (READ.quotes[key] ?? []).some((q) => cites(s, q))) ?? '';

function AiWhat() {
  const more = filledFields(READ.canvas).length - SHOWN.length;
  return (
    <>
      <Heading width={1300}>Yapay zekâ ne yapıyor?</Heading>
      <p className="s-in absolute left-[112px] top-[176px] w-[1340px] text-[28px] font-medium leading-[1.35] text-ink-3" style={d(80)}>
        Kurumun kendi sözlerini ihtiyaç kanvasına çevirir.
      </p>

      <div className="s-in absolute left-[112px] top-[252px] flex w-[1376px] items-center justify-between" style={d(160)}>
        <p className="text-[19px] font-bold text-ink-3">Kurumun cümlesi</p>
        <p className="flex w-[636px] items-center justify-between text-[19px] font-bold text-ink-3">
          Niri’nin taslağı
          <span className="pill !text-[17px] bg-indigo-tint text-indigo">Gemma 4 · açık model</span>
        </p>
      </div>
      {SHOWN.map(([k, label], n) => (
        <div key={k} className="s-in absolute left-[112px] flex w-[1376px] items-center" style={{ top: 300 + n * 128, ...d(260 + n * 180) }}>
          <p className="w-[620px] rounded-[16px] bg-bg-2 px-[22px] py-[14px] text-[23px] font-semibold leading-[1.35] text-ink-2">“{sentenceOf(k)}”</p>
          <svg viewBox="0 0 120 24" width="120" height="24" className="shrink-0" aria-hidden="true">
            <path d="M22 12H96M86 4l10 8-10 8" fill="none" stroke="rgb(var(--indigo))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="text-[18px] font-bold text-ink-3">{label}</p>
            <p className="text-[30px] font-extrabold leading-[1.15] tracking-[-0.015em] text-ink">{READ.canvas[k] as string}</p>
          </div>
        </div>
      ))}
      <p className="s-in absolute left-[852px] top-[694px] text-[21px] font-semibold text-ink-3" style={d(860)}>
        +{more} alan daha, her biri kendi cümlesiyle.
      </p>
    </>
  );
}

function AiDiff() {
  const added: Canvas = { ...READ.canvas, criteria: READ.suggestions.map((s, i) => ({ id: `c${i}`, text: s.text })) };
  const bars = [
    { name: 'Kural motoru', note: `${filledFields(RULES.canvas).length} alan, kriter yok`, a: assessCanvas(RULES.canvas, RULES.skills), tone: 'ink-3' },
    { name: 'Açık model', note: `${filledFields(READ.canvas).length} alan, ${READ.suggestions.length} kriter önerisi`, a: assessCanvas(READ.canvas, READ.skills), tone: 'indigo' },
    { name: 'Kurum önerileri ekleyince', note: `${READ.suggestions.length} kriter, “Ekle” ile`, a: assessCanvas(added, READ.skills), tone: 'green' },
  ];
  return (
    <>
      <Heading width={1300}>Aynı metin: önce kurallar, şimdi model</Heading>
      <p className="s-in absolute top-[214px] -translate-x-1/2 text-[17px] font-bold text-ink-3" style={{ left: 112 + (1376 * PUBLISH_THRESHOLD) / 100, ...d(100) }}>
        yayın eşiği {PUBLISH_THRESHOLD}
      </p>
      {bars.map((b, n) => (
        <div key={b.name} className="s-in absolute left-[112px] w-[1376px]" style={{ top: 252 + n * 150, ...d(220 + n * 200) }}>
          <div className="flex items-end justify-between gap-6">
            <p className="text-[30px] font-bold leading-none text-ink">
              {b.name} <span className="ml-[10px] text-[21px] font-semibold text-ink-3">{b.note}</span>
            </p>
            <p className="num text-[60px] font-extrabold leading-[0.8] tracking-[-0.04em] text-ink">{b.a.score}</p>
          </div>
          <div className="relative mt-[14px] h-[22px] rounded-full bg-bg-3">
            <div className="h-full rounded-full" style={{ width: `${b.a.score}%`, background: `rgb(var(--${b.tone}))` }} />
            <span className="absolute top-[-9px] h-[40px] w-[4px] -translate-x-1/2 rounded-full bg-ink" style={{ left: `${PUBLISH_THRESHOLD}%` }} />
          </div>
          <p className={`mt-[10px] text-[20px] font-bold ${b.a.canPublish ? 'text-green-ink' : 'text-ink-3'}`}>{b.a.canPublish ? 'Yayımlanabilir' : 'Yayımlanamaz'}</p>
        </div>
      ))}
      <p className="s-in absolute left-[852px] top-[714px] text-[20px] font-semibold text-ink-3" style={d(900)}>
        Puanları ürünün kendi netlik kuralları verdi.
      </p>
    </>
  );
}

function AiGuard() {
  const bent = readModelDraft(SAMPLE_COMPLAINT, INVENTED_DECIDER)!;
  const refused = bent.rejected.find((r) => r.field === 'decisionMaker');
  const asked = bent.questions.find((q) => q.field === 'decisionMaker');
  const gates = ['Şemaya uyuyor mu?', 'Alıntı metinde mi?', 'Sayı metinde mi?', 'Kriter ölçülebilir mi?'];
  const joint = (tone = 'bg-line-2') => <span className={`mx-[10px] mt-[24px] h-[4px] w-[24px] shrink-0 rounded-full ${tone}`} />;
  const arrow = (
    <svg viewBox="0 0 60 24" width="60" height="24" className="shrink-0 self-center" aria-hidden="true">
      <path d="M12 12H46M37 4l9 8-9 8" fill="none" stroke="rgb(var(--line-2))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <>
      <Heading width={1300}>Model yanılırsa ne olur?</Heading>

      {/* The pipeline: the answer passes four gates before it reaches the canvas. */}
      <div className="s-in absolute left-[112px] top-[206px] flex w-[1376px] items-start" style={d(100)}>
        <p className="w-[130px] shrink-0 rounded-[14px] border-2 border-dashed border-line-2 px-[14px] py-[12px] text-[19px] font-bold leading-tight text-ink">Modelin cevabı</p>
        {gates.map((g, n) => (
          <div key={g} className="flex items-start">
            {joint()}
            <div className="w-[228px]">
              <Tri size={50}>
                <span className="text-[18px] font-black leading-none text-white">{n + 1}</span>
              </Tri>
              <p className="mt-[10px] whitespace-nowrap text-[22px] font-bold leading-tight text-ink">{g}</p>
            </div>
          </div>
        ))}
        {joint('bg-indigo')}
        <p className="w-[110px] shrink-0 rounded-[14px] bg-indigo px-[14px] py-[12px] text-[19px] font-bold leading-tight text-white">Kanvas</p>
      </div>

      {/* A case from the guard's own tests, computed here by the same code. */}
      <p className="s-in absolute left-[112px] top-[372px] text-[19px] font-bold text-ink-3" style={d(300)}>
        Testten bir örnek
      </p>
      <div className="absolute left-[112px] top-[412px] flex w-[1376px] items-stretch">
        <div className="s-in w-[400px] rounded-[18px] border-2 border-dashed border-line-2 px-[24px] py-[18px]" style={d(380)}>
          <p className="text-[18px] font-bold text-ink-3">Model yazdı</p>
          <p className="mt-[6px] text-[28px] font-extrabold leading-[1.15] text-ink">Karar verici: {refused?.value}</p>
        </div>
        {arrow}
        <div className="s-in w-[380px] rounded-[18px] bg-red-tint px-[24px] py-[18px]" style={d(620)}>
          <p className="flex items-center gap-[8px] text-[18px] font-bold text-red-lip">
            <X size={20} strokeWidth={3.4} /> Denetim
          </p>
          <p className="mt-[6px] text-[28px] font-extrabold leading-[1.15] text-red-lip">{refused?.reason === 'quote' ? 'Bu cümle metinde yok.' : 'Alınmadı.'}</p>
        </div>
        {arrow}
        <div className="s-in flex-1 rounded-[18px] bg-indigo-tint px-[24px] py-[18px]" style={d(860)}>
          <p className="text-[18px] font-bold text-indigo">Niri sorar</p>
          <p className="mt-[6px] text-[26px] font-extrabold leading-[1.2] text-indigo">“{asked?.q}”</p>
        </div>
      </div>

      <p className="s-in absolute left-[112px] top-[630px] flex items-center gap-[12px] text-[23px] font-bold text-ink-2" style={d(1040)}>
        <Check size={26} strokeWidth={3.4} className="shrink-0 text-green-ink" />
        Model susarsa aynı ekranı kural motoru doldurur.
      </p>
    </>
  );
}

// ---------------------------------------------------------------- 10. design decisions

function Decisions() {
  const items = ['Her ekranda tek iş', 'Önce telefon', 'Oyun yalnız genç tarafında', 'Temasa kadar isimsiz', 'Niri yol gösterir, kimseyi bekletmez'];
  return (
    <>
      <Heading width={1300}>Neden böyle tasarladık?</Heading>
      <ol className="absolute left-[112px] top-[200px] w-[1376px]">
        {items.map((t, n) => (
          <li key={t} className="s-in flex items-center gap-x-[28px] border-t-2 border-line py-[16px]" style={d(120 + n * 110)}>
            <Tri size={44} state="waiting">
              <span className="text-[17px] font-black leading-none text-ink-3">{n + 1}</span>
            </Tri>
            <p className="text-[42px] font-extrabold leading-[1.1] tracking-[-0.025em] text-ink">{t}</p>
          </li>
        ))}
      </ol>
    </>
  );
}

// ---------------------------------------------------------------- 11. what we finished, what we left on purpose

function Done() {
  const done = ['Altı problemin altısına ekran', 'GitHub ve DNS ile doğrulama', 'Her alandan profil ve eser', 'Açık modelle ihtiyaç taslağı', 'Testli eşleşme, defter, denetim', 'Telefona yüklenen, internetsiz uygulama'];
  const left = ['Kalıcı veritabanı', 'Gerçek kullanıcı ve pilot', 'Kod dışı işte makine doğrulaması', 'Bildirim ve mağaza sürümü'];
  const next = ['Kalıcılık', 'İlk ihtiyaç turu', 'Kod dışı doğrulama', 'Pilot raporu'];
  return (
    <>
      <Heading width={1376}>Neyi bitirdik, neyi bilerek bıraktık?</Heading>
      <div className="s-in absolute left-[112px] top-[214px] w-[640px]" style={d(120)}>
        <p className="text-[20px] font-bold text-green-ink">Bitti, canlıda çalışıyor</p>
        <ul className="mt-[16px] flex flex-col gap-[18px]">
          {done.map((t) => (
            <li key={t} className="flex items-center gap-[14px] text-[30px] font-bold leading-tight text-ink">
              <Check size={30} strokeWidth={3.4} className="shrink-0 text-green-ink" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="s-in absolute left-[848px] top-[214px] w-[640px]" style={d(300)}>
        <p className="text-[20px] font-bold text-ink-3">Bilerek bıraktık</p>
        <ul className="mt-[16px] flex flex-col gap-[18px]">
          {left.map((t) => (
            <li key={t} className="flex items-center gap-[14px] text-[30px] font-bold leading-tight text-ink-2">
              <span className="block h-[26px] w-[26px] shrink-0 rounded-full border-[3px] border-dashed border-line-2" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <Seam top={214} height={290} />
      <div className="s-in absolute left-[848px] top-[560px] w-[640px]" style={d(480)}>
        <p className="text-[20px] font-bold text-ink-3">Finalden sonra 4 ay · plan</p>
        <div className="relative mt-[16px] grid grid-cols-4">
          <svg viewBox="0 0 640 10" width="640" height="10" className="absolute left-0 top-[20px]" aria-hidden="true">
            <path d="M40 5H500" stroke="rgb(var(--line-2))" strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" />
          </svg>
          {next.map((t, n) => (
            <div key={t} className="relative flex flex-col items-start">
              <span className="rounded-[8px] bg-bg">
                <Tri size={46} state="waiting">
                  <span className="text-[17px] font-black leading-none text-ink-3">{n + 1}</span>
                </Tri>
              </span>
              <p className="mt-[8px] pr-[8px] text-[20px] font-bold leading-[1.2] text-ink-2">{t}</p>
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
      {/* The QR opens /uygulama: the jury can put the app on their phones before the questions. */}
      <figure className="s-in absolute left-[1156px] top-[150px] flex w-[360px] flex-col items-center" style={d(480)}>
        <img src="/pwa/qr.svg" width={248} height={248} alt="nirengi uygulamasını açan QR kodu" className="rounded-[20px] border-2 border-line bg-white p-[10px]" draggable={false} />
        <figcaption className="mt-[14px] text-center">
          <span className="block text-[26px] font-extrabold leading-tight text-ink">Telefonunuza yükleyin</span>
          <span className="mt-[4px] block text-[19px] font-semibold text-ink-3">Kameranızla okutun; mağaza gerekmez.</span>
        </figcaption>
      </figure>
      <SurveyFlag size={96} delay={0.6} className="absolute left-[1478px] top-[694px]" />
    </>
  );
}

export const SLIDES: Slide[] = [
  { id: 'baslik', title: 'Nirengi', mark: 'hero', niri: { mood: 'wave', gear: 0, line: 'Merhaba, ben Niri! Bugün size haritamı göstereceğim.' }, View: Title },
  { id: 'problem', title: 'Problem', mark: 'dock', niri: { mood: 'sad', gear: 0, line: 'Gençler görünmüyor, kurumlar emin olamıyor.' }, View: Problem },
  { id: 'kim-icin', title: 'Kim için', mark: 'dock', niri: { mood: 'think', gear: 0, line: 'Biri kanıt arıyor, öbürü güven.' }, View: ForWhom },
  { id: 'kanit', title: 'Kanıt', mark: 'dock', niri: { mood: 'think', gear: 1, line: 'Rakamları uydurmadım; kaynakları altında.' }, View: Evidence },
  { id: 'cozum', title: 'Çözüm', mark: 'dock', niri: { mood: 'happy', gear: 1, line: 'Kanıt, ihtiyaç, pilot: tek döngü.' }, View: Solution },
  { id: 'demo', title: 'Tanıtım filmi', mark: 'dock', bare: true, niri: { mood: 'cheer', gear: 2, line: 'Sahne benim! Ürünü telefonda göstereyim.' }, View: Film },
  { id: 'yz-ne', title: 'Yapay zekâ ne yapıyor', mark: 'dock', niri: { mood: 'talk', gear: 2, line: 'Derdini yaz, ben okuyayım. Uydurmam.' }, View: AiWhat },
  { id: 'yz-fark', title: 'Önce ve sonra', mark: 'dock', niri: { mood: 'happy', gear: 3, line: 'Aynı metinden daha dolu bir taslak.' }, View: AiDiff },
  { id: 'yz-onlem', title: 'Hatalı çıktıya karşı', mark: 'dock', niri: { mood: 'think', gear: 3, line: 'Metinde yoksa almam, sorarım.' }, View: AiGuard },
  { id: 'tasarim', title: 'Tasarım kararları', mark: 'dock', niri: { mood: 'cheer', gear: 3, line: 'Gence oyun, kuruma sakin bir ölçüm.' }, View: Decisions },
  { id: 'bitti', title: 'Bitti ve bırakılan', mark: 'dock', niri: { mood: 'happy', gear: 3, line: 'Prototipim çalışıyor. Gerisini pilotta kanıtlayacağım.' }, View: Done },
  { id: 'kapanis', title: 'Teşekkürler', mark: 'hero', niri: { mood: 'wave', gear: 4, turns: 2, line: 'Zirvedeyim! Beni telefonunuza alın, haritada görüşmek üzere.' }, View: Close },
];

/** "3 / 12" on the counter and in the presenter window. */
export const place = (i: number) => `${i + 1} / ${SLIDES.length}`;
