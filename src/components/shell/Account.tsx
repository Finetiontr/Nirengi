// The genç account in the shell: who is connected, and the way out. With no GitHub
// account connected it leads to Kanıt bağla, where the visitor connects the GitHub App.

import { LogOut } from 'lucide-react';
import { useAppState, useView } from '../../lib/store.ts';
import { signOut } from '../../lib/auth.ts';
import { feedback } from '../ui/kit';
import { GitHub } from '../ui/icons';
import { Avatar } from '../ui/primitives';

export default function Account({ compact = false }: { compact?: boolean }) {
  const me = useAppState().people.find((p) => p.isDemoUser);
  if (useView().persona === 'org') return null;

  if (!me?.links.github) {
    const cls = compact
      ? 'flex w-full items-center gap-2 rounded-[12px] px-3 py-2 text-left text-[15px] font-extrabold text-ink-2 hover:bg-bg-2'
      : 'btn-line btn-sm btn-block !justify-start';
    const inner = (
      <>
        <GitHub size={20} />
        GitHub’ı bağla
      </>
    );
    return (
      <a href="/kanit-bagla" className={cls}>
        {inner}
      </a>
    );
  }

  const leave = () => {
    signOut();
    feedback({ tone: 'info', title: 'Çıkış yaptın', text: 'GitHub bağlantın kapatıldı; örnek profille geziyorsun.' });
  };
  const who = (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <Avatar person={me} size={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-black leading-tight text-ink">{me.name}</p>
        <p className="truncate text-[12.5px] font-bold text-ink-3">@{me.links.github}</p>
      </div>
    </div>
  );
  const out = (
    <>
      <LogOut className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
      Çıkış yap
    </>
  );
  // The phone menu has the width for one row; the sidebar puts the key under the name.
  if (compact)
    return (
      <div className="flex items-center gap-2 px-3 py-1">
        {who}
        <button type="button" onClick={leave} className="btn-quiet btn-sm shrink-0 !min-h-10 !px-2.5 !text-[13px] !text-ink-3 hover:!text-red-lip">
          {out}
        </button>
      </div>
    );
  return (
    <div className="rounded-[14px] border-2 border-line p-2.5">
      {who}
      <button type="button" onClick={leave} className="btn-quiet btn-sm btn-block mt-2 !min-h-9 !text-[13px] !text-ink-3 hover:!text-red-lip">
        {out}
      </button>
    </div>
  );
}
