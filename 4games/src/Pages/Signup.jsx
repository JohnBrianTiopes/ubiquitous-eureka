
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('/api/signup', { username, password });
      
      localStorage.setItem('user', JSON.stringify({
        userId: response.data.userId,
        username: response.data.username,
        token: response.data.token
      }));
      
      setSuccess('Signup successful! Redirecting to home...');
      setUsername('');
      setPassword('');
      
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (err) {
      setError(err.response?.data || 'Signup failed. Please try again.');
    }
  };

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => document.body.classList.remove('auth-page');
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2 className="auth-title">Sign Up</h2>
        <form onSubmit={handleSignup} className="auth-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="auth-input"
              placeholder="Choose a username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Create a password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
        {error && <p className="auth-error">{error}</p>}
        {success && <p style={{ color: '#7bffa4', marginTop: '1rem', fontWeight: 600 }}>{success}</p>}
        <p className="auth-link">
          Already have an account? <Link to="/">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;