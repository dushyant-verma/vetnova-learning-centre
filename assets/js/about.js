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
    organization: 'Broadlands Animal Hospital & PVS',
    qualification: 'BVSc & AH, MVSc, PhD, NIH Postdoc',
    image: 'assets/images/about/about-advisor-01.webp',
    linkedin: 'https://www.linkedin.com/in/purushottam-narute-dvm-phd-46387019/',
    displayOrder: 1,
    previewBio: 'Dr. Purushottam Narute is a veterinarian, biomedical researcher, and veterinary healthcare leader with a multidisciplinary background in veterinary medicine, animal biotechnology, infectious diseases, and microbiology.',
    fullBio: [
      'Dr. Purushottam Narute is a veterinarian, biomedical researcher, and veterinary healthcare leader with a multidisciplinary background in veterinary medicine, animal biotechnology, infectious diseases, and microbiology.',
      'He earned his veterinary degree (BVSc & AH) from Nagpur Veterinary College, India, followed by a Master of Veterinary Science in Animal Biotechnology from the Indian Veterinary Research Institute (IVRI), India. He subsequently earned his PhD in Infectious Diseases and Microbiology from the University of Pittsburgh, Pennsylvania. His doctoral research focused on HIV-1 pathogenesis, host–virus interactions, and potential targets for antiviral drug development. He also completed postdoctoral research at the National Institutes of Health (NIH) Clinical Center, Bethesda, Maryland, focusing on molecular mechanisms of inflammation, microRNA expression, and critical illness.',
      'Dr. Narute has a strong foundation in companion-animal veterinary medicine, with clinical interests in internal medicine, soft-tissue surgery, dermatology, dentistry, preventive medicine, and comprehensive pet healthcare. He is currently an owner of Broadlands Animal Hospital in Ashburn, Virginia, and PetSmart Veterinary Services (PVS) in Oxon Hill, Maryland. Through his clinical and leadership roles, he is actively involved in veterinary healthcare delivery, practice management, clinical operations, and maintaining high standards of patient care.',
      'He has also contributed to the professional development of internationally educated veterinarians through his involvement with the American Association of Veterinarians of Indian Origin (AAVIO) as an ECFVG guidance facilitator. Dr. Narute is passionate about evidence-based veterinary medicine, scientific advancement, continuing education, and mentoring future veterinary professionals.'
    ],
    qualifications: [
      { degree: 'BVSc & AH', field: 'Veterinary Science & Animal Husbandry', institution: 'Nagpur Veterinary College, India', year: '—' },
      { degree: 'MVSc', field: 'Animal Biotechnology', institution: 'Indian Veterinary Research Institute (IVRI), India', year: '—' },
      { degree: 'PhD', field: 'Infectious Diseases & Microbiology (HIV-1 Pathogenesis)', institution: 'University of Pittsburgh, Pennsylvania, USA', year: '—' },
      { degree: 'Postdoctoral Research', field: 'Inflammation, microRNA Expression & Critical Illness', institution: 'National Institutes of Health (NIH) Clinical Center, Bethesda, Maryland, USA', year: '—' }
    ],
    achievements: [
      'Owner & Practice Leader of Broadlands Animal Hospital (Ashburn, VA) and PetSmart Veterinary Services (PVS, Oxon Hill, MD).',
      'ECFVG (Educational Commission for Foreign Veterinary Graduates) Guidance Facilitator for the American Association of Veterinarians of Indian Origin (AAVIO).',
      'Completed postdoctoral research at the National Institutes of Health (NIH) Clinical Center, investigating molecular mechanisms of inflammation, microRNA expression, and critical illness.',
      'Doctoral research at the University of Pittsburgh focused on HIV-1 pathogenesis, host–virus interactions, and potential targets for antiviral drug development.',
      'Dedicated mentor championing evidence-based veterinary medicine, scientific advancement, continuing education, and clinical guidance for future veterinary professionals.'
    ],
    researchInterests: [
      'Companion-Animal Internal Medicine & Comprehensive Pet Healthcare',
      'Soft-Tissue Surgery, Veterinary Dentistry & Dermatology',
      'Animal Biotechnology, Infectious Diseases & Microbiology',
      'Veterinary Healthcare Delivery, Clinical Operations & Practice Management'
    ]
  },

  'm-chandrasekar': {
    id: 'm-chandrasekar',
    name: 'Dr. M. Chandrasekar',
    designation: 'Professor of Veterinary Clinical Medicine & Former Head of RVSS Emergency Unit, TANUVAS',
    organization: 'Madras Veterinary College, TANUVAS',
    qualification: 'B.V.Sc., M.V.Sc., Ph.D., PGDVSR',
    image: 'assets/images/about/about-advisor-02.webp',
    linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Dr%20M%20Chandrasekar%20TANUVAS',
    displayOrder: 2,
    previewBio: 'Accomplished veterinary academic, clinician, researcher and educator with more than 24 years of service at TANUVAS, specializing in clinical medicine, therapeutics, surgery, emergency & critical care, and veterinary ethics.',
    fullBio: [
      'Dr. M. Chandrasekar is an accomplished veterinary academic, clinician, researcher and educator with more than 24 years of professional service at the Tamil Nadu Veterinary and Animal Sciences University (TANUVAS). His expertise spans veterinary clinical medicine, therapeutics, surgery, radiology, emergency and critical care, veterinary ethics, and jurisprudence.',
      'He completed his Bachelor of Veterinary Science (B.V.Sc.) from Madras Veterinary College, TANUVAS, Chennai, in 1993, followed by a Master of Veterinary Science (M.V.Sc.) in Clinical Medicine and Therapeutics in 2000. He earned his Ph.D. in Veterinary Clinical Medicine, Ethics and Jurisprudence in 2009 and subsequently completed a Postgraduate Diploma in Veterinary Surgery and Radiology in 2015.',
      'Throughout his academic career, Dr. Chandrasekar has held several important teaching and institutional leadership positions at TANUVAS and its associated veterinary institutions. He served as Professor at TANUVAS from July 2016 to July 2022, having previously worked as an Associate Professor and Assistant Professor. His leadership responsibilities have included serving as Head of Institution at VCRI, Tirunelveli, and Head of the RVSS Emergency Unit at TANUVAS.',
      'His academic and research contributions include guiding postgraduate and doctoral scholars, supervising more than 20 postgraduate diploma and other research programmes, and serving as Chairman for doctoral and master\'s-level research guidance. He has been involved in several externally funded research projects as Principal Investigator and Co-Principal Investigator, supported by agencies including DBT, DST, and other research organisations.',
      'His research interests include canine lymphoma, chemotherapy, clinical therapeutics, veterinary emergency medicine, critical care, haemodialysis and clinical treatment innovation. His funded research work has included screening of B-cell and T-cell lymphoma in canines, commercialisation of indigenous haemodialysis cartridges, probiotic supplementation in canine chronic kidney disease, and evaluation of ventilators in rabbits.',
      'Dr. Chandrasekar has made significant academic contributions through his scientific publications, research guidance, teaching manuals and professional training activities. His publication record includes 10 international full-length publications, 78 national full-length publications and three book chapters, in addition to multiple popular articles and educational manuals.',
      'He has actively contributed to veterinary education through offline and online training programmes for practising veterinarians in India and internationally. His international professional engagements include invited lectures and hands-on practical training in emergency and critical care for veterinarians in Malaysia and Jeddah. He has also participated in international professional training programmes in the United States, Canada, Malaysia and other countries.'
    ],
    qualifications: [
      { degree: 'B.V.Sc.', field: 'Veterinary Science & Animal Husbandry', institution: 'Madras Veterinary College, TANUVAS, Chennai', year: '1993' },
      { degree: 'M.V.Sc.', field: 'Clinical Medicine & Therapeutics', institution: 'Madras Veterinary College, TANUVAS', year: '2000' },
      { degree: 'Ph.D.', field: 'Veterinary Clinical Medicine, Ethics & Jurisprudence', institution: 'Tamil Nadu Veterinary and Animal Sciences University (TANUVAS)', year: '2009' },
      { degree: 'Postgraduate Diploma', field: 'Veterinary Surgery & Radiology', institution: 'TANUVAS', year: '2015' }
    ],
    achievements: [
      '<strong>Extramural Grants Leadership:</strong> Principal Investigator for 7 externally funded research projects supported by national and state agencies.',
      '<strong>Oncology & Therapeutics Research:</strong> Pioneered clinical investigations involving canine lymphoma, targeted chemotherapy, clinical therapeutics, and treatment innovation.',
      '<strong>Scholarly Supervision:</strong> Research guidance for Ph.D., M.V.Sc., and supervision of over 20 postgraduate diploma and research programmes.',
      '<strong>Research Committee Leadership:</strong> Guided doctoral and postgraduate scholars as Chairman and research committee member.',
      '<strong>Scholarly Publications:</strong> Contributed extensively to veterinary literature through international and national indexed scientific journals.',
      '<strong>Academic Author:</strong> Authored 3 book chapters and multiple educational articles, laboratory guides, and clinical manuals.'
    ],
    researchInterests: [
      'Canine Lymphoma Screening & Chemotherapeutic Protocols (DBT Funded: ₹47.97 Lakh)',
      'Indigenous Haemodialysis Cartridges Commercialization (DST Funded: ₹30.26 Lakh)',
      'Probiotic Supplementation in Canine CKD (SAVA VET Funded: ₹7.50 Lakh)',
      'Evaluation of Ventilator in Rabbits (Broadline Technologies Funded: ₹0.98 Lakh)',
      'Xanthine Oxidase Use in Canine DCM & Acidosis Puffzone Management (Co-PI)'
    ],
    extraSectionsHtml: `
      <div class="advisor-detail-section">
        <h4 class="advisor-detail-heading"><i class="fa-solid fa-briefcase"></i> Professional Experience (Career Progression)</h4>
        <p class="advisor-detail-bio" style="font-weight: 600; color: var(--navy-2, #0A192F);">Total Professional Service at TANUVAS: More than 24 years and 8 months</p>
        <div class="advisor-table-responsive">
          <table class="advisor-table">
            <thead>
              <tr>
                <th>Position / Role</th>
                <th>Institution / Department</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Head of RVSS Emergency Unit</strong></td>
                <td>TANUVAS</td>
                <td>9 May 2023 onwards</td>
              </tr>
              <tr>
                <td><strong>Professor</strong></td>
                <td>TANUVAS</td>
                <td>10 July 2016 to 31 July 2022</td>
              </tr>
              <tr>
                <td><strong>Head of Institution</strong></td>
                <td>VCRI, Tirunelveli</td>
                <td>7 August 2017 to 28 March 2018</td>
              </tr>
              <tr>
                <td><strong>Associate Professor</strong></td>
                <td>TANUVAS</td>
                <td>9 July 2010 to 9 July 2016</td>
              </tr>
              <tr>
                <td><strong>Assistant Professor</strong></td>
                <td>MVC–VCM E&amp;J</td>
                <td>15 December 2005 to 8 July 2010</td>
              </tr>
              <tr>
                <td><strong>Assistant Professor</strong></td>
                <td>MVC–PMD</td>
                <td>8 April 2004 to 15 December 2005</td>
              </tr>
              <tr>
                <td><strong>Assistant Professor</strong></td>
                <td>MVC–RVSS</td>
                <td>22 April 2002 to 8 April 2004</td>
              </tr>
              <tr>
                <td><strong>Assistant Professor</strong></td>
                <td>VCRI, Namakkal</td>
                <td>2 April 2001 to 19 April 2002</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="advisor-detail-section">
        <h4 class="advisor-detail-heading"><i class="fa-solid fa-flask-vial"></i> Major Research Projects</h4>
        <p class="advisor-detail-bio" style="font-weight: 600; margin-bottom: 4px;">As Principal Investigator:</p>
        <ul class="advisor-detail-list">
          <li><strong>Canine Lymphoma Screening &amp; Chemotherapy:</strong> Screening of B-cell and T-cell lymphoma in canine and chemotherapeutic regimen – Funded by Department of Biotechnology (DBT), ₹47.97 lakh (2018–2019).</li>
          <li><strong>Haemodialysis Innovation:</strong> Commercialization of indigenous haemodialysis cartridges – Funded by Department of Science &amp; Technology (DST), ₹30.26 lakh (2019–2022).</li>
          <li><strong>Nephrology Therapeutics:</strong> Probiotic supplementation in canine CKD – Funded by SAVA VET, ₹7.50 lakh (2021–2022).</li>
          <li><strong>Critical Care Respiratory Support:</strong> Evaluation of ventilator in rabbits – Funded by Broadline Technologies, ₹0.98 lakh (2020).</li>
        </ul>
        <p class="advisor-detail-bio" style="font-weight: 600; margin: 8px 0 4px 0;">As Co-Principal Investigator:</p>
        <ul class="advisor-detail-list">
          <li><strong>Canine DCM Therapeutics:</strong> Xanthine oxidase use in canine DCM – Science &amp; Technology funding, ₹2.00 lakh.</li>
          <li><strong>Metabolic Acidosis Management:</strong> Efficacy of puffzone in acidosis – Funded by Intas Pharmaceuticals.</li>
        </ul>
      </div>

      <div class="advisor-detail-section">
        <h4 class="advisor-detail-heading"><i class="fa-solid fa-book-bookmark"></i> Scientific Publications</h4>
        <div class="advisor-stats-row">
          <div class="advisor-stat-box">
            <span class="advisor-stat-num">10</span>
            <span class="advisor-stat-lbl">International Papers</span>
          </div>
          <div class="advisor-stat-box">
            <span class="advisor-stat-num">78</span>
            <span class="advisor-stat-lbl">National Papers</span>
          </div>
          <div class="advisor-stat-box">
            <span class="advisor-stat-num">3</span>
            <span class="advisor-stat-lbl">Book Chapters</span>
          </div>
          <div class="advisor-stat-box">
            <span class="advisor-stat-num">20+</span>
            <span class="advisor-stat-lbl">Manuals &amp; Articles</span>
          </div>
        </div>
        <p class="advisor-detail-bio">Includes 10 international full-length publications, 78 national full-length publications, three textbook chapters, and multiple popular articles and clinical manuals.</p>
      </div>

      <div class="advisor-detail-section">
        <h4 class="advisor-detail-heading"><i class="fa-solid fa-chalkboard-user"></i> Extension and Training Activities</h4>
        <ul class="advisor-detail-list">
          <li>Conducted multiple offline and online training programmes for practising veterinarians across India and abroad.</li>
          <li>Delivered specialized instruction in emergency medicine, intensive critical care, and haemodialysis.</li>
          <li>Conducted international hands-on practical clinical training for Malaysian veterinarians.</li>
          <li>Delivered invited lectures and hands-on practical training in emergency and critical care in Jeddah.</li>
          <li>Prepared 10 comprehensive veterinary clinical training manuals in Tamil for field practitioners.</li>
          <li>Participated in television and radio educational programmes, including the broadcast “Pon Vilaiyum Bhoomi – Mastitis in Cattle and its Prevention”.</li>
        </ul>
      </div>

      <div class="advisor-detail-section">
        <h4 class="advisor-detail-heading"><i class="fa-solid fa-trophy"></i> Awards and Honours</h4>
        <ul class="advisor-detail-list">
          <li><strong>Distinguished Service Award (2015):</strong> Conferred by the Agricultural Scientific Tamil Society.</li>
          <li><strong>ISVM Appreciation Award (2013):</strong> Conferred by the Indian Society for Veterinary Medicine for meritorious clinical contributions.</li>
          <li><strong>Best Presentation Awards (2012–2022):</strong> Multiple Best Clinical Case, Oral and Poster Presentation Awards from TANUVAS, ISVM, SVVU, and USA academic collaborations.</li>
          <li><strong>International Presentation Awards (2011–2013):</strong> International Best Clinical Case Presentation Awards conferred through TANUVAS and USA veterinary collaborations.</li>
        </ul>
      </div>

      <div class="advisor-detail-section">
        <h4 class="advisor-detail-heading"><i class="fa-solid fa-globe"></i> International Exposure</h4>
        <ul class="advisor-detail-list">
          <li><strong>United States:</strong> 21 days of Medical Oncology clinical training and academic collaboration.</li>
          <li><strong>Canada:</strong> 10 days of advanced clinical training with the World Small Animal Veterinary Association (WSAVA).</li>
          <li><strong>Malaysia:</strong> 15 days teaching emergency and critical care, and establishing a clinical unit.</li>
          <li><strong>Jeddah (Saudi Arabia):</strong> Professional involvement and clinical leadership in establishing an advanced veterinary haemodialysis centre.</li>
        </ul>
      </div>

      <div class="advisor-detail-section">
        <h4 class="advisor-detail-heading"><i class="fa-solid fa-id-card-clip"></i> Professional Memberships &amp; Leadership</h4>
        <ul class="advisor-detail-list">
          <li><strong>President:</strong> Veterinary Emergency and Critical Care Society of India</li>
          <li><strong>Life Member:</strong> Tamil Nadu State Veterinary Council</li>
          <li><strong>Life Member:</strong> Indian Society for Veterinary Medicine (ISVM)</li>
          <li><strong>Life Member:</strong> Indian Society for Advancement of Canine Practice (ISACP)</li>
          <li><strong>Life Member:</strong> Tamil Society for Veterinary Sciences</li>
          <li><strong>Life Member:</strong> Veterinary Society for Preventive and Internal Medicine (VSPIM)</li>
          <li><strong>Life Member:</strong> Chennai Small Animal Practitioner Association (CSAPA)</li>
          <li><strong>Life Member:</strong> Kalnadai Kathir</li>
        </ul>
      </div>
    `
  },

  'shantibhushan-shanti-jha': {
    id: 'shantibhushan-shanti-jha',
    name: 'Shantibhushan "Shanti" Jha',
    designation: 'Associate Professor of Small Animal Orthopedic Surgery | DACVS (Small Animal)',
    organization: 'Oregon State University & AO VET',
    qualification: 'BVSc & AH (Hons), MS, DACVS (Small Animal)',
    image: 'assets/images/about/about-advisor-03.webp',
    linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Shantibhushan%20Jha%20Oregon',
    displayOrder: 3,
    previewBio: 'Associate Professor of Small Animal Orthopedic Surgery at Oregon State University’s Carlson College of Veterinary Medicine, board-certified surgeon (DACVS), and AO VET International CDC Chair-Elect specializing in minimally invasive surgery, joint health, and pedagogical AI.',
    fullBio: [
      'Shantibhushan "Shanti" Jha, BVSc & AH (Hons), MS, DACVS (Small Animal) is an associate professor of small animal orthopedic surgery at Oregon State University’s Carlson College of Veterinary Medicine. A board-certified surgeon since 2013, Dr. Jha earned his BVSc with honors from Nagpur Veterinary College and his MS from Oregon State University, followed by advanced surgical residency training at Tufts University.',
      'Dr. Jha’s research interests center on the transformation of veterinary surgical education through the integration of pedagogical AI. He focuses on how artificial intelligence can be leveraged to enhance intraoperative decision-making, refine surgical skill acquisition, and provide objective, data-driven feedback to the next generation of surgeons. By bridging the gap between traditional surgical mentorship and emerging technology, he aims to set new global standards for veterinary training. Additionally, Dr. Jha applies his surgical and biological expertise to the field of human-wildlife conflict resolution, developing interdisciplinary, community-engaged strategies to address complex health and welfare challenges at the interface of human expansion and wildlife habitats.',
      'At the Lois Bates Acheson Veterinary Teaching Hospital, Dr. Jha specializes in advanced orthopedics and joint health. His clinical practice is defined by a commitment to minimally invasive surgery (MIS), including arthroscopy, minimally invasive fracture management, and angular limb deformity corrections. By utilizing these advanced techniques, he prioritizes superior patient outcomes, reduced recovery times, and the preservation of joint function in complex orthopedic cases.',
      'A distinguished leader in the international surgical community and an AO VET Board Member, Dr. Jha serves as the International Community Development Committee (CDC) Chair-Elect for AO VET. In this prestigious role, he steers global initiatives aimed at fostering surgical excellence through community building, mentorship, and the dissemination of evidence-based orthopedic principles.'
    ],
    qualifications: [
      { degree: 'BVSc & AH (Hons)', field: 'Veterinary Science & Animal Husbandry', institution: 'Nagpur Veterinary College, India', year: 'Honors' },
      { degree: 'Master of Science (MS)', field: 'Veterinary Science', institution: 'Oregon State University, USA', year: 'MS' },
      { degree: 'Surgical Residency', field: 'Small Animal Surgery', institution: 'Tufts University, USA', year: 'Residency' },
      { degree: 'DACVS (Small Animal)', field: 'Board Certification in Small Animal Surgery', institution: 'American College of Veterinary Surgeons', year: '2013' },
      { degree: 'Associate Professor', field: 'Department of Clinical Sciences', institution: 'Lois Bates Acheson Veterinary Teaching Hospital, OSU', year: 'Faculty' }
    ],
    achievements: [
      '<strong>AO VET Board Member & CDC Chair-Elect:</strong> Serves as the International Community Development Committee (CDC) Chair-Elect for AO VET, steering global surgical excellence, community building, and mentorship.',
      '<strong>Board-Certified Surgeon (DACVS):</strong> Diplomate of the American College of Veterinary Surgeons in Small Animal Surgery since 2013.',
      '<strong>Pioneering Pedagogical AI in Surgery:</strong> Leading innovative research into the integration of artificial intelligence for intraoperative decision-making, skill refinement, and objective surgeon feedback.',
      '<strong>Minimally Invasive Orthopedic Specialist:</strong> Master clinician in arthroscopy, minimally invasive fracture repair, and complex angular limb deformity corrections at the Lois Bates Acheson Veterinary Teaching Hospital.',
      '<strong>Human-Wildlife Conflict Resolution:</strong> Spearheading interdisciplinary, community-engaged initiatives addressing wildlife health and welfare challenges at the human-wildlife interface.'
    ],
    researchInterests: [
      'Minimally Invasive Surgery (MIS), Arthroscopy & Joint Health',
      'Minimally Invasive Fracture Management & Angular Limb Deformity Corrections',
      'Pedagogical AI Integration & Objective Veterinary Surgical Education',
      'Human-Wildlife Conflict Resolution & Community-Engaged Welfare Strategies'
    ]
  },

  'dr-v-m-chariar': {
    id: 'dr-v-m-chariar',
    name: 'Dr. V. M. Chariar',
    designation: 'Veterinary Surgeon | Small-Animal Surgery, Radiology & Anaesthesia',
    organization: 'Dr. Chariars Pets Speciality Clinic & V-TEAMS',
    qualification: 'Veterinary Surgeon (Surgery, Radiology & Anaesthesia)',
    image: 'assets/images/about/about-advisor-04.webp',
    linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Dr%20V%20M%20Chariar',
    displayOrder: 4,
    previewBio: 'Dr. V. M. Chariar is a veterinary surgeon specialising in small-animal surgery, radiology and anaesthesia. Together with Dr. J. V. Chariar, he co-founded Dr. Chariars Pets Speciality Clinic in Thane and has helped develop it into a centre for advanced surgical, reconstructive, diagnostic and veterinary care.',
    fullBio: [
      'Dr. V. M. Chariar is a veterinary surgeon specialising in small-animal surgery, radiology and anaesthesia. Together with Dr. J. V. Chariar, he co-founded Dr. Chariars Pets Speciality Clinic in Thane and has helped develop it into a centre for advanced surgical, reconstructive, diagnostic and veterinary care.',
      'Dr. Chariar has pursued continuing international training through specialised fellowships, clinical rotations and hands-on courses at universities and institutions in the United States, the Netherlands, France, Malaysia and Russia.',
      'In 1997, Dr. V. M. Chariar and Dr. J. V. Chariar established their veterinary practice in a single-room facility. Today, the clinic operates as a multi-speciality veterinary centre and a purpose-built, 6,000-square-foot hospital in Thane. It has grown to include a team of veterinary specialist clinicians and is equipped with two dedicated operating rooms, a diagnostic imaging suite, an interventional radiology theatre, dedicated imaging facilities, an automated clinical laboratory and a hydrotherapy and physiotherapy suite for rehabilitation.',
      'Dr. Chariar has focused particularly on advancing veterinary endoscopy, laparoscopy, neurosurgery and orthopaedic surgery, emphasising a patient-centred approach to clinical care. He pioneered India\'s first laminar-flow veterinary operating theatre, designed to support complex orthopaedic and neurological procedures and enhance asepsis during implant surgery.',
      'Dr. Chariar has conducted workshops and training programmes at 30 veterinary institutes across India. He has authored more than 30 Indian and 10 international scientific publications and has co-guided eight university veterinary master\'s dissertations, contributing to the advancement of veterinary surgery and clinical proficiency. He has also served as Police Surgeon for the Bomb Detection and Disposal Dog Squads of Thane City, Thane District and Raigad District, providing veterinary support to working police dogs.',
      'Dr. Chariar holds active leadership roles as a Consultant Surgeon and Honorary Chief of Medical Staff for the V-TEAMS Foundation. He has established two Limca Book records: performing 50 laparoscopic spays in less than eight hours and performing the maximum number of laparoscopic spays in a year. These achievements have brought recognition to the work of the V-TEAMS Foundation and highlighted the value of technology-enabled veterinary surgery, placing Thane firmly on India\'s veterinary map.'
    ],
    qualifications: [
      { degree: 'Veterinary Degree & Post-Graduation', field: 'Small-Animal Surgery, Radiology & Anaesthesia', institution: 'Premier Veterinary Institutions, India', year: '—' },
      { degree: 'Specialised Fellowships', field: 'Advanced Surgical Techniques & Endoscopy', institution: 'Institutions in the United States & The Netherlands', year: '—' },
      { degree: 'Clinical Rotations & Hands-On Courses', field: 'Laparoscopy, Orthopaedics & Neurosurgery', institution: 'Institutions in France, Malaysia & Russia', year: '—' },
      { degree: 'Speciality Hospital Development', field: 'Laminar-Flow Operating Theatre & Advanced Diagnostics', institution: 'Dr. Chariars Pets Speciality Clinic & Hospital', year: '1997–Present' }
    ],
    achievements: [
      '<strong>Co-Founder & Hospital Director:</strong> Co-founded Dr. Chariars Pets Speciality Clinic in 1997, growing it from a single-room practice into a 6,000-sq-ft multi-speciality hospital with two dedicated ORs, interventional radiology, automated pathology, and physiotherapy suites.',
      '<strong>Pioneered India\'s First Laminar-Flow Veterinary OR:</strong> Designed and implemented the nation\'s first laminar-flow operating theatre to optimize asepsis during complex implant, orthopaedic, and neurosurgical procedures.',
      '<strong>Two Limca Book of Records:</strong> Set two national records: performing 50 laparoscopic spays in under 8 hours and performing the maximum number of laparoscopic spays in a single year.',
      '<strong>Police Dog Squad Surgeon:</strong> Served as Police Surgeon for the Bomb Detection and Disposal Dog Squads of Thane City, Thane District, and Raigad District, providing vital veterinary care to working police canines.',
      '<strong>Leadership in V-TEAMS Foundation:</strong> Consultant Surgeon and Honorary Chief of Medical Staff for the V-TEAMS Foundation, advancing technology-enabled veterinary surgical care.',
      '<strong>Academic Contributions & Mentorship:</strong> Conducted training workshops at 30 veterinary institutes, authored over 40 publications (30+ Indian, 10+ international), and co-guided 8 university master\'s dissertations.'
    ],
    researchInterests: [
      'Veterinary Endoscopy, Laparoscopy & Minimally Invasive Surgery',
      'Complex Orthopaedic Surgery, Implant Asepsis & Laminar-Flow Theatres',
      'Veterinary Neurosurgery & Patient-Centred Clinical Care',
      'Interventional Radiology, Advanced Diagnostic Imaging & Hydrotherapy Rehabilitation'
    ]
  },

  'dr-nitin-v-kurkure': {
    id: 'dr-nitin-v-kurkure',
    name: 'Dr. Nitin V. Kurkure',
    designation: 'Director of Research | Maharashtra Animal & Fishery Sciences University, Nagpur',
    organization: 'Maharashtra Animal & Fishery Sciences University (MAFSU)',
    qualification: 'Director of Research, DBT CREST Fellow',
    image: 'assets/images/about/about-advisor-05.webp',
    linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Dr%20Nitin%20Kurkure',
    displayOrder: 5,
    previewBio: 'Director of Research at Maharashtra Animal & Fishery Sciences University, Nagpur, leading advanced veterinary research in host-pathogen interactions and antimicrobial resistance (AMR), with 204 scientific publications and prestigious national honours.',
    fullBio: [
      'Dr. Nitin V. Kurkure is the Director of Research at Maharashtra Animal & Fishery Sciences University (MAFSU), Nagpur. With 35 years of distinguished academic, clinical, and research leadership, Dr. Kurkure has steered national veterinary research policy, animal health surveillance, and university research ecosystems.',
      'His primary areas of interest focus on host-pathogen interactions and antimicrobial resistance (AMR). Over his career, he has authored 204 peer-reviewed scientific publications in leading indexed journals and served as the Principal Investigator for seven extramural research projects funded by premier national and international agencies.',
      'Dr. Kurkure’s research and teaching excellence has been recognized with 14 prestigious awards from various national organizations. These honours include the Young Scientist Award, the University Best Teacher Award (conferred twice), the Department of Biotechnology (DBT) CREST Fellowship, and several best presentation awards at scientific symposia. Internationally, he has also served as a Visiting Professor at Chonnam National University in South Korea.'
    ],
    qualifications: [
      { degree: 'Director of Research', field: 'Host-Pathogen Interaction & AMR', institution: 'Maharashtra Animal & Fishery Sciences University, Nagpur', year: '35 Years Experience' },
      { degree: 'Principal Investigator', field: 'Extramural Research Management (7 Projects)', institution: 'National Funding Agencies & MAFSU', year: '204 Publications' },
      { degree: 'Visiting Professor', field: 'Veterinary Research & Academic Instruction', institution: 'Chonnam National University, South Korea', year: 'International' },
      { degree: 'DBT CREST Fellow', field: 'Biotechnology & Molecular Disease Investigation', institution: 'Department of Biotechnology (DBT), Govt. of India', year: 'Fellowship' }
    ],
    achievements: [
      '<strong>Principal Investigator of 7 Extramural Projects:</strong> Spearheaded seven competitive extramural research projects advancing veterinary pathology, infectious diseases, and diagnostics.',
      '<strong>204 Research Publications:</strong> Authored 204 high-impact peer-reviewed publications in national and international scientific journals.',
      '<strong>14 National Awards & Honours:</strong> Conferred 14 prestigious national awards including Young Scientist, the University Best Teacher Award (twice), and several best poster awards at national symposia.',
      '<strong>DBT CREST Fellowship:</strong> Recipient of the prestigious Biotechnology Overseas Associateship (CREST Fellowship) from the Department of Biotechnology, Government of India.',
      '<strong>International Visiting Professorship:</strong> Served as Visiting Professor at Chonnam National University, South Korea, fostering international academic collaboration and research.'
    ],
    researchInterests: [
      'Host-Pathogen Interaction & Molecular Disease Mechanisms',
      'Antimicrobial Resistance (AMR) & Surveillance',
      'Extramural Research Project Leadership & Administration',
      'Veterinary Pathology, Infectious Diseases & Academic Instruction'
    ]
  },

  'kallahalli-umesh': {
    id: 'kallahalli-umesh',
    name: 'Kallahalli Umesh, MVSc, MSc (England)',
    designation: 'Small Animal Clinician | Veterinary Educator | Scientific Communicator',
    organization: 'NVF Foundation & Mars Petcare',
    qualification: 'MVSc, MSc (England)',
    image: 'assets/images/about/about-advisor-06.webp',
    linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Kallahalli%20Umesh',
    displayOrder: 6,
    previewBio: 'Kallahalli Umesh is an internationally respected small animal clinician, educator, and scientific communicator with over three decades of experience in small animal medicine, recognized for evidence-based practice and continuing clinical education across Asia.',
    fullBio: [
      'Kallahalli Umesh is an internationally respected small animal clinician, educator, and scientific communicator with over three decades of experience in small animal medicine. A postgraduate in Clinical Medicine and former faculty member at Bangalore Veterinary College, he is widely recognized for his contributions to evidence-based veterinary practice, continuing professional development, and clinical education across Asia.',
      'As Director of Scientific Affairs (Waltham) at Mars Petcare, Umesh pioneered the Mars Continuing Veterinary Professional Development (MCVPD) programme, the first structured continuing education initiative of its kind in the region. The programme contributed significantly to veterinary education by providing small animal practitioners with expert-led lectures, hands-on wet laboratories, and practical clinical workshops.',
      'Umesh currently practices as a Small Animal Consultant in Bangalore, India, managing referral cases with special interests in Internal Medicine, Clinical Nutrition, and Dermatology.',
      'A passionate educator and scientific communicator, Umesh has delivered more than 1,250 invited lectures at national and international conferences, continuing education programmes, and specialist meetings. His ability to translate scientific evidence into practical clinical applications has made him a sought-after speaker in India, across Asia, and internationally.',
      'He serves as President of the NVF Foundation, which organizes Vetopia, one of India’s leading veterinary educational conferences. He has played an important role in developing educational initiatives for veterinarians and pet owners across the region and continues to advise veterinary start-ups and multinational pet companies in the areas of clinical education, professional training, and wet-lab learning.',
      'Umesh has received numerous awards recognizing his contributions to veterinary medicine and education, including the Outstanding Veterinarian Award from the Veterinary Council of India (Government of India), Innovation Award, Best Teacher Award, Guru Ratna Award, Dermatology Teaching Award from the Indian Association of Veterinary Dermatology (IAVD), and Fellowship of the Animal Nutrition Association.',
      'An advocate of evidence-based medicine, he has authored hundreds of scientific articles, clinical reviews, educational manuals, and research publications for veterinarians and pet owners. He is also an active contributor to print, electronic, and digital media, promoting scientific advances and awareness in companion animal health.',
      'Dr. Umesh is an active member of several national and international professional organizations and represents India at international veterinary conferences and professional associations, particularly in the field of veterinary dermatology.'
    ],
    qualifications: [
      { degree: 'B.V.Sc.', field: 'Veterinary Science & Animal Husbandry', institution: 'Veterinary College, Hebbal, UAS Bangalore', year: '1988' },
      { degree: 'M.V.Sc.', field: 'Veterinary Clinical Medicine', institution: 'Veterinary College, UAS Bangalore', year: '1991' },
      { degree: 'M.Sc. (Clinical Studies)', field: 'Small Animal Internal Medicine & Dermatology', institution: 'Royal Veterinary College (RVC), University of London, England', year: '1998' },
      { degree: 'Fellowship (ANA)', field: 'Animal Nutrition & Clinical Dietetics', institution: 'Animal Nutrition Association', year: 'Fellow' }
    ],
    achievements: [
      '<strong>Outstanding Veterinarian Award:</strong> Conferred by the Veterinary Council of India (VCI), Government of India.',
      '<strong>Innovation Award:</strong> Recognized for advancing clinical learning methodologies and continuing professional development.',
      '<strong>Best Teacher Award &amp; Guru Ratna Award:</strong> Prestigious national honours recognizing lifetime excellence in veterinary teaching and mentorship.',
      '<strong>Dermatology Teaching Award:</strong> Conferred by the Indian Association of Veterinary Dermatology (IAVD).',
      '<strong>Fellowship of the Animal Nutrition Association:</strong> Conferred for distinguished contributions to animal clinical nutrition.'
    ],
    researchInterests: [
      'Small Animal Medicine &amp; Internal Medicine Referral Care',
      'Clinical Nutrition &amp; Evidence-Based Dietetics Protocols',
      'Veterinary Dermatology &amp; Allergic Skin Disease Protocols',
      'Continuing Veterinary Professional Development &amp; Wet-Lab Workshops'
    ],
    extraSectionsHtml: `
      <div class="advisor-detail-section">
        <h4 class="advisor-detail-heading"><i class="fa-solid fa-star"></i> Key Highlights</h4>
        <div class="advisor-highlights-grid">
          <div class="advisor-highlight-card">
            <strong>30+ Years</strong>
            <span>Experience in small animal medicine.</span>
          </div>
          <div class="advisor-highlight-card">
            <strong>1,250+ Lectures</strong>
            <span>Invited lectures at national and international conferences and professional education programmes.</span>
          </div>
          <div class="advisor-highlight-card">
            <strong>Clinical Expertise</strong>
            <span>Internal Medicine, Clinical Nutrition and Dermatology.</span>
          </div>
          <div class="advisor-highlight-card">
            <strong>Former Leadership</strong>
            <span>Director of Scientific Affairs (Waltham), Mars Petcare.</span>
          </div>
          <div class="advisor-highlight-card">
            <strong>Foundation Leadership</strong>
            <span>President of NVF Foundation, organizer of Vetopia.</span>
          </div>
          <div class="advisor-highlight-card">
            <strong>Education Pioneer</strong>
            <span>Pioneered the Mars Continuing Veterinary Professional Development (MCVPD) programme.</span>
          </div>
        </div>
      </div>

      <div class="advisor-detail-section">
        <h4 class="advisor-detail-heading"><i class="fa-solid fa-award"></i> Awards &amp; Recognition</h4>
        <ul class="advisor-detail-list">
          <li><strong>Outstanding Veterinarian Award:</strong> Conferred by the Veterinary Council of India (VCI), Government of India.</li>
          <li><strong>Innovation Award:</strong> Recognized for advancing clinical learning methodologies and continuing professional development.</li>
          <li><strong>Best Teacher Award:</strong> Conferred for exceptional mentorship and dedication to veterinary education.</li>
          <li><strong>Guru Ratna Award:</strong> Prestigious national honour recognizing lifetime excellence in veterinary teaching and guidance.</li>
          <li><strong>Dermatology Teaching Award:</strong> Awarded by the Indian Association of Veterinary Dermatology (IAVD).</li>
          <li><strong>Fellowship of the Animal Nutrition Association:</strong> Conferred for distinguished contributions to animal clinical nutrition.</li>
        </ul>
      </div>

      <div class="advisor-detail-section">
        <h4 class="advisor-detail-heading"><i class="fa-solid fa-stethoscope"></i> Clinical and Professional Expertise</h4>
        <div class="advisor-tags-wrap">
          <span class="advisor-tag"><i class="fa-solid fa-check" style="font-size: 10px; margin-right: 6px; color: var(--teal, #0d9488);"></i>Small Animal Medicine</span>
          <span class="advisor-tag"><i class="fa-solid fa-check" style="font-size: 10px; margin-right: 6px; color: var(--teal, #0d9488);"></i>Internal Medicine</span>
          <span class="advisor-tag"><i class="fa-solid fa-check" style="font-size: 10px; margin-right: 6px; color: var(--teal, #0d9488);"></i>Clinical Nutrition</span>
          <span class="advisor-tag"><i class="fa-solid fa-check" style="font-size: 10px; margin-right: 6px; color: var(--teal, #0d9488);"></i>Veterinary Dermatology</span>
          <span class="advisor-tag"><i class="fa-solid fa-check" style="font-size: 10px; margin-right: 6px; color: var(--teal, #0d9488);"></i>Evidence-Based Veterinary Practice</span>
          <span class="advisor-tag"><i class="fa-solid fa-check" style="font-size: 10px; margin-right: 6px; color: var(--teal, #0d9488);"></i>Continuing Veterinary Professional Development</span>
          <span class="advisor-tag"><i class="fa-solid fa-check" style="font-size: 10px; margin-right: 6px; color: var(--teal, #0d9488);"></i>Clinical Education and Scientific Communication</span>
          <span class="advisor-tag"><i class="fa-solid fa-check" style="font-size: 10px; margin-right: 6px; color: var(--teal, #0d9488);"></i>Wet-Lab Training and Practical Workshops</span>
        </div>
      </div>
    `
  }
};

