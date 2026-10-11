// Kanıt bağla, the GitHub route: connect the app, the repositories found, proof that the
// account is yours (bio or gist) and a domain of your own (DNS TXT).

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, ExternalLink } from 'lucide-react';
import type { Person } from '../../../lib/types.ts';
import { XP } from '../../../lib/engine/progress.ts';
import { cleanDomain, MAX_REPOS, txtName, txtValue, VerifyError } from '../../../lib/verify.ts';
import { relTime } from '../../../lib/format.ts';
import { CountUp, Why } from '../../ui/kit';
import { CheckCircle, Flame, Star } from '../../ui/icons';
import { TriMark } from '../../ui/TriMark';
import { ERR_TITLE, type Scan } from './flow';
import { Guide } from './pieces';

// ---------------------------------------------------------------- 1 · user

/** One stop on the connect trail: a survey marker, then what happens there. */
function Stop({ n, state, title, children }: { n: number; state: 'done' | 'current' | 'next'; title: string; children?: ReactNode }) {
  return (
    <li className="relative flex gap-3.5">
      <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center" aria-hidden="true">
        {state === 'current' && <span className="ping-soft absolute left-1/2 top-[60%] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'rgb(var(--indigo) / 0.3)' }} />}
        {state === 'next' ? (
          <TriMark size={32} color="ink-4" variant="outline">
            <span className="num text-[12px] font-black text-ink-3">{n}</span>
          </TriMark>
        ) : (
          <TriMark size={state === 'current' ? 34 : 32} color={state === 'done' ? 'green' : 'indigo'} lip>
            {state === 'done' ? <Check className="h-3.5 w-3.5 text-white" strokeWidth={4.5} /> : <span className="num text-[12px] font-black text-white">{n}</span>}
          </TriMark>
        )}
      </span>
      <div className={`min-w-0 flex-1 pb-5 pt-1 ${state === 'next' ? 'opacity-60' : ''}`}>
        <p className="text-[17px] font-black leading-snug text-ink">{title}</p>
        {children}
      </div>
    </li>
  );
}

/** A small drawing of the repository choice on GitHub's install page, with the right option marked. */
function AccessSketch({ live }: { live: boolean }) {
  const row = (label: string, on: boolean) => (
    <span className={`flex items-center gap-2 rounded-[10px] px-2 py-1.5 ${on ? 'bg-indigo-tint' : ''}`}>
      <span className={`relative grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${on ? 'border-indigo' : 'border-line-2'}`}>
        {on && <span className="h-2 w-2 rounded-full bg-indigo" />}
        {on && live && <span className="ping-soft absolute inset-0 rounded-full" style={{ background: 'rgb(var(--indigo) / 0.35)' }} />}
      </span>
      <span className={`font-mono text-[12.5px] ${on ? 'font-bold text-indigo' : 'text-ink-3'}`}>{label}</span>
    </span>
  );
  return (
    <div className="mt-3 rounded-[14px] border-2 border-line bg-bg p-2.5" aria-hidden="true">
      <p className="px-2 pb-1 font-mono text-[12px] font-bold text-ink-2">Repository access</p>
      {row('All repositories', false)}
      {row('Only select repositories', true)}
      <span className="ml-8 mt-1 flex flex-wrap gap-1.5 pb-1">
        {['proje-1', 'ozel-proje'].map((r) => (
          <span key={r} className="inline-flex items-center gap-1 rounded-full border-2 border-line px-2 py-0.5 font-mono text-[11.5px] font-bold text-ink-2">
            <Check className="h-3 w-3 text-green" strokeWidth={4} />
            {r}
          </span>
        ))}
      </span>
    </div>
  );
}

export function ConnectBody({ reduce }: { reduce: boolean }) {
  return (
    <>
      <Guide mood="wave">Nirengi’yi GitHub’a bağla; kurumlara hangi depolarını göstereceğini orada sen seç.</Guide>
      <h1 className="h-page mt-6">GitHub’a bağlan</h1>

      <ol className="relative mt-5">
        <span
          className="absolute bottom-8 left-[16px] top-8 w-[3px] rounded-full"
          style={{ background: 'repeating-linear-gradient(to bottom, rgb(var(--line-2)) 0 4px, transparent 4px 10px)' }}
          aria-hidden="true"
        />
        <Stop n={1} state="current" title="GitHub’da Nirengi’yi kur">
          <p className="mt-0.5 text-[14px] font-bold text-ink-3">“GitHub’a bağlan” GitHub’ın kendi sayfasını açar; hesabını seçersin.</p>
        </Stop>
        <Stop n={2} state="next" title="Göstereceğin depoları seç">
          <p className="mt-0.5 text-[14px] font-bold text-ink-3">
            <b className="text-ink-2">Only select repositories</b>’i seçip kurumlara göstermek istediğin depoları işaretle. Özel depoların da olur.
          </p>
          <div className="hidden sm:block">
            <AccessSketch live={!reduce} />
          </div>
        </Stop>
        <Stop n={3} state="next" title="“Install”a bas, buraya dönersin">
          <p className="mt-0.5 text-[14px] font-bold text-ink-3">Depoların kendiliğinden gelir. Kopyalanacak kod ya da anahtar yok.</p>
        </Stop>
      </ol>

    </>
  );
}

/** Under the GitHub key: what Nirengi can see, and the other ways in (signed in before, a handle as Beyan, the example). */
export function ConnectOther({ onSignIn, onManual, canExample, onExample }: { onSignIn: () => void; onManual: () => void; canExample: boolean; onExample: () => void }) {
  const link = 'inline-flex min-h-10 items-center font-extrabold text-indigo underline-offset-2 hover:underline';
  return (
    <>
      <p className="hint !mt-0">
        Kodunu okumayız, hiçbir şeye yazamayız.{' '}
        <Why title="Nirengi neyi görür?">
          <div className="space-y-3 text-[16px] font-bold text-ink-2">
            <p>Yalnız işaretlediğin depoların adını, açıklamasını, dilini, yıldızını ve son güncelleme tarihini görür. Kod okuma ya da yazma izni istemez.</p>
            <p>Kullanıcı adını herkes yazabilir; Nirengi’yi bir hesaba ise yalnız o hesabın sahibi kurabilir. Bu yüzden seçtiğin depolar hemen Doğrulandı olur. Özel depoların kodu gizli kalır, kurumlar yalnız var olduğunu ve senin olduğunu görür.</p>
            <p>Giriş birkaç saat geçerlidir ve yalnız bu tarayıcıda durur. “Çıkış yap” onu GitHub’da da iptal eder. Depo seçimini ya da kurulumu GitHub ayarlarındaki Applications bölümünden istediğin an değiştirirsin.</p>
          </div>
        </Why>
      </p>
      <p className="mt-1 flex flex-wrap gap-x-5 text-[14px] font-bold text-ink-3">
        <button type="button" onClick={onSignIn} className={link}>
          Daha önce bağladım
        </button>
        <button type="button" onClick={onManual} className={link}>
          Kullanıcı adıyla dene (Beyan)
        </button>
        {canExample && (
          <button type="button" onClick={onExample} className={link}>
            Örnek profille gez
          </button>
        )}
      </p>
    </>
  );
}

export function UserBody({
  handle,
  onHandle,
  onBlur,
  showFormat,
  err,
  login,
  canExample,
  onExample,
}: {
  handle: string;
  onHandle: (v: string) => void;
  onBlur: () => void;
  showFormat: boolean;
  err: VerifyError | null;
  login: string;
  canExample: boolean;
  onExample: () => void;
}) {
  const bad = showFormat || !!err;
  return (
    <>
      <Guide mood="think">Kullanıcı adınla depolarını okurum; ama hesabın senin olduğunu bu göstermez, işlerin Beyan kalır.</Guide>
      <h1 className="h-page mt-6">GitHub kullanıcı adın</h1>
      <label htmlFor="gh" className="sr-only">
        GitHub kullanıcı adı
      </label>
      <div
        className={`mt-5 flex items-center rounded-[14px] border-2 transition-[border-color,background-color,box-shadow] duration-150 focus-within:shadow-[0_0_0_4px_rgb(var(--indigo)/0.14)] ${
          bad ? 'border-red bg-red-tint' : 'border-line bg-bg-2 focus-within:border-indigo focus-within:bg-bg'
        }`}
      >
        <span className="pl-4 text-[16px] font-bold text-ink-3">github.com/</span>
        <input
          id="gh"
          value={handle}
          onChange={(e) => onHandle(e.target.value)}
          onBlur={onBlur}
          autoFocus
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="username"
          enterKeyHint="go"
          placeholder="kullanici-adi"
          aria-invalid={bad}
          aria-describedby="gh-note"
          className="min-w-0 flex-1 bg-transparent py-3.5 pl-1 pr-4 text-[18px] font-black text-ink outline-none placeholder:font-bold placeholder:text-ink-4"
        />
      </div>
      <div id="gh-note" aria-live="polite">
        {showFormat ? (
          <p className="mt-2 text-[14px] font-bold text-red-lip">Kullanıcı adı harf, rakam ve tireden oluşur; tireyle başlayıp bitemez, en çok 39 karakter.</p>
        ) : err ? (
          <div className="mt-3 rounded-[16px] bg-red-tint p-4" role="alert">
            <p className="text-[15px] font-black text-red-lip">{ERR_TITLE[err.kind]}</p>
            <p className="mt-1 text-[14px] font-bold text-red-lip">{err.kind === 'notfound' ? `GitHub’da “${login}” diye bir hesap yok. Yazımı kontrol et.` : err.message}</p>
            {canExample && (err.kind === 'ratelimit' || err.kind === 'network') && (
              <>
                <button type="button" onClick={onExample} className="btn-line btn-block mt-3">
                  Örnek profille devam et
                </button>
                <p className="mt-2 text-[13px] font-bold text-ink-3">Örnek veri kurgusaldır: gerçek hesabına bağlanmaz, her şey Beyan düzeyinde kalır.</p>
              </>
            )}
          </div>
        ) : (
          <p className="hint">Herkese açık GitHub verisi okunur. Doğrulandı düzeyi için Nirengi’yi GitHub’a bağlaman gerekir.</p>
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------- 2 · found

export function FoundBody({
  scan,
  stage,
  included,
  reduce,
  onToggle,
  onChange,
}: {
  scan: Scan | null;
  stage: string;
  included: Set<string>;
  reduce: boolean;
  onToggle: (name: string) => void;
  onChange: () => void;
}) {
  if (!scan)
    return (
      <>
        <Guide mood="think">Hesabına bakıyorum, bu birkaç saniye sürer.</Guide>
        <h1 className="h-page mt-6">Bulduklarımız</h1>
        <p role="status" className="mt-2 text-[15px] font-bold text-ink-3">
          {stage}
        </p>
        <ul className="mt-5 space-y-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="h-[68px] animate-pulse rounded-[18px] bg-bg-3" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </ul>
      </>
    );

  const n = scan.repos.length;
  return (
    <>
      <Guide mood={n ? 'happy' : 'think'}>
        {!n
          ? 'Hesabında özgün bir depo göremedim.'
          : scan.granted
            ? 'GitHub’da seçtiğin depolar burada. Kurumlara göstermek istediklerini işaretle.'
            : 'Bunları buldum! Profiline eklemek istediklerini seç.'}
      </Guide>
      <h1 className="mt-6 flex items-end gap-3" aria-label={`${n} eserin bulundu`}>
        <span className="num text-[64px] font-black leading-[0.9] text-indigo" aria-hidden="true">
          <CountUp value={n} />
        </span>
        <span className="h-page pb-1" aria-hidden="true">
          eserin bulundu
        </span>
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] font-bold text-ink-3">
        <span>@{scan.user.login}</span>
        {scan.offline && <span className="pill bg-bg-3 text-ink-2">Örnek veri</span>}
        <button type="button" onClick={onChange} className="rounded-full px-2 py-0.5 text-[13px] font-extrabold text-indigo transition-colors hover:bg-indigo-tint">
          Değiştir
        </button>
      </div>
      {scan.offline && <p className="mt-3 rounded-[14px] bg-bg-2 px-4 py-3 text-[14px] font-bold text-ink-2">Bu bir örnek profil: gerçek hesap değil, doğrulama yapılmaz ve her şey Beyan düzeyinde kalır.</p>}

      {scan.days && (
        <div className="card mt-4 flex items-center gap-3 p-4">
          <Flame size={34} />
          <p className="min-w-0 flex-1 text-[16px] font-extrabold text-ink">
            Son 90 günde{' '}
            <b className="num text-[22px] text-orange-ink">
              <CountUp value={scan.days.length} />
            </b>{' '}
            aktif gün
          </p>
          <Why title="Aktif gün nasıl sayılıyor?">
            <div className="space-y-3 text-[16px] font-bold text-ink-2">
              <p>Son 90 günün herkese açık GitHub etkinliğine baktık. Push, pull request ya da sürüm (release) olan her gün bir aktif gündür.</p>
              <p>Commit sayısını, satır sayısını ya da yıldızı saymıyoruz: bir gün ya üretim vardır ya yoktur.</p>
              <p>Her aktif gün haftalık ilerlemene yazılır ve {XP.activeDay} XP kazandırır. Özel depolardaki işin görünmez; GitHub herkese açık olayları en fazla 90 gün geriye ve yaklaşık 300 olayla verir.</p>
            </div>
          </Why>
        </div>
      )}
      {!scan.days && !scan.offline && <p className="mt-4 text-[14px] font-bold text-ink-3">Etkinlik geçmişini okuyamadık; depoların yine de eklenebilir.</p>}

      {n > 0 && (
        <ul className="mt-5 space-y-3">
          {scan.repos.map((r, i) => {
            const on = included.has(r.name);
            return (
              <motion.li
                key={r.name}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : i * 0.05, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => onToggle(r.name)}
                  className={`card-press flex w-full items-center gap-3 p-3.5 text-left ${on ? '!border-indigo !bg-indigo-tint' : ''}`}
                  style={on ? { boxShadow: '0 4px 0 rgb(var(--indigo) / 0.5)' } : undefined}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors ${on ? 'border-indigo bg-indigo text-white' : 'border-line-2 bg-bg text-transparent'}`}>
                    <Check className="h-4 w-4" strokeWidth={4} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-[16px] font-black text-ink">{r.name}</span>
                      {r.private && <span className="pill shrink-0 bg-bg-3 !px-2 !py-0 text-[12px] text-ink-2">Özel</span>}
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] font-bold text-ink-3">
                      {r.language && <span>{r.language}</span>}
                      <span className="inline-flex items-center gap-1">
                        <Star size={14} />
                        <span className="num">{r.stargazers_count.toLocaleString('tr-TR')}</span>
                      </span>
                      <span>{relTime(r.pushed_at)} güncellendi</span>
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      )}
      <p className="hint">
        {n > 0 ? `${included.size}/${n} seçili. ` : 'Fork ve arşivlenmiş depolar sayılmaz. '}
        <Why title="Eserler nasıl seçiliyor?">
          <div className="space-y-3 text-[16px] font-bold text-ink-2">
            <p>Herkese açık {scan.user.public_repos} deponun içinden fork ve arşivlenmiş olanları çıkarıyoruz.</p>
            <p>Kalanları yıldız sayısı, fork sayısı ve son güncellemenin yeniliğine göre sıralayıp en güçlü {MAX_REPOS} tanesini gösteriyoruz.</p>
            <p>Seçmediğin eser profiline eklenmez. Hesabını kanıtlayana kadar eklenenler Beyan düzeyinde durur.</p>
          </div>
        </Why>
      </p>
    </>
  );
}

// ---------------------------------------------------------------- 4 · prove

function Mini({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="num grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-tint text-[14px] font-black text-indigo">{n}</span>
      <div className="min-w-0 flex-1 pt-0.5 text-[15px] font-bold text-ink-2">{children}</div>
    </li>
  );
}

function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="btn-line btn-sm mt-2">
      {children}
      <ExternalLink className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
    </a>
  );
}

export function ProveBody({ me, code, tab, onTab, proven, copied, onCopy }: { me?: Person; code: string; tab: 'bio' | 'gist'; onTab: (t: 'bio' | 'gist') => void; proven: boolean; copied: boolean; onCopy: () => void }) {
  if (proven)
    return (
      <>
        <Guide mood="happy">Hesabın doğrulanmış, burada yapacak bir şey kalmadı.</Guide>
        <h1 className="h-page mt-6">Sahipliğini kanıtla</h1>
        <div className="card mt-5 flex items-center gap-4 p-5">
          <CheckCircle size={48} />
          <div className="min-w-0">
            <p className="text-[18px] font-black text-ink">Hesabın doğrulandı</p>
            <p className="text-[14px] font-bold text-ink-3">@{me?.links.github} işleri Doğrulandı düzeyinde.</p>
          </div>
        </div>
      </>
    );
  return (
    <>
      <Guide mood="think">Bu hesabın senin olduğunu göster; doğrulanmış iş beyandan daha ağır sayılır.</Guide>
      <h1 className="h-page mt-6">Sahipliğini kanıtla</h1>
      <div className="mt-5 rounded-[18px] border-2 border-dashed border-line-2 bg-bg-2 p-5 text-center">
        <code className="block break-all font-mono text-[26px] font-black tracking-wide text-ink">{code}</code>
        <button type="button" onClick={onCopy} className="btn-line btn-sm mt-3">
          {copied ? <Check className="h-4 w-4" strokeWidth={3.5} /> : <Copy className="h-4 w-4" strokeWidth={3} />}
          {copied ? 'Kopyalandı' : 'Kopyala'}
        </button>
      </div>

      <div className="seg mt-6" role="group" aria-label="Kodu nereye koyacaksın?">
        {(['bio', 'gist'] as const).map((t) => (
          <button key={t} type="button" aria-pressed={tab === t} onClick={() => onTab(t)}>
            {t === 'bio' ? 'Bio’ya koy' : 'Gist’e koy'}
          </button>
        ))}
      </div>
      <ol className="mt-5 space-y-4">
        {tab === 'bio' ? (
          <>
            <Mini n={1}>
              GitHub profil ayarlarını aç.
              <br />
              <ExtLink href="https://github.com/settings/profile">Profil ayarları</ExtLink>
            </Mini>
            <Mini n={2}>Bio alanına kodu yapıştır. Metnin neresinde olduğu fark etmez.</Mini>
            <Mini n={3}>“Update profile”a bas, buraya dön ve “Kontrol et”e dokun.</Mini>
          </>
        ) : (
          <>
            <Mini n={1}>
              Yeni bir gist aç.
              <br />
              <ExtLink href="https://gist.github.com">Gist sayfası</ExtLink>
            </Mini>
            <Mini n={2}>Açıklama alanına kodu yapıştır. Dosya adına yazman da yeter.</Mini>
            <Mini n={3}>“Create public gist” ile kaydet. Gizli gist görünmez, sayılmaz.</Mini>
          </>
        )}
      </ol>
      <p className="hint">
        Parola ya da token istemiyoruz; doğruladıktan sonra kodu silebilirsin.{' '}
        <Why title="Bu nasıl çalışıyor?">
          <div className="space-y-3 text-[16px] font-bold text-ink-2">
            <p>Kodu yalnızca hesabın sahibi bio’ya ya da herkese açık bir gist’e yazabilir. Biz de GitHub’ın herkese açık API’siyle bakıp kodu bulursak hesabın senin olduğunu kabul ederiz.</p>
            <p>Doğrulanınca eklediğin depolar Beyan’dan Doğrulandı düzeyine çıkar; her biri {XP.evidence} XP kazandırır (günlük sınır {XP.dailyCap} XP).</p>
          </div>
        </Why>
      </p>
    </>
  );
}

// ---------------------------------------------------------------- 5 · domain

function CopyRow({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-extrabold text-ink-3">{label}</p>
        <p className="break-all font-mono text-[14px] font-bold text-ink">{value}</p>
      </div>
      <button type="button" onClick={onCopy} aria-label={`${label} kopyala`} className="btn-line btn-sm shrink-0 !px-3">
        {copied ? <Check className="h-4 w-4" strokeWidth={3.5} /> : <Copy className="h-4 w-4" strokeWidth={3} />}
      </button>
    </div>
  );
}

export function DomainBody({ me, domain, onDomain, code, copied, onCopy }: { me?: Person; domain: string; onDomain: (v: string) => void; code: string; copied: string | null; onCopy: (text: string, key: string) => void }) {
  if (me?.links.domain)
    return (
      <>
        <Guide mood="happy">Alan adın da doğrulanmış. Güzel!</Guide>
        <h1 className="h-page mt-6">Alan adın var mı?</h1>
        <div className="card mt-5 flex items-center gap-4 p-5">
          <CheckCircle size={48} />
          <div className="min-w-0">
            <p className="truncate text-[18px] font-black text-ink">{me.links.domain}</p>
            <p className="text-[14px] font-bold text-ink-3">DNS kaydıyla doğrulandı.</p>
          </div>
        </div>
      </>
    );
  const ready = cleanDomain(domain).includes('.');
  return (
    <>
      <Guide mood="idle">Bir alan adın varsa onu da kanıtlayabilirsin. Yoksa geç, sorun değil.</Guide>
      <h1 className="h-page mt-6">Alan adın var mı?</h1>
      <label htmlFor="dom" className="sr-only">
        Alan adı
      </label>
      <input
        id="dom"
        className="field mt-5 !text-[18px] !font-black"
        value={domain}
        onChange={(e) => onDomain(e.target.value)}
        placeholder="ornek.dev"
        inputMode="url"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="go"
      />
      {ready ? (
        <div className="mt-4 space-y-4 rounded-[18px] border-2 border-dashed border-line-2 bg-bg-2 p-4">
          <p className="text-[15px] font-bold text-ink-2">DNS panelinde şu TXT kaydını ekle, sonra “Kontrol et”e dokun.</p>
          <CopyRow label="Ad" value={txtName(domain)} copied={copied === 'dns-name'} onCopy={() => onCopy(txtName(domain), 'dns-name')} />
          <CopyRow label="Değer" value={txtValue(code)} copied={copied === 'dns-value'} onCopy={() => onCopy(txtValue(code), 'dns-value')} />
        </div>
      ) : (
        <p className="hint">Alan adını yaz, eklemen gereken kaydı gösterelim.</p>
      )}
      <p className="hint">
        Google ve Cloudflare’in DNS-over-HTTPS hizmetlerinden sorgulanır; DNS değişikliği birkaç dakika sürebilir.{' '}
        <Why title="Neden TXT kaydı?">
          <p className="text-[16px] font-bold text-ink-2">Bir alan adının DNS kayıtlarını yalnızca sahibi değiştirebilir. Kaydı görürsek alan adının senin olduğunu kabul ederiz; doğrulanınca {XP.evidence} XP kazanırsın.</p>
        </Why>
      </p>
    </>
  );
}
