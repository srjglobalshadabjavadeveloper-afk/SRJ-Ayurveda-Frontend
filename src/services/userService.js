// src/services/userService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Create axios instance
const userApi = axios.create({
  baseURL: `${API_URL}/user`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log("🔍 DEBUG - Token from localStorage:", token);
    console.log("🔍 DEBUG - Role from localStorage:", role);
    
    if (token) {
      // Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("🔍 DEBUG - Token payload:", payload);

        const currentTime = Date.now() / 1000;
        const timeUntilExpiration = payload.exp - currentTime;
        
        console.log("🔍 DEBUG - Current time:", new Date(currentTime * 1000));
        console.log("🔍 DEBUG - Token expiration:", new Date(payload.exp * 1000));
        console.log("🔍 DEBUG - Time until expiration:", timeUntilExpiration, "seconds");

        if (payload.exp && payload.exp < currentTime) {
          console.error('❌ Token expired at', new Date(payload.exp * 1000));
          
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          
          return Promise.reject(new Error('Token expired'));
        }
      } catch (e) {
        console.error('❌ Error parsing token:', e);
        console.error('❌ Token might be malformed:', token);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        return Promise.reject(new Error('Invalid token'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Authorization header set with token");
    } else {
      console.error("❌ No token found in localStorage");
      return Promise.reject(new Error('No token available'));
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors WITHOUT REDIRECTING
userApi.interceptors.response.use(
  (response) => {
    console.log("✅ Response received for", response.config.url, "Status:", response.status);
    return response;
  },
  (error) => {
    console.error("❌ API Error for", error.config?.url);
    console.error("❌ Error status:", error.response?.status);
    console.error("❌ Error data:", error.response?.data);
    console.error("❌ Error headers:", error.response?.headers);
    
    // Handle token expiration or invalid token errors from request interceptor
    if (error.message === 'Token expired' || error.message === 'Invalid token' || error.message === 'No token available') {
      console.log('🔐 Authentication error:', error.message);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      return Promise.reject(new Error('Session expired'));
    }
    
    // For 401 errors, check if it's really an auth error or something else
    if (error.response && error.response.status === 401) {
      console.log('🔐 Received 401 Unauthorized');
      console.log('🔐 Server response:', error.response.data);
      
      // Only clear tokens if it's actually an authentication error
      // Sometimes 401 can be for other reasons (missing permissions, etc.)
      if (error.response.data && 
          (error.response.data.message?.includes('auth') || 
           error.response.data.error?.includes('token'))) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        return Promise.reject(new Error('Session expired'));
      } else {
        // It's a 401 but not necessarily an auth token issue
        return Promise.reject(new Error('Access denied: ' + (error.response.data.message || 'Unauthorized')));
      }
    }
    
    return Promise.reject(error);
  }
);

// User Addresses
export const getAddresses = async () => {
  const response = await userApi.get('/addresses');
  return response.data;
};

export const addAddress = async (addressData) => {
  console.log("userService.addAddress called with data:", addressData);
  try {
    const response = await userApi.post('/addresses', addressData);
    console.log("userService.addAddress response:", response);
    return response.data;
  } catch (error) {
    console.error("Error in userService.addAddress:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    }
    throw error;
  }
};

export const updateAddress = async (id, addressData) => {
  const response = await userApi.put(`/addresses/${id}`, addressData);
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await userApi.delete(`/address/${id}`);
  return response.data;
};

// Add this function to your userService.js
export const validateToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { valid: false, reason: 'No token found' };
    }

    // Check token expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        return { valid: false, reason: 'Token expired' };
      }
    } catch (e) {
      return { valid: false, reason: 'Invalid token format' };
    }

    // Test the token with a simple API call
    try {
      const response = await userApi.get('/profile'); // or any simple endpoint
      return { valid: true, user: response.data };
    } catch (error) {
      return { 
        valid: false, 
        reason: 'API rejection', 
        status: error.response?.status,
        data: error.response?.data
      };
    }
  } catch (error) {
    return { valid: false, reason: 'Validation error', error: error.message };
  }
};

// User Orders
export const getOrders = async () => {
  const response = await userApi.get('/orders');
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await userApi.get(`/orders/${orderId}`);
  return response.data;
};

// User Cart
export const getCart = async () => {
  const response = await userApi.get('/cart');
  return response.data;
};

export const addToCart = async (cartItem) => {
  const response = await userApi.post('/cart', cartItem);
  return response.data;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const response = await userApi.put(`/cart/${cartItemId}`, { quantity });
  return response.data;
};

export const removeCartItem = async (cartItemId) => {
  const response = await userApi.delete(`/cart/${cartItemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await userApi.delete('/cart');
  return response.data;
};

export const getCartSummary = async () => {
  const response = await userApi.get('/cart/summary');
  return response.data;
};

export default {
  getAddresses,
  addAddress,
  getOrders,
  getOrderById,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartSummary,
  updateAddress,
  deleteAddress, 
};