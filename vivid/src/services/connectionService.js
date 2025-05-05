import { collection, addDoc, query, where, getDocs, updateDoc, doc, arrayUnion, deleteDoc, Timestamp, getDoc } from "firebase/firestore";
import { db } from "../config/authConfig";

// Send a connection request
export const sendConnectionRequest = async (fromUserId, toUserId) => {
  try {
    // Check if request already exists
    const existingRequest = await checkExistingRequest(fromUserId, toUserId);
    if (existingRequest) {
      return { success: false, message: "A request already exists between these users" };
    }
    
    // Create new request
    const requestData = {
      from: fromUserId,
      to: toUserId,
      status: "pending",
      timestamp: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, "connectionRequests"), requestData);
    return { success: true, requestId: docRef.id };
  } catch (error) {
    console.error("Error sending connection request:", error);
    return { success: false, message: error.message };
  }
};

// Check if a request already exists between users
const checkExistingRequest = async (user1Id, user2Id) => {
  const q1 = query(
    collection(db, "connectionRequests"),
    where("from", "==", user1Id),
    where("to", "==", user2Id)
  );
  
  const q2 = query(
    collection(db, "connectionRequests"),
    where("from", "==", user2Id),
    where("to", "==", user1Id)
  );
  
  const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);
  return !snapshot1.empty || !snapshot2.empty;
};

// Get incoming connection requests for a user
export const getIncomingRequests = async (userId) => {
  try {
    const q = query(
      collection(db, "connectionRequests"),
      where("to", "==", userId),
      where("status", "==", "pending")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting incoming requests:", error);
    return [];
  }
};

// Get outgoing connection requests for a user
export const getOutgoingRequests = async (userId) => {
  try {
    const q = query(
      collection(db, "connectionRequests"),
      where("from", "==", userId),
      where("status", "==", "pending")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting outgoing requests:", error);
    return [];
  }
};

// Accept a connection request
export const acceptConnectionRequest = async (requestId) => {
  try {
    const requestRef = doc(db, "connectionRequests", requestId);
    // CORRECT
    const requestSnap = await getDoc(requestRef);
    
    if (!requestSnap.exists()) {
      return { success: false, message: "Request not found" };
    }
    
    const requestData = requestSnap.data();
    
    // Update request status
    await updateDoc(requestRef, { status: "accepted" });
    
    // Create a connection document
    const connectionData = {
      users: [requestData.from, requestData.to],
      createdAt: Timestamp.now()
    };
    
    const connectionRef = await addDoc(collection(db, "connections"), connectionData);
    
    return { success: true, connectionId: connectionRef.id };
  } catch (error) {
    console.error("Error accepting connection request:", error);
    return { success: false, message: error.message };
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
    return { success: false, message: error.message };
  }
};

// Get all connections for a user
export const getUserConnections = async (userId) => {
  try {
    const q = query(
      collection(db, "connections"),
      where("users", "array-contains", userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user connections:", error);
    return [];
  }
};