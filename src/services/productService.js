// src/services/productService.js
import axios from "axios";

const API_URL = "http://localhost:8080"; // apna backend base URL daalna

export const getProductsForUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/public/products`);

    return response.data;
  } catch (error) {
    console.error("Error fetching user products:", error);
    throw error;
  }
};

export const getSubCategoryForUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/public/subcategories`);

    return response.data;
  } catch (error) {
    console.error("Error fetching user subcategories:", error);
    throw error;
  }
};

export const getCategoryForUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/public/categories`);

    return response.data;
  } catch (error) {
    console.error("Error fetching user categories:", error);
    throw error;
  }
};

export const getProductsByCategoryForUser = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/public/categories/${categoryId}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// productService.js
// export const getSubCategoryCountForCategory = async (categoryId) => {
//   try {
//     const response = await axios.get(`${API_URL}/public/categories/${categoryId}/subcategories/count`);
//     return response.data || 0;
//   } catch (error) {
//     console.error("Error fetching subcategory count:", error);
//     return 0;
//   }
// };

// export const getProductsBySubCategoryForUser = async (subCategoryId) => {
//   try {
//     const response = await axios.get(`/subcategories/${subCategoryId}/products`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return [];
//   }
// };


