import React from "react";
import logo from "../../assets/Logo.svg";
import "./NavBar.css";

const Navbar = () => {
  return (
    <nav className="navBar">
      <div className="navBar-container">
        {/* Logo on the left */}
        <div className="navBar-logo">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        {/* Navigation and button grouped together on the right */}
        <div className="navBar-right">
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
          <button className="navBar-loginButton">Login</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
