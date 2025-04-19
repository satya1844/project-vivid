import React from 'react';
import "./UserdashBoard.css";
import profileBanner from "../../src/assets/";

function UserdashBoard() {
  return (
    <div className="user-dash-board">
      <div className="div-2">
        <div className="navbar-instance"></div>
        <div className="overlap">
          <div className="rectangle"></div>
          <img className="profile-banner" src={profileBanner} alt="Profile Banner" />
          <div className="rectangle-wrapper">
            <div className="rectangle-2"></div>
          </div>
          <div className="text-wrapper-2">Vinay Damarasing</div>
          <p className="blending-soul-with">
            Blending soul with sound, rhythm with reality.”
            <br />
            I’mVinay, a self-taught musician and sound explorer from Hyderbad.
            Whether it’s late-night lo-fi loops, lyrical storytelling, or
            heart-thumping beats — I create music that speaks to moments.
            <br />
            From studio sessions to open mic nights, I believe in music that
            feels — not just sounds.
          </p>
          <p className="genre-indie-pop-lo">
            <span className="span">Genre:</span>
            <span className="text-wrapper-3"> Indie Pop | Lo-fi | Hip-Hop | Classical Fusion </span>
            <span className="span">Based in:</span>
            <span className="text-wrapper-3"> Hyderabad </span>
            <span className="span">Let’s jam or collab: </span>
            <span className="text-wrapper-3">vinay@gmail.com</span>
          </p>
          <div className="rectangle-3"></div>
          <div className="ellipse"></div>
          <div className="material-symbols"></div>
          <div className="img"></div>
        </div>
        <div className="overlap-group">
          <button className="frame-instance">
            <div className="frame-427318807">Lets Connect!</div>
          </button>
          <div className="overlap-2">
            <div className="text-wrapper-4">Hobbies | Interests</div>
            <div className="group">
              <div className="mingcute-camera-fill">
                <div className="group-2"></div>
              </div>
              <div className="mingcute-ai-fill">
                <div className="group-3"></div>
              </div>
              <div className="group-4"></div>
            </div>
            <div className="group-5">
              <div className="playing-guitar"> Playing Guitar</div>
              <div className="overlap-group-2">
                <div className="text-wrapper-5">Photography</div>
                <div className="text-wrapper-6">Learning AI Stuff</div>
              </div>
              <p className="looking-to-learn"> Looking to learn Baking</p>
              <p className="open-to-teaching"> Ready to teach Music</p>
            </div>
            <div className="text-wrapper-7">Current Mood</div>
          </div>
          <div className="material-symbols-2"></div>
        </div>
      </div>
    </div>
  );
}

export default UserdashBoard;