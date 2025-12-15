import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Award, Heart, Target, ShoppingCart } from 'lucide-react';
import { LOGO_URL } from '../lib/constants';
import Button from '../components/ui/Button';
import Footer from '../components/layout/Footer';
import Topbar from '../components/layout/Topbar';
import NavBar from '../components/layout/NavBar';

function AboutUsPage() {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=300&q=80',
      description: 'With 15+ years in furniture design, Sarah founded LuxeHome to bring luxury furniture to every home.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      description: 'Michael leads our design team with his passion for modern aesthetics and functional furniture.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Quality Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
      description: 'Emily ensures every piece meets our high standards of quality and craftsmanship.'
    },
    {
      name: 'David Wilson',
      role: 'Customer Relations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      description: 'David focuses on building lasting relationships with our customers and understanding their needs.'
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-amber-700" />,
      title: 'Passion for Excellence',
      description: 'We are passionate about creating furniture that combines beauty, comfort, and functionality in every piece.'
    },
    {
      icon: <Award className="w-8 h-8 text-amber-700" />,
      title: 'Premium Quality',
      description: 'Every product is crafted with the finest materials and attention to detail, ensuring long-lasting quality.'
    },
    {
      icon: <Users className="w-8 h-8 text-amber-700" />,
      title: 'Customer First',
      description: 'Our customers are at the heart of everything we do. We strive to exceed expectations in every interaction.'
    },
    {
      icon: <Target className="w-8 h-8 text-amber-700" />,
      title: 'Sustainable Future',
      description: 'We are committed to sustainable practices and environmentally responsible furniture manufacturing.'
    }
  ];

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Navbar (compact) */}
      {/* <header className="px-4 md:px-8 fixed top-0 w-full z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 items-center py-2">
            <div className="flex items-center">
              <img src="img/logo.png" alt="logo" className="w-10 h-10 md:w-12 md:h-12" />
            </div>

            <nav className="hidden md:flex justify-center space-x-3 text-sm">
              <Link to="/home" className="text-gray-700 hover:text-amber-700 font-medium">Home</Link>
              <Link to="/about-us" className="text-gray-700 hover:text-amber-700 font-medium">About Us</Link>
              <Link to="/products" className="text-gray-700 hover:text-amber-700 font-medium">Products</Link>
              <Link to="/contact-us" className="text-gray-700 hover:text-amber-700 font-medium">Contact Us</Link>
            </nav>

            <div className="flex items-center justify-end space-x-2">
              <Link to="/my-cart">
                <Button size="sm" className="text-xs flex items-center p-2 bg-amber-600 text-white hover:bg-amber-700" aria-label="My Cart">
                  <ShoppingCart size={16} />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="sm" className="text-xs px-3 py-1">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header> */}

      <NavBar />

      {/* Hero Section */}
      <section
        className="relative h-[60vh] flex justify-center items-center bg-cover bg-center mt-20 md:mt-24"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="bg-black bg-opacity-50 px-8 md:px-12 py-8 md:py-12 rounded-lg text-center text-white mx-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About LuxeHome</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Crafting exceptional furniture experiences since 2010. We believe every home deserves luxury.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Founded in 2010, LuxeHome began as a small family business with a simple vision: to make luxury furniture accessible to everyone. What started in a small workshop has grown into a trusted brand that serves thousands of customers worldwide.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our commitment to quality craftsmanship and innovative design has made us a leader in the furniture industry. We work with skilled artisans and use premium materials to create pieces that stand the test of time.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Today, LuxeHome continues to evolve, embracing new technologies and sustainable practices while maintaining our core values of quality, beauty, and customer satisfaction.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
                alt="LuxeHome Workshop"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-gray-50 py-16 md:py-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            These core values guide everything we do at LuxeHome, from design conception to customer delivery.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section removed as requested. */}

      {/* Stats Section */}
      <section className="bg-amber-50 py-16 md:py-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">LuxeHome by Numbers</h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-amber-700 mb-2">15+</div>
              <div className="text-gray-600 font-medium">Years of Excellence</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-amber-700 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Happy Customers</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-amber-700 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Furniture Designs</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-amber-700 mb-2">25+</div>
              <div className="text-gray-600 font-medium">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 px-6 md:px-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Home?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our extensive collection of premium furniture and start creating the home of your dreams today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg transition-all duration-300">
                Explore Products
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-2 border-amber-700 text-amber-700 hover:bg-amber-50">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AboutUsPage;