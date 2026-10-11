// Kanıt bağla, work from every field: the first choice of route, who you are, profiles
// (LinkedIn, Behance, ArtStation…) and links to the work itself.

import { useRef, useState } from 'react';
import { Link2, Plus, X } from 'lucide-react';
import type { Person } from '../../../lib/types.ts';
import { isProfile, normalizeUrl, platformOf, PLATFORMS, shortUrl, SUGGESTED } from '../../../lib/platforms.ts';
import { Why } from '../../ui/kit';
import { GitHub } from '../../ui/icons';
import SkillPicker, { SkillChip } from '../../ui/SkillPicker';
import { type Route } from './flow';
import { Guide } from './pieces';

// ---------------------------------------------------------------- 0 · start, me

const ROUTES: { id: Route; title: string; text: string }[] = [
  { id: 'github', title: 'Kodum GitHub’da', text: 'Depolarını sen seçersin; seçtiklerin Doğrulandı olarak gelir.' },
  { id: 'open', title: 'İşim başka yerlerde', text: 'LinkedIn, Behance, ArtStation, YouTube ya da kendi siten. Bağlantısı olmayan işi kendi sözünle eklersin.' },
];

export function StartBody({ pick, onPick, canExample, onExample }: { pick: Route | null; onPick: (r: Route) => void; canExample: boolean; onExample: () => void }) {
  return (
    <>
      <Guide mood="wave">Yazılım, tasarım, video ya da çeviri: işin neyse onunla görün.</Guide>
      <h1 className="h-page mt-6">İşin nerede duruyor?</h1>
      <div className="mt-5 space-y-3" role="radiogroup" aria-label="İşin nerede duruyor?">
        {ROUTES.map((o) => {
          const on = o.id === pick;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onPick(o.id)}
              className={`card-press flex w-full items-center gap-4 p-4 text-left ${on ? '!border-indigo !bg-indigo-tint' : ''}`}
              style={on ? { boxShadow: '0 4px 0 rgb(var(--indigo) / 0.5)' } : undefined}
            >
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-[16px] ${on ? 'bg-indigo text-white' : 'bg-bg-3 text-ink-2'}`} aria-hidden="true">
                {o.id === 'github' ? <GitHub size={28} /> : <Link2 className="h-7 w-7" strokeWidth={2.75} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-[18px] font-black ${on ? 'text-indigo' : 'text-ink'}`}>{o.title}</span>
                <span className="block text-[14px] font-bold text-ink-3">{o.text}</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="hint">
        Diğerini sonra da ekleyebilirsin.{' '}
        {canExample && (
          <button type="button" onClick={onExample} className="inline-flex min-h-10 items-center font-extrabold text-indigo underline-offset-2 hover:underline">
            Örnek profille gez
          </button>
        )}
      </p>
    </>
  );
}

export function MeBody({
  name,
  headline,
  city,
  onName,
  onHeadline,
  onCity,
  touched,
  onBlur,
}: {
  name: string;
  headline: string;
  city: string;
  onName: (v: string) => void;
  onHeadline: (v: string) => void;
  onCity: (v: string) => void;
  touched: boolean;
  onBlur: () => void;
}) {
  const err = 'mt-2 text-[14px] font-bold text-red-lip';
  const noName = touched && name.trim().length < 2;
  const noHeadline = touched && headline.trim().length < 2;
  return (
    <>
      <Guide mood="talk">Kurumlar seni önce bu iki satırla tanır; kısa ve kendi sözünle yaz.</Guide>
      <h1 className="h-page mt-6">Seni tanıyalım</h1>
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="ad" className="label">
            Adın
          </label>
          <input id="ad" className="field" value={name} onChange={(e) => onName(e.target.value)} onBlur={onBlur} autoFocus autoComplete="name" maxLength={60} enterKeyHint="next" aria-invalid={noName} />
          {noName && <p className={err}>Adını yaz.</p>}
        </div>
        <div>
          <label htmlFor="ne" className="label">
            Ne üretiyorsun?
          </label>
          <input
            id="ne"
            className="field"
            value={headline}
            onChange={(e) => onHeadline(e.target.value)}
            onBlur={onBlur}
            placeholder="ör. İllüstratör, video kurgucu, çevirmen"
            maxLength={70}
            enterKeyHint="next"
            aria-invalid={noHeadline}
          />
          {noHeadline && <p className={err}>Ne ürettiğini birkaç kelimeyle yaz.</p>}
        </div>
        <div>
          <label htmlFor="sehir" className="label">
            Şehrin <span className="font-semibold text-ink-3">(isteğe bağlı)</span>
          </label>
          <input id="sehir" className="field" value={city} onChange={(e) => onCity(e.target.value)} autoComplete="address-level2" maxLength={40} enterKeyHint="go" />
        </div>
      </div>
      <p className="hint">Kurum, ilk teması kurana kadar adını görmez; işlerine ve neden uyduğuna bakar.</p>
    </>
  );
}

// ---------------------------------------------------------------- profiles, work

const NO_PROOF = (
  <div className="space-y-3 text-[16px] font-bold text-ink-2">
    <p>LinkedIn, Behance ya da ArtStation’daki bir hesabın senin olduğunu buradan kontrol etmenin açık bir yolu yok. Bu yüzden bağlantıların ve onlarla eklediğin işler Beyan düzeyinde görünür.</p>
    <p>Kendi siten varsa alan adını DNS kaydıyla kanıtlayabilirsin; o Doğrulandı olur.</p>
    <p>En güçlü kanıt her alanda aynıdır: bir kurumla yaptığın deneme projesinde onaylanan her aşama profiline Kurum onaylı olarak eklenir.</p>
  </div>
);

export function ProfilesBody({
  me,
  link,
  onLink,
  touched,
  onAdd,
  onRemove,
}: {
  me?: Person;
  link: string;
  onLink: (v: string) => void;
  touched: boolean;
  onAdd: () => boolean;
  onRemove: (url: string) => void;
}) {
  const field = useRef<HTMLInputElement>(null);
  const url = normalizeUrl(link);
  const id = url ? platformOf(url) : null;
  const ok = !!url && isProfile(url);
  const bad = touched && !!link.trim() && !ok;
  const list = me?.profiles ?? [];
  const open = SUGGESTED.filter((p) => !list.some((x) => x.platform === p));
  const start = id ? PLATFORMS[id].start : undefined;
  const begin = (prefix: string) => {
    onLink(prefix);
    window.requestAnimationFrame(() => {
      field.current?.focus();
      field.current?.setSelectionRange(prefix.length, prefix.length);
    });
  };
  return (
    <>
      <Guide mood="talk">LinkedIn’ini ve işlerini koyduğun yerleri ekle; kurumlar seni oradan da tanır.</Guide>
      <h1 className="h-page mt-6">Profillerin</h1>
      <label htmlFor="profil" className="sr-only">
        Profil bağlantısı
      </label>
      <div className="mt-5 flex gap-2">
        <input
          ref={field}
          id="profil"
          className={`field min-w-0 flex-1 ${bad ? '!border-red !bg-red-tint' : ''}`}
          value={link}
          onChange={(e) => onLink(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' || !link.trim()) return;
            e.preventDefault();
            onAdd();
          }}
          placeholder="linkedin.com/in/adin"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          aria-invalid={bad}
          aria-describedby="profil-note"
        />
        <button type="button" className="btn-line shrink-0" disabled={!link.trim()} onClick={onAdd}>
          Ekle
        </button>
      </div>
      <p id="profil-note" aria-live="polite" className={bad ? 'mt-2 text-[14px] font-bold text-red-lip' : 'hint'}>
        {bad
          ? url
            ? `Profil sayfanın tam adresini yaz${start ? `: ${start}adin gibi` : ''}.`
            : 'Bu bir bağlantıya benzemiyor. Profil sayfanın adresini yapıştır.'
          : ok
            ? id === 'web'
              ? 'Web siten olarak eklenir.'
              : `${PLATFORMS[id!].label} profilin olarak eklenir.`
            : 'Adresi yapıştır ya da aşağıdan bir yer seç.'}
      </p>
      {open.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {open.map((p) => (
            <button key={p} type="button" onClick={() => begin(PLATFORMS[p].start!)} className="chip !py-1.5 transition-colors hover:border-line-2 hover:bg-bg-2">
              <Plus className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
              {PLATFORMS[p].label}
            </button>
          ))}
        </div>
      )}
      {list.length > 0 && (
        <ul className="mt-5 space-y-2" aria-label="Eklenen profiller">
          {list.map((p) => (
            <li key={p.url} className="flex items-center gap-3 rounded-[14px] bg-bg-2 py-2 pl-4 pr-2">
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-black text-ink">{PLATFORMS[p.platform].label}</span>
                <a href={p.url} target="_blank" rel="noreferrer" className="block truncate text-[13px] font-bold text-ink-3 hover:underline">
                  {shortUrl(p.url)}
                </a>
              </span>
              <button type="button" onClick={() => onRemove(p.url)} aria-label={`${PLATFORMS[p.platform].label} bağlantısını kaldır`} className="btn-quiet btn-sm shrink-0 !min-h-10 !px-2.5">
                <X className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="hint">
        Profillerin Beyan olarak görünür; kurum, ilk temasa kadar onları da görmez.{' '}
        <Why title="Neden Doğrulandı değil?">{NO_PROOF}</Why>
      </p>
    </>
  );
}

export function WorkBody({
  first,
  title,
  url,
  onTitle,
  onUrl,
  skills,
  onSkill,
}: {
  first: boolean;
  title: string;
  url: string;
  onTitle: (v: string) => void;
  onUrl: (v: string) => void;
  skills: string[];
  onSkill: (k: string) => void;
}) {
  const [more, setMore] = useState(false);
  const clean = url.trim() ? normalizeUrl(url) : null;
  const bad = !!url.trim() && !clean;
  const id = clean ? platformOf(clean) : null;
  return (
    <>
      <Guide mood="talk">Bir iş yeter: bir çizim, bir video, bir çeviri ya da bir proje.</Guide>
      <h1 className="h-page mt-6">{first ? 'İlk eserin' : 'Eser ekle'}</h1>
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="eser" className="label">
            Ne yaptın?
          </label>
          <input id="eser" className="field" value={title} onChange={(e) => onTitle(e.target.value)} autoFocus placeholder="ör. Bir kafenin menüsü ve logosu" maxLength={90} enterKeyHint="next" />
        </div>
        <div>
          <label htmlFor="eser-link" className="label">
            Bağlantısı <span className="font-semibold text-ink-3">(isteğe bağlı)</span>
          </label>
          <input
            id="eser-link"
            className={`field ${bad ? '!border-red !bg-red-tint' : ''}`}
            value={url}
            onChange={(e) => onUrl(e.target.value)}
            placeholder="behance.net/gallery/…"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            aria-invalid={bad}
            aria-describedby="eser-link-note"
          />
          <p id="eser-link-note" aria-live="polite" className={bad ? 'mt-2 text-[14px] font-bold text-red-lip' : 'hint'}>
            {bad ? 'Bu bir bağlantıya benzemiyor; işin açıldığı sayfanın adresini yapıştır.' : id ? `${PLATFORMS[id].label} bağlantısıyla eklenir.` : 'Bağlantı yoksa kendi sözünle eklenir.'}
          </p>
        </div>
        <div role="group" aria-labelledby="eser-beceri">
          <p id="eser-beceri" className="label">
            Hangi becerileri gösteriyor?
          </p>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((k) => (
                <SkillChip key={k} k={k} on onToggle={onSkill} />
              ))}
            </div>
          ) : (
            <p className="hint !mt-0">Yazdıkça öneririm; listeden de seçebilirsin.</p>
          )}
          <button type="button" aria-expanded={more} onClick={() => setMore(!more)} className="btn-quiet btn-sm mt-2 !px-2">
            {more ? 'Listeyi kapat' : 'Listeden seç'}
          </button>
          {more && (
            <div className="mt-2">
              <SkillPicker value={skills} onToggle={onSkill} />
            </div>
          )}
        </div>
      </div>
      <p className="hint">
        Beyan olarak eklenir.{' '}
        <Why title="Bu iş nasıl güçlenir?">{NO_PROOF}</Why>
      </p>
    </>
  );
}
