import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import './UserdashBoard.css';
import profileBanner from '../../src/assets/ProfileBanner.png';
import profilePic from '../../src/assets/ProfilePic.png';
import editPen from '../../src/assets/editPen.svg';
import DotOrnament from '../../src/assets/DotOrnament.svg';

function UserdashBoard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  
  // Add this if you want some sample posts
  const [samplePosts] = useState([
    {
      image: 'https://via.placeholder.com/300',
      caption: 'My first music composition!'
    },
    {
      image: 'https://via.placeholder.com/300',
      caption: 'Jamming with friends'
    }
  ]);

  const handleEditClick = () => {
    navigate('/editProfile');
  };

  const handleConnectClick = () => {
    // Add connect functionality here
    console.log('Connect clicked');
  };

  return (
    <div className="user-dash-board">
      <img src={DotOrnament} alt="Dot Ornament" className="DotOrnament" /> 
      <div className="bio-yellow-box">
        {/* ...existing profile header code... */}
      </div>
      <div className="dashboard-main-content">
        <div className="dashboard-header-row">
          <h2 className="username">{currentUser?.displayName || 'User'}</h2>
          <button className="edit-icon-btn" aria-label="Edit profile" onClick={handleEditClick}>
            <img src={editPen} alt="Edit" className="edit-icon-img" />
          </button>
        </div>
        
        {/* ...existing bio and meta info... */}
        
        <div className="hobbies-card">
          <button className="edit-icon-btn hobbies-edit" aria-label="Edit hobbies">
            <img src={editPen} alt="Edit" className="edit-icon-img" />
          </button>
          <div className="hobbies-section">
            {/* ...existing hobbies section... */}
          </div>
          <button className="lets-connect-btn" onClick={handleConnectClick}>
            Lets Connect !
          </button>
        </div>
      </div>
      <div className="posts-section">
        <h3 className="posts-title">Posts</h3>
        {samplePosts.length === 0 ? (
          <div className="no-posts-message">
            No posts yet. Time to drop your first masterpiece! 🎶
          </div>
        ) : (
          <div className="posts-grid">
            {samplePosts.map((post, index) => (
              <div className="post-card" key={index}>
                <img src={post.image} alt="Post" className="post-image" />
                <p className="post-caption">{post.caption}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserdashBoard;