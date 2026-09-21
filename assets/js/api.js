/**
 * API Abstraction Layer for VetNova Learning Centre Public Website
 * Connects public HTML pages with VetNova Platform MERN Express Backend
 */
function getApiBaseUrl() {
  if (window.API_BASE_URL) return window.API_BASE_URL;
  const hostname = window.location.hostname;
  if (window.USE_LOCAL_API && (hostname === 'localhost' || hostname === '127.0.0.1')) {
    return 'http://localhost:5001/api';
  }
  return 'https://vetnova-api-utnd.onrender.com/api';
}

const API_BASE_URL = getApiBaseUrl();

/**
 * Utility helper to handle HTTP fetch from public API
 */
async function fetchFromApi(endpoint, queryParams = {}) {
  const params = new URLSearchParams(queryParams);
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const primaryUrl = `${API_BASE_URL}${endpoint}${queryString}`;

  try {
    const response = await fetch(primaryUrl);

    if (!response || !response.ok) {
      if (response && response.status === 404) return null;
      throw new Error(`API error: ${response ? response.status : 'Network error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed [${endpoint}]`);
    return null;
  }
}

/**
 * Fetch all published Faculty members with optional program filtering
 * @param {Object} options - Query filters (program, status, search)
 * @returns {Promise<Array>} List of published faculty members
 */
async function getFaculty(options = {}) {
  const query = {
    status: options.status || 'Published',
    public: 'true'
  };
  if (options.program) query.program = options.program;
  if (options.search) query.search = options.search;

  const data = await fetchFromApi('/faculty', query);
  if (!data) {
    // Retry fallback to /experts alias
    const fallbackData = await fetchFromApi('/experts', query);
    return Array.isArray(fallbackData) ? fallbackData : [];
  }
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch a single faculty member by ID or slug
 * @param {string} idOrSlug - Faculty ID or slug
 * @returns {Promise<Object|null>} Faculty details
 */
async function getFacultyMember(idOrSlug) {
  if (!idOrSlug) return null;
  const data = await fetchFromApi(`/faculty/${encodeURIComponent(idOrSlug)}`);
  if (!data) {
    return await fetchFromApi(`/experts/${encodeURIComponent(idOrSlug)}`);
  }
  return data;
}

/**
 * Fetch all published Advisory Board members
 * @returns {Promise<Array>} List of published advisory board members
 */
async function getAdvisoryBoard() {
  const data = await fetchFromApi('/advisory-board', { status: 'Published', public: 'true' });
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch all published Blog Categories
 * @returns {Promise<Array>} List of blog categories
 */
async function getCategories() {
  const data = await fetchFromApi('/categories', { status: 'Published' });
  if (!data) {
    const fallbackData = await fetchFromApi('/blog-categories', { status: 'Published' });
    return Array.isArray(fallbackData) ? fallbackData : [];
  }
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch all published blogs with optional filtering
 * @param {Object} options - Query filters (category, search, status, featured)
 * @returns {Promise<Array>} List of blog posts
 */
async function getBlogs(options = {}) {
  const query = {
    status: options.status || 'Published'
  };
  if (options.category && options.category !== 'all') query.category = options.category;
  if (options.search) query.search = options.search;
  if (options.featured !== undefined) query.featured = options.featured;

  const data = await fetchFromApi('/blogs', query);
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch a single blog post by slug or ID
 * @param {string} slugOrId - Blog slug or MongoDB ObjectId
 * @returns {Promise<Object|null>} Blog details or null if not found
 */
async function getBlog(slugOrId) {
  if (!slugOrId) return null;
  return await fetchFromApi(`/blogs/${encodeURIComponent(slugOrId)}`);
}

/**
 * Submit an enquiry / form submission to VetNova MERN backend
 * @param {Object} enquiryData - { name, countryCode, phone, email, profile, course, message, source, sourcePage }
 * @returns {Promise<Object>} API response JSON object
 */
async function submitEnquiry(enquiryData) {
  const primaryUrl = `${API_BASE_URL}/enquiries`;
  try {
    const response = await fetch(primaryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Too many submission attempts. Please wait a moment before trying again.');
      }
      throw new Error(data.message || 'Failed to submit enquiry. Please try again.');
    }
    return data;
  } catch (error) {
    throw error;
  }
}


