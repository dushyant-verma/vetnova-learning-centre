/* VetNova Training Institute — Interactive Script */

function runAllInitializers() {
  initStickyHeader();
  initMobileMenu();
  initSmoothScroll();
  initQuiz();
  initFaqAccordion();
  initCurriculumAccordion();
  initConcernSelector();
  initContactForm();
  initEnquiryModal();
  initCounterAnimations();
  initTestimonialSlider();
  initVideoModal();
  initActiveNavigation();
  initScrollSpy();
  initReadingProgress();
  initBlogCategoryFilter();
  initProgramFilters();
  initSingleProgramGradeRepresentation();
  initFaqSearch();
  initPopularCoursesFilter();
  initBatchTabs();
  initSingleFocusJourney();
  initFacultyModal();
  initDesktopDropdowns();
  initConnectWidget();
  if (typeof window.initVetNovaChatbot === 'function') {
    window.initVetNovaChatbot();
  } else {
    const cbScript = document.createElement('script');
    cbScript.src = 'assets/js/chatbot.js';
    cbScript.onload = () => {
      if (typeof window.initVetNovaChatbot === 'function') {
        window.initVetNovaChatbot();
      }
    };
    document.body.appendChild(cbScript);
  }
  initPartnershipForm();
  if (typeof window.initVetNovaTranslator === 'function') {
    window.initVetNovaTranslator();
  } else {
    const trScript = document.createElement('script');
    trScript.src = 'assets/js/translator.js';
    trScript.onload = () => {
      if (typeof window.initVetNovaTranslator === 'function') {
        window.initVetNovaTranslator();
      }
    };
    document.body.appendChild(trScript);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.getElementById('global-header');
  const footerContainer = document.getElementById('global-footer');

  const headerHasContent = headerContainer && headerContainer.children.length > 0;
  const footerHasContent = footerContainer && footerContainer.children.length > 0;

  if (headerHasContent && footerHasContent) {
    runAllInitializers();
  } else {
    Promise.all([
      loadComponent('global-header', 'components/header.html'),
      loadComponent('global-footer', 'components/footer.html')
    ]).catch(err => {
      console.info('Component loading info: using static HTML fallback:', err);
    }).finally(() => {
      runAllInitializers();
    });
  }
});

