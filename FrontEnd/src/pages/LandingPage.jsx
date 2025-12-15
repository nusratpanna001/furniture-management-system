import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Search, LogOut } from 'lucide-react';
import { LOGO_URL } from '../lib/constants';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import NavBar from '../components/layout/NavBar';

function LandingPage() {
  const productContainerRef = useRef(null);

  const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
  
    const handleLogout = () => {
      logout();
      navigate('/login');
    };

  const scrollProducts = (direction) => {
    if (productContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      productContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const categories = [
    { name: 'Bed', image: 'img/bed.jpeg' },
    { name: 'Shelf', image: 'img/shelf.jpeg' },
    { name: 'Dressing Table', image: 'img/dressing.jpeg' },
    { name: 'Almirah', image: 'img/almirah.jpeg' },
    { name: 'Dining Set', image: 'img/dining set.jpeg' },
    { name: 'Chair', image: 'img/chair.jpeg' },
    { name: 'Sofa', image: 'img/sofa.jpeg' },
    { name: 'Bed Side Table', image: 'img/bedside.jpeg' },
    { name: 'Kids', image: 'img/kids.jpeg' },
    { name: 'Wooden sofa cum Divan', image: 'img/wooden sofa cum divan' },
  ];

  const trendingProducts = [
    {
      name: 'Platinum Velvet Accent Chair ',
      price: 244.99,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'
      ,
    },
    {
      name: 'Velvet Boucle Accent Chair',
      price: 344.99,
      image: 'img/shelf.jpeg',
    },
    {
      name: 'Shelf',
      price: 529.99,
      image: 'img/shelf.jpeg',
    },
    {
      name: 'Comfort Craft Sofa',
      price: 699.99,
      image: 'img/sofa.jpeg',
    },
    {
      name: 'Modern Dining Table Set',
      price: 789.99,
      image: 'img/dining set.jpeg',
    },
  ];

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Navbar */}
      <NavBar />


      {/* Hero Section */}
      <section
        className="relative h-[80vh] md:h-screen flex justify-center items-center bg-cover bg-center mt-16 md:mt-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="bg-white bg-opacity-70 px-6 md:px-10 py-6 md:py-8 rounded-md text-center mx-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
            Precise Concept Design <br className="hidden md:block" /> for Stylish Living
          </h2>
            <div className="flex justify-center mt-8">
              <a href="/products">
                <button
                  className="px-10 py-4 rounded-lg text-white font-semibold text-lg shadow-md bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 transition-all duration-300"
                >
                  Explore Our Collection
                </button>
              </a>
            </div>
        </div>
      </section>

      {/* ...existing code... */}
  {/* ...existing code... */}

      {/* Categories */}
      <section className="py-12 md:py-16 text-center px-4 md:px-8">
        <h3 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-10">Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {categories.map((category, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden w-full">
              <img src={category.image} className="w-full h-40 md:h-48 object-cover" alt={category.name} />
              <h4 className="py-3 text-sm md:text-lg font-semibold">{category.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="bg-gray-100 py-12 md:py-16 text-center relative overflow-hidden">
        <h3 className="text-2xl md:text-4xl font-semibold mb-4">Our Trending Products</h3>
        <p className="text-gray-600 mb-6 px-4">
          Choose what resonates with your uniqueness.
          <br className="hidden md:block" />
          Organize every space with our timeless furniture collections.
        </p>
        <Link to="/products">
          <Button className="mb-10">View All</Button>
        </Link>

        {/* Scroll Buttons (hidden on small screens) */}
        <button
          onClick={() => scrollProducts('left')}
          className="hidden lg:block absolute left-2 top-1/2 transform -translate-y-1/2 bg-amber-700 text-white p-3 rounded-full shadow-lg hover:bg-amber-800 transition-all duration-300 z-10"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scrollProducts('right')}
          className="hidden lg:block absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-700 text-white p-3 rounded-full shadow-lg hover:bg-amber-800 transition-all duration-300 z-10"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>

        {/* Product Cards Container */}
        <div
          ref={productContainerRef}
          className="flex gap-2 md:gap-3 px-6 md:px-8 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {trendingProducts.map((product, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg w-64 md:w-72 flex-shrink-0 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img src={product.image} className="w-full h-48 md:h-52 object-cover" alt={product.name} />
              <div className="p-5">
                <h4 className="font-semibold text-base md:text-lg mb-2 line-clamp-2">{product.name}</h4>
                <p className="text-gray-600 text-lg font-bold mb-3">${product.price}</p>
                <Button size="sm" className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <ShoppingCart size={16} />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Why Choose LuxeHome Section (moved before Footer) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">Why Choose LuxeHome?</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">We are committed to providing exceptional furniture and unparalleled service to make your home truly luxurious.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center">
              <span className="mb-6 text-amber-700">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 17v-1a5 5 0 00-10 0v1"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <h3 className="font-bold text-xl mb-2">Premium Quality</h3>
              <p className="text-gray-600">Handcrafted furniture made with the finest materials and attention to detail.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center">
              <span className="mb-6 text-amber-700">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 13h2l1 9h12l1-9h2"/><path d="M5 13V7a2 2 0 012-2h10a2 2 0 012 2v6"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>
              </span>
              <h3 className="font-bold text-xl mb-2">Free Delivery</h3>
              <p className="text-gray-600">Complimentary delivery service within 50 miles of our showroom location.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center">
              <span className="mb-6 text-amber-700">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17v-5"/><path d="M12 7h.01"/><circle cx="12" cy="12" r="10"/></svg>
              </span>
              <h3 className="font-bold text-xl mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">All our products come with comprehensive warranty and quality assurance.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center">
              <span className="mb-6 text-amber-700">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 15v-2a4 4 0 018 0v2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>
              </span>
              <h3 className="font-bold text-xl mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer service to assist with all your furniture needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
