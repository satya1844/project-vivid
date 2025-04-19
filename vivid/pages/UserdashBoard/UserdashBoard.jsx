import React from 'react';
import './UserdashBoard.css';
import profileBanner from '../../src/assets/ProfileBanner.png';
import profilePic from '../../src/assets/ProfilePic.png';


function UserdashBoard() {
  return (
    <div className="user-dash-board">
      <div className="profile-header">
        <img className="banner-image" src={profileBanner} alt="Banner" />
        <div className="profile-picture-wrapper">
          <img className="profile-picture" src={profilePic} alt="Profile" />
        </div>
      </div>
      <div className="content">
        <h2 className="username">Vinay Damarasing</h2>
        <p className="bio">
          Blending soul with sound, rhythm with reality.” <br />
          I’m Vinay, a self-taught musician and sound explorer from Hyderabad...
        </p>
        {/* Add other content here */}
      </div>
    </div>
  );
}

export default UserdashBoard;