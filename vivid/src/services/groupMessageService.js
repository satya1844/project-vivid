import { collection, addDoc, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../config/authConfig";

// Send a message to a group
export const sendGroupMessage = async (groupId, userId, text) => {
  try {
    const messageData = {
      from: userId,
      text,
      createdAt: Timestamp.now()
    };
    
    await addDoc(
      collection(db, "groupMessages", groupId, "messages"),
      messageData
    );
    
    return { success: true };
  } catch (error) {
    console.error("Error sending group message:", error);
    return { success: false, error: error.message };
  }
};

// Subscribe to real-time group messages
export const subscribeToGroupMessages = (groupId, callback) => {
  try {
    const q = query(
      collection(db, "groupMessages", groupId, "messages"),
      orderBy("createdAt", "asc")
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    });
  } catch (error) {
    console.error("Error subscribing to group messages:", error);
    return () => {}; // Return empty unsubscribe function
  }
};