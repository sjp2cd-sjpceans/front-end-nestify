export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export interface ChatbotState {
  isOpen: boolean
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
}

export interface Property {
  id: string
  title: string
  price: number
  location: {
    barangay: string
    city: string
    region: string
  }
  agent_id: string
  property_type: string
  bedrooms: number
  bathrooms: number
  area_sqm: number
  environmental_tags: string[]
  description: string
  status: string
  created_at: string
}

export interface Agent {
  id: string
  name: string
  trust_score: number
  verified: boolean
  verification_level: string
  contact: string
  phone: string
  specialties: string[]
  years_experience: number
  total_listings: number
  successful_sales: number
  description: string
}

export interface Location {
  barangay: string
  city: string
  region: string
  risk_profile: {
    crime_rate: string
    safety_score: number
    flood_risk: string
    traffic_level: string
    healthcare_access: string
    education_access: string
  }
  amenities: string[]
  average_price_per_sqm: number
  description: string
}

export interface LocalData {
  properties: Property[]
  agents: Agent[]
  locations: Location[]
  market_stats: {
    total_properties: number
    total_agents: number
    verified_agents: number
    average_trust_score: number
    price_range: {
      min: number
      max: number
      average: number
    }
    popular_areas: string[]
    last_updated: string
  }
}

export interface ChatRequest {
  message: string
  context: {
    properties: Property[]
    agents: Agent[]
    locations: Location[]
    intent?: string
    entities?: {
      location?: string
      property_type?: string
      agent_name?: string
      price_range?: string
    }
  }
}

export interface ChatResponse {
  response: string
  success: boolean
}

export interface ChatError {
  error: string
  details?: string
} 