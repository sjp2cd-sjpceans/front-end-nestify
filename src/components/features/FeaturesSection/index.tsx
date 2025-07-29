import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 1,
      title: 'AI-Powered Smart Search',
      description: 'Our advanced AI algorithm understands your preferences and finds properties that perfectly match your lifestyle, budget, and location requirements.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      features: ['Natural language search', 'Preference learning', 'Smart filtering']
    },
    {
      id: 2,
      title: 'Personalized Recommendations',
      description: 'Get curated property suggestions based on your search history, preferences, and market trends to discover your perfect home faster.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      ),
      gradient: 'from-[#FFD700] to-[#FFA500]',
      bgGradient: 'from-yellow-50 to-orange-50',
      features: ['Behavioral analysis', 'Market insights', 'Preference matching']
    },
    {
      id: 3,
      title: 'Intelligent AI Assistant',
      description: 'Chat with our 24/7 AI assistant for instant answers about properties, neighborhoods, market trends, and real estate guidance.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-pink-50',
      features: ['24/7 availability', 'Expert knowledge', 'Instant responses']
    },
    {
      id: 4,
      title: 'Virtual Property Tours',
      description: 'Experience immersive 3D virtual tours and augmented reality features to explore properties from anywhere, anytime.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-emerald-50',
      features: ['3D walkthroughs', 'AR visualization', 'Remote viewing']
    },
    {
      id: 5,
      title: 'Market Analytics',
      description: 'Access real-time market data, price trends, and neighborhood insights powered by AI to make informed decisions.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-blue-50',
      features: ['Real-time data', 'Trend analysis', 'Investment insights']
    },
    {
      id: 6,
      title: 'Smart Notifications',
      description: 'Receive intelligent alerts about new listings, price changes, and market opportunities that match your criteria.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM7 7h8a2 2 0 012 2v6l-2-2H7a2 2 0 01-2-2V9a2 2 0 012-2z" />
        </svg>
      ),
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-pink-50',
      features: ['Price alerts', 'New listings', 'Market updates']
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#FFD700]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#002B5C]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#002B5C]/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#002B5C]">AI-Powered Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#002B5C] mb-6 leading-tight">
            Revolutionary
            <span className="block bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Real Estate Technology
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Experience the future of property discovery with cutting-edge AI technology designed to make 
            finding your perfect home effortless and intelligent.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              className={`group relative bg-gradient-to-br ${feature.bgGradient} p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Icon Container */}
              <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <div className="text-white">
                  {feature.icon}
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-[#002B5C] mb-4 group-hover:text-gray-900 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Feature List */}
              <ul className="space-y-2">
                {feature.features.map((item, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full mr-3"></div>
                    {item}
                  </li>
                ))}
              </ul>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
            <span className="text-gray-500 font-medium">Ready to experience the future?</span>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 