async function initAboutPageData() {
  bindAdvisorProfileButtons();
  initAdvisorModalEvents();
  initAdvisorLoadMore();

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
 * Renders an advisor card with View Profile modal trigger and optional hidden state
 */
function renderAdvisorCard(member, isHidden = false) {
  const idKey = member.id || member._id || slugify(member.name);
  const name = escapeHtml(member.name || 'Advisory Board Member');
  const designation = escapeHtml(member.designation || 'Senior Advisor');
  const previewBio = escapeHtml(member.previewBio || member.bio || '');
  const photo = escapeHtml(member.image || 'assets/images/about/about-advisor-01.webp');

  let linkedinUrl = member.linkedin;
  if (!linkedinUrl || linkedinUrl === '#' || linkedinUrl === 'https://linkedin.com' || linkedinUrl === 'https://www.linkedin.com') {
    const encodedName = encodeURIComponent(member.name ? member.name.replace(/^(Dr\.|Dr|Prof\.|Prof)\s+/i, '').trim() : '');
    linkedinUrl = encodedName ? `https://www.linkedin.com/search/results/all/?keywords=${encodedName}` : 'https://www.linkedin.com';
  }

  return `
    <div class="advisor-card${isHidden ? ' advisor-card-hidden' : ''}" id="advisor-${idKey}">
      <div class="advisor-photo">
        <img src="${photo}" onerror="this.onerror=null; this.src='assets/images/about/about-advisor-01.webp';" alt="${name}" loading="lazy" decoding="async" />
      </div>
      <div class="advisor-body">
        <h3>${name}</h3>
        <span class="advisor-designation">${designation}</span>
        <p class="advisor-spec">${previewBio}</p>
        <div class="advisor-footer">
          <button type="button" class="btn btn-outline btn-sm advisor-profile-btn" data-advisor-id="${idKey}">
            <span>View Profile</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <a href="${escapeHtml(linkedinUrl)}" target="_blank" rel="noopener noreferrer" class="advisor-card-linkedin-btn" title="LinkedIn Profile" aria-label="LinkedIn Profile">
            <i class="fa-brands fa-linkedin"></i>
          </a>
        </div>
      </div>
    </div>
  `;
}

function openAdvisorProfileModal(advisorId) {
  const member = window.loadedAdvisorMap[advisorId] || findAdvisorProfile({ id: advisorId, name: advisorId });
  if (!member) return;

  const modal = document.getElementById('advisor-modal');
  if (!modal) return;

  const imgEl = document.getElementById('advisor-modal-image');
  const nameEl = document.getElementById('advisor-modal-name');
  const designationEl = document.getElementById('advisor-modal-designation');
  const linkedinWrap = document.getElementById('advisor-modal-linkedin-wrap');
  const linkedinBtn = document.getElementById('advisor-modal-linkedin');
  const linkedinTopBtn = document.getElementById('advisor-modal-linkedin-top');
  const bodyEl = document.getElementById('advisor-modal-body');

  if (imgEl) {
    imgEl.src = member.image || 'assets/images/about/about-advisor-01.webp';
    imgEl.alt = member.name || 'Advisory Board Member';
  }

  if (nameEl) nameEl.textContent = member.name || '';
  if (designationEl) designationEl.textContent = member.designation || '';

  // Determine LinkedIn URL: prefer specific profile, or search query by name, or fallback to linkedin.com
  let linkedinUrl = member.linkedin;
  if (!linkedinUrl || linkedinUrl === '#' || linkedinUrl === 'https://linkedin.com' || linkedinUrl === 'https://www.linkedin.com') {
    const encodedName = encodeURIComponent(member.name ? member.name.replace(/^(Dr\.|Dr|Prof\.|Prof)\s+/i, '').trim() : '');
    linkedinUrl = encodedName ? `https://www.linkedin.com/search/results/all/?keywords=${encodedName}` : 'https://www.linkedin.com';
  }

  if (linkedinBtn) {
    linkedinBtn.href = linkedinUrl;
  }
  if (linkedinTopBtn) {
    linkedinTopBtn.href = linkedinUrl;
  }
  if (linkedinWrap) {
    linkedinWrap.style.display = 'flex';
  }

  // Construct modal body
  if (bodyEl) {
    const fullBioParagraphs = Array.isArray(member.fullBio) 
      ? member.fullBio 
      : (member.fullBio ? [member.fullBio] : [member.bio || '']);

    const qualifications = Array.isArray(member.qualifications) ? member.qualifications : [];
    const achievements = Array.isArray(member.achievements) ? member.achievements : [];
    const researchInterests = Array.isArray(member.researchInterests) ? member.researchInterests : [];
    const extraSectionsHtml = member.extraSectionsHtml || '';

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

    bodyEl.innerHTML = `
      <div class="advisor-detail-section">
        <h4 class="advisor-detail-heading"><i class="fa-solid fa-user-doctor"></i> Full Biography</h4>
        ${fullBioParagraphs.map(p => `<p class="advisor-detail-bio">${escapeHtml(p)}</p>`).join('')}
      </div>
      ${qualificationsTableHtml}
      ${achievementsHtml}
      ${researchHtml}
      ${extraSectionsHtml}
    `;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function initAdvisorModalEvents() {
  const modal = document.getElementById('advisor-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('advisor-modal-close');
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn && !closeBtn.dataset.bound) {
    closeBtn.dataset.bound = 'true';
    closeBtn.addEventListener('click', closeModal);
  }

  if (!modal.dataset.bound) {
    modal.dataset.bound = 'true';
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
}

function bindAdvisorProfileButtons() {
  const btns = document.querySelectorAll('.advisor-profile-btn');
  btns.forEach(btn => {
    if (btn.dataset.bound === 'true') return;
    btn.dataset.bound = 'true';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const idKey = btn.getAttribute('data-advisor-id');
      openAdvisorProfileModal(idKey);
    });
  });
}

function initAdvisorLoadMore() {
  const loadMoreBtn = document.getElementById('advisor-load-more');
  const loadMoreWrap = document.getElementById('advisor-load-more-wrap');
  if (!loadMoreBtn) return;

  if (loadMoreBtn.dataset.bound === 'true') return;
  loadMoreBtn.dataset.bound = 'true';

  loadMoreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const hiddenCards = document.querySelectorAll('.advisor-card.advisor-card-hidden');
    hiddenCards.forEach(card => {
      card.classList.remove('advisor-card-hidden');
    });
    if (loadMoreWrap) {
      loadMoreWrap.style.display = 'none';
    }
    bindAdvisorProfileButtons();
  });
}

async function loadAdvisoryBoardSection() {
  const advisorGrid = document.querySelector('#advisory-board .advisor-grid');
  const loadMoreWrap = document.getElementById('advisor-load-more-wrap');
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
    const rawBoardList = await getAdvisoryBoard();
    if (Array.isArray(rawBoardList) && rawBoardList.length > 0) {
      // Merge any matching live data into canonical profiles
      rawBoardList.forEach(member => {
        const base = findAdvisorProfile(member);
        if (base && base.id) {
          Object.assign(base, member);
        }
      });
    }
  } catch (err) {
    console.warn('Advisory Board live fetch info:', err);
  }

  // Always render canonical 6 members with initial 4 visible and 2 hidden
  advisorGrid.innerHTML = defaultKeys
    .map((key, idx) => renderAdvisorCard(window.loadedAdvisorMap[key], idx >= 4))
    .join('');

  if (loadMoreWrap) {
    loadMoreWrap.style.display = 'block';
  }

  bindAdvisorProfileButtons();
  initAdvisorModalEvents();
  initAdvisorLoadMore();
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
