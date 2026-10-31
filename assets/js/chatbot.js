/**
 * VetNova Assistant — Interactive Conversational Chatbot Engine
 * Powers the public website chatbot with verified knowledge, dynamic API integration,
 * conversation memory, quick question chips, and contextual CTA actions.
 * Fully bilingual: English & Hindi with automatic language synchronization.
 */

(function () {
  'use strict';

  // State Management
  const state = {
    isOpen: false,
    history: [],
    conversationId: 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    isTyping: false
  };

  function isHindiActive() {
    if (typeof window.getVetNovaLanguage === 'function') {
      return window.getVetNovaLanguage() === 'hi';
    }
    return document.documentElement.getAttribute('lang') === 'hi';
  }

  // Structured Verified Knowledge Dataset
  const VETNOVA_KNOWLEDGE = {
    programs: [
      { id: 'skill-up', name: 'Veterinary Skill-Up Program', duration: '4 Weeks', link: 'veterinary-skill-up.html' },
      { id: 'soft-tissue', name: 'Soft Tissue Surgery Track', duration: '1 Week', link: 'soft-tissue-surgery.html' },
      { id: 'radiology', name: 'Radiology & Ultrasound Masterclass', duration: '1 Week', link: 'radiology-ultrasound.html' },
      { id: 'emergency', name: 'Emergency & Critical Care Track', duration: '3 Days', link: 'emergency-medicine.html' },
      { id: 'vet-nurse', name: 'Vet Nurse & Assistant Programme', duration: '2 Weeks', link: 'vet-nurse-programme.html' }
    ],
    location: {
      address: 'Gawadewadi, Wagholi, Pune, MH 412207',
      hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
      phone: '+91 92725 61089',
      whatsapp: '919272561089',
      email: 'contact@vetnovainstitute.com'
    }
  };

  /**
   * Process user input query through local Verified Knowledge Engine
   */
  async function queryKnowledgeEngine(rawInput) {
    const query = rawInput.trim().toLowerCase();
    const isHi = isHindiActive();

    // Standard CTAs in English and Hindi
    const ctaCounselling = isHi
      ? { label: 'निःशुल्क परामर्श सत्र बुक करें', action: 'counselling', link: 'contact.html#enquiry' }
      : { label: 'Book Free Counselling Session', action: 'counselling', link: 'contact.html#enquiry' };

    const ctaPrograms = isHi
      ? { label: 'सभी कार्यक्रम देखें', action: 'link', link: 'programs.html' }
      : { label: 'Browse All Programs', action: 'link', link: 'programs.html' };

    const ctaFaculty = isHi
      ? { label: 'हमारे संकाय से मिलें', action: 'link', link: 'faculty.html' }
      : { label: 'Meet Our Faculty', action: 'link', link: 'faculty.html' };

    const ctaPartnerships = isHi
      ? { label: 'वेटनोवा से जुड़ें', action: 'link', link: 'partnerships.html' }
      : { label: 'Partner With VetNova', action: 'link', link: 'partnerships.html' };

    const ctaContact = isHi
      ? { label: 'वेटनोवा से संपर्क करें', action: 'link', link: 'contact.html' }
      : { label: 'Contact VetNova', action: 'link', link: 'contact.html' };

    // 1. Fresh Graduate / Intern Eligibility & Guidance
    if (query.includes('fresh') || query.includes('intern') || query.includes('student') || query.includes('junior') || query.includes('new grad') ||
      query.includes('स्नातक') || query.includes('इंटर्न') || query.includes('छात्र') || query.includes('नया')) {
      return {
        reply: isHi
          ? "आपके बैकग्राउंड के अनुसार, हम हमारे प्रमुख **पशु चिकित्सा स्किल-अप कार्यक्रम** (4 सप्ताह) की अनुशंसा करते हैं। यह विशेष रूप से नए स्नातकों और इंटर्न के लिए कॉलेज के सिद्धांत को वास्तविक क्लिनिकल अभ्यास से जोड़ने हेतु तैयार किया गया है।\n\nक्या आप कार्यक्रम विवरण देखना चाहेंगे या शैक्षणिक काउंसलर से बात करना चाहेंगे?"
          : "Based on your background, we recommend our flagship **Veterinary Skill-Up Program** (4 Weeks). It is specifically engineered for fresh graduates and interns to bridge university theory with real-world small animal clinical practice.\n\nWould you like to explore the program details or speak with an academic counsellor?",
        ctas: [
          { label: isHi ? 'पशु चिकित्सा स्किल-अप देखें' : 'View Veterinary Skill-Up', action: 'link', link: 'veterinary-skill-up.html' },
          ctaCounselling
        ]
      };
    }

    // 2. Practicing Veterinarian Guidance
    if (query.includes('practicing') || query.includes('experienced') || query.includes('doctor') || query.includes('vet doctor') || query.includes('clinic owner') ||
      query.includes('अभ्यास') || query.includes('डॉक्टर') || query.includes('अनुभवी') || query.includes('क्लिनिक')) {
      return {
        reply: isHi
          ? "अभ्यास करने वाले पशु चिकित्सकों के लिए, वेटनोवा 1-सप्ताह और 3-दिन के विशेष क्लिनिकल मॉड्यूल प्रदान करता है:\n\n• **सॉफ्ट टिश्यू सर्जरी ट्रैक** (1 सप्ताह)\n• **रेडियोलॉजी एवं अल्ट्रासाउंड मास्टरक्लास** (1 सप्ताह)\n• **आपातकालीन एवं गहन चिकित्सा** (3 दिन)\n\nआप किस क्लिनिकल क्षेत्र में महारत हासिल करना चाहते हैं?"
          : "For practicing veterinarians, VetNova offers targeted 1-week and 3-day clinical specialization modules:\n\n• **Soft Tissue Surgery Track** (1 Week)\n• **Radiology & Ultrasound Masterclass** (1 Week)\n• **Emergency & Critical Care** (3 Days)\n\nWhich clinical area would you like to master?",
        ctas: [
          { label: isHi ? 'सॉफ्ट टिश्यू सर्जरी' : 'Soft Tissue Surgery', action: 'link', link: 'soft-tissue-surgery.html' },
          { label: isHi ? 'रेडियोलॉजी एवं अल्ट्रासाउंड' : 'Radiology & Ultrasound', action: 'link', link: 'radiology-ultrasound.html' },
          { label: isHi ? 'आपातकालीन देखभाल' : 'Emergency Care', action: 'link', link: 'emergency-medicine.html' }
        ]
      };
    }

    // 3. Vet Nurse / Paravet Query
    if (query.includes('nurse') || query.includes('paravet') || query.includes('assistant') || query.includes('staff') ||
      query.includes('नर्स') || query.includes('पैरा-वेट') || query.includes('सहायक')) {
      return {
        reply: isHi
          ? "वेटनोवा क्लिनिकल सहायकों और पैरा-वेट स्टाफ के लिए एक समर्पित **वेट नर्स एवं तकनीशियन व्यावहारिक कार्यक्रम** (2 सप्ताह) प्रदान करता है, जिसमें स्टेराइल तैयारी, आईवी एक्सेस, रोगी निगरानी और देखभाल सिखाई जाती है।"
          : "VetNova offers a dedicated **Vet Nurse & Assistant Programme** (2 Weeks) designed for clinical assistants and paravet staff to master sterile prep, IV access, monitoring, and patient care.",
        ctas: [
          { label: isHi ? 'वेट नर्स कार्यक्रम देखें' : 'View Vet Nurse Programme', action: 'link', link: 'vet-nurse-programme.html' },
          ctaCounselling
        ]
      };
    }

    // 4. Programs Overview / What courses available
    if (query.includes('program') || query.includes('course') || query.includes('offer') || query.includes('catalog') || query.includes('list') ||
      query.includes('कार्यक्रम') || query.includes('पाठ्यक्रम') || query.includes('कोर्स') || query.includes('लिस्ट') || query.includes('सूची')) {
      return {
        reply: isHi
          ? "वेटनोवा पुणे में 5 विशेष व्यावहारिक क्लिनिकल प्रशिक्षण ट्रैक प्रदान करता है:\n\n1. **पशु चिकित्सा स्किल-अप कार्यक्रम** (4 सप्ताह)\n2. **सॉफ्ट टिश्यू सर्जरी ट्रैक** (1 सप्ताह)\n3. **रेडियोलॉजी एवं अल्ट्रासाउंड मास्टरक्लास** (1 सप्ताह)\n4. **आपातकालीन एवं गहन चिकित्सा** (3 दिन)\n5. **वेट नर्स एवं सहायक कार्यक्रम** (2 सप्ताह)\n\nसभी पाठ्यक्रमों में हमारे वाघोली परिसर में 80%+ व्यावहारिक लैब अभ्यास शामिल है।"
          : "VetNova offers 5 specialized practical clinical training tracks in Pune:\n\n1. **Veterinary Skill-Up Program** (4 Weeks)\n2. **Soft Tissue Surgery Track** (1 Week)\n3. **Radiology & Ultrasound Masterclass** (1 Week)\n4. **Emergency & Critical Care** (3 Days)\n5. **Vet Nurse & Assistant Programme** (2 Weeks)\n\nAll courses feature 80%+ tactile lab practice in our modern Wagholi facility.",
        ctas: [ctaPrograms, ctaCounselling]
      };
    }

    // 5. Batches & Schedule
    if (query.includes('batch') || query.includes('date') || query.includes('schedule') || query.includes('upcoming') || query.includes('start') || query.includes('when') ||
      query.includes('बैच') || query.includes('तारीख') || query.includes('शेड्यूल') || query.includes('कब') || query.includes('आगामी')) {
      return {
        reply: isHi
          ? "वेटनोवा हमारे वाघोली, पुणे परिसर में सीमित सीटों (1-ऑन-1 मेंटर मार्गदर्शन हेतु प्रति बैच 8-10 प्रशिक्षु) के साथ नियमित मासिक व्यावहारिक बैच आयोजित करता है।\n\nअपनी सीट आरक्षित करने या आगामी बैच तिथियों के लिए आप सीधे हमारे काउंसलर से संपर्क कर सकते हैं।"
          : "VetNova conducts rolling monthly practical training batches at our Wagholi, Pune facility with limited seats per cohort (max 8-10 trainees for 1-on-1 mentor guidance).\n\nYou can speak directly with our academic coordinator to reserve your seat or enquire about upcoming batch dates.",
        ctas: [
          ctaCounselling,
          { label: isHi ? 'रुचि दर्ज करें / सूचित करें' : 'Show Interest / Notify Me', action: 'counselling', link: 'contact.html#enquiry' }
        ]
      };
    }

    // 6. Fees / Pricing
    if (query.includes('fee') || query.includes('cost') || query.includes('price') || query.includes('tuition') || query.includes('charge') ||
      query.includes('शुल्क') || query.includes('फीस') || query.includes('खर्च') || query.includes('कीमत')) {
      return {
        reply: isHi
          ? "वेटनोवा कार्यक्रम शुल्क चयनित ट्रैक और अवधि पर निर्भर करता है (3-दिवसीय गहन कार्यशाला से लेकर 4-सप्ताह के पूर्ण क्लिनिकल मॉड्यूल तक)। शुल्क में लैब उपकरण, सर्जिकल सामग्री, पीपीई और पाठ्यक्रम प्रमाणन शामिल हैं।\n\nविस्तृत शुल्क संरचना के लिए कृपया हमारी काउंसलिंग टीम से संपर्क करें।"
          : "VetNova program fees depend on the selected track and duration (ranging from 3-day intensive workshops to 4-week full clinical mastery modules). Fees include lab equipment, surgical consumables, PPE, and course certification.\n\nPlease connect with our counselling team for detailed fee structures and group registration benefits.",
        ctas: [ctaCounselling, ctaPrograms]
      };
    }

    // 7. Faculty / Instructors
    if (query.includes('faculty') || query.includes('teacher') || query.includes('trainer') || query.includes('instructor') || query.includes('mentor') ||
      query.includes('संकाय') || query.includes('शिक्षक') || query.includes('मेंटर') || query.includes('डॉक्टर')) {
      let facultyText = isHi
        ? "वेटनोवा मॉड्यूल का नेतृत्व वरिष्ठ एमवीएससी पशु चिकित्सा विशेषज्ञों, अनुभवी सॉफ्ट टिश्यू सर्जनों और डायग्नोस्टिक इमेजिंग लीडर्स द्वारा किया जाता है।"
        : "VetNova modules are led by senior MVSc veterinary specialists, experienced soft tissue surgeons, and diagnostic imaging leaders with extensive clinical expertise.";

      if (typeof window.getFaculty === 'function') {
        try {
          const facultyList = await window.getFaculty();
          if (Array.isArray(facultyList) && facultyList.length > 0) {
            const names = facultyList.slice(0, 3).map(f => f.name || f.title).filter(Boolean).join(', ');
            if (names) {
              facultyText += isHi
                ? `\n\nप्रमुख मेंटर: **${names}** एवं वरिष्ठ सर्जन।`
                : `\n\nFeatured Mentors: **${names}** and senior surgeons.`;
            }
          }
        } catch (e) {
          // Ignore
        }
      }

      return {
        reply: facultyText,
        ctas: [ctaFaculty, ctaCounselling]
      };
    }

    // 8. Location / Campus / Address
    if (query.includes('location') || query.includes('address') || query.includes('pune') || query.includes('where') || query.includes('reach') || query.includes('campus') || query.includes('direction') ||
      query.includes('स्थान') || query.includes('पता') || query.includes('पुणे') || query.includes('कहाँ') || query.includes('कैंपस')) {
      return {
        reply: isHi
          ? "वेटनोवा ट्रेनिंग इंस्टीट्यूट यहाँ स्थित है:\n\n📍 **गावडेवाड़ी, वाघोली, पुणे, महाराष्ट्र 412207**\n🕒 खुला: सोम-शनि: सुबह 9:00 – शाम 6:00\n📞 संपर्क: +91 92725 61089\n💬 व्हाट्सएप: +91 92725 61089\n\nहमारे 3,000 वर्ग फुट के व्यावहारिक परिसर में स्टेराइल सर्जिकल सुइट और डायग्नोस्टिक इमेजिंग सुविधाएं हैं।"
          : "VetNova Training Institute is located at:\n\n📍 **Gawadewadi, Wagholi, Pune, MH 412207**\n🕒 Open Mon-Sat: 9:00 AM – 6:00 PM\n📞 Contact: +91 92725 61089\n💬 WhatsApp: +91 92725 61089\n\nOur campus features a 3,000 sq. ft. practical facility with sterile surgical suites and diagnostic imaging equipment.",
        ctas: [
          { label: isHi ? 'दिशा-निर्देश प्राप्त करें (गूगल मैप्स)' : 'Get Directions (Google Maps)', action: 'external', link: 'https://maps.google.com/?q=Gawadewadi+Wagholi+Pune+Maharashtra+412207' },
          { label: isHi ? 'व्हाट्सएप पर बात करें' : 'Chat on WhatsApp', action: 'external', link: 'https://wa.me/919272561089' },
          ctaContact
        ]
      };
    }

    // 9. Book Counselling / Help / Apply
    if (query.includes('counsel') || query.includes('apply') || query.includes('admit') || query.includes('enroll') || query.includes('book') ||
      query.includes('परामर्श') || query.includes('आवेदन') || query.includes('दाखिला') || query.includes('प्रवेश')) {
      return {
        reply: isHi
          ? "आप कार्यक्रम चयन, बैच उपलब्धता और करियर मार्गदर्शन के लिए हमारी शैक्षणिक टीम के साथ 1-ऑन-1 निःशुल्क सत्र बुक कर सकते हैं।"
          : "You can book a 1-on-1 session with our academic team to discuss program selection, batch availability, and career pathways.",
        ctas: [
          ctaCounselling,
          { label: isHi ? 'अभी आवेदन करें' : 'Book free Counselling ', action: 'link', link: 'contact.html' }
        ]
      };
    }

    // 10. Partnerships / Collaborations
    if (query.includes('partner') || query.includes('collaborat') || query.includes('clinic partner') || query.includes('sponso') || query.includes('hospital') ||
      query.includes('साझेदारी') || query.includes('पार्टनर') || query.includes('सहयोग') || query.includes('अस्पताल')) {
      return {
        reply: isHi
          ? "वेटनोवा पशु चिकित्सालयों, अस्पताल नेटवर्कों और शैक्षणिक संस्थानों के साथ स्टाफ प्रशिक्षण, कौशल उन्नयन और क्लिनिकल साझेदारी के लिए सहयोग करता है।"
          : "VetNova collaborates with veterinary clinics, hospital networks, and educational organizations for group staff training, skill enhancement programs, and clinical partnerships.",
        ctas: [ctaPartnerships, ctaContact]
      };
    }

    // 11. Eligibility General
    if (query.includes('who can') || query.includes('eligibl') || query.includes('qualification') || query.includes('requirement') ||
      query.includes('कौन') || query.includes('पात्रता') || query.includes('योग्यता')) {
      return {
        reply: isHi
          ? "पात्र आवेदकों में शामिल हैं:\n• बीवीएससी एवं एएच स्नातक, इंटर्न और अभ्यास करने वाले पशु चिकित्सक\n• विदेशी पशु चिकित्सा स्नातक\n• वेट नर्स, सहायक और पैरा-वेट स्टाफ (नर्स कार्यक्रम हेतु)"
          : "Eligible applicants include:\n• BVSc & AH graduates, interns, and practicing veterinarians\n• Foreign veterinary graduates looking for practical Indian clinical orientation\n• Vet nurses, assistants, and paravet staff (for Nurse Programme)",
        ctas: [ctaPrograms, ctaCounselling]
      };
    }

    // 12. Direct Contact / Phone / WhatsApp
    if (query.includes('whatsapp') || query.includes('phone') || query.includes('call') || query.includes('mobile') || query.includes('contact number') || query.includes('helpline') ||
      query.includes('व्हाट्सएप') || query.includes('फोन') || query.includes('कॉल') || query.includes('नंबर') || query.includes('संपर्क')) {
      return {
        reply: isHi
          ? "वेटनोवा अकादमी का आधिकारिक संपर्क विवरण:\n\n📞 मोबाइल / फोन: **+91 92725 61089** (9272561089)\n💬 व्हाट्सएप: **+91 92725 61089**\n✉️ ईमेल: contact@vetnovainstitute.com\n🕒 समय: सोम – शनि: सुबह 9:00 से शाम 6:00 तक\n\nआप सीधे कॉल कर सकते हैं या व्हाट्सएप पर संदेश भेज सकते हैं।"
          : "VetNova Academy Official Contact Details:\n\n📞 Phone: **+91 92725 61089** (Local: 9272561089)\n💬 WhatsApp: **+91 92725 61089**\n✉️ Email: contact@vetnovainstitute.com\n🕒 Office Hours: Mon – Sat: 9:00 AM – 6:00 PM\n\nYou can call our admissions desk or chat directly with a counsellor on WhatsApp.",
        ctas: [
          { label: isHi ? 'व्हाट्सएप चैट शुरू करें' : 'Chat on WhatsApp', action: 'external', link: 'https://wa.me/919272561089' },
          { label: isHi ? 'कॉल करें' : 'Call Admissions', action: 'external', link: 'tel:+919272561089' },
          ctaContact
        ]
      };
    }

    // Fallback
    return {
      reply: isHi
        ? "मेरे पास इस विशिष्ट विवरण के बारे में वर्तमान में सत्यापित जानकारी नहीं है। मैं आपको वेटनोवा प्रवेश टीम से जोड़ सकता हूँ जो आपकी सहायता करेगी।"
        : "I don't have verified information about that specific detail at the moment. I can connect you with the VetNova admissions team who will be happy to assist you.",
      ctas: [ctaCounselling, ctaContact]
    };
  }

  /**
   * Main Chatbot Initializer
   */
  function initVetNovaChatbot() {
    const chatbotWrap = document.getElementById('vetnova-chatbot');
    const launcherBtn = document.getElementById('chatbot-launcher-btn');
    const chatPanel = document.getElementById('chatbot-panel');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const inputForm = document.getElementById('chatbot-input-form');
    const inputField = document.getElementById('chatbot-input-field');
    const messagesContainer = document.getElementById('chatbot-messages');
    const chipsContainer = document.getElementById('chatbot-chips');

    if (!chatbotWrap || !launcherBtn || !chatPanel) return;

    if (launcherBtn.dataset.initialized === 'true') return;
    launcherBtn.dataset.initialized = 'true';

    // Open Chatbot Panel
    function openChatbot() {
      state.isOpen = true;
      chatPanel.classList.add('is-open');
      chatPanel.setAttribute('aria-hidden', 'false');
      launcherBtn.setAttribute('aria-expanded', 'true');
      if (inputField) inputField.focus();
    }

    // Close Chatbot Panel
    function closeChatbot() {
      state.isOpen = false;
      chatPanel.classList.remove('is-open');
      chatPanel.setAttribute('aria-hidden', 'true');
      launcherBtn.setAttribute('aria-expanded', 'false');
      launcherBtn.focus();
    }

    // Toggle Chatbot Panel
    function toggleChatbot() {
      if (state.isOpen) {
        closeChatbot();
      } else {
        openChatbot();
      }
    }

    launcherBtn.addEventListener('click', toggleChatbot);
    if (closeBtn) closeBtn.addEventListener('click', closeChatbot);

    // Escape Key Listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isOpen) {
        closeChatbot();
      }
    });

    // Helper: Format Markdown bold & bullets in text
    function formatMessageText(text) {
      if (!text) return '';
      let formatted = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Bold text **text**
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Bullet list items
      formatted = formatted.replace(/^• (.*$)/gim, '<li class="chat-bullet-item">$1</li>');
      // Newlines to <br>
      formatted = formatted.replace(/\n/g, '<br>');

      return formatted;
    }

    // Render User or Assistant Message Bubble
    function appendMessage(sender, text, ctas = []) {
      if (!messagesContainer) return;

      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg chat-msg-${sender}`;

      const textDiv = document.createElement('div');
      textDiv.className = 'chat-msg-bubble';
      textDiv.innerHTML = formatMessageText(text);
      msgDiv.appendChild(textDiv);

      // Render CTAs if available
      if (ctas && ctas.length > 0) {
        const ctaWrap = document.createElement('div');
        ctaWrap.className = 'chat-msg-actions';
        ctas.forEach(cta => {
          const btn = document.createElement('a');
          btn.className = 'chat-action-btn';
          btn.href = cta.link || '#';
          btn.textContent = cta.label;

          if (cta.action === 'counselling') {
            btn.classList.add('btn-counselling-modal');
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              const modal = document.getElementById('enquiry-modal');
              if (modal) {
                modal.classList.add('open');
              } else {
                window.location.href = 'contact.html#enquiry';
              }
            });
          } else if (cta.action === 'external') {
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';
          }

          ctaWrap.appendChild(btn);
        });
        msgDiv.appendChild(ctaWrap);
      }

      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Add to conversation memory
      state.history.push({ sender, text });
    }

    // Typing Indicator Animation
    function showTypingIndicator() {
      if (!messagesContainer) return null;
      state.isTyping = true;
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chat-msg chat-msg-assistant typing-indicator-msg';
      typingDiv.id = 'chat-typing-indicator';
      typingDiv.innerHTML = `
        <div class="chat-msg-bubble typing-bubble">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      `;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return typingDiv;
    }

    function removeTypingIndicator() {
      state.isTyping = false;
      const indicator = document.getElementById('chat-typing-indicator');
      if (indicator) indicator.remove();
    }

    // Handle Sending User Question
    async function handleUserSend(text) {
      if (!text || !text.trim() || state.isTyping) return;
      const cleanText = text.trim();

      // Hide quick question chips once conversation begins
      if (chipsContainer) {
        chipsContainer.style.display = 'none';
      }

      // Render user message
      appendMessage('user', cleanText);
      if (inputField) inputField.value = '';

      // Show Typing Indicator
      showTypingIndicator();

      try {
        let response = null;

        // Attempt API endpoint fetch if backend is available
        const apiBaseUrl = typeof window.getApiBaseUrl === 'function' ? window.getApiBaseUrl() : null;
        if (apiBaseUrl) {
          try {
            const apiRes = await fetch(`${apiBaseUrl}/chat`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: cleanText,
                history: state.history.slice(-6),
                conversationId: state.conversationId,
                lang: isHindiActive() ? 'hi' : 'en'
              })
            });
            if (apiRes.ok) {
              const data = await apiRes.json();
              if (data && data.success && data.reply) {
                response = data;
              }
            }
          } catch (apiErr) {
            // API call failed, fallback silently to local engine
          }
        }

        // Local Verified Knowledge Engine fallback
        if (!response) {
          await new Promise(res => setTimeout(res, 400));
          response = await queryKnowledgeEngine(cleanText);
        }

        removeTypingIndicator();
        appendMessage('assistant', response.reply, response.ctas);
      } catch (err) {
        removeTypingIndicator();
        const isHi = isHindiActive();
        appendMessage(
          'assistant',
          isHi
            ? "मुझे अभी कनेक्ट करने में परेशानी हो रही है। कृपया पुनः प्रयास करें या वेटनोवा प्रवेश टीम से संपर्क करें।"
            : "I'm having trouble connecting right now. Please try again or contact the VetNova admissions team.",
          [{ label: isHi ? 'निःशुल्क परामर्श सत्र बुक करें' : 'Book Free Counselling Session', action: 'counselling', link: 'contact.html#enquiry' }]
        );
      }
    }

    // Input Form Submission
    if (inputForm) {
      inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (inputField) {
          handleUserSend(inputField.value);
        }
      });
    }

    // Enter Key Handler (Shift+Enter for newline)
    if (inputField) {
      inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleUserSend(inputField.value);
        }
      });
    }

    // Quick Question Chips Listener
    if (chipsContainer) {
      chipsContainer.querySelectorAll('.chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const questionText = btn.dataset.question || btn.textContent;
          handleUserSend(questionText);
        });
      });
    }

    // Listen for language changes and refresh chatbot strings
    window.addEventListener('vetnova:langchange', (e) => {
      const isHi = e.detail && e.detail.lang === 'hi';
      const launcherText = launcherBtn.querySelector('.launcher-text');
      if (launcherText) {
        launcherText.textContent = isHi ? 'वेटनोवा से पूछें' : 'Ask VetNova';
      }

      const titleEl = chatPanel.querySelector('.chatbot-title');
      if (titleEl) {
        titleEl.textContent = isHi ? 'वेटनोवा सहायक' : 'VetNova Assistant';
      }

      const statusEl = chatPanel.querySelector('.chatbot-status');
      if (statusEl) {
        statusEl.textContent = isHi ? 'ऑनलाइन • त्वरित सहायता' : 'Online • Instant Support';
      }

      if (inputField) {
        inputField.placeholder = isHi ? 'अपना प्रश्न यहाँ लिखें...' : 'Type your question...';
        inputField.setAttribute('aria-label', isHi ? 'अपना प्रश्न यहाँ लिखें' : 'Type your question');
      }

      // Update chips if still visible and no messages sent
      if (chipsContainer && (!state.history || state.history.length === 0)) {
        const chipData = isHi ? [
          { q: 'मेरे लिए कौन सा कार्यक्रम सही है?', text: 'मेरे लिए कौन सा कार्यक्रम सही है?' },
          { q: 'आप कौन से कार्यक्रम पेश करते हैं?', text: 'आप कौन से कार्यक्रम पेश करते हैं?' },
          { q: 'आगामी बैच कौन से हैं?', text: 'आगामी बैच कौन से हैं?' },
          { q: 'कौन आवेदन कर सकता है?', text: 'कौन आवेदन कर सकता है?' },
          { q: 'पाठ्यक्रम शुल्क क्या है?', text: 'पाठ्यक्रम शुल्क क्या है?' },
          { q: 'वेटनोवा संकाय के बारे में बताएं', text: 'वेटनोवा संकाय के बारे में बताएं' },
          { q: 'वेटनोवा कहाँ स्थित है?', text: 'वेटनोवा कहाँ स्थित है?' },
          { q: 'परामर्श सत्र बुक करें', text: 'परामर्श सत्र बुक करें' }
        ] : [
          { q: 'Which program is right for me?', text: 'Which program is right for me?' },
          { q: 'What programs do you offer?', text: 'What programs do you offer?' },
          { q: 'What are the upcoming batches?', text: 'What are the upcoming batches?' },
          { q: 'Who can apply?', text: 'Who can apply?' },
          { q: 'What are the course fees?', text: 'What are the course fees?' },
          { q: 'Tell me about VetNova faculty', text: 'Tell me about VetNova faculty' },
          { q: 'Where is VetNova located?', text: 'Where is VetNova located?' },
          { q: 'Book a counselling session', text: 'Book a counselling session' }
        ];

        const chipBtns = chipsContainer.querySelectorAll('.chip-btn');
        chipBtns.forEach((btn, idx) => {
          if (chipData[idx]) {
            btn.dataset.question = chipData[idx].q;
            btn.textContent = chipData[idx].text;
          }
        });
      }
    });
  }

  // Global Export & Auto Initialization
  window.initVetNovaChatbot = initVetNovaChatbot;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVetNovaChatbot);
  } else {
    initVetNovaChatbot();
  }
})();
