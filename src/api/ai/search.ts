import type { IRequest } from './model/IRequest';
import type { IResponse } from './model/IResponse';

const BASE = import.meta.env.VITE_AI_BRIDGE_URL || 'http://localhost:3002';

export async function aiSearch(query: string) {

  const body: IRequest = {
    type: 'search-engine',
    system: { content: 'You are a real‑estate search assistant. Return a JSON array of listing objects.' },
    user: { content: query }
  };

  const resp = await fetch(`${BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const json = await resp.json() as IResponse;
  return json.content as Record<string, any>[];
}