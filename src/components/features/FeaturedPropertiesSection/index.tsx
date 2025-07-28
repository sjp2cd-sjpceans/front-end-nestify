import React from 'react';
import featured1 from '@nestify/assets/images/featured1.png';
import featured2 from '@nestify/assets/images/featured2.png';
import featured3 from '@nestify/assets/images/featured3.png';

// Mock data for featured properties
const featuredProperties = [
  {
    id: 1,
    title: 'Balay ni maam karen',
    price: '750K',
    image: featured1,
    description: 'Beautiful 4-bedroom home with modern amenities in a quiet neighborhood.',
    beds: 4,
    baths: 3,
    area: '2,400 sq ft'
  },
  {
    id: 2,
    title: 'Balay ni sir Ken',
    price: '550K',
    image: featured2,
    description: 'Stunning 2-bedroom condo with panoramic city views and premium finishes.',
    beds: 2,
    baths: 2,
    area: '1,200 sq ft'
  },
  {
    id: 3,
    title: 'Balay ni sir Asilo',
    price: '425K',
    image: featured3,
    description: 'Cozy 3-bedroom home perfect for families, featuring a large backyard.',
    beds: 3,
    baths: 2,
    area: '1,800 sq ft'
  }
];

const FeaturedPropertiesSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#002B5C] mb-4">Featured Properties</h2>
          <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
            Discover amazing properties in prime locations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="h-64 overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-[#002B5C]">{property.title}</h3>
                  <span className="text-xl font-bold text-[#FFD700]">{property.price}</span>
                </div>
                <p className="text-[#6B7280] mb-4">{property.description}</p>
                <div className="flex items-center text-sm text-[#6B7280] space-x-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    {property.beds} beds
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                    </svg>
                    {property.baths} baths
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    </svg>
                    {property.area}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="/listings" 
            className="bg-[#002B5C] text-white px-8 py-3 rounded font-semibold hover:bg-[#002B5C]/90 transition-colors inline-block"
          >
            View All Properties
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection; 