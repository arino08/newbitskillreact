import React, { useMemo, useState } from 'react';
import './LoginPage.css';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI, handleAPIError } from '../../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [remember, setRemember] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const emailValid = useMemo(() => /.+@+.+\..+/.test(email), [email]);

  // Get the redirect path from location state
  const from = location.state?.from || '/';

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!emailValid) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await authAPI.login({ email, password });
      login(data.user, data.token);
      navigate(from);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" role="main">
      <div className="login-shell">
        <div className="login-content">
          <div className="left-section">
            <div className="left-content">
              <h2>Welcome to the Future of Learning</h2>
              <p>
                Join thousands of students who are building their careers through hands-on micro-internships. 
                Transform your academic knowledge into real-world expertise.
              </p>
              <ul className="features">
                <li>
                  <i className="fas fa-rocket" aria-hidden /> Launch your career with real projects
                </li>
                <li>
                  <i className="fas fa-users" aria-hidden /> Connect with industry mentors
                </li>
                <li>
                  <i className="fas fa-clock" aria-hidden /> Flexible scheduling around your studies
                </li>
                <li>
                  <i className="fas fa-certificate" aria-hidden /> Earn certificates that matter
                </li>
                <li>
                  <i className="fas fa-briefcase" aria-hidden /> Build a portfolio that stands out
                </li>
                <li>
                  <i className="fas fa-graduation-cap" aria-hidden /> Learn skills employers want
                </li>
              </ul>
            </div>
          </div>

          <div className="right-section">
            <div className="right-content">
              <h2>Welcome Back</h2>
              <p>Sign in to access your Bitskill India account and continue your journey.</p>

              {from !== '/' && (
                <div className="redirect-message">
                  <i className="fas fa-info-circle"></i>
                  Please log in to access this page
                </div>
              )}

              <div className="social-login" aria-label="Social login options">
                <button type="button" className="social-btn google-btn">
                  <i className="fab fa-google" aria-hidden /> Google
                </button>
                <button type="button" className="social-btn linkedin-btn">
                  <i className="fab fa-linkedin-in" aria-hidden /> LinkedIn
                </button>
              </div>

              <div className="divider" aria-hidden>
                Or continue with email
              </div>

              <form onSubmit={onSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <div className="input-with-icon">
                    <i className="fas fa-envelope" aria-hidden />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                  {!!email && !emailValid && (
                    <div className="hint" role="status" aria-live="polite">Invalid email format</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  {!!email && !emailValid && (
                    <div className="hint" role="status" aria-live="polite">Invalid email format</div>
                  )}
                  <div className="input-with-icon password-field">
                    <i className="fas fa-lock" aria-hidden />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyUp={(e) => setCapsOn(e.getModifierState && e.getModifierState('CapsLock'))}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden />
                    </button>
                  </div>
                  {capsOn && (
                    <div className="caps-warning" role="status" aria-live="polite">
                      Caps Lock is on
                    </div>
                  )}
                </div>

                <div className="row-between">
                  <label className="checkbox">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    Remember me
                  </label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                {error && (
                  <div className="form-error" role="alert" aria-live="assertive">{error}</div>
                )}

                <button className="login-btn" type="submit" disabled={loading} aria-busy={loading}>
                  {loading ? <span className="spinner" aria-hidden /> : 'Log In'}
                </button>

                <p className="alt-link">Don’t have an account? <a href="/signup">Sign up</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
