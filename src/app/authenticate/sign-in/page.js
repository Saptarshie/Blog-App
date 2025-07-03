"use client";
import { useState } from 'react';
import { SignInAction,fetchUserAction } from '@/action';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {useDispatch} from 'react-redux';
import {setUser} from '@/store/slices/user-slice';
// async function SetUserSlice(dispatch){
//   const response = await fetchUserAction();
//   console.log("SetUserSlice response if : ",response);
//   if(response.success){
//     dispatch(setUser(response.user));
//   }
//   else{
//     console.log(response);
//     // router.push('/authenticate/sign-in');
//   }
// }
export default function SignIn() {
  const dispatch = useDispatch();
     const router = useRouter();
      const [formData, setFormData] = useState({
        userid: '',
        password: ''
      });
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
          const response = await SignInAction(formData);
          console.log("Response is : ",response);
          if (response.success) {
            // SetUserSlice(dispatch);
            dispatch(setUser(response.user));
            console.log("Hello")
            router.push('/');
          } else {
            setError(response.message);
          }
        } catch (err) {
          setError('An unexpected error occurred. Please try again.');
        } finally {
          setLoading(false);
        }
      };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
          <p className="text-gray-600 mt-2">Welcome to our community of bloggers</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username/Email : 
            </label>
            <input
              id="userid"
              name="userid"
              type="text"
              required
              value={formData.userid}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your username or email..."
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password : 
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Create a secure password"
              minLength="8"
            />
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center mt-6 text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/authenticate/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}