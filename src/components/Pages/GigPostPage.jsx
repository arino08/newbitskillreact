import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { gigsAPI, categoriesAPI, handleAPIError } from '../../services/api';
import './GigPostPage.css';

const GigPostPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    budgetMin: '',
    budgetMax: '',
    budgetType: 'fixed',
    deadline: '',
    durationEstimate: '',
    difficultyLevel: 'intermediate',
    requiredSkills: [],
    remoteAllowed: true,
    location: '',
    tags: [],
    isUrgent: false
  });
  const [skillInput, setSkillInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    // Check authentication status first
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/post-gig' } });
      return;
    }
    
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAllCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !form.requiredSkills.includes(skillInput.trim())) {
      setForm(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const gigData = {
        ...form,
        categoryId: parseInt(form.categoryId),
        budgetMin: form.budgetMin ? parseFloat(form.budgetMin) : undefined,
        budgetMax: form.budgetMax ? parseFloat(form.budgetMax) : undefined
      };

      const data = await gigsAPI.createGig(gigData);
      navigate(`/gigs/${data.gigId}`);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="gig-post-page">
        <div className="container">
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the form if not authenticated (redirect will happen in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="gig-post-page">
      <div className="container">
        <div className="post-header">
          <h1>Post a New Gig</h1>
          <p>Share your project and find the perfect freelancer to bring it to life</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="gig-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="e.g., Build a Modern E-commerce Website"
                required
                maxLength={200}
              />
              <span className="char-count">{form.title.length}/200</span>
            </div>

            <div className="form-group">
              <label htmlFor="categoryId">Category *</label>
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Project Description *</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Describe your project in detail. Include requirements, deliverables, and any specific instructions..."
                required
                rows={8}
                maxLength={5000}
              />
              <span className="char-count">{form.description.length}/5000</span>
            </div>
          </div>

          <div className="form-section">
            <h2>Budget & Timeline</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="budgetType">Budget Type *</label>
                <select
                  id="budgetType"
                  name="budgetType"
                  value={form.budgetType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="budgetMin">
                  {form.budgetType === 'hourly' ? 'Min Hourly Rate' : 'Min Budget'} ($)
                </label>
                <input
                  type="number"
                  id="budgetMin"
                  name="budgetMin"
                  value={form.budgetMin}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="budgetMax">
                  {form.budgetType === 'hourly' ? 'Max Hourly Rate' : 'Max Budget'} ($)
                </label>
                <input
                  type="number"
                  id="budgetMax"
                  name="budgetMax"
                  value={form.budgetMax}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deadline">Project Deadline</label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="durationEstimate">Estimated Duration</label>
                <input
                  type="text"
                  id="durationEstimate"
                  name="durationEstimate"
                  value={form.durationEstimate}
                  onChange={handleInputChange}
                  placeholder="e.g., 2-3 weeks, 1 month"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Requirements</h2>
            
            <div className="form-group">
              <label htmlFor="difficultyLevel">Difficulty Level *</label>
              <select
                id="difficultyLevel"
                name="difficultyLevel"
                value={form.difficultyLevel}
                onChange={handleInputChange}
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="requiredSkills">Required Skills</label>
              <div className="skill-input-container">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill and press Enter"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill(e)}
                />
                <button type="button" onClick={addSkill} className="add-btn">
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="tags-display">
                {form.requiredSkills.map((skill, index) => (
                  <span key={index} className="tag">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <div className="skill-input-container">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags to help others find your project"
                  onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
                />
                <button type="button" onClick={addTag} className="add-btn">
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="tags-display">
                {form.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Location & Preferences</h2>
            
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="remoteAllowed"
                  name="remoteAllowed"
                  checked={form.remoteAllowed}
                  onChange={handleInputChange}
                />
                <label htmlFor="remoteAllowed">Remote work allowed</label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location (if not remote)</label>
              <input
                type="text"
                id="location"
                name="location"
                value={form.location}
                onChange={handleInputChange}
                placeholder="e.g., New York, NY"
              />
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="isUrgent"
                  name="isUrgent"
                  checked={form.isUrgent}
                  onChange={handleInputChange}
                />
                <label htmlFor="isUrgent">Mark as urgent</label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/gigs')} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating Gig...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  Post Gig
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GigPostPage;