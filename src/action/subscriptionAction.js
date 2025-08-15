'use server'

import { connectToDB } from "@/database";
import { User,PendingTransaction } from "@/models";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyTransaction } from "./helper/verifyTransaction";
export async function subscribeToCreator(authorUsername,transactionHash="") {
  try {
    await connectToDB();
    // Get current user from cookie
    const token = await cookies().get("token")?.value;
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "You must be logged in to subscribe",
      };
    }
    
    // Decode token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    
    // Find the subscriber (current user)
    const subscriber = await User.findById(decoded.id);
    if (!subscriber) {
      return {
        success: false,
        status: 404,
        message: "Subscriber account not found",
      };
    }
    
    // Find the author by username
    const author = await User.findOne({ username: authorUsername });
    if (!author) {
      return {
        success: false,
        status: 404,
        message: "Creator not found",
      };
    }
       // Check if user is already subscribed
    if (subscriber.subscription.includes(authorUsername)) {
      return {
        success: false,
        status: 400,
        message: "You are already subscribed to this creator",
      };
    }
    
    // Check if user is trying to subscribe to themselves
    if (subscriber.username === authorUsername) {
      return {
        success: false,
        status: 400,
        message: "You cannot subscribe to yourself",
      };
    }
    // If a paid subscription is required
    if (author.subscriptionPrice > 0) {
      const verified = await verifyTransaction(author.walletAddress, transactionHash, author.subscriptionPrice);
      
      if (verified.success === "pending") {
        // Store pending transaction in database
        await storePendingTransaction(author.walletAddress,transactionHash,author.subscriptionPrice,subscriber._id,authorUsername);
        
        return {
          success: "pending",
          status: 202,
          message: "Your subscription will be activated once payment is confirmed",
          data: { transactionHash }
        };
      }
      
      if (!verified.success) {
        return verified; // Return the error from verification
      }
    }
    
    // Update subscriber's subscriptions list
    await User.findByIdAndUpdate(
      subscriber._id,
      { $push: { subscription: authorUsername } }
    );
    
    // Increment author's subscriber count
    await User.findByIdAndUpdate(
      author._id,
      { $inc: { subscriberCount: 1 } }
    );
    
    return {
      success: true,
      status: 200,
      message: "Subscription successful",
    };
    
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: error.message || "An error occurred while processing your subscription",
    };
  }
}

// Optional: Add an unsubscribe action for future use
export async function unsubscribeFromCreator(authorUsername) {
  try {
    await connectToDB();
    
    const token = await cookies().get("token")?.value;
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "You must be logged in to unsubscribe",
      };
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const subscriber = await User.findById(decoded.id);
    
    if (!subscriber) {
      return {
        success: false,
        status: 404,
        message: "Subscriber account not found",
      };
    }
    
    const author = await User.findOne({ username: authorUsername });
    if (!author) {
      return {
        success: false,
        status: 404,
        message: "Creator not found",
      };
    }
    
    // Check if user is actually subscribed
    if (!subscriber.subscription.includes(authorUsername)) {
      return {
        success: false,
        status: 400,
        message: "You are not subscribed to this creator",
      };
    }
    
    // Update subscriber's subscriptions list (remove author)
    await User.findByIdAndUpdate(
      subscriber._id,
      { $pull: { subscription: authorUsername } }
    );
    
    // Decrement author's subscriber count
    await User.findByIdAndUpdate(
      author._id,
      { $inc: { subscriberCount: -1 } }
    );
    
    return {
      success: true,
      status: 200,
      message: "Unsubscribed successfully",
    };
    
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: error.message || "An error occurred while processing your unsubscription",
    };
  }
}

export async function getSubscriptionPrice(authorUsername) {
  try {
    await connectToDB();
    
    // Find only the subscriptionPrice field using projection
    const author = await User.findOne(
      { username: authorUsername },
      { subscriptionPrice: 1,subscriberCount: 1,walletAddress: 1, _id: 0 }
    );
    
    if (!author) {
      return {
        success: false,
        status: 404,
        message: "Creator not found",
      };
    }
    
    return {
      success: true,
      status: 200,
      price: author?.subscriptionPrice || 0,
      subscriberCount: author?.subscriberCount || 0,
      walletAddress: author?.walletAddress || "",
      message: "Subscription price retrieved successfully",
    };
    
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: error.message || "An error occurred while retrieving the subscription price",
    };
  }
}
