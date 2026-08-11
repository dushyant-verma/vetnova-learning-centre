/* ==========================================================================
   VetNova Homepage V3 — Standalone Namespace Window.VetNovaHP3
   ========================================================================== */

window.VetNovaHP3 = {
  initialized: false,

  init: function () {
    const root = document.querySelector('.hp3x-page');
    if (!root) return;

    if (root.getAttribute('data-hp3x-initialized') === 'true') {
      return;
    }
    root.setAttribute('data-hp3x-initialized', 'true');

    this.initImageFallbacks();
    this.initCounters();
    this.initStorytelling();
    this.initProgramsFilter();
    this.initCareerExplorer();
    this.initLearningJourney();
    this.initFAQ();
    this.initHeaderScroll();
    this.initJumpNav();
    this.initDecisionHelper();
  },

  /* ------------------------------------------------------------------------
     1. Image Fallback System
     ------------------------------------------------------------------------ */
  initImageFallbacks: function () {
    const images = document.querySelectorAll('.hp3x-page img');
    images.forEach(img => {
      img.addEventListener('error', function handleImgError() {
        if (!this.classList.contains('hp3x-image-failed')) {
          this.classList.add('hp3x-image-failed');
          console.warn('[VetNovaHP3] Image failed to load, applied graceful fallback:', this.src);
        }
      });
    });
  },

  /* ------------------------------------------------------------------------
     2. Viewport Animated Metric Counters
     ------------------------------------------------------------------------ */
  initCounters: function () {
    const counters = document.querySelectorAll('.hp3x-counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseFloat(counter.getAttribute('data-target'));
          const suffix = counter.innerText.includes('%') ? '%' : (counter.innerText.includes('+') ? '+' : '');
          let current = 0;
          const increment = target / 50;

          const updateCount = () => {
            current += increment;
            if (current < target) {
              counter.innerText = Math.ceil(current).toLocaleString() + suffix;
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = (target % 1 === 0 ? target : target.toFixed(1)) + suffix;
            }
          };

          updateCount();
          obs.unobserve(counter);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(counter => observer.observe(counter));
  },

  /* ------------------------------------------------------------------------
     3. Storytelling Progression Controller
     ------------------------------------------------------------------------ */
  initStorytelling: function () {
    const steps = document.querySelectorAll('.hp3x-story-step');
    const imgDisplay = document.getElementById('hp3x-story-img-display');
    const cardTitle = document.getElementById('hp3x-story-card-title');
    const cardDesc = document.getElementById('hp3x-story-card-desc');
    const mediaLabel = document.getElementById('hp3x-story-media-label');
    const trustText = document.getElementById('hp3x-story-trust-text');
    const progressCounter = document.getElementById('hp3x-story-progress-counter');
    const progressFill = document.getElementById('hp3x-story-progress-fill');
    const progressTrack = document.getElementById('hp3x-story-progress-track');

    if (!steps.length || !imgDisplay) return;

    const storyData = {
      '1': {
        label: 'CLINICAL STAGE 01',
        title: 'Deep Medical Theory & Case Analysis',
        desc: 'Master surgical anatomy, pharmacology, fluid balance, and emergency triage algorithms taught by senior MVSc clinical specialists.',
        img: 'assets/images/learning-path-doctor.webp',
        trust: 'Senior MVSc Faculty',
        fill: '25%',
        track: '<span class="stage-step active">THEORY</span> → <span class="stage-step">PRACTICE</span> → <span class="stage-step">CONFIDENCE</span> → <span class="stage-step">CAREER</span>'
      },
      '2': {
        label: 'CLINICAL STAGE 02',
        title: 'Direct Hands-On OT Exposure',
        desc: 'Perform tissue handling, suture techniques, laparotomies, and USG FAST scanning under 1-on-1 mentor supervision in real operating suites.',
        img: 'assets/images/program-surgery.webp',
        trust: '1-on-1 Specialist Guidance',
        fill: '50%',
        track: '<span class="stage-step">THEORY</span> → <span class="stage-step active">PRACTICE</span> → <span class="stage-step">CONFIDENCE</span> → <span class="stage-step">CAREER</span>'
      },
      '3': {
        label: 'CLINICAL STAGE 03',
        title: 'Unshakeable Clinical Confidence',
        desc: 'Develop independent decision-making while handling trauma, toxic shock, cardiac emergencies, and complex abdominal procedures.',
        img: 'assets/images/programs/program-emergency.webp',
        trust: 'Real Clinical Simulations',
        fill: '75%',
        track: '<span class="stage-step">THEORY</span> → <span class="stage-step">PRACTICE</span> → <span class="stage-step active">CONFIDENCE</span> → <span class="stage-step">CAREER</span>'
      },
      '4': {
        label: 'CLINICAL STAGE 04',
        title: 'Measurable Career Elevation',
        desc: 'Graduate with practical certification, improved clinical speed, stronger decision-making, and access to hospital career opportunities.',
        img: 'assets/images/programs/faculty-01.webp',
        trust: 'Hospital Placement Network',
        fill: '100%',
        track: '<span class="stage-step">THEORY</span> → <span class="stage-step">PRACTICE</span> → <span class="stage-step">CONFIDENCE</span> → <span class="stage-step active">CAREER</span>'
      }
    };

    const panelNum = document.getElementById('hp3x-story-panel-num');
    const panelTitle = document.getElementById('hp3x-story-panel-title');
    const panelDesc = document.getElementById('hp3x-story-panel-desc');
    const panelTag = document.getElementById('hp3x-story-panel-tag');

    const stepTags = {
      '1': '<i class="fa-solid fa-book-medical"></i> 100% Case-Based Learning',
      '2': '<i class="fa-solid fa-hand-holding-medical"></i> 1-on-1 Specialist Guidance',
      '3': '<i class="fa-solid fa-heart-pulse"></i> Real Clinical Simulations',
      '4': '<i class="fa-solid fa-award"></i> Hospital Placement Network'
    };

    function activateStep(step) {
      const stepId = step.getAttribute('data-hp3x-step');
      const data = storyData[stepId];
      if (!data) return;

      steps.forEach(s => {
        s.classList.remove('hp3x-story-step-active');
        s.setAttribute('aria-selected', 'false');
      });
      step.classList.add('hp3x-story-step-active');
      step.setAttribute('aria-selected', 'true');

      if (progressFill) progressFill.style.height = data.fill;

      if (panelNum) panelNum.innerText = `0${stepId}`;
      if (panelTitle) panelTitle.innerText = data.title;
      if (panelDesc) panelDesc.innerText = data.desc;
      if (panelTag) panelTag.innerHTML = stepTags[stepId] || '';

      imgDisplay.style.opacity = '0.25';
      setTimeout(() => {
        imgDisplay.src = data.img;
        if (mediaLabel) mediaLabel.innerText = data.label;
        if (cardTitle) cardTitle.innerText = data.title;
        if (cardDesc) cardDesc.innerText = data.desc;
        if (trustText) trustText.innerText = data.trust;
        if (progressCounter) progressCounter.innerText = `0${stepId} / 04`;
        if (progressTrack) progressTrack.innerHTML = data.track;
        imgDisplay.style.opacity = '1';
      }, 150);
    }

    steps.forEach(step => {
      // Click interaction
      step.addEventListener('click', () => activateStep(step));

      // Desktop hover interaction (non-touch)
      step.addEventListener('mouseenter', () => {
        if (window.innerWidth > 992) {
          activateStep(step);
        }
      });

      // Keyboard arrow navigation accessibility
      step.addEventListener('keydown', (e) => {
        let targetIndex = -1;
        const index = Array.from(steps).indexOf(step);

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          targetIndex = (index + 1) % steps.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          targetIndex = (index - 1 + steps.length) % steps.length;
        }

        if (targetIndex !== -1) {
          steps[targetIndex].focus();
          activateStep(steps[targetIndex]);
        }
      });
    });
  },

  /* ------------------------------------------------------------------------
     4. Clinical Programs Filter
     ------------------------------------------------------------------------ */
  initProgramsFilter: function () {
    const pills = document.querySelectorAll('.hp3x-pill-item');
    const cards = document.querySelectorAll('.hp3x-program-card');

    if (!pills.length || !cards.length) return;

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.getAttribute('data-hp3x-filter');

        cards.forEach(card => {
          const cat = card.getAttribute('data-hp3x-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      });
    });
  },

  /* ------------------------------------------------------------------------
     5. Career Explorer Pathfinder
     ------------------------------------------------------------------------ */
  initCareerExplorer: function () {
    const tabs = document.querySelectorAll('.hp3x-track-tab');
    const badge = document.getElementById('hp3x-track-badge');
    const title = document.getElementById('hp3x-track-title');
    const desc = document.getElementById('hp3x-track-desc');
    const duration = document.getElementById('hp3x-tm-duration');
    const hours = document.getElementById('hp3x-tm-hours');
    const salary = document.getElementById('hp3x-tm-salary');
    const placement = document.getElementById('hp3x-tm-placement');
    const skillsContainer = document.getElementById('hp3x-track-skills');
    const img = document.getElementById('hp3x-track-img');
    const facName = document.getElementById('hp3x-track-fac-name');
    const facRole = document.getElementById('hp3x-track-fac-role');

    if (!tabs.length) return;

    const trackData = {
      surgery: {
        badge: 'RECOMMENDED FOR SURGICAL PRACTITIONERS',
        title: 'Soft Tissue Surgery Specialty Track',
        desc: 'Master essential abdominal procedures including exploratory laparotomy, cystotomy, gastrotomy, splenectomy, and advanced suture closure patterns in real surgical suites.',
        duration: '4 Weeks',
        hours: '80+ Hours',
        salary: '₹6.5 - ₹12 LPA',
        placement: '96.8%',
        skills: ['Exploratory Celiotomy', 'Cystotomy & Uroliths', 'Intestinal Anastomosis', 'Sterile OR Protocol', 'Vessel Ligation'],
        img: 'assets/images/program-surgery.webp',
        facName: 'Dr. Vikramaditya M.',
        facRole: 'Senior MVSc Soft Tissue Surgeon'
      },
      radiology: {
        badge: 'DIAGNOSTIC IMAGING SPECIALTY',
        title: 'Digital Radiology & Abdominal USG Track',
        desc: 'Hands-on ultrasound FAST scanning, probe positioning, organ evaluation, and thoracic X-ray interpretation for small animal practices.',
        duration: '1 Week',
        hours: '30+ Hours',
        salary: '₹5.5 - ₹10 LPA',
        placement: '98.2%',
        skills: ['Abdominal FAST Scan', 'Doppler Blood Flow', 'Radiograph Artifacts', 'Organ Enlargements', 'Echo Screening'],
        img: 'assets/images/programs/program-radiology.webp',
        facName: 'Dr. Ananya Sharma',
        facRole: 'Head of Veterinary Imaging'
      },
      emergency: {
        badge: 'HIGH-STAKES ICU CLINICAL TRACK',
        title: 'Emergency Medicine & Critical Care',
        desc: 'Rapid triage protocols, shock resuscitation, CPR chest compression algorithms, fluid therapy pumps, and ventilator monitoring.',
        duration: '3 Days',
        hours: '24 Hours',
        salary: '₹6.0 - ₹11 LPA',
        placement: '95.4%',
        skills: ['CPR Resuscitation', 'Fluid Shock Rates', 'Endotracheal Intubation', 'Oxygenation', 'Triage Assessment'],
        img: 'assets/images/programs/program-emergency.webp',
        facName: 'Dr. Rajesh Deshmukh',
        facRole: 'Critical Care Director'
      },
      diagnostics: {
        badge: 'PATHOLOGY & CLINICAL LABS',
        title: 'Clinical Diagnostics & Hematology',
        desc: 'Complete blood count interpretation, serum biochemistry panels, cytology slide prep, and rapid infectious disease screening.',
        duration: '1 Week',
        hours: '25 Hours',
        salary: '₹5.0 - ₹9 LPA',
        placement: '94.0%',
        skills: ['CBC Interpretation', 'Serum Biochemistry', 'Fecal Floatation', 'Cytology Staining', 'Blood Smears'],
        img: 'assets/images/learning-path-doctor.webp',
        facName: 'Dr. Ananya Sharma',
        facRole: 'Diagnostic Lab Specialist'
      },
      nurse: {
        badge: 'ASSISTANT CLINICAL FOUNDATION',
        title: 'Veterinary Nurse & Assistant Programme',
        desc: 'Patient handling, sterile instrument prep, catheterization, vitals logging, post-operative nursing, and client communication.',
        duration: '2 Weeks',
        hours: '45 Hours',
        salary: '₹3.5 - ₹6 LPA',
        placement: '99.0%',
        skills: ['Sterile Prep', 'Catheter Placement', 'Vitals Logging', 'Patient Restraint', 'Post-Op Nursing'],
        img: 'assets/images/programs/program-nurse.webp',
        facName: 'Dr. Vikramaditya M.',
        facRole: 'Clinical Program Mentor'
      }
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const trackKey = tab.getAttribute('data-hp3x-track');
        const data = trackData[trackKey];

        if (data) {
          if (badge) badge.innerText = data.badge;
          if (title) title.innerText = data.title;
          if (desc) desc.innerText = data.desc;
          if (duration) duration.innerText = data.duration;
          if (hours) hours.innerText = data.hours;
          if (salary) salary.innerText = data.salary;
          if (placement) placement.innerText = data.placement;
          if (img) img.src = data.img;
          if (facName) facName.innerText = data.facName;
          if (facRole) facRole.innerText = data.facRole;

          if (skillsContainer) {
            skillsContainer.innerHTML = data.skills.map(s => `<span class="hp3x-skill-chip">${s}</span>`).join('');
          }
        }
      });
    });
  },

  /* ------------------------------------------------------------------------
     6. Learning Journey Stages
     ------------------------------------------------------------------------ */
  initLearningJourney: function () {
    const stages = document.querySelectorAll('.hp3x-jstage');
    const badge = document.getElementById('hp3x-stage-badge');
    const title = document.getElementById('hp3x-stage-title');
    const desc = document.getElementById('hp3x-stage-desc');
    const list = document.getElementById('hp3x-stage-list');
    const img = document.getElementById('hp3x-stage-img');

    if (!stages.length) return;

    const stageData = {
      '1': {
        badge: 'STAGE 01 — ACADEMIC IMMERSION',
        title: 'Case-Based Surgical & Diagnostic Foundations',
        desc: 'Learners evaluate patient history records, radiograph artifacts, organ landmark algorithms, and pre-op fluid requirements prior to stepping into operating suites.',
        items: [
          'Surgical anatomy & organ landmark identification',
          'Emergency fluid rate calculations & toxic shock algorithms',
          'Pre-operative patient stabilization & blood work analysis'
        ],
        img: 'assets/images/learning-path-doctor.webp'
      },
      '2': {
        badge: 'STAGE 02 — FOUNDATION SKILLS',
        title: 'Hands-on Suture & Instrument Dry Labs',
        desc: 'Practice sterile scrubbing, gloving, surgical knot tying on simulated tissue pads, and instrument handling techniques.',
        items: [
          'Mastering Mayo-Hegar needle drivers & scalpel blades',
          'Continuous & interrupted suture closure patterns',
          'Sterile gowning, draping, and OR hygiene protocols'
        ],
        img: 'assets/images/programs/program-nurse.webp'
      },
      '3': {
        badge: 'STAGE 03 — SUPERVISED CLINICAL OT',
        title: 'Live Soft Tissue Surgeries in Operating Theatre',
        desc: 'Assisting and performing live abdominal soft tissue procedures under 1-on-1 direct MVSc surgeon supervision.',
        items: [
          'Exploratory celiotomy & abdominal organ inspection',
          'Cystotomy stone removal & urinary tract repair',
          'Intestinal resection & end-to-end anastomosis'
        ],
        img: 'assets/images/program-surgery.webp'
      },
      '4': {
        badge: 'STAGE 04 — DIAGNOSTIC SONOGRAPHY',
        title: 'Abdominal FAST Ultrasound Scanning',
        desc: 'Hands-on probe handling to perform abdominal FAST scans, cardiac Doppler screenings, and digital radiograph readings.',
        items: [
          'Probe positioning for liver, kidney, spleen & urinary bladder',
          'FAST ultrasound emergency free-fluid identification',
          'Thoracic X-ray organ enlargement interpretation'
        ],
        img: 'assets/images/programs/program-radiology.webp'
      },
      '5': {
        badge: 'STAGE 05 — CERTIFICATION EXAM',
        title: 'Comprehensive Practical Assessment & Credentials',
        desc: 'Evaluation of surgical speed, sterile compliance, ultrasound diagnostic accuracy, and practical case management.',
        items: [
          'Timed surgical closure & knot assessment',
          'Live ultrasound scan diagnostic evaluation',
          'Verified Clinical Mastery Certificate issuance'
        ],
        img: 'assets/images/programs/faculty-01.webp'
      },
      '6': {
        badge: 'STAGE 06 — HOSPITAL PLACEMENT',
        title: 'Career Launch & Hospital Placement',
        desc: 'Placement into India\'s leading multi-specialty veterinary hospitals and private surgical practices.',
        items: [
          'Dedicated career counselling & resume build',
          'Direct interview scheduling with hospital partners',
          'Continuous alumni clinical guidance & mentor access'
        ],
        img: 'assets/images/facility-main.webp'
      }
    };

    stages.forEach(stage => {
      stage.addEventListener('click', () => {
        stages.forEach(s => s.classList.remove('active'));
        stage.classList.add('active');

        const stageId = stage.getAttribute('data-hp3x-stage');
        const data = stageData[stageId];

        if (data) {
          if (badge) badge.innerText = data.badge;
          if (title) title.innerText = data.title;
          if (desc) desc.innerText = data.desc;
          if (img) img.src = data.img;
          if (list) {
            list.innerHTML = data.items.map(item => `<li><i class="fa-solid fa-circle-check"></i> ${item}</li>`).join('');
          }
        }
      });
    });
  },

  /* ------------------------------------------------------------------------
     7. Interactive Single-Open FAQ Accordion
     ------------------------------------------------------------------------ */
  initFAQ: function () {
    const items = document.querySelectorAll('.hp3x-faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const btn = item.querySelector('.hp3x-faq-question');
      if (!btn) return;

      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        items.forEach(i => {
          i.classList.remove('active');
          const q = i.querySelector('.hp3x-faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  },

  /* ------------------------------------------------------------------------
     8. Optimized Header Top Padding & Scroll Behavior
     ------------------------------------------------------------------------ */
  initHeaderScroll: function () {
    const globalHeader = document.getElementById('global-header');
    if (!globalHeader) return;

    let ticking = false;
    let lastScrollY = window.scrollY;

    const updateHeader = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        globalHeader.classList.add('hp3x-header-hidden');
      } else {
        globalHeader.classList.remove('hp3x-header-hidden');
      }
      lastScrollY = currentScrollY;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  },

  /* ------------------------------------------------------------------------
     9. Section Jump Navigation
     ------------------------------------------------------------------------ */
  initJumpNav: function () {
    const jumpLinks = document.querySelectorAll('.hp3x-jump-link');
    jumpLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  },

  /* ------------------------------------------------------------------------
     10. Program Decision Helper
     ------------------------------------------------------------------------ */
  initDecisionHelper: function () {
    const options = document.querySelectorAll('.hp3x-decision-option');
    const trackTabs = document.querySelectorAll('.hp3x-track-tab');

    if (!options.length) return;

    const profileMapping = {
      student: 'surgery',
      fresh: 'radiology',
      doctor: 'emergency',
      nurse: 'nurse',
      parent: 'diagnostics'
    };

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');

        const profile = opt.getAttribute('data-hp3x-profile');
        const targetTrack = profileMapping[profile];

        if (targetTrack && trackTabs.length) {
          const matchingTab = document.querySelector(`.hp3x-track-tab[data-hp3x-track="${targetTrack}"]`);
          const careerSection = document.getElementById('hp3x-careers');

          if (matchingTab) {
            matchingTab.click();
          }

          if (careerSection) {
            careerSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.VetNovaHP3.init();
});
