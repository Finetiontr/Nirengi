// The guard between Niri's model and the canvas (src/lib/engine/ground.ts). MODEL is a real
// answer from the draft model for SAMPLE_COMPLAINT; the other cases bend it the ways a model fails.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessCanvas, SAMPLE_COMPLAINT } from '../src/lib/engine/canvas.ts';
import { cites, numbersFrom, readModelDraft, readRulesDraft } from '../src/lib/engine/ground.ts';

const MODEL = {
  title: 'Canlı araç takip web paneli kurmak',
  current: { quote: 'Araçlarımızda GPS cihazı var ama konum verisi günde bir kez Excel raporuna dönüşüyor.', value: 'GPS cihazlarından gelen veriler günde bir kez Excel raporu olarak alınıyor.' },
  pain: { quote: 'Kurumsal müşterilerimiz kargolarının nerede olduğunu göremiyor ve sürekli çağrı merkezimizi arıyor.', value: 'Kurumsal müşterilerin kargo konumunu görememesi ve çağrı merkezini araması' },
  painMetric: { quote: 'Çağrı merkezine gelen aramaların %40’ı “kargom nerede” sorusu, ayda yaklaşık 6.000 arama.', value: "Ayda 6.000 arama, aramaların %40'ı" },
  outcome: { quote: 'Müşterilerimize araç konumlarını canlı haritada gösteren bir web paneli istiyoruz.', value: 'Araç konumlarını canlı haritada gösteren bir web paneli' },
  decisionMaker: { quote: 'Aşamaları operasyon direktörümüz onaylayacak.', value: 'Operasyon direktörü' },
  scope: { quote: 'İlk denemeyi yalnız Tuzla deposundan çıkan araçlar ve onların kurumsal müşterileriyle yapmak istiyoruz.', value: 'Tuzla deposundan çıkan araçlar ve kurumsal müşterileri' },
  constraints: [
    { kind: 'butce', quote: 'Bütçemiz 40.000 TL', text: '40.000 TL' },
    { kind: 'sure', quote: '6 hafta içinde sonuç görmek istiyoruz.', text: '6 hafta içinde sonuç' },
    { kind: 'mevzuat', quote: 'Konum verisi KVKK kapsamında; müşteri adresleri paylaşılmayacak.', text: 'KVKK kapsamında' },
  ],
  criteria: [
    { basis: 'Çağrı merkezine gelen aramaların %40’ı “kargom nerede” sorusu, ayda yaklaşık 6.000 arama.', text: '“kargom nerede” aramalarının %20 oranında azalması' },
    { basis: 'Müşterilerimize araç konumlarını canlı haritada gösteren bir web paneli istiyoruz.', text: 'Canlı konum verisini gösteren web panelinin teslim edilmesi' },
  ],
  skills: ['react', 'node', 'api', 'maps', 'realtime'],
};

const bend = (patch: Record<string, unknown>) => ({ ...structuredClone(MODEL), ...patch });

test('ground: quotes must be verbatim pieces of the text', () => {
  assert.ok(cites(SAMPLE_COMPLAINT, 'Bütçemiz 40.000 TL'));
  assert.ok(cites(SAMPLE_COMPLAINT, '  araçlarımızda GPS cihazı var.'), 'case, spacing and end marks aside');
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
  const d = readModelDraft(SAMPLE_COMPLAINT, bend({ decisionMaker: { value: 'Genel Müdür', quote: 'Projeyi Genel Müdür onaylar.' } }))!;
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
