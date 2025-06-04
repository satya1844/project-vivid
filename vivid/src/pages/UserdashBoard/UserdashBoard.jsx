import React from 'react';
// Import decorative assets
import Rectangle34 from '../../assets/Rectangle-34.svg';
import Ellipse87 from '../../assets/Ellipse-87.svg';
import ProfileDecoration from '../../assets/profile-decoration.svg';

function UserDashBoard() {
  // ...existing code...
  return (
    <div className="dashboard-container">
      <img src={Rectangle34} alt="Decorative Rectangle" className="dashboard-rectangle" />
      <img src={Ellipse87} alt="Decorative Ellipse" className="dashboard-ellipse" />
      <img src={ProfileDecoration} alt="Profile Decoration" className="profile-decoration" />
      // ...existing code...
    </div>
  );
}

export default UserDashBoard;