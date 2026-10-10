// "Uygulamayı yükle" wherever the site asks for it: the landing, the closing band, the app menu
// and /uygulama. Where the browser has its own install prompt the key raises it; elsewhere it
// opens the steps for that browser (iPhone Safari, a browser inside another app, a menu), and
// on a computer without a prompt it shows the QR code that opens /uygulama on the phone.
// Running from the home screen, none of this renders.

import { useState, type ReactNode } from 'react';
import { Check, Download, EllipsisVertical, Ellipsis, Share, SquarePlus } from 'lucide-react';
import { promptInstall, useInstallWay, type InstallWay } from '../../lib/install.ts';
import { feedback, Sheet } from '../ui/kit';
import { Tri } from '../ui/pafta';

type Variant = 'primary' | 'band' | 'menu';

const KEY: Record<Variant, string> = {
  primary: 'btn-primary btn-lg btn-block',
  band: 'inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[12px] bg-white px-7 text-[17px] font-bold text-indigo transition-transform duration-100 active:translate-y-[3px] sm:w-auto',
  menu: 'flex w-full items-center gap-2 rounded-[12px] px-3 py-2 text-left text-[15px] font-extrabold text-ink-2 hover:bg-bg-2',
};

/** Run the install for this browser: its own prompt, or the steps. Returns true when steps should open. */
async function start(way: InstallWay): Promise<boolean> {
  if (way === 'done') {
    feedback({ tone: 'good', title: 'nirengi yüklü', text: 'Ana ekranındaki ya da uygulamalarındaki nirengi simgesinden aç.' });
    return false;
  }
  if (way !== 'prompt') return true;
  const choice = await promptInstall();
  if (choice === 'accepted') feedback({ tone: 'good', title: 'Yükleniyor', text: 'nirengi birazdan ana ekranında olur; oradan açınca tam ekran çalışır.' });
  return choice === null;
}

