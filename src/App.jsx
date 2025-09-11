// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer'; // Import the Footer component
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CategoryDetails from './pages/CategoryDetails';
import ForgotPassword from './pages/ForgotPassword';
import Products from './pages/Products';
import ProtectedRoute from './components/common/ProtectedRoute';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Cart from './pages/Cart';
import ProductDetail from "./pages/ProductDetail";
// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminCategories from './components/admin/AdminCategories';
import AdminSubCategories from './components/admin/AdminSubCategories';
import AddProductPage from './components/admin/AddProduct';
import AdminProductsModule from './components/admin/AdminProductsModule';
import AdminBulkUploadPage from './components/admin/AdminBulkUploadPage';




// Create a component to conditionally render the footer
const ConditionalFooter = () => {
  const location = useLocation();

  const hideFooterRoutes = ['/login', '/register', '/forgot-password', '/admin', '/admin/categories', '/admin/subcategories', '/admin/products', '/admin/products/add', '/admin/products/edit', '/admin/products/bulk-upload', '/admin/products/bulk-upload/template'];

  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return shouldHideFooter ? null : <Footer />;
};

const ConditionalNavbar = () => {
  const location = useLocation();

  const hideNavbarRoutes = ['/admin', '/admin/categories', '/admin/subcategories', '/admin/products', '/admin/products/add', '/admin/products/edit', '/admin/products/bulk-upload', '/admin/products/bulk-upload/template'];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return shouldHideNavbar ? null : <Navbar />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app flex flex-col min-h-screen">
          {/* <Navbar /> */}
          <ConditionalNavbar /> {/* Add the conditional navbar here */}
          <main className="main-content flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/category-details" element={<CategoryDetails />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/cart" element={<Cart />} />
              {/* User Profile Route - Now wrapped with ProtectedRoute */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Categories Management */}
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminCategories />
                  </ProtectedRoute>
                }
              />

              {/* Admin SubCategories Management */}
              <Route
                path="/admin/subCategories"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminSubCategories />
                  </ProtectedRoute>
                }
              />

              {/* Add Product */}
              <Route
                path="/admin/products/add"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AddProductPage />
                  </ProtectedRoute>
                }
              />

              {/* Edit Product */}
              <Route
                path="/admin/products/edit/:id"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AddProductPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Products Management */}
              <Route
                path="/admin/products/*"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminProductsModule />
                  </ProtectedRoute>
                }
              />

              {/* Admin Bulk Upload */}
              <Route
                path="/admin/products/bulk-upload"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminBulkUploadPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/products/bulk-upload/template"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminBulkUploadPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <ConditionalFooter /> {/* Add the conditional footer here */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;