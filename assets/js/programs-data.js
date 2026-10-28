/**
 * VetNova Learning Centre - 28 Clinical Veterinary Programs & Three-Stage Syllabus Dataset
 * Source of truth for all 28 programs offered by VetNova.
 * Programs 1-10: Exact Three-Stage Syllabus extracted from VetNova_Three_Stage_Syllabus.pdf screenshots.
 * Programs 11-28: Structured data with SyllabusStatus = "Pending" ("Detailed syllabus coming soon").
 * Synchronizes with MERN Backend API whenever available.
 */

window.VETNOVA_28_PROGRAMS = [
  {
    order: 1,
    title: "General Medicine",
    slug: "general-medicine",
    category: "Internal Medicine",
    duration: "4 Weeks / Modular",
    description: "Systematic clinical diagnostic and therapeutic protocols for small animal internal medicine practice, from physical examination through complex multisystem disease management.",
    image: "assets/images/programs/program-skill-up.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Clinical history taking and systematic physical examination",
        "Vital signs, hydration, body condition and pain scoring",
        "Fever of unknown origin: basic approach",
        "Anaemia: types and first-line workup",
        "Fluid therapy basics: fluids, routes, rates",
        "Rational use of antibiotics, NSAIDs and steroids",
        "Prescription writing and case record keeping"
      ],
      intermediate: [
        "Problem-oriented medical record and differential diagnosis",
        "Fluid therapy in electrolyte and acid-base disorders",
        "Immune-mediated haemolytic anaemia and thrombocytopaenia",
        "Hepatobiliary disease: diagnosis and management",
        "Pancreatitis and pyrexia of complex origin",
        "Blood transfusion practice and cross-matching",
        "Toxicology: organophosphate, rodenticide, snakebite, paracetamol"
      ],
      advanced: [
        "Management of complex multisystem cases",
        "Evidence-based veterinary medicine and critical appraisal of literature",
        "Antimicrobial stewardship and resistance in Indian practice",
        "Immunosuppressive protocols and monitoring",
        "Sepsis, SIRS and multiple organ dysfunction",
        "Palliative and hospice care planning",
        "Clinical audit and morbidity-mortality rounds"
      ]
    }
  },
  {
    order: 2,
    title: "Soft Tissue Surgery",
    slug: "soft-tissue-surgery",
    category: "Surgery",
    duration: "1 to 4 Weeks",
    description: "Comprehensive practical surgical training from surgical asepsis and basic wound closure to life-saving abdominal, reconstructive, and emergency thoracic procedures.",
    image: "assets/images/programs/program-surgery.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Surgical asepsis, instruments and suture materials",
        "Pre-operative assessment and surgical planning",
        "Ovariohysterectomy and castration (dog, cat)",
        "Wound classification, healing and dressings",
        "Abscess, lacerations and simple wound closure",
        "Cystotomy and enterotomy basics",
        "Post-operative care and complications"
      ],
      intermediate: [
        "Pyometra, uterine and ovarian emergencies",
        "Gastric dilatation-volvulus and gastropexy",
        "Intestinal resection and anastomosis, foreign bodies",
        "Splenectomy, hepatic and biliary surgery",
        "Perineal, inguinal and diaphragmatic hernias",
        "Urethrostomy and urethral obstruction surgery",
        "Reconstructive techniques: skin flaps, grafts, drains"
      ],
      advanced: [
        "Thoracic surgery: lung lobectomy, pericardiectomy, thoracotomy",
        "Portosystemic shunt and complex hepatobiliary surgery",
        "Tumour resection: mastectomy, margins and oncologic surgery",
        "Anal sac, rectal and perineal reconstruction",
        "Laparoscopy and minimally invasive surgery",
        "Management of surgical complications and revision surgery",
        "Surgical audit and training of junior surgeons"
      ]
    }
  },
  {
    order: 3,
    title: "Orthopaedics",
    slug: "orthopaedics",
    category: "Surgery",
    duration: "2 to 4 Weeks",
    description: "Hands-on orthopaedic surgery curriculum covering fracture mechanics, splinting, internal/external fixation, joint stabilization, and corrective osteotomies.",
    image: "assets/facility-diagnostics-room.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Orthopaedic examination, gait and lameness evaluation",
        "Radiographic positioning for bones and joints",
        "Fracture classification and first-aid stabilisation",
        "Bandages, splints and casts",
        "Wound and open fracture management",
        "Luxations: reduction and basic care",
        "Principles of bone healing"
      ],
      intermediate: [
        "Intramedullary pinning and cerclage wiring",
        "External skeletal fixation (ESF) and Ehmer sling",
        "Plating basics: DCP, LCP",
        "Cranial cruciate ligament disease and stabilisation",
        "Patellar luxation correction",
        "Hip: FHO, hip dysplasia diagnosis",
        "Management of long bone fractures in growing animals"
      ],
      advanced: [
        "Total hip replacement and advanced arthroplasty",
        "TPLO, TTA and advanced stifle surgery",
        "Interlocking nails and minimally invasive plate osteosynthesis",
        "Fracture non-union, malunion and osteomyelitis",
        "Corrective osteotomy and angular limb deformities",
        "Pelvic, spinal and complex fracture repair",
        "Arthroscopy and biomechanics"
      ]
    }
  },
  {
    order: 4,
    title: "Veterinary Dermatology",
    slug: "veterinary-dermatology",
    category: "Dermatology",
    duration: "2 Weeks",
    description: "Clinical approach to skin, ear, and allergic conditions in companion animals, with focus on in-house diagnostics, cytology, and evidence-based allergy therapies.",
    image: "assets/images/facility-main.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Dermatological history and examination",
        "Skin scraping, tape impression, cytology, Wood's lamp",
        "Ectoparasites: fleas, ticks, mange (sarcoptic, demodectic)",
        "Superficial pyoderma and Malassezia dermatitis",
        "Dermatophytosis (ringworm)",
        "Basic shampoo and topical therapy",
        "Flea allergy dermatitis"
      ],
      intermediate: [
        "Canine atopic dermatitis: diagnosis and long-term management",
        "Food allergy and elimination diet trials",
        "Recurrent and deep pyoderma, culture and sensitivity",
        "Otitis externa and media",
        "Autoimmune skin disease overview: pemphigus",
        "Alopecia and endocrine skin disease",
        "Feline dermatology: eosinophilic complex, miliary dermatitis"
      ],
      advanced: [
        "Advanced allergy management: immunotherapy, oclacitinib, lokivetmab",
        "Skin biopsy techniques and dermatopathology interpretation",
        "Multidrug-resistant pyoderma (MRSP) management",
        "Immunosuppressive therapy in autoimmune skin disease",
        "Cutaneous neoplasia and cutaneous lymphoma",
        "Refractory otitis, ear surgery referral decisions",
        "Dermatology in Indian climate: seasonal and humidity-related disease"
      ]
    }
  },
  {
    order: 5,
    title: "Infectious Diseases",
    slug: "infectious-diseases",
    category: "Internal Medicine",
    duration: "2 Weeks",
    description: "Clinical management of canine, feline, and zoonotic infectious diseases, outbreak containment, vector-borne diagnostics, and biosecurity protocols.",
    image: "assets/images/about/about-facility-02.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Canine parvovirus and distemper",
        "Rabies: pathogenesis, post-exposure and legal aspects",
        "Infectious canine hepatitis and kennel cough",
        "Feline panleukopenia and upper respiratory complex",
        "Leptospirosis",
        "Isolation, barrier nursing and biosecurity",
        "Zoonoses: public health awareness"
      ],
      intermediate: [
        "Tick-borne diseases: Ehrlichia, Babesia, Hepatozoon, Anaplasma",
        "Canine distemper neurological form",
        "Feline leukaemia and FIV testing and counselling",
        "FIP: diagnosis and current antiviral options",
        "Heartworm and microfilaria in India",
        "Tetanus, salmonellosis, campylobacteriosis",
        "Surveillance of outbreaks in kennels and shelters"
      ],
      advanced: [
        "Chronic and refractory ehrlichiosis, babesiosis co-infections",
        "Leishmaniasis and emerging vector-borne diseases in India",
        "Hospital-acquired infection control programmes",
        "One Health approach: zoonoses, rabies elimination, ABC programme",
        "Antimicrobial resistance surveillance",
        "Outbreak investigation and epidemiology",
        "Management of shelter and multi-pet household disease"
      ]
    }
  },
  {
    order: 6,
    title: "Emergency and Critical Care",
    slug: "emergency-and-critical-care",
    category: "Emergency & Critical Care",
    duration: "2 to 4 Weeks",
    description: "Intensive training in triage algorithms, shock resuscitation, trauma stabilization, ventilator management, and high-stakes emergency clinical decision-making.",
    image: "assets/images/programs/program-emergency.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Triage and primary survey (ABC approach)",
        "Shock recognition and initial stabilisation",
        "Basic cardiopulmonary resuscitation (CPR)",
        "IV and intraosseous catheterisation",
        "Oxygen supplementation",
        "Heatstroke, road traffic accident first aid",
        "Emergency drugs and crash cart setup"
      ],
      intermediate: [
        "Fluid resuscitation strategies and monitoring",
        "Blood gas, lactate and electrolyte interpretation",
        "Thoracic and abdominal trauma management",
        "Gastric dilatation-volvulus, urethral obstruction emergencies",
        "Diabetic ketoacidosis and Addisonian crisis",
        "Poisoning and snakebite emergencies",
        "Analgesia and sedation in emergency patients"
      ],
      advanced: [
        "Mechanical ventilation and advanced respiratory support",
        "Transfusion, plasma and blood component therapy",
        "Management of sepsis and DIC",
        "Traumatic brain injury and status epilepticus",
        "Advanced haemodynamic monitoring: invasive blood pressure, ScvO2",
        "Setting up ICU: protocols, staffing, equipment",
        "Advanced CPR leadership and post-arrest care"
      ]
    }
  },
  {
    order: 7,
    title: "Anaesthesia and Pain Management",
    slug: "anaesthesia-and-pain-management",
    category: "Anaesthesia",
    duration: "2 Weeks",
    description: "Safe peri-operative anaesthetic protocols, ASA grading, airway management, multimodal analgesia, regional nerve blocks, and critical crisis mitigation.",
    image: "assets/images/facility-radiology.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Pre-anaesthetic assessment and ASA grading",
        "Premedication, induction and maintenance drugs",
        "Intubation and airway management",
        "Anaesthetic monitoring: ECG, SpO2, ETCO2, BP",
        "Recovery and common anaesthetic complications",
        "Pain recognition and scoring (canine and feline)",
        "Local anaesthetic blocks introduction"
      ],
      intermediate: [
        "Anaesthetic protocols for high-risk patients: cardiac, renal, hepatic, ger <span class='topic-flagged-tag' title='Text ends with &quot;ger&quot; in scan, flagged for verification'>[flagged: geriatric]</span>",
        "Brachycephalic anaesthesia",
        "Epidural and regional nerve blocks",
        "Multimodal analgesia",
        "Total intravenous anaesthesia (TIVA)",
        "Anaesthesia for caesarean section and paediatrics",
        "Anaesthetic machine, circuits and gas scavenging"
      ],
      advanced: [
        "Mechanical ventilation during anaesthesia",
        "Advanced regional anaesthesia, ultrasound-guided blocks",
        "Anaesthesia for thoracic, neurosurgical and cardiac cases",
        "Chronic pain management: osteoarthritis, cancer pain",
        "Anaesthetic emergencies and crisis management",
        "Anaesthesia in exotic and wildlife patients",
        "Developing anaesthesia and analgesia protocols for the hospital"
      ]
    }
  },
  {
    order: 8,
    title: "Veterinary Cardiology",
    slug: "veterinary-cardiology",
    category: "Internal Medicine",
    duration: "2 to 3 Weeks",
    description: "Clinical cardiology focusing on cardiac auscultation, ECG rhythm analysis, echocardiographic measurements, heart failure therapeutics, and interventional procedures.",
    image: "assets/images/program-skill-up.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Cardiac auscultation and heart murmurs",
        "Signs of congestive heart failure",
        "Basic thoracic radiography of the heart",
        "Introduction to ECG",
        "Common congenital defects: PDA, pulmonic stenosis",
        "Mitral valve disease overview",
        "Basic heart failure drugs: furosemide, pimobendan, ACE inhibitors"
      ],
      intermediate: [
        "Echocardiography: standard views and measurements",
        "ECG interpretation of arrhythmias",
        "Myxomatous mitral valve disease staging (ACVIM)",
        "Dilated cardiomyopathy in dogs",
        "Feline hypertrophic cardiomyopathy and thromboembolism",
        "Heartworm disease and pulmonary hypertension",
        "Systemic hypertension and blood pressure measurement"
      ],
      advanced: [
        "Advanced echocardiography: Doppler, strain, contrast",
        "Interventional cardiology: PDA occlusion, balloon valvuloplasty",
        "Pacemaker therapy for bradyarrhythmias",
        "Pericardial effusion and cardiac tamponade",
        "Refractory congestive heart failure management",
        "Cardiac biomarkers: NT-proBNP, troponin",
        "Cardiology case discussion and referral networks"
      ]
    }
  },
  {
    order: 9,
    title: "Veterinary Neurology",
    slug: "veterinary-neurology",
    category: "Neurology",
    duration: "2 Weeks",
    description: "Systematic neuro-localization, seizure management algorithms, spinal trauma first aid, neuro-imaging interpretation, and neuro-surgical foundations.",
    image: "assets/vet_facility_main_training.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Neurological examination step by step",
        "Neuroanatomical localisation",
        "Common presentations: seizures, paresis, vestibular disease",
        "Intervertebral disc disease: recognition and first aid",
        "Distemper-related neurological signs",
        "Safe handling of recumbent patients",
        "Basic nursing of spinal patients"
      ],
      intermediate: [
        "Epilepsy: diagnosis, anticonvulsant therapy and monitoring",
        "Intervertebral disc disease: medical and surgical management",
        "Vestibular disease and cranial nerve disorders",
        "Cerebrospinal fluid collection and analysis",
        "Meningoencephalitis overview",
        "Neuro-ophthalmology basics",
        "Neuro-rehabilitation basics"
      ],
      advanced: [
        "MRI and CT interpretation in neurology",
        "Hemilaminectomy and advanced spinal surgery",
        "Brain tumours and intracranial surgery overview",
        "Status epilepticus and refractory seizure management",
        "Neuromuscular diseases: myasthenia gravis, polyneuropathy",
        "Immune-mediated CNS disease",
        "Neurology referral and case-based discussions"
      ]
    }
  },
  {
    order: 10,
    title: "Veterinary Ophthalmology",
    slug: "veterinary-ophthalmology",
    category: "Ophthalmology",
    duration: "2 Weeks",
    description: "Essential and advanced diagnostic workups for ophthalmic conditions, corneal micro-surgery, glaucoma tonometry, and ocular emergency management.",
    image: "assets/vet_selector_surgery_card.webp",
    status: "Published",
    syllabusStatus: "Available",
    syllabus: {
      foundation: [
        "Ophthalmic examination: Schirmer tear test, fluorescein, pupillary reflexes <span class='topic-flagged-tag' title='Text ends with &quot;pupillary refle&quot; in scan, flagged for verification'>[flagged: pupillary reflexes]</span>",
        "Red eye: differential diagnosis",
        "Conjunctivitis and eyelid disorders",
        "Corneal ulcer: diagnosis and basic treatment",
        "Ophthalmic drugs and their safe use",
        "Eye injuries and first aid",
        "Cherry eye in dogs"
      ],
      intermediate: [
        "Tonometry and glaucoma diagnosis",
        "Deep, melting and non-healing corneal ulcers",
        "Uveitis: causes and therapy",
        "Dry eye (KCS) management",
        "Cataract recognition and referral",
        "Entropion, ectropion and eyelid surgery",
        "Third eyelid gland prolapse correction"
      ],
      advanced: [
        "Cataract surgery and phacoemulsification principles",
        "Glaucoma surgery and medical management",
        "Corneal grafts and conjunctival flaps",
        "Orbital disease and enucleation",
        "Retinal disease: PRA, SARDS and electroretinography",
        "Ocular neoplasia",
        "Ocular ultrasound and ophthalmic imaging"
      ]
    }
  },
  {
    order: 11,
    title: "Veterinary Dentistry",
    slug: "veterinary-dentistry",
    category: "Dentistry & Oral Surgery",
    duration: "1 to 2 Weeks",
    description: "Periodontal therapy, dental radiography, closed and surgical extractions, and management of common oral pathologies in dogs and cats.",
    image: "assets/facility-diagnostics-room.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 12,
    title: "Feline Medicine",
    slug: "feline-medicine",
    category: "Internal Medicine",
    duration: "2 Weeks",
    description: "Cat-friendly handling, management of feline chronic kidney disease, retroviral infections, lower urinary tract disease, and diabetes mellitus.",
    image: "assets/images/about/about-facility-01.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 13,
    title: "Exotic Pet Medicine",
    slug: "exotic-pet-medicine",
    category: "Exotics & Avian",
    duration: "2 Weeks",
    description: "Husbandry, clinical handling, anaesthesia, and therapeutic management of avian, reptile, and small mammal companion patients.",
    image: "assets/images/facility-lecture.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 14,
    title: "Diagnostic Imaging",
    slug: "diagnostic-imaging",
    category: "Diagnostics & Imaging",
    duration: "2 to 3 Weeks",
    description: "Digital radiography positioning and interpretation, abdominal ultrasound scanning protocols, echocardiography basics, and introductory CT/MRI concepts.",
    image: "assets/images/programs/program-radiology.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 15,
    title: "Clinical Pathology",
    slug: "clinical-pathology",
    category: "Pathology & Diagnostics",
    duration: "1 to 2 Weeks",
    description: "In-house blood smear evaluation, cytology of masses and fluid aspirates, urinalysis, and biochemical profile interpretation for daily clinical practice.",
    image: "assets/vet_facility_diagnostics_room.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 16,
    title: "Clinical Microbiology",
    slug: "clinical-microbiology",
    category: "Pathology & Diagnostics",
    duration: "1 to 2 Weeks",
    description: "Sample collection, in-clinic stain techniques, bacterial culture and antimicrobial susceptibility testing, and fungal identification.",
    image: "assets/images/facility-main.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 17,
    title: "Nephrology and Urology",
    slug: "nephrology-and-urology",
    category: "Internal Medicine",
    duration: "2 Weeks",
    description: "Acute kidney injury, chronic kidney disease staging (IRIS), urolithiasis, urinary tract infections, and urethral obstruction intervention.",
    image: "assets/facility-diagnostics-room.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 18,
    title: "Gastroenterology",
    slug: "gastroenterology",
    category: "Internal Medicine",
    duration: "2 Weeks",
    description: "Diagnostic approach to chronic vomiting, diarrhoea, protein-losing enteropathy, pancreatitis, inflammatory bowel disease, and GI endoscopy basics.",
    image: "assets/images/program-skill-up.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 19,
    title: "Oncology",
    slug: "oncology",
    category: "Oncology",
    duration: "2 Weeks",
    description: "Clinical tumor staging, safe chemotherapy administration protocols, oncologic surgical margins, and palliative patient care.",
    image: "assets/vet_facility_main_training.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 20,
    title: "Endocrinology",
    slug: "endocrinology",
    category: "Internal Medicine",
    duration: "2 Weeks",
    description: "Diabetes mellitus regulation, hyper/hypoadrenocorticism testing protocols, feline hyperthyroidism, and canine hypothyroidism management.",
    image: "assets/images/about/about-facility-02.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 21,
    title: "Reproduction and Obstetrics",
    slug: "reproduction-and-obstetrics",
    category: "Reproduction",
    duration: "2 Weeks",
    description: "Breeding management, artificial insemination, pregnancy ultrasonography, dystocia intervention, and elective/emergency caesarean sections.",
    image: "assets/images/programs/program-surgery.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 22,
    title: "Veterinary Nutrition",
    slug: "veterinary-nutrition",
    category: "Nutrition & Wellness",
    duration: "1 to 2 Weeks",
    description: "Nutritional assessment, therapeutic dietary formulation for renal, hepatic, and metabolic diseases, and feeding tube placement.",
    image: "assets/images/facility-main.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 23,
    title: "Preventive Medicine and Vaccinology",
    slug: "preventive-medicine-and-vaccinology",
    category: "Preventive Medicine",
    duration: "1 Week",
    description: "Core and non-core vaccination protocols (WSAVA guidelines), parasite prevention regimens, geriatric screening, and puppy/kitten wellness programs.",
    image: "assets/images/about/about-facility-01.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 24,
    title: "Behavioural Medicine",
    slug: "behavioural-medicine",
    category: "Behavioural Science",
    duration: "1 to 2 Weeks",
    description: "Canine and feline fear-free handling, separation anxiety, aggression assessment, noise phobias, and psychopharmacology in practice.",
    image: "assets/vet_selector_foundation_card.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 25,
    title: "Geriatric Medicine",
    slug: "geriatric-medicine",
    category: "Internal Medicine",
    duration: "1 to 2 Weeks",
    description: "Comprehensive care for aging pets: chronic osteoarthritis, cognitive dysfunction syndrome, multi-morbidities, and hospice care planning.",
    image: "assets/facility-lecture.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 26,
    title: "Laboratory Diagnostics",
    slug: "laboratory-diagnostics",
    category: "Diagnostics & Imaging",
    duration: "2 Weeks",
    description: "Operating and troubleshooting clinical lab analyzers, point-of-care testing kits, quality control, and laboratory workflow optimization.",
    image: "assets/vet_facility_diagnostics_room.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 27,
    title: "Veterinary Physiotherapy and Rehabilitation",
    slug: "veterinary-physiotherapy-and-rehabilitation",
    category: "Rehabilitation",
    duration: "2 Weeks",
    description: "Post-surgical orthopedic rehabilitation, neurological recovery protocols, therapeutic exercises, laser therapy, and passive range of motion.",
    image: "assets/vet_selector_nurse_card.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  },
  {
    order: 28,
    title: "Veterinary Ethics and Practice Management",
    slug: "veterinary-ethics-and-practice-management",
    category: "Practice Management",
    duration: "1 to 2 Weeks",
    description: "Clinical communication, client consent, medical negligence avoidance, ethical euthanasia decision-making, and veterinary practice business fundamentals.",
    image: "assets/images/facility-lecture.webp",
    status: "Published",
    syllabusStatus: "Pending",
    syllabus: { foundation: [], intermediate: [], advanced: [] }
  }
];

