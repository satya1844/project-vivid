import React, { useState, useEffect } from "react";
import { useAuth } from "../../src/context/AuthContext";
import ChatList from "../../src/Components/chat/ChatList";
import ChatWindow from "../../src/Components/chat/chatWindow";
import ConnectionRequestList from "../../src/Components/connections/ConnectionRequestList";
import { getUserChats } from "../../src/services/chatService";
import { getIncomingRequests } from "../../src/services/connectionService";
import "./ChatPage.css";

const ChatPage = () => {
  const { currentUser } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [activeTab, setActiveTab] = useState("chats");
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const fetchChats = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const userChats = await getUserChats(currentUser.uid);
          setChats(userChats);
          
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

  const handleSelectChat = (chatId, userData) => {
    setSelectedChat(chatId);
    setOtherUser(userData);
    setActiveTab("chats"); // Switch to chats tab when selecting a chat
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
      <div className="chat-tabs">
        <button
          className={`tab ${activeTab === "chats" ? "active" : ""}`}
          onClick={() => setActiveTab("chats")}
        >
          // Add this at the beginning of your return statement
          <h1>Messages & Connections</h1>
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
        <div className="chat-content">
          <div className="chat-sidebar">
            <ChatList
              chats={chats}
              loading={loading}
              onSelectChat={handleSelectChat}
              selectedChatId={selectedChat}
            />
          </div>
          <div className="chat-main">
            {selectedChat ? (
              <ChatWindow chatId={selectedChat} otherUser={otherUser} />
            ) : (
              <div className="no-chat-selected">
                <h3>Select a conversation</h3>
                <p>Choose a chat from the list or start a new conversation</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <ConnectionRequestList />
      )}
    </div>
  );
};

export default ChatPage;