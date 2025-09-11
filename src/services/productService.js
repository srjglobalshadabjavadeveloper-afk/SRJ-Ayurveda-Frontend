

import axios from "axios";

const API_URL = "http://localhost:8080"; 
export const getProductsForUser = async () => {
  const res = await axios.get(`${API_URL}/public/products`);
  return res.data;
};

export const getCategoryForUser = async () => {
  const res = await axios.get(`${API_URL}/public/categories`);
  return res.data;
};

export const getCategoryByProductForUser = async (categoryId) => {
  const res = await axios.get(`${API_URL}/public/categories/${categoryId}/products`);
  return res.data;
};

// ✅ New service: fetch subcategories of category
export const getSubCategoriesByCategoryForUser = async (categoryId) => {
  const res = await axios.get(`${API_URL}/public/subcategories/category/${categoryId}`);
  return res.data;
};

// ✅ New service: fetch products by subcategory
export const getProductsBySubCategoryForUser = async (subCategoryId) => {
  const res = await axios.get(`${API_URL}/public/subcategories/${subCategoryId}/products`);
  return res.data;
};


// ✅ New service: get By product id
export const getProductByIdForUser = async (id) => {
  const res = await axios.get(`${API_URL}/public/products/${id}`);
  return res.data;
};

