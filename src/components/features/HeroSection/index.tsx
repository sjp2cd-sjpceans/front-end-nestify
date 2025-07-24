import React from 'react';
import heroBg from '../../../assets/images/hero-bg.png';

const HeroSection: React.FC = () => {
  return (
    <section 
      className="relative h-screen min-h-[600px] flex items-center"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find Your Perfect <br />Home with AI
          </h1>
          <p className="text-xl md:text-2xl mb-10">
            Discover properties tailored to your needs with our intelligent search
            and personalized recommendations.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="/search" 
              className="bg-[#FFD700] text-[#002B5C] px-8 py-3 rounded font-semibold hover:bg-[#FFD700]/90 transition-colors"
            >
              Start Searching
            </a>
            <a 
              href="/about" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded font-semibold hover:bg-white/10 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 