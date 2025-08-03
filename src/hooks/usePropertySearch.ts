import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Property, SearchFilters } from '../types'

interface PropertySearchResult {
  properties: Property[]
  loading: boolean
  error: string | null
  totalCount: number
}

export const usePropertySearch = (
  searchQuery: string,
  filters: SearchFilters,
  sortBy: string = 'trust-high-low'
): PropertySearchResult => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Build the base query with joins
        let query = supabase
          .from('properties')
          .select(`
            *,
            agents!inner (
              id,
              name,
              verification_level,
              verified,
              trust_score,
              reviews_count,
              profile_image
            ),
            locations!inner (
              id,
              barangay,
              city,
              province,
              region,
              risk_profiles (
                crime_rate,
                safety_score,
                flood_risk,
                traffic_level,
                healthcare_access,
                education_access
              )
            ),
            property_images (
              url,
              is_primary,
              display_order
            ),
            property_environmental_tags (
              environmental_tags (
                name
              )
            )
          `)
          .eq('status', 'active')

        // Apply location filter
        if (filters.location) {
          query = query.or(
            `city.ilike.%${filters.location}%,barangay.ilike.%${filters.location}%,province.ilike.%${filters.location}%`,
            { foreignTable: 'locations' }
          )
        }

        // Apply price filters
        if (filters.price_min) {
          query = query.gte('price', filters.price_min * 100) // Convert to centavos
        }
        if (filters.price_max) {
          query = query.lte('price', filters.price_max * 100) // Convert to centavos
        }

        // Apply property type filter
        if (filters.property_type) {
          query = query.eq('property_type', filters.property_type.toLowerCase())
        }

        // Apply bedrooms filter
        if (filters.bedrooms) {
          if (filters.bedrooms >= 5) {
            query = query.gte('bedrooms', 5)
          } else {
            query = query.eq('bedrooms', filters.bedrooms)
          }
        }

        // Apply trust score filter
        if (filters.trust_score_min) {
          query = query.gte('trust_score', filters.trust_score_min)
        }

        // Apply verified agents filter
        if (filters.verified_only) {
          query = query.eq('agents.verified', true)
        }

        // Apply text search if provided
        if (searchQuery && searchQuery.trim()) {
          query = query.or(
            `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
          )
        }

        // Apply sorting
        switch (sortBy) {
          case 'trust-high-low':
            query = query.order('trust_score', { ascending: false })
            break
          case 'trust-low-high':
            query = query.order('trust_score', { ascending: true })
            break
          case 'price-low-high':
            query = query.order('price', { ascending: true })
            break
          case 'price-high-low':
            query = query.order('price', { ascending: false })
            break
          case 'newest':
            query = query.order('created_at', { ascending: false })
            break
          default:
            query = query.order('trust_score', { ascending: false })
        }

        const { data, error: queryError, count } = await query

        if (queryError) {
          throw new Error(queryError.message)
        }

        console.log('Raw property search data:', data)

        // Transform the data to match our Property interface
        const transformedProperties: Property[] = (data || []).map((property: any) => {
          // Handle agent data (could be array or direct object)
          const agent = Array.isArray(property.agents) ? property.agents[0] : property.agents
          
          // Handle location data (could be array or direct object)
          const location = Array.isArray(property.locations) ? property.locations[0] : property.locations
          
          // Handle risk profile nested under location
          const riskProfile = location?.risk_profiles?.[0] || location?.risk_profiles || {
            crime_rate: 'moderate',
            safety_score: 5,
            flood_risk: 'moderate',
            traffic_level: 'moderate',
            healthcare_access: 'fair',
            education_access: 'fair'
          }

          // Handle images
          const images = property.property_images
            ?.sort((a: any, b: any) => {
              if (a.is_primary) return -1
              if (b.is_primary) return 1
              return a.display_order - b.display_order
            })
            ?.map((img: any) => img.url) || []

          // Handle environmental tags
          const environmentalTags = property.property_environmental_tags
            ?.map((pet: any) => pet.environmental_tags?.name)
            ?.filter(Boolean) || []

          return {
            id: property.id,
            title: property.title,
            description: property.description,
            price: Math.round(property.price / 100), // Convert from centavos to pesos
            property_type: property.property_type,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            floor_area: parseFloat(property.floor_area || '0'),
            lot_area: parseFloat(property.lot_area || '0'),
            trust_score: parseFloat(property.trust_score || '5'),
            images,
            environmental_tags: environmentalTags,
            amenities: property.amenities || [],
            status: property.status || 'active',
            created_at: property.created_at,
            updated_at: property.updated_at,
            featured: property.featured || false,
            agent_id: property.agent_id,
            location: {
              barangay: location?.barangay || '',
              city: location?.city || '',
              province: location?.province || '',
              region: location?.region || ''
            },
            risk_profile: {
              crime_rate: riskProfile.crime_rate || 'moderate',
              safety_score: parseFloat(riskProfile.safety_score || '5'),
              flood_risk: riskProfile.flood_risk || 'moderate',
              traffic_level: riskProfile.traffic_level || 'moderate',
              healthcare_access: riskProfile.healthcare_access || 'fair',
              education_access: riskProfile.education_access || 'fair'
            },
            agent: agent ? {
              id: agent.id,
              name: agent.name,
              email: agent.email || '',
              phone: agent.phone,
              verification_level: agent.verification_level || 'unverified',
              verified: agent.verified || false,
              trust_score: parseFloat(agent.trust_score || '5'),
              reviews_count: agent.reviews_count || 0,
              average_rating: parseFloat(agent.average_rating || '0'),
              profile_image: agent.profile_image,
              license_number: agent.license_number,
              agency: agent.agency
            } : undefined
          }
        })

        console.log('Transformed properties:', transformedProperties)
        setProperties(transformedProperties)
        setTotalCount(count || transformedProperties.length)
        
      } catch (err) {
        console.error('Property search error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch properties')
        setProperties([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [searchQuery, filters, sortBy])

  return {
    properties,
    loading,
    error,
    totalCount
  }
} 