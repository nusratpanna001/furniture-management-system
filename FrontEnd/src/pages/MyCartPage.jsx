import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Heart, Star, ShoppingCart } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Footer from '../components/layout/Footer';
import NavBar from '../components/layout/NavBar';

function usdToBdt(usd) {
  const rate = 110; // Example: 1 USD = 110 BDT
  return Math.round(usd * rate);
}

function MyCartPage() {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  // updateQuantity and removeItem now come from context

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over $500
  const total = subtotal + tax + shipping;

  const recommendedProducts = [
    {
      id: 5,
      name: 'Floor Lamp',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 4.8
    },
    {
      id: 6,
      name: 'Throw Pillows Set',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80',
      rating: 4.6
    },
    {
      id: 7,
      name: 'Wall Mirror',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80',
      rating: 4.9
    }
  ];

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

      {/* Main Content */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="text-amber-700" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Cart</h1>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <ShoppingBag className="mx-auto text-gray-400 mb-4" size={80} />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
              <Link to="/products">
                <Button className="flex items-center gap-2">
                  Continue Shopping
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <Card title="Cart Items">
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b last:border-b-0">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.name}</h3>
                              <p className="text-gray-600 text-sm mb-2">Category: {item.category}</p>
                              <p className="text-2xl font-bold text-amber-700">৳{usdToBdt(item.price)}</p>
                              {!item.inStock && (
                                <p className="text-red-600 text-sm font-medium mt-1">Out of Stock</p>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-col items-end gap-3">
                              <div className="flex items-center border rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                  disabled={item.quantity <= 1 || !item.inStock}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                  disabled={!item.inStock}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 size={16} />
                                </button>
                                <button
                                  className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                                  title="Add to wishlist"
                                >
                                  <Heart size={16} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="mt-3 text-right sm:text-left">
                            <p className="text-sm text-gray-600">
                              Subtotal: <span className="font-semibold text-gray-900">৳{usdToBdt(item.price * item.quantity)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Continue Shopping */}
                <div className="flex justify-between items-center">
                  <Link to="/products">
                    <Button variant="outline" className="flex items-center gap-2">
                      <ArrowRight size={16} className="rotate-180" />
                      Continue Shopping
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setCartItems([])}
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card title="Order Summary">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>৳{usdToBdt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>৳{usdToBdt(tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600 font-medium">Free</span>
                        ) : (
                          `৳${usdToBdt(shipping)}`
                        )}
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-amber-700">৳{usdToBdt(total)}</span>
                    </div>

                    {shipping > 0 && (
                      <p className="text-sm text-gray-600 bg-amber-50 p-3 rounded-lg">
                        Add ৳{usdToBdt(500 - subtotal)} more for free shipping!
                      </p>
                    )}

                    <Button
                      className="w-full mt-6 flex items-center justify-center gap-2"
                      onClick={() => navigate('/checkout')}
                    >
                      Proceed to Checkout
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </Card>

                {/* Recommended Products */}
                <Card title="You might also like">
                  <div className="space-y-4">
                    {recommendedProducts.map((product) => (
                      <div key={product.id} className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="text-amber-400 fill-current" size={12} />
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                          <p className="font-bold text-amber-700">৳{usdToBdt(product.price)}</p>
                        </div>
                        <Button size="sm" variant="outline" className="self-center">
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MyCartPage;