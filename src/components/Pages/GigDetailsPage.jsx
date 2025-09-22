import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gigsAPI, applicationsAPI, handleAPIError } from '../../services/api';
import './GigDetailsPage.css';

const GigDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [application, setApplication] = useState({
    coverLetter: '',
    proposedRate: '',
    proposedTimeline: '',
    portfolioLinks: ['']
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      const data = await gigsAPI.getGigById(id);
      setGig(data.gig);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      if (error.message.includes('404')) {
        navigate('/gigs');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationChange = (field, value, index = null) => {
    if (field === 'portfolioLinks' && index !== null) {
      const newLinks = [...application.portfolioLinks];
      newLinks[index] = value;
      setApplication(prev => ({ ...prev, portfolioLinks: newLinks }));
    } else {
      setApplication(prev => ({ ...prev, [field]: value }));
    }
  };

  const addPortfolioLink = () => {
    setApplication(prev => ({
      ...prev,
      portfolioLinks: [...prev.portfolioLinks, '']
    }));
  };

  const removePortfolioLink = (index) => {
    if (application.portfolioLinks.length > 1) {
      const newLinks = application.portfolioLinks.filter((_, i) => i !== index);
      setApplication(prev => ({ ...prev, portfolioLinks: newLinks }));
    }
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const portfolioLinks = application.portfolioLinks.filter(link => link.trim());

      const applicationData = {
        coverLetter: application.coverLetter,
        proposedRate: application.proposedRate ? parseFloat(application.proposedRate) : undefined,
        proposedTimeline: application.proposedTimeline,
        portfolioLinks
      };

      await applicationsAPI.submitApplication(parseInt(id), applicationData);
      alert('Application submitted successfully!');
      setShowApplicationForm(false);
      fetchGig(); // Refresh to update application count
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatBudget = (min, max, type) => {
    if (!min && !max) return 'Budget not specified';
    const prefix = '$';
    const suffix = type === 'hourly' ? '/hr' : '';
    
    if (min && max) {
      return `${prefix}${min} - ${prefix}${max}${suffix}`;
    } else if (min) {
      return `${prefix}${min}+ ${suffix}`;
    } else {
      return `Up to ${prefix}${max}${suffix}`;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Recently';
  };

  if (loading) {
    return (
      <div className="gig-details-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading gig details...</p>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="gig-details-page">
        <div className="error-container">
          <h2>Gig not found</h2>
          <Link to="/gigs" className="back-btn">← Back to All Gigs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="gig-details-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/gigs">All Gigs</Link>
          <span>/</span>
          <span>{gig.category_name}</span>
          <span>/</span>
          <span>{gig.title}</span>
        </nav>

        <div className="gig-content">
          <main className="gig-main">
            <div className="gig-header">
              <div className="gig-meta">
                <span className="category" style={{ backgroundColor: gig.category_color }}>
                  {gig.category_name}
                </span>
                {gig.is_urgent && (
                  <span className="urgent-badge">
                    <i className="fas fa-bolt"></i>
                    Urgent
                  </span>
                )}
                <span className="posted-time">
                  Posted {formatTimeAgo(gig.created_at)}
                </span>
              </div>

              <h1 className="gig-title">{gig.title}</h1>

              <div className="gig-stats">
                <div className="stat">
                  <i className="fas fa-eye"></i>
                  <span>{gig.viewsCount} views</span>
                </div>
                <div className="stat">
                  <i className="fas fa-paper-plane"></i>
                  <span>{gig.applications_count} applications</span>
                </div>
                <div className="stat">
                  <i className="fas fa-signal"></i>
                  <span>{gig.difficulty_level.charAt(0).toUpperCase() + gig.difficulty_level.slice(1)}</span>
                </div>
                <div className="stat">
                  <i className={`fas ${gig.remote_allowed ? 'fa-laptop-house' : 'fa-building'}`}></i>
                  <span>{gig.remote_allowed ? 'Remote OK' : 'On-site'}</span>
                </div>
              </div>
            </div>

            <div className="gig-body">
              <section className="description-section">
                <h2>Project Description</h2>
                <div className="description-content">
                  {gig.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {gig.requiredSkills && gig.requiredSkills.length > 0 && (
                <section className="skills-section">
                  <h2>Required Skills</h2>
                  <div className="skills-list">
                    {gig.requiredSkills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </section>
              )}

              {gig.tags && gig.tags.length > 0 && (
                <section className="tags-section">
                  <h2>Tags</h2>
                  <div className="tags-list">
                    {gig.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </section>
              )}

              <section className="project-details">
                <h2>Project Details</h2>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="label">Budget:</span>
                    <span className="value budget">{formatBudget(gig.budget_min, gig.budget_max, gig.budget_type)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Budget Type:</span>
                    <span className="value">{gig.budget_type === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}</span>
                  </div>
                  {gig.deadline && (
                    <div className="detail-item">
                      <span className="label">Deadline:</span>
                      <span className="value">{new Date(gig.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  {gig.duration_estimate && (
                    <div className="detail-item">
                      <span className="label">Duration:</span>
                      <span className="value">{gig.duration_estimate}</span>
                    </div>
                  )}
                  {gig.location && (
                    <div className="detail-item">
                      <span className="label">Location:</span>
                      <span className="value">{gig.location}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="label">Difficulty:</span>
                    <span className="value">{gig.difficulty_level.charAt(0).toUpperCase() + gig.difficulty_level.slice(1)}</span>
                  </div>
                </div>
              </section>
            </div>
          </main>

          <aside className="gig-sidebar">
            <div className="action-card">
              <div className="budget-display">
                <div className="budget-amount">{formatBudget(gig.budget_min, gig.budget_max, gig.budget_type)}</div>
                <div className="budget-type">{gig.budget_type === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}</div>
              </div>

              <button 
                onClick={() => setShowApplicationForm(true)}
                className="apply-btn"
                disabled={gig.status !== 'open'}
              >
                <i className="fas fa-paper-plane"></i>
                Apply for this Project
              </button>

              <div className="quick-stats">
                <div className="quick-stat">
                  <span className="number">{gig.applications_count}</span>
                  <span className="label">Applications</span>
                </div>
                <div className="quick-stat">
                  <span className="number">{gig.viewsCount}</span>
                  <span className="label">Views</span>
                </div>
              </div>
            </div>

            <div className="client-card">
              <h3>About the Client</h3>
              <div className="client-info">
                <div className="client-header">
                  <img 
                    src={gig.posted_by_picture || '/default-avatar.png'} 
                    alt={gig.posted_by_name}
                    className="client-avatar"
                  />
                  <div className="client-details">
                    <h4>{gig.posted_by_name}</h4>
                    {gig.posted_by_location && (
                      <p className="client-location">
                        <i className="fas fa-map-marker-alt"></i>
                        {gig.posted_by_location}
                      </p>
                    )}
                  </div>
                </div>
                {gig.posted_by_bio && (
                  <p className="client-bio">{gig.posted_by_bio}</p>
                )}
              </div>
            </div>
          </aside>
        </div>

        {showApplicationForm && (
          <div className="application-modal">
            <div className="modal-overlay" onClick={() => setShowApplicationForm(false)}></div>
            <div className="modal-content">
              <div className="modal-header">
                <h2>Apply for this Project</h2>
                <button 
                  onClick={() => setShowApplicationForm(false)}
                  className="close-btn"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={submitApplication} className="application-form">
                <div className="form-group">
                  <label htmlFor="coverLetter">Cover Letter *</label>
                  <textarea
                    id="coverLetter"
                    value={application.coverLetter}
                    onChange={(e) => handleApplicationChange('coverLetter', e.target.value)}
                    placeholder="Describe why you're the perfect fit for this project..."
                    required
                    rows={6}
                    maxLength={2000}
                  />
                  <span className="char-count">{application.coverLetter.length}/2000</span>
                </div>

                {gig.budget_type === 'hourly' && (
                  <div className="form-group">
                    <label htmlFor="proposedRate">Your Hourly Rate ($)</label>
                    <input
                      type="number"
                      id="proposedRate"
                      value={application.proposedRate}
                      onChange={(e) => handleApplicationChange('proposedRate', e.target.value)}
                      placeholder="25"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="proposedTimeline">Proposed Timeline *</label>
                  <input
                    type="text"
                    id="proposedTimeline"
                    value={application.proposedTimeline}
                    onChange={(e) => handleApplicationChange('proposedTimeline', e.target.value)}
                    placeholder="e.g., 2 weeks, 1 month"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Portfolio Links</label>
                  {application.portfolioLinks.map((link, index) => (
                    <div key={index} className="portfolio-input">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => handleApplicationChange('portfolioLinks', e.target.value, index)}
                        placeholder="https://your-portfolio.com"
                      />
                      {application.portfolioLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePortfolioLink(index)}
                          className="remove-btn"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPortfolioLink}
                    className="add-link-btn"
                  >
                    <i className="fas fa-plus"></i>
                    Add Another Link
                  </button>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="submit-btn"
                  >
                    {submitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigDetailsPage;