// Functions for handling chat messages
import { collection, addDoc, query, where, orderBy, limit, getDocs, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../config/authConfig";

// Create a new chat or get existing chat between two users
export const getOrCreateChat = async (userId1, userId2) => {
  try {
    // Check if a chat already exists between these users
    const q1 = query(
      collection(db, "chats"),
      where("users", "array-contains", userId1)
    );
    
    const querySnapshot = await getDocs(q1);
    let chatId = null;
    
    querySnapshot.forEach((doc) => {
      const chatData = doc.data();
      if (chatData.users.includes(userId2)) {
        chatId = doc.id;
      }
    });
    
    // If chat doesn't exist, create a new one
    if (!chatId) {
      const newChatRef = await addDoc(collection(db, "chats"), {
        users: [userId1, userId2],
        createdAt: new Date(),
        lastMessage: null,
        lastMessageTime: null
      });
      
      chatId = newChatRef.id;
    }
    
    return chatId;
  } catch (error) {
    console.error("Error getting or creating chat:", error);
    return null;
  }
};

// Send a message in a chat
export const sendMessage = async (chatId, senderId, text) => {
  try {
    const messageData = {
      chatId,
      senderId,
      text,
      timestamp: new Date(),
      read: false
    };
    
    // Add message to the messages subcollection
    await addDoc(collection(db, `chats/${chatId}/messages`), messageData);
    
    // Update the chat document with the last message
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageTime: new Date()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error };
  }
};

// Get all chats for a user
export const getUserChats = async (userId) => {
  try {
    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", userId),
      orderBy("lastMessageTime", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const chats = [];
    
    for (const doc of querySnapshot.docs) {
      const chatData = doc.data();
      const otherUserId = chatData.users.find(id => id !== userId);
      
      // Get the other user's details
      const userRef = doc(db, "users", otherUserId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        
        chats.push({
          id: doc.id,
          otherUser: {
            id: otherUserId,
            name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || 'Anonymous',
            photoURL: userData.photoURL || ''
          },
          lastMessage: chatData.lastMessage,
          lastMessageTime: chatData.lastMessageTime
        });
      }
    }
    
    return chats;
  } catch (error) {
    console.error("Error getting user chats:", error);
    return [];
  }
};

// Get messages for a specific chat
export const getChatMessages = async (chatId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() // Convert Firestore timestamp to JS Date
      });
    });
    
    return messages.reverse(); // Return in chronological order
  } catch (error) {
    console.error("Error getting chat messages:", error);
    return [];
  }
};

// Subscribe to real-time updates for a chat
export const subscribeToChatMessages = (chatId, callback) => {
  try {
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("timestamp", "asc")
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        });
      });
      
      callback(messages);
    });
  } catch (error) {
    console.error("Error subscribing to chat messages:", error);
    return () => {}; // Return empty unsubscribe function
  }
};