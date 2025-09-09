import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';

// Placeholder data
const featuredProducts = [
  { id: 1, name: 'Ashwagandha', price: 10.99, image: '/images/ashwagandha.jpg', description: 'Stress relief and energy booster' },
  { id: 2, name: 'Turmeric', price: 8.99, image: '/images/turmeric.jpg', description: 'Anti-inflammatory powerhouse' },
  { id: 3, name: 'Brahmi', price: 12.99, image: '/images/brahmi.jpg', description: 'Enhances memory and cognitive function' },
  { id: 4, name: 'Triphala', price: 9.99, image: '/images/triphala.jpg', description: 'Digestive health and detoxification' },
];
const benefits = [
  {
    title: "100% Natural",
    description: "All our products are made from natural ingredients without any chemicals.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  },
  {
    title: "Ancient Wisdom",
    description: "Formulated based on ancient Ayurvedic texts and traditional knowledge.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    title: "Lab Tested",
    description: "All products undergo rigorous testing to ensure purity and effectiveness.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    title: "Eco-Friendly",
    description: "We use sustainable practices and packaging to protect our environment.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  }
];

// Animation styles
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(30px); 
    }
    to { 
      opacity: 1;
      transform: translateY(0); 
    }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }
  
  .animate-slideUp {
    animation: slideUp 0.8s ease-out forwards;
  }
  
  .animate-pulse {
    animation: pulse 2s infinite;
  }
  
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
`;

function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visibility after component mounts to trigger animations
    setIsVisible(true);
    
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Animation styles */}
      <style>{animationStyles}</style>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-800 to-emerald-600 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590596160648-8b5da7c4c1c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20 z-0"></div>
        
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 ${isVisible ? 'animate-slideUp' : ''}`}>
              Discover the Healing Power of <span className="text-amber-300">Nature</span>
            </h1>
            <p className={`text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto mb-6 sm:mb-10 px-4 ${isVisible ? 'animate-slideUp stagger-1' : ''}`}>
              Authentic Ayurvedic remedies crafted with ancient wisdom and modern science for holistic wellness
            </p>
            <div className={`flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 ${isVisible ? 'animate-slideUp stagger-2' : ''}`}>
              <Link 
                to="/products" 
                className="px-6 py-3 sm:px-8 sm:py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
              >
                Shop Now
              </Link>
              <Link 
                to="/about" 
                className="px-6 py-3 sm:px-8 sm:py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-800 font-semibold rounded-lg transition-all duration-300 text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-white to-transparent z-10"></div>
      </div>
      
      {/* Featured Products Section */}
      <div className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-900 mb-3 sm:mb-4">Featured Products</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Our most popular Ayurvedic remedies, carefully selected for their purity and effectiveness
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className={`group transition-all duration-500 ${isVisible ? 'animate-slideUp' : ''}`} style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col">
                  <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-emerald-200 flex items-center justify-center">
                      <span className="text-emerald-800 font-bold text-xl">{product.name}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-800 bg-amber-300 rounded-full">
                        Best Seller
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 flex-grow flex flex-col">
                    <h3 className="text-lg sm:text-xl font-bold text-emerald-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm flex-grow">{product.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-lg sm:text-xl font-bold text-emerald-700">${product.price.toFixed(2)}</span>
                      <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-300">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <Link 
              to="/products" 
              className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
            >
              View All Products
              <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-emerald-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-900 mb-3 sm:mb-4">Why Choose Ayurvedh?</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Our commitment to quality, authenticity, and sustainability sets us apart
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className={`bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center ${isVisible ? 'animate-slideUp' : ''}`}
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 sm:mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-emerald-900 mb-2 sm:mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-900 mb-3 sm:mb-4">What Our Customers Say</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Real experiences from people who have transformed their health with Ayurveda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className={`bg-emerald-50 p-5 sm:p-6 rounded-xl transition-all duration-500 hover:shadow-md ${isVisible ? 'animate-slideUp' : ''}`} style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="text-amber-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">"The Ashwagandha supplement has completely transformed my energy levels. I feel more balanced and focused throughout the day."</p>
              <p className="font-semibold text-emerald-800 text-sm">- Sarah K.</p>
            </div>
            
            <div className={`bg-emerald-50 p-5 sm:p-6 rounded-xl transition-all duration-500 hover:shadow-md ${isVisible ? 'animate-slideUp' : ''}`} style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="text-amber-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">"I've been using the Turmeric formula for my joint pain, and the results have been remarkable. Highly recommend!"</p>
              <p className="font-semibold text-emerald-800 text-sm">- Michael T.</p>
            </div>
            
            <div className={`bg-emerald-50 p-5 sm:p-6 rounded-xl transition-all duration-500 hover:shadow-md ${isVisible ? 'animate-slideUp' : ''}`} style={{ animationDelay: '0.9s' }}>
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="text-amber-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">"The Triphala has improved my digestion so much. I feel lighter and more energetic. Thank you Ayurvedh!"</p>
              <p className="font-semibold text-emerald-800 text-sm">- Priya R.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-r from-emerald-700 to-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 ${isVisible ? 'animate-slideUp' : ''}`} style={{ animationDelay: '1s' }}>
            Ready to Begin Your Ayurvedic Journey?
          </h2>
          <p className={`text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto mb-6 sm:mb-10 px-4 ${isVisible ? 'animate-slideUp' : ''}`} style={{ animationDelay: '1.1s' }}>
            Join thousands of customers who have transformed their health with our authentic Ayurvedic products
          </p>
          <div className={`flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 ${isVisible ? 'animate-slideUp' : ''}`} style={{ animationDelay: '1.2s' }}>
            <Link 
              to="/products" 
              className="px-6 py-3 sm:px-8 sm:py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-center animate-pulse"
            >
              Shop Our Collection
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-3 sm:px-8 sm:py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-800 font-semibold rounded-lg transition-all duration-300 text-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;