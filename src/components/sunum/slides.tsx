// The slides. Each one carries a single idea, laid out on the 1600×900 stage, and roughly
// what the team says over it; the pages spell theirs out so the deck reads on its own. Niri's
// bubbles (the headline of each line the team says) live in notes.ts and move on by themselves
// (beats.ts). Niri stands on one of two marks (see Deck): 'hero' on the right for the opening and the close,
// 'dock' bottom-left elsewhere, so every slide keeps that corner (x < 760, y > 700) free.
//
// The talk is the organisers' twelve steps, told around one idea: a kurum gives a real case,
// young people are measured against it by their verified work, and the best fit solves it in
// a small trial project that comes back to them as signed experience. Team, problem, for
// whom (young people and the startups and other small organisations that want to work with
// them), evidence, that loop in five stops beside the same site in a browser and on a phone,
// the film as the live demo (the presenter talks over it), what the AI does (an open model
// whose data can stay with us), its difference before and after (the case becomes
// measurable, so the young people can be measured against it), the guard against wrong
// output, the design decisions, done and left, close. Every film shot waits as a detail page
// in the appendix after the close: the headline and three working mechanisms beside the
// real screen with the element ringed and lifted out, opened when a question needs it.
// Numbers come from docs/PAZAR-ANALIZI.md with their sources on the slide; product numbers
// from the engine, and the AI slides run a real model answer through the product's own
// guard. Nothing here is invented: plans are labelled as plans, and people and institutions
// in the demo are fictional and the deck says so. Other products are named only where
// nirengi connects to them (GitHub, the profile sites, the model), never compared.

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
import { buildSeed } from '../../lib/seed.ts';
import { personInsight } from '../../lib/engine/insight.ts';
import { skillLabel } from '../../lib/skills.ts';
import { NOTES } from './notes';

export type Mark = 'hero' | 'dock';

export interface Slide {
  id: string;
  title: string;
  mark: Mark;
  /** The view owns the whole stage (the film): Niri and the counter step aside. */
  bare?: boolean;
  /** An appendix page after the close: outside the talk and its clock, opened for questions. */
  extra?: boolean;
  /** How Niri looks; the lines come from notes.ts. `moods` overrides `mood` line by line; `gear` is the league costume (climbing toward Zirve by the close); `turns` the twirl into it. */
  niri: { mood: Mood; moods?: Mood[]; point?: Dir; gear?: number; turns?: 1 | 2 };
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
        <p className="s-in mt-[44px] text-[80px] font-extrabold leading-[1.02] tracking-[-0.04em] text-ink" style={d(140)}>
          Yaptığın iş,
          <br />
          <span className="text-indigo">deneyimin olsun.</span>
        </p>
        <p className="s-in mt-[30px] max-w-[800px] text-[30px] font-medium leading-[1.35] text-ink-3" style={d(260)}>
          Gençlerin gerçek işini doğrulayıp ölçülebilir deneyime çeviren, şirketlerin gerçek case’leriyle buluşturan açık kaynak bir web sitesi. Telefonda da çalışır.
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
      text: <>Bilişim uzmanı almakta zorlanan her 100 şirketten <Fig>71’i</Fig>: “ilgili iş deneyimi yok.”</>,
      src: 'TÜİK, Girişimlerde Bilişim Teknolojileri Kullanımı 2025',
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
    { who: 'genc' as const, tag: 'Genç · her alandan', title: 'Üreten ama kanıtı olmayan genç', fact: <>Tek bir seçici programa <Fig>~1 milyon</Fig> başvuru. Kapıda kalan görünmüyor.</>, src: 'GİRVAK Fellow, 10. yıl açıklaması' },
    {
      who: 'kurum' as const,
      tag: 'Startup',
      title: 'Ekip kuran startup',
      fact: <>İK’sı yok, yanlış işe alımı kaldıramaz. 10–49 çalışanlı şirketlerin yalnız <Fig>%10,8</Fig>’inde bilişim uzmanı var.</>,
      src: 'TÜİK, bilişim teknolojileri bülteni 2026',
    },
  ];
  return (
    <>
      <Heading width={1376}>Kimin için: gençler ve onlarla çalışmak isteyen startuplar.</Heading>
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
        <b className="font-extrabold text-ink">Yalnız yazılımcılar değil:</b> tasarımcı, animasyoncu, çevirmen. <b className="font-extrabold text-ink">Odak: startuplar;</b> ilk tur Zemin360 ve GİRVAK ağı.
      </p>
    </>
  );
}

// ---------------------------------------------------------------- 4. evidence: three findings, one ours

