import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RightBar.css';
import { getPublicGroups } from "../../services/groupService";
import Loader from "../../assets/Loader";

const RightBar = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialItems = 3;

  // Fetch groups from Firestore
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const publicGroups = await getPublicGroups();
        
        // Sort groups by member count (highest first)
        const sortedGroups = publicGroups.sort((a, b) => {
          const aMemberCount = a.members ? a.members.length : 0;
          const bMemberCount = b.members ? b.members.length : 0;
          return bMemberCount - aMemberCount;
        });
        
        setGroups(sortedGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleCommunityClick = (communityId) => {
    navigate(`/groups/${communityId}`);
  };

  if (loading) {
    return (
      <div className="rightbar">
        <h3 className="rightbar-title">Popular Communities</h3>
        <div className="loading-container">
          <Loader size="30" speed="1.5" color="yellow" />
        </div>
      </div>
    );
  }

  return (
    <div className={`rightbar ${isExpanded ? 'expanded' : ''}`}>
      <h3 className="rightbar-title">Popular Communities</h3>
      <div className="community-list">
        {groups.length > 0 ? (
          groups
            .slice(0, isExpanded ? groups.length : initialItems)
            .map((community) => (
              <div 
                key={community.id} 
                className="community-item"
                onClick={() => handleCommunityClick(community.id)}
              >
                <div className="community-avatar">
                  {community.groupPic ? (
                    <img src={community.groupPic} alt={community.name} className="community-avatar-img" />
                  ) : (
                    <div className="avatar-placeholder">
                      {community.name ? community.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                  )}
                </div>
                <div className="community-info">
                  <p className="community-name">{community.name}</p>
                  <p className="community-members">{community.members ? community.members.length : 0} members</p>
                  <p className="community-description">{community.bio || community.info || "No description available"}</p>
                </div>
              </div>
            ))
        ) : (
          <div className="no-communities-message">
            <p>No communities found.</p>
          </div>
        )}
      </div>
      {groups.length > initialItems && (
        <button className="see-more-btn" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'See less' : 'See more'}
        </button>
      )}
    </div>
  );
};

export default RightBar;