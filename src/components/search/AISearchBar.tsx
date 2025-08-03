import React, { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'

interface AISearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export const AISearchBar: React.FC<AISearchBarProps> = ({ 
  onSearch, 
  placeholder = "Ask me anything..." 
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const quickSearchSuggestions = [
    'Flood-free condos in BGC',
    'Family homes near schools',
    'Safe areas in Cebu City'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onSearch(suggestion)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative bg-blue-50 border-2 transition-colors rounded-xl overflow-hidden ${
          isFocused ? 'border-blue-500 bg-white' : 'border-blue-200'
        }`}>
          <div className="flex items-center p-4">
            <Sparkles className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-500 text-lg min-h-[60px] leading-relaxed"
              rows={2}
            />
            <button
              type="submit"
              className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Ask AI
            </button>
          </div>
        </div>
      </form>

      {/* Quick Search Suggestions */}
      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-3">Try these:</p>
        <div className="flex flex-wrap gap-3">
          {quickSearchSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Sample Query Hint */}
      <div className="mt-4 text-center">
        <p className="text-gray-500 text-sm">
          Ask our AI in natural language. Try: "2BR condo in Cebu under ₱8M, flood-free, near mall"
        </p>
      </div>
    </div>
  )
} 