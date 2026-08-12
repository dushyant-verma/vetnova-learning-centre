/**
 * VetNova V4 — Homepage Interactive Script (Redesigned)
 * Isolated logic for index-v4.html
 */

document.addEventListener('DOMContentLoaded', () => {
  initV4HeroAnimations();
  initV4IndexNav();
  initV4HeaderNav();
  initV4ProcedureTabs();
  initV4JourneySteps();
  initV4FaqAccordion();
  initV4StatsCounters();
  initV4DynamicBlog();
  initV4VideoModal();
  console.log('[HP4] VetNova V4 Homepage initialized successfully.');
});

/* ==========================================================================
   0. HERO ENTRANCE ANIMATIONS
   ========================================================================== */
function initV4HeroAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const heroTitle = document.querySelector('.hp4-hero-title');
  const heroPanel = document.querySelector('.hp4-hero-panel');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    heroTitle.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(() => {
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 100);
  }
  if (heroPanel) {
    heroPanel.style.opacity = '0';
    heroPanel.style.transform = 'translateY(30px)';
    heroPanel.style.transition = 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s';
    setTimeout(() => {
      heroPanel.style.opacity = '1';
      heroPanel.style.transform = 'translateY(0)';
    }, 200);
  }
}

function initV4IndexNav() {
  const indexItems = document.querySelectorAll('.hp4-index-item');
  if (!indexItems.length) return;

  indexItems.forEach(item => {
    item.addEventListener('click', (e) => {
      indexItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/* ==========================================================================
   1. PROCEDURES & SKILLS TAB SWITCHER
   ========================================================================== */
function initV4ProcedureTabs() {
  const tabs = document.querySelectorAll('.hp4-proc-tab');
  if (!tabs.length) return;

  const proceduresData = {
    surgery: [
      { title: 'Soft Tissue Abdominal Incisions', desc: 'Standard laparotomy techniques, organ localization, and sterile abdominal cavity exposure.', icon: 'fa-user-doctor' },
      { title: 'Suture Techniques & Knot Tying', desc: 'Mastering continuous, interrupted, and subcuticular closure patterns with surgical precision.', icon: 'fa-stethoscope' },
      { title: 'Spay & Neuter Protocols', desc: 'Standardized ovariohysterectomy and castration procedural workflows with minimal trauma.', icon: 'fa-syringe' }
    ],
    emergency: [
      { title: 'Triage & Shock Fluid Resuscitation', desc: 'Rapid patient stabilization, crystalloid/colloid infusion rates, and central venous access.', icon: 'fa-truck-medical' },
      { title: 'Airway Management & Intubation', desc: 'Endotracheal intubation under emergency conditions, oxygenation, and ventilation.', icon: 'fa-heart-pulse' },
      { title: 'Toxicology & Cardiac Arrest Protocols', desc: 'CPR algorithm execution, emergency drug dosing, and toxic shock management.', icon: 'fa-triangle-exclamation' }
    ],
    diagnostics: [
      { title: 'Abdominal FAST Ultrasound Scanning', desc: 'Systematic 4-point FAST scanning for free fluid, organ trauma, and emergency triage.', icon: 'fa-microscope' },
      { title: 'Digital Radiograph Interpretation', desc: 'Thoracic & orthopedic X-ray reading, positioning artifacts, and contrast studies.', icon: 'fa-x-ray' },
      { title: 'In-House Blood & Urine Cytology', desc: 'Complete blood count interpretation, blood gas analysis, and urinalysis workflows.', icon: 'fa-vial' }
    ],
    skills: [
      { title: 'Sterile Operating Room Setup', desc: 'Aseptic scrubbing, gowning, draping, and sterile field maintenance.', icon: 'fa-shield-halved' },
      { title: 'Patient Handling & Restraint', desc: 'Low-stress feline & canine restraint protocols for clinical examinations.', icon: 'fa-paw' },
      { title: 'Post-Operative Recovery Care', desc: 'Pain assessment, wound monitoring, fluid therapy maintenance, and client debriefs.', icon: 'fa-notes-medical' }
    ]
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category || 'surgery';
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const procGrid = document.getElementById('hp4-proc-grid');
      if (!procGrid) return;

      const items = proceduresData[category] || proceduresData['surgery'];

      procGrid.innerHTML = items.map(item => `
        <div class="hp4-proc-card">
          <h4><i class="fa-solid ${item.icon}"></i> ${item.title}</h4>
          <p>${item.desc}</p>
        </div>
      `).join('');
    });
  });
}

/* ==========================================================================
   2. CLINICAL LEARNING JOURNEY STEP SELECTOR
   ========================================================================== */
function initV4JourneySteps() {
  const steps = document.querySelectorAll('.hp4-journey-step');
  const detailCard = document.getElementById('hp4-journey-detail');
  if (!steps.length || !detailCard) return;

  const journeyDetails = {
    1: {
      badge: 'STEP 01 — ACADEMIC IMMERSION',
      title: 'Case-Based Surgical & Diagnostic Foundations',
      desc: 'Evaluate patient history records, radiograph artifacts, organ landmark algorithms, and pre-op fluid requirements prior to stepping into operating suites.',
      list: [
        'Surgical anatomy & organ landmark identification',
        'Emergency fluid rate calculations & toxic shock algorithms',
        'Pre-operative patient stabilization & blood work analysis'
      ],
      img: 'assets/images/learning-path-doctor.webp'
    },
    2: {
      badge: 'STEP 02 — CLINICAL OBSERVATION',
      title: 'Specialist OT Shadowing & Protocol Analysis',
      desc: 'Observe senior MVSc specialists executing real surgeries in live operating rooms while analyzing anesthesia monitoring and surgical instrument handling.',
      list: [
        'Live surgical workflow shadowing',
        'Anesthesia induction & monitoring observation',
        'Sterile field maintenance & instrument passage'
      ],
      img: 'assets/vet_facility_main_training.webp'
    },
    3: {
      badge: 'STEP 03 — PRACTICAL DRILLS',
      title: 'Wet Lab Drills & Tactile Suture Practice',
      desc: 'Master suture patterns, knot tying, and sterile instrument handling through continuous tactile wet-lab repetitions on synthetic organs.',
      list: [
        'Subcuticular & continuous suture pattern drills',
        'Instrument handling finesse & tissue grip',
        'Aseptic scrub & gowning protocol mastery'
      ],
      img: 'assets/images/about/about-infrastructure-lab.webp'
    },
    4: {
      badge: 'STEP 04 — SUPERVISED PERFORMANCE',
      title: '1-on-1 Guided Soft Tissue Surgeries',
      desc: 'Assist and execute soft tissue procedures under direct, 1-on-1 MVSc specialist supervision in live operating suites.',
      list: [
        'Independent spay & neuter surgical execution',
        'Laparotomy organ exploration & tissue closure',
        'Direct specialist feedback during every surgical step'
      ],
      img: 'assets/images/program-surgery.webp'
    },
    5: {
      badge: 'STEP 05 — DIAGNOSTIC MASTERY',
      title: 'Abdominal FAST Ultrasound & Radiology Scanning',
      desc: 'Gain hands-on probe handling skills and digital X-ray interpretation techniques for routine abdominal and emergency scanning.',
      list: [
        'Systematic 4-point FAST abdominal ultrasound scanning',
        'Thoracic & abdominal digital radiograph reading',
        'Point-of-care ultrasound diagnostic reasoning'
      ],
      img: 'assets/vet_facility_diagnostics_room.webp'
    },
    6: {
      badge: 'STEP 06 — CAREER ADVANCEMENT',
      title: 'Certification, Portfolio & Hospital Placement',
      desc: 'Receive verified clinical certification, compile your surgical procedural log, and leverage VetNova referral networks for hospital placement.',
      list: [
        'Verified VetNova Clinical Completion Certificate',
        'Documented surgical case log & procedural portfolio',
        'Referral hospital placement assistance & career counseling'
      ],
      img: 'assets/images/learning-path-graduate.webp'
    }
  };

  steps.forEach(step => {
    step.addEventListener('click', () => {
      const stepNum = parseInt(step.dataset.step, 10) || 1;
      
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');

      const data = journeyDetails[stepNum] || journeyDetails[1];

      detailCard.innerHTML = `
        <div class="hp4-jcard-grid">
          <div class="hp4-jcard-content">
            <span class="hp4-eyebrow hp4-eyebrow-dark">${escapeHtml(data.badge)}</span>
            <h3>${escapeHtml(data.title)}</h3>
            <p>${escapeHtml(data.desc)}</p>
            <ul class="hp4-jcard-list">
              ${data.list.map(item => `<li><i class="fa-solid fa-circle-check"></i> ${escapeHtml(item)}</li>`).join('')}
            </ul>
          </div>
          <div class="hp4-jcard-media">
            <img src="${escapeHtml(data.img)}" alt="${escapeHtml(data.title)}" />
          </div>
        </div>
      `;
    });
  });
}

/* ==========================================================================
   3. FAQ ACCORDION TOGGLE
   ========================================================================== */
function initV4FaqAccordion() {
  const questions = document.querySelectorAll('.hp4-faq-question');
  
  questions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.hp4-faq-item');
      if (!item) return;

      const isActive = item.classList.contains('active');

      document.querySelectorAll('.hp4-faq-item').forEach(i => {
        i.classList.remove('active');
        const qBtn = i.querySelector('.hp4-faq-question');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   4. ANIMATED STATISTICS COUNTER
   ========================================================================== */
function initV4StatsCounters() {
  const counters = document.querySelectorAll('.hp4-counter');
  if (!counters.length) return;

  let animated = false;

  const animate = () => {
    const statsSection = document.querySelector('.hp4-stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0 && !animated) {
      animated = true;
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10) || 0;
        let count = 0;
        const speed = Math.max(1, Math.ceil(target / 40));

        const updateCount = () => {
          count += speed;
          if (count < target) {
            counter.innerText = count.toLocaleString();
            requestAnimationFrame(updateCount);
          } else {
            counter.innerText = target.toLocaleString();
          }
        };
        updateCount();
      });
    }
  };

  window.addEventListener('scroll', animate);
  animate();
}

/* ==========================================================================
   5. DYNAMIC LEARNING CENTRE / BLOG LOADER (1 FEATURED + 3 STACKED)
   ========================================================================== */
async function initV4DynamicBlog() {
  const featContainer = document.getElementById('hp4-blog-feat-card');
  const stackedContainer = document.getElementById('hp4-blog-stacked-list');
  if (!featContainer || !stackedContainer) return;

  try {
    let blogs = [];
    if (typeof getBlogs === 'function') {
      blogs = await getBlogs();
    }

    if (blogs && blogs.length >= 4) {
      const featured = blogs[0];
      const stacked = blogs.slice(1, 4);

      // Render Featured (Left)
      const featDate = featured.createdAt ? new Date(featured.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 2026';
      const featSlug = encodeURIComponent(featured.slug || featured._id);

      featContainer.innerHTML = `
        <div class="hp4-blog-feat-media">
          <img class="hp4-blog-feat-img" src="${escapeHtml(featured.image || 'assets/images/hero-veterinary-training.webp')}" 
            onerror="this.onerror=null; this.src='assets/images/hero-veterinary-training.webp';" 
            alt="${escapeHtml(featured.title)}" loading="lazy" />
        </div>
        <div class="hp4-blog-feat-body">
          <span class="hp4-blog-category">${escapeHtml((featured.category || 'SURGICAL GUIDE').toUpperCase())} • ${featDate}</span>
          <h3 style="font-family: var(--hp4-font-display); font-size: 1.4rem; font-weight: 800; color: var(--hp4-navy-main); margin: 0 0 12px 0;">
            <a href="blog-single.html?slug=${featSlug}" style="color: inherit; text-decoration: none;">${escapeHtml(featured.title)}</a>
          </h3>
          <p style="font-size: 0.95rem; color: var(--hp4-slate-600); margin: 0 0 20px 0; line-height: 1.6;">${escapeHtml(featured.excerpt || '')}</p>
          <a href="blog-single.html?slug=${featSlug}" class="hp4-blog-link" style="margin-top: auto;">
            Read Full Article <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      `;

      // Render Stacked (Right)
      stackedContainer.innerHTML = stacked.map(blog => {
        const slug = encodeURIComponent(blog.slug || blog._id);
        return `
          <div class="hp4-blog-small-card">
            <div class="hp4-blog-sm-media">
              <img class="hp4-blog-sm-img" src="${escapeHtml(blog.image || 'assets/images/hero-veterinary-training.webp')}"
                onerror="this.onerror=null; this.src='assets/images/hero-veterinary-training.webp';"
                alt="${escapeHtml(blog.title)}" loading="lazy" />
            </div>
            <div>
              <span class="hp4-blog-category" style="font-size: 0.72rem;">${escapeHtml((blog.category || 'CLINICAL GUIDE').toUpperCase())}</span>
              <h4 style="font-family: var(--hp4-font-display); font-size: 1.05rem; font-weight: 800; color: var(--hp4-navy-main); margin: 4px 0 6px 0;">
                <a href="blog-single.html?slug=${slug}" style="color: inherit; text-decoration: none;">${escapeHtml(blog.title)}</a>
              </h4>
              <a href="blog-single.html?slug=${slug}" class="hp4-blog-link" style="font-size: 0.82rem;">
                Read Article <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        `;
      }).join('');

    } else {
      renderV4FallbackBlog(featContainer, stackedContainer);
    }
  } catch (err) {
    console.info('V4 Blog API fallback:', err);
    renderV4FallbackBlog(featContainer, stackedContainer);
  }
}

function renderV4FallbackBlog(featContainer, stackedContainer) {
  if (!featContainer || !stackedContainer) return;

  featContainer.innerHTML = `
    <div class="hp4-blog-feat-media">
      <img class="hp4-blog-feat-img" src="assets/images/hero-veterinary-training.webp" alt="Surgical Guide" loading="lazy" />
    </div>
    <div class="hp4-blog-feat-body">
      <span class="hp4-blog-category">SURGICAL MASTERY • AUG 2026</span>
      <h3 style="font-family: var(--hp4-font-display); font-size: 1.4rem; font-weight: 800; color: var(--hp4-navy-main); margin: 0 0 12px 0;">
        <a href="blog.html" style="color: inherit; text-decoration: none;">A Step-by-Step Approach to Small Animal Abdominal Exploratory Surgery</a>
      </h3>
      <p style="font-size: 0.95rem; color: var(--hp4-slate-600); margin: 0 0 20px 0; line-height: 1.6;">Comprehensive surgical guide covering sterile field preparation, tissue handling, and organ systematic evaluation protocols.</p>
      <a href="blog.html" class="hp4-blog-link" style="margin-top: auto;">
        Read Full Article <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
  `;

  stackedContainer.innerHTML = `
    <div class="hp4-blog-small-card">
      <div class="hp4-blog-sm-media">
        <img class="hp4-blog-sm-img" src="assets/vet_facility_diagnostics_room.webp" alt="Diagnostic Imaging" loading="lazy" />
      </div>
      <div>
        <span class="hp4-blog-category" style="font-size: 0.72rem;">DIAGNOSTIC IMAGING</span>
        <h4 style="font-family: var(--hp4-font-display); font-size: 1.05rem; font-weight: 800; color: var(--hp4-navy-main); margin: 4px 0 6px 0;">
          <a href="blog.html" style="color: inherit; text-decoration: none;">Abdominal Ultrasound FAST Scanning Protocols</a>
        </h4>
        <a href="blog.html" class="hp4-blog-link" style="font-size: 0.82rem;">
          Read Article <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </div>

    <div class="hp4-blog-small-card">
      <div class="hp4-blog-sm-media">
        <img class="hp4-blog-sm-img" src="assets/images/program-clinic-ready.webp" alt="Emergency Resuscitation" loading="lazy" />
      </div>
      <div>
        <span class="hp4-blog-category" style="font-size: 0.72rem;">EMERGENCY CARE</span>
        <h4 style="font-family: var(--hp4-font-display); font-size: 1.05rem; font-weight: 800; color: var(--hp4-navy-main); margin: 4px 0 6px 0;">
          <a href="blog.html" style="color: inherit; text-decoration: none;">Critical Fluid Resuscitation for Hemorrhagic Shock</a>
        </h4>
        <a href="blog.html" class="hp4-blog-link" style="font-size: 0.82rem;">
          Read Article <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </div>

    <div class="hp4-blog-small-card">
      <div class="hp4-blog-sm-media">
        <img class="hp4-blog-sm-img" src="assets/images/program-surgery.webp" alt="Suture Patterns" loading="lazy" />
      </div>
      <div>
        <span class="hp4-blog-category" style="font-size: 0.72rem;">SURGICAL SKILLS</span>
        <h4 style="font-family: var(--hp4-font-display); font-size: 1.05rem; font-weight: 800; color: var(--hp4-navy-main); margin: 4px 0 6px 0;">
          <a href="blog.html" style="color: inherit; text-decoration: none;">Choosing the Right Suture Pattern for Tissue Closure</a>
        </h4>
        <a href="blog.html" class="hp4-blog-link" style="font-size: 0.82rem;">
          Read Article <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
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

/* ==========================================================================
   6. VIDEO MODAL / PLAY TRIGGER
   ========================================================================== */
function initV4VideoModal() {
  const playBtn = document.querySelector('.hp4-video-play-btn');
  const modal = document.getElementById('hp4-video-modal');
  const closeBtn = document.getElementById('hp4-video-close');
  const backdrop = document.getElementById('hp4-video-backdrop');
  const iframe = document.getElementById('hp4-video-iframe');

  if (!playBtn || !modal || !iframe) return;

  const videoUrl = 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4?autoplay=1';

  const openModal = () => {
    iframe.src = videoUrl;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('hp4-modal-open');
  };

  const closeModal = () => {
    iframe.src = '';
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('hp4-modal-open');
  };

  playBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function initV4HeaderNav() {
  // Auto-close mobile drawer on anchor link click
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const drawer = document.getElementById('mobile-drawer');
    if (drawer && drawer.classList.contains('active')) {
      drawer.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
}
