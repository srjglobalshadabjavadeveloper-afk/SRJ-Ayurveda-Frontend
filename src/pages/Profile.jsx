// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../context/AuthContext';
import userService from '../services/userService';
import { FiUser, FiMapPin, FiShoppingBag, FiPackage, FiSettings, FiLogOut, FiEdit2, FiPlus, FiTrash2, FiEye, FiChevronRight, FiChevronDown, FiCreditCard, FiTruck, FiDollarSign, FiHome, FiMail, FiPhone, FiLock, FiEyeOff, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

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
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .animate-slideUp {
    animation: slideUp 0.5s ease-out forwards;
  }
  
  .animate-pulse {
    animation: pulse 2s infinite;
  }
  
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
`;

const Profile = () => {
  const { token, role, logout, isAuthenticated } = useAuthContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartSummary, setCartSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState("");
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [newAddress, setNewAddress] = useState({
    addressLine: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    mobile: ''
  });


  // Use a ref to track if the component has already fetched data
  const hasFetchedData = useRef(false);

  // Extract user info from token
  const getUserInfoFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        email: payload.sub,
        name: payload.name || 'User'
      };
    } catch (e) {
      console.error('Error parsing token:', e);
      return null;
    }
  };


  const userInfo = getUserInfoFromToken();

  // In your Profile.jsx, add this useEffect
  useEffect(() => {
    const checkToken = async () => {
      if (isAuthenticated) {
        const validation = await userService.validateToken();
        console.log('Token validation result:', validation);
        if (!validation.valid) {
          setError(`Token issue: ${validation.reason}. Please log in again.`);
        }
      }
    };
    checkToken();
  }, [isAuthenticated]);

  useEffect(() => {
    // Only fetch data if the user is authenticated and we haven't fetched data yet
    if (!isAuthenticated || hasFetchedData.current) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        hasFetchedData.current = true; // Mark that we're fetching data
        setError('');

        // Fetch addresses
        try {
          const addressesData = await userService.getAddresses();
          setAddresses(addressesData);
        } catch (err) {
          console.error("Error fetching addresses:", err);
          if (err.response && err.response.status === 401) {
            setError('Authentication error when fetching addresses. Please log in again.');
          } else {
            setAddresses([]);
          }
        }

        // Fetch orders
        try {
          const ordersData = await userService.getOrders();
          setOrders(ordersData);
        } catch (err) {
          console.error("Error fetching orders:", err);
          // If the error is 401, don't set orders to empty array, just log the error
          if (err.response && err.response.status === 401) {
            setError('Authentication error when fetching orders. Please log in again.');
          } else {
            setOrders([]);
          }
        }

        // Fetch cart
        try {
          const cartData = await userService.getCart();
          setCart(cartData);
        } catch (err) {
          console.error("Error fetching cart:", err);
          // If the error is 401, don't set cart to empty array, just log the error
          if (err.response && err.response.status === 401) {
            setError('Authentication error when fetching cart. Please log in again.');
          } else {
            setCart([]);
          }
        }

        // Fetch cart summary
        try {
          const summaryData = await userService.getCartSummary();
          setCartSummary(summaryData);
        } catch (err) {
          console.error("Error fetching cart summary:", err);
          // If the error is 401, don't set cart summary to null, just log the error
          if (err.response && err.response.status === 401) {
            setError('Authentication error when fetching cart summary. Please log in again.');
          } else {
            setCartSummary(null);
          }
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to fetch profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, isAuthenticated]);

  // Modify handleAddAddress to handle updates
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const added = await userService.addAddress(newAddress);
      setAddresses(prev => [...prev, added]);
      setSuccess('Address added successfully ✅');

      setNewAddress({
        addressLine: '',
        city: '',
        state: '',
        pinCode: '',
        country: '',
        mobile: ''
      });
      setShowAddAddressForm(false);
      setError('');
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Failed to save address. Please try again.');
    }
  };


  // Edit button click
  const handleEditClick = (address) => {
    setSelectedAddress({ ...address });
    setIsModalOpen(true);
  };

  // Update function
  const handleUpdate = async () => {
    try {
      const updated = await userService.updateAddress(
        selectedAddress.id,
        selectedAddress
      );

      console.log("API response:", updated);

      setAddresses(prev =>
        prev.map(addr =>
          addr.id === selectedAddress.id
            ? (updated?.id ? updated : selectedAddress)
            : addr
        )
      );
      setSuccess('Address updated successfully ✅');
      setIsModalOpen(false);
      setSelectedAddress(null);
    } catch (err) {
      console.error("Update failed", err.response?.data || err.message);
    }
  };


  const handleDeleteAddress = async (addressId) => {
    console.log("🗑️ Trying to delete ID:", addressId);
    try {
      await userService.deleteAddress(addressId);
      setSuccess("Address deleted successfully");
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    } catch (err) {
      console.error("Error deleting address:", err);
      setError("Failed to delete address. Please try again.");
    }
  };

  const handleRemoveCartItem = async (cartItemId) => {
    try {
      await userService.removeCartItem(cartItemId);
      setCart(cart.filter(item => item.id !== cartItemId));
      // Refresh cart summary
      try {
        const summaryData = await userService.getCartSummary();
        setCartSummary(summaryData);
      } catch (err) {
        console.error("Error refreshing cart summary:", err);
      }
    } catch (err) {
      console.error('Error removing cart item:', err);
    }
  };

  const handleClearCart = async () => {
    try {
      await userService.clearCart();
      setCart([]);
      setCartSummary(null);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    try {
      setPasswordLoading(true);
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Hide form after successful change
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      if (err.response?.status === 401) {
        setPasswordError('Current password is incorrect');
      } else {
        setPasswordError('Failed to change password. Please try again.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    // Redirect to login page
    window.location.href = '/login';
  };

  // If not authenticated, show a loading state or redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }


  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-start">
          <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p>{error}</p>
            <button
              onClick={() => setError("")}
              className="mt-1 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-start">
          <FiCheck className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p>{success}</p>
            <button
              onClick={() => setSuccess("")}
              className="mt-1 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {/* Animation styles */}
      <style>{animationStyles}</style>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 sm:px-10">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg animate-pulse">
                  <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center">
                    <FiUser className="h-10 w-10 text-indigo-600" />
                  </div>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white animate-slideUp">My Account</h1>
                <p className="text-indigo-200 mt-1 animate-slideUp stagger-1">{userInfo?.name}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-700 text-white animate-slideUp stagger-2">
                  {role}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 flex items-center ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FiUser className="mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 flex items-center ${activeTab === 'addresses' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FiMapPin className="mr-2" />
                Addresses
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 flex items-center ${activeTab === 'orders' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FiPackage className="mr-2" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('cart')}
                className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 flex items-center ${activeTab === 'cart' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FiShoppingBag className="mr-2" />
                Cart
              </button>
              <button
                onClick={handleLogout}
                className="ml-auto px-4 sm:px-6 py-4 text-sm font-medium text-red-500 hover:text-red-700 transition-colors duration-300 flex items-center"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
                  <div className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="animate-slideUp">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-300 transition-all duration-300 hover:border-indigo-300">
                          <FiMail className="text-gray-400 mr-3" />
                          <span>{userInfo?.email}</span>
                        </div>
                      </div>
                      <div className="animate-slideUp stagger-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-300 transition-all duration-300 hover:border-indigo-300">
                          <FiUser className="text-gray-400 mr-3" />
                          <span>{role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Security</h2>
                  <div className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300 transition-all duration-300 hover:border-indigo-300 animate-slideUp">
                        <div className="flex items-center">
                          <FiLock className="text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-800">Password</p>
                            <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPasswordForm(!showPasswordForm)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors duration-300"
                        >
                          Change <FiChevronRight className="ml-1" />
                        </button>
                      </div>

                      {/* Password Change Form */}
                      {showPasswordForm && (
                        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-slideUp">
                          <h3 className="text-lg font-medium text-gray-800 mb-4">Change Password</h3>

                          {passwordError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                              {passwordError}
                            </div>
                          )}

                          {passwordSuccess && (
                            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
                              <FiCheck className="mr-2" />
                              {passwordSuccess}
                            </div>
                          )}

                          <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                              <div className="relative">
                                <input
                                  type={showCurrentPassword ? "text" : "password"}
                                  name="currentPassword"
                                  value={passwordData.currentPassword}
                                  onChange={handlePasswordInputChange}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  required
                                />
                                <button
                                  type="button"
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                  {showCurrentPassword ? <FiEyeOff className="h-5 w-5 text-gray-400" /> : <FiEye className="h-5 w-5 text-gray-400" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                              <div className="relative">
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  name="newPassword"
                                  value={passwordData.newPassword}
                                  onChange={handlePasswordInputChange}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  required
                                />
                                <button
                                  type="button"
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                  {showNewPassword ? <FiEyeOff className="h-5 w-5 text-gray-400" /> : <FiEye className="h-5 w-5 text-gray-400" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                              <div className="relative">
                                <input
                                  type={showConfirmPassword ? "text" : "password"}
                                  name="confirmPassword"
                                  value={passwordData.confirmPassword}
                                  onChange={handlePasswordInputChange}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  required
                                />
                                <button
                                  type="button"
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? <FiEyeOff className="h-5 w-5 text-gray-400" /> : <FiEye className="h-5 w-5 text-gray-400" />}
                                </button>
                              </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                              <button
                                type="button"
                                onClick={() => setShowPasswordForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={passwordLoading}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center"
                              >
                                {passwordLoading ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Changing...
                                  </>
                                ) : 'Change Password'}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Saved Addresses</h2>
                  <button onClick={() => { setShowAddAddressForm(true); setEditingAddressId(null); setNewAddress({ addressLine: '', city: '', state: '', pinCode: '', country: '', mobile: '' }); }} className="px-3 py-1 bg-indigo-600 text-white rounded flex items-center">
                    <FiPlus className="mr-1" />Add Address
                  </button>
                </div>

                {/* ADD THIS ERROR DISPLAY RIGHT HERE */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700 mb-2">{error}</p>
                        {error.includes('session expired') && (
                          <button
                            onClick={() => {
                              localStorage.removeItem('token');
                              localStorage.removeItem('role');
                              window.location.href = '/login';
                            }}
                            className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Log In Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {showAddAddressForm && (
                  <div className="bg-gray-50 rounded-xl p-6 animate-slideUp">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Address</h3>
                    <form onSubmit={handleAddAddress} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line</label>
                          <input
                            type="text"
                            name="addressLine"
                            value={newAddress.addressLine}
                            onChange={handleAddressInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={newAddress.city}
                            onChange={handleAddressInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            value={newAddress.state}
                            onChange={handleAddressInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                          <input
                            type="text"
                            name="pinCode"
                            value={newAddress.pinCode}
                            onChange={handleAddressInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            name="country"
                            value={newAddress.country}
                            onChange={handleAddressInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                          <input
                            type="text"
                            name="mobile"
                            value={newAddress.mobile}
                            onChange={handleAddressInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>

                      </div>
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddAddressForm(false);
                            // setEditingAddressId(null);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          Save Address
                          {/* {editingAddressId ? "Update Address" : "Save Address"} */}
                        </button>
                      </div>
                    </form>
                  </div>
                )}



                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">Address #{index + 1}</h3>
                            <p className="text-gray-600 mt-2">{address.addressLine}</p>
                            <p className="text-gray-600">{address.city}, {address.state} - {address.pinCode}</p>
                            <p className="text-gray-600">{address.country}</p>
                            <p className="text-gray-600">Mobile: {address.mobile}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => handleEditClick(address)}
                              className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors duration-300">
                              <FiEdit2 />
                            </button>
                            <button onClick={() => handleDeleteAddress(address.id)}
                              className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors duration-300">
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl animate-fadeIn">
                    <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">No addresses found. Add your first address.</p>
                  </div>
                )}

                {/* update modal */}
                {isModalOpen && selectedAddress && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[650px] max-h-[100vh] overflow-y-auto">
                      <h2 className="text-lg font-bold mb-4">Update Address</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line</label>
                          <input
                            type="text"
                            value={selectedAddress.addressLine}
                            onChange={(e) => setSelectedAddress({ ...selectedAddress, addressLine: e.target.value })}
                            className="border p-2 w-full mb-3"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            value={selectedAddress.city}
                            onChange={(e) => setSelectedAddress({ ...selectedAddress, city: e.target.value })}
                            className="border p-2 w-full mb-3"
                          />
                        </div>


                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            value={selectedAddress.state}
                            onChange={(e) => setSelectedAddress({ ...selectedAddress, state: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>


                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                          <input
                            type="text"
                            name="pinCode"
                            value={selectedAddress.pinCode}
                            onChange={(e) => setSelectedAddress({ ...selectedAddress, pinCode: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            name="country"
                            value={selectedAddress.country}
                            onChange={(e) => setSelectedAddress({ ...selectedAddress, country: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                          <input
                            type="text"
                            name="mobile"
                            value={selectedAddress.mobile}
                            onChange={(e) => setSelectedAddress({ ...selectedAddress, mobile: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>

                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 bg-gray-300 rounded mt-4"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdate}
                            className="px-4 py-2 bg-blue-600 text-white rounded mt-4"
                          >
                            Update Address
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                )}



                {/* Add error message display */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800">Order History</h2>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">Order #{order.id}</h3>
                            <p className="text-sm text-gray-500">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                          </div>
                          <span className={`mt-2 sm:mt-0 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <p className="font-medium text-gray-800">Total: ${order.totalAmount?.toFixed(2) || '0.00'}</p>
                          <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors duration-300">
                            View Details <FiChevronRight className="ml-1" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl animate-fadeIn">
                    <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">No orders found.</p>
                  </div>
                )}
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === 'cart' && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
                {cart.length > 0 ? (
                  <>
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="divide-y divide-gray-200">
                        {cart.map((item, index) => (
                          <div key={item.id} className="p-6 animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <FiPackage className="h-8 w-8 text-gray-500" />
                              </div>
                              <div className="ml-4 flex-1">
                                <h3 className="text-sm font-medium text-gray-800">{item.product?.name || 'Product Name'}</h3>
                                <p className="text-sm text-gray-500">Price: ${item.price?.toFixed(2) || '0.00'}</p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-4">Qty: {item.quantity || 0}</span>
                                <button
                                  onClick={() => handleRemoveCartItem(item.id)}
                                  className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors duration-300"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {cartSummary && (
                      <div className="bg-gray-50 rounded-xl p-6 animate-slideUp">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 flex items-center">
                              <FiPackage className="mr-2" /> Subtotal
                            </span>
                            <span className="text-gray-800">${cartSummary.subtotal?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 flex items-center">
                              <FiTruck className="mr-2" /> Shipping
                            </span>
                            <span className="text-gray-800">${cartSummary.shipping?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 flex items-center">
                              <FiDollarSign className="mr-2" /> Tax
                            </span>
                            <span className="text-gray-800">${cartSummary.tax?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between font-medium text-gray-800 pt-3 border-t border-gray-200 mt-2">
                            <span>Total</span>
                            <span>${cartSummary.total?.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
                          <button
                            onClick={handleClearCart}
                            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-colors duration-300"
                          >
                            <FiTrash2 className="mr-2" />
                            Clear Cart
                          </button>
                          <button className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center transition-colors duration-300">
                            <FiCreditCard className="mr-2" />
                            Proceed to Checkout
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl animate-fadeIn">
                    <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">Your cart is empty.</p>
                    <Link to={"/products"} className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center mx-auto transition-colors duration-300">
                      Continue Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div >
    </div >
  );
};

export default Profile;