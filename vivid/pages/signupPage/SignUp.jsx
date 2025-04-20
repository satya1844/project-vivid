import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./SignUp.css";
import SignUpImage from "../../src/assets/signup.svg";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="signup-container">
      <div className="signup-content">
        {/* Signup Image */}
        <div className="signup-image">
          <img src={SignUpImage} alt="Sign Up" />
        </div>

        {/* Signup Form */}
        <div className="form-box">
          <h1>Sign Up for Vivid</h1>
          <p>
            Already have an account? <a href="/login">Log in here</a>
          </p>

          <input type="text" placeholder="Full Name" />
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

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button className="google-btn">Sign up with Google</button>

          <div className="divider">
            <span>Or</span>
          </div>

          <button className="signup-btn">Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;