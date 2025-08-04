import React from 'react'
import { PropertyCard } from '../components/property/PropertyCard'
import { useTopProperties } from '../hooks/useTopProperties'
import { useDashboardData } from '../hooks/useDashboardData'
import { useRiskInsights } from '../hooks/useRiskInsights'
import { 
  Shield, 
  Waves, 
  TrendingUp,
  Bookmark,
  CheckCircle,
  Circle,
  Edit3,
  Eye,
  MessageCircle
} from 'lucide-react'

interface RiskIndicatorProps {
  icon: React.ReactNode
  label: string
  level: 'Low' | 'Moderate' | 'High'
  color: string
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({ icon, label, level, color }) => (
  <div className="flex flex-col items-center p-4 bg-white rounded-lg border">
    <div className={`p-3 rounded-full ${color} mb-2`}>
      {icon}
    </div>
    <h4 className="font-medium text-gray-900 mb-1">{label}</h4>
    <span className={`text-sm font-medium ${
      level === 'Low' ? 'text-green-600' : 
      level === 'Moderate' ? 'text-yellow-600' : 'text-red-600'
    }`}>
      {level}
    </span>
  </div>
)

interface RecentPropertyCardProps {
  id: string
  title: string
  price: number
  location: {
    barangay: string
    city: string
  }
  images: string[]
}

const RecentPropertyCard: React.FC<RecentPropertyCardProps> = ({ 
  title, 
  price, 
  location, 
  images 
}) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
    <img 
      src={images[0] || '/api/placeholder/60/60'} 
      alt={title}
      className="w-12 h-12 object-cover rounded-lg"
    />
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-gray-900 truncate">{title}</h4>
      <p className="text-sm text-gray-500">{location.city}</p>
    </div>
    <div className="text-right">
      <p className="font-semibold text-blue-600">₱{(price / 100).toLocaleString()}k</p>
    </div>
  </div>
)

export const DashboardPage: React.FC = () => {
  const { properties, loading: propertiesLoading } = useTopProperties()
  const { user, recentlyViewed, savedListings, loading: dashboardLoading } = useDashboardData()
  const { locationRisk, loading: riskLoading } = useRiskInsights()

  if (dashboardLoading || propertiesLoading || riskLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const userName = user?.name || 'Kenzo'
  const smartSuggestions = properties.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600">
            Explore safe, verified, and smart property matches near you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Smart Suggestions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Smart Suggestions</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>

              {smartSuggestions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {smartSuggestions.map((property) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No properties available at the moment.</p>
                </div>
              )}
            </section>

            {/* Trust Alerts & Area Insights */}
            <section>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Trust Alerts & Area Insights
                </h2>

                {/* Location Risk Assessment */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Location Risk Assessment
                    </h3>
                    {locationRisk && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        locationRisk.overall_risk === 'Low' ? 'bg-green-100 text-green-800' :
                        locationRisk.overall_risk === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {locationRisk.overall_risk} Risk
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <RiskIndicator
                      icon={<Waves className="w-5 h-5 text-blue-600" />}
                      label="Flood Risk"
                      level={locationRisk?.flood_risk === 'Minimal' || locationRisk?.flood_risk === 'Low' ? 'Low' : 
                             locationRisk?.flood_risk === 'Moderate' ? 'Moderate' : 'High'}
                      color="bg-blue-100"
                    />
                    <RiskIndicator
                      icon={<Shield className="w-5 h-5 text-amber-600" />}
                      label="Crime Rate"
                      level={locationRisk?.crime_rate === 'Low' ? 'Low' : 
                             locationRisk?.crime_rate === 'Moderate' ? 'Moderate' : 'High'}
                      color="bg-amber-100"
                    />
                    <RiskIndicator
                      icon={<TrendingUp className="w-5 h-5 text-green-600" />}
                      label="Scam Risk"
                      level="Low"
                      color="bg-green-100"
                    />
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  View Detailed Insights
                </button>
              </div>
            </section>

            {/* Saved Listings */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Saved Listings</h2>
              
              <div className="space-y-4">
                {savedListings.map((property) => (
                  <div key={property.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start gap-4">
                      <img 
                        src={property.images[0] || '/api/placeholder/100/100'} 
                        alt={property.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
                            <p className="text-sm text-gray-500 mb-2">
                              {property.location.barangay}, {property.location.city}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              {property.agent?.verified && (
                                <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  Verified
                                </span>
                              )}
                              {property.environmental_tags.includes('Price Drop') && (
                                <span className="text-red-600 font-medium">📉 Price Drop</span>
                              )}
                              {property.risk_profile.crime_rate === 'Low' && (
                                <span className="text-green-600">Low Risk</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              ₱{(property.price / 100).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              ₱{((property.price * 1.1) / 100).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                            <Bookmark className="w-4 h-4" />
                            Save
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <MessageCircle className="w-4 h-4" />
                            Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Smart Filters Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Smart Filters Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price Range</span>
                  <span className="font-medium">₱20k-₱50k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trust Level</span>
                  <span className="font-medium">Verified Only</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Areas</span>
                  <span className="font-medium">Makati, QC</span>
                </div>
              </div>

              <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Filters
              </button>
            </div>

            {/* Next Steps Checklist */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Next Steps Checklist
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <Circle className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Set commute preferences</span>
                </label>
                <label className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Enable scam alerts</span>
                </label>
                <label className="flex items-center gap-3">
                  <Circle className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">View top-rated agents</span>
                </label>
              </div>
            </div>

            {/* Recently Viewed */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recently Viewed
              </h3>
              
              <div className="space-y-3">
                {recentlyViewed.map((property) => (
                  <RecentPropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    price={property.price}
                    location={property.location}
                    images={property.images}
                  />
                ))}
              </div>
              
              {recentlyViewed.length === 0 && (
                <div className="text-center py-4">
                  <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No recent views yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 