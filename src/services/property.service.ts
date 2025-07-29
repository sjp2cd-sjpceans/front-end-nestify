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

// Backend enriched property structure
interface ApiEnrichedProperty {
  id: number;
  name: string;
  description: string;
  size: number;
  price: number;
  hadDiscount: boolean;
  discountPrice?: number | null;
  propertyType: string;
  status: string;
  address: {
    unitNumber?: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  images: {
    id: number;
    url: string;
    altText: string;
    isPrimary: boolean;
    format: string;
  }[];
  agent?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
}

// Function to map API enriched property to frontend Property interface
const mapApiEnrichedPropertyToProperty = (apiProperty: ApiEnrichedProperty): Property => {
  // Generate mock beds/baths since they're not in the database yet
  const mockBedsBaths = [
    { beds: 1, baths: 1 },
    { beds: 2, baths: 1 },
    { beds: 2, baths: 2 },
    { beds: 3, baths: 2 },
    { beds: 4, baths: 3 },
  ];
  
  const bedsIndex = (apiProperty.id - 1) % mockBedsBaths.length;

  return {
    id: apiProperty.id.toString(),
    name: apiProperty.name,
    description: apiProperty.description,
    price: apiProperty.price,
    discountPrice: apiProperty.discountPrice || undefined,
    hadDiscount: apiProperty.hadDiscount,
    size: apiProperty.size,
    propertyType: apiProperty.propertyType,
    status: apiProperty.status,
    address: {
      street: apiProperty.address.unitNumber 
        ? `${apiProperty.address.unitNumber}, ${apiProperty.address.street}`
        : apiProperty.address.street,
      city: apiProperty.address.city,
      zipCode: apiProperty.address.zipCode,
    },
    images: apiProperty.images.map(img => ({
      url: `http://localhost:3001${img.url}`,
      altText: img.altText,
      isPrimary: img.isPrimary
    })),
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
  const response = await api.get<ApiEnrichedProperty[]>('/properties', { params });
  return response.data.map(mapApiEnrichedPropertyToProperty);
};

// Get properties with pagination
export const getPropertiesRange = async (offset: number = 0, limit: number = 10): Promise<Property[]> => {
  // For now, just get all properties and slice them
  const allProperties = await getProperties();
  return allProperties.slice(offset, offset + limit);
};

// Get property by ID
export const getPropertyById = async (id: string): Promise<Property> => {
  const response = await api.get<ApiEnrichedProperty>(`/properties/${id}`);
  return mapApiEnrichedPropertyToProperty(response.data);
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