function loadComponent(id, url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.statusText}`);
      }
      return response.text();
    })
    .then(html => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = html;
      }
    });
}

/* ==========================================================================
   Active Navigation Link Highlighting
   ========================================================================== */
function initActiveNavigation() {
  const rawPath = window.location.pathname.split('/').pop() || 'index.html';
  const path = rawPath.split('#')[0].toLowerCase();
  const cleanPath = (path === '' || path === 'index.html') ? 'index' : path.replace('.html', '');

  // Main menu links highlighting
  const navLinks = document.querySelectorAll('.menu .nav-link, .drawer-menu .drawer-link, .drawer-accordion-btn');
  navLinks.forEach(link => {
    const dataNav = link.getAttribute('data-nav') || link.getAttribute('href');
    if (dataNav) {
      const cleanDataNav = dataNav.split('#')[0].replace('.html', '').toLowerCase();
      if (cleanDataNav === cleanPath || ((cleanPath === 'index' || cleanPath === 'index-v2' || cleanPath === 'index-v3' || cleanPath === 'index-v4') && cleanDataNav === 'index') || (cleanPath === 'learning-centre' && cleanDataNav === 'facility-tour')) {
        link.classList.add('active');
      }
    }
  });

  // Submenu items & mobile drawer content links highlighting
  const subLinks = document.querySelectorAll('.dropdown-menu a, .drawer-accordion-content a');
  const currentHash = window.location.hash.toLowerCase();
  subLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const [linkPage, linkHash] = href.toLowerCase().split('#');
      const cleanLinkPage = (linkPage || 'index.html').split('/').pop();
      const currentFile = (path === '' ? 'index.html' : path);

      let isActive = false;
      if (cleanLinkPage === currentFile) {
        if (linkHash) {
          isActive = currentHash === ('#' + linkHash) ||
            ((linkHash === 'vision-mission' || linkHash === 'mission-vision') && (currentHash === '#vision-mission' || currentHash === '#mission-vision'));
        } else {
          isActive = !currentHash;
        }
      }

      if (isActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

/* ==========================================================================
   ScrollSpy Controller
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.dropdown-menu a[href*="#"], .drawer-accordion-content a[href*="#"]');
  const basePageLinks = document.querySelectorAll('.dropdown-menu a:not([href*="#"]), .drawer-accordion-content a:not([href*="#"])');

  if (!sections.length || !navLinks.length) return;

  function onScroll() {
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const matches = href && (
          href.includes('#' + currentId) ||
          ((currentId === 'mission-vision' || currentId === 'vision-mission') && (href.includes('#vision-mission') || href.includes('#mission-vision')))
        );
        if (matches) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Clear active on top base-page items while inside a specific section
      basePageLinks.forEach(link => link.classList.remove('active'));
    } else if (window.scrollY < 200) {
      // Near top of page, restore base page link active
      navLinks.forEach(link => link.classList.remove('active'));
      const rawPath = window.location.pathname.split('/').pop() || 'index.html';
      basePageLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.split('#')[0] === rawPath) {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   Curriculum Accordion Controller
   ========================================================================== */
function initCurriculumAccordion() {
  const headers = document.querySelectorAll('.curriculum-header');
  headers.forEach(header => {
    if (header.dataset.curriculumBound) return;
    header.dataset.curriculumBound = 'true';

    // Initial ARIA state
    const parent = header.closest('.curriculum-item');
    const isCurrentlyActive = parent && parent.classList.contains('active');
    header.setAttribute('aria-expanded', isCurrentlyActive ? 'true' : 'false');

    header.addEventListener('click', (e) => {
      const currentParent = header.closest('.curriculum-item');
      if (!currentParent) return;

      const listContainer = currentParent.closest('.curriculum-list') || document;
      const isActive = currentParent.classList.contains('active');

      // Close sibling items in this list container
      listContainer.querySelectorAll('.curriculum-item').forEach(item => {
        item.classList.remove('active');
        const h = item.querySelector('.curriculum-header');
        if (h) h.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        currentParent.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  // Handle URL query parameter ?level=foundation|intermediate|advanced
  const urlParams = new URLSearchParams(window.location.search);
  const targetLevel = (urlParams.get('level') || '').toLowerCase();
  if (targetLevel) {
    const matchingBadge = document.querySelector(`.curriculum-mod-badge.stage-${targetLevel}`) ||
      document.querySelector(`.curriculum-mod-badge[class*="${targetLevel}"]`);
    if (matchingBadge) {
      const targetItem = matchingBadge.closest('.curriculum-item');
      if (targetItem) {
        document.querySelectorAll('.curriculum-item').forEach(item => {
          item.classList.remove('active');
          const h = item.querySelector('.curriculum-header');
          if (h) h.setAttribute('aria-expanded', 'false');
        });
        targetItem.classList.add('active');
        const h = targetItem.querySelector('.curriculum-header');
        if (h) h.setAttribute('aria-expanded', 'true');
      }
    }
  }
}
window.initCurriculumAccordion = initCurriculumAccordion;

/* ==========================================================================
   Production-Ready Fixed Smart Hide/Show Header Controller
   ========================================================================== */
function initStickyHeader() {
  const globalHeader = document.getElementById('global-header');
  const header = document.getElementById('header') || globalHeader;
  if (!globalHeader && !header) return;

  const targetWrapper = globalHeader || header;
  const drawer = document.getElementById('mobile-drawer');

  let lastScrollY = Math.max(0, window.scrollY);
  let ticking = false;
  const hideThreshold = 90;
  const directionThreshold = 12;
  let accumulatedDelta = 0;

  // Dynamically calculate and apply body top padding equal to header height
  function updateHeaderPadding() {
    if (targetWrapper) {
      const height = targetWrapper.offsetHeight;
      if (height > 0) {
        document.body.style.paddingTop = height + 'px';
      }
    }
  }

  function updateHeader() {
    // Prevent iOS elastic overscroll bounce issues
    const currentScrollY = Math.max(0, window.scrollY);

    // Mobile drawer guard: Keep header visible when mobile drawer is open
    const isMobileMenuOpen = drawer && drawer.classList.contains('open');
    if (isMobileMenuOpen) {
      targetWrapper.classList.remove('header-hidden');
      targetWrapper.classList.add('header-scrolled');
      if (header && header !== targetWrapper) {
        header.classList.remove('header-hidden');
        header.classList.add('scrolled', 'header-scrolled');
      }
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }

    // State 1 & State 5: Top of Page (scrollY <= 20) -> Fully reset header
    if (currentScrollY <= 20) {
      targetWrapper.classList.remove('header-scrolled', 'header-hidden');
      if (header && header !== targetWrapper) {
        header.classList.remove('scrolled', 'header-scrolled', 'header-hidden');
      }
      accumulatedDelta = 0;
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }

    // State 2: Scrolled (scrollY > 20) -> Apply glass background and shadow
    targetWrapper.classList.add('header-scrolled');
    if (header && header !== targetWrapper) {
      header.classList.add('scrolled', 'header-scrolled');
    }

    const delta = currentScrollY - lastScrollY;

    // Accumulate scroll delta in same direction
    if ((delta > 0 && accumulatedDelta > 0) || (delta < 0 && accumulatedDelta < 0)) {
      accumulatedDelta += delta;
    } else {
      accumulatedDelta = delta;
    }

    // State 3: Scroll Down -> Hide Header after 90px threshold
    if (currentScrollY > hideThreshold && accumulatedDelta > directionThreshold) {
      targetWrapper.classList.add('header-hidden');
      if (header && header !== targetWrapper) {
        header.classList.add('header-hidden');
      }
    }
    // State 4: Scroll Up -> Reveal Header Immediately
    else if (accumulatedDelta < -directionThreshold) {
      targetWrapper.classList.remove('header-hidden');
      if (header && header !== targetWrapper) {
        header.classList.remove('header-hidden');
      }
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  // Passive event listener for 60fps scrolling & resize updates
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    updateHeaderPadding();
    requestAnimationFrame(updateHeader);
  }, { passive: true });
  window.addEventListener('orientationchange', () => {
    updateHeaderPadding();
    requestAnimationFrame(updateHeader);
  }, { passive: true });

  updateHeaderPadding();
  updateHeader();
}

/* ==========================================================================
   Mobile Menu Navigation Drawer & Accordions
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const drawerClose = document.getElementById('drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-menu > a, .drawer-accordion-content a');
  const accordionBtns = document.querySelectorAll('.drawer-accordion-btn');

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const isOpen = btn.classList.contains('active');

      accordionBtns.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.classList.remove('active');
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBtn.nextElementSibling) {
            otherBtn.nextElementSibling.classList.remove('open');
            // Close any open nested sub-accordions inside closed parent
            const siblingSubBtns = otherBtn.nextElementSibling.querySelectorAll('.drawer-sub-accordion-btn');
            siblingSubBtns.forEach(sBtn => {
              sBtn.classList.remove('active');
              sBtn.setAttribute('aria-expanded', 'false');
              if (sBtn.nextElementSibling) {
                sBtn.nextElementSibling.classList.remove('open');
              }
            });
          }
        }
      });

      if (isOpen) {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        if (content) {
          content.classList.remove('open');
          const childSubBtns = content.querySelectorAll('.drawer-sub-accordion-btn');
          childSubBtns.forEach(sBtn => {
            sBtn.classList.remove('active');
            sBtn.setAttribute('aria-expanded', 'false');
            if (sBtn.nextElementSibling) {
              sBtn.nextElementSibling.classList.remove('open');
            }
          });
        }
      } else {
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        if (content) content.classList.add('open');
      }
    });
  });

  const subAccordionBtns = document.querySelectorAll('.drawer-sub-accordion-btn');
  subAccordionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const content = btn.nextElementSibling;
      const isOpen = btn.classList.contains('active');

      const parentContent = btn.closest('.drawer-accordion-content');
      if (parentContent) {
        const siblingSubBtns = parentContent.querySelectorAll('.drawer-sub-accordion-btn');
        siblingSubBtns.forEach(otherBtn => {
          if (otherBtn !== btn) {
            otherBtn.classList.remove('active');
            otherBtn.setAttribute('aria-expanded', 'false');
            if (otherBtn.nextElementSibling) {
              otherBtn.nextElementSibling.classList.remove('open');
            }
          }
        });
      }

      if (isOpen) {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        if (content) content.classList.remove('open');
      } else {
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        if (content) content.classList.add('open');
        setTimeout(() => {
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      }
    });
  });
}

/* ==========================================================================
   FAQ Accordion Component
   ========================================================================== */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = question.nextElementSibling;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const ans = otherItem.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        if (answer) answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   Tab Selector (Concern Selector)
   ========================================================================== */
const concernData = {
  surgery: {
    badge: 'Surgery Track',
    title: 'Master essential soft tissue and orthopedic surgeries',
    description: 'Designed to help junior doctors and fresh graduates build manual dexterity and decision-making confidence during surgeries.',
    bullets: [
      'Standard sterilization & surgical setups',
      'Soft tissue surgeries (spay/neuter, cystotomy)',
      'Assistance during complex orthopedic operations'
    ],
    ctaText: 'Book free Counselling ',
    ctaLink: 'contact.html#contact-form',
    image: 'assets/vet_selector_surgery_result.webp'
  },
  radiology: {
    badge: 'Radiology Track',
    title: 'X-Ray interpretation and practical ultrasound scanning',
    description: 'Learn to read thoracic and abdominal radiographs systematically and perform basic ultrasound scans.',
    bullets: [
      'Thoracic & abdominal radiographic reading',
      'Ultrasound patient positioning & probe handling',
      'Systematic approach to diagnosing pathology'
    ],
    ctaText: 'Book free Counselling ',
    ctaLink: 'contact.html#contact-form',
    image: 'assets/vet_selector_radiology_result.webp'
  },
  'clinic-ready': {
    badge: 'Foundation Track',
    title: 'Bridge academic theories with everyday clinic realities',
    description: 'Perfect for recently passed-out graduates and final-year students preparing for internships.',
    bullets: [
      'Everyday clinic workflow & case record keeping',
      'Common diagnostics checklist (blood tests, smears)',
      'Effective pet parent communication & counseling'
    ],
    ctaText: 'Book free Counselling ',
    ctaLink: 'contact.html#contact-form',
    image: 'assets/vet_selector_foundation_result.webp'
  },
  'first-aid': {
    badge: 'Pet Owner Track',
    title: 'Essential emergency first aid response training',
    description: 'Designed for pet parents, rescuers, and animal lovers to stabilize pets during life-threatening situations.',
    bullets: [
      'CPR, choking release & basic resuscitation',
      'Wound cleaning, bandages & bleeding control',
      'Heat stroke, poisoning & animal bite protocol'
    ],
    ctaText: 'Book free Counselling ',
    ctaLink: 'contact.html#contact-form',
    image: 'assets/vet_selector_petcare_result.webp'
  },
  nurse: {
    badge: 'Vet Nurse Track',
    title: 'Build career skills for animal care & clinic assistant roles',
    description: 'Learn clinic assistant fundamentals. Standard training on animal handling, cage sanitation, catheter prep, and client management.',
    bullets: [
      'Safe dog and cat restraint techniques',
      'Surgical prep support & sanitization rules',
      'Basic medication routes and front desk tasks'
    ],
    ctaText: 'Book free Counselling ',
    ctaLink: 'contact.html#contact-form',
    image: 'assets/vet_selector_nurse_result.webp'
  }
};

function initConcernSelector() {
  // Concern selector integrated into unified Program Discovery component (#quiz-section)
}

/* ==========================================================================
   Program Discovery & Gamification Controller
   Focus: "What would you like to explore?" (Topic & Skill Discovery)
   ========================================================================== */
const discoveryDatabase = {
  topics: {
    surgery: {
      name: 'Soft Tissue & Orthopedic Surgery',
      goals: [
        { text: 'Improve Soft Tissue Surgery Confidence (Spay, Neuter, Organ Resection)', programIds: ['soft-tissue-surgery'] },
        { text: 'Master Small Animal Orthopaedics (Fracture Stabilization & Bone Plating)', programIds: ['orthopaedics', 'soft-tissue-surgery'] },
        { text: 'Learn Operating Theater Sterilization & Surgical Protocols', programIds: ['soft-tissue-surgery', 'veterinary-dentistry'] }
      ]
    },
    radiology: {
      name: 'Radiology & Diagnostic Ultrasound',
      goals: [
        { text: 'Abdominal Ultrasound FAST Scans & Probe Handling Ergonomics', programIds: ['radiology-ultrasound', 'diagnostic-imaging'] },
        { text: 'Digital X-Ray Contrast Reading & Thoracic Radiography', programIds: ['diagnostic-imaging', 'radiology-ultrasound'] },
        { text: 'Organ Pathology Mapping & Bedside Ultrasound Diagnostics', programIds: ['radiology-ultrasound', 'laboratory-diagnostics', 'clinical-pathology'] }
      ]
    },
    emergency: {
      name: 'Emergency & Critical Care',
      goals: [
        { text: 'RECOVER CPR Protocols, Triage & Fluid Resuscitation', programIds: ['emergency-care', 'pet-first-aid'] },
        { text: 'Trauma Patient ICU Monitoring & Shock Therapy', programIds: ['emergency-care', 'anaesthesia-and-pain-management'] },
        { text: 'Pet First Aid, Choking Release & Home Emergency Response', programIds: ['pet-first-aid', 'emergency-care'] }
      ]
    },
    nurse: {
      name: 'Vet Nursing & Paravet Skills',
      goals: [
        { text: 'Patient Restraint, IV Setup & Scrub Assistant Training', programIds: ['vet-nurse'] },
        { text: 'OT Sterilization, Anesthesia Monitoring & Wound Dressing', programIds: ['vet-nurse', 'anaesthesia-and-pain-management'] },
        { text: 'Clinic Workflow Readiness & Patient Record Systems', programIds: ['vet-nurse', 'veterinary-ethics-and-practice-management'] }
      ]
    },
    'skill-up': {
      name: 'Comprehensive Clinical Skill-Up',
      goals: [
        { text: 'Full Transition Training for Independent Clinical Mastery', programIds: ['skill-up', 'general-medicine'] },
        { text: 'ECG Rhythm Analysis, Prescription Protocols & Diagnostics', programIds: ['skill-up', 'veterinary-cardiology', 'clinical-pathology'] },
        { text: 'Everyday Clinical Essentials & Surgical/Emergency Foundations', programIds: ['skill-up', 'general-medicine'] }
      ]
    },
    all: {
      name: 'All Learning Tracks',
      goals: [
        { text: 'Explore Flagship Clinical Programs', programIds: ['skill-up', 'soft-tissue-surgery', 'general-medicine'] },
        { text: 'Explore Diagnostic & Imaging Workshops', programIds: ['radiology-ultrasound', 'diagnostic-imaging', 'laboratory-diagnostics'] },
        { text: 'Explore Emergency & Nursing Courses', programIds: ['emergency-care', 'vet-nurse', 'pet-first-aid'] }
      ]
    }
  },
  programs: [
    {
      id: 'skill-up',
      title: 'Veterinary Skill-Up Program',
      badge: 'FLAGSHIP PROGRAM',
      category: 'Comprehensive Clinical Track',
      level: 'Foundation to Advanced',
      duration: '4 Weeks (120+ Hrs)',
      url: 'veterinary-skill-up.html',
      topics: ['skill-up', 'all'],
      levels: ['foundation', 'intermediate', 'advanced'],
      image: 'assets/images/programs/program-skill-up.webp',
      description: 'Comprehensive 4-week clinical mastery module covering soft tissue surgery, digital radiology, abdominal ultrasound, and emergency triage.',
      outcomes: ['Soft Tissue Surgery', 'Digital Radiology', 'ECG & Cardiology', 'Emergency Triage']
    },
    {
      id: 'soft-tissue-surgery',
      title: 'Soft Tissue Surgery Masterclass',
      badge: 'SURGERY TRACK',
      category: 'Surgery',
      level: 'Intermediate to Advanced',
      duration: '1 to 4 Weeks',
      url: 'soft-tissue-surgery.html',
      topics: ['surgery', 'all'],
      levels: ['foundation', 'intermediate', 'advanced'],
      image: 'assets/images/programs/program-surgery.webp',
      description: 'Master standard surgical incisions, stitching techniques, spay/neuter protocols, and abdominal organ surgeries under direct mentor guidance.',
      outcomes: ['Independent Surgical Cases', 'OT Sterilization Protocols', 'Abdominal Organ Surgeries', 'Tissue Handling']
    },
    {
      id: 'orthopaedics',
      title: 'Small Animal Orthopaedics',
      badge: 'SURGERY SPECIALIST',
      category: 'Surgery',
      level: 'Intermediate to Advanced',
      duration: '2 to 4 Weeks',
      url: 'orthopaedics.html',
      topics: ['surgery', 'all'],
      levels: ['intermediate', 'advanced'],
      image: 'assets/images/programs/program-orthopaedics.webp',
      description: 'Hands-on orthopaedic surgery curriculum covering fracture mechanics, bone splinting, internal/external fixation, and joint stabilization.',
      outcomes: ['Bone Fracture Fixation', 'Dynamic Bone Plating', 'IM Pinning', 'Post-Op Radiology']
    },
    {
      id: 'radiology-ultrasound',
      title: 'Ultrasound & Diagnostic Radiology',
      badge: 'RADIOLOGY TRACK',
      category: 'Diagnostics & Imaging',
      level: 'Foundation to Intermediate',
      duration: '3 Weeks',
      url: 'radiology-ultrasound.html',
      topics: ['radiology', 'all'],
      levels: ['foundation', 'intermediate'],
      image: 'assets/images/facility-radiology.webp',
      description: 'Hands-on probe handling, acoustic windows, systematic abdominal scanning, and digital radiograph contrast reading.',
      outcomes: ['Abdominal FAST Scanning', 'Probe Ergonomics', 'X-Ray Contrast Interpretation', 'Organ Mapping']
    },
    {
      id: 'diagnostic-imaging',
      title: 'Diagnostic Imaging',
      badge: 'DIAGNOSTIC SPECIALIZATION',
      category: 'Diagnostics & Imaging',
      level: 'Foundation to Advanced',
      duration: '3 to 4 Weeks',
      url: 'diagnostic-imaging.html',
      topics: ['radiology', 'all'],
      levels: ['foundation', 'intermediate', 'advanced'],
      image: 'assets/images/facility-radiology.webp',
      description: 'In-depth radiographic positioning, contrast studies, thoracic evaluation, and abdominal ultrasonography interpretation.',
      outcomes: ['Thoracic & Abdominal X-Ray', 'Ultrasound Interpretation', 'Artifact Recognition', 'Case Auditing']
    },
    {
      id: 'emergency-care',
      title: 'Emergency & Critical Care Triage',
      badge: 'EMERGENCY TRACK',
      category: 'Emergency & Critical Care',
      level: 'Intermediate to Advanced',
      duration: '2 Weeks',
      url: 'emergency-and-critical-care.html',
      topics: ['emergency', 'all'],
      levels: ['foundation', 'intermediate', 'advanced'],
      image: 'assets/images/learning-path-specialist.webp',
      description: 'Rapid patient triage, RECOVER CPR resuscitation protocols, fluid therapy management, and ICU monitoring for small animals.',
      outcomes: ['RECOVER CPR Protocols', 'IV Catheterization & Shock', 'Fluid Resuscitation', 'ICU Monitoring']
    },
    {
      id: 'pet-first-aid',
      title: 'Pet First Aid & Emergency Response',
      badge: 'PET CARE WORKSHOP',
      category: 'Emergency & Critical Care',
      level: 'Foundational',
      duration: '2 Days Workshop',
      url: 'emergency-medicine.html',
      topics: ['emergency', 'all'],
      levels: ['foundation'],
      image: 'assets/vet_selector_petcare_card.webp',
      description: 'Essential hands-on training for pet owners, rescuers, and clinic assistants on wound dressing, toxin response, choking release, and pet CPR.',
      outcomes: ['Choking & CPR Simulation', 'Wound Bandaging', 'Toxin Emergency Action', 'First Aid Kit Usage']
    },
    {
      id: 'vet-nurse',
      title: 'Certified Vet Nursing & Paravet Skills',
      badge: 'VET NURSE TRACK',
      category: 'Veterinary Nursing',
      level: 'Foundational',
      duration: '4 Weeks',
      url: 'vet-nurse-programme.html',
      topics: ['nurse', 'all'],
      levels: ['foundation', 'intermediate'],
      image: 'assets/images/learning-path-nurse.webp',
      description: 'Designed for clinic assistants and nursing staff to master patient restraint, surgical scrub prep, anesthesia monitoring, and wound care.',
      outcomes: ['Patient Restraint & IV Setup', 'OT Scrub & Sterilization', 'Anesthesia Monitoring', 'Clinic Workflow']
    },
    {
      id: 'anaesthesia-and-pain-management',
      title: 'Anaesthesia and Pain Management',
      badge: 'ANAESTHESIA TRACK',
      category: 'Anaesthesia',
      level: 'Foundation to Advanced',
      duration: '2 to 4 Weeks',
      url: 'anaesthesia-and-pain-management.html',
      topics: ['emergency', 'nurse', 'all'],
      levels: ['foundation', 'intermediate', 'advanced'],
      image: 'assets/images/programs/program-anaesthesia.webp',
      description: 'Pre-anaesthetic patient evaluation, multi-modal analgesia, inhalation anaesthesia protocols, and intra-operative monitoring.',
      outcomes: ['Inhalation Anaesthesia', 'Multi-Modal Analgesia', 'Vapour Machine Setup', 'Emergency Reversal']
    },
    {
      id: 'general-medicine',
      title: 'General Medicine',
      badge: 'INTERNAL MEDICINE',
      category: 'Internal Medicine',
      level: 'Foundation to Advanced',
      duration: '4 Weeks / Modular',
      url: 'general-medicine.html',
      topics: ['skill-up', 'all'],
      levels: ['foundation', 'intermediate', 'advanced'],
      image: 'assets/images/programs/program-skill-up.webp',
      description: 'Systematic clinical diagnostic and therapeutic protocols for small animal internal medicine practice.',
      outcomes: ['Clinical Exam & History', 'Fluid Therapy Plans', 'Diagnostic Workups', 'Rational Drug Use']
    },
    {
      id: 'veterinary-cardiology',
      title: 'Veterinary Cardiology',
      badge: 'CARDIOLOGY TRACK',
      category: 'Internal Medicine',
      level: 'Intermediate to Advanced',
      duration: '2 to 4 Weeks',
      url: 'veterinary-cardiology.html',
      topics: ['skill-up', 'all'],
      levels: ['intermediate', 'advanced'],
      image: 'assets/images/programs/program-cardiology.webp',
      description: 'Cardiac auscultation, ECG rhythm interpretation, cardiac ultrasound Doppler basics, and heart failure management.',
      outcomes: ['ECG Lead Placement', 'Arrhythmia Recognition', 'Heart Failure Triage', 'Cardiology Prescriptions']
    },
    {
      id: 'laboratory-diagnostics',
      title: 'Laboratory Diagnostics',
      badge: 'LAB DIAGNOSTICS',
      category: 'Diagnostics & Imaging',
      level: 'Foundation to Intermediate',
      duration: '2 Weeks',
      url: 'laboratory-diagnostics.html',
      topics: ['radiology', 'all'],
      levels: ['foundation', 'intermediate'],
      image: 'assets/images/programs/program-laboratory-diagnostics.webp',
      description: 'Microscope calibration, rapid in-house test kits, gram staining, skin scraping, and cytological preparation techniques.',
      outcomes: ['In-House Test Kits', 'Microscope Alignment', 'Skin Scraping Cytology', 'Sample Preservation']
    },
    {
      id: 'clinical-pathology',
      title: 'Clinical Pathology',
      badge: 'PATHOLOGY TRACK',
      category: 'Pathology & Diagnostics',
      level: 'Foundation to Advanced',
      duration: '2 to 3 Weeks',
      url: 'clinical-pathology.html',
      topics: ['radiology', 'all'],
      levels: ['foundation', 'intermediate', 'advanced'],
      image: 'assets/images/programs/program-clinical-pathology.webp',
      description: 'Complete blood count, peripheral blood smear cytology, biochemical profiles, urinalysis, and body fluid interpretation.',
      outcomes: ['Blood Smear Cytology', 'Biochemistry Reading', 'Urine Sediment Exam', 'Rapid Lab Staining']
    },
    {
      id: 'clinical-microbiology',
      title: 'Clinical Microbiology',
      badge: 'MICROBIOLOGY TRACK',
      category: 'Pathology & Diagnostics',
      level: 'Intermediate to Advanced',
      duration: '2 Weeks',
      url: 'clinical-microbiology.html',
      topics: ['radiology', 'all'],
      levels: ['intermediate', 'advanced'],
      image: 'assets/images/programs/program-microbiology.webp',
      description: 'Bacterial culture techniques, antibiotic sensitivity testing, fungal identification, and antimicrobial resistance monitoring.',
      outcomes: ['Culture & Sensitivity', 'Gram Staining', 'Fungal Diagnostics', 'Antimicrobial Stewardship']
    },
    {
      id: 'veterinary-dentistry',
      title: 'Veterinary Dentistry',
      badge: 'DENTISTRY TRACK',
      category: 'Dentistry & Oral Surgery',
      level: 'Foundation to Advanced',
      duration: '2 Weeks',
      url: 'veterinary-dentistry.html',
      topics: ['surgery', 'all'],
      levels: ['foundation', 'intermediate', 'advanced'],
      image: 'assets/images/programs/program-dentistry.webp',
      description: 'Ultrasonic scaling, dental charting, nerve blocks, simple and surgical extractions, and periodontal disease therapy.',
      outcomes: ['Dental Charting', 'Local Nerve Blocks', 'Surgical Extractions', 'Ultrasonic Scaling']
    },
    {
      id: 'veterinary-ethics-and-practice-management',
      title: 'Veterinary Ethics & Practice Management',
      badge: 'PRACTICE MANAGEMENT',
      category: 'Practice Management',
      level: 'Foundation to Intermediate',
      duration: '1 to 2 Weeks',
      url: 'veterinary-ethics-and-practice-management.html',
      topics: ['nurse', 'all'],
      levels: ['foundation', 'intermediate'],
      image: 'assets/images/programs/program-ethics-practice.webp',
      description: 'Client communication, clinical consent protocols, medical record keeping, inventory control, and veterinary professional ethics.',
      outcomes: ['Client Communication', 'Informed Consent Forms', 'Medical Records', 'Inventory Control']
    },
    {
      id: 'veterinary-dermatology',
      title: 'Veterinary Dermatology',
      badge: 'DERMATOLOGY TRACK',
      category: 'Dermatology',
      level: 'Foundation to Advanced',
      duration: '2 to 4 Weeks',
      url: 'veterinary-dermatology.html',
      topics: ['skill-up', 'all'],
      levels: ['foundation', 'intermediate', 'advanced'],
      image: 'assets/images/programs/program-dermatology.webp',
      description: 'Clinical approach to pruritus, deep pyoderma, atopic dermatitis, allergy testing, and cytology of skin and ear lesions.',
      outcomes: ['Skin & Ear Cytology', 'Allergy Workups', 'Ectoparasite Scrapes', 'Atopy Protocols']
    }
  ]
};

let discoveryState = {
  discoveryStarted: false,
  selectedTopic: null,
  selectedGoal: null,
  selectedLevel: 'all'
};

let discoveryMatchedPrograms = [];
let discoveryVisibleCount = 3;

function getDiscoveryCatalog() {
  const baseCatalog = (discoveryDatabase.programs || []).filter(p => !p.isDemo);

  // If window.VETNOVA_28_PROGRAMS is loaded, incorporate any published programs not yet in baseCatalog
  if (Array.isArray(window.VETNOVA_28_PROGRAMS) && window.VETNOVA_28_PROGRAMS.length > 0) {
    const existingSlugs = new Set(baseCatalog.map(p => p.url ? p.url.replace('.html', '').toLowerCase() : ''));
    window.VETNOVA_28_PROGRAMS.forEach(p => {
      const slug = (p.slug || '').toLowerCase();
      if (!existingSlugs.has(slug) && p.title) {
        const cat = (p.category || '').toLowerCase();
        const topics = ['all'];
        if (cat.includes('surgery')) topics.push('surgery');
        if (cat.includes('imaging') || cat.includes('diagnostic') || cat.includes('pathology')) topics.push('radiology');
        if (cat.includes('emergency') || cat.includes('anaesthesia')) topics.push('emergency');
        if (cat.includes('nurse') || cat.includes('nursing')) topics.push('nurse');
        if (cat.includes('medicine') || cat.includes('skill')) topics.push('skill-up');

        baseCatalog.push({
          id: slug,
          title: p.title,
          badge: (p.category || 'CLINICAL SPECIALTY').toUpperCase(),
          category: p.category || 'Clinical Discipline',
          level: 'Foundation to Advanced',
          duration: p.duration || '2 to 4 Weeks',
          url: `${slug}.html`,
          topics: topics,
          levels: ['foundation', 'intermediate', 'advanced'],
          image: p.image || 'assets/images/programs/program-skill-up.webp',
          description: p.description || 'Structured clinical training with hands-on practice under expert guidance.',
          outcomes: ['Clinical Case Discussion', 'Hands-on Skill Practice', 'Diagnostic Assessment', 'Mentored Feedback']
        });
        existingSlugs.add(slug);
      }
    });
  }

  return baseCatalog;
}

function initQuiz() {
  initProgramDiscovery();
}

function initProgramDiscovery() {
  const topicButtons = document.querySelectorAll('.discovery-topic-btn');
  const goalContainer = document.getElementById('goal-options-container');
  const step1 = document.getElementById('step-1-content');
  const step2 = document.getElementById('step-2-content');
  const step3 = document.getElementById('step-3-content');

  const progressStep1 = document.querySelector('.discovery-progress .progress-step[data-step="1"]');
  const progressStep2 = document.querySelector('.discovery-progress .progress-step[data-step="2"]');
  const progressStep3 = document.querySelector('.discovery-progress .progress-step[data-step="3"]');

  const backBtn = document.getElementById('quiz-back-btn');
  const resetBtn = document.getElementById('quiz-reset-btn');
  const levelPills = document.querySelectorAll('.discovery-level-filter .level-pill');
  const loadMoreBtn = document.getElementById('discovery-load-more-btn');

  if (!topicButtons || topicButtons.length === 0 || !step1) return;

  // Initialize strictly at Step 1: No cards rendered, Step 2 & 3 locked
  resetToStep1();

  // Attach Load More button listener
  if (loadMoreBtn && !loadMoreBtn.dataset.bound) {
    loadMoreBtn.dataset.bound = 'true';
    loadMoreBtn.addEventListener('click', () => {
      discoveryVisibleCount += 3;
      renderDiscoveryCards();
    });
  }

  function resetToStep1(shouldScroll = false) {
    const wasStarted = discoveryState.discoveryStarted;
    discoveryState = {
      discoveryStarted: false,
      selectedTopic: null,
      selectedGoal: null,
      selectedLevel: 'all'
    };
    discoveryMatchedPrograms = [];
    discoveryVisibleCount = 3;

    topicButtons.forEach(b => b.classList.remove('selected'));
    if (levelPills) {
      levelPills.forEach(p => {
        if (p.dataset.level === 'all') p.classList.add('active');
        else p.classList.remove('active');
      });
    }
    if (goalContainer) goalContainer.innerHTML = '';
    const resultsContainer = document.getElementById('discovery-program-cards');
    if (resultsContainer) resultsContainer.innerHTML = '';
    const loadMoreWrap = document.getElementById('discovery-load-more-wrap');
    if (loadMoreWrap) loadMoreWrap.style.display = 'none';

    if (step1) step1.classList.add('active');
    if (step2) step2.classList.remove('active');
    if (step3) step3.classList.remove('active');

    if (progressStep1) {
      progressStep1.classList.add('active');
      progressStep1.classList.remove('completed', 'locked');
    }
    if (progressStep2) {
      progressStep2.classList.add('locked');
      progressStep2.classList.remove('active', 'completed');
    }
    if (progressStep3) {
      progressStep3.classList.add('locked');
      progressStep3.classList.remove('active', 'completed');
    }

    if (shouldScroll || wasStarted) {
      const quizSec = document.getElementById('quiz-section');
      if (quizSec) {
        quizSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // Step 1: Select Topic
  topicButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      topicButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      const topicKey = btn.dataset.topic || 'all';
      discoveryState.selectedTopic = topicKey;
      discoveryState.discoveryStarted = true;
      discoveryState.selectedGoal = null;
      discoveryVisibleCount = 3;

      populateGoals(topicKey);

      step1.classList.remove('active');
      step2.classList.add('active');
      step3.classList.remove('active');

      if (progressStep1) {
        progressStep1.classList.add('completed');
        progressStep1.classList.remove('active', 'locked');
      }
      if (progressStep2) {
        progressStep2.classList.add('active');
        progressStep2.classList.remove('locked', 'completed');
      }
      if (progressStep3) {
        progressStep3.classList.add('locked');
        progressStep3.classList.remove('active', 'completed');
      }
    });
  });

  // Level Refinement Filter Pills (Optional fine-tune inside Step 2)
  if (levelPills) {
    levelPills.forEach(pill => {
      pill.addEventListener('click', () => {
        levelPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        discoveryState.selectedLevel = pill.dataset.level || 'all';
        discoveryVisibleCount = 3;

        // If Step 3 is already active, re-calculate and re-render
        if (step3 && step3.classList.contains('active')) {
          renderDiscoveryResults(discoveryState.selectedGoal);
        }
      });
    });
  }

  // Back Button (Step 2 -> Step 1)
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      step2.classList.remove('active');
      step1.classList.add('active');
      step3.classList.remove('active');

      if (progressStep1) {
        progressStep1.classList.add('active');
        progressStep1.classList.remove('completed', 'locked');
      }
      if (progressStep2) {
        progressStep2.classList.add('locked');
        progressStep2.classList.remove('active', 'completed');
      }
      if (progressStep3) {
        progressStep3.classList.add('locked');
        progressStep3.classList.remove('active', 'completed');
      }

      discoveryState.selectedGoal = null;
    });
  }

  // Reset Button (Step 3 -> Step 1)
  if (resetBtn) {
    resetBtn.addEventListener('click', () => resetToStep1(true));
  }

  function populateGoals(topicKey) {
    if (!goalContainer) return;
    const topicData = discoveryDatabase.topics[topicKey] || discoveryDatabase.topics['all'];
    goalContainer.innerHTML = '';

    if (topicData && topicData.goals) {
      topicData.goals.forEach(goal => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt-btn discovery-goal-btn';
        btn.innerHTML = `
          <span class="icon"><i class="fa-solid fa-bullseye"></i></span>
          <div class="text">
            <b>${goal.text}</b>
            <small>Click to see matched programs for this specific outcome</small>
          </div>
        `;
        btn.addEventListener('click', () => {
          discoveryState.selectedGoal = goal;
          discoveryVisibleCount = 3;
          renderDiscoveryResults(goal);
        });
        goalContainer.appendChild(btn);
      });
    }
  }

  function renderDiscoveryCards() {
    const resultsContainer = document.getElementById('discovery-program-cards');
    const loadMoreWrap = document.getElementById('discovery-load-more-wrap');
    const loadMoreBtn = document.getElementById('discovery-load-more-btn');
    if (!resultsContainer) return;

    if (discoveryMatchedPrograms.length === 0) {
      resultsContainer.innerHTML = `
        <div class="discovery-empty-state" style="text-align: center; padding: 48px 24px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 16px; grid-column: 1 / -1;">
          <i class="fa-solid fa-compass-drafting" style="font-size: 36px; color: #94a3b8; margin-bottom: 12px; display: block;"></i>
          <h3 style="font-size: 1.15rem; color: #334155; margin-bottom: 8px; font-weight: 600;">No programs currently match these exact selections.</h3>
          <p style="font-size: 0.95rem; color: #64748b; margin: 0 0 20px 0;">We couldn't find a program matching your exact level refinement. Would you like to reset your selections or speak with our academic advisors?</p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-outline btn-sm" id="empty-reset-btn"><i class="fa-solid fa-rotate-right"></i> Reset Selections</button>
            <a href="contact.html#contact-form" class="btn btn-primary btn-sm"><i class="fa-solid fa-calendar-check"></i> Book Free Counselling</a>
          </div>
        </div>
      `;
      const emptyResetBtn = document.getElementById('empty-reset-btn');
      if (emptyResetBtn) emptyResetBtn.addEventListener('click', () => resetToStep1(false));
      if (loadMoreWrap) loadMoreWrap.style.display = 'none';
      return;
    }

    const visibleSlice = discoveryMatchedPrograms.slice(0, discoveryVisibleCount);

    resultsContainer.innerHTML = visibleSlice.map(p => {
      const badgeText = p.badge || 'VERIFIED PROGRAM';
      const cardImg = p.image || 'assets/images/programs/program-skill-up.webp';
      const outcomesHtml = (p.outcomes && p.outcomes.length > 0)
        ? `<div class="discovery-card-outcomes">
            ${p.outcomes.slice(0, 3).map(o => `<span><i class="fa-solid fa-check"></i> ${o}</span>`).join('')}
          </div>`
        : '';

      const programSlug = p.slug || p.id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `
        <div class="discovery-card">
          <div class="discovery-card-img-wrap" style="position: relative;">
            <img src="${cardImg}" alt="${p.title}" loading="lazy" />
            <span class="discovery-card-badge">${badgeText}</span>
          </div>
          <div class="discovery-card-body">
            <div class="discovery-card-meta">
              <span><i class="fa-solid fa-signal"></i> ${p.level || 'All Levels'}</span>
              <span><i class="fa-solid fa-book-open"></i> ${p.category || 'Clinical Track'}</span>
              <span><i class="fa-solid fa-hospital"></i> Offline Vet Lab</span>
            </div>
            <h4 class="discovery-card-title">${p.title}</h4>
            <p class="discovery-card-desc">${p.description}</p>
            ${outcomesHtml}
            <div class="discovery-card-actions" style="margin-top: 16px; display: flex; gap: 8px;">
              <a href="${p.url}" class="btn btn-primary btn-sm">
                Explore Program <i class="fa-solid fa-arrow-right"></i>
              </a>
              <a href="contact.html?program=${encodeURIComponent(programSlug)}#contact-form" class="btn btn-outline btn-sm">
                Enquire Now
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Re-bind modal triggers for dynamically created enquire buttons
    if (typeof bindModalTriggers === 'function') {
      bindModalTriggers();
    }

    // Update Load More Programs button visibility and text
    if (loadMoreWrap && loadMoreBtn) {
      if (discoveryMatchedPrograms.length > discoveryVisibleCount) {
        loadMoreWrap.style.display = 'block';
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = `<i class="fa-solid fa-plus-circle" style="margin-right: 6px;"></i> Load More Programs (${discoveryMatchedPrograms.length - discoveryVisibleCount} remaining)`;
      } else {
        loadMoreWrap.style.display = 'none';
      }
    }
  }

  function renderDiscoveryResults(goal) {
    const resultsTitle = document.getElementById('discovery-results-title');
    const resultsSubtitle = document.getElementById('discovery-results-subtitle');

    if (resultsTitle) {
      if (discoveryState.selectedTopic === 'all') {
        resultsTitle.textContent = 'Relevant Programs Matching Your Interests';
      } else {
        const topicName = discoveryDatabase.topics[discoveryState.selectedTopic]?.name || 'Your Selected Topic';
        resultsTitle.textContent = `Relevant Programs for ${topicName}`;
      }
    }
    if (resultsSubtitle) {
      if (goal && goal.text) {
        resultsSubtitle.textContent = `Targeting: "${goal.text}"`;
      } else {
        resultsSubtitle.textContent = 'Official VetNova clinical programs aligned with your clinical learning goals.';
      }
    }

    // 1. Retrieve all genuine published discovery programs (no demos)
    const catalog = getDiscoveryCatalog();

    // 2. Filter programs by topic
    let filtered = catalog.filter(p => {
      if (!p || p.isDemo) return false;
      if (discoveryState.selectedTopic === 'all') return true;
      return p.topics && p.topics.includes(discoveryState.selectedTopic);
    });

    // 3. Prioritize by goal if goal has specific programIds
    if (goal && goal.programIds && goal.programIds.length > 0) {
      filtered.sort((a, b) => {
        const aMatch = goal.programIds.includes(a.id);
        const bMatch = goal.programIds.includes(b.id);
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    }

    // 4. Apply Level Refinement (Step 2)
    if (discoveryState.selectedLevel && discoveryState.selectedLevel !== 'all') {
      filtered = filtered.filter(p => p.levels && p.levels.includes(discoveryState.selectedLevel));
    }

    // 5. Save matching results and reset visible count to 3
    discoveryMatchedPrograms = filtered;
    discoveryVisibleCount = 3;

    // 6. Render the first 3 cards initially
    renderDiscoveryCards();

    // 7. Transition view to Step 3
    if (step2 && step3) {
      step2.classList.remove('active');
      step3.classList.add('active');
    }

    if (progressStep1) {
      progressStep1.classList.add('completed');
      progressStep1.classList.remove('active', 'locked');
    }
    if (progressStep2) {
      progressStep2.classList.add('completed');
      progressStep2.classList.remove('active', 'locked');
    }
    if (progressStep3) {
      progressStep3.classList.add('active');
      progressStep3.classList.remove('locked');
    }
  }
}

/* ==========================================================================
   Enquiry Lead Form Handler
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('enquiry-form');
  const successState = document.getElementById('form-success-message');
  const resetBtn = document.getElementById('form-reset-btn');
  const errorBanner = document.getElementById('form-error-message');
  const errorText = document.getElementById('form-error-text');

  if (!form || !successState) return;

  // Query persona pills globally or within form container
  const personaPills = document.querySelectorAll('.persona-pill');
  const roleSelect = document.getElementById('form-role');
  const dynamicDoctor = form.querySelector('.dynamic-field-doctor');
  const dynamicNurse = form.querySelector('.dynamic-field-nurse');
  const dynamicCorporate = form.querySelector('.dynamic-field-corporate');
  const dynamicPet = form.querySelector('.dynamic-field-pet');

  let selectedPersona = 'practicing_vet';

  function setPersona(persona) {
    if (!persona) return;
    selectedPersona = persona;

    if (roleSelect) {
      roleSelect.value = persona;
    }

    personaPills.forEach(pill => {
      const isSelected = pill.getAttribute('data-persona') === persona;
      if (isSelected) {
        pill.classList.add('active');
        pill.setAttribute('aria-pressed', 'true');
      } else {
        pill.classList.remove('active');
        pill.setAttribute('aria-pressed', 'false');
      }
    });

    // Toggle persona-specific form fields immediately
    if (dynamicDoctor) dynamicDoctor.style.display = (persona === 'practicing_vet' || persona === 'fresh_grad' || persona === 'doctor') ? 'grid' : 'none';
    if (dynamicNurse) dynamicNurse.style.display = (persona === 'vet_nurse' || persona === 'nurse') ? 'block' : 'none';
    if (dynamicCorporate) dynamicCorporate.style.display = (persona === 'corporate' || persona === 'academic' || persona === 'sponsor') ? 'block' : 'none';
    if (dynamicPet) dynamicPet.style.display = (persona === 'pet_parent') ? 'block' : 'none';
  }

  // Attach click and keydown event handlers to all persona pills
  personaPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const persona = pill.getAttribute('data-persona');
      setPersona(persona);
    });

    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const persona = pill.getAttribute('data-persona');
        setPersona(persona);
      }
    });
  });

  if (roleSelect) {
    roleSelect.addEventListener('change', () => {
      setPersona(roleSelect.value);
    });
  }

  // Initialize initial active state
  setPersona('practicing_vet');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (errorBanner) errorBanner.style.display = 'none';

    // Persona validation
    if (!selectedPersona) {
      if (errorBanner && errorText) {
        errorText.textContent = 'Please select your profile.';
        errorBanner.style.display = 'flex';
      }
      return;
    }

    const nameEl = document.getElementById('form-name');
    const emailEl = document.getElementById('form-email');
    const phoneEl = document.getElementById('form-phone');
    const programEl = document.getElementById('form-program');
    const periodEl = document.getElementById('form-period');
    const messageEl = document.getElementById('form-message');
    const expEl = document.getElementById('form-experience');
    const orgEl = document.getElementById('form-org');

    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    let phone = phoneEl ? phoneEl.value.trim() : '';
    const ccSelect = form.querySelector('select[name="country_code"]');
    const countryCode = ccSelect ? ccSelect.value.trim() : '+91';

    // Normalize phone number
    if (phone.startsWith(countryCode)) {
      phone = phone.substring(countryCode.length).trim();
    }
    phone = phone.replace(/^0+/, '').trim();

    if (!name || !email || !phone) {
      if (errorBanner && errorText) {
        errorText.textContent = 'Please fill out all required fields (Name, Email, Phone Number).';
        errorBanner.style.display = 'flex';
      }
      return;
    }

    // Course title resolution
    let courseTitle = 'General Enquiry';
    if (programEl && programEl.options && programEl.selectedIndex >= 0) {
      courseTitle = programEl.options[programEl.selectedIndex].text.replace(/\s*\(Flagship\)\s*/i, '').trim();
    }

    // Clinical Experience resolution
    let clinicalExp = '';
    if (expEl && expEl.options && expEl.selectedIndex >= 0) {
      clinicalExp = expEl.options[expEl.selectedIndex].text;
    }

    const preferredTrainingPeriod = periodEl ? periodEl.value.trim() : '';
    const rawMessage = messageEl ? messageEl.value.trim() : '';
    const orgName = orgEl ? orgEl.value.trim() : '';

    let fullMessage = rawMessage;
    const metaParts = [];
    if (preferredTrainingPeriod) metaParts.push(`Preferred Timeline: ${preferredTrainingPeriod}`);
    if (clinicalExp && (selectedPersona === 'practicing_vet' || selectedPersona === 'fresh_grad')) {
      metaParts.push(`Clinical Experience: ${clinicalExp}`);
    }
    if (orgName && (selectedPersona === 'corporate' || selectedPersona === 'academic')) {
      metaParts.push(`Organization: ${orgName}`);
    }

    if (metaParts.length > 0) {
      const metaHeader = metaParts.join(' | ');
      fullMessage = rawMessage ? `${metaHeader}\n\n${rawMessage}` : metaHeader;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Book Free Counselling Session <i class="fa-solid fa-calendar-check"></i>';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting...';
    }

    const pagePath = 'contact.html';

    const payload = {
      name,
      countryCode,
      phone,
      email,
      profile: selectedPersona,
      course: courseTitle,
      preferredTrainingPeriod,
      clinicalExperience: clinicalExp,
      message: fullMessage,
      source: 'Contact Page Counselling',
      sourcePage: pagePath
    };

    try {
      if (typeof submitEnquiry !== 'function') {
        throw new Error('API client script (api.js) failed to load. Please refresh the page and try again.');
      }
      await submitEnquiry(payload);

      form.style.display = 'none';
      successState.style.display = 'flex';
      form.reset();
      setPersona('practicing_vet');
    } catch (err) {
      console.error('[Contact Enquiry]', err);
      if (errorBanner && errorText) {
        errorText.textContent = err.message || 'Unable to submit your enquiry right now. Please check your connection and try again, or contact us directly.';
        errorBanner.style.display = 'flex';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      setPersona('practicing_vet');
      if (errorBanner) errorBanner.style.display = 'none';
      successState.style.display = 'none';
      form.style.display = 'block';
    });
  }
}

