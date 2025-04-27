import React from 'react';
import './Explore.css';
import Sidebar from '../../src/Components/SideBar/SideBar';
import RightBar from '../../src/Components/RightBar/RightBar';
import PostFeed from '../../src/Components/PostFeed/PostFeed';

function Explore() {
  return (
    <div className="explore-container">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="main-content">
        <h1>Explore</h1>
        <PostFeed />
      </div>
      <div className="rightbar-wrapper">
        <RightBar />
      </div>
    </div>
  );
}

export default Explore;