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

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
}

// Get all properties
export const getProperties = async (params?: {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  city?: string;
}): Promise<PropertyListResponse> => {
  const response = await api.get<PropertyListResponse>('/properties', { params });
  return response.data;
};

// Get property by ID
export const getPropertyById = async (id: string): Promise<Property> => {
  const response = await api.get<Property>(`/properties/${id}`);
  return response.data;
};

// Get saved properties for user
export const getSavedProperties = async (): Promise<Property[]> => {
  const response = await api.get<Property[]>('/properties/saved');
  return response.data;
};

// Save property
export const saveProperty = async (propertyId: string): Promise<void> => {
  await api.post(`/properties/${propertyId}/save`);
};

// Unsave property
export const unsaveProperty = async (propertyId: string): Promise<void> => {
  await api.delete(`/properties/${propertyId}/save`);
};

// Get recommendations
export const getRecommendations = async (): Promise<Property[]> => {
  const response = await api.get<Property[]>('/properties/recommendations');
  return response.data;
}; 