import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RightBar.css';
import communityData from "../CommunityCards/CommunityData";

const RightBar = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const initialItems = 3;

  const handleCommunityClick = (communityId) => {
    navigate(`/community/${communityId}`);
  };

  return (
    <div className={`rightbar ${isExpanded ? 'expanded' : ''}`}>
      <h3 className="rightbar-title">Popular Communities</h3>
      <div className="community-list">
        {communityData
          .slice(0, isExpanded ? communityData.length : initialItems)
          .map((community) => (
            <div 
              key={community.id} 
              className="community-item"
              onClick={() => handleCommunityClick(community.id)}
            >
              <div className="community-avatar">
                <div className="avatar-placeholder"></div>
              </div>
              <div className="community-info">
                <p className="community-name">{community.name}</p>
                <p className="community-description">{community.info}</p>
              </div>
            </div>
        ))}
      </div>
      <button className="see-more-btn" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'See less' : 'See more'}
      </button>
    </div>
  );
};

export default RightBar;