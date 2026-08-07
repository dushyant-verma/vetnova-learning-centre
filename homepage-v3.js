/* ==========================================================================
   VetNova Homepage V3 — Standalone Interactive Controllers & Motion Module
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHP3CounterAnimation();
  initHP3Storytelling();
  initHP3ProgramsFilter();
  initHP3CareerExplorer();
  initHP3LearningJourney();
  initHP3CampusHotspots();
  initHP3FAQAccordion();
});

/* ==========================================================================
   1. Animated Metrics Counter
   ========================================================================== */
function initHP3CounterAnimation() {
  const counters = document.querySelectorAll('.hp3-counter');
  if (counters.length === 0) return;

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
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   2. Storytelling Visual Progression
   ========================================================================== */
function initHP3Storytelling() {
  const steps = document.querySelectorAll('.hp3-story-step');
  const imgDisplay = document.getElementById('hp3-story-img-display');
  const cardTitle = document.getElementById('hp3-story-card-title');
  const cardDesc = document.getElementById('hp3-story-card-desc');

  if (!steps.length || !imgDisplay) return;

  const storyData = {
    '1': {
      img: 'assets/images/learning-path-doctor.webp',
      title: 'Foundational Case Analysis',
      desc: 'Diagnostic algorithms and radiograph interpretation before entering surgical operating suites.'
    },
    '2': {
      img: 'assets/images/programs/program-surgery.webp',
      title: 'Direct Hands-On OT Exposure',
      desc: 'Performing cystotomy, celiotomy, and suture knotting under 1-on-1 MVSc mentor guidance.'
    },
    '3': {
      img: 'assets/images/programs/program-emergency.webp',
      title: 'Real Trauma & Shock Simulations',
      desc: 'Developing swift clinical decision making during acute cardiac arrest and toxic ingestion.'
    },
    '4': {
      img: 'assets/images/programs/faculty-01.webp',
      title: 'Hospital Placement & Career Elevation',
      desc: 'Verified clinical credentialing and placement into India\'s top multi-specialty pet hospitals.'
    }
  };

  steps.forEach(step => {
    step.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');

      const stepId = step.getAttribute('data-hp3-step') || step.getAttribute('data-step');
      const data = storyData[stepId];
      if (data) {
        imgDisplay.style.opacity = '0';
        setTimeout(() => {
          imgDisplay.src = data.img;
          if (cardTitle) cardTitle.innerText = data.title;
          if (cardDesc) cardDesc.innerText = data.desc;
          imgDisplay.style.opacity = '1';
        }, 200);
      }
    });
  });
}

/* ==========================================================================
   3. Featured Programs Category Filter
   ========================================================================== */
function initHP3ProgramsFilter() {
  const pills = document.querySelectorAll('.hp3-pill-item');
  const cards = document.querySelectorAll('.hp3-program-card');

  if (!pills.length || !cards.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-hp3-filter') || pill.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-hp3-category') || card.getAttribute('data-category');
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
}

/* ==========================================================================
   4. Career Pathfinder Explorer Dashboard
   ========================================================================== */
function initHP3CareerExplorer() {
  const tabs = document.querySelectorAll('.hp3-track-tab');
  const badge = document.getElementById('hp3-track-badge');
  const title = document.getElementById('hp3-track-title');
  const desc = document.getElementById('hp3-track-desc');
  const duration = document.getElementById('hp3-tm-duration');
  const hours = document.getElementById('hp3-tm-hours');
  const salary = document.getElementById('hp3-tm-salary');
  const placement = document.getElementById('hp3-tm-placement');
  const skillsContainer = document.getElementById('hp3-track-skills');
  const img = document.getElementById('hp3-track-img');
  const facName = document.getElementById('hp3-track-fac-name');
  const facRole = document.getElementById('hp3-track-fac-role');
  const cta = document.getElementById('hp3-track-cta');

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
      img: 'assets/images/programs/program-surgery.webp',
      facName: 'Dr. Vikramaditya M.',
      facRole: 'Senior MVSc Soft Tissue Surgeon',
      ctaText: 'Apply For Surgery Track'
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
      facRole: 'Head of Veterinary Imaging',
      ctaText: 'Apply For Radiology Track'
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
      facRole: 'Critical Care Director',
      ctaText: 'Apply For Emergency Track'
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
      facRole: 'Diagnostic Lab Specialist',
      ctaText: 'Apply For Diagnostics Track'
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
      facRole: 'Clinical Program Mentor',
      ctaText: 'Apply For Nurse Programme'
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

      const trackKey = tab.getAttribute('data-hp3-track') || tab.getAttribute('data-track');
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
        if (cta) cta.querySelector('span').innerText = data.ctaText;

        if (skillsContainer) {
          skillsContainer.innerHTML = data.skills.map(s => `<span class="hp3-skill-chip">${s}</span>`).join('');
        }
      }
    });
  });
}

/* ==========================================================================
   5. Learning Journey Stage Progression
   ========================================================================== */