function Evidence() {
  const rows = [
    { value: '700’de 1', text: 'Diploma şartını kaldıran şirketlerde bu karar, her 700 işe alımdan 1’ini bile değiştirmedi. Kâğıtta şart kalktı, işe alım aynı kaldı.', src: 'Harvard Business School ve Burning Glass Institute, 2024' },
    { value: '%63', text: 'İşverenlerin %63’üne göre dönüşümün önündeki en büyük engel beceri açığı.', src: 'Dünya Ekonomik Forumu, İşlerin Geleceği 2025' },
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
 * The five stops of the loop: what happens there, the competition problems it answers (README table) and its screen.
 * Routes are written without their leading slash: the Pages build prefixes quoted route literals.
 */
const STOPS: { name: string; route: string; does: string; problems: [string, string][] }[] = [
  { name: 'Kanıt', route: 'kanit-bagla', does: 'Genç işini bağlar: kod, tasarım, video, yazı. Doğrulanan iş deneyim puanı olur.', problems: [['02', 'Profil & portfolyo doğruluğu']] },
  { name: 'İhtiyaç', route: 'ihtiyaclar/yeni', does: 'Kurum case’ini yazar; Niri açık modelle ölçülebilir yapar.', problems: [['05', 'İhtiyaçların net tanımı']] },
  { name: 'Eşleşme', route: 'kesfet', does: 'Gençler bu case’e göre isimsiz, yalnız işleriyle ölçülür.', problems: [['01', 'Genç yeteneklerin keşfi'], ['03', 'Kurum–kişi eşleşmesi']] },
  { name: 'Pilot', route: 'pilotlar', does: 'En uyumlu genç case’i deneme projesinde çözer; iki imza.', problems: [['06', 'Şeffaf iş birliği takibi']] },
  { name: 'Ağ', route: 'bugun', does: 'Onaylanan iş profile imzalı deneyim olarak döner.', problems: [['04', 'Yaşayan bir ağ']] },
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

/** The loop in one sentence, its stops down the left like a surveyor's traverse, and the same product in a browser and on a phone. */
function Solution() {
  const row = 94;
  const top = 214;
  const mid = (n: number) => top + n * row + 22;
  return (
    <>
      <Heading width={1376} className="!text-[54px]">
        Kurum gerçek bir case verir; genç onu <span className="text-indigo">gerçekten çözer.</span>
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
        <div key={s.name} className="s-in absolute left-[112px] flex w-[712px] items-start gap-[18px]" style={{ top: top + n * row, ...d(260 + n * 120) }}>
          <StopMark n={n} size={44} />
          <div className="min-w-0">
            <p className="flex items-baseline gap-[14px]">
              <span className="text-[28px] font-extrabold leading-none tracking-[-0.02em] text-ink">{s.name}</span>
              <span className="mono text-[15px] font-semibold text-ink-3">/{s.route}</span>
              <span className="text-[15px] font-bold text-ink-3">
                {s.problems.map(([code, name]) => (
                  <span key={code} className="mr-[12px]">
                    <span className="num text-indigo">{code}</span> {name}
                  </span>
                ))}
              </span>
            </p>
            <p className="mt-[8px] text-[22px] font-bold leading-[1.25] text-ink-2">{s.does}</p>
          </div>
        </div>
      ))}

      <figure className="s-in absolute" style={{ left: 846, top: 232, ...d(200) }}>
        <Browser src="/sunum/dk-home.webp" alt="Nirengi masaüstü tarayıcıda: Yaptığın işle fark edil" route="" width={620} />
        <figcaption className="mt-[12px] w-[440px] text-[19px] font-bold leading-[1.3] text-ink-2">
          <span className="text-ink">Bir web sitesi:</span> adresi açan hemen kullanır. <span className="text-ink">Telefonda da:</span> ana ekrana yüklenir, internetsiz açılır.
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

/** The same window at thumbnail size, for a wall of the site's pages. */
function MiniBrowser({ src, alt, route, width }: { src: string; alt: string; route: string; width: number }) {
  return (
    <div className="overflow-hidden rounded-[12px] bg-bg ring-2 ring-line" style={{ width }}>
      <div className="flex h-[22px] items-center gap-[5px] border-b-2 border-line bg-bg-2 px-[10px]">
        {[0, 1, 2].map((n) => (
          <span key={n} className="h-[7px] w-[7px] shrink-0 rounded-full bg-line-2" />
        ))}
        <span className="mono ml-[6px] min-w-0 flex-1 truncate text-[11px] font-semibold text-ink-3">
          {SITE}/{route}
        </span>
      </div>
      <img src={src} alt={alt} width={1536} height={960} draggable={false} className="block h-auto w-full" />
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
        ['Her işin güveni yazar', <>Beyan: gencin kendi söylediği. Doğrulandı: kaynağından kontrol edildi. Kurum onaylı: bir kurum imzaladı. Eşleşmede {LV('S1')}, {LV('S2')} ve {LV('S3')} kat sayılır.</>],
        ['GitHub’dan otomatik', 'Genç hesabını bağlar, hangi projelerini göstereceğini kendisi seçer. Projenin gerçekten onun olduğunu GitHub’dan kontrol ederiz; kodunu almayız.'],
        ['Kod dışı işler de', 'Tasarım, video, çeviri Behance, ArtStation ya da LinkedIn bağlantısıyla gelir; dışarıdan doğrulanamadığı için Beyan yazar. Kurum onaylayınca Kurum onaylı olur.'],
      ]}
      phone={{ src: '/sunum/ph-dogrulandi.webp', alt: 'Gencin profili: GitHub ile doğrulanmış depolar', who: 'genc', route: 'profil/emirhanacik', mark: { x: 16, y: 130, w: 358, h: 366 } }}
      lift={{ src: '/sunum/lift-dogrulandi.webp', alt: 'Doğrulandı: edge-mirror deposu, doğrulayan GitHub API, hesap sahipliği', x: 742, y: 214, w: 400, css: [358, 366] }}
    />
  );
}

