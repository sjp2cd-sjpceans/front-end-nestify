import React from 'react'
import { Users, Home } from 'lucide-react'
import { Button } from './Button'

interface CTACardProps {
  icon: React.ReactNode
  iconBgColor: string
  title: string
  description: string
  buttonText: string
  buttonVariant: 'primary' | 'success'
  onButtonClick?: () => void
}

const CTACard: React.FC<CTACardProps> = ({ 
  icon, 
  iconBgColor, 
  title, 
  description, 
  buttonText, 
  buttonVariant,
  onButtonClick 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center h-full">
      <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed mb-8">
        {description}
      </p>
      <Button 
        variant={buttonVariant}
        size="lg"
        onClick={onButtonClick}
        className="w-full sm:w-auto px-8 py-3"
      >
        {buttonText}
      </Button>
    </div>
  )
}

export const CallToActionSection: React.FC = () => {
  const handleGetVerified = () => {
    // TODO: Navigate to agent verification page
    console.log('Navigate to agent verification')
  }

  const handleListProperty = () => {
    // TODO: Navigate to property listing page
    console.log('Navigate to property listing')
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CTACard
            icon={<Users className="h-8 w-8 text-blue-600" />}
            iconBgColor="bg-blue-100"
            title="I'm an Agent"
            description="Get verified and increase your listing views by 300%. Join our trusted network."
            buttonText="Get Verified"
            buttonVariant="primary"
            onButtonClick={handleGetVerified}
          />
          
          <CTACard
            icon={<Home className="h-8 w-8 text-green-600" />}
            iconBgColor="bg-green-100"
            title="Property Owner"
            description="List your property for free and reach verified buyers looking for trusted listings."
            buttonText="List for Free"
            buttonVariant="success"
            onButtonClick={handleListProperty}
          />
        </div>
      </div>
    </section>
  )
} 