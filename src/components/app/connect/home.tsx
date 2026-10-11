// Kanıt bağla, around the walk: the weekly goal, the done screen and the home a returning
// person sees.

import { ChevronRight, LogOut } from 'lucide-react';
import type { Person, State, WeeklyGoal } from '../../../lib/types.ts';
import { progress } from '../../../lib/engine/progress.ts';
import { appReady, getToken, manageUrl } from '../../../lib/auth.ts';
import { PLATFORMS } from '../../../lib/platforms.ts';
import { Head, WeekDots, Why } from '../../ui/kit';
import { Flame } from '../../ui/icons';
import { Avatar } from '../../ui/primitives';
import { GOALS, countBy, hasGhBeyan, isExample, isGhVerified } from './flow';
import { Guide, LEVEL_WHY, LevelCounts } from './pieces';

// ---------------------------------------------------------------- 3 · goal

export function GoalBody({ goal, onGoal, days, offline }: { goal: WeeklyGoal; onGoal: (g: WeeklyGoal) => void; days: string[] | null; offline: boolean }) {
  const avg = days && !offline ? (days.length / (90 / 7)).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) : null;
  return (
    <>
      <Guide mood="idle">Haftada kaç gün üretmek istersin? İstediğin zaman değiştirebilirsin.</Guide>
      <h1 className="h-page mt-6">Haftalık hedefin</h1>
      <div className="mt-5 space-y-3" role="radiogroup" aria-label="Haftalık hedef">
        {GOALS.map((o) => {
          const on = o.g === goal;
          return (
            <button
              key={o.g}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onGoal(o.g)}
              className={`card-press flex w-full items-center gap-4 p-4 text-left ${on ? '!border-indigo !bg-indigo-tint' : ''}`}
              style={on ? { boxShadow: '0 4px 0 rgb(var(--indigo) / 0.5)' } : undefined}
            >
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-[16px] ${on ? 'bg-indigo text-white' : 'bg-bg-3 text-ink-3'}`}>
                <span className="num text-[26px] font-black leading-none">{o.g}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-[18px] font-black ${on ? 'text-indigo' : 'text-ink'}`}>
                  {o.name} <span className="text-[14px] font-extrabold text-ink-3">· haftada {o.g} gün</span>
                </span>
                <span className="block text-[14px] font-bold text-ink-3">{o.text}</span>
                <span className="mt-2 flex gap-1.5" aria-hidden="true">
                  {Array.from({ length: 7 }, (_, i) => (
                    <span key={i} className={`h-2.5 w-2.5 rounded-full ${i < o.g ? 'bg-orange' : 'bg-line-2'}`} />
                  ))}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="hint">
        Düşürmek ceza değildir; seri yalnız hedefini tutturduğun haftaları sayar.
        {avg && (
          <>
            {' '}
            Son 90 günde haftada ortalama {avg} aktif gün üretmişsin.{' '}
            <Why title="Ortalama nasıl çıktı?">
              <p className="text-[16px] font-bold text-ink-2">
                Son 90 gün yaklaşık 12,9 hafta. {days!.length} aktif günü bu haftalara böldük. Bu yalnızca herkese açık GitHub etkinliğinden gelir; hedef seçimini bağlamaz.
              </p>
            </Why>
          </>
        )}
      </p>
    </>
  );
}

// ---------------------------------------------------------------- 6 · done

export function DoneBody({ s, me }: { s: State; me?: Person }) {
  if (!me) return null;
  const p = progress(s, me);
  return (
    <>
      <Guide mood="cheer">Hazırsın! İşlerin profiline eklendi.</Guide>
      <h1 className="h-page mt-6">Hepsi tamam</h1>
      <section className="mt-6">
        <Head title="Profiline eklenenler" action={<Why title="Düzeyler ne anlama geliyor?">{LEVEL_WHY}</Why>} />
        <div className="mt-3">
          <LevelCounts me={me} />
        </div>
        {isExample(me) ? (
          <p className="hint">Örnek profil: kimsenin gerçek hesabı değil, her şey Beyan düzeyinde. Kendi profilini istediğin zaman kurabilirsin.</p>
        ) : (
          !countBy(me, 'S2') &&
          !countBy(me, 'S3') && <p className="hint">İşlerin şimdilik Beyan. Bir kurumla yaptığın deneme projesinde onaylanan her aşama profiline Kurum onaylı olarak eklenir.</p>
        )}
      </section>
      <section className="card mt-6 p-5" aria-labelledby="hafta">
        <h2 id="hafta" className="h-sec">
          Bu hafta
        </h2>
        <div className="mt-4">
          <WeekDots days={p.days} />
        </div>
        <p className="mt-4 text-[15px] font-bold text-ink-3">
          {p.met ? `Haftanın hedefi tamam: ${p.active}/${p.goal} gün.` : `Hedefin haftada ${p.goal} gün; şu ana kadar ${p.active} gün üretim var.`} Kaç kez değil, üretim yaptığın gün sayılır.
        </p>
      </section>
    </>
  );
}

// ---------------------------------------------------------------- home

function Row({ title, sub, onClick, accent }: { title: string; sub: string; onClick: () => void; accent?: boolean }) {
  return (
    <li>
      <button type="button" onClick={onClick} className={`card-press flex w-full items-center gap-4 p-4 text-left ${accent ? '!border-indigo !bg-indigo-tint' : ''}`}>
        <span className="min-w-0 flex-1">
          <span className={`block text-[17px] font-black ${accent ? 'text-indigo' : 'text-ink'}`}>{title}</span>
          <span className="block text-[14px] font-bold text-ink-3">{sub}</span>
        </span>
        <ChevronRight className="h-6 w-6 shrink-0 text-ink-3" strokeWidth={3} aria-hidden="true" />
      </button>
    </li>
  );
}

export function HomeBody({
  s,
  me,
  onRescan,
  onOpen,
  onStart,
  onConnect,
  onSignIn,
  onSignOut,
}: {
  s: State;
  me?: Person;
  onRescan: () => void;
  onOpen: (step: 'work' | 'profiles' | 'domain') => void;
  onStart: () => void;
  onConnect: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  if (!me) return null;
  const p = progress(s, me);
  const granted = !!getToken();
  const example = isExample(me);
  const gh = me.links.github;
  const profiles = me.profiles ?? [];
  return (
    <>
      <Guide mood="idle">{example ? 'Örnek profille geziyorsun. Kendi işlerinle başlamak bir dakika sürer.' : 'Profilin burada. Yeni bir eser, profil ya da alan adı ekleyebilirsin.'}</Guide>
      <h1 className="h-page mt-6">Hesabın</h1>
      <section className="card mt-5 flex items-center gap-4 p-4">
        <Avatar person={me} size={52} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[18px] font-black text-ink">{me.name}</p>
          <p className="truncate text-[14px] font-bold text-ink-3">
            {gh ? `@${gh}` : example ? 'Örnek profil' : me.headline}
            {me.links.domain ? ` · ${me.links.domain}` : ''}
          </p>
        </div>
        <span className="chip shrink-0">
          <Flame size={16} dim={!p.streak} />
          <span className="num">{p.streak}</span> hafta
        </span>
      </section>
      <div className="mt-4">
        <LevelCounts me={me} />
      </div>
      {example && <p className="hint">Örnek profil: kimsenin gerçek hesabı değil, her şey Beyan düzeyinde.</p>}
      <ul className="mt-6 space-y-3">
        {example && <Row accent title="Kendi profilini kur" sub="Kodun GitHub’da ya da işin LinkedIn, Behance, ArtStation’da: oradan başla." onClick={onStart} />}
        {hasGhBeyan(me) && appReady() && <Row accent title="GitHub’a bağlan" sub="İşlerin Beyan düzeyinde; Nirengi’yi GitHub’a bağlayınca seçtiğin depolar Doğrulandı olur." onClick={onConnect} />}
        {!granted && isGhVerified(me) && appReady() && <Row accent title="GitHub ile yeniden gir" sub="Giriş süren doldu; özel depolarını yeniden okumak için tek dokunuş." onClick={onSignIn} />}
        <Row title="Eser ekle" sub="Bir çizim, video, çeviri ya da proje; bağlantısıyla ya da kendi sözünle." onClick={() => onOpen('work')} />
        <Row
          title="Profillerin"
          sub={profiles.length ? profiles.map((x) => PLATFORMS[x.platform].label).join(', ') : 'LinkedIn, Behance, ArtStation ya da işini gösterdiğin her yer.'}
          onClick={() => onOpen('profiles')}
        />
        {gh && <Row title="Depolarını güncelle" sub={granted ? 'Yeni depoları ve son 90 günün etkinliğini oku.' : 'Herkese açık depoları yeniden oku.'} onClick={onRescan} />}
        {granted && <Row title="Depo seçimini değiştir" sub="GitHub’da depo ekle ya da çıkar, sonra “Depolarını güncelle”." onClick={() => window.open(manageUrl(), '_blank', 'noreferrer')} />}
        <Row title="Alan adı" sub={me.links.domain ? `${me.links.domain} doğrulandı. Değiştirmek için dokun.` : 'Kendi siten varsa DNS kaydıyla kanıtla; Doğrulandı düzeyinde eklenir.'} onClick={() => onOpen('domain')} />
        {!gh && !example && <Row title="GitHub’ı bağla" sub="Kod da yazıyorsan seçtiğin depolar Doğrulandı düzeyinde eklenir." onClick={onConnect} />}
      </ul>
      <button type="button" onClick={onSignOut} className="btn-quiet mt-6 !text-red-lip">
        <LogOut className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
        Çıkış yap
      </button>
      <p className="hint !mt-1">
        {gh
          ? `@${gh} bağlantısı ve bu tarayıcıdaki ilerlemen silinir; örnek profile dönersin.`
          : example
            ? 'Örnek profil ve bu tarayıcıdaki ilerlemen silinir.'
            : 'Profilin ve bu tarayıcıdaki ilerlemen silinir; örnek profile dönersin.'}
      </p>
    </>
  );
}
