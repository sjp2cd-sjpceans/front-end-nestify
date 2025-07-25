import React from 'react';
import Header from '../../components/layout/Header';
import HeroSection from '../../components/features/HeroSection';
import FeaturesSection from '../../components/features/FeaturesSection';
import HowItWorksSection from '../../components/features/HowItWorksSection';
import BenefitsSection from '../../components/features/BenefitsSection';
import FeaturedPropertiesSection from '../../components/features/FeaturedPropertiesSection';
import TestimonialsSection from '../../components/features/TestimonialsSection';
import CtaSection from '../../components/features/CtaSection';
import Footer from '../../components/layout/Footer';

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
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home; 