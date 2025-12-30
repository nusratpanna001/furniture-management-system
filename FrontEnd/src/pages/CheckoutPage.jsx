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

    if (!shippingAddress && !user.address) {
      setError('Please provide a shipping address');
      return;
    }

    if (!customerName || !customerPhone) {
      setError('Please provide your name and phone number');
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
      console.log('Order response:', response);

      // Response is already unwrapped by interceptor, check if success exists at root level
      const orderResponse = response.data ? response : { data: response };
      
      if (orderResponse.data?.success || orderResponse.success) {
        const orderId = orderResponse.data?.data?.id || orderResponse.data?.id;
        console.log('Order created successfully with ID:', orderId);
        
        // If payment method is online, initiate SSLCommerz payment
        if (paymentMethod === 'online') {
          try {
            console.log('Initiating SSLCommerz payment for order:', orderId);
            const paymentResponse = await api.payment.initiate({
              order_id: orderId,
              customer_name: customerName || user.name,
              customer_email: user.email,
              customer_phone: customerPhone || user.phone,
              amount: total,
            });

            console.log('Payment initiation response:', paymentResponse);

            // Check both paymentResponse and paymentResponse.data for success
            const paymentData = paymentResponse.data ? paymentResponse.data : paymentResponse;
            
            if (paymentData.success && paymentData.gateway_url) {
              console.log('Redirecting to SSLCommerz gateway:', paymentData.gateway_url);
              // Redirect to SSLCommerz payment gateway
              window.location.href = paymentData.gateway_url;
              return; // Don't clear cart yet, wait for payment success
            } else {
              console.error('No gateway URL in response:', paymentData);
              setError('Failed to initiate online payment. Please try again.');
              setLoading(false);
              return;
            }
          } catch (paymentErr) {
            console.error('Payment initiation error:', paymentErr);
            console.error('Error details:', paymentErr.message, paymentErr.data);
            setError(paymentErr.message || 'Failed to initiate online payment. Please try again or select Cash on Delivery.');
            setLoading(false);
            return;
          }
        } else {
          // Cash on Delivery - clear cart and redirect
          clearCart();
          navigate('/user-dashboard');
          alert('Order placed successfully!');
        }
      }
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      if (paymentMethod !== 'online') {
        setLoading(false);
      }
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
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <textarea
                    placeholder="Shipping Address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows="3"
                    required
                  />
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-3">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>৳{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'FREE' : `৳${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>৳{total.toFixed(2)}</span>
                  </div>
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
                    Online Payment (SSLCommerz)
                  </label>
                </div>
                {paymentMethod === 'online' && (
                  <div className="mt-2 p-3 bg-blue-50 text-sm text-blue-800 rounded-lg">
                    You will be redirected to SSLCommerz payment gateway to complete your payment securely.
                  </div>
                )}
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
