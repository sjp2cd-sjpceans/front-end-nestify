import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { getProperties, type Property } from '../../services/property.service';

const AgentProfiles: React.FC = () => {
  const navigate = useNavigate();
  const [activeListings, setActiveListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('price');
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const fetchActiveListings = async () => {
      try {
        setLoading(true);
        const listings = await getProperties({ limit: 6 });
        setActiveListings(listings);
      } catch (err) {
        setError('Failed to load active listings');
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveListings();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // Handle form submission
    alert('Message sent successfully!');
    setContactForm({ fullName: '', email: '', phone: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const handleMessageAgent = () => {
    // Scroll to contact form
    const contactForm = document.getElementById('contact-form');
    contactForm?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCallAgent = () => {
    window.open('tel:+15551234567', '_self');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF]">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#002B5C] to-[#004080] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet Your Real Estate Expert</h1>
            <p className="text-xl text-blue-100 mb-8">Trusted advisor with 8+ years of experience in luxury real estate</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* Agent Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 -mt-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
              <div className="relative">
                <img
                  src="http://localhost:3001/test/asset/img/actor/1_elon_musk_in_iron_man_suit.jpg"
                  alt="Sir JJ Asilo"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#FFD700] shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-[#002B5C]">Sir JJ Asilo</h1>
                  <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                      ✓ Verified Agent
                    </span>
                    <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#002B5C] px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      ⭐ Top Rated
                    </span>
                  </div>
                </div>
                
                <p className="text-lg text-gray-600 mb-4 font-medium">Licensed Real Estate Agent & Luxury Home Specialist</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">SJP2CD Investor Group</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">123 Ecoland, Malina</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <span className="font-medium">(555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="font-medium">jj@sjp2cd.edu.ph</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:ml-auto">
              <button 
                onClick={handleMessageAgent}
                className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#002B5C] px-6 py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Message Agent
              </button>
              <button 
                onClick={handleCallAgent}
                className="bg-gradient-to-r from-[#002B5C] to-[#004080] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call Now
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - About & Listings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Professional Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#002B5C] mb-6 text-center">Professional Excellence</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-2xl font-bold text-white">8+</span>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Years Active</div>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-2xl font-bold text-white">250+</span>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Clients Served</div>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-bold text-[#002B5C]">4.9</span>
                      <svg className="w-4 h-4 text-[#002B5C] fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Average Rating</div>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-2xl font-bold text-white">15</span>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Active Listings</div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#002B5C] mb-6">About Sir JJ Asilo</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  With over <strong>8+ years of experience</strong> in the real estate industry, Sir JJ Asilo has established himself as a trusted 
                  advisor for home buyers and sellers throughout the metropolitan area. Specializing in <strong>luxury residential properties</strong>, JJ 
                  combines deep market knowledge with personalized service to help clients achieve their real estate goals.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  He holds certifications in luxury home marketing and has consistently ranked among the <strong>top 10% of agents</strong> in his 
                  region. JJ's commitment to excellence and client satisfaction has earned him numerous referrals and repeat 
                  business from satisfied customers.
                </p>
              </div>
            </div>

            {/* Active Listings */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#002B5C] mb-2">Featured Listings</h2>
                  <p className="text-gray-600">Handpicked properties from our exclusive portfolio</p>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5C] focus:border-transparent"
                  >
                    <option value="price">Sort by Price</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <button 
                    onClick={() => navigate('/properties')}
                    className="bg-[#002B5C] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#002B5C]/90 transition-colors font-medium"
                  >
                    View All (15)
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B5C]"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-b-2 border-[#FFD700] opacity-20"></div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-600 bg-red-50 rounded-xl">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeListings.map((property) => (
                    <div key={property.id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative overflow-hidden">
                        <img
                          src={property.images?.[0]?.url || 'http://localhost:3001/test/asset/img/property/1_start_house.jpeg'}
                          alt={property.name}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 left-3 flex gap-2">
                          {property.name.includes('New') && (
                            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              🎉 NEW
                            </span>
                          )}
                          {property.hadDiscount && (
                            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              🔥 SALE
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="mb-3">
                          <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#002B5C] transition-colors">
                            {property.name}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {property.address.street}, {property.address.city}
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-[#002B5C]">
                              {formatPrice(property.discountPrice || property.price)}
                            </p>
                            {property.hadDiscount && property.discountPrice && (
                              <p className="text-sm text-gray-500 line-through">
                                {formatPrice(property.price)}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                              </svg>
                              <span className="font-medium">{property.beds}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">{property.baths}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">{property.size.toLocaleString()} ft²</span>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleViewDetails(property.id)}
                          className="w-full bg-gradient-to-r from-[#002B5C] to-[#004080] text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <span>View Details</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact & Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Form */}
            <div id="contact-form" className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-[#002B5C] mb-2">Get In Touch</h3>
                <p className="text-gray-600">Ready to find your dream home? Let's talk!</p>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={contactForm.fullName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5C] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5C] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5C] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    placeholder="I'm interested in learning more about..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5C] focus:border-transparent resize-none transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#002B5C] py-3 px-6 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Certifications & Awards */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-[#002B5C] mb-6 text-center">Credentials & Awards</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">🏆</span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">Certified Luxury Home Marketing Specialist</div>
                    <div className="text-xs text-gray-600">Institute for Luxury Home Marketing</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">🥇</span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">Top 10% Agent - 2024</div>
                    <div className="text-xs text-gray-600">Regional Real Estate Board</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">⭐</span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">Customer Service Excellence Award</div>
                    <div className="text-xs text-gray-600">Real Estate Excellence Foundation</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">📜</span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">Real Estate License #RE12345</div>
                    <div className="text-xs text-gray-600">Licensed Since 2016</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-[#002B5C] mb-6 text-center">Client Testimonials</h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-900">Sarah M.</span>
                  </div>
                  <p className="text-sm text-gray-700 italic">
                    "Excellent service! JJ helped us find our dream home and made the process seamless. His expertise in luxury properties is unmatched."
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-900">Mike R.</span>
                  </div>
                  <p className="text-sm text-gray-700 italic">
                    "Professional and knowledgeable. Highly recommend for anyone looking to buy or sell. JJ goes above and beyond!"
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-500">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(4)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-gray-900">Lisa K.</span>
                  </div>
                  <p className="text-sm text-gray-700 italic">
                    "Great communication throughout the process. Very responsive to questions and always available when needed."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentProfiles; 