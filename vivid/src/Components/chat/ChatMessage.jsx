import React from "react";
import "./ChatMessage.css";

const ChatMessage = ({ message, isCurrentUser }) => {
  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message ${isCurrentUser ? 'message-sent' : 'message-received'}`}>
      <div className="message-content">
        <p>{message.content || message.text}</p>
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
      </div>
    </div>
  );
};

export default ChatMessage;