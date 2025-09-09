import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import AdminNavbar from './AdminNavbar'; 
import AdminSidebar from './AdminSidebar'; 

// Animation styles
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px); 
    }
    to { 
      opacity: 1;
      transform: translateY(0); 
    }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes countUp {
    from { 
      opacity: 0;
      transform: translateY(10px); 
    }
    to { 
      opacity: 1;
      transform: translateY(0); 
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }
  
  .animate-slideUp {
    animation: slideUp 0.8s ease-out forwards;
  }
  
  .animate-pulse {
    animation: pulse 2s infinite;
  }
  
  .animate-countUp {
    animation: countUp 0.8s ease-out forwards;
  }
  
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
`;

function AdminDashboard() {
  const { user } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({  
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Set visibility after component mounts to trigger animations
    setIsVisible(true);
    
    // Simulate counting up animation
    const targetCounts = {
      products: 24,
      orders: 18,
      users: 42,
      revenue: 1240
    };
    
    const duration = 1500; // ms
    const interval = 30; // ms
    const steps = duration / interval;
    
    let currentStep = 0;
    const counter = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounts({
        products: Math.floor(targetCounts.products * progress),
        orders: Math.floor(targetCounts.orders * progress),
        users: Math.floor(targetCounts.users * progress),
        revenue: Math.floor(targetCounts.revenue * progress)
      });
      
      if (currentStep >= steps) {
        clearInterval(counter);
        setCounts(targetCounts);
      }
    }, interval);
    
    return () => clearInterval(counter);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Animation styles */}
      <style>{animationStyles}</style>
      
      <AdminNavbar toggleSidebar={toggleSidebar} />
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content area with padding for fixed navbar and margin for fixed sidebar */}
      <div className="pt-16 md:pl-64">
        <div className="p-4 md:p-6">
          <div className={`mb-6 md:mb-8 ${isVisible ? 'animate-slideUp' : ''}`}>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}!</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Products Card */}
            <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 ${isVisible ? 'animate-slideUp stagger-1' : ''}`}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-3 md:ml-4">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-700">Total Products</h3>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 animate-countUp">{counts.products}</p>
                </div>
              </div>
            </div>
            
            {/* Orders Card */}
            <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 ${isVisible ? 'animate-slideUp stagger-2' : ''}`}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-3 md:ml-4">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-700">Total Orders</h3>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 animate-countUp">{counts.orders}</p>
                </div>
              </div>
            </div>
            
            {/* Users Card */}
            <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 ${isVisible ? 'animate-slideUp stagger-3' : ''}`}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 text-amber-600 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-3 md:ml-4">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-700">Total Users</h3>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 animate-countUp">{counts.users}</p>
                </div>
              </div>
            </div>
            
            {/* Revenue Card */}
            <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 ${isVisible ? 'animate-slideUp stagger-4' : ''}`}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 md:ml-4">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-700">Revenue</h3>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 animate-countUp">${counts.revenue}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Orders Table */}
          <div className={`bg-white rounded-xl shadow-md overflow-hidden ${isVisible ? 'animate-slideUp' : ''}`} style={{ animationDelay: '0.5s' }}>
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-001</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">2023-05-15</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">$120.50</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Delivered
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-002</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">Jane Smith</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">2023-05-16</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">$85.00</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Processing
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-003</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">Robert Johnson</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">2023-05-17</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">$210.75</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Shipped
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-004</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">Emily Davis</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">2023-05-18</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">$65.25</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Cancelled
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-4 md:px-6 py-3">
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-300 flex items-center">
                View all orders
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 md:mt-8 ${isVisible ? 'animate-slideUp' : ''}`} style={{ animationDelay: '0.7s' }}>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Add New Product</h3>
              <p className="text-emerald-100 mb-4">Create a new product listing</p>
              <button className="px-4 py-2 bg-white text-emerald-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300">
                Add Product
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-bold mb-2">View Reports</h3>
              <p className="text-blue-100 mb-4">Analyze sales and performance data</p>
              <button className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;