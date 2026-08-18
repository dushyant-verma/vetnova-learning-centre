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
  initFaqSearch();
  initPopularCoursesFilter();
  initSingleFocusJourney();
  initFacultyModal();
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
          }
        }
      });

      if (isOpen) {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        if (content) content.classList.remove('open');
      } else {
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        if (content) content.classList.add('open');
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
    ctaText: 'Apply for Surgery Program',
    ctaLink: '#contact',
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
    ctaText: 'Apply for Radiology Program',
    ctaLink: '#contact',
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
    ctaText: 'Apply for Foundation Program',
    ctaLink: '#contact',
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
    ctaText: 'Join First Aid Workshop',
    ctaLink: '#contact',
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
    ctaText: 'Join Vet Nurse Program',
    ctaLink: '#contact',
    image: 'assets/vet_selector_nurse_result.webp'
  }
};

function initConcernSelector() {
  const cards = document.querySelectorAll('#concern-selector .choice-card');
  const panel = document.getElementById('selector-results-panel');

  if (!panel) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const concern = card.dataset.concern;
      const data = concernData[concern];

      if (data) {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(5px)';

        setTimeout(() => {
          renderConcernResults(data);
          panel.style.opacity = '1';
          panel.style.transform = 'translateY(0)';
        }, 200);
      }
    });
  });
}

function renderConcernResults(data) {
  const panel = document.getElementById('selector-results-panel');
  if (!panel) return;

  const bulletHTML = data.bullets.map(b => `<li><i class="fa-solid fa-check"></i> ${b}</li>`).join('');

  panel.innerHTML = `
    <div class="results-layout" style="animation: fadeIn 0.3s ease;">
      <div class="results-copy">
        <span class="badge">${data.badge}</span>
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <ul class="results-bullets">
          ${bulletHTML}
        </ul>
        <div class="results-cta">
          <a class="btn btn-primary" href="${data.ctaLink}">${data.ctaText}</a>
        </div>
      </div>
      <div class="results-image">
        <img src="${data.image}" alt="${data.title}" />
      </div>
    </div>
  `;
}

/* ==========================================================================
   Interactive Persona Matching Quiz
   ========================================================================== */
const quizData = {
  'early-career': {
    journey: 'Early-Career Vet Doctor Track',
    goals: [
      {
        text: 'Upgrade basic clinical/surgery confidence',
        program: 'Veterinary Skill-Up Program',
        message: '“Upgrade your clinical confidence with practical, hands-on veterinary training.”',
        modules: 'Surgeries, X-Ray reading, Emergency care, ECG, Wound management',
        factors: 'Hands-on practice, certificate validation, trainer credibility, peer group network',
        formProgram: 'skill-up'
      },
      {
        text: 'Learn case decision making & diagnostics',
        program: 'Veterinary Skill-Up Program',
        message: '“Upgrade your clinical confidence with practical, hands-on veterinary training.”',
        modules: 'Thoracic x-rays, ECG basics, common prescription guides, critical care support',
        factors: 'Curriculum details, duration, batch size, expert feedback score',
        formProgram: 'skill-up'
      }
    ]
  },
  'experienced': {
    journey: 'Experienced Vet Doctor Specialization',
    goals: [
      {
        text: 'Master advanced soft tissue/orthopedic surgery',
        program: 'Surgery & Radiology Workshops',
        message: '“Move from general practice to advanced clinical excellence.”',
        modules: 'Bone plating, pinning, joint stabilization, complex soft tissue flap surgeries',
        factors: 'Expert specialist faculty, real case discussion, premium lab equipment',
        formProgram: 'surgery'
      },
      {
        text: 'Acquire expert radiology/ultrasound diagnostics',
        program: 'Surgery & Radiology Workshops',
        message: '“Move from general practice to advanced clinical excellence.”',
        modules: 'Advanced cardiac scans, abdominal mapping, systematic pathology reviews',
        factors: 'Conference access, clinic growth outcomes, peer networking plans',
        formProgram: 'surgery'
      }
    ]
  },
  'student': {
    journey: 'Final-Year Vet Student Pathway',
    goals: [
      {
        text: 'Acquire practical confidence before internships',
        program: 'Clinic-Ready Foundation Program',
        message: '“Bridge the gap between college learning and real veterinary practice.”',
        modules: 'Beginner modules, patient examination guides, common case histories',
        factors: 'Mentorship, affordability, student-friendly batches, certificate value',
        formProgram: 'foundation'
      },
      {
        text: 'Get clear career roadmap & resume support',
        program: 'Clinic-Ready Foundation Program',
        message: '“Bridge the gap between college learning and real veterinary practice.”',
        modules: 'Career counseling, job-readiness checklist, clinic setup tips',
        factors: 'Job pathways, placement support, counseling guidance',
        formProgram: 'foundation'
      }
    ]
  },
  'graduate': {
    journey: 'Recently Passed-Out Graduate Program',
    goals: [
      {
        text: 'Gain employable skills & clinic workflow exposure',
        program: 'Clinic-Ready Foundation Program',
        message: '“Get clinic-ready with practical veterinary skills that help you start your career.”',
        modules: 'Diagnosis assistance, patient communication, clinic database handling',
        factors: 'Job-focused curriculum, trainer verification, success stories',
        formProgram: 'foundation'
      }
    ]
  },
  'pet-owner': {
    journey: 'Pet First Aid & Emergency Track',
    goals: [
      {
        text: 'Learn home emergency first aid',
        program: 'Pet Emergency First Aid Workshop',
        message: '“Learn how to respond safely during a pet emergency before professional help arrives.”',
        modules: 'Choking release, bleeding stops, seizure response, road accident safety guidelines',
        factors: 'Simple language, short timing, affordable fees, emergency checklists',
        formProgram: 'first-aid'
      }
    ]
  },
  'nurse': {
    journey: 'Vet Nurse / Clinic Assistant Track',
    goals: [
      {
        text: 'Build career proof for clinic assistant jobs',
        program: 'Online Vet Nurse Program',
        message: '“Start your career as a trained veterinary nurse with practical basic skills.”',
        modules: 'Animal restraint, cage sanitization, client registration desk checklists',
        factors: 'Online access, certificate verification, module simplicity',
        formProgram: 'nurse'
      }
    ]
  }
};

