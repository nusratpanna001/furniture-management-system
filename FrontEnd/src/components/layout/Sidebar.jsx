import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  ShoppingBag,
  BarChart3,
  X,
  User,
  Heart,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LOGO_URL } from '../../lib/constants';
import { cn } from '../../lib/utils';

const iconMap = {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  ShoppingBag,
  BarChart3,
  User,
  Heart,
  HelpCircle,
};

// ✅ Static routes accessible to everyone
const routes = [
  { path: '/dashboard', name: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/admin-categories', name: 'Categories', icon: 'Package' },
  { path: '/admin-products', name: 'Products', icon: 'Package' },
  { path: '/orders', name: 'Orders', icon: 'ShoppingCart' },
  { path: '/reports', name: 'Reports', icon: 'BarChart3' },
];

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useAuth();

  // Show a compact user-links section when on the user dashboard
  const isUserDashboard = location.pathname.startsWith('/user-dashboard');

  const userRoutes = [
    { path: '/user-dashboard?tab=orders', name: 'My Orders', icon: 'ShoppingCart' },
    { path: '/user-dashboard?tab=wishlist', name: 'Wishlist', icon: 'Heart' },
    { path: '/user-dashboard?tab=profile', name: 'Profile', icon: 'User' },
    { path: '/user-dashboard?tab=support', name: 'Support', icon: 'HelpCircle' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <Link to={isUserDashboard ? '/' : '/dashboard'} className="flex items-center gap-3" onClick={onClose}>
            <img src={LOGO_URL} alt="LuxeHome" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-amber-400">{isUserDashboard ? 'My Account' : 'LuxeHome'}</h1>
              <p className="text-xs text-gray-400">{isUserDashboard ? 'User Dashboard' : 'Furniture System'}</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {/* If we're on the user dashboard, only show user-specific links. Otherwise show admin routes. */}
          {!isUserDashboard && routes.map((route) => {
            const Icon = iconMap[route.icon];
            const isActive = location.pathname === route.path;

            return (
              <Link
                key={route.path}
                to={route.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  'hover:bg-gray-800',
                  isActive && 'bg-amber-700 hover:bg-amber-800'
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{route.name}</span>
              </Link>
            );
          })}

          {isUserDashboard && (
            <>
              <div className="mt-1 pt-1" />
              <div className="text-xs text-gray-400 uppercase px-4 mt-3 mb-1">Account</div>
              {userRoutes.map((r) => {
                const Icon = iconMap[r.icon];
                // treat the link as active when pathname is /user-dashboard and query matches
                const isActive = location.pathname === '/user-dashboard' && location.search.includes(r.path.split('=')[1]);
                return (
                  <Link
                    key={r.path}
                    to={r.path}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      'hover:bg-gray-800',
                      isActive && 'bg-amber-700 hover:bg-amber-800'
                    )}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{r.name}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Guest User'}</p>
              <p className="text-xs text-gray-400">General Access</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
