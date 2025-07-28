import React from 'react';
import Header from '@nestify/components/layout/Header';

const Recommendations: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#002B5C] mb-2">Recommendations</h1>
          <p className="text-[#6B7280]">Personalized property recommendations for you</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-xl font-semibold text-[#002B5C] mb-4">Coming Soon</h2>
          <p className="text-[#6B7280]">
            The recommendations page is under development. 
            This will show AI-powered property recommendations based on your preferences and search history.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Recommendations; 