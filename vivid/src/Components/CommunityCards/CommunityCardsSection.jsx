import React, { useRef, useEffect, useState } from "react";
import CommunityCard from "./CommunityCard";
import "./CommunityCardsSection.css";
import { getPublicGroups } from "../../services/groupService";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../assets/Loader";

function CommunityCardsSection() {
  const containerRef = useRef(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Fetch groups from Firestore
  useEffect(() => {
    // Inside the fetchGroups function, after getting the groups:
    
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
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (groups.length === 0) return; // Don't set up scrolling if no groups
    
    const container = containerRef.current;

    const interval = setInterval(() => {
      if (!container) return;

      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0; // Reset to start when fully scrolled
      } else {
        container.scrollLeft += 500; // Small smooth step
      }
    }, 3000); // Move every 3 seconds

    return () => clearInterval(interval); // Cleanup
  }, [groups]);

  // Then replace the loading section:
   if (loading) {
      return (
        <div className="community-cards-container">
          <div className="loading-container">
            <Loader size="50" speed="1.75" color="yellow" />
          </div>
        </div>
      );
    }

  return (
    <div className="community-cards-container">
      <div className="community-cards-section" ref={containerRef}>
        {groups.length > 0 ? (
          groups.map((group) => (
            <CommunityCard
              key={group.id}
              id={group.id}
              title={group.name}
              description={group.bio || group.info} // Support both formats
              createdAt={group.createdAt ? group.createdAt.toDate() : ""}
              memberCount={group.members ? group.members.length : 0}
              category={group.type || ""}
              groupPic={group.groupPic || ""}
            />
          ))
        ) : (
          <div className="no-groups-message">
            <p>No communities found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunityCardsSection;
