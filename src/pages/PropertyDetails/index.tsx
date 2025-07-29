import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useAuth } from '../../context/AuthContext';
import { getPropertyById, getProperties, type Property } from '../../services/property.service';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);

  // Get images from property data, fallback to default if none available
  const getPropertyImages = () => {
    if (property?.images && property.images.length > 0) {
      return property.images.map(img => img.url); // Use img.url directly - it's already a complete URL
    }
    // Fallback to default images if no property images
    return [
      'http://localhost:3001/test/asset/img/default/default_000.jpg'
    ];
  };

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError('Property ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getPropertyById(id);
        setProperty(data);
        
        // Fetch similar properties
        const similar = await getProperties({ limit: 4 });
        setSimilarProperties(similar.filter(p => p.id !== id).slice(0, 4));
      } catch (err) {
        setError('Failed to load property details');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSaveProperty = () => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    console.log('Saving property:', property?.id);
    // Implement save functionality
  };

  const handleShareProperty = () => {
    console.log('Sharing property:', property?.id);
    // Implement share functionality
  };

  const handleAuthRequiredAction = (action: string) => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    console.log(`${action} - requires authentication`);
    // Implement specific action
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B5C]"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error || 'Property not found'}</p>
            <button 
              onClick={() => navigate('/properties')} 
              className="mt-4 bg-[#002B5C] text-white px-4 py-2 rounded hover:bg-[#002B5C]/90"
            >
              Back to Properties
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#002B5C] hover:text-[#002B5C]/80 mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>

          {/* Property Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                {/* Status Badges */}
                <div className="flex gap-2 mb-3">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    For Sale
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    New Listing
                  </span>
                </div>

                {/* Property Title */}
                <h1 className="text-3xl font-bold text-[#002B5C] mb-2">
                  {property.name}
                </h1>

                {/* Address */}
                <div className="flex items-center text-gray-600 mb-4">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{property.address.street}, {property.address.city}</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  {property.hadDiscount && property.discountPrice ? (
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-[#002B5C]">
                        {formatPrice(property.discountPrice)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(property.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-[#002B5C]">
                      {formatPrice(property.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProperty}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title={isAuthenticated ? 'Save property' : 'Login to save properties'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isAuthenticated ? 'Save' : 'Login to Save'}
                </button>
                <button
                  onClick={handleShareProperty}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </button>
                {!isAuthenticated && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Guest viewing
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2">
              {/* Property Images */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="relative">
                  <img
                    src={getPropertyImages()[selectedImageIndex]}
                    alt={property.name}
                    className="w-full h-96 object-cover"
                  />
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="absolute bottom-4 right-4 bg-white/90 text-gray-800 px-4 py-2 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    View All Photos
                  </button>
                </div>

                {/* Image Thumbnails */}
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {getPropertyImages().map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index 
                            ? 'border-[#002B5C]' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#002B5C] mb-6">Property Details</h2>
                
                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-[#002B5C]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-[#002B5C]">{property.beds}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-[#002B5C]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-[#002B5C]">{property.baths}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-[#002B5C]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-[#002B5C]">{property.size.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Sq Ft</div>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-[#002B5C]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-[#002B5C]">3</div>
                    <div className="text-sm text-gray-600">Garage</div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium">{property.propertyType}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Year Built:</span>
                      <span className="font-medium">2019</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Lot Size:</span>
                      <span className="font-medium">0.75 acres</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">HOA Fees:</span>
                      <span className="font-medium">₱2,500/month</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Property Tax:</span>
                      <span className="font-medium">₱150,000/year</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">MLS ID:</span>
                      <span className="font-medium">#ML123456</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Agent and Actions */}
            <div className="lg:col-span-1">
              {/* Listing Agent */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#002B5C] mb-4">Listing Agent</h3>
                
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="http://localhost:3001/test/asset/img/actor/1_elon_musk_in_iron_man_suit.jpg"
                    alt="Agent"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Sir JJ Asilo</div>
                    <div className="text-sm text-gray-600">SUPZED Scammer Group</div>
                    <div className="flex items-center gap-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-1">4.9 (250 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => handleAuthRequiredAction('Message Agent')}
                    className="w-full bg-[#FFD700] text-[#002B5C] py-2 px-4 rounded-lg font-medium hover:bg-[#FFD700]/90 transition-colors"
                    title={isAuthenticated ? 'Message agent' : 'Login to contact agent'}
                  >
                    {isAuthenticated ? 'Message Agent' : 'Login to Message Agent'}
                  </button>
                  <button 
                    onClick={() => handleAuthRequiredAction('Call Agent')}
                    className="w-full bg-[#002B5C] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#002B5C]/90 transition-colors"
                    title={isAuthenticated ? 'Call agent' : 'Login to contact agent'}
                  >
                    {isAuthenticated ? 'Call (555) 123-4567' : 'Login to Call Agent'}
                  </button>
                  <button 
                    onClick={() => navigate('/agents')}
                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>

              {/* Interested Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#002B5C] mb-4">Interested in this property?</h3>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => handleAuthRequiredAction('Schedule Visit')}
                    className="w-full bg-[#002B5C] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#002B5C]/90 transition-colors"
                    title={isAuthenticated ? 'Schedule a visit' : 'Login to schedule visits'}
                  >
                    {isAuthenticated ? 'Schedule a Visit' : 'Login to Schedule Visit'}
                  </button>
                  <button 
                    onClick={() => handleAuthRequiredAction('Request Info')}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    title={isAuthenticated ? 'Request information' : 'Login to request information'}
                  >
                    {isAuthenticated ? 'Request Info' : 'Login to Request Info'}
                  </button>
                  <button 
                    onClick={() => handleAuthRequiredAction('Mortgage Calculator')}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    title={isAuthenticated ? 'Access mortgage calculator' : 'Login for mortgage calculator'}
                  >
                    {isAuthenticated ? 'Mortgage Calculator' : 'Login for Calculator'}
                  </button>
                </div>
              </div>

              {/* AI Assistant */}
              <div className="bg-[#002B5C] text-white rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#002B5C]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-semibold">AI Assistant</span>
                </div>
                
                <p className="text-sm mb-4">Get instant answers about this property</p>
                
                <div className="space-y-2 text-sm mb-4">
                  <button 
                    onClick={() => setShowAIAssistant(true)}
                    className="block w-full text-left p-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
                  >
                    "What's the neighborhood like?"
                  </button>
                  <button 
                    onClick={() => setShowAIAssistant(true)}
                    className="block w-full text-left p-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
                  >
                    "Show me similar properties"
                  </button>
                  <button 
                    onClick={() => setShowAIAssistant(true)}
                    className="block w-full text-left p-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
                  >
                    "Calculate monthly payments"
                  </button>
                </div>
                
                <button 
                  onClick={() => setShowAIAssistant(true)}
                  className="w-full bg-[#FFD700] text-[#002B5C] py-2 px-4 rounded-lg font-medium hover:bg-[#FFD700]/90 transition-colors"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#002B5C] mb-4">Description</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                Discover luxury living in this stunning modern estate, perfectly situated in the prestigious 
                Westside neighborhood. This architectural masterpiece combines contemporary design with 
                timeless elegance, offering an unparalleled living experience for the discerning buyer.
              </p>
              <p>
                The open-concept floor plan seamlessly connects the gourmet kitchen, featuring top-of-the-line 
                appliances and custom cabinetry, to the spacious living areas with soaring ceilings and floor-to-
                ceiling windows that flood the space with natural light. The master suite is a true retreat, complete 
                with a spa-like ensuite bathroom and walk-in closet.
              </p>
              <p>
                Outside, the meticulously landscaped grounds feature a resort-style pool, outdoor kitchen, and 
                multiple entertaining areas perfect for hosting gatherings. Additional highlights include a three-
                car garage, smart home technology throughout, and premium finishes in every room.
              </p>
            </div>
          </div>

          {/* Location & Neighborhood Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#002B5C]">Location & Neighborhood</h2>
              <a 
                href="#" 
                className="text-[#002B5C] hover:text-[#002B5C]/80 text-sm font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View in Google Maps
              </a>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-100 rounded-lg h-64 mb-6 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="text-gray-600 font-medium">Interactive Map</div>
                <div className="text-gray-500 text-sm">{property.address.street}, {property.address.city}</div>
              </div>
            </div>

            {/* Nearby Amenities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Elementary School</div>
                  <div className="text-sm text-gray-600">0.5 mi</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5zM6 16v-4h8v4H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Shopping Center</div>
                  <div className="text-sm text-gray-600">1.2 mi</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Hospital</div>
                  <div className="text-sm text-gray-600">2.1 mi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#002B5C] mb-6">Similar Properties</h2>
            
            {similarProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProperties.map((similarProperty) => (
                  <div 
                    key={similarProperty.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/property/${similarProperty.id}`)}
                  >
                    <img
                      src={similarProperty.images?.[0]?.url || 'http://localhost:3001/test/asset/img/property/1_start_house.jpeg'}
                      alt={similarProperty.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {similarProperty.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {similarProperty.address.street}, {similarProperty.address.city}
                      </p>
                      <p className="text-lg font-bold text-[#002B5C] mb-3">
                        {formatPrice(similarProperty.discountPrice || similarProperty.price)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                          <span>{similarProperty.beds}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{similarProperty.baths}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{similarProperty.size.toLocaleString()} sq ft</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No similar properties found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails; 