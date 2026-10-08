// Niri's saha defteri: the costumes and field tools Niri collects while the
// person works. Like every number in the app, what is earned is read from state
// (league tier, verified work, the streak, helpful answers); only what Niri wears
// and the day a page was first seen live in localStorage.
//
// Open it from anywhere on the genç side with
//   openDefter()  or  openDefter('pusula')
// which dispatches window CustomEvent 'nirengi:defter' { detail: { entry } }.

import { useSyncExternalStore } from 'react';
import type { Person, State } from '../../lib/types.ts';
import { progress, TIERS } from '../../lib/engine/progress.ts';
import type { Item } from '../ui/Niri';
import './defter.css';

export type EntryId = 'serit' | 'sapka' | 'bandana' | 'kask' | 'bayrak' | 'buyutec' | 'muhur' | 'fener' | 'pusula';

export interface Entry {
  id: EntryId;
  /** Page number, 1-based: "No. 01". */
  no: number;
  kind: 'costume' | 'tool';
  name: string;
  /** League tier costume (Niri `gear`). */
  gear?: number;
  /** Field tool (Niri `item`). */
  item?: Item;
  /** One line in Niri's voice, shown once the page is earned. */
  lore: string;
  /** How the page is earned. */
  how: string;
  /** Where to go to earn it, while it is locked. */
  href: string;
  cta: string;
}

/** Weeks in a row the beacon asks for. */
export const BEACON_WEEKS = 4;

const COSTUMES: Omit<Entry, 'no' | 'kind' | 'gear' | 'href' | 'cta'>[] = [
  { id: 'serit', name: 'İşaret şeridi', how: 'Nirengi’ye katılınca', lore: 'Her ölçüm bir işaretle başlar. Seninle tanıştığım gün bu şeridi bağladım.' },
  { id: 'sapka', name: 'Arazi şapkası', how: `${TIERS[1]} Ligi’ne çıkınca`, lore: 'Tepede güneş tam tepeden vurur. Şapkayı taktım; gölgem bile ölçü tutuyor.' },
  { id: 'bandana', name: 'Bandana ve pafta', how: `${TIERS[2]} Ligi’ne çıkınca`, lore: 'Pafta sırtımda, rüzgâr bandanamda. Sırt boyunca yolu kaybetmeyiz.' },
  { id: 'kask', name: 'Kask ve jalon', how: `${TIERS[3]} Ligi’ne çıkınca`, lore: 'Jalonu diktiğimde nokta uzaktan görünür. Senin işin de artık öyle.' },
  { id: 'bayrak', name: 'Zirve bayrağı', how: `${TIERS[4]} Ligi’ne çıkınca`, lore: 'Buradan bütün pafta görünüyor. Bu bayrağı birlikte diktik.' },
];

const TOOLS: Omit<Entry, 'no' | 'kind'>[] = [
  {
    id: 'buyutec',
    name: 'Büyüteç',
    item: 'loupe',
    how: 'İlk doğrulanmış işin',
    lore: 'Beyan değil, kanıt. Yakından baktım: işin gerçekten çalışıyor.',
    href: '/kanit-bagla',
    cta: 'İş ekle',
  },
  {
    id: 'muhur',
    name: 'Onay mührü',
    item: 'seal',
    how: 'Bir kurumun onayladığı ilk aşaman',
    lore: 'Bir kurum “tamam” dedi. Bu mühür sökülmez; profilinde hep kalır.',
    href: '/bugun#ihtiyaclar',
    cta: 'İhtiyaçlara bak',
  },
  {
    id: 'fener',
    name: 'Seri feneri',
    item: 'beacon',
    how: `${BEACON_WEEKS} hafta üst üste haftalık hedefin`,
    lore: 'Dört hafta üst üste yandı. Fener yandıkça seni uzaktan görürler.',
    href: '/gorevler',
    cta: 'Görevlere bak',
  },
  {
    id: 'pusula',
    name: 'Pusula',
    item: 'compass',
    how: 'Toplulukta işe yarayan bir cevabın',
    lore: 'Birine yol gösterdin. Pusula artık sende; kaybolan olursa sen bulursun.',
    href: '/topluluk',
    cta: 'Topluluğa git',
  },
];

export const ENTRIES: Entry[] = [
  ...COSTUMES.map((c, i): Entry => ({ ...c, no: i + 1, kind: 'costume', gear: i, href: '/lig', cta: 'Lige bak' })),
  ...TOOLS.map((t, i): Entry => ({ ...t, no: COSTUMES.length + i + 1, kind: 'tool' })),
];

export const entryById = (id: string) => ENTRIES.find((e) => e.id === id);

// ---------------------------------------------------------------- storage

const WEAR_KEY = 'nirengi:niri:giyim';
const DATES_KEY = 'nirengi:defter:tarih';
const READ_KEY = 'nirengi:defter:okundu';
const CHANGE = 'nirengi:giyim';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  window.dispatchEvent(new Event(CHANGE));
}

// One snapshot string for everything the notebook keeps, so React re-renders on any change.
const snapshot = () => {
  try {
    return `${localStorage.getItem(WEAR_KEY)}|${localStorage.getItem(DATES_KEY)}|${localStorage.getItem(READ_KEY)}`;
  } catch {
    return '';
  }
};
const subscribe = (l: () => void) => {
  const onStorage = (e: StorageEvent) => {
    if (e.key === WEAR_KEY || e.key === DATES_KEY || e.key === READ_KEY) l();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(CHANGE, l);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(CHANGE, l);
  };
};
/** Re-renders when the worn choice, a first-seen date or the read marks change. */
export const useDefterStore = () => useSyncExternalStore(subscribe, snapshot, () => '');

// ---------------------------------------------------------------- earned

export interface Page extends Entry {
  earned: boolean;
  /** When it was earned: from state where it can be known, else the day the page was first seen. */
  at?: string;
  /** While locked: how close it is, e.g. "Serin 2/4 hafta". */
  near?: string;
}

const earliest = (dates: (string | undefined)[]) => dates.filter((d): d is string => !!d).sort()[0];

/** The Sunday ending the week in which the streak first reached `n` weeks, within the history shown. */
function streakDate(history: ReturnType<typeof progress>['history'], n: number) {
  let run = 0;
  for (let i = 0; i < history.length; i++) {
    const w = history[i];
    if (w.rest) continue;
    run = w.met ? run + 1 : 0;
    if (run === n) {
      const end = new Date(`${w.week}T12:00:00`);
      end.setDate(end.getDate() + 6);
      return new Date(Math.min(end.getTime(), Date.now())).toISOString();
    }
  }
  return undefined;
}

/** Every page of the notebook for this person, earned or not. */
export function pages(state: State, me: Person): Page[] {
  const tier = me.tier ?? 0;
  const p = progress(state, me);
  const dates = readJson<Partial<Record<EntryId, string>>>(DATES_KEY, {});
  const s2 = me.evidence.filter((e) => e.level === 'S2' && e.verifiedAt && !e.dispute);
  const s3 = me.evidence.filter((e) => e.level === 'S3' && e.verifiedAt);
  const helpful = state.posts.flatMap((post) => post.replies.filter((r) => r.personId === me.id && r.helpful));

  return ENTRIES.map((e): Page => {
    switch (e.id) {
      case 'buyutec':
        return { ...e, earned: s2.length > 0, at: earliest(s2.map((x) => x.verifiedAt)) };
      case 'muhur':
        return { ...e, earned: s3.length > 0, at: earliest(s3.map((x) => x.verifiedAt)) };
      case 'fener': {
        const earned = p.streak >= BEACON_WEEKS;
        return { ...e, earned, at: earned ? (streakDate(p.history, BEACON_WEEKS) ?? dates[e.id]) : undefined, near: earned ? undefined : `Serin şu an ${p.streak}/${BEACON_WEEKS} hafta` };
      }
      case 'pusula':
        return { ...e, earned: helpful.length > 0, at: earliest(helpful.map((r) => r.at)) };
      default: {
        const earned = (e.gear ?? 0) <= tier;
        return { ...e, earned, at: earned ? (e.gear === 0 ? me.joinedAt : dates[e.id]) : undefined, near: earned ? undefined : `Şu an ${TIERS[tier]} Ligi’ndesin` };
      }
    }
  });
}

/** Records the first-seen day of earned pages that state cannot date (higher tiers, an old streak). */
export function stampDates(list: Page[]) {
  const dates = readJson<Partial<Record<EntryId, string>>>(DATES_KEY, {});
  const missing = list.filter((p) => p.earned && !p.at && !dates[p.id]);
  if (!missing.length) return;
  const today = new Date().toISOString();
  for (const p of missing) dates[p.id] = today;
  writeJson(DATES_KEY, dates);
}

// ---------------------------------------------------------------- read marks

export const readMarks = () => new Set(readJson<EntryId[]>(READ_KEY, []));

export function markRead(id: EntryId) {
  const marks = readMarks();
  if (marks.has(id)) return;
  marks.add(id);
  writeJson(READ_KEY, [...marks]);
}

/** Earned pages the person has not opened in the notebook yet. */
export const unread = (list: Page[]) => {
  const marks = readMarks();
  return list.filter((p) => p.earned && !marks.has(p.id));
};

// ---------------------------------------------------------------- wearing

interface WearChoice {
  /** A costume page; unset = follow the current tier. */
  costume?: EntryId;
  /** A tool page in Niri's hand; unset = empty hands. */
  tool?: EntryId;
}

export interface Worn {
  gear: number;
  item?: Item;
  costume: EntryId;
  tool?: EntryId;
}

/**
 * What Niri wears for this person on the genç side: the chosen costume and tool if
 * they are still earned, else the current tier's costume and empty hands. The one
 * helper every genç Niri that stands for the person reads (Bugün, Lig, the rail).
 */
export function worn(state: State, me: Person, list: Page[] = pages(state, me)): Worn {
  const choice = readJson<WearChoice>(WEAR_KEY, {});
  const tier = me.tier ?? 0;
  const costume = list.find((p) => p.id === choice.costume && p.kind === 'costume' && p.earned) ?? list[tier];
  const tool = list.find((p) => p.id === choice.tool && p.kind === 'tool' && p.earned);
  return { gear: costume.gear ?? tier, item: tool?.item, costume: costume.id, tool: tool?.id };
}

/** Hook form of `worn`, updating when the choice changes in this or another tab. */
export function useWorn(state: State, me: Person): Worn {
  useDefterStore();
  return worn(state, me);
}

/** Puts a page on Niri: a costume replaces the costume (the current tier's = follow the tier), a tool goes in the hand; null takes the tool off. */
export function wear(me: Person, id: EntryId | null) {
  const choice = readJson<WearChoice>(WEAR_KEY, {});
  if (id === null) delete choice.tool;
  else {
    const e = entryById(id);
    if (e?.kind === 'tool') choice.tool = id;
    else if (e) {
      if (e.gear === (me.tier ?? 0)) delete choice.costume;
      else choice.costume = id;
    }
  }
  writeJson(WEAR_KEY, choice);
}

export const openDefter = (entry?: EntryId) => window.dispatchEvent(new CustomEvent('nirengi:defter', { detail: { entry } }));
