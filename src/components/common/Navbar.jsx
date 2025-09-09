import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuthContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-2xl font-bold text-emerald-800">Ayurvedh</span>
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <Link 
                to="/" 
                className="text-emerald-900 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-emerald-900 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                Products
              </Link>
              <Link 
                to="/about" 
                className="text-emerald-900 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-emerald-900 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                Contact
              </Link>
            </div>
          </div>
          
          {/* Desktop Authentication Links */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/cart" 
                  className="relative p-1 text-emerald-900 hover:text-emerald-600 transition-colors duration-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </Link>
                {/* Wishlist Icon */}
                <Link 
                  to="/wishlist" 
                  className="relative p-1 text-emerald-900 hover:text-emerald-600 transition-colors duration-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center text-sm rounded-full focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-800 font-semibold">U</span>
                  </div>
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors duration-300"
                  >
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-sm font-medium rounded-md transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-sm font-medium rounded-md transition-colors duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button and icons */}
          <div className="flex items-center sm:hidden">
            {isAuthenticated && (
              <>
                <Link 
                  to="/cart" 
                  className="relative p-1 text-emerald-900 hover:text-emerald-600 transition-colors duration-300 mr-1"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </Link>
                {/* Wishlist Icon */}
                <Link 
                  to="/wishlist" 
                  className="relative p-1 text-emerald-900 hover:text-emerald-600 transition-colors duration-300 mr-1"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center text-sm rounded-full focus:outline-none mr-2"
                >
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-800 font-semibold">U</span>
                  </div>
                </Link>
              </>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-900 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none transition-colors duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-base font-medium text-emerald-900 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className="block px-3 py-2 rounded-md text-base font-medium text-emerald-900 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </Link>
          <Link 
            to="/about" 
            className="block px-3 py-2 rounded-md text-base font-medium text-emerald-900 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="block px-3 py-2 rounded-md text-base font-medium text-emerald-900 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-emerald-900 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="px-3 py-2 flex flex-col space-y-3">
              <Link 
                to="/login" 
                className="block text-center px-4 py-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-sm font-medium rounded-md transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="block text-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;