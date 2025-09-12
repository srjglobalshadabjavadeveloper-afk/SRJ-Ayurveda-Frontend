



// src/pages/cart/Cart.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import {
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowLeft,
  FiCreditCard,
  FiTruck,
  FiTag,
  FiCheck
} from 'react-icons/fi';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, addToCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const items = Array.isArray(cartItems) ? cartItems : cartItems?.items || [];
  // Example recommended products
  const recommendedProducts = [
    {
      id: 4,
      name: 'Triphala',
      description: 'Digestive health and detoxification',
      price: 9.99,
      image: '/images/triphala.jpg'
    },
    {
      id: 5,
      name: 'Neem',
      description: 'Blood purifier and skin health',
      price: 7.99,
      image: '/images/neem.jpg'
    }
  ];

  // Calculate subtotal
  
  // const subtotal = cartItems.reduce(
  //   (total, item) => total + item.price * item.quantity,
  //   0
  // );
  const subtotal = items.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0
  );
  // Shipping cost (free for orders over $50)
  const shippingCost = subtotal > 50 ? 0 : 5.99;

  // Tax (8%)
  const tax = subtotal * 0.08;

  // Total
  const total = subtotal + shippingCost + tax - discount;

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'AYURVEDH10') {
      setDiscount(subtotal * 0.1);
      setIsPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  };

  const handleCheckout = () => {
    // In a real app, navigate to checkout/payment page
    alert('Proceeding to checkout...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            to="/products"
            className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors duration-300"
          >
            <FiArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Your Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in
            your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Cart Items
                </h2>
              </div>

              {cartItems.length === 0 ? (
                <div className="p-12 text-center">
                  <FiShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Your cart is empty
                  </h3>
                  <p className="mt-1 text-gray-500">Add some products to your cart</p>
                  <Link
                    to="/products"
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {/* {cartItems.map((item) => ( */}
                  {/* {Array.isArray(cartItems) && */}
                    {cartItems.map((item) => (

                      <div key={item.id} className="p-6">
                        <div className="flex flex-col sm:flex-row">
                          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                            <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">

                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  
                                />
                              ) : (
                                <span className="text-emerald-800 font-bold text-xl">
                                  {item.name.charAt(0)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div>

                                <h3 className="text-lg font-medium text-gray-900">
                                  {item.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.description}
                                </p>
                                <p className="mt-2 text-lg font-semibold text-emerald-700">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>

                              <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                  >
                                    <FiMinus className="h-4 w-4" />
                                  </button>
                                  <span className="px-3 py-2 text-gray-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                  >
                                    <FiPlus className="h-4 w-4" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="mt-4 flex items-center text-red-600 hover:text-red-800"
                                >
                                  <FiTrash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Recommended Products */}
            <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  You May Also Like
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {recommendedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-800 font-bold">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {product.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-emerald-700 font-semibold">
                            ${product.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            className="text-sm font-medium text-emerald-600 hover:text-emerald-800"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center">
                    <FiTruck className="mr-2" />
                    Shipping
                  </span>
                  <span>
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center">
                      <FiTag className="mr-2" />
                      Discount
                    </span>
                    <span>- ${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="pt-6">
                  <label
                    htmlFor="promo-code"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Promo Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="promo-code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      disabled={isPromoApplied}
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={isPromoApplied || !promoCode}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-r-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {isPromoApplied && (
                    <div className="mt-2 flex items-center text-sm text-emerald-600">
                      <FiCheck className="mr-1" />
                      Promo code applied successfully!
                    </div>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Try "AYURVEDH10" for 10% off
                  </p>
                </div>

                {/* Checkout Button */}
                <div className="mt-8">
                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                  >
                    <FiCreditCard className="mr-2" />
                    Proceed to Checkout
                  </button>
                </div>

                {/* Security Note */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    Secure checkout. Your data is protected with 256-bit SSL
                    encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
