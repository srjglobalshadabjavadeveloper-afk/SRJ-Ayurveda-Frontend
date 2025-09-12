
import {
  getProductsForUser,
  getCategoryForUser,
  getCategoryByProductForUser,
  getSubCategoriesByCategoryForUser,
  getProductsBySubCategoryForUser
} from '../services/productService';
import { useCart } from "../context/CartContext";
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/products/ProductCard';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  // Carousel indexes
  const [prodIndex, setProdIndex] = useState(0);
  const [catIndex, setCatIndex] = useState(0);
  const visibleCounts = 5;
  const visibleCount = 5;

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await getCategoryForUser();
      if (Array.isArray(data)) {
        const categoriesData = data.map(c => ({
          id: c.id,
          name: c.name,
          image: c.image,
        }));
        setCategories([{ id: "all", name: "All Products" }, ...categoriesData]);
      } else {
        setCategories([{ id: "all", name: "All Products" }]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([{ id: "all", name: "All Products" }]);
    }
  };

  // Fetch products
  const fetchProducts = async (categoryId = null) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (categoryId === null || categoryId === "all") {
        data = await getProductsForUser();
      } else {
        data = await getCategoryByProductForUser(categoryId);
      }
      setProducts(
        Array.isArray(data)
          ? data.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            description: p.description,
            categoryId: p.categoryId || p.category?.id,
          }))
          : []
      );
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch products by subcategory
  const fetchProductsBySubCategory = async (subCategoryId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductsBySubCategoryForUser(subCategoryId);
      setProducts(
        Array.isArray(data)
          ? data.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            description: p.description,
            subCategoryId: p.subCategoryId || p.subCategory?.id,
          }))
          : []
      );
    } catch (err) {
      console.error("Error fetching products by subcategory:", err);
      setError("Failed to fetch products by subcategory");
    } finally {
      setLoading(false);
    }
  };

  // Handle category click
  const handleCategoryClick = async (category) => {
    if (!category.id) return;
    setSelectedCategory(String(category.id));
    setSelectedSubCategory(null);
    setProdIndex(0);

    if (category.id === "all") {
      setSubCategories([]);
      fetchProducts("all");
    } else {
      const subs = await getSubCategoriesByCategoryForUser(category.id);
      setSubCategories(subs);
      setProducts([]);
    }
  };

  // Handle subcategory click
  const handleSubCategoryClick = (sub) => {
    setSelectedSubCategory(sub.id);
    fetchProductsBySubCategory(sub.id);
  };

  // Filters
  const searchedProducts = searchTerm
    ? products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    : products;

  const filteredCategories = searchTerm
    ? categories.filter(cat => cat.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    : categories;

  const selectedCategoryName =
    selectedCategory === "all"
      ? "All Products"
      : categories.find(c => String(c.id) === String(selectedCategory))?.name || "Selected Category";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
            Ayurvedic Wellness Collection
          </h1>
          <p className="text-lg text-emerald-600 max-w-2xl mx-auto">
            Discover our range of authentic Ayurvedic products, carefully crafted to support your holistic well-being journey.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-6 py-4 rounded-full border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Carousel */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-6 text-center">
              Shop by Category
            </h2>
            <Link
              to="/category-details"
              onClick={() => navigate("/category-details")}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition"
            >
              View All
            </Link>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <button
              onClick={() => setCatIndex(Math.max(0, catIndex - 1))}
              disabled={catIndex === 0}
              className="p-2 bg-gray-200 rounded-full disabled:opacity-40"
            >
              <FaArrowLeft />
            </button>
            <div className="flex gap-3 md:gap-4">
              {filteredCategories.slice(catIndex, catIndex + visibleCount).map((category) => (
                <button
                  key={category.id || category.name}
                  className={`flex flex-col items-center justify-center w-[150px] h-[150px] px-3 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-white text-emerald-800 hover:bg-emerald-100 shadow-md"
                    }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-10 w-10 mb-2 object-cover rounded-full"
                    />
                  )}
                  <span className="font-medium text-xl">{category.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setCatIndex(Math.min(categories.length - visibleCount, catIndex + 1))}
              disabled={catIndex + visibleCount >= categories.length}
              className="p-2 bg-gray-200 rounded-full disabled:opacity-40"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>


        {/* Subcategory Section */}
        {subCategories.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-center text-emerald-800 mb-4">Shop By Subcategories</h3>
            <div className="flex gap-4 flex-wrap justify-center">
              {subCategories.map((sub) => (
                <button
                  key={sub.id}
                  className={`flex flex-col items-center justify-center w-[120px] h-[120px] p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 border ${selectedSubCategory === sub.id
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-lg"
                    : "bg-white text-emerald-800 border-emerald-200 shadow-md"
                    }`}
                  onClick={() => handleSubCategoryClick(sub)}
                >
                  {sub.image && (
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-16 h-16 object-cover rounded-full mb-2" // image size fix
                    />
                  )}
                  <span className="text-center font-medium text-base">{sub.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}


        {/* Products Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-emerald-800">
              {selectedCategoryName}
            </h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <h3 className="text-sm font-medium text-emerald-800 mb-2">
                Error Loading Products
              </h3>
              <p className="text-emerald-600">{error}</p>
            </div>
          ) : searchedProducts.length > 0 ? (
            <div className="flex items-center gap-4 justify-center">
              <button
                onClick={() => setProdIndex(Math.max(0, prodIndex - 1))}
                disabled={prodIndex === 0}
                className="p-2 bg-gray-200 rounded-full disabled:opacity-40"
              >
                <FaArrowLeft />
              </button>
              {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchedProducts
                  .slice(prodIndex, prodIndex + visibleCounts)
                  .map((product) => (
                    <Link key={product.id || product.name} to={`/products/${product.id}`}>
                      <ProductCard product={product} />
                    </Link>
                  ))}
              </div> */}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchedProducts
                  .slice(prodIndex, prodIndex + visibleCounts)
                  .map((product) => (
                    <ProductCard key={product.id || product.name} product={product} />
                  ))}
              </div>

              <button
                onClick={() =>
                  setProdIndex(
                    Math.min(searchedProducts.length - visibleCounts, prodIndex + 1)
                  )
                }
                disabled={prodIndex + visibleCounts >= searchedProducts.length}
                className="p-2 bg-gray-200 rounded-full disabled:opacity-40"
              >
                <FaArrowRight />
              </button>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <h3 className="text-sm font-medium text-emerald-800 mb-2">
                No products found
              </h3>
              <button
                className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedSubCategory(null);
                  setSearchTerm("");
                  setProdIndex(0);
                  fetchProducts();
                }}
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
