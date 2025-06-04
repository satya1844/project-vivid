import React from 'react';
import GroupDecoration from '../../assets/group-decoration.svg';
import Ellipse88 from '../../assets/Ellipse-88.svg';

function Groups() {
  return (
    <div className="groups-container">
      <img src={GroupDecoration} alt="Group Decoration" className="group-decoration" />
      <img src={Ellipse88} alt="Decorative Ellipse" className="group-ellipse" />
      {/* ...existing code... */}
    </div>
  );
}

export default Groups;