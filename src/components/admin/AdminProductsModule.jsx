import React, { useState, useEffect } from "react";
import {
  FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiSave, FiArrowLeft, FiUpload, FiX, FiCheck, FiAlertCircle, FiSearch, FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getSubCategories,
  uploadCategoryImage
} from "../../services/adminService";

function AdminProducts() {
  // State for data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mode, setMode] = useState("list"); // list | add | edit
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    categoryId: "",
    subCategoryId: "",
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    moreDetails: "",
    publish: true
  });
  
  // Image state
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Selection state
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Initial data fetch
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchProducts();
  }, []);
  
  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  // Fetch categories
  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      const data = await getCategories();
      console.log("Categories fetched:", data);
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setError("Failed to fetch categories");
    }
  };
  
  // Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      console.log("Fetching subcategories...");
      const data = await getSubCategories();
      console.log("Subcategories fetched:", data);
      if (Array.isArray(data)) {
        setSubCategories(data);
      } else {
        setSubCategories([]);
      }
    } catch (err) {
      console.error("Failed to fetch subcategories", err);
      setError("Failed to fetch subcategories");
    }
  };
  
  // Fetch products with pagination and search
  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log("Fetching products...");
      const data = await getProducts();
      console.log("Products fetched:", data);
      
      if (Array.isArray(data)) {
        // Filter based on search term
        const filtered = data.filter(product => {
          const nameMatch = product.name && 
            product.name.toLowerCase().includes(searchTerm.toLowerCase());
          
          const categoryMatch = product.category && 
            product.category.name && 
            product.category.name.toLowerCase().includes(searchTerm.toLowerCase());
          
          const subCategoryMatch = product.subCategory && 
            product.subCategory.name && 
            product.subCategory.name.toLowerCase().includes(searchTerm.toLowerCase());
          
          return nameMatch || categoryMatch || subCategoryMatch;
        });
        
        setTotalItems(filtered.length);
        
        // Apply pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);
        setProducts(paginatedItems);
        
        // Reset selection when page changes
        setSelectedItems([]);
        setSelectAll(false);
      } else {
        setProducts([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };
  
  // Refetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage, searchTerm]);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  
  // Pagination functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const nextPage = () => {
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Selection functions
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allIds = products.map(product => product.id);
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };
  
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      setError("No items selected");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} products?`)) {
      try {
        // Delete selected items one by one
        for (const id of selectedItems) {
          await deleteProduct(id);
        }
        setSuccess(`${selectedItems.length} products deleted successfully`);
        setSelectedItems([]);
        setSelectAll(false);
        fetchProducts();
      } catch (err) {
        setError("Failed to delete products");
        console.error(err);
      }
    }
  };
  
  // Delete single product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setSuccess("Product deleted successfully");
        fetchProducts();
      } catch (err) {
        setError("Failed to delete product");
        console.error(err);
      }
    }
  };
  
  // Handle form change
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "categoryId") {
      // Category select hote hi uski pehli subcategory auto-select karo
      const categoryId = parseInt(value);
      const relatedSubs = subCategories.filter(sub => sub.category && sub.category.id === categoryId);
      setFormData((prev) => ({
        ...prev,
        categoryId: value,
        subCategoryId: relatedSubs.length > 0 ? relatedSubs[0].id.toString() : "" // auto select
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  
  // Remove image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData(prev => ({
      ...prev,
      image: ""
    }));
  };
  
  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData object for multipart/form-data
      const formDataToSend = new FormData();
      
      // Append all form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('categoryId', formData.categoryId);
      if (formData.subCategoryId) {
        formDataToSend.append('subCategoryId', formData.subCategoryId);
      }
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('discount', formData.discount);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('moreDetails', formData.moreDetails);
      formDataToSend.append('publish', formData.publish.toString());
      
      // Append image file if exists
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      

    // Log form data for debugging
    console.log("Submitting form data:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }

      // Send to backend
      const res = await addProduct(formDataToSend);
      console.log("Product added successfully:", res);
      
      // Reset form
      setFormData({
        name: "",
        categoryId: "",
        subCategoryId: "",
        unit: "",
        stock: "",
        price: "",
        discount: "",
        description: "",
        moreDetails: "",
        publish: true,
      });
      setImageFile(null);
      setImagePreview("");
      setSuccess("Product added successfully");
      setMode("list");
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  // Start editing a product
  const startEdit = (product) => {
    console.log("Editing product:", product); // Debug log
    setFormData({
      name: product.name,
      image: product.image || "",
      categoryId: product.category ? product.category.id.toString() : "",
      subCategoryId: product.subCategory ? product.subCategory.id.toString() : "",
      unit: product.unit,
      stock: product.stock.toString(),
      price: product.price.toString(),
      discount: product.discount.toString(),
      description: product.description,
      moreDetails: product.more_details,
      publish: product.publish
    });
    
    if (product.image) {
      setImagePreview(product.image);
    }
    
    setEditingId(product.id);
    setMode("edit");
  };
  
  // Start adding a new product
  const startAdd = () => {
    setFormData({
      name: "",
      image: "",
      categoryId: "",
      subCategoryId: "",
      unit: "",
      stock: "",
      price: "",
      discount: "",
      description: "",
      moreDetails: "",
      publish: true
    });
    setImagePreview("");
    setImageFile(null);
    setEditingId(null);
    setMode("add");
  };
  
  return (
    <div className="flex-1 p-6">
      {/* Alerts */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-start">
          <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p>{error}</p>
            <button onClick={() => setError("")} className="mt-1 text-sm underline">Dismiss</button>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-start">
          <FiCheck className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p>{success}</p>
            <button onClick={() => setSuccess("")} className="mt-1 text-sm underline">Dismiss</button>
          </div>
        </div>
      )}
      
      {/* LIST VIEW */}
      {mode === "list" && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500 w-full"
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={fetchProducts}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FiRefreshCw className="mr-2" /> Refresh
                </button>
                
                {selectedItems.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <FiTrash2 className="mr-2" /> Delete ({selectedItems.length})
                  </button>
                )}
                
                <button
                  onClick={startAdd}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  <FiPlus className="mr-2" /> Add Product
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left w-12">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SubCategory</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(products) && products.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                          {searchTerm ? "No products match your search" : "No products found"}
                        </td>
                      </tr>
                    ) : Array.isArray(products) ? (
                      products.map((product, index) => (
                        <tr key={product.id} className={selectedItems.includes(product.id) ? "bg-blue-50" : ""}>
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(product.id)}
                              onChange={() => handleSelectItem(product.id)}
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td className="px-6 py-4">
                            {product.image ? (
                              <div className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">No Image</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.category ? product.category.name : "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.subCategory ? product.subCategory.name : "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">₹{product.price}</td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <button
                              onClick={() => startEdit(product)}
                              className="text-emerald-600 hover:text-emerald-900 mr-3"
                            >
                              <FiEdit2 className="inline mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 className="inline mr-1" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : null}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                {/* Items per page selector */}
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Items per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                  </select>
                </div>
                
                {/* Pagination */}
                {totalItems > itemsPerPage && (
                  <div className="flex items-center">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> -{" "}
                          <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, totalItems)}
                          </span>{" "}
                          of <span className="font-medium">{totalItems}</span> 
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <span className="sr-only">Previous</span>
                            <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                          </button>
                          
                          {/* Page numbers */}
                          {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, i) => i + 1)
                            .filter(page => 
                              page === 1 || 
                              page === Math.ceil(totalItems / itemsPerPage) || 
                              Math.abs(page - currentPage) <= 1
                            )
                            .map((page, index, array) => (
                              <React.Fragment key={page}>
                                {index > 0 && page - array[index - 1] > 1 && (
                                  <span 
                                    key={`ellipsis-${page}-${index}`}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                  >
                                    ...
                                  </span>
                                )}
                                <button
                                  onClick={() => paginate(page)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === page
                                      ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              </React.Fragment>
                            ))}
                          
                          <button
                            onClick={nextPage}
                            disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <span className="sr-only">Next</span>
                            <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
      
      {/* FORM VIEW */}
      {(mode === "add" || mode === "edit") && (
        <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <button
              onClick={() => setMode("list")}
              className="flex items-center text-emerald-600 hover:text-emerald-800"
            >
              <FiArrowLeft className="mr-2" /> Back to Products
            </button>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {mode === "edit" ? "Edit Product" : "Add New Product"}
          </h1>
          
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              >
                <option value="">Select a Category</option>
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))
                ) : (
                  <option value="" disabled>Loading categories...</option>
                )}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">SubCategory</label>
              <select
                name="subCategoryId"
                value={formData.subCategoryId}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              >
                <option value="">Select a SubCategory (Optional)</option>
                {subCategories.length > 0 ? (
                  subCategories
                    .filter(subCat => {
                      // Only show subcategories that belong to the selected category
                      return !formData.categoryId || 
                             (subCat.category && subCat.category.id === parseInt(formData.categoryId));
                    })
                    .map(subCat => (
                      <option key={subCat.id} value={subCat.id}>{subCat.name}</option>
                    ))
                ) : (
                  <option value="" disabled>Loading subcategories...</option>
                )}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleFormChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleFormChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">More Details</label>
              <textarea
                name="moreDetails"
                value={formData.moreDetails}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              {imagePreview && (
                <div className="mb-3 relative inline-block">
                  <img src={imagePreview} alt="Product preview" className="h-32 w-32 object-cover rounded-md" />
                  <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 mb-3">
                <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <FiUpload className="mr-2" /> {imagePreview ? "Change Image" : "Upload an image"}
                </label>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
            </div>
            
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                name="publish"
                checked={formData.publish}
                onChange={handleFormChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Publish</label>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || imageUploading}
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                <FiSave className="mr-2" />
                {loading || imageUploading ? "Saving..." : mode === "edit" ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;