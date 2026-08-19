/**
 * Single Blog Controller for blog-single.html
 * Populates existing HTML markup with dynamic API data.
 * Generates dynamic Table of Contents from H1-H6 headings.
 * Renders relevant Related Practical Programs (zero random selection).
 * Preserves exact layout, styling, and design.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBlogSinglePage();
});

const PROGRAM_DETAILS_MAP = {
  'veterinary-skill-up': {
    title: 'Veterinary Skill-Up Program',
    meta: '6-Month Comprehensive Track',
    url: 'veterinary-skill-up.html',
    icon: 'fa-graduation-cap'
  },
  'emergency-medicine': {
    title: 'Emergency & Critical Care',
    meta: '1-Week Practical Masterclass',
    url: 'emergency-medicine.html',
    icon: 'fa-truck-medical'
  },
  'radiology-ultrasound': {
    title: 'Radiology & Ultrasound',
    meta: '4-Day Hands-on Workshop',
    url: 'radiology-ultrasound.html',
    icon: 'fa-wave-square'
  },
  'soft-tissue-surgery': {
    title: 'Soft Tissue Surgery Track',
    meta: '1-Week Practical Masterclass',
    url: 'soft-tissue-surgery.html',
    icon: 'fa-scalpel'
  },
  'vet-nurse-programme': {
    title: 'Vet Nurse Certification',
    meta: 'Foundation Nursing Track',
    url: 'vet-nurse-programme.html',
    icon: 'fa-user-nurse'
  }
};

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

  // Render Article Content & TOC
  renderArticleContent(blog);

  // Load Related Articles
  loadRelatedArticles(blog);

  // Render Related Practical Programs
  renderRelatedPrograms(blog);
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
  const catList = Array.isArray(blog.categories) && blog.categories.length > 0
    ? blog.categories
    : [blog.category || 'Clinical Guide'];

  // Breadcrumb
  const breadcrumbCat = document.getElementById('breadcrumb-category');
  if (breadcrumbCat) {
    breadcrumbCat.textContent = catList[0];
    breadcrumbCat.href = `blog.html#${encodeURIComponent(catList[0])}`;
  }

  const breadcrumbTitle = document.getElementById('breadcrumb-title');
  if (breadcrumbTitle) {
    breadcrumbTitle.textContent = blog.title;
  }

  // Category Badge
  const categoryBadge = document.getElementById('article-category-badge');
  if (categoryBadge) {
    categoryBadge.textContent = catList.map(c => c.toUpperCase()).join(' • ');
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
    authorAvatar.onerror = function() {
      this.onerror = null;
      this.src = 'assets/images/blog/blog-author-amit.webp';
    };
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
    heroImage.onerror = function() {
      this.onerror = null;
      this.src = 'assets/images/hero-veterinary-training.webp';
    };
    heroImage.alt = blog.title;
  }

  // Rich HTML Body Content
  const bodyContainer = document.getElementById('article-body-content');
  if (bodyContainer) {
    bodyContainer.innerHTML = blog.content || '<p>Content coming soon.</p>';
    
    // Auto-generate Table of Contents from H1 - H6 headings after content is rendered into DOM
    generateTableOfContents(bodyContainer);
  }
}

function generateTableOfContents(bodyContainer) {
  const widgets = document.querySelectorAll('.article-sidebar .sidebar-widget');
  let tocWidget = null;

  widgets.forEach(w => {
    const h4 = w.querySelector('h4, h3, h2');
    if (h4 && h4.textContent.trim().toLowerCase().includes('table of contents')) {
      tocWidget = w;
    }
  });

  if (!tocWidget && widgets.length > 0) {
    tocWidget = widgets[0];
  }

  if (!tocWidget) return;

  let tocList = tocWidget.querySelector('.toc-list') || document.getElementById('toc-list');
  if (!tocList) {
    tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    tocWidget.appendChild(tocList);
  }

  const headings = bodyContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length === 0) {
    tocWidget.style.display = 'none';
    return;
  }

  tocWidget.style.display = 'block';
  const idCounts = {};

  tocList.innerHTML = Array.from(headings).map((h) => {
    const rawText = h.textContent.trim();
    let baseSlug = slugify(rawText) || 'section';
    
    if (idCounts[baseSlug]) {
      idCounts[baseSlug]++;
      h.id = `${baseSlug}-${idCounts[baseSlug]}`;
    } else {
      idCounts[baseSlug] = 1;
      h.id = baseSlug;
    }

    const tagName = h.tagName.toLowerCase();
    let indentClass = '';
    let styleStr = 'margin-bottom: 6px;';

    if (tagName === 'h1' || tagName === 'h2') {
      styleStr += ' font-weight: 700; font-size: 14px;';
    } else if (tagName === 'h3') {
      styleStr += ' margin-left: 12px; font-size: 13px; font-weight: 500;';
    } else if (tagName === 'h4') {
      styleStr += ' margin-left: 20px; font-size: 12px; opacity: 0.9;';
    } else if (tagName === 'h5') {
      styleStr += ' margin-left: 28px; font-size: 12px; opacity: 0.85;';
    } else if (tagName === 'h6') {
      styleStr += ' margin-left: 36px; font-size: 11px; opacity: 0.8;';
    }

    return `<li style="${styleStr}"><a href="#${h.id}" style="color: var(--teal); text-decoration: none;">${escapeHtml(rawText)}</a></li>`;
  }).join('');
}

function renderRelatedPrograms(blog) {
  const widgets = document.querySelectorAll('.article-sidebar .sidebar-widget');
  let widgetContainer = null;

  widgets.forEach(w => {
    const h4 = w.querySelector('h4');
    if (h4 && (h4.textContent.includes('Related') || h4.textContent.includes('Program') || h4.textContent.includes('Course'))) {
      widgetContainer = w;
    }
  });

  if (!widgetContainer && widgets.length >= 3) {
    widgetContainer = widgets[2];
  }

  if (!widgetContainer) return;

  let assignedSlugs = Array.isArray(blog.relatedPrograms) && blog.relatedPrograms.length > 0
    ? blog.relatedPrograms
    : [];

  // Deterministic Fallback based on Category if no explicit assignment exists
  if (assignedSlugs.length === 0) {
    const catStr = (blog.category || (Array.isArray(blog.categories) ? blog.categories[0] : '') || '').toLowerCase();
    if (catStr.includes('surgery')) assignedSlugs = ['soft-tissue-surgery'];
    else if (catStr.includes('radiology') || catStr.includes('imaging')) assignedSlugs = ['radiology-ultrasound'];
    else if (catStr.includes('emergency')) assignedSlugs = ['emergency-medicine'];
    else if (catStr.includes('nurse')) assignedSlugs = ['vet-nurse-programme'];
    else assignedSlugs = ['veterinary-skill-up'];
  }

  const cardsHtml = assignedSlugs.map((slug) => {
    const p = PROGRAM_DETAILS_MAP[slug] || PROGRAM_DETAILS_MAP['veterinary-skill-up'];
    return `
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px border-dashed #e2e8f0;">
        <div style="width: 40px; height: 40px; border-radius: 8px; background-color: var(--mint); color: var(--teal); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
          <i class="fa-solid ${p.icon}"></i>
        </div>
        <div style="flex: 1;">
          <strong style="display: block; font-size: 13px; color: var(--navy-2); font-weight: 700;">${escapeHtml(p.title)}</strong>
          <small style="color: var(--muted); font-size: 11px;">${escapeHtml(p.meta)}</small>
        </div>
        <a class="btn btn-outline btn-sm" style="padding: 4px 10px; font-size: 11px; flex-shrink: 0;" href="${p.url}">View</a>
      </div>
    `;
  }).join('');

  widgetContainer.innerHTML = `
    <h4 style="font-size: 16px; color: var(--navy-2); margin-bottom: 14px; border-bottom: 2px solid var(--mint); padding-bottom: 6px;">Related Practical Program</h4>
    <div style="display: flex; flex-direction: column;">
      ${cardsHtml}
    </div>
  `;
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

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
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
