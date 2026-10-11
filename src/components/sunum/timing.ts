// The talk's clock, shared by the deck, the presenter window, the export and the tests. Niri is
// silent: its bubbles move on by themselves while the team speaks, so a beat lasts as long as the
// presenter takes to say its line at a calm pace, plus a short breath before the next bubble. A
// slide is Niri's turn into it, its beats, and the presenter's key press to the next slide.
import type { Note } from './notes';

/** Seconds from entering a slide to its first bubble settling (Niri's turn). */
export const TURN = 0.6;
/** Characters a second a presenter says at a calm stage pace (Turkish, with breaths). */
export const PACE = 14;
/** Seconds of breath after a line before the next bubble. */
export const GAP = 0.6;
/** Seconds the presenter takes to press → once the slide is said. */
export const KEY = 1;

/** Seconds a beat's line takes to say. */
export const sayingSec = (say: string) => say.length / PACE;

/** Seconds a beat holds before the next bubble: its line, then a breath. */
export const beatSec = (say: string) => sayingSec(say) + GAP;

/** Whole seconds a talk slide takes; the film slide keeps its `sec` (the film's length and the key press). */
export function plan(note: Note): number {
  if (note.beats.some((b) => b.at !== undefined)) return note.sec;
  const said = note.beats.reduce((s, b) => s + sayingSec(b.say), 0);
  return Math.ceil(TURN + said + GAP * (note.beats.length - 1) + KEY);
}
