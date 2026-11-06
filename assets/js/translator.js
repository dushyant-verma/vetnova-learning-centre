/**
 * VetNova Learning Centre — English-Hindi Language Translator Engine
 * High-performance, zero-latency, lossless bilingual switcher with state persistence.
 * Full website coverage: Headers, Footers, Modals, Homepage, About, Faculty,
 * Partnerships, Programs Catalogue, Single Program Tracks, Blogs, Contact, FAQs, Chatbot.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'vetnova_lang';
  const DEFAULT_LANG = 'en';

  const MONTH_MAP = {
    'January': 'जनवरी',
    'February': 'फ़रवरी',
    'March': 'मार्च',
    'April': 'अप्रैल',
    'May': 'मई',
    'June': 'जून',
    'July': 'जुलाई',
    'August': 'अगस्त',
    'September': 'सितंबर',
    'October': 'अक्टूबर',
    'November': 'नवंबर',
    'December': 'दिसंबर'
  };

  // Comprehensive bilingual dictionary covering the complete VetNova website
  const DICTIONARY = {
    "Home": "होम",
    "Home V2": "होम V2",
    "Home V3": "होम V3",
    "Home V4": "होम V4",
    "Original Homepage": "मूल होमपेज",
    "Redesigned Homepage": "नया होमपेज",
    "Flagship Homepage": "फ्लैगशिप होमपेज",
    "Clinical Excellence V4": "क्लिनिकल उत्कृष्टता V4",
    "About": "संस्थान",
    "About Institute": "संस्थान के बारे में",
    "About VetNova": "वेटनोवा के बारे में",
    "India's practical learning hub for vet skills": "पशु चिकित्सा कौशल के लिए भारत का व्यावहारिक शिक्षण केंद्र",
    "Vision & Mission": "दृष्टि और मिशन",
    "Vision &amp; Mission": "दृष्टि और मिशन",
    "Empowering compassionate care & excellence": "सहानुभूतिपूर्ण देखभाल और उत्कृष्टता का सशक्तिकरण",
    "Empowering compassionate care &amp; excellence": "सहानुभूतिपूर्ण देखभाल और उत्कृष्टता का सशक्तिकरण",
    "Advisory Board": "सलाहकार बोर्ड",
    "Guided by senior veterinary leaders": "वरिष्ठ पशु चिकित्सा मार्गदर्शकों द्वारा निर्देशित",
    "Partnerships": "साझेदारी",
    "Partner with VetNova for education & clinical growth": "शिक्षा और क्लिनिकल विकास के लिए वेटनोवा से जुड़ें",
    "Partner with VetNova for education &amp; clinical growth": "शिक्षा और क्लिनिकल विकास के लिए वेटनोवा से जुड़ें",
    "Programs": "कार्यक्रम",
    "Programs by Audience": "श्रेणी अनुसार कार्यक्रम",
    "Fresh Vets & Interns": "नए पशु चिकित्सक और इंटर्न",
    "Fresh Vets &amp; Interns": "नए पशु चिकित्सक और इंटर्न",
    "Practising Veterinarians": "अभ्यासशील पशु चिकित्सक",
    "Specialists & Experienced Vets": "विशेषज्ञ और अनुभवी पशु चिकित्सक",
    "Specialists &amp; Experienced Vets": "विशेषज्ञ और अनुभवी पशु चिकित्सक",
    "Pet Owners & Rescuers": "पालतू पशु मालिक और बचावकर्ता",
    "Pet Owners &amp; Rescuers": "पालतू पशु मालिक और बचावकर्ता",
    "Explore Skill-Up Track": "स्किल-अप ट्रैक देखें",
    "Explore Surgical Track": "सर्जिकल ट्रैक देखें",
    "Explore Advanced Masterclasses": "उन्नत मास्टरक्लास देखें",
    "Explore Pet First Aid Workshop": "पेट फर्स्ट एड कार्यशाला देखें",
    "BYSC Students & Interns": "बीवीएससी छात्र और इंटर्न",
    "BYSC Students &amp; Interns": "बीवीएससी छात्र और इंटर्न",
    "Clinicians & Practitioners": "क्लिनिशियन और प्रैक्टिशनर",
    "Clinicians &amp; Practitioners": "क्लिनिशियन और प्रैक्टिशनर",
    "Specialists & Experienced": "विशेषज्ञ और अनुभवी",
    "Specialists &amp; Experienced": "विशेषज्ञ और अनुभवी",
    "Pet Owners & Volunteers": "पालतू मालिक और स्वयंसेवक",
    "Pet Owners &amp; Volunteers": "पालतू मालिक और स्वयंसेवक",
    "Foundation Level": "फाउंडेशन स्तर",
    "Intermediate Level": "इंटरमीडिएट स्तर",
    "Advanced Level": "उन्नत स्तर",
    "Explore Programs by Audience & Experience": "अनुभव और श्रेणी के अनुसार कार्यक्रम देखें",
    "Explore Programs by Audience &amp; Experience": "अनुभव और श्रेणी के अनुसार कार्यक्रम देखें",
    "View All 28 Programs": "सभी 28 कार्यक्रम देखें",
    "View All 28 Programs Catalog": "सभी 28 कार्यक्रम कैटलॉग देखें",
    "Clinical Programs by Grade": "लर्निंग ग्रेड अनुसार क्लिनिकल कार्यक्रम",
    "LEARNING PROGRESSION SYSTEM": "शिक्षण प्रगति प्रणाली",
    "Explore Programs by Learning Grade": "लर्निंग ग्रेड के अनुसार कार्यक्रम देखें",
    "Structured school/grade-style progression from Grade 1 to Grade 5 across 5 specialized learning tracks.": "5 विशेष शिक्षण ट्रैक में ग्रेड 1 से ग्रेड 5 तक संरचित प्रगति।",
    "GRADE 1": "ग्रेड 1",
    "GRADE 2": "ग्रेड 2",
    "GRADE 3": "ग्रेड 3",
    "GRADE 4": "ग्रेड 4",
    "GRADE 5": "ग्रेड 5",
    "Grade 1": "ग्रेड 1",
    "Grade 2": "ग्रेड 2",
    "Grade 3": "ग्रेड 3",
    "Grade 4": "ग्रेड 4",
    "Grade 5": "ग्रेड 5",
    "Basic": "बुनियादी",
    "Intermediate": "मध्यवर्ती",
    "Competitive": "प्रतियोगी",
    "Advanced": "उन्नत",
    "Pro": "पेशेवर (प्रो)",
    "Fresh Graduates & Interns": "नए स्नातक एवं इंटर्न",
    "Fresh Graduates &amp; Interns": "नए स्नातक एवं इंटर्न",
    "Practicing Veterinarians": "अभ्यास करने वाले पशु चिकित्सक",
    "Diagnostic Specialization": "नैदानिक विशेषज्ञता",
    "Emergency & Critical Care": "आपातकालीन एवं गहन चिकित्सा",
    "Emergency &amp; Critical Care": "आपातकालीन एवं गहन चिकित्सा",
    "Vet Nurse & Paravet Staff": "वेट नर्स एवं पैरा-वेट स्टाफ",
    "Vet Nurse &amp; Paravet Staff": "वेट नर्स एवं पैरा-वेट स्टाफ",
    "Looking for complete program details & batch schedules?": "पूरे कार्यक्रम विवरण और बैच शेड्यूल की तलाश है?",
    "Looking for complete program details &amp; batch schedules?": "पूरे कार्यक्रम विवरण और बैच शेड्यूल की तलाश है?",
    "View Programs Catalogue": "कार्यक्रम विवरणिका देखें",
    "Our Faculty": "हमारे संकाय",
    "Facility Tour": "सुविधा भ्रमण",
    "Animal Welfare": "पशु कल्याण",
    "Blog": "ब्लॉग",
    "Knowledge Hub": "ज्ञान केंद्र",
    "FAQs": "अक्सर पूछे जाने वाले प्रश्न",
    "Contact": "संपर्क",
    "Contact Us": "संपर्क करें",
    "Book Counselling": "परामर्श बुक करें",
    "Book Free Counselling ": "निःशुल्क परामर्श बुक करें",
    "Book Free Counselling": "निःशुल्क परामर्श बुक करें",
    "Partner With Us": "हमारे साथ साझेदारी करें",
    "Download Brochure": "विवरणिका डाउनलोड करें",
    "Download Syllabus": "पाठ्यक्रम डाउनलोड करें",
    "Download Prospectus": "प्रॉस्पेक्टस डाउनलोड करें",
    "Wagholi, Pune": "वाघोली, पुणे",
    "Gawadewadi, Wagholi, Pune, MH 412207": "गावडेवाड़ी, वाघोली, पुणे, महाराष्ट्र 412207",
    "Gawadewadi – Wagholi, Pune": "गावडेवाड़ी – वाघोली, पुणे",
    "Empowering Veterinary Professionals Through Practical Clinical Excellence.": "व्यावहारिक क्लिनिकल उत्कृष्टता के माध्यम से पशु चिकित्सा पेशेवरों को सशक्त बनाना।",
    "Learn • Practice • Lead": "सीखें • अभ्यास करें • नेतृत्व करें",
    "Pune's premier practical veterinary learning centre, empowering veterinarians, nurses, and pet professionals with hands-on clinical skills, expert faculty mentorship, and verified skill competency certifications.": "पुणे का प्रमुख व्यावहारिक पशु चिकित्सा शिक्षण केंद्र, जो पशु चिकित्सकों, नर्सों और पेशेवरों को हैंड्स-ऑन क्लिनिकल कौशल, विशेषज्ञ संकाय मेंटरशिप और सत्यापित कौशल प्रमाणन के साथ सशक्त बनाता है।",
    "ADMISSIONS OPEN 2026": "प्रवेश प्रारंभ 2026",
    "Ready to Build Your Veterinary Career?": "क्या आप अपना पशु चिकित्सा करियर संवारने के लिए तैयार हैं?",
    "Join India's practical-first veterinary training institute and gain hands-on clinical confidence through structured programs.": "भारत के व्यावहारिक पशु चिकित्सा प्रशिक्षण संस्थान से जुड़ें और संरचित कार्यक्रमों के माध्यम से क्लिनिकल आत्मविश्वास हासिल करें।",
    "Call For Admissions": "प्रवेश हेतु कॉल करें",
    "Quick Enquiry": "त्वरित पूछताछ",
    "Google Maps Directions": "गूगल मैप्स दिशा-निर्देश",
    "Quick Links": "त्वरित लिंक",
    "Programs & Tracks": "कार्यक्रम एवं ट्रैक",
    "Programs &amp; Tracks": "कार्यक्रम एवं ट्रैक",
    "Institute": "संस्थान",
    "Resources": "संसाधन",
    "Reach Us": "हमसे संपर्क करें",
    "Upcoming Workshops": "आगामी कार्यशालाएं",
    "Admissions Guide": "प्रवेश निर्देशिका",
    "Infrastructure & Labs": "बुनियादी ढांचा एवं प्रयोगशालाएं",
    "Infrastructure &amp; Labs": "बुनियादी ढांचा एवं प्रयोगशालाएं",
    "Privacy Policy": "गोपनीयता नीति",
    "Terms & Conditions": "नियम एवं शर्तें",
    "Terms &amp; Conditions": "नियम एवं शर्तें",
    "Terms": "नियम",
    "Cookies": "कुकीज़",
    "Sitemap": "साइटमैप",
    "All Rights Reserved": "सर्वाधिकार सुरक्षित",
    "All Rights Reserved.": "सर्वाधिकार सुरक्षित।",
    "© 2026 VetNova Learning Centre. All rights reserved.": "© 2026 वेटनोवा लर्निंग सेंटर। सर्वाधिकार सुरक्षित।",
    "Made with ❤️ for Veterinary Education": "पशु चिकित्सा शिक्षा के लिए ❤️ से निर्मित",
    "Made with for Veterinary Education": "पशु चिकित्सा शिक्षा के लिए निर्मित",
    "24/7 Trainee Helpline": "24/7 प्रशिक्षु हेल्पलाइन",
    "Mon - Sat: 9:00 AM - 6:00 PM": "सोम - शनि: सुबह 9:00 - शाम 6:00",
    "Hands-on Training": "व्यावहारिक प्रशिक्षण",
    "80%+ Tactile Lab Hours": "80%+ व्यावहारिक लैब घंटे",
    "Experienced Faculty": "अनुभवी संकाय",
    "Senior MVSc Surgeons": "वरिष्ठ एमवीएससी सर्जन",
    "Industry Credentials": "उद्योग साख",
    "Verified Course Certs": "सत्यापित पाठ्यक्रम प्रमाण पत्र",
    "Career Guidance": "करियर मार्गदर्शन",
    "1-on-1 Mentorship": "1-ऑन-1 मेंटरशिप",
    "Modern Infrastructure": "आधुनिक बुनियादी ढांचा",
    "3,000 sq. ft. Pune Campus": "3,000 वर्ग फुट पुणे परिसर",
    "Animal Welfare Focus": "पशु कल्याण प्राथमिकता",
    "Ethical Care Standards": "नैतिक देखभाल मानक",
    "Enquire Now": "पूछताछ करें",
    "Fill out the form below, and our academic counsellor will get in touch with you shortly.": "कृपया नीचे दिया गया फॉर्म भरें, हमारे शैक्षणिक परामर्शदाता शीघ्र ही आपसे संपर्क करेंगे।",
    "Full Name *": "पूरा नाम *",
    "Enter your full name": "अपना पूरा नाम दर्ज करें",
    "Phone Number *": "फ़ोन नंबर *",
    "Enter your number": "अपना नंबर दर्ज करें",
    "Enter contact number": "संपर्क नंबर दर्ज करें",
    "10-digit mobile number": "10-अंकों का मोबाइल नंबर",
    "Email Address *": "ईमेल पता *",
    "Enter your email address": "अपना ईमेल पता दर्ज करें",
    "Enter your email": "अपना ईमेल दर्ज करें",
    "What is your current profile? *": "आपका वर्तमान प्रोफ़ाइल क्या है? *",
    "Select your profile": "अपना प्रोफ़ाइल चुनें",
    "Early-Career Doctor (1-3 yrs experience)": "शुरुआती करियर डॉक्टर (1-3 वर्ष अनुभव)",
    "Experienced Doctor (5-10 yrs experience)": "अनुभवी डॉक्टर (5-10 वर्ष अनुभव)",
    "Final-Year Student": "अंतिम वर्ष के छात्र",
    "Recently Passed Graduate": "हाल ही में उत्तीर्ण स्नातक",
    "Pet Owner / Rescuer": "पालतू पशु पालक / बचावकर्ता",
    "Vet Nurse / Assistant": "वेट नर्स / सहायक",
    "Your Message (Optional)": "आपका संदेश (वैकल्पिक)",
    "Tell us about your learning goals...": "अपने सीखने के लक्ष्यों के बारे में बताएं...",
    "Submit Enquiry": "पूछताछ सबमिट करें",
    "Submitting Enquiry...": "पूछताछ सबमिट हो रही है...",
    "Submitting...": "सबमिट हो रहा है...",
    "Enquiry Submitted!": "पूछताछ सफलतापूर्वक सबमिट हुई!",
    "Thank you for reaching out. Our team will contact you shortly to guide you through the next steps.": "संपर्क करने के लिए धन्यवाद। हमारी टीम अगले कदमों में आपका मार्गदर्शन करने के लिए शीघ्र ही आपसे संपर्क करेगी।",
    "Close": "बंद करें",
    "VetNova Practical Training Institute Overview": "वेटनोवा व्यावहारिक प्रशिक्षण संस्थान अवलोकन",
    "Take a virtual tour of our 3,000 sq. ft. Wagholi Pune campus, surgical suite, and radiology setup.": "हमारे 3,000 वर्ग फुट वाघोली पुणे परिसर, सर्जिकल सुइट और रेडियोलॉजी सेटअप का वर्चुअल दौरा करें।",
    "PRACTICAL VETERINARY TRAINING": "व्यावहारिक पशु चिकित्सा प्रशिक्षण",
    "Bridge the Gap Between Veterinary Theory & Confident Practice": "पशु चिकित्सा सिद्धांत और व्यावहारिक आत्मविश्वास के बीच की दूरी मिटाएं",
    "Bridge the Gap Between Veterinary Theory &amp; Confident Practice": "पशु चिकित्सा सिद्धांत और व्यावहारिक आत्मविश्वास के बीच की दूरी मिटाएं",
    "Hands-on clinical training programs for veterinarians, veterinary nurses, and fresh graduates. Small batches, live cases, and expert mentorship at India's premier practical learning centre.": "पशु चिकित्सकों, वेट नर्सों और नए स्नातकों के लिए व्यावहारिक क्लिनिकल प्रशिक्षण कार्यक्रम। भारत के प्रमुख व्यावहारिक शिक्षण केंद्र में छोटे बैच, लाइव केस और विशेषज्ञ मार्गदर्शन।",
    "Explore Programs": "कार्यक्रम देखें",
    "Explore All Programs": "सभी कार्यक्रम देखें",
    "View All Programs": "सभी कार्यक्रम देखें",
    "80%+ Hands-on Clinical Lab Practice": "80%+ व्यावहारिक क्लिनिकल लैब अभ्यास",
    "1:8 Small Batch Mentor Ratio": "1:8 छोटा बैच मेंटर अनुपात",
    "100% Verified Skill Certification": "100% सत्यापित कौशल प्रमाणन",
    "500+ Vets Trained": "500+ प्रशिक्षित पशु चिकित्सक",
    "98% Clinical Confidence Rate": "98% क्लिनिकल आत्मविश्वास दर",
    "15+ Senior Faculty Mentors": "15+ वरिष्ठ संकाय मेंटर",
    "3,000 sq. ft. Practical Training Facility": "3,000 वर्ग फुट व्यावहारिक प्रशिक्षण सुविधा",
    "WHY VETNOVA": "वेटनोवा क्यों चुनें",
    "Designed for Real-World Clinical Mastery": "वास्तविक दुनिया की क्लिनिकल महारत के लिए डिज़ाइन किया गया",
    "Tactile Wet Labs": "व्यावहारिक वेट लैब्स",
    "Practice real surgical procedures, suturing techniques, and ultrasound scans under direct faculty supervision.": "प्रत्यक्ष संकाय पर्यवेक्षण में वास्तविक सर्जिकल प्रक्रियाओं, सिवनी तकनीकों और अल्ट्रासाउंड स्कैन का अभ्यास करें।",
    "Live Case Simulations": "लाइव केस सिमुलेशन",
    "Handle simulated emergency and critical care scenarios in our fully equipped ICU setup.": "हमारे पूरी तरह से सुसज्जित आईसीयू सेटअप में आपातकालीन और महत्वपूर्ण देखभाल परिदृश्यों को संभालें।",
    "Recognized Certification": "मान्यता प्राप्त प्रमाणन",
    "Receive skill competency certificates recognized by leading veterinary hospitals across India.": "पूरे भारत के प्रमुख पशु चिकित्सालयों द्वारा मान्यता प्राप्त कौशल क्षमता प्रमाण पत्र प्राप्त करें।",
    "Practical Training Batches": "व्यावहारिक प्रशिक्षण बैच",
    "Explore upcoming intakes and connect with us about ongoing practical training programs.": "आगामी प्रवेश सत्र देखें और चालू व्यावहारिक प्रशिक्षण कार्यक्रमों के बारे में हमसे जुड़ें।",
    "Upcoming Batches": "आगामी बैच",
    "Ongoing Batches": "चालू बैच",
    "Program Track": "कार्यक्रम ट्रैक",
    "Start Date": "प्रारंभ तिथि",
    "Duration": "अवधि",
    "Seat Status": "सीट स्थिति",
    "Action": "कार्रवाई",
    "Open (Few Seats)": "उपलब्ध (कुछ सीटें शेष)",
    "Open (Filling Fast)": "उपलब्ध (शीघ्र भर रहा है)",
    "Open": "उपलब्ध",
    "Closed": "समाप्त",
    "In Progress": "प्रगति पर है",
    "4 Weeks": "4 सप्ताह",
    "3 Days": "3 दिन",
    "1 Week": "1 सप्ताह",
    "2 Weeks": "2 सप्ताह",
    "6 Weeks": "6 सप्ताह",
    "Enquire": "पूछताछ करें",
    "Batch Code": "बैच कोड",
    "Current Phase": "वर्तमान चरण",
    "Next Intake": "अगला प्रवेश",
    "Hands-on Surgery Lab": "हैंड्स-ऑन सर्जरी लैब",
    "Clinical Rotations": "क्लिनिकल रोटेशन",
    "ICU Case Simulations": "आईसीयू केस सिमुलेशन",
    "Diagnostic Imaging": "डायग्नोस्टिक इमेजिंग",
    "Partnership Areas": "साझेदारी के क्षेत्र",
    "OUR INDUSTRY NETWORK": "हमारा उद्योग नेटवर्क",
    "COLLABORATION DOMAINS": "सहयोग क्षेत्र",
    "Trusted by leading veterinary hospitals, pharmaceutical companies, equipment manufacturers and academic institutions.": "अग्रणी पशु चिकित्सालयों, फार्मास्यूटिकल कंपनियों, उपकरण निर्माताओं और शैक्षणिक संस्थानों द्वारा विश्वसनीय।",
    "Hospital Partners": "अस्पताल भागीदार",
    "Equipment Partners": "उपकरण भागीदार",
    "Diagnostic Partners": "डायग्नोस्टिक भागीदार",
    "Academic Partners": "शैक्षणिक भागीदार",
    "Industry Partners": "उद्योग भागीदार",
    "Collaborating with veterinary industry leaders, pet-care businesses, pharmaceutical companies, and animal health organizations to strengthen practical training and career opportunities.": "व्यावहारिक प्रशिक्षण और करियर के अवसरों को मजबूत करने के लिए पशु चिकित्सा उद्योग के दिग्गजों, पेट-केयर व्यवसायों, फार्मास्यूटिकल कंपनियों और पशु स्वास्थ्य संगठनों के साथ सहयोग।",
    "Industry-led training initiatives": "उद्योग-आधारित प्रशिक्षण पहल",
    "Corporate collaborations and sponsorships": "कॉर्पोरेट सहयोग एवं प्रायोजन",
    "Career development and networking": "करियर विकास एवं नेटवर्किंग",
    "Pharmaceutical Leaders": "फार्मास्युटिकल लीडर्स",
    "Equipment Manufacturers": "उपकरण निर्माता",
    "Diagnostic Laboratories": "डायग्नोस्टिक प्रयोगशालाएं",
    "Partner Logo • coming soon": "पार्टनर लोगो • जल्द आ रहा है",
    "Partner With VetNova Learning Centre": "वेटनोवा लर्निंग सेंटर के साथ साझेदारी करें",
    "Explore partnership opportunities with VetNova to support practical veterinary education, clinical training, institutional collaboration, and professional development.": "व्यावहारिक पशु चिकित्सा शिक्षा, क्लिनिकल प्रशिक्षण, संस्थागत सहयोग और व्यावसायिक विकास के समर्थन हेतु वेटनोवा के साथ साझेदारी के अवसरों का अन्वेषण करें।",
    "Submit Partnership Enquiry": "साझेदारी पूछताछ भेजें",
    "Explore Domains": "सहयोग क्षेत्र देखें",
    "Explore Partnership Areas": "साझेदारी क्षेत्र देखें",
    "Key Partnership Opportunities": "साझेदारी के क्षेत्र",
    "VetNova collaborates across specialized veterinary domains to advance practical skill standards, clinical confidence, and professional education.": "वेटनोवा व्यावहारिक कौशल मानकों, क्लिनिकल आत्मविश्वास और व्यावसायिक शिक्षा को उन्नत करने के लिए विशेष पशु चिकित्सा डोमेन में सहयोग करता है।",
    "Hospital & Clinical Partners": "अस्पताल एवं क्लिनिकल साझेदार",
    "Hospital &amp; Clinical Partners": "अस्पताल एवं क्लिनिकल साझेदार",
    "Medical Equipment & Instrument Partners": "चिकित्सा उपकरण एवं औजार साझेदार",
    "Medical Equipment &amp; Instrument Partners": "चिकित्सा उपकरण एवं औजार साझेदार",
    "Diagnostic Laboratories & Pathology Partners": "डायग्नोस्टिक प्रयोगशालाएं एवं पैथोलॉजी साझेदार",
    "Diagnostic Laboratories &amp; Pathology Partners": "डायग्नोस्टिक प्रयोगशालाएं एवं पैथोलॉजी साझेदार",
    "Academic & Research Institutions": "शैक्षणिक एवं अनुसंधान संस्थान",
    "Academic &amp; Research Institutions": "शैक्षणिक एवं अनुसंधान संस्थान",
    "Animal Welfare NGOs & Community Partners": "पशु कल्याण एनजीओ एवं समुदाय साझेदार",
    "Animal Welfare NGOs &amp; Community Partners": "पशु कल्याण एनजीओ एवं समुदाय साझेदार",
    "Industry & Corporate Partners": "उद्योग एवं कॉर्पोरेट साझेदार",
    "Industry &amp; Corporate Partners": "उद्योग एवं कॉर्पोरेट साझेदार",
    "ENQUIRE NOW": "पूछताछ करें",
    "Partnership Enquiry": "साझेदारी पूछताछ",
    "Please fill out the form below to explore partnership possibilities with VetNova. Our leadership team will review your inquiry and connect with you shortly.": "वेटनोवा के साथ साझेदारी की संभावनाओं के लिए कृपया नीचे दिया गया फॉर्म भरें। हमारी टीम शीघ्र आपसे संपर्क करेगी।",
    "Full Name": "पूरा नाम",
    "Organization / Institution": "संगठन / संस्थान",
    "Email Address": "ईमेल पता",
    "Phone Number": "फ़ोन नंबर",
    "Organization Type": "संगठन का प्रकार",
    "Partnership Interest": "साझेदारी में रुचि",
    "Message / Collaboration Details": "संदेश / सहयोग विवरण",
    "Select Organization Type": "संगठन का प्रकार चुनें",
    "Select Partnership Interest": "साझेदारी का प्रकार चुनें",
    "Institutional Partnership": "संस्थागत साझेदारी",
    "Corporate Sponsorship": "कॉर्पोरेट प्रायोजन",
    "Academic Collaboration": "शैक्षणिक सहयोग",
    "Clinical / Training Collaboration": "क्लिनिकल / प्रशिक्षण सहयोग",
    "Other": "अन्य",
    "Veterinary Clinic / Hospital": "पशु चिकित्सालय / क्लिनिक",
    "Veterinary Clinic/Hospital": "पशु चिकित्सालय / क्लिनिक",
    "Academic Institution / University": "शैक्षणिक संस्थान / विश्वविद्यालय",
    "Academic Institution": "शैक्षणिक संस्थान / विश्वविद्यालय",
    "Medical Equipment Manufacturer": "चिकित्सा उपकरण निर्माता",
    "Pharmaceutical Company": "फार्मास्यूटिकल कंपनी",
    "Animal Welfare NGO / Shelter": "पशु कल्याण एनजीओ / शेल्टर",
    "NGO": "पशु कल्याण एनजीओ / शेल्टर",
    "About VetNova Learning Centre": "वेटनोवा लर्निंग सेंटर के बारे में",
    "Pioneering Practical Veterinary Education in India": "भारत में व्यावहारिक पशु चिकित्सा शिक्षा में अग्रणी",
    "Dedicated to elevating veterinary clinical standards through immersive hands-on training, cutting-edge facilities, and expert faculty mentorship.": "व्यावहारिक प्रशिक्षण, अत्याधुनिक सुविधाओं और विशेषज्ञ संकाय मार्गदर्शन के माध्यम से पशु चिकित्सा क्लिनिकल मानकों को ऊंचा उठाने के लिए समर्पित।",
    "Our Story": "हमारी कहानी",
    "Bridging the Clinical Gap": "क्लिनिकल खाई को पाटना",
    "VetNova was founded with a clear mission: to provide veterinary professionals with the tactile, real-world skills needed to excel in modern practice.": "वेटनोवा की स्थापना एक स्पष्ट मिशन के साथ की गई थी: पशु चिकित्सा पेशेवरों को आधुनिक अभ्यास में उत्कृष्टता प्राप्त करने के लिए आवश्यक व्यावहारिक कौशल प्रदान करना।",
    "Our Vision": "हमारा दृष्टिकोण",
    "To be India's premier veterinary learning institute, recognized globally for clinical excellence and compassionate animal care.": "क्लिनिकल उत्कृष्टता और दयालु पशु देखभाल के लिए विश्व स्तर पर मान्यता प्राप्त भारत का प्रमुख पशु चिकित्सा शिक्षण संस्थान बनना।",
    "Our Mission": "हमारा मिशन",
    "To empower veterinary graduates and practicing clinicians through rigorous hands-on training, modern diagnostic mastery, and ethical surgical standards.": "सख्त व्यावहारिक प्रशिक्षण, आधुनिक नैदानिक महारत और नैतिक सर्जिकल मानकों के माध्यम से पशु चिकित्सा स्नातकों और चिकित्सकों को सशक्त बनाना।",
    "Core Values": "मूल मूल्य",
    "Clinical Excellence": "क्लिनिकल उत्कृष्टता",
    "Hands-on Focus": "व्यावहारिक प्राथमिकता",
    "Compassionate Care": "करुणामय देखभाल",
    "Continuous Innovation": "निरंतर नवाचार",
    "Integrity & Ethics": "सत्यनिष्ठा एवं नैतिकता",
    "Integrity &amp; Ethics": "सत्यनिष्ठा एवं नैतिकता",
    "Distinguished Veterinary Leaders Guiding Our Vision": "हमारी दृष्टि का मार्गदर्शन करने वाले प्रतिष्ठित पशु चिकित्सा नेता",
    "Our advisory council brings decades of leadership in clinical medicine, surgery, academic research, and animal health administration.": "हमारी सलाहकार परिषद क्लिनिकल मेडिसिन, सर्जरी, शैक्षणिक अनुसंधान और पशु स्वास्थ्य प्रशासन में दशकों का नेतृत्व लाती है।",
    "3,000 sq. ft. Facility": "3,000 वर्ग फुट सुविधा",
    "Dedicated Wet Labs": "समर्पित वेट लैब्स",
    "Digital X-Ray & Ultrasound Suite": "डिजिटल एक्स-रे एवं अल्ट्रासाउंड सुइट",
    "Modular Classrooms": "मॉड्यूलर कक्षाएं",
    "Learn directly from senior clinical specialists, surgeons, and diagnosticians dedicated to building real-world veterinary confidence through hands-on tactile mentorship.": "हैंड्स-ऑन मेंटरशिप के माध्यम से वास्तविक पशु चिकित्सा आत्मविश्वास का निर्माण करने वाले वरिष्ठ क्लिनिकल विशेषज्ञों, सर्जनों और डायग्नोस्टिशियनों से सीधे सीखें।",
    "All Faculty": "सभी संकाय",
    "Surgery & Orthopedics": "सर्जरी एवं ऑर्थोपेडिक्स",
    "Surgery &amp; Orthopedics": "सर्जरी एवं ऑर्थोपेडिक्स",
    "Diagnostic Imaging & USG": "डायग्नोस्टिक इमेजिंग एवं यूएसजी",
    "Diagnostic Imaging &amp; USG": "डायग्नोस्टिक इमेजिंग एवं यूएसजी",
    "Internal Medicine": "इंटरनल मेडिसिन",
    "Veterinary Nursing": "वेटनरी नर्सिंग",
    "View Profile": "प्रोफ़ाइल देखें",
    "Close Profile": "प्रोफ़ाइल बंद करें",
    "Years Experience": "वर्षों का अनुभव",
    "Faculty Specialist": "संकाय विशेषज्ञ",
    "Senior Surgeon": "वरिष्ठ सर्जन",
    "Radiology Educator": "रेडियोलॉजी शिक्षक",
    "Critical Care Lead": "क्रिटिकल केयर लीड",
    "Want to Experience Our Faculty Mentorship First-Hand?": "क्या आप हमारे संकाय मार्गदर्शन का प्रत्यक्ष अनुभव करना चाहते हैं?",
    "Book a 1-on-1 academic counselling session or visit our Pune facility for a personal campus & lab walkthrough with our senior instructors.": "1-ऑन-1 शैक्षणिक परामर्श सत्र बुक करें या हमारे वरिष्ठ प्रशिक्षकों के साथ व्यक्तिगत कैंपस और लैब वॉकथ्रू के लिए हमारे पुणे परिसर में आएं।",
    "Clinical Training Programs": "क्लिनिकल प्रशिक्षण कार्यक्रम",
    "Comprehensive hands-on programs designed for veterinary graduates, practicing doctors, and veterinary nursing staff.": "पशु चिकित्सा स्नातकों, अभ्यास करने वाले डॉक्टरों और नर्सिंग स्टाफ के लिए डिज़ाइन किए गए व्यापक व्यावहारिक कार्यक्रम।",
    "Grade 1 — Basic": "ग्रेड 1 — बुनियादी",
    "Grade 2 — Intermediate": "ग्रेड 2 — मध्यवर्ती",
    "Grade 3 — Competitive": "ग्रेड 3 — प्रतियोगी",
    "Grade 4 — Advanced": "ग्रेड 4 — उन्नत",
    "Grade 5 — Pro": "ग्रेड 5 — पेशेवर (प्रो)",
    "Core surgical techniques, diagnostic imaging, and routine clinical procedures.": "मुख्य सर्जिकल तकनीक, डायग्नोस्टिक इमेजिंग और नियमित क्लिनिकल प्रक्रियाएं।",
    "Advanced procedural mastery, complex diagnostics, and critical care management.": "उन्नत प्रक्रियात्मक महारत, जटिल निदान और महत्वपूर्ण देखभाल प्रबंधन।",
    "Specialized surgical interventions, advanced ultrasound scanning, and ICU protocols.": "विशेष सर्जिकल हस्तक्षेप, उन्नत अल्ट्रासाउंड स्कैनिंग और आईसीयू प्रोटोकॉल।",
    "Master-level clinical leadership, complex soft tissue cases, and specialist certification.": "मास्टर-स्तरीय क्लिनिकल नेतृत्व, जटिल सॉफ्ट टिश्यू केस और विशेषज्ञ प्रमाणन।",
    "Select Grade 1": "ग्रेड 1 चुनें",
    "Select Grade 2": "ग्रेड 2 चुनें",
    "Select Grade 3": "ग्रेड 3 चुनें",
    "Select Grade 4": "ग्रेड 4 चुनें",
    "Select Grade 5": "ग्रेड 5 चुनें",
    "5 Specialized Tracks": "5 विशेष ट्रैक",
    "Search by keyword...": "कीवर्ड से खोजें...",
    "Filter by Track:": "ट्रैक के अनुसार फ़िल्टर करें:",
    "All Tracks": "सभी ट्रैक",
    "Fresh Graduates": "नए स्नातक",
    "Practicing Vets": "अभ्यास करने वाले पशु चिकित्सक",
    "Emergency Care": "आपातकालीन देखभाल",
    "Vet Nurse": "वेट नर्स",
    "View Program Details": "कार्यक्रम विवरण देखें",
    "Enroll Now": "अभी नामांकन करें",
    "Veterinary Skill-Up Program": "पशु चिकित्सा स्किल-अप कार्यक्रम",
    "Small Animal Soft Tissue Surgery Track": "लघु पशु कोमल ऊतक सर्जरी ट्रैक",
    "Small Animal Soft Tissue Surgery": "लघु पशु कोमल ऊतक सर्जरी",
    "Soft Tissue Surgery Track": "सॉफ्ट टिश्यू सर्जरी ट्रैक",
    "Radiology & Abdominal Ultrasound Masterclass": "रेडियोलॉजी एवं उदर अल्ट्रासाउंड मास्टरक्लास",
    "Radiology & Abdominal Ultrasound": "रेडियोलॉजी एवं उदर अल्ट्रासाउंड",
    "Radiology & Ultrasound": "रेडियोलॉजी एवं अल्ट्रासाउंड",
    "Radiology &amp; Ultrasound": "रेडियोलॉजी एवं अल्ट्रासाउंड",
    "Veterinary Emergency & Critical Care Workshop": "पशु चिकित्सा आपातकालीन एवं गहन चिकित्सा कार्यशाला",
    "Veterinary Emergency & Critical Care": "पशु चिकित्सा आपातकालीन एवं गहन चिकित्सा",
    "Emergency Medicine Track": "आपातकालीन चिकित्सा ट्रैक",
    "Veterinary Nurse & Technician Hands-on Programme": "वेट नर्स एवं तकनीशियन व्यावहारिक कार्यक्रम",
    "Veterinary Nurse & Technician Program": "वेट नर्स एवं तकनीशियन कार्यक्रम",
    "Veterinary Nurse Programme": "वेट नर्स कार्यक्रम",
    "Veterinary Nurse & Paravet Foundation": "वेट नर्स एवं पैरा-वेट फाउंडेशन",
    "Next Batch:": "अगला बैच:",
    "View Schedule": "शेड्यूल देखें",
    "Level": "स्तर",
    "Foundation to Intermediate": "बुनियादी से मध्यवर्ती",
    "Intermediate to Advanced": "मध्यवर्ती से उन्नत",
    "Advanced Specialization": "उन्नत विशेषज्ञता",
    "Location": "स्थान",
    "Wagholi, Pune Campus": "वाघोली, पुणे परिसर",
    "Pune Campus (Offline)": "पुणे परिसर (ऑफ़लाइन)",
    "🎓 Industry Certified": "🎓 उद्योग प्रमाणित",
    "👨‍⚕️ Specialist Faculty": "👨‍⚕️ विशेषज्ञ संकाय",
    "🩺 Live Surgical Practice": "🩺 लाइव सर्जिकल अभ्यास",
    "⭐ 4.9 Student Rating": "⭐ 4.9 छात्र रेटिंग",
    "Real-World Gap": "वास्तविक क्लिनिकल खाई",
    "The Clinical Reality Fresh Vets Face": "नए पशु चिकित्सकों के सामने क्लिनिकल वास्तविकता",
    "Why standard university lectures leave a gap between passing exams and running independent clinic shifts.": "मानक विश्वविद्यालय के व्याख्यान परीक्षा उत्तीर्ण करने और स्वतंत्र क्लिनिक चलाने के बीच एक अंतर क्यों छोड़ते हैं।",
    "From Textbook Theory to High-Stakes Surgery": "पाठ्यपुस्तक सिद्धांत से उच्च-दांव सर्जरी तक",
    "Graduating with a BVSc degree is a proud achievement. However, when stepping into private practice or emergency night shifts, many young doctors experience sudden surgical hesitation:": "बीवीएससी की डिग्री प्राप्त करना एक गर्व की बात है। हालांकि, निजी अभ्यास या आपातकालीन रात्रि पाली में कदम रखते समय, कई युवा डॉक्टर अचानक सर्जिकल झिझक का अनुभव करते हैं:",
    "Surgical Hesitation & Tremors": "सर्जिकल झिझक और कंपकंपी",
    "Surgical Hesitation &amp; Tremors": "सर्जिकल झिझक और कंपकंपी",
    "Lack of repetitive tactile muscle memory makes initial abdominal incisions and vessel ligations nerve-wracking.": "दोहराव वाली मांसपेशियों की स्मृति की कमी से प्रारंभिक पेट के चीरे और वाहिका बंधन तनावपूर्ण हो जाते हैं।",
    "Diagnostic Radiography Uncertainty": "डायग्नोस्टिक रेडियोग्राफी अनिश्चितता",
    "Struggling to confidently interpret subtle soft tissue opacities or abdominal ultrasound views under pressure.": "दबाव में सूक्ष्म कोमल ऊतक अपारदर्शिता या पेट के अल्ट्रासाउंड दृश्यों की आत्मविश्वास से व्याख्या करने में कठिनाई।",
    "Emergency Protocol Anxiety": "आपातकालीन प्रोटोकॉल चिंता",
    "Your Before → After Learning Journey": "आपकी पहले → बाद की शिक्षण यात्रा",
    "Your Practical Learning Journey": "आपकी व्यावहारिक शिक्षण यात्रा",
    "BEFORE": "पहले",
    "VETNOVA TRAINING": "वेटनोवा प्रशिक्षण",
    "AFTER": "बाद में",
    "What You'll Graduate Ready To Do": "स्नातक होने पर आप क्या करने के लिए तैयार होंगे",
    "Ready for Independent Clinical Practice?": "स्वतंत्र क्लिनिकल अभ्यास के लिए तैयार?",
    "Who Should Join": "किसे शामिल होना चाहिए",
    "Program Overview": "कार्यक्रम अवलोकन",
    "Curriculum Modules": "पाठ्यक्रम मॉड्यूल",
    "Learning Outcomes": "सीखने के परिणाम",
    "Hands-on Practice": "हैंड्स-ऑन अभ्यास",
    "Batch Schedules": "बैच शेड्यूल",
    "Faculty Mentors": "संकाय मेंटर",
    "Tuition & Admissions": "शुल्क एवं प्रवेश",
    "Trainee Feedback": "प्रशिक्षु प्रतिक्रिया",
    "Expand Your Skills": "अपने कौशल का विस्तार करें",
    "Related Programs & Workshops": "संबंधित कार्यक्रम एवं कार्यशालाएं",
    "Related Programs &amp; Workshops": "संबंधित कार्यक्रम एवं कार्यशालाएं",
    "Related Clinical Programs": "संबंधित क्लिनिकल कार्यक्रम",
    "Related Programs": "संबंधित कार्यक्रम",
    "Download Syllabus PDF": "सिलेबस पीडीएफ डाउनलोड करें",
    "Enquire for Next Batch": "अगले बैच के लिए पूछताछ करें",
    "Key Highlights": "मुख्य विशेषताएं",
    "Why Choose This Track": "यह ट्रैक क्यों चुनें",
    "Course Structure": "पाठ्यक्रम संरचना",
    "Program Details": "कार्यक्रम विवरण",
    "Our Blogs": "हमारे ब्लॉग",
    "Explore the latest insights, trends, tips, and expert advice to help you stay informed, perform better, and support your health and wellness journey.": "नवीनतम अंतर्दृष्टि, रुझान, सुझाव और विशेषज्ञ सलाह का अन्वेषण करें जो आपको सूचित रखने और सहायता करने में मदद करती हैं।",
    "Veterinary Knowledge Hub": "पशु चिकित्सा ज्ञान केंद्र",
    "FEATURED GUIDE": "विशेष रुप से प्रदर्शित गाइड",
    "Editor's Pick": "संपादक की पसंद",
    "TOPIC NAVIGATION": "विषय नेविगेशन",
    "Explore By Category": "श्रेणी के अनुसार देखें",
    "Filter clinical guides, surgical tutorials, and diagnostic resources by specialty topic.": "विशेषज्ञता विषय द्वारा क्लिनिकल गाइड, सर्जिकल ट्यूटोरियल और डायग्नोस्टिक संसाधन फ़िल्टर करें।",
    "All Articles": "सभी लेख",
    "Surgery": "सर्जरी",
    "Radiology & Imaging": "रेडियोलॉजी एवं इमेजिंग",
    "Clinical Skills": "क्लिनिकल कौशल",
    "Pet Care & Wellness": "पालतू जानवरों की देखभाल एवं कल्याण",
    "Vet Nurses": "वेट नर्स",
    "Career Advice": "करियर सलाह",
    "RECENT ARTICLES": "हाल के लेख",
    "Latest Knowledge Articles": "नवीनतम ज्ञान लेख",
    "Read Article": "लेख पढ़ें",
    "SURGICAL MASTERY": "सर्जिकल महारत",
    "RADIOLOGY": "रेडियोलॉजी",
    "EMERGENCY CARE": "आपातकालीन देखभाल",
    "Step-by-Step Soft Tissue Surgical Preparation & Aseptic Scrubbing Protocols": "चरण-दर-चरण कोमल ऊतक सर्जिकल तैयारी और सड़न रोकने वाले स्क्रबिंग प्रोटोकॉल",
    "Step-by-Step Soft Tissue Surgical Preparation &amp; Aseptic Scrubbing Protocols": "चरण-दर-चरण कोमल ऊतक सर्जिकल तैयारी और सड़न रोकने वाले स्क्रबिंग प्रोटोकॉल",
    "A comprehensive tactical guide for junior veterinary surgeons on sterile OR setup, instrument ergonomics, scrub mechanics, and patient draping to eliminate surgical site infection risks.": "सर्जिकल साइट संक्रमण जोखिमों को खत्म करने के लिए स्टेराइल ओटी सेटअप, उपकरण एर्गोनॉमिक्स, स्क्रब मैकेनिक्स और रोगी ड्रेपिंग पर कनिष्ठ पशु चिकित्सा सर्जनों के लिए एक व्यापक गाइड।",
    "Senior Veterinary Surgeon & Lead Faculty": "वरिष्ठ पशु चिकित्सा सर्जन एवं प्रमुख संकाय",
    "Senior Veterinary Surgeon &amp; Lead Faculty": "वरिष्ठ पशु चिकित्सा सर्जन एवं प्रमुख संकाय",
    "Diagnostic X-Ray Reading: Identifying Thoracic & Abdominal Lesions": "डायग्नोस्टिक एक्स-रे रीडिंग: थोरैसिक और पेट के घावों की पहचान",
    "Diagnostic X-Ray Reading: Identifying Thoracic &amp; Abdominal Lesions": "डायग्नोस्टिक एक्स-रे रीडिंग: थोरैसिक और पेट के घावों की पहचान",
    "Systematic approach to evaluating cardiomegaly, pulmonary opacities, and intestinal foreign bodies in small animal radiographs.": "छोटे जानवरों के रेडियोग्राफ़ में कार्डियोमेगाली, फुफ्फुसीय अपारदर्शिता और आंतों के विदेशी निकायों के मूल्यांकन के लिए व्यवस्थित दृष्टिकोण।",
    "Emergency Triage & Rapid Fluid Resuscitation Protocols": "आपातकालीन ट्राइएज और त्वरित द्रव पुनर्जीवन प्रोटोकॉल",
    "Emergency Triage &amp; Rapid Fluid Resuscitation Protocols": "आपातकालीन ट्राइएज और त्वरित द्रव पुनर्जीवन प्रोटोकॉल",
    "How to triage acute hypovolemic shock, toxic ingestion, and respiratory distress cases during emergency hospital admissions.": "आपातकालीन अस्पताल प्रवेश के दौरान तीव्र हाइपोवोलेमिक शॉक, विषाक्त अंतर्ग्रहण और श्वसन संकट के मामलों को कैसे ट्राइएज करें।",
    "Canine Ovariohysterectomy: Suture Selection & Vessel Ligation": "श्वान ओवेरियोहिस्टेरेक्टॉमी: सिवनी चयन और रक्त वाहिका बंधन",
    "Canine Ovariohysterectomy: Suture Selection &amp; Vessel Ligation": "श्वान ओवेरियोहिस्टेरेक्टॉमी: सिवनी चयन और रक्त वाहिका बंधन",
    "Detailed breakdown of pedicle ligation, friction knots, subcuticular closure patterns, and postoperative recovery monitoring.": "पेडिकल बंधाव, घर्षण गांठ, सबस्यूटिकुलर क्लोजर पैटर्न और पोस्टऑपरेटिव रिकवरी मॉनिटरिंग का विस्तृत विवरण।",
    "Ultrasound Probe Positioning for Abdominal AFAST Scans": "उदर AFAST स्कैन के लिए अल्ट्रासाउंड जांच स्थिति",
    "Mastering the 4 cardinal acoustic windows (diaphragmatico-hepatic, spleno-renal, cysto-colic, hepatorenal) to detect free abdominal fluid.": "मुक्त उदर द्रव का पता लगाने के लिए 4 प्रमुख ध्वनिक खिड़कियों (डायाफ्रामैटिको-हेपेटिक, स्प्लेनो-रीनल, सिस्टो-कोलिक, हेपेटोरेनल) में महारत हासिल करना।",
    "ADMISSIONS CONSULTATION": "प्रवेश परामर्श",
    "Response < 2 Hours": "प्रतिक्रिया < 2 घंटे",
    "Book Free Counselling Session": "निःशुल्क परामर्श सत्र बुक करें",
    "Select your profile below so we can tailor course guidance to your exact learning background.": "नीचे अपना प्रोफ़ाइल चुनें ताकि हम आपके सीखने के अनुसार पाठ्यक्रम मार्गदर्शन तैयार कर सकें।",
    "I am a... *": "मैं एक हूँ... *",
    "Practicing Vet": "अभ्यास करने वाले पशु चिकित्सक",
    "Fresh Grad / Intern": "नए स्नातक / इंटर्न",
    "Vet Nurse / Paravet": "वेट नर्स / पैरा-वेट",
    "Sponsor / Clinic Chain": "प्रायोजक / क्लिनिक श्रृंखला",
    "Academic / Institution": "शैक्षणिक / संस्थान",
    "Pet Parent": "पालतू पशु पालक / माता-पिता",
    "Course Catalogue & Prospectus": "पाठ्यक्रम सूची एवं विवरणिका",
    "Course Catalogue &amp; Prospectus": "पाठ्यक्रम सूची एवं विवरणिका",
    "Complete curriculum & batch schedules": "पूर्ण पाठ्यक्रम और बैच कार्यक्रम",
    "Complete curriculum &amp; batch schedules": "पूर्ण पाठ्यक्रम और बैच कार्यक्रम",
    "Download our official prospectus detailing wet lab hours, faculty credentials, and fee structures.": "वेट लैब घंटे, संकाय साख और शुल्क संरचना का विवरण देने वाला हमारा आधिकारिक प्रॉस्पेक्टस डाउनलोड करें।",
    "Preferred Training Period *": "पसंदीदा प्रशिक्षण अवधि *",
    "Select Preferred Timeline": "पसंदीदा समय-सीमा चुनें",
    "Next 1 month": "अगले 1 महीने में",
    "1–3 months": "1–3 महीने में",
    "Just exploring": "केवल जानकारी ले रहे हैं",
    "Course Interested In *": "रुचि का पाठ्यक्रम *",
    "Veterinary Skill-Up Program (Flagship)": "पशु चिकित्सा स्किल-अप कार्यक्रम (फ्लैगशिप)",
    "Pet Emergency Care & ICU Track": "पालतू पशु आपातकालीन देखभाल एवं आईसीयू ट्रैक",
    "Pet Emergency Care &amp; ICU Track": "पालतू पशु आपातकालीन देखभाल एवं आईसीयू ट्रैक",
    "Vet Nurse & Assistant Programme": "वेट नर्स एवं सहायक कार्यक्रम",
    "Vet Nurse &amp; Assistant Programme": "वेट नर्स एवं सहायक कार्यक्रम",
    "Clinical Experience": "क्लिनिकल अनुभव",
    "Final-Year Intern / Student": "अंतिम वर्ष इंटर्न / छात्र",
    "1–3 Years Practice": "1–3 वर्ष अभ्यास",
    "3–5 Years Practice": "3–5 वर्ष अभ्यास",
    "5+ Years Practice / Clinic Owner": "5+ वर्ष अभ्यास / क्लिनिक मालिक",
    "FAQ & Help Centre": "एफएक्यू एवं सहायता केंद्र",
    "FAQ &amp; Help Centre": "एफएक्यू एवं सहायता केंद्र",
    "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न",
    "Find answers to the most common questions about admissions, programs, practical lab training, certification, course fees, campus facilities, and student support.": "प्रवेश, कार्यक्रम, व्यावहारिक प्रयोगशाला प्रशिक्षण, प्रमाणन, पाठ्यक्रम शुल्क, परिसर सुविधाओं और छात्र सहायता के बारे में अक्सर पूछे जाने वाले प्रश्नों के उत्तर प्राप्त करें।",
    "HELP CATEGORIES": "सहायता श्रेणियां",
    "What Do You Need Help With?": "आपको किस सहायता की आवश्यकता है?",
    "Select a category below to jump directly to specific questions.": "विशिष्ट प्रश्नों पर जाने के लिए नीचे दी गई श्रेणी चुनें।",
    "Admissions": "प्रवेश",
    "Eligibility & requirements": "पात्रता एवं आवश्यकताएं",
    "Eligibility &amp; requirements": "पात्रता एवं आवश्यकताएं",
    "Curriculum & tracks": "पाठ्यक्रम एवं ट्रैक",
    "Curriculum &amp; tracks": "पाठ्यक्रम एवं ट्रैक",
    "Practical Labs": "व्यावहारिक प्रयोगशालाएं",
    "Hands-on wet lab training": "हैंड्स-ऑन वेट लैब प्रशिक्षण",
    "Certification": "प्रमाणन",
    "QR verification & credentials": "क्यूआर सत्यापन एवं साख",
    "QR verification &amp; credentials": "क्यूआर सत्यापन एवं साख",
    "Fees & Payment": "शुल्क एवं भुगतान",
    "Fees &amp; Payment": "शुल्क एवं भुगतान",
    "Tuition & installment options": "शिक्षण एवं किस्त विकल्प",
    "Tuition &amp; installment options": "शिक्षण एवं किस्त विकल्प",
    "Campus & Hostel": "परिसर एवं छात्रावास",
    "Campus &amp; Hostel": "परिसर एवं छात्रावास",
    "Accommodation & travel": "आवास एवं यात्रा",
    "Accommodation &amp; travel": "आवास एवं यात्रा",
    "INSTANT SEARCH": "त्वरित खोज",
    "Search The Help Centre": "सहायता केंद्र खोजें",
    "Search FAQs...": "अक्सर पूछे जाने वाले प्रश्न खोजें...",
    "What would you like to know? (e.g. fees, batch size, hostel, certificate)...": "आप क्या जानना चाहेंगे? (उदा. शुल्क, बैच आकार, हॉस्टल, प्रमाणपत्र)...",
    "What are the eligibility prerequisites for doctor programs?": "डॉक्टर कार्यक्रमों के लिए पात्रता शर्तें क्या हैं?",
    "Can final-year BVSc interns enroll before graduation?": "क्या अंतिम वर्ष के बीवीएससी इंटर्न स्नातक से पहले नामांकन कर सकते हैं?",
    "How do I reserve a seat in an upcoming batch?": "मैं आगामी बैच में सीट कैसे आरक्षित करूँ?",
    "How much time is spent on hands-on practical training?": "हैंड्स-ऑन व्यावहारिक प्रशिक्षण पर कितना समय बिताया जाता है?",
    "What is covered in the 4-week Veterinary Skill-Up Program?": "4-सप्ताह के पशु चिकित्सा स्किल-अप कार्यक्रम में क्या शामिल है?",
    "Are 0%-interest EMI options available for course fees?": "क्या पाठ्यक्रम शुल्क के लिए 0%-ब्याज ईएमआई विकल्प उपलब्ध हैं?",
    "Are surgical materials and instruments included in the fee?": "क्या सर्जिकल सामग्री और उपकरण शुल्क में शामिल हैं?",
    "Do I receive a verifiable certificate after completion?": "क्या मुझे पूरा होने के बाद एक सत्यापन योग्य प्रमाण पत्र मिलता है?",
    "Who can join VetNova programs?": "वेटनोवा कार्यक्रमों में कौन शामिल हो सकता है?",
    "Will I perform real clinical procedures hands-on?": "क्या मैं वास्तविक क्लिनिकल प्रक्रियाएं व्यावहारिक रूप से करूँगा?",
    "Are the programs online or offline?": "क्या कार्यक्रम ऑनलाइन हैं या ऑफ़लाइन?",
    "Can I visit the Wagholi, Pune campus before enrolling?": "क्या मैं नामांकन से पहले वाघोली, पुणे परिसर का दौरा कर सकता हूँ?",
    "What is the required dress code for practical surgical labs?": "व्यावहारिक सर्जिकल लैब के लिए आवश्यक ड्रेस कोड क्या है?",
    "Is accommodation assistance available for outstation doctors?": "क्या बाहर के डॉक्टरों के लिए आवास सहायता उपलब्ध है?",
    "Is accommodation assistance provided for outstation doctors?": "क्या बाहर के डॉक्टरों के लिए आवास सहायता प्रदान की जाती है?",
    "What is the batch size for practical sessions?": "व्यावहारिक सत्रों के लिए बैच का आकार क्या है?",
    "Are batch sizes limited during practical lab sessions?": "क्या व्यावहारिक लैब सत्रों के दौरान बैच का आकार सीमित है?",
    "Do trainees perform live surgical procedures?": "क्या प्रशिक्षु लाइव सर्जिकल प्रक्रियाएं करते हैं?",
    "Where is the training campus located?": "प्रशिक्षण परिसर कहाँ स्थित है?",
    "Do I need prior independent surgical experience to join?": "क्या शामिल होने के लिए पूर्व स्वतंत्र सर्जिकल अनुभव आवश्यक है?",
    "Are surgical instruments provided during the workshop?": "क्या कार्यशाला के दौरान सर्जिकल उपकरण प्रदान किए जाते हैं?",
    "Will we perform live surgical procedure observation?": "क्या हम लाइव सर्जिकल प्रक्रिया का अवलोकन करेंगे?",
    "Do I need to own an ultrasound machine to benefit from this course?": "क्या इस पाठ्यक्रम से लाभ उठाने के लिए मेरे पास अल्ट्रासाउंड मशीन होना आवश्यक है?",
    "What radiation safety measures are followed during X-ray practicals?": "एक्स-रे प्रैक्टिकल के दौरान किन विकिरण सुरक्षा उपायों का पालन किया जाता है?",
    "Will we learn cardiac echocardiography as well?": "क्या हम कार्डियक इकोकार्डियोग्राफी भी सीखेंगे?",
    "Is prior veterinary experience required to enroll?": "क्या नामांकन के लिए पूर्व पशु चिकित्सा अनुभव आवश्यक है?",
    "Does VetNova help with clinic job placements after completion?": "क्या वेटनोवा पूरा होने के बाद क्लिनिक नौकरी प्लेसमेंट में मदद करता है?",
    "What is the minimum education qualification needed?": "न्यूनतम शैक्षणिक योग्यता क्या आवश्यक है?",
    "How can animal welfare NGOs partner with VetNova?": "पशु कल्याण एनजीओ वेटनोवा के साथ कैसे साझेदारी कर सकते हैं?",
    "Can veterinary students volunteer for community health camps?": "क्या पशु चिकित्सा छात्र सामुदायिक स्वास्थ्य शिविरों के लिए स्वयंसेवा कर सकते हैं?",
    "Are pet first aid workshops open to pet parents?": "क्या पेट फर्स्ट एड कार्यशालाएं पालतू माता-पिता के लिए खुली हैं?",
    "VetNova Assistant": "वेटनोवा सहायक",
    "Online • Instant Support": "ऑनलाइन • त्वरित सहायता",
    "Which program is right for me?": "मेरे लिए कौन सा कार्यक्रम सही है?",
    "What programs do you offer?": "आप कौन से कार्यक्रम पेश करते हैं?",
    "What are the upcoming batches?": "आगामी बैच कौन से हैं?",
    "Who can apply?": "कौन आवेदन कर सकता है?",
    "What are the course fees?": "पाठ्यक्रम शुल्क क्या है?",
    "Tell me about VetNova faculty": "वेटनोवा संकाय के बारे में बताएं",
    "Where is VetNova located?": "वेटनोवा कहाँ स्थित है?",
    "Book a counselling session": "परामर्श सत्र बुक करें",
    "Type your question...": "अपना प्रश्न यहाँ लिखें...",
    "Ask VetNova": "वेटनोवा से पूछें",
    "Browse All Programs": "सभी कार्यक्रम देखें",
    "Meet Our Faculty": "हमारे संकाय से मिलें",
    "Partner With VetNova": "वेटनोवा के साथ साझेदारी करें",
    "Contact VetNova": "वेटनोवा से संपर्क करें",
    "View Veterinary Skill-Up": "पशु चिकित्सा स्किल-अप देखें",
    "Soft Tissue Surgery": "सॉफ्ट टिश्यू सर्जरी",
    "View Vet Nurse Programme": "वेट नर्स कार्यक्रम देखें",
    "Show Interest / Notify Me": "रुचि दर्ज करें / सूचित करें",
    "Get Directions (Google Maps)": "दिशा-निर्देश प्राप्त करें (गूगल मैप्स)",
    "Practical Infrastructure & Training Suites": "व्यावहारिक बुनियादी ढांचा एवं प्रशिक्षण सुइट्स",
    "Explore our 3,000 sq. ft. purpose-built veterinary learning centre in Wagholi, Pune.": "वाघोली, पुणे में हमारे 3,000 वर्ग फुट उद्देश्य-निर्मित पशु चिकित्सा शिक्षण केंद्र का अन्वेषण करें।",
    "Sterile Operating Suite": "स्टेराइल ऑपरेटिंग सुइट",
    "Simulation & Skill Lab": "सिमुलेशन एवं कौशल प्रयोगशाला",
    "Lecture & Discussion Theatre": "व्याख्यान एवं चर्चा थियेटर",
    "Our Commitment to Ethical Veterinary Training": "नैतिक पशु चिकित्सा प्रशिक्षण के प्रति हमारी प्रतिबद्धता",
    "Zero Harm Training Policy": "शून्य नुकसान प्रशिक्षण नीति",
    "Humane and ethical practices are at the heart of everything we do at VetNova.": "मानवीय और नैतिक प्रथाएं वेटनोवा में हमारे द्वारा किए जाने वाले हर काम के केंद्र में हैं।",
    "Learn More": "और जानें",
    "View Details": "विवरण देखें",
    "Read More": "आगे पढ़ें",
    "View All": "सभी देखें",
    "Search": "खोजें",
    "Search programs...": "कार्यक्रम खोजें...",
    "Back": "पीछे",
    "Submit": "सबमिट करें",
    "Vet Nurse Programme": "वेट नर्स कार्यक्रम",
    "Vet Nurse Foundation Certificate": "वेट नर्स फाउंडेशन प्रमाणपत्र",
    "Vet Nurse Foundation & Clinical Assistant Certificate": "वेट नर्स फाउंडेशन एवं क्लिनिकल असिस्टेंट प्रमाणपत्र",
    "Vet Nurse Foundation &amp; Clinical Assistant Certificate": "वेट नर्स फाउंडेशन एवं क्लिनिकल असिस्टेंट प्रमाणपत्र",
    "CLINICAL ASSISTANT PROGRAM": "क्लिनिकल सहायक कार्यक्रम",
    "Build high-demand veterinary nursing competencies through practical training in low-stress animal restraint, patient vital monitoring, operating theater preparation, IV drug administration, and hospital ward management.": "कम तनाव वाले पशु नियंत्रण, रोगी के महत्वपूर्ण संकेतों की निगरानी, ऑपरेशन थिएटर की तैयारी, आईवी दवा प्रशासन, और अस्पताल वार्ड प्रबंधन में व्यावहारिक प्रशिक्षण के माध्यम से उच्च मांग वाली पशु चिकित्सा नर्सिंग योग्यताएं बनाएं।",
    "Low-Stress Canine & Feline Restraint": "कम तनाव वाला श्वान एवं बिल्ली नियंत्रण",
    "Low-Stress Canine &amp; Feline Restraint": "कम तनाव वाला श्वान एवं बिल्ली नियंत्रण",
    "Patient Vital Signs & Anesthetic Monitoring": "रोगी के महत्वपूर्ण लक्षण एवं एनेस्थेटिक निगरानी",
    "Patient Vital Signs &amp; Anesthetic Monitoring": "रोगी के महत्वपूर्ण लक्षण एवं एनेस्थेटिक निगरानी",
    "Surgical Pack Autoclaving & OT Scrub Support": "सर्जिकल पैक ऑटोक्लेविंग एवं ओटी स्क्रब सहायता",
    "Surgical Pack Autoclaving &amp; OT Scrub Support": "सर्जिकल पैक ऑटोक्लेविंग एवं ओटी स्क्रब सहायता",
    "IV Catheter Assistance & Drug Administration": "आईवी कैथेटर सहायता एवं दवा प्रशासन",
    "IV Catheter Assistance &amp; Drug Administration": "आईवी कैथेटर सहायता एवं दवा प्रशासन",
    "Hospital Ward Hygiene & Record Management": "अस्पताल वार्ड स्वच्छता एवं रिकॉर्ड प्रबंधन",
    "Hospital Ward Hygiene &amp; Record Management": "अस्पताल वार्ड स्वच्छता एवं रिकॉर्ड प्रबंधन",
    "Low-Stress Handling": "कम तनाव वाली हैंडलिंग",
    "Senior Vet Mentors": "वरिष्ठ पशु चिकित्सक मार्गदर्शक",
    "OT Sterilization Prep": "ओटी नसबंदी की तैयारी",
    "4.9 Student Rating": "4.9 छात्र रेटिंग",
    "Foundation": "फाउंडेशन (बुनियादी)",
    "Training Format": "प्रशिक्षण प्रारूप",
    "Hands-on Clinical Support / Offline": "हैंड्स-ऑन क्लिनिकल सहायता / ऑफ़लाइन",
    "2 Weeks (60 Hours)": "2 सप्ताह (60 घंटे)",
    "The Skilled Paravet Shortage in Clinics": "क्लीनिकों में कुशल पैरा-वेट की कमी",
    "Hospital Need": "अस्पताल की आवश्यकता",
    "Why modern veterinary hospitals rely heavily on formally trained veterinary nurses for flawless clinical operations.": "आधुनिक पशु चिकित्सालय निर्दोष क्लिनिकल संचालन के लिए औपचारिक रूप से प्रशिक्षित पशु चिकित्सा नर्सों पर भारी निर्भर क्यों हैं।",
    "From Informal Assistance to Professional Clinical Nursing": "अनौपचारिक सहायता से पेशेवर क्लिनिकल नर्सिंग तक",
    "Veterinary doctors depend on skilled clinical nursing staff to manage patient care, operating theater preparation, and ward sanitization. Untrained clinic assistants face daily operational bottlenecks:": "पशु चिकित्सक रोगी की देखभाल, ऑपरेशन थिएटर की तैयारी और वार्ड स्वच्छता के प्रबंधन के लिए कुशल क्लिनिकल नर्सिंग स्टाफ पर निर्भर करते हैं। अप्रशिक्षित क्लिनिक सहायक दैनिक परिचालन बाधाओं का सामना करते हैं:",
    "Animal Restraint Trauma & Bites": "पशु नियंत्रण आघात एवं काटने की घटनाएं",
    "Animal Restraint Trauma &amp; Bites": "पशु नियंत्रण आघात एवं काटने की घटनाएं",
    "Improper restraint techniques cause patient fear, struggle, scratch injuries, and clinical delays during examination.": "अनुचित नियंत्रण तकनीक से रोगी में डर, संघर्ष, खरोंच की चोटें और परीक्षण के दौरान क्लिनिकल देरी होती है।",
    "Surgical Suite Sterilization Gaps": "सर्जिकल सुइट नसबंदी की कमियां",
    "Lack of formal training in autoclave operation, instrument pouching, surgical gowning, and OT tray prep.": "ऑटोक्लेव संचालन, उपकरण पाउचिंग, सर्जिकल गाउनिंग और ओटी ट्रे की तैयारी में औपचारिक प्रशिक्षण की कमी।",
    "Medication & Fluid Setup Errors": "दवा एवं तरल सेटअप त्रुटियां",
    "Medication &amp; Fluid Setup Errors": "दवा एवं तरल सेटअप त्रुटियां",
    "Difficulty calculating IV drip rates, preparing prescribed medications, or recording multiparameter vitals accurately.": "आईवी ड्रिप दरों की गणना करने, निर्धारित दवाओं को तैयार करने या मल्टीपैरामीटर महत्वपूर्ण संकेतों को सटीक रूप से रिकॉर्ड करने में कठिनाई।",
    "OUTCOME PATHWAY": "परिणाम मार्ग",
    "See your starting point and the practical clinical confidence you can expect to develop through the program.": "अपना शुरुआती बिंदु देखें और वह व्यावहारिक क्लिनिकल आत्मविश्वास जो आप कार्यक्रम के माध्यम से विकसित करने की उम्मीद कर सकते हैं।",
    "STARTING POINT": "शुरुआती बिंदु",
    "Informal clinic assistant knowledge with fear of animal bites during handling": "हैंडलिंग के दौरान जानवरों के काटने के डर के साथ अनौपचारिक क्लिनिक सहायक ज्ञान",
    "Uncertainty during surgical pack autoclaving & operating theater scrub prep": "सर्जिकल पैक ऑटोक्लेविंग और ऑपरेशन थिएटर स्क्रब तैयारी के दौरान अनिश्चितता",
    "Uncertainty during surgical pack autoclaving &amp; operating theater scrub prep": "सर्जिकल पैक ऑटोक्लेविंग और ऑपरेशन थिएटर स्क्रब तैयारी के दौरान अनिश्चितता",
    "Hesitation when assisting with IV catheter placement or monitoring patient vitals": "आईवी कैथेटर प्लेसमेंट में सहायता करने या रोगी के महत्वपूर्ण लक्षणों की निगरानी करते समय हिचकिचाहट",
    "Need for structured supervised practical training in hospital nursing protocols": "अस्पताल नर्सिंग प्रोटोकॉल में संरचित पर्यवेक्षित व्यावहारिक प्रशिक्षण की आवश्यकता",
    "PRACTICAL PHASES": "व्यावहारिक चरण",
    "60 hours of hands-on low-stress animal restraint & clinical nursing support": "60 घंटे का व्यावहारिक कम तनाव वाला पशु नियंत्रण एवं क्लिनिकल नर्सिंग सहायता",
    "60 hours of hands-on low-stress animal restraint &amp; clinical nursing support": "60 घंटे का व्यावहारिक कम तनाव वाला पशु नियंत्रण एवं क्लिनिकल नर्सिंग सहायता",
    "Repetitive surgical instrument tray preparation, autoclaving & OT scrub protocols": "सर्जिकल उपकरण ट्रे तैयार करने, ऑटोक्लेविंग और ओटी स्क्रब प्रोटोकॉल का बार-बार अभ्यास",
    "Repetitive surgical instrument tray preparation, autoclaving &amp; OT scrub protocols": "सर्जिकल उपकरण ट्रे तैयार करने, ऑटोक्लेविंग और ओटी स्क्रब प्रोटोकॉल का बार-बार अभ्यास",
    "Supervised IV catheter placement assistance & fluid rate calculation drills": "पर्यवेक्षित आईवी कैथेटर लगाने में सहायता और तरल दर गणना अभ्यास",
    "Supervised IV catheter placement assistance &amp; fluid rate calculation drills": "पर्यवेक्षित आईवी कैथेटर लगाने में सहायता और तरल दर गणना अभ्यास",
    "Hospital ward hygiene management, patient recovery care & record keeping": "अस्पताल वार्ड स्वच्छता प्रबंधन, रोगी स्वास्थ्य लाभ देखभाल और रिकॉर्ड रखना",
    "Hospital ward hygiene management, patient recovery care &amp; record keeping": "अस्पताल वार्ड स्वच्छता प्रबंधन, रोगी स्वास्थ्य लाभ देखभाल और रिकॉर्ड रखना",
    "DEVELOPED SKILLS": "विकसित कौशल",
    "Developed safe, low-stress animal handling & clinical assistant confidence": "सुरक्षित, कम तनाव वाली पशु हैंडलिंग और क्लिनिकल सहायक आत्मविश्वास विकसित हुआ",
    "Developed safe, low-stress animal handling &amp; clinical assistant confidence": "सुरक्षित, कम तनाव वाली पशु हैंडलिंग और क्लिनिकल सहायक आत्मविश्वास विकसित हुआ",
    "Greater understanding of full hospital nursing workflow & surgical team support": "पूर्ण अस्पताल नर्सिंग वर्कफ़्लो और सर्जिकल टीम सहायता की बेहतर समझ",
    "Greater understanding of full hospital nursing workflow &amp; surgical team support": "पूर्ण अस्पताल नर्सिंग वर्कफ़्लो और सर्जिकल टीम सहायता की बेहतर समझ",
    "Independent veterinary nurse assistant readiness under clinic standards": "क्लिनिक मानकों के तहत स्वतंत्र पशु चिकित्सा नर्स सहायक तत्परता",
    "Clearer next steps & nursing career progression roadmap": "स्पष्ट अगले कदम और नर्सिंग करियर प्रगति रोडमैप",
    "Clearer next steps &amp; nursing career progression roadmap": "स्पष्ट अगले कदम और नर्सिंग करियर प्रगति रोडमैप",
    "METHODOLOGY": "कार्यप्रणाली",
    "What your 2-week veterinary nursing learning experience actually looks like on campus.": "कैंपस में आपका 2-सप्ताह का पशु चिकित्सा नर्सिंग सीखने का अनुभव वास्तव में कैसा दिखता है।",
    "Learn": "सीखें",
    "Master low-stress canine & feline behavior cues, vital sign ranges, sterile OT prep principles, and clinic hygiene standards.": "कम तनाव वाले श्वान और बिल्ली के व्यवहार संकेत, महत्वपूर्ण संकेत सीमा, स्टेराइल ओटी तैयारी सिद्धांत और क्लिनिक स्वच्छता मानकों में महारत हासिल करें।",
    "Master low-stress canine &amp; feline behavior cues, vital sign ranges, sterile OT prep principles, and clinic hygiene standards.": "कम तनाव वाले श्वान और बिल्ली के व्यवहार संकेत, महत्वपूर्ण संकेत सीमा, स्टेराइल ओटी तैयारी सिद्धांत और क्लिनिक स्वच्छता मानकों में महारत हासिल करें।",
    "Practise": "अभ्यास करें",
    "Execute gentle towel wraps, muzzle placements, surgical pack autoclaving, and IV catheter assist drills on simulation models.": "सिमुलेशन मॉडल पर सौम्य तौलिया लपेटने, थूथन लगाने, सर्जिकल पैक ऑटोक्लेविंग और आईवी कैथेटर सहायता अभ्यास करें।",
    "Apply": "लागू करें",
    "Assist senior veterinarians during live outpatient examinations, surgical scrub prep, anesthetic monitoring, and patient recovery.": "लाइव ओपीडी परीक्षणों, सर्जिकल स्क्रब तैयारी, एनेस्थेटिक निगरानी और रोगी सुधार के दौरान वरिष्ठ पशु चिकित्सकों की सहायता करें।",
    "Demonstrate": "प्रदर्शित करें",
    "Validate your clinical assistant competency through practical nursing evaluations and earn your foundation certificate.": "व्यावहारिक नर्सिंग मूल्यांकन के माध्यम से अपनी क्लिनिकल सहायक योग्यता को सत्यापित करें और अपना फाउंडेशन प्रमाणपत्र अर्जित करें।",
    "Detailed Modules": "विस्तृत मॉड्यूल",
    "Course Curriculum": "पाठ्यक्रम",
    "Comprehensive 3-stage veterinary nursing curriculum covering animal restraint, operating room preparation, laboratory support, and ward care.": "पशु नियंत्रण, ऑपरेशन कक्ष की तैयारी, प्रयोगशाला सहायता और वार्ड देखभाल को कवर करने वाला व्यापक 3-चरणीय पशु चिकित्सा नर्सिंग पाठ्यक्रम।",
    "STAGE 1 • FOUNDATION": "चरण 1 • बुनियादी",
    "Animal Behavior, Low-Stress Restraint & Vital Sign Monitoring": "पशु व्यवहार, कम तनाव वाला नियंत्रण एवं महत्वपूर्ण संकेत निगरानी",
    "Animal Behavior, Low-Stress Restraint &amp; Vital Sign Monitoring": "पशु व्यवहार, कम तनाव वाला नियंत्रण एवं महत्वपूर्ण संकेत निगरानी",
    "Understanding canine/feline stress body language, Fear-Free handling, towel wraps, safe muzzle positioning, and accurate TPR recording.": "श्वान/बिल्ली के तनाव शारीरिक भाषा, फियर-फ्री हैंडलिंग, तौलिया लपेटना, सुरक्षित थूथन स्थिति और सटीक टीपीआर रिकॉर्डिंग को समझना।",
    "Recognizing stress signals, defensive body language, and feline postures": "तनाव के संकेतों, रक्षात्मक शारीरिक भाषा और बिल्ली के हाव-भाव को पहचानना",
    "Canine cephalic, saphenous, and jugular vein gentle restraint techniques": "श्वान सेफेलिक, सेफेनस और जुगुलर नस की सौम्य नियंत्रण तकनीक",
    "Feline burrito towel wrap, cat bag usage, and Elizabethan collar fitting": "बिल्ली बुरिटो तौलिया लपेटना, कैट बैग का उपयोग और एलिजाबेथन कॉलर फिटिंग",
    "Practical Lab: 15+ hours live animal handling and temperature, pulse, respiration (TPR) monitoring": "प्रैक्टिकल लैब: 15+ घंटे लाइव पशु हैंडलिंग और तापमान, पल्स, श्वसन (टीपीआर) निगरानी",
    "STAGE 2 • INTERMEDIATE": "चरण 2 • मध्यवर्ती",
    "Operating Theater Prep, Sterilization, Scrubbing & Medication Administration": "ऑपरेशन थियेटर की तैयारी, नसबंदी, स्क्रबिंग एवं दवा प्रशासन",
    "Operating Theater Prep, Sterilization, Scrubbing &amp; Medication Administration": "ऑपरेशन थियेटर की तैयारी, नसबंदी, स्क्रबिंग एवं दवा प्रशासन",
    "Mastering autoclave sterilization, instrument pack pouching, surgical site clipping/scrubbing, circulating nurse duties, and fluid math.": "ऑटोक्लेव नसबंदी, उपकरण पैक पाउचिंग, सर्जिकल साइट क्लिपिंग/स्क्रबिंग, सर्कुलेटिंग नर्स कर्तव्यों और तरल गणित में महारत।",
    "Autoclave operation, chemical indicator validation, and sterile pack shelf life": "ऑटोक्लेव संचालन, रासायनिक संकेतक सत्यापन और स्टेराइल पैक शेल्फ जीवन",
    "Patient surgical site preparation: clipping technique and antiseptic scrub protocols": "रोगी सर्जिकल साइट की तैयारी: क्लिपिंग तकनीक और एंटीसेप्टिक स्क्रब प्रोटोकॉल",
    "Circulating nurse role: opening sterile surgical packs and adjusting equipment": "सर्कुलेटिंग नर्स की भूमिका: स्टेराइल सर्जिकल पैक खोलना और उपकरण समायोजित करना",
    "IV fluid bag setup, infusion line priming, and drip rate (drops/min) calculations": "आईवी द्रव बैग सेटअप, इन्फ्यूजन लाइन प्राइमिंग और ड्रिप दर (बूंदें/मिनट) की गणना",
    "STAGE 3 • ADVANCED": "चरण 3 • उन्नत",
    "Inpatient Ward Management, Lab Testing Support & Emergency Triage Assistance": "इनपेशेंट वार्ड प्रबंधन, लैब परीक्षण सहायता एवं आपातकालीन ट्राइएज सहायता",
    "Inpatient Ward Management, Lab Testing Support &amp; Emergency Triage Assistance": "इनपेशेंट वार्ड प्रबंधन, लैब परीक्षण सहायता एवं आपातकालीन ट्राइएज सहायता",
    "Managing inpatient wards, biohazard isolation, blood/urine sample collection assistance, centrifuge operation, and emergency triage support.": "इनपेशेंट वार्ड प्रबंधन, बायोहाज़र्ड अलगाव, रक्त/मूत्र नमूना संग्रह सहायता, सेंट्रीफ्यूज संचालन और आपातकालीन ट्राइएज सहायता।",
    "Hospital kennel sanitization, biohazard waste disposal, and cross-contamination prevention": "अस्पताल केनेल स्वच्छता, बायोहाज़र्ड अपशिष्ट निपटान और क्रॉस-संदूषण की रोकथाम",
    "Inpatient monitoring logs: recording daily vital parameters, food/water intake, and medications": "इनपेशेंट निगरानी लॉग: दैनिक महत्वपूर्ण पैरामीटर, भोजन/पानी का सेवन और दवाएं रिकॉर्ड करना",
    "Sample collection support: blood collection tubes (EDTA, Serum) and urine strip testing": "नमूना संग्रह सहायता: रक्त संग्रह ट्यूब (ईडीटीए, सीरम) और मूत्र पट्टी परीक्षण",
    "Emergency triage assistance: crash cart kit preparation and oxygen support delivery": "आपातकालीन ट्राइएज सहायता: क्रैश कार्ट किट की तैयारी और ऑक्सीजन सहायता वितरण",
    "Learning Methodology": "शिक्षण कार्यप्रणाली",
    "Nursing Training Delivery": "नर्सिंग प्रशिक्षण वितरण",
    "Designed for fast-paced practical skill building with direct mentor guidance.": "प्रत्यक्ष मेंटर मार्गदर्शन के साथ तेज गति से व्यावहारिक कौशल निर्माण के लिए डिज़ाइन किया गया।",
    "100% Practical Facility": "100% व्यावहारिक सुविधा",
    "Equipped with dedicated clinical exam tables, autoclaves, and patient treatment wards.": "समर्पित क्लिनिकल परीक्षा टेबल, ऑटोक्लेव और रोगी उपचार वार्डों से सुसज्जित।",
    "Small Batch Learning": "छोटा बैच शिक्षण",
    "Strictly capped at 12 nursing trainees per batch for 1-on-1 instructor coaching.": "1-ऑन-1 प्रशिक्षक कोचिंग के लिए प्रति बैच 12 नर्सिंग प्रशिक्षुओं तक सीमित।",
    "60 Practical Hours": "60 व्यावहारिक घंटे",
    "80% of course time spent performing animal handling, OT prep, and vitals recording.": "पाठ्यक्रम का 80% समय पशु हैंडलिंग, ओटी तैयारी और महत्वपूर्ण संकेत रिकॉर्ड करने में बिताया जाता है।",
    "Job Placement Assistance": "नौकरी प्लेसमेंट सहायता",
    "Direct hiring connections with leading veterinary hospitals and clinics across India.": "भारत भर के प्रमुख पशु चिकित्सालयों और क्लीनिकों के साथ सीधा भर्ती संबंध।",
    "Target Audience": "लक्षित दर्शक",
    "Ideal for anyone aspiring to build a career in professional veterinary nursing and hospital care.": "पेशेवर पशु चिकित्सा नर्सिंग और अस्पताल देखभाल में करियर बनाने के इच्छुक किसी भी व्यक्ति के लिए आदर्श।",
    "Clinic Assistants & Paravets": "क्लिनिक सहायक एवं पैरा-वेट",
    "Clinic Assistants &amp; Paravets": "क्लिनिक सहायक एवं पैरा-वेट",
    "Formalize your hospital experience with recognized credentials and advanced nursing skills.": "मान्यता प्राप्त प्रमाणपत्रों और उन्नत नर्सिंग कौशलों के साथ अपने अस्पताल के अनुभव को औपचारिक बनाएं।",
    "Animal Care Aspirants": "पशु देखभाल आकांक्षी",
    "Start a rewarding career in veterinary healthcare with zero prior medical background required.": "शून्य पूर्व चिकित्सा पृष्ठभूमि की आवश्यकता के साथ पशु चिकित्सा स्वास्थ्य सेवा में एक पुरस्कृत करियर शुरू करें।",
    "Shelter & NGO Staff": "आश्रय एवं एनजीओ कर्मचारी",
    "Shelter &amp; NGO Staff": "आश्रय एवं एनजीओ कर्मचारी",
    "Upgrade animal rescue handling, wound care, and disease isolation protocols in shelter wards.": "आश्रय वार्डों में पशु बचाव हैंडलिंग, घाव की देखभाल और बीमारी अलगाव प्रोटोकॉल को अपग्रेड करें।",
    "Hospital Managers": "अस्पताल प्रबंधक",
    "Sponsor junior staff training to standardize hospital nursing protocols and hygiene standards.": "अस्पताल नर्सिंग प्रोटोकॉल और स्वच्छता मानकों को मानकीकृत करने के लिए कनिष्ठ कर्मचारियों के प्रशिक्षण को प्रायोजित करें।",
    "Verified Credential": "सत्यापित साख",
    "Recognized Nursing Certificate": "मान्यता प्राप्त नर्सिंग प्रमाणपत्र",
    "Upon successful completion of the 2-week course and practical nursing assessment, trainees receive an official VetNova Certificate of Achievement in Veterinary Nursing.": "2-सप्ताह के पाठ्यक्रम और व्यावहारिक नर्सिंग मूल्यांकन के सफल समापन पर, प्रशिक्षु पशु चिकित्सा नर्सिंग में उपलब्धि का आधिकारिक वेटनोवा प्रमाणपत्र प्राप्त करते हैं।",
    "60 Practical Training Hours": "60 व्यावहारिक प्रशिक्षण घंटे",
    "Validates hands-on restraint, OT prep, and ward hygiene hours.": "व्यावहारिक नियंत्रण, ओटी तैयारी और वार्ड स्वच्छता के घंटों को प्रमाणित करता है।",
    "Hiring Preference Across Vet Clinics": "पशु चिकित्सा क्लीनिकों में भर्ती प्राथमिकता",
    "Respected by veterinary hospital owners looking for trained paravet staff.": "प्रशिक्षित पैरा-वेट कर्मचारियों की तलाश कर रहे पशु चिकित्सालय मालिकों द्वारा सम्मानित।",
    "Digital Verifiable QR Code": "डिजिटल सत्यापन योग्य क्यूआर कोड",
    "Easily shareable on digital resumes and job application profiles.": "डिजिटल बायोडाटा और नौकरी आवेदन प्रोफाइल पर आसानी से साझा करने योग्य।",
    "Career Investment": "करियर निवेश",
    "Program Fee & Payment Options": "कार्यक्रम शुल्क एवं भुगतान विकल्प",
    "Program Fee &amp; Payment Options": "कार्यक्रम शुल्क एवं भुगतान विकल्प",
    "Affordable tuition fee. Includes all training scrubs, nursing manuals, and lab supplies.": "किफायती शिक्षण शुल्क। इसमें सभी प्रशिक्षण स्क्रब, नर्सिंग नियमावली और प्रयोगशाला आपूर्ति शामिल हैं।",
    "Batch Enrollment Open": "बैच नामांकन खुला है",
    "2-Week Offline Practical Nursing Module": "2-सप्ताह का ऑफ़लाइन व्यावहारिक नर्सिंग मॉड्यूल",
    "60 Hours hands-on clinical lab access": "60 घंटे व्यावहारिक क्लिनिकल लैब एक्सेस",
    "Complete nursing manual & scrub top included": "पूर्ण नर्सिंग मैनुअल एवं स्क्रब टॉप शामिल",
    "Complete nursing manual &amp; scrub top included": "पूर्ण नर्सिंग मैनुअल एवं स्क्रब टॉप शामिल",
    "1-on-1 Practical instructor feedback": "1-ऑन-1 व्यावहारिक प्रशिक्षक प्रतिक्रिया",
    "Verified course completion certificate": "सत्यापित पाठ्यक्रम पूर्णता प्रमाणपत्र",
    "Job placement assistance & referral support": "नौकरी प्लेसमेंट सहायता एवं रेफरल समर्थन",
    "Job placement assistance &amp; referral support": "नौकरी प्लेसमेंट सहायता एवं रेफरल समर्थन",
    "WhatsApp Enquiry": "व्हाट्सएप पूछताछ",
    "Upcoming batch not scheduled": "आगामी बैच अभी निर्धारित नहीं है",
    "Upcoming Practical Batches": "आगामी व्यावहारिक बैच",
    "Strictly capped at 12 participants per batch for hands-on mentor guidance.": "हैंड्स-ऑन मेंटर मार्गदर्शन के लिए प्रति बैच 12 प्रतिभागियों तक सीमित।",
    "ACTIVE SESSIONS": "सक्रिय सत्र",
    "No batch is currently running for this track.": "इस ट्रैक के लिए वर्तमान में कोई बैच नहीं चल रहा है।",
    "Show Interest": "रुचि दर्ज करें",
    "Notify Me": "मुझे सूचित करें",
    "Nursing Course FAQs": "नर्सिंग पाठ्यक्रम अक्सर पूछे जाने वाले प्रश्न",
    "Everything you need to know about prerequisites, job prospects, and campus facilities.": "पूर्वापेक्षाओं, नौकरी की संभावनाओं और परिसर की सुविधाओं के बारे में वह सब कुछ जो आपको जानना चाहिए।",
    "No prior medical experience is required. The course starts with basic animal behavior and safety before progressing to clinical tasks.": "किसी पूर्व चिकित्सा अनुभव की आवश्यकता नहीं है। पाठ्यक्रम क्लिनिकल कार्यों की ओर बढ़ने से पहले बुनियादी पशु व्यवहार और सुरक्षा से शुरू होता है।",
    "Yes, we connect successful graduates with our network of partner veterinary hospitals and private clinics across Pune, Mumbai, and major Indian cities.": "हाँ, हम सफल स्नातकों को पुणे, मुंबई और प्रमुख भारतीय शहरों में भागीदार पशु चिकित्सालयों और निजी क्लीनिकों के अपने नेटवर्क से जोड़ते हैं।",
    "Applicants must have completed 10+2 (Higher Secondary) with a passion for animal care and clinical learning.": "आवेदकों को 10+2 (उच्चतर माध्यमिक) उत्तीर्ण होना चाहिए और पशु देखभाल व क्लिनिकल सीखने के प्रति उत्साही होना चाहिए।",
    "Is accommodation assistance provided for outstation students?": "क्या बाहर के छात्रों के लिए आवास सहायता प्रदान की जाती है?",
    "Yes, we assist outstation students with recommended hostel and PG accommodation near our Wagholi, Pune campus.": "हाँ, हम बाहर के छात्रों को हमारे वाघोली, पुणे परिसर के पास अनुशंसित छात्रावास और पीजी आवास में सहायता करते हैं।",
    "Start Your Veterinary Nursing Career": "अपना पशु चिकित्सा नर्सिंग करियर शुरू करें",
    "Join the next Vet Nurse Foundation Certificate batch and gain hands-on clinical confidence in modern animal healthcare.": "अगले वेट नर्स फाउंडेशन प्रमाणपत्र बैच में शामिल हों और आधुनिक पशु स्वास्थ्य सेवा में व्यावहारिक क्लिनिकल आत्मविश्वास हासिल करें।",
    "Vet Parents": "पालतू माता-पिता (वेट पेरेंट्स)",
    "Vet Parent": "पालतू माता-पिता (वेट पेरेंट)",
    "Pet Parents": "पालतू माता-पिता (पेट पेरेंट्स)",
    "PET PARENT TRACK": "पेट पेरेंट ट्रैक",
    "Pet Parent Track": "पेट पेरेंट ट्रैक",
    "Pet Parent / Caregiver": "पालतू पशु पालक / देखभालकर्ता",
    "Designed for pet parents, rescuers, and animal lovers to stabilize pets during life-threatening emergencies.": "पालतू पशु पालकों, बचाव दल और पशु प्रेमियों के लिए आपात स्थितियों में पालतू जानवरों को स्थिर करने हेतु डिज़ाइन किया गया।",
    "Designed for pet parents, rescuers, and animal lovers to stabilize pets during life-threatening": "पालतू पशु पालकों, बचाव दल और पशु प्रेमियों के लिए आपात स्थिति में जानवरों को स्थिर करने हेतु तैयार",
    "Compassionate Care Beyond Clinical Excellence": "क्लिनिकल उत्कृष्टता से परे करुणामय देखभाल",
    "At VetNova, clinical training goes hand-in-hand with an unwavering commitment to animal welfare. We believe that true veterinary leadership starts with empathy, ethical clinical standards, and community healthcare outreach.": "वेटनोवा में, क्लिनिकल प्रशिक्षण पशु कल्याण के प्रति अटूट प्रतिबद्धता के साथ चलता है। हमारा मानना है कि सच्चा पशु चिकित्सा नेतृत्व सहानुभूति, नैतिक क्लिनिकल मानकों और सामुदायिक स्वास्थ्य पहुंच के साथ शुरू होता है।",
    "Explore Our Initiatives": "हमारी पहल देखें",
    "Contact Our Team": "हमारी टीम से संपर्क करें",
    "ETHICAL VETERINARY CARE": "नैतिक पशु चिकित्सा देखभाल",
    "Our Commitment to Animal Welfare": "पशु कल्याण के प्रति हमारी प्रतिबद्धता",
    "Veterinary medicine is not just about procedural dexterity—it is a moral calling to safeguard animal dignity, alleviate pain, and promote public awareness regarding humane pet stewardship.": "पशु चिकित्सा केवल प्रक्रियात्मक निपुणता के बारे में नहीं है - यह पशु गरिमा की रक्षा करने, दर्द को कम करने और मानवीय पालतू पशु पालन के संबंध में जन जागरूकता को बढ़ावा देने का एक नैतिक आह्वान है।",
    "Ethical Treatment & Pain Management": "नैतिक उपचार एवं दर्द प्रबंधन",
    "Ethical Treatment &amp; Pain Management": "नैतिक उपचार एवं दर्द प्रबंधन",
    "Prioritizing pre-emptive analgesia and gentle, fear-free patient handling during every diagnostic and surgical procedure.": "प्रत्येक नैदानिक और सर्जिकल प्रक्रिया के दौरान पूर्व-खाली एनाल्जेसिया और सौम्य, भय-मुक्त रोगी प्रबंधन को प्राथमिकता देना।",
    "Preventive Healthcare Protocols": "निवारक स्वास्थ्य देखभाल प्रोटोकॉल",
    "Promoting routine vaccination, parasite control, and early health screenings to prevent avoidable animal suffering.": "रोके जा सकने वाले पशु कष्टों को रोकने के लिए नियमित टीकाकरण, परजीवी नियंत्रण और प्रारंभिक स्वास्थ्य जांच को बढ़ावा देना।",
    "Welfare Education for Practitioners": "चिकित्सकों के लिए कल्याणकारी शिक्षा",
    "Integrating animal welfare science, bioethics, and legal standards into all VetNova clinical training modules.": "सभी वेटनोवा क्लिनिकल प्रशिक्षण मॉड्यूल में पशु कल्याण विज्ञान, जैव नैतिकता और कानूनी मानकों को एकीकृत करना।",
    "Community Outreach & Rescue Support": "सामुदायिक आउटरीच एवं बचाव सहायता",
    "Community Outreach &amp; Rescue Support": "सामुदायिक आउटरीच एवं बचाव सहायता",
    "Partnering with local animal welfare NGOs, shelters, and rescuers to provide free health camps and emergency treatment.": "निःशुल्क स्वास्थ्य शिविर और आपातकालीन उपचार प्रदान करने के लिए स्थानीय पशु कल्याण गैर सरकारी संगठनों, आश्रयों और बचाव दल के साथ साझेदारी करना।",
    "CORE PRINCIPLES": "मूल सिद्धांत",
    "Animal Welfare Pillars": "पशु कल्याण के स्तंभ",
    "Six foundational pillars guiding every workshop, health camp, and clinical program at VetNova.": "वेटनोवा में प्रत्येक कार्यशाला, स्वास्थ्य शिविर और क्लिनिकल कार्यक्रम का मार्गदर्शन करने वाले छह मूलभूत स्तंभ।",
    "Standardizing fear-free restraint, gentle patient handling, and minimal-stress environment protocols across hospital practices.": "अस्पताल प्रथाओं में भय-मुक्त नियंत्रण, सौम्य रोगी प्रबंधन और न्यूनतम-तनाव पर्यावरण प्रोटोकॉल का मानकीकरण करना।",
    "Preventive Medicine": "निवारक चिकित्सा",
    "Advocating comprehensive rabies eradication, core vaccination schedules, and early disease detection to safeguard community health.": "सामुदायिक स्वास्थ्य की रक्षा के लिए व्यापक रेबीज उन्मूलन, मुख्य टीकाकरण कार्यक्रम और प्रारंभिक बीमारी का पता लगाने की वकालत करना।",
    "Rescue & Rehabilitation": "बचाव एवं पुनर्वास",
    "Rescue &amp; Rehabilitation": "बचाव एवं पुनर्वास",
    "Providing pro-bono surgical care, emergency triage support, and wound management for stray and rescued animals in need.": "जरूरतमंद आवारा और बचाए गए जानवरों के लिए प्रो-बोनो सर्जिकल देखभाल, आपातकालीन ट्राइएज सहायता और घाव प्रबंधन प्रदान करना।",
    "Responsible Pet Ownership": "जिम्मेदार पालतू स्वामित्व",
    "Educating pet parents on balanced nutrition, exercise, dental care, and behavioral understanding for long-term pet wellbeing.": "पालतू जानवरों की दीर्घकालिक भलाई के लिए संतुलित पोषण, व्यायाम, दंत चिकित्सा देखभाल और व्यवहार संबंधी समझ पर पालतू पशु पालकों को शिक्षित करना।",
    "Community Awareness": "सामुदायिक जागरूकता",
    "Conducting public workshops, school awareness programs, and anti-rabies drives to build empathetic, animal-friendly neighborhoods.": "सहानुभूतिपूर्ण, पशु-अनुकूल पड़ोस बनाने के लिए सार्वजनिक कार्यशालाएं, स्कूल जागरूकता कार्यक्रम और एंटी-रेबीज अभियान आयोजित करना।",
    "Ethical Veterinary Practice": "नैतिक पशु चिकित्सा अभ्यास",
    "Upholding veterinary bioethics, informed consent, transparent client counseling, and continuous professional development standards.": "पशु चिकित्सा जैव नैतिकता, सूचित सहमति, पारदर्शी ग्राहक परामर्श और निरंतर व्यावसायिक विकास मानकों को बनाए रखना।",
    "COMMUNITY IMPACT": "सामुदायिक प्रभाव",
    "Creating Healthier Communities Through Animal Welfare": "पशु कल्याण के माध्यम से स्वस्थ समुदायों का निर्माण",
    "Every initiative combines veterinary expertise, education, preventive healthcare, and compassionate outreach to improve the lives of animals and the communities that care for them.": "प्रत्येक पहल जानवरों और उनकी देखभाल करने वाले समुदायों के जीवन को बेहतर बनाने के लिए पशु चिकित्सा विशेषज्ञता, शिक्षा, निवारक स्वास्थ्य देखभाल और करुणामय आउटरीच को जोड़ती है।",
    "FLAGSHIP IMPACT": "फ्लैगशिप प्रभाव",
    "GRASSROOTS HEALTH OUTREACH": "जमीनी स्वास्थ्य आउटरीच",
    "Bridging Veterinary Expertise & Community Care": "पशु चिकित्सा विशेषज्ञता एवं सामुदायिक देखभाल को जोड़ना",
    "Bridging Veterinary Expertise &amp; Community Care": "पशु चिकित्सा विशेषज्ञता एवं सामुदायिक देखभाल को जोड़ना",
    "Our outreach program mobilizes senior veterinary specialists, interns, and emergency care units to underserved communities, delivering free diagnostic screening, rabies vaccinations, and livestock health management.": "हमारा आउटरीच कार्यक्रम वरिष्ठ पशु चिकित्सा विशेषज्ञों, इंटर्न और आपातकालीन देखभाल इकाइयों को वंचित समुदायों में जुटाता है, जो मुफ्त नैदानिक जांच, रेबीज टीकाकरण और पशुधन स्वास्थ्य प्रबंधन प्रदान करता है।",
    "Animals Reached": "पहुंचे गए पशु",
    "Community Camps": "सामुदायिक शिविर",
    "Partner NGOs": "भागीदार एनजीओ",
    "Years Outreach": "वर्षों का आउटरीच",
    "Join Our Outreach": "हमारे आउटरीच से जुड़ें",
    "PUBLIC HEALTH": "सार्वजनिक स्वास्थ्य",
    "Free Rabies Vaccination Drives": "निःशुल्क रेबीज टीकाकरण अभियान",
    "Organizing annual mass anti-rabies vaccination camps in partnership with municipal bodies and local animal welfare groups across Pune.": "पुणे भर में नगरपालिका निकायों और स्थानीय पशु कल्याण समूहों के साथ साझेदारी में वार्षिक सामूहिक एंटी-रेबीज टीकाकरण शिविर आयोजित करना।",
    "Free Anti-Rabies Vaccination": "निःशुल्क एंटी-रेबीज टीकाकरण",
    "Community Stray Health Triage": "सामुदायिक आवारा पशु स्वास्थ्य ट्राइएज",
    "Public Safety & Zoonosis Awareness": "सार्वजनिक सुरक्षा एवं जूनोसिस जागरूकता",
    "Public Safety &amp; Zoonosis Awareness": "सार्वजनिक सुरक्षा एवं जूनोसिस जागरूकता",
    "RURAL CARE": "ग्रामीण देखभाल",
    "Rural Animal Health Camps": "ग्रामीण पशु स्वास्थ्य शिविर",
    "Deploying mobile veterinary teams to rural areas to conduct health checkups, deworming drives, and livestock management counseling.": "स्वास्थ्य जांच, कृमि मुक्ति अभियान और पशुधन प्रबंधन परामर्श आयोजित करने के लिए ग्रामीण क्षेत्रों में मोबाइल पशु चिकित्सा टीमों को तैनात करना।",
    "Mobile Veterinary Units": "मोबाइल पशु चिकित्सा इकाइयाँ",
    "Deworming & Nutritional Support": "कृमि मुक्ति एवं पोषण सहायता",
    "Deworming &amp; Nutritional Support": "कृमि मुक्ति एवं पोषण सहायता",
    "Farmer Clinical Guidance": "किसान क्लिनिकल मार्गदर्शन",
    "EMERGENCY RESPONSE": "आपातकालीन प्रतिक्रिया",
    "Rescue Surgical Support": "बचाव सर्जिकल सहायता",
    "Offering subsidised and pro-bono soft tissue surgeries for injured stray animals brought in by registered animal shelters and rescuers.": "पंजीकृत पशु आश्रयों और बचाव दल द्वारा लाए गए घायल आवारा जानवरों के लिए रियायती और प्रो-बोनो सॉफ्ट टिश्यू सर्जरी की पेशकश।",
    "Pro-Bono Soft Tissue Surgery": "प्रो-बोनो सॉफ्ट टिश्यू सर्जरी",
    "Trauma & Wound Management": "आघात एवं घाव प्रबंधन",
    "Trauma &amp; Wound Management": "आघात एवं घाव प्रबंधन",
    "Post-Operative Shelter Recovery": "ऑपरेशन के बाद आश्रय सुधार",
    "PET EDUCATION": "पालतू शिक्षा",
    "Pet First Aid Workshops": "पेट फर्स्ट एड कार्यशालाएं",
    "Hosting free weekend workshops for pet owners to learn life-saving emergency stabilization techniques before reaching vet clinics.": "पशु चिकित्सा क्लीनिक पहुंचने से पहले जीवन रक्षक आपातकालीन स्थिरीकरण तकनीक सीखने के लिए पालतू पशु मालिकों के लिए मुफ्त सप्ताहांत कार्यशालाएं आयोजित करना।",
    "Emergency Triage Skills": "आपातकालीन ट्राइएज कौशल",
    "Choking & CPR Simulation": "चोकिंग एवं सीपीआर सिमुलेशन",
    "Choking &amp; CPR Simulation": "चोकिंग एवं सीपीआर सिमुलेशन",
    "Pet Owner First Aid Certification": "पालतू मालिक प्राथमिक चिकित्सा प्रमाणन",
    "Animals Helped": "मदद किए गए पशु",
    "Outreach Camps": "आउटरीच शिविर",
    "Volunteer Veterinarians": "स्वयंसेवी पशु चिकित्सक",
    "Community Partners": "सामुदायिक भागीदार",
    "Become Part of the Change": "परिवर्तन का हिस्सा बनें",
    "Whether you're a veterinary student, doctor, NGO, or volunteer, help us create healthier communities for animals.": "चाहे आप पशु चिकित्सा छात्र हों, डॉक्टर हों, एनजीओ हों, या स्वयंसेवक हों, जानवरों के लिए स्वस्थ समुदाय बनाने में हमारी मदद करें।",
    "Become a Volunteer": "स्वयंसेवक बनें",
    "KNOWLEDGE DISSEMINATION": "ज्ञान प्रसार",
    "Education & Welfare Awareness": "शिक्षा एवं कल्याण जागरूकता",
    "Education &amp; Welfare Awareness": "शिक्षा एवं कल्याण जागरूकता",
    "Empowering pet parents and community members with scientific, compassionate guidance to create safer environments for companion animals.": "साथी जानवरों के लिए सुरक्षित वातावरण बनाने हेतु वैज्ञानिक, करुणामय मार्गदर्शन के साथ पालतू माता-पिता और समुदाय के सदस्यों को सशक्त बनाना।",
    "Pet Care & First Aid Education": "पालतू जानवरों की देखभाल एवं प्राथमिक चिकित्सा शिक्षा",
    "Pet Care &amp; First Aid Education": "पालतू जानवरों की देखभाल एवं प्राथमिक चिकित्सा शिक्षा",
    "Recognizing early signs of illness, heat stroke prevention, and emergency home stabilization.": "बीमारी के शुरुआती लक्षणों को पहचानना, हीट स्ट्रोक की रोकथाम और आपातकालीन घरेलू स्थिरीकरण।",
    "Nutrition & Preventive Health Guidance": "पोषण एवं निवारक स्वास्थ्य मार्गदर्शन",
    "Nutrition &amp; Preventive Health Guidance": "पोषण एवं निवारक स्वास्थ्य मार्गदर्शन",
    "Customized dietary advice, parasite prevention, and routine health checkup schedules.": "अनुकूलित आहार सलाह, परजीवी रोकथाम, और नियमित स्वास्थ्य जांच कार्यक्रम।",
    "Behavioral Understanding & Training": "व्यवहार संबंधी समझ एवं प्रशिक्षण",
    "Behavioral Understanding &amp; Training": "व्यवहार संबंधी समझ एवं प्रशिक्षण",
    "Positive reinforcement techniques, anxiety reduction, and humane social enrichment strategies.": "सकारात्मक सुदृढ़ीकरण तकनीक, चिंता में कमी, और मानवीय सामाजिक संवर्धन रणनीतियां।",
    "FIELD MOMENTS": "फील्ड के क्षण",
    "Welfare In Action": "कल्याण कार्य में",
    "Glance through photos from our recent vaccination drives, health camps, and clinical training sessions.": "हमारे हालिया टीकाकरण अभियानों, स्वास्थ्य शिविरों और क्लिनिकल प्रशिक्षण सत्रों की तस्वीरों पर एक नज़र डालें।",
    "Free Vaccination Camp": "निःशुल्क टीकाकरण शिविर",
    "Rescue Surgical Care": "बचाव सर्जिकल देखभाल",
    "Pet First Aid Workshop": "पेट फर्स्ट एड कार्यशाला",
    "Community Awareness Program": "सामुदायिक जागरूकता कार्यक्रम",
    "View Complete Gallery": "पूरी गैलरी देखें",
    "COMMON INQUIRIES": "सामान्य पूछताछ",
    "Welfare FAQs": "कल्याण अक्सर पूछे जाने वाले प्रश्न",
    "Questions regarding community drives, NGO partnerships, and volunteering opportunities.": "सामुदायिक अभियानों, एनजीओ साझेदारी और स्वयंसेवा के अवसरों के संबंध में प्रश्न।",
    "Registered animal welfare organizations can reach out via our contact form to request pro-bono surgical support, joint vaccination drives, or shelter staff training sessions.": "पंजीकृत पशु कल्याण संगठन प्रो-बोनो सर्जिकल सहायता, संयुक्त टीकाकरण अभियान या आश्रय कर्मचारियों के प्रशिक्षण सत्रों का अनुरोध करने के लिए हमारे संपर्क फॉर्म के माध्यम से संपर्क कर सकते हैं।",
    "Yes! Final-year BVSc interns and veterinary students are welcome to participate as clinical volunteers during our rural health camps and vaccination drives under expert guidance.": "हाँ! अंतिम वर्ष के बीवीएससी इंटर्न और पशु चिकित्सा छात्रों का विशेषज्ञ मार्गदर्शन में हमारे ग्रामीण स्वास्थ्य शिविरों और टीकाकरण अभियानों के दौरान क्लिनिकल स्वयंसेवकों के रूप में भाग लेने के लिए स्वागत है।",
    "Yes, our Pet First Aid & Emergency Response workshops are specifically tailored for pet parents, animal rescuers, and foster parents with zero prior medical background required.": "हाँ, हमारी पेट फर्स्ट एड और इमरजेंसी रिस्पॉन्स कार्यशालाएं विशेष रूप से पालतू माता-पिता, पशु बचाव दल और पालक माता-पिता के लिए तैयार की गई हैं, जिसमें किसी पूर्व चिकित्सा पृष्ठभूमि की आवश्यकता नहीं है।",
    "Join Us in Building a Better Future for Animal Welfare": "पशु कल्याण के बेहतर भविष्य के निर्माण में हमारे साथ जुड़ें",
    "Whether you are a veterinary professional, NGO representative, or passionate pet parent, partner with VetNova to elevate animal care standards.": "चाहे आप एक पशु चिकित्सा पेशेवर हों, एनजीओ प्रतिनिधि हों, या उत्साही पालतू माता-पिता हों, पशु देखभाल मानकों को ऊपर उठाने के लिए वेटनोवा के साथ साझेदारी करें।",
    "Select Your Profile": "अपनी प्रोफ़ाइल चुनें",
    "Veterinary Nurse / Paravet": "पशु चिकित्सा नर्स / पैरा-वेट",
    "Clinic Assistant": "क्लिनिक सहायक",
    "Shelter Worker / Rescuer": "आश्रय कार्यकर्ता / पशु बचावकर्ता",
    "Pet Emergency & Critical Care": "पालतू आपातकालीन एवं गहन चिकित्सा",
    "Pet Emergency &amp; Critical Care": "पालतू आपातकालीन एवं गहन चिकित्सा",
    "Your Name": "आपका नाम",
    "Select Program of Interest": "रुचि का कार्यक्रम चुनें",
    "Your Clinical Experience or Background": "आपका क्लिनिकल अनुभव या पृष्ठभूमि",
    "Message or Specific Questions": "संदेश या विशिष्ट प्रश्न",
    "Send Inquiry": "पूछताछ भेजें",
    "Get In Touch": "संपर्क करें",
    "Faculty Mentor": "संकाय मार्गदर्शक",
    "Current Status": "वर्तमान स्थिति",
    "Batch Dates": "बैच की तारीखें",
    "Dates Announced Soon": "तारीखों की घोषणा जल्द",
    "In Session": "सत्र जारी है"
  };

  let currentLang = DEFAULT_LANG;
  let isTranslating = false;
  let observer = null;

  // Retrieve stored language or default to English
  function getSavedLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'hi' || saved === 'en') {
        return saved;
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for language preference', e);
    }

    // Check cookie fallback
    try {
      const match = document.cookie.match(/(?:^|; )vetnova_lang=([^;]*)/);
      if (match && (match[1] === 'hi' || match[1] === 'en')) {
        return match[1];
      }
    } catch (e) {
      // Ignore
    }

    return DEFAULT_LANG;
  }

  // Update switcher UI toggle buttons across all header / drawer instances
  function updateSwitcherUI(lang) {
    const switchers = document.querySelectorAll('.lang-switcher');
    switchers.forEach(switcher => {
      const enBtn = switcher.querySelector('[data-lang="en"]');
      const hiBtn = switcher.querySelector('[data-lang="hi"]');
      if (enBtn && hiBtn) {
        if (lang === 'hi') {
          enBtn.classList.remove('active');
          enBtn.setAttribute('aria-pressed', 'false');
          hiBtn.classList.add('active');
          hiBtn.setAttribute('aria-pressed', 'true');
        } else {
          hiBtn.classList.remove('active');
          hiBtn.setAttribute('aria-pressed', 'false');
          enBtn.classList.add('active');
          enBtn.setAttribute('aria-pressed', 'true');
        }
      }
    });
  }

  // Check if an element should be skipped during translation
  function shouldSkipElement(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
    const tagName = el.tagName.toUpperCase();
    if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'NOSCRIPT' || tagName === 'IFRAME' || tagName === 'CODE') {
      return true;
    }
    if (el.classList && (
      el.classList.contains('lang-switcher') ||
      el.classList.contains('lang-btn') ||
      el.classList.contains('notranslate') ||
      el.classList.contains('fa') ||
      el.classList.contains('fas') ||
      el.classList.contains('far') ||
      el.classList.contains('fa-solid') ||
      el.classList.contains('fa-regular') ||
      el.classList.contains('fa-brands')
    )) {
      return true;
    }
    if (el.hasAttribute('data-no-translate')) {
      return true;
    }
    return false;
  }

  // Normalize string for fuzzy matching (collapse internal spaces and entity variations)
  function normalizeKey(str) {
    if (!str) return '';
    return str
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Translate a single text string using dictionary and dynamic rules
  function translateString(str) {
    if (!str) return str;
    const trimmed = str.trim();
    if (!trimmed) return str;

    const leadingSpace = str.match(/^\s*/)[0];
    const trailingSpace = str.match(/\s*$/)[0];

    // 1. Direct exact dictionary match
    if (DICTIONARY[trimmed]) {
      return leadingSpace + DICTIONARY[trimmed] + trailingSpace;
    }

    // 2. Normalized dictionary match
    const normalized = normalizeKey(trimmed);
    if (DICTIONARY[normalized]) {
      return leadingSpace + DICTIONARY[normalized] + trailingSpace;
    }

    // 3. Dynamic Regex Pattern Rules
    // e.g. "8 Min Read"
    if (/^(\d+)\s+Min\s+Read$/i.test(normalized)) {
      const m = normalized.match(/^(\d+)\s+Min\s+Read$/i);
      return leadingSpace + (m[1] + ' मिनट पठन') + trailingSpace;
    }

    // e.g. "10+ Yrs Exp"
    if (/^(\d+\+?)\s+Yrs?\s+Exp$/i.test(normalized)) {
      const m = normalized.match(/^(\d+\+?)\s+Yrs?\s+Exp$/i);
      return leadingSpace + (m[1] + ' वर्ष अनुभव') + trailingSpace;
    }

    // e.g. "Grade 1", "Grade 2"
    if (/^Grade\s+(\d+)$/i.test(normalized)) {
      const m = normalized.match(/^Grade\s+(\d+)$/i);
      return leadingSpace + ('ग्रेड ' + m[1]) + trailingSpace;
    }

    // e.g. "Select Grade 1"
    if (/^Select\s+Grade\s+(\d+)$/i.test(normalized)) {
      const m = normalized.match(/^Select\s+Grade\s+(\d+)$/i);
      return leadingSpace + ('ग्रेड ' + m[1] + ' चुनें') + trailingSpace;
    }

    // e.g. "August 15, 2026" or "August 1, 2026"
    if (/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})$/i.test(normalized)) {
      const m = normalized.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})$/i);
      const hindiMonth = MONTH_MAP[m[1]] || m[1];
      return leadingSpace + (m[2] + ' ' + hindiMonth + ' ' + m[3]) + trailingSpace;
    }

    // e.g. "November 2026"
    if (/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})$/i.test(normalized)) {
      const m = normalized.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})$/i);
      const hindiMonth = MONTH_MAP[m[1]] || m[1];
      return leadingSpace + (hindiMonth + ' ' + m[2]) + trailingSpace;
    }

    // e.g. "Next Batch: August 15, 2026"
    if (/^Next Batch:\s*(.*)$/i.test(normalized)) {
      const m = normalized.match(/^Next Batch:\s*(.*)$/i);
      const sub = translateString(m[1]) || m[1];
      return leadingSpace + ('अगला बैच: ' + sub.trim()) + trailingSpace;
    }

    return null;
  }

  // Recursively translate DOM subtree into Hindi
  function translateNode(node) {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const orig = node.nodeValue;
      if (!orig || !orig.trim()) return;

      const translated = translateString(orig);
      if (translated && translated !== orig) {
        if (node._vetnovaOrigText === undefined) {
          node._vetnovaOrigText = orig;
        }
        node.nodeValue = translated;
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (shouldSkipElement(node)) return;

      // Translate Placeholder
      if (node.placeholder) {
        const transPlaceholder = translateString(node.placeholder);
        if (transPlaceholder) {
          if (node._vetnovaOrigPlaceholder === undefined) {
            node._vetnovaOrigPlaceholder = node.placeholder;
          }
          node.placeholder = transPlaceholder.trim();
        }
      }

      // Translate aria-label
      if (node.hasAttribute('aria-label')) {
        const ariaLabel = node.getAttribute('aria-label');
        const transAria = translateString(ariaLabel);
        if (transAria) {
          if (node._vetnovaOrigAria === undefined) {
            node._vetnovaOrigAria = ariaLabel;
          }
          node.setAttribute('aria-label', transAria.trim());
        }
      }

      // Translate title
      if (node.hasAttribute('title')) {
        const titleVal = node.getAttribute('title');
        const transTitle = translateString(titleVal);
        if (transTitle) {
          if (node._vetnovaOrigTitle === undefined) {
            node._vetnovaOrigTitle = titleVal;
          }
          node.setAttribute('title', transTitle.trim());
        }
      }

      // Translate Button value
      if (node.tagName === 'INPUT' && (node.type === 'button' || node.type === 'submit')) {
        const val = node.value;
        const transVal = translateString(val);
        if (transVal) {
          if (node._vetnovaOrigValue === undefined) {
            node._vetnovaOrigValue = val;
          }
          node.value = transVal.trim();
        }
      }

      // Recurse children
      let child = node.firstChild;
      while (child) {
        translateNode(child);
        child = child.nextSibling;
      }
    }
  }

  // Recursively restore DOM subtree back to English
  function restoreNode(node) {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      if (node._vetnovaOrigText !== undefined) {
        node.nodeValue = node._vetnovaOrigText;
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (shouldSkipElement(node)) return;

      if (node._vetnovaOrigPlaceholder !== undefined) {
        node.placeholder = node._vetnovaOrigPlaceholder;
      }

      if (node._vetnovaOrigAria !== undefined) {
        node.setAttribute('aria-label', node._vetnovaOrigAria);
      }

      if (node._vetnovaOrigTitle !== undefined) {
        node.setAttribute('title', node._vetnovaOrigTitle);
      }

      if (node._vetnovaOrigValue !== undefined) {
        node.value = node._vetnovaOrigValue;
      }

      let child = node.firstChild;
      while (child) {
        restoreNode(child);
        child = child.nextSibling;
      }
    }
  }

  // Check if current page is the Vet Nurse Programme page
  function isNursePage() {
    return (
      (document.body && document.body.classList && document.body.classList.contains('page-vet-nurse')) ||
      (typeof window !== 'undefined' && (
        window.location.pathname.includes('vet-nurse-programme') ||
        window.location.href.includes('vet-nurse-programme')
      ))
    );
  }

  // Set the current website language
  function setLanguage(lang) {
    if (!isNursePage()) return;
    if (isTranslating) return;
    isTranslating = true;

    try {
      if (lang !== 'hi' && lang !== 'en') {
        lang = DEFAULT_LANG;
      }
      currentLang = lang;

      try {
        localStorage.setItem(STORAGE_KEY, lang);
        document.cookie = 'vetnova_lang=' + lang + '; path=/; max-age=31536000; SameSite=Lax';
      } catch (err) {
        console.warn('Could not store language preference', err);
      }

      document.documentElement.setAttribute('lang', lang);

      if (lang === 'hi') {
        translateNode(document.body);
      } else {
        restoreNode(document.body);
      }

      updateSwitcherUI(lang);

      // Dispatch global custom event for other dynamic modules (e.g. Chatbot)
      try {
        window.dispatchEvent(new CustomEvent('vetnova:langchange', { detail: { lang: lang } }));
      } catch (e) {
        // Ignore
      }
    } catch (e) {
      console.error('Translation error:', e);
    } finally {
      isTranslating = false;
    }
  }

  // Setup MutationObserver to automatically translate dynamic content rendered after initial load
  function initDynamicObserver() {
    if (observer || typeof MutationObserver === 'undefined') return;

    observer = new MutationObserver(mutations => {
      if (currentLang !== 'hi' || isTranslating) return;

      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === Node.ELEMENT_NODE) {
            if (!shouldSkipElement(addedNode)) {
              translateNode(addedNode);
            }
          } else if (addedNode.nodeType === Node.TEXT_NODE) {
            translateNode(addedNode);
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Hook delegated click event for any switcher button
  function bindSwitcherEvents() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.lang-btn');
      if (btn && btn.dataset && btn.dataset.lang) {
        e.preventDefault();
        const targetLang = btn.dataset.lang;
        if (targetLang !== currentLang) {
          setLanguage(targetLang);
        }
      }
    });
  }

  // Main initializer
  function initTranslator() {
    if (!isNursePage()) {
      currentLang = 'en';
      document.documentElement.setAttribute('lang', 'en');
      const hideSwitchers = () => {
        document.querySelectorAll('.lang-switcher').forEach(el => {
          el.style.display = 'none';
        });
      };
      hideSwitchers();
      document.addEventListener('vetnova:componentLoaded', hideSwitchers);
      return;
    }

    bindSwitcherEvents();
    initDynamicObserver();

    const targetLang = getSavedLanguage();
    currentLang = targetLang;
    updateSwitcherUI(targetLang);

    if (targetLang === 'hi') {
      requestAnimationFrame(() => {
        setLanguage('hi');
      });
    }

    document.addEventListener('vetnova:componentLoaded', function () {
      updateSwitcherUI(currentLang);
      if (currentLang === 'hi') {
        requestAnimationFrame(() => {
          setLanguage('hi');
        });
      }
    });
  }

  // Expose API
  if (typeof window !== 'undefined') {
    window.initVetNovaTranslator = initTranslator;
    window.setVetNovaLanguage = setLanguage;
    window.getVetNovaLanguage = () => currentLang;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTranslator);
    } else {
      initTranslator();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DICTIONARY, translateString, setLanguage, initTranslator };
  }
})();
