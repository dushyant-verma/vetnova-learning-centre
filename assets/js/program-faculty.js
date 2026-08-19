/**
 * Program Faculty Controller for Single Program Pages
 * Handles dynamic fetching and modal popups for program-assigned faculty members.
 * Enforces STRICT Faculty-to-Program assignment mapping from Dashboard.
 * Zero fallback, zero random, zero unassigned faculty displayed.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProgramFaculty();
});

async function initProgramFaculty() {
  const facultyGrid = document.querySelector('.faculty-grid');
  if (!facultyGrid) return;

  // Render temporary loading state while fetching API assignments
  facultyGrid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--muted);">
      <i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--teal); margin-bottom: 12px;"></i>
      <p style="font-size: 14px;">Loading program faculty assignments...</p>
    </div>
  `;

  // Determine current program slug from URL path or query params
  const rawFile = window.location.pathname.split('/').pop() || 'programs-single.html';
  const urlParams = new URLSearchParams(window.location.search);
  let programSlug = urlParams.get('slug') || rawFile.replace('.html', '');

  if (programSlug === 'index' || programSlug === 'programs' || programSlug === 'programs-single') {
    programSlug = 'veterinary-skill-up';
  }

  // Fetch published faculty from API
  const facultyList = await getFaculty({ program: programSlug, status: 'Published' });

  // Secondary strict filter on client side: member.programs MUST explicitly contain programSlug
  const filteredList = (facultyList || []).filter(member => {
    if (!member.programs || !Array.isArray(member.programs)) return false;
    return member.programs.some(p => p.toLowerCase() === programSlug.toLowerCase());
  });

  if (!filteredList || filteredList.length === 0) {
    facultyGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--muted); background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
        <i class="fa-solid fa-user-doctor fa-2x" style="margin-bottom: 12px; color: var(--teal);"></i>
        <p style="font-weight: 500; margin: 0; color: var(--navy-2);">No faculty members currently assigned to this program.</p>
        <small style="color: var(--muted);">Faculty assignments can be updated via the VetNova Platform Dashboard.</small>
      </div>
    `;
    return;
  }

  window.loadedFacultyMap = window.loadedFacultyMap || {};

  facultyGrid.innerHTML = filteredList.map(member => {
    const idKey = member._id || member.slug || slugify(member.name);
    window.loadedFacultyMap[idKey] = member;

    const name = escapeHtml(member.name || 'Faculty Specialist');
    const qual = escapeHtml(member.qualification || 'BVSc & AH');
    const spec = escapeHtml(member.department || member.specialization || member.designation || 'Veterinary Specialist');
    const exp = escapeHtml(member.experience || '10+ Yrs Exp');
    const photo = member.image || 'assets/images/about/about-faculty-01.webp';
    
    const tags = (member.department || member.specialization || 'Clinical Care')
      .split(/[,&]/)
      .map(t => t.trim())
      .filter(Boolean)
      .slice(0, 3);

    return `
      <div class="faculty-card">
        <div class="faculty-photo">
          <img src="${escapeHtml(photo)}" onerror="this.onerror=null; this.src='assets/images/about/about-faculty-01.webp';" alt="${name}" loading="lazy" decoding="async" />
        </div>
        <div class="faculty-body">
          <h3>${name}</h3>
          <span class="faculty-qual">${qual}</span>
          <p class="faculty-spec">${spec}</p>
          <div class="faculty-tags">
            ${tags.map(t => `<span class="chip">${escapeHtml(t)}</span>`).join('')}
          </div>
          <div class="faculty-footer">
            <span class="faculty-exp">${exp}</span>
            <a class="btn btn-outline btn-sm faculty-profile-btn" href="javascript:void(0)" data-faculty-id="${idKey}">View Profile</a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-bind profile popup click listeners
  bindProgramFacultyModalEvents();
}

function bindProgramFacultyModalEvents() {
  const btns = document.querySelectorAll('.faculty-profile-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const facultyId = btn.getAttribute('data-faculty-id');
      openProgramFacultyModal(facultyId);
    });
  });
}

function openProgramFacultyModal(facultyId) {
  const member = (window.loadedFacultyMap && window.loadedFacultyMap[facultyId]) || (typeof facultyProfiles !== 'undefined' ? facultyProfiles[facultyId] : null);
  if (!member) return;

  let modal = document.getElementById('faculty-modal');
  if (!modal) {
    // Inject modal dynamically if missing on page
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
  if (roleEl) roleEl.textContent = member.designation || member.role || member.department || '';
  if (qualEl) qualEl.textContent = member.qualification || member.qual || '';
  if (expEl) expEl.textContent = member.experience || member.exp || '';
  if (introEl) introEl.textContent = member.bio || member.intro || '';

  if (expertiseEl) {
    expertiseEl.innerHTML = '';
    const tags = member.department || member.specialization
      ? (member.department || member.specialization).split(/[,&]/).map(t => t.trim())
      : (member.expertise || ['Clinical Care']);

    tags.forEach(t => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = t;
      expertiseEl.appendChild(chip);
    });
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Setup close events
  const closeBtn = document.getElementById('faculty-modal-close');
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };
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
