import React from 'react'
import { Bot } from 'lucide-react'
import { Button } from './Button'

export const AIAssistantDemo: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ask Our AI Assistant
          </h2>
        </div>

        {/* Chat Interface Mockup */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <div className="space-y-6">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl rounded-br-md max-w-sm">
                <p className="text-sm sm:text-base">
                  What's the risk level in Matina area?
                </p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 rounded-full p-2 flex-shrink-0">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-white px-6 py-4 rounded-2xl rounded-tl-md shadow-sm flex-1">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-gray-900 text-sm">TrustSearch AI</span>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Matina has moderate risk levels due to occasional flooding and traffic congestion. 
                  Consider Maa or Banilad instead - both have better infrastructure and lower overall risk scores.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            variant="primary" 
            size="lg"
            icon={<Bot className="h-5 w-5" />}
            className="px-8 py-3"
          >
            Try AI Assistant
          </Button>
        </div>
      </div>
    </section>
  )
} 