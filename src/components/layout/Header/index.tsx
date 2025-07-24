import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-[#002B5C]">Nestify</div>
        
        <nav className="flex items-center space-x-8">
          <a href="/" className="text-[#002B5C] hover:text-[#002B5C]/80">Home</a>
          <a href="/listings" className="text-[#002B5C] hover:text-[#002B5C]/80">Listings</a>
          <a href="/login" className="text-[#002B5C] hover:text-[#002B5C]/80">Login</a>
          <a 
            href="/signup" 
            className="bg-[#002B5C] text-white px-4 py-2 rounded hover:bg-[#002B5C]/90 transition-colors"
          >
            Sign Up
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header; 