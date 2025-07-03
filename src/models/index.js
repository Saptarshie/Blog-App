import Earnings from "@/app/creator-dashboard/earnings/page";
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  image: String,
  author: { 
    type: String, 
    index: true 
  },
  date: Date,
  tags: { 
    type: [String], 
    index: true  
  },
  isPremium: { 
    type: Boolean, 
    index: true 
  },
})

// Add text index for approximate searching
blogSchema.index({ 
  title: 'text', 
  description: 'text', 
  content: 'text', 
  tags: 'text',
  author: 'text'
});

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    unique: true  // This creates a unique index on username
    },
    email:{
    type: String,
    unique: true  // This creates a unique index on username
    },
  password: String,
  blogs: [mongoose.Schema.Types.ObjectId],
  walletAddress: String,
  subscriberCount: Number,
  subscription: [String],
  subscriptionPrice: {
      type: Number,
      default: 0  // Default price for existing users
  },
  earnings: [{
  // Store just the date without time portion (midnight of that day)
  date: { 
    type: Date, 
    default: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    }
  },
  amount: { type: Number, default: 0 }
}]
})

// Example schema for pending transactions
const PendingTransactionSchema = new mongoose.Schema({
  transactionHash: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creatorUsername: { type: String, required: true },
  recipientAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' }, // TTL index
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
});

const Blog = mongoose.models.Blog3 || mongoose.model("Blog3", blogSchema);
const User = mongoose.models.User3 || mongoose.model("User3", userSchema);
const PendingTransaction = mongoose.models.PendingTransaction3 || mongoose.model("PendingTransaction3", PendingTransactionSchema);
export { Blog, User, PendingTransaction };