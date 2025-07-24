import React from 'react';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#002B5C] mb-4">How It Works</h2>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
            Three simple steps to find your dream property
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#FFD700] flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-[#002B5C]">1</span>
            </div>
            <h3 className="text-xl font-bold text-[#002B5C] mb-3">Set Your Preferences</h3>
            <p className="text-[#6B7280]">
              Tell us about your ideal home, budget, and preferred locations.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#002B5C] flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-bold text-[#002B5C] mb-3">AI Finds Matches</h3>
            <p className="text-[#6B7280]">
              Our intelligent system searches and curates properties that fit your criteria.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#FFD700] flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-[#002B5C]">3</span>
            </div>
            <h3 className="text-xl font-bold text-[#002B5C] mb-3">Connect & Close</h3>
            <p className="text-[#6B7280]">
              Connect with agents and close on your perfect property with confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 