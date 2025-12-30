import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import { useCart } from '../contexts/CartContext';

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [tranId, setTranId] = useState(null);

  useEffect(() => {
    // Get order ID and transaction ID from URL
    const orderIdParam = searchParams.get('order_id');
    const tranIdParam = searchParams.get('tran_id');
    
    setOrderId(orderIdParam);
    setTranId(tranIdParam);

    // Clear cart after successful payment
    clearCart();
  }, [searchParams, clearCart]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-6 md:px-10">
          <Card>
            <div className="text-center space-y-6 py-8">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={48} />
                </div>
              </div>

              {/* Success Message */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Payment Successful!
                </h1>
                <p className="text-gray-600">
                  Thank you for your purchase. Your order has been confirmed.
                </p>
              </div>

              {/* Order Details */}
              {orderId && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-semibold">#{orderId}</span>
                    </div>
                    {tranId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-sm">{tranId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className="text-green-600 font-semibold">Paid</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Information */}
              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <p className="text-sm text-blue-800">
                  <strong>What's next?</strong>
                  <br />
                  We've sent a confirmation email to your registered email address.
                  You can track your order status from your dashboard.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate('/user-dashboard')}
                  icon={<Package size={18} />}
                  className="flex items-center justify-center gap-2"
                >
                  View My Orders
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  icon={<Home size={18} />}
                  className="flex items-center justify-center gap-2"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PaymentSuccessPage;
