import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { auth } from '../../src/config/authConfig'; // Ensure auth is imported
import './LoginPage.css';

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const { login, googleLogin, resetPassword } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      console.log('Attempting to log in with email:', email);

      // Attempt to log in
      await login(email, password);
      toast.success('Successfully logged in! 🚀');

      // Get current logged-in user details
      const user = auth.currentUser; // Ensure `auth` is imported from Firebase config
      if (user) {
        console.log('Login successful:');
        console.log('User UID:', user.uid);
        console.log('User Email:', user.email);
        console.log('User Display Name:', user.displayName);
      } else {
        console.warn('No user found after login. Something might be wrong.');
      }

      onLoginSuccess();
    } catch (err) {
      console.error('Login error:', err);

      // Handle specific Firebase error codes
      switch (err.code) {
        case 'auth/user-not-found':
          toast.error('Account not found. Please sign up first! ✨');
          navigate('/signup'); // Redirect to signup page
          break;
        case 'auth/wrong-password':
          toast.error('Incorrect password. Please try again! 🔑');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email format. Please check your email.');
          break;
        case 'auth/too-many-requests':
          toast.error('Too many attempts. Please try again later! ⏳');
          break;
        default:
          toast.error('Oops! Something went wrong. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin();
      const user = result.user; // Extract user details from the result
      toast.success('Logged in with Google! 🎉');
      console.log('Google Login successful:');
      console.log('User UID:', user?.uid);
      console.log('User Email:', user?.email);
      console.log('User Display Name:', user?.displayName);

      onLoginSuccess();
    } catch (err) {
      console.error('Google login error:', err);
      switch (err.code) {
        case 'auth/popup-closed-by-user':
          toast.error('Login cancelled. Please try again.');
          break;
        case 'auth/account-exists-with-different-credential':
          toast.error('Account exists with a different sign-in method.');
          break;
        default:
          toast.error('Failed to sign in with Google. 😞');
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address first 📧');
      return;
    }

    try {
      await resetPassword(email);
      toast.success('Password reset email sent! Check your inbox 📬');
    } catch (err) {
      console.error('Reset password error:', err);
      switch (err.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email.');
          break;
        case 'auth/invalid-email':
          toast.error('Please enter a valid email address.');
          break;
        default:
          toast.error('Failed to send reset email. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="form-box">
          <h1>Log in to <span style={{ color: '#7c3aed' }}>Vivid</span></h1>

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
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button type="button" className="forgot-password-btn" onClick={handleForgotPassword}>
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
      </div>
    </div>
  );
}

export default LoginPage;
