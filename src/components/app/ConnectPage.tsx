// Kanıt bağla: onboarding as a short walk. One thing per screen, survey markers
// on top that fill in as you go, and the key right under the step. Two routes: code on GitHub, or
// work anywhere else (LinkedIn, Behance, ArtStation, a site of one's own). Every check still goes to
// the real services (GitHub API, DNS over HTTPS); whatever cannot be proven stays Beyan.
// The steps themselves are in connect/.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import type { Evidence, Person, State, WeeklyGoal } from '../../lib/types.ts';
import { actions, getState, useAppState } from '../../lib/store.ts';
import { totalXp } from '../../lib/engine/progress.ts';
import {
  checkDnsTxt,
  checkGitHubChallenge,
  cleanDomain,
  cleanHandle,
  domainEvidence,
  fetchActivityDays,
  fetchGitHub,
  fetchInstalledRepos,
  fetchMe,
  isGitHubLogin,
  pickRepos,
  reposToEvidence,
  sessionChallenge,
  verifyGitHubEvidence,
  VerifyError,
  type GhRepo,
} from '../../lib/verify.ts';
import { appReady, completeReturn, forgetToken, getToken, installUrl, signInUrl, signOut, type ReturnResult } from '../../lib/auth.ts';
import { daysAgo, slugify, uid } from '../../lib/format.ts';
import { skillLabel, skillsInText } from '../../lib/skills.ts';
import { isProfile, normalizeUrl, platformOf, PLATFORMS, sharedWork, shortUrl, withProfile } from '../../lib/platforms.ts';
import { celebrate, feedback } from '../ui/kit';
import { GitHub } from '../ui/icons';
import { ERR_TITLE, FLOWS, type Route, type Scan, type StepId, isExample, isGhVerified } from './connect/flow';
import { Key, Steps } from './connect/pieces';
import { ConnectBody, ConnectOther, DomainBody, FoundBody, ProveBody, UserBody } from './connect/github';
import { MeBody, ProfilesBody, StartBody, WorkBody } from './connect/work';
import { DoneBody, GoalBody, HomeBody } from './connect/home';

interface Foot {
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  busy?: boolean;
  /** Called when Enter is pressed while the key is disabled. */
  blocked?: () => void;
  icon?: ReactNode;
  /** `href` opens in a new tab, and `onClick` still runs. */
  external?: boolean;
  side?: { label: string; onClick?: () => void; href?: string };
  /** Quieter ways out under the key, so the key itself stays on the first screen. */
  below?: ReactNode;
}

const OFFLINE: Scan = {
  offline: true,
  days: null,
  user: {
    login: 'ornek-gelistirici',
    name: 'Örnek Geliştirici',
    bio: 'Örnek profil',
    avatar_url: '',
    html_url: 'https://github.com',
    public_repos: 3,
    followers: 4,
    created_at: daysAgo(500),
    location: 'İstanbul',
    blog: null,
  },
  repos: [
    { name: 'kargo-izle', description: 'Kurye konumlarını WebSocket ile canlı haritada gösteren React paneli', html_url: 'https://github.com', stargazers_count: 38, forks_count: 6, language: 'TypeScript', fork: false, archived: false, pushed_at: daysAgo(9), created_at: daysAgo(80) },
    { name: 'tr-adres', description: 'Türkçe adres normalizasyonu için Python kütüphanesi', html_url: 'https://github.com', stargazers_count: 21, forks_count: 2, language: 'Python', fork: false, archived: false, pushed_at: daysAgo(40), created_at: daysAgo(300) },
    { name: 'mqtt-koprusu', description: 'Sensör verisini MQTT’den REST API’ye aktaran Go servisi', html_url: 'https://github.com', stargazers_count: 12, forks_count: 1, language: 'Go', fork: false, archived: false, pushed_at: daysAgo(20), created_at: daysAgo(120) },
  ],
};

const RETRY_KEY = 'nirengi:gh-retry';

const demoUser = () => getState().people.find((p) => p.isDemoUser);

