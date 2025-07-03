'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { subscribeToCreator, getSubscriptionPrice } from '@/action/subscriptionAction';
import { useRouter } from 'next/navigation';

export default function SubscribePage() {
  const searchParams = useSearchParams();
  const author = searchParams.get('author');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [creatorInfo, setCreatorInfo] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCreatorInfo = async () => {
      const response = await getSubscriptionPrice(author);
      if (response?.success) {
        try {
          setCreatorInfo({
            username: author,
            subscriberCount: response?.subscriberCount || '...',
            subscriptionPrice: response.price,
            walletAddress: response?.walletAddress || '...',
          });
        } catch (err) {
          setError('Unable to load creator information');
        }
      } else {
        setError(response.message);
      }
    };

    if (author) {
      fetchCreatorInfo();
    }
  }, [author]);

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Pass transaction hash to server action if subscription price > 0
      const response = await subscribeToCreator(
        author, 
        creatorInfo?.subscriptionPrice > 0 ? transactionHash : undefined
      );
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/profile/${author}`);
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center p-8 rounded-lg bg-white shadow-lg">
          <h1 className="text-2xl font-bold text-red-600">Invalid Request</h1>
          <p className="mt-4 text-gray-600">No creator specified in the URL.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="h-24 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
        
        {/* Content */}
        <div className="px-8 py-10 -mt-10 relative">
          {/* Profile Picture Placeholder */}
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full border-4 border-white flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {author ? author[0].toUpperCase() : '?'}
            </span>
          </div>
          
          <div className="text-center mt-4">
            <h1 className="text-2xl font-bold text-gray-800">Subscribe to {author}</h1>
            <p className="text-gray-600 mt-2">
              Get exclusive access to premium content
            </p>
          </div>
          
          {/* Subscription Benefits */}
          <div className="mt-8 space-y-4">
            {/* Benefits content remains the same */}
            {/* ... */}
          </div>
          
          {/* Price Display */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-baseline">
              <span className="text-3xl font-extrabold text-gray-900">
                {creatorInfo?.subscriptionPrice || 0}
              </span>
              <span className="ml-1 text-xl font-semibold text-gray-500"> <i>sepolia-ETH / life</i></span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Join {creatorInfo?.subscriberCount || '...'} other subscribers
            </p>
          </div>
          
          {/* Wallet Address Display - NEW ADDITION */}
          {creatorInfo?.subscriptionPrice > 0 && creatorInfo?.walletAddress && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Payment Information</h3>
              <div className="mt-2">
                <label className="block text-xs text-gray-500 mb-1">Send payment to this wallet address:</label>
                <div className="flex items-center">
                  <input 
                    type="text"
                    readOnly
                    value={creatorInfo.walletAddress}
                    className="w-full text-xs bg-gray-100 p-2 rounded border border-gray-300"
                  />
                  <button 
                    onClick={() => navigator.clipboard.writeText(creatorInfo.walletAddress)}
                    className="ml-2 p-2 bg-gray-200 rounded hover:bg-gray-300"
                    title="Copy address"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Transaction Hash Input - NEW ADDITION */}
              <div className="mt-3">
                <label className="block text-xs text-gray-500 mb-1">Enter transaction hash after payment:</label>
                <input
                  type="text"
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  placeholder="0x..."
                  className="w-full text-xs p-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required={creatorInfo?.subscriptionPrice > 0}
                />
              </div>
            </div>
          )}
          
          {/* Status Messages */}
          {error && (
            <div className="mt-6 p-3 rounded-md bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mt-6 p-3 rounded-md bg-green-50 text-green-700 text-sm">
              Subscription successful! Redirecting...
            </div>
          )}
          
          {/* Action Button */}
          <div className="mt-8">
            <button
              onClick={handleSubscribe}
              disabled={loading || success || (creatorInfo?.subscriptionPrice > 0 && !transactionHash)}
              className={`w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white 
                ${loading || success || (creatorInfo?.subscriptionPrice > 0 && !transactionHash) ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'} 
                transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : success ? 'Subscribed!' : 'Subscribe Now'}
            </button>
          </div>
          
          {/* Cancel Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Cancel and go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
