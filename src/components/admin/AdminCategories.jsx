import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiSave, FiArrowLeft, FiUpload, FiX, FiCheck, FiAlertCircle, FiSearch, FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage
} from "../../services/adminService";

function AdminCategories() {
  // Existing state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mode, setMode] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: ""
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Selection state
  const [selectedItems, setSelectedItems] = useState([]);
  const selectAllRef = useRef(null);
  
  // Memoized fetchCategories function
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      console.log("Fetched categories:", data);
      
      if (Array.isArray(data)) {
        
        const cleanedData = data.map(category => {
         
          return {
            id: category.id,
            name: category.name,
            image: category.image
          };
        });
        
        // Filter based on search term
        const filtered = cleanedData.filter(category => 
          category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setTotalItems(filtered.length);
        
        // Apply pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);
        setCategories(paginatedItems);
        
        // Reset selection when page changes
        setSelectedItems([]);
      } else {
        setCategories([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
     
      if (err.response?.data?.includes("nesting depth") || 
          err.response?.data?.includes("Could not write JSON")) {
        setError("Server error: Data structure too complex. Please try again later.");
      } else {
        setError("Failed to fetch categories");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm]);
  
  // Effect to fetch categories when dependencies change
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  // Effect to update select all checkbox state
  useEffect(() => {
    if (categories.length === 0) {
      if (selectAllRef.current) {
        selectAllRef.current.checked = false;
        selectAllRef.current.indeterminate = false;
      }
      return;
    }
    
    const allSelected = categories.every(category => selectedItems.includes(category.id));
    const someSelected = selectedItems.length > 0 && selectedItems.some(id => 
      categories.map(category => category.id).includes(id)
    );
    
    if (selectAllRef.current) {
      selectAllRef.current.checked = allSelected;
      selectAllRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [selectedItems, categories]);
  
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
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };
  
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
  
  const handleSelectAll = () => {
    const currentPageIds = categories.map(category => category.id);
    
    if (currentPageIds.every(id => selectedItems.includes(id))) {
      // If all on current page are selected, deselect them
      setSelectedItems(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      // Otherwise, select all on current page
      setSelectedItems(prev => {
        // Remove any current page IDs that might already be selected
        const filtered = prev.filter(id => !currentPageIds.includes(id));
        // Add all current page IDs
        return [...filtered, ...currentPageIds];
      });
    }
  };
  
  const handleSelectItem = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        // If item is already selected, remove it
        return prev.filter(itemId => itemId !== id);
      } else {
        // If item is not selected, add it
        return [...prev, id];
      }
    });
  };
  
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      setError("No items selected");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} categories?`)) {
      try {
        let successCount = 0;
        let errorCount = 0;
        let errorMessage = "";
        
        // Delete selected items one by one
        for (const id of selectedItems) {
          try {
            await deleteCategory(id);
            successCount++;
          } catch (err) {
            errorCount++;
            errorMessage += `\nFailed to delete category with ID ${id}: ${err.response?.data || err.message}`;
          }
        }
        
        if (errorCount === 0) {
          setSuccess(`${successCount} categories deleted successfully`);
        } else {
          setError(`Deleted ${successCount} categories, but ${errorCount} failed:${errorMessage}`);
        }
        
        setSelectedItems([]);
        fetchCategories();
      } catch (err) {
        setError("Failed to delete categories");
        console.error(err);
      }
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData(prev => ({
      ...prev,
      image: ""
    }));
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await deleteCategory(id);
        console.log("Delete response:", response);
        
        if (response.status >= 200 && response.status < 300) {
          setSuccess("Category deleted successfully");
          fetchCategories();
        } else {
          setError(response.data || "Failed to delete category");
        }
      } catch (err) {
        console.error("Error deleting category:", err);
        setError(err.response?.data || "Failed to delete category");
      }
    }
  };
  
  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const categoryData = { ...formData };
  //     if (imageFile) {
  //       const uploadRes = await uploadCategoryImage(imageFile);
  //       console.log(uploadRes);
  //       categoryData.image = uploadRes.url;
  //     }
  //     let response;
  //     if (mode === "edit") {
  //       response = await updateCategory(editingId, categoryData);
  //     } else {
  //       response = await addCategory(categoryData);
  //     }
      
  //     console.log("Form submission response:", response);
      
  //     if (response.status >= 200 && response.status < 300) {
  //       setSuccess(mode === "edit" ? "Category updated successfully" : "Category added successfully");
  //       setFormData({ name: "", image: "" });
  //       setImagePreview("");
  //       setImageFile(null);
  //       setMode("list");
  //       fetchCategories();
  //     } 
  //     else {
  //       setError(response.data || (mode === "edit" ? "Failed to update category" : "Failed to add category"));
  //     }
  //   } catch (err) {
  //     console.error("Error submitting form:", err);
  //     setError(err.response?.data || (mode === "edit" ? "Failed to update category" : "Failed to add category"));
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

  const handleFormSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const categoryData = { name: formData.name };

    if (imageFile) {
      const uploadRes = await uploadCategoryImage(imageFile);
      categoryData.image = uploadRes.url;
    } else if (formData.image) {
      categoryData.image = formData.image; // keep old image if exists
    }

    let response;
    if (mode === "edit") {
      response = await updateCategory(editingId, categoryData);
    } else {
      response = await addCategory(categoryData);
    }

    console.log("Form submission response:", response);

    // ✅ Don’t check response.status unless you are sure response includes it
    setSuccess(mode === "edit" ? "Category updated successfully" : "Category added successfully");

    setFormData({ name: "", image: "" });
    setImagePreview("");
    setImageFile(null);
    setMode("list");
    fetchCategories();
  } catch (err) {
    console.error("Error submitting form:", err);
    setError(err.response?.data || (mode === "edit" ? "Failed to update category" : "Failed to add category"));
  } finally {
    setLoading(false);
  }
};


const startEdit = (category) => {
  setEditingId(category.id); // ensure correct id
  setFormData({ name: category.name, image: category.image || "" });
  setImagePreview(category.image || "");
  setMode("edit");
};

  // const startEdit = (category) => {
  //   setFormData({
  //     name: category.name,
  //     image: category.image || ""
  //   });
    
  //   if (category.image) {
  //     setImagePreview(category.image);
  //   } else {
  //     setImagePreview("");
  //   }
    
  //   setEditingId(category.id);
  //   setMode("edit");
  // };
  
  const startAdd = () => {
    setFormData({
      name: "",
      image: ""
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
            <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500 w-full"
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={fetchCategories}
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
                  <FiPlus className="mr-2" /> Add Category
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
                          ref={selectAllRef}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(categories) && categories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          {searchTerm ? "No categories match your search" : "No categories found"}
                        </td>
                      </tr>
                    ) : Array.isArray(categories) ? (
                      categories.map((category, index) => (
                        <tr key={category.id} className={selectedItems.includes(category.id) ? "bg-blue-50" : ""}>
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(category.id)}
                              onChange={() => handleSelectItem(category.id)}
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td className="px-6 py-4">
                            {category.image ? (
                              <div className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden">
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">No Image</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <button
                              onClick={() => startEdit(category)}
                              className="text-emerald-600 hover:text-emerald-900 mr-3"
                            >
                              <FiEdit2 className="inline mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
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
                                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
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
              <FiArrowLeft className="mr-2" /> Back to Categories
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {mode === "edit" ? "Edit Category" : "Add New Category"}
          </h1>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
              {imagePreview && (
                <div className="mb-3 relative inline-block">
                  <img src={imagePreview} alt="Category preview" className="h-32 w-32 object-cover rounded-md" />
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
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                <FiSave className="mr-2" />
                {loading ? "Saving..." : mode === "edit" ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;