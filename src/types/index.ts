// Core data structures for TrustSearch application

export interface Location {
  barangay: string
  city: string
  province?: string
  latitude?: number
  longitude?: number
}

export interface RiskProfile {
  crime_rate: 'Low' | 'Moderate' | 'High'
  safety_score: number // 1-10
  flood_risk: 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Very High'
  traffic_level: 'Light' | 'Moderate' | 'Heavy' | 'Very Heavy'
  healthcare_access: 'Limited' | 'Fair' | 'Good' | 'Excellent'
  education_access: 'Limited' | 'Fair' | 'Good' | 'Excellent'
}

export interface Agent {
  id: string
  name: string
  email: string
  phone?: string
  trust_score: number // 1-10
  verified: boolean
  verification_level: 'Unverified' | 'Document Verified' | 'Premium Verified'
  reviews_count: number
  average_rating: number
  profile_image?: string
  license_number?: string
  agency?: string
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  property_type: 'House' | 'Condo' | 'Townhouse' | 'Lot' | 'Commercial'
  bedrooms?: number
  bathrooms?: number
  floor_area?: number
  lot_area?: number
  location: Location
  agent_id: string
  agent?: Agent
  trust_score: number
  risk_profile: RiskProfile
  environmental_tags: string[]
  images: string[]
  amenities: string[]
  status: 'active' | 'sold' | 'pending' | 'inactive'
  created_at: string
  updated_at: string
  featured: boolean
}

export interface SearchFilters {
  price_min?: number
  price_max?: number
  property_type?: Property['property_type']
  bedrooms?: number
  bathrooms?: number
  location?: string
  verified_only?: boolean
  low_risk_only?: boolean
  near_hospital?: boolean
  near_school?: boolean
  trust_score_min?: number
}

export interface SearchResult<T> {
  data: T[]
  count: number
  trust_ranking: number
}

export interface User {
  id: string
  email: string
  name?: string
  role: 'buyer' | 'agent' | 'admin'
  verified: boolean
  created_at: string
} 