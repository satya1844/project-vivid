import React, { useState } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import './UserDashBoard.css';

import profileBanner from '../../src/assets/placeholder-banner.png';
import placeholderProfilePic from '../../src/assets/ProfilePic.png';
import editPen from '../../src/assets/editPen.svg';
import EditProfile from '../editProfile/EditProfile'; // Import the EditProfile modal

function UserDashBoard() {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const handleEditClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="user-dash-board">
      {/* Profile Banner */}
      <div className="profile-banner">
        <img src={profileBanner} alt="Profile Banner" className="banner-img" />
        <div className="profile-pic-container">
          {/* Use the user's photoURL if it exists, otherwise use the placeholder */}
          <img
            src={currentUser?.photoURL || placeholderProfilePic}
            alt="Profile"
            className="profile-pic"
            onError={(e) => {
              e.target.src = placeholderProfilePic; // Fallback to placeholder if the image fails to load
            }}
          />
          <button className="edit-btn" onClick={handleEditClick}>
            <img src={editPen} alt="Edit" />
          </button>
        </div>
      </div>

      {/* User Info Section */}
      <div className="user-info-section">
        <h2 className="username">{currentUser?.displayName || 'Vinay Damarasing'}</h2>
        <p className="user-bio">
          Blending soul with sound, rhythm with reality.
          <br />
          I’m Vinay, a self-taught musician and sound explorer from Hyderabad.
          <br />
          From studio sessions to open mic nights, I believe in music that feels — not just sounds.
        </p>
        <div className="user-meta">
          <p><strong>Genre:</strong> Indie Pop | Lo-fi | Hip-Hop | Classical Fusion</p>
          <p><strong>Based in:</strong> Hyderabad</p>
          <p><strong>Let’s jam or collab:</strong> vinay@gmail.com</p>
        </div>
      </div>

      {/* Hobbies Section */}
      <div className="hobbies-section">
        <div className="section-header">
          <h3>Hobbies | Interests</h3>
          <button className="edit-btn" onClick={handleEditClick}>
            <img src={editPen} alt="Edit" />
          </button>
        </div>
        <ul className="hobbies-list">
          <li>🎸 Playing Guitar</li>
          <li>📸 Photography</li>
          <li>🤖 Learning AI Stuff</li>
          <li>🍰 Looking to learn Baking</li>
          <li>🎶 Ready to teach Music</li>
        </ul>
      </div>

      {/* Current Mood Section */}
      <div className="mood-section">
        <h3>Current Mood</h3>
        <p>🎵 Feeling chill and creative</p>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && <EditProfile onClose={handleCloseModal} />}
    </div>
  );
}

export default UserDashBoard;
