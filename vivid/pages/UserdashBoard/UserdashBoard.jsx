import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import './UserdashBoard.css';

import profileBanner from '../../src/assets/ProfileBanner.png';
import profilePic from '../../src/assets/ProfilePic.png';
import editPen from '../../src/assets/editPen.svg';
import DotOrnament from '../../src/assets/DotOrnament.svg';

function UserDashBoard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [samplePosts] = useState([
    { image: 'https://via.placeholder.com/300', caption: 'My first music composition!' },
    { image: 'https://via.placeholder.com/300', caption: 'Jamming with friends' },
  ]);

  const handleEditClick = () => {
    navigate('/editProfile');
  };

  return (
    <div className="user-dash-board">
      {/* Dot Ornament */}
      <img src={DotOrnament} alt="Dot Ornament" className="dot-ornament" />

      {/* Profile Banner */}
      <div className="profile-banner">
        <img src={profileBanner} alt="Profile Banner" className="banner-img" />
        <img src={profilePic} alt="Profile" className="profile-pic" />
        <button className="edit-btn banner-edit" onClick={handleEditClick}>
          <img src={editPen} alt="Edit" />
        </button>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        
        {/* User Info */}
        <div className="user-info-section">
          <h2 className="username">{currentUser?.displayName || 'Vinay Damarasing'}</h2>
          <p className="user-bio">
            "Blending soul with sound, rhythm with reality."
            <br />
            I’m Vinay, a self-taught musician and sound explorer from Hyderabad.
            <br />
            From late-night lo-fi loops to heart-thumping beats — I create music that speaks to moments.
          </p>

          <div className="user-meta">
            <p><strong>Genre:</strong> Indie Pop | Lo-fi | Hip-Hop | Classical Fusion</p>
            <p><strong>Based in:</strong> Hyderabad</p>
            <p><strong>Let’s jam or collab:</strong> vinay@gmail.com</p>
          </div>

          <button className="connect-btn" onClick={() => console.log('Connect clicked')}>
            Let's Connect!
          </button>
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
            <li>🍰 Looking to Learn Baking</li>
            <li>🎶 Ready to Teach Music</li>
          </ul>
        </div>

        {/* Current Mood */}
        <div className="mood-section">
          <h3>Current Mood</h3>
          <p>🎵 Feeling chill and creative</p>
        </div>

        {/* Posts Section */}
        <div className="posts-section">
          <h3 className="posts-title">Posts</h3>

          {samplePosts.length === 0 ? (
            <div className="no-posts">
              No posts yet. Time to drop your first masterpiece! 🎶
            </div>
          ) : (
            <div className="posts-grid">
              {samplePosts.map((post, index) => (
                <div key={index} className="post-card">
                  <img src={post.image} alt="Post" className="post-img" />
                  <p className="post-caption">{post.caption}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default UserDashBoard;
