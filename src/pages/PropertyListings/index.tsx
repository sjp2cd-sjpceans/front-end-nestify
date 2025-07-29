import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import PropertyCard from '../../components/features/PropertyCard';
import { getProperties, type Property } from '../../services/property.service';

interface FilterState {
  location: string;
  priceRange: string;
  propertyType: string;
  bedrooms: string;
  amenities: string[];
}

const PropertyListings: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-low');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    priceRange: 'any',
    propertyType: 'all',
    bedrooms: 'any',
    amenities: []
  });

  // Property type options
  const propertyTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Condo', label: 'Condo' },
    { value: 'House', label: 'House' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Studio', label: 'Studio' },
    { value: 'Loft', label: 'Loft' },
    { value: 'Duplex', label: 'Duplex' },
    { value: 'Penthouse', label: 'Penthouse' },
    { value: 'Townhouse', label: 'Townhouse' },
    { value: 'Bungalow', label: 'Bungalow' },
  ];

  // Price range options
  const priceRanges = [
    { value: 'any', label: 'Any Price' },
    { value: '0-500000', label: '₱0 - ₱500K' },
    { value: '500000-1000000', label: '₱500K - ₱1M' },
    { value: '1000000-2000000', label: '₱1M - ₱2M' },
    { value: '2000000-5000000', label: '₱2M - ₱5M' },
    { value: '5000000+', label: '₱5M+' },
  ];

  // Location options
  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'Manila', label: 'Manila' },
    { value: 'Quezon City', label: 'Quezon City' },
    { value: 'Makati', label: 'Makati' },
    { value: 'Bonifacio Global City', label: 'BGC' },
    { value: 'Pasig', label: 'Pasig' },
    { value: 'Ortigas', label: 'Ortigas' },
    { value: 'Alabang', label: 'Alabang' },
    { value: 'Los Angeles', label: 'Los Angeles' },
    { value: 'Toronto', label: 'Toronto' },
    { value: 'London', label: 'London' },
    { value: 'Sydney', label: 'Sydney' },
    { value: 'Tokyo', label: 'Tokyo' },
    { value: 'Seoul', label: 'Seoul' },
    { value: 'Berlin', label: 'Berlin' },
    { value: 'Paris', label: 'Paris' },
    { value: 'São Paulo', label: 'São Paulo' },
  ];

  // Bedroom options
  const bedroomOptions = [
    { value: 'any', label: 'Any' },
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3', label: '3 Bedrooms' },
    { value: '4', label: '4+ Bedrooms' },
  ];

  // Amenity options
  const amenityOptions = [
    'Pool', 'Gym', 'Parking', 'Balcony', 'Garden', 'Security', 
    'Elevator', 'Air Conditioning', 'Furnished', 'Pet Friendly'
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getProperties();
        setProperties(data);
        setFilteredProperties(data);
      } catch (err) {
        setError('Failed to load properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = [...properties];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.street.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by location
    if (filters.location !== 'all') {
      filtered = filtered.filter(property => 
        property.address.city.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by price range
    if (filters.priceRange !== 'any') {
      const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''));
      const minPrice = parseInt(min);
      const maxPrice = max ? parseInt(max) : Infinity;
      
      filtered = filtered.filter(property => {
        const price = property.discountPrice || property.price;
        return price >= minPrice && (maxPrice === Infinity || price <= maxPrice);
      });
    }

    // Filter by property type
    if (filters.propertyType !== 'all') {
      filtered = filtered.filter(property => 
        property.propertyType === filters.propertyType
      );
    }

    // Filter by bedrooms
    if (filters.bedrooms !== 'any') {
      const bedroomCount = filters.bedrooms === '4' ? 4 : parseInt(filters.bedrooms);
      filtered = filtered.filter(property => {
        if (filters.bedrooms === '4') {
          return property.beds >= bedroomCount;
        }
        return property.beds === bedroomCount;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      
      switch (sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'newest':
          return parseInt(b.id) - parseInt(a.id);
        case 'oldest':
          return parseInt(a.id) - parseInt(b.id);
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  }, [properties, filters, sortBy, searchQuery]);

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSaveProperty = async (propertyId: string) => {
    console.log('Saving property:', propertyId);
    // Implement save functionality
  };

  const handleUnsaveProperty = async (propertyId: string) => {
    console.log('Unsaving property:', propertyId);
    // Implement unsave functionality
  };

  const clearAllFilters = () => {
    setFilters({
      location: 'all',
      priceRange: 'any',
      propertyType: 'all',
      bedrooms: 'any',
      amenities: []
    });
    setSearchQuery('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.location !== 'all') count++;
    if (filters.priceRange !== 'any') count++;
    if (filters.propertyType !== 'all') count++;
    if (filters.bedrooms !== 'any') count++;
    if (filters.amenities.length > 0) count++;
    if (searchQuery.trim()) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B5C]"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-[#002B5C] text-white px-4 py-2 rounded hover:bg-[#002B5C]/90"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#002B5C] to-[#004080] text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Home
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover exceptional properties with our AI-powered search and expert recommendations
            </p>

            {/* Enhanced Search Bar */}
            <div className="relative bg-white rounded-xl shadow-lg p-2">
              <div className="flex items-center">
                <div className="flex-1 flex items-center">
                  <svg className="w-5 h-5 text-gray-400 ml-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
            <input
              type="text"
                    placeholder="Search by location, property name, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-3 text-gray-900 bg-transparent border-none outline-none placeholder-gray-500"
            />
                </div>
                <button className="bg-[#FFD700] text-[#002B5C] px-6 py-3 rounded-lg font-semibold hover:bg-[#FFD700]/90 transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  AI Search
            </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-[#002B5C] mb-1">{properties.length}</div>
            <div className="text-gray-600 text-sm">Total Properties</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-[#002B5C] mb-1">{filteredProperties.length}</div>
            <div className="text-gray-600 text-sm">Available Now</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-[#002B5C] mb-1">
              ₱{Math.min(...properties.map(p => p.discountPrice || p.price)).toLocaleString()}
            </div>
            <div className="text-gray-600 text-sm">Starting Price</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-[#002B5C] mb-1">
              {new Set(properties.map(p => p.address.city)).size}
            </div>
            <div className="text-gray-600 text-sm">Cities</div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          {/* Filter Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-[#002B5C] text-white text-xs px-2 py-1 rounded-full">
                  {getActiveFiltersCount()} active
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-sm text-[#002B5C] font-medium"
              >
                <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className={`${showFilters || 'hidden lg:block'}`}>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Location Filter */}
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Location
                  </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002B5C] focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              >
                {locationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    Price Range
                  </label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002B5C] focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              >
                {priceRanges.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Property Type
                  </label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002B5C] focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              >
                {propertyTypes.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms Filter */}
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    Bedrooms
                  </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#002B5C] focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              >
                {bedroomOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amenity Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1zm8-8a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Amenities
                </label>
          <div className="flex flex-wrap gap-2">
            {amenityOptions.map(amenity => (
              <button
                key={amenity}
                onClick={() => handleAmenityToggle(amenity)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.amenities.includes(amenity)
                          ? 'bg-[#002B5C] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                }`}
              >
                {amenity}
              </button>
            ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProperties.length} Properties Found
            </h2>
            {getActiveFiltersCount() > 0 && (
              <span className="text-sm text-gray-600">
                • {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} applied
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-[#002B5C] focus:border-transparent"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
            </select>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[#002B5C] text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Grid view"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[#002B5C] text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="List view"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or clear some filters to see more results.</p>
            <button 
              onClick={clearAllFilters}
              className="bg-[#002B5C] text-white px-6 py-3 rounded-lg hover:bg-[#002B5C]/90 transition-colors font-medium"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSave={handleSaveProperty}
                onUnsave={handleUnsaveProperty}
                isSaved={false}
              />
            ))}
          </div>
        )}

        {/* Load More Button (if needed for pagination) */}
        {filteredProperties.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Showing {filteredProperties.length} of {properties.length} properties
            </p>
            {filteredProperties.length < properties.length && (
              <button className="bg-white text-[#002B5C] border-2 border-[#002B5C] px-8 py-3 rounded-lg hover:bg-[#002B5C] hover:text-white transition-colors font-medium">
                Load More Properties
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PropertyListings; 