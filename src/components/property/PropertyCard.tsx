import React from 'react'
import { MapPin, Bed, Bath, Square, Shield, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Property } from '../../types'

interface PropertyCardProps {
  property: Property
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
      case 'Minimal':
        return 'text-green-600 bg-green-100'
      case 'Moderate':
        return 'text-yellow-600 bg-yellow-100'
      case 'High':
      case 'Very High':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
        
        {/* Trust Score Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${getTrustScoreColor(property.trust_score)}`}>
          Trust: {property.trust_score}/10
        </div>
        
        {/* Verified Badge */}
        {property.agent?.verified && (
          <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </div>
        )}
      </div>
      </Link>

      {/* Property Details */}
      <div className="p-4">
        {/* Price */}
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {formatPrice(property.price)}
        </div>

        {/* Title */}
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
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
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
              {property.floor_area}m²
            </div>
          )}
        </div>

        {/* Risk Profile */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(property.risk_profile.crime_rate)}`}>
            Crime: {property.risk_profile.crime_rate}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(property.risk_profile.flood_risk)}`}>
            Flood: {property.risk_profile.flood_risk}
          </span>
        </div>

        {/* View Details Button */}
        <Link
          to={`/property/${property.id}`}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Link>
      </div>
    </div>
  )
} 