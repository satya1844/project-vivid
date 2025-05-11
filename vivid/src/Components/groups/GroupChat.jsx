import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/authConfig";
import { sendGroupMessage, subscribeToGroupMessages } from "../../services/groupMessageService";
import "./GroupChat.css";
import EmojiPicker from 'emoji-picker-react';
import { FaSmile, FaPaperPlane } from 'react-icons/fa';

const GroupChat = ({ groupId }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState({});
  const messagesEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // Add state to track which messages have details showing
  const [messagesWithDetails, setMessagesWithDetails] = useState({});
  
  // Subscribe to messages
  useEffect(() => {
    if (!groupId || !currentUser) return;
    
    setLoading(true);
    
    const unsubscribe = subscribeToGroupMessages(groupId, async (updatedMessages) => {
      setMessages(updatedMessages);
      setLoading(false);
      
      // Get unique user IDs from messages
      const userIds = [...new Set(updatedMessages.map(msg => msg.from))];
      
      // Fetch user profiles for each sender
      const profiles = { ...userProfiles };
      
      for (const userId of userIds) {
        if (!profiles[userId]) {
          try {
            const userDoc = doc(db, "users", userId);
            const userSnapshot = await getDoc(userDoc);
            
            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              profiles[userId] = {
                name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Anonymous',
                photoURL: userData.photoURL || null
              };
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        }
      }
      
      setUserProfiles(profiles);
    });
    
    return () => unsubscribe();
  }, [groupId, currentUser]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !groupId || !currentUser) return;
    
    try {
      await sendGroupMessage(groupId, currentUser.uid, newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };
  
  // Add function to toggle message details
  const toggleMessageDetails = (messageId) => {
    setMessagesWithDetails(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };
  
  return (
    <div className="group-chat-container">
      <div className="group-messages-container">
        {loading ? (
          <div className="loading-messages">Loading messages...</div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((message) => {
              const isCurrentUser = message.from === currentUser?.uid;
              const profile = userProfiles[message.from] || { name: "User" };
              const showDetails = messagesWithDetails[message.id] || false;
              
              return (
                <div 
                  key={message.id} 
                  className={`group-message ${isCurrentUser ? 'message-sent' : 'message-received'}`}
                  onClick={() => toggleMessageDetails(message.id)}
                >
                  {!isCurrentUser && (
                    <div className="message-avatar">
                      {profile.photoURL ? (
                        <img src={profile.photoURL} alt={profile.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {profile.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="message-content">
                    {!isCurrentUser && (
                      <div className="message-sender">
                        {profile.name}
                      </div>
                    )}
                    <p>{message.text}</p>
                    {showDetails && (
                      <div className="message-footer">
                        <span className="message-time">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="no-messages">
            <p>No messages yet</p>
            <p className="hint">Be the first to send a message!</p>
          </div>
        )}
      </div>
      
      <form className="group-message-form" onSubmit={handleSendMessage}>
        {showEmojiPicker && (
          <div className="emoji-picker-container whatsapp-style">
            <EmojiPicker 
              onEmojiClick={handleEmojiClick}
              width="100%"
              height="350px"
              previewConfig={{ showPreview: true }}
              searchPlaceholder="Search"
            />
          </div>
        )}
        
        <div className="message-input-container">
          <button 
            type="button" 
            className="emoji-button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FaSmile />
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="group-message-input"
          />
          
          {/* Send button */}
          <button 
            type="submit" 
            className="group-send-button"
            disabled={!newMessage.trim()}
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupChat;