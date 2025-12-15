import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { LogOut, ShoppingCart } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useState } from "react";

export default function NavBar() {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
      logout();
      navigate('/login');
    };

    return (
        <header className="px-4 md:px-8 fixed top-0 w-full z-50 bg-white shadow-md">
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
              <Link to="/my-cart" className="relative">
                <Button size="sm" className="text-xs flex items-center p-2 bg-amber-600 text-white hover:bg-amber-700" aria-label="My Cart">
                  <ShoppingCart size={16} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[20px] text-center">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </Link>
              {/* <Link to="/login">
                <Button size="sm" className="text-xs px-3 py-1">Login</Button>
              </Link> */}
              {!user ? (
            <Link
              to="/login"
              className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/user-dashboard"
                className="flex items-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100 rounded-lg text-amber-700 font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="hidden md:inline">User</span>
              </Link>
              <Button
                size="sm"
                className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-1 hover:bg-amber-700"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          )}
            </div>
          </div>
        </div>
      </header>
    );
};