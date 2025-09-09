
import { getProductsForUser, getCategoryForUser, getSubCategoryForUser } from '../services/productService';
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/products/ProductCard';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const navigate = useNavigate();
  // Carousel index state
  const [prodIndex, setProdIndex] = useState(0);
  const visibleCounts = 5;
  const [catIndex, setCatIndex] = useState(0);
  const [subCatIndex, setSubCatIndex] = useState(0);
  const visibleCount = 5;

  useEffect(() => {
    fetchProducts();
    fetchSubCategories();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategoryForUser();
      if (Array.isArray(data)) {
        const categoriesData = data.map((c) => ({
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

  const fetchSubCategories = async () => {
    try {
      const data = await getSubCategoryForUser();
      if (Array.isArray(data)) {
        const subData = data.map((s) => ({
          id: s.id,
          name: s.name,
          image: s.image,
          categoryId: s.categoryId,
        }));
        setSubCategories(subData);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductsForUser();
      if (Array.isArray(data)) {
        const productsData = data.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          description: p.description,
          categoryId: p.categoryId,
          subCategoryId: p.subCategoryId,
        }));
        setProducts(productsData);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Filter products by category + subcategory
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === "all" || p.categoryId === selectedCategory;
    const matchSubCategory = !selectedSubCategory || p.subCategoryId === selectedSubCategory;
    return matchCategory && matchSubCategory;
  });

  // Search filter
  const searchedProducts = searchTerm
    ? filteredProducts.filter(product =>
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      // || (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    )
    : filteredProducts;

  // Filter categories by search
  const filteredCategories = searchTerm
    ? categories.filter(cat =>
      cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : categories;

  // Filter subcategories by search
  const filteredSubCategories = searchTerm
    ? subCategories.filter(sub =>
      sub.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : subCategories;



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">Ayurvedic Wellness Collection</h1>
          <p className="text-lg text-emerald-600 max-w-2xl mx-auto">
            Discover our range of authentic Ayurvedic products, carefully crafted to support your holistic well-being journey.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-6 py-4 rounded-full border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>


        {/* Category Carousel */}
        {/* <div className="mb-12">
          <h2 className="text-2xl font-semibold text-emerald-800 mb-6 text-center">Shop by Category</h2>
          <div className="flex items-center gap-4 justify-center">
            <button
              onClick={() => setCatIndex(Math.max(0, catIndex - 1))}
              disabled={catIndex === 0}
              className="p-2 bg-gray-200 rounded-full disabled:opacity-40"
            >
              <FaArrowLeft />
            </button>

            <div className="flex gap-3 md:gap-4">
              {categories.slice(catIndex, catIndex + visibleCount).map((category) => (
                <button
                  key={category.id}
                  className={`flex flex-col items-center justify-center w-[150px] h-[150px] px-3 py-4 rounded-2xl 
            transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-white text-emerald-800 hover:bg-emerald-100 shadow-md"
                    }`}
                  onClick={() => {
                    setSelectedCategory(Number(category.id)); // ensure category.id is number
                    setSelectedSubCategory(null);
                    setSubCatIndex(0);
                  }}
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
        </div> */}

        {/* SubCategory Carousel */}
        {/* {selectedCategory !== null && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-emerald-800 mb-4 text-center">Shop by Sub-Category</h2>
            <div className="flex items-center gap-4 justify-center">
              <button
                onClick={() => setSubCatIndex(Math.max(0, subCatIndex - 1))}
                disabled={subCatIndex === 0}
                className="p-2 bg-gray-200 rounded-full disabled:opacity-40"
              >
                <FaArrowLeft />
              </button>

              <div className="flex gap-3 md:gap-4">
                {subCategories.filter(sc => sc.categoryId === Number(selectedCategory)).length > 0 ? (
                  subCategories
                    .filter(sc => sc.categoryId === Number(selectedCategory))
                    .slice(subCatIndex, subCatIndex + visibleCount)
                    .map((sub) => (
                      <button
                        key={sub.id}
                        className={`flex flex-col items-center justify-center w-32 h-36 px-3 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${selectedSubCategory === sub.id
                          ? "bg-emerald-600 text-white shadow-lg"
                          : "bg-white text-emerald-800 hover:bg-emerald-100 shadow-md"
                          }`}
                        onClick={() => setSelectedSubCategory(sub.id)}
                      >
                        {sub.image && (
                          <img
                            src={sub.image}
                            alt={sub.name}
                            className="h-10 w-10 mb-2 object-cover rounded-full"
                          />
                        )}
                        <span className="font-medium text-xl">{sub.name}</span>
                      </button>
                    ))
                ) : (
                  <p className="text-gray-400">No subcategories available</p>
                )}
              </div>

              <button
                onClick={() =>
                  setSubCatIndex(
                    Math.min(
                      subCategories.filter(sc => sc.categoryId === Number(selectedCategory)).length - visibleCount,
                      subCatIndex + 1
                    )
                  )
                }
                disabled={
                  subCatIndex + visibleCount >=
                  subCategories.filter(sc => sc.categoryId === Number(selectedCategory)).length
                }
                className="p-2 bg-gray-200 rounded-full disabled:opacity-40"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        )} */}


        {/* Category Carousel */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-6 text-center">Shop by Category</h2>

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
                  key={category.id}
                  className={`flex flex-col items-center justify-center w-[150px] h-[150px] px-3 py-4 rounded-2xl 
                    transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-white text-emerald-800 hover:bg-emerald-100 shadow-md"
                    }`}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedSubCategory(null);
                    setSubCatIndex(0);
                  }}
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

        {/* SubCategory Carousel */}
        {selectedCategory !== "all" && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-emerald-800 mb-4 text-center ">Shop by Sub-Category</h2>
            <div className="flex items-center gap-4 justify-center">
              <button
                onClick={() => setSubCatIndex(Math.max(0, subCatIndex - 1))}
                disabled={subCatIndex === 0}
                className="p-2 bg-gray-200 rounded-full disabled:opacity-40"
              >
                <FaArrowLeft />
              </button>

              <div className="flex gap-3 md:gap-4">
                {filteredSubCategories.filter(sc => sc.categoryId === selectedCategory).length > 0 ? (
                  subCategories
                    .filter(sc => sc.categoryId === selectedCategory)
                    .slice(subCatIndex, subCatIndex + visibleCount)
                    .map((sub) => (
                      <button
                        key={sub.id}
                        className={`flex flex-col items-center justify-center w-32 h-36 px-3 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${selectedSubCategory === sub.id
                          ? "bg-emerald-600 text-white shadow-lg"
                          : "bg-white text-emerald-800 hover:bg-emerald-100 shadow-md"
                          }`}
                        onClick={() => setSelectedSubCategory(sub.id)}
                      >
                        {sub.image && (
                          <img
                            src={sub.image}
                            alt={sub.name}
                            className="h-10 w-10 mb-2 object-cover rounded-full disabled:opacity-40"
                          />
                        )}
                        <span className="font-medium ">{sub.name}</span>
                      </button>
                    ))
                ) : (
                  <p className="text-gray-400">No subcategories available</p>
                )}
              </div>

              <button
                onClick={() =>
                  setSubCatIndex(
                    Math.min(
                      subCategories.filter(sc => sc.categoryId === selectedCategory).length - visibleCount,
                      subCatIndex + 1
                    )
                  )
                }
                disabled={
                  subCatIndex + visibleCount >=
                  subCategories.filter(sc => sc.categoryId === selectedCategory).length
                }
                className="p-2 bg-gray-200 rounded-full disabled:opacity-40"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}


        {/* Products Carousel */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-emerald-800">
              {selectedCategory === "all"
                ? "All Products"
                : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            {/* <p className="text-emerald-600">
              {searchedProducts.length}{" "}
              {searchedProducts.length === 1 ? "Product" : "Products"} Found
            </p> */}
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
              {/* Left Arrow */}
              <button
                onClick={() => setProdIndex(Math.max(0, prodIndex - 1))}
                disabled={prodIndex === 0}
                className="p-2 bg-gray-200 rounded-full disabled:opacity-40"
              >
                <FaArrowLeft />
              </button>

              {/* Products */}
              {/* <div className="flex gap-4"> */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchedProducts
                  .slice(prodIndex, prodIndex + visibleCounts)
                  .map((product) => (
                    <div key={product.id} >
                      <ProductCard product={product} />
                    </div>
                  ))}
              </div>

              {/* Right Arrow */}
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
                  setProdIndex(0); // reset index
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
