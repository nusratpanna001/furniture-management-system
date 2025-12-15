import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, User, HelpCircle, ShoppingBag, Star, Phone, Mail, MapPin, Edit3, Settings, ShoppingCart } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import { useLocation } from 'react-router-dom';

function UserDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [showEditProfile, setShowEditProfile] = useState(false);
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

  // Mock data for demonstration
  const userOrders = [
    {
      id: 'ORD-001',
      date: '2025-11-05',
      items: 3,
      total: 1299.97,
      status: 'delivered',
      products: ['Modern Sofa Set', 'Coffee Table', 'Accent Chair']
    },
    {
      id: 'ORD-002',
      date: '2025-11-08',
      items: 1,
      total: 599.99,
      status: 'processing',
      products: ['Dining Table']
    },
    {
      id: 'ORD-003',
      date: '2025-11-09',
      items: 2,
      total: 899.98,
      status: 'shipped',
      products: ['Bookshelf', 'Desk Chair']
    }
  ];

  const wishlistItems = [
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

  // Render the user's orders list
  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h2>
      <div className="space-y-4">
        {userOrders.map((order) => {
          const statusColor =
            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700';

          return (
            <Card key={order.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{order.id} <span className="text-sm text-gray-500">• {order.date}</span></p>
                <p className="text-sm text-gray-600 mt-1">{order.items} item(s) — {order.products.join(', ')}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-amber-700">৳{Math.round(order.total * 110)}</p>
                <div className={`inline-block mt-2 px-2 py-1 rounded-md text-sm font-medium ${statusColor}`}>{order.status}</div>
                <div className="mt-3">
                  <Link to={`/orders/${order.id}`}>
                    <Button size="sm">View</Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
            <p className="text-2xl font-bold text-amber-700 mb-3">৳{Math.round(item.price * 110)}</p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1" 
                disabled={!item.inStock}
              >
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button size="sm" variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                <Heart size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
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
                  <form onSubmit={e => {
                    e.preventDefault();
                    setProfile({ name: editName, email: editEmail, phone: editPhone, address: editAddress });
                    setShowEditProfile(false);
                  }}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={editName} onChange={e => setEditName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Email Address</label>
                      <input type="email" className="w-full border rounded px-3 py-2" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={editPhone} onChange={e => setEditPhone(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Delivery Address</label>
                      <input type="text" className="w-full border rounded px-3 py-2" value={editAddress} onChange={e => setEditAddress(e.target.value)} />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button type="submit" size="sm" className="bg-amber-600 text-white">Save</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setShowEditProfile(false)}>Cancel</Button>
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