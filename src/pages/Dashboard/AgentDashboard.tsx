import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProperties, type Property } from '../../services/property.service';

interface AgentMetrics {
  totalViews: number;
  viewsChange: number;
  inquiries: number;
  inquiriesChange: number;
  activeListings: number;
  pendingOffers: number;
  closings: number;
  closingsChange: number;
}

interface Inquiry {
  id: number;
  clientName: string;
  property: string;
  message: string;
  timeAgo: string;
  status: 'new' | 'replied';
  avatar: string;
}

const AgentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [agentListings, setAgentListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock agent metrics - in real app, this would come from API
  const metrics: AgentMetrics = {
    totalViews: 1247,
    viewsChange: 12,
    inquiries: 43,
    inquiriesChange: 8,
    activeListings: 12,
    pendingOffers: 2,
    closings: 18,
    closingsChange: 25
  };

  // Mock recent inquiries - in real app, this would come from API
  const recentInquiries: Inquiry[] = [
    {
      id: 1,
      clientName: 'Sarah Williams',
      property: 'Modern Family Home',
      message: 'I\'m interested in scheduling a viewing for this property. Is it available this weekend?',
      timeAgo: '2 hours ago',
      status: 'new',
      avatar: 'http://localhost:3001/test/asset/img/actor/1_elon_musk_in_iron_man_suit.jpg'
    },
    {
      id: 2,
      clientName: 'David Chen',
      property: 'Contemporary Townhouse',
      message: 'Can you provide more information about the HOA fees and amenities?',
      timeAgo: '5 hours ago',
      status: 'replied',
      avatar: 'http://localhost:3001/test/asset/img/actor/1_elon_musk_in_iron_man_suit.jpg'
    }
  ];

  useEffect(() => {
    const fetchAgentListings = async () => {
      try {
        setLoading(true);
        // In real implementation, this would filter properties by agent
        const listings = await getProperties({ limit: 6 });
        setAgentListings(listings);
      } catch (err) {
        setError('Failed to load agent listings');
        console.error('Error fetching agent listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentListings();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (index: number) => {
    const statuses = ['Active', 'Pending', 'Sold'];
    const colors = ['bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-gray-100 text-gray-800'];
    const status = statuses[index % 3];
    const color = colors[index % 3];
    return { status, color };
  };

  const handleReply = (inquiryId: number) => {
    console.log('Reply to inquiry:', inquiryId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Agent Profile Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="http://localhost:3001/test/asset/img/actor/1_elon_musk_in_iron_man_suit.jpg"
              alt="Sir JJ Asilo"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-[#002B5C]">Sir JJ Asilo</h1>
              <p className="text-gray-600">Senior Real Estate Agent</p>
              <p className="text-sm text-gray-500">License #RE12345678 • SUP2CD Scammer Group</p>
            </div>
          </div>
          <button className="bg-[#FFD700] text-[#002B5C] px-4 py-2 rounded-lg font-medium hover:bg-[#FFD700]/90 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Listings and Inquiries */}
        <div className="lg:col-span-2">
          {/* My Listings Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#002B5C]">My Listings</h2>
              <button className="bg-[#002B5C] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#002B5C]/90 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Listing
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002B5C]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <p>{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agentListings.map((property, index) => {
                  const { status, color } = getStatusBadge(index);
                  return (
                    <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="relative">
                        <img
                          src={property.images?.[0]?.url || 'http://localhost:3001/test/asset/img/property/1_start_house.jpeg'}
                          alt={property.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
                            {status}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 flex gap-1">
                          <button className="bg-white/90 p-1 rounded hover:bg-white transition-colors">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="bg-white/90 p-1 rounded hover:bg-white transition-colors">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                          {property.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                          {property.address.street}, {property.address.city}
                        </p>
                        <p className="text-lg font-bold text-[#002B5C] mb-3">
                          {formatPrice(property.discountPrice || property.price)}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
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
                            <span>{property.size.toLocaleString()} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="text-center mt-6">
              <Link 
                to="/properties" 
                className="text-[#002B5C] hover:text-[#002B5C]/80 font-medium"
              >
                View All Listings (12)
              </Link>
            </div>
          </div>

          {/* Recent Inquiries Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#002B5C]">Recent Inquiries</h2>
              <span className="text-sm text-gray-500">Last 7 days</span>
            </div>

            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={inquiry.avatar}
                      alt={inquiry.clientName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{inquiry.clientName}</span>
                        {inquiry.status === 'new' && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                            New
                          </span>
                        )}
                        {inquiry.status === 'replied' && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            Replied
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{inquiry.property}</p>
                      <p className="text-gray-700 text-sm mb-3">"{inquiry.message}"</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{inquiry.timeAgo}</span>
                        <button 
                          onClick={() => handleReply(inquiry.id)}
                          className="text-[#002B5C] hover:text-[#002B5C]/80 text-sm font-medium"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Performance and AI Tools */}
        <div className="lg:col-span-1">
          {/* Performance Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#002B5C] mb-6">Performance Overview</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600">Total Views</span>
                  <span className="text-2xl font-bold text-[#002B5C]">{metrics.totalViews.toLocaleString()}</span>
                </div>
                <div className="text-sm text-green-600">+{metrics.viewsChange}% from last month</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600">Inquiries</span>
                  <span className="text-2xl font-bold text-[#002B5C]">{metrics.inquiries}</span>
                </div>
                <div className="text-sm text-green-600">+{metrics.inquiriesChange}% from last month</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600">Active Listings</span>
                  <span className="text-2xl font-bold text-[#002B5C]">{metrics.activeListings}</span>
                </div>
                <div className="text-sm text-gray-600">{metrics.pendingOffers} pending offers</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600">Closings (YTD)</span>
                  <span className="text-2xl font-bold text-[#002B5C]">{metrics.closings}</span>
                </div>
                <div className="text-sm text-green-600">+{metrics.closingsChange}% from last year</div>
              </div>
            </div>
          </div>

          {/* AI Assistant Tools */}
          <div className="bg-[#F8F9FA] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#002B5C]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#002B5C]">AI Assistant Tools</h3>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Auto-Reply Drafts</div>
                    <div className="text-sm text-gray-600">Generate smart responses to inquiries</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button className="w-full text-left p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Listing Insights</div>
                    <div className="text-sm text-gray-600">AI-powered market analysis</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button className="w-full text-left p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Price Optimization</div>
                    <div className="text-sm text-gray-600">Smart pricing recommendations</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard; 