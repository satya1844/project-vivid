import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./LoginPage.css";
// Ensure the file exists or replace with an existing image
import LoginImage from "../../assets/signup.svg"; // Replace with a valid image path

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Login Image */}
        <div className="login-image">
          <img src={LoginImage} alt="Log In" />
        </div>

        {/* Login Form */}
        <div className="form-box">
          <h1>Log in to Vivid</h1>
          <p>
            Don't have an account yet? <a href="/signup">Sign up for free</a>
          </p>

          <input type="email" placeholder="Email Address" />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button className="google-btn">Log in with Google</button>

          <div className="divider">
            <span>Or</span>
          </div>

          <button className="login-btn">Log In</button>

          <div className="extra-links">
            <a href="#">Forgot password?</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;