function PageExperience() {
  return (
    <Page
      head={['Lig, seri, deneyim:', 'hepsi gerçek işten.']}
      problems={['04']}
      points={[
        ['Haftalık lig', 'Benzer tempodaki 18 gençle bir hafta yarışırsın; ilk 5 üst lige çıkar. Zemin’den Zirve’ye beş lig var, her ligde Niri yeni bir kostüm giyer.'],
        ['Seri: üretim günleri', 'GitHub’a push, PR ya da sürüm attığın günler kendiliğinden seriye yazılır. Sayılan commit değil, üretim günü; mola haftası seriyi bozmaz.'],
        ['Deneyim puanı bir iş makbuzu', <>Üretim günü {XP.activeDay}, doğrulanmış iş {XP.evidence}, kurum onaylı aşama {XP.milestone}, işe yarayan cevap {XP.helpful} puan; günde en çok {XP.dailyCap}. Ekranda XP diye yazar. Kurum tarafında oyun yok.</>],
      ]}
      web={{ src: '/sunum/dk-lig.webp', alt: 'Lig ekranı masaüstünde: Sırt Ligi, sıralama, haftalık seri ve haftanın rotası', who: 'genc', route: 'lig', mark: { x: 242, y: 118, w: 638, h: 532 } }}
      lift={{ src: '/sunum/lift-lig.webp', alt: 'Sırt Ligi: Zemin, Tepe, Sırt, Doruk, Zirve; ilk 5’e girmek için 52 deneyim puanı (XP) daha', x: 1076, y: 470, w: 412, css: [600, 499] }}
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
        ['Deneyimli, yeni başlayana', 'Takılan genç sorar, o işi yapmış biri cevaplar. Kurumdan önce akran: ağın içinde mentorluk.'],
        ['İşe yarayan cevap', <>Soran “İşe yaradı” derse yanıtlayan {XP.helpful} deneyim puanı kazanır; o gün üretim günü sayılır.</>],
        ['Bu haftanın yardımcıları', 'Sıra beğeniyle değil, işe yarayan cevap sayısıyla belirlenir. Yardım eden de görünür olur.'],
      ]}
      web={{ src: '/sunum/dk-topluluk.webp', alt: 'Topluluk masaüstünde: bir gencin sorusu ve işe yarayan cevap', who: 'genc', route: 'topluluk', mark: { x: 226, y: 132, w: 600, h: 498 } }}
      lift={{ src: '/sunum/lift-topluluk.webp', alt: 'Baran’ın LoRa sorusu ve Emirhan’ın işe yarayan cevabı: yanıtlayana 15 deneyim puanı (XP)', x: 1018, y: 500, w: 470, css: [600, 390] }}
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
        ['Ekosistem hafızası', 'Benzer ihtiyaçların nasıl sonuçlandığı aynı ekranda; kurum başkasının deneyiminden başlar.'],
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
        ['Önce iş, sonra isim', 'İsim, yaş, okul, şehir ilk temasa kadar gizli; referans ya da tanıdık puana girmez. Kimlik deneme projesi teklif edilince açılır.'],
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
        ['İşe alım case’i boşa gitmez', 'Şirketin işe almadan önce istediği vaka çalışması burada bir deneme projesi olur; onaylanan her aşama profile yazılır.'],
        ['Sözde değil, imzalı deneyim', <>Kurum onaylı kanıt, imzalayan kurum ve tarihiyle durur; {XP.milestone} deneyim puanı getirir. İşe girmese bile genç bu deneyimi taşır.</>],
        ['Bir sonraki ihtiyaca', <>Kurum onaylı iş eşleşmede tam ağırlıkla ({LV('S3')}) sayılır, Beyan {LV('S1')}’da kalır. Genç bir sonrakine daha yakındır.</>],
      ]}
      phone={{ src: '/sunum/ph-s3.webp', alt: 'Gencin profili: Kurum onaylı kilometre taşı', who: 'genc', route: 'profil/emirhanacik', mark: { x: 16, y: 184, w: 358, h: 310 } }}
      lift={{ src: '/sunum/lift-s3.webp', alt: 'Kurum onaylı: 3.000 noktalık rota 5 dakikanın altında, doğrulayan Kuzey Lojistik operasyon direktörü', x: 742, y: 262, w: 400, css: [358, 310] }}
    />
  );
}

// ---------------------------------------------------------------- 6. the live demo: the film, with the live panel as its fallback

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
          CEDRA Interactive dışındaki kurumlar ve kişiler kurgusal; GitHub, DNS doğrulaması ve yapay zekâ taslağı gerçek.
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
 * Plays with its music on arrival and stays on its last frame. The music sits low so the
 * presenter can talk over it, and P pauses or resumes to stay on a shot. A browser that
 * wants a click before sound plays it muted, and one click on the film turns the sound on.
 * If the file can't load, the live demo panel takes its place.
 */
function Film() {
  const [failed, setFailed] = useState(false);
  const [silent, setSilent] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.volume = 0.35;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      setSilent(true);
      v.play().catch(() => {});
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'p' && e.key !== 'P') return;
      if (v.paused) v.play().catch(() => {});
      else v.pause();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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

