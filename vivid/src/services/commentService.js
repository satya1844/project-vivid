import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc,
  query, 
  orderBy, 
  limit,
  doc,
  serverTimestamp // Add this import
} from "firebase/firestore";
import { db } from "../config/authConfig";
import { incrementCommentCount, decrementCommentCount } from "./postService";

// Create a new comment
export const createComment = async (commentData) => {
  try {
    const { postId, userId, content, userName, userPhotoURL } = commentData;
    
    // Create comment in the post's subcollection
    const commentRef = await addDoc(
      collection(db, "posts", postId, "comments"),
      {
        authorId: userId,
        userId: userId, // Add userId field for consistency
        content,
        userName,
        userPhotoURL,
        createdAt: serverTimestamp()
      }
    );
    
    // Increment the comment count on the post
    await incrementCommentCount(postId);
    
    return { success: true, commentId: commentRef.id };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { success: false, error: error.message };
  }
};

// Get comments for a post
export const getCommentsByPost = async (postId, limitCount = 50) => {
  try {
    const commentsQuery = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "desc"), // Changed to desc to show newest first
      limit(limitCount)
    );
    
    const commentsSnapshot = await getDocs(commentsQuery);
    return commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      userId: doc.data().authorId, // Map authorId to userId for consistency
      content: doc.data().content,
      userName: doc.data().userName,
      userPhotoURL: doc.data().userPhotoURL,
      createdAt: doc.data().createdAt,
      postId // Include postId for delete functionality
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (postId, commentId) => {
  try {
    const commentRef = doc(db, "posts", postId, "comments", commentId);
    await deleteDoc(commentRef);
    
    // Decrement the comment count on the post
    await decrementCommentCount(postId);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false, error: error.message };
  }
};