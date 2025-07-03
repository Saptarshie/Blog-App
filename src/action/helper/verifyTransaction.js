// In src/action/subscriptionAction.js
import { ethers } from 'ethers';

export async function verifyTransaction(ReceiverWalletAddress, transactionHash, subscriptionPrice) {
  try {
    // Connect to Sepolia testnet
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.INFURA_API_URL || `https://sepolia.infura.io/v3/${process.env.INFURA_ID}`
    );
    
    // Check if transaction exists at all
    const transaction = await provider.getTransaction(transactionHash);
    
    if (!transaction) {
      return {
        success: false,
        status: 404,
        message: "Transaction not found on network",
      };
    }
    
    // For pending transactions, store data and return pending status
    if (!transaction.blockNumber) {
      // Store pending transaction in database
      
      return {
        success: "pending",
        status: 202,
        message: "Transaction is pending. Subscription will be activated once confirmed.",
        data: { transactionHash }
      };
    }
    
    // For confirmed transactions, verify details
    const receipt = await provider.getTransactionReceipt(transactionHash);
    
    if (!receipt || receipt.status !== 1) {
      return {
        success: false,
        status: 400,
        message: "Transaction failed",
      };
    }
    
    // Verify correct recipient and amount
    const isCorrectReceiver = transaction.to?.toLowerCase() === ReceiverWalletAddress.toLowerCase();
    const transactionValue = ethers.utils.formatEther(transaction.value);
    const isCorrectAmount = parseFloat(transactionValue) >= parseFloat(subscriptionPrice);
    
    if (!isCorrectReceiver || !isCorrectAmount) {
      return {
        success: false,
        status: 400,
        message: "Transaction verification failed: incorrect recipient or amount",
      };
    }
    
    return {
      success: true,
      status: 200,
      message: "Transaction verified successfully",
    };
    
  } catch (error) {
    console.error("Verification error:", error);
    return {
      success: false,
      status: 500,
      message: error.message || "Failed to verify transaction",
    };
  }
}
