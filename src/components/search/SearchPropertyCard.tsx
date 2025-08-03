import React from 'react'
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Property } from '../../types'

interface SearchPropertyCardProps {
  property: Property
  onFavorite?: (propertyId: string) => void
}

export const SearchPropertyCard: React.FC<SearchPropertyCardProps> = ({ 
  property, 
  onFavorite 
}) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₱${(price / 1000000).toFixed(1)}M`
    }
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getTrustBadgeColor = (score: number) => {
    if (score >= 9) return 'bg-green-500'
    if (score >= 7) return 'bg-yellow-500'
    if (score >= 5) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getTrustPercentage = (score: number) => {
    return Math.round(score * 10)
  }

  const getPropertyTags = (property: Property) => {
    const tags = []
    
    // Agent verification
    if (property.agent?.verified) {
      tags.push({ text: 'Verified Agent', color: 'bg-blue-100 text-blue-800' })
    }
    
    // Risk-based tags
    if (property.risk_profile.flood_risk === 'Low' || property.risk_profile.flood_risk === 'Minimal') {
      tags.push({ text: 'Flood-Free', color: 'bg-green-100 text-green-800' })
    }
    
    if (property.risk_profile.crime_rate === 'Low') {
      tags.push({ text: 'Low Crime', color: 'bg-green-100 text-green-800' })
    }
    
    if (property.risk_profile.healthcare_access === 'Excellent' || property.risk_profile.healthcare_access === 'Good') {
      tags.push({ text: 'Near Hospital', color: 'bg-blue-100 text-blue-800' })
    }
    
    // Environmental tags
    if (property.environmental_tags.includes('Near School') || property.risk_profile.education_access === 'Excellent') {
      tags.push({ text: 'Near School', color: 'bg-purple-100 text-purple-800' })
    }
    
    // Risk warnings
    if (property.risk_profile.flood_risk === 'High' || property.risk_profile.flood_risk === 'Very High') {
      tags.push({ text: 'Flood Risk', color: 'bg-red-100 text-red-800' })
    }
    
    return tags.slice(0, 3) // Limit to 3 tags
  }

  const tags = getPropertyTags(property)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Favorite Button */}
      <button
        onClick={() => onFavorite?.(property.id)}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
      >
        <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
      </button>

      {/* Trust Badge */}
      <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-full text-white text-xs font-bold ${getTrustBadgeColor(property.trust_score)}`}>
        {getTrustPercentage(property.trust_score)}% Trust
      </div>

      {/* Property Image */}
      <Link to={`/property/${property.id}`}>
      <div className="relative h-48 bg-gray-200">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Square className="h-12 w-12" />
          </div>
        )}
      </div>
      </Link>

      {/* Property Content */}
      <div className="p-4">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${tag.color}`}
              >
                {tag.text}
              </span>
            ))}
          </div>
        )}

        {/* Property Title */}
        <Link to={`/property/${property.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {property.title}
        </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {property.location.barangay}, {property.location.city}
          </span>
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {property.bedrooms} bed
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms} bath
            </div>
          )}
          {property.floor_area && (
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              {property.floor_area} sqm
            </div>
          )}
        </div>

        {/* Price */}
        <div className="text-2xl font-bold text-gray-900 mb-3">
          {formatPrice(property.price)}
        </div>

        {/* Agent Info */}
        {property.agent && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center">
              {property.agent.profile_image ? (
                <img
                  src={property.agent.profile_image}
                  alt={property.agent.name}
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2 text-sm font-semibold">
                  {property.agent.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-gray-900">Agent {property.agent.name}</div>
              </div>
            </div>
            <Link
              to={`/property/${property.id}`}
              className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 