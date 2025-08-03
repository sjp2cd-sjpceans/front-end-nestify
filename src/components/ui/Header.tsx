import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, User, LogOut } from 'lucide-react'
import { Button } from './Button'
import { useAuth } from '../../hooks/useAuth'

export const Header: React.FC = () => {
  const { user, profile, isAuthenticated, signOut, loading } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      navigate('/')
    }
  }

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
          
          {/* Authentication Section */}
          <div className="flex items-center">
            {loading ? (
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="hidden md:flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {profile?.name || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-gray-500 capitalize">
                      {profile?.role || 'User'}
                    </p>
                  </div>
                </div>
                
                {/* Sign Out Button */}
                <Button 
                  variant="outline" 
                  size="md"
                  onClick={handleSignOut}
                  icon={<LogOut size={16} />}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="primary" size="md">
                  Sign In
                </Button>
              </Link>
            )}
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