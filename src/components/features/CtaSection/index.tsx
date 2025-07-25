import React from 'react';

const CtaSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#002B5C] text-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Perfect Home?</h2>
          <p className="text-lg mb-8">
            Join thousands of users who trust Nestify for their real estate needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/signup" 
              className="bg-[#FFD700] text-[#002B5C] px-8 py-3 rounded font-semibold hover:bg-[#FFD700]/90 transition-colors"
            >
              Get Started Free
            </a>
            <a 
              href="/demo" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded font-semibold hover:bg-white/10 transition-colors"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection; 