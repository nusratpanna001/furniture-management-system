import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { api } from '../lib/apiClient';
import { useToast } from '../contexts/ToastContext';

function WishlistPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { error, success } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
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
          inStock: item.product?.stock > 0 || false,
          category: item.product?.category?.name || 'Uncategorized',
        };
      });
      setWishlistItems(wishlistData);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
      error('Failed to load your wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (wishlistId) => {
    try {
      await api.wishlist.remove(wishlistId);
      setWishlistItems(wishlistItems.filter(item => item.id !== wishlistId));
      success('Item removed from wishlist');
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-amber-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">
          {wishlistItems.length === 0 
            ? 'Your wishlist is empty' 
            : `You have ${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} in your wishlist`}
        </p>
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">
            Start adding items you love to your wishlist!
          </p>
          <Link to="/products">
            <Button size="lg" className="mx-auto">
              Browse Products
            </Button>
          </Link>
        </Card>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group hover:shadow-xl transition-shadow">
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400';
                  }}
                />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold">
                      Out of Stock
                    </span>
                  </div>
                )}
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                  title="Remove from wishlist"
                >
                  <Heart size={20} className="text-red-500 fill-current" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <p className="text-xs text-amber-600 font-medium mb-1">{item.category}</p>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-2xl font-bold text-amber-700 mb-4">৳{Math.round(item.price)}</p>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 flex items-center justify-center gap-2" 
                    disabled={!item.inStock}
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart size={16} />
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-500 border-red-500 hover:bg-red-50"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
