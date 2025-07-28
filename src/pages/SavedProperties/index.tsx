import React from 'react';
import Header from '@nestify/components/layout/Header';

const SavedProperties: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#002B5C] mb-2">Saved Properties</h1>
          <p className="text-[#6B7280]">Your bookmarked properties</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-xl font-semibold text-[#002B5C] mb-4">Coming Soon</h2>
          <p className="text-[#6B7280]">
            The saved properties page is under development. 
            This will show all properties you have saved or bookmarked for later viewing.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SavedProperties; 