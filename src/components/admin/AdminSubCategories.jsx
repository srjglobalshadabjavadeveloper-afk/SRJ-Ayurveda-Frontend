import React, { useState, useEffect, useCallback } from "react";
import {
    FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiSave, FiArrowLeft, FiUpload, FiX, FiCheck, FiAlertCircle, FiSearch, FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import {
    getSubCategories,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getCategories,
    uploadCategoryImage
} from "../../services/adminService";

function AdminSubCategories() {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    // Mode control
    const [mode, setMode] = useState("list"); // list | add | edit
    const [editingId, setEditingId] = useState(null);
    // Form state
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        categoryId: ""
    });
    const [imagePreview, setImagePreview] = useState("");
    const [imageFile, setImageFile] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
    const [totalItems, setTotalItems] = useState(0);
    
    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    
    // Selection state
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Fetch categories - only runs once on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Memoized fetchSubCategories function
    const fetchSubCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getSubCategories();
            console.log("Fetched subcategories:", data);
            
            if (Array.isArray(data)) {
                // Filter based on search term
                const filtered = data.filter(subCategory => {
                    const nameMatch = subCategory.name && 
                        subCategory.name.toLowerCase().includes(searchTerm.toLowerCase());
                    
                    const categoryMatch = subCategory.category && 
                        subCategory.category.name && 
                        subCategory.category.name.toLowerCase().includes(searchTerm.toLowerCase());
                    
                    return nameMatch || categoryMatch;
                });
                
                setTotalItems(filtered.length);
                
                // Apply pagination
                const startIndex = (currentPage - 1) * itemsPerPage;
                const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);
                setSubCategories(paginatedItems);
                
                // Reset selection when page changes
                setSelectedItems([]);
                setSelectAll(false);
            } else {
                setSubCategories([]);
                setTotalItems(0);
            }
        } catch (err) {
            console.error("Error fetching subcategories:", err);
            setError("Failed to fetch subcategories");
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchTerm]); // Dependencies for the function

    // Effect to fetch subcategories when dependencies change
    useEffect(() => {
        fetchSubCategories();
    }, [fetchSubCategories]);

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

    //fetch categories for dropdown
    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            if (Array.isArray(data)) {
                setCategories(data);
            } else {
                setCategories([]);
            }
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
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
        if (selectAll) {
            setSelectedItems([]);
        } else {
            const allIds = subCategories.map(subCategory => subCategory.id);
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
        
        if (window.confirm(`Are you sure you want to delete ${selectedItems.length} subcategories?`)) {
            try {
                // Delete selected items one by one
                for (const id of selectedItems) {
                    await deleteSubCategory(id);
                }
                setSuccess(`${selectedItems.length} subcategories deleted successfully`);
                setSelectedItems([]);
                setSelectAll(false);
                fetchSubCategories();
            } catch (err) {
                setError("Failed to delete subcategories");
                console.error(err);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this subcategory?")) {
            try {
                await deleteSubCategory(id);
                setSuccess("Subcategory deleted successfully");
                fetchSubCategories();
            } catch (err) {
                setError("Failed to delete subcategory");
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

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.categoryId) {
            setError("Please select a category");
            return;
        }
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("categoryId",Number(formData.categoryId));
            if (imageFile) {
                formDataToSend.append("image", imageFile);
            }
            if (mode === "edit") {
                await updateSubCategory(editingId, formDataToSend);
                setSuccess("Subcategory updated successfully");
            } else {
                await addSubCategory(formDataToSend);
                setSuccess("Subcategory added successfully");
            }
            // Reset form
            setFormData({ name: "", categoryId: "", image: "" });
            setImagePreview("");
            setImageFile(null);
            setMode("list");
            fetchSubCategories();
        } catch (err) {
            setError(mode === "edit" ? "Failed to update subcategory" : "Failed to add subcategory");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (subCategory) => {
        setFormData({
            name: subCategory.name,
            image: subCategory.image || "",
            categoryId: subCategory.category ? subCategory.category.id : 
                   subCategory.categoryId ? subCategory.categoryId : ""
        });
        // If category has an image, set it as preview
        if (subCategory.image) {
            setImagePreview(subCategory.image);
        }
        setEditingId(subCategory.id);
        setMode("edit");
    };

    const startAdd = () => {
        setFormData({
            name: "",
            image: "",
            categoryId: ""
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
                        <button
                            onClick={() => setError("")}
                            className="mt-1 text-sm underline"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}
            {success && (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-start">
                    <FiCheck className="h-5 w-5 mr-2 mt-0.5" />
                    <div>
                        <p>{success}</p>
                        <button
                            onClick={() => setSuccess("")}
                            className="mt-1 text-sm underline"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {/* LIST VIEW */}
            {mode === "list" && (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">SubCategories Management</h1>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {/* Search Bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search subcategories..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500 w-full"
                                />
                                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={fetchSubCategories}
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
                                    <FiPlus className="mr-2" /> Add SubCategory
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
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {Array.isArray(subCategories) && subCategories.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    {searchTerm ? "No subcategories match your search" : "No SubCategories found"}
                                                </td>
                                            </tr>
                                        ) : Array.isArray(subCategories) ? (
                                            subCategories.map((subCategory, index) => (
                                                <tr key={subCategory.id} className={selectedItems.includes(subCategory.id) ? "bg-blue-50" : ""}>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.includes(subCategory.id)}
                                                            onChange={() => handleSelectItem(subCategory.id)}
                                                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td className="px-6 py-4">
                                                        {subCategory.image ? (
                                                            <div className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden">
                                                                <img
                                                                    src={subCategory.image}
                                                                    alt={subCategory.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                                                <span className="text-xs text-gray-500">No Image</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{subCategory.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {subCategory.category ? subCategory.category.name :
                                                            subCategory.categoryName ? subCategory.categoryName : "N/A"}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => startEdit(subCategory)}
                                                            className="text-emerald-600 hover:text-emerald-900 mr-3"
                                                        >
                                                            <FiEdit2 className="inline mr-1" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(subCategory.id)}
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
                            <FiArrowLeft className="mr-2" /> Back to SubCategories
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">
                        {mode === "edit" ? "Edit SubCategory" : "Add New SubCategory"}
                    </h1>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SubCategory Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter subcategory name"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, categoryId: Number(e.target.value) }))
                                }
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                            >
                                <option value="">Select a Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">SubCategory Image</label>
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
                                {loading ? "Saving..." : mode === "edit" ? "Update SubCategory" : "Add SubCategory"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AdminSubCategories;