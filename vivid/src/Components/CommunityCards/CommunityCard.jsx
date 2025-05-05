import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { joinGroup } from "../../services/groupService";
import "./CommunityCard.css";

const CommunityCard = ({ id, title = "", description = "" }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [joining, setJoining] = useState(false);

  const handleCardClick = () => {
    if (id) {
      navigate(`/groups/${id}`);
    }
  };

  const handleJoinClick = async (e) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    try {
      setJoining(true);
      const result = await joinGroup(id, currentUser.uid);
      if (result.success) {
        // Show success feedback (you could add a toast notification here)
        console.log("Successfully joined group");
      }
    } catch (error) {
      console.error("Error joining group:", error);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="community-card" onClick={handleCardClick}>
      <div className="community-card-header">
        {/* Placeholder for icons or header content */}
      </div>
      <h3 className="community-card-title">{title}</h3>
      <p className="community-card-description">{description}</p>
      <div className="community-card-buttons">
        <button className="community-card-button">
          View Group
        </button>
        <button 
          className="community-card-join-button" 
          onClick={handleJoinClick}
          disabled={joining}
        >
          {joining ? "Joining..." : "Join"}
        </button>
      </div>
    </div>
  );
};

export default CommunityCard;
