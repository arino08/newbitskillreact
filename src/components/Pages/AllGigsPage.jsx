import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gigsAPI, categoriesAPI, handleAPIError } from '../../services/api';
import './AllGigsPage.css';

const AllGigsPage = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minBudget: '',
    maxBudget: '',
    budgetType: '',
    difficultyLevel: '',
    remoteAllowed: '',
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchCategories();
    fetchGigs();
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAllCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const fetchGigs = async () => {
    setLoading(true);
    setError('');
    try {
      const queryFilters = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      const data = await gigsAPI.getAllGigs(queryFilters);
      setGigs(data.gigs);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        pages: data.pagination.pages
      }));
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minBudget: '',
      maxBudget: '',
      budgetType: '',
      difficultyLevel: '',
      remoteAllowed: '',
      sortBy: 'created_at',
      sortOrder: 'DESC'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatBudget = (min, max, type) => {
    if (!min && !max) return 'Budget not specified';
    const prefix = type === 'hourly' ? '$' : '$';
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
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="all-gigs-page">
      <div className="gigs-header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1>Find Your Next Project</h1>
              <p>Discover amazing opportunities from clients worldwide</p>
            </div>
            <Link to="/post-gig" className="post-gig-btn">
              <i className="fas fa-plus"></i>
              Post a Gig
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="gigs-content">
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={clearFilters} className="clear-btn">
                Clear All
              </button>
            </div>

            <form onSubmit={handleSearch} className="search-form">
              <div className="search-group">
                <input
                  type="text"
                  placeholder="Search gigs..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                <button type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>

            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Budget Type</label>
              <select
                value={filters.budgetType}
                onChange={(e) => handleFilterChange('budgetType', e.target.value)}
              >
                <option value="">Any Type</option>
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Min Budget ($)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minBudget}
                onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                min="0"
              />
            </div>

            <div className="filter-group">
              <label>Max Budget ($)</label>
              <input
                type="number"
                placeholder="No limit"
                value={filters.maxBudget}
                onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                min="0"
              />
            </div>

            <div className="filter-group">
              <label>Difficulty Level</label>
              <select
                value={filters.difficultyLevel}
                onChange={(e) => handleFilterChange('difficultyLevel', e.target.value)}
              >
                <option value="">Any Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Remote Work</label>
              <select
                value={filters.remoteAllowed}
                onChange={(e) => handleFilterChange('remoteAllowed', e.target.value)}
              >
                <option value="">Any</option>
                <option value="true">Remote Allowed</option>
                <option value="false">On-site Only</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
              >
                <option value="created_at-DESC">Newest First</option>
                <option value="created_at-ASC">Oldest First</option>
                <option value="budget_min-DESC">Highest Budget</option>
                <option value="budget_min-ASC">Lowest Budget</option>
                <option value="applications_count-DESC">Most Applications</option>
                <option value="deadline-ASC">Deadline (Soonest)</option>
              </select>
            </div>
          </aside>

          <main className="gigs-main">
            <div className="gigs-header-bar">
              <div className="results-info">
                {loading ? (
                  'Loading...'
                ) : (
                  `${pagination.total} gig${pagination.total !== 1 ? 's' : ''} found`
                )}
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading gigs...</p>
              </div>
            ) : gigs.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-search"></i>
                <h3>No gigs found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="gigs-grid">
                  {gigs.map(gig => (
                    <div key={gig.id} className="gig-card">
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
                        </div>
                        <div className="posted-time">
                          {formatTimeAgo(gig.created_at)}
                        </div>
                      </div>

                      <h3 className="gig-title">
                        <Link to={`/gigs/${gig.id}`}>{gig.title}</Link>
                      </h3>

                      <p className="gig-description">
                        {gig.description.length > 150 
                          ? `${gig.description.substring(0, 150)}...` 
                          : gig.description
                        }
                      </p>

                      <div className="gig-skills">
                        {gig.requiredSkills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                        {gig.requiredSkills.length > 3 && (
                          <span className="more-skills">
                            +{gig.requiredSkills.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="gig-footer">
                        <div className="gig-budget">
                          {formatBudget(gig.budget_min, gig.budget_max, gig.budget_type)}
                        </div>
                        <div className="gig-stats">
                          <span className="stat">
                            <i className="fas fa-eye"></i>
                            {gig.views_count || 0}
                          </span>
                          <span className="stat">
                            <i className="fas fa-paper-plane"></i>
                            {gig.applications_count}
                          </span>
                        </div>
                      </div>

                      <div className="gig-details">
                        <div className="difficulty">
                          <i className="fas fa-signal"></i>
                          {gig.difficulty_level.charAt(0).toUpperCase() + gig.difficulty_level.slice(1)}
                        </div>
                        <div className="remote">
                          <i className={`fas ${gig.remote_allowed ? 'fa-laptop-house' : 'fa-building'}`}></i>
                          {gig.remote_allowed ? 'Remote OK' : 'On-site'}
                        </div>
                        {gig.deadline && (
                          <div className="deadline">
                            <i className="fas fa-calendar"></i>
                            {new Date(gig.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="page-btn"
                    >
                      <i className="fas fa-chevron-left"></i>
                      Previous
                    </button>

                    <div className="page-numbers">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setPagination(prev => ({ ...prev, page }))}
                            className={`page-number ${pagination.page === page ? 'active' : ''}`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      {pagination.pages > 5 && (
                        <>
                          <span className="ellipsis">...</span>
                          <button
                            onClick={() => setPagination(prev => ({ ...prev, page: pagination.pages }))}
                            className={`page-number ${pagination.page === pagination.pages ? 'active' : ''}`}
                          >
                            {pagination.pages}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.pages}
                      className="page-btn"
                    >
                      Next
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllGigsPage;