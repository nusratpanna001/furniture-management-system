import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/apiClient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Footer from '../components/layout/Footer';
import NavBar from '../components/layout/NavBar';

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async () => {
    console.log('Place order clicked, user:', user);
    
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        payment_method: paymentMethod,
        shipping_address: shippingAddress || user.address,
        customer_name: customerName || user.name,
        customer_phone: customerPhone || user.phone,
      };

      console.log('Sending order data:', orderData);
      const response = await api.orders.create(orderData);
      console.log('Order response:', response.data);

      if (response.data.success) {
        clearCart();
        navigate('/user-dashboard');
        alert('Order placed successfully!');
      }
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-6 md:px-10">
          <Card title="Checkout">
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-2">Shipping Information</h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    placeholder="Shipping Address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows="3"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Payment Method</h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    Cash on Delivery
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                    />
                    Online Payment
                  </label>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={handlePlaceOrder}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
              {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg text-center">
                  {error}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
