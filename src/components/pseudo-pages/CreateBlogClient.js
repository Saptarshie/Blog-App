// app/creator-dashboard/create/CreateBlogClient.tsx  (CLIENT component)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TipTapEditor from '@/components/editor/tip-tap-editor';
import ImageUploader from '@/components/creator/ImageUploader';
export default function CreateBlog({ AddBlog, initialData={
  title: '',
  description: '',
  content: '',
  tags: '',
  isPremium: false,
  image: null
}}
  ) {
useEffect(() => {
  // Set preview image when initialData is provided for editing
  if (initialData?.image?.imagePath) {
    setPreview(initialData.image.imagePath);
  }
}, [initialData]);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    content: initialData.content || '',
    tags:initialData?.tags ? initialData.tags.join(', ') : '',
    isPremium: initialData.isPremium || false,
    image: initialData.image || null
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    console.log("handle Subbmit called...");
    try {
      // Convert comma-separated tags to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      const blogData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        tags: tagsArray,
        isPremium: formData.isPremium,
        image: formData.image,
        date: new Date(),
        _id: initialData._id || undefined
      };
      console.log("Inside handle submit tyr block... ,BlogData : ",blogData);
      const response = await AddBlog(blogData);

      if (response.success) {
        console.log("Blog posted successfully...");
        setSuccess('Blog posted successfully!');
        setTimeout(() => {
          router.push('/creator-dashboard');
        }, 1500);
      } else {
        setError(response.message || 'Failed to create blog');
        console.error("Error is :",response.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
        console.log("inside finally...")
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Blog Post</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Enter a captivating title"
          />
        </div>
        
        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Write a brief description (will appear in previews)"
          />
        </div>
        
        {/* Content Field */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <div className="min-h-[300px]">
            <TipTapEditor
              value={formData.content}
              onChange={handleContentChange}
            />
          </div>
        </div>
        
        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>
          <ImageUploader 
            onImageSelected={(file) => setFormData({...formData, image: file})}
            initialPreview={initialData?.image?.imagePath || null}
          />
        </div>
        
        {/* Tags Field */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags <span className="text-red-500">*</span>
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            required
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Enter tags separated by commas (e.g., tech, programming, AI)"
          />
        </div>
        
        {/* Premium Toggle */}
        <div className="flex items-center">
          <input
            id="isPremium"
            name="isPremium"
            type="checkbox"
            checked={formData.isPremium}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPremium" className="ml-2 block text-sm text-gray-900">
            Premium Content (Only available to subscribers)
          </label>
        </div>
        
        {/* Submit Button */}
        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : 'Publish Blog Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
