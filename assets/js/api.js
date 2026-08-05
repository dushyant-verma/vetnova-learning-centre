/**
 * API Abstraction Layer for Blog Module
 * Handles dynamic fetching from MERN Express Backend
 */
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:5001/api';

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

    const response = await fetch(`${API_BASE_URL}/blogs?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
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
    const response = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(slugOrId)}`);
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching blog details for [${slugOrId}]:`, error);
    return null;
  }
}
