import React from "react";
import CommunityCard from "./CommunityCard";
import communityData from "./CommunityData";
import "./CommunityCardsSection.css";

function CommunityCardsSection() {
  return (
    <div className="community-cards-section">
      {communityData.map((community, index) => (
        <CommunityCard
          key={index}
          name={community.name}
          info={community.info}
          admin={community.admin}
          picture={community.picture}
          members={community.members}
          tags={community.tags}
        />
      ))}
    </div>
  );
}

export default CommunityCardsSection;