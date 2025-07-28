import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Property } from '../../../services/property.service';

interface PropertyCardProps {
  property: Property;
  onSave?: (propertyId: string) => void;
  onUnsave?: (propertyId: string) => void;
  isSaved?: boolean;
  showMatchPercentage?: boolean;
  matchPercentage?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSave,
  onUnsave,
  isSaved = false,
  showMatchPercentage = false,
  matchPercentage
}) => {
  const [imageError, setImageError] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSaveToggle = () => {
    if (saved) {
      onUnsave?.(property.id);
    } else {
      onSave?.(property.id);
    }
    setSaved(!saved);
  };

  const primaryImage = property.images?.find(img => img.isPrimary) || property.images?.[0];
  const imageUrl = imageError 
    ? 'http://localhost:3001/test/asset/img/default/default_000.jpg'
    : primaryImage?.url || 'http://localhost:3001/test/asset/img/property/1_start_house.jpeg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Property Image */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={primaryImage?.altText || property.name}
          className="w-full h-48 object-cover"
          onError={() => setImageError(true)}
        />
        
        {/* Heart/Save Button */}
        <button
          onClick={handleSaveToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <svg
            className={`w-5 h-5 ${saved ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Match Percentage */}
        {showMatchPercentage && matchPercentage && (
          <div className="absolute bottom-3 left-3">
            <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
              matchPercentage >= 90 ? 'bg-green-500' :
              matchPercentage >= 80 ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}>
              {matchPercentage}% Match
            </span>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {property.address.street}, {property.address.city}
        </p>

        {/* Price */}
        <div className="mb-3">
          {property.hadDiscount && property.discountPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#002B5C]">
                {formatPrice(property.discountPrice)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(property.price)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-[#002B5C]">
              {formatPrice(property.price)}
            </span>
          )}
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>{property.beds} beds</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{property.baths} baths</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span>{property.size.toLocaleString()} sq ft</span>
          </div>
        </div>

        {/* View Details Button */}
        <button 
          onClick={() => navigate(`/property/${property.id}`)}
          className="w-full bg-[#002B5C] text-white py-2 px-4 rounded-md hover:bg-[#002B5C]/90 transition-colors font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard; 