// The slides. Each one carries a single idea, laid out on the 1600×900 stage, plus
// Niri's line for it; the pages spell theirs out so the deck reads on its own, and the
// team says the rest (notes.ts). Niri stands on
// one of two marks (see Deck): 'hero' on the right for the opening and the close,
// 'dock' bottom-left elsewhere, so every slide keeps that corner (x < 760, y > 700) free.
//
// The twelve slides follow the flow the organisers recommended and fit the five-minute
// talk: team, problem, for whom (the focus: young people and the startups that want to work
// with them), evidence, what we solve (one sentence, the route of five stops that answers
// the six problems, and the same product in a browser and on a phone), demo (the film), the
// match (the part the jury liked most, on its real screens), what the AI does (with the open
// model it runs on and its before and after), the guard against wrong output, design
// decisions (a game for the genç, a measure for the kurum), done (a wall of the real screens,
// one per problem) and left, close. After the close an appendix holds the film's other shots
// one page each, for questions and for the shared PDF; it is not part of the talk. Numbers come from
// docs/PAZAR-ANALIZI.md with their sources on the slide; product numbers from the engine,
// and the AI slides run a real model answer through the product's own guard. Nothing here
// is invented: plans are labelled as plans, and people and institutions in the demo are
// fictional and the deck says so. Other products are named only where nirengi connects to
// them (GitHub, the profile sites), never compared.

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import type { Dir, Mood } from '../ui/Niri';
import { Contours, Tri } from '../ui/pafta';
import { SurveyFlag } from '../ui/kit';
import { Mark as BrandMark } from '../ui/icons';
import type { Canvas } from '../../lib/types.ts';
import { assessCanvas, filledFields, PUBLISH_THRESHOLD, SAMPLE_COMPLAINT } from '../../lib/engine/canvas.ts';
import { cites, readModelDraft, readRulesDraft } from '../../lib/engine/ground.ts';
import { WEIGHTS } from '../../lib/engine/match.ts';
import { LEVELS } from '../../lib/labels.ts';
import { XP } from '../../lib/engine/progress.ts';
import { INVENTED_DECIDER, SAMPLE_READING } from '../../lib/sample-reading.ts';

export type Mark = 'hero' | 'dock';

