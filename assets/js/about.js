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

// Cache map of loaded advisory board objects indexed by ID or slug
window.loadedAdvisorMap = window.loadedAdvisorMap || {
  'dr-purushottam-narute': {
    id: 'dr-purushottam-narute',
    name: 'Dr. Purushottam Narute, DVM, PhD',
    designation: 'Veterinarian | Biomedical Researcher | Veterinary Practice Owner',
    organization: 'AAVIO & Advanced Small Animal Practice',
    qualification: 'DVM, MVSc, PhD, NIH Postdoc',
    image: 'assets/images/about/about-advisor-01.webp',
    displayOrder: 1,
    previewBio: 'Accomplished veterinarian and translational biomedical researcher with extensive international training in infectious diseases, molecular immunology, and clinical practice ownership. Facilitates clinical examination guidance through AAVIO.',
    fullBio: [
      'Dr. Purushottam Narute is a distinguished veterinarian and researcher who bridges academic bench research with cutting-edge veterinary clinical practice. After graduating with honors from Nagpur Veterinary College (MAFSU) and completing his master’s degree at the Indian Veterinary Research Institute (IVRI), he pursued doctoral research in infectious diseases and microbiology at the University of Pittsburgh Graduate School of Public Health.',
      'He subsequently completed a postdoctoral fellowship at the National Institutes of Health (NIH) Critical Care Medicine Department in Bethesda, Maryland, focusing on sepsis biology, pulmonary disease pathology, and translational immunological mechanisms. Translating his advanced biomedical research background into small animal clinical practice, Dr. Narute established and manages advanced veterinary clinical facilities in North America, while actively guiding early-career clinicians through licensing and clinical practice excellence.'
    ],
    qualifications: [
      { degree: 'BVSc & AH (DVM)', field: 'Veterinary Science & Animal Husbandry', institution: 'Nagpur Veterinary College, MAFSU', year: '2003' },
      { degree: 'MVSc', field: 'Veterinary Science', institution: 'Indian Veterinary Research Institute (IVRI), Izatnagar', year: '2005' },
      { degree: 'PhD', field: 'Infectious Diseases & Molecular Microbiology', institution: 'University of Pittsburgh Graduate School of Public Health, USA', year: '2012' },
      { degree: 'Postdoctoral Fellowship', field: 'Critical Care Medicine & Translational Immunology', institution: 'National Institutes of Health (NIH), Bethesda, Maryland, USA', year: '2012–2016' }
    ],
    achievements: [
      'Serves as BCSE (Basic and Clinical Sciences Examination) Guidance Lead & Facilitator for the Association of American Veterinarians of Indian Origin (AAVIO).',
      'Spearheaded translational critical care and sepsis research at the NIH Critical Care Medicine Department, publishing in top biomedical journals.',
      'Successfully founded and operates modern multi-specialty veterinary practices in North America with advanced diagnostic and emergency capabilities.',
      'Active mentor guiding Indian veterinary graduates through North American licensing, clinical examinations, and professional integration.'
    ],
    researchInterests: [
      'Translational Immunology & Critical Care Sepsis Pathophysiology',
      'Molecular Diagnostics & Host-Pathogen Interactions',
      'Small Animal Internal Medicine & Practice Ownership Management',
      'Immuno-Oncology & Clinical Trial Translation'
    ]
  },

  'm-chandrasekar': {
    id: 'm-chandrasekar',
    name: 'Dr. M. Chandrasekar',
    designation: 'Professor of Veterinary Clinical Medicine | Small Animal Internal Medicine Specialist',
    organization: 'Madras Veterinary College, TANUVAS',
    qualification: 'BVSc, MVSc, PhD, VIPM Fellow',
    image: 'assets/images/about/about-advisor-02.webp',
    displayOrder: 2,
    previewBio: 'Senior academician and clinician at Madras Veterinary College (TANUVAS), renowned for performing the first-ever hyena blood transfusion in Indian zoological history and leading DBT-funded research in veterinary oncology.',
    fullBio: [
      'Dr. M. Chandrasekar has served for over two decades as a Professor of Veterinary Clinical Medicine at Madras Veterinary College, TANUVAS, Chennai. A recognized authority on small animal internal medicine, cardiology, nephrology, and canine oncology, he oversees high-volume referral clinics and critical care emergency units.',
      'Throughout his academic tenure, Dr. Chandrasekar has spearheaded groundbreaking wildlife and companion animal emergency interventions, introduced structured diagnostic modules, and mentored numerous undergraduate, postgraduate, and doctoral veterinary scholars across India.'
    ],
    qualifications: [
      { degree: 'B.V.Sc.', field: 'Veterinary Science & Animal Husbandry', institution: 'Madras Veterinary College, TANUVAS', year: '1993' },
      { degree: 'M.V.Sc.', field: 'Veterinary Clinical Medicine & Therapeutics', institution: 'Madras Veterinary College, TANUVAS', year: '1996' },
      { degree: 'Ph.D.', field: 'Veterinary Clinical Medicine (Canine Oncology)', institution: 'Tamil Nadu Veterinary & Animal Sciences University (TANUVAS)', year: '2005' },
      { degree: 'Post-Doctoral / VIPM Fellowship', field: 'Veterinary Internal & Preventive Medicine', institution: 'Indian Society for Veterinary Medicine (ISVM / VIPM)', year: '2012' }
    ],
    achievements: [
      '<strong>Historic Hyena Blood Transfusion:</strong> Led the critical veterinary clinical intervention at Arignar Anna Zoological Park (Vandalur Zoo), performing India’s first successful cross-matched blood transfusion on an endangered wild striped hyena.',
      '<strong>DBT-Funded Canine Lymphoma Project:</strong> Principal Investigator for Department of Biotechnology (DBT, Govt. of India) initiatives focused on molecular profiling, staging protocols, and targeted chemotherapy (modified UW-Madison protocols) for canine lymphoma.',
      '<strong>VIPM Fellowship:</strong> Conferred the prestigious Fellowship of the Indian Society for Veterinary Medicine (VIPM / FISVM) for distinguished contributions to clinical veterinary medicine.',
      '<strong>TANUVAS Recognition & Teaching Programmes:</strong> Recipient of the TANUVAS Best Teacher Award and university research excellence honors; developed specialized clinical modules in emergency medicine and feline critical diagnostics.'
    ],
    researchInterests: [
      'Small Animal Oncology & Chemotherapy Protocol Optimization',
      'Wildlife & Exotic Animal Emergency Therapeutics & Transfusion Medicine',
      'Veterinary Nephrology & Cardiopulmonary Critical Care',
      'Diagnostic Cytology, Bone Marrow Biopsies & Advanced Therapeutics'
    ]
  },

  'shantibhushan-shanti-jha': {
    id: 'shantibhushan-shanti-jha',
    name: 'Dr. Shantibhushan "Shanti" Jha',
    designation: 'Associate Professor of Small Animal Orthopedic Surgery | DACVS',
    organization: 'Oregon State University & AO VET North America',
    qualification: 'BVSc & AH, MS, DACVS',
    image: 'assets/images/about/about-advisor-03.webp',
    displayOrder: 3,
    previewBio: 'Board-certified veterinary surgeon (DACVS) and Associate Professor of Small Animal Orthopedics at Oregon State University, specializing in complex fracture fixation, total joint arthroplasty, and international AO VET faculty training.',
    fullBio: [
      'Dr. Shantibhushan "Shanti" Jha is an Associate Professor of Small Animal Orthopedic Surgery at the Gary R. Carlson College of Veterinary Medicine, Oregon State University. Prior to joining OSU, Dr. Jha held prominent clinical leadership roles, including Chief of Surgery at leading referral hospitals and National Director of Surgery for Thrive Pet Healthcare.',
      'After earning his veterinary degree with honors from Nagpur Veterinary College and his Master\'s from Oregon State University, he completed his rigorous surgical residency at Tufts University Foster Hospital, becoming a Diplomate of the American College of Veterinary Surgeons (DACVS). He has trained hundreds of surgical residents, interns, and general practitioners across North America, Europe, and Asia.'
    ],
    qualifications: [
      { degree: 'BVSc & AH (Honors)', field: 'Veterinary Science & Animal Husbandry', institution: 'Nagpur Veterinary College, India', year: '2001' },
      { degree: 'Master of Science (MS)', field: 'Veterinary Science & Biomechanics', institution: 'Oregon State University, USA', year: '2005' },
      { degree: 'Residency', field: 'Small Animal Surgery', institution: 'Tufts University Foster Hospital, USA', year: '2008–2012' },
      { degree: 'Board Certification (DACVS)', field: 'Diplomate, Small Animal Surgery', institution: 'American College of Veterinary Surgeons (ACVS)', year: '2013' }
    ],
    achievements: [
      '<strong>AO VET Leadership:</strong> Active faculty member and Chairperson of the AO VET Community Development Commission, leading global surgical education initiatives in small animal osteosynthesis.',
      '<strong>Total Joint Replacement Pioneer:</strong> Expert proctor in cemented and cementless canine total hip replacement (THR) systems, revision arthroplasty, and circular external skeletal fixation (Ilizarov).',
      '<strong>Surgical Innovation:</strong> Authored multiple textbook chapters and clinical research studies on locking plate biomechanics, angular limb deformity correction, and minimally invasive plate osteosynthesis (MIPO).',
      '<strong>Global Faculty Educator:</strong> Delivered keynote addresses and laboratory masterclasses at major surgical symposiums worldwide, including ACVS, VOS, and AO VET Davos courses.'
    ],
    researchInterests: [
      'Total Hip & Stifle Arthroplasty (Joint Replacement)',
      'Minimally Invasive Plate Osteosynthesis (MIPO) & Biological Fracture Fixation',
      'Arthroscopy, Meniscal Reconstruction & Joint Mechanics',
      'Angular Limb Deformity Correction & Circular Ring Fixators'
    ]
  },

  'dr-v-m-chariar': {
    id: 'dr-v-m-chariar',
    name: 'Dr. V. M. Chariar',
    designation: 'Founder & Chief Veterinary Surgeon | Specialist in Small Animal Surgery, Radiology & Anaesthesia',
    organization: 'Dr. Chariar’s Pets Speciality Clinic & Hospital',
    qualification: 'BVSc & AH, MVSc (Surgery), F.I.A.V.S',
    image: 'assets/images/about/about-advisor-04.webp',
    displayOrder: 4,
    previewBio: 'Pioneering small animal veterinary surgeon with four decades of surgical excellence, renowned for introducing laminar airflow clean-room surgical suites, serving as honorary surgeon to the Mumbai Police Dog Squad, and holding Limca Book records.',
    fullBio: [
      'Dr. V. M. Chariar is the founder and Medical Director of Dr. Chariar’s Pets Speciality Clinic & Hospital in Thane/Mumbai. Over four decades, Dr. Chariar has been recognized as a trailblazer in Indian veterinary surgery, establishing one of the country\'s first modular veterinary surgical facilities with positive-pressure laminar airflow operating theatres and precision gas inhalation anaesthesia workstations.',
      'He has completed advanced surgical training across premier veterinary hospitals in the UK and Europe, bringing international operative standards to Indian clinical practice. Dr. Chariar is also revered for his honorary veterinary service to law enforcement canine divisions and animal welfare foundations.'
    ],
    qualifications: [
      { degree: 'BVSc & AH', field: 'Veterinary Science & Animal Husbandry', institution: 'Bombay Veterinary College, Mumbai', year: '1982' },
      { degree: 'MVSc (Surgery)', field: 'Veterinary Surgery, Radiology & Anaesthesiology', institution: 'Post Graduate Institute of Veterinary Sciences', year: '1985' },
      { degree: 'Advanced Fellowships', field: 'Small Animal Laparoscopy & Modern Anaesthesia', institution: 'Premier Surgical Centers (Europe & UK)', year: '1992–1996' },
      { degree: 'Specialist Certification', field: 'Advanced Soft Tissue & Orthopedic Reconstruction', institution: 'Indian Association of Veterinary Surgeons (IAVS)', year: '2001' }
    ],
    achievements: [
      '<strong>Limca Book of Records:</strong> Recognized for medical and surgical breakthroughs in minimally invasive animal surgery, laparoscopic sterilization protocols, and emergency trauma resuscitation.',
      '<strong>Mumbai Police Dog Squad Surgeon:</strong> Trusted honorary surgeon and medical consultant for the Mumbai Police Dog Squad and central security canine units, managing working dog orthopedics and tactical care.',
      '<strong>Laminar-Flow Operating Theatres:</strong> Established state-of-the-art sterile modular surgical suites compliant with human NABH standards, minimizing surgical site infection rates in high-risk procedures.',
      '<strong>Workshops & Scientific Publications:</strong> Conducted more than 80 hands-on surgical training workshops on laparoscopic ovariohysterectomy, pinning, plating, and anaesthetic monitoring for private practitioners across India.'
    ],
    researchInterests: [
      'Modular Clean-Room Surgical Infrastructure & Infection Control',
      'Precision Inhalation Anaesthesia & Capnography Monitoring',
      'Laparoscopic Minimally Invasive Soft Tissue Surgery',
      'Working & Tactical Canine Musculoskeletal Trauma Care'
    ]
  },

  'dr-nitin-v-kurkure': {
    id: 'dr-nitin-v-kurkure',
    name: 'Dr. Nitin V. Kurkure',
    designation: 'Director of Research, MAFSU | Renowned Veterinary Pathologist & Infectious Disease Specialist',
    organization: 'Maharashtra Animal & Fishery Sciences University (MAFSU)',
    qualification: 'MVSc, PhD, DBT CREST Fellow',
    image: 'assets/images/about/about-advisor-05.webp',
    displayOrder: 5,
    previewBio: 'Distinguished scientist with 35+ years of veterinary research leadership, 204 high-impact peer-reviewed publications, national DBT CREST awards, and extensive leadership across poultry pathology, oncology, and One Health diagnostics.',
    fullBio: [
      'Dr. Nitin V. Kurkure is the Director of Research at Maharashtra Animal & Fishery Sciences University (MAFSU), Nagpur. With an illustrious 35-year career spanning academic instruction, diagnostic pathology, university administration (as former Registrar), and high-level research direction, Dr. Kurkure has steered national veterinary research policy and university research ecosystems.',
      'He has supervised scores of postgraduate and doctoral dissertations, established modern molecular diagnostics laboratories at Nagpur Veterinary College, and led landmark epidemiological investigations into infectious diseases affecting livestock, poultry, and wildlife.'
    ],
    qualifications: [
      { degree: 'BVSc & AH', field: 'Veterinary Science & Animal Husbandry', institution: 'Nagpur Veterinary College, PKV', year: '1988' },
      { degree: 'MVSc', field: 'Veterinary Pathology', institution: 'Nagpur Veterinary College', year: '1991' },
      { degree: 'Ph.D.', field: 'Veterinary Pathology & Oncology', institution: 'Maharashtra Animal & Fishery Sciences University (MAFSU)', year: '2002' },
      { degree: 'Post-Doctoral (DBT CREST)', field: 'Classical Swine Fever Immunology & Molecular Diagnostics', institution: 'Animal Health and Veterinary Laboratories Agency (AHVLA), UK', year: '2011–2012' }
    ],
    achievements: [
      '<strong>204 Peer-Reviewed Publications:</strong> Authored over 204 research publications in leading national and international indexed scientific journals covering veterinary pathology, oncology, toxicology, and immunology.',
      '<strong>DBT CREST Award:</strong> Conferred the prestigious Biotechnology Overseas Associateship (CREST Award) by the Department of Biotechnology (DBT), Ministry of Science & Technology, Government of India, for international collaborative research in the United Kingdom.',
      '<strong>Dr. C.M. Singh Endowment Trust Award (2022):</strong> Honored with the prestigious national award for outstanding lifelong contributions to veterinary pathology and animal disease surveillance.',
      '<strong>International Research Consortia:</strong> Lead Principal Investigator for UKRI-India international research consortia addressing antimicrobial resistance (AMR), viral diagnostics, and poultry flock immunity.'
    ],
    researchInterests: [
      'Diagnostic Histopathology, Immunohistochemistry & Tumor Oncology',
      'Avian Pathology & Emerging Poultry Disease Epizootiology',
      'Molecular Virology, Swine Fever Immunology & Disease Surveillance',
      'One Health Interventions, Antimicrobial Resistance & Veterinary Toxicology'
    ]
  },

  'kallahalli-umesh': {
    id: 'kallahalli-umesh',
    name: 'Kallahalli Umesh, MVSc, MSc (England)',
    designation: 'Small Animal Clinician, Educator & Scientific Communicator | President, National Veterinary Foundation',
    organization: 'National Veterinary Foundation (NVF) & Mars Petcare',
    qualification: 'MVSc, MSc (RVC England), Diplomate CE',
    image: 'assets/images/about/about-advisor-06.webp',
    displayOrder: 6,
    previewBio: 'International clinician and educator with over 1,250 invited lectures, pioneer of Asia\'s premier continuing veterinary education program (MCVPD), former Scientific Affairs Manager at Mars Petcare, and President of the National Veterinary Foundation (NVF).',
    fullBio: [
      'Dr. Kallahalli G. Umesh (Dr. K. G. Umesh) is a celebrated small animal clinician, educator, and scientific communicator based in Bangalore. Formerly on the faculty of the Department of Clinical Medicine at Bangalore Veterinary College, he went on to serve as Scientific Affairs Manager and Director of Scientific Communications at Mars Petcare (Waltham).',
      'He has dedicated his career to modernizing pet healthcare standards, clinical nutrition, and evidence-based practice across South Asia. Dr. Umesh has delivered clinical lectures and masterclasses in more than 30 countries and continues to spearhead veterinary capacity-building programs across India.'
    ],
    qualifications: [
      { degree: 'B.V.Sc.', field: 'Veterinary Science & Animal Husbandry', institution: 'Veterinary College, Hebbal, UAS Bangalore', year: '1988' },
      { degree: 'M.V.Sc.', field: 'Veterinary Clinical Medicine', institution: 'Veterinary College, UAS Bangalore', year: '1991' },
      { degree: 'M.Sc. (Clinical Studies)', field: 'Small Animal Internal Medicine & Dermatology', institution: 'Royal Veterinary College (RVC), University of London, England', year: '1998' },
      { degree: 'Diplomate / Fellow (CE)', field: 'Continuing Veterinary Professional Development', institution: 'Mars / Waltham Centre for Pet Nutrition, UK', year: '2003' }
    ],
    achievements: [
      '<strong>President, National Veterinary Foundation (NVF):</strong> Steers the apex non-profit organization dedicated to advancing companion animal welfare, continuing education, and veterinary standards in India.',
      '<strong>1,250+ Invited Scientific Lectures:</strong> Delivered more than 1,250 academic lectures, clinical workshops, and keynotes at state, national, and international veterinary conferences across five continents.',
      '<strong>MCVPD Founder:</strong> Architect of the Mars Continuing Veterinary Professional Development (MCVPD) programme—widely recognized as Asia’s first structured, multi-module continuing education program for practicing veterinarians.',
      '<strong>Veterinary Council of India (VCI) Outstanding Vet Award:</strong> Conferred top national recognition by the VCI and Indian veterinary associations for revolutionary contributions to companion animal clinical education and pet nutrition advocacy.',
      '<strong>Author & Editorial Authority:</strong> Authored standard clinical handbooks on canine dermatology, clinical medicine algorithms, and clinical dietetics used by veterinary students and clinicians throughout India.'
    ],
    researchInterests: [
      'Small Animal Dermatology & Allergic Skin Disease Protocols',
      'Clinical Dietetics, Canine & Feline Therapeutic Nutrition',
      'Evidence-Based Small Animal Internal Medicine Algorithms',
      'Continuing Professional Development & Practitioner Capacity Building'
    ]
  }
};

