import React from 'react';

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#002B5C] mb-4">Benefits for Everyone</h2>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
            Tailored solutions for agents, brokers, and clients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* For Agents */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="bg-[#002B5C] w-12 h-12 rounded flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#002B5C] mb-4">For Agents</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">✓</span>
                <span className="text-[#6B7280]">AI-powered lead generation</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">✓</span>
                <span className="text-[#6B7280]">Automated client matching</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">✓</span>
                <span className="text-[#6B7280]">Advanced analytics dashboard</span>
              </li>
            </ul>
          </div>

          {/* For Brokers */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="bg-[#FFD700] w-12 h-12 rounded flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#002B5C" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#002B5C] mb-4">For Brokers</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">✓</span>
                <span className="text-[#6B7280]">Team performance insights</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">✓</span>
                <span className="text-[#6B7280]">Market trend analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">✓</span>
                <span className="text-[#6B7280]">Commission tracking tools</span>
              </li>
            </ul>
          </div>

          {/* For Clients */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="bg-[#002B5C] w-12 h-12 rounded flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#002B5C] mb-4">For Clients</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">✓</span>
                <span className="text-[#6B7280]">Personalized property recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">✓</span>
                <span className="text-[#6B7280]">Virtual tours and 3D walkthroughs</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">✓</span>
                <span className="text-[#6B7280]">Real-time market updates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection; 