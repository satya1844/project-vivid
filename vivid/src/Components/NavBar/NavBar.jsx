import {React, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../../config/authConfig";
import { getIncomingRequests } from "../../services/connectionService";
import logo from "../../assets/Logo.svg";
import "./NavBar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [pendingRequests, setPendingRequests] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  useEffect(() => {
    if (currentUser) {
      const fetchPendingRequests = async () => {
        try {
          const receivedRequests = await getIncomingRequests(currentUser.uid);
          setPendingRequests(receivedRequests.length);
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      };
      
      fetchPendingRequests();
      
      // Set up real-time listener for new requests
      const requestsUnsubscribe = onSnapshot(
        query(
          collection(db, "connectionRequests"),
          where("to", "==", currentUser.uid),
          where("status", "==", "pending")
        ),
        (snapshot) => {
          setPendingRequests(snapshot.docs.length);
        }
      );
      
      // Set up real-time listener for unread messages
      let messageUnsubscribers = [];
      
      // Set up polling for unread messages count
      const fetchUnreadCount = async () => {
        try {
          // Get all user's chats
          const chatsQuery = query(
            collection(db, "chats"),
            where("users", "array-contains", currentUser.uid)
          );
          
          const chatsSnapshot = await getDocs(chatsQuery);
          const chatIds = chatsSnapshot.docs.map(doc => doc.id);
          
          // Count total unread messages
          let totalUnread = 0;
          
          for (const chatId of chatIds) {
            const messagesQuery = query(
              collection(db, "chats", chatId, "messages"),
              where("senderId", "!=", currentUser.uid),
              where("read", "==", false)
            );
            
            const messagesSnapshot = await getDocs(messagesQuery);
            totalUnread += messagesSnapshot.docs.length;
          }
          
          setUnreadMessages(totalUnread);
        } catch (error) {
          console.error("Error fetching unread messages:", error);
        }
      };
      
      // Fetch initially
      fetchUnreadCount();
      
      // Set up interval to refresh every 5 seconds
      const intervalId = setInterval(fetchUnreadCount, 5000);
      
      // Clean up interval on unmount
      return () => {
        requestsUnsubscribe();
        clearInterval(intervalId);
        // Clean up any existing message listeners
        messageUnsubscribers.forEach(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        });
      };
    }
  }, [currentUser]);

  const handleAuthClick = async () => {
    if (currentUser) {
      try {
        await logout();
        toast.success("Successfully logged out!");
        navigate("/");
      } catch (error) {
        toast.error("Failed to log out!");
      }
    } else {
      navigate("/login");
    }
  };

  const handleNavigation = (path) => {
    if (!currentUser && path !== "/") {
      toast.error("Please login to access this feature!");
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <nav className="navBar">
      <div className="navBar-container">
        <div className="navBar-logo">
          <img src={logo} alt="Logo" className="logo" onClick={() => handleNavigation("/")} />
        </div>

        <div className="navBar-right">
          <nav className="navBar-navigation">
            <ul className="navBar-menu">
              <li className="navBar-item">
                <a href="#" className="navBar-link" onClick={() => handleNavigation("/")}>
                  <i className="fas fa-home nav-icon"></i>
                  <span className="nav-text">Home</span>
                </a>
              </li>
              <li className="navBar-item">
                <a href="#" className="navBar-link" onClick={() => handleNavigation("/explore")}>
                  <i className="fas fa-compass nav-icon"></i>
                  <span className="nav-text">Explore</span>
                </a>
              </li>
              {currentUser && (
                <>
                  <li className="navBar-item">
                    <a href="#" className="navBar-link" onClick={() => handleNavigation("/userdashboard")}>
                      <i className="fas fa-tachometer-alt nav-icon"></i>
                      <span className="nav-text">Dashboard</span>
                    </a>
                  </li>
                  <li className="navBar-item">
                    <a href="#" className="navBar-link" onClick={() => handleNavigation("/people")}>
                      <i className="fas fa-users nav-icon"></i>
                      <span className="nav-text">People</span>
                    </a>
                  </li>
                  <li className="navBar-item">
                    <a href="#" className="navBar-link" onClick={() => handleNavigation("/chat")}>
                      <i className="fas fa-comments nav-icon"></i>
                      <span className="nav-text">Messages</span>
                      {unreadMessages > 0 && (
                        <span className="notification-badge">{unreadMessages}</span>
                      )}
                    </a>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <button className="navBar-loginButton" onClick={handleAuthClick}>
            <i className="fas fa-sign-out-alt nav-icon login-icon"></i>
            <span className="login-text">{currentUser ? 'Logout' : 'Login'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
