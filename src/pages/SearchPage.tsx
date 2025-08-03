import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Header } from '../components/ui/Header'
import { AISearchBar, AdvancedFilters, SearchResults } from '../components/search'
import type { SearchFilters } from '../types'

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Initialize from URL parameters
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
    }

    // Initialize filters from URL parameters
    const newFilters: SearchFilters = {}
    
    if (searchParams.get('verified') === 'true') {
      newFilters.verified_only = true
    }
    
    if (searchParams.get('lowRisk') === 'true') {
      newFilters.low_risk_only = true
    }
    
    if (searchParams.get('nearHospital') === 'true') {
      newFilters.near_hospital = true
    }
    
    if (searchParams.get('nearSchool') === 'true') {
      newFilters.near_school = true
    }

    const location = searchParams.get('location')
    if (location) {
      newFilters.location = location
    }

    const priceMin = searchParams.get('priceMin')
    if (priceMin) {
      newFilters.price_min = parseInt(priceMin)
    }

    const priceMax = searchParams.get('priceMax')
    if (priceMax) {
      newFilters.price_max = parseInt(priceMax)
    }

    if (Object.keys(newFilters).length > 0) {
      setFilters(newFilters)
      setShowAdvancedFilters(true) // Show advanced filters if any are set
    }
  }, [searchParams])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect Home
          </h1>
          
          {/* AI Search Bar */}
          <AISearchBar 
            onSearch={handleSearch}
            placeholder="Ask our AI in natural language. Try: '2BR condo in Cebu under ₱8M, flood-free, near mall'"
          />
          
          {/* OR Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 font-medium">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Advanced Filter Search
          </button>
          
          <p className="text-gray-600 mt-2">
            Use detailed filters to narrow down your search preferences
          </p>
        </div>
      </section>

      {/* Advanced Filters Section */}
      {showAdvancedFilters && (
        <section className="bg-white border-t border-gray-200 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <AdvancedFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </section>
      )}

      {/* Search Results Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <SearchResults 
            searchQuery={searchQuery}
            filters={filters}
          />
        </div>
      </section>
    </div>
  )
} 