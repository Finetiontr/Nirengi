// The genç chapter's Niri: its line, and on wide screens the five league chips under
// the bubble. Pointing at a chip dresses this Niri in that league's costume once the
// pointer rests (200 ms), so sweeping across the chips makes one turn, not five; Say
// queues the turns one at a time. Phones get the same chips in a card of their own
// (Costumes), further down where they are read.

import { useEffect, useRef, useState } from 'react';
import Say, { type Line } from './Say';
import { Chips } from './Costumes';

const REST_MS = 200;

export default function GencSay({ line, tiers, from }: { line: Omit<Line, 'key'>; tiers: Line[]; from?: number | null }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [worn, setWorn] = useState<number | null>(null);
  const rest = useRef(0);
  useEffect(() => {
    window.clearTimeout(rest.current);
    if (picked === worn) return;
    rest.current = window.setTimeout(() => setWorn(picked), REST_MS);
    return () => window.clearTimeout(rest.current);
  }, [picked, worn]);

  const shown = worn === null ? line : tiers[worn];
  return (
    <Say mood={shown.mood} text={shown.text} gear={shown.gear} from={from} watch="section" point="down">
      <Chips tiers={tiers} gear={picked ?? line.gear ?? 2} pick={setPicked} className="mt-4 hidden xl:flex" />
    </Say>
  );
}
