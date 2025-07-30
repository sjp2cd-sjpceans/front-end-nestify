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

  const formatData = JSON.stringify(`
    {
      "id": 1,
      "name": "Stark Penthouse",
      "description": "Lux penthouse in LA",
      "size": "3500.00",
      "price": "2500000.00",
      "hadDiscount": 1,
      "discountPrice": "2400000.00",
      "propertyType": "Penthouse",
      "status": "Available",
      "address": {
        "unitNumber": "Apt 101",
        "street": "123 Elm St",
        "city": "Los Angeles",
        "zipCode": "90001",
        "country": "United States",
        "latitude": "9.99999999",
        "longitude": "-9.99999999"
      },
      "agent": {
        "id": 1,
        "firstName": "Tony",
        "lastName": "Stark",
        "email": "tony.stark@starkindustries.com",
        "phone": "555-IRON2"
      },
      "images": [
        {
          "id": 1,
          "url": "/test/asset/img/property/pent_house.jpg",
          "altText": "Stark Penthouse",
          "isPrimary": 1,
          "format": "jpg"
        }
      ]
    }, 
    {
      and more ...
    }
  `);

  // console.log("Data to be used for AI search:", JSON.stringify(data));
  //REM: Yikes...
  const body: IRequest = {
    type: 'search-engine',
    system: { content: `Answering the "user" request should follow the constraint:\n* These are the datapoints:\n\`\`\`json\n${JSON.stringify(data,null,2)}\n\`\`\`\nOnly answer based on it.\n\n* Directly return only a JSON array of correspoding listing.\n* No more extra chat or text, no formating, no \`\`\`json.\n* Make it short and to the point.` },
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