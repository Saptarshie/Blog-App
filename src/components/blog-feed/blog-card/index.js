import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, UserCircleIcon, TagIcon } from '@heroicons/react/24/outline';

export default function BlogCard({ blog }) {
  if (!blog) return null;
  
  return (
    <Link href={`/blogs/${blog._id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        {/* Image with aspect ratio container */}
        <div className="relative w-full h-48">
          {blog.image ? (
            <Image 
              src={blog.image} 
              alt={blog.title || 'Blog thumbnail'} 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {blog.isPremium && (
            <div className="absolute top-3 right-3 bg-amber-400 text-xs font-bold uppercase py-1 px-2 rounded-md">
              Premium
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2">
            {blog.title || 'Untitled Blog'}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
            {blog.description || 'No description available'}
          </p>
          
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-xs">
              <div className="flex items-center mr-3">
                <UserCircleIcon className="h-4 w-4 mr-1" />
                <span>{blog.author || 'Anonymous'}</span>
              </div>
              
              {blog.date && (
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{new Date(blog.date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
                {blog.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{blog.tags.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
