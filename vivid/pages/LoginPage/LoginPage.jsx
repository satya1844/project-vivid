import React, { useState } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import './LoginPage.css';

function LoginPage({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError('Failed to sign in: ' + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await googleLogin();
      onLoginSuccess();
    } catch (err) {
      setError('Failed to sign in with Google: ' + err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* ...existing image code... */}
        <div className="form-box">
          <h1>Log in to Vivid</h1>
          {error && <div className="error-message">{error}</div>}
          <p>Don't have an account yet? <a href="/signup">Sign up for free</a></p>

          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button className="google-btn" onClick={handleGoogleLogin}>
            Log in with Google
          </button>

          <div className="divider">
            <span>Or</span>
          </div>

          <button className="login-btn" onClick={handleLogin}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;