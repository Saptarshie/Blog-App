import { fetchBlogById,getRecommendedBlogs } from "@/action/blogAction";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import BlogCard from "@/components/blog-feed/blog-card";
import {SimilarBlogs,SimilarBlogsLoading} from "@/components/blog-feed/similar-blogs"
import { Suspense } from "react";
export default async function BlogPage({ params }) {
  // const res = await fetchBlogById(params["blog-id"]);
   const { "blog-id": blogId } = await params; // ✅ unwrap the Promise
  const res = await fetchBlogById(blogId);
  console.log("res is: ", res);

  // Handle unauthorized access to premium content
  if (res.status === 403) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-8 rounded-xl shadow-md text-center w-full max-w-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Premium Content</h1>
          <p className="text-gray-600 mb-6">This article is exclusive to subscribers. Subscribe now to access this and other premium content.</p>
          <Link 
            href={`/subscribe?author=${encodeURIComponent(res.author)}`}
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md"
          >
            Subscribe Now
          </Link>
        </div>
      </div>
    );
  }

  // Handle blog not found or other errors
  if (!res.success || !res.blog) {
    return notFound();
  }

  const { blog } = res;
  
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Blog Header */}
      <header className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="mr-4">{formatDistanceToNow(new Date(blog.date), { addSuffix: true })}</span>
          {blog.isPremium && (
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-1 rounded text-xs font-medium">
              Premium
            </span>
          )}
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {blog.title}
        </h1>
        
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {blog.description}
        </p>
        
        <div className="flex items-center mb-8">
          <div className="mr-4 bg-indigo-100 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">{blog.author}</p>
          </div>
        </div>
      </header>
      
      {/* Featured Image */}
      {blog?.image?.imagePath && (
        <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
          {/* <img 
            src={blog.image}
            alt={blog.title} 
            className="w-full h-[400px] object-cover"
          /> */}
          <Image 
            src={blog.image.imagePath}
            alt={blog.title} 
            height={400}
            width={800}
            loading="lazy"
            className="w-full h-[400px] object-cover"
          />
        </div>
      )}
      
      {/* Blog Content */}
      <div 
        className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-img:rounded-lg prose-a:text-indigo-600"
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />
      
      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h2 className="text-sm font-medium text-gray-600 mb-3">Related Topics</h2>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <Link 
                key={index}
                href={`/search?q=${tag}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* Similar Blogs Section */}
      <Suspense fallback={<SimilarBlogsLoading />}>
        <SimilarBlogs blogId={blogId} />
      </Suspense>
    </article>
  );
}
