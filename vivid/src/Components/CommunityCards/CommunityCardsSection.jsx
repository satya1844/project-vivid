import React, { useRef, useEffect } from "react";
import CommunityCard from "./CommunityCard";
import "./CommunityCardsSection.css";
import communityData from "./CommunityData";

function CommunityCardsSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const interval = setInterval(() => {
      if (!container) return;

      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0; // Reset to start when fully scrolled
      } else {
        container.scrollLeft += 500; // Small smooth step
      }
    }, 3000); // Move every 500ms (half a second)

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="community-cards-container">
      <div className="community-cards-section" ref={containerRef}>
        {communityData.map((community, index) => (
          <CommunityCard
            key={index}
            title={community.name}
            description={community.info}
          />
        ))}
      </div>
    </div>
  );
}

export default CommunityCardsSection;
