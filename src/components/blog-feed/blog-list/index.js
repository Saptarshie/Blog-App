"use client";
import { useState, useEffect, useRef } from "react";
import BlogCard from "../blog-card";
import { fetchBlogs } from "@/action/blogAction";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const lastBlogRef = useRef(null);

  // Load initial blogs
  useEffect(() => {
    loadMoreBlogs();
  }, []);

  // Set up IntersectionObserver for infinite scroll
  useEffect(() => {
    if (loading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreBlogs();
      }
    }, { threshold: 0.5 });
    
    if (lastBlogRef.current) {
      observerRef.current.observe(lastBlogRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, blogs]);

  const loadMoreBlogs = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetchBlogs(page, 10); // Fetch 10 blogs per page
      
      if (response.success) {
        if (response.blogs.length === 0) {
          setHasMore(false);
        } else {
          setBlogs(prevBlogs => [...prevBlogs, ...response.blogs]);
          setPage(prevPage => prevPage + 1);
        }
      } else {
        console.error("Failed to fetch blogs:", response.message);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading blogs:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => {
          if (index === blogs.length - 1) {
            return (
              <div key={`${blog._id}-${index}`} ref={lastBlogRef}>
                <BlogCard blog={blog} />
              </div>
            );
          }
          return <BlogCard key={`${blog._id}-${index}`} blog={blog} />;
        })}
      </div>
      
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {!hasMore && blogs.length > 0 && (
        <p className="text-center text-gray-500 my-8">No more blogs to load</p>
      )}
      
      {!hasMore && blogs.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900">No blogs found</h3>
          <p className="text-gray-500 mt-2">Be the first to create a blog!</p>
        </div>
      )}
    </div>
  );
}