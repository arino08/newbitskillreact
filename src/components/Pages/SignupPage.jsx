import React, { useMemo, useState } from 'react';
import './SignupPage.css';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [error, setError] = useState('');

  const strength = useMemo(() => {
    const v = form.password || '';
    const rules = {
      length: v.length >= 8,
      upper: /[A-Z]/.test(v),
      number: /\d/.test(v),
      special: /[^A-Za-z0-9]/.test(v),
    };
    const passed = Object.values(rules).filter(Boolean).length;
    return { rules, score: passed };
  }, [form.password]);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      setError('All fields are required');
      return;
    }
    if (strength.score < 3) {
      setError('Please choose a stronger password');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setError('');
    login({ email: form.email, name: form.fullName });
    navigate('/');
  };

  return (
    <div className="signup-page" role="main">
      <div className="signup-shell">
        <div className="signup-content">
          <div className="left-section">
            <div className="left-content">
              <h2>Join Bitskill India</h2>
              <p>Build your portfolio with real-world projects and micro-internships.</p>
              <ul className="features">
                <li><i className="fas fa-check" aria-hidden /> Hands-on experience</li>
                <li><i className="fas fa-check" aria-hidden /> Flexible timelines</li>
                <li><i className="fas fa-check" aria-hidden /> Mentorship and feedback</li>
                <li><i className="fas fa-check" aria-hidden /> Completion certificate</li>
              </ul>
            </div>
          </div>

          <div className="right-section">
            <div className="right-content">
              <h2>Create your account</h2>
              <p>Sign up to start applying for micro-internships and gigs.</p>

              <form onSubmit={onSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <div className="input-with-icon">
                    <i className="fas fa-user" aria-hidden />
                    <input id="fullName" name="fullName" type="text" value={form.fullName} onChange={update} placeholder="John Doe" required />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-with-icon">
                    <i className="fas fa-envelope" aria-hidden />
                    <input id="email" name="email" type="email" value={form.email} onChange={update} placeholder="your.email@example.com" required />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-with-icon password-field">
                    <i className="fas fa-lock" aria-hidden />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={update}
                      onKeyUp={(e) => setCapsOn(e.getModifierState && e.getModifierState('CapsLock'))}
                      placeholder="Create a password"
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
                  <div className="strength-meter" aria-hidden>
                    <div className={`bar ${strength.score >= 1 ? 'on' : ''}`} />
                    <div className={`bar ${strength.score >= 2 ? 'on' : ''}`} />
                    <div className={`bar ${strength.score >= 3 ? 'on' : ''}`} />
                    <div className={`bar ${strength.score >= 4 ? 'on' : ''}`} />
                  </div>
                  <ul className="pw-rules" aria-live="polite">
                    <li className={strength.rules.length ? 'ok' : ''}>At least 8 characters</li>
                    <li className={strength.rules.upper ? 'ok' : ''}>One uppercase letter</li>
                    <li className={strength.rules.number ? 'ok' : ''}>One number</li>
                    <li className={strength.rules.special ? 'ok' : ''}>One special character</li>
                  </ul>
                </div>

                <div className="form-group">
                  <label htmlFor="role">I am a</label>
                  <div className="input-with-icon">
                    <i className="fas fa-user-graduate" aria-hidden />
                    <select id="role" name="role" value={form.role} onChange={update}>
                      <option value="student">Student</option>
                      <option value="professional">Professional</option>
                      <option value="employer">Employer</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="form-error" role="alert" aria-live="assertive">{error}</div>
                )}
                <button type="submit" className="submit-btn" disabled={loading} aria-busy={loading}>
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
