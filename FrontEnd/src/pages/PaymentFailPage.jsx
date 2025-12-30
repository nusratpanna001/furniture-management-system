import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft, Home, CreditCard } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';

function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tranId, setTranId] = useState(null);
  const [status, setStatus] = useState('failed');

  useEffect(() => {
    // Get transaction ID and status from URL
    const tranIdParam = searchParams.get('tran_id');
    const statusParam = searchParams.get('status');
    
    setTranId(tranIdParam);
    setStatus(statusParam || 'failed');
  }, [searchParams]);

  const getMessage = () => {
    if (status === 'cancelled') {
      return {
        title: 'Payment Cancelled',
        message: 'You have cancelled the payment process.',
        color: 'orange',
      };
    }
    return {
      title: 'Payment Failed',
      message: 'Unfortunately, your payment could not be processed.',
      color: 'red',
    };
  };

  const messageData = getMessage();

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-6 md:px-10">
          <Card>
            <div className="text-center space-y-6 py-8">
              {/* Fail Icon */}
              <div className="flex justify-center">
                <div className={`w-20 h-20 bg-${messageData.color}-100 rounded-full flex items-center justify-center`}>
                  <XCircle className={`text-${messageData.color}-600`} size={48} />
                </div>
              </div>

              {/* Fail Message */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {messageData.title}
                </h1>
                <p className="text-gray-600">
                  {messageData.message}
                </p>
              </div>

              {/* Transaction Details */}
              {tranId && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-sm">{tranId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`text-${messageData.color}-600 font-semibold capitalize`}>
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Information */}
              <div className="bg-amber-50 p-4 rounded-lg text-left">
                <p className="text-sm text-amber-800">
                  <strong>What can you do?</strong>
                  <br />
                  • Try again with a different payment method
                  <br />
                  • Check your card details and ensure sufficient balance
                  <br />
                  • Contact your bank if the issue persists
                  <br />
                  • Choose Cash on Delivery as an alternative
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate('/checkout')}
                  icon={<CreditCard size={18} />}
                  className="flex items-center justify-center gap-2"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/cart')}
                  icon={<ArrowLeft size={18} />}
                  className="flex items-center justify-center gap-2"
                >
                  Back to Cart
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

export default PaymentFailPage;
