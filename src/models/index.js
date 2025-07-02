import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  image: String,
  author: String,
  date: Date,
  tags: [String],
  isPremium: Boolean,
})

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
})

const Blog = mongoose.models.Blog3 || mongoose.model("Blog3", blogSchema);
const User = mongoose.models.User3 || mongoose.model("User3", userSchema);
export { Blog, User };