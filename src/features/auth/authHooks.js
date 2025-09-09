// src/features/auth/authHooks.js
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, checkAuth } from './authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, role, isAuthenticated, isAdmin, loading, error } = useSelector(
    (state) => state.auth
  );

  const loginUser = async (email, password) => {
    await dispatch(login({ email, password }));
  };

  const logoutUser = async () => {
    await dispatch(logout());
  };

  const checkAuthStatus = async () => {
    await dispatch(checkAuth());
  };

  return {
    user,
    token,
    role,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    loginUser,
    logoutUser,
    checkAuthStatus,
  };
};