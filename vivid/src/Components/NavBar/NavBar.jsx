import React from "react";
import "./NavBar.css"; // Import the CSS file for 
const Navbar = () => {
  return (
    <header className="navBar">
      <div className="navBar-container">
        {/* Logo */}
        <div className="navBar-logo">
          <div className="logo-image" />
          <h1 className="brand-name">Vivid</h1>
        </div>

        {/* Navigation */}
        <nav className="navBar-navigation">
          <ul className="navBar-menu">
            <li className="navBar-item">
              <a href="#" className="navBar-link">Home</a>
            </li>
            <li className="navBar-item">
              <a href="#" className="navBar-link">About</a>
            </li>
            <li className="navBar-item">
              <a href="#" className="navBar-link">Services</a>
            </li>
            <li className="navBar-item">
              <a href="#" className="navBar-link">Contact</a>
            </li>
          </ul>
        </nav>

        {/* Login button */}
        <button className="navBar-loginButton">Login</button>
      </div>
    </header>
  );
};

export default Navbar;
