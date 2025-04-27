import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import logo from "../../assets/Logo.svg";
import "./NavBar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleAuthClick = async () => {
    if (currentUser) {
      try {
        await logout();
        toast.success("Successfully logged out!");
        navigate("/");
      } catch (error) {
        toast.error("Failed to log out!");
      }
    } else {
      navigate("/login");
    }
  };

  const handleNavigation = (path) => {
    if (!currentUser && path !== "/") {
      toast.error("Please login to access this feature!");
      navigate("/login");
      return;
    }
    navigate(path);
  };

  // Show welcome toast when user logs in
  React.useEffect(() => {
    if (currentUser) {
      toast.success(`Welcome, ${currentUser.displayName || 'User'}!`);
    }
  }, [currentUser]);

  return (
    <nav className="navBar">
      <div className="navBar-container">
        <div className="navBar-logo">
          <img src={logo} alt="Logo" className="logo" onClick={() => handleNavigation("/")} />
        </div>

        <div className="navBar-right">
          <nav className="navBar-navigation">
            <ul className="navBar-menu">
              <li className="navBar-item">
                <a href="#" className="navBar-link" onClick={() => handleNavigation("/")}>
                  Home
                </a>
              </li>
              <li className="navBar-item">
                <a href="#" className="navBar-link" onClick={() => handleNavigation("/explore")}>
                  Explore
                </a>
              </li>
              {currentUser && (
                <>
                  <li className="navBar-item">
                    <a href="#" className="navBar-link" onClick={() => handleNavigation("/userdashboard")}>
                      Dashboard
                    </a>
                  </li>
                  <li className="navBar-item">
                    <a href="#" className="navBar-link" onClick={() => handleNavigation("/people")}>
                      People
                    </a>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <button className="navBar-loginButton" onClick={handleAuthClick}>
            {currentUser ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
