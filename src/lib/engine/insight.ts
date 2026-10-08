// Niri's reading: what a young person should do next and how an institution's needs
// stand. Plain sentences built on the same engines the rest of the app uses
// (match, progress), so every number here can be recomputed from state.

import type { Level, Need, Person, State } from '../types.ts';
import { LEVELS } from '../labels.ts';
import { skillLabel } from '../skills.ts';
import { composeTeam, coverageFor, findConflicts, momentum, needsForPerson, rankCandidates, VERIFIED_FLOOR, type Match } from './match.ts';
import { league, progress, weekKey, weekXp } from './progress.ts';

const DAY = 86_400_000;
const within = (iso: string | undefined, days: number, at: number) => !!iso && at - Date.parse(iso) < days * DAY;

// ---------------------------------------------------------------- genç

export interface SkillRead {
  skill: string;
  /** Best coverage 0..1, the same number the matcher uses. */
  score: number;
  level: Level | null;
  verified: number;
  /** Published needs that ask for this skill. */
  demand: number;
}

export interface Lever {
  skill: string;
  /** Score points gained across every need it would move, summed. */
  gain: number;
  needs: { id: string; title: string; from: number; to: number }[];
}

export interface Advice {
  id: string;
  title: string;
  why: string;
  href: string;
  cta: string;
  tone: 'indigo' | 'orange' | 'cyan' | 'green' | 'purple';
}

export interface Letter {
  active: number;
  goal: number;
  met: boolean;
  streak: number;
  xp: number;
  xpPrev: number;
  /** Work that reached Doğrulandı or Kurum onaylı in the last 7 days. */
  verified: number;
  /** Needs published in the last 7 days that fit at least a little. */
  newNeeds: number;
  rank?: number;
  league: string;
}

export interface PersonInsight {
  skills: SkillRead[];
  wanted: SkillRead[];
  levers: Lever[];
  /** The door one step away: the need whose biggest gap would lift the score most. */
  closest?: { match: Match; skill: string; to: number };
  /** GitHub work still at Beyan that one ownership check would lift. */
  unverified: number;
  rising: boolean;
  advice: Advice[];
  letter: Letter;
}

const strongest = (p: Person, skill: string): Level | null => {
  const levels = p.evidence.filter((e) => e.skills.includes(skill)).map((e) => e.level);
  return levels.includes('S3') ? 'S3' : levels.includes('S2') ? 'S2' : levels.includes('S1') ? 'S1' : null;
};

