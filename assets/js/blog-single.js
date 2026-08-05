/**
 * Single Blog Controller for blog-single.html
 * Populates existing HTML markup with dynamic API data.
 * Updates SEO meta tags dynamically.
 * Preserves exact layout, styling, and design.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBlogSinglePage();
});

async function initBlogSinglePage() {
  const urlParams = new URLSearchParams(window.location.search);
  let slug = urlParams.get('slug');

  // Fallback to default featured slug if none supplied in query
  if (!slug) {
    slug = 'step-by-step-soft-tissue-surgical-preparation-protocols';
  }

  const blog = await getBlog(slug);

  if (!blog) {
    renderNotFoundState();
    return;
  }

  // Update SEO Meta Tags
  updateSEOMetadata(blog);

  // Render Article Content
  renderArticleContent(blog);

  // Load Related Articles
  loadRelatedArticles(blog);
}

function updateSEOMetadata(blog) {
  const titleText = blog.seoTitle || `${blog.title} | VetNova`;
  document.title = titleText;

  const descText = blog.seoDescription || blog.excerpt || '';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', descText);

  // Open Graph
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', titleText);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', descText);

  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg && (blog.ogImage || blog.image)) {
    ogImg.setAttribute('content', blog.ogImage || blog.image);
  }
}

function renderArticleContent(blog) {
  // Breadcrumb
  const breadcrumbCat = document.getElementById('breadcrumb-category');
  if (breadcrumbCat) {
    breadcrumbCat.textContent = blog.category || 'Clinical Guide';
    breadcrumbCat.href = `blog.html#${encodeURIComponent(blog.category || '')}`;
  }

  const breadcrumbTitle = document.getElementById('breadcrumb-title');
  if (breadcrumbTitle) {
    breadcrumbTitle.textContent = blog.title;
  }

  // Category Badge
  const categoryBadge = document.getElementById('article-category-badge');
  if (categoryBadge) {
    categoryBadge.textContent = (blog.category || 'CLINICAL MASTERY').toUpperCase();
  }

  // Title & Subtitle
  const articleTitle = document.getElementById('article-title');
  if (articleTitle) {
    articleTitle.textContent = blog.title;
  }

  const articleExcerpt = document.getElementById('article-excerpt');
  if (articleExcerpt) {
    articleExcerpt.textContent = blog.excerpt || '';
  }

  // Author & Date Meta
  const authorAvatar = document.getElementById('article-author-avatar');
  if (authorAvatar) {
    authorAvatar.src = blog.authorImage || 'assets/images/blog/blog-author-amit.webp';
    authorAvatar.alt = blog.author || 'Author';
  }

  const authorName = document.getElementById('article-author-name');
  if (authorName) {
    authorName.textContent = blog.author || 'Dr. VetNova Specialist';
  }

  const articleDateRead = document.getElementById('article-date-read');
  if (articleDateRead) {
    const formattedDate = formatDate(blog.createdAt);
    articleDateRead.innerHTML = `Published ${formattedDate} • <i class="fa-regular fa-clock"></i> ${escapeHtml(blog.readTime || '5 Min Read')}`;
  }

  // Social Share Links
  const currentUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Check out this article: ${blog.title}`);
  
  const shareLinkedin = document.getElementById('share-linkedin');
  if (shareLinkedin) shareLinkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;

  const shareTwitter = document.getElementById('share-twitter');
  if (shareTwitter) shareTwitter.href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareText}`;

  const shareWhatsapp = document.getElementById('share-whatsapp');
  if (shareWhatsapp) shareWhatsapp.href = `https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`;

  // Hero Featured Image
  const heroImage = document.getElementById('article-hero-image');
  if (heroImage) {
    heroImage.src = blog.image || 'assets/images/hero-veterinary-training.webp';
    heroImage.alt = blog.title;
  }

  // Rich HTML Body Content
  const bodyContainer = document.getElementById('article-body-content');
  if (bodyContainer) {
    bodyContainer.innerHTML = blog.content || '<p>Content coming soon.</p>';
    
    // Auto-generate Table of Contents if container exists
    generateTableOfContents(bodyContainer);
  }
}

function generateTableOfContents(bodyContainer) {
  const tocList = document.getElementById('toc-list');
  if (!tocList) return;

  const headings = bodyContainer.querySelectorAll('h2, h3');
  if (headings.length === 0) {
    const tocBox = document.getElementById('toc');
    if (tocBox) tocBox.style.display = 'none';
    return;
  }

  tocList.innerHTML = Array.from(headings).map((h, idx) => {
    if (!h.id) {
      h.id = `section-auto-${idx + 1}`;
    }
    const isH3 = h.tagName.toLowerCase() === 'h3';
    const indent = isH3 ? 'margin-left: 16px; font-size: 14px;' : 'font-weight: 600;';
    return `<li style="${indent}"><a href="#${h.id}" style="color: var(--teal);">${escapeHtml(h.textContent)}</a></li>`;
  }).join('');
}

async function loadRelatedArticles(currentBlog) {
  const relatedContainer = document.getElementById('related-blogs-container');
  if (!relatedContainer) return;

  const allBlogs = await getBlogs();
  const related = allBlogs
    .filter(b => b._id !== currentBlog._id && b.slug !== currentBlog.slug)
    .slice(0, 3);

  if (related.length === 0) return;

  relatedContainer.innerHTML = related.map(b => `
    <div class="blog-card" data-category="${escapeHtml(b.category || '')}">
      <div class="blog-card-media">
        <img src="${escapeHtml(b.image || 'assets/images/hero-veterinary-training.webp')}" alt="${escapeHtml(b.title)}" loading="lazy" decoding="async" />
      </div>
      <div class="blog-card-body">
        <div class="post-meta">
          <span class="post-category-badge">${escapeHtml((b.category || 'CLINICAL').toUpperCase())}</span>
          <span>${escapeHtml(b.readTime || '5 Min Read')}</span>
        </div>
        <h3><a href="blog-single.html?slug=${encodeURIComponent(b.slug || b._id)}">${escapeHtml(b.title)}</a></h3>
        <p>${escapeHtml(b.excerpt || '')}</p>
        <div class="post-author" style="margin-top: auto;">
          <img src="${escapeHtml(b.authorImage || 'assets/images/blog/blog-author-amit.webp')}" alt="${escapeHtml(b.author)}" loading="lazy" decoding="async" />
          <div class="post-author-info">
            <strong>${escapeHtml(b.author)}</strong>
            <small>${escapeHtml(b.authorRole || 'Specialist')}</small>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderNotFoundState() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.innerHTML = `
      <section class="section">
        <div class="container" style="text-align: center; padding: 80px 0;">
          <i class="fa-solid fa-file-circle-xmark fa-4x" style="color: var(--teal); margin-bottom: 20px;"></i>
          <h1 style="font-size: 32px; color: var(--navy-2); margin-bottom: 12px;">Article Not Found</h1>
          <p style="color: var(--muted); margin-bottom: 24px;">The blog post you are looking for does not exist or has been removed.</p>
          <a href="blog.html" class="btn btn-primary"><i class="fa-solid fa-arrow-left"></i> Return to Knowledge Hub</a>
        </div>
      </section>
    `;
  }
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
