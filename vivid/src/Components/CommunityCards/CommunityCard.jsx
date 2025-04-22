// CommunityCard.jsx
import React from 'react';
import './CommunityCard.css';
import profilePic from '../../assets/profilepic.png'; // Use profile.png as the placeholder

const CommunityCard = ({ title, info, admin, members, tags }) => {
  return (
    <div className="community-card">
      <img src={profilePic} alt="Community" className="community-card-image" />
      <h3 className="community-card-title">{title}</h3>
      <p className="community-card-info">{info}</p>
      <p className="community-card-admin">Admin: {admin}</p>
      <p className="community-card-members">{members} members</p>
      <div className="community-card-tags">
        {tags.map((tag, index) => (
          <span key={index} className="community-card-tag">{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default CommunityCard;
