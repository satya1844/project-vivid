import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import './SignUp.css';

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
      return setError('Passwords do not match');
    }

    try {
      setError('');
      await signup(formData.email, formData.password);
      navigate('/userdashboard');
    } catch (err) {
      setError('Failed to create an account: ' + err.message);
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

            <button className="google-btn" onClick={handleGoogleSignup}>
              Sign up with Google
            </button>

            <div className="divider">
              <span>Or</span>
            </div>

            <button className="signup-btn">Sign Up</button>
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