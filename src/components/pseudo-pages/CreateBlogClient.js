// app/creator-dashboard/create/CreateBlogClient.tsx  (CLIENT component)
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TipTapEditor from '@/components/editor/tip-tap-editor';
import ImageUploader from '@/components/creator/ImageUploader';

// A simple, reusable icon component for our AI buttons
const MagicWandIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4V2" /><path d="M15 10V8" /><path d="M12.3 7.7 11 9" /><path d="m10 6-1.8 1.8" /><path d="M7 10H5" /><path d="M7 4H5" /><path d="m3 6 1.8 1.8" /><path d="M14 13.5V10h-3V7a3 3 0 0 0-3-3 3 3 0 0 0-3 3v3H2v3.5a3.5 3.5 0 0 0 3.5 3.5h7A3.5 3.5 0 0 0 16 13.5Z" /><path d="M22 6h-3" /><path d="M20.5 4.5 19 6" /><path d="m22 10-3-1" />
  </svg>
);


export default function CreateBlog({ AddBlog, initialData = {
  title: '',
  description: '',
  content: '',
  tags: '',
  isPremium: false,
  image: null
}}) {
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

  // Loading states for AI features
  const [isSuggestingTitle, setIsSuggestingTitle] = useState(false);
  const [isCreatingDescription, setIsCreatingDescription] = useState(false);
  const [isEnhancingContent, setIsEnhancingContent] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    content: initialData.content || '',
    tags: initialData?.tags ? initialData.tags.join(', ') : '',
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

  /**
   * Generic handler for streaming AI responses from the API.
   * @param {string} context - The input text (e.g., blog content) to send to the AI.
   * @param {string} option - The task for the AI (e.g., 'suggest-title').
   * @param {function} setLoading - The state setter to control the loading indicator.
   * @param {function} updateState - The function to call with each new chunk of text from the stream.
   */
  const handleAIStream = async (context, option, setLoading, updateState) => {
    if (!context || context.trim().length < 50) {
      setError(`Please provide more content before using this AI feature.`);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, option }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            const chunkText = line.substring(2).replace(/"/g, '');
            fullResponse += chunkText;
            updateState(fullResponse); // Update state with the accumulating response
          }
        }
      }
    } catch (err) {
      console.error('AI Stream Error:', err);
      setError(err.message || `Failed to ${option.replace('-', ' ')}.`);
    } finally {
      setLoading(false);
    }
  };

  const suggestTitle = (e) => {
    e.preventDefault();
    handleAIStream(
      formData.content, 
      'suggest-title', 
      setIsSuggestingTitle, 
      (newTitle) => setFormData(prev => ({ ...prev, title: newTitle }))
    );
  };

  const createDescription = (e) => {
    e.preventDefault();
    handleAIStream(
      formData.content, 
      'create-description', 
      setIsCreatingDescription, 
      (newDescription) => setFormData(prev => ({ ...prev, description: newDescription }))
    );
  };
  
  const enhanceContent = (e) => {
    e.preventDefault();
    handleAIStream(
        formData.content, 
        'enhance-content', 
        setIsEnhancingContent, 
        handleContentChange // Directly updates the TipTap editor
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const blogData = {
        ...formData,
        tags: tagsArray,
        date: new Date(),
        _id: initialData._id || undefined
      };

      const response = await AddBlog(blogData);

      if (response.success) {
        setSuccess('Blog published successfully! Redirecting...');
        setTimeout(() => router.push('/creator-dashboard'), 2000);
      } else {
        setError(response.message || 'Failed to create blog');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const AILoadingButton = ({isLoading, children}) => (
    <span className="flex items-center relative z-10">
      {isLoading ? (
        <>
            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.75V6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M17.1266 6.87347L16.0659 7.93413" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M19.25 12L17.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M17.1266 17.1265L16.0659 16.0659" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 19.25V17.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M6.87347 17.1265L7.93413 16.0659" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M4.75 12L6.25 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M6.87347 6.87347L7.93413 7.93413" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            Generating...
        </>
      ) : (
        children
      )}
    </span>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">Create New Blog Post</h1>
            <p className="text-gray-500 mt-2">Fill in the details below to publish your article.</p>
          </div>
          
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">{error}</div>}
          {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">{success}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
                <span>Title <span className="text-red-500">*</span></span>
                <button type="button" onClick={suggestTitle} disabled={isSuggestingTitle} className="px-3 py-1 text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                  <AILoadingButton isLoading={isSuggestingTitle}>
                    <MagicWandIcon className="w-3 h-3 mr-1.5" />
                    Suggest Title
                  </AILoadingButton>
                </button>
              </label>
              <input id="title" name="title" type="text" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" placeholder="A Catchy and SEO-friendly Title" />
            </div>
            
            {/* Description Field */}
            <div>
              <label htmlFor="description" className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
                <span>Description <span className="text-red-500">*</span></span>
                <button type="button" onClick={createDescription} disabled={isCreatingDescription} className="px-3 py-1 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                   <AILoadingButton isLoading={isCreatingDescription}>
                    <MagicWandIcon className="w-3 h-3 mr-1.5" />
                    Create Description
                  </AILoadingButton>
                </button>
              </label>
              <textarea id="description" name="description" rows="3" required value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" placeholder="A brief summary for previews and search engines." />
            </div>

            {/* Content Field */}
            <div>
              <label htmlFor="content" className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
                <span>Content <span className="text-red-500">*</span></span>
                <button type="button" onClick={enhanceContent} disabled={isEnhancingContent} className="px-3 py-1 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                   <AILoadingButton isLoading={isEnhancingContent}>
                    <MagicWandIcon className="w-3 h-3 mr-1.5" />
                    Enhance with AI
                  </AILoadingButton>
                </button>
              </label>
              <div className="min-h-[300px] border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                <TipTapEditor value={formData.content} onChange={handleContentChange} />
              </div>
            </div>

            <hr className="border-t border-gray-200" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                  <ImageUploader onImageSelected={(file) => setFormData({...formData, image: file})} initialPreview={initialData?.image?.imagePath || null} />
                </div>
                
                {/* Tags & Premium */}
                <div className="space-y-6">
                    {/* Tags Field */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags <span className="text-red-500">*</span></label>
                        <input id="tags" name="tags" type="text" required value={formData.tags} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" placeholder="tech, programming, AI" />
                    </div>
                    
                    {/* Premium Toggle */}
                    <div className="flex items-center pt-2">
                        <input id="isPremium" name="isPremium" type="checkbox" checked={formData.isPremium} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label htmlFor="isPremium" className="ml-3 block text-sm text-gray-900">Mark as Premium Content</label>
                    </div>
                </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-5">
              <button type="submit" disabled={isSubmitting} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300`}>
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Publishing...
                  </>
                ) : 'Publish Blog Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}