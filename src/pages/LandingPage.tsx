import React from 'react'
import { Header } from '../components/ui/Header'
import { HeroSection } from '../components/ui/HeroSection'
import { SmartSearchEngine } from '../components/search/SmartSearchEngine'
import { TopTrustedListings } from '../components/property/TopTrustedListings'
import { WhyTrustMatters } from '../components/ui/WhyTrustMatters'
import { AIAssistantDemo } from '../components/ui/AIAssistantDemo'
import { CallToActionSection } from '../components/ui/CallToActionSection'
import { SuccessStories } from '../components/ui/SuccessStories'
import { Footer } from '../components/ui/Footer'

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <SmartSearchEngine />
        <TopTrustedListings />
        <WhyTrustMatters />
        <AIAssistantDemo />
        <CallToActionSection />
        <SuccessStories />
      </main>
      <Footer />
    </div>
  )
} 