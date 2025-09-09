import React from 'react';
import { FiHeart, FiAward, FiUsers, FiGlobe, FiClock, FiCheckCircle } from 'react-icons/fi';

const AboutUs = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Dr. Priya Sharma",
      position: "Founder & Chief Ayurvedic Practitioner",
      bio: "With over 20 years of experience in Ayurvedic medicine, Dr. Sharma leads our mission to bring ancient wisdom to modern wellness.",
      image: "/team/priya.jpg"
    },
    {
      name: "Raj Patel",
      position: "CEO",
      bio: "Raj brings business acumen and a passion for holistic health to drive Ayurvedh's growth and innovation.",
      image: "/team/raj.jpg"
    },
    {
      name: "Dr. Anil Kumar",
      position: "Head of Research & Development",
      bio: "Leading our R&D team to create authentic, effective Ayurvedic formulations backed by modern science.",
      image: "/team/anil.jpg"
    },
    {
      name: "Meera Singh",
      position: "Director of Operations",
      bio: "Ensuring that every product meets our high standards of quality and purity from source to shelf.",
      image: "/team/meera.jpg"
    }
  ];

  // Company values
  const values = [
    {
      icon: <FiHeart className="text-2xl" />,
      title: "Authenticity",
      description: "We stay true to ancient Ayurvedic principles while embracing modern scientific validation."
    },
    {
      icon: <FiAward className="text-2xl" />,
      title: "Quality",
      description: "Rigorous testing and quality control ensure every product meets the highest standards."
    },
    {
      icon: <FiUsers className="text-2xl" />,
      title: "Community",
      description: "We believe in building a community focused on holistic wellness and natural healing."
    },
    {
      icon: <FiGlobe className="text-2xl" />,
      title: "Sustainability",
      description: "Our practices are environmentally responsible, from sourcing to packaging."
    }
  ];

  // Timeline data
  const timeline = [
    {
      year: "2010",
      title: "Our Beginning",
      description: "Ayurvedh was founded with a mission to make authentic Ayurvedic remedies accessible to everyone."
    },
    {
      year: "2013",
      title: "First Product Launch",
      description: "Our flagship product, Ashwagandha, was launched and quickly became a customer favorite."
    },
    {
      year: "2016",
      title: "Expansion",
      description: "We expanded our product line to include over 50 Ayurvedic formulations."
    },
    {
      year: "2019",
      title: "International Reach",
      description: "Ayurvedh products became available in 15 countries worldwide."
    },
    {
      year: "2023",
      title: "Sustainable Initiative",
      description: "Launched our 100% plastic-free packaging initiative across all product lines."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-700 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">About Ayurvedh</h1>
          <p className="text-xl sm:text-2xl max-w-3xl mx-auto text-emerald-100">
            Bringing ancient Ayurvedic wisdom to modern wellness with authentic, natural remedies
          </p>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At Ayurvedh, our mission is to bridge the gap between ancient Ayurvedic wisdom and modern wellness needs. We are committed to providing authentic, natural remedies that promote holistic health and well-being for everyone.
              </p>
              <p className="text-lg text-gray-600">
                We believe that nature holds the key to optimal health, and by combining time-tested Ayurvedic principles with modern scientific research, we create products that are both effective and safe.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 mb-6">
                To be the global leader in authentic Ayurvedic wellness, making natural healing accessible to people everywhere while preserving the ancient wisdom of Ayurveda for future generations.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiCheckCircle className="text-emerald-600 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">Global accessibility to Ayurvedic wellness</p>
                </div>
                <div className="flex items-start">
                  <FiCheckCircle className="text-emerald-600 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">Preservation of traditional knowledge</p>
                </div>
                <div className="flex items-start">
                  <FiCheckCircle className="text-emerald-600 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">Integration of ancient wisdom with modern science</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Ayurvedh
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind Ayurvedh's mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 bg-gradient-to-br from-emerald-200 to-teal-200 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-emerald-800">{member.name.charAt(0)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-emerald-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Key milestones in Ayurvedh's history
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-200 hidden md:block"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="md:w-1/2 mb-6 md:mb-0 px-4">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <div className="flex items-center mb-3">
                        <FiClock className="text-emerald-600 mr-2" />
                        <span className="text-lg font-bold text-emerald-600">{item.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 flex justify-center px-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold z-10">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-700 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Join Our Ayurvedic Journey</h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            Discover the healing power of nature with our authentic Ayurvedic products
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/products" 
              className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Shop Our Products
            </a>
            <a 
              href="/contact" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-emerald-700 transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;