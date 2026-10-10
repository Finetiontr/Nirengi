/// <reference types="astro/client" />
// Niri's model, reached through worker/ (POST /ai/draft). The kurum's text goes out once and the
// raw draft comes back; engine/ground.ts decides what of it may enter the canvas. Answers are
// kept per text in this browser, so the same text drafts again without the network and
// without spending the day's free allocation. The sample text also has the model's recorded
// answer, so "Örnekle doldur" shows a model reading even when the model is out of reach.

import { SAMPLE_COMPLAINT } from './engine/canvas.ts';
import { readModelDraft, readRulesDraft, type ReadDraft } from './engine/ground.ts';
import { SAMPLE_READING } from './sample-reading.ts';

/** worker/ address; set per deployment through the PUBLIC_API_URL build variable. */
const API = (import.meta.env.PUBLIC_API_URL ?? '').replace(/\/+$/, '');
const CACHE_KEY = 'nirengi:ai-drafts';
const CACHE_MAX = 12;

/** Why the rules wrote the draft instead of the model. */
export type Fallback = 'offline' | 'quota' | 'busy' | 'model';

export interface Reading {
  draft: ReadDraft;
  /** Model name shown to the kurum, e.g. "Gemma 4 26B". */
  label?: string;
  cached?: boolean;
  /** Set with `recorded` too: the model was out of reach and its recorded answer for the sample was shown. */
  fallback?: Fallback;
  recorded?: boolean;
}

type Entry = { raw: unknown; label: string };

const key = (text: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(36);
};

function cache(): Record<string, Entry> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function remember(k: string, e: Entry) {
  try {
    const all = Object.entries({ ...cache(), [k]: e }).slice(-CACHE_MAX);
    localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(all)));
  } catch {
    /* private mode: the next draft asks the model again */
  }
}

async function ask(text: string): Promise<{ entry: Entry; cached: boolean } | Fallback> {
  const k = key(text.trim());
  const hit = cache()[k];
  if (hit) return { entry: hit, cached: true };
  if (!API) return 'offline';
  try {
    const res = await fetch(`${API}/ai/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
      signal: AbortSignal.timeout(25_000),
    });
    const body = (await res.json().catch(() => ({}))) as { draft?: unknown; label?: string; error?: string };
    if (res.ok && body.draft) {
      const entry = { raw: body.draft, label: body.label ?? 'açık model' };
      remember(k, entry);
      return { entry, cached: false };
    }
    return body.error === 'quota' ? 'quota' : body.error === 'busy' ? 'busy' : 'model';
  } catch {
    return 'offline';
  }
}

/** Model first; the rule-based extractor whenever the model is out of reach or nothing it said survives the checks. */
export async function readComplaint(text: string): Promise<Reading> {
  const r = await ask(text);
  if (typeof r === 'string') {
    // Out of reach (not a refused answer): the sample text still gets the model's real, recorded reading.
    const sample = r !== 'model' && text.trim() === SAMPLE_COMPLAINT ? readModelDraft(text, SAMPLE_READING) : null;
    return sample ? { draft: sample, label: 'Gemma 4 26B', fallback: r, recorded: true } : { draft: readRulesDraft(text), fallback: r };
  }
  const draft = readModelDraft(text, r.entry.raw);
  return draft ? { draft, label: r.entry.label, cached: r.cached } : { draft: readRulesDraft(text), fallback: 'model' };
}
