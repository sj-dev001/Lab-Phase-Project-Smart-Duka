import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference) {
      setStatus('failed');
      return;
    }

    api
      .get(`/payments/verify?reference=${reference}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('failed'));
  }, [searchParams]);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      {status === 'verifying' && (
        <div>
          <h1 className="text-3xl font-bold mb-4">Verifying Payment...</h1>
          <p className="text-gray-500">Please wait while we confirm your payment.</p>
        </div>
      )}

      {status === 'success' && (
        <div>
          <div className="text-6xl mb-4">&#10003;</div>
          <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h1>
          <p className="text-gray-500 mb-8">Your order has been confirmed.</p>
          <Link
            to="/dashboard"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            View My Orders
          </Link>
        </div>
      )}

      {status === 'failed' && (
        <div>
          <h1 className="text-3xl font-bold mb-4 text-red-600">Payment Failed</h1>
          <p className="text-gray-500 mb-8">
            Something went wrong with your payment. Please try again.
          </p>
          <Link
            to="/cart"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Return to Cart
          </Link>
        </div>
      )}
    </div>
  );
}
