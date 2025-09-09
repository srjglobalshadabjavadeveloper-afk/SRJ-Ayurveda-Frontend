// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Get user from localStorage
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

const initialState = {
  user: null,
  token: token,
  role: role,
  isAuthenticated: !!token,
  isAdmin: role === 'ROLE_ADMIN' || role === 'ADMIN',
  loading: false,
  error: null,
};

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      return response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
});

// Check authentication status
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, thunkAPI) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (token && role) {
    try {
      // Verify token is valid
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        return thunkAPI.rejectWithValue('Token expired');
      }
      return { token, role };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      return thunkAPI.rejectWithValue('Invalid token');
    }
  } else {
    return thunkAPI.rejectWithValue('No token found');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isAdmin = action.payload.role === 'ROLE_ADMIN' || action.payload.role === 'ADMIN';
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.role = null;
        state.isAdmin = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isAdmin = action.payload.role === 'ROLE_ADMIN' || action.payload.role === 'ADMIN';
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.role = null;
        state.isAdmin = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;