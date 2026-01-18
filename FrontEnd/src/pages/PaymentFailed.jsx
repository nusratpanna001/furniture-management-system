import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reason = searchParams.get('reason');

  const getErrorMessage = () => {
    switch (reason) {
      case 'payment_failed':
        return 'Your payment could not be processed. Please try again.';
      case 'invalid_card':
        return 'Invalid card details. Please check your card information.';
      case 'insufficient_funds':
        return 'Insufficient funds. Please use a different payment method.';
      default:
        return 'Payment failed. Please try again or contact support.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center">
          <XCircle className="h-24 w-24 text-red-500" />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {getErrorMessage()}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150"
          >
            Try Again
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
