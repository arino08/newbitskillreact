import React, { useMemo, useState } from 'react';
import './LoginPage.css';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    // simulate login
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setError('');
    login({ email });
    navigate('/');
  };

  return (
    <div className="login-page" role="main">
      <div className="login-shell">
        <div className="login-content">
          <div className="left-section">
            <div className="left-content">
              <h2>Launch Your Career with Micro-Internships</h2>
              <p>
                Gain practical experience while balancing your academic commitments. Build your
                professional portfolio with real-world projects.
              </p>
              <ul className="features">
                <li>
                  <i className="fas fa-check" aria-hidden /> Industry-relevant projects with expert guidance
                </li>
                <li>
                  <i className="fas fa-check" aria-hidden /> Flexible timelines tailored for students
                </li>
                <li>
                  <i className="fas fa-check" aria-hidden /> Professional mentorship and feedback
                </li>
                <li>
                  <i className="fas fa-check" aria-hidden /> Certificate upon completion
                </li>
              </ul>
            </div>
          </div>

          <div className="right-section">
            <div className="right-content">
              <h2>Welcome Back</h2>
              <p>Sign in to access your Bitskill India account and continue your journey.</p>

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
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
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

                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
                {error && (
                  <div className="form-error" role="alert" aria-live="assertive">{error}</div>
                )}
                <button className="login-btn" type="submit" disabled={loading} aria-busy={loading}>
                  {loading ? 'Logging in…' : 'Log In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
