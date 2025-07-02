'use server'
import { isValidWalletAddress } from "@/utils/functions/isValidWallet";
import { redirect } from "next/navigation";
import {User,Blog} from "@/models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {connectToDB} from "@/database";
import {writeFile} from "fs/promises";
const Joi = require('joi');
// Define validation schema}
import { BlogSchema } from "@/components/joi-schemas/add-blog";
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
    let imagePath = data.image;
    if (data.image instanceof File || data.image instanceof Blob) {
      const fileBuffer = Buffer.from(await data.image.arrayBuffer());
      const fileName = `${user.username}-${Date.now()}-${data.image.name}`;
      const uploadDir = `public/upload/thumbnail`;
      const fullPath = `${uploadDir}/${fileName}`;
      
      // Ensure directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      
      // Write file to disk
      await writeFile(fullPath, fileBuffer);
      
      // Update the image path to the relative URL path
      imagePath = `/upload/thumbnail/${fileName}`;
    }

    // Prepare blog data with the image path
    const blogData = {
      ...data,
      image: imagePath,
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

    // Create new blog entry
    const newBlog = new Blog(blogData);
    await newBlog.save();

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

