
import React, { useState, useEffect } from "react";
import {
  getCategoryForUser,
  getCategoryByProductForUser,
} from "../services/productService";
import ProductCard from "../components/products/ProductCard";

const CategoryDetails = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategoryForUser();
      setCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    }
  };

  const handleCategoryClick = async (category) => {
    if (!category.id) {
      console.error("Category ID missing:", category);
      return;
    }
    setSelectedCategory(category);
    setLoading(true);
    try {
      const data = await getCategoryByProductForUser(category.id);
      if (Array.isArray(data)) {
        setProducts(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            description: p.description,
            categoryId: p.categoryId || p.category?.id,
          }))
        );
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-emerald-800 mb-8 text-center">
          Categories
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-6 rounded-2xl shadow-md transition cursor-pointer ${
                selectedCategory?.id === category.id
                  ? "bg-emerald-100 border-2 border-emerald-300"
                  : "bg-white hover:shadow-lg"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="flex flex-col items-center">
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-20 w-20 mb-3 object-cover rounded-full border-2 border-emerald-200"
                  />
                )}
                <h3 className="text-xl font-semibold text-emerald-800">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Products Section */}
        {selectedCategory && (
          <div>
            <h3 className="text-2xl font-semibold text-emerald-800 mb-6">
              {selectedCategory.name} Products
            </h3>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center text-emerald-700">
                No products found for this category
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetails;
