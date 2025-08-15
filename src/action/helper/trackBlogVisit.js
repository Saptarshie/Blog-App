import { History } from "@/models";
import { connectToDB } from "@/database";

export async function trackBlogVisit(username, blogId) {
  try {
    await connectToDB();
    
    // Find user history or create if it doesn't exist
    let userHistory = await History.findOne({ username });
    
    if (!userHistory) {
      // Create new history for first-time users
      userHistory = await History.create({
        username,
        visitHistory: [{
          blogId: blogId,
          visitedAt: new Date()
        }]
      });
      return true;
    }
    
    // Check if blog exists in history (to avoid duplicates)
    const existingIndex = userHistory.visitHistory.findIndex(
      visit => visit.blogId.toString() === blogId.toString()
    );
    
    // If found, remove it to add it to the front (most recent)
    if (existingIndex !== -1) {
      userHistory.visitHistory.splice(existingIndex, 1);
    }
    
    // Add to the beginning (most recent) of the history
    userHistory.visitHistory.unshift({
      blogId: blogId,
      visitedAt: new Date()
    });
    
    // Keep only the 20 most recent items (FIFO)
    if (userHistory.visitHistory.length > 20) {
      userHistory.visitHistory = userHistory.visitHistory.slice(0, 20);
    }
    
    // Save the updated history
    await userHistory.save();
    return true;
  } catch (error) {
    console.error("Error tracking blog visit:", error);
    return false;
  }
}
