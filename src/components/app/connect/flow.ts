// Kanıt bağla: the two routes and their steps, what a GitHub scan holds, and the checks on a
// person that the page and its steps share.

import type { Level, Person, WeeklyGoal } from '../../../lib/types.ts';
import type { GhRepo, GhUser, VerifyKind } from '../../../lib/verify.ts';

export type StepId = 'start' | 'home' | 'user' | 'found' | 'goal' | 'prove' | 'profiles' | 'domain' | 'me' | 'work' | 'done';
export type Route = 'github' | 'open';
export const FLOWS: Record<Route, StepId[]> = {
  github: ['user', 'found', 'goal', 'prove', 'profiles', 'domain'],
  open: ['me', 'profiles', 'work', 'goal'],
};

export interface Scan {
  user: GhUser;
  /** The strongest original repositories, best first. */
  repos: GhRepo[];
  /** Local days with public output in the last 90 days; null when GitHub would not say. */
  days: string[] | null;
  offline: boolean;
  /** Read through the Nirengi GitHub App: only the account's owner can install it, so it proves the account is theirs. */
  granted?: boolean;
}

export const ERR_TITLE: Record<VerifyKind, string> = {
  notfound: 'Bu hesabı bulamadık',
  ratelimit: 'GitHub bir süre durdurdu',
  network: 'GitHub’a ulaşamadık',
  auth: 'Girişin süresi dolmuş',
  other: 'Bir şey ters gitti',
};

export const GOALS: { g: WeeklyGoal; name: string; text: string }[] = [
  { g: 1, name: 'Rahat', text: 'Okul ya da iş yoğunken.' },
  { g: 3, name: 'Düzenli', text: 'Çoğu kişi için en sürdürülebilir tempo.' },
  { g: 5, name: 'Yoğun', text: 'Bir şeyi hızla büyütürken.' },
];

export const isGhVerified = (p?: Person) => !!p?.evidence.some((e) => e.source === 'github' && e.level === 'S2');
export const hasGhBeyan = (p?: Person) => !!p?.links.github && !!p.evidence.some((e) => e.source === 'github' && e.level === 'S1');
export const isExample = (p?: Person) => !!p?.example;
export const countBy = (p: Person, l: Level) => p.evidence.filter((e) => e.level === l).length;
