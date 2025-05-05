import { collection, addDoc, doc, getDoc, getDocs, updateDoc, query, where, arrayUnion, arrayRemove, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
// Remove Firebase Storage imports
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../config/authConfig"; // Remove storage from import

// Create a new group
export const createGroup = async (groupData, imageFile) => {
  try {
    // Upload group image to Cloudinary if provided
    let groupPicURL = null;
    if (imageFile) {
      groupPicURL = await uploadToCloudinary(imageFile);
    }
    
    // Create group document
    const groupRef = await addDoc(collection(db, "groups"), {
      ...groupData,
      groupPic: groupPicURL,
      createdAt: Timestamp.now(),
      members: [groupData.admin] // Admin is automatically a member
    });
    
    return { success: true, groupId: groupRef.id };
  } catch (error) {
    console.error("Error creating group:", error);
    return { success: false, error: error.message };
  }
};

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'vivid_unsigned'); // Use the same preset as your profile images
    
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/drvtmc9ps/image/upload',
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // No Content-Type header as the browser will set it with the correct boundary for FormData
        },
      }
    );
    
    // Check if the response is ok before parsing JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary error response:', errorText);
      throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      console.error('Cloudinary response without secure_url:', data);
      throw new Error('Failed to upload image to Cloudinary: No secure URL returned');
    }
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw error; // Re-throw to be handled by the calling function
  }
};

// Get all public groups
export const getPublicGroups = async () => {
  try {
    const q = query(
      collection(db, "groups"),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching public groups:", error);
    return [];
  }
};

// Get groups where user is a member
export const getUserGroups = async (userId) => {
  try {
    const q = query(
      collection(db, "groups"),
      where("members", "array-contains", userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return [];
  }
};

// Get a single group by ID
export const getGroupById = async (groupId) => {
  try {
    const groupDoc = doc(db, "groups", groupId);
    const groupSnapshot = await getDoc(groupDoc);
    
    if (groupSnapshot.exists()) {
      return {
        id: groupSnapshot.id,
        ...groupSnapshot.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching group:", error);
    return null;
  }
};

// Join a group
export const joinGroup = async (groupId, userId) => {
  try {
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      members: arrayUnion(userId)
    });
    return { success: true };
  } catch (error) {
    console.error("Error joining group:", error);
    return { success: false, error: error.message };
  }
};

// Leave a group
export const leaveGroup = async (groupId, userId) => {
  try {
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      members: arrayRemove(userId)
    });
    return { success: true };
  } catch (error) {
    console.error("Error leaving group:", error);
    return { success: false, error: error.message };
  }
};

// Add this function to your existing groupService.js file

// Update group details (admin only)
export const updateGroup = async (groupId, updatedData, imageFile) => {
  try {
    // Upload new group image to Cloudinary if provided
    if (imageFile) {
      const groupPicURL = await uploadToCloudinary(imageFile);
      updatedData.groupPic = groupPicURL;
    }
    
    // Update group document
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, updatedData);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating group:", error);
    return { success: false, error: error.message };
  }
};