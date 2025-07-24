import React from 'react';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#002B5C] mb-4">AI-Powered Features</h2>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
            Experience the future of real estate with our intelligent platform designed to
            make property discovery effortless.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Smart Search Feature */}
          <div className="bg-[#F8F9FA] p-8 rounded-lg shadow-sm">
            <div className="bg-[#002B5C] w-12 h-12 rounded flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#002B5C] mb-3">Smart Search</h3>
            <p className="text-[#6B7280]">
              Our AI understands your preferences and finds properties that match your lifestyle
              and budget perfectly.
            </p>
          </div>
          
          {/* Personalized Recommendations Feature */}
          <div className="bg-[#F8F9FA] p-8 rounded-lg shadow-sm">
            <div className="bg-[#FFD700] w-12 h-12 rounded flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#002B5C" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#002B5C] mb-3">Personalized Recommendations</h3>
            <p className="text-[#6B7280]">
              Get curated property suggestions based on your search history and preferences.
            </p>
          </div>
          
          {/* AI Assistant Feature */}
          <div className="bg-[#F8F9FA] p-8 rounded-lg shadow-sm">
            <div className="bg-[#002B5C] w-12 h-12 rounded flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#002B5C] mb-3">AI Assistant</h3>
            <p className="text-[#6B7280]">
              Chat with our intelligent assistant for instant answers about properties,
              neighborhoods, and market trends.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 