function initHP3LearningJourney() {
  const stages = document.querySelectorAll('.hp3-jstage');
  const badge = document.getElementById('hp3-stage-badge');
  const title = document.getElementById('hp3-stage-title');
  const desc = document.getElementById('hp3-stage-desc');
  const list = document.getElementById('hp3-stage-list');
  const img = document.getElementById('hp3-stage-img');

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
      img: 'assets/images/programs/program-surgery.webp'
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

      const stageId = stage.getAttribute('data-hp3-stage') || stage.getAttribute('data-stage');
      const data = stageData[stageId];

      if (data) {
        if (badge) badge.innerText = data.badge;
        if (title) title.innerText = data.title;
        if (desc) desc.innerText = data.desc;
        if (img) img.src = data.img;
        if (list) {
          list.innerHTML = data.items.map(item => `<li><i class="fa-solid fa-check-circle"></i> ${item}</li>`).join('');
        }
      }
    });
  });
}

/* ==========================================================================
   6. Campus Interactive Hotspots
   ========================================================================== */
function initHP3CampusHotspots() {
  const hotspots = document.querySelectorAll('.hp3-hotspot');
  const zoneBtns = document.querySelectorAll('.hp3-zone-btn');
  const viewImg = document.getElementById('hp3-campus-view-img');
  const zoneBadge = document.getElementById('hp3-zone-badge');
  const zoneTitle = document.getElementById('hp3-zone-title');
  const zoneDesc = document.getElementById('hp3-zone-desc');
  const zoneSpecs = document.getElementById('hp3-zone-specs');

  if (!hotspots.length && !zoneBtns.length) return;

  const zoneData = {
    ot: {
      badge: 'SURGICAL SUITE ZONE',
      title: 'Triple-Table Sterile Operating Theatre',
      desc: 'Equipped with electrocautery units, autoclaves, multipara monitors, anesthesia vaporizers, and shadowless surgical lighting.',
      img: 'assets/images/facility-main.webp',
      specs: ['<i class="fa-solid fa-shield"></i> HEPA Filtered', '<i class="fa-solid fa-desktop"></i> Multipara Monitors', '<i class="fa-solid fa-user-doctor"></i> 3 Live Tables']
    },
    radiology: {
      badge: 'IMAGING & DIAGNOSTIC SUITE',
      title: 'Digital DR Radiology & Sonography Room',
      desc: 'High-frequency digital X-ray generator, lead-lined radiation walls, and high-resolution Doppler ultrasound machine.',
      img: 'assets/images/programs/program-radiology.webp',
      specs: ['<i class="fa-solid fa-x-ray"></i> Digital DR System', '<i class="fa-solid fa-wave-square"></i> Doppler Ultrasound', '<i class="fa-solid fa-shield-halved"></i> Radiation Shielded']
    },
    icu: {
      badge: 'CRITICAL CARE WARD',
      title: 'Emergency Intensive Care Unit',
      desc: 'Oxygen concentrators, fluid infusion pumps, pediatric incubators, cardiac monitors, and emergency crash carts.',
      img: 'assets/images/programs/program-emergency.webp',
      specs: ['<i class="fa-solid fa-mask-ventilator"></i> Oxygen Therapy', '<i class="fa-solid fa-pump-medical"></i> Infusion Pumps', '<i class="fa-solid fa-heart-pulse"></i> 24/7 Monitoring']
    },
    lab: {
      badge: 'PATHOLOGY LABORATORY',
      title: 'In-House Diagnostic Pathology Lab',
      desc: 'Automated hematology analyzer, serum biochemistry machine, binocular microscopes, and centrifuge units.',
      img: 'assets/images/learning-path-doctor.webp',
      specs: ['<i class="fa-solid fa-vial"></i> Auto Hematology', '<i class="fa-solid fa-flask"></i> Biochemistry Panel', '<i class="fa-solid fa-microscope"></i> Cytology Station']
    }
  };

  function updateZone(zoneKey) {
    hotspots.forEach(h => {
      const z = h.getAttribute('data-hp3-zone') || h.getAttribute('data-zone');
      if (z === zoneKey) h.classList.add('active');
      else h.classList.remove('active');
    });

    zoneBtns.forEach(b => {
      const z = b.getAttribute('data-hp3-zone') || b.getAttribute('data-zone');
      if (z === zoneKey) b.classList.add('active');
      else b.classList.remove('active');
    });

    const data = zoneData[zoneKey];
    if (data) {
      if (viewImg) viewImg.src = data.img;
      if (zoneBadge) zoneBadge.innerText = data.badge;
      if (zoneTitle) zoneTitle.innerText = data.title;
      if (zoneDesc) zoneDesc.innerText = data.desc;
      if (zoneSpecs) {
        zoneSpecs.innerHTML = data.specs.map(s => `<span>${s}</span>`).join('');
      }
    }
  }

  hotspots.forEach(h => {
    h.addEventListener('click', () => {
      const zoneKey = h.getAttribute('data-hp3-zone') || h.getAttribute('data-zone');
      updateZone(zoneKey);
    });
  });

  zoneBtns.forEach(b => {
    b.addEventListener('click', () => {
      const zoneKey = b.getAttribute('data-hp3-zone') || b.getAttribute('data-zone');
      updateZone(zoneKey);
    });
  });
}

/* ==========================================================================
   7. Interactive FAQ Accordion
   ========================================================================== */
function initHP3FAQAccordion() {
  const items = document.querySelectorAll('.hp3-faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.hp3-faq-q');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      items.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}
