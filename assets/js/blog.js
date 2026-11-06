/**
 * Blog Listing Controller for blog.html
 * Populates existing HTML elements with dynamic API data.
 * Fetches categories dynamically from /api/categories.
 * Preserves exact layout, styles, and markup structure.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBlogPage();
});

let allBlogs = [];
let activeCategory = 'all';

const CATEGORY_SLUG_MAP = {
  'GENERAL': 'general',
  'VET NURSES': 'nurse',
  'VET NURSE': 'nurse',
  'ANIMAL WELFARE': 'welfare',
  'PET CARE & WELLNESS': 'pet-care',
  'PET CARE': 'pet-care',
  'CLINICAL SKILLS': 'clinical-skills',
  'EMERGENCY CARE': 'emergency',
  'EMERGENCY MEDICINE': 'emergency',
  'RADIOLOGY & IMAGING': 'radiology',
  'RADIOLOGY': 'radiology',
  'SURGERY': 'surgery',
  'SOFT TISSUE SURGERY': 'surgery',
  'CAREER ADVICE': 'career'
};

async function initBlogPage() {
  const featuredContainer = document.getElementById('featured-post-container');
  const gridContainer = document.getElementById('latest-articles-grid');

  // Load categories and blogs in parallel
  const [categoriesList, blogsData] = await Promise.all([
    getCategories(),
    getBlogs({ status: 'Published' })
  ]);

  if (Array.isArray(categoriesList)) {
    categoriesList.forEach(cat => {
      if (cat && cat.name && cat.slug) {
        CATEGORY_SLUG_MAP[cat.name.trim().toUpperCase()] = cat.slug.trim().toLowerCase();
      }
    });
  }

  allBlogs = blogsData || [];

  // Only replace grid content if API returned valid articles
  if (allBlogs && allBlogs.length > 0) {
    // Render dynamic Category Pills if the container exists
    renderCategoryPills(categoriesList, gridContainer);

    // Identify Featured Blog (either marked isFeatured or the first article)
    const featuredBlog = allBlogs.find(b => b.isFeatured) || allBlogs[0];

    // Render Featured Blog
    renderFeaturedBlog(featuredBlog, featuredContainer);

    // Render Grid Articles
    renderBlogGrid(allBlogs, gridContainer);
  }
}

function renderCategoryPills(categoriesList, gridContainer) {
  const pillsWrap = document.querySelector('.category-pills-wrap');
  if (!pillsWrap) return;

  if (categoriesList && categoriesList.length > 0) {
    pillsWrap.innerHTML = `
      <button class="category-pill ${activeCategory === 'all' ? 'active' : ''}" data-category="all">All Articles</button>
      ${categoriesList.map(cat => {
        const catSlug = cat.slug || slugify(cat.name);
        const catName = cat.name.toUpperCase();
        return `<button class="category-pill ${activeCategory === catSlug ? 'active' : ''}" data-category="${escapeHtml(catSlug)}">${escapeHtml(catName)}</button>`;
      }).join('')}
    `;
  }

  // Bind click listeners
  const pills = pillsWrap.querySelectorAll('.category-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category || 'all';
      renderBlogGrid(allBlogs, gridContainer);
    });
  });
}

function renderFeaturedBlog(blog, container) {
  if (!container || !blog) return;

  const dateStr = formatDate(blog.createdAt);
  const catList = Array.isArray(blog.categories) && blog.categories.length > 0
    ? blog.categories
    : [blog.category || 'GENERAL'];

  container.innerHTML = `
    <div class="featured-post-card">
      <div class="featured-post-media">
        <img src="${escapeHtml(blog.image || 'assets/images/blog/blog-featured-guide.webp')}"
          onerror="this.onerror=null; this.src='assets/images/blog/blog-featured-guide.webp';"
          alt="${escapeHtml(blog.title)}" loading="lazy" decoding="async" />
      </div>
      <div class="featured-post-content">
        <div class="post-meta flex flex-wrap gap-1 items-center">
          ${catList.map(c => `<span class="post-category-badge">${escapeHtml(c.toUpperCase())}</span>`).join('')}
          <span><i class="fa-regular fa-clock"></i> ${escapeHtml(blog.readTime || '8 Min Read')}</span>
          <span>• ${dateStr}</span>
        </div>
        <h2><a href="blog-single.html?slug=${encodeURIComponent(blog.slug || blog._id)}">${escapeHtml(blog.title)}</a></h2>
        <p class="featured-post-excerpt">${escapeHtml(blog.excerpt || '')}</p>
        <div class="post-author">
          <img src="${escapeHtml(blog.authorImage || 'assets/images/blog/blog-author-amit.webp')}"
            onerror="this.onerror=null; this.src='assets/images/blog/blog-author-amit.webp';"
            alt="VetNova Advisory Team" loading="lazy" decoding="async" />
          <div class="post-author-info">
            <strong>VetNova Advisory Team</strong>
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
    : blogs.filter(b => matchBlogCategories(b, activeCategory));

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
    const catList = Array.isArray(blog.categories) && blog.categories.length > 0
      ? blog.categories
      : [blog.category || 'CLINICAL GUIDE'];
    const authorImg = blog.authorImage || 'assets/images/blog/blog-author-amit.webp';

    // Collect all matching tokens (official slugs + slugified names)
    const categoryTokens = new Set();
    catList.forEach(c => {
      const upper = (c || '').trim().toUpperCase();
      if (CATEGORY_SLUG_MAP[upper]) {
        categoryTokens.add(CATEGORY_SLUG_MAP[upper]);
      }
      const slugified = slugify(c);
      if (slugified) {
        categoryTokens.add(slugified);
      }
    });

    const dataCategoryAttr = Array.from(categoryTokens).join(' ') || 'general';

    return `
      <div class="blog-card" data-category="${escapeHtml(dataCategoryAttr)}">
        <div class="blog-card-media">
          <img src="${escapeHtml(blog.image || 'assets/images/hero-veterinary-training.webp')}"
            onerror="this.onerror=null; this.src='assets/images/hero-veterinary-training.webp';"
            alt="${escapeHtml(blog.title)}" loading="lazy" decoding="async" />
        </div>
        <div class="blog-card-body">
          <div class="post-meta flex flex-wrap gap-1 items-center">
            ${catList.map(c => `<span class="post-category-badge">${escapeHtml(c.toUpperCase())}</span>`).join('')}
            <span>${escapeHtml(blog.readTime || '8 Min Read')}</span>
          </div>
          <h3><a href="blog-single.html?slug=${slugOrId}">${escapeHtml(blog.title)}</a></h3>
          <p>${escapeHtml(blog.excerpt || '')}</p>
          <div class="post-author" style="margin-top: auto;">
            <img src="${escapeHtml(authorImg)}"
              onerror="this.onerror=null; this.src='assets/images/blog/blog-author-amit.webp';"
              alt="VetNova Advisory Team" loading="lazy" decoding="async" />
            <div class="post-author-info">
              <strong>VetNova Advisory Team</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function matchBlogCategories(blog, targetCategory) {
  if (!targetCategory || targetCategory === 'all') return true;
  const target = slugify(targetCategory);
  
  const categoriesToTest = Array.isArray(blog.categories) && blog.categories.length > 0
    ? blog.categories
    : [blog.category || 'general'];

  return categoriesToTest.some(cat => {
    const upper = (cat || '').trim().toUpperCase();
    const mapped = CATEGORY_SLUG_MAP[upper];
    if (mapped && (mapped === target || mapped.includes(target) || target.includes(mapped))) return true;
    const c = slugify(cat);
    return c.includes(target) || target.includes(c);
  });
}

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .replace(/&+/g, 'and')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/-+/g, '-');
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
