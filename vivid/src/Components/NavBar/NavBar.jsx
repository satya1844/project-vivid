import {React, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../config/authConfig";
import { getIncomingRequests } from "../../services/connectionService";
import logo from "../../assets/Logo.svg";
import "./NavBar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [pendingRequests, setPendingRequests] = useState(0);
  
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
      const unsubscribe = onSnapshot(
        query(
          collection(db, "connectionRequests"),
          where("to", "==", currentUser.uid),
          where("status", "==", "pending")
        ),
        (snapshot) => {
          setPendingRequests(snapshot.docs.length);
        }
      );
      
      return () => unsubscribe();
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

  // Remove the useEffect block that shows welcome message

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
                  Home
                </a>
              </li>
              <li className="navBar-item">
                <a href="#" className="navBar-link" onClick={() => handleNavigation("/explore")}>
                  Explore
                </a>
              </li>
              {currentUser && (
                <>
                  <li className="navBar-item">
                    <a href="#" className="navBar-link" onClick={() => handleNavigation("/userdashboard")}>
                      Dashboard
                    </a>
                  </li>
                  <li className="navBar-item">
                    <a href="#" className="navBar-link" onClick={() => handleNavigation("/people")}>
                      People
                    </a>
                  </li>
                  <li className="navBar-item">
                    <a href="#" className="navBar-link" onClick={() => handleNavigation("/chat")}>
                      Messages
                      {pendingRequests > 0 && (
                        <span className="notification-badge">{pendingRequests}</span>
                      )}
                    </a>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <button className="navBar-loginButton" onClick={handleAuthClick}>
            {currentUser ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
