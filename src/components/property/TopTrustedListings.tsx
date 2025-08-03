import React from 'react'
import { PropertyCard } from './PropertyCard'
import { useTopProperties } from '../../hooks/useTopProperties'

export const TopTrustedListings: React.FC = () => {
  const { properties, loading, error } = useTopProperties()

  if (loading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Top Trusted Listings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked properties from our most trusted and verified agents
            </p>
          </div>

          {/* Loading State */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Top Trusted Listings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked properties from our most trusted and verified agents
            </p>
          </div>

          {/* Error State */}
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium mb-2">Unable to load properties</p>
              <p className="text-red-500 text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (properties.length === 0) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Top Trusted Listings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked properties from our most trusted and verified agents
            </p>
          </div>

          {/* Empty State */}
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-gray-600">No properties available at the moment.</p>
              <p className="text-gray-500 text-sm mt-2">Please check back later for new listings.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Top Trusted Listings
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked properties from our most trusted and verified agents
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
            />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  )
} 