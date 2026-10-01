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
      if (cleanDataNav === cleanPath || ((cleanPath === 'index' || cleanPath === 'index-v2' || cleanPath === 'index-v3' || cleanPath === 'index-v4') && cleanDataNav === 'index')) {
        link.classList.add('active');
      }
    }
  });

  // Submenu items & mobile drawer content links highlighting
  const subLinks = document.querySelectorAll('.dropdown-menu a, .drawer-accordion-content a');
  subLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const cleanHref = href.split('#')[0].toLowerCase();
      const currentFile = (path === '' ? 'index.html' : path);
      if (cleanHref === currentFile) {
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
        if (href && href.includes('#' + currentId)) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
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
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      const isActive = parent.classList.contains('active');

      document.querySelectorAll('.curriculum-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });
}

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
    ctaText: 'Apply Now',
    ctaLink: 'contact.html',
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
    ctaText: 'Apply Now',
    ctaLink: 'contact.html',
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
    ctaText: 'Apply Now',
    ctaLink: 'contact.html',
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
    ctaText: 'Apply Now',
    ctaLink: 'contact.html',
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
    ctaText: 'Apply Now',
    ctaLink: 'contact.html',
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
        { text: 'Improve Soft Tissue Surgery Confidence (Spay, Neuter, Organ Resection)', programIds: ['soft-tissue-surgery', 'skill-up'] },
        { text: 'Master Small Animal Orthopaedics (Fracture Stabilization & Bone Plating)', programIds: ['orthopaedics', 'soft-tissue-surgery'] },
        { text: 'Learn Operating Theater Sterilization & Surgical Protocols', programIds: ['soft-tissue-surgery', 'skill-up'] }
      ]
    },
    radiology: {
      name: 'Radiology & Diagnostic Ultrasound',
      goals: [
        { text: 'Abdominal Ultrasound FAST Scans & Probe Handling Ergonomics', programIds: ['radiology-ultrasound', 'skill-up'] },
        { text: 'Digital X-Ray Contrast Reading & Thoracic Radiography', programIds: ['radiology-ultrasound', 'skill-up'] },
        { text: 'Organ Pathology Mapping & Bedside Ultrasound Diagnostics', programIds: ['radiology-ultrasound'] }
      ]
    },
    emergency: {
      name: 'Emergency & Critical Care',
      goals: [
        { text: 'RECOVER CPR Protocols, Triage & Fluid Resuscitation', programIds: ['emergency-care', 'skill-up'] },
        { text: 'Trauma Patient ICU Monitoring & Shock Therapy', programIds: ['emergency-care'] },
        { text: 'Pet First Aid, Choking Release & Home Emergency Response', programIds: ['pet-first-aid', 'emergency-care'] }
      ]
    },
    nurse: {
      name: 'Vet Nursing & Paravet Skills',
      goals: [
        { text: 'Patient Restraint, IV Setup & Scrub Assistant Training', programIds: ['vet-nurse'] },
        { text: 'OT Sterilization, Anesthesia Monitoring & Wound Dressing', programIds: ['vet-nurse'] },
        { text: 'Clinic Workflow Readiness & Patient Record Systems', programIds: ['vet-nurse', 'skill-up'] }
      ]
    },
    'skill-up': {
      name: 'Comprehensive Clinical Skill-Up',
      goals: [
        { text: 'Full Transition Training for Independent Clinical Mastery', programIds: ['skill-up'] },
        { text: 'ECG Rhythm Analysis, Prescription Protocols & Diagnostics', programIds: ['skill-up'] },
        { text: 'Everyday Clinical Essentials & Surgical/Emergency Foundations', programIds: ['skill-up'] }
      ]
    },
    all: {
      name: 'All Learning Tracks',
      goals: [
        { text: 'Explore Flagship Clinical Programs', programIds: ['skill-up', 'soft-tissue-surgery'] },
        { text: 'Explore Diagnostic & Imaging Workshops', programIds: ['radiology-ultrasound'] },
        { text: 'Explore Emergency & Nursing Courses', programIds: ['emergency-care', 'vet-nurse', 'pet-first-aid'] }
      ]
    }
  },
  programs: [
    {
      id: 'skill-up',
      title: 'Veterinary Skill-Up Program',
      badge: 'FLAGSHIP PROGRAM',
      level: 'Foundation to Advanced',
      duration: '6 Weeks (Hands-on)',
      url: 'veterinary-skill-up.html',
      topics: ['skill-up', 'surgery', 'radiology', 'emergency'],
      levels: ['foundation', 'intermediate', 'advanced'],
      image: 'assets/images/edu-flagship-skillup.webp',
      description: 'Comprehensive clinical immersion course focusing on soft tissue surgery assistance, digital radiology, ECG interpretation, and emergency response.',
      outcomes: ['Soft Tissue Surgery', 'Digital Radiology', 'ECG & Cardiology', 'Emergency Triage'],
      formProgram: 'skill-up'
    },
    {
      id: 'soft-tissue-surgery',
      title: 'Soft Tissue Surgery Masterclass',
      badge: 'SURGERY TRACK',
      level: 'Intermediate to Advanced',
      duration: '4 Weeks',
      url: 'soft-tissue-surgery.html',
      topics: ['surgery'],
      levels: ['intermediate', 'advanced'],
      image: 'assets/images/program-surgery.webp',
      description: 'Master standard surgical incisions, stitching techniques, spay/neuter protocols, and abdominal organ surgeries under direct mentor guidance.',
      outcomes: ['Independent Surgical Cases', 'OT Sterilization Protocols', 'Abdominal Organ Surgeries', 'Tissue Handling'],
      formProgram: 'surgery'
    },
    {
      id: 'orthopaedics',
      title: 'Small Animal Orthopaedics',
      badge: 'SURGERY SPECIALIST',
      level: 'Advanced',
      duration: '6 Weeks',
      url: 'soft-tissue-surgery.html',
      topics: ['surgery'],
      levels: ['advanced'],
      image: 'assets/images/hero-veterinary-training.webp',
      description: 'Comprehensive training in bone fracture stabilization, dynamic bone plating, IM pinning, and joint injury management in dogs and cats.',
      outcomes: ['Bone Fracture Fixation', 'Dynamic Bone Plating', 'IM Pinning', 'Post-Op Radiology'],
      formProgram: 'surgery'
    },
    {
      id: 'radiology-ultrasound',
      title: 'Ultrasound & Diagnostic Radiology',
      badge: 'RADIOLOGY TRACK',
      level: 'Intermediate',
      duration: '3 Weeks',
      url: 'radiology-ultrasound.html',
      topics: ['radiology'],
      levels: ['foundation', 'intermediate'],
      image: 'assets/images/facility-radiology.webp',
      description: 'Hands-on probe handling, acoustic windows, systematic abdominal scanning, and digital radiograph contrast reading.',
      outcomes: ['Abdominal FAST Scanning', 'Probe Ergonomics', 'X-Ray Contrast Interpretation', 'Organ Mapping'],
      formProgram: 'surgery'
    },
    {
      id: 'emergency-care',
      title: 'Emergency & Critical Care Triage',
      badge: 'EMERGENCY TRACK',
      level: 'Intermediate to Advanced',
      duration: '2 Weeks',
      url: 'emergency-medicine.html',
      topics: ['emergency'],
      levels: ['intermediate', 'advanced'],
      image: 'assets/images/learning-path-specialist.webp',
      description: 'Rapid patient triage, RECOVER CPR resuscitation protocols, fluid therapy management, and ICU monitoring for small animals.',
      outcomes: ['RECOVER CPR Protocols', 'IV Catheterization & Shock', 'Fluid Resuscitation', 'ICU Monitoring'],
      formProgram: 'first-aid'
    },
    {
      id: 'pet-first-aid',
      title: 'Pet First Aid & Emergency Response',
      badge: 'PET CARE WORKSHOP',
      level: 'Foundational',
      duration: '2 Days Workshop',
      url: 'emergency-medicine.html',
      topics: ['emergency', 'all'],
      levels: ['foundation'],
      image: 'assets/vet_selector_petcare_card.webp',
      description: 'Essential hands-on training for pet owners, rescuers, and shelter volunteers on wound dressing, toxin response, choking release, and pet CPR.',
      outcomes: ['Choking & CPR Simulation', 'Wound Bandaging', 'Toxin Emergency Action', 'First Aid Kit Usage'],
      formProgram: 'first-aid'
    },
    {
      id: 'vet-nurse',
      title: 'Certified Vet Nursing & Paravet Skills',
      badge: 'VET NURSE TRACK',
      level: 'Foundational',
      duration: '4 Weeks',
      url: 'vet-nurse-programme.html',
      topics: ['nurse'],
      levels: ['foundation', 'intermediate'],
      image: 'assets/images/learning-path-nurse.webp',
      description: 'Designed for clinic assistants and nursing staff to master patient restraint, surgical scrub prep, anesthesia monitoring, and wound care.',
      outcomes: ['Patient Restraint & IV Setup', 'OT Scrub & Sterilization', 'Anesthesia Monitoring', 'Clinic Workflow'],
      formProgram: 'nurse'
    }
  ]
};

