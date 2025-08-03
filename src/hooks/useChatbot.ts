import { useState, useCallback, useRef, useEffect } from 'react'
import type { ChatMessage, ChatbotState, LocalData } from '../types/chatbot'
import type { Property } from '../types'
import mockData from '../data/mockData.json'

const RATE_LIMIT_DELAY = 1500 // 1.5 seconds between requests

// Define what questions require premium subscription
const isPremiumQuestion = (message: string): boolean => {
  const lowerMessage = message.toLowerCase()
  const premiumKeywords = [
    // Investment & Financial Analysis (Premium)
    'investment advice', 'roi', 'return on investment', 'investment potential', 'resale value',
    'property value trends', 'market forecast', 'price prediction', 'financial advice', 
    'mortgage recommendation', 'investment analysis', 'profit potential', 'appreciation rate',
    
    // Detailed Market Analysis (Premium)
    'market analysis', 'competitive analysis', 'neighborhood comparison', 'market trends',
    'property comparison', 'market data', 'price history', 'value analysis',
    
    // Detailed Risk Analysis (Premium)
    'detailed risk', 'crime statistics', 'historical crime', 'flood history', 'detailed flood',
    'risk analysis', 'environmental impact', 'natural disaster', 'climate risk'
  ]
  
  return premiumKeywords.some(keyword => lowerMessage.includes(keyword))
}

// Check if it's a basic safety question (FREE)
const isBasicSafetyQuestion = (message: string): boolean => {
  const lowerMessage = message.toLowerCase()
  const basicSafetyKeywords = [
    'safe', 'safety', 'crime rate', 'security', 'dangerous', 'crime', 'theft', 'robbery'
  ]
  
  return basicSafetyKeywords.some(keyword => lowerMessage.includes(keyword))
}