export interface Slide {
  id: string;
  title: string;
  mark: Mark;
  /** The view owns the whole stage (the film): Niri and the counter step aside. */
  bare?: boolean;
  /** An appendix page after the close: outside the talk and its clock, opened for questions. */
  extra?: boolean;
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

/** A box on a captured screen, in the CSS px of its 390 px viewport. */
interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A real screen of the app, captured at 390 px, in a plain device frame; `mark` rings the one element the talk is about. */
function Phone({ src, alt, width, mark }: { src: string; alt: string; width: number; mark?: Box }) {
  const k = (width - 18) / 390;
  return (
    <div className="relative rounded-[40px] bg-[#16142a] p-[9px] ring-2 ring-line" style={{ width }}>
      <img src={src} alt={alt} width={780} height={1688} draggable={false} className="block h-auto w-full rounded-[31px]" />
      {mark && (
        <span
          className="s-in pointer-events-none absolute rounded-[16px]"
          style={{ left: 9 + mark.x * k - 6, top: 9 + mark.y * k - 6, width: mark.w * k + 12, height: mark.h * k + 12, boxShadow: '0 0 0 4px rgb(var(--indigo))', ...d(700) }}
        />
      )}
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
          Gençlerin doğrulanmış işini girişimlerin ve kurumların ihtiyaçlarıyla buluşturan açık kaynak uygulama. Web’de ve telefonda.
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

// ---------------------------------------------------------------- 3. for whom: the focus, said out loud

function ForWhom() {
  const cols = [
    { who: 'genc' as const, tag: 'Genç', title: 'Üreten ama kanıtı olmayan genç', fact: <>Tek bir seçici programa <Fig>~1 milyon</Fig> başvuru. Kapıda kalan görünmüyor.</>, src: 'GİRVAK Fellow, 10. yıl açıklaması' },
    {
      who: 'kurum' as const,
      tag: 'Girişim',
      title: 'Ekip kuran erken aşama girişim',
      fact: <>İK’sı yok, yanlış işe alımı kaldıramaz. 10–49 çalışanlı girişimlerin yalnız <Fig>%10,8</Fig>’inde BİT uzmanı var.</>,
      src: 'TÜİK, BİT bülteni 2026',
    },
  ];
  return (
    <>
      <Heading width={1376}>Kimin için: gençler ve onlarla çalışmak isteyen girişimler.</Heading>
      {cols.map((c, n) => (
        <div key={c.tag} className="s-in absolute top-[300px] w-[620px]" style={{ left: n ? 848 : 112, ...d(160 + n * 200) }}>
          <Tag who={c.who}>{c.tag}</Tag>
          <p className="mt-[16px] text-[44px] font-extrabold leading-[1.06] tracking-[-0.03em] text-ink">{c.title}</p>
          <p className="mt-[20px] text-[28px] font-semibold leading-[1.3] text-ink-2">{c.fact}</p>
          <Src className="mt-[10px]">{c.src}</Src>
        </div>
      ))}
      <Seam top={300} height={300} />
      <p className="s-in absolute left-[112px] top-[624px] w-[1376px] border-t-2 border-line pt-[18px] text-[24px] font-semibold leading-[1.35] text-ink-2" style={d(560)}>
        <b className="font-extrabold text-ink">Odak: girişim ekosistemi.</b> İlk tur Zemin360 ve GİRVAK ağı; sonra KOBİ’ler, kamu ve STK’lar.
      </p>
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

// ---------------------------------------------------------------- 5. the solution: what we solve, the route, where it runs

/**
 * The five stops of the loop, each with the competition problems it answers (README table) and its screen.
 * Routes are written without their leading slash: the Pages build prefixes quoted route literals.
 */
const STOPS: { name: string; route: string; problems: [string, string][] }[] = [
  { name: 'Kanıt', route: 'kanit-bagla', problems: [['02', 'Profil & portfolyo doğruluğu']] },
  { name: 'İhtiyaç', route: 'ihtiyaclar/yeni', problems: [['05', 'İhtiyaçların net tanımı']] },
  { name: 'Eşleşme', route: 'kesfet', problems: [['01', 'Genç yeteneklerin keşfi'], ['03', 'Kurum–kişi eşleşmesi']] },
  { name: 'Pilot', route: 'pilotlar', problems: [['06', 'Şeffaf iş birliği takibi']] },
  { name: 'Ağ', route: 'bugun', problems: [['04', 'Yaşayan bir ağ']] },
];

function StopMark({ n, size }: { n: number; size: number }) {
  return (
    <Tri size={size}>
      <span className="font-black leading-none text-white" style={{ fontSize: size * 0.36 }}>
        {n + 1}
      </span>
    </Tri>
  );
}

/** One sentence, the route down the left like a surveyor's traverse, and the same product in a browser and on a phone. */
function Solution() {
  const row = 80;
  const top = 236;
  const mid = (n: number) => top + n * row + 22;
  return (
    <>
      <Heading width={1376} className="!text-[50px]">
        Gencin yaptığı işi ve kurumun ihtiyacını beyandan kanıta çeviriyoruz; ikisi <span className="text-indigo">küçük bir pilotta</span> buluşur.
      </Heading>

      {/* The legs between stops, and the return leg on the margin: the approved work comes back as evidence. */}
      <svg viewBox="0 0 1600 900" width="1600" height="900" className="pointer-events-none absolute inset-0" aria-hidden="true">
        <path className="s-in" style={d(300)} d={`M134 ${mid(0) + 30}V${mid(4) - 26}`} stroke="rgb(var(--line-2))" strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" />
        <g className="s-in" style={d(1000)} fill="none" stroke="rgb(var(--indigo))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M104 ${mid(4)}H92Q80 ${mid(4)} 80 ${mid(4) - 12}V${mid(0) + 12}Q80 ${mid(0)} 92 ${mid(0)}H100`} />
          <path d={`M92 ${mid(0) - 9} 102 ${mid(0)} 92 ${mid(0) + 9}`} />
        </g>
      </svg>
      {STOPS.map((s, n) => (
        <div key={s.name} className="s-in absolute left-[112px] flex w-[660px] items-start gap-[18px]" style={{ top: top + n * row, ...d(260 + n * 120) }}>
          <StopMark n={n} size={44} />
          <div className="min-w-0">
            <p className="flex items-baseline gap-[14px]">
              <span className="text-[28px] font-extrabold leading-none tracking-[-0.02em] text-ink">{s.name}</span>
              <span className="mono text-[16px] font-semibold text-ink-3">/{s.route}</span>
            </p>
            <p className="mt-[6px] flex flex-wrap gap-x-[16px] text-[19px] font-bold leading-[1.25] text-ink-2">
              {s.problems.map(([code, name]) => (
                <span key={code}>
                  <span className="num text-indigo">{code}</span> {name}
                </span>
              ))}
            </p>
          </div>
        </div>
      ))}
      <p className="s-in absolute left-[112px] top-[640px] text-[20px] font-bold text-indigo" style={d(1000)}>
        Onaylanan her aşama gencin profiline kanıt olarak döner.
      </p>

      <figure className="s-in absolute" style={{ left: 846, top: 232, ...d(200) }}>
        <Browser src="/sunum/dk-home.webp" alt="Nirengi masaüstü tarayıcıda: Yaptığın işle fark edil" route="" width={620} />
        <figcaption className="mt-[12px] w-[440px] text-[19px] font-bold leading-[1.3] text-ink-2">
          Bir web sitesi: tarayıcıda açılır, telefona uygulama olarak yüklenir, internetsiz de çalışır.
        </figcaption>
      </figure>
      <figure className="s-in absolute" style={{ left: 1300, top: 420, ...d(480) }}>
        <Phone src="/sunum/genc-bugun.webp" alt="Aynı uygulama telefonda: gencin Bugün ekranı" width={188} />
      </figure>
    </>
  );
}

// ---------------------------------------------------------------- appendix: the film's shots, slowed down and explained

/** Where the real screens stand on every page: a phone on the right, or a browser window filling the right half. */
const PHONE_AT = { left: 1188, top: 84, width: 300 };
const WEB_AT = { left: 720, top: 84, width: 768, bar: 38 };
const PROBLEM = Object.fromEntries(STOPS.flatMap((s) => s.problems)) as Record<string, string>;

/** A real page of the site at 1440×900 in a plain browser window; the address bar names the route. */
function Browser({ src, alt, route, width, who, mark }: { src: string; alt: string; route: string; width: number; who?: 'genc' | 'kurum'; mark?: Box }) {
  const k = width / 1440;
  return (
    <div className="relative overflow-hidden rounded-[18px] bg-bg ring-2 ring-line" style={{ width }}>
      <div className="flex h-[38px] items-center gap-[8px] border-b-2 border-line bg-bg-2 px-[16px]">
        {[0, 1, 2].map((n) => (
          <span key={n} className="h-[11px] w-[11px] shrink-0 rounded-full bg-line-2" />
        ))}
        <span className="mono ml-[10px] min-w-0 flex-1 truncate rounded-full bg-bg px-[14px] py-[3px] text-[14px] font-semibold text-ink-3">
          {SITE}/{route}
        </span>
        {who && <Tag who={who}>{who === 'genc' ? 'Genç' : 'Kurum'}</Tag>}
      </div>
      <img src={src} alt={alt} width={1536} height={960} draggable={false} className="block h-auto w-full" />
      {mark && (
        <span
          className="s-in pointer-events-none absolute rounded-[12px]"
          style={{ left: mark.x * k - 5, top: 38 + mark.y * k - 5, width: mark.w * k + 10, height: mark.h * k + 10, boxShadow: '0 0 0 4px rgb(var(--indigo))', ...d(700) }}
        />
      )}
    </div>
  );
}

/** The left column of a page: the film's two-line headline, the problems it answers, three mechanisms. */
function PageText({ head, problems = [], lead, points }: { head: [string, string]; problems?: string[]; lead?: ReactNode; points: [string, ReactNode][] }) {
  return (
    <div className="absolute left-[112px] top-[84px] w-[580px]">
      <h2 className="s-h s-in !text-[56px]">
        {head[0]}
        <br />
        <span className="text-indigo">{head[1]}</span>
      </h2>
      {(problems.length > 0 || lead) && (
        <p className="s-in mt-[14px] flex flex-wrap gap-x-[20px] gap-y-[2px] text-[20px] font-bold text-ink-2" style={d(80)}>
          {lead}
          {problems.map((code) => (
            <span key={code}>
              <span className="num text-indigo">{code}</span> {PROBLEM[code]}
            </span>
          ))}
        </p>
      )}
      <ul className="mt-[22px]">
        {points.map(([term, text], n) => (
          <li key={term} className="s-in border-t-2 border-line py-[12px]" style={d(220 + n * 140)}>
            <p className="text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-ink">{term}</p>
            <p className="mt-[4px] text-[20px] font-semibold leading-[1.35] text-ink-2">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface Screen {
  src: string;
  alt: string;
  who: 'genc' | 'kurum';
  /** The route it shows, without its leading slash (see STOPS). */
  route: string;
  /** The element the page is about, ringed on the screen (CSS px of its viewport). */
  mark: Box;
}

interface Lifted {
  src: string;
  alt: string;
  /** Stage position and width; the height follows the crop's CSS size. */
  x: number;
  y: number;
  w: number;
  css: [number, number];
}

/**
 * One shot of the film as a page: the headline and what it means on the left, the real
 * screen on the right with the element ringed, and that element lifted out at reading size,
 * tied to its place on the screen by a line.
 */
function Page({ head, problems, points, phone, web, lift }: { head: [string, string]; problems: string[]; points: [string, ReactNode][]; phone?: Screen; web?: Screen; lift: Lifted }) {
  const s = (phone ?? web)!;
  const k = phone ? (PHONE_AT.width - 18) / 390 : WEB_AT.width / 1440;
  const ox = phone ? PHONE_AT.left + 9 : WEB_AT.left;
  const oy = phone ? PHONE_AT.top + 9 : WEB_AT.top + WEB_AT.bar;
  const m = { x: ox + s.mark.x * k, y: oy + s.mark.y * k, w: s.mark.w * k, h: s.mark.h * k };
  const lh = (lift.w * lift.css[1]) / lift.css[0];
  const left = lift.x + lift.w < m.x;
  const [x1, y1] = left ? [m.x - 6, m.y + m.h / 2] : [m.x + m.w / 2, m.y + m.h + 6];
  const [x2, y2] = left ? [lift.x + lift.w, lift.y + lh / 2] : [lift.x + lift.w / 2, lift.y];
  return (
    <>
      <PageText head={head} problems={problems} points={points} />
      {phone ? (
        <figure className="s-in absolute flex flex-col items-center" style={{ left: PHONE_AT.left, top: PHONE_AT.top, ...d(140) }}>
          <Phone src={phone.src} alt={phone.alt} width={PHONE_AT.width} mark={phone.mark} />
          <figcaption className="mt-[12px] flex items-center gap-[10px]">
            <Tag who={phone.who}>{phone.who === 'genc' ? 'Genç' : 'Kurum'}</Tag>
            <span className="mono text-[16px] font-semibold text-ink-3">/{phone.route}</span>
          </figcaption>
        </figure>
      ) : (
        <figure className="s-in absolute" style={{ left: WEB_AT.left, top: WEB_AT.top, ...d(140) }}>
          <Browser src={s.src} alt={s.alt} route={s.route} who={s.who} width={WEB_AT.width} mark={s.mark} />
        </figure>
      )}
      <svg viewBox="0 0 1600 900" width="1600" height="900" className="s-in pointer-events-none absolute inset-0" style={d(760)} aria-hidden="true">
        <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke="rgb(var(--indigo))" strokeWidth="3" strokeLinecap="round" />
        <circle cx={x1} cy={y1} r="6" fill="rgb(var(--indigo))" />
      </svg>
      <img
        src={lift.src}
        alt={lift.alt}
        width={lift.css[0] * 3}
        height={lift.css[1] * 3}
        draggable={false}
        className="s-in absolute rounded-[22px] shadow-[0_28px_60px_-22px_rgb(22_20_42/0.45)] ring-2 ring-line"
        style={{ left: lift.x, top: lift.y, width: lift.w, height: lh, ...d(620) }}
      />
    </>
  );
}

// The film's shots in its order: the genç's week, then the kurum's need, the match, the pilot and the way back.

const LV = (code: keyof typeof LEVELS) => String(LEVELS[code].weight).replace('.', ',');

function PageVerified() {
  return (
    <Page
      head={['İşin, kaynağında', 'doğrulanır.']}
      problems={['02']}
      points={[
        ['Doğrulama Merdiveni', <>Her iş düzeyini taşır ve eşleşmede o kadar sayılır: Beyan {LV('S1')}, Doğrulandı {LV('S2')}, Kurum onaylı {LV('S3')}.</>],
        ['GitHub ve alan adı', 'Genç depolarını GitHub’da kendisi seçer, özeller dahil. Alan adı DNS kaydıyla doğrulanır; kod kopyalanmaz.'],
        ['Her alandan, dürüstçe', 'Behance, ArtStation, LinkedIn’deki iş Beyan olarak gelir. Kopya eser sayılmaz; itiraz herkese açık kaydedilir.'],
      ]}
      phone={{ src: '/sunum/ph-dogrulandi.webp', alt: 'Gencin profili: GitHub ile doğrulanmış depolar', who: 'genc', route: 'profil/emirhanacik', mark: { x: 16, y: 130, w: 358, h: 366 } }}
      lift={{ src: '/sunum/lift-dogrulandi.webp', alt: 'Doğrulandı: edge-mirror deposu, doğrulayan GitHub API, hesap sahipliği', x: 742, y: 214, w: 400, css: [358, 366] }}
    />
  );
}

function PageXp() {
  return (
    <Page
      head={['XP yalnız', 'gerçek işten gelir.']}
      problems={['04']}
      points={[
        ['Haftalık ritim', 'Hedef üretim günüdür, commit sayısı değil. Hafta serisi, lig ve görevler genci her hafta geri getirir.'],
        ['XP bir iş makbuzu', <>Üretim günü {XP.activeDay}, doğrulanmış iş {XP.evidence}, kurum onaylı aşama {XP.milestone} XP; günde en çok {XP.dailyCap}. Her satırın arkasında bir olay var.</>],
        ['Oyun yalnız gençte', 'Lig, Saha defteri ve Niri’nin kostümleri genç tarafında. Kurum ekranında puan ya da seri yok.'],
      ]}
      web={{ src: '/sunum/dk-bugun.webp', alt: 'Gencin Bugün ekranı masaüstünde: bu hafta, lig, haftanın rotası ve Saha defteri', who: 'genc', route: 'bugun', mark: { x: 226, y: 220, w: 600, h: 291 } }}
      lift={{ src: '/sunum/lift-hafta.webp', alt: 'Bu hafta: haftada 3 gün hedefi tamam, 13 haftalık seri, bu hafta 46 XP', x: 968, y: 520, w: 520, css: [600, 291] }}
    />
  );
}

function PageInsight() {
  return (
    <Page
      head={['Eksiğini gör,', 'uyumunu artır.']}
      problems={['01', '03']}
      points={[
        ['Niri’nin haftalık notu', 'Gencin haftasını okur: kaç gün üretti, ne doğrulandı, ona uyan kaç yeni ihtiyaç yayımlandı.'],
        ['En yakın kapı', 'Hangi işin onu hangi ihtiyaca yaklaştıracağı yazar: “Flutter alanında bir doğrulanmış iş eklersen uyumun 63 → 72 olur.”'],
        ['Kurumlar ne arıyor', 'Gencin güçlü alanları ile kurumların istediği beceriler yan yana. Analiz kural tabanlı, formülü açık.'],
      ]}
      phone={{ src: '/sunum/ph-analiz.webp', alt: 'Analiz ekranı: Niri’nin haftalık notu ve en yakın kapı', who: 'genc', route: 'analiz', mark: { x: 16, y: 448, w: 358, h: 314 } }}
      lift={{ src: '/sunum/lift-kapi.webp', alt: 'En yakın kapın: uyum 63, Flutter alanında bir doğrulanmış iş eklersen 72 olur', x: 742, y: 330, w: 400, css: [358, 314] }}
    />
  );
}

function PageCommunity() {
  return (
    <Page
      head={['Gençler birbirine', 'de yardım eder.']}
      problems={['04']}
      points={[
        ['Soru, cevap, teşekkür', 'Genç takıldığı yeri sorar, üzerinde çalıştığını paylaşır. Kurumdan önce akran: ağın içinde mentorluk.'],
        ['İşe yarayan cevap', <>Soran “İşe yaradı” derse yanıtlayan +{XP.helpful} XP kazanır; o gün üretim günü sayılır.</>],
        ['Bu haftanın yardımcıları', 'Sıra beğeniyle değil, işe yarayan cevap sayısıyla belirlenir. Takipçi sayılmaz.'],
      ]}
      web={{ src: '/sunum/dk-topluluk.webp', alt: 'Topluluk masaüstünde: bir gencin sorusu ve işe yarayan cevap', who: 'genc', route: 'topluluk', mark: { x: 226, y: 132, w: 600, h: 498 } }}
      lift={{ src: '/sunum/lift-topluluk.webp', alt: 'Baran’ın LoRa sorusu ve Emirhan’ın işe yarayan cevabı: +15 XP yanıtlayana', x: 1018, y: 500, w: 470, css: [600, 390] }}
    />
  );
}

function PageNeed() {
  return (
    <Page
      head={['Kurum derdini', 'kendi sözüyle yazar.']}
      problems={['05']}
      points={[
        ['İlan değil, ihtiyaç', 'Kurum iş ilanı yazmaz, derdini anlatır. Niri metni yedi alanlı İhtiyaç Kanvası’na çevirir.'],
        ['Netlik puanı', <>Durum, sorun, ölçüsü, beklenen sonuç, kısıtlar, karar verici, kapsam. Puan {PUBLISH_THRESHOLD}’in altındaysa yayımlanmaz.</>],
        ['Ekosistem hafızası', 'Benzer ihtiyaçların nasıl sonuçlandığı aynı ekranda. Niri’nin metni nasıl okuduğu yapay zekâ bölümünde.'],
      ]}
      web={{ src: '/sunum/dk-yaz.webp', alt: 'Kurum masaüstünde ihtiyaç yazıyor: derdini kendi sözleriyle anlat', who: 'kurum', route: 'ihtiyaclar/yeni', mark: { x: 404, y: 491, w: 632, h: 168 } }}
      lift={{ src: '/sunum/lift-yaz.webp', alt: 'Kurumun metni: kargom nerede aramaları ayda yaklaşık 6.000', x: 888, y: 610, w: 600, css: [648, 184] }}
    />
  );
}

function PageBlind() {
  const pts = (k: keyof typeof WEIGHTS) => Math.round(WEIGHTS[k] * 100);
  return (
    <Page
      head={['Adaylar isimsiz:', 'önce iş.']}
      problems={['01', '03']}
      points={[
        ['Önce iş, sonra isim', 'İsim, yaş, okul, şehir ilk temasa kadar gizli. Kurum problemle arar; kimlik deneme projesi teklif edilince açılır.'],
        ['Puan kara kutu değil', <>Yaptığı iş {pts('evidence')}, sektör ve ölçek {pts('context')}, zaman {pts('capacity')}, ortak geçmiş {pts('history')}. Her parçanın neden o kadar olduğu yazar.</>],
        ['Eşleşmeyen de kazanır', 'Gence eksiği söylenir: “Flutter alanında bir doğrulanmış iş eklersen uyumun 63 → 72 olur.”'],
      ]}
      web={{ src: '/sunum/dk-adaylar.webp', alt: 'Uyan adaylar masaüstünde: Aday 9C03, 86 puan, isim yok', who: 'kurum', route: 'ihtiyaclar/n-rota', mark: { x: 220, y: 235, w: 720, h: 200 } }}
      lift={{ src: '/sunum/lift-neden.webp', alt: 'Neden bu uyum? Yaptığı işin uyumu 41,6/45, sektör ve ölçek 20/20, ayırabileceği zaman 15/15', x: 1178, y: 404, w: 310, css: [390, 547] }}
    />
  );
}

function PageLedger() {
  return (
    <Page
      head={['İki onay,', 'zincirli kayıt.']}
      problems={['06']}
      points={[
        ['Kriterden aşama', 'Kanvasın başarı kriterleri kilometre taşı olur. Genç teslim eder, kurum onaylar; çift onaysız aşama kapanmaz.'],
        ['Kurcalanamaz defter', 'Her kayıt SHA-256 ile bir öncekine bağlı. Sonradan tek harf değişirse zincir tam o kayıtta kırılır.'],
        ['Sessizlik ve adil kapanış', 'Bir hafta hareket yoksa proje sessiz görünür, sıranın kimde olduğu yazar. Kapanış gerekçeli olur.'],
      ]}
      web={{ src: '/sunum/dk-pilot.webp', alt: 'Deneme projesi masaüstünde: aşamalar ve onay bekleyen teslim', who: 'kurum', route: 'pilotlar/pl-rota', mark: { x: 220, y: 618, w: 560, h: 48 } }}
      lift={{ src: '/sunum/lift-defter.webp', alt: 'Kayıt defteri: her kaydın özeti bir sonrakinin önceki alanında', x: 1110, y: 492, w: 378, css: [374, 319] }}
    />
  );
}

function PageReturn() {
  return (
    <Page
      head={['Onay, gencin', 'kanıtı olur.']}
      problems={['02', '06']}
      points={[
        ['Döngü kapanır', 'Çift onaylanan aşama gencin profiline Kurum onaylı kanıt olarak geçer: imzalayan kurum ve tarihiyle.'],
        ['Kanıt gencindir', 'Profil bağlantısı ve kanıt kartı paylaşılır. Kapanan projenin özeti herkese açık bir sayfada kalır.'],
        ['Bir sonraki ihtiyaca', <>Kurum onaylı iş eşleşmede tam ağırlıkla ({LV('S3')}) sayılır, Beyan {LV('S1')}’da kalır. Genç bir sonrakine daha yakındır.</>],
      ]}
      phone={{ src: '/sunum/ph-s3.webp', alt: 'Gencin profili: Kurum onaylı kilometre taşı', who: 'genc', route: 'profil/emirhanacik', mark: { x: 16, y: 184, w: 358, h: 310 } }}
      lift={{ src: '/sunum/lift-s3.webp', alt: 'Kurum onaylı: 3.000 noktalık rota 5 dakikanın altında, doğrulayan Kuzey Lojistik operasyon direktörü', x: 742, y: 262, w: 400, css: [358, 310] }}
    />
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

// ---------------------------------------------------------------- 8–9. the AI, computed from a real model answer

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
  const added: Canvas = { ...READ.canvas, criteria: READ.suggestions.map((s, i) => ({ id: `c${i}`, text: s.text })) };
  const bars = [
    { name: 'Kural motoru', a: assessCanvas(RULES.canvas, RULES.skills), tone: 'ink-3' },
    { name: 'Açık model', a: assessCanvas(READ.canvas, READ.skills), tone: 'indigo' },
    { name: 'Kurum önerileri ekleyince', a: assessCanvas(added, READ.skills), tone: 'green' },
  ];
  const card: [string, string][] = [
    ['Nerede', 'Cloudflare Workers AI, günlük ücretsiz kota'],
    ['Nasıl', 'Sabit istem, JSON şeması, sıcaklık 0,1'],
    ['Neden bu', 'Denediğimiz dört açık model içinde şemaya uyan, Türkçeyi doğru ayıran en hızlısı'],
    ['Karar', 'Yayın, puan ve sıralama kurallarda; model yalnız okur ve önerir'],
  ];
  return (
    <>
      <Heading width={1376}>Yapay zekâ ne yapıyor?</Heading>
      <p className="s-in absolute left-[112px] top-[176px] w-[1376px] text-[25px] font-medium leading-[1.35] text-ink-3" style={d(80)}>
        Niri kurumun kendi sözlerini açık bir modelle okur ve her alanı bir cümleye dayanan ihtiyaç kanvasına çevirir.
      </p>

      <div className="s-in absolute left-[112px] top-[252px] flex w-[940px] items-center" style={d(160)}>
        <p className="w-[494px] text-[18px] font-bold text-ink-3">Kurumun cümlesi</p>
        <p className="text-[18px] font-bold text-ink-3">Niri’nin taslağı</p>
      </div>
      {SHOWN.map(([k, label], n) => (
        <div key={k} className="s-in absolute left-[112px] flex w-[940px] items-center" style={{ top: 292 + n * 124, ...d(260 + n * 180) }}>
          <p className="w-[424px] rounded-[16px] bg-bg-2 px-[20px] py-[12px] text-[20px] font-semibold leading-[1.35] text-ink-2">“{sentenceOf(k)}”</p>
          <svg viewBox="0 0 70 24" width="70" height="24" className="shrink-0" aria-hidden="true">
            <path d="M12 12H52M43 4l9 8-9 8" fill="none" stroke="rgb(var(--indigo))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-bold text-ink-3">{label}</p>
            <p className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.015em] text-ink">{READ.canvas[k] as string}</p>
          </div>
        </div>
      ))}
      <p className="s-in absolute left-[606px] top-[664px] text-[19px] font-semibold text-ink-3" style={d(860)}>
        +{more} alan daha, her biri kendi cümlesiyle.
      </p>

      {/* The model, plainly: what it is, where it runs, how it is asked, and what it never decides. */}
      <aside className="s-in absolute left-[1092px] top-[228px] w-[396px] rounded-[22px] bg-indigo-tint px-[24px] py-[16px]" style={d(420)}>
        <p className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-indigo">Gemma 4 26B</p>
        <p className="mt-[2px] text-[16px] font-bold text-indigo">Google · ağırlıkları açık · Apache 2.0</p>
        <dl className="mt-[10px] flex flex-col gap-[8px]">
          {card.map(([k, v]) => (
            <div key={k}>
              <dt className="text-[14px] font-bold text-ink-3">{k}</dt>
              <dd className="text-[17px] font-semibold leading-[1.3] text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </aside>

      {/* Before and after on the same text, scored by the product's own rules. */}
      <div className="s-in absolute left-[1092px] top-[656px] w-[396px]" style={d(700)}>
        <p className="text-[16px] font-bold text-ink-3">Aynı metnin netlik puanı · yayın eşiği {PUBLISH_THRESHOLD}</p>
        {bars.map((b) => (
          <div key={b.name} className="mt-[10px]">
            <p className="flex items-baseline justify-between text-[17px] font-bold text-ink">
              {b.name}
              <span className="num text-[24px] font-extrabold">{b.a.score}</span>
            </p>
            <div className="relative mt-[4px] h-[10px] rounded-full bg-bg-3">
              <div className="h-full rounded-full" style={{ width: `${b.a.score}%`, background: `rgb(var(--${b.tone}))` }} />
              <span className="absolute top-[-5px] h-[20px] w-[3px] -translate-x-1/2 rounded-full bg-ink" style={{ left: `${PUBLISH_THRESHOLD}%` }} />
            </div>
          </div>
        ))}
      </div>
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
  const pts = (k: keyof typeof WEIGHTS) => Math.round(WEIGHTS[k] * 100);
  const cols: { who: 'genc' | 'kurum'; tag: string; items: [string, ReactNode][] }[] = [
    {
      who: 'genc',
      tag: 'Genç: oyun gibi',
      items: [
        ['Her XP bir iş makbuzu', <>Üretim günü {XP.activeDay}, doğrulanmış iş {XP.evidence}, kurum onaylı aşama {XP.milestone}; günde en çok {XP.dailyCap}.</>],
        ['Hedef, seri, lig', 'Hedef üretim günüdür, commit değil. Mola haftası seriyi bozmaz; Niri her ligde yeni kostüm giyer.'],
        ['Topluluk', <>Gençler birbirine yardım eder: soran “İşe yaradı” derse yanıtlayan +{XP.helpful} XP alır.</>],
        ['Haftalık analiz', 'Niri en yakın kapıyı gösterir: “Flutter’da bir doğrulanmış iş eklersen uyumun 63 → 72.”'],
      ],
    },
    {
      who: 'kurum',
      tag: 'Kurum: sakin bir ölçüm',
      items: [
        ['İsim değil iş', 'Aday listesi ilk temasa kadar isimsiz; kurum unvanla değil problemle arar.'],
        ['Açık uyum puanı', <>Yaptığı iş {pts('evidence')}, sektör ve ölçek {pts('context')}, zaman {pts('capacity')}, ortak geçmiş {pts('history')}; her parçanın gerekçesi yazar.</>],
        ['İki onay, zincirli kayıt', 'Genç teslim eder, kurum onaylar; her kayıt SHA-256 ile öncekine bağlı.'],
        ['Oyun yok, tek iş', 'Kurum ekranında XP, seri ya da lig yok. Her ekranda tek iş; Niri yol gösterir, kimseyi bekletmez.'],
      ],
    },
  ];
  return (
    <>
      <Heading width={1376}>Tasarım: gence oyun, kuruma ölçüm.</Heading>
      {cols.map((c, n) => (
        <div key={c.tag} className="s-in absolute top-[196px] w-[640px]" style={{ left: n ? 848 : 112, ...d(140 + n * 200) }}>
          <Tag who={c.who}>{c.tag}</Tag>
          <ul className="mt-[10px]">
            {c.items.map(([term, text]) => (
              <li key={term} className="border-t-2 border-line py-[11px] first:border-t-0">
                <p className="text-[25px] font-extrabold leading-tight tracking-[-0.02em] text-ink">{term}</p>
                <p className="mt-[3px] text-[19px] font-semibold leading-[1.35] text-ink-2">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Seam top={200} height={460} />
    </>
  );
}

// ---------------------------------------------------------------- 11. what we finished, what we left on purpose

function Done() {
  const wall: { code: string; who: 'genc' | 'kurum'; src: string; alt: string }[] = [
    { code: '02', who: 'genc', src: '/sunum/ph-dogrulandi.webp', alt: 'Profil: GitHub ile doğrulanmış işler' },
    { code: '05', who: 'kurum', src: '/sunum/kurum-okuma.webp', alt: 'İhtiyaç: Niri kurumun metnini alanlara ayırdı' },
    { code: '01', who: 'kurum', src: '/sunum/kurum-kesfet.webp', alt: 'Keşif: problemi yaz, isimsiz profiller' },
    { code: '03', who: 'kurum', src: '/sunum/kurum-neden.webp', alt: 'Eşleşme: neden bu uyum, dört parça' },
    { code: '06', who: 'kurum', src: '/sunum/kurum-pilot.webp', alt: 'Pilot: aşamalar ve onay bekleyen teslim' },
    { code: '04', who: 'genc', src: '/sunum/genc-bugun.webp', alt: 'Ağ: gencin haftası, seri ve günün ihtiyaçları' },
  ];
  const left = ['Kalıcı veritabanı', 'Gerçek kullanıcı ve pilot', 'Kod dışı işte makine doğrulaması', 'Bildirim ve mağaza sürümü'];
  const next = ['Kalıcılık', 'İlk ihtiyaç turu', 'Kod dışı doğrulama', 'Pilot raporu'];
  return (
    <>
      <Heading width={1376}>Neyi bitirdik, neyi bilerek bıraktık?</Heading>
      <p className="s-in absolute left-[112px] top-[176px] flex items-center gap-[10px] text-[22px] font-bold text-green-ink" style={d(80)}>
        <Check size={24} strokeWidth={3.4} className="shrink-0" />
        Altı problemin altısı canlıda çalışıyor; motor 55 otomatik testle sınanıyor.
      </p>
      {wall.map((w, n) => (
        <figure key={w.code} className="s-in absolute w-[196px]" style={{ left: 112 + n * 236, top: 226, ...d(160 + n * 90) }}>
          <Phone src={w.src} alt={w.alt} width={196} />
          <figcaption className="mt-[10px] text-[16px] font-bold leading-[1.25] text-ink-2">
            <span className="num text-indigo">{w.code}</span> {PROBLEM[w.code]}
          </figcaption>
        </figure>
      ))}
      <div className="s-in absolute left-[800px] top-[704px] w-[688px]" style={d(760)}>
        <p className="text-[17px] font-bold text-ink-3">Bilerek bıraktık</p>
        <p className="mt-[4px] text-[20px] font-bold leading-[1.3] text-ink-2">{left.join(' · ')}</p>
        <p className="mt-[12px] text-[17px] font-bold text-ink-3">Finalden sonra 4 ay · plan</p>
        <p className="mt-[4px] text-[20px] font-bold leading-[1.3] text-ink-2">{next.map((t, i) => `${i + 1}. ${t}`).join('   ')}</p>
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
        Tek isteğimiz: bu salondan bir girişimin ya da kurumun gerçek bir ihtiyacı. <span className="text-indigo">İlk kanvası birlikte yazalım.</span>
      </p>
      <div className="s-in absolute left-[112px] top-[612px] w-[420px]" style={d(360)}>
        <Wordmark size={44} />
        <p className="mt-[14px] text-[26px] font-bold text-ink">{SITE}</p>
        <p className="mt-[8px] text-[21px] font-semibold text-ink-2">{TEAM.join(' · ')}</p>
        <p className="mt-[2px] text-[19px] font-semibold text-ink-3">Açık kaynak, MIT lisanslı · web’de ve telefonda</p>
      </div>
      <SurveyFlag size={96} delay={0.6} className="absolute left-[1478px] top-[694px]" />
    </>
  );
}

export const SLIDES: Slide[] = [
  { id: 'baslik', title: 'Nirengi', mark: 'hero', niri: { mood: 'wave', gear: 0, line: 'Merhaba, ben Niri! Bugün size haritamı göstereceğim.' }, View: Title },
  { id: 'problem', title: 'Problem', mark: 'dock', niri: { mood: 'sad', gear: 0, line: 'Gençler görünmüyor, kurumlar emin olamıyor.' }, View: Problem },
  { id: 'kim-icin', title: 'Kim için', mark: 'dock', niri: { mood: 'think', gear: 0, line: 'Biri kanıt arıyor, öbürü güvenilir bir ekip.' }, View: ForWhom },
  { id: 'kanit', title: 'Kanıt', mark: 'dock', niri: { mood: 'think', gear: 1, line: 'Rakamları uydurmadım; kaynakları altında.' }, View: Evidence },
  { id: 'cozum', title: 'Ne çözüyoruz', mark: 'dock', niri: { mood: 'cheer', gear: 1, line: 'Beş durak, altı problem. Tarayıcıda da cebinde de.' }, View: Solution },
  { id: 'demo', title: 'Tanıtım filmi', mark: 'dock', bare: true, niri: { mood: 'cheer', gear: 2, line: 'Sahne benim! Ürünü telefonda göstereyim.' }, View: Film },
  { id: 'eslesme', title: 'Eşleşme', mark: 'dock', niri: { mood: 'think', gear: 2, line: 'İsmi değil, işi tartarım.' }, View: PageBlind },
  { id: 'yz-ne', title: 'Yapay zekâ ne yapıyor', mark: 'dock', niri: { mood: 'talk', gear: 2, line: 'Derdini yaz, ben okuyayım. Uydurmam.' }, View: AiWhat },
  { id: 'yz-onlem', title: 'Hatalı çıktıya karşı', mark: 'dock', niri: { mood: 'think', gear: 3, line: 'Metinde yoksa almam, sorarım.' }, View: AiGuard },
  { id: 'tasarim', title: 'Tasarım kararları', mark: 'dock', niri: { mood: 'cheer', gear: 3, line: 'Gence oyun, kuruma sakin bir ölçüm.' }, View: Decisions },
  { id: 'bitti', title: 'Bitti ve bırakılan', mark: 'dock', niri: { mood: 'happy', gear: 3, line: 'Prototipim çalışıyor. Gerisini pilotta kanıtlayacağım.' }, View: Done },
  { id: 'kapanis', title: 'Teşekkürler', mark: 'hero', niri: { mood: 'wave', gear: 4, turns: 2, line: 'Zirvedeyim! İlk noktayı birlikte koyalım.' }, View: Close },
  { id: 'ek-dogrulama', title: 'İşin, kaynağında doğrulanır', mark: 'dock', extra: true, niri: { mood: 'happy', gear: 4, line: 'İşin nerede duruyorsa oradan doğrularım.' }, View: PageVerified },
  { id: 'ek-xp', title: 'XP yalnız gerçek işten', mark: 'dock', extra: true, niri: { mood: 'cheer', gear: 4, line: 'Puan değil makbuz: her XP bir iş.' }, View: PageXp },
  { id: 'ek-analiz', title: 'Eksiğini gör', mark: 'dock', extra: true, niri: { mood: 'think', gear: 4, line: 'Her hafta nerede güçlü olduğunu söylerim.' }, View: PageInsight },
  { id: 'ek-topluluk', title: 'Gençler birbirine yardım eder', mark: 'dock', extra: true, niri: { mood: 'happy', gear: 4, line: 'Burada yardım eden de kazanır.' }, View: PageCommunity },
  { id: 'ek-ihtiyac', title: 'Kurum derdini yazar', mark: 'dock', extra: true, niri: { mood: 'talk', gear: 4, line: 'Derdini anlat, alanları ben doldururum.' }, View: PageNeed },
  { id: 'ek-defter', title: 'İki onay, zincirli kayıt', mark: 'dock', extra: true, niri: { mood: 'cheer', gear: 4, line: 'İki imza, bir mühür. Sonradan kimse değiştiremez.' }, View: PageLedger },
  { id: 'ek-donus', title: 'Onay, gencin kanıtı olur', mark: 'dock', extra: true, niri: { mood: 'happy', gear: 4, line: 'Onaylanan iş, haritanda yeni bir nokta.' }, View: PageReturn },
];

/** The talk is the slides before the appendix; the close is its last. */
export const TALK = SLIDES.filter((s) => !s.extra).length;
export const CLOSE = TALK - 1;

/** "3 / 12" on the counter and in the presenter window; appendix pages read "Ek 2 / 8". */
export const place = (i: number) => (i < TALK ? `${i + 1} / ${TALK}` : `Ek ${i - TALK + 1} / ${SLIDES.length - TALK}`);
