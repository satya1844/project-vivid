import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatBotModal.css';
import { startChat, generateResponse } from '../../config/openRouterConfig';

const ChatBotModal = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hi! 👋 I\'m Vivi!. I can help you with any questions you have, and I\'m also knowledgeable about the Vivid platform!',
      options: [
        '💡 Tell me something interesting',
        '🤔 Let\'s have a chat',
        '❓ Ask me anything',
        '🎯 Vivid platform help'
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initChat = async () => {
      try {
        const initialMessages = await startChat();
        setChatHistory(initialMessages);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setMessages(prev => [...prev, {
          type: 'bot',
          content: 'I apologize, but I had trouble connecting. Please try again.',
          options: []
        }]);
      }
    };
    initChat();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setMessage('');
    setIsTyping(true);

    try {
      // Add user message to chat history
      const updatedHistory = [...chatHistory, { role: 'user', content: userMessage }];
      
      const response = await generateResponse(updatedHistory, userMessage);
      
      // Update chat history with both user message and assistant response
      setChatHistory([...updatedHistory, { role: 'assistant', content: response }]);
      
      setMessages(prev => [...prev, {
        type: 'bot',
        content: response,
        options: []
      }]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage = error.message?.includes('429') 
        ? 'I apologize, but I\'ve hit my rate limit. Please wait a moment before trying again.'
        : 'I apologize, but I encountered an error. Please try again.';
      
      setMessages(prev => [...prev, {
        type: 'bot',
        content: errorMessage,
        options: []
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOptionClick = async (option) => {
    setMessages(prev => [...prev, { type: 'user', content: option }]);
    setIsTyping(true);

    try {
      // Add user option to chat history
      const updatedHistory = [...chatHistory, { role: 'user', content: option }];
      
      const response = await generateResponse(updatedHistory, option);
      
      // Update chat history with both user option and assistant response
      setChatHistory([...updatedHistory, { role: 'assistant', content: response }]);
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: response,
        options: []
      }]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage = error.message?.includes('429')
        ? 'I apologize, but I\'ve hit my rate limit. Please wait a moment before trying again.'
        : 'I apologize, but I encountered an error. Please try again.';
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: errorMessage,
        options: []
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatMessageContent = (content) => {
    // Convert double asterisks to HTML bold tags
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Ensure proper spacing after periods
    content = content.replace(/\.(?=[A-Za-z])/g, '. ');
    
    // Add proper line breaks for lists
    content = content.replace(/•/g, '\n•');
    
    // Ensure proper spacing around emojis
    content = content.replace(/([\u{1F300}-\u{1F9FF}])/gu, ' $1 ').trim();
    
    return content;
  };

  const MessageContent = ({ content }) => {
    const formattedContent = formatMessageContent(content);
    return (
      <div 
        className="message-content"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    );
  };

  return (
    <div className="chatbot-modal-overlay" onClick={(e) => e.target.className === 'chatbot-modal-overlay' && onClose()}>
      <div className="chatbot-modal">
        <div className="chatbot-header">
          <h3>Vivi! your buddy here😁</h3>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              <MessageContent content={msg.content} />
              {msg.options && msg.options.length > 0 && (
                <div className="message-options">
                  {msg.options.map((option, optIndex) => (
                    <button 
                      key={optIndex} 
                      onClick={() => handleOptionClick(option)}
                      className="option-button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="message bot">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows="1"
          />
          <button 
            className="send-button"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotModal;