/**
 * Returns program by slug or order number
 */
function getProgramBySlug(slugOrId) {
  if (!slugOrId) return null;
  const s = String(slugOrId).toLowerCase().trim().replace(/\.html$/, "");
  return (window.VETNOVA_28_PROGRAMS || []).find(p => 
    p.slug === s || 
    p.slug.replace(/-/g, "") === s.replace(/-/g, "") ||
    String(p.order) === s ||
    String(p._id) === s
  ) || null;
}
window.getProgramBySlug = getProgramBySlug;

/**
 * Generates the HTML markup for the Three-Stage Syllabus
 * matching Section 5 design specification
 */
function renderThreeStageSyllabusHTML(program) {
  if (!program) return "";

  const foundation = program.syllabus?.foundation || [];
  const intermediate = program.syllabus?.intermediate || [];
  const advanced = program.syllabus?.advanced || [];

  const isPending = program.syllabusStatus === "Pending" || (foundation.length === 0 && intermediate.length === 0 && advanced.length === 0);

  if (isPending) {
    return `
      <div class="syllabus-pending-box">
        <i class="fa-solid fa-clock-rotate-left"></i>
        <h4>Detailed syllabus coming soon. Please contact VetNova for current program information.</h4>
        <p>The verified curriculum and clinical wet-lab schedule for <strong>${program.title}</strong> is currently being scheduled. Contact our academic office for provisional details.</p>
        <a href="contact.html?program=${encodeURIComponent(program.slug)}" class="btn btn-primary btn-sm">
          <i class="fa-solid fa-envelope"></i> Request Current Program Info
        </a>
      </div>
    `;
  }

  return `
    <div class="three-stage-syllabus-card" id="three-stage-syllabus-card">
      <!-- Dark Blue Heading Bar -->
      <div class="syllabus-subject-header">
        <h3 class="syllabus-subject-title">
          <i class="fa-solid fa-graduation-cap"></i>
          <span>${program.order}. ${program.title}</span>
        </h3>
        <span class="syllabus-subject-badge">Three-Stage Curriculum</span>
      </div>

      <!-- Stage 1: Foundation (Green) -->
      <div class="syllabus-stage-row stage-foundation">
        <div class="syllabus-stage-label">
          <span>Foundation</span>
          <span class="syllabus-stage-subtext">Core Clinical Principles</span>
        </div>
        <div class="syllabus-stage-content">
          <ul class="syllabus-topic-list">
            ${foundation.map(t => `<li>${t}</li>`).join("")}
          </ul>
        </div>
      </div>

      <!-- Stage 2: Intermediate (Ochre / Mustard) -->
      <div class="syllabus-stage-row stage-intermediate">
        <div class="syllabus-stage-label">
          <span>Intermediate</span>
          <span class="syllabus-stage-subtext">Diagnostics &amp; Management</span>
        </div>
        <div class="syllabus-stage-content">
          <ul class="syllabus-topic-list">
            ${intermediate.map(t => `<li>${t}</li>`).join("")}
          </ul>
        </div>
      </div>

      <!-- Stage 3: Advanced (Muted Red) -->
      <div class="syllabus-stage-row stage-advanced">
        <div class="syllabus-stage-label">
          <span>Advanced</span>
          <span class="syllabus-stage-subtext">Specialist Decision-Making</span>
        </div>
        <div class="syllabus-stage-content">
          <ul class="syllabus-topic-list">
            ${advanced.map(t => `<li>${t}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
  `;
}
window.renderThreeStageSyllabusHTML = renderThreeStageSyllabusHTML;

/**
 * Sync with MERN API when available
 */
async function syncProgramsWithApi() {
  if (typeof getPrograms === "function") {
    try {
      const livePrograms = await getPrograms();
      if (Array.isArray(livePrograms) && livePrograms.length > 0) {
        livePrograms.forEach(liveP => {
          const match = window.VETNOVA_28_PROGRAMS.find(p => p.slug === liveP.slug || p.order === liveP.order);
          if (match) {
            match._id = liveP._id;
            match.title = liveP.title || match.title;
            match.description = liveP.description || match.description;
            match.category = liveP.category || match.category;
            match.status = liveP.status || match.status;
            match.syllabusStatus = liveP.syllabusStatus || match.syllabusStatus;
            if (liveP.syllabus && (liveP.syllabus.foundation?.length || liveP.syllabus.intermediate?.length || liveP.syllabus.advanced?.length)) {
              match.syllabus = liveP.syllabus;
            }
          }
        });
      }
    } catch (e) {
      console.warn("Could not sync with live programs API, using verified local dataset.", e);
    }
  }
}
window.syncProgramsWithApi = syncProgramsWithApi;

document.addEventListener("DOMContentLoaded", () => {
  syncProgramsWithApi();
});
