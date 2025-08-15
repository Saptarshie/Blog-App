'use client'
import { useState, useEffect } from "react";
import { fetchBlogs } from "@/action/blogAction";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import CreatorBlogCard from "@/components/cards/CreatorBlogCard";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const user = useSelector((state) => state.userslice);
    const router = useRouter();
    
    useEffect(() => {
        async function loadBlogs() {
            try {
                const res = await fetchBlogs(page, limit, {author: user.username});
                console.log("res is: ", res);
                if (res.success) {
                    setBlogs(res.blogs);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        }
        
        if (user.username) {
            loadBlogs();
        }
    }, [user.username, page, limit]);
    
    const handleCreateBlog = () => {
        router.push('/creator-dashboard/create');
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Your Blog Posts</h1>
                <button 
                    onClick={handleCreateBlog}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Create New Post
                </button>
            </div>
            
            {blogs && blogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map(blog => (
                        <CreatorBlogCard 
                            key={blog._id} 
                            blog={blog} 
                            refreshBlogs={() => {
                                setLoading(true);
                                fetchBlogs(page, limit, {author: user.username}).then(res => {
                                    if (res.success) {
                                        setBlogs(res.blogs);
                                    }
                                    setLoading(false);
                                });
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <PlusCircleIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No blogs yet</h3>
                    <p className="text-gray-500 mb-6">Start creating content to grow your audience</p>
                    <button 
                        onClick={handleCreateBlog}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                        Create Your First Blog
                    </button>
                </div>
            )}
        </div>
    );
}
