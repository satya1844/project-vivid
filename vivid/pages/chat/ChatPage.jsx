import React, { useState, useEffect } from "react";
import { useAuth } from "../../src/context/AuthContext";
import ChatList from "../../src/Components/chat/ChatList";
import ChatWindow from "../../src/Components/chat/chatWindow";
import ConnectionRequestList from "../../src/Components/connections/ConnectionRequestList";
import { getUserChats, getOrCreateChat } from "../../src/services/chatService";
import { getIncomingRequests } from "../../src/services/connectionService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/authConfig";
import "./ChatPage.css";

const ChatPage = () => {
  const { currentUser } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [activeTab, setActiveTab] = useState("chats");
  const [pendingRequests, setPendingRequests] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [connectionTab, setConnectionTab] = useState("received");

  // Fetch chats and user data
  useEffect(() => {
    const fetchChats = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const userChats = await getUserChats(currentUser.uid);
          
          // Fetch user data for each chat
          const chatsWithUserData = await Promise.all(userChats.map(async (chat) => {
            const otherUserId = chat.users.find(id => id !== currentUser.uid);
            const userDoc = doc(db, "users", otherUserId);
            const userSnapshot = await getDoc(userDoc);
            
            return {
              ...chat,
              userData: {
                [otherUserId]: userSnapshot.exists() ? userSnapshot.data() : { name: "User" }
              }
            };
          }));
          
          setChats(chatsWithUserData);
          
          // Fetch pending requests count
          const receivedRequests = await getIncomingRequests(currentUser.uid);
          setPendingRequests(receivedRequests.length);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchChats();
  }, [currentUser]);

  // Check for selected user from dashboard
  useEffect(() => {
    const selectedUserId = localStorage.getItem('selectedChatUser');
    if (selectedUserId && currentUser) {
      const startChat = async () => {
        try {
          const userDoc = doc(db, "users", selectedUserId);
          const userSnapshot = await getDoc(userDoc);
          
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            
            const result = await getOrCreateChat(currentUser.uid, selectedUserId);
            
            if (result.success) {
              setSelectedChat(result.chatId);
              setOtherUser({
                id: selectedUserId,
                name: `${userData.firstName || ''} ${userData.lastName || ''}`,
                photoURL: userData.photoURL
              });
            } else {
              console.error("Failed to create or get chat:", result.message);
            }
          }
        } catch (error) {
          console.error("Error starting chat:", error);
        }
      };
      
      startChat();
      localStorage.removeItem('selectedChatUser');
    }
  }, [currentUser]);

  const handleSelectChat = (chatId, userData) => {
    setSelectedChat(chatId);
    setOtherUser(userData);
    setActiveTab("chats");
  };

  if (!currentUser) {
    return (
      <div className="chat-page-container">
        <div className="auth-message">
          <h2>Please log in to access your messages</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page-container">
      <div className={`chat-content ${selectedChat ? 'chat-active' : ''} ${showSidebar ? 'show-sidebar' : ''}`}>
        {/* Center area - Chat window */}
        <div className="chat-main">
          {selectedChat ? (
            <>
              <button 
                className="mobile-back-button" 
                onClick={() => setShowSidebar(true)}
              >
                ← Back to chats
              </button>
              <ChatWindow chatId={selectedChat} otherUser={otherUser} />
            </>
          ) : (
            <div className="no-chat-selected">
              <h3>Select a conversation</h3>
              <p>Choose a chat from the list or start a new conversation</p>
            </div>
          )}
        </div>
        
        {/* Right sidebar - Chat list */}
        <div className="chat-sidebar">
          <div className="chat-page-header">
            <h1>Messages & Connections</h1>
          </div>
          
          <div className="chat-tabs">
            <button
              className={`tab ${activeTab === "chats" ? "active" : ""}`}
              onClick={() => setActiveTab("chats")}
            >
              Messages
            </button>
            <button
              className={`tab ${activeTab === "requests" ? "active" : ""}`}
              onClick={() => setActiveTab("requests")}
            >
              Connection Requests
              {pendingRequests > 0 && <span className="tab-badge">{pendingRequests}</span>}
            </button>
          </div>
          
          {activeTab === "chats" ? (
            <ChatList
              chats={chats}
              loading={loading}
              onSelectChat={handleSelectChat}
              selectedChatId={selectedChat}
            />
          ) : (
            <>
              <div className="connection-tabs">
                <button 
                  className={`connection-tab ${connectionTab === "received" ? "active" : ""}`}
                  onClick={() => setConnectionTab("received")}
                >
                  Received Requests
                </button>
                <button
                  className={`connection-tab ${connectionTab === "sent" ? "active" : ""}`}
                  onClick={() => setConnectionTab("sent")}
                >
                  Sent Requests
                </button>
              </div>
              <ConnectionRequestList type={connectionTab} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;