let discoveryState = {
  discoveryStarted: false,
  selectedTopic: null,
  selectedGoal: null,
  selectedLevel: 'all'
};

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

  if (!topicButtons || topicButtons.length === 0 || !step1) return;

  // Initialize strictly at Step 1: No cards rendered, Step 2 & 3 locked
  resetToStep1();

  function resetToStep1() {
    discoveryState = {
      discoveryStarted: false,
      selectedTopic: null,
      selectedGoal: null,
      selectedLevel: 'all'
    };

    topicButtons.forEach(b => b.classList.remove('selected'));
    if (goalContainer) goalContainer.innerHTML = '';
    const resultsContainer = document.getElementById('discovery-program-cards');
    if (resultsContainer) resultsContainer.innerHTML = '';

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
    resetBtn.addEventListener('click', resetToStep1);
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
          renderDiscoveryResults(goal);
        });
        goalContainer.appendChild(btn);
      });
    }
  }

  function renderDiscoveryResults(goal) {
    const resultsContainer = document.getElementById('discovery-program-cards');
    const resultsTitle = document.getElementById('discovery-results-title');
    const resultsSubtitle = document.getElementById('discovery-results-subtitle');

    if (!resultsContainer) return;

    if (resultsTitle) {
      if (discoveryState.selectedTopic === 'all') {
        resultsTitle.textContent = 'Relevant Programs Matching Your Interests';
      } else {
        const topicName = discoveryDatabase.topics[discoveryState.selectedTopic]?.name || 'Your Selected Topic';
        resultsTitle.textContent = `Relevant Programs for ${topicName}`;
      }
    }
    if (resultsSubtitle && goal) {
      resultsSubtitle.textContent = `Targeting: "${goal.text}"`;
    }

    // Filter window.VETNOVA_PROGRAMS_DATA directly - NO duplicate hardcoded database!
    const topicToTrackMap = {
      'surgery': ['practicing-vets', 'fresh-graduates'],
      'radiology': ['diagnostic-specialization'],
      'emergency': ['emergency-care'],
      'nurse': ['vet-nurse'],
      'skill-up': ['fresh-graduates', 'practicing-vets'],
      'all': ['fresh-graduates', 'practicing-vets', 'diagnostic-specialization', 'emergency-care', 'vet-nurse']
    };

    const targetTracks = topicToTrackMap[discoveryState.selectedTopic] || topicToTrackMap['all'];

    let matchedPrograms = (window.VETNOVA_PROGRAMS_DATA || []).filter(p => {
      const matchesTopic = discoveryState.selectedTopic === 'all' ? true : targetTracks.includes(p.track);
      
      let matchesLevel = true;
      if (discoveryState.selectedLevel === 'foundation') matchesLevel = (p.grade === 1);
      else if (discoveryState.selectedLevel === 'intermediate') matchesLevel = (p.grade === 2 || p.grade === 3);
      else if (discoveryState.selectedLevel === 'advanced') matchesLevel = (p.grade === 4 || p.grade === 5);

      return matchesTopic && matchesLevel;
    });

    if (matchedPrograms.length === 0) {
      resultsContainer.innerHTML = `
        <div class="discovery-empty-state" style="text-align: center; padding: 48px 24px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 16px;">
          <i class="fa-solid fa-compass-drafting" style="font-size: 36px; color: #94a3b8; margin-bottom: 12px; display: block;"></i>
          <h3 style="font-size: 1.15rem; color: #334155; margin-bottom: 8px; font-weight: 600;">No programs currently match these exact selections.</h3>
          <p style="font-size: 0.95rem; color: #64748b; margin: 0 0 20px 0;">We couldn't find a program matching your exact level refinement. Would you like to reset your selections or speak with our academic advisors?</p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-outline btn-sm" id="empty-reset-btn"><i class="fa-solid fa-rotate-right"></i> Reset Selections</button>
            <a href="contact.html#enquiry" class="btn btn-primary btn-sm"><i class="fa-solid fa-calendar-check"></i> Book Free Counselling</a>
          </div>
        </div>
      `;
      const emptyResetBtn = document.getElementById('empty-reset-btn');
      if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetToStep1);
    } else {
      resultsContainer.innerHTML = matchedPrograms.map(p => {
        const isDemo = p.isDemo;
        const badgeText = isDemo ? 'Demo Program' : `Grade ${p.grade} — ${p.gradeName}`;
        const exploreLink = isDemo ? `programs.html?grade=${p.gradeCode}&track=${p.track}` : p.url;
        
        return `
          <div class="discovery-card ${isDemo ? 'demo-program-card' : ''}">
            <div class="discovery-card-img-wrap" style="position: relative;">
              <img src="${p.image || 'assets/images/programs/program-skill-up.webp'}" alt="${p.title}" loading="lazy" />
              <span class="discovery-card-badge ${isDemo ? 'badge-demo-pill' : ''}" style="${isDemo ? 'background: #f59e0b; color: #fff;' : ''}">${badgeText}</span>
            </div>
            <div class="discovery-card-body">
              <div class="discovery-card-meta">
                <span><i class="fa-solid fa-signal"></i> ${p.gradeLabel}</span>
                <span><i class="fa-solid fa-book-open"></i> ${p.trackLabel}</span>
              </div>
              <h4 class="discovery-card-title">${p.title}</h4>
              <p class="discovery-card-desc">${p.description}</p>
              <div class="discovery-card-actions" style="margin-top: 16px; display: flex; gap: 8px;">
                <a href="${exploreLink}" class="btn btn-primary btn-sm">
                  Explore Program <i class="fa-solid fa-arrow-right"></i>
                </a>
                <button type="button" class="btn btn-outline btn-sm btn-show-interest" data-source="Discovery Quiz Enquiry" data-context="${p.title}">
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Transition view to Step 3
    if (step2 && step3) {
      step2.classList.remove('active');
      step3.classList.add('active');
    }

    if (progressStep1) {
      progressStep1.classList.add('completed');
      progressStep1.classList.remove('active');
    }
    if (progressStep2) {
      progressStep2.classList.add('completed');
      progressStep2.classList.remove('active');
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
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   Popup Enquiry Modal Controller (with Show Interest & Notify Me Prefill Support)
   ========================================================================== */
function initEnquiryModal() {
  const modal = document.getElementById('enquiry-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const successCloseBtn = document.getElementById('modal-success-close');
  const form = document.getElementById('modal-enquiry-form');
  const successState = document.getElementById('modal-success-state');
  const modalHead = modal ? modal.querySelector('.modal-head') : null;

  const enquireButtons = document.querySelectorAll('.btn-counselling-modal, .header-counselling-btn, .btn-enquire-now');

  if (!modal) return;

  function openModal(e, options = {}) {
    if (e && e.preventDefault) e.preventDefault();

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (form) {
      form.style.display = 'grid';
      if (options.source) {
        form.dataset.source = options.source;
      } else {
        delete form.dataset.source;
      }
    }
    if (successState) successState.style.display = 'none';

    if (modalHead) {
      modalHead.style.display = '';
      const headTitle = modalHead.querySelector('h3');
      const headSub = modalHead.querySelector('p');

      if (options.title && headTitle) {
        headTitle.textContent = options.title;
      } else if (headTitle) {
        headTitle.textContent = 'Enquire Now';
      }

      if (options.subtitle && headSub) {
        headSub.textContent = options.subtitle;
      } else if (headSub) {
        headSub.textContent = 'Fill out the form below, and our academic counsellor will get in touch with you shortly.';
      }
    }

    if (options.message) {
      const messageEl = document.getElementById('modal-message');
      if (messageEl) messageEl.value = options.message;
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (form) delete form.dataset.source;
  }

  enquireButtons.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  // Attach handlers for Show Interest & Notify Me buttons dynamically
  document.body.addEventListener('click', (e) => {
    const interestBtn = e.target.closest('.btn-show-interest');
    const notifyBtn = e.target.closest('.btn-notify-me');

    if (!interestBtn && !notifyBtn) return;

    e.preventDefault();

    const triggerBtn = interestBtn || notifyBtn;
    const isNotify = !!notifyBtn;
    const customSource = triggerBtn.dataset.source || (isNotify ? 'Program Notify Me' : 'Program Interest');
    const context = triggerBtn.dataset.context || '';

    // Read active filter selections
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
      message: prefilledMessage
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const ccSelect = form.querySelector('select[name="modal_country_code"]');
      const countryCode = ccSelect ? ccSelect.value : '';

      const phoneEl = document.getElementById('modal-phone');
      const nameEl = document.getElementById('modal-name');
      const emailEl = document.getElementById('modal-email');
      const roleEl = document.getElementById('modal-role');
      const messageEl = document.getElementById('modal-message');

      const phoneVal = phoneEl ? phoneEl.value.trim() : '';
      const nameVal = nameEl ? nameEl.value.trim() : '';
      const emailVal = emailEl ? emailEl.value.trim() : '';

      if (!nameVal || !emailVal || !phoneVal) {
        alert('Please fill in all required fields.');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Submit Enquiry';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting...';
      }

      const pagePath = window.location.pathname || 'programs.html';
      const sourceTag = form.dataset.source || 'popup';

      const payload = {
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        countryCode: countryCode,
        profile: roleEl ? roleEl.value : '',
        course: document.title || 'VetNova Programs',
        message: messageEl ? messageEl.value.trim() : '',
        source: sourceTag,
        sourcePage: pagePath
      };

      try {
        if (typeof submitEnquiry !== 'function') {
          throw new Error('API client script (api.js) failed to load. Please refresh the page and try again.');
        }
        await submitEnquiry(payload);

        form.style.display = 'none';
        if (successState) successState.style.display = 'flex';
        if (modalHead) modalHead.style.display = 'none';
        form.reset();
      } catch (err) {
        console.error('Modal Enquiry Submission error:', err);
        alert(err.message || 'Unable to submit enquiry. Please check your connection and try again.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
      }
    });
  }
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
  // ==================== GRADE 1 — BASIC ====================
  // Track 1: Fresh Graduates & Interns
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
    image: "assets/images/programs/program-skill-up.webp",
  },
  {
    id: "demo-g1-fg-1",
    title: "Veterinary Clinical Foundations",
    slug: "veterinary-clinical-foundations",
    grade: 1,
    gradeCode: "grade-1",
    gradeName: "Basic",
    gradeLabel: "Grade 1 — Basic",
    track: "fresh-graduates",
    trackName: "Fresh Graduates & Interns",
    trackLabel: "Fresh Graduates & Interns",
    description: "Foundational clinical principles, patient physical examination protocols, and entry-level practical skill development for new veterinary graduates.",
    status: "demo",
    isDemo: true,
    url: "#demo-veterinary-clinical-foundations",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g1-fg-2",
    title: "Essential Clinical Skills Workshop",
    slug: "essential-clinical-skills-workshop",
    grade: 1,
    gradeCode: "grade-1",
    gradeName: "Basic",
    gradeLabel: "Grade 1 — Basic",
    track: "fresh-graduates",
    trackName: "Fresh Graduates & Interns",
    trackLabel: "Fresh Graduates & Interns",
    description: "Hands-on introductory workshop covering basic patient handling, diagnostic sampling, catheterization, and essential clinical procedures.",
    status: "demo",
    isDemo: true,
    url: "#demo-essential-clinical-skills-workshop",
    deliveryMode: "workshop",
    duration: "1 Week"
  },
  // Track 2: Practicing Veterinarians
  {
    id: "demo-g1-pv-1",
    title: "Everyday Clinical Essentials",
    slug: "everyday-clinical-essentials",
    grade: 1,
    gradeCode: "grade-1",
    gradeName: "Basic",
    gradeLabel: "Grade 1 — Basic",
    track: "practicing-vets",
    trackName: "Practicing Veterinarians",
    trackLabel: "Practicing Veterinarians",
    description: "Core practical refresher covering routine companion animal consultations, outpatient treatment protocols, and clinic workflow fundamentals.",
    status: "demo",
    isDemo: true,
    url: "#demo-everyday-clinical-essentials",
    deliveryMode: "offline",
    duration: "1 Week"
  },
  {
    id: "demo-g1-pv-2",
    title: "Basic Practice Skills Refresher",
    slug: "basic-practice-skills-refresher",
    grade: 1,
    gradeCode: "grade-1",
    gradeName: "Basic",
    gradeLabel: "Grade 1 — Basic",
    track: "practicing-vets",
    trackName: "Practicing Veterinarians",
    trackLabel: "Practicing Veterinarians",
    description: "Practical review of essential diagnostic and therapeutic skills for clinicians updating or returning to active small animal practice.",
    status: "demo",
    isDemo: true,
    url: "#demo-basic-practice-skills-refresher",
    deliveryMode: "offline",
    duration: "3 Days"
  },
  // Track 3: Diagnostic Specialization
  {
    id: "demo-g1-ds-1",
    title: "Basic Veterinary Diagnostics",
    slug: "basic-veterinary-diagnostics",
    grade: 1,
    gradeCode: "grade-1",
    gradeName: "Basic",
    gradeLabel: "Grade 1 — Basic",
    track: "diagnostic-specialization",
    trackName: "Diagnostic Specialization",
    trackLabel: "Diagnostic Specialization",
    description: "Introduction to in-clinic laboratory diagnostics, blood smear examination, urinalysis, and rapid point-of-care test interpretation.",
    status: "demo",
    isDemo: true,
    url: "#demo-basic-veterinary-diagnostics",
    deliveryMode: "offline",
    duration: "1 Week"
  },
  {
    id: "demo-g1-ds-2",
    title: "Introduction to Diagnostic Imaging",
    slug: "introduction-to-diagnostic-imaging",
    grade: 1,
    gradeCode: "grade-1",
    gradeName: "Basic",
    gradeLabel: "Grade 1 — Basic",
    track: "diagnostic-specialization",
    trackName: "Diagnostic Specialization",
    trackLabel: "Diagnostic Specialization",
    description: "Foundational principles of digital radiography positioning, X-ray safety, and introductory ultrasound probe orientation for beginners.",
    status: "demo",
    isDemo: true,
    url: "#demo-introduction-to-diagnostic-imaging",
    deliveryMode: "workshop",
    duration: "3 Days"
  },
  // Track 4: Emergency & Critical Care
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
    image: "assets/images/programs/program-first-aid.webp",
  },
  {
    id: "demo-g1-ec-1",
    title: "Emergency Care Fundamentals",
    slug: "emergency-care-fundamentals",
    grade: 1,
    gradeCode: "grade-1",
    gradeName: "Basic",
    gradeLabel: "Grade 1 — Basic",
    track: "emergency-care",
    trackName: "Emergency & Critical Care",
    trackLabel: "Emergency & Critical Care",
    description: "Foundational training in acute patient triage, vital signs assessment, and immediate stabilization protocols for emergency presentations.",
    status: "demo",
    isDemo: true,
    url: "#demo-emergency-care-fundamentals",
    deliveryMode: "offline",
    duration: "3 Days"
  },
  {
    id: "demo-g1-ec-2",
    title: "Basic Veterinary First Response",
    slug: "basic-veterinary-first-response",
    grade: 1,
    gradeCode: "grade-1",
    gradeName: "Basic",
    gradeLabel: "Grade 1 — Basic",
    track: "emergency-care",
    trackName: "Emergency & Critical Care",
    trackLabel: "Emergency & Critical Care",
    description: "Essential skills for acute trauma management, airway maintenance, hemorrhage control, and initial fluid resuscitation algorithms.",
    status: "demo",
    isDemo: true,
    url: "#demo-basic-veterinary-first-response",
    deliveryMode: "workshop",
    duration: "2 Days"
  },
  // Track 5: Vet Nurse & Paravet Staff
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
    image: "assets/images/programs/program-nurse.webp",
  },
  {
    id: "demo-g1-vn-1",
    title: "Veterinary Nursing Foundations",
    slug: "veterinary-nursing-foundations",
    grade: 1,
    gradeCode: "grade-1",
    gradeName: "Basic",
    gradeLabel: "Grade 1 — Basic",
    track: "vet-nurse",
    trackName: "Vet Nurse & Paravet Staff",
    trackLabel: "Vet Nurse & Paravet Staff",
    description: "Essential veterinary nursing principles, humane animal restraint, IV catheter placement, and inpatient record maintenance.",
    status: "demo",
    isDemo: true,
    url: "#demo-veterinary-nursing-foundations",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g1-vn-2",
    title: "Essential Paravet Clinical Skills",
    slug: "essential-paravet-clinical-skills",
    grade: 1,
    gradeCode: "grade-1",
    gradeName: "Basic",
    gradeLabel: "Grade 1 — Basic",
    track: "vet-nurse",
    trackName: "Vet Nurse & Paravet Staff",
    trackLabel: "Vet Nurse & Paravet Staff",
    description: "Practical workshop focusing on surgical instrument sterilization, operating room prep, and patient vital monitoring.",
    status: "demo",
    isDemo: true,
    url: "#demo-essential-paravet-clinical-skills",
    deliveryMode: "workshop",
    duration: "1 Week"
  },

  // ==================== GRADE 2 — INTERMEDIATE ====================
  // Track 1: Fresh Graduates & Interns
  {
    id: "demo-g2-fg-1",
    title: "Clinical Skills Development",
    slug: "clinical-skills-development",
    grade: 2,
    gradeCode: "grade-2",
    gradeName: "Intermediate",
    gradeLabel: "Grade 2 — Intermediate",
    track: "fresh-graduates",
    trackName: "Fresh Graduates & Interns",
    trackLabel: "Fresh Graduates & Interns",
    description: "Intermediate practical module enhancing clinical autonomy, routine surgical assistance, therapeutic dosing, and case management.",
    status: "demo",
    isDemo: true,
    url: "#demo-clinical-skills-development",
    deliveryMode: "offline",
    duration: "3 Weeks"
  },
  {
    id: "demo-g2-fg-2",
    title: "Intermediate Veterinary Practice",
    slug: "intermediate-veterinary-practice",
    grade: 2,
    gradeCode: "grade-2",
    gradeName: "Intermediate",
    gradeLabel: "Grade 2 — Intermediate",
    track: "fresh-graduates",
    trackName: "Fresh Graduates & Interns",
    trackLabel: "Fresh Graduates & Interns",
    description: "Building confidence in handling outpatient cases, abdominal diagnostic workups, and standard veterinary procedures.",
    status: "demo",
    isDemo: true,
    url: "#demo-intermediate-veterinary-practice",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  // Track 2: Practicing Veterinarians
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
    image: "assets/images/programs/program-surgery.webp",
  },
  {
    id: "demo-g2-pv-1",
    title: "Intermediate Clinical Practice",
    slug: "intermediate-clinical-practice",
    grade: 2,
    gradeCode: "grade-2",
    gradeName: "Intermediate",
    gradeLabel: "Grade 2 — Intermediate",
    track: "practicing-vets",
    trackName: "Practicing Veterinarians",
    trackLabel: "Practicing Veterinarians",
    description: "Refining diagnostic accuracy, anesthesia monitoring, and surgical technique in routine soft tissue interventions.",
    status: "demo",
    isDemo: true,
    url: "#demo-intermediate-clinical-practice",
    deliveryMode: "offline",
    duration: "1 Week"
  },
  {
    id: "demo-g2-pv-2",
    title: "Applied Veterinary Skills",
    slug: "applied-veterinary-skills",
    grade: 2,
    gradeCode: "grade-2",
    gradeName: "Intermediate",
    gradeLabel: "Grade 2 — Intermediate",
    track: "practicing-vets",
    trackName: "Practicing Veterinarians",
    trackLabel: "Practicing Veterinarians",
    description: "Practical workshop focusing on abdominal organ evaluation, surgical knotting techniques, and patient recovery management.",
    status: "demo",
    isDemo: true,
    url: "#demo-applied-veterinary-skills",
    deliveryMode: "workshop",
    duration: "3 Days"
  },
  // Track 3: Diagnostic Specialization
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
    image: "assets/images/programs/program-radiology.webp",
  },
  {
    id: "demo-g2-ds-1",
    title: "Diagnostic Imaging Essentials",
    slug: "diagnostic-imaging-essentials",
    grade: 2,
    gradeCode: "grade-2",
    gradeName: "Intermediate",
    gradeLabel: "Grade 2 — Intermediate",
    track: "diagnostic-specialization",
    trackName: "Diagnostic Specialization",
    trackLabel: "Diagnostic Specialization",
    description: "Systematic approach to radiograph reading, abdominal organ evaluation, and digital imaging artifact recognition.",
    status: "demo",
    isDemo: true,
    url: "#demo-diagnostic-imaging-essentials",
    deliveryMode: "offline",
    duration: "1 Week"
  },
  {
    id: "demo-g2-ds-2",
    title: "Intermediate Ultrasound Skills",
    slug: "intermediate-ultrasound-skills",
    grade: 2,
    gradeCode: "grade-2",
    gradeName: "Intermediate",
    gradeLabel: "Grade 2 — Intermediate",
    track: "diagnostic-specialization",
    trackName: "Diagnostic Specialization",
    trackLabel: "Diagnostic Specialization",
    description: "Hands-on abdominal FAST scanning, organ gain adjustment, and acoustic window optimization techniques.",
    status: "demo",
    isDemo: true,
    url: "#demo-intermediate-ultrasound-skills",
    deliveryMode: "workshop",
    duration: "3 Days"
  },
  // Track 4: Emergency & Critical Care
  {
    id: "demo-g2-ec-1",
    title: "Intermediate Emergency & ICU Care",
    slug: "intermediate-emergency-icu-care",
    grade: 2,
    gradeCode: "grade-2",
    gradeName: "Intermediate",
    gradeLabel: "Grade 2 — Intermediate",
    track: "emergency-care",
    trackName: "Emergency & Critical Care",
    trackLabel: "Emergency & Critical Care",
    description: "Managing acute dyspnea, fluid resuscitation titration, vascular access, and continuous vital sign monitoring in emergency patients.",
    status: "demo",
    isDemo: true,
    url: "#demo-intermediate-emergency-icu-care",
    deliveryMode: "offline",
    duration: "1 Week"
  },
  {
    id: "demo-g2-ec-2",
    title: "Emergency Response Skills",
    slug: "emergency-response-skills",
    grade: 2,
    gradeCode: "grade-2",
    gradeName: "Intermediate",
    gradeLabel: "Grade 2 — Intermediate",
    track: "emergency-care",
    trackName: "Emergency & Critical Care",
    trackLabel: "Emergency & Critical Care",
    description: "Practical algorithms for toxic ingestion triage, traumatic shock stabilization, and emergency blood gas interpretation.",
    status: "demo",
    isDemo: true,
    url: "#demo-emergency-response-skills",
    deliveryMode: "workshop",
    duration: "2 Days"
  },
  // Track 5: Vet Nurse & Paravet Staff
  {
    id: "demo-g2-vn-1",
    title: "Intermediate Veterinary Nursing",
    slug: "intermediate-veterinary-nursing",
    grade: 2,
    gradeCode: "grade-2",
    gradeName: "Intermediate",
    gradeLabel: "Grade 2 — Intermediate",
    track: "vet-nurse",
    trackName: "Vet Nurse & Paravet Staff",
    trackLabel: "Vet Nurse & Paravet Staff",
    description: "Advanced nursing protocols for surgical assistant scrub duties, multiparameter vitals monitoring, and ICU inpatient care.",
    status: "demo",
    isDemo: true,
    url: "#demo-intermediate-veterinary-nursing",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g2-vn-2",
    title: "Applied Paravet Clinical Care",
    slug: "applied-paravet-clinical-care",
    grade: 2,
    gradeCode: "grade-2",
    gradeName: "Intermediate",
    gradeLabel: "Grade 2 — Intermediate",
    track: "vet-nurse",
    trackName: "Vet Nurse & Paravet Staff",
    trackLabel: "Vet Nurse & Paravet Staff",
    description: "Practical training in anesthesia machine setup, endotracheal intubation assistance, and post-operative recovery care.",
    status: "demo",
    isDemo: true,
    url: "#demo-applied-paravet-clinical-care",
    deliveryMode: "workshop",
    duration: "1 Week"
  },

  // ==================== GRADE 3 — COMPETITIVE ====================
  // Track 1: Fresh Graduates & Interns
  {
    id: "demo-g3-fg-1",
    title: "Advanced Clinical Skill Preparation",
    slug: "advanced-clinical-skill-preparation",
    grade: 3,
    gradeCode: "grade-3",
    gradeName: "Competitive",
    gradeLabel: "Grade 3 — Competitive",
    track: "fresh-graduates",
    trackName: "Fresh Graduates & Interns",
    trackLabel: "Fresh Graduates & Interns",
    description: "Targeted training to prepare junior clinicians for independent emergency shifts and surgical caseloads.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-clinical-skill-preparation",
    deliveryMode: "offline",
    duration: "3 Weeks"
  },
  {
    id: "demo-g3-fg-2",
    title: "Competitive Veterinary Skills",
    slug: "competitive-veterinary-skills",
    grade: 3,
    gradeCode: "grade-3",
    gradeName: "Competitive",
    gradeLabel: "Grade 3 — Competitive",
    track: "fresh-graduates",
    trackName: "Fresh Graduates & Interns",
    trackLabel: "Fresh Graduates & Interns",
    description: "Intensive practical module designed to elevate clinical speed, precision, and multi-system diagnostic confidence.",
    status: "demo",
    isDemo: true,
    url: "#demo-competitive-veterinary-skills",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  // Track 2: Practicing Veterinarians
  {
    id: "demo-g3-pv-1",
    title: "Competitive Clinical Skills Program",
    slug: "competitive-clinical-skills-program",
    grade: 3,
    gradeCode: "grade-3",
    gradeName: "Competitive",
    gradeLabel: "Grade 3 — Competitive",
    track: "practicing-vets",
    trackName: "Practicing Veterinarians",
    trackLabel: "Practicing Veterinarians",
    description: "Comprehensive procedural skill elevation covering complex soft tissue surgeries and diagnostic integration.",
    status: "demo",
    isDemo: true,
    url: "#demo-competitive-clinical-skills-program",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g3-pv-2",
    title: "Advanced Practice Development",
    slug: "advanced-practice-development",
    grade: 3,
    gradeCode: "grade-3",
    gradeName: "Competitive",
    gradeLabel: "Grade 3 — Competitive",
    track: "practicing-vets",
    trackName: "Practicing Veterinarians",
    trackLabel: "Practicing Veterinarians",
    description: "Mastering advanced surgical approaches, emergency triage algorithms, and clinical case management.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-practice-development",
    deliveryMode: "offline",
    duration: "1 Week"
  },
  // Track 3: Diagnostic Specialization
  {
    id: "demo-g3-ds-1",
    title: "Advanced Diagnostic Imaging",
    slug: "advanced-diagnostic-imaging",
    grade: 3,
    gradeCode: "grade-3",
    gradeName: "Competitive",
    gradeLabel: "Grade 3 — Competitive",
    track: "diagnostic-specialization",
    trackName: "Diagnostic Specialization",
    trackLabel: "Diagnostic Specialization",
    description: "In-depth ultrasonography of abdominal organs, Doppler evaluation, and complex radiograph reading.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-diagnostic-imaging",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g3-ds-2",
    title: "Competitive Radiology & Ultrasound",
    slug: "competitive-radiology-ultrasound",
    grade: 3,
    gradeCode: "grade-3",
    gradeName: "Competitive",
    gradeLabel: "Grade 3 — Competitive",
    track: "diagnostic-specialization",
    trackName: "Diagnostic Specialization",
    trackLabel: "Diagnostic Specialization",
    description: "Advanced diagnostic imaging course focusing on soft tissue pathology mapping and echocardiographic screening.",
    status: "demo",
    isDemo: true,
    url: "#demo-competitive-radiology-ultrasound",
    deliveryMode: "workshop",
    duration: "1 Week"
  },
  // Track 4: Emergency & Critical Care
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
    image: "assets/images/programs/program-emergency.webp",
  },
  {
    id: "demo-g3-ec-1",
    title: "Emergency & Critical Care Mastery",
    slug: "emergency-critical-care-mastery",
    grade: 3,
    gradeCode: "grade-3",
    gradeName: "Competitive",
    gradeLabel: "Grade 3 — Competitive",
    track: "emergency-care",
    trackName: "Emergency & Critical Care",
    trackLabel: "Emergency & Critical Care",
    description: "RECOVER CPR algorithm execution, mechanical ventilation basics, and acute trauma patient resuscitation.",
    status: "demo",
    isDemo: true,
    url: "#demo-emergency-critical-care-mastery",
    deliveryMode: "offline",
    duration: "1 Week"
  },
  {
    id: "demo-g3-ec-2",
    title: "Advanced Emergency Response",
    slug: "advanced-emergency-response",
    grade: 3,
    gradeCode: "grade-3",
    gradeName: "Competitive",
    gradeLabel: "Grade 3 — Competitive",
    track: "emergency-care",
    trackName: "Emergency & Critical Care",
    trackLabel: "Emergency & Critical Care",
    description: "Managing life-threatening emergencies, acid-base disorders, and intensive care patient monitoring.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-emergency-response",
    deliveryMode: "workshop",
    duration: "3 Days"
  },
  // Track 5: Vet Nurse & Paravet Staff
  {
    id: "demo-g3-vn-1",
    title: "Advanced Nursing & Paravet Skills",
    slug: "advanced-nursing-paravet-skills",
    grade: 3,
    gradeCode: "grade-3",
    gradeName: "Competitive",
    gradeLabel: "Grade 3 — Competitive",
    track: "vet-nurse",
    trackName: "Vet Nurse & Paravet Staff",
    trackLabel: "Vet Nurse & Paravet Staff",
    description: "High-level clinical nursing, critical care patient monitoring, and surgical suite management.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-nursing-paravet-skills",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g3-vn-2",
    title: "Competitive Veterinary Nursing",
    slug: "competitive-veterinary-nursing",
    grade: 3,
    gradeCode: "grade-3",
    gradeName: "Competitive",
    gradeLabel: "Grade 3 — Competitive",
    track: "vet-nurse",
    trackName: "Vet Nurse & Paravet Staff",
    trackLabel: "Vet Nurse & Paravet Staff",
    description: "Specialized nursing interventions, emergency drug dosing calculations, and complex wound dressing mastery.",
    status: "demo",
    isDemo: true,
    url: "#demo-competitive-veterinary-nursing",
    deliveryMode: "workshop",
    duration: "1 Week"
  },

  // ==================== GRADE 4 — ADVANCED ====================
  // Track 1: Fresh Graduates & Interns
  {
    id: "demo-g4-fg-1",
    title: "Advanced Veterinary Clinical Practice",
    slug: "advanced-veterinary-clinical-practice",
    grade: 4,
    gradeCode: "grade-4",
    gradeName: "Advanced",
    gradeLabel: "Grade 4 — Advanced",
    track: "fresh-graduates",
    trackName: "Fresh Graduates & Interns",
    trackLabel: "Fresh Graduates & Interns",
    description: "Intensive clinical transition training for high-volume surgical and emergency practice environments.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-veterinary-clinical-practice",
    deliveryMode: "offline",
    duration: "4 Weeks"
  },
  {
    id: "demo-g4-fg-2",
    title: "Advanced Clinical Skills Workshop",
    slug: "advanced-clinical-skills-workshop",
    grade: 4,
    gradeCode: "grade-4",
    gradeName: "Advanced",
    gradeLabel: "Grade 4 — Advanced",
    track: "fresh-graduates",
    trackName: "Fresh Graduates & Interns",
    trackLabel: "Fresh Graduates & Interns",
    description: "Advanced hands-on workshop covering specialized soft tissue procedures, emergency triage, and diagnostic workflows.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-clinical-skills-workshop",
    deliveryMode: "workshop",
    duration: "2 Weeks"
  },
  // Track 2: Practicing Veterinarians
  {
    id: "demo-g4-pv-1",
    title: "Advanced Surgical Practice",
    slug: "advanced-surgical-practice",
    grade: 4,
    gradeCode: "grade-4",
    gradeName: "Advanced",
    gradeLabel: "Grade 4 — Advanced",
    track: "practicing-vets",
    trackName: "Practicing Veterinarians",
    trackLabel: "Practicing Veterinarians",
    description: "Complex abdominal surgeries, gastrointestinal resection, reconstructive wound closure, and surgical oncology basics.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-surgical-practice",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g4-pv-2",
    title: "Advanced Clinical Practice Mastery",
    slug: "advanced-clinical-practice-mastery",
    grade: 4,
    gradeCode: "grade-4",
    gradeName: "Advanced",
    gradeLabel: "Grade 4 — Advanced",
    track: "practicing-vets",
    trackName: "Practicing Veterinarians",
    trackLabel: "Practicing Veterinarians",
    description: "Mastery-level training for experienced practitioners expanding their surgical and diagnostic clinical portfolio.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-clinical-practice-mastery",
    deliveryMode: "offline",
    duration: "1 Week"
  },
  // Track 3: Diagnostic Specialization
  {
    id: "demo-g4-ds-1",
    title: "Advanced Radiology & Ultrasound",
    slug: "advanced-radiology-ultrasound",
    grade: 4,
    gradeCode: "grade-4",
    gradeName: "Advanced",
    gradeLabel: "Grade 4 — Advanced",
    track: "diagnostic-specialization",
    trackName: "Diagnostic Specialization",
    trackLabel: "Diagnostic Specialization",
    description: "Comprehensive diagnostic imaging covering fine-needle aspiration under ultrasound, cardiac screening, and contrast X-rays.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-radiology-ultrasound",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g4-ds-2",
    title: "Advanced Diagnostic Imaging Practice",
    slug: "advanced-diagnostic-imaging-practice",
    grade: 4,
    gradeCode: "grade-4",
    gradeName: "Advanced",
    gradeLabel: "Grade 4 — Advanced",
    track: "diagnostic-specialization",
    trackName: "Diagnostic Specialization",
    trackLabel: "Diagnostic Specialization",
    description: "Advanced probe manipulation, vascular Doppler, and complex multi-organ pathology interpretation.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-diagnostic-imaging-practice",
    deliveryMode: "workshop",
    duration: "1 Week"
  },
  // Track 4: Emergency & Critical Care
  {
    id: "demo-g4-ec-1",
    title: "Advanced Emergency & ICU Practice",
    slug: "advanced-emergency-icu-practice",
    grade: 4,
    gradeCode: "grade-4",
    gradeName: "Advanced",
    gradeLabel: "Grade 4 — Advanced",
    track: "emergency-care",
    trackName: "Emergency & Critical Care",
    trackLabel: "Emergency & Critical Care",
    description: "Intensive critical care training covering sepsis protocols, blood transfusion therapy, and multi-organ dysfunction management.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-emergency-icu-practice",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g4-ec-2",
    title: "Advanced Critical Care Skills",
    slug: "advanced-critical-care-skills",
    grade: 4,
    gradeCode: "grade-4",
    gradeName: "Advanced",
    gradeLabel: "Grade 4 — Advanced",
    track: "emergency-care",
    trackName: "Emergency & Critical Care",
    trackLabel: "Emergency & Critical Care",
    description: "Specialized ICU procedures, central line placement, chest tube insertion, and advanced hemodynamic monitoring.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-critical-care-skills",
    deliveryMode: "workshop",
    duration: "1 Week"
  },
  // Track 5: Vet Nurse & Paravet Staff
  {
    id: "demo-g4-vn-1",
    title: "Advanced Veterinary Nursing Practice",
    slug: "advanced-veterinary-nursing-practice",
    grade: 4,
    gradeCode: "grade-4",
    gradeName: "Advanced",
    gradeLabel: "Grade 4 — Advanced",
    track: "vet-nurse",
    trackName: "Vet Nurse & Paravet Staff",
    trackLabel: "Vet Nurse & Paravet Staff",
    description: "Senior nursing leadership, emergency triage coordination, and advanced surgical assistant protocols.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-veterinary-nursing-practice",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g4-vn-2",
    title: "Advanced Paravet Clinical Care",
    slug: "advanced-paravet-clinical-care",
    grade: 4,
    gradeCode: "grade-4",
    gradeName: "Advanced",
    gradeLabel: "Grade 4 — Advanced",
    track: "vet-nurse",
    trackName: "Vet Nurse & Paravet Staff",
    trackLabel: "Vet Nurse & Paravet Staff",
    description: "Advanced laboratory diagnostics, cytology slide staining, blood smear evaluation, and intensive inpatient nursing.",
    status: "demo",
    isDemo: true,
    url: "#demo-advanced-paravet-clinical-care",
    deliveryMode: "workshop",
    duration: "1 Week"
  },

  // ==================== GRADE 5 — PRO ====================
  // Track 1: Fresh Graduates & Interns
  {
    id: "demo-g5-fg-1",
    title: "Professional Veterinary Clinical Mastery",
    slug: "professional-veterinary-clinical-mastery",
    grade: 5,
    gradeCode: "grade-5",
    gradeName: "Pro",
    gradeLabel: "Grade 5 — Pro",
    track: "fresh-graduates",
    trackName: "Fresh Graduates & Interns",
    trackLabel: "Fresh Graduates & Interns",
    description: "Masterclass-level transition program preparing top-tier graduates for senior clinical responsibilities.",
    status: "demo",
    isDemo: true,
    url: "#demo-professional-veterinary-clinical-mastery",
    deliveryMode: "offline",
    duration: "4 Weeks"
  },
  {
    id: "demo-g5-fg-2",
    title: "Pro-Level Clinical Skills",
    slug: "pro-level-clinical-skills",
    grade: 5,
    gradeCode: "grade-5",
    gradeName: "Pro",
    gradeLabel: "Grade 5 — Pro",
    track: "fresh-graduates",
    trackName: "Fresh Graduates & Interns",
    trackLabel: "Fresh Graduates & Interns",
    description: "Comprehensive expert-led clinical immersion in advanced diagnostic reasoning and complex surgical decision-making.",
    status: "demo",
    isDemo: true,
    url: "#demo-pro-level-clinical-skills",
    deliveryMode: "workshop",
    duration: "2 Weeks"
  },
  // Track 2: Practicing Veterinarians
  {
    id: "demo-g5-pv-1",
    title: "Professional Surgical Masterclass",
    slug: "professional-surgical-masterclass",
    grade: 5,
    gradeCode: "grade-5",
    gradeName: "Pro",
    gradeLabel: "Grade 5 — Pro",
    track: "practicing-vets",
    trackName: "Practicing Veterinarians",
    trackLabel: "Practicing Veterinarians",
    description: "Expert-level surgical suite masterclass focusing on complex reconstructive, thoracic, and emergency surgical procedures.",
    status: "demo",
    isDemo: true,
    url: "#demo-professional-surgical-masterclass",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g5-pv-2",
    title: "Pro Clinical Practice Mastery",
    slug: "pro-clinical-practice-mastery",
    grade: 5,
    gradeCode: "grade-5",
    gradeName: "Pro",
    gradeLabel: "Grade 5 — Pro",
    track: "practicing-vets",
    trackName: "Practicing Veterinarians",
    trackLabel: "Practicing Veterinarians",
    description: "Premier clinical development program for clinic directors and senior veterinary surgeons.",
    status: "demo",
    isDemo: true,
    url: "#demo-pro-clinical-practice-mastery",
    deliveryMode: "offline",
    duration: "1 Week"
  },
  // Track 3: Diagnostic Specialization
  {
    id: "demo-g5-ds-1",
    title: "Professional Diagnostic Imaging Masterclass",
    slug: "professional-diagnostic-imaging-masterclass",
    grade: 5,
    gradeCode: "grade-5",
    gradeName: "Pro",
    gradeLabel: "Grade 5 — Pro",
    track: "diagnostic-specialization",
    trackName: "Diagnostic Specialization",
    trackLabel: "Diagnostic Specialization",
    description: "Pro-level masterclass in advanced diagnostic ultrasound, echocardiography, and complex radiological interpretation.",
    status: "demo",
    isDemo: true,
    url: "#demo-professional-diagnostic-imaging-masterclass",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g5-ds-2",
    title: "Pro Radiology & Ultrasound",
    slug: "pro-radiology-ultrasound",
    grade: 5,
    gradeCode: "grade-5",
    gradeName: "Pro",
    gradeLabel: "Grade 5 — Pro",
    track: "diagnostic-specialization",
    trackName: "Diagnostic Specialization",
    trackLabel: "Diagnostic Specialization",
    description: "Expert diagnostic imaging refinement for specialists seeking highest-level diagnostic accuracy in small animal practice.",
    status: "demo",
    isDemo: true,
    url: "#demo-pro-radiology-ultrasound",
    deliveryMode: "workshop",
    duration: "1 Week"
  },
  // Track 4: Emergency & Critical Care
  {
    id: "demo-g5-ec-1",
    title: "Professional Emergency & Critical Care",
    slug: "professional-emergency-critical-care",
    grade: 5,
    gradeCode: "grade-5",
    gradeName: "Pro",
    gradeLabel: "Grade 5 — Pro",
    track: "emergency-care",
    trackName: "Emergency & Critical Care",
    trackLabel: "Emergency & Critical Care",
    description: "Pro-level emergency medicine masterclass covering advanced life support, multi-system trauma, and ICU director workflows.",
    status: "demo",
    isDemo: true,
    url: "#demo-professional-emergency-critical-care",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g5-ec-2",
    title: "Pro-Level ICU Mastery",
    slug: "pro-level-icu-mastery",
    grade: 5,
    gradeCode: "grade-5",
    gradeName: "Pro",
    gradeLabel: "Grade 5 — Pro",
    track: "emergency-care",
    trackName: "Emergency & Critical Care",
    trackLabel: "Emergency & Critical Care",
    description: "Mastery of critical care algorithms, continuous invasive monitoring, and emergency surgical stabilization.",
    status: "demo",
    isDemo: true,
    url: "#demo-pro-level-icu-mastery",
    deliveryMode: "workshop",
    duration: "1 Week"
  },
  // Track 5: Vet Nurse & Paravet Staff
  {
    id: "demo-g5-vn-1",
    title: "Professional Veterinary Nursing Masterclass",
    slug: "professional-veterinary-nursing-masterclass",
    grade: 5,
    gradeCode: "grade-5",
    gradeName: "Pro",
    gradeLabel: "Grade 5 — Pro",
    track: "vet-nurse",
    trackName: "Vet Nurse & Paravet Staff",
    trackLabel: "Vet Nurse & Paravet Staff",
    description: "Executive-level nursing management, operating theater direction, and senior paravet clinical leadership.",
    status: "demo",
    isDemo: true,
    url: "#demo-professional-veterinary-nursing-masterclass",
    deliveryMode: "offline",
    duration: "2 Weeks"
  },
  {
    id: "demo-g5-vn-2",
    title: "Pro Paravet Clinical Practice",
    slug: "pro-paravet-clinical-practice",
    grade: 5,
    gradeCode: "grade-5",
    gradeName: "Pro",
    gradeLabel: "Grade 5 — Pro",
    track: "vet-nurse",
    trackName: "Vet Nurse & Paravet Staff",
    trackLabel: "Vet Nurse & Paravet Staff",
    description: "Pro-level clinical skills for head veterinary nurses overseeing ICU monitoring, anesthesia safety, and assistant training.",
    status: "demo",
    isDemo: true,
    url: "#demo-pro-paravet-clinical-practice",
    deliveryMode: "workshop",
    duration: "1 Week"
  }
];

/* Realtime Grade & Track Program Filter Controller */
function initProgramFilters() {
  const searchInput = document.getElementById('program-search-input');
  const gradeSelect = document.getElementById('filter-grade') || document.getElementById('filter-level');
  const trackSelect = document.getElementById('filter-track') || document.getElementById('filter-topic');
  const modeSelect = document.getElementById('filter-mode');
  const dynamicContainer = document.getElementById('programs-dynamic-grid');
  const noResultsState = document.getElementById('no-programs-match');
  const clearFiltersBtn = document.getElementById('btn-clear-filters');
  const gradeCards = document.querySelectorAll('.grade-card[data-grade]');
  const trackPills = document.querySelectorAll('.track-pill[data-track]');
  const selectedGradeTitle = document.getElementById('selected-grade-title');
  const personaBanner = document.getElementById('persona-discovery-banner');
  const personaCloseBtn = document.getElementById('persona-banner-reset');
  const countNumberEl = document.getElementById('count-number');

  if (!dynamicContainer && !gradeSelect && !trackSelect) return;

  const gradeNameMap = {
    'all': 'All Grades',
    'grade-1': 'Grade 1 — Basic',
    'grade-2': 'Grade 2 — Intermediate',
    'grade-3': 'Grade 3 — Competitive',
    'grade-4': 'Grade 4 — Advanced',
    'grade-5': 'Grade 5 — Pro'
  };

  const trackNameMap = {
    'all': 'All Tracks',
    'fresh-graduates': 'Fresh Graduates & Interns',
    'practicing-vets': 'Practicing Veterinarians',
    'diagnostic-specialization': 'Diagnostic Specialization',
    'emergency-care': 'Emergency & Critical Care',
    'vet-nurse': 'Vet Nurse & Paravet Staff'
  };

  function filterPrograms() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const gradeFilter = gradeSelect ? gradeSelect.value : 'all';
    const trackFilter = trackSelect ? trackSelect.value : 'all';
    const modeFilter = modeSelect ? modeSelect.value : 'all';

    // Sync Grade Card UI state
    gradeCards.forEach(gCard => {
      const gVal = gCard.dataset.grade;
      if (gVal === gradeFilter && gradeFilter !== 'all') {
        gCard.classList.add('active');
      } else {
        gCard.classList.remove('active');
      }
    });

    // Sync Track Pills UI state
    trackPills.forEach(tPill => {
      const tVal = tPill.dataset.track;
      if (tVal === trackFilter) {
        tPill.classList.add('active');
      } else {
        tPill.classList.remove('active');
      }
    });

    // Update Grade Selector title text
    if (selectedGradeTitle) {
      const gLabel = gradeNameMap[gradeFilter] || 'All Grades';
      const tLabel = trackNameMap[trackFilter] || 'All Tracks';
      selectedGradeTitle.innerHTML = `Showing: <strong>${gLabel}</strong> ${trackFilter !== 'all' ? '&bull; ' + tLabel : ''}`;
    }

    // Update Persona Adaptive Messaging Banner
    if (personaBanner) {
      const badgeText = document.getElementById('persona-badge-text');
      const titleText = document.getElementById('persona-title-text');
      const messageText = document.getElementById('persona-message-text');

      if (gradeFilter !== 'all' || trackFilter !== 'all' || modeFilter !== 'all' || query !== '') {
        personaBanner.style.display = 'flex';
        const gName = gradeNameMap[gradeFilter] || '';
        const tName = trackNameMap[trackFilter] || '';
        if (badgeText) badgeText.textContent = 'Filtered Pathway View';
        if (titleText) {
          if (gradeFilter !== 'all' && trackFilter !== 'all') {
            titleText.textContent = `${gName} • ${tName}`;
          } else if (gradeFilter !== 'all') {
            titleText.textContent = `${gName} Selected`;
          } else if (trackFilter !== 'all') {
            titleText.textContent = `${tName} Selected`;
          } else {
            titleText.textContent = `Search: "${query}"`;
          }
        }
        if (messageText) {
          messageText.textContent = `Exploring practical clinical learning pathways matching your selected criteria.`;
        }
      } else {
        personaBanner.style.display = 'none';
      }
    }

    // Strict AND Filter execution against window.VETNOVA_PROGRAMS_DATA
    const matched = window.VETNOVA_PROGRAMS_DATA.filter(p => {
      const matchesGrade = gradeFilter === 'all' || p.gradeCode === gradeFilter;
      const matchesTrack = trackFilter === 'all' || p.track === trackFilter;
      const matchesMode = modeFilter === 'all' || p.deliveryMode === modeFilter || (p.isDemo && modeFilter === 'offline');
      const matchesQuery = query === '' || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      return matchesGrade && matchesTrack && matchesMode && matchesQuery;
    });

    // Dynamic Program Count Update
    if (countNumberEl) {
      countNumberEl.textContent = matched.length;
    }

    // Empty state handling vs render cards
    if (noResultsState && dynamicContainer) {
      if (matched.length === 0) {
        noResultsState.style.display = 'block';
        dynamicContainer.style.display = 'none';
        dynamicContainer.innerHTML = '';
      } else {
        noResultsState.style.display = 'none';
        dynamicContainer.style.display = 'grid';
        
        dynamicContainer.innerHTML = matched.map(p => {
          const isDemo = p.isDemo;
          const badgeHTML = isDemo
            ? `<span class="badge-demo-pill"><i class="fa-solid fa-flask"></i> Demo Program</span>`
            : `<span class="badge-grade-pill grade-pill-${p.grade}">GRADE ${p.grade}</span>`;

          const pImg = p.image || getProgramImage(p);

          const footerHTML = isDemo
            ? `
              <div class="program-card-footer">
                <div class="program-card-price-row">
                  <span class="program-card-price-tag"><i class="fa-solid fa-layer-group"></i> ${p.gradeLabel}</span>
                </div>
                <div class="program-card-actions">
                  <button type="button" class="btn btn-outline btn-sm btn-demo-explore" data-title="${p.title}" data-grade="${p.gradeLabel}" data-track="${p.trackLabel}" data-desc="${p.description}">Explore Program</button>
                  <button type="button" class="btn btn-primary btn-sm btn-show-interest" data-source="Demo Program Enquiry" data-context="${p.title} (${p.gradeLabel})">Enquire Now</button>
                </div>
              </div>
            `
            : `
              <div class="program-card-footer">
                <div class="program-card-price-row">
                  <div class="program-card-price">${p.price || '₹38,000'} <small>+ GST</small></div>
                </div>
                <div class="program-card-actions">
                  <a class="btn btn-outline btn-sm" href="${p.url}">Explore Program <i class="fa-solid fa-arrow-right"></i></a>
                  <button type="button" class="btn btn-primary btn-sm btn-show-interest" data-source="Program Enquiry" data-context="${p.title}">Enquire Now</button>
                </div>
              </div>
            `;

          return `
            <div class="program-card ${isDemo ? 'demo-program-card' : ''}" data-grade="${p.gradeCode}" data-track="${p.track}">
              <div class="program-card-media" style="position: relative;">
                <div class="card-grade-badge-wrap" style="position: absolute; top: 12px; left: 12px; z-index: 2;">
                  ${badgeHTML}
                </div>
                <img src="${pImg}" alt="${p.title}" loading="lazy" decoding="async" />
              </div>
              <div class="program-card-body">
                <div class="card-hierarchy-breadcrumb" style="font-size: 0.8rem; color: #64748b; margin-bottom: 6px; font-weight: 500;">
                  <span>${p.gradeLabel}</span> &bull; <span>${p.trackLabel}</span>
                </div>
                <h3 class="program-card-title">${isDemo ? p.title : `<a href="${p.url}">${p.title}</a>`}</h3>
                <p class="program-card-desc">${p.description}</p>
                <div class="program-card-meta" style="margin-top: 12px; font-size: 0.84rem; color: #475569; display: flex; flex-wrap: wrap; gap: 12px;">
                  <div class="meta-item"><i class="fa-solid fa-signal text-teal"></i> ${p.gradeLabel}</div>
                  <div class="meta-item"><i class="fa-solid fa-book-open text-teal"></i> ${p.trackLabel}</div>
                </div>
                ${footerHTML}
              </div>
            </div>
          `;
        }).join('');
      }
    }

    updateRelatedPrograms(trackFilter);
  }

  function resetAllFilters() {
    if (searchInput) searchInput.value = '';
    if (gradeSelect) gradeSelect.value = 'all';
    if (trackSelect) trackSelect.value = 'all';
    if (modeSelect) modeSelect.value = 'all';
    if (personaBanner) personaBanner.style.display = 'none';
    gradeCards.forEach(c => c.classList.remove('active'));
    trackPills.forEach(p => {
      if (p.dataset.track === 'all') p.classList.add('active');
      else p.classList.remove('active');
    });
    filterPrograms();
  }

  // Bind Event Listeners
  if (searchInput) searchInput.addEventListener('input', filterPrograms);
  if (gradeSelect) gradeSelect.addEventListener('change', filterPrograms);
  if (trackSelect) trackSelect.addEventListener('change', filterPrograms);
  if (modeSelect) modeSelect.addEventListener('change', filterPrograms);
  if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', resetAllFilters);
  if (personaCloseBtn) personaCloseBtn.addEventListener('click', resetAllFilters);

  // Grade Card Click Handlers
  gradeCards.forEach(gCard => {
    gCard.addEventListener('click', () => {
      const selectedG = gCard.dataset.grade;
      if (gradeSelect) {
        if (gradeSelect.value === selectedG) {
          gradeSelect.value = 'all';
        } else {
          gradeSelect.value = selectedG;
        }
        filterPrograms();
      }
    });
  });

  // Track Pill Click Handlers
  trackPills.forEach(tPill => {
    tPill.addEventListener('click', () => {
      const selectedT = tPill.dataset.track;
      if (trackSelect) {
        trackSelect.value = selectedT;
        filterPrograms();
      }
    });
  });

  // Demo Program Explore Click Handler
  document.body.addEventListener('click', (e) => {
    const demoBtn = e.target.closest('.btn-demo-explore');
    if (!demoBtn) return;
    e.preventDefault();

    const title = demoBtn.dataset.title || 'Demo Program';
    const grade = demoBtn.dataset.grade || 'Grade Level';
    const track = demoBtn.dataset.track || 'Track Name';
    const desc = demoBtn.dataset.desc || '';

    // Trigger modal opening via btn-show-interest with custom prefill context
    const enquireBtn = document.querySelector('.btn-show-interest');
    if (enquireBtn) {
      demoBtn.setAttribute('data-source', 'Demo Program Information');
      demoBtn.setAttribute('data-context', `${title} (${grade} • ${track})`);
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      demoBtn.dispatchEvent(clickEvent);
    } else {
      alert(`[Demo Program Overview]\n\nTitle: ${title}\nLevel: ${grade}\nTrack: ${track}\n\nDescription: ${desc}\n\nNotice: This is a sample/demo program record. Contact academic advisory for upcoming curriculum details.`);
    }
  });

  // URL Parameter auto-selection
  const urlParams = new URLSearchParams(window.location.search);
  let paramTriggered = false;
  if (urlParams.has('grade') && gradeSelect) {
    gradeSelect.value = urlParams.get('grade');
    paramTriggered = true;
  }
  if (urlParams.has('track') && trackSelect) {
    trackSelect.value = urlParams.get('track');
    paramTriggered = true;
  }

  // Initial Execution
  filterPrograms();

  if (paramTriggered) {
    const filterSec = document.getElementById('choose-learning-grade') || document.getElementById('program-filters');
    if (filterSec) {
      setTimeout(() => {
        filterSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }
}


/* Single Program Page Grade Context Representation */
function initSingleProgramGradeRepresentation() {
  const urlParams = new URLSearchParams(window.location.search);
  const gradeParam = urlParams.get('grade');
  if (!gradeParam) return;

  const gradeLabels = {
    'grade-1': 'Grade 1 — Basic',
    'grade-2': 'Grade 2 — Intermediate',
    'grade-3': 'Grade 3 — Competitive',
    'grade-4': 'Grade 4 — Advanced',
    'grade-5': 'Grade 5 — Pro'
  };

  const gLabel = gradeLabels[gradeParam];
  if (!gLabel) return;

  const heroBreadcrumb = document.querySelector('.breadcrumb');
  if (heroBreadcrumb) {
    const spanEl = heroBreadcrumb.querySelector('span:last-child');
    if (spanEl) {
      spanEl.innerHTML = `<a href="programs.html?grade=${gradeParam}" style="color: inherit; text-decoration: underline;">${gLabel}</a> &rsaquo; ${spanEl.textContent}`;
    }
  }

  const eyebrow = document.querySelector('.program-hero .eyebrow, .page-hero .eyebrow');
  if (eyebrow) {
    eyebrow.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> ${gLabel.toUpperCase()} &bull; ${eyebrow.textContent}`;
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

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter || 'all';

      cards.forEach(card => {
        const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
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
      if (link.classList.contains('btn-counselling-modal') || link.getAttribute('href') === 'contact.html#enquiry') {
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