let userSelections = {
  role: null,
  goalIndex: null
};

function initQuiz() {
  const roleButtons = document.querySelectorAll('#step-1-content .quiz-opt-btn');
  const goalContainer = document.getElementById('goal-options-container');
  const step1 = document.getElementById('step-1-content');
  const step2 = document.getElementById('step-2-content');
  const step3 = document.getElementById('step-3-content');

  const progressStep1 = document.querySelector('.progress-step[data-step="1"]');
  const progressStep2 = document.querySelector('.progress-step[data-step="2"]');
  const progressStep3 = document.querySelector('.progress-step[data-step="3"]');

  const backBtn = document.getElementById('quiz-back-btn');
  const resetBtn = document.getElementById('quiz-reset-btn');

  if (!roleButtons || roleButtons.length === 0 || !goalContainer || !backBtn) return;

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      const role = btn.dataset.role;
      userSelections.role = role;

      populateGoals(role);

      step1.classList.remove('active');
      step2.classList.add('active');

      if (progressStep1) {
        progressStep1.classList.add('completed');
        progressStep1.classList.remove('active');
      }
      if (progressStep2) progressStep2.classList.add('active');
    });
  });

  backBtn.addEventListener('click', () => {
    if (step2 && step1) {
      step2.classList.remove('active');
      step1.classList.add('active');
    }
    if (progressStep1) {
      progressStep1.classList.remove('completed');
      progressStep1.classList.add('active');
    }
    if (progressStep2) progressStep2.classList.remove('active');

    userSelections.goalIndex = null;
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (step3 && step1) {
        step3.classList.remove('active');
        step1.classList.add('active');
      }
      if (progressStep1) {
        progressStep1.classList.remove('completed');
        progressStep1.classList.add('active');
      }
      if (progressStep3) progressStep3.classList.remove('active');

      roleButtons.forEach(b => b.classList.remove('selected'));
      userSelections = { role: null, goalIndex: null };
    });
  }

  function populateGoals(role) {
    const data = quizData[role];
    goalContainer.innerHTML = '';

    if (data && data.goals) {
      data.goals.forEach((goal, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt-btn';
        btn.innerHTML = `
          <span class="icon"><i class="fa-solid fa-bullseye"></i></span>
          <div class="text">
            <b>${goal.text}</b>
          </div>
        `;
        btn.addEventListener('click', () => {
          userSelections.goalIndex = index;
          calculateQuizResult();
        });
        goalContainer.appendChild(btn);
      });
    }
  }

  function calculateQuizResult() {
    const data = quizData[userSelections.role];
    const goal = data.goals[userSelections.goalIndex];

    if (goal) {
      const resTitle = document.getElementById('result-title');
      const resMsg = document.getElementById('result-message');
      const resJourney = document.getElementById('result-journey');
      const resMods = document.getElementById('result-modules');
      const resFactors = document.getElementById('result-factors');

      if (resTitle) resTitle.textContent = goal.program;
      if (resMsg) resMsg.textContent = goal.message;
      if (resJourney) resJourney.textContent = data.journey;
      if (resMods) resMods.textContent = goal.modules;
      if (resFactors) resFactors.textContent = goal.factors;

      const formRole = document.getElementById('form-role');
      const formProgram = document.getElementById('form-program');
      if (formRole) formRole.value = userSelections.role;
      if (formProgram) formProgram.value = goal.formProgram;

      if (step2 && step3) {
        step2.classList.remove('active');
        step3.classList.add('active');
      }

      if (progressStep2) {
        progressStep2.classList.add('completed');
        progressStep2.classList.remove('active');
      }
      if (progressStep3) progressStep3.classList.add('active');
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

  if (!form || !successState) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameEl = document.getElementById('form-name');
    const emailEl = document.getElementById('form-email');
    const phoneEl = document.getElementById('form-phone');
    const roleEl = document.getElementById('form-role');
    const programEl = document.getElementById('form-program');
    const messageEl = document.getElementById('form-message');

    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const ccSelect = form.querySelector('select[name="country_code"]');
    const countryCode = ccSelect ? ccSelect.value : '';

    if (name === '' || email === '' || phone === '') {
      alert('Please fill out all required fields.');
      return;
    }

    console.log('Form Submitted: ', {
      name,
      email,
      phone: countryCode + ' ' + phone,
      role: roleEl ? roleEl.value : '',
      program: programEl ? programEl.value : '',
      message: messageEl ? messageEl.value : ''
    });

    form.style.display = 'none';
    successState.style.display = 'flex';
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      successState.style.display = 'none';
      form.style.display = 'grid';
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
   Popup Enquiry Modal Controller
   ========================================================================== */
function initEnquiryModal() {
  const modal = document.getElementById('enquiry-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const successCloseBtn = document.getElementById('modal-success-close');
  const form = document.getElementById('modal-enquiry-form');
  const successState = document.getElementById('modal-success-state');
  const modalHead = modal ? modal.querySelector('.modal-head') : null;

  const enquireButtons = document.querySelectorAll('.btn-enquire-now, a[href="#contact"][class*="btn"], a[href*="contact"][class*="btn"]');

  if (!modal) return;

  function openModal(e) {
    e.preventDefault();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (form) form.style.display = 'grid';
    if (successState) successState.style.display = 'none';
    if (modalHead) modalHead.style.display = '';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  enquireButtons.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const ccSelect = form.querySelector('select[name="modal_country_code"]');
      const countryCode = ccSelect ? ccSelect.value : '';

      const phoneEl = document.getElementById('modal-phone');
      const nameEl = document.getElementById('modal-name');
      const emailEl = document.getElementById('modal-email');
      const roleEl = document.getElementById('modal-role');
      const messageEl = document.getElementById('modal-message');

      const phoneVal = phoneEl ? phoneEl.value.trim() : '';

      console.log('Modal Form Submitted: ', {
        name: nameEl ? nameEl.value.trim() : '',
        email: emailEl ? emailEl.value.trim() : '',
        phone: countryCode + ' ' + phoneVal,
        role: roleEl ? roleEl.value : '',
        message: messageEl ? messageEl.value.trim() : ''
      });

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Submit Enquiry';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      setTimeout(() => {
        form.style.display = 'none';
        if (successState) successState.style.display = 'flex';
        if (modalHead) modalHead.style.display = 'none';

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        form.reset();
      }, 1000);
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
   13. Realtime Program Filter & Search Controller
   ========================================================================== */
function initProgramFilters() {
  const searchInput = document.getElementById('program-search-input');
  const categoryPills = document.querySelectorAll('.program-category-pill');
  const modeSelect = document.getElementById('filter-mode');
  const durationSelect = document.getElementById('filter-duration');
  const cards = document.querySelectorAll('.program-card[data-category]');

  if (!cards.length) return;

  function filterPrograms() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activePill = document.querySelector('.program-category-pill.active');
    const categoryFilter = activePill ? activePill.dataset.category : 'all';
    const modeFilter = modeSelect ? modeSelect.value : 'all';
    const durationFilter = durationSelect ? durationSelect.value : 'all';

    cards.forEach(card => {
      const cardCategory = card.dataset.category || '';
      const cardMode = card.dataset.mode || '';
      const cardDuration = card.dataset.duration || '';
      const cardTitle = card.querySelector('.program-card-title') ? card.querySelector('.program-card-title').textContent.toLowerCase() : '';
      const cardDesc = card.querySelector('.program-card-desc') ? card.querySelector('.program-card-desc').textContent.toLowerCase() : '';

      const matchesSearch = query === '' || cardTitle.includes(query) || cardDesc.includes(query);
      const matchesCategory = categoryFilter === 'all' || cardCategory === categoryFilter;
      const matchesMode = modeFilter === 'all' || cardMode === modeFilter;
      const matchesDuration = durationFilter === 'all' || cardDuration === durationFilter;

      if (matchesSearch && matchesCategory && matchesMode && matchesDuration) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.3s ease';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterPrograms);
  }

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterPrograms();
    });
  });

  if (modeSelect) modeSelect.addEventListener('change', filterPrograms);
  if (durationSelect) durationSelect.addEventListener('change', filterPrograms);
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
    const data = facultyProfiles[facultyId];
    if (!data) return;
    
    // Populate data
    imgEl.src = data.img;
    imgEl.alt = data.name;
    nameEl.textContent = data.name;
    roleEl.textContent = data.role;
    qualEl.textContent = data.qual;
    expEl.textContent = data.exp;
    introEl.textContent = data.intro;
    
    // Populate expertise chips
    expertiseEl.innerHTML = '';
    data.expertise.forEach(item => {
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
