import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  // Check if user is on landing page
  const isOnLandingPage = location.pathname === '/';

  // Helper function to check if a link is active
  const isActiveLink = (path: string) => {
    if (path === '/' && isOnLandingPage) return true;
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Helper function to get link classes with active indicator
  const getLinkClasses = (path: string) => {
    const baseClasses = "text-[#002B5C] hover:text-[#002B5C]/80 transition-colors relative";
    const activeClasses = "after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-[#FFD700]";
    
    return isActiveLink(path) ? `${baseClasses} ${activeClasses}` : baseClasses;
  };

  return (
    <header className="bg-white py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-2xl font-bold text-[#002B5C]">
          Nestify
        </Link>
        
        <nav className="flex items-center space-x-8">
          {isAuthenticated ? (
            <>
              {isOnLandingPage ? (
                <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
                  Dashboard
                </Link>
              ) : (
                <Link to="/" className={getLinkClasses('/')}>
                  Home
                </Link>
              )}
              <Link to="/properties" className={getLinkClasses('/properties')}>
                Property Listings
              </Link>
              <Link to="/agents" className={getLinkClasses('/agents')}>
                Agent/Broker Profiles
              </Link>
              <Link to="/recommendations" className={getLinkClasses('/recommendations')}>
                Recommendations
              </Link>
              <Link to="/saved" className={getLinkClasses('/saved')}>
                Saved Properties
              </Link>
              <Link to="/messages" className={getLinkClasses('/messages')}>
                Messages
              </Link>
              
              {/* User Menu */}
              <div className="relative flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 text-[#002B5C] hover:text-[#002B5C]/80"
                >
                  <img
                    src="http://localhost:3001/test/asset/img/actor/1_elon_musk_in_iron_man_suit.jpg"
                    alt={user?.firstName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{user?.firstName}</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 px-3 py-1 rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="text-[#002B5C] hover:text-[#002B5C]/80">Home</Link>
              <Link to="/listings" className="text-[#002B5C] hover:text-[#002B5C]/80">Listings</Link>
              <Link to="/agents" className="text-[#002B5C] hover:text-[#002B5C]/80">Agent/Broker Profiles</Link>
              <Link to="/auth" className="text-[#002B5C] hover:text-[#002B5C]/80">Login</Link>
              <Link 
                to="/auth?tab=register" 
                className="bg-[#002B5C] text-white px-4 py-2 rounded hover:bg-[#002B5C]/90 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 