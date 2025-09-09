import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  // Handle missing or undefined product properties
  const productName = product.name || 'Unknown Product';
  const productPrice = product.price !== undefined ? `₹${Number(product.price).toFixed(2)}` : 'Price not available';
  const productDescription = product.description || 'No description available';
  const productImage = product.image || null;
  const productId = product.id || 0;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden  hover:shadow-lg transition-shadow duration-300">
      <div className="p-2">
        <div className="flex justify-center items-center h-48 bg-gray-100 rounded-lg mb-4">
          {productImage ? (
            <img 
              src={productImage} 
              alt={productName} 
              className="h-full w-full object-contain"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
              }}
            />
          ) : (
            <div className="text-gray-400 text-sm flex items-center justify-center h-full">
              <span>No Image Available</span>
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold text-emerald-800 mb-2  truncate" title={productName}>
          {productName}
        </h3>
        <p className="text-emerald-600  font-medium mb-2">{productPrice}</p>
        <p className="text-gray-600  mb-4 line-clamp-2">
          {productDescription}
        </p>
        <div className="flex justify-between items-center">
          <Link 
            to={`/products/${productId}`}
            className="text-emerald-600 hover:text-emerald-600 font-medium text-sm"
          >
            View Details
          </Link>
          <button className="bg-emerald-600 text-white px-2 text-sm py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;