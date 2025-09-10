  import axios from 'axios';
  const API_URL = 'http://localhost:8080';

  // Create axios instance
  const adminApi = axios.create({
    baseURL: `${API_URL}/admin`,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add request interceptor to include auth token
  adminApi.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      console.log("Request interceptor - Token from localStorage:", token ? "Found" : "Not found");
      console.log("Request interceptor - Role from localStorage:", role ? "Found" : "Not found");
      console.log("Request interceptor - Request URL:", config.url);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Request interceptor - Token added to headers");
      } else {
        console.error("Request interceptor - No token found in localStorage for request to", config.url);
      }
      
      return config;
    },
    (error) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle auth errors
  adminApi.interceptors.response.use(
    (response) => {
      console.log("Response interceptor - Response received for", response.config.url, "Status:", response.status);
      return response;
    },
    (error) => {
      console.error("Response interceptor - Error for", error.config?.url, "Status:", error.response?.status);
      if (error.response) {
        console.error('Response interceptor - Error Response:', error.response);
        console.error('Response interceptor - Error Status:', error.response.status);
        console.error('Response interceptor - Error Data:', error.response.data);
        
        if (error.response.status === 401) {
          console.log('Response interceptor - Received 401 Unauthorized, logging out...');
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          window.location.href = '/login';
        } else if (error.response.status === 403) {
          console.log('Response interceptor - Received 403 Forbidden, user does not have permission');
          // User doesn't have permission
          window.location.href = '/unauthorized';
        }
      } else if (error.request) {
        console.error('Response interceptor - No response received:', error.request);
      } else {
        console.error('Response interceptor - Error setting up request:', error.message);
      }
      return Promise.reject(error);
    }
  );

  // Add these functions to your adminService.js file

  export const getProductCount = async () => {
    console.log("Making request to get product count");
    const response = await adminApi.get('/products/count');
    return response.data;
  };

  export const getUserCount = async () => {
    console.log("Making request to get user count");
    const response = await adminApi.get('/users/count');
    return response.data;
  };

  // Categories API
  export const getCategories = async () => {
    console.log("Making request to get categories");
    const response = await adminApi.get('/categories');
    return response.data;
  };

  export const addCategory = async (categoryData) => {
    console.log("Making request to add category");
    const response = await adminApi.post('/categories', categoryData);
    return response.data;
  };

  export const updateCategory = async (id, categoryData) => {
    console.log("Making request to update category", id);
    const response = await adminApi.put(`/categories/${id}`, categoryData);
    return response.data;
  };

  export const deleteCategory = async (id) => {
    console.log("Making request to delete category", id);
    const response = await adminApi.delete(`/categories/${id}`);
    return response.data;
  };

  // Subcategories API
  export const getSubCategories = async () => {
    console.log("Making request to get subcategories");
    const response = await adminApi.get('/subcategories');
    return response.data;
  };

  export const addSubCategory = async (subCategoryData) => {
    console.log("Making request to add subcategory");
    const response = await adminApi.post('/subcategories', subCategoryData
      ,{
          headers: { "Content-Type": "multipart/form-data" }
    }
  );
    return response.data;
  };

  export const updateSubCategory = async (id, subCategoryData) => {
    console.log("Making request to update subcategory", id);
    const response = await adminApi.put(`/subcategories/${id}`, subCategoryData);
    return response.data;
  };

  export const deleteSubCategory = async (id) => {
    console.log("Making request to delete subcategory", id);
    const response = await adminApi.delete(`/subcategories/${id}`);
    return response.data;
  };

  // Products API
  export const getProducts = async () => {
    console.log("Making request to get products");
    const response = await adminApi.get('/products');
    return response.data;
  };

  export const addProduct = async (formData) => {
    const response = await adminApi.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  };



  export const updateProduct = async (id, productData) => {
    console.log("Making request to update product", id);
    const response = await adminApi.put(`/products/${id}`, productData);
    return response.data;
  };

  export const deleteProduct = async (id) => {
    console.log("Making request to delete product", id);
    const response = await adminApi.delete(`/products/${id}`);
    return response.data;
  };

  // Bulk Upload API
  export const bulkUploadProducts = async (file) => {
    console.log("Making request to bulk upload products");
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await adminApi.post('/products/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  };

  export const getBulkUploadTemplate = async () => {
    console.log("Making request to get bulk upload template");
    const response = await adminApi.get('/products/bulk-upload/template');
    return response.data;
  };

  // Upload image to backend
  export const uploadCategoryImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await adminApi.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Backend se Cloudinary URL return hota hai
      return response.data; // { url: "https://..." }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };


