import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByIdForUser } from "../services/productService"; 

const ProductDetail = () => {
    const { addToCart } = useCart();
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await getProductByIdForUser(id);
                setProduct(data);
            } catch (err) {
                setError("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>No product found</div>;

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full md:w-1/3 rounded-xl object-cover"
                />
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-black mb-2">
                        {product.name}
                    </h1>
                    <p className="text-black mb-4">{product.description}</p>
                    <p className="text-xl font-semibold text-black mb-4">
                        Price: ₹{product.price}
                    </p>
                    <div className="flex  gap-5 mb-10">
                        <button className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                            onClick={() => addToCart(product)}
                             >
                            Add to Cart
                        </button>
                        <button className="px-6 py-3 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors"
                            onClick={() => navigate(-1)} >
                            Continue Shopping
                        </button>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
