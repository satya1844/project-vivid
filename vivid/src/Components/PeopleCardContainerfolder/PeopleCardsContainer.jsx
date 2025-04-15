import React from "react";
import peopleData from "./peopleData";
import PeopleCard from "./PeopleCard";
import "./PeopleCardsContainer.css";

const PeopleCardsContainer = () => {
  return (
    <div className="people-cards-section">
      <div className="cards-scroll">
        {peopleData.map((person, index) => (
          <PeopleCard
            key={index}
            name={person.name}
            image={person.image}
            description={person.description}
          />
        ))}
      </div>
      <div className="cta-section reduced-width">
        <p>
          Discover new passions and connect with like-minded people! Every hobby opens the door to a
          community waiting to welcome you.
        </p>
        
      </div>
    </div>
  );
};

export default PeopleCardsContainer;
