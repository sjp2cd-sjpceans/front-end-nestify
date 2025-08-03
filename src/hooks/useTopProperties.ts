import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Property } from '../types'

interface UseTopPropertiesResult {
  properties: Property[]
  loading: boolean
  error: string | null
}

export const useTopProperties = (): UseTopPropertiesResult => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopProperties = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch top 3 properties with all related data
        // Note: risk_profiles is related through locations, not directly to properties
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select(`
            id,
            title,
            description,
            price,
            property_type,
            bedrooms,
            bathrooms,
            floor_area,
            lot_area,
            trust_score,
            amenities,
            status,
            created_at,
            updated_at,
            featured,
            agent_id,
            location_id,
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
              id,
              region,
              province,
              city,
              barangay,
              latitude,
              longitude,
              risk_profiles (
                crime_rate,
                safety_score,
                flood_risk,
                typhoon_risk,
                earthquake_risk,
                traffic_level,
                healthcare_access,
                education_access
              )
            )
          `)
          .eq('status', 'active')
          .order('trust_score', { ascending: false })
          .limit(3)

        if (propertiesError) {
          throw new Error(propertiesError.message)
        }

        if (!propertiesData || propertiesData.length === 0) {
          setProperties([])
          return
        }

        console.log('Raw Supabase data:', propertiesData) // Debug log

        // Fetch images for each property
        const propertiesWithImages = await Promise.all(
          propertiesData.map(async (property: any) => {
            const { data: imagesData } = await supabase
              .from('property_images')
              .select('url, is_primary, display_order')
              .eq('property_id', property.id)
              .order('display_order', { ascending: true })

            // Get environmental tags for the property
            const { data: tagsData } = await supabase
              .from('property_environmental_tags')
              .select(`
                environmental_tags (
                  name
                )
              `)
              .eq('property_id', property.id)

            const images = imagesData?.map(img => img.url) || []
            const environmentalTags = tagsData?.map((tag: any) => tag.environmental_tags?.name).filter(Boolean) || []

            // Get the agent, location and risk profile data
            // Supabase joins can return data as direct objects or arrays depending on the relationship
            let agent = null
            if (property.agents) {
              // If it's an array, take the first element
              if (Array.isArray(property.agents) && property.agents.length > 0) {
                agent = property.agents[0]
              } 
              // If it's a direct object (single relationship), use it directly
              else if (!Array.isArray(property.agents) && typeof property.agents === 'object') {
                agent = property.agents
              }
            }
            
            // Handle location data similarly to agent data
            let location = null
            if (property.locations) {
              // If it's an array, take the first element
              if (Array.isArray(property.locations) && property.locations.length > 0) {
                location = property.locations[0]
              }
              // If it's a direct object (single relationship), use it directly
              else if (!Array.isArray(property.locations) && typeof property.locations === 'object') {
                location = property.locations
              }
            }
            
            const riskProfile = location?.risk_profiles?.[0] // risk_profiles comes through locations

            console.log('Property agent data:', { 
              propertyId: property.id, 
              agent, 
              agentsArray: property.agents,
              isArray: Array.isArray(property.agents),
              agentType: typeof property.agents,
              hasAgent: !!agent,
              agentProfileImage: agent?.profile_image,
              agentName: agent?.name
            }) // Enhanced debug log

            console.log('Property location data:', {
              propertyId: property.id,
              location,
              locationsArray: property.locations,
              isLocationArray: Array.isArray(property.locations),
              locationType: typeof property.locations,
              hasLocation: !!location,
              barangay: location?.barangay,
              city: location?.city
            }) // Location debug log

            // Transform the data to match our Property type
            const transformedProperty: Property = {
              id: property.id,
              title: property.title,
              description: property.description,
              price: property.price,
              property_type: property.property_type as Property['property_type'],
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              floor_area: property.floor_area,
              lot_area: property.lot_area,
              location: {
                barangay: location?.barangay || '',
                city: location?.city || '',
                province: location?.province || '',
                latitude: location?.latitude,
                longitude: location?.longitude
              },
              agent_id: property.agent_id,
              agent: agent ? {
                id: agent.id,
                name: agent.name,
                email: agent.email,
                phone: agent.phone,
                trust_score: agent.trust_score,
                verified: agent.verified,
                verification_level: agent.verification_level,
                reviews_count: agent.reviews_count,
                average_rating: agent.average_rating,
                profile_image: agent.profile_image,
                license_number: agent.license_number,
                agency: agent.agency
              } : undefined,
              trust_score: property.trust_score,
              risk_profile: {
                crime_rate: riskProfile?.crime_rate as Property['risk_profile']['crime_rate'] || 'Low',
                safety_score: riskProfile?.safety_score || 5,
                flood_risk: riskProfile?.flood_risk as Property['risk_profile']['flood_risk'] || 'Low',
                traffic_level: riskProfile?.traffic_level as Property['risk_profile']['traffic_level'] || 'Moderate',
                healthcare_access: riskProfile?.healthcare_access as Property['risk_profile']['healthcare_access'] || 'Fair',
                education_access: riskProfile?.education_access as Property['risk_profile']['education_access'] || 'Fair'
              },
              environmental_tags: environmentalTags,
              images,
              amenities: property.amenities || [],
              status: property.status as Property['status'],
              created_at: property.created_at,
              updated_at: property.updated_at,
              featured: property.featured
            }

            console.log('Transformed property with agent:', { 
              propertyId: transformedProperty.id, 
              agentExists: !!transformedProperty.agent,
              agentName: transformedProperty.agent?.name 
            }) // Debug log

            return transformedProperty
          })
        )

        console.log('Final properties with agents:', propertiesWithImages.map(p => ({ 
          id: p.id, 
          title: p.title,
          agent: p.agent?.name 
        }))) // Debug log

        setProperties(propertiesWithImages)
      } catch (err) {
        console.error('Error fetching top properties:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch properties')
      } finally {
        setLoading(false)
      }
    }

    fetchTopProperties()
  }, [])

  return { properties, loading, error }
} 