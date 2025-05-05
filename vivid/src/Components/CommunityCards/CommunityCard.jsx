import React from "react";
import { useNavigate } from "react-router-dom";
import "./CommunityCard.css";

const CommunityCard = ({ 
  id, 
  title = "", 
  description = "", 
  createdAt = "", 
  memberCount = 0, 
  category = "", 
  groupPic = "" 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (id) {
      navigate(`/groups/${id}`);
    }
  };

  // Format date if provided
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : "";

  return (
    <div className="community-card" onClick={handleCardClick}>
      <div className="community-card-header">
        {groupPic && (
          <div className="community-card-image-container">
            <img src={groupPic} alt={title} className="community-card-image" />
          </div>
        )}
      </div>
      
      <h3 className="community-card-title">{title}</h3>
      
      <div className="community-card-meta">
        {formattedDate && (
          <div className="community-card-date">
            <i className="far fa-calendar-alt"></i> {formattedDate}
          </div>
        )}
        
        <div className="community-card-members">
          <i className="fas fa-users"></i> {memberCount} members
        </div>
        
        {category && (
          <div className="community-card-category">
            <i className="fas fa-tag"></i> {category}
          </div>
        )}
      </div>
      
      <p className="community-card-description">{description}</p>
    </div>
  );
};

export default CommunityCard;
