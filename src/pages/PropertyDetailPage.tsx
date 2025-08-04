import React, { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { PropertyDetail } from '../components/property/PropertyDetail'
import { Chatbot } from '../components/ui/Chatbot'
import { Header } from '../components/ui/Header'
import { DashboardHeader } from '../components/ui/DashboardHeader'
import { useProperty, useIncrementPropertyViews } from '../hooks/useProperty'
import { useAuth } from '../hooks/useAuth'
import { Loader2, AlertCircle } from 'lucide-react'

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { property, loading, error } = useProperty(id)
  const { incrementViews } = useIncrementPropertyViews()
  const { isAuthenticated } = useAuth()

  // Increment views when property loads
  useEffect(() => {
    if (property && id) {
      incrementViews(id)
    }
  }, [property, id, incrementViews])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated ? <DashboardHeader /> : <Header />}
        {/* Loading State */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated ? <DashboardHeader /> : <Header />}
        {/* Error State */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h2>
            <p className="text-gray-600 mb-6">
              The property you're looking for doesn't exist or may have been removed.
            </p>
            <button 
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return <Navigate to="/search" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated ? <DashboardHeader /> : <Header />}
      <PropertyDetail property={property} />
      {/* Property-specific Chatbot */}
      <Chatbot property={property} />
    </div>
  )
} 