const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create request headers
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: createHeaders(options.requireAuth !== false),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      requireAuth: false,
    }),
    
  register: (userData) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      requireAuth: false,
    }),
    
  getProfile: () => 
    apiRequest('/auth/profile'),
    
  updateProfile: (profileData) => 
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

// Gigs API calls
export const gigsAPI = {
  getAllGigs: (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    return apiRequest(`/gigs${queryString ? `?${queryString}` : ''}`, {
      requireAuth: false,
    });
  },
  
  getGigById: (id) => 
    apiRequest(`/gigs/${id}`, {
      requireAuth: false,
    }),
    
  createGig: (gigData) => 
    apiRequest('/gigs', {
      method: 'POST',
      body: JSON.stringify(gigData),
    }),
    
  updateGig: (id, gigData) => 
    apiRequest(`/gigs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gigData),
    }),
    
  deleteGig: (id) => 
    apiRequest(`/gigs/${id}`, {
      method: 'DELETE',
    }),
    
  getMyGigs: () => 
    apiRequest('/gigs/my'),
};

// Applications API calls
export const applicationsAPI = {
  submitApplication: (gigId, applicationData) => 
    apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify({
        gigId,
        ...applicationData,
      }),
    }),
    
  getMyApplications: () => 
    apiRequest('/applications/my'),
    
  getGigApplications: (gigId) => 
    apiRequest(`/applications/gig/${gigId}`),
    
  updateApplicationStatus: (applicationId, status) => 
    apiRequest(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Categories API calls
export const categoriesAPI = {
  getAllCategories: () => 
    apiRequest('/categories', {
      requireAuth: false,
    }),
    
  createCategory: (categoryData) => 
    apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }),
};

// Reviews API calls
export const reviewsAPI = {
  getGigReviews: (gigId) => 
    apiRequest(`/reviews/gig/${gigId}`, {
      requireAuth: false,
    }),
    
  getUserReviews: (userId) => 
    apiRequest(`/reviews/user/${userId}`, {
      requireAuth: false,
    }),
    
  createReview: (reviewData) => 
    apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),
};

// Error handling utility
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  // Handle specific error types
  if (error.message.includes('401')) {
    // Unauthorized - maybe redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }
  
  if (error.message.includes('403')) {
    // Forbidden
    return 'You do not have permission to perform this action';
  }
  
  if (error.message.includes('404')) {
    // Not found
    return 'The requested resource was not found';
  }
  
  if (error.message.includes('500')) {
    // Server error
    return 'Server error. Please try again later';
  }
  
  // Default error message
  return error.message || 'An unexpected error occurred';
};

export default {
  authAPI,
  gigsAPI,
  applicationsAPI,
  categoriesAPI,
  reviewsAPI,
  handleAPIError,
};