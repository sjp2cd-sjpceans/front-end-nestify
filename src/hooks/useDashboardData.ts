import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Property, User } from '../types'

interface RecentlyViewedProperty {
  id: string
  title: string
  price: number
  location: {
    barangay: string
    city: string
  }
  images: string[]
  viewed_at: string
}

interface UseDashboardDataResult {
  user: User | null
  recentlyViewed: RecentlyViewedProperty[]
  savedListings: Property[]
  loading: boolean
  error: string | null
}

// Mock data for saved listings (since no favorites table exists yet)
const mockSavedListings: Property[] = [
  {
    id: 'mock-1',
    title: 'Luxury 1BR Condo',
    description: 'Modern luxury condo with city view',
    price: 4500000, // ₱45,000
    property_type: 'Condo',
    bedrooms: 1,
    bathrooms: 1,
    floor_area: 45,
    location: {
      barangay: 'Barangay 1',
      city: 'Taguig City'
    },
    agent_id: 'mock-agent-1',
    agent: {
      id: 'mock-agent-1',
      name: 'Juan Dela Cruz',
      email: 'juan@example.com',
      trust_score: 8.5,
      verified: true,
      verification_level: 'Premium Verified',
      reviews_count: 45,
      average_rating: 4.8
    },
    trust_score: 9.2,
    risk_profile: {
      crime_rate: 'Low',
      safety_score: 8.5,
      flood_risk: 'Low',
      traffic_level: 'Moderate',
      healthcare_access: 'Good',
      education_access: 'Excellent'
    },
    environmental_tags: ['Verified', 'Price Drop', 'Low Risk'],
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    amenities: ['Swimming Pool', 'Gym', '24/7 Security'],
    status: 'active',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    featured: true
  },
  {
    id: 'mock-2',
    title: 'Family House',
    description: 'Spacious family home in quiet neighborhood',
    price: 3200000, // ₱32,000
    property_type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    floor_area: 120,
    location: {
      barangay: 'Barangay 15',
      city: 'Marikina City'
    },
    agent_id: 'mock-agent-2',
    agent: {
      id: 'mock-agent-2',
      name: 'Maria Santos',
      email: 'maria@example.com',
      trust_score: 9.1,
      verified: true,
      verification_level: 'Document Verified',
      reviews_count: 32,
      average_rating: 4.9
    },
    trust_score: 8.8,
    risk_profile: {
      crime_rate: 'Low',
      safety_score: 9.0,
      flood_risk: 'Minimal',
      traffic_level: 'Light',
      healthcare_access: 'Fair',
      education_access: 'Good'
    },
    environmental_tags: ['Verified', 'Low Risk'],
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
    amenities: ['Garden', 'Garage', 'Security'],
    status: 'active',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    featured: false
  }
]

// Mock recently viewed properties
const mockRecentlyViewed: RecentlyViewedProperty[] = [
  {
    id: 'recent-1',
    title: '2BR Apartment',
    price: 2600000, // ₱26k
    location: {
      barangay: 'Barangay 12',
      city: 'Mandaluyong'
    },
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    viewed_at: '2024-01-20T10:30:00Z'
  },
  {
    id: 'recent-2',
    title: 'Studio Condo',
    price: 2400000, // ₱24k
    location: {
      barangay: 'Barangay 5',
      city: 'Ortigas'
    },
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    viewed_at: '2024-01-19T15:45:00Z'
  }
]

export const useDashboardData = (): UseDashboardDataResult => {
  const [user, setUser] = useState<User | null>(null)
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProperty[]>([])
  const [savedListings] = useState<Property[]>(mockSavedListings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get current user
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          // Fetch user profile
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single()

          if (userError) {
            console.error('Error fetching user:', userError)
            // Fallback to mock user data
            setUser({
              id: 'mock-user-1',
              email: 'kenzo@example.com',
              name: 'Kenzo',
              role: 'buyer',
              verified: true,
              created_at: '2024-01-01T00:00:00Z'
            })
          } else {
            setUser(userData)
          }

          // Try to fetch recently viewed properties
          const { data: viewsData, error: viewsError } = await supabase
            .from('property_views')
            .select(`
              property_id,
              viewed_at,
              properties (
                id,
                title,
                price,
                locations (
                  barangay,
                  city
                ),
                property_images (
                  url
                )
              )
            `)
            .eq('user_id', authUser.id)
            .order('viewed_at', { ascending: false })
            .limit(3)

          if (viewsError || !viewsData || viewsData.length === 0) {
            // Use mock data if no real views found
            setRecentlyViewed(mockRecentlyViewed)
          } else {
            // Transform real data to match interface
            const transformedViews: RecentlyViewedProperty[] = viewsData.map((view: any) => ({
              id: view.properties.id,
              title: view.properties.title,
              price: view.properties.price,
              location: {
                barangay: view.properties.locations?.barangay || 'Unknown',
                city: view.properties.locations?.city || 'Unknown'
              },
              images: view.properties.property_images?.map((img: any) => img.url) || [],
              viewed_at: view.viewed_at
            }))
            setRecentlyViewed(transformedViews)
          }
        } else {
          // No user logged in, use mock data
          setUser({
            id: 'mock-user-1',
            email: 'kenzo@example.com',
            name: 'Kenzo',
            role: 'buyer',
            verified: true,
            created_at: '2024-01-01T00:00:00Z'
          })
          setRecentlyViewed(mockRecentlyViewed)
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err)
        setError('Failed to load dashboard data')
        // Set fallback data
        setUser({
          id: 'mock-user-1',
          email: 'kenzo@example.com',
          name: 'Kenzo',
          role: 'buyer',
          verified: true,
          created_at: '2024-01-01T00:00:00Z'
        })
        setRecentlyViewed(mockRecentlyViewed)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return {
    user,
    recentlyViewed,
    savedListings,
    loading,
    error
  }
} 