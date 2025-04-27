import React from 'react';
import { useParams } from 'react-router-dom';
import './CommunityDetailPage.css';
import communityData from '../../src/Components/CommunityCards/CommunityData';

const CommunityDetailPage = () => {
  const { id } = useParams();
  const community = communityData.find((c) => c.id === parseInt(id));

  if (!community) {
    return <div>Community not found</div>;
  }

  return (
    <div className="community-detail-page">
      <div className="community-header">
        <div className="community-avatar-large">
          <div className="avatar-placeholder"></div>
        </div>
        <div className="community-header-info">
          <h1>{community.name}</h1>
          <p className="community-description">{community.info}</p>
        </div>
      </div>
      <div className="community-content">
        {/* Add more community details here */}
      </div>
    </div>
  );
};

export default CommunityDetailPage;