// The real-use counter: how many different people connected their GitHub account for real and
// how many kurum texts the model really read. One Durable Object keeps the numbers. A person is
// kept only as a keyed hash of their GitHub id, so the count is of people, not of sign-ins, and
// nobody can be read back out of it. Nothing else is stored.

interface Storage {
  get<T>(key: string): Promise<T | undefined>;
  put(key: string, value: unknown): Promise<void>;
}

export interface Counts {
  people: number;
  drafts: number;
  /** When counting started (the first time this object was reached). */
  since: string;
}

export type Hit = { kind: 'person'; who: string } | { kind: 'draft' };

export class Stats {
  private storage: Storage;

  constructor(state: { storage: Storage }) {
    this.storage = state.storage;
  }

  async fetch(req: Request): Promise<Response> {
    const s = this.storage;
    let since = await s.get<string>('since');
    if (!since) {
      since = new Date().toISOString();
      await s.put('since', since);
    }
    if (req.method === 'POST') {
      const hit = (await req.json()) as Hit;
      if (hit.kind === 'person' && /^[0-9a-f]{32}$/.test(hit.who) && !(await s.get(`p:${hit.who}`))) {
        await s.put(`p:${hit.who}`, 1);
        await s.put('people', ((await s.get<number>('people')) ?? 0) + 1);
      }
      if (hit.kind === 'draft') await s.put('drafts', ((await s.get<number>('drafts')) ?? 0) + 1);
      return new Response(null, { status: 204 });
    }
    const counts: Counts = { people: (await s.get<number>('people')) ?? 0, drafts: (await s.get<number>('drafts')) ?? 0, since };
    return Response.json(counts);
  }
}
