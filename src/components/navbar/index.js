"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LogoutButton from '../buttons/logout-button';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/user-slice';
import { fetchUserAction } from '@/action';

export default function Navbar() {
  const dispatch = useDispatch()
  const router = useRouter();
  const user = useSelector((state) => state.userslice);
  
  // States
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Refs for click outside detection
  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetchUserAction()
      if (response.success) {
        dispatch(setUser(response.user))
      }
    }
    fetchUserData()
  }, [dispatch]);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Click outside detection for both mobile and desktop menus
  useEffect(() => {
    function handleClickOutside(event) {
      // Skip if menu is already closed
      if (!isMenuOpen) return;
      
      // Check if click was on the menu toggle button
      const isMenuButton = mobileMenuButtonRef.current && 
                          mobileMenuButtonRef.current.contains(event.target);
      
      // Check if click was inside any menu
      const isInsideDesktopMenu = desktopMenuRef.current && 
                                 desktopMenuRef.current.contains(event.target);
      const isInsideMobileMenu = mobileMenuRef.current && 
                                mobileMenuRef.current.contains(event.target);
      
      // Only close if clicked outside everything and not on the toggle button
      if (!isMenuButton && !isInsideDesktopMenu && !isInsideMobileMenu) {
        setIsMenuOpen(false);
      }
    }
    
    // Add listener only when menu is open
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Toggle menu with proper event handling
  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };
  const resetNavStates = () => {
  setIsMenuOpen(false);
  setSearchQuery('');
  // Add any other state resets here
};

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 p-2 ${
      isScrolled ? "bg-blue-50/70 shadow-md backdrop-blur-sm" : "bg-white/50"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" onClick={resetNavStates} className="flex items-center">
              <span className="text-xl font-bold text-blue-600">BlogApp</span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 mx-10">
            <form onSubmit={handleSearch} className="w-full max-w-xl relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link onClick={resetNavStates} href={user.subscriberCount<0 ? "/become-creator" : "/creator-dashboard"} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-full font-medium transition-all">
              {user.subscriberCount<0 ? "Become a Creator" : "Go to Dashboard!"}
            </Link>
            
            <div className="relative">
              <button 
                onClick={toggleMenu}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {isMenuOpen && (
                <div ref={desktopMenuRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link href="/profile" onClick={resetNavStates} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                  <Link href="/history" onClick={resetNavStates} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">History</Link>
                  <div className="border-t border-gray-100"></div>
                  <LogoutButton onClick={resetNavStates} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" />
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              ref={mobileMenuButtonRef}
              onClick={toggleMenu}
              aria-label="Toggle mobile menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg mt-2 mx-2">
          <div ref={mobileMenuRef} className="px-2 pt-2 pb-3 space-y-1">
            {/* Search Bar - Mobile */}
            <form onSubmit={handleSearch} className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
            
            <Link 
              href={user.subscriberCount<0 ? "/become-creator" : "/creator-dashboard"} 
              className="block text-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-full font-medium transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              {user.subscriberCount<0 ? "Become a Creator" : "Go to Dashboard!"}
            </Link>
            <Link 
              href="/profile" 
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <Link 
              href="/history" 
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              History
            </Link>
            <div className="px-4 py-2">
              <LogoutButton 
                className="w-full text-left text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md" 
                onClick={() => setIsMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
