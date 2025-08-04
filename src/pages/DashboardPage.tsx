import React from 'react'
import { CompactPropertyCard } from '../components/property/CompactPropertyCard'
import { DashboardHeader } from '../components/ui/DashboardHeader'
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
  Eye
} from 'lucide-react'

interface RiskIndicatorProps {
  icon: React.ReactNode
  label: string
  value: string
  color: 'green' | 'yellow' | 'red'
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({ icon, label, value, color }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600', 
    red: 'bg-red-100 text-red-600'
  }
  
  return (
    <div className="text-center">
      <div className={`p-2 rounded-full ${colorClasses[color]} inline-flex mb-2`}>
        {icon}
      </div>
      <h4 className="text-xs font-medium text-gray-900 mb-1">{label}</h4>
      <span className={`text-xs font-medium ${
        color === 'green' ? 'text-green-600' : 
        color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
      }`}>
        {value}
      </span>
    </div>
  )
}

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
  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
    <img 
      src={images[0] || '/api/placeholder/60/60'} 
      alt={title}
      className="w-14 h-14 object-cover rounded-lg"
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
      <>
        <DashboardHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </>
    )
  }

  const userName = user?.name || 'Kenzo'
  const smartSuggestions = properties.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600">
            Explore safe, verified, and smart property matches near you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Smart Suggestions */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Smart Suggestions</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                  View All
                </button>
              </div>

              {smartSuggestions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {smartSuggestions.map((property) => (
                    <CompactPropertyCard 
                      key={property.id} 
                      property={property}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-1">No properties available</p>
                  <p className="text-gray-400 text-sm">Check back later for new listings.</p>
                </div>
              )}
            </section>

            {/* Trust Alerts & Area Insights */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Trust Alerts & Area Insights</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  locationRisk?.overall_risk === 'Low' ? 'bg-green-100 text-green-700' :
                  locationRisk?.overall_risk === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {locationRisk?.overall_risk || 'Low'} Risk
                </span>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Location Risk Assessment</h3>
                  <span className="text-sm text-gray-500">{locationRisk?.location || 'Your Area'}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <RiskIndicator
                    icon={<Waves className="h-4 w-4" />}
                    label="Flood Risk"
                    value={locationRisk?.flood_risk === 'Minimal' || locationRisk?.flood_risk === 'Low' ? 'Low' : 
                           locationRisk?.flood_risk === 'Moderate' ? 'Moderate' : 'High'}
                    color="green"
                  />
                  <RiskIndicator
                    icon={<Shield className="h-4 w-4" />}
                    label="Crime Rate"
                    value={locationRisk?.crime_rate === 'Low' ? 'Low' : 
                           locationRisk?.crime_rate === 'Moderate' ? 'Moderate' : 'High'}
                    color="yellow"
                  />
                  <RiskIndicator
                    icon={<TrendingUp className="h-4 w-4" />}
                    label="Scam Risk"
                    value="Low"
                    color="green"
                  />
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                  View Detailed Insights
                </button>
              </div>
            </section>

            {/* Recently Viewed */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
              </div>

              {recentlyViewed.length > 0 ? (
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
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-1">No recent views</p>
                  <p className="text-gray-400 text-sm">Properties you view will appear here.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Smart Filters Summary */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Smart Filters Summary</h2>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price Range</span>
                    <span className="text-sm font-medium text-gray-900">₱20k-₱50k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Trust Level</span>
                    <span className="text-sm font-medium text-gray-900">Verified Only</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Areas</span>
                    <span className="text-sm font-medium text-gray-900">Makati, QC</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm py-2 border border-blue-200 rounded hover:bg-blue-50 transition-colors">
                  Edit Filters
                </button>
              </div>
            </section>

            {/* Next Steps Checklist */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Next Steps Checklist</h2>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Circle className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">Set commute preferences</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-3" />
                    <span className="text-sm text-gray-700">Enable scam alerts</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">View top-rated agents</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Saved Listings */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Saved Listings</h2>
                <Bookmark className="h-4 w-4 text-gray-400" />
              </div>

              {savedListings.length > 0 ? (
                <div className="space-y-3">
                  {savedListings.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={listing.images && listing.images[0] ? listing.images[0] : '/api/placeholder/48/48'} 
                          alt={listing.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{listing.title}</h4>
                          <p className="text-xs text-gray-500">{listing.location.barangay}, {listing.location.city}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600 text-sm">₱{(listing.price / 100).toLocaleString()}k</p>
                          {listing.environmental_tags.includes('Price Drop') && (
                            <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                              Price Drop
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bookmark className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm mb-1">No saved listings</p>
                  <p className="text-gray-400 text-xs">Save properties to view them here.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 