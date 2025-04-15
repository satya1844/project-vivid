import React from "react";
import peopleData from "./peopleData";
import "./PeopleCardsContainer.css";

const PeopleCardsContainer = () => {
  return (
    <div className="people-cards-section">
      <div className="cards-scroll">
        {peopleData.map((person, index) => (
          <div className="people-card" key={index}>
            <img src={person.image} alt={person.name} />
            <div className="card-content">
              <h3>{person.name}</h3>
              <p>{person.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cta-section">
        <p>
          Discover new passions and connect with like-minded people! Every hobby opens the door to a
          community waiting to welcome you.
        </p>
        <span className="see-more">See More</span>
      </div>
    </div>
  );
};

export default PeopleCardsContainer;
