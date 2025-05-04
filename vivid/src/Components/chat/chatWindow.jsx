import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getChatMessages, sendMessage, subscribeToChatMessages } from "../../services/chatService";
import ChatMessage from "./ChatMessage";
import "./ChatWindow.css";

const ChatWindow = ({ chatId, otherUser }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToChatMessages(chatId, (updatedMessages) => {
      setMessages(updatedMessages);
      setLoading(false);
    });
    
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [chatId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !chatId || !currentUser) return;
    
    await sendMessage(chatId, currentUser.uid, newMessage.trim());
    setNewMessage("");
  };

  if (!chatId || !otherUser) {
    return (
      <div className="chat-window-container empty">
        <p>Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="chat-window-container">
      <div className="chat-header">
        <div className="chat-user-info">
          {otherUser.photoURL ? (
            <img 
              src={otherUser.photoURL} 
              alt={otherUser.name} 
              className="user-avatar"
            />
          ) : (
            <div className="avatar-placeholder">
              {otherUser.name.charAt(0)}
            </div>
          )}
          <h3>{otherUser.name}</h3>
        </div>
      </div>
      
      <div className="messages-container">
        {loading ? (
          <div className="loading-messages">Loading messages...</div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentUser={message.senderId === currentUser?.uid}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="no-messages">
            <p>No messages yet</p>
            <p className="hint">Send a message to start the conversation</p>
          </div>
        )}
      </div>
      
      <form className="message-form" onSubmit={handleSave}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;