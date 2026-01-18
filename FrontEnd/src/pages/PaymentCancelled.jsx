import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center">
          <AlertCircle className="h-24 w-24 text-yellow-500" />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            You have cancelled the payment process. Your order is still pending.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150"
          >
            Complete Payment
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-150"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-150"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
