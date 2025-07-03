// src/app/search/page.js
"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { searchBlogs } from '@/action/blogAction';
import BlogCard from '@/components/blog-feed/blog-card';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (query) {
        setLoading(true);
        const response = await searchBlogs(query);
        console.log("response is : ",response);
        if (response.success && response.blogs) {
          setResults(response.blogs);
        }
        setLoading(false);
      }
    }
    fetchResults();
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for: {query}
      </h1>
      
      {loading ? (
        <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}
