/**
 * VetNova Homepage V2 – Production Modular Controller
 * Design Direction: Harvard Medicine, Stanford Medicine, Pentagram, Instrument, Apple
 * Interactive Components: Learning Journey, Careers Slider, Popular Masterclasses, Quiz Assessment
 */

document.addEventListener('DOMContentLoaded', function () {
  initLearningJourney();
  initCareersSlider();
  initPopularCourses();
  initQuizWidget();
});

/**
 * 1. Learning Journey Experience Module (#learning-paths)
 */
function initLearningJourney() {
  const profileCards = document.querySelectorAll('.homepage-v2-learning-journey .lj-profile');
  if (!profileCards.length) return;

  const profileData = {
    'early-career': {
      badge: 'EARLY-CAREER DOCTOR PATHWAY',
      title: 'Early-Career Doctor Practical Progression',
      desc: 'Step-by-step clinical progression designed to transition 1–3 year veterinarians from theory-heavy academics into self-sufficient surgical and diagnostic clinicians.',
      image: 'assets/images/learning-path-doctor.webp',
      duration: '6 Weeks',
      hours: '120+ Hours',
      faculty: 'Dr. Rajesh Kulkarni',
      outcome: 'Independent Clinician',
      salary: '₹6.5 – ₹12.0 LPA',
      skills: ['Soft Tissue Surgery', 'Digital Radiology', 'Emergency Care', 'Diagnostics', 'Ultrasound', 'Communication'],
      ctaText: 'Start Learning Journey',
      ctaUrl: 'veterinary-skill-up.html',
      modules: [
        { title: 'Soft Tissue Surgery Masterclass', desc: 'Master abdominal organ surgeries, spay/neuter protocols, and stitching dexterity.', duration: '4 Weeks • 80+ Hrs', image: 'assets/images/program-surgery.webp', url: 'soft-tissue-surgery.html' },
        { title: 'Digital Radiology & Ultrasound', desc: 'X-ray radiograph interpretation and bedside abdominal ultrasound diagnostics.', duration: '3 Weeks • 60+ Hrs', image: 'assets/images/facility-radiology.webp', url: 'radiology-ultrasound.html' },
        { title: 'Emergency ICU Triage', desc: 'CPR resuscitation, fluid therapy protocols, and critical patient stabilization.', duration: '2 Weeks • 50+ Hrs', image: 'assets/images/learning-path-specialist.webp', url: 'programs.html' }
      ]
    },
    'experienced': {
      badge: 'SPECIALIST SURGEON PATHWAY',
      title: 'Experienced Doctor Advanced Surgical Progression',
      desc: 'Advanced surgical and orthopaedic mastery designed for experienced clinicians with 5–10 years of practice looking to expand into complex organ resections and joint stabilization.',
      image: 'assets/images/program-surgery.webp',
      duration: '8 Weeks',
      hours: '160+ Hours',
      faculty: 'Dr. Rajesh Kulkarni',
      outcome: 'Specialist Surgeon',
      salary: '₹12.0 – ₹22.0 LPA',
      skills: ['Advanced Orthopaedics', 'Bone Plating', 'Intestinal Resection', 'Doppler Ultrasound', 'Complex Triage'],
      ctaText: 'Explore Surgical Fellowship',
      ctaUrl: 'soft-tissue-surgery.html',
      modules: [
        { title: 'Small Animal Orthopaedics', desc: 'Bone fracture repair, plate fixation & joint stabilization techniques.', duration: '6 Weeks • 100+ Hrs', image: 'assets/images/program-surgery.webp', url: 'soft-tissue-surgery.html' },
        { title: 'Advanced Abdominal Surgeries', desc: 'Enterotomy, splenectomy & gastrointestinal surgical procedures.', duration: '4 Weeks • 80+ Hrs', image: 'assets/images/hero-veterinary-training.webp', url: 'soft-tissue-surgery.html' },
        { title: 'Complex Diagnostic Imaging', desc: 'Thoracic radiograph contrast studies & organ Doppler scanning.', duration: '3 Weeks • 60+ Hrs', image: 'assets/images/facility-radiology.webp', url: 'radiology-ultrasound.html' }
      ]
    },
    'student': {
      badge: 'FINAL-YEAR STUDENT PATHWAY',
      title: 'Final-Year Student Foundation Progression',
      desc: 'Bridge academic theory with direct clinical practice before graduation. Master basic suturing, animal handling, catheter placement, blood sampling, and X-ray positioning.',
      image: 'assets/images/counselling-academic-guidance.webp',
      duration: '4 Weeks',
      hours: '70+ Hours',
      faculty: 'Dr. Ananya Sharma',
      outcome: 'Clinic-Ready Intern',
      salary: '₹4.5 – ₹8.0 LPA',
      skills: ['Basic Suturing', 'Animal Handling', 'IV Catheterization', 'X-Ray Positioning', 'Client Communication'],
      ctaText: 'Start Student Prep',
      ctaUrl: 'programs.html',
      modules: [
        { title: 'Clinic-Ready Foundation', desc: 'Essential clinical workflows, patient handling & basic surgical prep.', duration: '4 Weeks • 70+ Hrs', image: 'assets/images/counselling-academic-guidance.webp', url: 'programs.html' },
        { title: 'Basic Diagnostic Pathology', desc: 'Blood smear preparation, urine sediment examination & lab work.', duration: '2 Weeks • 35+ Hrs', image: 'assets/images/edu-radiology-thumb.webp', url: 'programs.html' },
        { title: 'Emergency First Response', desc: 'Basic patient stabilization, wound bandaging & shock triage.', duration: '2 Weeks • 40+ Hrs', image: 'assets/images/learning-path-specialist.webp', url: 'programs.html' }
      ]
    },
    'graduate': {
      badge: 'FRESH GRADUATE PATHWAY',
      title: 'Fresh Graduate Practice Transition Progression',
      desc: 'Designed for 0–1 year graduates entering private practice or multi-specialty hospitals. Gain hands-on exposure to everyday surgeries, radiology, prescription writing, and client relations.',
      image: 'assets/images/learning-path-graduate.webp',
      duration: '5 Weeks',
      hours: '90+ Hours',
      faculty: 'Dr. Vikram Malhotra',
      outcome: 'Autonomous Clinician',
      salary: '₹5.0 – ₹9.5 LPA',
      skills: ['Spay & Neuter', 'Radiograph Reading', 'Emergency Triage', 'Prescription Care', 'Diagnostics'],
      ctaText: 'Join Graduate Track',
      ctaUrl: 'programs.html',
      modules: [
        { title: 'Spay & Neuter Certification', desc: 'Pediatric & adult spay/neuter surgical protocols with 1-on-1 guidance.', duration: '2 Weeks • 50+ Hrs', image: 'assets/images/program-surgery.webp', url: 'soft-tissue-surgery.html' },
        { title: 'Digital X-Ray & Diagnostics', desc: 'Chest & abdominal X-ray interpretation & blood smear workups.', duration: '3 Weeks • 60+ Hrs', image: 'assets/images/facility-radiology.webp', url: 'radiology-ultrasound.html' },
        { title: 'Outpatient Case Management', desc: 'Dermatology triage, gastrointestinal care & client communication.', duration: '2 Weeks • 40+ Hrs', image: 'assets/images/learning-path-doctor.webp', url: 'veterinary-skill-up.html' }
      ]
    },
    'nurse': {
      badge: 'PARAVET & VET NURSE PATHWAY',
      title: 'Vet Nurse Clinical Assistance Progression',
      desc: 'Professional training in patient admission, IV catheterization, anesthesia monitoring support, surgical instrument sterilization, and ICU patient care.',
      image: 'assets/images/edu-flagship-skillup.webp',
      duration: '4 Weeks',
      hours: '70+ Hours',
      faculty: 'Sr. Nurse Priya Shinde',
      outcome: 'Certified Vet Nurse',
      salary: '₹3.5 – ₹6.0 LPA',
      skills: ['IV Catheterization', 'Surgical Scrubbing', 'Vital Tracking', 'Anesthesia Assist', 'ICU Care'],
      ctaText: 'Apply for Vet Nurse Track',
      ctaUrl: 'programs.html',
      modules: [
        { title: 'Operation Theatre Assistance', desc: 'Surgical pack prep, sterile protocol & instrument handling.', duration: '2 Weeks • 40+ Hrs', image: 'assets/images/edu-flagship-skillup.webp', url: 'programs.html' },
        { title: 'Patient Vital & ICU Monitoring', desc: 'Pulse oximetry, fluid infusion & temp monitoring for critical pets.', duration: '2 Weeks • 35+ Hrs', image: 'assets/images/learning-path-specialist.webp', url: 'programs.html' },
        { title: 'Hospital Sanitation & Hygiene', desc: 'Infection prevention, cage sanitation & clinic safety workflows.', duration: '2 Weeks • 30+ Hrs', image: 'assets/images/vet_facility_main_training.webp', url: 'programs.html' }
      ]
    },
    'pet-care': {
      badge: 'PET OWNER & RESCUER PATHWAY',
      title: 'Pet Care Emergency Response Progression',
      desc: 'Hands-on emergency response workshop covering canine choking relief, wound bandaging, heatstroke triage, poisoning management, and basic CPR for pet owners.',
      image: 'assets/images/counselling-academic-guidance.webp',
      duration: '1 Week',
      hours: '15+ Hours',
      faculty: 'Dr. Vikram Malhotra',
      outcome: 'First Aid Responder',
      salary: 'Lifesaving Competency',
      skills: ['Canine CPR', 'Choking Relief', 'Bandaging', 'Heatstroke Care', 'Poison Triage'],
      ctaText: 'Register for First Aid',
      ctaUrl: 'programs.html',
      modules: [
        { title: 'Pet Emergency First Aid', desc: 'Choking relief, CPR, wound bandaging & heatstroke emergency care.', duration: '1 Week • 15+ Hrs', image: 'assets/images/counselling-academic-guidance.webp', url: 'programs.html' },
        { title: 'Vaccination & Deworming', desc: 'Core vaccine schedules, parasite prevention & nutrition management.', duration: '1 Week • 10+ Hrs', image: 'assets/images/learning-path-graduate.webp', url: 'programs.html' },
        { title: 'Pet Behavior & Stress Triage', desc: 'Anxiety reduction, safe handling & behavioral modification.', duration: '1 Week • 15+ Hrs', image: 'assets/images/learning-path-doctor.webp', url: 'programs.html' }
      ]
    }
  };

  function selectProfile(card) {
    const profile = card.getAttribute('data-profile');
    const data = profileData[profile];
    if (!data) return;

    profileCards.forEach(c => {
      c.classList.remove('lj-profile-active');
      c.setAttribute('aria-selected', 'false');
    });

    card.classList.add('lj-profile-active');
    card.setAttribute('aria-selected', 'true');

    const imgEl = document.getElementById('lj-details-img');
    if (imgEl) {
      imgEl.style.opacity = '0';
      setTimeout(() => {
        imgEl.src = data.image;
        imgEl.style.opacity = '1';
      }, 180);
    }

    const badgeEl = document.getElementById('lj-badge');
    const titleEl = document.getElementById('lj-title');
    const descEl = document.getElementById('lj-desc');
    const durationEl = document.getElementById('lj-duration');
    const hoursEl = document.getElementById('lj-hours');
    const facultyEl = document.getElementById('lj-faculty');
    const outcomeEl = document.getElementById('lj-outcome');
    const salaryEl = document.getElementById('lj-salary');
    const ctaEl = document.getElementById('lj-cta-btn');
    const skillsContainer = document.getElementById('lj-skills-chips');
    const modulesContainer = document.getElementById('lj-recommended-modules');

    if (badgeEl) badgeEl.textContent = data.badge;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (durationEl) durationEl.textContent = data.duration;
    if (hoursEl) hoursEl.textContent = data.hours;
    if (facultyEl) facultyEl.textContent = data.faculty;
    if (outcomeEl) outcomeEl.textContent = data.outcome;
    if (salaryEl) salaryEl.textContent = data.salary;
    if (ctaEl) {
      ctaEl.setAttribute('href', data.ctaUrl);
      const span = ctaEl.querySelector('span');
      if (span) span.textContent = data.ctaText;
    }

    if (skillsContainer) {
      skillsContainer.innerHTML = data.skills.map(s => `<span class="lj-chip">${s}</span>`).join('');
    }

    if (modulesContainer && data.modules) {
      modulesContainer.innerHTML = data.modules.map(mod => `
        <div class="lj-module-card">
          <div class="lj-module-image">
            <img src="${mod.image}" alt="${mod.title}" />
          </div>
          <div class="lj-module-content">
            <h4>${mod.title}</h4>
            <p>${mod.desc}</p>
            <div class="lj-module-footer">
              <span>${mod.duration}</span>
              <a href="${mod.url}" style="color: var(--v2-navy-dark); text-decoration: none;">Explore <i class="fa-solid fa-arrow-right" style="color: var(--v2-teal-primary);"></i></a>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  profileCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'tab');

    card.addEventListener('click', () => selectProfile(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectProfile(card);
      }
    });
  });
}

/**
 * 2. Fixed Careers Slider Module (.homepage-v2-careers)
 */
function initCareersSlider() {
  const sliderShell = document.getElementById('careers-slider-shell');
  const track = document.getElementById('careers-track');
  const prevBtn = document.getElementById('careers-prev');
  const nextBtn = document.getElementById('careers-next');
  const careerCards = document.querySelectorAll('.career-card');

  if (!track || !careerCards.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let rafId = null;

  const careerInformationData = {
    'surgery': {
      title: 'Soft Tissue Surgery Masterclass',
      desc: 'Build independent surgical dexterity, incision confidence, spay/neuter protocols, and abdominal procedure mastery under senior surgeons in our Pune surgical suite.',
      image: 'assets/images/hero-veterinary-training.webp',
      quote: '"Learn through real clinical cases under specialist 1-on-1 supervision."',
      duration: '4 Weeks',
      hours: '80+ Hours',
      salary: '₹6.5 – ₹12.0 LPA',
      skills: ['Soft Tissue Suturing', 'Abdominal Incisions', 'Pre-Op Triage', 'Spay & Neuter', 'Post-Op Care'],
      ctaText: 'Apply for Surgery Track',
      ctaUrl: 'contact.html#enquiry'
    },
    'radiology': {
      title: 'Digital Radiology & Diagnostic Ultrasound',
      desc: 'Master X-ray positioning, radiograph interpretation, and bedside abdominal ultrasound scanning for small animals under 1-on-1 guidance.',
      image: 'assets/images/facility-radiology.webp',
      quote: '"Precision radiograph diagnostic scanning for soft tissue & skeletal triage."',
      duration: '3 Weeks',
      hours: '60+ Hours',
      salary: '₹5.5 – ₹10.0 LPA',
      skills: ['Radiograph Analysis', 'Ultrasound Scanning', 'Contrast Imaging', 'Organ Assessment'],
      ctaText: 'Apply for Radiology Track',
      ctaUrl: 'contact.html#enquiry'
    },
    'diagnostics': {
      title: 'Clinical Pathology & Diagnostics',
      desc: 'Hands-on laboratory diagnostic training in blood smear analysis, cytology, biochemistry panels, and infectious disease diagnostics.',
      image: 'assets/images/edu-radiology-thumb.webp',
      quote: '"Master blood cytology, microscopy, and automated pathology analysis."',
      duration: '2 Weeks',
      hours: '40+ Hours',
      salary: '₹5.0 – ₹9.5 LPA',
      skills: ['Blood Smear Cytology', 'Biochemistry Reading', 'Hematology', 'Microscopy'],
      ctaText: 'Apply for Diagnostics Track',
      ctaUrl: 'contact.html#enquiry'
    },
    'emergency': {
      title: 'ICU & Emergency Critical Care',
      desc: 'Master CPR resuscitation, fluid therapy protocols, ventilator monitoring, and critical emergency patient stabilization.',
      image: 'assets/images/learning-path-specialist.webp',
      quote: '"Rapid emergency triage and ICU stabilization protocols for trauma cases."',
      duration: '2 Weeks',
      hours: '50+ Hours',
      salary: '₹6.0 – ₹11.0 LPA',
      skills: ['Emergency CPR', 'Fluid Therapy', 'ICU Stabilization', 'Oxygen Protocol'],
      ctaText: 'Apply for ICU Track',
      ctaUrl: 'contact.html#enquiry'
    },
    'trauma': {
      title: 'Small Animal Trauma & Emergency Medicine',
      desc: 'Comprehensive emergency response training for trauma management, bite wounds, acute poisoning, and cardiac arrest triage.',
      image: 'assets/images/program-surgery.webp',
      quote: '"Immediate trauma assessment, bandaging, and surgical emergency response."',
      duration: '2 Weeks',
      hours: '45+ Hours',
      salary: '₹5.5 – ₹10.5 LPA',
      skills: ['Trauma Triage', 'Wound Bandaging', 'Poisoning Care', 'Shock Management'],
      ctaText: 'Apply for Emergency Track',
      ctaUrl: 'contact.html#enquiry'
    },
    'nurse': {
      title: 'Paravet Clinical Nurse & ICU Assistant',
      desc: 'Professional clinical nursing skills, IV catheter placement, patient vital monitoring, and surgical assistant workflows.',
      image: 'assets/images/edu-flagship-skillup.webp',
      quote: '"Essential veterinary nursing care, patient monitoring, and surgical prep."',
      duration: '4 Weeks',
      hours: '70+ Hours',
      salary: '₹3.5 – ₹6.0 LPA',
      skills: ['IV Catheterization', 'Surgical Prep', 'Vital Monitoring', 'Clinic Workflow'],
      ctaText: 'Apply for Vet Nurse Track',
      ctaUrl: 'contact.html#enquiry'
    },
    'owner': {
      title: 'Clinic Practice Owner & Lead Clinician',
      desc: 'End-to-end clinical operational mastery combining surgical protocols, diagnostic infrastructure, and multi-specialty hospital management.',
      image: 'assets/images/counselling-academic-guidance.webp',
      quote: '"Comprehensive clinical enterprise mentorship for veterinary clinic owners."',
      duration: '6 Weeks',
      hours: '100+ Hours',
      salary: '₹10.0 – ₹20.0 LPA',
      skills: ['Hospital Management', 'Advanced Surgeries', 'Diagnostic Setup', 'Patient Relations'],
      ctaText: 'Apply for Practice Owner Track',
      ctaUrl: 'contact.html#enquiry'
    }
  };

  function updateActiveCard(index) {
    currentIndex = (index + careerCards.length) % careerCards.length;

    careerCards.forEach((c, idx) => {
      if (idx === currentIndex) {
        c.classList.add('career-card-active');
        c.setAttribute('aria-selected', 'true');
      } else {
        c.classList.remove('career-card-active');
        c.setAttribute('aria-selected', 'false');
      }
    });

    let targetTranslate = 0;
    for (let i = 0; i < currentIndex; i++) {
      const width = careerCards[i].offsetWidth;
      targetTranslate += width + 32;
    }

    track.style.transform = `translateX(-${targetTranslate}px)`;
    prevTranslate = -targetTranslate;

    const activeCard = careerCards[currentIndex];
    const careerKey = activeCard.getAttribute('data-career');
    const data = careerInformationData[careerKey];
    if (data) {
      const imgEl = document.getElementById('careers-preview-img');
      const quoteEl = document.getElementById('careers-quote');
      if (imgEl) {
        imgEl.style.opacity = '0';
        setTimeout(() => {
          imgEl.src = data.image;
          imgEl.style.opacity = '1';
        }, 180);
      }
      if (quoteEl) quoteEl.textContent = data.quote;

      const titleEl = document.getElementById('careers-program-title');
      const descEl = document.getElementById('careers-program-desc');
      const durationEl = document.getElementById('careers-duration');
      const hoursEl = document.getElementById('careers-hours');
      const salaryEl = document.getElementById('careers-salary');
      const ctaEl = document.getElementById('careers-cta-btn');
      const skillsContainer = document.getElementById('careers-skills-chips');

      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      if (durationEl) durationEl.textContent = data.duration;
      if (hoursEl) hoursEl.textContent = data.hours;
      if (salaryEl) salaryEl.textContent = data.salary;
      if (ctaEl) {
        ctaEl.setAttribute('href', data.ctaUrl);
        const span = ctaEl.querySelector('span');
        if (span) span.textContent = data.ctaText;
      }

      if (skillsContainer) {
        skillsContainer.innerHTML = data.skills.map(s => `<span class="careers-chip">${s}</span>`).join('');
      }
    }
  }

  if (nextBtn) nextBtn.addEventListener('click', () => updateActiveCard(currentIndex + 1));
  if (prevBtn) prevBtn.addEventListener('click', () => updateActiveCard(currentIndex - 1));

  careerCards.forEach((card, idx) => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', () => updateActiveCard(idx));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateActiveCard(idx);
      }
    });
  });

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      updateActiveCard(currentIndex + 1);
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  if (sliderShell) {
    sliderShell.addEventListener('mouseenter', stopAutoplay);
    sliderShell.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();

  // Smooth Touch & Mouse Drag Engine using requestAnimationFrame
  function setTrackPosition(translatePx) {
    track.style.transform = `translateX(${translatePx}px)`;
  }

  if (sliderShell) {
    sliderShell.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      stopAutoplay();
    });

    sliderShell.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      currentTranslate = prevTranslate + diff;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setTrackPosition(currentTranslate));
    });

    sliderShell.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (diff < -50) updateActiveCard(currentIndex + 1);
      else if (diff > 50) updateActiveCard(currentIndex - 1);
      else updateActiveCard(currentIndex);
      startAutoplay();
    });

    sliderShell.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      stopAutoplay();
    });

    sliderShell.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const diff = e.clientX - startX;
      currentTranslate = prevTranslate + diff;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setTrackPosition(currentTranslate));
    });

    window.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = e.clientX - startX;
      if (diff < -50) updateActiveCard(currentIndex + 1);
      else if (diff > 50) updateActiveCard(currentIndex - 1);
      else updateActiveCard(currentIndex);
      startAutoplay();
    });
  }
}

/**
 * 3. Unified Hero Filtering Module (#popular-courses)
 */
function initPopularCourses() {
  const filterPills = document.querySelectorAll('.popular-course-filter-pill');
  if (!filterPills.length) return;

  const categoryCoursesData = {
    'all': {
      hero: {
        title: 'Soft Tissue Surgery Masterclass',
        badge: 'CLINICAL MASTERCLASS',
        desc: 'Master standard incisions, stitching techniques, spay/neuter protocols, and abdominal organ surgeries under 1-on-1 specialist guidance in our Pune surgical suite.',
        image: 'assets/images/program-surgery.webp',
        faculty: 'Dr. Rajesh Kulkarni',
        hours: '80+ Hours',
        mentorship: '1:1 Mentorship',
        cert: 'VetNova Certified',
        ctaUrl: 'soft-tissue-surgery.html'
      },
      supporting: [
        { num: '01', title: 'Digital Radiology & Ultrasound', desc: '3 Weeks • Digital X-ray & abdominal scanning', category: 'radiology' },
        { num: '02', title: 'Emergency ICU Triage', desc: '2 Weeks • CPR, fluid therapy & critical care', category: 'emergency' },
        { num: '03', title: 'Small Animal Orthopaedics', desc: '6 Weeks • Bone fracture & plating techniques', category: 'surgery' },
        { num: '04', title: 'Diagnostic Pathology', desc: '2 Weeks • Blood smear, cytology & lab work', category: 'diagnostics' }
      ]
    },
    'surgery': {
      hero: {
        title: 'Soft Tissue Surgery Masterclass',
        badge: 'SURGICAL SPECIALIZATION',
        desc: 'Comprehensive hands-on surgical immersion covering abdominal wall incisions, gastrointestinal surgery, cystotomy, and wound repair under specialist supervision.',
        image: 'assets/images/program-surgery.webp',
        faculty: 'Dr. Rajesh Kulkarni',
        hours: '80+ Hours',
        mentorship: '1:1 Surgical',
        cert: 'Surgical Accredited',
        ctaUrl: 'soft-tissue-surgery.html'
      },
      supporting: [
        { num: '01', title: 'Advanced Suturing & Wound Closure', desc: '2 Weeks • Tension suturing & skin flap techniques', category: 'surgery' },
        { num: '02', title: 'Small Animal Orthopaedics', desc: '6 Weeks • Bone fracture repair & plating', category: 'surgery' },
        { num: '03', title: 'Spay & Neuter Certification', desc: '2 Weeks • High-volume pediatric spay protocols', category: 'surgery' },
        { num: '04', title: 'Emergency Surgical Techniques', desc: '3 Weeks • Hemoperitoneum & intestinal resection', category: 'surgery' }
      ]
    },
    'radiology': {
      hero: {
        title: 'Digital Radiology & Diagnostic Ultrasound',
        badge: 'IMAGING SPECIALIZATION',
        desc: 'Precision X-ray positioning, artifact elimination, radiograph reporting, and bedside abdominal ultrasound scanning protocols for small animal practice.',
        image: 'assets/images/facility-radiology.webp',
        faculty: 'Dr. Ananya Sharma',
        hours: '60+ Hours',
        mentorship: 'Diagnostic Wet Lab',
        cert: 'Radiology Certified',
        ctaUrl: 'radiology-ultrasound.html'
      },
      supporting: [
        { num: '01', title: 'Digital X-Ray Interpretation', desc: '2 Weeks • Skeletal & chest radiograph reading', category: 'radiology' },
        { num: '02', title: 'Abdominal Ultrasound Masterclass', desc: '3 Weeks • Organ scanning & Doppler analysis', category: 'radiology' },
        { num: '03', title: 'Thoracic Radiology Essentials', desc: '2 Weeks • Cardiac silhouette & lung field evaluation', category: 'radiology' },
        { num: '04', title: 'CT & MRI Fundamentals', desc: '4 Weeks • Advanced cross-sectional diagnostic imaging', category: 'radiology' }
      ]
    },
    'medicine': {
      hero: {
        title: 'Small Animal Internal Medicine',
        badge: 'CLINICAL MEDICINE',
        desc: 'Master differential diagnosis, clinical case management, endocrine disorder triage, gastroenterology, and renal care for companion animals.',
        image: 'assets/images/learning-path-doctor.webp',
        faculty: 'Dr. Ananya Sharma',
        hours: '80+ Hours',
        mentorship: 'Case Discussions',
        cert: 'Clinical Accredited',
        ctaUrl: 'veterinary-skill-up.html'
      },
      supporting: [
        { num: '01', title: 'Critical Care & Emergency Medicine', desc: '2 Weeks • Acute organ failure & septic shock', category: 'medicine' },
        { num: '02', title: 'Clinical Cardiology & ECG Basics', desc: '3 Weeks • Murmur grading & arrhythmia reading', category: 'medicine' },
        { num: '03', title: 'Nephrology & Renal Essentials', desc: '2 Weeks • AKI management & fluid balance', category: 'medicine' },
        { num: '04', title: 'Small Animal Dermatology', desc: '2 Weeks • Skin cytology & allergy management', category: 'medicine' }
      ]
    },
    'diagnostics': {
      hero: {
        title: 'Clinical Pathology & Laboratory Diagnostics',
        badge: 'DIAGNOSTIC PATHOLOGY',
        desc: 'Practical lab workflow training in blood smear examination, complete blood counts, serum biochemistry interpretation, cytology, and urinalysis.',
        image: 'assets/images/edu-radiology-thumb.webp',
        faculty: 'Dr. Sameer Joshi',
        hours: '40+ Hours',
        mentorship: 'Microscopy Lab',
        cert: 'Pathology Certified',
        ctaUrl: 'programs.html'
      },
      supporting: [
        { num: '01', title: 'Blood Smear & Hematology', desc: '1 Week • Anemia evaluation & cell morphology', category: 'diagnostics' },
        { num: '02', title: 'Urinalysis & Biochemistry', desc: '1 Week • Sediment examination & kidney panels', category: 'diagnostics' },
        { num: '03', title: 'Diagnostic Cytology & Biopsy', desc: '2 Weeks • Fine needle aspiration & mass evaluation', category: 'diagnostics' },
        { num: '04', title: 'Laboratory Diagnostic Workflow', desc: '2 Weeks • In-house lab equipment management', category: 'diagnostics' }
      ]
    },
    'emergency': {
      hero: {
        title: 'Emergency ICU Triage & Critical Care',
        badge: 'EMERGENCY SPECIALIZATION',
        desc: 'Master rapid patient triage, RECOVER CPR protocols, mechanical ventilation monitoring, venous access, and acute trauma stabilization.',
        image: 'assets/images/learning-path-specialist.webp',
        faculty: 'Dr. Vikram Malhotra',
        hours: '50+ Hours',
        mentorship: 'ICU Simulation',
        cert: 'Emergency Certified',
        ctaUrl: 'programs.html'
      },
      supporting: [
        { num: '01', title: 'CPR & Resuscitation Protocols', desc: '1 Week • RECOVER guidelines & chest compressions', category: 'emergency' },
        { num: '02', title: 'Small Animal Trauma Stabilization', desc: '2 Weeks • Hemorrhage control & shock management', category: 'emergency' },
        { num: '03', title: 'Toxic Poisoning Management', desc: '1 Week • Antidotes & decontamination triage', category: 'emergency' },
        { num: '04', title: 'Emergency Fluid Therapy', desc: '2 Weeks • Electrolyte rebalancing & CRI infusion', category: 'emergency' }
      ]
    },
    'vet-nurse': {
      hero: {
        title: 'Paravet Clinical Nurse & ICU Assistant',
        badge: 'CLINICAL NURSING',
        desc: 'Professional training in patient admission, IV catheterization, anesthesia monitoring support, surgical instrument sterilization, and ICU care.',
        image: 'assets/images/edu-flagship-skillup.webp',
        faculty: 'Sr. Nurse Priya Shinde',
        hours: '70+ Hours',
        mentorship: 'Hospital Floor',
        cert: 'Nurse Certified',
        ctaUrl: 'programs.html'
      },
      supporting: [
        { num: '01', title: 'Operation Theatre Assistance', desc: '2 Weeks • Surgical scrub & sterile pack prep', category: 'vet-nurse' },
        { num: '02', title: 'Patient Vital Monitoring', desc: '2 Weeks • Pulse oximetry & temp tracking', category: 'vet-nurse' },
        { num: '03', title: 'Hospital Workflow & Sanitation', desc: '2 Weeks • Infection control & clinic hygiene', category: 'vet-nurse' },
        { num: '04', title: 'ICU Nursing Protocols', desc: '3 Weeks • Feeding tube & catheter care', category: 'vet-nurse' }
      ]
    },
    'pet-care': {
      hero: {
        title: 'Pet Parents Emergency First Aid',
        badge: 'PET FIRST AID',
        desc: 'Hands-on emergency response workshop covering canine choking relief, wound bandaging, heatstroke triage, and basic CPR for pet owners.',
        image: 'assets/images/counselling-academic-guidance.webp',
        faculty: 'Dr. Vikram Malhotra',
        hours: '15+ Hours',
        mentorship: 'Pet Parent Lab',
        cert: 'First Aid Certificate',
        ctaUrl: 'programs.html'
      },
      supporting: [
        { num: '01', title: 'Vaccination & Preventive Protocols', desc: '1 Week • Core vaccine schedules & deworming', category: 'pet-care' },
        { num: '02', title: 'Pet Nutrition & Dietary Management', desc: '1 Week • Raw, commercial & therapeutic diets', category: 'pet-care' },
        { num: '03', title: 'Pet Behavior & Stress Triage', desc: '1 Week • Anxiety reduction & safe handling', category: 'pet-care' },
        { num: '04', title: 'Pet Grooming & Preventive Health', desc: '1 Week • Ear cleaning, coat care & dental health', category: 'pet-care' }
      ]
    }
  };

  const heroImg = document.getElementById('hero-course-img');
  const heroBadge = document.getElementById('hero-course-badge');
  const heroTitle = document.getElementById('hero-course-title');
  const heroDesc = document.getElementById('hero-course-desc');
  const heroFaculty = document.getElementById('hero-meta-faculty');
  const heroHours = document.getElementById('hero-meta-hours');
  const heroMentorship = document.getElementById('hero-meta-mentorship');
  const heroCert = document.getElementById('hero-meta-cert');
  const heroCta = document.getElementById('hero-course-cta');
  const navigatorContainer = document.getElementById('supporting-courses-navigator');

  function applyCategoryFilter(pill) {
    const filter = pill.getAttribute('data-filter');
    const data = categoryCoursesData[filter] || categoryCoursesData['all'];

    filterPills.forEach(p => {
      p.classList.remove('active');
      p.setAttribute('aria-selected', 'false');
    });

    pill.classList.add('active');
    pill.setAttribute('aria-selected', 'true');

    if (heroImg) {
      heroImg.style.opacity = '0';
      setTimeout(() => {
        heroImg.src = data.hero.image;
        heroImg.style.opacity = '1';
      }, 180);
    }
    if (heroBadge) heroBadge.textContent = data.hero.badge;
    if (heroTitle) heroTitle.textContent = data.hero.title;
    if (heroDesc) heroDesc.textContent = data.hero.desc;
    if (heroFaculty) heroFaculty.textContent = data.hero.faculty;
    if (heroHours) heroHours.textContent = data.hero.hours;
    if (heroMentorship) heroMentorship.textContent = data.hero.mentorship;
    if (heroCert) heroCert.textContent = data.hero.cert;
    if (heroCta) heroCta.setAttribute('href', data.hero.ctaUrl);

    if (navigatorContainer && data.supporting) {
      navigatorContainer.innerHTML = data.supporting.map((item, idx) => `
        <div class="v2-program-nav-row ${idx === 0 ? 'active' : ''}" data-category="${item.category}">
          <span class="v2-program-nav-num">${item.num}</span>
          <div class="v2-program-nav-info">
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
          </div>
        </div>
      `).join('');
    }
  }

  filterPills.forEach(pill => {
    pill.setAttribute('role', 'tab');
    pill.addEventListener('click', () => applyCategoryFilter(pill));
    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        applyCategoryFilter(pill);
      }
    });
  });
}

/**
 * 4. Learning Path Quiz Assessment Module (#quiz-section)
 */
function initQuizWidget() {
  const step1Content = document.getElementById('step-1-content');
  const step2Content = document.getElementById('step-2-content');
  const step3Content = document.getElementById('step-3-content');
  if (!step1Content || !step2Content || !step3Content) return;

  const roleButtons = step1Content.querySelectorAll('.quiz-opt-btn');
  const backBtn = document.getElementById('quiz-back-btn');
  const resetBtn = document.getElementById('quiz-reset-btn');
  const goalContainer = document.getElementById('goal-options-container');

  const goalOptions = {
    'early-career': [
      { goal: 'surgeries', title: 'Soft Tissue Surgeries', desc: 'Abdominal incisions, spay/neuter dexterity' },
      { goal: 'radiology', title: 'Digital X-Ray & Ultrasound', desc: 'Radiograph reading & organ scanning' },
      { goal: 'icu', title: 'Emergency ICU Triage', desc: 'CPR, resuscitation & acute stabilization' }
    ],
    'experienced': [
      { goal: 'ortho', title: 'Orthopaedics & Bone Plating', desc: 'Fracture repair & joint stabilization' },
      { goal: 'resection', title: 'Complex Abdominal Organ Resection', desc: 'Splenectomy, enterotomy & tumor removal' }
    ],
    'student': [
      { goal: 'fundamentals', title: 'Clinic-Ready Fundamentals', desc: 'Basic suturing, catheterization & handling' },
      { goal: 'diagnostics', title: 'Pathology & Blood Cytology', desc: 'Lab workups, urine sediment & CBC' }
    ],
    'graduate': [
      { goal: 'spay', title: 'High-Volume Spay & Neuter', desc: 'Autonomous surgical confidence' },
      { goal: 'xray', title: 'Digital Radiology Positioning', desc: 'Chest & abdominal radiograph reading' }
    ],
    'nurse': [
      { goal: 'ot-assist', title: 'Operation Theatre Prep', desc: 'Sterile scrubbing & instrument packing' },
      { goal: 'vitals', title: 'Patient Vital Tracking', desc: 'Pulse oximetry & fluid infusion monitoring' }
    ],
    'pet-owner': [
      { goal: 'first-aid', title: 'Pet Emergency First Aid', desc: 'Choking relief, CPR & wound bandaging' }
    ]
  };

  let selectedRole = '';

  roleButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      selectedRole = this.getAttribute('data-role');
      const goals = goalOptions[selectedRole] || goalOptions['early-career'];

      if (goalContainer) {
        goalContainer.innerHTML = goals.map(g => `
          <button class="quiz-opt-btn" data-goal="${g.goal}">
            <div class="text"><b>${g.title}</b><small>${g.desc}</small></div>
          </button>
        `).join('');

        goalContainer.querySelectorAll('.quiz-opt-btn').forEach(gBtn => {
          gBtn.addEventListener('click', function () {
            showResult();
          });
        });
      }

      step1Content.classList.remove('active');
      step2Content.classList.add('active');
    });
  });

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      step2Content.classList.remove('active');
      step1Content.classList.add('active');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      step3Content.classList.remove('active');
      step1Content.classList.add('active');
    });
  }

  function showResult() {
    step2Content.classList.remove('active');
    step3Content.classList.add('active');
  }
}
