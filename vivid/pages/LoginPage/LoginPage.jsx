import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../src/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { auth, signInWithGoogle } from "../../src/config/authConfig"; // Ensure auth and signInWithGoogle are imported
import Loader from "../../src/assets/Loader"; // Import the Loader component
import "./LoginPage.css";
import LoginImage from '../../src/assets/login.svg';

function LoginPage() {
  const navigate = useNavigate();
  const { login, googleLogin, resetPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      console.log("Attempting to log in with email:", email);

      await login(email, password);
      const user = auth.currentUser;
      if (user) {
        console.log("Login successful:");
        console.log("User UID:", user.uid);
        console.log("User Email:", user.email);
        console.log("User Display Name:", user.displayName);
        toast.success(`Welcome back, ${user.displayName || 'User'}! 🚀`);
        navigate("/userdashboard");
      } else {
        console.warn("No user found after login. Something might be wrong.");
      }
    } catch (err) {
      console.error("Login error:", err);

      switch (err.code) {
        case "auth/user-not-found":
          toast.error("Account not found. Please sign up first! ✨");
          navigate("/signup");
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password. Please try again! 🔑");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email format. Please check your email.");
          break;
        case "auth/too-many-requests":
          toast.error("Too many attempts. Please try again later! ⏳");
          break;
        default:
          toast.error("Oops! Something went wrong. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true); // Show the loader
    try {
      const user = await signInWithGoogle();
      console.log("Google Login successful:", user);
      toast.success(`Welcome back, ${user.displayName || 'User'}! 🚀`);
      navigate("/userdashboard");
    } catch (error) {
      console.error("Error during Google login:", error);
    } finally {
      setIsLoading(false); // Hide the loader
    }
};

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first ");
      return;
    }

    try {
      await resetPassword(email);
      toast.success("Password reset email sent! Check your inbox 📬");
    } catch (err) {
      console.error("Reset password error:", err);
      switch (err.code) {
        case "auth/user-not-found":
          toast.error("No account found with this email.");
          break;
        case "auth/invalid-email":
          toast.error("Please enter a valid email address.");
          break;
        default:
          toast.error("Failed to send reset email. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <Loader />; // Show the Loader during login
  }

  return (
    <>
      <div className="particles-background">
        {/* <Particles /> */}
          <div className="login-container">
            <div className="login-content">
              <div className="form-box">
                <h1>
                  Log in to <span>Vivid</span>
                </h1>

                {error && <div className="error-message">{error}</div>}

                <p>
                  Don't have an account? <a href="/signup">Sign up for free</a>
                </p>

                <form onSubmit={handleLogin}>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <div className="password-box">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="forgot-password-btn"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </button>

                  <button type="submit" className="login-btn">
                    Log In
                  </button>
                </form>

                <div className="divider">
                  <span>Or</span>
                </div>

                <button className="google-btn" onClick={handleGoogleLogin}>
                  Log in with Google
                </button>
              </div>
              <div className="login-image">
                        <img src={LoginImage} alt="Sign Up" />
                      </div>
                    
            </div>
          </div>
      </div>
    </>
  );
}

export default LoginPage;
