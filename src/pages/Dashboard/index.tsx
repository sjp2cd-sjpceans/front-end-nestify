import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import PropertyCard from '../../components/features/PropertyCard';
import { useAuth } from '../../context/AuthContext';
import type { Property } from '../../services/property.service';

// Mock data for now - will be replaced with API calls
const mockSavedProperties: Property[] = [
  {
    id: '1',
    name: 'Contemporary Townhouse',
    description: 'Modern townhouse with great amenities',
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
    id: '2',
    name: 'Luxury City Condo',
    description: 'Luxury condo in the heart of the city',
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

const mockRecommendations: Property[] = [
  {
    id: '3',
    name: 'Elegant Family Home',
    description: 'Perfect for growing families',
    price: 695000,
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
      altText: 'Elegant Family Home',
      isPrimary: true
    }],
    beds: 4,
    baths: 3
  },
  {
    id: '4',
    name: 'Cozy Cottage Style',
    description: 'Charming cottage in quiet neighborhood',
    price: 485000,
    discountPrice: undefined,
    hadDiscount: false,
    size: 1800,
    propertyType: 'Cottage',
    status: 'Available',
    address: {
      street: '123 Ecoland',
      city: 'Malina',
      zipCode: '1000'
    },
    images: [{
      url: 'http://localhost:3001/test/asset/img/property/1_building_penthouse.jpg',
      altText: 'Cozy Cottage Style',
      isPrimary: true
    }],
    beds: 3,
    baths: 2
  },
  {
    id: '5',
    name: 'Modern Ranch Home',
    description: 'Contemporary ranch with modern amenities',
    price: 620000,
    discountPrice: undefined,
    hadDiscount: false,
    size: 2200,
    propertyType: 'Ranch',
    status: 'Available',
    address: {
      street: '123 Ecoland',
      city: 'Malina',
      zipCode: '1000'
    },
    images: [{
      url: 'http://localhost:3001/test/asset/img/property/1_start_house.jpeg',
      altText: 'Modern Ranch Home',
      isPrimary: true
    }],
    beds: 3,
    baths: 2
  }
];

const mockMessages = [
  {
    id: 1,
    sender: 'Sir JJ Asilo',
    message: 'Hi Sarah! I have a few new listings that match your criteria. Would you like to schedule a viewing this weekend?',
    time: '2 hours ago',
    avatar: 'http://localhost:3001/test/asset/img/actor/1_elon_musk_in_iron_man_suit.jpg',
    hasReply: true
  },
  {
    id: 2,
    sender: 'David Chen',
    message: 'Thank you for your interest in the Maple Drive property. I\'ve sent you the detailed information...',
    time: '1 day ago',
    avatar: 'http://localhost:3001/test/asset/img/actor/1_armored_tony_stark.jpeg',
    hasReply: false
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [recommendations, setRecommendations] = useState<Property[]>([]);

  useEffect(() => {
    // Load saved properties and recommendations
    setSavedProperties(mockSavedProperties);
    setRecommendations(mockRecommendations);
  }, []);

  const handleSaveProperty = (propertyId: string) => {
    console.log('Save property:', propertyId);
  };

  const handleUnsaveProperty = (propertyId: string) => {
    console.log('Unsave property:', propertyId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your properties and searches.
          </p>
        </div>

        {/* Saved Properties Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Saved Properties</h2>
            <Link 
              to="/saved-properties" 
              className="text-[#002B5C] hover:text-[#002B5C]/80 font-medium"
            >
              View All Saved Properties
            </Link>
          </div>
          
          {savedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedProperties.slice(0, 4).map((property) => (
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
        </section>

        {/* Recommendations Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                💡 Recommendations For You
              </h2>
              <p className="text-gray-600">Properties that match your preferences</p>
            </div>
            <Link 
              to="/recommendations" 
              className="text-[#002B5C] hover:text-[#002B5C]/80 font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 3).map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSave={handleSaveProperty}
                onUnsave={handleUnsaveProperty}
                showMatchPercentage={true}
                matchPercentage={[95, 88, 82][index]}
              />
            ))}
          </div>
        </section>

        {/* Recent Messages Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Messages</h2>
            <Link 
              to="/messages" 
              className="text-[#002B5C] hover:text-[#002B5C]/80 font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md">
            {mockMessages.map((message) => (
              <div key={message.id} className="border-b border-gray-200 last:border-b-0">
                <div className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <img
                      src={message.avatar}
                      alt={message.sender}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {message.sender}
                        </h3>
                        <span className="text-sm text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-gray-600 line-clamp-2 mb-3">
                        {message.message}
                      </p>
                      {message.hasReply && (
                        <button className="text-[#002B5C] hover:text-[#002B5C]/80 text-sm font-medium">
                          New Message
                        </button>
                      )}
                      {!message.hasReply && (
                        <button className="text-gray-500 hover:text-gray-700 text-sm">
                          Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 