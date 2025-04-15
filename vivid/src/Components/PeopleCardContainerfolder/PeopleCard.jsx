import React from "react";
import "./PeopleCard.css";

const PeopleCard = ({ name, image, description }) => {
  return (
    <div className="people-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
};

export default PeopleCard;
