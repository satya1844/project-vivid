import { collection, addDoc, query, where, getDocs, orderBy, limit, onSnapshot, Timestamp, doc, getDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../config/authConfig";

// Create or get a chat between two users
export const getOrCreateChat = async (user1Id, user2Id) => {
  try {
    // Check if chat already exists
    const existingChat = await getChatBetweenUsers(user1Id, user2Id);
    if (existingChat) {
      return { success: true, chatId: existingChat.id, chatData: existingChat };
    }
    
    // Create new chat
    const chatData = {
      users: [user1Id, user2Id],
      createdAt: Timestamp.now(),
      lastMessage: null,
      lastMessageTime: null
    };
    
    const chatRef = await addDoc(collection(db, "chats"), chatData);
    return { success: true, chatId: chatRef.id, chatData: { id: chatRef.id, ...chatData } };
  } catch (error) {
    console.error("Error creating chat:", error);
    return { success: false, message: error.message };
  }
};

// Get chat between two users if it exists
const getChatBetweenUsers = async (user1Id, user2Id) => {
  try {
    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", user1Id)
    );
    
    const snapshot = await getDocs(q);
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Find chat that contains both users
    return chats.find(chat => chat.users.includes(user2Id));
  } catch (error) {
    console.error("Error getting chat between users:", error);
    return null;
  }
};

// Send a message in a chat
export const sendMessage = async (chatId, senderId, content) => {
  try {
    const messageData = {
      senderId,
      content,
      timestamp: Timestamp.now(),
      read: false
    };
    
    // Add message to subcollection
    const messageRef = await addDoc(
      collection(db, "chats", chatId, "messages"),
      messageData
    );
    
    // Update chat with last message info
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      lastMessage: content,
      lastMessageTime: Timestamp.now(),
      lastMessageSenderId: senderId
    });
    
    return { success: true, messageId: messageRef.id };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, message: error.message };
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
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user chats:", error);
    return [];
  }
};

// Get messages for a chat with pagination
export const getChatMessages = async (chatId, limit = 20) => {
  try {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "desc"),
      limit(limit)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).reverse(); // Reverse to get chronological order
  } catch (error) {
    console.error("Error getting chat messages:", error);
    return [];
  }
};

// Subscribe to real-time updates for a chat
export const subscribeToChatMessages = (chatId, callback) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp", "asc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};

// Mark messages as read
// Mark messages as read
export const markMessagesAsRead = async (chatId, userId) => {
  try {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      where("senderId", "!=", userId),
      where("read", "==", false)
    );
    
    const snapshot = await getDocs(q);
    const batch = writeBatch(db); // Use writeBatch instead of db.batch()
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { success: false, message: error.message };
  }
};

// Add these functions to your existing chatService.js file

// Delete a message
export const deleteMessage = async (chatId, messageId) => {
  try {
    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    await updateDoc(messageRef, {
      deleted: true,
      content: "This message was deleted",
      text: "This message was deleted" // For compatibility with both content and text fields
    });
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

// Delete an entire chat
export const deleteChat = async (chatId) => {
  try {
    // Mark chat as deleted (soft delete)
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      deleted: true,
      deletedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};