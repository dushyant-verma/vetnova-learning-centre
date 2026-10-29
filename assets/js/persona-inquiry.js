/**
 * VetNova Academy - Persona-Specific Inquiry & Lead Management
 * Supports 4 distinct audiences:
 * 1. Veterinary students and fresh graduates
 * 2. Practising veterinary doctors
 * 3. Veterinary nurses and nursing-course aspirants
 * 4. Sponsors and corporate partners
 */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '9272561089';
  const WHATSAPP_INTL = '919272561089';
  const WHATSAPP_DEFAULT_MSG = encodeURIComponent('Hello VetNova Academy, I would like to know more about your veterinary training programs.');

  const PERSONA_CONFIGS = {
    student: {
      key: 'student',
      title: 'Veterinary Students and Fresh Graduates',
      shortTitle: 'Students & Fresh Grads',
      badge: 'Early Career & Interns',
      icon: 'fa-solid fa-graduation-cap',
      cardDesc: 'For veterinary students, interns and fresh graduates preparing for confident clinical practice.',
      heading: 'Start Your Veterinary Career with Confidence',
      description: 'For veterinary students, interns and fresh graduates.',
      submitText: 'Explore Training Opportunities',
      thankYou: {
        heading: 'Thank You for Connecting with VetNova!',
        body: "Your veterinary journey deserves more than knowledge alone—it deserves the confidence to apply it. We're here to help you bridge the gap between learning and clinical practice.<br><br>Let's build your skills for a confident future in veterinary care. We'll be in touch soon!"
      }
    },
    practitioner: {
      key: 'practitioner',
      title: 'Practising Veterinary Doctors',
      shortTitle: 'Practising Doctors',
      badge: 'Clinicians & Surgeons',
      icon: 'fa-solid fa-user-doctor',
      cardDesc: 'For veterinary practitioners seeking hands-on surgical training, advanced medicine, and clinical growth.',
      heading: 'Advance Your Clinical Skills',
      description: 'For veterinary practitioners seeking practical training and professional growth.',
      submitText: 'Explore Advanced Training',
      thankYou: {
        heading: 'Thank You for Connecting with VetNova!',
        body: "Every clinician has the potential to grow, advance and make a greater difference. We look forward to exploring practical learning opportunities that strengthen your skills and elevate your clinical practice.<br><br>Let's take veterinary excellence forward—together. We'll be in touch soon!"
      }
    },
    nurse: {
      key: 'nurse',
      title: 'Veterinary Nurses & Aspirants',
      shortTitle: 'Veterinary Nurses',
      badge: 'Animal Care & Paravet',
      icon: 'fa-solid fa-user-nurse',
      cardDesc: 'For aspiring veterinary nurses, animal-care professionals and clinical support staff.',
      heading: 'Build Skills That Make a Difference',
      description: 'For aspiring veterinary nurses, animal-care professionals and current veterinary support staff.',
      submitText: 'Explore Learning Opportunities',
      thankYou: {
        heading: 'Thank You for Exploring Your Journey with VetNova!',
        body: "Every skilled veterinary nurse makes a difference in an animal's life. We're excited to help you explore practical skills that turn your passion for animal care into meaningful capability.<br><br>Your journey towards better animal care starts here. We'll be in touch soon!"
      }
    },
    partner: {
      key: 'partner',
      title: 'Sponsors and Corporate Partners',
      shortTitle: 'Sponsors & Partners',
      badge: 'Industry & Institutional',
      icon: 'fa-solid fa-handshake',
      cardDesc: 'For pharmaceutical, diagnostics, nutrition, equipment and industry partners seeking collaboration.',
      heading: 'Partner with VetNova to Advance Veterinary Education',
      description: 'For pharmaceutical, diagnostics, nutrition, equipment and other industry partners.',
      submitText: 'Discuss a Partnership',
      thankYou: {
        heading: 'Thank You for Your Interest in Partnering with VetNova!',
        body: "Together, we can bridge the gap between veterinary education and clinical practice, empower veterinary professionals, and contribute to better animal healthcare.<br><br>We look forward to exploring a meaningful collaboration where shared goals create lasting impact. We'll be in touch soon!"
      }
    }
  };

  // Indian mobile validation: 10 digits starting with 6, 7, 8, or 9
  function isValidPhone(phone) {
    if (!phone) return false;
    const clean = phone.replace(/[\s\-]/g, '');
    const indianRegex = /^(?:\+?91)?[6-9]\d{9}$/;
    const intlRegex = /^\+?\d{8,15}$/;
    return indianRegex.test(clean) || intlRegex.test(clean);
  }

  function isValidEmail(email) {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function formatProgramName(str) {
    if (!str) return '';
    return decodeURIComponent(str)
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\b(And|Or|Of|In|For|The)\b/g, m => m.toLowerCase())
      .trim();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Initialize Persona Inquiry Widget
  function initPersonaInquiry(containerId = 'persona-inquiry-widget') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Determine initial persona and program from URL params or hash
    const urlParams = new URLSearchParams(window.location.search);
    const rawProgram = urlParams.get('program') || urlParams.get('course') || urlParams.get('context') || '';
    const programName = formatProgramName(rawProgram);
    const paramPersona = urlParams.get('persona') || (window.location.hash ? window.location.hash.replace('#', '') : '');
    let activePersona = PERSONA_CONFIGS[paramPersona] ? paramPersona : 'student';

    renderWidget(container, activePersona, programName);
  }

  function renderWidget(container, activePersona, programName = '') {
    container.innerHTML = `
      <div class="persona-inquiry-box">
        <!-- Section Header -->
        <div class="persona-section-head">
          <span class="persona-eyebrow">
            <i class="fa-solid fa-compass"></i> PERSONA-SPECIFIC ADMISSIONS &amp; PARTNERSHIPS
          </span>
          <h2 class="persona-main-title">Find the Right Path with VetNova</h2>
          <p class="persona-main-sub">
            Tell us about yourself and what you hope to achieve. We'll help you explore relevant veterinary training opportunities or partnership options.
          </p>
          ${programName ? `
            <div class="persona-program-banner">
              <i class="fa-solid fa-graduation-cap"></i>
              <span>Enquiring for Program: <strong>${escapeHtml(programName)}</strong></span>
            </div>
          ` : ''}
        </div>

        <!-- Four Audience Cards / Tab Selector -->
        <div class="persona-cards-grid" role="tablist" aria-label="Select your audience profile">
          ${Object.values(PERSONA_CONFIGS).map(p => `
            <button type="button" 
              role="tab"
              id="tab-${p.key}"
              aria-controls="form-panel-${p.key}"
              aria-selected="${p.key === activePersona ? 'true' : 'false'}"
              class="persona-card-btn ${p.key === activePersona ? 'active' : ''}"
              data-persona="${p.key}">
              <div class="persona-card-header">
                <span class="persona-card-icon"><i class="${p.icon}"></i></span>
                <span class="persona-card-badge">${p.badge}</span>
              </div>
              <h3 class="persona-card-title">${p.shortTitle}</h3>
              <p class="persona-card-desc">${p.cardDesc}</p>
              <div class="persona-card-action">
                <span>Select Pathway</span>
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </button>
          `).join('')}
        </div>

        <!-- Active Persona Form Container -->
        <div class="persona-form-wrapper" id="persona-form-container">
          ${renderFormContent(activePersona, programName)}
        </div>

        <!-- Optional WhatsApp Contact Box -->
        <div class="persona-whatsapp-banner">
          <div class="whatsapp-banner-content">
            <div class="whatsapp-banner-icon">
              <i class="fa-brands fa-whatsapp"></i>
            </div>
            <div>
              <h4>Prefer to chat directly?</h4>
              <p>Connect with the VetNova Academy admissions desk on WhatsApp at <strong>+91 ${WHATSAPP_NUMBER}</strong> for immediate guidance.</p>
            </div>
          </div>
          <a href="https://wa.me/${WHATSAPP_INTL}?text=${WHATSAPP_DEFAULT_MSG}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="whatsapp-chat-btn">
            <i class="fa-brands fa-whatsapp"></i> Open WhatsApp Chat
          </a>
        </div>
      </div>
    `;

    bindWidgetEvents(container, programName);
  }

  function renderFormContent(personaKey, programName = '') {
    const config = PERSONA_CONFIGS[personaKey];

    let fieldsHtml = '';

    if (personaKey === 'student') {
      fieldsHtml = `
        <div class="form-row-2">
          <!-- Full Name -->
          <div class="form-field-group">
            <label for="student-name">Full Name <span class="req">*</span></label>
            <input type="text" id="student-name" name="name" required placeholder="Dr. / Mr. / Ms. Full Name" class="persona-input" />
            <span class="field-error-msg" id="err-student-name"></span>
          </div>

          <!-- Current Stage -->
          <div class="form-field-group">
            <label for="student-stage">Your Current Stage <span class="req">*</span></label>
            <select id="student-stage" name="currentStage" required class="persona-select">
              <option value="" disabled selected>Select your stage</option>
              <option value="Veterinary student">Veterinary student</option>
              <option value="Intern">Intern</option>
              <option value="Fresh graduate">Fresh graduate</option>
            </select>
            <span class="field-error-msg" id="err-student-stage"></span>
          </div>
        </div>

        <div class="form-row-2">
          <!-- Area of Interest -->
          <div class="form-field-group">
            <label for="student-area">Area of Interest <span class="req">*</span></label>
            <select id="student-area" name="areaOfInterest" required class="persona-select">
              <option value="" disabled selected>Select area of interest</option>
              <option value="Small animal clinical practice">Small animal clinical practice</option>
              <option value="Large animal practice">Large animal practice</option>
              <option value="Mixed practice">Mixed practice</option>
              <option value="Veterinary specialization">Veterinary specialization</option>
            </select>
            <span class="field-error-msg" id="err-student-area"></span>
          </div>

          <!-- Which Skill Would You Most Like to Develop? -->
          <div class="form-field-group">
            <label for="student-skill">Which Skill Would You Most Like to Develop? <span class="req">*</span></label>
            <select id="student-skill" name="skillToDevelop" class="persona-select">
              <option value="Surgery and clinical procedures" selected>Surgery and clinical procedures</option>
              <option value="Emergency & critical stabilization">Emergency & critical stabilization</option>
              <option value="Diagnostic imaging & ultrasonography">Diagnostic imaging & ultrasonography</option>
              <option value="General small animal medicine">General small animal medicine</option>
              <option value="Prescription & case workup">Prescription & case workup</option>
            </select>
          </div>
        </div>

        <div class="form-row-2">
          <!-- Mobile Number / WhatsApp -->
          <div class="form-field-group">
            <label for="student-phone">Mobile Number / WhatsApp <span class="req">*</span></label>
            <div class="phone-input-group">
              <span class="country-badge">🇮🇳 +91</span>
              <input type="tel" id="student-phone" name="phone" required placeholder="10-digit mobile number" class="persona-input phone-input" />
            </div>
            <span class="field-error-msg" id="err-student-phone"></span>
          </div>

          <!-- Email (Optional) -->
          <div class="form-field-group">
            <label for="student-email">Email Address <span class="opt">(Optional)</span></label>
            <input type="email" id="student-email" name="email" placeholder="name@domain.com" class="persona-input" />
            <span class="field-error-msg" id="err-student-email"></span>
          </div>
        </div>
      `;
    } else if (personaKey === 'practitioner') {
      fieldsHtml = `
        <div class="form-row-2">
          <!-- Full Name -->
          <div class="form-field-group">
            <label for="doc-name">Full Name <span class="req">*</span></label>
            <input type="text" id="doc-name" name="name" required placeholder="Dr. Full Name" class="persona-input" />
            <span class="field-error-msg" id="err-doc-name"></span>
          </div>

          <!-- Years of Clinical Experience -->
          <div class="form-field-group">
            <label for="doc-exp">Years of Clinical Experience <span class="req">*</span></label>
            <select id="doc-exp" name="yearsOfExperience" required class="persona-select">
              <option value="" disabled selected>Select clinical experience</option>
              <option value="0–1 year">0–1 year</option>
              <option value="2–5 years">2–5 years</option>
              <option value="6–10 years">6–10 years</option>
              <option value="10+ years">10+ years</option>
            </select>
            <span class="field-error-msg" id="err-doc-exp"></span>
          </div>
        </div>

        <div class="form-row-2">
          <!-- Current Role -->
          <div class="form-field-group">
            <label for="doc-role">Current Role <span class="req">*</span></label>
            <select id="doc-role" name="currentRole" required class="persona-select">
              <option value="" disabled selected>Select current role</option>
              <option value="Private practice">Private practice</option>
              <option value="Clinic/hospital">Clinic/hospital</option>
              <option value="Government">Government</option>
              <option value="NGO">NGO</option>
              <option value="Other">Other</option>
            </select>
            <span class="field-error-msg" id="err-doc-role"></span>
          </div>

          <!-- Which Area Would You Like to Strengthen? -->
          <div class="form-field-group">
            <label for="doc-strengthen">Which Area Would You Like to Strengthen? <span class="req">*</span></label>
            <select id="doc-strengthen" name="areaToStrengthen" required class="persona-select">
              <option value="" disabled selected>Select area to strengthen</option>
              <option value="Surgery">Surgery</option>
              <option value="Medicine">Medicine</option>
              <option value="Emergency/critical care">Emergency/critical care</option>
              <option value="Diagnostics/imaging">Diagnostics/imaging</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Other">Other</option>
            </select>
            <span class="field-error-msg" id="err-doc-strengthen"></span>
          </div>
        </div>

        <div class="form-row-2">
          <!-- Preferred Training Level -->
          <div class="form-field-group">
            <label for="doc-level">Preferred Training Level <span class="req">*</span></label>
            <select id="doc-level" name="preferredTrainingLevel" required class="persona-select">
              <option value="" disabled selected>Select training level</option>
              <option value="Basic">Basic</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced/specialized">Advanced/specialized</option>
            </select>
            <span class="field-error-msg" id="err-doc-level"></span>
          </div>

          <!-- Mobile Number / WhatsApp -->
          <div class="form-field-group">
            <label for="doc-phone">Mobile Number / WhatsApp <span class="req">*</span></label>
            <div class="phone-input-group">
              <span class="country-badge">🇮🇳 +91</span>
              <input type="tel" id="doc-phone" name="phone" required placeholder="10-digit mobile number" class="persona-input phone-input" />
            </div>
            <span class="field-error-msg" id="err-doc-phone"></span>
          </div>
        </div>

        <div class="form-row-2">
          <!-- Email (Optional) -->
          <div class="form-field-group">
            <label for="doc-email">Email Address <span class="opt">(Optional)</span></label>
            <input type="email" id="doc-email" name="email" placeholder="doctor@clinic.com" class="persona-input" />
            <span class="field-error-msg" id="err-doc-email"></span>
          </div>

          <!-- Clinic / Hospital Name (Optional) -->
          <div class="form-field-group">
            <label for="doc-org">Clinic / Hospital Name <span class="opt">(Optional)</span></label>
            <input type="text" id="doc-org" name="organization" placeholder="e.g. City Pet Hospital" class="persona-input" />
          </div>
        </div>
      `;
    } else if (personaKey === 'nurse') {
      fieldsHtml = `
        <div class="form-row-2">
          <!-- Full Name -->
          <div class="form-field-group">
            <label for="nurse-name">Full Name <span class="req">*</span></label>
            <input type="text" id="nurse-name" name="name" required placeholder="Full Name" class="persona-input" />
            <span class="field-error-msg" id="err-nurse-name"></span>
          </div>

          <!-- Your Background -->
          <div class="form-field-group">
            <label for="nurse-bg">Your Background <span class="req">*</span></label>
            <select id="nurse-bg" name="background" required class="persona-select">
              <option value="" disabled selected>Select your background</option>
              <option value="Student">Student</option>
              <option value="Fresher">Fresher</option>
              <option value="Veterinary nurse/assistant">Veterinary nurse/assistant</option>
              <option value="Animal-care professional">Animal-care professional</option>
              <option value="Other">Other</option>
            </select>
            <span class="field-error-msg" id="err-nurse-bg"></span>
          </div>
        </div>

        <div class="form-row-2">
          <!-- What Are You Looking For? -->
          <div class="form-field-group">
            <label for="nurse-looking">What Are You Looking For? <span class="req">*</span></label>
            <select id="nurse-looking" name="lookingFor" required class="persona-select">
              <option value="" disabled selected>Select goal</option>
              <option value="Certificate course">Certificate course</option>
              <option value="Career entry">Career entry</option>
              <option value="Skill enhancement">Skill enhancement</option>
              <option value="More information">More information</option>
            </select>
            <span class="field-error-msg" id="err-nurse-looking"></span>
          </div>

          <!-- Which Skills Interest You Most? -->
          <div class="form-field-group">
            <label for="nurse-skills">Which Skills Interest You Most? <span class="req">*</span></label>
            <select id="nurse-skills" name="skillsInterest" required class="persona-select">
              <option value="" disabled selected>Select skill interest</option>
              <option value="Patient handling">Patient handling</option>
              <option value="Nursing care">Nursing care</option>
              <option value="Assisting in surgery">Assisting in surgery</option>
              <option value="Emergency care">Emergency care</option>
              <option value="Diagnostics">Diagnostics</option>
              <option value="All-round training">All-round training</option>
            </select>
            <span class="field-error-msg" id="err-nurse-skills"></span>
          </div>
        </div>

        <div class="form-row-2">
          <!-- Preferred Learning Mode -->
          <div class="form-field-group">
            <label for="nurse-mode">Preferred Learning Mode <span class="req">*</span></label>
            <select id="nurse-mode" name="preferredLearningMode" required class="persona-select">
              <option value="" disabled selected>Select learning mode</option>
              <option value="Offline hands-on">Offline hands-on</option>
              <option value="Online">Online</option>
              <option value="Blended">Blended</option>
            </select>
            <span class="field-error-msg" id="err-nurse-mode"></span>
          </div>

          <!-- Mobile Number / WhatsApp -->
          <div class="form-field-group">
            <label for="nurse-phone">Mobile Number / WhatsApp <span class="req">*</span></label>
            <div class="phone-input-group">
              <span class="country-badge">🇮🇳 +91</span>
              <input type="tel" id="nurse-phone" name="phone" required placeholder="10-digit mobile number" class="persona-input phone-input" />
            </div>
            <span class="field-error-msg" id="err-nurse-phone"></span>
          </div>
        </div>

        <div class="form-field-group">
          <label for="nurse-email">Email Address <span class="opt">(Optional)</span></label>
          <input type="email" id="nurse-email" name="email" placeholder="name@domain.com" class="persona-input" />
          <span class="field-error-msg" id="err-nurse-email"></span>
        </div>
      `;
    } else if (personaKey === 'partner') {
      fieldsHtml = `
        <div class="form-row-2">
          <!-- Name and Designation -->
          <div class="form-field-group">
            <label for="partner-name">Name and Designation <span class="req">*</span></label>
            <input type="text" id="partner-name" name="name" required placeholder="e.g. Dr. Rajesh Varma, Director of Medical Affairs" class="persona-input" />
            <span class="field-error-msg" id="err-partner-name"></span>
          </div>

          <!-- Organization / Company -->
          <div class="form-field-group">
            <label for="partner-org">Organization / Company <span class="req">*</span></label>
            <input type="text" id="partner-org" name="organization" required placeholder="e.g. PetCare Diagnostics Ltd" class="persona-input" />
            <span class="field-error-msg" id="err-partner-org"></span>
          </div>
        </div>

        <div class="form-row-2">
          <!-- Area of Interest -->
          <div class="form-field-group">
            <label for="partner-area">Area of Interest <span class="req">*</span></label>
            <select id="partner-area" name="areaOfInterest" required class="persona-select">
              <option value="" disabled selected>Select area of partnership</option>
              <option value="Program sponsorship">Program sponsorship</option>
              <option value="Equipment support">Equipment support</option>
              <option value="Technical collaboration">Technical collaboration</option>
              <option value="Product education">Product education</option>
              <option value="Joint events">Joint events</option>
              <option value="CSR partnership">CSR partnership</option>
            </select>
            <span class="field-error-msg" id="err-partner-area"></span>
          </div>

          <!-- Work Email -->
          <div class="form-field-group">
            <label for="partner-email">Work Email <span class="req">*</span></label>
            <input type="email" id="partner-email" name="email" required placeholder="official.email@organization.com" class="persona-input" />
            <span class="field-error-msg" id="err-partner-email"></span>
          </div>
        </div>

        <div class="form-row-2">
          <!-- Contact Number -->
          <div class="form-field-group">
            <label for="partner-phone">Contact Number <span class="req">*</span></label>
            <div class="phone-input-group">
              <span class="country-badge">🇮🇳 +91</span>
              <input type="tel" id="partner-phone" name="phone" required placeholder="Direct contact / mobile number" class="persona-input phone-input" />
            </div>
            <span class="field-error-msg" id="err-partner-phone"></span>
          </div>

          <!-- Empty spacer or optional location -->
          <div class="form-field-group">
            <label for="partner-location">City / Headquarters <span class="opt">(Optional)</span></label>
            <input type="text" id="partner-location" name="location" placeholder="e.g. Pune / Mumbai / Bangalore" class="persona-input" />
          </div>
        </div>

        <!-- What Would You Like to Explore with VetNova? -->
        <div class="form-field-group">
          <div class="label-with-counter">
            <label for="partner-explore">What Would You Like to Explore with VetNova? <span class="opt">(Optional)</span></label>
            <span class="char-count" id="partner-char-count">0 / 600</span>
          </div>
          <textarea id="partner-explore" name="explorationGoal" rows="3" maxlength="600"
            placeholder="Tell us about your organization's goals or areas where you would like to collaborate..."
            class="persona-textarea"></textarea>
        </div>
      `;
    }

    return `
      <div class="persona-form-card" id="form-panel-${config.key}" role="tabpanel" aria-labelledby="tab-${config.key}">
        <!-- Form Header -->
        <div class="persona-form-header">
          <div class="persona-header-meta">
            <span class="persona-badge-pill"><i class="${config.icon}"></i> ${config.badge}</span>
            <h3 class="persona-form-title">${config.heading}</h3>
            <p class="persona-form-subtitle">${config.description}</p>
          </div>
        </div>

        <!-- Global Alert Banner for Form Errors -->
        <div class="persona-error-banner" id="form-error-banner" style="display: none;">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span id="form-error-text">Please review the fields below and correct errors.</span>
        </div>

        <!-- Form Element -->
        <form id="persona-inquiry-form" class="persona-form" novalidate data-persona="${config.key}">
          ${programName ? `<input type="hidden" name="enquiredProgram" value="${escapeHtml(programName)}" />` : ''}
          ${fieldsHtml}

          <!-- Privacy Notice -->
          <div class="persona-privacy-notice">
            <i class="fa-solid fa-shield-halved"></i>
            <span>
              Your information is securely handled and will only be used by VetNova Academy coordinators to respond to your inquiry. We never share your contact details.
            </span>
          </div>

          <!-- Submit Button Group -->
          <div class="form-submit-wrap">
            <button type="submit" id="persona-submit-btn" class="persona-submit-button">
              <span class="btn-text">${config.submitText}</span>
              <span class="btn-spinner" style="display:none;"><i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...</span>
              <i class="fa-solid fa-arrow-right btn-arrow"></i>
            </button>
          </div>
        </form>

        <!-- Personalized Success State (Initially Hidden) -->
        <div class="persona-success-card" id="persona-success-state" style="display: none;">
          <div class="success-icon-wrap">
            <i class="fa-solid fa-check"></i>
          </div>
          <h3 class="success-heading">${config.thankYou.heading}</h3>
          <p class="success-body">${config.thankYou.body}</p>
          
          <div class="success-meta-box">
            <div class="meta-item">
              <span class="meta-label">Reference ID</span>
              <span class="meta-val" id="success-lead-id">—</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Selected Pathway</span>
              <span class="meta-val">${config.title}</span>
            </div>
          </div>

          <div class="success-actions">
            <button type="button" class="btn btn-outline" id="btn-reset-inquiry">
              <i class="fa-solid fa-rotate-left"></i> Submit Another Inquiry
            </button>
            <a href="https://wa.me/${WHATSAPP_INTL}?text=${WHATSAPP_DEFAULT_MSG}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-whatsapp-inline">
              <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;
  }

  function bindWidgetEvents(container, programName = '') {
    // 1. Tab / Audience Card Clicking
    const cardBtns = container.querySelectorAll('.persona-card-btn');
    cardBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetPersona = btn.getAttribute('data-persona');
        if (!targetPersona || !PERSONA_CONFIGS[targetPersona]) return;

        // Update active states
        cardBtns.forEach(b => {
          const isActive = b.getAttribute('data-persona') === targetPersona;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Re-render form container
        const formContainer = document.getElementById('persona-form-container');
        if (formContainer) {
          formContainer.innerHTML = renderFormContent(targetPersona, programName);
          bindFormEvents(container, targetPersona);
        }
      });
    });

    const activeBtn = container.querySelector('.persona-card-btn.active');
    const initialPersona = activeBtn ? activeBtn.getAttribute('data-persona') : 'student';
    bindFormEvents(container, initialPersona);
  }

  function bindFormEvents(container, personaKey) {
    const form = container.querySelector('#persona-inquiry-form');
    if (!form) return;

    // Character counter for partner textarea
    const textarea = form.querySelector('#partner-explore');
    const charCount = form.querySelector('#partner-char-count');
    if (textarea && charCount) {
      textarea.addEventListener('input', () => {
        charCount.textContent = `${textarea.value.length} / 600`;
      });
    }

    // Submit handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFormErrors(form);

      const errorBanner = container.querySelector('#form-error-banner');
      const errorText = container.querySelector('#form-error-text');
      const submitBtn = form.querySelector('#persona-submit-btn');
      const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
      const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
      const btnArrow = submitBtn ? submitBtn.querySelector('.btn-arrow') : null;

      // Extract form values
      const formDataObj = new FormData(form);
      const data = Object.fromEntries(formDataObj.entries());

      // Validation
      let hasError = false;

      // Name validation
      if (!data.name || data.name.trim().length < 2) {
        showFieldError(form, 'name', 'Please enter your full name (minimum 2 characters)');
        hasError = true;
      }

      // Phone validation
      if (!data.phone || !isValidPhone(data.phone)) {
        showFieldError(form, 'phone', 'Please enter a valid 10-digit mobile number');
        hasError = true;
      }

      // Persona specific validation
      if (personaKey === 'student') {
        if (!data.currentStage) {
          showFieldError(form, 'stage', 'Please select your current stage');
          hasError = true;
        }
        if (!data.areaOfInterest) {
          showFieldError(form, 'area', 'Please select your area of interest');
          hasError = true;
        }
      } else if (personaKey === 'practitioner') {
        if (!data.yearsOfExperience) {
          showFieldError(form, 'exp', 'Please select your clinical experience');
          hasError = true;
        }
        if (!data.currentRole) {
          showFieldError(form, 'role', 'Please select your current role');
          hasError = true;
        }
        if (!data.areaToStrengthen) {
          showFieldError(form, 'strengthen', 'Please select an area to strengthen');
          hasError = true;
        }
        if (!data.preferredTrainingLevel) {
          showFieldError(form, 'level', 'Please select your preferred training level');
          hasError = true;
        }
      } else if (personaKey === 'nurse') {
        if (!data.background) {
          showFieldError(form, 'bg', 'Please select your background');
          hasError = true;
        }
        if (!data.lookingFor) {
          showFieldError(form, 'looking', 'Please select what you are looking for');
          hasError = true;
        }
        if (!data.skillsInterest) {
          showFieldError(form, 'skills', 'Please select skills of interest');
          hasError = true;
        }
        if (!data.preferredLearningMode) {
          showFieldError(form, 'mode', 'Please select your preferred learning mode');
          hasError = true;
        }
      } else if (personaKey === 'partner') {
        if (!data.organization || data.organization.trim().length < 2) {
          showFieldError(form, 'org', 'Organization / Company name is required');
          hasError = true;
        }
        if (!data.areaOfInterest) {
          showFieldError(form, 'area', 'Please select area of partnership interest');
          hasError = true;
        }
        if (!data.email || !isValidEmail(data.email)) {
          showFieldError(form, 'email', 'Please provide a valid official work email address');
          hasError = true;
        }
      }

      // Optional email check if user filled it in non-partner forms
      if (data.email && data.email.trim() && !isValidEmail(data.email)) {
        showFieldError(form, 'email', 'Please enter a valid email address');
        hasError = true;
      }

      if (hasError) {
        if (errorBanner && errorText) {
          errorText.textContent = 'Please check the highlighted fields above and try again.';
          errorBanner.style.display = 'flex';
        }
        return;
      }

      // Hide error banner
      if (errorBanner) errorBanner.style.display = 'none';

      // Set Loading State
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnArrow) btnArrow.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-flex';

      // Build payload for backend
      const payload = {
        persona: personaKey,
        name: data.name.trim(),
        phone: data.phone.trim(),
        countryCode: '+91',
        email: data.email ? data.email.trim() : '',
        organization: data.organization ? data.organization.trim() : '',
        source: 'Persona Inquiry Widget',
        sourcePage: window.location.pathname.split('/').pop() || 'inquiry.html',
        formData: { ...data }
      };

      try {
        if (typeof submitEnquiry !== 'function') {
          throw new Error('API communication library is not loaded. Please refresh the page and try again.');
        }

        const response = await submitEnquiry(payload);

        // Success - Display Persona Thank-You Message
        form.style.display = 'none';
        const successState = container.querySelector('#persona-success-state');
        if (successState) {
          const leadIdElem = successState.querySelector('#success-lead-id');
          if (leadIdElem && response?.data?.leadId) {
            leadIdElem.textContent = response.data.leadId;
          }
          successState.style.display = 'block';
        }

        // Setup Reset Button
        const resetBtn = container.querySelector('#btn-reset-inquiry');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            form.reset();
            form.style.display = 'block';
            if (successState) successState.style.display = 'none';
            if (errorBanner) errorBanner.style.display = 'none';
          });
        }
      } catch (err) {
        console.error('Inquiry submission error:', err);
        if (errorBanner && errorText) {
          errorText.textContent = err.message || 'Unable to submit enquiry. Please check your connection or reach out on WhatsApp.';
          errorBanner.style.display = 'flex';
        } else {
          alert(err.message || 'Unable to submit enquiry. Please try again.');
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnArrow) btnArrow.style.display = 'inline-block';
        if (btnSpinner) btnSpinner.style.display = 'none';
      }
    });
  }

  function showFieldError(form, fieldIdSuffix, message) {
    const errorElem = form.querySelector(`[id$="-${fieldIdSuffix}"]`) || form.querySelector(`#err-${fieldIdSuffix}`);
    const inputElem = form.querySelector(`[name="${fieldIdSuffix}"]`) || form.querySelector(`[id$="-${fieldIdSuffix}"]`);

    if (inputElem) {
      inputElem.classList.add('input-has-error');
    }

    const fieldErrorSpan = form.querySelector(`.field-error-msg[id*="-${fieldIdSuffix}"]`);
    if (fieldErrorSpan) {
      fieldErrorSpan.textContent = message;
      fieldErrorSpan.style.display = 'block';
    }
  }

  function clearFormErrors(form) {
    form.querySelectorAll('.input-has-error').forEach(el => el.classList.remove('input-has-error'));
    form.querySelectorAll('.field-error-msg').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }

  // Export globally
  window.initPersonaInquiry = initPersonaInquiry;

  function scrollToContactForm() {
    const hash = window.location.hash;
    if (hash === '#contact-form' || hash === '#contact-form-section' || hash === '#enquiry') {
      setTimeout(() => {
        const target = document.querySelector(hash) || document.getElementById('contact-form') || document.getElementById('persona-inquiry-widget');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }

  // Auto initialize on DOMContentLoaded if widget exists
  document.addEventListener('DOMContentLoaded', () => {
    initPersonaInquiry('persona-inquiry-widget');
    initPersonaInquiry('persona-inquiry-section-widget');
    scrollToContactForm();
  });

  window.addEventListener('hashchange', scrollToContactForm);
})();
