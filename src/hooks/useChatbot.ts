import { useState, useCallback, useRef, useEffect } from 'react'
import type { ChatMessage, ChatbotState, LocalData, ChatRequest } from '../types/chatbot'
import mockData from '../data/mockData.json'

const RATE_LIMIT_DELAY = 1500 // 1.5 seconds between requests

export const useChatbot = () => {
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

  // Extract entities from user message
  const extractEntities = (message: string) => {
    const lowerMessage = message.toLowerCase()
    
    // Extract location
    const location = data.locations.find(loc => 
      lowerMessage.includes(loc.barangay.toLowerCase()) ||
      lowerMessage.includes(loc.city.toLowerCase())
    )?.barangay

    // Extract property type
    let property_type = ''
    if (lowerMessage.includes('house')) property_type = 'house'
    else if (lowerMessage.includes('condo')) property_type = 'condo'
    else if (lowerMessage.includes('townhouse')) property_type = 'townhouse'

    // Extract agent name
    const agent_name = data.agents.find(agent =>
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

  // Filter relevant data based on message
  const getRelevantData = (message: string) => {
    const entities = extractEntities(message)
    const lowerMessage = message.toLowerCase()

    let relevantProperties = data.properties
    let relevantAgents = data.agents
    let relevantLocations = data.locations

    // Filter properties based on entities
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

    // Filter locations based on context
    if (entities.location) {
      relevantLocations = relevantLocations.filter(loc =>
        loc.barangay.toLowerCase().includes(entities.location!.toLowerCase())
      )
    }

    // Determine intent
    let intent = 'general'
    if (lowerMessage.includes('house') || lowerMessage.includes('property') || lowerMessage.includes('condo')) {
      intent = 'property_search'
    } else if (lowerMessage.includes('agent') || lowerMessage.includes('trusted')) {
      intent = 'agent_inquiry'
    } else if (lowerMessage.includes('area') || lowerMessage.includes('location') || lowerMessage.includes('safe')) {
      intent = 'location_inquiry'
    } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      intent = 'greeting'
    }

    return {
      properties: relevantProperties.slice(0, 5), // Limit to 5 most relevant
      agents: relevantAgents.slice(0, 3), // Limit to 3 most relevant  
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

      const requestBody: ChatRequest = {
        message,
        context
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chatbot-local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred')
      }

      // Add AI response
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: data.response,
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
  }, [data])

  return {
    ...state,
    toggleChat,
    clearChat,
    sendMessage,
    inputRef
  }
} 