// ---------------------------------------------------------------- 7. what the AI does, computed from a real model answer

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
  const card: [string, string][] = [
    ['Açık kaynak model', 'Ağırlıkları herkese açık. Kapalı bir yapay zekâ şirketinin servisine metin göndermiyoruz.'],
    ['Veri dışarı çıkmak zorunda değil', 'Açık model bizim ya da kurumun kendi sunucusunda çalışabilir. Bugünkü demo ücretsiz Workers AI’da; metni saklamıyoruz.'],
    ['Neden bu', 'Denediğimiz dört açık model içinde şemaya uyan, Türkçeyi doğru ayıran en hızlısı.'],
    ['Karar kuralda', 'Yayın, puan ve sıralama kurallarda; model yalnız okur ve önerir.'],
  ];
  return (
    <>
      <Heading width={1376}>Niri açık bir modelle okur.</Heading>
      <p className="s-in absolute left-[112px] top-[176px] w-[1376px] text-[25px] font-medium leading-[1.35] text-ink-3" style={d(80)}>
        Yapay zekâ ne yapıyor? Kurumun kendi sözlerini, her alanı bir cümleye dayanan ihtiyaç kanvasına çevirir.
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
      <aside className="s-in absolute left-[1092px] top-[228px] w-[396px] rounded-[22px] bg-indigo-tint px-[26px] py-[20px]" style={d(420)}>
        <p className="text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-indigo">Gemma 4 26B</p>
        <p className="mt-[2px] text-[16px] font-bold text-indigo">Google · ağırlıkları açık · Apache 2.0</p>
        <dl className="mt-[12px] flex flex-col gap-[12px]">
          {card.map(([k, v]) => (
            <div key={k}>
              <dt className="text-[17px] font-extrabold leading-tight text-ink">{k}</dt>
              <dd className="mt-[2px] text-[16px] font-semibold leading-[1.35] text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </>
  );
}

// ---------------------------------------------------------------- 8. the AI's difference: the case becomes measurable

function AiDiff() {
  const added: Canvas = { ...READ.canvas, criteria: READ.suggestions.map((s, i) => ({ id: `c${i}`, text: s.text })) };
  const bars = [
    { name: 'Önce: kural motoru', a: assessCanvas(RULES.canvas, RULES.skills), tone: 'ink-3', note: 'Eşiğin altında: kurum alanları elle doldurmadan yayımlanmaz.' },
    { name: 'Sonra: Niri’nin okuması', a: assessCanvas(READ.canvas, READ.skills), tone: 'indigo', note: 'Her alan kurumun bir cümlesine dayanıyor; yayına hazır.' },
    { name: 'Kurum önerileri ekleyince', a: assessCanvas(added, READ.skills), tone: 'green', note: 'Başarı kriterleri deneme projesinin aşamaları olur.' },
  ];
  const pts = (k: keyof typeof WEIGHTS) => Math.round(WEIGHTS[k] * 100);
  return (
    <>
      <Heading width={1376} className="!text-[56px]">
        Yapay zekânın farkı: case <span className="text-indigo">ölçülebilir</span> olur.
      </Heading>
      <p className="s-in absolute left-[112px] top-[172px] w-[640px] text-[22px] font-semibold leading-[1.35] text-ink-3" style={d(80)}>
        Aynı kurum metninin netlik puanı · yayın eşiği {PUBLISH_THRESHOLD}
      </p>
      {bars.map((b, n) => (
        <div key={b.name} className="s-in absolute left-[112px] w-[620px]" style={{ top: 226 + n * 128, ...d(200 + n * 220) }}>
          <p className="flex items-baseline justify-between text-[24px] font-extrabold tracking-[-0.01em] text-ink">
            {b.name}
            <span className="num text-[40px] font-extrabold leading-none">{b.a.score}</span>
          </p>
          <div className="relative mt-[8px] h-[14px] rounded-full bg-bg-3">
            <div className="h-full rounded-full" style={{ width: `${b.a.score}%`, background: `rgb(var(--${b.tone}))` }} />
            <span className="absolute top-[-6px] h-[26px] w-[3px] -translate-x-1/2 rounded-full bg-ink" style={{ left: `${PUBLISH_THRESHOLD}%` }} />
          </div>
          <p className="mt-[8px] text-[18px] font-semibold leading-[1.3] text-ink-2">{b.note}</p>
        </div>
      ))}

      {/* Once the case is measurable, the young people are measured against it: the real candidate list. */}
      <p className="s-in absolute left-[800px] top-[172px] w-[688px] text-[22px] font-semibold leading-[1.35] text-ink-3" style={d(700)}>
        Yayındaki bir case’in adayları · Kuzey Lojistik, rota
      </p>
      <figure className="s-in absolute left-[800px] top-[226px]" style={d(800)}>
        <Browser src="/sunum/dk-adaylar.webp" alt="Uyan adaylar masaüstünde: Aday 9C03, 86 puan, isim yok" route="ihtiyaclar/n-rota" who="kurum" width={600} />
      </figure>
      <img
        src="/sunum/lift-neden.webp"
        alt="Neden bu uyum? Yaptığı işin uyumu 41,6/45, sektör ve ölçek 20/20, ayırabileceği zaman 15/15"
        width={1170}
        height={1641}
        draggable={false}
        className="s-in absolute rounded-[22px] shadow-[0_28px_60px_-22px_rgb(22_20_42/0.45)] ring-2 ring-line"
        style={{ left: 1222, top: 330, width: 266, height: (266 * 547) / 390, ...d(1000) }}
      />
      <p className="s-in absolute left-[800px] top-[640px] w-[400px] text-[18px] font-semibold leading-[1.35] text-ink-2" style={d(1100)}>
        <b className="font-extrabold text-ink">Case’in becerileri cetvel olur; gençler ona göre isimsiz ölçülür.</b> Referans ya da tanıdık puana girmez. Puan yapay zekâ değil, açık bir formül: yaptığı iş {pts('evidence')}, sektör ve ölçek {pts('context')}, zaman {pts('capacity')}, ortak geçmiş {pts('history')}.
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
      <Heading width={1376} className="!text-[60px]">Model yanılırsa? Metinde olmayanı almaz.</Heading>

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

// ---------------------------------------------------------------- 10. design decisions: a rhythm for the genç, a calm measure for the kurum

/** Emirhan's road map as the Analiz page computes it from the demo state: the closest door, then the widest levers. */
const SEED = buildSeed();
const ROAD = personInsight(SEED, SEED.people.find((p) => p.id === 'p-emirhan')!);
const orgOfNeed = (id: string) => SEED.orgs.find((o) => o.id === SEED.needs.find((n) => n.id === id)?.orgId)?.name ?? '';

/** Niri's road map drawn on the pafta: today's fit at the foot, one verified piece of work, the door at the top. */
function RoadMap() {
  const door = ROAD.closest!;
  const from = door.match.score;
  const gain = door.to - from;
  // Card coordinates of the three stops, bottom-up.
  const stops: [number, number][] = [
    [96, 300],
    [160, 226],
    [104, 152],
  ];
  const route = `M${stops[0][0]} ${stops[0][1]} C 160 290 180 256 ${stops[1][0]} ${stops[1][1]} S 84 182 ${stops[2][0]} ${stops[2][1]}`;
  const rows = [
    { y: stops[2][1] - 34, head: `Uyum ${door.to}: en yakın kapı`, sub: `${orgOfNeed(door.match.need.id)} · ${door.match.need.title}` },
    { y: stops[1][1] - 26, head: `${skillLabel(door.skill)} alanında bir doğrulanmış iş`, sub: `Uyumuna +${gain} puan` },
    { y: stops[0][1] - 26, head: `Bugün · uyum ${from}`, sub: 'Niri eksiğini bulur, yolu çizer' },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-bg ring-2 ring-line">
      <Contours seed={4} x={0.2} y={0.55} rings={12} step={26} opacity={0.45} />
      <p className="absolute left-[24px] top-[18px] text-[26px] font-extrabold tracking-[-0.02em] text-ink">Niri’nin yol haritası</p>
      <p className="absolute left-[24px] top-[54px] text-[16px] font-bold text-ink-3">Emirhan’ın eksiğine göre, her hafta yeniden</p>
      <svg viewBox="0 0 600 454" width="600" height="454" className="pointer-events-none absolute inset-0" aria-hidden="true">
        <path d={route} fill="none" stroke="rgb(var(--orange))" strokeWidth="4.5" strokeDasharray="10 9" strokeLinecap="round" />
      </svg>
      <div className="absolute" style={{ left: stops[0][0] - 26, top: stops[0][1] - 44 }}>
        <Tri size={52} tone="orange">
          <span className="text-[16px] font-black leading-none text-white">{from}</span>
        </Tri>
      </div>
      <div className="absolute" style={{ left: stops[1][0] - 22, top: stops[1][1] - 38 }}>
        <Tri size={44} state="waiting" />
      </div>
      <div className="absolute" style={{ left: stops[2][0] - 22, top: stops[2][1] - 72 }}>
        <SurveyFlag size={74} delay={0.8} />
      </div>
      {rows.map((r) => (
        <div key={r.head} className="absolute left-[208px] w-[370px]" style={{ top: r.y }}>
          <p className="text-[21px] font-extrabold leading-tight tracking-[-0.01em] text-ink">{r.head}</p>
          <p className="mt-[2px] text-[16px] font-semibold leading-[1.3] text-ink-2">{r.sub}</p>
        </div>
      ))}
      <div className="absolute inset-x-[24px] bottom-[18px] border-t-2 border-line pt-[12px]">
        <p className="text-[15px] font-bold text-ink-3">Sonraki yollar</p>
        <p className="mt-[4px] flex flex-wrap gap-x-[18px] gap-y-[2px] text-[17px] font-bold text-ink-2">
          {ROAD.levers.slice(0, 3).map((l) => (
            <span key={l.skill}>
              {skillLabel(l.skill)} <span className="num text-orange-ink">+{l.gain}</span>
              <span className="font-semibold text-ink-3"> · {l.needs.length > 1 ? `${l.needs.length} case` : orgOfNeed(l.needs[0].id)}</span>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

function Decisions() {
  const pts = (k: keyof typeof WEIGHTS) => Math.round(WEIGHTS[k] * 100);
  const calm: [string, ReactNode][] = [
    ['İsim değil iş', 'Aday listesi ilk temasa kadar isimsiz; referans puana girmez.'],
    ['Açık uyum puanı', <>Yaptığı iş {pts('evidence')}, sektör {pts('context')}, zaman {pts('capacity')}, ortak geçmiş {pts('history')}.</>],
    ['İki onay, zincirli kayıt', 'Genç teslim eder, kurum onaylar.'],
    ['Oyun yok, tek iş', 'Kurum ekranında lig, seri ya da deneyim puanı yok.'],
  ];
  return (
    <>
      <Heading width={1376}>Tasarım: gence oyun, kuruma ölçüm.</Heading>
      <div className="s-in absolute left-[112px] top-[186px]" style={d(100)}>
        <Tag who="genc">Genç: oyun gibi bir ritim, yol gösteren Niri</Tag>
      </div>
      <div className="s-in absolute left-[112px] top-[236px] h-[454px] w-[600px]" style={d(200)}>
        <RoadMap />
      </div>
      <figure className="s-in absolute left-[752px] top-[236px] w-[340px]" style={d(420)}>
        <img src="/sunum/lift-lig.webp" alt="Sırt Ligi: Zemin, Tepe, Sırt, Doruk, Zirve; ilk 5’e girmek için 52 deneyim puanı (XP) daha" width={1200} height={998} draggable={false} className="block h-auto w-full rounded-[18px] ring-2 ring-line" />
        <figcaption className="mt-[8px] text-[17px] font-semibold leading-[1.3] text-ink-2">
          <b className="font-extrabold text-ink">Haftalık lig:</b> benzer tempodaki 18 gençle; ilk 5 üst lige çıkar.
        </figcaption>
      </figure>
      <figure className="s-in absolute left-[772px] top-[612px] w-[320px]" style={d(560)}>
        <img src="/sunum/lift-hafta.webp" alt="Bu hafta: haftada 3 gün hedefi tamam, 13 haftalık seri, bu hafta 46 deneyim puanı (XP)" width={1200} height={580} draggable={false} className="block h-auto w-full rounded-[16px] ring-2 ring-line" />
        <figcaption className="mt-[8px] text-[17px] font-semibold leading-[1.3] text-ink-2">
          <b className="font-extrabold text-ink">XP, yani deneyim puanı:</b> yalnız gerçek işten gelir.
        </figcaption>
      </figure>
      <svg viewBox="0 0 4 470" width="4" height="470" className="absolute left-[1124px] top-[190px]" aria-hidden="true">
        <path d="M2 2V468" stroke="rgb(var(--line-2))" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
      </svg>
      <div className="s-in absolute left-[1156px] top-[186px] w-[332px]" style={d(700)}>
        <Tag who="kurum">Kurum: sakin bir ölçüm</Tag>
        <ul className="mt-[12px]">
          {calm.map(([term, text]) => (
            <li key={term} className="border-t-2 border-line py-[12px] first:border-t-0">
              <p className="text-[23px] font-extrabold leading-tight tracking-[-0.02em] text-ink">{term}</p>
              <p className="mt-[3px] text-[17px] font-semibold leading-[1.35] text-ink-2">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- appendix: Niri's word, what nirengi gives each side

/** Niri speaks for the product at the end: to the genç, and to the kurum, startups first. */
function NiriSays() {
  const cols: { who: 'genc' | 'kurum'; tag: string; lines: [string, string][] }[] = [
    {
      who: 'genc',
      tag: 'Gençlere',
      lines: [
        ['CV yazma, işini bağla.', 'Kod, tasarım, video: yaptığın iş kendini kanıtlar ve seninle kalır.'],
        ['Eksiğini söylerim.', 'Eşleşmesen bile hangi işin seni hangi ihtiyaca yaklaştıracağını görürsün.'],
        ['Oyun gibi, ama gerçek.', 'Her hafta küçük bir hedef; her deneyim puanının arkasında gerçek bir iş var.'],
        ['Case’in boşa gitmez.', 'İşe alım için yaptığın iş, kurum onaylayınca profilinde imzalı deneyim olarak kalır.'],
      ],
    },
    {
      who: 'kurum',
      tag: 'Kurumlara, önce startuplara',
      lines: [
        ['İK’n yoksa da olur.', 'Derdini kendi sözünle yaz; ihtiyacını ben netleştiririm.'],
        ['İsim değil, iş.', 'Adayı yaptığı işle görürsün; referans gerekmez, puanın neden o kadar olduğu yazar.'],
        ['Kadro riski yok.', 'Önce küçük bir deneme projesi: iki onay, kurcalanamaz kayıt.'],
        ['Küçük ekipler için.', 'Açık kaynak ve ücretsiz; büyük bir sistem kurmadan başlarsın.'],
      ],
    },
  ];
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Contours seed={5} x={0.88} y={0.8} rings={12} step={34} opacity={0.4} />
      </div>
      <Heading width={1376}>Niri’nin söyleyecekleri var.</Heading>
      <p className="s-in absolute left-[112px] top-[178px] text-[24px] font-semibold text-ink-3" style={d(80)}>
        Tasarım kararımız da bu: gence oyun gibi bir ritim, kuruma sakin bir ölçüm.
      </p>
      {cols.map((c, n) => (
        <div key={c.tag} className="s-in absolute top-[230px] w-[520px]" style={{ left: n ? 700 : 112, ...d(200 + n * 260) }}>
          <Tag who={c.who}>{c.tag}</Tag>
          <ul className="mt-[10px]">
            {c.lines.map(([lead, rest]) => (
              <li key={lead} className="border-t-2 border-line py-[8px] first:border-t-0">
                <p className="text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-ink">“{lead}”</p>
                <p className="mt-[2px] text-[19px] font-semibold leading-[1.35] text-ink-2">{rest}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

// ---------------------------------------------------------------- 11. what we finished, what the pilot completes

function Done() {
  const W = 304;
  const pages: { code: string; who: 'genc' | 'kurum'; src: string; route: string; alt: string }[] = [
    { code: '02', who: 'genc', src: '/sunum/dk-profil.webp', route: 'profil/emirhanacik', alt: 'Profil masaüstünde: doğrulanmış işler ve hafta serisi' },
    { code: '05', who: 'kurum', src: '/sunum/dk-yaz.webp', route: 'ihtiyaclar/yeni', alt: 'İhtiyaç yazma masaüstünde: derdini kendi sözleriyle anlat' },
    { code: '01', who: 'kurum', src: '/sunum/dk-kesfet.webp', route: 'kesfet', alt: 'Yetenek keşfi masaüstünde: problemle arama, isimsiz profiller' },
    { code: '03', who: 'kurum', src: '/sunum/dk-adaylar.webp', route: 'ihtiyaclar/n-rota', alt: 'Uyan adaylar masaüstünde: isimsiz liste ve puanlar' },
    { code: '06', who: 'kurum', src: '/sunum/dk-pilot.webp', route: 'pilotlar/pl-rota', alt: 'Deneme projesi masaüstünde: aşamalar ve onay' },
    { code: '04', who: 'genc', src: '/sunum/dk-topluluk.webp', route: 'topluluk', alt: 'Topluluk masaüstünde: soru ve işe yarayan cevap' },
  ];
  const pilot = ['Kalıcı veritabanı', 'Gerçek kurumlarla ilk ihtiyaç turu', 'Kod dışı işlerde otomatik doğrulama', 'Bildirimler ve pilot raporu'];
  return (
    <>
      <Heading width={1376}>Neyi bitirdik, pilotta ne tamamlanacak?</Heading>
      <p className="s-in absolute left-[112px] top-[172px] flex items-center gap-[10px] text-[21px] font-bold text-green-ink" style={d(80)}>
        <Check size={24} strokeWidth={3.4} className="shrink-0" />
        Web sitesinde altı problemin altısı canlıda çalışıyor; kod 63 otomatik testle sınanıyor.
      </p>
      {pages.map((pg, n) => (
        <figure key={pg.code} className="s-in absolute" style={{ left: 112 + (n % 3) * (W + 24), top: 214 + Math.floor(n / 3) * 244, width: W, ...d(160 + n * 80) }}>
          <MiniBrowser src={pg.src} alt={pg.alt} route={pg.route} width={W} />
          <figcaption className="mt-[6px] truncate text-[16px] font-bold text-ink-2">
            <span className="num text-indigo">{pg.code}</span> {PROBLEM[pg.code]}
          </figcaption>
        </figure>
      ))}

      {/* The same site on a phone: installed from the browser, no store. */}
      <figure className="s-in absolute left-[1318px] top-[214px]" style={d(700)}>
        <Phone src="/sunum/genc-bugun.webp" alt="Aynı site telefonda uygulama olarak: gencin Bugün ekranı" width={170} />
      </figure>
      <div className="s-in absolute left-[1104px] top-[226px] w-[196px]" style={d(760)}>
        <p className="text-[22px] font-extrabold leading-tight text-ink">Telefonda da</p>
        <p className="mt-[6px] text-[18px] font-semibold leading-[1.35] text-ink-2">Aynı adres ana ekrana yüklenir, tam ekran ve internetsiz açılır. Mağaza gerekmez.</p>
      </div>

      <div className="s-in absolute left-[800px] top-[712px] w-[688px]" style={d(840)}>
        <p className="text-[16px] font-bold text-ink-3">Pilotta tamamlanacaklar · finalden sonraki 4 ay</p>
        <ol className="mt-[4px] grid grid-cols-2 gap-x-[24px] gap-y-[2px] text-[19px] font-bold leading-[1.35] text-ink-2">
          {pilot.map((t, i) => (
            <li key={t}>
              <span className="num text-indigo">{i + 1}.</span> {t}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- 12. close: the one ask, beside the website

function Close() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Contours seed={7} x={0.86} y={0.78} rings={14} step={34} opacity={0.55} />
      </div>
      <p className="s-in absolute left-[112px] top-[96px] w-[780px] text-[104px] font-extrabold leading-[0.98] tracking-[-0.045em] text-ink">
        Her çaban
        <br />
        haritada
        <br />
        <span className="text-indigo">bir nokta.</span>
      </p>
      <p className="s-in absolute left-[112px] top-[436px] w-[640px] text-[32px] font-bold leading-[1.25] tracking-[-0.015em] text-ink-2" style={d(200)}>
        Bu salondaki bir girişimin gerçek bir case’i, bir gencin ilk imzalı deneyimi olabilir. <span className="text-indigo">Gelin, ilkini birlikte yazalım.</span>
      </p>
      <div className="s-in absolute left-[112px] top-[612px] w-[420px]" style={d(360)}>
        <Wordmark size={44} />
        <p className="mt-[14px] text-[26px] font-bold text-ink">{SITE}</p>
        <p className="mt-[8px] text-[21px] font-semibold text-ink-2">{TEAM.join(' · ')}</p>
        <p className="mt-[2px] text-[19px] font-semibold text-ink-3">Açık kaynak, MIT lisanslı · web’de ve telefonda</p>
      </div>
      <figure className="s-in absolute left-[928px] top-[104px]" style={d(480)}>
        <Browser src="/sunum/dk-home.webp" alt="nirengi web sitesi: Yaptığın işle fark edil" route="" width={560} />
      </figure>
      <SurveyFlag size={96} delay={0.6} className="absolute left-[1478px] top-[694px]" />
    </>
  );
}

export const SLIDES: Slide[] = [
  { id: 'baslik', title: 'Nirengi', mark: 'hero', niri: { mood: 'wave', moods: ['wave', 'happy'], gear: 0 }, View: Title },
  { id: 'problem', title: 'Problem', mark: 'dock', niri: { mood: 'sad', moods: ['sad', 'think'], gear: 0 }, View: Problem },
  { id: 'kim-icin', title: 'Kim için', mark: 'dock', niri: { mood: 'happy', moods: ['happy', 'think'], gear: 0 }, View: ForWhom },
  { id: 'kanit', title: 'Kanıt', mark: 'dock', niri: { mood: 'think', moods: ['think', 'cheer'], gear: 0 }, View: Evidence },
  { id: 'cozum', title: 'Ne çözüyoruz', mark: 'dock', niri: { mood: 'cheer', moods: ['cheer', 'happy', 'point'], gear: 1 }, View: Solution },
  { id: 'demo', title: 'Canlı demo: film', mark: 'dock', bare: true, niri: { mood: 'cheer', gear: 1 }, View: Film },
  { id: 'yz-ne', title: 'Niri açık bir modelle okur', mark: 'dock', niri: { mood: 'wave', moods: ['happy', 'talk', 'think'], gear: 2 }, View: AiWhat },
  { id: 'yz-fark', title: 'Case ölçülebilir olur', mark: 'dock', niri: { mood: 'cheer', moods: ['cheer', 'think', 'happy'], gear: 2 }, View: AiDiff },
  { id: 'yz-onlem', title: 'Metinde olmayanı almaz', mark: 'dock', niri: { mood: 'think', moods: ['think', 'happy'], gear: 3 }, View: AiGuard },
  { id: 'tasarim', title: 'Tasarım kararları', mark: 'dock', niri: { mood: 'happy', moods: ['happy', 'cheer', 'happy'], gear: 3 }, View: Decisions },
  { id: 'bitti', title: 'Bitti ve pilotta tamamlanacak', mark: 'dock', niri: { mood: 'happy', moods: ['happy', 'think'], gear: 3 }, View: Done },
  { id: 'kapanis', title: 'Teşekkürler', mark: 'hero', niri: { mood: 'wave', moods: ['wave', 'happy'], gear: 4, turns: 2 }, View: Close },
  { id: 'dogrulama', title: 'İşin, kaynağında doğrulanır', mark: 'dock', extra: true, niri: { mood: 'happy', gear: 4 }, View: PageVerified },
  { id: 'deneyim', title: 'Deneyim puanı yalnız gerçek işten', mark: 'dock', extra: true, niri: { mood: 'cheer', gear: 4 }, View: PageExperience },
  { id: 'analiz', title: 'Eksiğini gör', mark: 'dock', extra: true, niri: { mood: 'think', gear: 4 }, View: PageInsight },
  { id: 'topluluk', title: 'Gençler birbirine yardım eder', mark: 'dock', extra: true, niri: { mood: 'happy', gear: 4 }, View: PageCommunity },
  { id: 'ihtiyac', title: 'Kurum derdini yazar', mark: 'dock', extra: true, niri: { mood: 'talk', gear: 4 }, View: PageNeed },
  { id: 'eslesme', title: 'Adaylar isimsiz', mark: 'dock', extra: true, niri: { mood: 'think', gear: 4 }, View: PageBlind },
  { id: 'defter', title: 'İki onay, zincirli kayıt', mark: 'dock', extra: true, niri: { mood: 'cheer', gear: 4 }, View: PageLedger },
  { id: 'donus', title: 'Onay, gencin kanıtı olur', mark: 'dock', extra: true, niri: { mood: 'happy', gear: 4 }, View: PageReturn },
  { id: 'niri', title: 'Niri’nin söyleyecekleri', mark: 'hero', extra: true, niri: { mood: 'talk', gear: 4 }, View: NiriSays },
];

/** The talk is the slides before the appendix; the close is its last. */
export const TALK = SLIDES.filter((s) => !s.extra).length;
export const CLOSE = TALK - 1;

/** "3 / 12" on the counter and in the presenter window; appendix pages read "Ek 2 / 9". */
export const place = (i: number) => (i < TALK ? `${i + 1} / ${TALK}` : `Ek ${i - TALK + 1} / ${SLIDES.length - TALK}`);

/** Niri's bubbles on a slide, in talk order. The film tells its own: its slide keeps one hidden bubble. */
export function linesOf(i: number): string[] {
  const beats = NOTES[SLIDES[i].id]?.beats ?? [];
  if (SLIDES[i].bare || beats.some((b) => b.at !== undefined)) return [beats[0]?.text ?? ''];
  return beats.length ? beats.map((b) => b.text) : [''];
}

/** Do Niri's bubbles move on by themselves here? On the talk's slides; the film runs on its own and the appendix waits for questions. */
export const paced = (i: number) => !SLIDES[i].extra && !SLIDES[i].bare;

/** Niri's mood on a slide's beat `k` once its bubble has typed in. */
export const moodOf = (i: number, k: number): Mood => SLIDES[i].niri.moods?.[k] ?? SLIDES[i].niri.mood;

/** Where the talk stands: slide `i`, Niri's beat `k` on it. */
export interface At {
  i: number;
  k: number;
}
