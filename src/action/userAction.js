// src/action/userAction.js
'use server'

import { connectToDB } from "@/database";
import { User } from "@/models";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { isValidWalletAddress } from "@/utils/functions/isValidWallet";
import bcrypt from "bcryptjs";


// Update creator settings (price and wallet)
export async function updateCreatorSettings(data) {
  try {
    await connectToDB();
    const token = cookies().get("token")?.value;
    
    if (!token) {
      return { success: false, status: 401, message: "Not authenticated" };
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    
    // Validate wallet address if provided
    if (data.walletAddress && !isValidWalletAddress(data.walletAddress)) {
      return { success: false, status: 400, message: "Invalid wallet address" };
    }
    
    // Validate subscription price
    if (data.subscriptionPrice && (data.subscriptionPrice < 0 || data.subscriptionPrice > 0.99)) {
      return { success: false, status: 400, message: "Subscription price must be between $0 and $99.99" };
    }
    
    // Only update fields that were provided
    const updateFields = {};
    if (data.walletAddress !== undefined) updateFields.walletAddress = data.walletAddress;
    if (data.subscriptionPrice !== undefined) updateFields.subscriptionPrice = data.subscriptionPrice;
    
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateFields },
      { new: true }
    );
    
    if (!user) {
      return { success: false, status: 404, message: "User not found" };
    }
    
    return {
      success: true,
      status: 200,
      message: "Settings updated successfully",
      user: JSON.parse(JSON.stringify(user))
    };
  } catch (error) {
    console.error(error);
    return { success: false, status: 500, message: error.message };
  }
}

// Get creator earnings data
export async function getCreatorEarnings() {
  try {
    await connectToDB();
    const token = cookies().get("token")?.value;
    
    if (!token) {
      return { success: false, status: 401, message: "Not authenticated" };
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return { success: false, status: 404, message: "User not found" };
    }
    
    // Get the last 3 months of earnings
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const recentEarnings = user.earnings.filter(
      item => new Date(item.date) >= threeMonthsAgo
    );
    
    // Calculate total earnings
    const totalEarnings = user.earnings.reduce((sum, item) => sum + item.amount, 0);
    
    return {
      success: true,
      status: 200,
      walletAddress: user.walletAddress,
      subscriptionPrice: user.subscriptionPrice,
      subscriberCount: user.subscriberCount,
      recentEarnings:recentEarnings || [], // Ensure this is always an array,
      totalEarnings
    };
  } catch (error) {
    console.error(error);
    return { success: false, status: 500, message: error.message };
  }
}

// src/action/userAction.js (add this function)
export async function updateUserSettings(data) {
  try {
    await connectToDB();
    const token = cookies().get("token")?.value;
    
    if (!token) {
      return { success: false, status: 401, message: "Not authenticated" };
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    
    // Validate email if provided
    if (data.email && !isValidEmail(data.email)) {
      return { success: false, status: 400, message: "Invalid email address" };
    }
    
    // Validate password if provided
    if (data.password && data.password.length < 8) {
      return { success: false, status: 400, message: "Password must be at least 8 characters" };
    }
    
    // Only update fields that were provided
    const updateFields = {};
    if (data.email !== undefined) updateFields.email = data.email;
    if (data.password !== undefined) updateFields.password = bcrypt.hashSync(data.password, 10);
    
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateFields },
      { new: true }
    );
    
    if (!user) {
      return { success: false, status: 404, message: "User not found" };
    }
    
    return {
      success: true,
      status: 200,
      message: "Settings updated successfully",
      user: JSON.parse(JSON.stringify(user))
    };
  } catch (error) {
    console.error(error);
    return { success: false, status: 500, message: error.message };
  }
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
