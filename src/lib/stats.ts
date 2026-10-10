/// <reference types="astro/client" />
// The real-use counts from worker/ (GET /stats): how many different people connected their GitHub
// account for real and how many kurum texts the model really read. Demo data never reaches them.

/** worker/ address; set per deployment through the PUBLIC_API_URL build variable. */
const API = (import.meta.env.PUBLIC_API_URL ?? '').replace(/\/+$/, '');

export interface RealUse {
  people: number;
  drafts: number;
  /** When counting started. */
  since: string;
}

/** The counts, or null when the worker is not set up or out of reach. */
export async function realUse(): Promise<RealUse | null> {
  if (!API) return null;
  try {
    const res = await fetch(`${API}/stats`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const c = (await res.json()) as Partial<RealUse>;
    return typeof c.people === 'number' && typeof c.drafts === 'number' && typeof c.since === 'string' ? { people: c.people, drafts: c.drafts, since: c.since } : null;
  } catch {
    return null;
  }
}
