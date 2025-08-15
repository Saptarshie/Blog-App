"use client";
import { useState, useEffect } from "react";
import BlogCard from "../blog-feed/blog-card";
import { fetchHistory } from "@/action/blogAction";

export default function HistoryList() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const response = await fetchHistory();
        console.log("History response:", response); // Add this log to debug
        
        if (response?.success) {
          // Ensure we always set an array, even if visitedBlogs is undefined
          setHistory(Array.isArray(response.visitedBlogs) ? response.visitedBlogs : []);
        } else {
          setError(response?.message || "Failed to load history");
        }
      } catch (error) {
        setError("An error occurred while fetching history");
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Ensure history is always an array before mapping
  const safeHistory = Array.isArray(history) ? history : [];
  
  if (safeHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-900">No history found</h3>
        <p className="text-gray-500 mt-2">Start reading some blogs to build your history!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeHistory.map((blog, index) => (
        <BlogCard key={`${blog._id}-${index}`} blog={blog} />
      ))}
    </div>
  );
}