export function personInsight(s: State, me: Person, at = Date.now()): PersonInsight {
  const conflicts = findConflicts(s.people);
  const published = s.needs.filter((n) => n.status === 'published');
  const demand = new Map<string, number>();
  for (const n of published) for (const k of n.skills) demand.set(k, (demand.get(k) ?? 0) + 1);

  const read = (skill: string): SkillRead => {
    const c = coverageFor(me, skill, conflicts);
    return { skill, score: c.score, level: strongest(me, skill), verified: c.verified, demand: demand.get(skill) ?? 0 };
  };
  const own = [...new Set(me.evidence.flatMap((e) => e.skills))];
  const skills = own.map(read).sort((a, b) => b.score - a.score || b.demand - a.demand);
  const wanted = [...demand.keys()].map(read).sort((a, b) => b.demand - a.demand || a.score - b.score);

  const matches = needsForPerson(s, me);
  const bySkill = new Map<string, Lever>();
  for (const m of matches)
    for (const g of m.gaps) {
      if (g.gain <= 0) continue;
      const l = bySkill.get(g.skill) ?? { skill: g.skill, gain: 0, needs: [] };
      l.gain += g.gain;
      l.needs.push({ id: m.need.id, title: m.need.title, from: m.score, to: m.score + g.gain });
      bySkill.set(g.skill, l);
    }
  const levers = [...bySkill.values()].sort((a, b) => b.needs.length - a.needs.length || b.gain - a.gain);

  let closest: PersonInsight['closest'];
  for (const m of matches) {
    const g = [...m.gaps].sort((a, b) => b.gain - a.gain)[0];
    if (g && g.gain > 0 && (!closest || m.score + g.gain > closest.to)) closest = { match: m, skill: g.skill, to: m.score + g.gain };
  }

  const unverified = me.evidence.filter((e) => e.source === 'github' && e.level === 'S1').length;
  const p = progress(s, me, at);
  const l = league(s, me, at);
  const pilot = s.pilots.find((x) => x.personId === me.id && x.status === 'active');
  const open = pilot?.milestones.find((m) => m.state === 'open');
  const helped = s.posts.some((post) => post.replies.some((r) => r.personId === me.id && weekKey(r.at) === weekKey(at)));

  const advice: Advice[] = [];
  if (pilot && open) {
    const org = s.orgs.find((o) => o.id === pilot.orgId);
    advice.push({
      id: 'pilot',
      title: `${org?.name ?? 'Kurum'} projende sıradaki aşamayı teslim et`,
      why: `Kurum onaylayınca bu aşama profiline Kurum onaylı iş olarak yazılır; eşleşmede en ağır düzey budur.`,
      href: `/pilotlar/${pilot.id}`,
      cta: 'Projeye git',
      tone: 'indigo',
    });
  }
  if (unverified)
    advice.push({
      id: 'verify',
      title: unverified === 1 ? 'GitHub işini doğrula' : `${unverified} GitHub işini doğrula`,
      why: `Şu an Beyan düzeyinde duruyor${unverified === 1 ? '' : 'lar'}. Hesabının senin olduğunu bir kodla gösterince eşleşmede ağırlığı ${LEVELS.S1.weight.toLocaleString('tr-TR')} yerine ${LEVELS.S2.weight.toLocaleString('tr-TR')} olur.`,
      href: '/kanit-bagla',
      cta: 'Doğrula',
      tone: 'cyan',
    });
  const top = levers[0];
  if (top) {
    const best = [...top.needs].sort((a, b) => b.to - a.to)[0];
    advice.push({
      id: `lever-${top.skill}`,
      title: `${skillLabel(top.skill)} alanında doğrulanmış bir iş ekle`,
      why:
        top.needs.length > 1
          ? `${top.needs.length} ihtiyaç bu beceriyi istiyor. En çok “${best.title}” için uyumun ${best.from} → ${best.to} olur.`
          : `“${best.title}” ihtiyacına uyumun ${best.from} → ${best.to} olur.`,
      href: '/gorevler',
      cta: 'Görev seç',
      tone: 'orange',
    });
  }
  if (!p.met && !p.rest)
    advice.push({
      id: 'week',
      title: p.goal - p.active === 1 ? 'Bu hafta bir gün daha üret' : `Bu hafta ${p.goal - p.active} gün daha üret`,
      why: p.streak ? `${p.streak} haftalık serin bu haftayı da tutturursan uzar.` : 'Hedefini tutturduğun ilk hafta serini başlatır.',
      href: '/gorevler',
      cta: 'Görevlere bak',
      tone: 'orange',
    });
  if (!helped)
    advice.push({
      id: 'help',
      title: 'Toplulukta bir soruya cevap ver',
      why: 'Bildiğini paylaşmak da üretimdir. Soran “işe yaradı” derse hem XP alırsın hem bu hafta sayılır.',
      href: '/topluluk',
      cta: 'Topluluğa git',
      tone: 'purple',
    });
  if (me.availability === 'closed')
    advice.push({
      id: 'open',
      title: 'Projeye açık olduğunu belirt',
      why: 'Şu an kapalı görünüyorsun; kurumların sıralamasında kapasite puanın düşük kalıyor.',
      href: '/profil',
      cta: 'Profilime git',
      tone: 'green',
    });

  const prevWeek = weekKey(at - 7 * DAY);
  return {
    skills,
    wanted,
    levers,
    closest,
    unverified,
    rising: momentum(me).rising,
    advice,
    letter: {
      active: p.active,
      goal: p.goal,
      met: p.met,
      streak: p.streak,
      xp: p.xpWeek,
      xpPrev: weekXp(s, me, prevWeek),
      verified: me.evidence.filter((e) => e.level !== 'S1' && within(e.verifiedAt, 7, at)).length,
      newNeeds: matches.filter((m) => within(m.need.publishedAt, 7, at) && m.score >= 40).length,
      rank: l.rows.find((r) => r.personId === me.id)?.rank,
      league: l.name,
    },
  };
}

// ---------------------------------------------------------------- kurum

export interface NeedRead {
  need: Need;
  /** Skills of the need that some available person covers with verified work. */
  covered: number;
  total: number;
  /** Candidates at or above the fit line, and the best score. */
  fits: number;
  best: number;
  /** People the team suggestion needs to cover every skill it can. */
  team: number;
  pilot?: { id: string; approved: number; of: number };
}

export interface OrgInsight {
  needs: NeedRead[];
  /** Milestones waiting for this org's approval, and the longest wait in days. */
  waiting: number;
  oldestWait: number;
  approvedWeek: number;
  /** Open needs with at least one fitting candidate, out of all open needs. */
  answered: number;
  open: number;
}

export function orgInsight(s: State, orgId: string, fitMin: number, at = Date.now()): OrgInsight {
  const conflicts = findConflicts(s.people);
  const live = s.needs.filter((n) => n.orgId === orgId && (n.status === 'published' || n.status === 'piloting'));
  const needs = live.map((need): NeedRead => {
    const team = composeTeam(s, need);
    const ranked = need.status === 'published' ? rankCandidates(s, need, conflicts).filter((m) => m.score >= fitMin) : [];
    const p = s.pilots.find((x) => x.needId === need.id && x.status === 'active');
    return {
      need,
      covered: team.coverage.filter((c) => c.score >= VERIFIED_FLOOR).length,
      total: need.skills.length,
      fits: ranked.length,
      best: ranked[0]?.score ?? 0,
      team: team.members.length,
      pilot: p && { id: p.id, approved: p.milestones.filter((m) => m.state === 'approved').length, of: p.milestones.length },
    };
  });

  const pilots = s.pilots.filter((p) => p.orgId === orgId);
  const waits = pilots.flatMap((p) => p.milestones.filter((m) => m.state === 'submitted' && !m.approvals.org).map((m) => m.approvals.person ?? p.startedAt));
  const approvedWeek = pilots.flatMap((p) => p.milestones).filter((m) => within(m.approvals.org, 7, at)).length;
  const published = needs.filter((r) => r.need.status === 'published');

  return {
    needs,
    waiting: waits.length,
    oldestWait: waits.length ? Math.floor(Math.max(...waits.map((w) => at - Date.parse(w))) / DAY) : 0,
    approvedWeek,
    answered: published.filter((r) => r.fits > 0).length + needs.filter((r) => r.pilot).length,
    open: needs.length,
  };
}
