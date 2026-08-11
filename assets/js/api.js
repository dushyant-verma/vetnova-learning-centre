/**
 * API Abstraction Layer for Blog Module
 * Handles dynamic fetching from MERN Express Backend
 */
function getApiBaseUrl() {
  if (window.API_BASE_URL) return window.API_BASE_URL;
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
    return 'http://localhost:5001/api';
  }
  return 'https://vetnova-api-utnd.onrender.com/api';
}

const API_BASE_URL = getApiBaseUrl();

/**
 * Fetch all published blogs with optional filtering
 * @param {Object} options - Query filters (category, search, status, featured)
 * @returns {Promise<Array>} List of blog posts
 */
async function getBlogs(options = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    // Default to Published blogs for public website unless specified
    queryParams.append('status', options.status || 'Published');
    
    if (options.category && options.category !== 'all') {
      queryParams.append('category', options.category);
    }
    
    if (options.search) {
      queryParams.append('search', options.search);
    }

    if (options.featured !== undefined) {
      queryParams.append('featured', options.featured);
    }

    let response;
    try {
      response = await fetch(`${API_BASE_URL}/blogs?${queryParams.toString()}`);
    } catch (netErr) {
      // Fallback attempt to http://localhost:5001/api if primary URL failed
      if (!API_BASE_URL.includes('localhost:5001')) {
        response = await fetch(`http://localhost:5001/api/blogs?${queryParams.toString()}`);
      } else {
        throw netErr;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`API error: ${response ? response.status : 'Network error'}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching blogs from API:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug or ID
 * @param {string} slugOrId - Blog slug or MongoDB ObjectId
 * @returns {Promise<Object|null>} Blog details or null if not found
 */
async function getBlog(slugOrId) {
  if (!slugOrId) return null;
  
  try {
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(slugOrId)}`);
    } catch (netErr) {
      if (!API_BASE_URL.includes('localhost:5001')) {
        response = await fetch(`http://localhost:5001/api/blogs/${encodeURIComponent(slugOrId)}`);
      } else {
        throw netErr;
      }
    }
    
    if (!response || !response.ok) {
      if (response && response.status === 404) return null;
      throw new Error(`API error: ${response ? response.status : 'Network error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching blog details for [${slugOrId}]:`, error);
    return null;
  }
}
