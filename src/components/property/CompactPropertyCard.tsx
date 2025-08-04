import React from 'react'
import { MapPin, Bookmark, MessageCircle, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Property } from '../../types'

interface CompactPropertyCardProps {
  property: Property
}

export const CompactPropertyCard: React.FC<CompactPropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₱${(price / 1000000).toFixed(1)}M`
    } else if (price >= 1000) {
      return `₱${(price / 1000).toFixed(0)}k`
    }
    return `₱${price.toLocaleString()}`
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600 bg-green-100'
    if (score >= 7) return 'text-blue-600 bg-blue-100'
    if (score >= 5) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
      case 'Minimal':
        return 'bg-green-100 text-green-700'
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-700'
      case 'High':
      case 'Very High':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Property Image */}
      <div className="relative">
        <Link to={`/property/${property.id}`}>
          <div className="h-40 bg-gray-200">
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Shield className="h-8 w-8" />
              </div>
            )}
          </div>
        </Link>
        
        {/* Verified Badge */}
        {property.agent?.verified && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </div>
        )}
        
        {/* Trust Score */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getTrustScoreColor(property.trust_score)}`}>
          Trust: {property.trust_score}/10
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        {/* Price */}
        <div className="text-xl font-bold text-gray-900 mb-2">
          {formatPrice(property.price)}
        </div>

        {/* Title */}
        <Link to={`/property/${property.id}`}>
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="text-xs">
            {property.location.barangay}, {property.location.city}
          </span>
        </div>

        {/* Risk Tags */}
        <div className="flex gap-1 mb-4">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(property.risk_profile.crime_rate)}`}>
            Crime: {property.risk_profile.crime_rate}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(property.risk_profile.flood_risk)}`}>
            Flood: {property.risk_profile.flood_risk}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
            <Bookmark className="h-3 w-3 mr-1" />
            Save
          </button>
          <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
            <MessageCircle className="h-3 w-3 mr-1" />
            Chat
          </button>
        </div>
      </div>
    </div>
  )
} 