import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-upper">
        <div className="footer-left">
          <p>Your voice makes Vivid better. Tell us what you feel</p>
          <button className="subscribe-button">Share Your Thoughts →</button>
        </div>
        <div className="footer-right">
          <ul>
            <li>About Us</li>
            <li>Contact</li>
            <li>Cookies & Privacy</li>
          </ul>
          <ul>
            <li>LinkedIn</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>
      <div className="footer-lower">
        <h1>Built for connection. Powered by curiosity.</h1>
      </div>
    </footer>
  );
};

export default Footer;