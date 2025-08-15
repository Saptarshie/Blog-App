'use server';
import {User,Blog,History} from "@/models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {connectToDB} from "@/database";
import {writeFile,mkdir} from "fs/promises";
import { uploadAndTransform, deleteImage } from "@/action/helper/handleImage";
import createVector from "@/action/helper/createVector";
const Joi = require('joi');
const fs = require('fs');
// Define validation schema}
import { BlogSchema } from "@/components/joi-schemas/add-blog";
import { trackBlogVisit } from "./helper/trackBlogVisit";
export async function AddBlog(data) {
  try {
    await connectToDB();
    const token = await cookies().get("token")?.value;
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "User not authenticated",
      };
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id);
    if (!user) {
      return {
        success: false,
        status: 404,
        message: "User not found",
      };
    }

    // Process file upload if image is provided as FormData
    let imagePath = data.image ,image_id="";
    if (data.image instanceof File || data.image instanceof Blob) {
      ({imagePath,image_id} = await uploadAndTransform(data.image));
    }

    // Prepare blog data with the image path
    const blogData = {
      ...data,
      image: {imagePath,image_id},
      author: user.username
    };

    // Validate the blog data
    const { error } = BlogSchema.validate(blogData);
    if (error) {
      return {
        success: false,
        status: 400,
        message: error.details[0].message,
      };
    }
    // ---------------------------------
    if(data._id){
          const blog1 = await Blog.findById(data._id);
          if (blog1?.author !== user.username) {
            return {
              success: false,
              status: 403,
              message: "You are not authorized to edit this blog",
            };
          }
          // Delete the image file if it exists
        if (imagePath && imagePath !== blog1?.image.imagePath && blog1?.image && blog1?.image?.imagePath) {
      const oldImageId = blog1?.image?.image_id;
      try {
        // Check if file exists before attempting to delete
        if(oldImageId) deleteImage(oldImageId);
        ({imagePath,image_id} = await uploadAndTransform(data.image));
      } catch (Error) {
        console.error(`Failed to delete image file: ${oldImageId}`, Error);
        // Continue with blog deletion even if image deletion fails
      }
    }

      // Update the blog
      const blog = await Blog.findByIdAndUpdate(data._id, blogData, { new: true });
      if (!blog) {
        return {
          success: false,
          status: 404,
          message: "Blog not found",
        };
      }
      createVector(blog);
      return {
        success: true,
        status: 200,
        message: "Blog updated successfully",
        blog: JSON.parse(JSON.stringify(blog))
      };
    }
    // ---------------------------------
    // Create new blog entry
    const newBlog = new Blog(blogData);
    await newBlog.save();
    createVector(newBlog);
    // Update user's blogs array
    await User.findByIdAndUpdate(
      user._id,
      { $push: { blogs: newBlog._id } }
    );

    return {
      success: true,
      status: 201,
      message: "Blog created successfully",
      blog: JSON.parse(JSON.stringify(newBlog))
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: error.message || "An error occurred while creating the blog",
    };
  }
}

export async function fetchBlogs(page = 1, limit = 10, filters = {}) {
  try {
    await connectToDB();
    
    // Build query object based on filters
    const query = {};
    
    // Add filter for premium content
    if (filters.isPremium !== undefined) {
      query.isPremium = filters.isPremium;
    }
    
    // Add filter for author
    if (filters.author) {
      query.author = filters.author;
    }
    
    // Add filter for tags
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    
    // Add search functionality
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Fetch blogs with pagination
    const blogs = await Blog.find(query, { content: 0 }) //Prevents premium content from being sent to unauthorized users
      .sort({ date: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for this query (for pagination info)
    const total = await Blog.countDocuments(query);
    
    return {
      success: true,
      status: 200,
      blogs: JSON.parse(JSON.stringify(blogs)),
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + blogs.length < total
      }
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      success: false,
      status: 500,
      message: error.message || "Failed to fetch blogs"
    };
  }
}

// In your blogAction.js file
export async function searchBlogs(searchText) {
  try {
    const blogs = await Blog.find(
      { 
        $text: { 
          $search: searchText, 
          $caseSensitive: false, 
          $diacriticSensitive: false 
        } 
      },
      { score: { $meta: "textScore" },content: 0 }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(20);
    // Convert Mongoose documents to plain JavaScript objects
    const plainBlogs = JSON.parse(JSON.stringify(blogs));
    return { success: true, blogs: plainBlogs };
  } catch (error) {
    console.error('Search error:', error);
    return { success: false, message: 'Failed to search blogs' };
  }
}

export async function fetchBlogById(blogId) {
  try {
    await connectToDB();
    const token = await cookies().get("token")?.value;
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "User not authenticated",
      };
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id);
    if (!user) {
      return {
        success: false,
        status: 404,
        message: "User not found",
      };
    }

    const blog = await Blog.findById(blogId).lean();

    if (!blog) {
      return {
        success: false,
        status: 404,
        message: "Blog not found"
      };
    }
    if(blog.isPremium && blog.author !== user.username && !user.subscription.includes(blog.author)){
      return {
        success: false,
        status: 403,
        message: "You are not authorized to view this blog",
        author: blog.author
      };
    }

    trackBlogVisit(user.username, blogId);
    return {
      success: true,
      status: 200,
      blog: JSON.parse(JSON.stringify(blog))
    };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return {
      success: false,
      status: 500,
      message: error.message || "Failed to fetch blog"
    };
  }
}