async function initAboutPageData() {
  bindInlineAdvisorToggles();

  await Promise.all([
    loadFacultySection(),
    loadAdvisoryBoardSection()
  ]);
  
  bindFacultyProfileButtons();
  initFacultyModalEvents();
}

function findAdvisorProfile(member) {
  if (!member) return null;
  if (member.id && window.loadedAdvisorMap[member.id]) return window.loadedAdvisorMap[member.id];
  if (member._id && window.loadedAdvisorMap[member._id]) return window.loadedAdvisorMap[member._id];
  const slug = slugify(member.name);
  if (window.loadedAdvisorMap[slug]) return window.loadedAdvisorMap[slug];

  const nameLower = (member.name || '').toLowerCase();
  for (const key of Object.keys(window.loadedAdvisorMap)) {
    const kClean = key.replace(/^(dr-)/, '').replace(/-/g, ' ').toLowerCase();
    const parts = kClean.split(' ').filter(p => p.length >= 4);
    if (parts.some(p => nameLower.includes(p))) {
      return window.loadedAdvisorMap[key];
    }
  }
  return null;
}

/**
 * Renders a full advisor card with inline collapsible drawer
 */
function renderAdvisorCard(member) {
  const idKey = member.id || member._id || slugify(member.name);
  const name = escapeHtml(member.name || 'Advisory Board Member');
  const designation = escapeHtml(member.designation || 'Senior Advisor');
  const previewBio = escapeHtml(member.previewBio || member.bio || '');
  const photo = escapeHtml(member.image || 'assets/images/about/about-advisor-01.webp');

  const fullBioParagraphs = Array.isArray(member.fullBio) 
    ? member.fullBio 
    : (member.fullBio ? [member.fullBio] : [member.bio || '']);

  const qualifications = Array.isArray(member.qualifications) ? member.qualifications : [];
  const achievements = Array.isArray(member.achievements) ? member.achievements : [];
  const researchInterests = Array.isArray(member.researchInterests) ? member.researchInterests : [];

  const qualificationsTableHtml = qualifications.length > 0 ? `
    <div class="advisor-detail-section">
      <h4 class="advisor-detail-heading"><i class="fa-solid fa-graduation-cap"></i> Educational Qualifications</h4>
      <div class="advisor-table-responsive">
        <table class="advisor-table">
          <thead>
            <tr>
              <th>Qualification</th>
              <th>Discipline / Field</th>
              <th>Institution / University</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            ${qualifications.map(q => `
              <tr>
                <td><strong>${escapeHtml(q.degree || '')}</strong></td>
                <td>${escapeHtml(q.field || '')}</td>
                <td>${escapeHtml(q.institution || '')}</td>
                <td>${escapeHtml(q.year || '')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  ` : '';

  const achievementsHtml = achievements.length > 0 ? `
    <div class="advisor-detail-section">
      <h4 class="advisor-detail-heading"><i class="fa-solid fa-trophy"></i> Key Achievements &amp; Milestones</h4>
      <ul class="advisor-detail-list">
        ${achievements.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  const researchHtml = researchInterests.length > 0 ? `
    <div class="advisor-detail-section">
      <h4 class="advisor-detail-heading"><i class="fa-solid fa-microscope"></i> Research Interests &amp; Clinical Expertise</h4>
      <ul class="advisor-detail-list">
        ${researchInterests.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  return `
    <div class="advisor-card" id="advisor-${idKey}">
      <div class="advisor-photo">
        <img src="${photo}" onerror="this.onerror=null; this.src='assets/images/about/about-advisor-01.webp';" alt="${name}" loading="lazy" decoding="async" />
      </div>
      <div class="advisor-body">
        <h3>${name}</h3>
        <span class="advisor-designation">${designation}</span>
        <p class="advisor-spec">${previewBio}</p>
        <div class="advisor-footer">
          <button type="button" class="btn btn-outline btn-sm advisor-toggle-btn" aria-expanded="false" aria-controls="advisor-details-${idKey}">
            <span class="toggle-text">View Profile</span>
            <i class="fa-solid fa-chevron-down toggle-icon" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div class="advisor-details-drawer" id="advisor-details-${idKey}" aria-hidden="true">
        <div class="advisor-details-inner">
          <div class="advisor-details-content">
            <div class="advisor-detail-section">
              <h4 class="advisor-detail-heading"><i class="fa-solid fa-user-doctor"></i> Full Biography</h4>
              ${fullBioParagraphs.map(p => `<p class="advisor-detail-bio">${escapeHtml(p)}</p>`).join('')}
            </div>
            ${qualificationsTableHtml}
            ${achievementsHtml}
            ${researchHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}

async function loadAdvisoryBoardSection() {
  const advisorGrid = document.querySelector('#advisory-board .advisor-grid');
  if (!advisorGrid) return;

  const defaultKeys = [
    'dr-purushottam-narute',
    'm-chandrasekar',
    'shantibhushan-shanti-jha',
    'dr-v-m-chariar',
    'dr-nitin-v-kurkure',
    'kallahalli-umesh'
  ];

  try {
    const boardList = await getAdvisoryBoard();
    if (boardList && boardList.length >= 6) {
      // Merge with structured profile details
      advisorGrid.innerHTML = boardList.map(member => {
        const base = findAdvisorProfile(member) || {};
        const merged = { ...base, ...member };
        if (!merged.previewBio) merged.previewBio = member.bio || base.previewBio || '';
        if (!merged.fullBio || merged.fullBio.length === 0) merged.fullBio = member.fullBio || base.fullBio || [member.bio || ''];
        if (!merged.qualifications || merged.qualifications.length === 0) merged.qualifications = member.qualifications || base.qualifications || [];
        if (!merged.achievements || merged.achievements.length === 0) merged.achievements = member.achievements || base.achievements || [];
        if (!merged.researchInterests || merged.researchInterests.length === 0) merged.researchInterests = member.researchInterests || base.researchInterests || [];
        return renderAdvisorCard(merged);
      }).join('');
    } else {
      // Render our 6 complete canonical profiles
      advisorGrid.innerHTML = defaultKeys
        .map(key => renderAdvisorCard(window.loadedAdvisorMap[key]))
        .join('');
    }
  } catch (err) {
    console.warn('Advisory Board API fetch error, using built-in verified profiles:', err);
    advisorGrid.innerHTML = defaultKeys
      .map(key => renderAdvisorCard(window.loadedAdvisorMap[key]))
      .join('');
  }

  bindInlineAdvisorToggles();
}

/**
 * Attaches toggle event listeners for inline profile expansion
 */
function bindInlineAdvisorToggles() {
  const toggleBtns = document.querySelectorAll('.advisor-toggle-btn');
  toggleBtns.forEach(btn => {
    // Avoid double-binding
    if (btn.dataset.toggleBound === 'true') return;
    btn.dataset.toggleBound = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest('.advisor-card');
      if (!card) return;

      const isExpanded = card.classList.contains('is-expanded');
      const drawer = card.querySelector('.advisor-details-drawer');
      const btnText = btn.querySelector('.toggle-text');

      if (isExpanded) {
        card.classList.remove('is-expanded');
        btn.setAttribute('aria-expanded', 'false');
        if (drawer) drawer.setAttribute('aria-hidden', 'true');
        if (btnText) btnText.textContent = 'View Profile';
      } else {
        card.classList.add('is-expanded');
        btn.setAttribute('aria-expanded', 'true');
        if (drawer) drawer.setAttribute('aria-hidden', 'false');
        if (btnText) btnText.textContent = 'Show Less';
      }
    });
  });
}

async function loadFacultySection() {
  const facultyGrid = document.querySelector('#faculty .faculty-grid');
  if (!facultyGrid) return;

  const facultyList = await getFaculty({ status: 'Published' });
  if (!facultyList || facultyList.length === 0) return; // Keep fallback HTML if empty

  // Display only the first 3 faculty members on the about page
  facultyGrid.innerHTML = facultyList.slice(0, 3).map(member => {
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
