


// import React, { useState, useEffect } from "react";
// import { getCategoryForUser, getSubCategoryForUser } from "../services/productService";

// const CategoryDetails = () => {
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [expandedCategory, setExpandedCategory] = useState(null); // currently expanded category ID

//   useEffect(() => {
//     fetchCategories();
//     fetchSubCategories();
//   }, []);

//   const fetchCategories = async () => {
//     const data = await getCategoryForUser();
//     setCategories(data || []);
//   };

//   const fetchSubCategories = async () => {
//     const data = await getSubCategoryForUser();
//     setSubCategories(data || []);
//   };

//   const handleCategoryClick = (categoryId) => {
//     // agar ye category already expanded hai → collapse
//     // agar koi aur category expanded hai → close wo aur open clicked one
//     setExpandedCategory(prev => (prev === categoryId ? null : categoryId));
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-3xl font-bold text-emerald-800 mb-8 text-center">
//         Categories
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {categories.map(category => (
//           <div
//             key={category.id}
//             className="p-4 rounded-2xl bg-white shadow-md hover:shadow-lg transition cursor-pointer"
//           >
//             {/* Category Info */}
//             <div
//               className="flex flex-col items-center mb-4"
//               onClick={() => handleCategoryClick(category.id)}
//             >
//               {category.image && (
//                 <img
//                   src={category.image}
//                   alt={category.name}
//                   className="h-16 w-16 mb-2 object-cover rounded-full"
//                 />
//               )}
//               <h3 className="text-xl font-semibold text-emerald-800">
//                 {category.name}
//               </h3>
//             </div>

//             {/* Subcategories (only if this category is expanded) */}
//             {expandedCategory === category.id && (
//               <div className="grid grid-cols-2 gap-4 mt-2">
//                 {subCategories
//                   .filter(sub => sub.categoryId === category.id)
//                   .map(sub => (
//                     <div
//                       key={sub.id}
//                       className="flex flex-col items-center p-2 bg-emerald-50 rounded-lg shadow hover:bg-emerald-100 transition"
//                     >
//                       {sub.image && (
//                         <img
//                           src={sub.image}
//                           alt={sub.name}
//                           className="h-10 w-10 mb-1 object-cover rounded-full"
//                         />
//                       )}
//                       <span className="text-sm font-medium text-emerald-800">
//                         {sub.name}
//                       </span>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CategoryDetails;


// import React, { useState, useEffect } from "react";
// import {
//   getCategoryForUser,
//   getProductsByCategoryForUser,
// } from "../services/productService";

// const CategoryDetails = () => {
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState({});
//   const [expandedCategory, setExpandedCategory] = useState(null);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     const data = await getCategoryForUser();
//     setCategories(data || []);
//   };

//   const handleCategoryClick = async (categoryId) => {
//     // toggle expand/collapse
//     setExpandedCategory(prev => (prev === categoryId ? null : categoryId));

//     // fetch subcategories for clicked category if not already fetched
//     if (!products[categoryId]) {
//       const prod = await getProductsByCategoryForUser(categoryId); // optionally fetch by categoryId
//       setProducts(prev => ({ ...prev, [categoryId]: prod || [] }));
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-3xl font-bold text-emerald-800 mb-8 text-center">
//         Categories
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {categories.map(category => (
//           <div
//             key={category.id}
//             className="p-4 rounded-2xl bg-white shadow-md hover:shadow-lg transition cursor-pointer"
//             onClick={() => handleCategoryClick(category.id)}
//           >
//             {/* Category Info */}
//             <div className="flex flex-col items-center mb-4">
//               {category.image && (
//                 <img
//                   src={category.image}
//                   alt={category.name}
//                   className="h-16 w-16 mb-2 object-cover rounded-full"
//                 />
//               )}
//               <h3 className="text-xl font-semibold text-emerald-800">
//                 {category.name}
//               </h3>
//             </div>

//             {/* Subcategories (only if expanded) */}
//             {expandedCategory === category.id && (
//               <div className="grid grid-cols-2 gap-4 mt-2">
//                 {(products[category.id] || []).map(prod => (
//                   <div
//                     key={prod.id}
//                     className="flex flex-col items-center p-2 bg-emerald-50 rounded-lg shadow hover:bg-emerald-100 transition"
//                   >
//                     {prod.image && (
//                       <img
//                         src={prod.image}
//                         alt={prod.name}
//                         className="h-10 w-10 mb-1 object-cover rounded-full"
//                       />
//                     )}
//                     <span className="text-sm font-medium text-emerald-800">
//                       {prod.name}
//                     </span>

//                      <span className="text-sm font-medium text-emerald-800">
//                       {prod.price}
//                     </span>

//                      <span className="text-sm font-medium text-emerald-800">
//                       {prod.discription}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CategoryDetails;



// import React, { useState, useEffect } from "react";
// import {
//   getCategoryForUser,
//   getProductsByCategoryForUser,
// } from "../services/productService";

// const CategoryDetails = () => {
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState({});
//   const [expandedCategory, setExpandedCategory] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [fetchError, setFetchError] = useState({});

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const data = await getCategoryForUser();
//       setCategories(data || []);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setError("Failed to load categories");
//     }
//   };

//   const handleCategoryClick = async (categoryId) => {
//     // Convert categoryId to string for consistent comparison
//     const categoryIdStr = String(categoryId);
//     const currentExpanded = expandedCategory ? String(expandedCategory) : null;
    
//     console.log("Clicked category:", categoryIdStr);
//     console.log("Currently expanded:", currentExpanded);
    
//     // Toggle expand/collapse
//     const isExpanding = currentExpanded !== categoryIdStr;
//     setExpandedCategory(isExpanding ? categoryIdStr : null);
    
//     // If expanding and products not already fetched
//     if (isExpanding && !products[categoryIdStr]) {
//       console.log("Fetching products for category:", categoryIdStr);
//       setLoading(true);
//       setFetchError(prev => ({ ...prev, [categoryIdStr]: null }));
      
//       try {
//         const prod = await getProductsByCategoryForUser(categoryId);
//         console.log("Received products:", prod);
        
//         if (Array.isArray(prod)) {
//           setProducts(prev => ({ ...prev, [categoryIdStr]: prod }));
//         } else {
//           console.error("Products data is not an array:", prod);
//           setFetchError(prev => ({ 
//             ...prev, 
//             [categoryIdStr]: "Invalid products data format" 
//           }));
//         }
//       } catch (err) {
//         console.error("Error fetching products:", err);
//         setFetchError(prev => ({ 
//           ...prev, 
//           [categoryIdStr]: "Failed to load products" 
//         }));
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-emerald-800 mb-8 text-center">
//           Categories
//         </h2>
        
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
//             {error}
//           </div>
//         )}
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {categories.map(category => {
//             // Convert category ID to string for consistent comparison
//             const categoryIdStr = String(category.id);
//             const isExpanded = expandedCategory === categoryIdStr;
//             const categoryProducts = products[categoryIdStr] || [];
//             const hasError = fetchError[categoryIdStr];
            
//             console.log(`Category ${category.name}:`, {
//               id: categoryIdStr,
//               isExpanded,
//               productsCount: categoryProducts.length,
//               hasError
//             });
            
//             return (
//               <div
//                 key={categoryIdStr}
//                 className={`p-6 rounded-2xl shadow-md transition cursor-pointer ${
//                   isExpanded 
//                     ? "bg-emerald-100 border-2 border-emerald-300" 
//                     : "bg-white hover:shadow-lg"
//                 }`}
//                 onClick={() => handleCategoryClick(category.id)}
//               >
//                 {/* Category Info */}
//                 <div className="flex flex-col items-center mb-4">
//                   {category.image && (
//                     <img
//                       src={category.image}
//                       alt={category.name}
//                       className="h-20 w-20 mb-3 object-cover rounded-full border-2 border-emerald-200"
//                     />
//                   )}
//                   <h3 className="text-xl font-semibold text-emerald-800">
//                     {category.name}
//                   </h3>
//                   <span className="text-sm text-emerald-600 mt-1">
//                     Click to {isExpanded ? "collapse" : "expand"}
//                   </span>
//                   {isExpanded && (
//                     <span className="text-xs text-emerald-700 mt-1">
//                       {categoryProducts.length} products
//                     </span>
//                   )}
//                 </div>
                
//                 {/* Products (only if expanded) */}
//                 {isExpanded && (
//                   <div className="mt-4">
//                     {loading && !products[categoryIdStr] ? (
//                       <div className="flex justify-center items-center h-20">
//                         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
//                       </div>
//                     ) : hasError ? (
//                       <div className="text-center py-4 bg-red-50 rounded-lg border border-red-100">
//                         <p className="text-red-700">{hasError}</p>
//                         <button 
//                           className="mt-2 text-sm text-emerald-600 hover:text-emerald-800"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleCategoryClick(category.id);
//                           }}
//                         >
//                           Try again
//                         </button>
//                       </div>
//                     ) : categoryProducts.length > 0 ? (
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         {categoryProducts.map(prod => (
//                           <div
//                             key={prod.id}
//                             className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:bg-emerald-50 transition border border-emerald-100"
//                           >
//                             {prod.image && (
//                               <img
//                                 src={prod.image}
//                                 alt={prod.name}
//                                 className="h-16 w-16 mb-2 object-cover rounded-full"
//                               />
//                             )}
//                             <span className="text-sm font-medium text-emerald-800 text-center">
//                               {prod.name}
//                             </span>
//                             <span className="text-sm font-semibold text-emerald-700 mt-1">
//                               ${prod.price}
//                             </span>
//                             <span className="text-xs text-gray-600 mt-2 text-center line-clamp-2">
//                               {prod.description || "No description available"}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-4 bg-white rounded-lg border border-emerald-100">
//                         <p className="text-emerald-700">No products found in this category</p>
//                         <button 
//                           className="mt-2 text-sm text-emerald-600 hover:text-emerald-800"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleCategoryClick(category.id);
//                           }}
//                         >
//                           Refresh
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryDetails;

import React, { useState, useEffect } from "react";
import {
  getCategoryForUser,
  getProductsByCategoryForUser,
} from "../services/productService";

const CategoryDetails = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchError, setFetchError] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategoryForUser();
      console.log("Categories fetched:", data);
      setCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    }
  };

  const handleCategoryClick = async (categoryId) => {
    // Convert categoryId to string for consistent comparison
    // const categoryIdStr = String(categoryId);
    const categoryIdStr = categoryId;
    const currentExpanded = expandedCategory ? String(expandedCategory) : null;
    
    console.log("Clicked category:", categoryIdStr);
    console.log("Currently expanded:", currentExpanded);
    
    // Toggle expand/collapse
    const isExpanding = currentExpanded !== categoryIdStr;
    setExpandedCategory(isExpanding ? categoryIdStr : null);
    
    // If expanding and products not already fetched
    if (isExpanding && !products[categoryIdStr]) {
      console.log("Fetching products for category:", categoryIdStr);
      setLoading(true);
      setFetchError(prev => ({ ...prev, [categoryIdStr]: null }));
      
      try {
        const prod = await getProductsByCategoryForUser(categoryId);
        console.log("Received products:", prod);
        
        if (Array.isArray(prod)) {
          setProducts(prev => ({ ...prev, [categoryIdStr]: prod }));
          console.log("Products set for category:", categoryIdStr);
        } else {
          console.error("Products data is not an array:", prod);
          setFetchError(prev => ({ 
            ...prev, 
            [categoryIdStr]: "Invalid products data format" 
          }));
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setFetchError(prev => ({ 
          ...prev, 
          [categoryIdStr]: "Failed to load products" 
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-emerald-800 mb-8 text-center">
          Categories
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(category => {
            // Convert category ID to string for consistent comparison
            const categoryIdStr = String(category.id);
            const isExpanded = expandedCategory === categoryIdStr;
            const categoryProducts = products[categoryIdStr] || [];
            const hasError = fetchError[categoryIdStr];
            
            console.log(`Category ${category.name}:`, {
              id: categoryIdStr,
              isExpanded,
              productsCount: categoryProducts.length,
              hasError,
              products: categoryProducts
            });
            
            return (
              <div
                key={categoryIdStr}
                className={`p-6 rounded-2xl shadow-md transition cursor-pointer ${
                  isExpanded 
                    ? "bg-emerald-100 border-2 border-emerald-300" 
                    : "bg-white hover:shadow-lg"
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {/* Category Info */}
                <div className="flex flex-col items-center mb-4">
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
                  <span className="text-sm text-emerald-600 mt-1">
                    Click to {isExpanded ? "collapse" : "expand"}
                  </span>
                  {isExpanded && (
                    <span className="text-xs text-emerald-700 mt-1">
                      {categoryProducts.length} products
                    </span>
                  )}
                </div>
                
                {/* Products (only if expanded) */}
                {isExpanded && (
                  <div className="mt-4">
                    {loading && !products[categoryIdStr] ? (
                      <div className="flex justify-center items-center h-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                      </div>
                    ) : hasError ? (
                      <div className="text-center py-4 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-red-700">{hasError}</p>
                        <button 
                          className="mt-2 text-sm text-emerald-600 hover:text-emerald-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(category.id);
                          }}
                        >
                          Try again
                        </button>
                      </div>
                    ) : categoryProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categoryProducts.map(prod => (
                          <div
                            key={prod.id}
                            className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:bg-emerald-50 transition border border-emerald-100"
                          >
                            {prod.image && (
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="h-16 w-16 mb-2 object-cover rounded-full"
                              />
                            )}
                            <span className="text-sm font-medium text-emerald-800 text-center">
                              {prod.name}
                            </span>
                            <span className="text-sm font-semibold text-emerald-700 mt-1">
                              ${prod.price}
                            </span>
                            <span className="text-xs text-gray-600 mt-2 text-center line-clamp-2">
                              {prod.description || "No description available"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-white rounded-lg border border-emerald-100">
                        <p className="text-emerald-700">No products found in this category</p>
                        <button 
                          className="mt-2 text-sm text-emerald-600 hover:text-emerald-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(category.id);
                          }}
                        >
                          Refresh
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;