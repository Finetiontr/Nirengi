// Guard between Niri's model and the canvas. A field the model filled is used only if the
// sentence it cites is really in the kurum's text and every number it states appears there
// too. Suggested success criteria stay suggestions until the kurum adds them, and they must
// pass the canvas's own measurability test. Whatever fails is listed, never silently used.

import type { Canvas, ConstraintKind } from '../types.ts';
import { SKILLS, skillsInText } from '../skills.ts';
import { draftFromText, filledFields, isCheckable, questionsFor, type Draft } from './canvas.ts';

export type TextField = 'current' | 'pain' | 'painMetric' | 'outcome' | 'decisionMaker' | 'scope';
const FIELDS: TextField[] = ['current', 'pain', 'painMetric', 'outcome', 'decisionMaker', 'scope'];
const KINDS: ConstraintKind[] = ['butce', 'sure', 'veri', 'mevzuat', 'teknoloji'];
const MAX = 280;

export interface Suggestion {
  text: string;
  /** The kurum's sentence the criterion builds on. */
  basis: string;
}

export interface Rejected {
  field: keyof Canvas | 'title';
  value: string;
  /** quote: the cited sentence is not in the text · number: a number the text never states · measurable: no threshold, no deliverable. */
  reason: 'quote' | 'number' | 'measurable';
}

export interface ReadDraft extends Draft {
  source: 'model' | 'rules';
  /** For each filled field, the sentences of the kurum's text it came from. */
  quotes: Partial<Record<keyof Canvas, string[]>>;
  suggestions: Suggestion[];
  rejected: Rejected[];
}

const flat = (s: string) =>
  s
    .toLocaleLowerCase('tr-TR')
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”«»]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
const trimEnds = (s: string) => s.replace(/^[\s"'.,;:!?…-]+|[\s"'.,;:!?…-]+$/g, '');

/** The quote is a verbatim piece of the text (case, quote marks and spacing aside). */
export function cites(text: string, quote: string) {
  const q = trimEnds(flat(quote));
  return q.length >= 3 && flat(text).includes(q);
}

const numbers = (s: string) => (s.match(/\d+(?:[.,]\d+)*/g) ?? []).map((n) => n.replace(/[.,]/g, ''));

/** Every number in the value is a number the text states ("6000" and "6.000" are the same). */
export function numbersFrom(text: string, value: string) {
  const have = new Set(numbers(text));
  return numbers(value).every((n) => have.has(n));
}

const str = (v: unknown, max = MAX) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const list = (v: unknown) => (Array.isArray(v) ? (v as Record<string, unknown>[]).filter((x) => x && typeof x === 'object') : []);

/** The model's answer, checked against the text. Null when nothing usable survives: the caller falls back to the rules. */
export function readModelDraft(text: string, raw: unknown): ReadDraft | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const canvas: Canvas = { current: '', pain: '', painMetric: '', outcome: '', criteria: [], constraints: [], decisionMaker: '', scope: '' };
  const quotes: ReadDraft['quotes'] = {};
  const rejected: Rejected[] = [];
  const passes = (field: Rejected['field'], value: string, quote: string) => {
    const reason = !cites(text, quote) ? 'quote' : !numbersFrom(text, value) ? 'number' : null;
    if (reason) rejected.push({ field, value, reason });
    return !reason;
  };

  for (const f of FIELDS) {
    const v = (o[f] ?? {}) as Record<string, unknown>;
    const value = str(v.value);
    const quote = str(v.quote, 600);
    if (!value || !passes(f, value, quote)) continue;
    canvas[f] = value;
    quotes[f] = [quote];
  }

  for (const k of list(o.constraints)) {
    const kind = k.kind as ConstraintKind;
    const value = str(k.text);
    const quote = str(k.quote, 600);
    if (!KINDS.includes(kind) || !value || !passes('constraints', value, quote)) continue;
    canvas.constraints.push({ kind, text: value });
    (quotes.constraints ??= []).push(quote);
  }

  const suggestions: Suggestion[] = [];
  for (const k of list(o.criteria).slice(0, 4)) {
    const value = str(k.text);
    const basis = str(k.basis, 600);
    if (!value) continue;
    if (!cites(text, basis)) rejected.push({ field: 'criteria', value, reason: 'quote' });
    else if (!isCheckable(value)) rejected.push({ field: 'criteria', value, reason: 'measurable' });
    else if (!suggestions.some((s) => flat(s.text) === flat(value))) suggestions.push({ text: value, basis });
  }

  const extracted = filledFields(canvas);
  if (!extracted.length) return null;

  const picked = (Array.isArray(o.skills) ? o.skills : []).filter((k): k is string => typeof k === 'string' && Object.hasOwn(SKILLS, k));
  const skills = [...new Set([...picked.slice(0, 5), ...skillsInText(text)])];

  let title = str(o.title, 96);
  if (title && !numbersFrom(text, title)) {
    rejected.push({ field: 'title', value: title, reason: 'number' });
    title = '';
  }

  return {
    title: title || draftFromText(text).title,
    canvas,
    skills,
    questions: questionsFor(canvas),
    extracted,
    source: 'model',
    quotes,
    suggestions: suggestions.slice(0, 3),
    rejected,
  };
}

/** The offline path: the rule-based extractor copies whole sentences, so each field is its own quote. */
export function readRulesDraft(text: string): ReadDraft {
  const d = draftFromText(text);
  const quotes: ReadDraft['quotes'] = {};
  for (const f of FIELDS) if (d.canvas[f]) quotes[f] = [d.canvas[f]];
  return { ...d, source: 'rules', quotes, suggestions: [], rejected: [] };
}