/** The demo user after this scan: GitHub evidence follows the scan, everything else is kept. */
function buildPerson(s: State, cur: Person | undefined, sc: Scan, picked: GhRepo[]): Person {
  const login = sc.user.login.toLowerCase();
  const same = !!cur && !sc.offline && cur.links.github?.toLowerCase() === login;
  const proven = same ? cur!.evidence.find((e) => e.source === 'github' && e.level === 'S2') : undefined;
  const kept = (same ? cur!.evidence.filter((e) => e.source === 'github' && picked.some((r) => r.html_url === e.url)) : []).map((e) =>
    sc.granted && e.level === 'S1' ? verifyGitHubEvidence(e, 'grant') : e,
  );
  const fresh = reposToEvidence(
    picked.filter((r) => !kept.some((e) => e.url === r.html_url)),
    !!sc.granted || !!proven,
    sc.granted ? 'grant' : proven?.verifier?.includes('gist') ? 'gist' : 'bio',
  );
  const evidence = [...fresh, ...kept, ...(cur?.evidence.filter((e) => e.source !== 'github') ?? [])];
  const taken = s.people.some((p) => !p.isDemoUser && p.handle === login);
  const profile = {
    name: sc.user.name || sc.user.login,
    headline: [...new Set(evidence.flatMap((e) => e.skills))].slice(0, 2).map(skillLabel).join(' · ') || 'Geliştirici',
    city: sc.user.location || '—',
    bio: sc.user.bio && !sc.user.bio.includes('nirengi-') ? sc.user.bio : 'Kanıtlarını NİRENGİ’ye bağladı.',
  };
  const base: Person = cur ?? {
    ...profile,
    id: uid('p'),
    handle: '',
    age: 0,
    school: '—',
    availability: 'open',
    weeklyHours: 15,
    joinedAt: new Date().toISOString(),
    evidence: [],
    links: {},
  };
  return {
    ...base,
    // An example profile is replaced by the real account's details; a person's own stay.
    ...(cur && isExample(cur) ? profile : {}),
    handle: same ? base.handle : taken ? `${login}-gh` : login,
    evidence,
    links: { ...base.links, github: sc.offline ? undefined : sc.user.login },
    avatar: sc.offline ? undefined : sc.user.avatar_url || undefined,
    isDemoUser: true,
    example: sc.offline || undefined,
  };
}

