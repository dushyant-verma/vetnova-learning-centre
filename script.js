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
  const path = (window.location.pathname.split('/').pop() || 'index').replace('.html', '').toLowerCase();

  const navLinks = document.querySelectorAll('.menu .nav-link, .drawer-menu .drawer-link');
  navLinks.forEach(link => {
    const dataNav = link.getAttribute('data-nav') || link.getAttribute('href');
    if (dataNav) {
      const cleanDataNav = dataNav.split('#')[0].replace('.html', '').toLowerCase();
      if (cleanDataNav === path || (path === '' && cleanDataNav === 'index')) {
        link.classList.add('active');
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
   Sticky Header Controller
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
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
    image: 'https://images.pexels.com/photos/6234607/pexels-photo-6234607.jpeg?auto=compress&cs=tinysrgb&w=600'
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
    image: 'https://images.pexels.com/photos/6234610/pexels-photo-6234610.jpeg?auto=compress&cs=tinysrgb&w=600'
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
    image: 'https://images.pexels.com/photos/7470752/pexels-photo-7470752.jpeg?auto=compress&cs=tinysrgb&w=600'
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
    image: 'https://images.pexels.com/photos/7469229/pexels-photo-7469229.jpeg?auto=compress&cs=tinysrgb&w=600'
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
    image: 'https://images.pexels.com/photos/7474855/pexels-photo-7474855.jpeg?auto=compress&cs=tinysrgb&w=600'
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
    avatar: "https://images.pexels.com/photos/6235653/pexels-photo-6235653.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    quote: "“The radiology and ultrasound scanning workshops gave me clear diagnostic reasoning. My clinic's diagnostic accuracy and patient trust have grown tremendously.”",
    name: "Dr. Rahul Deshmukh",
    role: "Clinic Founder • 6 Yrs Experience",
    avatar: "https://images.pexels.com/photos/6235239/pexels-photo-6235239.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    quote: "“As a final-year student, VetNova bridged the exact gap between textbook theories and real clinical workflows. Highly recommended for fresh graduates!”",
    name: "Dr. Priya Nair",
    role: "Final-Year Student • Pune",
    avatar: "https://images.pexels.com/photos/7469214/pexels-photo-7469214.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    quote: "“The Vet Nurse program equipped our clinic assistants with standard handling, surgical prep, and emergency response protocols. Exceptional learning environment!”",
    name: "Rohan Mehta",
    role: "Head Vet Assistant • Mumbai",
    avatar: "https://images.pexels.com/photos/7474855/pexels-photo-7474855.jpeg?auto=compress&cs=tinysrgb&w=300"
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
  const pills = document.querySelectorAll('.category-pill');
  const cards = document.querySelectorAll('.blog-card');

  if (!pills.length || !cards.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const category = pill.dataset.category || 'all';

      cards.forEach(card => {
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
