import React from 'react'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { Button } from './Button'

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">TrustSearch</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Search
            </Link>
            <a 
              href="#about" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </a>
          </nav>
          
          {/* Sign In Button */}
          <div className="flex items-center">
            <Button variant="primary" size="md">
              Sign In
            </Button>
          </div>
          
          {/* Mobile menu button - for future implementation */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 