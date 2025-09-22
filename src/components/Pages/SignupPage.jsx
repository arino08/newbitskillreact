import React, { useState } from 'react';
import './SignupPage.css';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) return alert('All fields are required');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
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
                  <div className="input-with-icon">
                    <i className="fas fa-lock" aria-hidden />
                    <input id="password" name="password" type="password" value={form.password} onChange={update} placeholder="Create a password" required />
                  </div>
                  {/* TODO: add live strength indicator */}
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
