import React from 'react';
import './UserdashBoard.css';
import profileBanner from '../../src/assets/ProfileBanner.png';
import profilePic from '../../src/assets/ProfilePic.png';
import editPen from '../../src/assets/editPen.svg';

function UserdashBoard() {
  return (
    <div className="user-dash-board">
      <div className="profile-header">
        <img className="banner-image" src={profileBanner} alt="Banner" />
        <div className="profile-picture-wrapper">
          <img className="profile-picture" src={profilePic} alt="Profile" />
        </div>
      </div>
      <div className="dashboard-main-content">
        <div className="dashboard-header-row">
          <h2 className="username">Vinay Damarasing</h2>
          <button className="edit-icon-btn" aria-label="Edit profile">
            <img src={editPen} alt="Edit" className="edit-icon-img" />
          </button>
        </div>
        <div className="bio-yellow-box">
          <b>
            Blending soul with sound, rhythm with reality.”<br />
            I’m Vinay, a self-taught musician and sound explorer from Hyderabad. Whether it’s late-night lo-fi loops, lyrical storytelling, or heart-thumping beats — I create music that speaks to moments.<br />
            From studio sessions to open mic nights, I believe in music that feels — not just sounds.
          </b>
        </div>
        <div className="meta-info">
          <span><b>Genre:</b> Indie Pop | Lo-fi | Hip-Hop |<br />Classical Fusion</span><br />
          <span><b>Based in:</b> Hyderabad</span><br />
          <span><b>Let’s jam or collab:</b> vinay@gmail.com</span>
        </div>
        <div className="hobbies-card">
          <button className="edit-icon-btn hobbies-edit" aria-label="Edit hobbies">
            <img src={editPen} alt="Edit" className="edit-icon-img" />
          </button>
          <div className="hobbies-section">
            <div className="hobbies-header">
              <span className="hobbies-title">Hobbies | Interests</span>
            </div>
            <ul className="hobby-list">
              <li><span role="img" aria-label="guitar">🎸</span> Playing Guitar</li>
              <li><span role="img" aria-label="camera">📷</span> Photography</li>
              <li><span role="img" aria-label="ai">✨</span> Learning AI Stuff</li>
            </ul>
            <div className="mood-header">Current Mood</div>
            <ul className="mood-list">
              <li>Looking to learn Baking</li>
              <li>Ready to teach Music</li>
            </ul>
          </div>
          <button className="lets-connect-btn">Lets Connect !</button>
        </div>
      </div>
    </div>
  );
}

export default UserdashBoard;