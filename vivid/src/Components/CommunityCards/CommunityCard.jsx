import React from "react";
import "./CommunityCard.css";

const CommunityCard = ({ name, info, admin, picture, members, tags }) => {
  return (
    <div className="community-card">
      <img src={picture} alt={name} className="community-card-image" />
      <h3 className="community-card-title">{name}</h3>
      <p className="community-card-info">{info}</p>
      <p className="community-card-admin">Admin: {admin}</p>
      <p className="community-card-members">{members} Members</p>
      <div className="community-card-tags">
        {tags.map((tag, index) => (
          <span key={index} className="community-card-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CommunityCard;