export const useChatbot = (property?: Property) => {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    messages: [],
    isLoading: false,
    error: null
  })

  const lastRequestTime = useRef<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const data = mockData as LocalData

  // Focus input after AI responds
  useEffect(() => {
    if (!state.isLoading && state.isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [state.isLoading, state.isOpen])

  const toggleChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }))
  }, [])

  const clearChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
      error: null
    }))
  }, [])

  // Extract entities from user message with property context
  const extractEntities = (message: string) => {
    const lowerMessage = message.toLowerCase()
    
    // If we have property context, prioritize it
    const location = property ? 
      property.location.barangay : 
      data.locations.find(loc => 
        lowerMessage.includes(loc.barangay.toLowerCase()) ||
        lowerMessage.includes(loc.city.toLowerCase())
      )?.barangay

    // Extract property type - use current property type if available
    let property_type = property ? property.property_type.toLowerCase() : ''
    if (!property_type) {
      if (lowerMessage.includes('house')) property_type = 'house'
      else if (lowerMessage.includes('condo')) property_type = 'condo'
      else if (lowerMessage.includes('townhouse')) property_type = 'townhouse'
    }

    // Extract agent name - use current property's agent if available
    const agent_name = property?.agent?.name || 
      data.agents.find(agent =>
        lowerMessage.includes(agent.name.toLowerCase())
      )?.name

    // Extract price range
    let price_range = ''
    if (lowerMessage.includes('affordable') || lowerMessage.includes('cheap') || lowerMessage.includes('budget')) {
      price_range = 'low'
    } else if (lowerMessage.includes('luxury') || lowerMessage.includes('expensive') || lowerMessage.includes('premium')) {
      price_range = 'high'
    }

    return { location, property_type, agent_name, price_range }
  }

  // Filter relevant data based on message with property context
  const getRelevantData = (message: string) => {
    const entities = extractEntities(message)
    const lowerMessage = message.toLowerCase()

    // If we have a specific property, include it in context
    let relevantProperties = property ? [
      // Convert Property to chatbot Property format
      {
        id: property.id,
        title: property.title,
        price: property.price,
        location: {
          barangay: property.location.barangay,
          city: property.location.city,
          region: property.location.province || property.location.city
        },
        agent_id: property.agent_id,
        property_type: property.property_type,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        area_sqm: property.floor_area || 0,
        environmental_tags: property.environmental_tags,
        description: property.description,
        status: property.status,
        created_at: property.created_at
      }
    ] : data.properties

    let relevantAgents = property?.agent ? [{
      id: property.agent.id,
      name: property.agent.name,
      trust_score: property.agent.trust_score,
      verified: property.agent.verified,
      verification_level: property.agent.verification_level,
      contact: property.agent.email || '',
      phone: property.agent.phone || '',
      specialties: [],
      years_experience: 0,
      total_listings: 0,
      successful_sales: 0,
      description: `${property.agent.verification_level} Agent`
    }] : data.agents

    let relevantLocations = data.locations

    // Apply additional filtering based on entities if no specific property
    if (!property) {
      if (entities.location) {
        relevantProperties = relevantProperties.filter(prop =>
          prop.location.barangay.toLowerCase().includes(entities.location!.toLowerCase())
        )
      }

      if (entities.property_type) {
        relevantProperties = relevantProperties.filter(prop =>
          prop.property_type === entities.property_type
        )
      }

      if (entities.agent_name) {
        const agent = data.agents.find(a => a.name.toLowerCase() === entities.agent_name!.toLowerCase())
        if (agent) {
          relevantProperties = relevantProperties.filter(prop => prop.agent_id === agent.id)
          relevantAgents = [agent]
        }
      }

      if (entities.price_range === 'low') {
        relevantProperties = relevantProperties.filter(prop => prop.price < 2000000)
      } else if (entities.price_range === 'high') {
        relevantProperties = relevantProperties.filter(prop => prop.price > 4000000)
      }
    }

    // Filter locations based on context
    if (entities.location) {
      relevantLocations = relevantLocations.filter(loc =>
        loc.barangay.toLowerCase().includes(entities.location!.toLowerCase())
      )
    }

    // Determine intent with property context
    let intent = 'general'
    if (property && (lowerMessage.includes('this property') || lowerMessage.includes('this house') || lowerMessage.includes('this place'))) {
      intent = 'current_property'
    } else if (lowerMessage.includes('house') || lowerMessage.includes('property') || lowerMessage.includes('condo')) {
      intent = 'property_search'
    } else if (lowerMessage.includes('agent') || lowerMessage.includes('trusted')) {
      intent = 'agent_inquiry'
    } else if (lowerMessage.includes('area') || lowerMessage.includes('location') || lowerMessage.includes('safe')) {
      intent = 'location_inquiry'
    } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      intent = 'greeting'
    }

    return {
      properties: relevantProperties.slice(0, 5),
      agents: relevantAgents.slice(0, 3),
      locations: relevantLocations,
      intent,
      entities
    }
  }

  const sendMessage = useCallback(async (message: string) => {
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime.current

    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      setState(prev => ({
        ...prev,
        error: `Please wait ${Math.ceil((RATE_LIMIT_DELAY - timeSinceLastRequest) / 1000)} seconds before sending another message.`
      }))
      return
    }

    // Check if this is a premium question
    if (isPremiumQuestion(message)) {
      const premiumMessage: ChatMessage = {
        id: `premium-${Date.now()}`,
        content: "🔒 This detailed analysis requires a premium subscription. Upgrade to TrustSearch Premium for ₱299/month to get:\n\n• Detailed risk assessments\n• Investment advice & ROI calculations\n• Market trend analysis\n• Neighborhood comparisons\n• Property value forecasts\n\nWould you like to ask a general question about this property instead?",
        isUser: false,
        timestamp: new Date()
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: `user-${Date.now()}`,
          content: message,
          isUser: true,
          timestamp: new Date()
        }, premiumMessage]
      }))
      return
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      isUser: true,
      timestamp: new Date()
    }

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }))

    try {
      lastRequestTime.current = now

      // Get relevant data for context
      const context = getRelevantData(message)

      // Generate local response based on context and property data
      const response = generateLocalResponse(message, context, property)

      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

      // Add AI response
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: response,
        isUser: false,
        timestamp: new Date()
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false
      }))

    } catch (error) {
      console.error('Chat error:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      }))
    }
  }, [data, property])

  // Generate local responses based on mock data
  const generateLocalResponse = (message: string, context: any, currentProperty?: Property): string => {
    const lowerMessage = message.toLowerCase()
    
    // Greeting responses
    if (context.intent === 'greeting') {
      if (currentProperty) {
        return `Hello! I'm here to help you learn about this ${currentProperty.property_type.toLowerCase()} in ${currentProperty.location.barangay}. What would you like to know about this property?`
      }
      return "Hello! I'm your TrustSearch assistant. How can I help you with your property search today?"
    }

    // Current property specific responses
    if (currentProperty && context.intent === 'current_property') {
      const location = data.locations.find(loc => loc.barangay === currentProperty.location.barangay)
      const agent = data.agents.find(a => a.id === currentProperty.agent_id)
      
      let response = `Here's what I can tell you about this ${currentProperty.property_type.toLowerCase()}:\n\n`
      response += `🏠 **${currentProperty.title}**\n`
      response += `💰 Price: ₱${currentProperty.price.toLocaleString()}\n`
      response += `📍 Location: ${currentProperty.location.barangay}, ${currentProperty.location.city}\n`
      response += `🛏️ ${currentProperty.bedrooms} bedrooms, ${currentProperty.bathrooms} bathrooms\n`
      response += `📐 Floor area: ${currentProperty.floor_area || 'Not specified'} sqm\n\n`
      
      if (location) {
        response += `🏘️ **Area Information:**\n`
        response += `• Safety score: ${location.risk_profile.safety_score}/10\n`
        response += `• Crime rate: ${location.risk_profile.crime_rate}\n`
        response += `• Flood risk: ${location.risk_profile.flood_risk}\n`
        response += `• Traffic level: ${location.risk_profile.traffic_level}\n\n`
      }
      
      if (agent) {
        response += `👤 **Agent: ${agent.name}**\n`
        response += `⭐ Trust score: ${agent.trust_score}/10\n`
        response += `✅ ${agent.verification_level}\n`
        response += `📞 Contact: ${agent.phone}\n\n`
      }
      
      response += `🏷️ **Property Tags:** ${currentProperty.environmental_tags.join(', ')}\n\n`
      response += `Would you like to know more about the neighborhood, pricing, or anything specific about this property?`
      
      return response
    }

    // Basic Safety Questions (FREE) - prioritize over general location inquiry
    if (isBasicSafetyQuestion(message)) {
      if (currentProperty) {
        const location = data.locations.find(loc => loc.barangay === currentProperty.location.barangay)
        if (location) {
          let response = `🔒 **Safety Information for ${location.barangay}:**\n\n`
          response += `• **Overall Safety Score:** ${location.risk_profile.safety_score}/10\n`
          response += `• **Crime Rate:** ${location.risk_profile.crime_rate}\n`
          response += `• **Flood Risk:** ${location.risk_profile.flood_risk}\n\n`
          
          if (location.risk_profile.safety_score >= 8) {
            response += `✅ This is considered a very safe area with low crime rates.`
          } else if (location.risk_profile.safety_score >= 6) {
            response += `⚠️ This area has moderate safety levels. Standard precautions are recommended.`
          } else {
            response += `⚠️ This area requires extra caution. Consider security measures.`
          }
          
          response += `\n\n💡 *Want detailed crime statistics and historical trends? Upgrade to TrustSearch Premium for comprehensive risk analysis.*`
          
          return response
        }
      }
    }

    // Location/area inquiries
    if (context.intent === 'location_inquiry') {
      const location = currentProperty ? 
        data.locations.find(loc => loc.barangay === currentProperty.location.barangay) :
        context.locations[0]
      
      if (location) {
        let response = `📍 **${location.barangay}, ${location.city}** is a great area! Here's what you should know:\n\n`
        response += `🔒 **Safety & Security:**\n`
        response += `• Safety score: ${location.risk_profile.safety_score}/10\n`
        response += `• Crime rate: ${location.risk_profile.crime_rate}\n`
        response += `• Flood risk: ${location.risk_profile.flood_risk}\n\n`
        response += `🚗 **Transportation:**\n`
        response += `• Traffic level: ${location.risk_profile.traffic_level}\n\n`
        response += `🏥 **Accessibility:**\n`
        response += `• Healthcare access: ${location.risk_profile.healthcare_access}\n`
        response += `• Education access: ${location.risk_profile.education_access}\n\n`
        response += `🎯 **Nearby Amenities:** ${location.amenities.join(', ')}\n\n`
        response += `💰 **Average price per sqm:** ₱${location.average_price_per_sqm.toLocaleString()}\n\n`
        response += location.description
        
        return response
      }
    }

    // Agent inquiries
    if (context.intent === 'agent_inquiry') {
      const agent = currentProperty?.agent || context.agents[0]
      
      if (agent) {
        let response = `👤 **${agent.name}** - ${agent.verification_level}\n\n`
        response += `⭐ **Trust Score:** ${agent.trust_score}/10\n`
        response += `✅ **Verification:** ${agent.verified ? 'Verified' : 'Not verified'}\n`
        response += `📞 **Contact:** ${agent.phone}\n`
        response += `📧 **Email:** ${agent.contact}\n`
        response += `🎯 **Specialties:** ${agent.specialties.join(', ')}\n`
        response += `📈 **Experience:** ${agent.years_experience} years\n`
        response += `🏠 **Active Listings:** ${agent.total_listings}\n`
        response += `✅ **Successful Sales:** ${agent.successful_sales}\n\n`
        response += agent.description
        
        return response
      }
    }

    // Property search responses
    if (context.intent === 'property_search') {
      const properties = context.properties.slice(0, 3)
      
      if (properties.length > 0) {
        let response = `🏠 Here are some properties that match your search:\n\n`
        
        properties.forEach((prop: any, index: number) => {
          response += `**${index + 1}. ${prop.title}**\n`
          response += `💰 ₱${prop.price.toLocaleString()}\n`
          response += `📍 ${prop.location.barangay}, ${prop.location.city}\n`
          response += `🛏️ ${prop.bedrooms}BR/${prop.bathrooms}BA • ${prop.area_sqm}sqm\n`
          response += `🏷️ ${prop.environmental_tags.join(', ')}\n\n`
        })
        
        response += `Would you like more details about any of these properties?`
        return response
      }
    }

    // Price-related questions (FREE)
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
      if (currentProperty) {
        const location = data.locations.find(loc => loc.barangay === currentProperty.location.barangay)
        let response = `💰 **Pricing Information for this property:**\n\n`
        response += `• **Listed Price:** ₱${currentProperty.price.toLocaleString()}\n`
        
        if (currentProperty.floor_area) {
          const pricePerSqm = Math.round(currentProperty.price / currentProperty.floor_area)
          response += `• **Price per sqm:** ₱${pricePerSqm.toLocaleString()}\n`
        }
        
        if (location) {
          response += `• **Area average:** ₱${location.average_price_per_sqm.toLocaleString()}/sqm\n`
          response += `• **Market range:** ₱${data.market_stats.price_range.min.toLocaleString()} - ₱${data.market_stats.price_range.max.toLocaleString()}\n\n`
          
          const isAboveAverage = currentProperty.price > data.market_stats.price_range.average
          response += isAboveAverage ? 
            `📈 This property is priced above the market average, likely due to its location in ${currentProperty.location.barangay} and features.` :
            `📉 This property offers good value compared to the market average.`
        }
        
        response += `\n\n💡 *Want detailed market analysis and price predictions? Upgrade to TrustSearch Premium for investment insights.*`
        
        return response
      }
    }

    // Transportation/accessibility questions (FREE)
    if (lowerMessage.includes('transport') || lowerMessage.includes('traffic') || lowerMessage.includes('commute')) {
      if (currentProperty) {
        const location = data.locations.find(loc => loc.barangay === currentProperty.location.barangay)
        if (location) {
          let response = `🚗 **Transportation & Accessibility:**\n\n`
          response += `• **Traffic Level:** ${location.risk_profile.traffic_level}\n`
          response += `• **Healthcare Access:** ${location.risk_profile.healthcare_access}\n`
          response += `• **Education Access:** ${location.risk_profile.education_access}\n\n`
          response += `🎯 **Nearby Amenities:** ${location.amenities.join(', ')}\n\n`
          
          if (location.risk_profile.traffic_level === 'Light') {
            response += `✅ Great news! This area has light traffic, making commutes easier.`
          } else if (location.risk_profile.traffic_level === 'Moderate') {
            response += `⚠️ Moderate traffic levels - plan your commute times accordingly.`
          } else {
            response += `🚦 Heavy traffic area - consider peak hours when planning travel.`
          }
          
          return response
        }
      }
    }

    // Default response
    if (currentProperty) {
      return `I'm here to help you learn about this ${currentProperty.property_type.toLowerCase()} in ${currentProperty.location.barangay}. You can ask me about:\n\n• Property details and pricing\n• Neighborhood safety and amenities\n• The listing agent\n• Transportation and accessibility\n• Area comparisons\n\nWhat would you like to know?`
    }

    return "I'm your TrustSearch assistant! I can help you with property information, area details, agent verification, and more. What would you like to know?"
  }

  return {
    ...state,
    toggleChat,
    clearChat,
    sendMessage,
    inputRef
  }
}