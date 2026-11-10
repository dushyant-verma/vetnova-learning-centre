/**
 * Blog Listing Controller for blog.html
 * VetNova Learning Centre Knowledge Hub
 * Dynamic Category Synchronization & Working Filters
 */

(function () {
  'use strict';

  // State
  let allBlogs = [];
  let availableCategories = [];
  let currentCategory = 'all'; // category slug, id, or 'all'
  let currentSearch = '';

  document.addEventListener('DOMContentLoaded', initBlogPage);

  /**
   * Main Initialization
   */
  async function initBlogPage() {
    const section = document.getElementById('latest-articles');
    if (!section) return;

    const searchInput = document.getElementById('blog-search');
    const gridContainer = document.getElementById('latest-articles-grid');
    const clearBtn = document.getElementById('blog-clear-filters');
    const emptyResetBtn = document.getElementById('blog-empty-reset');
    const toggleBtn = document.getElementById('blog-filter-toggle');
    const sidebar = document.getElementById('blog-filter-sidebar');
    const categoryFieldset = document.getElementById('blog-category-filters');

    // 1. Setup Static UI Event Handlers (Mobile drawer, Search, Clear)
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = (e.target.value || '').trim();
        applyFilters();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', resetAllFilters);
    }

    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', resetAllFilters);
    }

    // Read initial filters from URL query parameters (e.g. ?category=surgery or ?search=ultrasound)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('category')) {
      currentCategory = urlParams.get('category').trim().toLowerCase();
    }
    if (urlParams.get('search')) {
      currentSearch = urlParams.get('search').trim();
      if (searchInput) searchInput.value = currentSearch;
    }

    // 2. Fetch published blogs and categories in parallel from API
    try {
      const [fetchedCategories, fetchedBlogs] = await Promise.all([
        typeof getCategories === 'function' ? getCategories() : Promise.resolve([]),
        typeof getBlogs === 'function' ? getBlogs({ status: 'Published' }) : Promise.resolve([])
      ]);

      allBlogs = Array.isArray(fetchedBlogs) && fetchedBlogs.length > 0
        ? fetchedBlogs
        : getFallbackBlogsFromDOM();

      availableCategories = Array.isArray(fetchedCategories) ? fetchedCategories : [];
    } catch (err) {
      console.warn('Failed to load blog data from API, using fallback DOM content:', err);
      allBlogs = getFallbackBlogsFromDOM();
      availableCategories = [];
    }

    // 3. Render Blog Articles in the Grid
    renderArticlesGrid(allBlogs, gridContainer);

    // 4. Render Dynamic Sidebar Categories (ONLY categories with >= 1 published article)
    renderSidebarCategories(categoryFieldset);

    // 5. Apply active filters (Category + Search)
    applyFilters();
  }

  /**
   * Helper: Normalize text into URL-safe slug
   */
  function slugify(text) {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&+/g, 'and')
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/-+/g, '-');
  }

  /**
   * Helper: Format category display name cleanly
   * Title-cases ALL-CAPS names while preserving intentional capitalization
   */
  function formatCategoryDisplayName(name) {
    if (!name || typeof name !== 'string') return '';
    const trimmed = name.trim();
    if (trimmed === trimmed.toUpperCase() && trimmed !== trimmed.toLowerCase()) {
      return trimmed
        .toLowerCase()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return trimmed;
  }

  /**
   * Extract all matching identifier tokens for a given blog article
   */
  function getBlogCategoryTokens(blog) {
    const tokens = new Set();
    const rawList = [];
    if (Array.isArray(blog.categories)) rawList.push(...blog.categories);
    if (blog.category) rawList.push(blog.category);

    rawList.forEach(c => {
      if (!c || typeof c !== 'string') return;
      const clean = c.trim();
      if (!clean) return;
      tokens.add(clean.toLowerCase());
      tokens.add(slugify(clean));
    });
    return tokens;
  }

  /**
   * Check whether a blog belongs to a specific category object
   */
  function categoryMatchesBlog(cat, blog) {
    if (!cat) return false;
    const blogTokens = getBlogCategoryTokens(blog);

    const catName = (cat.name || '').trim().toLowerCase();
    const catSlug = (cat.slug || slugify(cat.name)).trim().toLowerCase();
    const catId = (cat._id || '').toString().toLowerCase();

    return blogTokens.has(catName) ||
      blogTokens.has(catSlug) ||
      (catId && blogTokens.has(catId)) ||
      blogTokens.has(slugify(catName));
  }

  /**
   * Extract ONLY categories with >= 1 published blog article assigned
   * Excludes categories with zero articles, draft categories, deleted/duplicate categories
   */
  function getRelevantCategories(categoriesList, blogs) {
    const relevantList = [];
    const seenSlugs = new Set();

    // 1. Process CMS-managed categories
    if (Array.isArray(categoriesList)) {
      categoriesList.forEach(cat => {
        if (!cat || !cat.name || cat.status === 'Draft') return;
        const slug = (cat.slug || slugify(cat.name)).trim().toLowerCase();
        if (!slug || seenSlugs.has(slug)) return;

        const count = blogs.filter(b => categoryMatchesBlog(cat, b)).length;
        if (count > 0) {
          seenSlugs.add(slug);
          relevantList.push({
            _id: cat._id || '',
            name: cat.name.trim(),
            slug: slug,
            articleCount: count
          });
        }
      });
    }

    // 2. Ensure any category assigned to a published blog is represented
    blogs.forEach(blog => {
      const rawList = [];
      if (Array.isArray(blog.categories)) rawList.push(...blog.categories);
      if (blog.category) rawList.push(blog.category);

      rawList.forEach(rawCat => {
        if (!rawCat || typeof rawCat !== 'string') return;
        const slug = slugify(rawCat);
        if (!slug || seenSlugs.has(slug)) return;

        const syntheticCat = { name: rawCat.trim(), slug: slug };
        const count = blogs.filter(b => categoryMatchesBlog(syntheticCat, b)).length;
        if (count > 0) {
          seenSlugs.add(slug);
          relevantList.push({
            _id: '',
            name: rawCat.trim(),
            slug: slug,
            articleCount: count
          });
        }
      });
    });

    return relevantList;
  }

  /**
   * Render dynamic sidebar category radio buttons
   */
  function renderSidebarCategories(categoryFieldset) {
    if (!categoryFieldset) return;

    const relevantCategories = getRelevantCategories(availableCategories, allBlogs);

    // If active category is no longer valid (e.g. its articles were unpublished), reset to 'all'
    if (currentCategory !== 'all') {
      const stillExists = relevantCategories.some(c => c.slug === currentCategory || (c._id && c._id === currentCategory));
      if (!stillExists) {
        currentCategory = 'all';
      }
    }

    let html = `
      <legend>Categories</legend>
      <label class="blog-filter-option ${currentCategory === 'all' ? 'is-active' : ''}">
        <input type="radio" name="blog-category" value="all" ${currentCategory === 'all' ? 'checked' : ''}>
        <span>All articles</span>
      </label>
    `;

    relevantCategories.forEach(cat => {
      const isChecked = currentCategory === cat.slug || (cat._id && currentCategory === cat._id);
      const displayName = formatCategoryDisplayName(cat.name);
      html += `
        <label class="blog-filter-option ${isChecked ? 'is-active' : ''}">
          <input type="radio" name="blog-category" value="${escapeHtml(cat.slug)}"
            data-category-slug="${escapeHtml(cat.slug)}"
            data-category-id="${escapeHtml(cat._id || '')}"
            data-category-name="${escapeHtml(cat.name)}"
            ${isChecked ? 'checked' : ''}>
          <span>${escapeHtml(displayName)}</span>
        </label>
      `;
    });

    categoryFieldset.innerHTML = html;

    // Attach change listeners to radio inputs
    const inputs = categoryFieldset.querySelectorAll('input[name="blog-category"]');
    inputs.forEach(input => {
      input.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        updateActiveCategoryHighlight(categoryFieldset);
        applyFilters();
      });
    });
  }

  /**
   * Highlight the currently active category radio option in UI
   */
  function updateActiveCategoryHighlight(categoryFieldset) {
    if (!categoryFieldset) return;
    const options = categoryFieldset.querySelectorAll('.blog-filter-option');
    options.forEach(opt => {
      const radio = opt.querySelector('input[type="radio"]');
      if (radio && radio.checked) {
        opt.classList.add('is-active');
      } else {
        opt.classList.remove('is-active');
      }
    });
  }

  /**
   * Render published articles into the grid
   */
  function renderArticlesGrid(blogs, gridContainer) {
    if (!gridContainer) return;

    if (!blogs || blogs.length === 0) {
      gridContainer.innerHTML = '';
      return;
    }

    gridContainer.innerHTML = blogs.map(blog => {
      const slug = encodeURIComponent(blog.slug || blog._id);
      const catList = Array.isArray(blog.categories) && blog.categories.length > 0
        ? blog.categories
        : [blog.category || 'CLINICAL SKILLS'];
      const authorImg = blog.authorImage || 'assets/images/blog/blog-author-amit.webp';
      const coverImg = blog.image || 'assets/images/hero-veterinary-training.webp';
      const tokens = Array.from(getBlogCategoryTokens(blog)).join(' ');

      return `
        <div class="blog-card" data-category="${escapeHtml(tokens)}" data-id="${escapeHtml(blog._id || '')}" data-slug="${escapeHtml(blog.slug || '')}">
          <div class="blog-card-media">
            <img src="${escapeHtml(coverImg)}"
              onerror="this.onerror=null; this.src='assets/images/hero-veterinary-training.webp';"
              alt="${escapeHtml(blog.title)}" loading="lazy" decoding="async" />
          </div>
          <div class="blog-card-body">
            <div class="post-meta">
              ${catList.map(c => `<span class="post-category-badge">${escapeHtml(c.toUpperCase())}</span>`).join(' ')}
              <span>${escapeHtml(blog.readTime || '8 Min Read')}</span>
            </div>
            <h3><a href="blog-single.html?slug=${slug}">${escapeHtml(blog.title)}</a></h3>
            <p>${escapeHtml(blog.excerpt || '')}</p>
            <div class="post-author" style="margin-top: auto;">
              <img src="${escapeHtml(authorImg)}"
                onerror="this.onerror=null; this.src='assets/images/blog/blog-author-amit.webp';"
                alt="${escapeHtml(blog.author || 'VetNova Advisory Team')}" loading="lazy" decoding="async" />
              <div class="post-author-info">
                <strong>${escapeHtml(blog.author || 'VetNova Advisory Team')}</strong>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Apply Active Filters (Category + Search Integration)
   */
  function applyFilters() {
    const gridContainer = document.getElementById('latest-articles-grid');
    const countElement = document.getElementById('blog-results-count');
    const emptyState = document.getElementById('blog-empty-state');
    if (!gridContainer) return;

    const cards = Array.from(gridContainer.querySelectorAll('.blog-card'));
    const term = currentSearch.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(card => {
      // 1. Category Matching
      const cardCatAttr = (card.dataset.category || '').toLowerCase();
      const cardTokens = cardCatAttr.split(/\s+/).filter(Boolean);
      const cardSlug = (card.dataset.slug || '').toLowerCase();
      const cardId = (card.dataset.id || '').toLowerCase();

      let matchesCategory = false;
      if (currentCategory === 'all') {
        matchesCategory = true;
      } else {
        const target = currentCategory.toLowerCase();
        matchesCategory = cardTokens.includes(target) ||
          cardTokens.includes(slugify(target)) ||
          cardSlug === target ||
          (cardId && cardId === target);
      }

      // 2. Search Matching (title, excerpt, author, content text, tags)
      let matchesSearch = true;
      if (term) {
        const cardText = (card.textContent || '').toLowerCase();
        const blogObj = allBlogs.find(b =>
          (b.slug && b.slug.toLowerCase() === cardSlug) ||
          (b._id && String(b._id).toLowerCase() === cardId)
        );

        let contentText = '';
        if (blogObj) {
          contentText = `${blogObj.title || ''} ${blogObj.excerpt || ''} ${stripHtml(blogObj.content || '')} ${blogObj.author || ''} ${(Array.isArray(blogObj.tags) ? blogObj.tags.join(' ') : (blogObj.tags || ''))}`.toLowerCase();
        }

        matchesSearch = cardText.includes(term) || (contentText && contentText.includes(term));
      }

      const isVisible = matchesCategory && matchesSearch;
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount++;
      }
    });

    // 3. Update Results Count & Toolbar
    const totalCount = cards.length;
    if (countElement) {
      if (visibleCount === 0) {
        countElement.textContent = 'No articles found';
      } else if (visibleCount === 1) {
        countElement.textContent = 'Showing 1 article';
      } else if (visibleCount === totalCount) {
        countElement.textContent = `Showing all ${totalCount} articles`;
      } else {
        countElement.textContent = `Showing ${visibleCount} of ${totalCount} articles`;
      }
    }

    // 4. Update Empty State Visibility
    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
    gridContainer.hidden = visibleCount === 0;
  }

  /**
   * Reset All Filters (Search and Category)
   */
  function resetAllFilters() {
    const searchInput = document.getElementById('blog-search');
    const categoryFieldset = document.getElementById('blog-category-filters');

    currentSearch = '';
    currentCategory = 'all';

    if (searchInput) searchInput.value = '';

    if (categoryFieldset) {
      const allRadio = categoryFieldset.querySelector('input[name="blog-category"][value="all"]');
      if (allRadio) allRadio.checked = true;
      updateActiveCategoryHighlight(categoryFieldset);
    }

    applyFilters();
  }

  /**
   * Fallback: Extract articles from existing DOM markup if API request fails
   */
  function getFallbackBlogsFromDOM() {
    const gridContainer = document.getElementById('latest-articles-grid');
    if (!gridContainer) return [];
    const cards = Array.from(gridContainer.querySelectorAll('.blog-card'));
    return cards.map(card => {
      const titleEl = card.querySelector('h3 a');
      const excerptEl = card.querySelector('p');
      const authorEl = card.querySelector('.post-author strong');
      const authorImgEl = card.querySelector('.post-author img');
      const mediaImgEl = card.querySelector('.blog-card-media img');
      const badgeEls = Array.from(card.querySelectorAll('.post-category-badge'));
      const metaSpan = card.querySelector('.post-meta span:not(.post-category-badge)');
      const cats = badgeEls.map(b => b.textContent.trim()).filter(Boolean);

      let slug = '';
      if (titleEl && titleEl.getAttribute('href')) {
        const match = titleEl.getAttribute('href').match(/slug=([^&]+)/);
        slug = match ? decodeURIComponent(match[1]) : '';
      }

      return {
        _id: '',
        title: titleEl ? titleEl.textContent.trim() : '',
        slug: slug || card.dataset.slug || '',
        excerpt: excerptEl ? excerptEl.textContent.trim() : '',
        content: '',
        author: authorEl ? authorEl.textContent.trim() : 'VetNova Advisory Team',
        authorImage: authorImgEl ? authorImgEl.getAttribute('src') : '',
        image: mediaImgEl ? mediaImgEl.getAttribute('src') : '',
        readTime: metaSpan ? metaSpan.textContent.trim() : '8 Min Read',
        category: cats[0] || 'CLINICAL SKILLS',
        categories: cats.length > 0 ? cats : ['CLINICAL SKILLS'],
        status: 'Published'
      };
    });
  }

  /**
   * Utility: Strip HTML tags for clean search string matching
   */
  function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, ' ');
  }

  /**
   * Utility: Escape HTML special characters
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
