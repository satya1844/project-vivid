import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.svg";
import "./NavBar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleExploreClick = () => {
    navigate("/explore");
  };

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
                <a href="#" 
                   className="navBar-link" 
                   onClick={handleExploreClick}>Explore</a>
              </li>
              <li className="navBar-item">
                <a href="#" className="navBar-link">People</a>
              </li>
              <li className="navBar-item">
                <a href="#" className="navBar-link">Dashboard</a>
              </li>
            </ul>
          </nav>
          <button className="navBar-loginButton" onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
