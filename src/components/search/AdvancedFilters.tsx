import React, { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import type { SearchFilters } from '../../types'

interface AdvancedFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters)

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handleSearch = () => {
    onFiltersChange(localFilters)
  }

  const handleTrustRankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    handleFilterChange('trust_score_min', value / 10) // Convert 0-100 to 0-10
  }

  return (
    <div className="bg-white rounded-lg p-6">
      {/* First Row - Location, Min Price, Max Price, Property Type */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cebu, Manila, Davao..."
              value={localFilters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Price
          </label>
          <select
            value={localFilters.price_min || ''}
            onChange={(e) => handleFilterChange('price_min', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any</option>
            <option value="1000000">₱1M</option>
            <option value="2000000">₱2M</option>
            <option value="5000000">₱5M</option>
            <option value="10000000">₱10M</option>
            <option value="20000000">₱20M</option>
            <option value="50000000">₱50M</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price
          </label>
          <select
            value={localFilters.price_max || ''}
            onChange={(e) => handleFilterChange('price_max', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any</option>
            <option value="2000000">₱2M</option>
            <option value="5000000">₱5M</option>
            <option value="10000000">₱10M</option>
            <option value="20000000">₱20M</option>
            <option value="50000000">₱50M</option>
            <option value="100000000">₱100M</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <select
            value={localFilters.property_type || ''}
            onChange={(e) => handleFilterChange('property_type', e.target.value as SearchFilters['property_type'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="House">House</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Lot">Lot</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>
      </div>

      {/* Second Row - TrustRank, Verified Agents, Environmental Risk, Bedrooms */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* TrustRank Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TrustRank
          </label>
          <div className="px-3">
            <input
              type="range"
              min="0"
              max="100"
              value={(localFilters.trust_score_min || 0) * 10}
              onChange={handleTrustRankChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(localFilters.trust_score_min || 0) * 10}%, #E5E7EB ${(localFilters.trust_score_min || 0) * 10}%, #E5E7EB 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="font-medium text-blue-600">
                {Math.round((localFilters.trust_score_min || 0) * 10)}%+
              </span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Verified Agents Only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verified Agents Only
          </label>
          <div className="flex items-center h-10">
            <input
              type="checkbox"
              checked={localFilters.verified_only || false}
              onChange={(e) => handleFilterChange('verified_only', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Show only verified agents
            </label>
          </div>
        </div>

        {/* Environmental Risk */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Environmental Risk
          </label>
          <select
            value={localFilters.low_risk_only ? 'low' : ''}
            onChange={(e) => handleFilterChange('low_risk_only', e.target.value === 'low')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any Risk Level</option>
            <option value="low">Low Risk Only</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </label>
          <select
            value={localFilters.bedrooms || ''}
            onChange={(e) => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any</option>
            <option value="1">1 bedroom</option>
            <option value="2">2 bedrooms</option>
            <option value="3">3 bedrooms</option>
            <option value="4">4 bedrooms</option>
            <option value="5">5+ bedrooms</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </button>
      </div>
    </div>
  )
} 