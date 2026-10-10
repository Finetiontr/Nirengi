// Skills grouped by area, one chip per vocabulary key. The kurum's need and the genç's
// work pick from the same list, so a match stays a set comparison in every field.

import { useId } from 'react';
import { Check } from 'lucide-react';
import { AREAS, skillLabel, skillsIn } from '../../lib/skills.ts';

export function SkillChip({ k, on, onToggle }: { k: string; on: boolean; onToggle: (key: string) => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onToggle(k)}
      className={`chip !py-1.5 transition-colors ${on ? '!border-indigo !bg-indigo-tint !text-indigo' : 'hover:border-line-2 hover:bg-bg-2'}`}
    >
      {on && <Check className="h-4 w-4" strokeWidth={3.5} aria-hidden="true" />}
      {skillLabel(k)}
    </button>
  );
}

export default function SkillPicker({ value, onToggle }: { value: string[]; onToggle: (key: string) => void }) {
  const id = useId();
  return (
    <div className="space-y-4">
      {AREAS.map((a) => (
        <div key={a.id} role="group" aria-labelledby={`${id}-${a.id}`}>
          <p id={`${id}-${a.id}`} className="text-[13px] font-extrabold text-ink-3">
            {a.label}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {skillsIn(a.id).map((k) => (
              <SkillChip key={k} k={k} on={value.includes(k)} onToggle={onToggle} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
