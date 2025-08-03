import React, { useState } from 'react'
import { Search, Sparkles, Zap, Shield } from 'lucide-react'
import { Button } from '../ui/Button'
import { SearchFilters } from './SearchFilters'

interface FeatureBadgeProps {
  icon: React.ReactNode
  label: string
}

const FeatureBadge: React.FC<FeatureBadgeProps> = ({ icon, label }) => {
  return (
    <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-sm text-gray-600">
      <span className="mr-2">{icon}</span>
      {label}
    </div>
  )
}

export const SmartSearchEngine: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    verifiedOnly: false,
    lowRiskArea: false,
    nearHospital: false,
    nearSchool: false
  })

  const handleFilterChange = (filterName: string, value: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery, 'with filters:', filters)
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Property Search
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ask in natural language and get verified, scam-free results instantly
          </p>
        </div>

        {/* Search Interface */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {/* Smart Search Engine Header */}
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 rounded-full p-2 mr-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Smart Search Engine</h3>
              <p className="text-sm text-gray-600">Powered by AI • Area risk aware • Scam detection</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Try: 'Safe 2BR condo in IT Park under ₱8M, low risk area'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <Button 
                variant="primary" 
                size="md"
                onClick={handleSearch}
                className="px-6"
              >
                Search Now
              </Button>
            </div>
          </div>

          {/* Search Filters */}
          <SearchFilters filters={filters} onFilterChange={handleFilterChange} />

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
            <FeatureBadge
              icon={<Shield className="h-4 w-4 text-green-600" />}
              label="AI Verified Results"
            />
            <FeatureBadge
              icon={<Zap className="h-4 w-4 text-blue-600" />}
              label="Instant Search"
            />
            <FeatureBadge
              icon={<Sparkles className="h-4 w-4 text-purple-600" />}
              label="Scam Protection"
            />
          </div>
        </div>
      </div>
    </section>
  )
} 