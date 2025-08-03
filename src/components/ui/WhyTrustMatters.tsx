import React from 'react'
import { AlertTriangle, Shield, BarChart3 } from 'lucide-react'

interface TrustCardProps {
  icon: React.ReactNode
  title: string
  description: string
  iconBgColor: string
}

const TrustCard: React.FC<TrustCardProps> = ({ icon, title, description, iconBgColor }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center h-full">
      <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export const WhyTrustMatters: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Trust Matters
          </h2>
        </div>

        {/* Trust Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TrustCard
            icon={<AlertTriangle className="h-8 w-8 text-red-600" />}
            iconBgColor="bg-red-100"
            title="20% of listings online are scams"
            description="Fake photos, false prices, and non-existent properties cost buyers time and money."
          />
          
          <TrustCard
            icon={<Shield className="h-8 w-8 text-blue-600" />}
            iconBgColor="bg-blue-100"
            title="AI-Powered Verification"
            description="Our system verifies listings, agents, and property details using advanced AI technology."
          />
          
          <TrustCard
            icon={<BarChart3 className="h-8 w-8 text-green-600" />}
            iconBgColor="bg-green-100"
            title="Area Risk Intelligence"
            description="Access comprehensive area risk data including natural disasters, crime rates, and infrastructure quality."
          />
        </div>
      </div>
    </section>
  )
} 