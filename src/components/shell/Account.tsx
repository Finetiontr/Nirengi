// The genç account in the shell: who is connected, and the way out. With no profile yet
// it leads to Kanıt bağla, where the visitor starts from GitHub or from work kept elsewhere.

import { LogOut, UserPlus } from 'lucide-react';
import { useAppState, useView } from '../../lib/store.ts';
import { signOut } from '../../lib/auth.ts';
import { feedback } from '../ui/kit';
import { Avatar } from '../ui/primitives';

export default function Account() {
  const me = useAppState().people.find((p) => p.isDemoUser);
  if (useView().persona === 'org') return null;

  if (!me) {
    return (
      <a href="/kanit-bagla" className="flex w-full items-center gap-2 rounded-[12px] px-3 py-2 text-left text-[15px] font-extrabold text-ink-2 hover:bg-bg-2">
        <UserPlus className="h-5 w-5" strokeWidth={2.75} aria-hidden="true" />
        Profilini kur
      </a>
    );
  }

  const leave = () => {
    const text = me.links.github ? 'GitHub bağlantın kapatıldı; örnek profille geziyorsun.' : 'Profilin bu tarayıcıdan silindi; örnek profille geziyorsun.';
    signOut();
    feedback({ tone: 'info', title: 'Çıkış yaptın', text });
  };
  const who = (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <Avatar person={me} size={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-black leading-tight text-ink">{me.name}</p>
        <p className="truncate text-[12.5px] font-bold text-ink-3">{me.links.github ? `@${me.links.github}` : me.example ? 'Örnek profil' : me.headline}</p>
      </div>
    </div>
  );
  // The menu has the width for one row: who, and the way out beside it.
  return (
    <div className="flex items-center gap-2 px-3 py-1">
      {who}
      <button type="button" onClick={leave} className="btn-quiet btn-sm shrink-0 !min-h-10 !px-2.5 !text-[13px] !text-ink-3 hover:!text-red-lip">
        <LogOut className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
        Çıkış yap
      </button>
    </div>
  );
}
