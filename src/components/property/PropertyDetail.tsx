import React, { useState } from 'react'
import { MapPin, Bed, Bath, Square, Shield, Star, Phone, Heart, Share2, Mail, Calendar, Flag, Waves } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Property } from '../../types'
import { usePropertyStats } from '../../hooks/useProperty'
import { Header } from '../ui/Header'

interface PropertyDetailProps {
  property: Property
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const stats = usePropertyStats(property.id)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatPriceShort = (price: number) => {
    if (price >= 1000000) {
      return `₱${(price / 1000000).toFixed(1)}M`
    }
    if (price >= 1000) {
      return `₱${(price / 1000).toFixed(0)}K`
    }
    return `₱${price.toLocaleString()}`
  }

  const getTrustPercentage = (score: number) => {
    return Math.round(score * 10)
  }

  const getTrustBadgeColor = (score: number) => {
    if (score >= 9) return 'bg-green-500'
    if (score >= 7) return 'bg-blue-500'
    if (score >= 5) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  // Helper functions for risk profile data
  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'minimal':
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'moderate':
      case 'fair':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high':
      case 'heavy':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'very_high':
      case 'very_heavy':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const formatRiskLevel = (risk: string) => {
    return risk?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-blue-600'
    if (score >= 4) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPropertyTags = () => {
    const tags = []
    
    // Verified Agent
    if (property.agent?.verified) {
      tags.push({ text: 'Verified Agent', color: 'bg-blue-500 text-white' })
    }
    
    // Flood-Free
    if (property.risk_profile.flood_risk === 'Low' || property.risk_profile.flood_risk === 'Minimal') {
      tags.push({ text: 'Flood-Free', color: 'bg-green-500 text-white' })
    }
    
    return tags
  }

  const calculatePricePerSqm = () => {
    if (property.floor_area && property.floor_area > 0) {
      return Math.round(property.price / property.floor_area)
    }
    return null
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    // TODO: Implement favorite functionality with Supabase
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleInquire = () => {
    // TODO: Implement inquiry functionality
    console.log('Inquire about property:', property.id)
  }

  const handleBookVisit = () => {
    // TODO: Implement booking functionality
    console.log('Book visit for property:', property.id)
  }

  const handleCallAgent = () => {
    if (property.agent?.phone) {
      window.open(`tel:${property.agent.phone}`, '_self')
    }
  }

  const tags = getPropertyTags()
  const pricePerSqm = calculatePricePerSqm()

  return (
    <>
      <Header />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link to="/search" className="hover:text-gray-900 transition-colors">
              Search
            </Link>
            <span>›</span>
            <span className="text-gray-900 font-medium truncate">
              {property.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {/* Trust Badge and Tags */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getTrustBadgeColor(property.trust_score)}`}>
                {getTrustPercentage(property.trust_score)}% Trust
              </span>
              {tags.map((tag, index) => (
                <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${tag.color}`}>
                  {tag.text}
                </span>
              ))}
            </div>

            {/* Property Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
            
            {/* Location */}
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">
                {property.location.barangay}, {property.location.city}
                {property.location.province && `, ${property.location.province}`}
              </span>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900 mb-3">
              {formatPrice(property.price)}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-lg border transition-colors ${
                  isFavorited 
                    ? 'bg-red-50 border-red-200 text-red-600' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {property.images.length > 0 ? (
              <>
                {/* Main Image */}
                <div className="relative">
                  <img
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-96 object-cover"
                  />
                  {property.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length} Photos
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {property.images.length > 1 && (
                  <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                      {property.images.slice(0, 6).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`View image ${index + 1} of ${property.title}`}
                          className={`flex-shrink-0 relative w-20 h-16 sm:w-24 sm:h-18 rounded-md overflow-hidden bg-cover bg-center transition-all duration-200 ${
                            index === currentImageIndex 
                              ? 'ring-2 ring-blue-500 ring-offset-1 shadow-md' 
                              : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1 hover:shadow-sm'
                          }`}
                          style={{
                            backgroundImage: `url(${image})`
                          }}
                        >
                          {index === currentImageIndex && (
                            <div className="absolute inset-0 bg-blue-500/15 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                            </div>
                          )}
                        </button>
                      ))}
                      
                      {/* Show "+X more" if there are more than 6 images */}
                      {property.images.length > 6 && (
                        <div className="flex-shrink-0 w-20 h-16 sm:w-24 sm:h-18 bg-gradient-to-br from-gray-50 to-gray-100 rounded-md flex flex-col items-center justify-center text-gray-600 text-xs font-medium hover:from-gray-100 hover:to-gray-200 hover:shadow-sm transition-all cursor-pointer border border-gray-200">
                          <span className="text-sm font-semibold">+{property.images.length - 6}</span>
                          <span className="text-[10px] opacity-70">more</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Image counter for mobile */}
                    <div className="flex justify-center mt-3 sm:hidden">
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {currentImageIndex + 1} of {property.images.length}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <Square className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium text-gray-900 capitalize">{property.property_type}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Bedrooms</span>
                  <span className="font-medium text-gray-900">{property.bedrooms || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Bathrooms</span>
                  <span className="font-medium text-gray-900">{property.bathrooms || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Floor Area</span>
                  <span className="font-medium text-gray-900">{property.floor_area ? `${property.floor_area} sqm` : 'N/A'}</span>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Floor Level</span>
                  <span className="font-medium text-gray-900">{property.floor_number ? `${property.floor_number}th Floor` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Parking</span>
                  <span className="font-medium text-gray-900">{property.parking_spaces ? `${property.parking_spaces} Slot${property.parking_spaces > 1 ? 's' : ''}` : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Furnishing</span>
                  <span className="font-medium text-gray-900">Semi-Furnished</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Year Built</span>
                  <span className="font-medium text-gray-900">{property.year_built || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental & Safety Data */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Environmental & Safety Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Flood Risk */}
              <div className="text-center p-4 rounded-lg border">
                <div className="flex flex-col items-center">
                  <Waves className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">Flood Risk</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(property.risk_profile?.flood_risk || 'low')}`}>
                    {formatRiskLevel(property.risk_profile?.flood_risk || 'Low')}
                  </span>
                </div>
              </div>

              {/* Crime Score */}
              <div className="text-center p-4 rounded-lg border">
                <div className="flex flex-col items-center">
                  <Shield className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">Crime Score</h3>
                  <span className={`text-lg font-bold ${getScoreColor(property.risk_profile?.safety_score || 8.5)}`}>
                    {property.risk_profile?.safety_score || '8.5'}/10
                  </span>
                </div>
              </div>

              {/* Hospital Distance */}
              <div className="text-center p-4 rounded-lg border">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 mb-3 flex items-center justify-center">
                    <svg className="h-8 w-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6H2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2H8c-1.1 0-2-.9-2-2V6z"/>
                      <path d="M6 2C4.9 2 4 2.9 4 4v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H6zm6 2h2v3h3v2h-3v3h-2V9H9V7h3V4z"/>
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Hospital Distance</h3>
                  <span className="text-orange-600 font-semibold">
                    {property.risk_profile?.nearest_hospital_km ? `${property.risk_profile.nearest_hospital_km} km` : '1.2 km'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {property.bedrooms && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Bed className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Bath className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                </div>
              )}
              {property.floor_area && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Square className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">{property.floor_area}m²</div>
                    <div className="text-sm text-gray-600">Floor Area</div>
                  </div>
                </div>
              )}
              {property.lot_area && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Square className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">{property.lot_area}m²</div>
                    <div className="text-sm text-gray-600">Lot Area</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agent Info */}
          {property.agent && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                {property.agent.profile_image ? (
                  <img
                    src={property.agent.profile_image}
                    alt={property.agent.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4 text-xl font-semibold">
                    {property.agent.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{property.agent.name}</h3>
                  {property.agent.verified && (
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      <Shield className="h-4 w-4 mr-1" />
                      Verified Agent
                    </div>
                  )}
                </div>
              </div>

              {/* Agent Rating */}
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(property.agent?.average_rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({property.agent?.reviews_count || 0} reviews)
                </span>
              </div>

              {/* Agent Experience */}
              <p className="text-sm text-gray-600 mb-6">
                {property.agent.reviews_count > 0 && `${Math.floor(property.agent.reviews_count / 12)} years experience • `}
                {property.agent.reviews_count}+ sales
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleInquire}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Inquire Now
                </button>
                <button
                  onClick={handleBookVisit}
                  className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center shadow-sm"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a Visit
                </button>
                <button
                  onClick={handleCallAgent}
                  className="w-full bg-green-50 border border-green-200 text-green-700 py-3 px-4 rounded-lg font-semibold hover:bg-green-100 transition-colors flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Agent
                </button>
              </div>

              {/* Report Listing */}
              <button className="w-full mt-4 bg-red-50 border border-red-200 text-red-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center">
                <Flag className="h-4 w-4 mr-1" />
                Report Listing
              </button>
            </div>
          )}

          {/* Property Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Listed</span>
                <span className="font-semibold text-gray-900">
                  {getTimeAgo(property.created_at)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Views</span>
                <span className="font-semibold text-gray-900">
                  {stats.loading ? '...' : stats.views}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Inquiries</span>
                <span className="font-semibold text-gray-900">
                  {stats.loading ? '...' : stats.inquiries}
                </span>
              </div>
              {pricePerSqm && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price per sqm</span>
                  <span className="font-semibold text-gray-900">
                    {formatPriceShort(pricePerSqm)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
} 