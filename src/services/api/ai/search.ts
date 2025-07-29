import type { IRequest } from './model/IRequest';
import type { IResponse } from './model/IResponse';

const BASE = import.meta.env.VITE_AI_BRIDGE_URL || 'http://localhost:3002';

export async function aiSearch(query: string) {

  let data = Promise<any|undefined>;
  try {

    const res = await fetch("http://localhost:3001/properties");
    data = await res.json();
    console.log("Data fetched from backend db:", data);
  } catch (error: unknown) {

    console.error("Error fetching data from backend db:", error);
  }

  if( !data ) {

    throw new Error('Failed to fetch data from backend that handled db');
  }

  //REM: Yikes...
  const body: IRequest = {
    type: 'search-engine',
    system: { content: `Answering the "user" request should follow the constraint:\n* These are the datapoints:\n${JSON.stringify(data)}\nOnly answer based on it.\n\n* Directly return only a JSON array of correspoding listing.\n* No more extra chat or text, no formating, no \`\`\`json.\n* Make it short and to the point.`},
    user: { content: query }
  };

  const resp = await fetch(`${BASE}/ai/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const json = await resp.json() as IResponse;
  return json.content as Record<string, any>[];
}