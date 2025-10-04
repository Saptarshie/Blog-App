'use client';
// import { fetchUserAction } from "@/action"
// export default async function CreatorDashboard() {
//   const res = await fetchUserAction();
//   console.log("User is : ",res);
//     return (
//     <div>
//       <h1>Creator Dashboard
//       </h1>
//     </div>
//     )
//   }
  


import { useState, useEffect,useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchBlogs } from '@/action/blogAction';
import CreatorBlogCard from '@/components/cards/CreatorBlogCard';
import Loading from '../loading';
// import { getServerSideProps } from './get-server-side-prop';
// You'll need to install these if you don't have them:
// npm install @heroicons/react

import { 
  BookOpenIcon, 
  PlusCircleIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  UserCircleIcon,
  CogIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon
} from "@heroicons/react/24/outline";
// import {MenuIcon} from "@components/icons"
export default function CreatorDashboard({ initialData }) {
  const [user, setUser] = useState(initialData?.user || {});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  const [BlogDetails, setBlogDetails] = useState([]);
  const [BlogsLoading, setBlogsLoading] = useState(true);
  const [error, setError] = useState(null);
  // For client-side rendering
  useEffect(() => {
    const fetchData = async () => {
      try {
        // If we don't have initialData (like when navigating client-side)
        if (!initialData) {
          const module = await import('@/action');
          const { fetchUserAction } = module;
          const res = await fetchUserAction();
          if (res.success) {
            setUser(res.user);
            console.log("Fetched user data:", res.user);
            setBlogsLoading(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchData();
  }, [initialData]);
  useEffect(() => {
    const getBlogDetails = async () => {
      console.log("getBlogDetails called ...");
      // qwerty
      if (user.blogs && user.blogs.length > 0) {
        try {
          const result = await fetchBlogs(1,3,{ ids: user.blogs.slice(-3) });
          console.log("fetchBlogs result:", result);
          if (result.success) {
            setBlogDetails(result.blogs);
            setError(null);
          } else {
            // Set an error message if the fetch fails
            setError(result.message || 'Could not load blogs.');
          }
        } catch (err) {
          setError('An unexpected error occurred.');
          console.error("Error fetching result: ",err);
        } finally {
          setBlogsLoading(false);
        }
      }
    };
    getBlogDetails();
  }, [user]);

    const refreshBlogs = useCallback(() => {
    setBlogsLoading(true);
    // Reset blog data instead of mutating initialData
    setBlogData({});
    // Refetch blogs
    fetchBlogs(filter={ ids: user.blogs }).then(result => {
      if (result.success) {
        setBlogDetails(result.blogs);
      }
      else {
        setError(result.message || 'Could not load blogs.');
      }
      setBlogsLoading(false);
    }).catch(err => {
      setError('An unexpected error occurred.');
      console.error(err);
      setBlogsLoading(false);
    });
  }, [user]);
  
  return (
    <>
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                      fixed top-14 bottom-0 left-0 z-30 w-64 bg-gradient-to-br from-indigo-800 to-purple-900 
                      transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto`}>
        <div className="flex items-center justify-between h-16 px-6 bg-indigo-900">
          <div className="flex items-center">
            <span className="text-white text-xl font-semibold">Creator Studio</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-300 hover:text-white"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* User info */}
        <div className="px-6 py-4 border-b border-indigo-700">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 rounded-full p-2">
              <UserCircleIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-white font-medium">{user.username || "Username"}</div>
              <div className="text-indigo-300 text-sm">{user.email || "email@example.com"}</div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="px-3 py-4 space-y-2">
          <Link href="/creator-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center px-3 py-2 text-white rounded-md transition-colors 
                           ${activeTab === 'dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'}`}>
            <ChartBarIcon className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </Link>
          
          <Link href="/creator-dashboard/blogs"
                onClick={() => setActiveTab('blogs')}
                className={`flex items-center px-3 py-2 text-white rounded-md transition-colors 
                           ${activeTab === 'blogs' ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'}`}>
            <BookOpenIcon className="h-5 w-5 mr-3" />
            <span>My Blogs</span>
          </Link>
          
          <Link href="/creator-dashboard/create"
                onClick={() => setActiveTab('create')}
                className={`flex items-center px-3 py-2 text-white rounded-md transition-colors 
                           ${activeTab === 'create' ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'}`}>
            <PlusCircleIcon className="h-5 w-5 mr-3" />
            <span>Create New Blog</span>
          </Link>
          
          <Link href="/creator-dashboard/earnings"
                onClick={() => setActiveTab('earnings')}
                className={`flex items-center px-3 py-2 text-white rounded-md transition-colors 
                           ${activeTab === 'earnings' ? 'bg-indigo-700' : 'hover:bg-indigo-700/50'}`}>
            <CurrencyDollarIcon className="h-5 w-5 mr-3" />
            <span>My Earnings</span>
          </Link>
          
          <div className="pt-4 mt-4 border-t border-indigo-700">
            <Link href="/settings"
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center px-3 py-2 text-white rounded-md transition-colors hover:bg-indigo-700/50">
              <CogIcon className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        {/* Top header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome, {user.username || "Creator"}!
            </h1>
            
            <div>
              {/* User profile picture or avatar could go here */}
            </div>
          </div>
        </header>
        
        {/* Dashboard content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Stats Card: Blogs */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
              <div className="p-3 rounded-full bg-blue-100 bg-opacity-80 mr-4">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                <p className="text-3xl font-bold text-gray-900">{user.blogs?.length || 0}</p>
              </div>
            </div>
            
            {/* Stats Card: Subscribers */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
              <div className="p-3 rounded-full bg-green-100 bg-opacity-80 mr-4">
                <UserCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Subscribers</p>
                <p className="text-3xl font-bold text-gray-900">{user?.subscriberCount}</p>
              </div>
            </div>
            
            {/* Stats Card: Earnings (placeholder) */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
              <div className="p-3 rounded-full bg-purple-100 bg-opacity-80 mr-4">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Earnings</p>
                <p className="text-3xl font-bold text-gray-900">${user?.amount || 0}</p> sepolia-ETH 
              </div>
            </div>
          </div>
          
          {/* Recent blog posts */}
          <div className="bg-white rounded-lg shadow-sm my-6">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent Blog Posts</h2>
              <Link href="/creator-dashboard/blogs" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View all
              </Link>
            </div>
              {user.blogs && user.blogs.length > 0 ? (
                BlogsLoading ? (<div><Loading/></div>) : (<div className="divide-y divide-gray-200 ">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                  {BlogDetails.slice(0, 5).map((blog) => (
                    <CreatorBlogCard key={blog.id} blog={blog} refreshBlogs={refreshBlogs} />
                  ))}
                  </div>
                </div>)
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <PlusCircleIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No blogs yet</h3>
                  <p className="text-gray-500 mb-6">Start creating content to grow your audience</p>
                  <button onClick={() => router.push('/creator-dashboard/create')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Create New Blog
                  </button>
                </div>
              )}
            </div>
        </main>
      </div>
    </div>
    </>
  );
}