const slide = {
  enter: (d: { dir: number; reduce: boolean }) => ({ x: d.reduce ? 0 : d.dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: { dir: number; reduce: boolean }) => ({ x: d.reduce ? 0 : d.dir * -48, opacity: 0 }),
};

export default function ConnectPage() {
  const s = useAppState();
  const me = s.people.find((p) => p.isDemoUser);
  const reduce = !!useReducedMotion();

  const [step, setStep] = useState<StepId>(me ? 'home' : 'start');
  /** Which walk the markers follow: code on GitHub, or work kept anywhere else. */
  const [route, setRoute] = useState<Route>(me && !me.links.github && !isExample(me) ? 'open' : 'github');
  const [pick, setPick] = useState<Route | null>(null);
  /** The handle field (Beyan only) instead of connecting the GitHub App. */
  const [manual, setManual] = useState(!appReady());
  const [dir, setDir] = useState(1);
  /** Started from the "Bağlı hesap" screen: finishing returns there instead of walking the whole flow. */
  const [from, setFrom] = useState<'flow' | 'home'>('flow');
  const [handle, setHandle] = useState('');
  const [touched, setTouched] = useState(false);
  const [loginErr, setLoginErr] = useState<VerifyError | null>(null);
  const [scan, setScan] = useState<Scan | null>(null);
  const [stage, setStage] = useState('');
  const [included, setIncluded] = useState<Set<string>>(new Set());
  const [goal, setGoal] = useState<WeeklyGoal>(me?.weeklyGoal ?? 3);
  const [code] = useState(sessionChallenge);
  const [tab, setTab] = useState<'bio' | 'gist'>('bio');
  const [domain, setDomain] = useState('');
  const own = me && !isExample(me) ? me : undefined;
  const [name, setName] = useState(own?.name ?? '');
  const [headline, setHeadline] = useState(own?.headline ?? '');
  const [city, setCity] = useState(own && own.city !== '—' ? own.city : '');
  const [meTouched, setMeTouched] = useState(false);
  const [link, setLink] = useState('');
  const [linkTouched, setLinkTouched] = useState(false);
  const [work, setWork] = useState({ title: '', url: '' });
  /** Skills ticked by hand; until then they follow the link's platform and the title. */
  const [workSkills, setWorkSkills] = useState<string[] | null>(null);
  const [busy, setBusy] = useState<'verify' | 'dns' | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const run = useRef(0);

  /** Steps slide one at a time: a change that lands mid-slide waits for the slide to finish. */
  const lastGo = useRef(0);
  const go = (to: StepId, d = 1) => {
    const at = Math.max(Date.now(), lastGo.current + (reduce ? 40 : 420));
    lastGo.current = at;
    const apply = () => {
      setDir(d);
      setStep(to);
    };
    if (at <= Date.now()) apply();
    else window.setTimeout(apply, at - Date.now());
  };
  const login = cleanHandle(handle);
  const valid = isGitHubLogin(login);
  const proven = isGhVerified(me);
  const domainDone = !!me?.links.domain;
  const afterFlow = (next: StepId) => (from === 'home' ? 'home' : next);
  const skipProve = !!scan?.offline || !!scan?.granted || (!scan && !manual);
  const meOk = name.trim().length >= 2 && headline.trim().length >= 2;
  const linkUrl = normalizeUrl(link);
  const workUrl = work.url.trim() ? normalizeUrl(work.url) : null;
  const workBad = !!work.url.trim() && !workUrl;
  // What the title names is more precise than what the platform usually holds.
  const titleSkills = skillsInText(work.title);
  const shownSkills = workSkills ?? (titleSkills.length || !workUrl ? titleSkills : PLATFORMS[platformOf(workUrl)].skills);

  // ------------------------------------------------------------ actions

  /** `raw` null: the account behind the GitHub App token, whose work counts as Doğrulandı. */
  const scanFor = async (raw: string | null, back: StepId) => {
    const id = ++run.current;
    const granted = raw === null;
    setLoginErr(null);
    setScan(null);
    setStage(granted ? 'GitHub hesabını tanıyorum…' : 'Depolarını okuyorum…');
    go('found');
    try {
      if (granted) {
        const user = await fetchMe();
        if (id !== run.current) return;
        setHandle(user.login);
        setStage('Seçtiğin depoları okuyorum…');
        const all = (await fetchInstalledRepos()).filter((r) => !r.fork && !r.archived);
        if (id !== run.current) return;
        setStage('Etkinliğini sayıyorum…');
        const days = await fetchActivityDays(user.login);
        if (id !== run.current) return;
        // Their own private repositories are here only because they were ticked on GitHub: they lead and start selected.
        const mine = (r: GhRepo) => !r.owner || r.owner.login.toLowerCase() === user.login.toLowerCase();
        const chosen = all.filter((r) => r.private && mine(r));
        const open = all.filter((r) => !chosen.includes(r));
        setIncluded(new Set([...chosen, ...pickRepos(open)].map((r) => r.name)));
        setScan({ user, repos: [...chosen, ...pickRepos(open, 20)], days, offline: false, granted });
        return;
      }
      const { user, repos } = await fetchGitHub(raw);
      if (id !== run.current) return;
      setStage('Etkinliğini sayıyorum…');
      const days = await fetchActivityDays(user.login);
      if (id !== run.current) return;
      const picked = pickRepos(repos);
      setIncluded(new Set(picked.map((r) => r.name)));
      setScan({ user, repos: picked, days, offline: false });
    } catch (e) {
      if (id !== run.current) return;
      const err = e instanceof VerifyError ? e : new VerifyError('Beklenmeyen bir hata oldu.');
      if (err.kind === 'auth') forgetToken();
      setLoginErr(err);
      feedback({ tone: 'bad', title: ERR_TITLE[err.kind], text: err.kind === 'notfound' ? `GitHub’da “${cleanHandle(raw ?? '')}” diye bir hesap yok. Yazımı kontrol et.` : err.message });
      go(back, -1);
    }
  };

  const startScan = () => {
    if (scan && !scan.offline && scan.user.login.toLowerCase() === login.toLowerCase()) return go('found');
    void scanFor(login, 'user');
  };

  /** Back from GitHub's install or sign-in page: finish the connection, or say plainly why not. */
  const onReturn = (r: ReturnResult) => {
    if (r.kind === 'none') return;
    if (r.kind === 'ok') {
      try {
        sessionStorage.removeItem(RETRY_KEY);
      } catch {
        /* private mode */
      }
      const back = me && !isExample(me) ? 'home' : 'user';
      setFrom(back === 'home' ? 'home' : 'flow');
      setRoute('github');
      void scanFor(null, back);
      return;
    }
    go(me ? 'home' : 'user', -1);
    if (r.kind === 'unverified') {
      // Installed from GitHub's own page, or the tab changed on the way: one silent sign-in finishes it.
      let retried = true;
      try {
        retried = sessionStorage.getItem(RETRY_KEY) === '1';
        sessionStorage.setItem(RETRY_KEY, '1');
      } catch {
        /* private mode: ask instead of looping */
      }
      if (!retried && appReady()) return location.replace(signInUrl());
      feedback({ tone: 'info', title: 'GitHub’dan döndün', text: 'Bağlantıyı tamamlamak için “GitHub’a bağlan”a bir kez daha dokun.' });
      return;
    }
    if (r.kind === 'requested') {
      feedback({ tone: 'info', title: 'Onay bekleniyor', text: 'Bu GitHub kuruluşunun yöneticisi kurulumu onaylayınca depoların görünür.' });
      return;
    }
    const text = {
      denied: 'GitHub’da bağlantıyı iptal ettin. İstediğin zaman yeniden deneyebilirsin.',
      expired: 'GitHub’ın verdiği tek kullanımlık kodun süresi doldu. Bir kez daha dene.',
      network: 'Nirengi sunucusuna ulaşamadık. Bağlantını kontrol edip yeniden dene.',
      config: 'GitHub bağlantısı bu kurulumda henüz açık değil. Şimdilik kullanıcı adınla devam edebilirsin.',
    }[r.reason];
    feedback({ tone: r.reason === 'denied' ? 'info' : 'bad', title: r.reason === 'denied' ? 'Bağlantı iptal edildi' : 'Bağlanamadık', text });
  };

  const continueWithExample = () => {
    run.current++;
    setLoginErr(null);
    setIncluded(new Set(OFFLINE.repos.map((r) => r.name)));
    setScan(OFFLINE);
    setRoute('github');
    feedback({ tone: 'info', title: 'Örnek profille devam', text: 'Bu veri kurgusal: gerçek hesabına bağlanmaz, her şey Beyan düzeyinde kalır.' });
    go('found');
  };

  const saveScan = () => {
    const sc = scan!;
    const picked = sc.repos.filter((r) => included.has(r.name));
    const person = buildPerson(getState(), demoUser(), sc, picked);
    actions.upsertDemoUser(person);
    if (sc.days?.length) actions.recordActivity(person.id, sc.days);
    const ok = isGhVerified(demoUser());
    feedback({
      tone: 'good',
      title: from === 'home' ? 'Profilin güncellendi' : `${picked.length} eser eklendi`,
      text: from === 'home' ? `${picked.length} eser profilinde.` : sc.offline ? 'Örnek veri Beyan düzeyinde kalır.' : sc.granted ? 'GitHub’da sen seçtiğin için hepsi Doğrulandı düzeyinde.' : ok ? 'Hesabın daha önce doğrulandığı için Doğrulandı düzeyinde.' : 'Şimdilik Beyan düzeyinde; sahipliğini kanıtlayınca Doğrulandı olur.',
    });
    go(afterFlow('goal'));
  };

  const saveGoal = () => {
    const cur = demoUser();
    if (!cur) return;
    actions.setWeeklyGoal(cur.id, goal);
    feedback({ tone: 'good', title: 'Hedefin kaydedildi', text: `Haftada ${goal} gün üretim. İstediğin zaman değiştirebilirsin.` });
    go(route === 'open' ? 'done' : skipProve ? 'profiles' : 'prove');
  };

  const copy = async (text: string, key: string, note: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
      feedback({ tone: 'good', title: 'Kopyalandı', text: note });
    } catch {
      feedback({ tone: 'bad', title: 'Kopyalanamadı', text: 'Metni elle seçip kopyala.' });
    }
  };

  const verifyOwnership = async () => {
    const cur = demoUser();
    const gh = cur?.links.github;
    if (!cur || !gh) return;
    setBusy('verify');
    try {
      const via = await checkGitHubChallenge(gh, code);
      if (!via) {
        feedback({
          tone: 'bad',
          title: 'Kodu bulamadık',
          text:
            tab === 'bio'
              ? `Bio’nda “${code}” görünmüyor. Profil ayarlarında kaydettiğinden emin ol; GitHub bir dakikaya kadar geç gösterebilir.`
              : `Herkese açık bir gist’in açıklamasında ya da dosya adında “${code}” görünmüyor. Gizli gist sayılmaz.`,
        });
        return;
      }
      const n = cur.evidence.filter((e) => e.source === 'github' && e.level === 'S1').length;
      const before = totalXp(getState(), cur);
      actions.upsertDemoUser({ ...cur, evidence: cur.evidence.map((e) => (e.source === 'github' && e.level === 'S1' ? verifyGitHubEvidence(e, via) : e)) });
      celebrate({ title: 'Doğrulandın!', sub: `${n} işin artık Doğrulandı düzeyinde. Eşleşmede beyandan daha ağır sayılır.`, xp: totalXp(getState(), demoUser()!) - before });
      go(afterFlow('profiles'));
    } catch (e) {
      feedback({ tone: 'bad', title: 'Kontrol edemedik', text: e instanceof VerifyError ? e.message : 'Beklenmeyen bir hata oldu.' });
    } finally {
      setBusy(null);
    }
  };

  const leave = () => {
    const text = me?.links.github ? 'GitHub bağlantın kaldırıldı; örnek profille geziyorsun.' : 'Profilin bu tarayıcıdan silindi; örnek profille geziyorsun.';
    signOut();
    run.current++;
    setScan(null);
    setHandle('');
    setFrom('flow');
    setManual(!appReady());
    setPick(null);
    setName('');
    setHeadline('');
    setCity('');
    feedback({ tone: 'info', title: 'Çıkış yaptın', text });
    go('start', -1);
  };

  const skipProveStep = () => {
    feedback({ tone: 'info', title: 'Şimdilik Beyan olarak kalıyor', text: 'Doğrulanmayan işler profilinde görünür ama eşleşmede düşük ağırlık taşır. Sonra tekrar deneyebilirsin.' });
    go(afterFlow('profiles'));
  };

  const verifyDomain = async () => {
    const cur = demoUser();
    if (!cur) return;
    setBusy('dns');
    try {
      const r = await checkDnsTxt(domain, code);
      if (!r.ok) {
        feedback({
          tone: 'bad',
          title: 'Kaydı bulamadık',
          text: r.records.length ? `Kayıt var ama değeri eşleşmiyor: ${r.records.join(', ')}` : 'TXT kaydı henüz yayılmamış. DNS değişikliği birkaç dakika sürebilir.',
        });
        return;
      }
      const d = cleanDomain(domain);
      const before = totalXp(getState(), cur);
      actions.upsertDemoUser({ ...cur, links: { ...cur.links, domain: d }, evidence: [domainEvidence(d), ...cur.evidence.filter((e) => e.source !== 'domain')] });
      celebrate({ title: 'Alan adın doğrulandı!', sub: `${d} artık senin kanıtın.`, xp: totalXp(getState(), demoUser()!) - before });
      go(afterFlow('done'));
    } catch (e) {
      feedback({ tone: 'bad', title: 'Kontrol edemedik', text: e instanceof VerifyError ? e.message : 'Beklenmeyen bir hata oldu.' });
    } finally {
      setBusy(null);
    }
  };

  const skipDomain = () => {
    feedback({ tone: 'info', title: 'Alan adı atlandı', text: 'İstediğin zaman bu sayfadan ekleyebilirsin.' });
    go(afterFlow('done'));
  };

  const choose = () => {
    if (!pick) return;
    setRoute(pick);
    setFrom('flow');
    if (pick === 'open') return go('me');
    setManual(!appReady());
    go('user');
  };

  /** The open route starts with who the person is, in their own words. */
  const saveMe = () => {
    const cur = demoUser();
    const patch = { name: name.trim(), headline: headline.trim(), city: city.trim() || '—' };
    if (cur && !isExample(cur)) actions.updatePerson(cur.id, patch);
    else {
      const taken = (h: string) => getState().people.some((p) => !p.isDemoUser && p.handle === h);
      const base = slugify(patch.name) || 'genc';
      let handle = base;
      for (let n = 2; taken(handle); n++) handle = `${base}-${n}`;
      // Nothing the example did was this person's (work, quests, pilots, posts): it leaves first,
      // so a real profile starts empty and joins under its own name.
      if (cur) actions.signOut();
      actions.upsertDemoUser({
        ...patch,
        id: uid('p'),
        handle,
        age: 0,
        school: '—',
        bio: 'Kanıtlarını NİRENGİ’ye bağladı.',
        availability: 'open',
        weeklyHours: 0,
        joinedAt: new Date().toISOString(),
        evidence: [],
        links: {},
        isDemoUser: true,
      });
    }
    go(afterFlow('profiles'));
  };

  const addProfile = () => {
    const cur = demoUser();
    if (!cur || !linkUrl || !isProfile(linkUrl)) {
      setLinkTouched(true);
      return false;
    }
    actions.updatePerson(cur.id, { profiles: withProfile(cur.profiles, linkUrl) });
    setLink('');
    setLinkTouched(false);
    return true;
  };

  const removeProfile = (url: string) => {
    const cur = demoUser();
    if (cur) actions.updatePerson(cur.id, { profiles: cur.profiles?.filter((p) => p.url !== url) });
  };

  const saveProfiles = () => {
    // A pasted address the person did not add yet is added on the way, never dropped.
    if (link.trim() && !addProfile()) return;
    go(afterFlow(route === 'open' ? 'work' : 'domain'));
  };

  const addWork = () => {
    const cur = demoUser();
    const title = work.title.trim();
    if (!cur || !title || workBad) return;
    const ev: Evidence = {
      id: uid('e-work'),
      title,
      summary: workUrl ? `Bağlantı: ${shortUrl(workUrl, 60)}` : 'Bağlantısı yok; kendi sözüyle eklendi.',
      source: workUrl ? 'link' : 'claim',
      ...(workUrl ? { url: workUrl, platform: platformOf(workUrl) } : {}),
      level: 'S1',
      skills: shownSkills,
      producedAt: new Date().toISOString(),
    };
    actions.addEvidence(cur.id, ev);
    setWork({ title: '', url: '' });
    setWorkSkills(null);
    feedback({ tone: 'good', title: 'Eser eklendi', text: 'Profilinde Beyan olarak görünür. Bir kurumla deneme projesinde onaylanan iş Kurum onaylı olur.' });
    go(afterFlow('goal'));
  };

  const toggleWorkSkill = (k: string) => setWorkSkills(shownSkills.includes(k) ? shownSkills.filter((x) => x !== k) : [...shownSkills, k]);

  // ------------------------------------------------------------ chrome

  const loading = step === 'found' && !scan;
  const foot: Foot = (() => {
    switch (step) {
      case 'start':
        return { label: 'Devam', disabled: !pick, onClick: choose };
      case 'me':
        return { label: 'Devam', onClick: () => (meOk ? saveMe() : setMeTouched(true)) };
      case 'profiles':
        return { label: from === 'home' ? 'Bitti' : 'Devam', onClick: saveProfiles };
      case 'work':
        return {
          label: 'Ekle',
          disabled: !work.title.trim() || workBad,
          onClick: addWork,
          side: from === 'home' ? undefined : { label: 'Şimdilik atla', onClick: () => go('goal') },
        };
      case 'user':
        return manual
          ? { label: 'Devam', disabled: !valid, onClick: startScan, blocked: () => setTouched(true), side: appReady() ? { label: 'GitHub’a bağlan', onClick: () => setManual(false) } : undefined }
          : {
              label: 'GitHub’a bağlan',
              icon: <GitHub size={22} />,
              onClick: () => location.assign(installUrl()),
              below: <ConnectOther onSignIn={() => location.assign(signInUrl())} onManual={() => setManual(true)} canExample={!me} onExample={continueWithExample} />,
            };
      case 'found':
        return { label: 'Devam', disabled: loading || included.size === 0, onClick: saveScan };
      case 'goal':
        return { label: 'Devam', onClick: saveGoal };
      case 'prove':
        return proven
          ? { label: 'Devam', onClick: () => go(afterFlow('profiles')) }
          : { label: 'Kontrol et', busy: busy === 'verify', onClick: verifyOwnership, side: { label: 'Şimdilik atla', onClick: skipProveStep } };
      case 'domain':
        return domainDone
          ? { label: 'Devam', onClick: () => go(afterFlow('done')) }
          : { label: 'Kontrol et', busy: busy === 'dns', disabled: !cleanDomain(domain).includes('.'), onClick: verifyDomain, side: { label: 'Atla', onClick: skipDomain } };
      case 'done':
        return { label: 'Bugün’e git', href: '/bugun', side: me ? { label: 'Profilim', href: `/profil/${me.handle}` } : undefined };
      default:
        return { label: 'Bugün’e git', href: '/bugun' };
    }
  })();

  // After a one-click login (or with the example profile) there is nothing to prove.
  const flow = route === 'open' ? FLOWS.open : skipProve ? FLOWS.github.filter((x) => x !== 'prove') : FLOWS.github;
  const back: StepId | null = (() => {
    if (step === 'start') return me ? 'home' : null;
    if (step === 'home' || step === 'done') return null;
    if (from === 'home') return 'home';
    const i = flow.indexOf(step);
    return i > 0 ? flow[i - 1] : i === 0 ? 'start' : null;
  })();
  const goBack = () => {
    run.current++;
    go(back!, -1);
  };

  // GitHub sends the visitor back here (?code&state…) after installing the app or signing in.
  useEffect(() => {
    if (!/[?&](code|setup_action|error)=/.test(location.search)) return;
    setStage('GitHub’dan dönüyorum…');
    setScan(null);
    setRoute('github');
    go('found');
    void completeReturn().then(onReturn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The installed app's share sheet (?baglanti, ?metin, ?baslik from Behance, YouTube…) and its
  // "Eser ekle" shortcut (?adim=eser) land here. With a profile the work screen opens, filled in;
  // without one the open route is picked and the shared link waits on its work step.
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const shared = sharedWork(q);
    if (!shared && q.get('adim') !== 'eser') return;
    history.replaceState(null, '', location.pathname + location.hash);
    if (shared) {
      setWork(shared);
      setWorkSkills(null);
    }
    if (me && !isExample(me)) {
      setFrom('home');
      go('work');
    } else {
      setPick('open');
      if (me) go('start');
      if (shared) feedback({ tone: 'info', title: 'Bağlantın hazır', text: 'Önce profilini kur; paylaştığın iş ilk eserin olarak gelecek.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Signed out from the menu while this page is open: there is no account to show any more.
  useEffect(() => {
    if (!me && step === 'home') go('start', -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, step]);

  // A long step must not leave the next one scrolled halfway.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const idx = flow.indexOf(step);
  const reached = step === 'done' ? flow.length : idx >= 0 ? idx : null;

  // Enter acts like the big key unless it already means something where the focus is.
  const footRef = useRef(foot);
  footRef.current = foot;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.defaultPrevented || e.isComposing) return;
      if ((e.target as HTMLElement | null)?.closest('button, a, textarea, select, [role="dialog"]')) return;
      const f = footRef.current;
      if (f.disabled) return f.blocked?.();
      if (f.busy) return;
      if (f.href && f.external) {
        window.open(f.href, '_blank', 'noreferrer');
        f.onClick?.();
      } else if (f.href) location.href = f.href;
      else f.onClick?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const body = (() => {
    switch (step) {
      case 'start':
        return <StartBody pick={pick} onPick={setPick} canExample={!me} onExample={continueWithExample} />;
      case 'me':
        return (
          <MeBody
            name={name}
            headline={headline}
            city={city}
            onName={setName}
            onHeadline={setHeadline}
            onCity={setCity}
            touched={meTouched}
            onBlur={() => setMeTouched(true)}
          />
        );
      case 'profiles':
        return (
          <ProfilesBody
            me={me}
            link={link}
            onLink={(v) => {
              setLink(v);
              setLinkTouched(false);
            }}
            touched={linkTouched}
            onAdd={addProfile}
            onRemove={removeProfile}
          />
        );
      case 'work':
        return (
          <WorkBody
            first={from !== 'home'}
            title={work.title}
            url={work.url}
            onTitle={(title) => setWork((w) => ({ ...w, title }))}
            onUrl={(url) => setWork((w) => ({ ...w, url }))}
            skills={shownSkills}
            onSkill={toggleWorkSkill}
          />
        );
      case 'user':
        if (!manual)
          return (
            <ConnectBody reduce={reduce} />
          );
        return (
          <UserBody
            handle={handle}
            onHandle={(v) => {
              setHandle(v);
              setLoginErr(null);
            }}
            onBlur={() => setTouched(true)}
            showFormat={touched && !!handle.trim() && !valid}
            err={loginErr}
            login={login}
            canExample={!me}
            onExample={continueWithExample}
          />
        );
      case 'found':
        return (
          <FoundBody
            scan={scan}
            stage={stage}
            included={included}
            reduce={reduce}
            onToggle={(name) =>
              setIncluded((prev) => {
                const next = new Set(prev);
                if (!next.delete(name)) next.add(name);
                return next;
              })
            }
            onChange={() => {
              run.current++;
              go('user', -1);
            }}
          />
        );
      case 'goal':
        return <GoalBody goal={goal} onGoal={setGoal} days={scan?.days ?? null} offline={!!scan?.offline} />;
      case 'prove':
        return <ProveBody me={me} code={code} tab={tab} onTab={setTab} proven={proven} copied={copied === 'code'} onCopy={() => copy(code, 'code', 'Şimdi bio’na ya da bir gist’e yapıştır.')} />;
      case 'domain':
        return (
          <DomainBody
            me={me}
            domain={domain}
            onDomain={setDomain}
            code={code}
            copied={copied}
            onCopy={(text, key) => copy(text, key, 'DNS panelindeki ilgili alana yapıştır.')}
          />
        );
      case 'done':
        return <DoneBody s={s} me={me} />;
      default:
        return (
          <HomeBody
            s={s}
            me={me}
            onRescan={() => {
              const gh = me?.links.github;
              if (!gh) return;
              setFrom('home');
              setHandle(gh);
              // Connected through the app, the private repositories picked on GitHub come along too.
              void scanFor(getToken() ? null : gh, 'home');
            }}
            onOpen={(to) => {
              setFrom('home');
              go(to);
            }}
            onStart={() => {
              setFrom('flow');
              setPick(null);
              go('start');
            }}
            onConnect={() => {
              setFrom(me && !isExample(me) ? 'home' : 'flow');
              setRoute('github');
              setManual(!appReady());
              go('user');
            }}
            onSignIn={() => location.assign(signInUrl())}
            onSignOut={leave}
          />
        );
    }
  })();

  const quiet = 'inline-flex shrink-0 items-center gap-0.5 rounded-full py-1 pl-1 pr-3 text-[15px] font-bold text-ink-3 transition-colors hover:bg-bg-2 hover:text-ink';

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div className="flex items-center gap-3 py-2">
        {back ? (
          <button type="button" onClick={goBack} className={quiet}>
            <ChevronLeft className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
            Geri
          </button>
        ) : (
          <a href="/profil" className={quiet}>
            <ChevronLeft className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
            Profil
          </a>
        )}
        {reached !== null && <Steps flow={flow} reached={reached} />}
      </div>

      <div className="overflow-x-clip pt-4">
        <AnimatePresence mode="wait" initial={false} custom={{ dir, reduce }}>
          <motion.div
            key={step}
            custom={{ dir, reduce }}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0.01 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {body}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={`mt-6 flex flex-col-reverse items-start gap-3 sm:mt-8 sm:flex-row sm:items-center ${foot.below ? 'pb-3' : 'pb-6'}`}>
        {foot.side && <Key {...foot.side} className="btn-quiet" />}
        <Key {...foot} className="btn-primary btn-lg sm:min-w-[200px]" />
      </div>
      {foot.below && <div className="pb-6">{foot.below}</div>}
    </div>
  );
}
