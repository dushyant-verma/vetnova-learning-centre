/**
 * Homepage Faculty Controller for index.html
 * Fetches published Faculty from VetNova Platform MERN API.
 * Deduplicates by _id / id / slug, limits to first 4 cards, and renders "View More Faculty" button.
 * Enforces zero hardcoded fallback cards on API error or empty data.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHomepageFaculty();
});

// Cache map of loaded faculty objects indexed by ID or slug for modal popup
window.loadedFacultyMap = window.loadedFacultyMap || {};

async function initHomepageFaculty() {
  const facultyGrid = document.querySelector('#faculty-experts .faculty-cards-grid');
  if (!facultyGrid) return;

  // Show loading indicator while fetching from API
  facultyGrid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--muted, #64748b);">
      <i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--teal, #12C7C1); margin-bottom: 12px;"></i>
      <p style="font-size: 14px; font-weight: 500; margin: 0;">Loading expert faculty...</p>
    </div>
  `;

  let facultyList = [];
  try {
    if (typeof getFaculty === 'function') {
      facultyList = await getFaculty({ status: 'Published' });
    } else {
      console.warn('getFaculty function unavailable in API abstraction layer.');
    }
  } catch (err) {
    console.error('Failed to fetch homepage faculty:', err);
    facultyList = [];
  }

  // Deduplication logic using _id > id > slug > normalized name
  const uniqueFaculty = [];
  const seen = new Set();

  for (const member of facultyList || []) {
    if (!member) continue;

    // Rule 2: Only include faculty whose status is Published
    const statusStr = String(member.status || 'Published').toLowerCase().trim();
    if (statusStr !== 'published') continue;

    // Primary unique identifier: _id
    const id = member._id || member.id || member.slug || (member.name ? slugify(member.name) : null);
    if (!id || seen.has(id)) continue;

    seen.add(id);
    uniqueFaculty.push(member);
  }

  // Rules 7 & 8: Empty / Error state if no faculty available
  if (!uniqueFaculty || uniqueFaculty.length === 0) {
    facultyGrid.innerHTML = `
      <div class="faculty-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 48px 24px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 20px;">
        <i class="fa-solid fa-user-doctor" style="font-size: 36px; color: #94a3b8; margin-bottom: 12px; display: block;"></i>
        <h3 style="font-size: 1.1rem; color: #334155; margin-bottom: 6px; font-weight: 600;">No Faculty Currently Listed</h3>
        <p style="font-size: 0.9rem; color: #64748b; margin: 0;">Faculty members will appear here once published in the dashboard.</p>
      </div>
    `;
    return;
  }

  // Rule: Display ONLY the first 4 unique published faculty members
  const displayFaculty = uniqueFaculty.slice(0, 4);

  facultyGrid.innerHTML = displayFaculty.map(member => {
    const idKey = member._id || member.id || member.slug || slugify(member.name);
    window.loadedFacultyMap[idKey] = member;

    const name = escapeHtml(member.name || 'Faculty Specialist');
    const qual = escapeHtml(member.qualification || 'BVSc & AH');
    const spec = escapeHtml(member.department || member.specialization || member.designation || 'Veterinary Specialist');
    const exp = escapeHtml(member.experience || '10+ Yrs Exp');
    const bio = escapeHtml(member.bio || member.qualification || 'Clinical & Surgical Veterinary Specialist');
    const photo = member.image || 'assets/images/about/about-faculty-01.webp';

    const tags = (member.department || member.specialization || member.designation || 'Clinical Care')
      .split(/[,&]/)
      .map(t => t.trim())
      .filter(Boolean)
      .slice(0, 3);

    return `
      <div class="expert-card">
        <div class="expert-header">
          <img src="${escapeHtml(photo)}" onerror="this.onerror=null; this.src='assets/images/about/about-faculty-01.webp';" alt="${name}" class="expert-portrait" loading="lazy" decoding="async" />
          <div class="expert-meta">
            <h3>${name}</h3>
            <span class="specialty">${spec}</span>
          </div>
        </div>
        <p class="expert-bio">${bio}</p>
        <div class="expert-tags">
          ${tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="faculty-footer">
          <span class="faculty-exp">${exp}</span>
          <button type="button" class="btn btn-outline btn-sm faculty-profile-btn" data-faculty-id="${idKey}">View Profile</button>
        </div>
      </div>
    `;
  }).join('');

  // Re-bind profile popup click events
  bindHomepageFacultyModalEvents();
}

function bindHomepageFacultyModalEvents() {
  const btns = document.querySelectorAll('#faculty-experts .faculty-profile-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const facultyId = btn.getAttribute('data-faculty-id');
      openDefaultFacultyModal(facultyId);
    });
  });
}

function openDefaultFacultyModal(facultyId) {
  const member = window.loadedFacultyMap[facultyId];
  if (!member) return;

  let modal = document.getElementById('faculty-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'faculty-modal-overlay';
    modal.id = 'faculty-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'faculty-modal-name');
    modal.innerHTML = `
      <div class="faculty-modal-content">
        <button class="faculty-modal-close" id="faculty-modal-close" aria-label="Close modal">&times;</button>
        <div class="faculty-modal-layout">
          <div class="faculty-modal-left">
            <img id="faculty-modal-image" src="" alt="Faculty Image" class="faculty-modal-image" />
          </div>
          <div class="faculty-modal-right">
            <h2 id="faculty-modal-name" class="faculty-modal-name"></h2>
            <p id="faculty-modal-role" class="faculty-modal-role"></p>
            <div class="faculty-modal-meta">
              <span id="faculty-modal-qual" class="faculty-modal-qual"></span>
              <span id="faculty-modal-exp" class="faculty-modal-exp"></span>
            </div>
            <p id="faculty-modal-intro" class="faculty-modal-intro"></p>
            
            <div class="faculty-modal-expertise-section">
              <h4>Areas of Expertise</h4>
              <div id="faculty-modal-expertise" class="faculty-modal-expertise"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = document.getElementById('faculty-modal-close');
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };
    if (closeBtn) closeBtn.onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
  }

  const imgEl = document.getElementById('faculty-modal-image');
  const nameEl = document.getElementById('faculty-modal-name');
  const roleEl = document.getElementById('faculty-modal-role');
  const qualEl = document.getElementById('faculty-modal-qual');
  const expEl = document.getElementById('faculty-modal-exp');
  const introEl = document.getElementById('faculty-modal-intro');
  const expertiseEl = document.getElementById('faculty-modal-expertise');

  if (imgEl) {
    imgEl.src = member.image || member.img || 'assets/images/about/about-faculty-01.webp';
    imgEl.alt = member.name || 'Faculty Member';
  }
  if (nameEl) nameEl.textContent = member.name || '';
  if (roleEl) roleEl.textContent = member.designation || member.department || member.specialization || member.role || '';
  if (qualEl) qualEl.textContent = member.qualification || member.qual || '';
  if (expEl) expEl.textContent = member.experience || member.exp || '';
  if (introEl) introEl.textContent = member.bio || member.intro || '';

  if (expertiseEl) {
    expertiseEl.innerHTML = '';
    const tags = member.department || member.specialization
      ? (member.department || member.specialization).split(/[,&]/).map(t => t.trim()).filter(Boolean)
      : (Array.isArray(member.expertise) ? member.expertise : ['Clinical Care']);

    tags.forEach(t => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = t;
      expertiseEl.appendChild(chip);
    });
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
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
