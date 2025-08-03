import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SearchPropertyCard } from './SearchPropertyCard'
import { usePropertySearch } from '../../hooks/usePropertySearch'
import type { SearchFilters } from '../../types'

interface SearchResultsProps {
  searchQuery: string
  filters: SearchFilters
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  filters
}) => {
  const [sortBy, setSortBy] = useState('trust-high-low')
  const { properties, loading, error, totalCount } = usePropertySearch(searchQuery, filters, sortBy)

  const handleFavorite = (propertyId: string) => {
    console.log('Favorite property:', propertyId)
    // TODO: Implement favorite functionality
  }

  // For demo purposes, show all properties when no search/filters
  const shouldShowResults = searchQuery || Object.keys(filters).length > 0 || true

  if (!shouldShowResults) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Search</h3>
          <p className="text-gray-600">Use the AI search or advanced filters above to find your perfect home.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="py-8">
        {/* Loading Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>

        {/* Loading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters to find more properties.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Found {totalCount} trusted properties
        </h2>
        
        {/* Sort Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort by:
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white cursor-pointer"
            >
              <option value="trust-high-low" className="bg-white text-gray-900">TrustRank (High to Low)</option>
              <option value="trust-low-high" className="bg-white text-gray-900">TrustRank (Low to High)</option>
              <option value="price-low-high" className="bg-white text-gray-900">Price (Low to High)</option>
              <option value="price-high-low" className="bg-white text-gray-900">Price (High to Low)</option>
              <option value="newest" className="bg-white text-gray-900">Newest First</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <SearchPropertyCard
            key={property.id}
            property={property}
            onFavorite={handleFavorite}
          />
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Load More Properties
        </button>
      </div>
    </div>
  )
} 