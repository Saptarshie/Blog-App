import { fetchBlogById, getRecommendedBlogs } from "@/action/blogAction";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import BlogCard from "@/components/blog-feed/blog-card";
import { Suspense } from "react";

// Similar Blogs Component
export async function SimilarBlogs({ blogId }) {
  try {
    const similarBlogs = await getRecommendedBlogs([blogId], 4, 10); // Get 4 recommendations from a pool of 10
    
    if (!similarBlogs || similarBlogs.length === 0) {
      return null; // Don't render anything if no similar blogs
    }
    
    return (
      <div className="mt-16 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Blogs You Might Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {similarBlogs.map((similarBlog) => (
            <BlogCard key={similarBlog._id} blog={similarBlog} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching similar blogs:", error);
    return null; // Don't render anything if there's an error
  }
}

// Loading component for SimilarBlogs
export function SimilarBlogsLoading() {
  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Blogs You Might Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-5">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
