import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiDownload, FiArrowLeft, FiFile, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { bulkUploadProducts, getBulkUploadTemplate } from '../../services/adminService';

function AdminBulkUploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [templateInfo, setTemplateInfo] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await bulkUploadProducts(file);
      setResult(response);
    } catch (err) {
      setError(err.response?.data || 'Failed to upload products');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const template = await getBulkUploadTemplate();
      setTemplateInfo(template);
    } catch (err) {
      setError('Failed to get template information');
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/admin/products')}
          className="flex items-center text-emerald-600 hover:text-emerald-800"
        >
          <FiArrowLeft className="mr-2" /> Back to Products
        </button>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Bulk Upload Products</h1>
          <p className="text-gray-600 mb-6">
            Upload an Excel file with product information to add multiple products at once.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
            <FiFile className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                <span>Upload a file</span>
                <input 
                  id="file-upload" 
                  name="file-upload" 
                  type="file" 
                  className="sr-only" 
                  onChange={handleFileChange}
                  accept=".xlsx,.xls"
                />
              </label>
              <p className="mt-1 text-sm text-gray-600">Excel files only (.xlsx, .xls)</p>
            </div>
            
            {file && (
              <div className="mt-4 text-sm text-gray-900">
                <p>Selected file: {file.name}</p>
                <p className="text-gray-500">Size: {(file.size / 1024).toFixed(2)} KB</p>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {result && (
            <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Total Processed</p>
                  <p className="text-lg font-semibold">{result.totalProcessed}</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-green-500">Success</p>
                  <p className="text-lg font-semibold text-green-700">{result.successCount}</p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-sm text-red-500">Failed</p>
                  <p className="text-lg font-semibold text-red-700">{result.failureCount}</p>
                </div>
              </div>
              
              {result.errors && result.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Errors:</h4>
                  <ul className="divide-y divide-gray-200">
                    {result.errors.map((err, index) => (
                      <li key={index} className="py-2 text-sm text-gray-700">
                        <span className="font-medium">Row {err.row}:</span> {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <FiUpload className="mr-2" />
              {uploading ? 'Uploading...' : 'Upload Products'}
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Excel Template</h2>
          <p className="text-gray-600 mb-4">
            Download the template to see the required format for product data.
          </p>
          
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiDownload className="mr-2" />
            View Template Format
          </button>
          
          {templateInfo && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">Template Format:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{templateInfo}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBulkUploadPage;