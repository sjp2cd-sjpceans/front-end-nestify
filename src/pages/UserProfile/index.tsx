import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import PropertyCard from '../../components/features/PropertyCard';
import { useAuth } from '../../context/AuthContext';
import type { Property } from '../../services/property.service';

// Mock saved properties for the user profile page
const mockUserSavedProperties: Property[] = [
  {
    id: '1',
    name: 'Modern Family Home',
    description: 'Spacious modern home perfect for families',
    price: 750000,
    discountPrice: undefined,
    hadDiscount: false,
    size: 2400,
    propertyType: 'House',
    status: 'Available',
    address: {
      street: '123 Ecoland',
      city: 'Malina',
      zipCode: '1000'
    },
    images: [{
      url: 'http://localhost:3001/test/asset/img/property/1_start_house.jpeg',
      altText: 'Modern Family Home',
      isPrimary: true
    }],
    beds: 4,
    baths: 3
  },
  {
    id: '2',
    name: 'Charming Suburban Home',
    description: 'Beautiful suburban home with great amenities',
    price: 520000,
    discountPrice: undefined,
    hadDiscount: false,
    size: 1850,
    propertyType: 'House',
    status: 'Available',
    address: {
      street: '123 Ecoland',
      city: 'Malina',
      zipCode: '1000'
    },
    images: [{
      url: 'http://localhost:3001/test/asset/img/property/1_building_penthouse.jpg',
      altText: 'Charming Suburban Home',
      isPrimary: true
    }],
    beds: 3,
    baths: 2
  },
  {
    id: '3',
    name: 'Contemporary Townhouse',
    description: 'Modern townhouse with updated finishes',
    price: 580000,
    discountPrice: undefined,
    hadDiscount: false,
    size: 2100,
    propertyType: 'Townhouse',
    status: 'Available',
    address: {
      street: '123 Ecoland',
      city: 'Malina',
      zipCode: '1000'
    },
    images: [{
      url: 'http://localhost:3001/test/asset/img/property/1_start_house.jpeg',
      altText: 'Contemporary Townhouse',
      isPrimary: true
    }],
    beds: 3,
    baths: 2
  },
  {
    id: '4',
    name: 'Luxury City Condo',
    description: 'High-end condo in prime location',
    price: 650000,
    discountPrice: undefined,
    hadDiscount: false,
    size: 1200,
    propertyType: 'Condo',
    status: 'Available',
    address: {
      street: '123 Ecoland',
      city: 'Malina',
      zipCode: '1000'
    },
    images: [{
      url: 'http://localhost:3001/test/asset/img/property/1_building_penthouse.jpg',
      altText: 'Luxury City Condo',
      isPrimary: true
    }],
    beds: 2,
    baths: 2
  }
];

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [searchPreferences, setSearchPreferences] = useState({
    location: 'Downtown',
    priceRange: '₱300,000 - ₱750,000',
    propertyType: 'Single Family',
    bedrooms: '3-4 bedrooms'
  });

  useEffect(() => {
    setSavedProperties(mockUserSavedProperties);
  }, []);

  const handleSaveProperty = (propertyId: string) => {
    console.log('Save property:', propertyId);
  };

  const handleUnsaveProperty = (propertyId: string) => {
    console.log('Unsave property:', propertyId);
    setSavedProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleEditPreferences = () => {
    console.log('Edit preferences clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <img
                  src="http://localhost:3001/test/asset/img/actor/1_elon_musk_in_iron_man_suit.jpg"
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-600 mb-1">Home Seeker</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>🎯 Actively Searching</span>
                  <span>📅 Member since March 2025</span>
                </div>
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                  <span>📍 123 Ecoland, Malina</span>
                  <span>💰 ₱300K - ₱750K</span>
                  <span>🏠 3-4 bedrooms</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleEditProfile}
              className="bg-[#FFD700] text-[#002B5C] px-6 py-2 rounded-md hover:bg-[#FFD700]/90 transition-colors font-medium"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Saved Properties Section */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Saved Properties
                <span className="text-lg font-normal text-gray-600 ml-2">
                  {savedProperties.length} properties saved
                </span>
              </h2>
            </div>
            
            {savedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isSaved={true}
                    onSave={handleSaveProperty}
                    onUnsave={handleUnsaveProperty}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 mb-4">You haven't saved any properties yet.</p>
                <Link 
                  to="/properties" 
                  className="bg-[#002B5C] text-white px-6 py-2 rounded-md hover:bg-[#002B5C]/90 transition-colors"
                >
                  Browse Properties
                </Link>
              </div>
            )}
          </div>

          {/* Search Preferences Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Search Preferences</h3>
                <button
                  onClick={handleEditPreferences}
                  className="text-[#002B5C] hover:text-[#002B5C]/80 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <p className="text-gray-600">{searchPreferences.location}</p>
                  <div className="mt-2">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002B5C] focus:border-[#002B5C] text-sm">
                      <option>Suburbs</option>
                      <option>Downtown</option>
                      <option>Uptown</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <p className="text-gray-600">{searchPreferences.priceRange}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <p className="text-gray-600">{searchPreferences.propertyType}</p>
                  <div className="mt-2">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#002B5C] focus:border-[#002B5C] text-sm">
                      <option>Single Family</option>
                      <option>Townhouse</option>
                      <option>Condo</option>
                      <option>Apartment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <p className="text-gray-600">{searchPreferences.bedrooms}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 