export default function InstallKey({ variant = 'primary', label = 'Uygulamayı yükle' }: { variant?: Variant; label?: string }) {
  const way = useInstallWay();
  const [steps, setSteps] = useState(false);
  if (way === 'app') return null;
  const done = way === 'done';
  return (
    <>
      <button
        type="button"
        className={KEY[variant]}
        style={variant === 'band' ? { boxShadow: '0 3px 0 rgb(255 255 255 / 0.45)' } : undefined}
        onClick={async () => setSteps(await start(way))}
      >
        {done ? <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" /> : <Download className="h-5 w-5" strokeWidth={3} aria-hidden="true" />}
        {done ? 'Yüklendi' : label}
      </button>
      <Sheet open={steps} onClose={() => setSteps(false)} title={way === 'desktop' ? 'Telefonuna yükle' : 'Ana ekranına ekle'}>
        <InstallSteps way={way} />
      </Sheet>
    </>
  );
}

/** A browser control drawn the way the person will see it, so the step can say "this one". */
function Control({ children, label }: { children: ReactNode; label: string }) {
  return (
    <span className="mx-0.5 inline-flex h-7 min-w-7 translate-y-[-1px] items-center justify-center rounded-[8px] border-2 border-line bg-bg-2 px-1 align-middle text-ink-2" role="img" aria-label={label}>
      {children}
    </span>
  );
}

const ICON = 'h-4 w-4';

const STEPS: Record<'ios' | 'inapp' | 'menu', { title: ReactNode; sub: ReactNode }[]> = {
  ios: [
    {
      title: (
        <>
          Safari’de Paylaş’a dokun{' '}
          <Control label="Paylaş">
            <Share className={ICON} strokeWidth={2.75} />
          </Control>
        </>
      ),
      sub: (
        <>
          Alttaki çubukta ya da{' '}
          <Control label="Daha fazla">
            <Ellipsis className={ICON} strokeWidth={2.75} />
          </Control>{' '}
          menüsünün içinde durur.
        </>
      ),
    },
    {
      title: (
        <>
          Ana Ekrana Ekle’yi seç{' '}
          <Control label="Ana Ekrana Ekle">
            <SquarePlus className={ICON} strokeWidth={2.75} />
          </Control>
        </>
      ),
      sub: 'Listede görmüyorsan aşağı kaydır.',
    },
    { title: 'Sağ üstte Ekle’ye dokun', sub: 'nirengi ana ekranında belirir; oradan açınca tam ekran çalışır.' },
  ],
  inapp: [
    {
      title: (
        <>
          Sağ üstteki menüye dokun{' '}
          <Control label="Menü">
            <Ellipsis className={ICON} strokeWidth={2.75} />
          </Control>
        </>
      ),
      sub: 'Bu sayfa başka bir uygulamanın içinde açıldı; oradan yükleme yapılamıyor.',
    },
    { title: 'Tarayıcıda aç’ı seç', sub: 'Safari ya da Chrome’da açılır.' },
    { title: 'Orada Uygulamayı yükle’ye dokun', sub: 'nirengi ana ekranına eklenir.' },
  ],
  menu: [
    {
      title: (
        <>
          Tarayıcının menüsüne dokun{' '}
          <Control label="Menü">
            <EllipsisVertical className={ICON} strokeWidth={2.75} />
          </Control>
        </>
      ),
      sub: 'Genellikle sağ üstte ya da sağ altta durur.',
    },
    { title: 'Uygulamayı yükle’yi seç', sub: 'Bazı tarayıcılarda adı Ana ekrana ekle.' },
    { title: 'Yükle’ye dokun', sub: 'nirengi ana ekranında ve uygulamalarında belirir.' },
  ],
};

/** The steps for this browser, as survey markers on a short trail; on a computer, the QR code. */
export function InstallSteps({ way }: { way: InstallWay }) {
  if (way === 'desktop' || way === 'prompt') return <QrBlock big />;
  if (way === 'app' || way === 'done') return null;
  return (
    <ol className="space-y-4">
      {STEPS[way].map((s, i) => (
        <li key={i} className="flex items-start gap-4">
          <span className="shrink-0">
            <Tri size={40} tone="indigo">
              <span className="text-[15px] font-black leading-none text-white">{i + 1}</span>
            </Tri>
          </span>
          <span className="min-w-0 pt-0.5">
            <span className="block text-[17px] font-black leading-snug text-ink">{s.title}</span>
            <span className="mt-0.5 block text-[14px] font-bold text-ink-3">{s.sub}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/** The QR code that opens /uygulama on a phone. It stays dark on white in both themes, so cameras read it. */
export function QrBlock({ big = false, onBand = false }: { big?: boolean; onBand?: boolean }) {
  const size = big ? 200 : 112;
  return (
    <div className={`flex items-center gap-4 ${big ? 'flex-col text-center' : ''}`}>
      <img src="/pwa/qr.svg" width={size} height={size} alt="nirengi uygulamasını açan QR kodu" className={`shrink-0 rounded-[14px] bg-white p-1.5 ${onBand ? '' : 'border-2 border-line'}`} />
      <div className="min-w-0">
        <p className={`font-black leading-tight ${big ? 'text-[19px]' : 'text-[17px]'} ${onBand ? 'text-white' : 'text-ink'}`}>Telefonunun kamerasıyla okut</p>
        <p className={`mt-1 text-[14px] font-bold ${onBand ? 'text-white/80' : 'text-ink-3'}`}>Açılan sayfada Uygulamayı yükle’ye dokun. Mağaza gerekmez.</p>
      </div>
    </div>
  );
}

const onPhone = () => typeof navigator !== 'undefined' && (/Android|iPhone|iPad|iPod|Mobi/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1));

/** The landing on a computer: the QR code for the phone, and this computer's own install where the browser offers it. */
export function QrInstall({ onBand = false }: { onBand?: boolean }) {
  const way = useInstallWay();
  if (way === 'app') return null;
  return (
    <div>
      <QrBlock onBand={onBand} />
      {way === 'prompt' && !onPhone() && (
        <button
          type="button"
          onClick={() => void start(way)}
          className={`mt-3 inline-flex items-center gap-1.5 rounded-[10px] px-2 py-1 text-[14px] font-extrabold ${onBand ? 'text-white hover:bg-white/10' : 'text-indigo hover:bg-indigo-tint'}`}
        >
          <Download className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
          Bu bilgisayara yükle
        </button>
      )}
    </div>
  );
}

/** /uygulama: the whole install for this device on the page itself, no sheet in between. */
export function InstallPanel() {
  const way = useInstallWay();
  if (way === 'app') return null;
  if (way === 'done')
    return (
      <p className="flex items-start gap-3 rounded-[16px] bg-green-tint p-4 text-[16px] font-bold text-green-ink">
        <Check className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={3} aria-hidden="true" />
        Yüklendi. Ana ekranındaki ya da uygulamalarındaki nirengi simgesinden aç.
      </p>
    );
  if (way === 'prompt' && onPhone()) return <InstallKey />;
  if (way === 'desktop' || way === 'prompt')
    return (
      <div className="flex flex-col items-start gap-4">
        <QrInstall />
      </div>
    );
  return <InstallSteps way={way} />;
}