/* ==========================================================================
   Smooth Scrolling for Page Anchors
   ========================================================================== */
function initSmoothScroll() {
  function scrollToElementWithOffset(targetElement, behavior = 'smooth') {
    if (!targetElement) return;
    const header = document.getElementById('global-header') || document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 90;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - (headerHeight + 16);

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: behavior
    });

    if (!targetElement.hasAttribute('tabindex')) {
      targetElement.setAttribute('tabindex', '-1');
    }
    targetElement.focus({ preventScroll: true });
  }

  // Intercept all anchor links targeting same-page elements or hashes
  const links = document.querySelectorAll('a[href*="#"]');
  const currentPath = window.location.pathname.replace(/^\//, '').split('/').pop() || 'index.html';

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const rawHref = link.getAttribute('href');
      if (!rawHref || rawHref === '#') return;

      let linkPath = '';
      let hash = '';

      if (rawHref.startsWith('#')) {
        hash = rawHref;
        linkPath = currentPath;
      } else {
        const parts = rawHref.split('#');
        linkPath = parts[0].replace(/^\.\//, '').replace(/^\//, '').split('/').pop() || 'index.html';
        hash = parts[1] ? '#' + parts[1] : '';
      }

      // Check if this link targets an anchor on the current page
      const isCurrentPage = !linkPath || linkPath === currentPath ||
        (linkPath === 'index.html' && (currentPath === '' || currentPath === 'index.html')) ||
        (linkPath === 'about.html' && currentPath === 'about.html');

      if (isCurrentPage && hash && hash !== '#') {
        const targetId = hash.slice(1);
        let targetElement = document.getElementById(targetId) || document.querySelector(hash);

        // Fallback for mission-vision / vision-mission alias
        if (!targetElement && (targetId === 'vision-mission' || targetId === 'mission-vision')) {
          targetElement = document.getElementById('vision-mission') || document.getElementById('mission-vision');
        }

        if (targetElement) {
          e.preventDefault();
          scrollToElementWithOffset(targetElement, 'smooth');

          if (window.history && window.history.pushState) {
            window.history.pushState(null, '', hash);
          } else {
            window.location.hash = hash;
          }

          if (typeof initActiveNavigation === 'function') {
            initActiveNavigation();
          }
        }
      }
    });
  });

  // Handle direct navigation or page refresh with a hash (e.g., about.html#vision-mission)
  function handleInitialHash() {
    if (window.location.hash) {
      const hash = window.location.hash;
      const targetId = hash.slice(1);
      let targetElement = document.getElementById(targetId) || document.querySelector(hash);

      if (!targetElement && (targetId === 'vision-mission' || targetId === 'mission-vision')) {
        targetElement = document.getElementById('vision-mission') || document.getElementById('mission-vision');
      }

      if (targetElement) {
        setTimeout(() => {
          scrollToElementWithOffset(targetElement, 'smooth');
        }, 120);
      }
    }
  }

  handleInitialHash();
  window.addEventListener('hashchange', handleInitialHash);
}

/* ==========================================================================
   Popup Enquiry Modal Controller (with Show Interest & Notify Me Prefill Support)
   ========================================================================== */
/* ==========================================================================
   Popup Counselling / Enquiry Modal Controller
   ========================================================================== */
