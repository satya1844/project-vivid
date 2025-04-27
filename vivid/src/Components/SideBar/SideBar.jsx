
import React from 'react';
import { Link } from 'react-router-dom';
import './SideBar.css'; // Import your CSS file for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <Link to="/" className="sidebar-link"> Home</Link>
        <Link to="/explore" className="sidebar-link"> Explore</Link>
        <Link to="/profile" className="sidebar-link"> Profile</Link>
        <Link to="/communities" className="sidebar-link"> Communities</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
