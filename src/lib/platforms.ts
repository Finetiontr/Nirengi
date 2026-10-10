// Where a person's work and profiles live. Any public http(s) link is accepted; a known host
// gets its name and the skills its work usually shows, so an illustrator, a video editor or a
// translator starts from the same screen as a developer. A link is the person's own word
// (Beyan): these sites give no way to prove from the browser that an account is theirs, so
// such work rises only through a kurum's approval in a pilot, or a domain proven over DNS.

export type PlatformId =
  | 'linkedin'
  | 'behance'
  | 'artstation'
  | 'dribbble'
  | 'figma'
  | 'github'
  | 'gitlab'
  | 'kaggle'
  | 'youtube'
  | 'vimeo'
  | 'instagram'
  | 'tiktok'
  | 'soundcloud'
  | 'spotify'
  | 'medium'
  | 'substack'
  | 'sketchfab'
  | 'itchio'
  | 'orcid'
  | 'scholar'
  | 'drive'
  | 'web';

export interface Platform {
  label: string;
  /** Hosts without "www."; a subdomain of one (name.substack.com) counts too. */
  hosts: string[];
  /** Skills work on this platform usually shows; offered pre-selected, never forced. */
  skills: string[];
  /** Where a profile address starts, typed into the field when the network is picked. */
  start?: string;
}

export const PLATFORMS: Record<PlatformId, Platform> = {
  linkedin: { label: 'LinkedIn', hosts: ['linkedin.com'], skills: [], start: 'linkedin.com/in/' },
  behance: { label: 'Behance', hosts: ['behance.net'], skills: ['brand', 'illustration'], start: 'behance.net/' },
  artstation: { label: 'ArtStation', hosts: ['artstation.com'], skills: ['illustration', 'model3d'], start: 'artstation.com/' },
  dribbble: { label: 'Dribbble', hosts: ['dribbble.com'], skills: ['uiux', 'visual'], start: 'dribbble.com/' },
  figma: { label: 'Figma', hosts: ['figma.com'], skills: ['uiux', 'figma'] },
  github: { label: 'GitHub', hosts: ['github.com'], skills: [] },
  gitlab: { label: 'GitLab', hosts: ['gitlab.com'], skills: [] },
  kaggle: { label: 'Kaggle', hosts: ['kaggle.com'], skills: ['data', 'ml'] },
  youtube: { label: 'YouTube', hosts: ['youtube.com', 'youtu.be'], skills: ['video'], start: 'youtube.com/@' },
  vimeo: { label: 'Vimeo', hosts: ['vimeo.com'], skills: ['video', 'animation'] },
  instagram: { label: 'Instagram', hosts: ['instagram.com'], skills: ['social', 'photo'], start: 'instagram.com/' },
  tiktok: { label: 'TikTok', hosts: ['tiktok.com'], skills: ['social', 'video'] },
  soundcloud: { label: 'SoundCloud', hosts: ['soundcloud.com'], skills: ['audio'] },
  spotify: { label: 'Spotify', hosts: ['spotify.com'], skills: ['audio'] },
  medium: { label: 'Medium', hosts: ['medium.com'], skills: ['writing'] },
  substack: { label: 'Substack', hosts: ['substack.com'], skills: ['writing'] },
  sketchfab: { label: 'Sketchfab', hosts: ['sketchfab.com'], skills: ['model3d'] },
  itchio: { label: 'itch.io', hosts: ['itch.io'], skills: ['unity'] },
  orcid: { label: 'ORCID', hosts: ['orcid.org'], skills: ['research'] },
  scholar: { label: 'Google Akademik', hosts: ['scholar.google.com'], skills: ['research'] },
  drive: { label: 'Google Drive', hosts: ['drive.google.com', 'docs.google.com'], skills: [] },
  web: { label: 'Web sitesi', hosts: [], skills: [] },
};

/** Profile networks people are most often asked for, offered first on the profile step. GitHub has its own, verified route. */
export const SUGGESTED: PlatformId[] = ['linkedin', 'behance', 'artstation', 'dribbble', 'instagram', 'youtube'];

export interface ProfileLink {
  platform: PlatformId;
  url: string;
}

/** A pasted address as a clean https link, or null. Only http(s) is ever kept, so a link can never run script. */
export function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw || /\s/.test(raw)) return null;
  let u: URL;
  try {
    u = new URL(/^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  if (!/^[a-z\d-]+(\.[a-z\d-]+)+$/i.test(u.hostname) || u.username || u.password) return null;
  u.hash = '';
  return u.href.replace(/\/$/, '');
}

const hostOf = (url: string) => new URL(url).hostname.toLowerCase().replace(/^www\./, '');

/** Which platform a normalized link belongs to; anything unknown is a web site. */
export function platformOf(url: string): PlatformId {
  const host = hostOf(url);
  for (const [id, p] of Object.entries(PLATFORMS) as [PlatformId, Platform][]) {
    if (p.hosts.some((h) => host === h || host.endsWith(`.${h}`))) return id;
  }
  return 'web';
}

const pathOf = (url: string) => new URL(url).pathname.replace(/\/$/, '');

/** A profile points at someone: on a known network the bare site or its prefix (linkedin.com/in) is not one. */
export function isProfile(url: string) {
  const id = platformOf(url);
  if (id === 'web') return true;
  const start = PLATFORMS[id].start;
  const path = pathOf(url);
  return path !== '' && path !== (start ? pathOf(`https://${start}`) : '');
}

/** Short form for a chip: host and path, without the scheme. */
export function shortUrl(url: string, max = 42) {
  const u = new URL(url);
  const s = `${u.hostname.replace(/^www\./, '')}${u.pathname === '/' ? '' : u.pathname}`;
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

/** Add or replace a profile link (one per address), keeping LinkedIn and the other suggested networks first. */
export function withProfile(list: ProfileLink[] | undefined, url: string): ProfileLink[] {
  const next = [...(list ?? []).filter((p) => p.url !== url), { platform: platformOf(url), url }];
  const rank = (p: ProfileLink) => (SUGGESTED.includes(p.platform) ? SUGGESTED.indexOf(p.platform) : SUGGESTED.length);
  return next.sort((a, b) => rank(a) - rank(b));
}

/**
 * A work shared from another app (the installed app's share target): the link, from `baglanti`
 * or the first address inside `metin` (many apps put it there), and a title from `baslik` or
 * what is left of the text. Null when nothing shared is a usable link.
 */
export function sharedWork(q: URLSearchParams): { title: string; url: string } | null {
  const text = q.get('metin') ?? '';
  const found = text.match(/https?:\/\/\S+/)?.[0];
  const url = normalizeUrl(q.get('baglanti') ?? '') ?? (found ? normalizeUrl(found.replace(/[).,;!?»”"']+$/, '')) : null);
  if (!url) return null;
  const rest = (found ? text.replace(found, '') : text).replace(/\s+/g, ' ').trim();
  const title = (q.get('baslik')?.trim() || rest).replace(/[\s:|–-]+$/, '').slice(0, 90).trim();
  return { title, url };
}
