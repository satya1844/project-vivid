import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  doc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../config/authConfig";

// Add a like to a post
export const addLike = async (postId, likeData) => {
  try {
    const likeWithTimestamp = {
      ...likeData,
      createdAt: serverTimestamp(),
      postId: postId
    };
    
    const likeRef = await addDoc(
      collection(db, "posts", postId, "likes"),
      likeWithTimestamp
    );
    
    return { 
      success: true, 
      likeId: likeRef.id 
    };
  } catch (error) {
    console.error("Error adding like:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Remove a like from a post
export const removeLike = async (postId, likeId) => {
  try {
    await deleteDoc(doc(db, "posts", postId, "likes", likeId));
    return { success: true };
  } catch (error) {
    console.error("Error removing like:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Get all likes for a post
export const getLikes = async (postId) => {
  try {
    const likesQuery = query(
      collection(db, "posts", postId, "likes")
    );
    
    const likesSnapshot = await getDocs(likesQuery);
    const likes = [];
    
    likesSnapshot.forEach((doc) => {
      likes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return likes;
  } catch (error) {
    console.error("Error fetching likes:", error);
    throw error;
  }
};

// Check if a user has liked a post
export const checkUserLike = async (postId, userId) => {
  try {
    const likesQuery = query(
      collection(db, "posts", postId, "likes"),
      where("userId", "==", userId)
    );
    
    const likesSnapshot = await getDocs(likesQuery);
    return !likesSnapshot.empty;
  } catch (error) {
    console.error("Error checking user like:", error);
    return false;
  }
}; 