export async function deleteBlog(blogId) {
  try {
    await connectToDB();
    const token = await cookies().get("token")?.value;
    
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "User not authenticated",
      };
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return {
        success: false,
        status: 404,
        message: "User not found",
      };
    }
    
    // Find the blog
    const blog = await Blog.findById(blogId);
    
    if (!blog) {
      return {
        success: false,
        status: 404,
        message: "Blog not found",
      };
    }
    
    // Check if user is the author
    if (blog.author !== user.username) {
      return {
        success: false,
        status: 403,
        message: "You don't have permission to delete this blog",
      };
    }
    
    if (blog.image?.image_id) {
      try {
        await deleteImage(blog.image.image_id);
        console.log(`Deleted image: ${blog.image.image_id}`);
      } catch (fileError) {
        console.error(`Failed to delete image: ${blog.image.image_id}`, fileError);
      }
    }


    // Delete the blog
    await Blog.findByIdAndDelete(blogId);
    
    // Remove blog from user's blogs array
    await User.findByIdAndUpdate(
      user._id,
      { $pull: { blogs: blogId } }
    );
    
    return {
      success: true,
      status: 200,
      message: "Blog deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: error.message || "An error occurred while deleting the blog",
    };
  }
}
export async function fetchHistory() {
  try {
    await connectToDB();
    const token = await cookies().get("token")?.value;
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "User not authenticated",
        visitedBlogs: [] // Always include an empty array
      };
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id);
    if (!user) {
      return {
        success: false,
        status: 404,
        message: "User not found",
        visitedBlogs: [] // Always include an empty array
      };
    }
    
    const history = await History.findOne({ username: user.username });

    if (!history || !history.visitHistory || history.visitHistory.length === 0) {
      return {
        success: true,
        status: 200,
        visitedBlogs: [] // Return empty array if no history found
      };
    }

    // Extract blog IDs from visitHistory
    const blogIds = history.visitHistory.map(visit => visit.blogId);

    // Fetch blog details
    const blogs = await Blog.find({ _id: { $in: blogIds } }).lean();

    return {
      success: true,
      status: 200,
      visitedBlogs:  JSON.parse(JSON.stringify(blogs))
    };
  } catch (error) {
    console.log("Error fetching history:", error);
    return {
      success: false,
      status: 500,
      message: error.message || "Failed to fetch history",
      visitedBlogs: [] // Always include an empty array
    };
  }
}


const RECOMMENDER_URL = process.env.RECOMMENDER_API_URL // e.g. "https://api.myapp.com"

export async function getRecommendedBlogs(blogIds, k = 5) {
  // 1) Call the Python recommender
  const res = await fetch(`${RECOMMENDER_URL}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blog_ids: blogIds, k })
  })
  if (!res.ok) {
    console.error('Recommender error:', await res.text())
    return []
  }
  const { recommended_ids } = await res.json()

  // 2) Fetch full blog docs from Mongo
  await connectToDB()
  const objectIds = recommended_ids.map(id => new mongoose.Types.ObjectId(id))
  const blogs = await Blog.find({ _id: { $in: objectIds } })
    .sort({ date: -1 })
    .lean()

  return JSON.parse(JSON.stringify(blogs))
}