import api from './api';

export interface Property {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  hadDiscount: boolean;
  size: number;
  propertyType: string;
  status: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  images: {
    url: string;
    altText: string;
    isPrimary: boolean;
  }[];
  beds: number;
  baths: number;
}

// Backend API property structure
interface ApiProperty {
  id: number;
  name: string;
  description: string;
  price: string;
  discount_price?: string;
  had_discount: number;
  size: string;
  property_type_id: number;
  status_id: number;
  address_id: number;
  actor_property_owner_id: number;
  actor_sales_office_id: number;
  actor_agent_id: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
}

// Property type mapping
const propertyTypeMap: { [key: number]: string } = {
  1: 'Apartment',
  2: 'Condo',
  3: 'House',
  4: 'Villa',
  5: 'Studio',
  6: 'Loft',
  7: 'Duplex',
  8: 'Penthouse',
  9: 'Townhouse',
  10: 'Bungalow',
};

// Status mapping
const statusMap: { [key: number]: string } = {
  1: 'Available',
  2: 'Sold',
  3: 'Pending',
  4: 'Off Market',
};

// Function to map API property to frontend Property interface
const mapApiPropertyToProperty = (apiProperty: ApiProperty): Property => {
  // Generate mock address and property details since they're not in the API response
  const mockAddresses = [
    { street: '123 Ecoland Drive', city: 'Malina', zipCode: '1000' },
    { street: '456 Business District', city: 'Manila', zipCode: '1001' },
    { street: '789 Residential Ave', city: 'Quezon City', zipCode: '1100' },
    { street: '321 Downtown Street', city: 'Makati', zipCode: '1200' },
    { street: '654 Suburban Lane', city: 'Pasig', zipCode: '1600' },
  ];

  const mockBedsBaths = [
    { beds: 1, baths: 1 },
    { beds: 2, baths: 1 },
    { beds: 2, baths: 2 },
    { beds: 3, baths: 2 },
    { beds: 4, baths: 3 },
  ];

  const addressIndex = (apiProperty.id - 1) % mockAddresses.length;
  const bedsIndex = (apiProperty.id - 1) % mockBedsBaths.length;

  return {
    id: apiProperty.id.toString(),
    name: apiProperty.name,
    description: apiProperty.description,
    price: parseFloat(apiProperty.price),
    discountPrice: apiProperty.discount_price ? parseFloat(apiProperty.discount_price) : undefined,
    hadDiscount: Boolean(apiProperty.had_discount),
    size: parseFloat(apiProperty.size),
    propertyType: propertyTypeMap[apiProperty.property_type_id] || 'Unknown',
    status: statusMap[apiProperty.status_id] || 'Unknown',
    address: mockAddresses[addressIndex],
    images: [{
      url: `http://localhost:3001/test/asset/img/property/${apiProperty.id % 2 === 1 ? '1_start_house.jpeg' : '1_building_penthouse.jpg'}`,
      altText: apiProperty.name,
      isPrimary: true
    }],
    beds: mockBedsBaths[bedsIndex].beds,
    baths: mockBedsBaths[bedsIndex].baths,
  };
};

// Get all properties
export const getProperties = async (params?: {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  city?: string;
}): Promise<Property[]> => {
  const response = await api.get<ApiProperty[]>('/properties', { params });
  return response.data.map(mapApiPropertyToProperty);
};

// Get properties with pagination
export const getPropertiesRange = async (offset: number = 0, limit: number = 10): Promise<Property[]> => {
  const response = await api.get<ApiProperty[]>(`/properties/range?offset=${offset}&limit=${limit}`);
  return response.data.map(mapApiPropertyToProperty);
};

// Get property by ID
export const getPropertyById = async (id: string): Promise<Property> => {
  const response = await api.get<ApiProperty>(`/properties/${id}`);
  return mapApiPropertyToProperty(response.data);
};

// Get saved properties for user (mock implementation for now)
export const getSavedProperties = async (): Promise<Property[]> => {
  // For now, get the first few properties as "saved"
  const allProperties = await getPropertiesRange(0, 4);
  return allProperties;
};

// Get recommendations (mock implementation using real data)
export const getRecommendations = async (): Promise<Property[]> => {
  // Get a different set of properties as recommendations
  const allProperties = await getPropertiesRange(4, 3);
  return allProperties;
};

// Save property (mock implementation)
export const saveProperty = async (propertyId: string): Promise<void> => {
  console.log('Saving property:', propertyId);
  // In a real implementation, this would make an API call to save the property
};

// Unsave property (mock implementation)
export const unsaveProperty = async (propertyId: string): Promise<void> => {
  console.log('Unsaving property:', propertyId);
  // In a real implementation, this would make an API call to unsave the property
}; 