function initEnquiryModal() {
  let lastFocusedElement = null;
  let isSubmitting = false;

  function getModalElements() {
    const modal = document.getElementById('enquiry-modal');
    if (!modal) return null;
    return {
      modal,
      closeBtn: document.getElementById('modal-close-btn'),
      successCloseBtn: document.getElementById('modal-success-close'),
      form: document.getElementById('modal-enquiry-form'),
      successState: document.getElementById('modal-success-state'),
      errorBanner: document.getElementById('modal-error-banner'),
      errorText: document.getElementById('modal-error-text'),
      modalHead: modal.querySelector('.modal-head'),
      modalTitle: document.getElementById('modal-title'),
      modalDesc: document.getElementById('modal-desc'),
      nameInput: document.getElementById('modal-name'),
      emailInput: document.getElementById('modal-email'),
      phoneInput: document.getElementById('modal-phone'),
      countryCodeSelect: document.getElementById('modal-country-code') || modal.querySelector('select[name="modal_country_code"]'),
      programSelect: document.getElementById('modal-program'),
      modeSelect: document.getElementById('modal-mode'),
      messageInput: document.getElementById('modal-message'),
      submitBtn: document.getElementById('modal-submit-btn') || modal.querySelector('button[type="submit"]')
    };
  }

  function closeModal() {
    const els = getModalElements();
    if (!els || !els.modal) return;
    els.modal.classList.remove('open');
    document.body.style.overflow = '';
    if (els.form) {
      delete els.form.dataset.source;
      delete els.form.dataset.targetProgram;
    }
    if (els.errorBanner) els.errorBanner.style.display = 'none';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      try { lastFocusedElement.focus(); } catch (e) { }
    }
  }

  function openModal(e, options = {}) {
    if (e && e.preventDefault) e.preventDefault();

    const els = getModalElements();
    if (!els || !els.modal) {
      console.warn('[EnquiryModal] Modal element not found in DOM');
      return;
    }

    lastFocusedElement = options.triggerEl || (e ? e.currentTarget || e.target : document.activeElement);

    // Reset visibility states
    if (els.form) {
      els.form.style.display = 'grid';
      if (options.source) {
        els.form.dataset.source = options.source;
      } else {
        delete els.form.dataset.source;
      }
    }
    if (els.successState) els.successState.style.display = 'none';
    if (els.errorBanner) els.errorBanner.style.display = 'none';
    if (els.modalHead) els.modalHead.style.display = '';

    // Clear input error highlights
    els.modal.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    // Configure Header Texts
    if (els.modalTitle) {
      els.modalTitle.textContent = options.title || 'Book a Counselling Session';
    }
    if (els.modalDesc) {
      els.modalDesc.textContent = options.subtitle || 'Speak with our team to find the right veterinary learning programme for your goals.';
    }

    // Configure Submit Button Text
    if (els.submitBtn) {
      const btnTextSpan = els.submitBtn.querySelector('span');
      const textToSet = options.submitText || (options.isEnquiry ? 'Submit Enquiry' : 'Request Counselling');
      if (btnTextSpan) {
        btnTextSpan.textContent = textToSet;
      } else {
        els.submitBtn.innerHTML = `<span>${textToSet}</span> <i class="fa-solid fa-arrow-right"></i>`;
      }
      els.submitBtn.disabled = false;
    }

    // Preselect Program if specified or detected
    if (els.programSelect) {
      let targetProgram = options.program || '';
      if (!targetProgram) {
        // Auto-detect from page URL/slug if on an individual program page
        const path = window.location.pathname.split('/').pop().replace('.html', '');
        if (window.VETNOVA_28_PROGRAMS && Array.isArray(window.VETNOVA_28_PROGRAMS)) {
          const match = window.VETNOVA_28_PROGRAMS.find(p => p.slug === path);
          if (match) targetProgram = match.title;
        }
        if (!targetProgram) {
          const h1 = document.querySelector('h1');
          if (h1) {
            const h1Text = h1.textContent.trim().toLowerCase();
            for (let i = 0; i < els.programSelect.options.length; i++) {
              const optVal = els.programSelect.options[i].value.toLowerCase();
              if (optVal && h1Text.includes(optVal)) {
                targetProgram = els.programSelect.options[i].value;
                break;
              }
            }
          }
        }
      }

      if (targetProgram) {
        const lowerTarget = targetProgram.toLowerCase();
        for (let i = 0; i < els.programSelect.options.length; i++) {
          const opt = els.programSelect.options[i];
          if (opt.value && (opt.value.toLowerCase() === lowerTarget || opt.text.toLowerCase().includes(lowerTarget))) {
            els.programSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    // Prefill Message
    if (options.message && els.messageInput) {
      els.messageInput.value = options.message;
    }

    // Open Modal & Lock Body Scroll
    els.modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Set initial focus to Name field
    setTimeout(() => {
      if (els.nameInput) els.nameInput.focus();
    }, 120);
  }

  // Expose globally so external components or chatbots can open it
  window.openCounsellingModal = function (options = {}) {
    openModal(null, options);
  };

  // Keyboard navigation: Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const els = getModalElements();
      if (els && els.modal && els.modal.classList.contains('open')) {
        closeModal();
      }
    }
  });

  // Delegated Global Click Interceptor for Book Counselling & Modal Triggers
  document.addEventListener('click', (e) => {
    // 1. Close Button
    if (e.target.closest('#modal-close-btn, #modal-success-close')) {
      e.preventDefault();
      closeModal();
      return;
    }

    // 2. Backdrop click
    const els = getModalElements();
    if (els && els.modal && e.target === els.modal) {
      closeModal();
      return;
    }

    // 3. Book Counselling triggers
    const triggerBtn = e.target.closest(
      '.btn-counselling-pill, #header-counselling-btn, .header-counselling-btn, .btn-counselling-modal, .btn-book-counselling, [data-action="book-counselling"]'
    ) || (e.target.closest('a, button') && (e.target.closest('a, button').textContent || '').trim().toLowerCase().includes('book counselling') ? e.target.closest('a, button') : null);

    if (triggerBtn) {
      const href = triggerBtn.getAttribute('href') || '';
      // Don't intercept telephone dialing links
      if (href.startsWith('tel:')) return;

      // Check if on contact.html and clicking internal section anchor
      const isContactPage = window.location.pathname.endsWith('contact.html');
      const isNavOrSticky = triggerBtn.closest('#global-header, .topbar, .drawer-menu, .mobile-stick');
      if (isContactPage && (href === '#contact-form' || href === '#enquiry') && !isNavOrSticky) {
        return; // Allow smooth in-page jump
      }

      e.preventDefault();
      e.stopPropagation();

      openModal(e, {
        title: 'Book a Counselling Session',
        subtitle: 'Speak with our team to find the right veterinary learning programme for your goals.',
        source: triggerBtn.dataset.source || 'Book Counselling Button',
        program: triggerBtn.dataset.program || '',
        triggerEl: triggerBtn
      });
      return;
    }

    // 4. Show Interest & Notify Me button triggers
    const interestBtn = e.target.closest('.btn-show-interest');
    const notifyBtn = e.target.closest('.btn-notify-me');
    if (interestBtn || notifyBtn) {
      e.preventDefault();
      const btn = interestBtn || notifyBtn;
      const isNotify = !!notifyBtn;
      const customSource = btn.dataset.source || (isNotify ? 'Program Notify Me' : 'Program Interest');
      const context = btn.dataset.context || '';

      const gradeSelect = document.getElementById('filter-grade') || document.getElementById('filter-level');
      const trackSelect = document.getElementById('filter-track') || document.getElementById('filter-topic');
      const modeSelect = document.getElementById('filter-mode');
      const searchInput = document.getElementById('program-search-input');

      const gradeMap = {
        'grade-1': 'Grade 1 — Basic',
        'grade-2': 'Grade 2 — Intermediate',
        'grade-3': 'Grade 3 — Competitive',
        'grade-4': 'Grade 4 — Advanced',
        'grade-5': 'Grade 5 — Pro'
      };

      const trackMap = {
        'fresh-graduates': 'Fresh Graduates & Interns',
        'practicing-vets': 'Practicing Veterinarians',
        'diagnostic-specialization': 'Diagnostic Specialization',
        'emergency-care': 'Emergency & Critical Care',
        'vet-nurse': 'Vet Nurse & Paravet Staff'
      };

      const modeMap = {
        offline: '100% Offline Campus',
        hybrid: 'Hybrid Learning',
        workshop: 'Weekend Workshop'
      };

      const rawGrade = gradeSelect ? gradeSelect.value : 'all';
      const rawTrack = trackSelect ? trackSelect.value : 'all';
      const rawMode = modeSelect ? modeSelect.value : 'all';
      const keyword = searchInput ? searchInput.value.trim() : '';

      const gradeName = gradeMap[rawGrade] || (rawGrade !== 'all' ? rawGrade : '');
      const trackName = trackMap[rawTrack] || (rawTrack !== 'all' ? rawTrack : '');
      const modeName = modeMap[rawMode] || (rawMode !== 'all' ? rawMode : '');

      let activeFilterSummary = [];
      if (gradeName) activeFilterSummary.push(`Grade: ${gradeName}`);
      if (trackName) activeFilterSummary.push(`Track: ${trackName}`);
      if (modeName) activeFilterSummary.push(`Mode: ${modeName}`);
      if (keyword) activeFilterSummary.push(`Keyword: "${keyword}"`);

      const summaryStr = activeFilterSummary.length > 0 ? activeFilterSummary.join(' | ') : 'General Clinical Programs';

      let prefilledMessage = '';
      let modalTitle = '';
      let modalSubtitle = '';

      if (isNotify) {
        modalTitle = 'Get Notified for Upcoming Batches';
        modalSubtitle = 'We will notify you immediately as soon as a new batch or seat opens for your selected course.';
        prefilledMessage = `Please notify me when the next batch/intake opens for: [${summaryStr}].${context ? ' Context: ' + context : ''}`;
      } else {
        modalTitle = 'Show Interest in a Course';
        modalSubtitle = 'Tell us your learning goals and our academic team will connect with you to explore customized options.';
        prefilledMessage = `I am interested in a clinical training program matching: [${summaryStr}]. Please share details on upcoming options.${context ? ' Context: ' + context : ''}`;
      }

      openModal(e, {
        source: customSource,
        title: modalTitle,
        subtitle: modalSubtitle,
        message: prefilledMessage,
        isEnquiry: true,
        submitText: 'Submit Enquiry',
        triggerEl: btn
      });
    }
  });

  // Delegated Form Submission Handler
  document.addEventListener('submit', async (e) => {
    if (e.target && e.target.id === 'modal-enquiry-form') {
      e.preventDefault();
      const form = e.target;
      const els = getModalElements();
      if (!els) return;

      if (isSubmitting) return;

      const nameVal = els.nameInput ? els.nameInput.value.trim() : '';
      const emailVal = els.emailInput ? els.emailInput.value.trim() : '';
      const phoneVal = els.phoneInput ? els.phoneInput.value.trim() : '';
      const countryCode = els.countryCodeSelect ? els.countryCodeSelect.value.trim() : '+91';
      const programVal = els.programSelect ? els.programSelect.value.trim() : '';
      const modeVal = els.modeSelect ? els.modeSelect.value.trim() : '';
      const messageVal = els.messageInput ? els.messageInput.value.trim() : '';

      // Reset previous error classes
      [els.nameInput, els.emailInput, els.phoneInput, els.programSelect, els.modeSelect].forEach(input => {
        if (input) input.classList.remove('input-error');
      });
      if (els.errorBanner) els.errorBanner.style.display = 'none';

      // Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneDigits = phoneVal.replace(/\D/g, '');

      let errorMsg = '';
      let firstInvalid = null;

      if (!nameVal || nameVal.length < 2) {
        errorMsg = 'Please enter your full name.';
        firstInvalid = els.nameInput;
      } else if (!emailVal || !emailRegex.test(emailVal)) {
        errorMsg = 'Please enter a valid email address.';
        firstInvalid = els.emailInput;
      } else if (!phoneVal || phoneDigits.length < 7 || phoneDigits.length > 15) {
        errorMsg = 'Please enter a valid phone number (at least 7 to 10 digits).';
        firstInvalid = els.phoneInput;
      } else if (!programVal) {
        errorMsg = 'Please select an interested program.';
        firstInvalid = els.programSelect;
      } else if (!modeVal) {
        errorMsg = 'Please choose your preferred counselling mode (Online or Phone Call).';
        firstInvalid = els.modeSelect;
      }

      if (errorMsg) {
        if (els.errorBanner && els.errorText) {
          els.errorText.textContent = errorMsg;
          els.errorBanner.style.display = 'flex';
        }
        if (firstInvalid) {
          firstInvalid.classList.add('input-error');
          firstInvalid.focus();
        }
        return;
      }

      // Prepare UI for submission
      isSubmitting = true;
      const originalBtnHTML = els.submitBtn ? els.submitBtn.innerHTML : '<span>Request Counselling</span>';
      if (els.submitBtn) {
        els.submitBtn.disabled = true;
        els.submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Submitting Request...</span>';
      }

      const pagePath = window.location.pathname || 'website';
      const sourceTag = form.dataset.source || 'Book Counselling Modal';

      const payload = {
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        countryCode: countryCode,
        course: programVal,
        profile: 'Counselling Lead',
        message: messageVal ? `${messageVal}\n[Preferred Counselling Mode: ${modeVal}]` : `[Preferred Counselling Mode: ${modeVal}]`,
        formData: {
          counsellingMode: modeVal,
          preferredMode: modeVal,
          interestedProgram: programVal,
          rawMessage: messageVal
        },
        source: sourceTag,
        sourcePage: pagePath
      };

      try {
        if (typeof submitEnquiry !== 'function') {
          throw new Error('API client script (api.js) failed to load. Please check your connection and try again.');
        }

        await submitEnquiry(payload);

        // On Success
        form.style.display = 'none';
        if (els.modalHead) els.modalHead.style.display = 'none';
        if (els.errorBanner) els.errorBanner.style.display = 'none';
        if (els.successState) {
          els.successState.style.display = 'flex';
          const successBtn = els.successState.querySelector('button');
          if (successBtn) successBtn.focus();
        }
        if (typeof form.reset === 'function') form.reset();
      } catch (err) {
        console.error('Counselling Submission Error:', err);
        if (els.errorBanner && els.errorText) {
          els.errorText.textContent = err.message || 'Unable to submit your counselling request. Please check your connection and try again.';
          els.errorBanner.style.display = 'flex';
        } else {
          alert(err.message || 'Unable to submit enquiry. Please check your connection and try again.');
        }
      } finally {
        isSubmitting = false;
        if (els.submitBtn) {
          els.submitBtn.disabled = false;
          els.submitBtn.innerHTML = originalBtnHTML;
        }
      }
    }
  });

  // Clear input-error on input/change
  document.addEventListener('input', (e) => {
    if (e.target && e.target.classList.contains('input-error')) {
      e.target.classList.remove('input-error');
      const banner = document.getElementById('modal-error-banner');
      if (banner) banner.style.display = 'none';
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target && e.target.classList.contains('input-error')) {
      e.target.classList.remove('input-error');
      const banner = document.getElementById('modal-error-banner');
      if (banner) banner.style.display = 'none';
    }
  });

  // Re-check whenever components.js loads a shared component
  document.addEventListener('vetnova:componentLoaded', (e) => {
    // Component loaded hook
  });
}

/* ==========================================================================
   Viewport Counter Animation Controller
   ========================================================================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter-number[data-count]');
  if (!counters || counters.length === 0) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    const duration = 1500;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * target);

      el.textContent = currentVal.toLocaleString('en-US') + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target.toLocaleString('en-US') + suffix;
      }
    };

    requestAnimationFrame(updateCount);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    counters.forEach(counter => observer.observe(counter));
  } else {
    counters.forEach(counter => animateCounter(counter));
  }
}

/* ==========================================================================
   Testimonials & Success Stories Slider Controller
   ========================================================================== */
const testimonialsData = [
  {
    quote: "“The Skill-Up program completely transformed my surgical confidence. I went from assisting to performing soft tissue procedures independently within weeks.”",
    name: "Dr. Ananya Sharma",
    role: "Practicing Vet • 2 Yrs Experience",
    avatar: "assets/images/learning-path-graduate.webp"
  },
  {
    quote: "“The radiology and ultrasound scanning workshops gave me clear diagnostic reasoning. My clinic's diagnostic accuracy and patient trust have grown tremendously.”",
    name: "Dr. Rahul Deshmukh",
    role: "Clinic Founder • 6 Yrs Experience",
    avatar: "assets/images/learning-path-doctor.webp"
  },
  {
    quote: "“As a final-year student, VetNova bridged the exact gap between textbook theories and real clinical workflows. Highly recommended for fresh graduates!”",
    name: "Dr. Priya Nair",
    role: "Final-Year Student • Pune",
    avatar: "assets/images/learning-path-student.webp"
  },
  {
    quote: "“The Vet Nurse program equipped our clinic assistants with standard handling, surgical prep, and emergency response protocols. Exceptional learning environment!”",
    name: "Rohan Mehta",
    role: "Head Vet Assistant • Mumbai",
    avatar: "assets/images/learning-path-nurse.webp"
  }
];

function initTestimonialSlider() {
  const card = document.getElementById('testimonial-card');
  const quoteEl = document.getElementById('testimonial-quote');
  const nameEl = document.getElementById('testimonial-name');
  const roleEl = document.getElementById('testimonial-role');
  const avatarEl = document.getElementById('testimonial-avatar');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsContainer = document.getElementById('testimonial-dots');

  if (!card || !quoteEl || !nameEl || !roleEl || !avatarEl) return;

  let currentIndex = 0;
  let autoPlayTimer = null;

  function updateSlide(index) {
    currentIndex = index;
    if (currentIndex < 0) currentIndex = testimonialsData.length - 1;
    if (currentIndex >= testimonialsData.length) currentIndex = 0;

    const data = testimonialsData[currentIndex];

    card.style.opacity = '0';
    card.style.transform = 'translateY(8px)';

    setTimeout(() => {
      quoteEl.textContent = data.quote;
      nameEl.textContent = data.name;
      roleEl.textContent = data.role;
      avatarEl.src = data.avatar;
      avatarEl.alt = data.name;

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
          if (i === currentIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }

      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 200);
  }

  function resetAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      updateSlide(currentIndex + 1);
    }, 6000);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlide(currentIndex - 1);
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlide(currentIndex + 1);
      resetAutoPlay();
    });
  }

  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        updateSlide(i);
        resetAutoPlay();
      });
    });
  }

  resetAutoPlay();
}

/* ==========================================================================
   Video Walkthrough Modal Controller
   ========================================================================== */
function initVideoModal() {
  const videoCards = document.querySelectorAll('.video-card');
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('video-modal-close');
  const iframe = document.getElementById('video-iframe');

  if (!modal || !videoCards.length) return;

  const videoUrl = 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4?autoplay=1';

  function openVideoModal(e) {
    if (e) e.preventDefault();
    if (iframe) iframe.src = videoUrl;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (iframe) iframe.src = '';
    document.body.style.overflow = '';
  }

  videoCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', openVideoModal);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        openVideoModal(e);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeVideoModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeVideoModal();
    }
  });
}

/* ==========================================================================
   11. Reading Progress Bar Controller (Single Article)
   ========================================================================== */
function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress-bar');
  const article = document.querySelector('.article-main-content');

  if (!progressBar || !article) return;

  function updateProgress() {
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    const totalScrollable = articleHeight - windowHeight + 100;
    if (totalScrollable <= 0) {
      progressBar.style.width = '0%';
      return;
    }

    const currentScroll = scrollY - articleTop + 100;
    const progress = Math.max(0, Math.min(100, (currentScroll / totalScrollable) * 100));
    progressBar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
}

/* ==========================================================================
   12. Blog Category Filter Pills Controller
   ========================================================================== */
