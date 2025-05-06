import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CommunityDetailPage.css';
import communityData from '../../src/Components/CommunityCards/CommunityData';
import Loader from '../../src/assets/Loader';

const CommunityDetailPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const foundCommunity = communityData.find((c) => c.id === parseInt(id));
    setCommunity(foundCommunity);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="community-detail-loading">
        <Loader size="100" speed="1.75" color="yellow" />
      </div>
    );
  }

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