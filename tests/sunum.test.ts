// The talk (src/components/sunum/notes.ts): every talk slide has two or three of Niri's bubbles,
// each a short headline over what the team says; each slide's `sec` is what the clock in
// timing.ts makes of those lines (the bubbles move on by themselves at that pace); the film's
// lines run in order; the talk fits a ten-minute meeting slot; and the deck says "deneyim puanı"
// where the product's screens say XP.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NOTES, QA } from '../src/components/sunum/notes.ts';
import { plan } from '../src/components/sunum/timing.ts';

const talk = Object.entries(NOTES).filter(([, n]) => n.sec > 0);
const timed = (id: string) => NOTES[id].beats.some((b) => b.at !== undefined);
const paced = talk.filter(([id]) => !timed(id));

test('sunum: every talk slide gives Niri two or three bubbles, each over what the team says', () => {
  for (const [id, n] of paced) {
    assert.ok(n.beats.length >= 2 && n.beats.length <= 3, `${id}: ${n.beats.length} bubbles`);
    for (const b of n.beats) {
      assert.ok(b.text.trim().length > 0 && b.say.trim().length > 0, `${id}: an empty beat`);
      assert.ok(b.text.length <= 60, `${id}: the bubble is long: ${b.text}`);
    }
  }
});

test('sunum: each slide plans the time its lines take, and the talk fits a ten-minute meeting slot', () => {
  for (const [id, n] of paced) assert.equal(n.sec, plan(n), `${id}: sec should be ${plan(n)}`);
  const total = talk.reduce((s, [, n]) => s + n.sec, 0);
  assert.ok(total <= 600, `talk planned at ${total} s`);
});

test('sunum: the film slide follows the film in order, inside its length', () => {
  const film = talk.filter(([id]) => timed(id));
  assert.equal(film.length, 1);
  const [, n] = film[0];
  const at = n.beats.map((b) => b.at ?? -1);
  assert.ok(at.every((t) => t >= 0 && t < n.sec), 'a line outside the film');
  assert.deepEqual([...at].sort((a, b) => a - b), at, 'lines out of order');
});

test('sunum: XP is always said as deneyim puanı', () => {
  const texts = [...Object.values(NOTES).flatMap((n) => [n.key ?? '', n.lead ?? '', ...n.beats.flatMap((b) => [b.text, b.say])]), ...QA.flatMap((a) => [a.q, ...a.say])];
  for (const t of texts) if (/\bXP\b/.test(t)) assert.match(t, /deneyim puanı/, t);
});
