// The guard between Niri's model and the canvas (src/lib/engine/ground.ts). MODEL is a real
// answer from the draft model for SAMPLE_COMPLAINT (shared with the deck); the other cases bend it
// the ways a model fails.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessCanvas, isCheckable, SAMPLE_COMPLAINT } from '../src/lib/engine/canvas.ts';
import { cites, numbersFrom, readModelDraft, readRulesDraft } from '../src/lib/engine/ground.ts';
import { INVENTED_DECIDER, SAMPLE_READING as MODEL } from '../src/lib/sample-reading.ts';

const bend = (patch: Record<string, unknown>) => ({ ...structuredClone(MODEL), ...patch });

test('ground: quotes must be verbatim pieces of the text', () => {
  assert.ok(cites(SAMPLE_COMPLAINT, 'Bütçemiz 40.000 TL'));
  assert.ok(cites(SAMPLE_COMPLAINT, '  araçlarımızda GPS cihazı var.'), 'case, spacing and end marks aside');
  assert.ok(cites('Haftada 900 şikâyet geliyor.', 'haftada 900 şikayet geliyor'), 'the circumflex aside');
  assert.ok(!cites(SAMPLE_COMPLAINT, 'Bütçemiz 80.000 TL'));
  assert.ok(!cites(SAMPLE_COMPLAINT, ''));
});

test('ground: numbers must be numbers the text states', () => {
  assert.ok(numbersFrom(SAMPLE_COMPLAINT, '6000 arama, %40'));
  assert.ok(!numbersFrom(SAMPLE_COMPLAINT, 'ayda 8.000 arama'));
});

test('ground: a real model answer fills the canvas and keeps where each field came from', () => {
  const d = readModelDraft(SAMPLE_COMPLAINT, MODEL)!;
  assert.equal(d.source, 'model');
  assert.deepEqual(d.rejected, []);
  assert.ok(d.canvas.painMetric.includes('6.000'));
  assert.deepEqual(d.quotes.current, [MODEL.current.quote]);
  assert.deepEqual(d.canvas.constraints.map((k) => k.kind), ['butce', 'sure', 'mevzuat']);
  assert.equal(d.canvas.decisionMaker, 'Operasyon direktörü');
  assert.deepEqual(d.quotes.scope, [MODEL.scope.quote]);
  assert.ok(!d.questions.some((q) => q.field === 'decisionMaker'), 'nothing to ask about what the text says');
  assert.ok(['maps', 'realtime', 'react', 'api'].every((k) => d.skills.includes(k)));
});

test('ground: suggested criteria stay out of the canvas until the kurum adds them', () => {
  const d = readModelDraft(SAMPLE_COMPLAINT, MODEL)!;
  assert.equal(d.canvas.criteria.length, 0);
  assert.equal(d.suggestions.length, 2);
});

test('ground: a field citing a sentence that is not in the text is refused', () => {
  const d = readModelDraft(SAMPLE_COMPLAINT, INVENTED_DECIDER)!;
  assert.equal(d.canvas.decisionMaker, '');
  assert.ok(d.questions.some((q) => q.field === 'decisionMaker'), 'asked instead of invented');
  assert.deepEqual(d.rejected, [{ field: 'decisionMaker', value: 'Genel Müdür', reason: 'quote' }]);
});

test('ground: an invented number is refused even with a real quote', () => {
  const d = readModelDraft(SAMPLE_COMPLAINT, bend({ painMetric: { value: 'Ayda 8.000 arama', quote: MODEL.painMetric.quote } }))!;
  assert.equal(d.canvas.painMetric, '');
  assert.equal(d.rejected[0].reason, 'number');
});

test('ground: a criterion without a threshold or deliverable is refused', () => {
  const d = readModelDraft(SAMPLE_COMPLAINT, bend({ criteria: [...MODEL.criteria, { text: 'Müşteri memnuniyeti artar.', basis: MODEL.pain.quote }] }))!;
  assert.equal(d.suggestions.length, 2);
  assert.deepEqual(d.rejected, [{ field: 'criteria', value: 'Müşteri memnuniyeti artar.', reason: 'measurable' }]);
});

test('ground: a criterion may leave its threshold blank for the kurum, and stays unmeasurable until filled', () => {
  const text = 'Aramaların ... altına inmesi';
  const d = readModelDraft(SAMPLE_COMPLAINT, bend({ criteria: [{ text, basis: MODEL.pain.quote }] }))!;
  assert.deepEqual(d.suggestions.map((s) => s.text), ['Aramaların … altına inmesi']);
  assert.ok(!isCheckable(d.suggestions[0].text), 'added as is, the canvas still asks for the number');
});

test('ground: unknown skills, kinds and a title with a new number are dropped', () => {
  const d = readModelDraft(
    SAMPLE_COMPLAINT,
    bend({ skills: ['maps', 'constructor', 'cobol'], constraints: [{ kind: 'gizli', text: 'x', quote: 'Bütçemiz 40.000 TL' }], title: 'Aramaları 3.000’e indirmek' }),
  )!;
  assert.ok(d.skills.includes('maps') && !d.skills.includes('constructor') && !d.skills.includes('cobol'));
  assert.equal(d.canvas.constraints.length, 0);
  assert.notEqual(d.title, 'Aramaları 3.000’e indirmek');
  assert.ok(d.rejected.some((r) => r.field === 'title' && r.reason === 'number'));
});

test('ground: ideas fill only empty fields, and a number the text lacks becomes a blank', () => {
  const d = readModelDraft(
    SAMPLE_COMPLAINT,
    bend({
      scope: { value: '', quote: '' },
      ideas: { scope: 'Önce 1 depodan çıkan ... araçla, 6 hafta boyunca deneyelim.', painMetric: 'Ayda ... arama', decisionMaker: '...', budget: 'Bütçe yok' },
    }),
  )!;
  assert.deepEqual(d.ideas, { scope: 'Önce … depodan çıkan … araçla, 6 hafta boyunca deneyelim.' }, 'painMetric is read from the text; unknown and empty ideas are dropped');
  assert.equal(d.canvas.scope, '', 'an idea never enters the canvas by itself');
  assert.deepEqual(readRulesDraft(SAMPLE_COMPLAINT).ideas, {});
});

test('ground: nothing usable means the rules take over', () => {
  assert.equal(readModelDraft(SAMPLE_COMPLAINT, null), null);
  assert.equal(readModelDraft(SAMPLE_COMPLAINT, 'metin'), null);
  assert.equal(readModelDraft(SAMPLE_COMPLAINT, { current: { value: 'Uydurma', quote: 'Yok böyle bir cümle' } }), null);
  assert.equal(readRulesDraft(SAMPLE_COMPLAINT).source, 'rules');
});

test('ground: before and after on the sample, scored by the same rules', () => {
  const rules = readRulesDraft(SAMPLE_COMPLAINT);
  const model = readModelDraft(SAMPLE_COMPLAINT, MODEL)!;
  const added = { ...model.canvas, criteria: model.suggestions.map((s, i) => ({ id: `c${i}`, text: s.text })) };
  // Rules: 5 fields, no criteria, no decision maker, no scope. Model: 7 fields and two criteria to add.
  assert.equal(assessCanvas(rules.canvas, rules.skills).score, 60);
  assert.equal(assessCanvas(model.canvas, model.skills).score, 75);
  assert.ok(!assessCanvas(model.canvas, model.skills).canPublish, 'no criteria until the kurum adds them');
  assert.equal(assessCanvas(added, model.skills).score, 100);
  assert.ok(assessCanvas(added, model.skills).canPublish);
});
