// The live line under "Gerçek mi, demo mu?": real GitHub sign-ins and real model readings as
// worker/ counts them. It renders nothing until the numbers arrive and nothing when the worker
// is out of reach, so a stale or made-up number never shows.

import { useEffect, useState } from 'react';
import { realUse, type RealUse as Counts } from '../../lib/stats.ts';
import { fmtDate } from '../../lib/format.ts';

export default function RealUse() {
  const [c, setC] = useState<Counts | null>(null);
  useEffect(() => {
    void realUse().then(setC);
  }, []);
  if (!c) return null;
  return (
    <p className="rounded-[16px] bg-green-tint px-4 py-3 text-[15px] font-bold leading-snug text-ink-2">
      Canlı sayım, {fmtDate(c.since)} tarihinden beri: <b className="num text-green-ink">{c.people}</b> kişi GitHub hesabıyla gerçekten bağlandı; model, kurumların kendi yazdığı <b className="num text-green-ink">{c.drafts}</b> metni okudu. Örnek profil ve örnek metin sayılmaz, kim olduğun tutulmaz.
    </p>
  );
}
