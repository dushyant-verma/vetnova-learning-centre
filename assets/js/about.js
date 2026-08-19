/**
 * About Page Dynamic Controller for about.html
 * Fetches published Faculty and Advisory Board members from Vetnova Platform APIs.
 * Preserves exact HTML card layouts, responsive design, and modal behavior.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAboutPageData();
});

// Cache map of loaded faculty objects indexed by ID or slug
window.loadedFacultyMap = window.loadedFacultyMap || {};

async function initAboutPageData() {
  await Promise.all([
    loadFacultySection(),
    loadAdvisoryBoardSection()
  ]);
  
  initFacultyModalEvents();
}

async function loadFacultySection() {
  const facultyGrid = document.querySelector('#faculty .faculty-grid');
  if (!facultyGrid) return;

  const facultyList = await getFaculty({ status: 'Published' });
  if (!facultyList || facultyList.length === 0) return; // Keep fallback HTML if empty

  facultyGrid.innerHTML = facultyList.map(member => {
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

  // Re-bind modal buttons after rendering
  bindFacultyProfileButtons();
}

async function loadAdvisoryBoardSection() {
  const advisorGrid = document.querySelector('#advisory-board .advisor-grid');
  if (!advisorGrid) return;

  const boardList = await getAdvisoryBoard();
  if (!boardList || boardList.length === 0) return; // Keep fallback HTML if empty

  advisorGrid.innerHTML = boardList.map(member => {
    const name = escapeHtml(member.name || 'Board Member');
    const designation = escapeHtml(member.designation || 'Senior Advisory Member');
    const org = escapeHtml(member.organization || 'VetNova Advisory Council');
    const bio = escapeHtml(member.bio || member.qualification || 'Guiding clinical curriculum and strategic vision.');
    const photo = member.image || 'assets/images/about/about-advisor-01.webp';
    const linkedin = member.linkedin || '#';

    return `
      <div class="advisor-card">
        <div class="advisor-photo">
          <img src="${escapeHtml(photo)}" onerror="this.onerror=null; this.src='assets/images/about/about-advisor-01.webp';" alt="${name}" loading="lazy" decoding="async" />
        </div>
        <div class="advisor-body">
          <h3>${name}</h3>
          <span class="advisor-designation">${designation} • ${org}</span>
          <p class="advisor-spec">${bio}</p>
          <div class="advisor-footer">
            <span class="advisor-exp">${escapeHtml(member.qualification || 'Senior Advisor')}</span>
            ${member.linkedin ? `<a class="social-link" href="${escapeHtml(linkedin)}" target="_blank" aria-label="LinkedIn profile of ${name}"><i class="fa-brands fa-linkedin-in"></i></a>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function bindFacultyProfileButtons() {
  const btns = document.querySelectorAll('.faculty-profile-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const facultyId = btn.getAttribute('data-faculty-id');
      openFacultyProfileModal(facultyId);
    });
  });
}

function openFacultyProfileModal(facultyId) {
  const member = window.loadedFacultyMap[facultyId] || (typeof facultyProfiles !== 'undefined' ? facultyProfiles[facultyId] : null);
  if (!member) return;

  let modal = document.getElementById('faculty-modal');
  if (!modal) return;

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
      : (member.expertise || ['Clinical Surgery']);

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

function initFacultyModalEvents() {
  const modal = document.getElementById('faculty-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('faculty-modal-close');
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
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
