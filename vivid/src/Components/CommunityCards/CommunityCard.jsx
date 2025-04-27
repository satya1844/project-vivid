import React from "react";
import "./CommunityCard.css";

const CommunityCard = ({ title = "", description = "" }) => {
  return (
    <div className="community-card">
      <div className="community-card-header">
        {/* Placeholder for icons or header content */}
      </div>
      <h3 className="community-card-title">{title}</h3>
      <p className="community-card-description">{description}</p>
      <a href="#" className="community-card-button">
        Go to the Post
      </a>
    </div>
  );
};

export default CommunityCard;
