import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import PropertyCard from '../../components/features/PropertyCard';
import AgentDashboard from './AgentDashboard';
import { useAuth } from '../../context/AuthContext';
import type { Property } from '../../services/property.service';
import { getSavedProperties, getRecommendations, saveProperty, unsaveProperty } from '../../services/property.service';

const mockMessages = [
  {
    id: 1,
    sender: 'Sir JJ Asilo',
    message: 'Hi! I have a few new listings that match your criteria. Would you like to schedule a viewing this weekend?',
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

// Client Dashboard Component (extracted from original Dashboard)
const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch saved properties and recommendations in parallel
        const [savedPropertiesData, recommendationsData] = await Promise.all([
          getSavedProperties(),
          getRecommendations()
        ]);
        
        setSavedProperties(savedPropertiesData);
        setRecommendations(recommendationsData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveProperty = async (propertyId: string) => {
    try {
      await saveProperty(propertyId);
      // In a real implementation, you might want to refresh the data or update the UI
      console.log('Property saved successfully:', propertyId);
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleUnsaveProperty = async (propertyId: string) => {
    try {
      await unsaveProperty(propertyId);
      // Remove the property from the saved properties list
      setSavedProperties(prev => prev.filter(p => p.id !== propertyId));
      console.log('Property unsaved successfully:', propertyId);
    } catch (error) {
      console.error('Error unsaving property:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B5C]"></div>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 text-red-500 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#002B5C] text-white px-4 py-2 rounded-lg hover:bg-[#002B5C]/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#002B5C] mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-[#6B7280]">
          Here's what's happening with your property search today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#002B5C] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/properties"
                className="flex items-center p-4 bg-[#F8F9FA] rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-[#002B5C] rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Search Properties</div>
                  <div className="text-sm text-gray-600">Find your next home</div>
                </div>
              </Link>

              <Link
                to="/agents"
                className="flex items-center p-4 bg-[#F8F9FA] rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-[#FFD700] rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-[#002B5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Browse Agents</div>
                  <div className="text-sm text-gray-600">Connect with experts</div>
                </div>
              </Link>

              <Link
                to="/saved"
                className="flex items-center p-4 bg-[#F8F9FA] rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Saved Properties</div>
                  <div className="text-sm text-gray-600">View your favorites</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Saved Properties */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#002B5C]">Your Saved Properties</h2>
              <Link to="/saved" className="text-[#002B5C] hover:text-[#002B5C]/80 text-sm font-medium">
                View all
              </Link>
            </div>
            
            {savedProperties.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties yet</h3>
                <p className="text-gray-600 mb-4">Start exploring properties and save your favorites</p>
                <Link 
                  to="/properties" 
                  className="bg-[#002B5C] text-white px-4 py-2 rounded-lg hover:bg-[#002B5C]/90 transition-colors"
                >
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedProperties.slice(0, 4).map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onSave={handleSaveProperty}
                    onUnsave={handleUnsaveProperty}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#002B5C]">Recommended for You</h2>
              <Link to="/recommendations" className="text-[#002B5C] hover:text-[#002B5C]/80 text-sm font-medium">
                View all
              </Link>
            </div>
            
            {recommendations.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Building your recommendations</h3>
                <p className="text-gray-600">Save properties and set preferences to get personalized recommendations</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.slice(0, 4).map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onSave={handleSaveProperty}
                    onUnsave={handleUnsaveProperty}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Search Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-[#002B5C] mb-4">Search Activity</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Properties viewed</span>
                <span className="font-semibold text-[#002B5C]">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Saved favorites</span>
                <span className="font-semibold text-[#002B5C]">{savedProperties.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Agents contacted</span>
                <span className="font-semibold text-[#002B5C]">3</span>
              </div>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#002B5C]">Recent Messages</h3>
              <Link to="/messages" className="text-[#002B5C] hover:text-[#002B5C]/80 text-sm font-medium">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <img
                    src={message.avatar}
                    alt={message.sender}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {message.sender}
                      </p>
                      {message.hasReply && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{message.message}</p>
                    <p className="text-xs text-gray-500">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-[#F8F9FA] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#002B5C] mb-4">Market Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg. Price Trend</span>
                <span className="text-green-600 font-medium">+5.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Days on Market</span>
                <span className="text-gray-900 font-medium">28 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">New Listings</span>
                <span className="text-blue-600 font-medium">+12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Please log in to access your dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {user.role === 'agent' ? <AgentDashboard /> : <ClientDashboard />}
    </div>
  );
};

export default Dashboard; 