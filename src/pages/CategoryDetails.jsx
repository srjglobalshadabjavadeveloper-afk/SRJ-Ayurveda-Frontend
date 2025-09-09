import React, { useState, useEffect } from "react";
import { getCategoryForUser, getSubCategoryForUser } from "../services/productService";

const CategoryDetails = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await getCategoryForUser();
    setCategories(data || []);
  };

  const fetchSubCategories = async () => {
    const data = await getSubCategoryForUser();
    setSubCategories(data || []);
  };

  return (
    <div className="p-6">
      {/* Categories Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-emerald-800 mb-6 text-center">All Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map(category => (
            <div
              key={category.id}
              className="flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 bg-white shadow-md"
            >
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-16 w-16 mb-2 object-cover rounded-full"
                />
              )}
              <span className="font-medium text-lg">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SubCategories Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-emerald-800 mb-6 text-center">All Sub-Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {subCategories.map(sub => (
            <div
              key={sub.id}
              className="flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 bg-white shadow-md"
            >
              {sub.image && (
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="h-16 w-16 mb-2 object-cover rounded-full"
                />
              )}
              <span className="font-medium text-lg">{sub.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;
