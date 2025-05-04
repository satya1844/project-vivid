import React from "react";
import "./PeopleCard.css";
import { useNavigate } from "react-router-dom";

const PeopleCard = ({ name, image, userId, interests = [], lookingToLearn = [], openToCollab = [] }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/userprofile/${userId}`);
  };

  return (
    <div className="people-card" onClick={handleCardClick}>
      <img
        src={image} // Uses the image prop passed from the container
        alt={name + "'s profile"}
        className="people-card-profile-image" // Use the class for styling
        style={{
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          objectFit: 'cover', 
          marginRight: '15px'
        }}
        onError={(e) => { // Fallback if the image fails to load
          e.target.onerror = null; 
          e.target.src = placeholderProfilePic; 
        }}
      />
      <h3>{name}</h3>
      
      {/* Display interests */}
      <div className="card-section">
        <h4>Interests</h4>
        <div className="tags-container">
          {interests && interests.length > 0 ? (
            interests.slice(0, 2).map((interest, index) => (
              <span key={index} className="tag">{interest}</span>
            ))
          ) : (
            <span className="no-data">No interests listed</span>
          )}
        </div>
      </div>
      
      {/* Display learning goals */}
      <div className="card-section">
        <h4>Learning</h4>
        <div className="tags-container">
          {lookingToLearn && lookingToLearn.length > 0 ? (
            lookingToLearn.slice(0, 2).map((item, index) => (
              <span key={index} className="tag">{item}</span>
            ))
          ) : (
            <span className="no-data">No learning goals</span>
          )}
        </div>
      </div>
      
      {/* Display collaboration interests */}
      <div className="card-section">
        <h4>Open to Collaborate</h4>
        <div className="tags-container">
          {openToCollab && openToCollab.length > 0 ? (
            openToCollab.slice(0, 2).map((item, index) => (
              <span key={index} className="tag">{item}</span>
            ))
          ) : (
            <span className="no-data">Not specified</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;
