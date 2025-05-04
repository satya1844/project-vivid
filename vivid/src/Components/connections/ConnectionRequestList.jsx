import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getSentRequests, getReceivedRequests, acceptConnectionRequest, rejectConnectionRequest } from "../../services/connectionFunctions";
import "./ConnectionRequestList.css";

const ConnectionRequestList = () => {
  const { currentUser } = useAuth();
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("received");

  useEffect(() => {
    const fetchRequests = async () => {
      if (currentUser) {
        setLoading(true);
        const sent = await getSentRequests(currentUser.uid);
        const received = await getReceivedRequests(currentUser.uid);
        
        setSentRequests(sent);
        setReceivedRequests(received);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUser]);

  const handleAccept = async (requestId) => {
    const result = await acceptConnectionRequest(requestId);
    if (result.success) {
      // Remove from received requests list
      setReceivedRequests(receivedRequests.filter(req => req.id !== requestId));
    }
  };

  const handleReject = async (requestId) => {
    const result = await rejectConnectionRequest(requestId);
    if (result.success) {
      // Remove from received requests list
      setReceivedRequests(receivedRequests.filter(req => req.id !== requestId));
    }
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
          <p>Loading requests...</p>
        ) : activeTab === "received" ? (
          receivedRequests.length > 0 ? (
            receivedRequests.map((request) => (
              <div key={request.id} className="request-item">
                <div className="request-info">
                  <p>From: {request.from}</p>
                  <p className="timestamp">{new Date(request.timestamp.seconds * 1000).toLocaleString()}</p>
                </div>
                <div className="request-actions">
                  <button 
                    className="accept-btn"
                    onClick={() => handleAccept(request.id)}
                  >
                    Accept
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleReject(request.id)}
                  >
                    Reject
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
                <p>To: {request.to}</p>
                <p className="timestamp">{new Date(request.timestamp.seconds * 1000).toLocaleString()}</p>
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