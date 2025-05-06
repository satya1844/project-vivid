import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getChatMessages, sendMessage, subscribeToChatMessages, markMessagesAsRead, deleteMessage, deleteChat } from "../../services/chatService";
import ChatMessage from "./ChatMessage";
import "./ChatWindow.css";
import EmojiPicker from 'emoji-picker-react';
import { FaSmile, FaPaperPlane } from 'react-icons/fa';

const ChatWindow = ({ chatId, otherUser, onChatDeleted }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!chatId || !currentUser) return;

    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToChatMessages(chatId, async (updatedMessages) => {
      setMessages(updatedMessages);
      setLoading(false);
      
      // Mark messages as read whenever new messages arrive
      try {
        await markMessagesAsRead(chatId, currentUser.uid);
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });
    
    // Initial mark as read when opening chat
    markMessagesAsRead(chatId, currentUser.uid);
    
    return () => {
      unsubscribe(); // Cleanup subscription on unmount
    };
  }, [chatId, currentUser]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle right click on chat header
  const handleHeaderContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // Handle delete chat
  const handleDeleteChat = async () => {
    try {
      await deleteChat(chatId);
      if (onChatDeleted) {
        onChatDeleted(chatId);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
    setShowContextMenu(false);
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(chatId, messageId);
      // The messages will update automatically through the subscription
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !chatId || !currentUser) return;
    
    await sendMessage(chatId, currentUser.uid, newMessage.trim());
    setNewMessage("");
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
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
      <div 
        className="chat-header" 
        onContextMenu={handleHeaderContextMenu}
        ref={headerRef}
      >
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
                onDeleteMessage={handleDeleteMessage}
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
      
      // Update just the context menu part in the ChatWindow.jsx file
      
      {showContextMenu && (
        <div 
          className="context-menu" 
          style={{ 
            position: 'absolute',
            top: '50px', // Position below the header
            right: '10px',
            transform: 'none' // Override the default transform
          }}
          ref={contextMenuRef}
        >
          <ul>
            <li className="delete-option" onClick={handleDeleteChat}>Delete Chat</li>
          </ul>
        </div>
      )}
      
      <form className="message-form" onSubmit={handleSend}>
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
            className="message-input"
          />
          
          <button 
            type="submit" 
            className="send-button"
            disabled={!newMessage.trim()}
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;