import React from 'react'
import { Shield, AlertTriangle, Hospital, GraduationCap } from 'lucide-react'

interface FilterChipProps {
  label: string
  icon: React.ReactNode
  active?: boolean
  onClick?: () => void
}

const FilterChip: React.FC<FilterChipProps> = ({ label, icon, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-100 text-blue-800 border border-blue-300'
          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  )
}

interface SearchFiltersProps {
  filters: {
    verifiedOnly: boolean
    lowRiskArea: boolean
    nearHospital: boolean
    nearSchool: boolean
  }
  onFilterChange: (filterName: string, value: boolean) => void
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <FilterChip
        label="Verified Only"
        icon={<Shield className="h-4 w-4 text-green-600" />}
        active={filters.verifiedOnly}
        onClick={() => onFilterChange('verifiedOnly', !filters.verifiedOnly)}
      />
      
      <FilterChip
        label="Low Risk Area"
        icon={<AlertTriangle className="h-4 w-4 text-blue-600" />}
        active={filters.lowRiskArea}
        onClick={() => onFilterChange('lowRiskArea', !filters.lowRiskArea)}
      />
      
      <FilterChip
        label="Near Hospital"
        icon={<Hospital className="h-4 w-4 text-red-600" />}
        active={filters.nearHospital}
        onClick={() => onFilterChange('nearHospital', !filters.nearHospital)}
      />
      
      <FilterChip
        label="Near School"
        icon={<GraduationCap className="h-4 w-4 text-purple-600" />}
        active={filters.nearSchool}
        onClick={() => onFilterChange('nearSchool', !filters.nearSchool)}
      />
    </div>
  )
} 