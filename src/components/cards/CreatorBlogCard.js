'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  TagIcon,
  CalendarIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import Image from 'next/image';
import Link from 'next/link';
import { deleteBlog } from '@/action/blogAction';

export default function CreatorBlogCard({ blog, refreshBlogs }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handleEdit = () => {
    router.push(`/creator-dashboard/edit/${blog._id}`);
  };
  
  const handlePreview = () => {
    router.push(`/blogs/${blog._id}`);
  };
  
  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };
  
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteBlog(blog._id);
      if (response.success) {
        refreshBlogs();
      } else {
        console.error("Failed to delete blog:", response.message);
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  // Get default placeholder if no image
  const blogImage = blog.image || '/images/blog-placeholder.jpg';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200">
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <Image
          src={blogImage}
          alt={blog.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {blog.isPremium && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg flex items-center">
            <SparklesIcon className="h-3 w-3 mr-1" />
            PREMIUM
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.description}</p>
        
        {/* Tags and Date */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags && blog.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center">
              <TagIcon className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
          {blog.tags && blog.tags.length > 3 && (
            <span className="bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded-full">
              +{blog.tags.length - 3} more
            </span>
          )}
        </div>
        
        {/* Date */}
        <div className="flex items-center text-gray-500 text-xs mb-4">
          <CalendarIcon className="h-3 w-3 mr-1" />
          {formatDate(blog.date)}
        </div>
        
        {/* Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button 
            onClick={handlePreview}
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            Preview
          </button>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-1 text-sm text-indigo-700 bg-indigo-50 rounded hover:bg-indigo-100 transition-colors"
            >
              <PencilIcon className="h-3 w-3 mr-1" />
              Edit
            </button>
            
            <button 
              onClick={handleDeleteConfirm}
              className="inline-flex items-center px-3 py-1 text-sm text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors"
              disabled={isDeleting}
            >
              <TrashIcon className="h-3 w-3 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Blog Post</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete "{blog.title}"? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              
              <button 
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
