import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../config/authConfig";
import { incrementCommentCount, decrementCommentCount } from "./postService";

// Create a new comment
export const createComment = async (commentData) => {
  try {
    // Prepare comment data with timestamp
    const commentWithTimestamp = {
      ...commentData,
      createdAt: serverTimestamp()
    };
    
    // Add document to comments collection
    const commentRef = await addDoc(collection(db, "comments"), commentWithTimestamp);
    
    // Increment the comment count on the post
    await incrementCommentCount(commentData.postId);
    
    return { 
      success: true, 
      commentId: commentRef.id 
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Get comments for a post
export const getCommentsByPost = async (postId, limitCount = 50) => {
  try {
    const commentsQuery = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "asc"),
      limit(limitCount)
    );
    
    const commentsSnapshot = await getDocs(commentsQuery);
    const comments = [];
    
    commentsSnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Update a comment
export const updateComment = async (commentId, updatedData) => {
  try {
    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, updatedData);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating comment:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    // Get the comment to find its postId
    const commentRef = doc(db, "comments", commentId);
    const commentDoc = await getDoc(commentRef);
    
    if (!commentDoc.exists()) {
      return { success: false, error: "Comment not found" };
    }
    
    const postId = commentDoc.data().postId;
    
    // Delete the comment
    await deleteDoc(commentRef);
    
    // Decrement the comment count on the post
    await decrementCommentCount(postId);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};