// authService.js
import axios from 'axios';
const API_URL = 'http://localhost:8080';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
// Login
const login = async (email, password) => {
  try {
    console.log("Making login request to:", `${API_URL}/auth/login`);
    console.log("Login payload:", { email, password });
    
    const response = await api.post('/auth/login', { email, password });
    
    console.log("Login response status:", response.status);
    console.log("Login response headers:", response.headers);
    console.log("Login response data:", response.data);
    
    // Return only the response data, not the full response object
    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    }
    
    throw error;
  }
};
// Register
const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};
// Verify Email
const verifyEmail = async (email, otp) => {
  const response = await api.post('/auth/verify', { email, otp });
  return response.data;
};
// Forgot Password
const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};
// Reset Password
const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post('/auth/reset-password', { email, otp, newPassword });
  return response.data;
};
// Logout
const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
export default {
  login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout
};