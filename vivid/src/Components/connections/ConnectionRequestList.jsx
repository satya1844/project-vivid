import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getSentRequests, getReceivedRequests, acceptConnectionRequest, rejectConnectionRequest } from "../../services/connectionFunctions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/authConfig";
import "./ConnectionRequestList.css";
import { toast } from "react-hot-toast";

const ConnectionRequestList = () => {
  const { currentUser } = useAuth();
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("received");
  const [processingRequests, setProcessingRequests] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  
  useEffect(() => {
    const fetchRequests = async () => {
      if (currentUser) {
        setLoading(true);
        const sent = await getSentRequests(currentUser.uid);
        const received = await getReceivedRequests(currentUser.uid);
        
        setSentRequests(sent);
        setReceivedRequests(received);
        
        // Collect all user IDs that need to be fetched
        const userIds = new Set();
        sent.forEach(req => userIds.add(req.to));
        received.forEach(req => userIds.add(req.from));
        
        // Fetch user details for each ID
        const userDetailsMap = {};
        for (const userId of userIds) {
          const userData = await fetchUserDetails(userId);
          userDetailsMap[userId] = userData;
        }
        
        setUserDetails(userDetailsMap);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUser]);

  // Function to fetch user details from Firestore
  const fetchUserDetails = async (userId) => {
    try {
      const userDoc = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDoc);
      
      if (userSnapshot.exists()) {
        return userSnapshot.data();
      }
      return null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  const handleAccept = async (requestId) => {
    try {
      setProcessingRequests(prev => [...prev, requestId]);
      
      const result = await acceptConnectionRequest(requestId);
      if (result.success) {
        setReceivedRequests(receivedRequests.filter(req => req.id !== requestId));
        toast.success("Connection request accepted!");
      } else {
        toast.error(result.message || "Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("An error occurred while accepting the request");
    } finally {
      setProcessingRequests(prev => prev.filter(id => id !== requestId));
    }
  };

  const handleReject = async (requestId) => {
    try {
      setProcessingRequests(prev => [...prev, requestId]);
      
      const result = await rejectConnectionRequest(requestId);
      if (result.success) {
        setReceivedRequests(receivedRequests.filter(req => req.id !== requestId));
        toast.success("Connection request rejected");
      } else {
        toast.error(result.message || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("An error occurred while rejecting the request");
    } finally {
      setProcessingRequests(prev => prev.filter(id => id !== requestId));
    }
  };

  // Get user's display name
  const getUserDisplayName = (userId) => {
    const user = userDetails[userId];
    if (user) {
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      } else if (user.firstName) {
        return user.firstName;
      } else if (user.username) {
        return user.username;
      }
    }
    return "Unknown User";
  };

  // Format timestamp to a more readable form
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} day ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="connection-requests-container">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === "received" ? "active" : ""}`}
          onClick={() => setActiveTab("received")}
        >
          Received Requests
        </button>
        <button 
          className={`tab ${activeTab === "sent" ? "active" : ""}`}
          onClick={() => setActiveTab("sent")}
        >
          Sent Requests
        </button>
      </div>

      <div className="requests-list">
        {loading ? (
          <p className="loading">Loading requests...</p>
        ) : activeTab === "received" ? (
          receivedRequests.length > 0 ? (
            receivedRequests.map((request) => (
              <div key={request.id} className="request-item">
                <div className="request-info">
                  <p>From: <strong>{getUserDisplayName(request.from)}</strong></p>
                  <p className="timestamp">{formatTimestamp(request.timestamp)}</p>
                </div>
                <div className="request-actions">
                  <button 
                    className="accept-btn"
                    onClick={() => handleAccept(request.id)}
                    disabled={processingRequests.includes(request.id)}
                  >
                    {processingRequests.includes(request.id) ? "Processing..." : "Accept"}
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleReject(request.id)}
                    disabled={processingRequests.includes(request.id)}
                  >
                    {processingRequests.includes(request.id) ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-requests">No connection requests received.</p>
          )
        ) : sentRequests.length > 0 ? (
          sentRequests.map((request) => (
            <div key={request.id} className="request-item sent">
              <div className="request-info">
                <p>To: <strong>{getUserDisplayName(request.to)}</strong></p>
                <p className="timestamp">{formatTimestamp(request.timestamp)}</p>
              </div>
              <div className="request-status">
                <span className="status pending">Pending</span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-requests">No connection requests sent.</p>
        )}
      </div>
    </div>
  );
};

export default ConnectionRequestList;