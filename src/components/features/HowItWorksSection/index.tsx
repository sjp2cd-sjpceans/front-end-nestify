import React from 'react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: 'Set Your Preferences',
      description: 'Tell us about your dream home, budget, lifestyle preferences, and desired locations. Our AI learns what matters most to you.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      features: ['Budget range', 'Location preferences', 'Property type', 'Lifestyle needs']
    },
    {
      id: 2,
      title: 'AI Finds Perfect Matches',
      description: 'Our intelligent system analyzes thousands of properties, market data, and trends to curate personalized matches just for you.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      gradient: 'from-[#FFD700] to-[#FFA500]',
      bgGradient: 'from-yellow-50 to-orange-50',
      features: ['Smart algorithms', 'Market analysis', 'Real-time matching', 'Quality scoring']
    },
    {
      id: 3,
      title: 'Connect & Explore',
      description: 'Browse curated recommendations, schedule virtual tours, connect with expert agents, and get personalized guidance throughout your journey.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-emerald-50',
      features: ['Virtual tours', 'Expert agents', 'Instant messaging', 'Guidance support']
    },
    {
      id: 4,
      title: 'Close with Confidence',
      description: 'Make informed decisions with detailed analytics, market insights, and professional support to secure your perfect property.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-pink-50',
      features: ['Market insights', 'Documentation help', 'Negotiation support', 'Secure closing']
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#002B5C]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#002B5C]/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#002B5C]">How It Works</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#002B5C] mb-6 leading-tight">
            Your Journey to the
            <span className="block bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Perfect Home
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Four simple steps powered by AI technology to transform your property search 
            into an effortless and intelligent experience.
          </p>
        </div>

        {/* Steps Container */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connection Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-yellow-200 via-green-200 to-purple-200 transform -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-4 gap-8 relative z-10">
                {steps.map((step, index) => (
                  <div key={step.id} className="text-center">
                    {/* Step Circle */}
                    <div className={`relative w-24 h-24 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-gray-800">{step.id}</span>
                      </div>
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
                    </div>
                    
                    {/* Content */}
                    <div className={`bg-gradient-to-br ${step.bgGradient} p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-shadow duration-300`}>
                      <h3 className="text-xl font-bold text-[#002B5C] mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                        {step.description}
                      </p>
                      <ul className="space-y-1">
                        {step.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-xs text-gray-500">
                            <div className="w-1 h-1 bg-[#FFD700] rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connection Line for Mobile */}
                {index < steps.length - 1 && (
                  <div className="absolute left-12 top-24 w-0.5 h-16 bg-gradient-to-b from-gray-200 to-gray-300 z-0"></div>
                )}
                
                <div className="flex items-start gap-6 relative z-10">
                  {/* Step Circle */}
                  <div className={`relative w-24 h-24 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <div className="text-white">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-gray-800">{step.id}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className={`flex-1 bg-gradient-to-br ${step.bgGradient} p-6 rounded-2xl shadow-lg border border-white/50`}>
                    <h3 className="text-xl font-bold text-[#002B5C] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
            <span className="text-gray-500 font-medium">Ready to get started?</span>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-gradient-to-r from-[#002B5C] to-[#004080] text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Start Your Search
            </button>
            
            <button className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:border-gray-300 hover:shadow-lg transition-all duration-200 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 