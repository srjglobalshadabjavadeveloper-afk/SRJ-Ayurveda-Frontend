// // src/components/common/ProtectedRoute.jsx
// import React from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuthContext } from "../../context/AuthContext";
// import Profile from "../../pages/Profile"; // Import Profile component

// console.log("ProtectedRoute.jsx module loaded");

// const ProtectedRoute = ({ adminOnly = false }) => {
//   const location = useLocation();
//   console.log("ProtectedRoute component function called");
  
//   const { isAuthenticated, isAdmin, loading, token } = useAuthContext();

//   console.log("ProtectedRoute - location.pathname:", location.pathname);
//   console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
//   console.log("ProtectedRoute - isAdmin:", isAdmin);
//   console.log("ProtectedRoute - loading:", loading);
//   console.log("ProtectedRoute - adminOnly:", adminOnly);
//   console.log("ProtectedRoute - token:", token ? "Found" : "Not found");

//   // If still loading, show a spinner
//   if (loading) {
//     console.log("ProtectedRoute - Loading, showing spinner");
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   // If not authenticated, redirect to login
//   if (!isAuthenticated) {
//     console.log("ProtectedRoute - Not authenticated, redirecting to login");
//     return <Navigate to="/login" replace />;
//   }

//   // If adminOnly is true and user is not admin, redirect to unauthorized page
//   if (adminOnly && !isAdmin) {
//     console.log("ProtectedRoute - Not admin, redirecting to unauthorized");
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // If all checks pass, check if it's the profile route
//   if (location.pathname === '/profile') {
//     console.log("ProtectedRoute - Rendering Profile component directly");
//     return <Profile />;
//   }

//   // For other routes, use the Outlet
//   console.log("ProtectedRoute - Rendering Outlet for other routes");
//   return <Outlet />;
// };

// export default ProtectedRoute;

// console.log("ProtectedRoute.jsx module exported");

// src/components/common/ProtectedRoute.jsx
import { useAuthContext } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading, token } = useAuthContext();
  const location = useLocation();

  // Check if token is expired
  const isTokenExpired = () => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      console.error("Error parsing token:", e);
      return true;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated || isTokenExpired()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;