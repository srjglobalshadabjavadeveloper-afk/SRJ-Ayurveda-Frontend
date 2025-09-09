import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiPackage, FiShoppingCart, FiUsers, FiX, FiMenu } from 'react-icons/fi';

// Animation styles
const animationStyles = `
  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
  }
  
  .animate-slideIn {
    animation: slideIn 0.3s ease-out forwards;
  }
  
  .animate-slideOut {
    animation: slideOut 0.3s ease-out forwards;
  }
`;

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const menuItems = [
    { path: '/admin', icon: <FiHome className="h-5 w-5" />, label: 'Dashboard' },
    { path: '/admin/categories', icon: <FiGrid className="h-5 w-5" />, label: 'Categories' },
    { path: '/admin/subcategories', icon: <FiGrid className="h-5 w-5" />, label: 'SubCategories' },
    { path: '/admin/products', icon: <FiPackage className="h-5 w-5" />, label: 'Products' },
    { path: '/admin/orders', icon: <FiShoppingCart className="h-5 w-5" />, label: 'Orders' },
    { path: '/admin/customers', icon: <FiUsers className="h-5 w-5" />, label: 'Customers' },
  ];

  return (
    <>
      {/* Animation styles */}
      <style>{animationStyles}</style>
      
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar - Fixed and full height with lower z-index than navbar */}
      <div 
        className={`fixed top-0 bottom-0 left-0 z-20 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0 animate-slideIn' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-5 px-2 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (isOpen) toggleSidebar();
              }}
              className={`group flex items-center px-3 py-3 text-base font-medium rounded-lg mb-1 transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className={`mr-3 h-5 w-5 ${
                isActive(item.path) ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-500'
              }`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* Sidebar footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Ayurvedh Admin Panel v1.0
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;