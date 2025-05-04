import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import './SignUp.css';
import SignUpImage from '../../src/assets/signup.svg'; 
import { toast } from 'react-hot-toast';

// Add the isValidPassword function definition
// Update the isValidPassword function to require an uppercase letter
const isValidPassword = (password) => {
  // At least 8 characters, one uppercase letter, one number, one special character
  return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
};

function SignUp() {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match'); // Use toast instead of setError
      return;
    }

    if (!isValidPassword(formData.password)) {
      toast.error('Password must be at least 8 characters and include an uppercase letter, a number, and a special character.');
      return;
    }

    try {
      setError(''); // Clear any previous errors
      // Pass the full name to the signup function
      const user = await signup(formData.email, formData.password, formData.fullName);
      toast.success('Account created successfully! Welcome to Vivid!');
      navigate("/userdashboard"); // Redirect to dashboard instead of login
    } catch (err) {
      // Show custom message if email is already registered
      if (err.code === 'auth/email-already-in-use') {
        toast.error('You are already signed up. Please try to log in instead.');
      } else {
        toast.error('Failed to create an account: ' + err.message);
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await googleLogin();
      navigate('/userdashboard');
    } catch (err) {
      setError('Failed to sign up with Google: ' + err.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        {/* Signup Form */}
        <div className="form-box">
          <h1>Sign Up for Vivid</h1>
          <p>
            Already have an account? <a href="/login">Log in here</a>
          </p>

          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <div className="password-box">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <div className="password-box">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button type="submit" className="signup-btn">Sign Up</button>

            <div className="divider">
              <span>Or</span>
            </div>

            
            <button type="button" className="google-btn" onClick={handleGoogleSignup}>
              Sign up with Google
            </button>
          </form>
        </div>
        {/* Signup Image */}
        <div className="signup-image">
          <img src={SignUpImage} alt="Sign Up" />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
