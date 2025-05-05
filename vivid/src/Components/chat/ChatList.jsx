import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./ChatList.css";

const ChatList = ({ chats, loading, onSelectChat, selectedChatId }) => {
  const { currentUser } = useAuth();

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // If less than 24 hours, show time
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If less than 7 days, show day of week
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="chat-list-container">
      <h2>Messages</h2>
      
      {loading ? (
        <p className="loading">Loading chats...</p>
      ) : chats.length > 0 ? (
        <div className="chats">
          {chats.map((chat) => {
            // Extract the other user's info
            const otherUserId = chat.users.find(id => id !== currentUser.uid);
            const otherUserData = chat.userData?.[otherUserId] || { name: "User" };
            
            return (
              <div 
                key={chat.id} 
                className={`chat-item ${selectedChatId === chat.id ? 'selected' : ''}`}
                onClick={() => onSelectChat(chat.id, {
                  id: otherUserId,
                  name: otherUserData.name || `${otherUserData.firstName || ''} ${otherUserData.lastName || ''}`,
                  photoURL: otherUserData.photoURL
                })}
              >
                <div className="chat-avatar">
                  {otherUserData.photoURL ? (
                    <img 
                      src={otherUserData.photoURL} 
                      alt={otherUserData.name || "User"} 
                      className="avatar-img"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {(otherUserData.name || "U").charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="chat-details">
                  <div className="chat-header">
                    <h3 className="chat-name">
                      {otherUserData.name || `${otherUserData.firstName || ''} ${otherUserData.lastName || ''}`}
                    </h3>
                    <span className="chat-time">{formatTime(chat.lastMessageTime)}</span>
                  </div>
                  
                  <p className="chat-last-message">
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-chats">
          <p>No conversations yet</p>
          <p className="hint">Connect with other users to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatList;