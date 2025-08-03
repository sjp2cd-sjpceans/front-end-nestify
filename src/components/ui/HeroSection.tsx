import React from 'react'
import { Search, Bot } from 'lucide-react'
import { Button } from './Button'

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Find Scam-Free Homes
          <br />
          <span className="text-blue-200">Backed by AI Trust Scores</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
          Trusted by 50+ verified agents. Flood risk data now available.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="success" 
            size="lg"
            icon={<Search className="h-5 w-5" />}
            className="w-full sm:w-auto text-lg px-8 py-4"
          >
            Search Listings
          </Button>
          
          <Button 
            variant="secondary" 
            size="lg"
            icon={<Bot className="h-5 w-5" />}
            className="w-full sm:w-auto text-lg px-8 py-4"
          >
            Ask AI About a Location
          </Button>
        </div>
      </div>
    </section>
  )
} 