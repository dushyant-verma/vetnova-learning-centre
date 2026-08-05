/**
 * Blog Listing Controller for blog.html
 * Populates existing HTML elements with dynamic API data.
 * Preserves exact layout, styles, and markup structure.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBlogPage();
});

let allBlogs = [];
let activeCategory = 'all';

async function initBlogPage() {
  const featuredContainer = document.getElementById('featured-post-container');
  const gridContainer = document.getElementById('latest-articles-grid');

  if (gridContainer) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 0; color: var(--muted);">
        <i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--teal); margin-bottom: 12px;"></i>
        <p>Loading knowledge hub articles...</p>
      </div>
    `;
  }

  // Fetch blogs from API
  allBlogs = await getBlogs();

  if (!allBlogs || allBlogs.length === 0) {
    if (gridContainer) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 0; color: var(--muted);">
          <i class="fa-solid fa-newspaper fa-2x" style="margin-bottom: 12px;"></i>
          <p>No articles currently available. Check back soon!</p>
        </div>
      `;
    }
    return;
  }

  // Identify Featured Blog (either marked isFeatured or the first article)
  const featuredBlog = allBlogs.find(b => b.isFeatured) || allBlogs[0];

  // Render Featured Blog
  renderFeaturedBlog(featuredBlog, featuredContainer);

  // Render Grid Articles
  renderBlogGrid(allBlogs, gridContainer);

  // Setup Category Pills Filter Listeners
  setupCategoryFilters(gridContainer);
}

function renderFeaturedBlog(blog, container) {
  if (!container || !blog) return;

  const dateStr = formatDate(blog.createdAt);
  const categoryUpper = (blog.category || 'SURGICAL MASTERY').toUpperCase();

  container.innerHTML = `
    <div class="featured-post-card">
      <div class="featured-post-media">
        <img src="${escapeHtml(blog.image || 'assets/images/blog/blog-featured-guide.webp')}"
          alt="${escapeHtml(blog.title)}" loading="lazy" decoding="async" />
      </div>
      <div class="featured-post-content">
        <div class="post-meta">
          <span class="post-category-badge">${escapeHtml(categoryUpper)}</span>
          <span><i class="fa-regular fa-clock"></i> ${escapeHtml(blog.readTime || '8 Min Read')}</span>
          <span>• ${dateStr}</span>
        </div>
        <h2><a href="blog-single.html?slug=${encodeURIComponent(blog.slug || blog._id)}">${escapeHtml(blog.title)}</a></h2>
        <p class="featured-post-excerpt">${escapeHtml(blog.excerpt || '')}</p>
        <div class="post-author">
          <img src="${escapeHtml(blog.authorImage || 'assets/images/blog/blog-author-amit.webp')}" alt="${escapeHtml(blog.author)}" loading="lazy" decoding="async" />
          <div class="post-author-info">
            <strong>${escapeHtml(blog.author)}</strong>
            <small>${escapeHtml(blog.authorRole || 'Faculty Specialist')}</small>
          </div>
          <a class="btn btn-primary btn-sm" style="margin-left: auto;" href="blog-single.html?slug=${encodeURIComponent(blog.slug || blog._id)}">
            Read Article <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderBlogGrid(blogs, container) {
  if (!container) return;

  // Filter based on active category if set
  const filtered = activeCategory === 'all' 
    ? blogs 
    : blogs.filter(b => normalizeCategory(b.category) === normalizeCategory(activeCategory));

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 0; color: var(--muted);">
        <i class="fa-solid fa-filter fa-2x" style="margin-bottom: 12px; color: var(--teal);"></i>
        <p>No articles found under this category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(blog => {
    const slugOrId = encodeURIComponent(blog.slug || blog._id);
    const categoryUpper = (blog.category || 'CLINICAL GUIDE').toUpperCase();
    const authorImg = blog.authorImage || 'assets/images/blog/blog-author-amit.webp';

    return `
      <div class="blog-card" data-category="${escapeHtml(normalizeCategory(blog.category))}">
        <div class="blog-card-media">
          <img src="${escapeHtml(blog.image || 'assets/images/hero-veterinary-training.webp')}"
            alt="${escapeHtml(blog.title)}" loading="lazy" decoding="async" />
        </div>
        <div class="blog-card-body">
          <div class="post-meta">
            <span class="post-category-badge">${escapeHtml(categoryUpper)}</span>
            <span>${escapeHtml(blog.readTime || '5 Min Read')}</span>
          </div>
          <h3><a href="blog-single.html?slug=${slugOrId}">${escapeHtml(blog.title)}</a></h3>
          <p>${escapeHtml(blog.excerpt || '')}</p>
          <div class="post-author" style="margin-top: auto;">
            <img src="${escapeHtml(authorImg)}" alt="${escapeHtml(blog.author)}" loading="lazy" decoding="async" />
            <div class="post-author-info">
              <strong>${escapeHtml(blog.author)}</strong>
              <small>${escapeHtml(blog.authorRole || 'Specialist')}</small>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupCategoryFilters(gridContainer) {
  const pills = document.querySelectorAll('.category-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category || 'all';
      renderBlogGrid(allBlogs, gridContainer);
    });
  });
}

function normalizeCategory(cat) {
  if (!cat) return 'all';
  const c = cat.toLowerCase();
  if (c.includes('surgery')) return 'surgery';
  if (c.includes('radiology') || c.includes('imaging')) return 'radiology';
  if (c.includes('emergency')) return 'emergency';
  if (c.includes('clinical')) return 'clinical-skills';
  if (c.includes('pet') || c.includes('wellness')) return 'pet-care';
  if (c.includes('welfare')) return 'welfare';
  if (c.includes('nurse')) return 'nurse';
  if (c.includes('career')) return 'career';
  return c;
}

function formatDate(dateStr) {
  if (!dateStr) return 'August 1, 2026';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
