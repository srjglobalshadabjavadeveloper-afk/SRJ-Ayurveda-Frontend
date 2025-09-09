import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { FiLogOut, FiExternalLink, FiMenu, FiBell, FiUser } from 'react-icons/fi';

// Animation styles
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideDown {
    from { 
      opacity: 0;
      transform: translateY(-10px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .animate-slideDown {
    animation: slideDown 0.3s ease-out forwards;
  }
`;

const AdminNavbar = ({ toggleSidebar }) => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Animation styles */}
      <style>{animationStyles}</style>
      
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-md text-white hover:bg-emerald-600 focus:outline-none transition-colors duration-300"
              >
                <FiMenu className="h-6 w-6" />
              </button>
              
              <div className="flex-shrink-0 flex items-center ml-2 md:ml-0">
                <Link to="/admin" className="text-xl font-bold flex items-center">
                  <span className="bg-white text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    <span className="font-bold">A</span>
                  </span>
                  Ayurvedh Admin
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-1 rounded-full text-white hover:bg-emerald-600 focus:outline-none transition-colors duration-300">
                <FiBell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-amber-400 ring-2 ring-emerald-700"></span>
              </button>
              
              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none transition-colors duration-300"
                >
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-emerald-700" />
                  </div>
                </button>
                
                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 animate-slideDown z-50">
                    <div className="py-1">
                      <Link
                        to="/"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiExternalLink className="mr-2 h-4 w-4" />
                        View Store
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;