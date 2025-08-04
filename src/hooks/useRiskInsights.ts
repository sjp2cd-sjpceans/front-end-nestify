import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { RiskProfile } from '../types'

interface LocationRiskSummary {
  location: string
  overall_risk: 'Low' | 'Moderate' | 'High'
  flood_risk: RiskProfile['flood_risk']
  crime_rate: RiskProfile['crime_rate']
  safety_score: number
}

interface UseRiskInsightsResult {
  locationRisk: LocationRiskSummary | null
  riskAlerts: string[]
  loading: boolean
  error: string | null
}

// Mock risk alerts based on current area assessment
const generateRiskAlerts = (riskData: LocationRiskSummary | null): string[] => {
  if (!riskData) return []
  
  const alerts: string[] = []
  
  if (riskData.flood_risk === 'High' || riskData.flood_risk === 'Very High') {
    alerts.push('High flood risk detected in your search area')
  }
  
  if (riskData.crime_rate === 'High') {
    alerts.push('Consider areas with better security ratings')
  }
  
  if (riskData.safety_score < 6) {
    alerts.push('Safety score below average - verify latest security updates')
  }
  
  return alerts
}

export const useRiskInsights = (userLocation?: string): UseRiskInsightsResult => {
  const [locationRisk, setLocationRisk] = useState<LocationRiskSummary | null>(null)
  const [riskAlerts, setRiskAlerts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRiskInsights = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try to fetch real risk data from a popular location (e.g., Makati, QC)
        
        const { data: riskData, error: riskError } = await supabase
          .from('risk_profiles')
          .select(`
            crime_rate,
            safety_score,
            flood_risk,
            traffic_level,
            locations (
              city,
              barangay
            )
          `)
          .limit(1)
          .single()

        if (riskError || !riskData) {
          console.log('No real risk data found, using mock data')
          // Use mock data if no real data available
          const mockRiskSummary: LocationRiskSummary = {
            location: 'Makati, QC',
            overall_risk: 'Moderate',
            flood_risk: 'Low',
            crime_rate: 'Moderate',
            safety_score: 7.5
          }
          setLocationRisk(mockRiskSummary)
          setRiskAlerts(['Enable scam alerts for better protection'])
        } else {
          // Transform real data
          const location = Array.isArray(riskData.locations) && riskData.locations.length > 0 
            ? riskData.locations[0] 
            : null
          
          const locationName = location 
            ? `${location.barangay}, ${location.city}`
            : 'Your Area'
          
          // Calculate overall risk based on multiple factors
          let overallRisk: 'Low' | 'Moderate' | 'High' = 'Low'
          if (
            riskData.crime_rate === 'High' || 
            riskData.flood_risk === 'High' || 
            riskData.flood_risk === 'Very High' ||
            riskData.safety_score < 5
          ) {
            overallRisk = 'High'
          } else if (
            riskData.crime_rate === 'Moderate' || 
            riskData.flood_risk === 'Moderate' ||
            riskData.safety_score < 7
          ) {
            overallRisk = 'Moderate'
          }

          const riskSummary: LocationRiskSummary = {
            location: locationName,
            overall_risk: overallRisk,
            flood_risk: riskData.flood_risk,
            crime_rate: riskData.crime_rate,
            safety_score: riskData.safety_score
          }

          setLocationRisk(riskSummary)
          
          // Generate alerts based on real data
          const alerts = generateRiskAlerts(riskSummary)
          setRiskAlerts(alerts.length > 0 ? alerts : ['All risk factors look good in your area'])
        }
      } catch (err) {
        console.error('Risk insights fetch error:', err)
        setError('Failed to load risk insights')
        
        // Fallback to mock data
        const mockRiskSummary: LocationRiskSummary = {
          location: 'Makati, QC',
          overall_risk: 'Moderate',
          flood_risk: 'Low',
          crime_rate: 'Moderate',
          safety_score: 7.5
        }
        setLocationRisk(mockRiskSummary)
        setRiskAlerts(['Enable scam alerts for better protection'])
      } finally {
        setLoading(false)
      }
    }

    fetchRiskInsights()
  }, [userLocation])

  return {
    locationRisk,
    riskAlerts,
    loading,
    error
  }
} 