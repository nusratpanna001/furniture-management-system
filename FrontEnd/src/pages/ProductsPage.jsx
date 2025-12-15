import { useState, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Grid, List, ShoppingCart, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '../lib/constants';
import Button from '../components/ui/Button';
import Footer from '../components/layout/Footer';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import NavBar from '../components/layout/NavBar';

function usdToBdt(usd) {
  const rate = 110; // Example: 1 USD = 110 BDT
  return Math.round(usd * rate);
}

function ProductsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const { addToCart } = useCart();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'bed', label: 'Bed' },
    { value: 'shelf', label: 'Shelf' },
    { value: 'dressing', label: 'Dressing Table' },
    { value: 'almirah', label: 'Almirah' },
    { value: 'dining', label: 'Dining Set' },
    { value: 'chair', label: 'Chair' },
    { value: 'sofa', label: 'Sofa' },
    { value: 'bedside', label: 'Bed Side Table' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-100', label: `৳${usdToBdt(0)} - ৳${usdToBdt(100)}` },
    { value: '100-300', label: `৳${usdToBdt(100)} - ৳${usdToBdt(300)}` },
    { value: '300-500', label: `৳${usdToBdt(300)} - ৳${usdToBdt(500)}` },
    { value: '500-800', label: `৳${usdToBdt(500)} - ৳${usdToBdt(800)}` },
    { value: '800+', label: `৳${usdToBdt(800)}+` }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const allProducts = [
    {
      id: 1,
      name: 'Classic Wooden Dining Set',
      price: 26949,
      originalPrice: 299.99,
      category: 'chair',   
      rating: 4.8,
      reviews: 124,
      image: 'img/almirah.jpeg',
      description: 'Luxurious velvet accent chair with platinum finish, perfect for modern living rooms.',
      inStock: true,
      featured: true
    },
    // {
    //   id: 2,
    //   name: 'Velvet Boucle Accent Chair',
    //   price: 344.99,
    //   category: 'chair',
    //   rating: 4.9,
    //   reviews: 89,
    //   image: 'img/Velvet Boucle Accent Chair.jpeg',
    //   description: 'Premium boucle fabric chair with ergonomic design and superior comfort.',
    //   inStock: true,
    //   featured: false
    // },
    {
      id: 3,
      name: 'Classic Wooden Dining Set',
      price: 529.99,
      category: 'dining',
      rating: 4.7,
      reviews: 156,
      image: 'img/bedside.jpeg',
      description: 'Handcrafted wooden dining set with 6 chairs, perfect for family gatherings.',
      inStock: true,
      featured: true
    },
    {
      id: 4,
      name: 'Comfort Craft Sofa',
      price: 699.99,
      originalPrice: 899.99,
      category: 'sofa',
      rating: 4.8,
      reviews: 203,
      image: 'img/sofa.jpeg',
      description: 'Ultra-comfortable 3-seater sofa with premium upholstery and modern design.',
      inStock: true,
      featured: true
    },
    {
      id: 5,
      name: 'Modern Oak Bed Frame',
      price: 389.99,
      category: 'bed',
      rating: 4.6,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
      description: 'Minimalist oak bed frame with clean lines and sturdy construction.',
      inStock: true,
      featured: false
    },
    {
      id: 6,
      name: 'Industrial Bookshelf',
      price: 199.99,
      category: 'shelf',
      rating: 4.5,
      reviews: 92,
      image: 'img/shelf.jpeg',
      description: 'Industrial-style bookshelf with metal frame and wooden shelves.',
      inStock: false,
      featured: false
    },
    {
      id: 7,
      name: 'Elegant Dressing Table',
      price: 299.99,
      category: 'dressing',
      rating: 4.7,
      reviews: 67,
      image: 'img/dressing.jpeg',
      description: 'Elegant dressing table with LED mirror and multiple storage compartments.',
      inStock: true,
      featured: false
    },
    {
      id: 8,
      name: 'Spacious Wardrobe',
      price: 789.99,
      category: 'almirah',
      rating: 4.9,
      reviews: 134,
      image: 'img/bed.jpeg',
      description: 'Large 3-door wardrobe with mirror and organized internal storage.',
      inStock: true,
      featured: true
    },
    {
      id: 9,
      name: 'Minimalist Bedside Table',
      price: 89.99,
      category: 'bedside',
      rating: 4.4,
      reviews: 45,
      image: 'img/Minimalist Bedside Table.jpeg',
      description: 'Simple and elegant bedside table with single drawer and open shelf.',
      inStock: true,
      featured: false
    },
    // {
    //   id: 9,
    //   name: 'Wooden Dining Table Set',
    //   price: 89.99,
    //   category: 'bedside',
    //   rating: 4.4,
    //   reviews: 45,
    //   image: 'img/WoodenDining.jpeg',
    //   description: 'Simple and elegant bedside table with single drawer and open shelf.',
    //   inStock: true,
    //   featured: false
    // }
  ];

  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      // Price filter
      let matchesPrice = true;
      if (priceRange !== 'all') {
        if (priceRange === '0-100') {
          matchesPrice = product.price <= 100;
        } else if (priceRange === '100-300') {
          matchesPrice = product.price > 100 && product.price <= 300;
        } else if (priceRange === '300-500') {
          matchesPrice = product.price > 300 && product.price <= 500;
        } else if (priceRange === '500-800') {
          matchesPrice = product.price > 500 && product.price <= 800;
        } else if (priceRange === '800+') {
          matchesPrice = product.price > 800;
        }
      }
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const ProductCard = ({ product }) => (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-amber-600 text-white px-2 py-1 text-xs font-semibold rounded">
            Featured
          </div>
        )}
        {product.originalPrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            Sale
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white p-2 rounded-full shadow-md hover:shadow-lg">
            <Heart size={16} className="text-gray-600 hover:text-red-500" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {product.rating} ({product.reviews})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">৳{usdToBdt(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">৳{usdToBdt(product.originalPrice)}</span>
            )}
          </div>
          <Button
            size="sm"
            disabled={!product.inStock}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            <ShoppingCart size={16} className="mr-1" />
            {product.inStock ? 'Add to Cart' : 'Sold Out'}
          </Button>
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex">
      <div className="relative w-48 h-32 flex-shrink-0">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="mb-3">
            <span className="text-xl font-bold text-gray-900">৳{usdToBdt(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through block">৳{usdToBdt(product.originalPrice)}</span>
            )}
          </div>
          <Button
            size="sm"
            disabled={!product.inStock}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={16} className="mr-1" />
            {product.inStock ? 'Add to Cart' : 'Sold Out'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
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
      <section className="bg-gradient-to-r from-amber-50 to-amber-100 py-12 px-6 md:px-10 mt-20 md:mt-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our extensive collection of premium furniture designed to transform your living space into a luxurious haven.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 px-6 md:px-10 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <Input
                label="Search Products"
                placeholder="Search for furniture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={20} />}
              />
            </div>
            
            <Select
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categories}
            />
            
            <Select
              label="Price Range"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              options={priceRanges}
            />
            
            <Select
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
            />
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {allProducts.length} products
            </p>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-amber-100 text-amber-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-amber-100 text-amber-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="py-8 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                }}
                className="mt-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {filteredProducts.map(product => (
                viewMode === 'grid' ? 
                  <ProductCard key={product.id} product={product} /> :
                  <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ProductsPage;