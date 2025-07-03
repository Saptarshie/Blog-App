"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { unsubscribeFromCreator } from "@/action/subscriptionAction";
import { fetchUserAction } from "@/action";
import Link from 'next/link';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [unsubscribing, setUnsubscribing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = useSelector((state) => state.userslice);

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await fetchUserAction();
        if (response.success) {
          setUserData(response.user);
          setSubscriptions(response.user.subscription || []);
        } else {
          setError('Failed to load profile data');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getUserData();
  }, []);

  const handleUnsubscribe = async (creatorId) => {
    try {
      setUnsubscribing(creatorId);
      const response = await unsubscribeFromCreator(creatorId);
      
      if (response.success) {
        setSubscriptions(subscriptions.filter(sub => sub.creator !== creatorId));
        setSuccess(`Successfully unsubscribed`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to unsubscribe');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setUnsubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
          <div className="relative px-6 py-10 sm:px-10">
            <div className="absolute -top-16 left-6 sm:left-10">
              <div className="h-32 w-32 rounded-full bg-white p-2 shadow-lg">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {userData?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-16 sm:mt-0 sm:ml-32">
              <h1 className="text-3xl font-bold text-gray-800">{userData?.username || 'User'}</h1>
              <p className="text-gray-600">{userData?.email || 'email@example.com'}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Information Card */}
          <div className="col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="text-gray-800">{userData?.username || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-800">{userData?.email || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Wallet Address</p>
                  <p className="text-gray-800 truncate">{userData?.walletAddress || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Creator Status</p>
                  <p className="text-gray-800">
                    {userData?.subscriberCount >= 0 ? 'Creator' : 'Regular User'}
                  </p>
                </div>
                <div className="pt-4">
                  <Link 
                    href="/settings" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Edit Profile Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Subscriptions Card */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Subscriptions</h2>
              
              {subscriptions && subscriptions.length > 0 ? (
                <div className="space-y-4">
                  {subscriptions.map((sub, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-800">{sub.creatorName || 'Creator'}</h3>
                          <p className="text-sm text-gray-500">
                            Subscribed since {new Date(sub.subscriptionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnsubscribe(sub.creator)}
                          disabled={unsubscribing === sub.creator}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            unsubscribing === sub.creator
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {unsubscribing === sub.creator ? 'Unsubscribing...' : 'Unsubscribe'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No subscriptions</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You aren't subscribed to any creators yet.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Explore Creators
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
