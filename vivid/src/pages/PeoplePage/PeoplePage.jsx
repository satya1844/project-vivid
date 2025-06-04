import React from 'react';
import Rectangle25 from '../../assets/Rectangle-25.svg';
import Ellipse85 from '../../assets/Ellipse-85-b.svg';

function PeoplePage() {
  return (
    <div className="people-page">
      <img src={Rectangle25} alt="Decorative Rectangle" className="people-rectangle" />
      <img src={Ellipse85} alt="Decorative Ellipse" className="people-ellipse" />
      {/* ...existing code... */}
    </div>
  );
}

export default PeoplePage;