import React from 'react';
import Header from '@nestify/components/layout/Header';

const Messages: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#002B5C] mb-2">Messages</h1>
          <p className="text-[#6B7280]">Your conversations with agents and brokers</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-xl font-semibold text-[#002B5C] mb-4">Coming Soon</h2>
          <p className="text-[#6B7280]">
            The messages page is under development. 
            This will show your chat conversations with real estate agents and brokers.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Messages; 