import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProperties, type Property } from '../../../services/property.service';
import featured1 from '@nestify/assets/images/featured1.png';
import featured2 from '@nestify/assets/images/featured2.png';
import featured3 from '@nestify/assets/images/featured3.png';

// Mock data for featured properties
const featuredProperties = [
  {
    id: 1,
    title: 'Balay ni maam karen',
    price: '750K',
    image: featured1,
    description: 'Beautiful 4-bedroom home with modern amenities in a quiet neighborhood.',
    beds: 4,
    baths: 3,
    area: '2,400 sq ft'
  },
  {
    id: 2,
    title: 'Balay ni sir Ken',
    price: '550K',
    image: featured2,
    description: 'Stunning 2-bedroom condo with panoramic city views and premium finishes.',
    beds: 2,
    baths: 2,
    area: '1,200 sq ft'
  },
  {
    id: 3,
    title: 'Balay ni sir Asilo',
    price: '425K',
    image: featured3,
    description: 'Cozy 3-bedroom home perfect for families, featuring a large backyard.',
    beds: 3,
    baths: 2,
    area: '1,800 sq ft'
  }
];

const FeaturedPropertiesSection: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        const properties = await getProperties({ limit: 6 });
        setFeaturedProperties(properties);
      } catch (err) {
        setError('Failed to load featured properties');
        console.error('Error fetching featured properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleViewProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const handleViewAllProperties = () => {
    navigate('/properties');
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#FFD700]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#002B5C]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#002B5C]/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#002B5C]">Featured Properties</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#002B5C] mb-6 leading-tight">
            Premium
            <span className="block bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Property Collection
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover handpicked premium properties in prime locations, 
            carefully curated by our expert team for exceptional living experiences.
          </p>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#002B5C]"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-b-2 border-[#FFD700] opacity-20"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600 bg-red-50 rounded-2xl max-w-2xl mx-auto">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-lg font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredProperties.map((property, index) => (
              <div 
                key={property.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={property.images?.[0]?.url || 'http://localhost:3001/test/asset/img/default/default_000.jpg'} 
                    alt={property.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Property Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {property.hadDiscount && (
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        🔥 ON SALE
                      </span>
                    )}
                    {property.name.toLowerCase().includes('new') && (
                      <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ✨ NEW
                      </span>
                    )}
                    <span className="bg-gradient-to-r from-[#002B5C] to-[#004080] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {property.propertyType}
                    </span>
                  </div>
                  
                  {/* Heart/Save Button */}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                    <svg className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Title and Price */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#002B5C] mb-2 group-hover:text-gray-900 transition-colors line-clamp-1">
                      {property.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="line-clamp-1">{property.address.street}, {property.address.city}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-[#002B5C]">
                        {formatPrice(property.discountPrice || property.price)}
                      </span>
                      {property.hadDiscount && property.discountPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(property.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Property Details */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span className="font-medium">{property.beds}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{property.baths}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{property.size.toLocaleString()} ft²</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* View Property Button */}
                  <button 
                    onClick={() => handleViewProperty(property.id)}
                    className="w-full bg-gradient-to-r from-[#002B5C] to-[#004080] text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>View Property</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}

        {/* View All Properties CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
            <span className="text-gray-500 font-medium">Explore More Properties</span>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
          </div>
          
          <button 
            onClick={handleViewAllProperties}
            className="group bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#002B5C] px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-[#FFD700]/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4 4m4-4l-4-4" />
            </svg>
            View All Properties
            <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
              {loading ? '...' : `${featuredProperties.length}+`}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection; 