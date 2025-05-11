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
  Timestamp, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../config/authConfig";

// Create a new post
export const createPost = async (postData) => {
  try {
    // Prepare post data with timestamp
    const postWithTimestamp = {
      ...postData,
      createdAt: serverTimestamp(),
      likes: [],
      commentCount: 0
    };
    
    // Add document to posts collection
    const postRef = await addDoc(collection(db, "posts"), postWithTimestamp);
    
    return { 
      success: true, 
      postId: postRef.id 
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Get a single post by ID
export const getPostById = async (postId) => {
  try {
    const postDoc = await getDoc(doc(db, "posts", postId));
    
    if (!postDoc.exists()) {
      return null;
    }
    
    return {
      id: postDoc.id,
      ...postDoc.data()
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

// Get all posts (with optional limit)
export const getAllPosts = async (limitCount = 20) => {
  try {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const postsSnapshot = await getDocs(postsQuery);
    const posts = [];
    
    postsSnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Get posts by user ID
export const getPostsByUser = async (userId, limitCount = 10) => {
  try {
    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const postsSnapshot = await getDocs(postsQuery);
    const posts = [];
    
    postsSnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

// Update a post
export const updatePost = async (postId, updatedData) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, updatedData);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating post:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, "posts", postId));
    
    // Note: In a production app, you might want to also delete all comments
    // associated with this post in a transaction or cloud function
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Like a post
export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes: arrayUnion(userId)
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error liking post:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Unlike a post
export const unlikePost = async (postId, userId) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes: arrayRemove(userId)
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error unliking post:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Increment comment count
export const incrementCommentCount = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      return { success: false, error: "Post not found" };
    }
    
    const currentCount = postDoc.data().commentCount || 0;
    
    await updateDoc(postRef, {
      commentCount: currentCount + 1
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error incrementing comment count:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Decrement comment count
export const decrementCommentCount = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      return { success: false, error: "Post not found" };
    }
    
    const currentCount = postDoc.data().commentCount || 0;
    
    // Ensure we don't go below zero
    await updateDoc(postRef, {
      commentCount: Math.max(0, currentCount - 1)
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error decrementing comment count:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};