import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#002B5C]">Nestify</Link>
        
        <nav className="flex items-center space-x-8">
          <Link to="/" className="text-[#002B5C] hover:text-[#002B5C]/80">Home</Link>
          <Link to="/listings" className="text-[#002B5C] hover:text-[#002B5C]/80">Listings</Link>
          <Link to="/auth" className="text-[#002B5C] hover:text-[#002B5C]/80">Login</Link>
          <Link 
            to="/auth?tab=register" 
            className="bg-[#002B5C] text-white px-4 py-2 rounded hover:bg-[#002B5C]/90 transition-colors"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 