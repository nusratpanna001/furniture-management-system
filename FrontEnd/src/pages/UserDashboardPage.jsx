import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, User, HelpCircle, ShoppingBag, Star, Phone, Mail, MapPin, Edit3, Settings, ShoppingCart, Printer } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AppLayout from '../components/layout/AppLayout';
import { useLocation } from 'react-router-dom';
import { api } from '../lib/apiClient';
import { useToast } from '../contexts/ToastContext';

function UserDashboardPage() {
  const { user, updateUser } = useAuth();
  const { addToCart } = useCart();
  const { error, success } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editAddress, setEditAddress] = useState(profile.address);

  // Load user orders from backend
  useEffect(() => {
    loadOrders();
    loadWishlist();
  }, []);

  // Sync profile with user data
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditPhone(user.phone || '');
      setEditAddress(user.address || '');
    }
  }, [user]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await api.orders.getUserOrders();
      const backendUrl = 'http://127.0.0.1:8000';
      const ordersData = (response.data || response).map(order => ({
        id: order.id,
        date: order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : 'N/A',
        items: order.items?.length || 0,
        total: parseFloat(order.total) || 0,
        status: order.status,
        products: order.items?.map(item => {
          let imageUrl = 'https://via.placeholder.com/100';
          if (item.product?.image_url) {
            if (item.product.image_url.startsWith('http')) {
              imageUrl = item.product.image_url;
            } else {
              imageUrl = `${backendUrl}/${item.product.image_url}`;
            }
          }
          return {
            name: item.product?.name || 'Unknown Product',
            image: imageUrl,
            quantity: item.quantity,
            price: item.price
          };
        }) || []
      }));
      setUserOrders(ordersData);
    } catch (err) {
      console.error('Failed to load orders:', err);
      error('Failed to load your orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadWishlist = async () => {
    setLoadingWishlist(true);
    try {
      const response = await api.wishlist.list();
      const backendUrl = 'http://127.0.0.1:8000';
      const wishlistData = (response.data || response).map(item => {
        let imageUrl = 'https://via.placeholder.com/400';
        
        if (item.product?.image_url) {
          if (item.product.image_url.startsWith('http')) {
            imageUrl = item.product.image_url;
          } else {
            imageUrl = `${backendUrl}/${item.product.image_url}`;
          }
        }
        
        return {
          id: item.id,
          product_id: item.product_id,
          name: item.product?.name || 'Unknown Product',
          price: parseFloat(item.product?.price) || 0,
          image: imageUrl,
          inStock: item.product?.inStock || false,
        };
      });
      setWishlistItems(wishlistData);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
      error('Failed to load your wishlist');
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleRemoveFromWishlist = async (wishlistId) => {
    try {
      await api.wishlist.remove(wishlistId);
      setWishlistItems(wishlistItems.filter(item => item.id !== wishlistId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      error('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = (item) => {
    const cartProduct = {
      id: item.product_id,
      name: item.name,
      price: item.price,
      image: item.image,
    };
    addToCart(cartProduct);
    success(`${item.name} added to cart!`);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    
    try {
      const profileData = {
        name: editName,
        phone: editPhone,
        address: editAddress,
      };

      const response = await api.auth.updateProfile(profileData);
      
      if (response.status) {
        // Update local profile state
        setProfile({
          name: editName,
          email: profile.email, // Email doesn't change
          phone: editPhone,
          address: editAddress,
        });
        
        // Update user in AuthContext if updateUser function exists
        if (updateUser && response.user) {
          updateUser(response.user);
        }
        
        success('Profile updated successfully!');
        setShowEditProfile(false);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      error(err.message || 'Failed to update profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const wishlistItemsOldOld = [
    {
      id: 1,
      name: 'Luxury Velvet Sofa',
      price: 1299.99,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
      inStock: true
    },
    {
      id: 2,
      name: 'Modern Coffee Table',
      price: 449.99,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
      inStock: true
    },
    {
      id: 3,
      name: 'Wooden Dining Set',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80',
      inStock: false
    }
  ];
  // Remove this old data - using dynamic wishlistItems from backend now

  // Render the user's orders list
  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h2>
      {loadingOrders ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      ) : userOrders.length === 0 ? (
        <Card className="p-8 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">You haven't placed any orders yet.</p>
          <Link to="/products">
            <Button className="mt-4">Start Shopping</Button>
          </Link>
        </Card>
      ) : (
      <div className="space-y-4">
        {userOrders.map((order) => {
          const statusColor =
            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700';

          return (
            <Card key={order.id} className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <span className="text-sm text-gray-500">• {order.date}</span>
                    <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${statusColor}`}>
                      {order.status}
                    </div>
                  </div>
                  
                  {/* Product Images */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {order.products.slice(0, 3).map((product, idx) => (
                      <img
                        key={idx}
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100';
                        }}
                      />
                    ))}
                    {order.products.length > 3 && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-600 text-xs font-medium">
                        +{order.products.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {order.items} item(s) — {order.products.map(p => p.name).join(', ')}
                  </p>
                </div>

                {/* Order Summary */}
                <div className="text-right md:text-right flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end gap-2">
                  <p className="font-bold text-xl text-amber-700 mb-2">৳{Math.round(order.total)}</p>
                  <div className="flex gap-2">
                    <Link to={`/user/orders/${order.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                    <Link to={`/user/orders/${order.id}?print=true`}>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Printer size={14} />
                        Print
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
      {loadingWishlist ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <Card className="p-8 text-center">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Your wishlist is empty.</p>
          <Link to="/products">
            <Button className="mt-4">Browse Products</Button>
          </Link>
        </Card>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
            <p className="text-2xl font-bold text-amber-700 mb-3">৳{Math.round(item.price)}</p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1" 
                disabled={!item.inStock}
                onClick={() => handleAddToCart(item)}
              >
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button size="sm" variant="outline" className="text-red-500 border-red-500 hover:bg-red-50" onClick={() => handleRemoveFromWishlist(item.id)}>
                <Heart size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
      <div className="max-w-xl mx-auto">
        <Card title="Personal Information">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="text-amber-600" size={20} />
              <div>
                <p className="font-medium">Full Name</p>
                <p className="text-gray-600">{profile.name || 'John Doe'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-amber-600" size={20} />
              <div>
                <p className="font-medium">Email Address</p>
                <p className="text-gray-600">{profile.email || 'john.doe@example.com'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-amber-600" size={20} />
              <div>
                <p className="font-medium">Phone Number</p>
                <p className="text-gray-600">{profile.phone || '+880 1234-567890'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-amber-600 mt-1" size={20} />
              <div>
                <p className="font-medium">Delivery Address</p>
                <p className="text-gray-600">{profile.address || '1234 Elm Street, Apt 567, Dhaka, Bangladesh'}</p>
              </div>
            </div>
            <Button size="sm" className="flex items-center gap-2" onClick={() => setShowEditProfile(true)}>
              <Edit3 size={16} />
              Edit Profile
            </Button>
            {showEditProfile && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full border rounded px-3 py-2" 
                        value={editName} 
                        onChange={e => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full border rounded px-3 py-2 bg-gray-100" 
                        value={editEmail} 
                        disabled
                        title="Email cannot be changed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        className="w-full border rounded px-3 py-2" 
                        value={editPhone} 
                        onChange={e => setEditPhone(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Delivery Address</label>
                      <textarea 
                        className="w-full border rounded px-3 py-2" 
                        value={editAddress} 
                        onChange={e => setEditAddress(e.target.value)}
                        rows="3"
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        type="submit" 
                        size="sm" 
                        className="bg-amber-600 text-white"
                        disabled={loadingProfile}
                      >
                        {loadingProfile ? 'Saving...' : 'Save'}
                      </Button>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowEditProfile(false)}
                        disabled={loadingProfile}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card title="Account Settings">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates about your orders</p>
            </div>
            <Button size="sm" variant="outline">Configure</Button>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-gray-600">Change your password</p>
            </div>
            <Button size="sm" variant="outline">Change</Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-gray-600">Permanently delete your account</p>
            </div>
            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Support Center</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Contact Support">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="text-amber-600" size={20} />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-gray-600">+880 1234-567890</p>
                <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-amber-600" size={20} />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-gray-600">support@luxehome.com</p>
                <p className="text-sm text-gray-500">Response within 24 hours</p>
              </div>
            </div>
            <Button className="w-full">Contact Support</Button>
          </div>
        </Card>

        <Card title="Quick Help">
          <div className="space-y-3">
            <Link to="#" className="block p-3 rounded-md hover:bg-gray-50 border">
              <h4 className="font-medium">Order Status</h4>
              <p className="text-sm text-gray-600">Track your orders and deliveries</p>
            </Link>
            <Link to="#" className="block p-3 rounded-md hover:bg-gray-50 border">
              <h4 className="font-medium">Return Policy</h4>
              <p className="text-sm text-gray-600">Learn about our return process</p>
            </Link>
            <Link to="#" className="block p-3 rounded-md hover:bg-gray-50 border">
              <h4 className="font-medium">Payment Issues</h4>
              <p className="text-sm text-gray-600">Resolve payment problems</p>
            </Link>
            <Link to="#" className="block p-3 rounded-md hover:bg-gray-50 border">
              <h4 className="font-medium">Product Care</h4>
              <p className="text-sm text-gray-600">Furniture maintenance tips</p>
            </Link>
          </div>
        </Card>
      </div>

      <Card title="Frequently Asked Questions">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h4 className="font-medium mb-2">How long does delivery take?</h4>
            <p className="text-gray-600 text-sm">Standard delivery takes 5-7 business days. Express delivery is available for 2-3 business days.</p>
          </div>
          <div className="border-b pb-4">
            <h4 className="font-medium mb-2">What is your return policy?</h4>
            <p className="text-gray-600 text-sm">We offer a 30-day return policy for unused items in original condition. Return shipping is free for defective items.</p>
          </div>
          <div className="border-b pb-4">
            <h4 className="font-medium mb-2">Do you offer assembly service?</h4>
            <p className="text-gray-600 text-sm">Yes, we provide professional assembly service for an additional fee. This can be selected during checkout.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">How can I track my order?</h4>
            <p className="text-gray-600 text-sm">You can track your order in the 'My Orders' section or use the tracking number sent to your email.</p>
          </div>
        </div>
      </Card>
    </div>
  );

  // Navigation configuration for the user dashboard tabs
  const userNavigation = [
    {
      id: 'orders',
      name: 'My Orders',
      description: 'View your recent orders and tracking updates',
      icon: ShoppingBag,
      color: 'bg-amber-600'
    },
    {
      id: 'wishlist',
      name: 'Wishlist',
      description: 'Items you saved for later',
      icon: Heart,
      color: 'bg-pink-500'
    },
    {
      id: 'profile',
      name: 'Profile',
      description: 'Manage your account details',
      icon: User,
      color: 'bg-amber-700'
    },
    {
      id: 'support',
      name: 'Support',
      description: 'Get help and read FAQs',
      icon: HelpCircle,
      color: 'bg-sky-500'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'orders': return renderOrders();
      case 'wishlist': return renderWishlist();
      case 'profile': return renderProfile();
      case 'support': return renderSupport();
      default: return renderOrders();
    }
  };

  // If a ?tab=... query param is present, switch tabs accordingly
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['orders', 'wishlist', 'profile', 'support'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Only show welcome and nav tabs if not on a feature tab (like wishlist)
  const showHeader = activeTab === 'orders';

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {showHeader && (
            <>
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-lg p-6 mb-6 mt-2">
                <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, {user?.name || 'Customer'}!</h1>
                <p className="text-amber-100 text-sm">Manage your orders, wishlist, and account settings from your personal dashboard.</p>
              </div>
              {/* Navigation Tabs */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {userNavigation.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-amber-50 border-2 border-amber-300 shadow-md'
                            : 'bg-white border-2 border-gray-200 hover:border-amber-200 hover:shadow-lg hover:bg-amber-50'
                        }`}
                      >
                        <div className={`p-3 rounded-full ${tab.color} text-white mb-3 ${
                          activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'
                        } transition-transform duration-300 shadow-lg`}>
                          <Icon size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm text-center mb-1">{tab.name}</h3>
                        <p className="text-xs text-gray-600 text-center leading-relaxed">{tab.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-md p-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboardPage;