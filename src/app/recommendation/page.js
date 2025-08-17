import { getRecommendedBlogs } from "@/action/blogAction";
import BlogCard from "@/components/blog-feed/blog-card";
import { Suspense } from "react";

// Loading component for Suspense fallback
function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
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

// Main component for displaying recommendations
async function RecommendationsList({ blogIds }) {
  // Get recommended blogs based on the provided blog IDs
  const recommendedBlogs = await getRecommendedBlogs(blogIds, 2,5); // Get 2 recommendations
  
  if (!recommendedBlogs || recommendedBlogs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <h2 className="text-xl font-medium text-gray-900 mb-2">No recommendations found</h2>
        <p className="text-gray-500">Try reading more blogs to get personalized recommendations</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendedBlogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
}

// Main page component
export default async function Recommendation({ searchParams }) {
  // Await searchParams before using its properties
  const params = await searchParams;
  // Get blog IDs from URL parameters
  const blogIds = params?.blogIds?.split(',') || [];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommended For You</h1>
          <p className="text-gray-600">Based on your reading history and preferences</p>
        </div>
        
        <Suspense fallback={<LoadingSkeleton />}>
          <RecommendationsList blogIds={blogIds} />
        </Suspense>
      </div>
    </div>
  );
}
