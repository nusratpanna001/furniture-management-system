import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { Heart, ShoppingCart, Star } from 'lucide-react';

// Dummy data (replace with API or context)
import { mockProducts } from '../lib/mockData';

function usdToBdt(usd) {
  const rate = 110;
  return Math.round(usd * rate);
}

function ProductDetailsPage() {
  const { id } = useParams();
  const product = useMemo(() => mockProducts.find(p => p.id === id), [id]);

  if (!product) {
    return <div className="p-10 text-center text-red-600">Product not found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-6 md:px-10">
        <div className="flex flex-col md:flex-row gap-10">
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-96 h-72 object-cover rounded-lg shadow-md"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              ))}
              <span className="ml-2 text-gray-600">{product.rating} ({product.reviews} reviews)</span>
            </div>
            <div className="mb-4">
              <span className="text-2xl font-bold text-amber-700">৳{usdToBdt(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through ml-3">৳{usdToBdt(product.originalPrice)}</span>
              )}
            </div>
            <div className="flex gap-3 mb-6">
              <Button size="lg" disabled={!product.inStock} className="bg-gradient-to-r from-amber-600 to-amber-700">
                <ShoppingCart size={18} className="mr-2" />
                {product.inStock ? 'Add to Cart' : 'Sold Out'}
              </Button>
              <Button size="lg" variant="outline">
                <Heart size={18} className="mr-2 text-pink-500" />
                Wishlist
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              <div>Category: {product.category}</div>
              {product.material && <div>Material: {product.material}</div>}
              {product.size && <div>Size: {product.size}</div>}
              <div>Stock: {product.inStock ? 'Available' : 'Out of Stock'}</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetailsPage;
