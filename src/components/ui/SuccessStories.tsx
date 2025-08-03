import React from 'react'

interface TestimonialProps {
  name: string
  role: string
  testimonial: string
  avatar?: string
}

const TestimonialCard: React.FC<TestimonialProps> = ({ name, role, testimonial, avatar }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-8">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <span className="text-gray-600 font-semibold text-lg">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-lg">{name}</h4>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
      </div>
      <blockquote className="text-gray-700 leading-relaxed">
        "{testimonial}"
      </blockquote>
    </div>
  )
}

export const SuccessStories: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TestimonialCard
            name="Aprillyn Pabroquez"
            role="Home Buyer"
            testimonial="TrustSearch helped me avoid 3 scam listings and find my dream home in a flood-free area. The AI recommendations were spot-on!"
          />
          
          <TestimonialCard
            name="Mikko Geverola"
            role="Verified Agent"
            testimonial="After getting verified, my listing views increased by 350%. Buyers trust the TrustSearch badge and contact me more often."
          />
        </div>
      </div>
    </section>
  )
} 