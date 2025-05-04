// Functions for handling connection requests
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/authConfig";

// Send a connection request
export const sendConnectionRequest = async (fromUserId, toUserId) => {
  try {
    const requestData = {
      from: fromUserId,
      to: toUserId,
      status: "pending",
      timestamp: new Date()
    };
    
    await addDoc(collection(db, "connectionRequests"), requestData);
    return { success: true };
  } catch (error) {
    console.error("Error sending connection request:", error);
    return { success: false, error };
  }
};

// Get all pending requests sent by a user
export const getSentRequests = async (userId) => {
  try {
    const q = query(
      collection(db, "connectionRequests"),
      where("from", "==", userId),
      where("status", "==", "pending")
    );
    
    const querySnapshot = await getDocs(q);
    const requests = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return requests;
  } catch (error) {
    console.error("Error getting sent requests:", error);
    return [];
  }
};

// Get all pending requests received by a user
export const getReceivedRequests = async (userId) => {
  try {
    const q = query(
      collection(db, "connectionRequests"),
      where("to", "==", userId),
      where("status", "==", "pending")
    );
    
    const querySnapshot = await getDocs(q);
    const requests = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return requests;
  } catch (error) {
    console.error("Error getting received requests:", error);
    return [];
  }
};

// Accept a connection request
export const acceptConnectionRequest = async (requestId) => {
  try {
    const requestRef = doc(db, "connectionRequests", requestId);
    const requestSnap = await getDoc(requestRef);
    
    if (!requestSnap.exists()) {
      throw new Error("Request not found");
    }
    
    const requestData = requestSnap.data();
    
    // Update request status
    await updateDoc(requestRef, { status: "accepted" });
    
    // Create a connection document
    await addDoc(collection(db, "connections"), {
      users: [requestData.from, requestData.to],
      createdAt: new Date()
    });
    
    // Update both users' documents to include the connection
    const userRef1 = doc(db, "users", requestData.from);
    const userRef2 = doc(db, "users", requestData.to);
    
    const userSnap1 = await getDoc(userRef1);
    const userSnap2 = await getDoc(userRef2);
    
    if (userSnap1.exists()) {
      const userData1 = userSnap1.data();
      const connections = userData1.connections || [];
      await updateDoc(userRef1, {
        connections: [...connections, requestData.to]
      });
    }
    
    if (userSnap2.exists()) {
      const userData2 = userSnap2.data();
      const connections = userData2.connections || [];
      await updateDoc(userRef2, {
        connections: [...connections, requestData.from]
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error accepting connection request:", error);
    return { success: false, error };
  }
};

// Reject a connection request
export const rejectConnectionRequest = async (requestId) => {
  try {
    const requestRef = doc(db, "connectionRequests", requestId);
    await updateDoc(requestRef, { status: "rejected" });
    return { success: true };
  } catch (error) {
    console.error("Error rejecting connection request:", error);
    return { success: false, error };
  }
};

// Check if users are connected
export const checkConnection = async (userId1, userId2) => {
  try {
    const userRef = doc(db, "users", userId1);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return false;
    }
    
    const userData = userSnap.data();
    const connections = userData.connections || [];
    
    return connections.includes(userId2);
  } catch (error) {
    console.error("Error checking connection:", error);
    return false;
  }
};