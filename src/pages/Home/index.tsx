import React from 'react';
import Header from '@nestify/components/layout/Header';
import HeroSection from '@nestify/components/features/HeroSection';
import FeaturesSection from '@nestify/components/features/FeaturesSection';
import HowItWorksSection from '@nestify/components/features/HowItWorksSection';
import BenefitsSection from '@nestify/components/features/BenefitsSection';
import FeaturedPropertiesSection from '@nestify/components/features/FeaturedPropertiesSection';
import TestimonialsSection from '@nestify/components/features/TestimonialsSection';
import CtaSection from '@nestify/components/features/CtaSection';
import Footer from '@nestify/components/layout/Footer';

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