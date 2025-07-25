import React from 'react';
import Header from '../../components/layout/Header';
import HeroSection from '../../components/features/HeroSection';
import FeaturesSection from '../../components/features/FeaturesSection';
import HowItWorksSection from '../../components/features/HowItWorksSection';
import BenefitsSection from '../../components/features/BenefitsSection';
import FeaturedPropertiesSection from '../../components/features/FeaturedPropertiesSection';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <BenefitsSection />
        <FeaturedPropertiesSection />
      </main>
    </div>
  );
};

export default Home; 