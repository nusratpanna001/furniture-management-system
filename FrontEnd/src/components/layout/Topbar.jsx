import { useState } from 'react';
import { Menu, Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-end py-3 max-w-7xl mx-auto w-full">
        {/* Logo removed as requested */}
        {/* Navigation links removed as requested */}
        <div className="flex items-center justify-end space-x-2 ml-auto">
          <Link to="/my-cart">
            <button className="text-xs flex items-center p-2 bg-amber-600 text-white hover:bg-amber-700 rounded-lg" aria-label="My Cart">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-.68L21 13M7 13V6h13" />
              </svg>
            </button>
          </Link>
          {!user ? (
            <Link to="/login" className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium">Login</Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white">
                  {user.name[0].toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-20">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
