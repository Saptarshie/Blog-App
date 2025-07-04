// src/app/creator-dashboard/earnings/page.js
'use client';

import { useState, useEffect } from 'react';
import { updateCreatorSettings, getCreatorEarnings } from '@/action/userAction';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { isValidWalletAddress } from '@/utils/functions/isValidWallet';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Earnings() {
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [subscriptionPrice, setSubscriptionPrice] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletError, setWalletError] = useState('');

  // Fetch earnings data
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCreatorEarnings();
        if (data.success) {
          setEarningsData(data);
          setWalletAddress(data.walletAddress || '');
          setSubscriptionPrice(data.subscriptionPrice || 0);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to load earnings data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setWalletError('');
    
    // Validate wallet address
    if (walletAddress && !isValidWalletAddress(walletAddress)) {
      setWalletError('Invalid wallet address format');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const result = await updateCreatorSettings({
        walletAddress,
        subscriptionPrice: parseFloat(subscriptionPrice)
      });
      
      if (result.success) {
        setIsEditing(false);
        // Update the local state with the new values
        setEarningsData(prev => ({
          ...prev,
          walletAddress,
          subscriptionPrice: parseFloat(subscriptionPrice)
        }));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to update settings');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chart preparation
  const prepareChartData = () => {
    if (!earningsData?.recentEarnings) return null;
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Group earnings by month
    const monthlyData = earningsData.recentEarnings.reduce((acc, { date, amount }) => {
      const monthDate = new Date(date);
      const monthKey = `${monthNames[monthDate.getMonth()]} ${monthDate.getFullYear()}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      
      acc[monthKey] += amount;
      return acc;
    }, {});
    
    // Sort months chronologically
    const sortedLabels = Object.keys(monthlyData).sort((a, b) => {
      const [aMonth, aYear] = a.split(' ');
      const [bMonth, bYear] = b.split(' ');
      
      if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
      return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth);
    });
    
    return {
      labels: sortedLabels,
      datasets: [
        {
          label: 'Earnings ($)',
          data: sortedLabels.map(label => monthlyData[label]),
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.5)',
          tension: 0.4,
        }
      ]
    };
  };

  const chartData = earningsData ? prepareChartData() : null;
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Earnings Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Earnings"
              value={`$${earningsData.totalEarnings.toFixed(2)}`}
              icon="💰"
            />
            <StatsCard
              title="Subscribers"
              value={earningsData.subscriberCount || 0}
              icon="👥"
            />
            <StatsCard
              title="Monthly Revenue"
              value={`$${((earningsData.subscriberCount || 0) * (earningsData.subscriptionPrice || 0)).toFixed(2)}`}
              icon="📈"
            />
          </div>
          
          {/* Settings Panel */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">Creator Settings</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Edit Settings
                </button>
              ) : null}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Wallet Address
                  </label>
                  <input
                    id="walletAddress"
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your blockchain wallet address"
                  />
                  {walletError && <p className="mt-1 text-sm text-red-600">{walletError}</p>}
                </div>
                
                <div>
                  <label htmlFor="subscriptionPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Subscription Price ($ per month)
                  </label>
                  <input
                    id="subscriptionPrice"
                    type="number"
                    min="0"
                    max="0.99"
                    step="0.0001"
                    value={subscriptionPrice}
                    onChange={(e) => setSubscriptionPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setWalletAddress(earningsData.walletAddress || '');
                      setSubscriptionPrice(earningsData.subscriptionPrice || 0);
                      setWalletError('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Wallet Address:</span>
                  <p className="text-gray-800 font-mono text-sm break-all">{walletAddress || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Subscription Price:</span>
                  <p className="text-gray-800">${Number(subscriptionPrice.toFixed(4))} sepolia-eth / life </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Earnings Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Earnings (Last 3 Months)</h2>
            {chartData ? (
              chartData.labels.length > 0 ? (
                <div className="h-64">
                  <Line 
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (value) => `$${value}`
                          }
                        }
                      },
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (context) => `$${context.raw.toFixed(2)}`
                          }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center h-64 text-gray-500">
                  No earnings data available for the last 3 months
                </div>
                              )
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-500">
                <p>No earnings data available</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Missing StatsCard component declaration */}
    </div>
  );
}

// Add the missing StatsCard component
function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
