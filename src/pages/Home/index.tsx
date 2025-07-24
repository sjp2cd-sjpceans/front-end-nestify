import React from 'react';
import Header from '../../components/layout/Header';
import HeroSection from '../../components/features/HeroSection';
import FeaturesSection from '../../components/features/FeaturesSection';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
    </div>
  );
};

export default Home; 