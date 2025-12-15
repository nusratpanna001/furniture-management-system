import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Footer from '../components/layout/Footer';
import NavBar from '../components/layout/NavBar';

function CheckoutPage() {
  const { cartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paid, setPaid] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const handlePayment = () => {
    setPaid(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-6 md:px-10">
          <Card title="Checkout">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-2">Order Summary</h2>
                <div className="space-y-2">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>৳{Math.round(item.price * 110 * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>৳{Math.round(subtotal * 110)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>৳{Math.round(tax * 110)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `৳${Math.round(shipping * 110)}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-amber-700">৳{Math.round(total * 110)}</span>
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
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    Credit/Debit Card
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="bkash"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                    />
                    bKash/Nagad
                  </label>
                </div>
              </div>
              <Button className="w-full" onClick={handlePayment}>
                Pay Now
              </Button>
              {paid && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
                  Payment successful! Thank you for your order.
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
