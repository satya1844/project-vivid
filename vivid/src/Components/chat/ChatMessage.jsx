import React, { useState, useRef, useEffect } from "react";
import "./ChatMessage.css";

const ChatMessage = ({ message, isCurrentUser, onDeleteMessage }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef(null);
  const messageRef = useRef(null);

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle right click on message
  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // Handle click on message to show/hide details
  const handleMessageClick = () => {
    setShowDetails(!showDetails);
  };

  // Handle delete message
  const handleDeleteMessage = () => {
    if (onDeleteMessage) {
      onDeleteMessage(message.id);
    }
    setShowContextMenu(false);
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

  return (
    <div 
      className={`message ${isCurrentUser ? 'message-sent' : 'message-received'}`}
      onContextMenu={handleContextMenu}
      onClick={handleMessageClick}
      ref={messageRef}
    >
      <div className="message-content">
        <p>{message.content || message.text}</p>
        {showDetails && (
          <div className="message-footer">
            <span className="message-time">
              {formatTime(message.timestamp)}
            </span>
            {isCurrentUser && (
              <span className="message-status">
                {message.read ? "Read" : "Sent"}
              </span>
            )}
          </div>
        )}
      </div>

      {showContextMenu && (
        <div 
          className="context-menu" 
          ref={contextMenuRef}
        >
          <ul>
            {isCurrentUser && (
              <li className="delete-option" onClick={handleDeleteMessage}>Delete Message</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;