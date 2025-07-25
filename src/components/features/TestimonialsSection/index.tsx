import React from 'react';
import april from '../../../assets/images/person/april.jpg';
import mikko from '../../../assets/images/person/mikko.jpg';
import kenzo from '../../../assets/images/person/kenzo.jpg';

// Mock testimonial data
const testimonials = [
  {
    id: 1,
    name: 'April Lyn Pabrouez',
    role: 'First-time Buyer',
    quote: 'Nestify\'s AI recommendations were spot-on! Found my dream home in just two weeks.',
    rating: 5,
    avatar: april
  },
  {
    id: 2,
    name: 'Mikko Geverola',
    role: 'Real Estate Agent',
    quote: 'The platform has revolutionized how I work with clients. Lead generation is now effortless.',
    rating: 5,
    avatar: mikko
  },
  {
    id: 3,
    name: 'Kenneth Bulaga',
    role: 'Property Investor',
    quote: 'The market insights and analytics have helped me make smarter investment decisions.',
    rating: 5,
    avatar: kenzo
  }
];

const TestimonialsSection: React.FC = () => {
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <svg 
          key={i}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="#FFD700" 
          className="w-5 h-5"
        >
          <path 
            fillRule="evenodd" 
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
            clipRule="evenodd" 
          />
        </svg>
      );
    }
    return stars;
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#002B5C] mb-4">What Our Users Say</h2>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
            Join thousands of satisfied users who found their perfect home
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-bold text-[#002B5C]">{testimonial.name}</h3>
                  <p className="text-sm text-[#6B7280]">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-[#6B7280] italic mb-4">"{testimonial.quote}"</p>
              <div className="flex">
                {renderStars(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 