function initBlogCategoryFilter() {
  // If dynamic blog.js controller is loaded, defer category filtering to blog.js
  if (typeof initBlogPage === 'function') return;

  const pills = document.querySelectorAll('.category-pill');
  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const category = pill.dataset.category || 'all';
      const currentCards = document.querySelectorAll('.blog-card');

      currentCards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   13. Realtime Program Filter, Persona Discovery & Recommendation Controller
   ========================================================================== */
/* ==========================================================================
   13. Grade-Based Program Data Model (Requirement 16)
   ========================================================================== */

/* ==========================================================================
   Program Card Image Taxonomy & Mapping Helper (Requirement 1 & 10)
   ========================================================================== */
function getProgramImage(program) {
  if (program && program.image) return program.image;

  const trackImages = {
    'fresh-graduates': [
      'assets/images/programs/program-skill-up.webp',
      'assets/images/learning-paths/featured-skillup.webp',
      'assets/images/learning-centre/learning-students.webp',
      'assets/images/edu-flagship-skillup.webp',
      'assets/images/learning-path-student.webp',
      'assets/images/learning-path-graduate.webp',
      'assets/images/program-clinic-ready.webp',
      'assets/images/edu-clinic-ready-thumb.webp',
      'assets/images/learning-centre/learning-classroom.webp',
      'assets/images/learning-paths/veterinary-skillup.webp'
    ],
    'practicing-vets': [
      'assets/images/programs/program-surgery.webp',
      'assets/images/learning-paths/soft-tissue-surgery.webp',
      'assets/images/learning-centre/equipment_surgery.webp',
      'assets/images/learning-centre/learning-surgery.webp',
      'assets/images/edu-surgery-thumb.webp',
      'assets/images/learning-path-doctor.webp',
      'assets/images/learning-centre/equipment_anesthesia.webp',
      'assets/images/learning-centre/learning-wetlab.webp',
      'assets/images/learning-path-specialist.webp',
      'assets/images/counselling-academic-guidance.webp'
    ],
    'diagnostic-specialization': [
      'assets/images/programs/program-radiology.webp',
      'assets/images/learning-paths/radiology-ultrasound.webp',
      'assets/images/learning-centre/equipment_ultrasound.webp',
      'assets/images/learning-centre/equipment_xray.webp',
      'assets/images/learning-centre/equipment_laboratory.webp',
      'assets/images/learning-centre/learning-ultrasound.webp',
      'assets/images/learning-centre/learning-xray.webp',
      'assets/images/facility-radiology.webp',
      'assets/images/edu-radiology-thumb.webp',
      'assets/images/facility-main.webp'
    ],
    'emergency-care': [
      'assets/images/programs/program-emergency.webp',
      'assets/images/programs/program-first-aid.webp',
      'assets/images/learning-paths/emergency-medicine.webp',
      'assets/images/learning-paths/pet-first-aid.webp',
      'assets/images/learning-centre/equipment_emergency.webp',
      'assets/images/edu-emergency-thumb.webp',
      'assets/images/learning-centre/learning-hospital.webp',
      'assets/images/hero-veterinary-training.webp',
      'assets/images/facility-lecture.webp',
      'assets/images/learning-centre/learning-hero.webp'
    ],
    'vet-nurse': [
      'assets/images/programs/program-nurse.webp',
      'assets/images/learning-paths/vet-nurse.webp',
      'assets/images/learning-path-nurse.webp',
      'assets/images/learning-centre/learning-students.webp',
      'assets/images/programs/alumni-01.webp',
      'assets/images/programs/training-formats-featured.webp',
      'assets/images/programs/hero-programs.webp',
      'assets/images/learning-centre/equipment_laboratory.webp',
      'assets/images/edu-clinic-ready-thumb.webp',
      'assets/images/program-clinic-ready.webp'
    ]
  };

  const trackKey = (program && program.track) ? program.track : 'fresh-graduates';
  const list = trackImages[trackKey] || trackImages['fresh-graduates'];
  let hash = 0;
  const key = ((program && (program.id || program.title)) || '') + ((program && program.grade) || '');
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % list.length;
  return list[index];
}
window.getProgramImage = getProgramImage;

window.VETNOVA_PROGRAMS_DATA = [
  // ==================== GENUINE CLINICAL PROGRAMS (DEMOS PURGED) ====================
  {
    id: "real-skill-up",
    title: "Veterinary Skill-Up Program",
    slug: "veterinary-skill-up",
    grade: 1,
    gradeCode: "grade-1",
    gradeName: "Basic",
    gradeLabel: "Grade 1 — Basic",
    track: "fresh-graduates",
    trackName: "Fresh Graduates & Interns",
    trackLabel: "Fresh Graduates & Interns",
    description: "Comprehensive 4-week clinical mastery module covering soft tissue surgery, digital radiology, abdominal ultrasound, and emergency triage.",
    status: "Admissions Open",
    isDemo: false,
    url: "veterinary-skill-up.html?grade=grade-1",
    deliveryMode: "offline",
    price: "₹38,000 + GST",
    duration: "4 Weeks (120+ Hrs)",
    image: "assets/images/programs/program-skill-up.webp"
  },
  {
    id: "real-first-aid",
    title: "Pet Emergency First Aid Workshop",
    slug: "emergency-medicine",
    grade: 1,
    gradeCode: "grade-1",
    gradeName: "Basic",
    gradeLabel: "Grade 1 — Basic",
    track: "emergency-care",
    trackName: "Emergency & Critical Care",
    trackLabel: "Emergency & Critical Care",
    description: "Designed for pet parents, rescuers, and clinic staff to stabilize pets during life-threatening choking, bleeding, or heat stroke emergencies.",
    status: "Admissions Open",
    isDemo: false,
    url: "emergency-medicine.html?grade=grade-1",
    deliveryMode: "workshop",
    price: "₹3,500 + GST",
    duration: "1 Day Workshop",
    image: "assets/images/programs/program-first-aid.webp"
  },
  {
    id: "real-vet-nurse",
    title: "Vet Nurse Foundation Certificate",
    slug: "vet-nurse-programme",
    grade: 1,
    gradeCode: "grade-1",
    gradeName: "Basic",
    gradeLabel: "Grade 1 — Basic",
    track: "vet-nurse",
    trackName: "Vet Nurse & Paravet Staff",
    trackLabel: "Vet Nurse & Paravet Staff",
    description: "Foundational practical training for clinic assistants and paravet staff covering animal restraint and sterile OR scrub prep.",
    status: "Admissions Open",
    isDemo: false,
    url: "vet-nurse-programme.html?grade=grade-1",
    deliveryMode: "offline",
    price: "₹9,500 + GST",
    duration: "2 Weeks",
    image: "assets/images/programs/program-nurse.webp"
  },
  {
    id: "real-soft-tissue-surgery",
    title: "Soft Tissue Surgery Track",
    slug: "soft-tissue-surgery",
    grade: 2,
    gradeCode: "grade-2",
    gradeName: "Intermediate",
    gradeLabel: "Grade 2 — Intermediate",
    track: "practicing-vets",
    trackName: "Practicing Veterinarians",
    trackLabel: "Practicing Veterinarians",
    description: "Intensive hands-on procedural workshop covering sterile OR setup, tissue handling, suture patterns, spay/neuter, and cystotomy.",
    status: "Admissions Open",
    isDemo: false,
    url: "soft-tissue-surgery.html?grade=grade-2",
    deliveryMode: "offline",
    price: "₹18,500 + GST",
    duration: "1 Week",
    image: "assets/images/programs/program-surgery.webp"
  },
  {
    id: "real-radiology-ultrasound",
    title: "Radiology & Ultrasound Masterclass",
    slug: "radiology-ultrasound",
    grade: 2,
    gradeCode: "grade-2",
    gradeName: "Intermediate",
    gradeLabel: "Grade 2 — Intermediate",
    track: "diagnostic-specialization",
    trackName: "Diagnostic Specialization",
    trackLabel: "Diagnostic Specialization",
    description: "Systematic abdominal & thoracic radiograph interpretation alongside hands-on abdominal ultrasound probe handling and FAST scanning.",
    status: "Admissions Open",
    isDemo: false,
    url: "radiology-ultrasound.html?grade=grade-2",
    deliveryMode: "offline",
    price: "₹16,000 + GST",
    duration: "1 Week",
    image: "assets/images/programs/program-radiology.webp"
  },
  {
    id: "real-emergency-medicine",
    title: "Pet Emergency & Critical Care",
    slug: "emergency-medicine",
    grade: 3,
    gradeCode: "grade-3",
    gradeName: "Competitive",
    gradeLabel: "Grade 3 — Competitive",
    track: "emergency-care",
    trackName: "Emergency & Critical Care",
    trackLabel: "Emergency & Critical Care",
    description: "Handling shock, toxic ingestion, cardiac arrest, fluid resuscitation, and multiparameter vitals monitoring.",
    status: "Admissions Open",
    isDemo: false,
    url: "emergency-medicine.html?grade=grade-3",
    deliveryMode: "offline",
    price: "₹12,500 + GST",
    duration: "3 Days",
    image: "assets/images/programs/program-emergency.webp"
  }
];

/* Realtime Learning Level & Track Program Filter Controller */
function initProgramFilters() {
  const searchInput = document.getElementById('program-search-input');
  const levelSelect = document.getElementById('filter-level') || document.getElementById('filter-grade');
  const trackSelect = document.getElementById('filter-track') || document.getElementById('filter-topic');
  const modeSelect = document.getElementById('filter-mode');
  const dynamicContainer = document.getElementById('programs-dynamic-grid');
  const noResultsState = document.getElementById('no-programs-match');
  const clearFiltersBtn = document.getElementById('btn-clear-filters');
  const levelCards = document.querySelectorAll('.level-card[data-level], .grade-card[data-level]');
  const levelPills = document.querySelectorAll('.level-pill[data-level]');
  const selectedLevelTitle = document.getElementById('selected-level-title') || document.getElementById('selected-grade-title');
  const personaBanner = document.getElementById('persona-discovery-banner');
  const personaCloseBtn = document.getElementById('persona-banner-reset');
  const countNumberEl = document.getElementById('count-number');
  const loadMoreContainer = document.getElementById('load-more-container');
  const loadMoreBtn = document.getElementById('btn-load-more-programs');
  const showingCurrentEl = document.getElementById('showing-count-current');
  const showingTotalEl = document.getElementById('showing-count-total');

  // Pagination Configuration: Initial 6 programs visible
  const PROGRAMS_PAGE_SIZE = 6;
  let visibleLimit = PROGRAMS_PAGE_SIZE;
  let currentFilteredPrograms = [];

  if (!dynamicContainer && !levelSelect && !trackSelect) return;

  const levelNameMap = {
    'all': 'All Programs',
    'foundation': 'Foundation Level',
    'intermediate': 'Intermediate Level',
    'advanced': 'Advanced Level'
  };

  const trackNameMap = {
    'all': 'All Disciplines',
    'surgery': 'Surgery & Orthopaedics',
    'medicine': 'Internal & Specialized Medicine',
    'diagnostics': 'Diagnostics & Imaging',
    'emergency': 'Emergency & Critical Care',
    'fresh-graduates': 'Fresh Graduates & Interns',
    'practicing-vets': 'Practicing Veterinarians',
    'vet-nurse': 'Vet Nurse & Paravet Staff'
  };

  function updateUrlParam(level) {
    try {
      const url = new URL(window.location);
      if (level && level !== 'all') {
        url.searchParams.set('level', level);
        url.searchParams.delete('grade');
      } else {
        url.searchParams.delete('level');
        url.searchParams.delete('grade');
      }
      window.history.replaceState({}, '', url);
    } catch (e) {
      // Fallback
    }
  }

  function filterPrograms(resetPagination = true) {
    if (resetPagination) {
      visibleLimit = PROGRAMS_PAGE_SIZE;
    }
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let rawLevel = levelSelect ? levelSelect.value.toLowerCase().trim() : 'all';
    // Fallback if legacy grade was passed
    if (rawLevel === 'grade-1') rawLevel = 'foundation';
    else if (rawLevel === 'grade-2' || rawLevel === 'grade-3') rawLevel = 'intermediate';
    else if (rawLevel === 'grade-4' || rawLevel === 'grade-5') rawLevel = 'advanced';

    const levelFilter = ['foundation', 'intermediate', 'advanced'].includes(rawLevel) ? rawLevel : 'all';
    const trackFilter = trackSelect ? trackSelect.value : 'all';
    const modeFilter = modeSelect ? modeSelect.value : 'all';

    // Sync Level Card UI state
    levelCards.forEach(lCard => {
      const lVal = lCard.dataset.level;
      if (lVal === levelFilter && levelFilter !== 'all') {
        lCard.classList.add('active');
      } else {
        lCard.classList.remove('active');
      }
    });

    // Sync Level Pills UI state
    levelPills.forEach(lPill => {
      const lVal = lPill.dataset.level;
      if (lVal === levelFilter) {
        lPill.classList.add('active');
      } else {
        lPill.classList.remove('active');
      }
    });

    // Sync Level Select UI state
    if (levelSelect && levelSelect.value !== levelFilter) {
      levelSelect.value = levelFilter;
    }

    // Update Level Selector title text
    if (selectedLevelTitle) {
      const lLabel = levelNameMap[levelFilter] || 'All Programs';
      const tLabel = trackNameMap[trackFilter] || 'All Disciplines';
      selectedLevelTitle.innerHTML = `Active Filter: <strong>${lLabel}</strong> ${trackFilter !== 'all' ? '&bull; ' + tLabel : ''}`;
    }

    // Update Persona Adaptive Messaging Banner
    if (personaBanner) {
      const badgeText = document.getElementById('persona-badge-text');
      const titleText = document.getElementById('persona-title-text');
      const messageText = document.getElementById('persona-message-text');

      if (levelFilter !== 'all' || trackFilter !== 'all' || modeFilter !== 'all' || query !== '') {
        personaBanner.style.display = 'flex';
        const lName = levelNameMap[levelFilter] || '';
        const tName = trackNameMap[trackFilter] || '';
        if (badgeText) badgeText.textContent = 'Curriculum Level Pathway';
        if (titleText) {
          if (levelFilter !== 'all' && trackFilter !== 'all') {
            titleText.textContent = `${lName} • ${tName}`;
          } else if (levelFilter !== 'all') {
            titleText.textContent = `${lName} Selected`;
          } else if (trackFilter !== 'all') {
            titleText.textContent = `${tName} Selected`;
          } else {
            titleText.textContent = `Search: "${query}"`;
          }
        }
        if (messageText) {
          if (levelFilter === 'foundation') {
            messageText.textContent = 'Showing essential clinical examinations, diagnostic fundamentals, and core practical techniques across all programs.';
          } else if (levelFilter === 'intermediate') {
            messageText.textContent = 'Showing clinical decision-making, case management, routine surgery, and intermediate diagnostic interpretation.';
          } else if (levelFilter === 'advanced') {
            messageText.textContent = 'Showing complex multisystem case management, specialist procedures, advanced surgical interventions, and clinical audits.';
          } else {
            messageText.textContent = 'Exploring all 28 accredited veterinary clinical programs and workshops.';
          }
        }
      } else {
        personaBanner.style.display = 'none';
      }
    }

    // Source dataset: all 28 programs
    const sourceList = (window.VETNOVA_28_PROGRAMS && window.VETNOVA_28_PROGRAMS.length >= 28)
      ? window.VETNOVA_28_PROGRAMS
      : (window.VETNOVA_PROGRAMS_DATA || []);

    const matched = sourceList.filter(p => {
      // 1. Text Search matching
      const matchesQuery = query === "" ||
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.slug && p.slug.toLowerCase().includes(query));

      // 2. Discipline / Category / Track Filter
      let matchesTrack = true;
      if (trackFilter !== "all") {
        const cat = (p.category || "").toLowerCase();
        const trk = (p.track || "").toLowerCase();
        if (trackFilter === "surgery") {
          matchesTrack = cat.includes("surgery") || trk.includes("surgery") || cat.includes("orthopaedic");
        } else if (trackFilter === "medicine" || trackFilter === "internal-medicine") {
          matchesTrack = cat.includes("medicine") || cat.includes("dermatology") || cat.includes("cardiology") || cat.includes("neurology") || cat.includes("oncology") || cat.includes("endocrinology") || cat.includes("nephrology") || cat.includes("gastroenterology");
        } else if (trackFilter === "diagnostics" || trackFilter === "diagnostic-specialization") {
          matchesTrack = cat.includes("diagnostic") || cat.includes("imaging") || cat.includes("pathology") || cat.includes("microbiology") || cat.includes("laboratory");
        } else if (trackFilter === "emergency" || trackFilter === "emergency-care") {
          matchesTrack = cat.includes("emergency") || cat.includes("critical") || cat.includes("anaesthesia");
        } else {
          matchesTrack = cat.includes(trackFilter.toLowerCase()) || trk.includes(trackFilter.toLowerCase());
        }
      }

      // 3. Delivery Mode Filter
      let matchesMode = true;
      if (modeFilter !== "all") {
        if (p.deliveryMode) {
          matchesMode = p.deliveryMode === modeFilter;
        }
      }

      return matchesQuery && matchesTrack && matchesMode;
    });

    // Store current filtered list for Load More pagination
    currentFilteredPrograms = matched;

    // Dynamic Program Count Update - Always reflects TOTAL matching programs
    if (countNumberEl) {
      countNumberEl.textContent = matched.length;
    }

    // Render cards with incremental Load More pagination (max 6 initially)
    if (noResultsState && dynamicContainer) {
      if (matched.length === 0) {
        noResultsState.style.display = "block";
        dynamicContainer.style.display = "none";
        dynamicContainer.innerHTML = "";
        if (loadMoreContainer) {
          loadMoreContainer.style.display = "none";
        }
      } else {
        noResultsState.style.display = "none";
        dynamicContainer.style.display = "grid";

        // Slice to display up to visibleLimit programs (first 6 initially)
        const visiblePrograms = matched.slice(0, visibleLimit);

        dynamicContainer.innerHTML = visiblePrograms.map((p, idx) => {
          const orderNum = p.order || (idx + 1);
          const hasSyllabus = p.syllabusStatus === "Available";
          const programTitle = (p.title || "").replace(/^#?\d+[\.\s\-#]+\s*/, "");
          const categoryBadge = (p.category || "Clinical Track").replace(/^#?\d+[\s\-\•\.\:]+\s*/, "");

          const pImg = p.image || "assets/images/programs/program-skill-up.webp";
          const progUrl = p.slug ? `${p.slug}.html` : (p.url || `programs-single.html?slug=${p.slug}`);

          // Determine Level Specific URL, Action Text & Content
          let viewSyllabusUrl = progUrl;
          let viewSyllabusText = "Syllabus";
          let stageContentHTML = "";
          let topBadgeHTML = "";
          let levelBadgesHTML = "";

          const syllabusFoundation = (p.syllabus && p.syllabus.foundation) || [];
          const syllabusIntermediate = (p.syllabus && p.syllabus.intermediate) || [];
          const syllabusAdvanced = (p.syllabus && p.syllabus.advanced) || [];

          if (levelFilter === 'foundation') {
            viewSyllabusUrl = `${progUrl}?level=foundation#curriculum`;
            viewSyllabusText = "Syllabus";
            topBadgeHTML = `<span class="badge-grade-pill badge-pill-foundation"><i class="fa-solid fa-seedling"></i> Foundation Stage</span>`;

            levelBadgesHTML = `
              <div class="card-level-badges">
                <span class="level-badge badge-foundation active"><i class="fa-solid fa-check"></i> Foundation Active</span>
                <span class="level-badge badge-intermediate muted">Intermediate</span>
                <span class="level-badge badge-advanced muted">Advanced</span>
              </div>
            `;

            if (syllabusFoundation.length > 0) {
              const previewTopics = syllabusFoundation.slice(0, 3);
              const remainingCount = syllabusFoundation.length - previewTopics.length;
              stageContentHTML = `
                <div class="card-stage-content-box stage-box-foundation">
                  <div class="stage-content-head"><i class="fa-solid fa-stethoscope"></i> <strong>Foundation Modules:</strong></div>
                  <ul class="stage-topics-list">
                    ${previewTopics.map(t => `<li><i class="fa-solid fa-angle-right"></i> <span>${t}</span></li>`).join('')}
                  </ul>
                  ${remainingCount > 0 ? `<span class="stage-more-topics">+${remainingCount} more foundation clinical topics in syllabus</span>` : ''}
                </div>
              `;
            } else {
              stageContentHTML = `
                <div class="card-stage-content-box stage-box-foundation">
                  <div class="stage-content-head"><i class="fa-solid fa-stethoscope"></i> <strong>Foundation Training Stage:</strong></div>
                  <p class="stage-content-desc">Essential clinical examination, basic diagnostics, safety protocols, and primary procedural techniques for ${programTitle}.</p>
                </div>
              `;
            }
          } else if (levelFilter === 'intermediate') {
            viewSyllabusUrl = `${progUrl}?level=intermediate#curriculum`;
            viewSyllabusText = "Syllabus";
            topBadgeHTML = `<span class="badge-grade-pill badge-pill-intermediate"><i class="fa-solid fa-chart-line"></i> Intermediate Stage</span>`;

            levelBadgesHTML = `
              <div class="card-level-badges">
                <span class="level-badge badge-foundation muted">Foundation</span>
                <span class="level-badge badge-intermediate active"><i class="fa-solid fa-check"></i> Intermediate Active</span>
                <span class="level-badge badge-advanced muted">Advanced</span>
              </div>
            `;

            if (syllabusIntermediate.length > 0) {
              const previewTopics = syllabusIntermediate.slice(0, 3);
              const remainingCount = syllabusIntermediate.length - previewTopics.length;
              stageContentHTML = `
                <div class="card-stage-content-box stage-box-intermediate">
                  <div class="stage-content-head"><i class="fa-solid fa-user-doctor"></i> <strong>Intermediate Modules:</strong></div>
                  <ul class="stage-topics-list">
                    ${previewTopics.map(t => `<li><i class="fa-solid fa-angle-right"></i> <span>${t}</span></li>`).join('')}
                  </ul>
                  ${remainingCount > 0 ? `<span class="stage-more-topics">+${remainingCount} more intermediate clinical topics in syllabus</span>` : ''}
                </div>
              `;
            } else {
              stageContentHTML = `
                <div class="card-stage-content-box stage-box-intermediate">
                  <div class="stage-content-head"><i class="fa-solid fa-user-doctor"></i> <strong>Intermediate Training Stage:</strong></div>
                  <p class="stage-content-desc">Clinical decision-making, case management, routine surgery, and intermediate diagnostic interpretation for ${programTitle}.</p>
                </div>
              `;
            }
          } else if (levelFilter === 'advanced') {
            viewSyllabusUrl = `${progUrl}?level=advanced#curriculum`;
            viewSyllabusText = "Syllabus";
            topBadgeHTML = `<span class="badge-grade-pill badge-pill-advanced"><i class="fa-solid fa-award"></i> Advanced Stage</span>`;

            levelBadgesHTML = `
              <div class="card-level-badges">
                <span class="level-badge badge-foundation muted">Foundation</span>
                <span class="level-badge badge-intermediate muted">Intermediate</span>
                <span class="level-badge badge-advanced active"><i class="fa-solid fa-check"></i> Advanced Active</span>
              </div>
            `;

            if (syllabusAdvanced.length > 0) {
              const previewTopics = syllabusAdvanced.slice(0, 3);
              const remainingCount = syllabusAdvanced.length - previewTopics.length;
              stageContentHTML = `
                <div class="card-stage-content-box stage-box-advanced">
                  <div class="stage-content-head"><i class="fa-solid fa-brain"></i> <strong>Advanced Modules:</strong></div>
                  <ul class="stage-topics-list">
                    ${previewTopics.map(t => `<li><i class="fa-solid fa-angle-right"></i> <span>${t}</span></li>`).join('')}
                  </ul>
                  ${remainingCount > 0 ? `<span class="stage-more-topics">+${remainingCount} more advanced specialist topics in syllabus</span>` : ''}
                </div>
              `;
            } else {
              stageContentHTML = `
                <div class="card-stage-content-box stage-box-advanced">
                  <div class="stage-content-head"><i class="fa-solid fa-brain"></i> <strong>Advanced Training Stage:</strong></div>
                  <p class="stage-content-desc">Specialist clinical interventions, complex multisystem cases, advanced surgical complications, and evidence-based practice for ${programTitle}.</p>
                </div>
              `;
            }
          } else {
            // 'all' Levels
            viewSyllabusUrl = progUrl;
            viewSyllabusText = "Syllabus";
            topBadgeHTML = hasSyllabus
              ? `<span class="badge-grade-pill" style="background:#1e7e44;color:#fff;"><i class="fa-solid fa-circle-check"></i> Three-Stage Syllabus</span>`
              : `<span class="badge-grade-pill" style="background:#b87314;color:#fff;"><i class="fa-solid fa-clock"></i> Syllabus in Review</span>`;

            levelBadgesHTML = `
              <div class="card-level-badges">
                <span class="level-badge badge-foundation"><i class="fa-solid fa-seedling"></i> Foundation</span>
                <span class="level-badge badge-intermediate"><i class="fa-solid fa-chart-line"></i> Intermediate</span>
                <span class="level-badge badge-advanced"><i class="fa-solid fa-award"></i> Advanced</span>
              </div>
            `;
          }

          const enquireContext = levelFilter !== 'all'
            ? `${programTitle} (${levelNameMap[levelFilter]})`
            : programTitle;

          return `
            <div class="program-card" data-order="${orderNum}" data-slug="${p.slug || ""}" data-category="${p.category || ""}">
              <div class="program-card-media" style="position: relative;">
                <div class="card-grade-badge-wrap" style="position: absolute; top: 12px; left: 12px; z-index: 2;">
                  <span class="badge-grade-pill" style="background: rgba(15, 45, 74, 0.9); color: #fff;">${categoryBadge}</span>
                </div>
                <div style="position: absolute; top: 12px; right: 12px; z-index: 2;">
                  ${topBadgeHTML}
                </div>
                <img src="${pImg}" alt="${programTitle}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='assets/images/programs/program-skill-up.webp';" />
              </div>
              <div class="program-card-body">
                ${levelBadgesHTML}
                <h3 class="program-card-title"><a href="${viewSyllabusUrl}">${programTitle}</a></h3>
                <p class="program-card-desc">${p.description || ""}</p>
                ${stageContentHTML}
                <div class="program-card-meta" style="margin-top: 12px; font-size: 0.84rem; color: #475569; display: flex; flex-wrap: wrap; gap: 12px;">
                  <div class="meta-item"><i class="fa-solid fa-clock text-teal"></i> ${p.duration || "2 to 4 Weeks"}</div>
                  <div class="meta-item"><i class="fa-solid fa-hospital text-teal"></i> Offline Vet Lab</div>
                </div>
                <div class="program-card-footer">
                  <div class="program-card-price-row">
                    <span class="program-card-price-tag" style="color: var(--teal); font-weight: 700;">
                      <i class="fa-solid fa-award"></i> Practical Certificate
                    </span>
                  </div>
                  <div class="program-card-actions">
                    <a class="btn btn-outline btn-sm" href="${viewSyllabusUrl}">${viewSyllabusText} <i class="fa-solid fa-arrow-right"></i></a>
                    <a href="contact.html?program=${encodeURIComponent(p.slug || p.id || programTitle)}#contact-form" class="btn btn-primary btn-sm">Enquire Now</a>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join("");

        // Manage Load More button visibility and showing status
        if (loadMoreContainer) {
          if (visibleLimit < matched.length) {
            loadMoreContainer.style.display = "flex";
            if (showingCurrentEl) showingCurrentEl.textContent = visiblePrograms.length;
            if (showingTotalEl) showingTotalEl.textContent = matched.length;
          } else {
            loadMoreContainer.style.display = "none";
          }
        }
      }
    }

    updateRelatedPrograms(trackFilter);
  }

  function resetAllFilters() {
    if (searchInput) searchInput.value = '';
    if (levelSelect) levelSelect.value = 'all';
    if (trackSelect) trackSelect.value = 'all';
    if (modeSelect) modeSelect.value = 'all';
    if (personaBanner) personaBanner.style.display = 'none';
    levelCards.forEach(c => c.classList.remove('active'));
    levelPills.forEach(p => {
      if (p.dataset.level === 'all') p.classList.add('active');
      else p.classList.remove('active');
    });
    updateUrlParam('all');
    filterPrograms(true);
  }

  // Bind Load More button handler
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      if (visibleLimit < currentFilteredPrograms.length) {
        const prevCount = visibleLimit;
        visibleLimit += PROGRAMS_PAGE_SIZE;
        filterPrograms(false); // keep previously displayed cards, reveal next chunk

        // Keyboard accessibility: gently move focus to first newly revealed card without layout jump
        const allCards = dynamicContainer.querySelectorAll('.program-card');
        if (allCards && allCards[prevCount]) {
          const firstNewLink = allCards[prevCount].querySelector('.program-card-title a') || allCards[prevCount];
          if (firstNewLink) {
            firstNewLink.setAttribute('tabindex', '-1');
            firstNewLink.focus({ preventScroll: true });
          }
        }
      }
    });
  }

  // Bind Event Listeners (all reset pagination to initial 6)
  if (searchInput) searchInput.addEventListener('input', () => filterPrograms(true));
  if (levelSelect) {
    levelSelect.addEventListener('change', () => {
      updateUrlParam(levelSelect.value);
      filterPrograms(true);
    });
  }
  if (trackSelect) trackSelect.addEventListener('change', () => filterPrograms(true));
  if (modeSelect) modeSelect.addEventListener('change', () => filterPrograms(true));
  if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', resetAllFilters);
  if (personaCloseBtn) personaCloseBtn.addEventListener('click', resetAllFilters);

  // Level Card Click Handlers
  levelCards.forEach(lCard => {
    lCard.addEventListener('click', () => {
      const selectedL = lCard.dataset.level || lCard.dataset.grade;
      let targetLevel = selectedL;
      if (selectedL === 'grade-1') targetLevel = 'foundation';
      else if (selectedL === 'grade-2') targetLevel = 'intermediate';
      else if (selectedL === 'grade-3' || selectedL === 'grade-4' || selectedL === 'grade-5') targetLevel = 'advanced';

      if (levelSelect) {
        if (levelSelect.value === targetLevel) {
          levelSelect.value = 'all';
        } else {
          levelSelect.value = targetLevel;
        }
        updateUrlParam(levelSelect.value);
        filterPrograms();
      }
    });
  });

  // Level Pill Click Handlers
  levelPills.forEach(lPill => {
    lPill.addEventListener('click', () => {
      const selectedL = lPill.dataset.level;
      if (levelSelect) {
        levelSelect.value = selectedL;
        updateUrlParam(selectedL);
        filterPrograms();
      }
    });
  });

  // URL Parameter auto-selection
  const urlParams = new URLSearchParams(window.location.search);
  let paramTriggered = false;
  if (urlParams.has('level') && levelSelect) {
    const lvl = urlParams.get('level').toLowerCase().trim();
    if (['foundation', 'intermediate', 'advanced', 'all'].includes(lvl)) {
      levelSelect.value = lvl;
      paramTriggered = true;
    }
  } else if (urlParams.has('grade') && levelSelect) {
    const grd = urlParams.get('grade').toLowerCase();
    if (grd.includes('1') || grd.includes('basic')) levelSelect.value = 'foundation';
    else if (grd.includes('2') || grd.includes('intermediate')) levelSelect.value = 'intermediate';
    else if (grd.includes('3') || grd.includes('4') || grd.includes('5') || grd.includes('advanced')) levelSelect.value = 'advanced';
    paramTriggered = true;
  }

  if (urlParams.has('track') && trackSelect) {
    trackSelect.value = urlParams.get('track');
    paramTriggered = true;
  }

  // Initial Execution
  filterPrograms();

  if (paramTriggered) {
    const filterSec = document.getElementById('choose-learning-level') || document.getElementById('choose-learning-grade') || document.getElementById('all-programs');
    if (filterSec) {
      setTimeout(() => {
        filterSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }
}

/* Single Program Page Learning Level Context Representation */
function initSingleProgramGradeRepresentation() {
  const urlParams = new URLSearchParams(window.location.search);
  const levelParam = urlParams.get('level') || (urlParams.get('grade') ? (urlParams.get('grade').includes('1') ? 'foundation' : urlParams.get('grade').includes('2') ? 'intermediate' : 'advanced') : null);
  if (!levelParam) return;

  const levelLabels = {
    'foundation': 'Foundation Level',
    'intermediate': 'Intermediate Level',
    'advanced': 'Advanced Level'
  };

  const lLabel = levelLabels[levelParam];
  if (!lLabel) return;

  const heroBreadcrumb = document.querySelector('.breadcrumb');
  if (heroBreadcrumb) {
    const spanEl = heroBreadcrumb.querySelector('span:last-child');
    if (spanEl) {
      spanEl.innerHTML = `<a href="programs.html?level=${levelParam}" style="color: inherit; text-decoration: underline;">${lLabel}</a> &rsaquo; ${spanEl.textContent}`;
    }
  }

  const eyebrow = document.querySelector('.program-hero .eyebrow, .page-hero .eyebrow');
  if (eyebrow) {
    eyebrow.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> ${lLabel.toUpperCase()} &bull; ${eyebrow.textContent}`;
  }

  const stageRow = document.querySelector(`.syllabus-stage-row.stage-${levelParam}`);
  if (stageRow) {
    stageRow.style.boxShadow = '0 0 0 2px var(--teal, #12C7C1), 0 8px 24px rgba(18, 199, 193, 0.15)';
    stageRow.style.borderRadius = '12px';
  }
}

function updateRelatedPrograms(activeTrack) {
  const relatedGrid = document.getElementById('related-programs-grid');
  if (!relatedGrid) return;

  const allRelatedCards = [
    {
      track: 'practicing-vets',
      badge: 'PRACTICING VETS TRACK',
      title: 'Soft Tissue Surgery Track',
      desc: 'Intensive surgical workshop covering sterile setup, tissue handling, and suture patterns.',
      price: '₹18,500',
      href: 'soft-tissue-surgery.html?grade=grade-2',
      img: 'assets/images/programs/program-surgery.webp'
    },
    {
      track: 'diagnostic-specialization',
      badge: 'DIAGNOSTIC SPECIALIZATION',
      title: 'Radiology & Ultrasound Masterclass',
      desc: 'Radiograph reading & hands-on abdominal ultrasound FAST scanning.',
      price: '₹16,000',
      href: 'radiology-ultrasound.html?grade=grade-2',
      img: 'assets/images/programs/program-radiology.webp'
    },
    {
      track: 'emergency-care',
      badge: 'EMERGENCY & CRITICAL CARE',
      title: 'Pet Emergency & Critical Care',
      desc: 'Handling shock, toxic ingestion, cardiac arrest, fluid resuscitation, and triage.',
      price: '₹12,500',
      href: 'emergency-medicine.html?grade=grade-3',
      img: 'assets/images/programs/program-emergency.webp'
    },
    {
      track: 'fresh-graduates',
      badge: 'FRESH GRADUATES TRACK',
      title: 'Veterinary Skill-Up Program',
      desc: 'Comprehensive 4-week clinical mastery covering surgery, X-ray, ultrasound, and ICU.',
      price: '₹38,000',
      href: 'veterinary-skill-up.html?grade=grade-1',
      img: 'assets/images/programs/program-skill-up.webp'
    },
    {
      track: 'vet-nurse',
      badge: 'VET NURSE TRACK',
      title: 'Vet Nurse Foundation Certificate',
      desc: 'Foundational practical training for clinic assistants and paravet staff.',
      price: '₹9,500',
      href: 'vet-nurse-programme.html?grade=grade-1',
      img: 'assets/images/programs/program-nurse.webp'
    }
  ];

  const itemsToDisplay = allRelatedCards.filter(item => item.track !== activeTrack).slice(0, 3);

  relatedGrid.innerHTML = itemsToDisplay.map(item => `
    <div class="program-card related-card" data-track="${item.track}" onclick="window.location.href='${item.href}';">
      <div class="program-card-media">
        <span class="program-card-badge ${item.track === 'emergency-care' ? 'emergency' : ''}">${item.badge}</span>
        <img src="${item.img}" alt="${item.title}" loading="lazy" decoding="async" />
      </div>
      <div class="program-card-body">
        <h3 class="program-card-title"><a href="${item.href}">${item.title}</a></h3>
        <p class="program-card-desc">${item.desc}</p>
        <div class="program-card-footer">
          <div class="program-card-price">${item.price} <small>+ GST</small></div>
          <a class="btn btn-outline btn-sm" href="${item.href}">View Program <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   14. FAQ Realtime Live Search Controller
   ========================================================================== */
function initFaqSearch() {
  const searchInput = document.getElementById('faq-search-input');
  const faqItems = document.querySelectorAll('.faq-item');
  const noResultsMsg = document.getElementById('faq-no-results');

  if (!searchInput || !faqItems.length) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question span') ? item.querySelector('.faq-question span').textContent.toLowerCase() : '';
      const answer = item.querySelector('.faq-answer') ? item.querySelector('.faq-answer').textContent.toLowerCase() : '';

      if (query === '' || question.includes(query) || answer.includes(query)) {
        item.style.display = 'block';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      if (visibleCount === 0 && query !== '') {
        noResultsMsg.style.display = 'block';
      } else {
        noResultsMsg.style.display = 'none';
      }
    }
  });
}

/* ==========================================================================
   Popular Courses Category Filter Controller (100% Isolated)
   ========================================================================== */
function initPopularCoursesFilter() {
  const pills = document.querySelectorAll('.popular-course-filter-pill');
  const cards = document.querySelectorAll('.popular-course-card:not(.v2-feature-program)');

  if (!pills.length || !cards.length) return;

  const MAX_CARDS = 4;

  function filterCards(filter) {
    let matched = 0;
    cards.forEach(card => {
      if (card._filterTimeout) {
        clearTimeout(card._filterTimeout);
        card._filterTimeout = null;
      }

      const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
      const matches = (filter === 'all' || categories.includes(filter));

      if (matches && matched < MAX_CARDS) {
        matched++;
        card.style.display = 'flex';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        card._filterTimeout = setTimeout(() => {
          if (card.style.opacity === '0') {
            card.style.display = 'none';
          }
          card._filterTimeout = null;
        }, 300);
      }
    });
  }

  // Enforce initial 4-card display limit on page load
  const activePill = document.querySelector('.popular-course-filter-pill.active');
  const initialFilter = activePill ? (activePill.dataset.filter || 'all') : 'all';
  filterCards(initialFilter);

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter || 'all';
      filterCards(filter);
    });
  });
}

/* ==========================================================================
   Practical Training Batches Tab Controller (Unified Section)
   ========================================================================== */
function initBatchTabs() {
  const tabButtons = document.querySelectorAll('.batch-tab-btn');
  const tabPanels = document.querySelectorAll('.batch-tab-panel');

  if (!tabButtons.length || !tabPanels.length) return;

  function switchTab(targetId) {
    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute('aria-controls') === targetId || btn.id === targetId;
      if (isTarget) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      }
    });

    tabPanels.forEach(panel => {
      if (panel.id === targetId || panel.getAttribute('aria-labelledby') === targetId) {
        panel.style.display = 'block';
        requestAnimationFrame(() => {
          panel.classList.add('active');
          panel.style.opacity = '1';
          panel.style.transform = 'translateY(0)';
          if (typeof window.getVetNovaLanguage === 'function' && window.getVetNovaLanguage() === 'hi') {
            window.setVetNovaLanguage('hi');
          }
        });
      } else {
        panel.classList.remove('active');
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(6px)';
        setTimeout(() => {
          if (!panel.classList.contains('active')) {
            panel.style.display = 'none';
          }
        }, 200);
      }
    });
  }

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const targetPanelId = btn.getAttribute('aria-controls');
      switchTab(targetPanelId);
    });

    // Keyboard navigation (ArrowLeft / ArrowRight / Home / End)
    btn.addEventListener('keydown', (e) => {
      let targetIndex = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetIndex = (index + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIndex = tabButtons.length - 1;
      }

      if (targetIndex !== -1) {
        tabButtons[targetIndex].focus();
        const targetPanelId = tabButtons[targetIndex].getAttribute('aria-controls');
        switchTab(targetPanelId);
      }
    });
  });

  // In-tab button switchers (e.g. View Upcoming Batches inside Ongoing Batches tab)
  document.addEventListener('click', (e) => {
    const switchBtn = e.target.closest('.btn-switch-upcoming, [data-switch-tab]');
    if (switchBtn) {
      e.preventDefault();
      const targetPanelId = switchBtn.dataset.switchTab || 'panel-upcoming-batches';
      switchTab(targetPanelId);
      const targetSec = document.getElementById('practical-batches') || document.getElementById('upcoming-batches');
      if (targetSec) {
        const top = targetSec.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });

  // Handle URL hash if user navigated directly to #ongoing-batches or #upcoming-batches
  function handleBatchHash() {
    if (window.location.hash === '#ongoing-batches') {
      switchTab('panel-ongoing-batches');
    } else if (window.location.hash === '#upcoming-batches') {
      switchTab('panel-upcoming-batches');
    }
  }

  handleBatchHash();
  window.addEventListener('hashchange', handleBatchHash);
}

/* ==========================================================================
   Single-Focus Interactive Clinical Journey Manager
   ========================================================================== */
function initSingleFocusJourney() {
  if (window.__jmInitialized) return;

  const section = document.getElementById('bento-explorer-strip') ||
    document.querySelector('.bento-explorer-strip') ||
    document.querySelector('.quick-strip.bento-explorer-strip');

  if (!section) {
    return;
  }

  window.__jmInitialized = true;

  // Cached Selector Fallbacks
  const milestoneNodes = section.querySelectorAll('.jm-step, .jm-milestone-node, [data-step]');
  const progLabels = section.querySelectorAll('.jm-prog-label');
  const singleCard = section.querySelector('.jm-single-card, .jm-featured-card, .jm-single-featured-wrap');

  const cardImg = singleCard ? (singleCard.querySelector('.jm-image, img[data-journey-image], #jm-card-img') || singleCard.querySelector('img')) : null;
  const cardBadge = singleCard ? (singleCard.querySelector('.jm-badge, #jm-card-badge') || singleCard.querySelector('.jm-card-badge')) : null;
  const cardStepNum = singleCard ? (singleCard.querySelector('#jm-card-step-num, .jm-card-step-num')) : null;
  const cardDuration = singleCard ? (singleCard.querySelector('#jm-card-duration, .jm-pill-duration')) : null;
  const cardLevel = singleCard ? (singleCard.querySelector('#jm-card-level, .jm-pill-level')) : null;
  const cardTitle = singleCard ? (singleCard.querySelector('.jm-title, #jm-card-title') || singleCard.querySelector('h3, h4')) : null;
  const cardSubtitle = singleCard ? singleCard.querySelector('.jm-subtitle') : null;
  const cardDesc = singleCard ? (singleCard.querySelector('.jm-description, #jm-card-desc') || singleCard.querySelector('.jm-card-desc')) : null;
  const cardHighlights = singleCard ? (singleCard.querySelector('.jm-highlights, #jm-card-highlights') || singleCard.querySelector('.jm-card-highlights')) : null;
  const cardCta = singleCard ? (singleCard.querySelector('.jm-cta, #jm-card-cta') || singleCard.querySelector('.btn')) : null;

  const prevBtns = section.querySelectorAll('.jm-nav-prev, #jm-prev-btn');
  const nextBtns = section.querySelectorAll('.jm-nav-next, #jm-next-btn');
  const counterEl = section.querySelector('.jm-step-counter, .jm-ctrl-counter, #jm-ctrl-counter');
  const timelineFill = section.querySelector('.jm-timeline-fill-bar, #jm-timeline-fill');
  const progFill = section.querySelector('.jm-progress-fill, .jm-progression-fill, #jm-progression-fill');

  // Master Journey Data Array (6 Programs)
  const journeySteps = [
    {
      title: 'Veterinary Skill-Up Program',
      subtitle: 'Clinical Foundation',
      image: 'assets/images/learning-paths/featured-skillup.webp',
      alt: 'Veterinary Skill-Up Program Clinical Training',
      badge: 'FLAGSHIP CLINICAL PATH',
      duration: '<i class="fa-regular fa-clock"></i> 4 Weeks (120+ Hrs)',
      difficulty: 'Foundation',
      description: 'Comprehensive 4-week clinical mastery module covering soft tissue surgery, digital radiology, abdominal ultrasound, and emergency triage for doctors and fresh graduates.',
      highlights: [
        '120+ Hours Practical Clinical Exposure',
        'Live Surgical Suite & Diagnostic Training',
        '1-on-1 Senior Veterinary Specialist Mentorship',
        'Verified Clinical Certification & Placement Support'
      ],
      buttonText: 'Explore Flagship Program',
      buttonLink: 'veterinary-skill-up.html',
      progressLabel: 'Foundation'
    },
    {
      title: 'Radiology & Ultrasound',
      subtitle: 'Practical Diagnostics',
      image: 'assets/images/learning-paths/radiology-ultrasound.webp',
      alt: 'Radiology & Ultrasound Diagnostic Training',
      badge: 'DIAGNOSTIC IMAGING',
      duration: '<i class="fa-regular fa-clock"></i> 2 Weeks',
      difficulty: 'Diagnostics',
      description: 'Hands-on digital X-ray positioning, FAST abdominal ultrasonography, diagnostic image interpretation, and real clinical case reviews.',
      highlights: [
        'FAST Abdominal & Thoracic Ultrasound Protocol',
        'Digital Radiography Positioning & Artifact Recognition',
        'Real Patient Case Imaging Analysis',
        'Radiological Reporting Certification'
      ],
      buttonText: 'Explore Radiology Track',
      buttonLink: 'radiology-ultrasound.html',
      progressLabel: 'Diagnostics'
    },
    {
      title: 'Soft Tissue Surgery',
      subtitle: 'Surgical Skills',
      image: 'assets/images/learning-paths/soft-tissue-surgery.webp',
      alt: 'Soft Tissue Surgery Training',
      badge: 'SURGICAL SPECIALIZATION',
      duration: '<i class="fa-regular fa-clock"></i> 2 Weeks',
      difficulty: 'Advanced',
      description: 'Master operating room protocols, aseptic technique, spay/neuter procedures, tissue handling, and tension-free wound closure techniques.',
      highlights: [
        'Aseptic OR Protocols & Instrument Handling',
        'Elective & Emergency Soft Tissue Procedures',
        'Suture Patterns & Knot Tying Mastery',
        'Post-Operative Analgesia & Care'
      ],
      buttonText: 'Explore Surgery Track',
      buttonLink: 'soft-tissue-surgery.html',
      progressLabel: 'Surgery'
    },
    {
      title: 'Emergency Medicine',
      subtitle: 'Emergency Medicine',
      image: 'assets/images/learning-paths/emergency-medicine.webp',
      alt: 'Emergency Medicine ICU Training',
      badge: 'CRITICAL CARE',
      duration: '<i class="fa-regular fa-clock"></i> 1 Week',
      difficulty: 'Advanced',
      description: 'Rapid triage protocols, CPR interventions, IV fluid resuscitation, shock management, and intensive inpatient ICU monitoring.',
      highlights: [
        'RECOVER CPR & Emergency Triage Algorithms',
        'Vascular Access & Fluid Therapy Calculations',
        'Point-of-Care Blood Gas & Lactate Triage',
        'Critical Care Patient Monitoring'
      ],
      buttonText: 'Explore Emergency Track',
      buttonLink: 'emergency-medicine.html',
      progressLabel: 'Critical Care'
    },
    {
      title: 'Vet Nurse Programme',
      subtitle: 'Professional Certification',
      image: 'assets/images/learning-paths/vet-nurse.webp',
      alt: 'Vet Nurse Certification Track',
      badge: 'PARAVET CERTIFICATION',
      duration: '<i class="fa-regular fa-clock"></i> 3 Weeks',
      difficulty: 'Certification',
      description: 'Practical clinical nursing, inpatient care, anesthesia monitoring, catheter placement, and diagnostic laboratory sampling.',
      highlights: [
        'IV Catheterization & Inpatient Triage',
        'Surgical Assistant & Sterilization Mastery',
        'Anesthesia Vital Sign Monitoring',
        'Certified Vet Nurse Credential'
      ],
      buttonText: 'Explore Nurse Track',
      buttonLink: 'vet-nurse-programme.html',
      progressLabel: 'Certification'
    },
    {
      title: 'Pet First Aid',
      subtitle: 'Career Ready',
      image: 'assets/images/learning-paths/pet-first-aid.webp',
      alt: 'Pet First Aid Workshop',
      badge: 'COMMUNITY & FIRST AID',
      duration: '<i class="fa-regular fa-clock"></i> Weekend',
      difficulty: 'Career Ready',
      description: 'Choking response, heat stroke protocol, emergency bandaging, poisoning action, and rescue handling for pet parents and feeders.',
      highlights: [
        'Choking & Airway Obstruction Maneuvers',
        'Emergency Bandaging & Hemorrhage Control',
        'Heat Stroke & Poison Triage Protocols',
        'First Responder Certification'
      ],
      buttonText: 'Explore First Aid Track',
      buttonLink: 'animal-welfare.html',
      progressLabel: 'Career'
    }
  ];

  // Preload all 6 images immediately to eliminate flickering
  journeySteps.forEach(s => {
    if (s.image) {
      const img = new Image();
      img.src = s.image;
    }
  });

  let activeStepIndex = 0;
  let animationTimeout = null;
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Master UI Update Function
  function updateJourney(stepIndex) {
    if (stepIndex < 0 || stepIndex >= journeySteps.length) return;
    activeStepIndex = stepIndex;

    // Clear any previous animation timeout immediately to prevent stacked animations
    if (animationTimeout) {
      clearTimeout(animationTimeout);
      animationTimeout = null;
    }

    const applyDOMUpdates = () => {
      const step = journeySteps[activeStepIndex];

      // Update Card Image & Alt
      if (cardImg) {
        cardImg.src = step.image;
        cardImg.alt = step.alt || step.title;
      }

      // Update Badge
      if (cardBadge) cardBadge.textContent = step.badge;

      // Update Step Number
      if (cardStepNum) {
        cardStepNum.textContent = `MILESTONE ${String(activeStepIndex + 1).padStart(2, '0')} OF ${String(journeySteps.length).padStart(2, '0')}`;
      }

      // Update Counter Element (01 / 06)
      if (counterEl) {
        counterEl.textContent = `${String(activeStepIndex + 1).padStart(2, '0')} / ${String(journeySteps.length).padStart(2, '0')}`;
      }

      // Update Subtitle & Title
      if (cardTitle) cardTitle.textContent = step.title;
      if (cardSubtitle) cardSubtitle.textContent = step.subtitle;

      // Update Meta Pills
      if (cardDuration) cardDuration.innerHTML = step.duration;
      if (cardLevel) cardLevel.textContent = step.difficulty;

      // Update Description
      if (cardDesc) cardDesc.textContent = step.description;

      // Update Bullet Highlights
      if (cardHighlights && Array.isArray(step.highlights)) {
        cardHighlights.innerHTML = step.highlights
          .map(h => `<div class="jm-highlight-item"><i class="fa-solid fa-circle-check"></i> <span>${h}</span></div>`)
          .join('');
      }

      // Update CTA Text & URL
      if (cardCta) {
        cardCta.href = step.buttonLink;
        cardCta.innerHTML = `<span>${step.buttonText}</span> <i class="fa-solid fa-arrow-right"></i>`;
      }

      // Update Timeline Active & Accessibility State
      milestoneNodes.forEach((node, i) => {
        const isActive = i === activeStepIndex;
        node.classList.toggle('active', isActive);
        node.setAttribute('aria-current', isActive ? 'step' : 'false');
      });

      // Update Progression Labels Active State
      progLabels.forEach((label, i) => {
        label.classList.toggle('active', i === activeStepIndex);
      });

      // Update Progression Fill Bar Width (0%, 20%, 40%, 60%, 80%, 100%)
      const progPercent = (activeStepIndex / (journeySteps.length - 1)) * 100;
      if (progFill) {
        progFill.style.width = `${progPercent}%`;
      }

      // Update Vertical Timeline Fill Bar
      const timelinePercent = ((activeStepIndex + 1) / journeySteps.length) * 100;
      if (timelineFill) {
        timelineFill.style.height = `${timelinePercent}%`;
      }
    };

    if (prefersReducedMotion || !singleCard) {
      applyDOMUpdates();
      return;
    }

    // Apply 250ms fade out transition
    singleCard.style.transition = 'opacity 250ms cubic-bezier(0.165, 0.84, 0.44, 1), transform 250ms cubic-bezier(0.165, 0.84, 0.44, 1)';
    singleCard.style.opacity = '0';
    singleCard.style.transform = 'translateY(20px) scale(0.98)';

    animationTimeout = setTimeout(() => {
      applyDOMUpdates();
      singleCard.style.opacity = '1';
      singleCard.style.transform = 'translateY(0) scale(1)';
      animationTimeout = null;
    }, 250);
  }

  // Event Listeners on Timeline Nodes (Hover, Click, Keyboard)
  milestoneNodes.forEach((node, i) => {
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');

    node.addEventListener('click', (e) => {
      e.preventDefault();
      updateJourney(i);
    });

    node.addEventListener('mouseenter', () => {
      updateJourney(i);
    });

    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateJourney(i);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        updateJourney((activeStepIndex + 1) % journeySteps.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        updateJourney((activeStepIndex - 1 + journeySteps.length) % journeySteps.length);
      } else if (e.key === 'Home') {
        e.preventDefault();
        updateJourney(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        updateJourney(journeySteps.length - 1);
      }
    });
  });

  // Event Listeners on Progression Labels
  progLabels.forEach((label, i) => {
    label.setAttribute('role', 'button');
    label.setAttribute('tabindex', '0');
    label.addEventListener('click', () => updateJourney(i));
    label.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateJourney(i);
      }
    });
  });

  // Previous Buttons (Infinite Looping)
  prevBtns.forEach(btn => {
    btn.setAttribute('aria-label', 'Previous Milestone');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const prevIndex = (activeStepIndex - 1 + journeySteps.length) % journeySteps.length;
      updateJourney(prevIndex);
    });
  });

  // Next Buttons (Infinite Looping)
  nextBtns.forEach(btn => {
    btn.setAttribute('aria-label', 'Next Milestone');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const nextIndex = (activeStepIndex + 1) % journeySteps.length;
      updateJourney(nextIndex);
    });
  });

  // Section Keyboard Shortcuts
  section.addEventListener('keydown', (e) => {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    if (e.key === 'ArrowLeft') {
      const prevIndex = (activeStepIndex - 1 + journeySteps.length) % journeySteps.length;
      updateJourney(prevIndex);
    } else if (e.key === 'ArrowRight') {
      const nextIndex = (activeStepIndex + 1) % journeySteps.length;
      updateJourney(nextIndex);
    }
  });

  // Initial Sync (Step 0)
  updateJourney(0);
}

// Attach to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initSingleFocusJourney();
});


// differet section 
document.addEventListener('DOMContentLoaded', function () {
  const qCards = document.querySelectorAll('#clarity-block .clarity-q-card');

  qCards.forEach(card => {
    card.addEventListener('click', function () {
      const isActive = this.classList.contains('active');
      qCards.forEach(c => c.classList.remove('active'));
      if (!isActive) {
        this.classList.add('active');
      }
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Open first card by default
  if (qCards.length > 0) {
    qCards[0].classList.add('active');
  }

  // Intersection Observer for smooth fade up on scroll
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('clarity-revealed');
        }
      });
    }, { threshold: 0.1 });

    const revealLeft = document.querySelector('#clarity-block .clarity-left');
    const revealRight = document.querySelector('#clarity-block .clarity-right');
    if (revealLeft) observer.observe(revealLeft);
    if (revealRight) observer.observe(revealRight);
  } else {
    const revealLeft = document.querySelector('#clarity-block .clarity-left');
    const revealRight = document.querySelector('#clarity-block .clarity-right');
    if (revealLeft) revealLeft.classList.add('clarity-revealed');
    if (revealRight) revealRight.classList.add('clarity-revealed');
  }
});

/* ==========================================================================
   Clinical Equipment Showcase Controller (#modern-equipment)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const eqSection = document.getElementById('modern-equipment');
  if (!eqSection) return;

  const stackCards = eqSection.querySelectorAll('.eq-stack-card');
  const mainImg = eqSection.querySelector('#eq-main-img');
  const mainBadge = eqSection.querySelector('#eq-main-badge');
  const mainTitle = eqSection.querySelector('#eq-main-title');
  const mainDesc = eqSection.querySelector('#eq-main-desc');
  const mainTag = eqSection.querySelector('#eq-main-tag');

  const stackData = {
    ultrasound: {
      title: 'Digital Ultrasound System',
      badge: 'DIAGNOSTIC IMAGING',
      desc: 'Students practice abdominal scans, FAST protocols, cardiac assessment, reproductive imaging, and image interpretation under expert supervision.',
      img: 'assets/images/learning-centre/equipment_ultrasound.webp',
      tag: '<i class="fa-solid fa-hospital"></i> Hospital Grade'
    },
    xray: {
      title: 'Digital Radiography (CR/DR X-Ray)',
      badge: 'RADIOLOGY SUITE',
      desc: 'High-frequency digital X-ray positioning, radiograph exposure calibration, thoracic/abdominal view evaluation, and orthopedic diagnostic reading.',
      img: 'assets/images/learning-centre/equipment_xray.webp',
      tag: '<i class="fa-solid fa-hospital"></i> Hospital Grade'
    },
    vitals: {
      title: 'Multiparameter Vitals Monitor',
      badge: 'ICU & MONITORING',
      desc: 'Continuous real-time ECG, SpO₂, non-invasive blood pressure (NIBP), end-tidal CO₂, and body temperature monitoring during surgical procedures.',
      img: 'assets/images/learning-centre/equipment_emergency.webp',
      tag: '<i class="fa-solid fa-shield-halved"></i> ICU Ready'
    },
    surgery: {
      title: 'Sterile Surgical Packs & OT Instruments',
      badge: 'SURGICAL SUITE',
      desc: 'Complete Mayo-Hegar needle drivers, Crile & Mosquito hemostats, scalpel ergonomic grips, suture materials, and aseptic OR setups.',
      img: 'assets/images/learning-centre/equipment_surgery.webp',
      tag: '<i class="fa-solid fa-square-check"></i> OT Standard'
    },
    emergency: {
      title: 'Emergency Crash Cart & Resuscitation',
      badge: 'CRITICAL CARE',
      desc: 'Endotracheal intubation tubes, laryngoscopes, ambu bags, vascular access supplies, and emergency drug dosing reference algorithms.',
      img: 'assets/images/learning-centre/equipment_emergency.webp',
      tag: '<i class="fa-solid fa-truck-medical"></i> Critical Care'
    }
  };

  stackCards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-eq');
      const data = stackData[key];
      if (!data) return;

      stackCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      if (mainImg) {
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = data.img;
          mainImg.alt = data.title;
          mainImg.style.opacity = '1';
        }, 150);
      }

      if (mainBadge) mainBadge.textContent = data.badge;
      if (mainTitle) mainTitle.textContent = data.title;
      if (mainDesc) mainDesc.textContent = data.desc;
      if (mainTag) mainTag.innerHTML = data.tag;
    });
  });

  // Category Tabs Controller
  const tabBtns = eqSection.querySelectorAll('.eq-tab-btn');
  const panelImg = eqSection.querySelector('#eq-panel-img');
  const panelEyebrow = eqSection.querySelector('#eq-panel-eyebrow');
  const panelTitle = eqSection.querySelector('#eq-panel-title');
  const panelDesc = eqSection.querySelector('#eq-panel-desc');
  const panelOutcomes = eqSection.querySelector('#eq-panel-outcomes');

  const tabData = {
    diagnostics: {
      eyebrow: 'DIAGNOSTICS SUITE',
      title: 'Ultrasound & Digital Radiography Suite',
      desc: 'Master probe positioning, FAST scanning protocols, and digital radiography image evaluation under the guidance of senior diagnostic imaging specialists.',
      img: 'assets/images/learning-centre/equipment_ultrasound.webp',
      outcomes: [
        'Abdominal organ scanning & artifact recognition',
        'Thoracic & abdominal FAST emergency protocol',
        'Digital radiography exposure & positioning'
      ]
    },
    surgery: {
      eyebrow: 'OPERATING THEATRE',
      title: 'Surgical Instrument Packs & OT Setup',
      desc: 'Practice aseptic scrub routines, Mayo stand arrangement, instrument ergonomics, suture selection, and tissue handling protocols.',
      img: 'assets/images/learning-centre/equipment_surgery.webp',
      outcomes: [
        'Sterile field preservation & gowning',
        'Precision suture knotting & tension control',
        'Instrument handling ergonomics in OR'
      ]
    },
    emergency: {
      eyebrow: 'CRITICAL CARE & ICU',
      title: 'Emergency Resuscitation & Crash Cart Unit',
      desc: 'Perform rapid endotracheal intubation, vascular access, fluid therapy calculations, and shock resuscitation protocols.',
      img: 'assets/images/learning-centre/equipment_emergency.webp',
      outcomes: [
        'RECOVER CPR algorithm execution',
        'Vascular access & catheter securement',
        'Emergency drug dosing & fluid titration'
      ]
    },
    monitoring: {
      eyebrow: 'PATIENT MONITORING',
      title: 'Multiparameter Vitals Monitoring',
      desc: 'Monitor real-time ECG rhythms, oxygen saturation, end-tidal carbon dioxide, and blood pressure during procedures.',
      img: 'assets/images/learning-centre/equipment_emergency.webp',
      outcomes: [
        'ECG arrhythmia recognition & logging',
        'SpO₂ & Capnography trend monitoring',
        'Hypotension & hypothermia alert response'
      ]
    },
    laboratory: {
      eyebrow: 'CLINICAL LAB',
      title: 'Wet Lab & Diagnostic Microscopes',
      desc: 'Conduct blood smear evaluation, skin scrape cytology, urinalysis sediment reading, and micro-parasite identification.',
      img: 'assets/images/learning-centre/equipment_laboratory.webp',
      outcomes: [
        'Cytology staining & slide preparation',
        'Blood smear differential cell count',
        'Fecal & skin parasite identification'
      ]
    },
    anesthesia: {
      eyebrow: 'ANESTHESIOLOGY',
      title: 'Isoflurane Gas Anesthesia Workstation',
      desc: 'Master induction protocols, vaporizer precision settings, circuit leak testing, oxygen supply management, and patient recovery.',
      img: 'assets/images/learning-centre/equipment_anesthesia.webp',
      outcomes: [
        'Anesthetic machine pre-use leak test',
        'Vaporizer percentage calibration & maintenance',
        'Smooth patient emergence & recovery monitoring'
      ]
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-tab');
      const data = tabData[key];
      if (!data) return;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (panelImg) {
        panelImg.style.opacity = '0';
        setTimeout(() => {
          panelImg.src = data.img;
          panelImg.alt = data.title;
          panelImg.style.opacity = '1';
        }, 150);
      }

      if (panelEyebrow) panelEyebrow.textContent = data.eyebrow;
      if (panelTitle) panelTitle.textContent = data.title;
      if (panelDesc) panelDesc.textContent = data.desc;
      if (panelOutcomes && Array.isArray(data.outcomes)) {
        panelOutcomes.innerHTML = data.outcomes
          .map(o => `<li><i class="fa-solid fa-circle-check"></i> ${o}</li>`)
          .join('');
      }
    });
  });
});

/* ==========================================================================
   Faculty Profile Modal Logic
   ========================================================================== */
const facultyProfiles = {
  'amit-kulkarni': {
    name: 'Dr. Amit Kulkarni',
    role: 'Soft Tissue Surgery & Wound Management Specialist',
    qual: 'BVSc & AH, MVSc (Surgery)',
    exp: '12+ Yrs Exp',
    intro: 'Dr. Amit Kulkarni is a Soft Tissue Surgery & Wound Management Specialist focusing on surgical precision and tissue handling.',
    expertise: ['Soft Tissue', 'Suturing', 'Sterilization'],
    img: 'assets/images/about/about-faculty-01.webp'
  },
  'priya-sharma': {
    name: 'Dr. Priya Sharma',
    role: 'Diagnostic Radiology & Abdominal Ultrasound Trainer',
    qual: 'BVSc & AH, MVSc (Radiology)',
    exp: '10+ Yrs Exp',
    intro: 'Dr. Priya Sharma specializes in Diagnostic Radiology and Abdominal Ultrasound, training professionals in advanced diagnostics.',
    expertise: ['X-Ray', 'Ultrasound', 'Diagnostics'],
    img: 'assets/images/about/about-faculty-02.webp'
  },
  'rajesh-verma': {
    name: 'Dr. Rajesh Verma',
    role: 'Emergency & Critical Pet Care Specialist',
    qual: 'BVSc & AH, MVSc (Medicine)',
    exp: '14+ Yrs Exp',
    intro: 'Dr. Rajesh Verma is an expert in Emergency and Critical Pet Care, ensuring life-saving interventions and rapid triage.',
    expertise: ['ICU', 'Triage', 'Emergency'],
    img: 'assets/images/about/about-faculty-03.webp'
  },
  'sneha-nair': {
    name: 'Dr. Sneha Nair',
    role: 'Feline Clinical Practice & Dermatology Instructor',
    qual: 'BVSc & AH, PgDip (Dermatology)',
    exp: '9+ Yrs Exp',
    intro: 'Dr. Sneha Nair focuses on Feline Clinical Practice and Dermatology, offering specialized care and insights into feline medicine.',
    expertise: ['Feline Medicine', 'Dermatology'],
    img: 'assets/images/about/about-faculty-04.webp'
  },
  'manoj-shinde': {
    name: 'Dr. Manoj Shinde',
    role: 'Bone Plating & Fracture Stabilization Mentor',
    qual: 'BVSc & AH, MVSc (Orthopedics)',
    exp: '15+ Yrs Exp',
    intro: 'Dr. Manoj Shinde is an orthopedics mentor specializing in bone plating, fracture stabilization, and advanced orthopedic procedures.',
    expertise: ['Orthopedics', 'Plating', 'Fixation'],
    img: 'assets/images/about/about-faculty-05.webp'
  },
  'neha-gupta': {
    name: 'Dr. Neha Gupta',
    role: 'Paravet Assistant & Surgical Scrub Lead Instructor',
    qual: 'BVSc & AH, Cert. Vet Nursing',
    exp: '8+ Yrs Exp',
    intro: 'Dr. Neha Gupta is a leading instructor for Paravet Assistants and Surgical Scrubs, emphasizing anesthesia prep and nursing care.',
    expertise: ['Vet Nursing', 'Anesthesia Prep'],
    img: 'assets/images/about/about-faculty-06.webp'
  },
  'rajesh-kulkarni': {
    name: 'Dr. Rajesh Kulkarni',
    role: 'Senior Soft Tissue Surgeon',
    qual: 'BVSc & AH',
    exp: '15+ Yrs Exp',
    intro: 'Pioneered soft tissue surgical workflows; mentored over 1,200+ veterinary clinicians across India.',
    expertise: ['Soft Tissue Surgery', 'Orthopaedics'],
    img: 'assets/images/learning-path-doctor.webp'
  },
  'ananya-sharma': {
    name: 'Dr. Ananya Sharma',
    role: 'Radiology & Imaging Specialist',
    qual: 'BVSc & AH',
    exp: '12+ Yrs Exp',
    intro: 'Specialist in digital X-ray diagnostic interpretation and ultrasound probe handling for small animals.',
    expertise: ['Radiology', 'Ultrasound'],
    img: 'assets/images/learning-path-graduate.webp'
  },
  'vikram-malhotra': {
    name: 'Dr. Vikram Malhotra',
    role: 'Emergency & Critical Care Lead',
    qual: 'BVSc & AH',
    exp: '14+ Yrs Exp',
    intro: 'Expert in small animal emergency triage, CPR protocols, ICU stabilization, and critical care management.',
    expertise: ['Emergency Medicine', 'Critical Care'],
    img: 'assets/images/learning-path-specialist.webp'
  },
  'meera-deshmukh-1': {
    name: 'Dr. Meera Deshmukh',
    role: 'Senior Clinical & Nursing Instructor',
    qual: 'BVSc & AH',
    exp: '10+ Yrs Exp',
    intro: 'Specializes in clinical workflow optimization, humane animal restraint, catheter prep, and assistant training.',
    expertise: ['Vet Nursing', 'Pet Behaviour'],
    img: 'assets/images/learning-path-nurse.webp'
  },
  'meera-deshmukh-2': {
    name: 'Dr. Meera Deshmukh',
    role: 'Senior Clinical & Nursing Instructor',
    qual: 'BVSc & AH',
    exp: '10+ Yrs Exp',
    intro: 'Specializes in clinical workflow optimization, humane animal restraint, catheter prep, and assistant training.',
    expertise: ['Vet Nursing', 'Pet Behaviour'],
    img: 'assets/images/learning-path-nurse.webp'
  },
  'meera-deshmukh-3': {
    name: 'Dr. Meera Deshmukh',
    role: 'Senior Clinical & Nursing Instructor',
    qual: 'BVSc & AH',
    exp: '10+ Yrs Exp',
    intro: 'Specializes in clinical workflow optimization, humane animal restraint, catheter prep, and assistant training.',
    expertise: ['Vet Nursing', 'Pet Behaviour'],
    img: 'assets/images/learning-path-nurse.webp'
  }
};

function initFacultyModal() {
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
  }

  const closeBtn = document.getElementById('faculty-modal-close');
  const profileBtns = document.querySelectorAll('.faculty-profile-btn');

  // Modal elements
  const imgEl = document.getElementById('faculty-modal-image');
  const nameEl = document.getElementById('faculty-modal-name');
  const roleEl = document.getElementById('faculty-modal-role');
  const qualEl = document.getElementById('faculty-modal-qual');
  const expEl = document.getElementById('faculty-modal-exp');
  const introEl = document.getElementById('faculty-modal-intro');
  const expertiseEl = document.getElementById('faculty-modal-expertise');

  function openModal(facultyId) {
    const data = (window.loadedFacultyMap && window.loadedFacultyMap[facultyId]) || facultyProfiles[facultyId];
    if (!data) return;

    // Populate data
    const photo = data.image || data.img || 'assets/images/about/about-faculty-01.webp';
    const name = data.name || 'Faculty Specialist';
    const role = data.designation || data.department || data.specialization || data.role || '';
    const qual = data.qualification || data.qual || '';
    const exp = data.experience || data.exp || '';
    const intro = data.bio || data.intro || '';

    imgEl.src = photo;
    imgEl.alt = name;
    nameEl.textContent = name;
    roleEl.textContent = role;
    qualEl.textContent = qual;
    expEl.textContent = exp;
    introEl.textContent = intro;

    // Populate expertise chips
    expertiseEl.innerHTML = '';
    const tags = data.department || data.specialization
      ? (data.department || data.specialization).split(/[,&]/).map(t => t.trim()).filter(Boolean)
      : (Array.isArray(data.expertise) ? data.expertise : ['Clinical Care']);

    tags.forEach(item => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = item;
      expertiseEl.appendChild(chip);
    });

    // Show modal and prevent scroll
    // Small timeout to allow display block to apply before adding transition class
    setTimeout(() => {
      modal.classList.add('open');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    // Wait for transition
    setTimeout(() => {
      document.body.style.overflow = '';
    }, 300);
  }

  profileBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const facultyId = btn.getAttribute('data-faculty-id');
      if (facultyId) openModal(facultyId);
    });
  });

  closeBtn.addEventListener('click', closeModal);

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

/* ==========================================================================
   Desktop Navigation Dropdown Hover Controller
   ========================================================================== */
function initDesktopDropdowns() {
  const dropdownContainers = document.querySelectorAll('.menu .has-dropdown');
  if (!dropdownContainers.length) return;

  const CLOSE_DELAY = 200; // 200ms close delay (approx 150ms-300ms)

  dropdownContainers.forEach(container => {
    let closeTimer = null;
    const toggleLink = container.querySelector('.dropdown-toggle');
    const menuPanel = container.querySelector('.dropdown-menu');

    function openDropdown() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }

      // Close all other open dropdowns immediately for clean horizontal switching
      dropdownContainers.forEach(otherContainer => {
        if (otherContainer !== container) {
          otherContainer.classList.remove('is-open');
          const otherToggle = otherContainer.querySelector('.dropdown-toggle');
          if (otherToggle) {
            otherToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });

      container.classList.add('is-open');
      if (toggleLink) {
        toggleLink.setAttribute('aria-expanded', 'true');
      }
    }

    function scheduleCloseDropdown() {
      if (closeTimer) {
        clearTimeout(closeTimer);
      }
      closeTimer = setTimeout(() => {
        container.classList.remove('is-open');
        if (toggleLink) {
          toggleLink.setAttribute('aria-expanded', 'false');
        }
        closeTimer = null;
      }, CLOSE_DELAY);
    }

    // Pointer enters the combined hover region (trigger or dropdown panel)
    container.addEventListener('mouseenter', () => {
      openDropdown();
    });

    // Pointer moves within the combined hover region -> cancel any active close timer
    container.addEventListener('mousemove', () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      if (!container.classList.contains('is-open')) {
        openDropdown();
      }
    });

    // Pointer leaves the combined hover region
    container.addEventListener('mouseleave', () => {
      scheduleCloseDropdown();
    });

    // Keyboard accessibility support
    container.addEventListener('focusin', () => {
      openDropdown();
    });

    container.addEventListener('focusout', (e) => {
      if (!container.contains(e.relatedTarget)) {
        scheduleCloseDropdown();
      }
    });

    // Close dropdown immediately when any link inside the panel is clicked
    if (menuPanel) {
      const menuLinks = menuPanel.querySelectorAll('a');
      menuLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
          }
          container.classList.remove('is-open');
          if (toggleLink) {
            toggleLink.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
  });
}

/* ==========================================================================
   Global Floating Connect With Us Widget
   ========================================================================== */
function initConnectWidget() {
  const widgetBtn = document.getElementById('connect-widget-btn');
  const widgetPanel = document.getElementById('connect-widget-panel');
  const closeBtn = document.getElementById('connect-widget-close');
  const widgetWrap = document.getElementById('connect-widget');

  if (!widgetBtn || !widgetPanel) return;

  if (widgetBtn.dataset.initialized === 'true') return;
  widgetBtn.dataset.initialized = 'true';

  function openPanel() {
    widgetPanel.classList.add('is-open');
    widgetPanel.setAttribute('aria-hidden', 'false');
    widgetBtn.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    widgetPanel.classList.remove('is-open');
    widgetPanel.setAttribute('aria-hidden', 'true');
    widgetBtn.setAttribute('aria-expanded', 'false');
  }

  function togglePanel() {
    const isOpen = widgetPanel.classList.contains('is-open');
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }

  widgetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closePanel();
    });
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (widgetPanel.classList.contains('is-open')) {
      if (widgetWrap && !widgetWrap.contains(e.target)) {
        closePanel();
      }
    }
  });

  // Keyboard accessibility: ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widgetPanel.classList.contains('is-open')) {
      closePanel();
      widgetBtn.focus();
    }
  });

  // Handle action links
  const actionLinks = widgetPanel.querySelectorAll('.connect-action-item');
  actionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      if (href.includes('contact.html')) {
        closePanel();
        return;
      }
      if (link.classList.contains('btn-counselling-modal') || href === 'contact.html#enquiry') {
        const modal = document.getElementById('enquiry-modal');
        if (modal) {
          e.preventDefault();
          closePanel();
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        } else {
          closePanel();
        }
      } else {
        closePanel();
      }
    });
  });
}

/* ==========================================================================
   Partnership Enquiry Form Handling
   ========================================================================== */
function initPartnershipForm() {
  const form = document.getElementById('partnership-enquiry-form');
  const submitBtn = document.getElementById('partnership-submit-btn');
  const errorBanner = document.getElementById('partnership-error-banner');
  const errorText = document.getElementById('partnership-error-text');
  const successState = document.getElementById('partnership-success-state');
  const resetBtn = document.getElementById('partnership-reset-btn');

  if (!form) return;

  if (form.dataset.initialized === 'true') return;
  form.dataset.initialized = 'true';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (errorBanner) errorBanner.style.display = 'none';

    const nameEl = document.getElementById('partnership-name');
    const orgEl = document.getElementById('partnership-organization');
    const emailEl = document.getElementById('partnership-email');
    const countryCodeEl = document.getElementById('partnership-country-code');
    const phoneEl = document.getElementById('partnership-phone');
    const orgTypeEl = document.getElementById('partnership-org-type');
    const interestEl = document.getElementById('partnership-interest');
    const messageEl = document.getElementById('partnership-message');

    const name = nameEl ? nameEl.value.trim() : '';
    const organization = orgEl ? orgEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const countryCode = countryCodeEl ? countryCodeEl.value.trim() : '+91';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const organizationType = orgTypeEl ? orgTypeEl.value.trim() : '';
    const partnershipInterest = interestEl ? interestEl.value.trim() : '';
    const message = messageEl ? messageEl.value.trim() : '';

    if (!name || !organization || !email || !phone || !organizationType || !partnershipInterest || !message) {
      if (errorBanner && errorText) {
        errorText.textContent = 'Please fill out all required fields before submitting.';
        errorBanner.style.display = 'flex';
      }
      return;
    }

    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Enquiry...';
    }

    const payload = {
      name,
      organization,
      email,
      countryCode,
      phone,
      organizationType,
      partnershipInterest,
      message,
      source: 'Partnership Enquiry',
      sourcePage: 'partnerships.html'
    };

    try {
      if (typeof submitEnquiry !== 'function') {
        throw new Error('API client script (api.js) failed to load. Please refresh the page and try again.');
      }

      await submitEnquiry(payload);

      // On Success
      form.style.display = 'none';
      if (successState) successState.style.display = 'block';
      if (errorBanner) errorBanner.style.display = 'none';
    } catch (err) {
      console.error('Partnership enquiry submission error:', err);
      if (errorBanner && errorText) {
        errorText.textContent = err.message || 'Unable to submit enquiry. Please check your connection and try again.';
        errorBanner.style.display = 'flex';
      } else {
        alert(err.message || 'Unable to submit enquiry. Please check your connection and try again.');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      if (successState) successState.style.display = 'none';
      if (errorBanner) errorBanner.style.display = 'none';
      form.style.display = 'grid';
    });
  }
}


