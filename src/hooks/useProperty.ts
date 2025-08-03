import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Property } from '../types'

interface UsePropertyState {
  property: Property | null
  loading: boolean
  error: string | null
}

export const useProperty = (propertyId: string | undefined) => {
  const [state, setState] = useState<UsePropertyState>({
    property: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    if (!propertyId) {
      setState({
        property: null,
        loading: false,
        error: 'Property ID is required'
      })
      return
    }

    const fetchProperty = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))

        // Fetch property with related data (agent, location risk profile)
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select(`
            *,
            agents (
              id,
              name,
              email,
              phone,
              trust_score,
              verified,
              verification_level,
              reviews_count,
              average_rating,
              profile_image,
              license_number,
              agency
            ),
            locations (
              barangay,
              city,
              province,
              latitude,
              longitude,
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
              alt_text,
              is_primary,
              display_order
            )
          `)
          .eq('id', propertyId)
          .eq('status', 'active')
          .single()

        if (propertyError) {
          throw new Error(propertyError.message)
        }

        if (!property) {
          throw new Error('Property not found')
        }

        // Transform the data to match our Property interface
        const transformedProperty: Property = {
          id: property.id,
          title: property.title,
          description: property.description,
          price: property.price,
          property_type: property.property_type,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          floor_area: property.floor_area,
          lot_area: property.lot_area,
          location: {
            barangay: property.locations?.barangay || '',
            city: property.locations?.city || '',
            province: property.locations?.province || '',
            latitude: property.locations?.latitude,
            longitude: property.locations?.longitude
          },
          agent_id: property.agent_id,
          agent: property.agents ? {
            id: property.agents.id,
            name: property.agents.name,
            email: property.agents.email,
            phone: property.agents.phone,
            trust_score: property.agents.trust_score,
            verified: property.agents.verified,
            verification_level: property.agents.verification_level,
            reviews_count: property.agents.reviews_count,
            average_rating: property.agents.average_rating,
            profile_image: property.agents.profile_image,
            license_number: property.agents.license_number,
            agency: property.agents.agency
          } : undefined,
          trust_score: property.trust_score,
          risk_profile: {
            crime_rate: property.locations?.risk_profiles?.crime_rate || 'moderate',
            safety_score: property.locations?.risk_profiles?.safety_score || 5,
            flood_risk: property.locations?.risk_profiles?.flood_risk || 'moderate',
            traffic_level: property.locations?.risk_profiles?.traffic_level || 'moderate',
            healthcare_access: property.locations?.risk_profiles?.healthcare_access || 'fair',
            education_access: property.locations?.risk_profiles?.education_access || 'fair'
          },
          environmental_tags: property.environmental_tags || [],
          images: property.property_images 
            ? property.property_images
                .sort((a: any, b: any) => {
                  // Primary images first, then by display_order
                  if (a.is_primary && !b.is_primary) return -1
                  if (!a.is_primary && b.is_primary) return 1
                  return (a.display_order || 0) - (b.display_order || 0)
                })
                .map((img: any) => img.url)
            : [],
          amenities: property.amenities || [],
          status: property.status,
          created_at: property.created_at,
          updated_at: property.updated_at,
          featured: property.featured || false
        }

        setState({
          property: transformedProperty,
          loading: false,
          error: null
        })

      } catch (error) {
        console.error('Error fetching property:', error)
        setState({
          property: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch property'
        })
      }
    }

    fetchProperty()
  }, [propertyId])

  return state
}

// Hook for incrementing property views
export const useIncrementPropertyViews = () => {
  const incrementViews = async (propertyId: string) => {
    try {
      // Use the RPC function to increment views properly
      const { error } = await supabase.rpc('increment_property_views', {
        property_id: propertyId
      })

      if (error) {
        console.error('Error incrementing views:', error)
        // Fallback: just insert a view record without updating count
        await supabase
          .from('property_views')
          .insert({
            property_id: propertyId,
            viewed_at: new Date().toISOString()
          })
      }
    } catch (error) {
      console.error('Error incrementing views:', error)
    }
  }

  return { incrementViews }
}

// Hook for property statistics
export const usePropertyStats = (propertyId: string | undefined) => {
  const [stats, setStats] = useState({
    views: 0,
    inquiries: 0,
    loading: true
  })

  useEffect(() => {
    if (!propertyId) return

    const fetchStats = async () => {
      try {
        // Fetch stats from the properties table itself
        const { data, error } = await supabase
          .from('properties')
          .select('view_count, inquiry_count')
          .eq('id', propertyId)
          .single()

        if (error) {
          throw error
        }

        setStats({
          views: data?.view_count || 0,
          inquiries: data?.inquiry_count || 0,
          loading: false
        })
      } catch (error) {
        console.error('Error fetching property stats:', error)
        setStats(prev => ({ ...prev, loading: false }))
      }
    }

    fetchStats()
  }, [propertyId])

  return stats
} 