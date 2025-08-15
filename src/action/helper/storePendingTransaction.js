'use server'

import { connectToDB } from "@/database";
import { PendingTransaction } from "@/models";

/**
 * Store pending transaction in database
 * @param {string} recipientAddress - Wallet address of the creator
 * @param {string} transactionHash - Blockchain transaction hash
 * @param {number} amount - Amount of subscription price
 * @param {string} userId - MongoDB ObjectId of the subscriber
 * @param {string} creatorUsername - Username of the creator
 * @returns {Object} Response object with success status and message
 */
export async function storePendingTransaction(recipientAddress, transactionHash, amount, userId, creatorUsername) {
  try {
    await connectToDB();
    
    // Check if transaction already exists in the database
    const existingTransaction = await PendingTransaction.findOne({ transactionHash });
    
    if (existingTransaction) {
      return {
        success: false,
        status: 409,
        message: "Transaction has already been recorded",
      };
    }
    
    // Create new pending transaction
    const pendingTransaction = new PendingTransaction({
      transactionHash,
      userId,
      creatorUsername,
      recipientAddress,
      amount,
      status: 'pending'
    });
    
    await pendingTransaction.save();
    
    return {
      success: true,
      status: 201,
      message: "Pending transaction recorded successfully",
    };
  } catch (error) {
    console.error("Error storing pending transaction:", error);
    return {
      success: false,
      status: 500,
      message: error.message || "Failed to store transaction data",
    };
  }
}
