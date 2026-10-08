// A stage Niri that arrives changed: it shows `from` (plain by default) and, a beat
// after it scrolls into view, twirls into its costume. Used where Niri stands alone
// on a drawing (the "who" sheet).

import { useEffect, useState } from 'react';
import Niri, { type Mood } from '../ui/Niri';
import NiriTwirl from '../ui/NiriTwirl';

export default function TwirlIn({ mood, size, gear, from = null, turns = 1 }: { mood: Mood; size: number; gear: number; from?: number | null; turns?: 0.5 | 1 | 2 }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <NiriTwirl k={on ? 1 : 0} turns={turns} className="!block w-full">
      <Niri mood={mood} size={size} gear={on ? gear : (from ?? undefined)} />
    </NiriTwirl>
  );
}
