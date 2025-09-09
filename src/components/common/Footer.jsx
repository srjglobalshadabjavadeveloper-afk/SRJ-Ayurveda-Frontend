import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin, FiChevronRight } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];
  
  const customerService = [
    { name: 'FAQ', path: '/faq' },
    { name: 'Shipping Policy', path: '/shipping' },
    { name: 'Return & Exchange', path: '/returns' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];
  
  const contactInfo = [
    { icon: <FiMapPin className="text-lg" />, text: '123 Wellness Street, Ayurveda City, AC 54321' },
    { icon: <FiPhone className="text-lg" />, text: '+1 (555) 123-4567' },
    { icon: <FiMail className="text-lg" />, text: 'support@ayurvedh.com' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Newsletter Section */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-xl font-bold text-white">Subscribe to Our Newsletter</h3>
              <p className="text-gray-300 mt-1">Get the latest updates on new products and special offers</p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 w-full md:w-80"
                  required
                />
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-300 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Section */}
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center mr-2">
                  <span className="text-gray-900 font-bold text-lg">A</span>
                </div>
                <span className="text-2xl font-bold text-white">Ayurvedh</span>
              </div>
              <p className="text-gray-300 mb-4">
                Discover the healing power of nature with our authentic Ayurvedic remedies, crafted with ancient wisdom and modern science.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  <FiFacebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  <FiTwitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  <FiInstagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  <FiYoutube className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="mb-8 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      <FiChevronRight className="mr-2" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Customer Service */}
            <div className="mb-8 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
              <ul className="space-y-2">
                {customerService.map((service, index) => (
                  <li key={index}>
                    <Link 
                      to={service.path} 
                      className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      <FiChevronRight className="mr-2" />
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
              <ul className="space-y-3">
                {contactInfo.map((info, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-400 mt-1 mr-3">{info.icon}</span>
                    <span className="text-gray-300">{info.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <h4 className="text-md font-medium text-white mb-2">We Accept</h4>
                <div className="flex space-x-2">
                  <div className="bg-white text-gray-900 px-3 py-1 rounded text-xs font-bold">VISA</div>
                  <div className="bg-white text-gray-900 px-3 py-1 rounded text-xs font-bold">MC</div>
                  <div className="bg-white text-gray-900 px-3 py-1 rounded text-xs font-bold">AMEX</div>
                  <div className="bg-white text-gray-900 px-3 py-1 rounded text-xs font-bold">PP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Ayurvedh. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-300">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;