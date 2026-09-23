/**
 * VetNova Assistant — Interactive Conversational Chatbot Engine
 * Powers the public website chatbot with verified knowledge, dynamic API integration,
 * conversation memory, quick question chips, and contextual CTA actions.
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
      phone: '+91 20 1234 5678',
      email: 'hello@vetnova.in'
    }
  };

  /**
   * Process user input query through local Verified Knowledge Engine
   */
  async function queryKnowledgeEngine(rawInput) {
    const query = rawInput.trim().toLowerCase();

    // Standard CTAs
    const ctaCounselling = { label: 'Book Free Counselling Session', action: 'counselling', link: 'contact.html#enquiry' };
    const ctaPrograms = { label: 'Browse All Programs', action: 'link', link: 'programs.html' };
    const ctaFaculty = { label: 'Meet Our Faculty', action: 'link', link: 'faculty.html' };
    const ctaPartnerships = { label: 'Partner With VetNova', action: 'link', link: 'partnerships.html' };
    const ctaContact = { label: 'Contact VetNova', action: 'link', link: 'contact.html' };

    // 1. Fresh Graduate / Intern Eligibility & Guidance
    if (query.includes('fresh') || query.includes('intern') || query.includes('student') || query.includes('junior') || query.includes('new grad')) {
      return {
        reply: "Based on your background, we recommend our flagship **Veterinary Skill-Up Program** (4 Weeks). It is specifically engineered for fresh graduates and interns to bridge university theory with real-world small animal clinical practice.\n\nWould you like to explore the program details or speak with an academic counsellor?",
        ctas: [
          { label: 'View Veterinary Skill-Up', action: 'link', link: 'veterinary-skill-up.html' },
          ctaCounselling
        ]
      };
    }

    // 2. Practicing Veterinarian Guidance
    if (query.includes('practicing') || query.includes('experienced') || query.includes('doctor') || query.includes('vet doctor') || query.includes('clinic owner')) {
      return {
        reply: "For practicing veterinarians, VetNova offers targeted 1-week and 3-day clinical specialization modules:\n\n• **Soft Tissue Surgery Track** (1 Week)\n• **Radiology & Ultrasound Masterclass** (1 Week)\n• **Emergency & Critical Care** (3 Days)\n\nWhich clinical area would you like to master?",
        ctas: [
          { label: 'Soft Tissue Surgery', action: 'link', link: 'soft-tissue-surgery.html' },
          { label: 'Radiology & Ultrasound', action: 'link', link: 'radiology-ultrasound.html' },
          { label: 'Emergency Care', action: 'link', link: 'emergency-medicine.html' }
        ]
      };
    }

    // 3. Vet Nurse / Paravet Query
    if (query.includes('nurse') || query.includes('paravet') || query.includes('assistant') || query.includes('staff')) {
      return {
        reply: "VetNova offers a dedicated **Vet Nurse & Assistant Programme** (2 Weeks) designed for clinical assistants and paravet staff to master sterile prep, IV access, monitoring, and patient care.",
        ctas: [
          { label: 'View Vet Nurse Programme', action: 'link', link: 'vet-nurse-programme.html' },
          ctaCounselling
        ]
      };
    }

    // 4. Programs Overview / What courses available
    if (query.includes('program') || query.includes('course') || query.includes('offer') || query.includes('catalog') || query.includes('list')) {
      return {
        reply: "VetNova offers 5 specialized practical clinical training tracks in Pune:\n\n1. **Veterinary Skill-Up Program** (4 Weeks)\n2. **Soft Tissue Surgery Track** (1 Week)\n3. **Radiology & Ultrasound Masterclass** (1 Week)\n4. **Emergency & Critical Care** (3 Days)\n5. **Vet Nurse & Assistant Programme** (2 Weeks)\n\nAll courses feature 80%+ tactile lab practice in our modern Wagholi facility.",
        ctas: [ctaPrograms, ctaCounselling]
      };
    }

    // 5. Batches & Schedule
    if (query.includes('batch') || query.includes('date') || query.includes('schedule') || query.includes('upcoming') || query.includes('start') || query.includes('when')) {
      return {
        reply: "VetNova conducts rolling monthly practical training batches at our Wagholi, Pune facility with limited seats per cohort (max 8-10 trainees for 1-on-1 mentor guidance).\n\nYou can speak directly with our academic coordinator to reserve your seat or enquire about upcoming batch dates.",
        ctas: [
          ctaCounselling,
          { label: 'Show Interest / Notify Me', action: 'counselling', link: 'contact.html#enquiry' }
        ]
      };
    }

    // 6. Fees / Pricing
    if (query.includes('fee') || query.includes('cost') || query.includes('price') || query.includes('tuition') || query.includes('charge')) {
      return {
        reply: "VetNova program fees depend on the selected track and duration (ranging from 3-day intensive workshops to 4-week full clinical mastery modules). Fees include lab equipment, surgical consumables, PPE, and course certification.\n\nPlease connect with our counselling team for detailed fee structures and group registration benefits.",
        ctas: [ctaCounselling, ctaPrograms]
      };
    }

    // 7. Faculty / Instructors
    if (query.includes('faculty') || query.includes('teacher') || query.includes('trainer') || query.includes('instructor') || query.includes('mentor')) {
      let facultyText = "VetNova modules are led by senior MVSc veterinary specialists, experienced soft tissue surgeons, and diagnostic imaging leaders with extensive clinical expertise.";
      
      // Try fetching live public faculty API if available
      if (typeof window.getFaculty === 'function') {
        try {
          const facultyList = await window.getFaculty();
          if (Array.isArray(facultyList) && facultyList.length > 0) {
            const names = facultyList.slice(0, 3).map(f => f.name || f.title).filter(Boolean).join(', ');
            if (names) {
              facultyText += `\n\nFeatured Mentors: **${names}** and senior surgeons.`;
            }
          }
        } catch (e) {
          // Fallback silently
        }
      }

      return {
        reply: facultyText,
        ctas: [ctaFaculty, ctaCounselling]
      };
    }

    // 8. Location / Campus / Address
    if (query.includes('location') || query.includes('address') || query.includes('pune') || query.includes('where') || query.includes('reach') || query.includes('campus') || query.includes('direction')) {
      return {
        reply: `VetNova Training Institute is located at:\n\n📍 **Gawadewadi, Wagholi, Pune, MH 412207**\n🕒 Open Mon-Sat: 9:00 AM – 6:00 PM\n📞 Contact: +91 20 1234 5678\n\nOur campus features a 3,000 sq. ft. practical facility with sterile surgical suites and diagnostic imaging equipment.`,
        ctas: [
          { label: 'Get Directions (Google Maps)', action: 'external', link: 'https://maps.google.com' },
          ctaContact
        ]
      };
    }

    // 9. Book Counselling / Help / Apply
    if (query.includes('counsel') || query.includes('apply') || query.includes('admit') || query.includes('enroll') || query.includes('book')) {
      return {
        reply: "You can book a 1-on-1 session with our academic team to discuss program selection, batch availability, and career pathways.",
        ctas: [ctaCounselling, { label: 'Apply Now', action: 'link', link: 'contact.html' }]
      };
    }

    // 10. Partnerships / Collaborations
    if (query.includes('partner') || query.includes('collaborat') || query.includes('clinic partner') || query.includes('sponso') || query.includes('hospital')) {
      return {
        reply: "VetNova collaborates with veterinary clinics, hospital networks, and educational organizations for group staff training, skill enhancement programs, and clinical partnerships.",
        ctas: [ctaPartnerships, ctaContact]
      };
    }

    // 11. Eligibility General
    if (query.includes('who can') || query.includes('eligibl') || query.includes('qualification') || query.includes('requirement')) {
      return {
        reply: "Eligible applicants include:\n• BVSc & AH graduates, interns, and practicing veterinarians\n• Foreign veterinary graduates looking for practical Indian clinical orientation\n• Vet nurses, assistants, and paravet staff (for Nurse Programme)",
        ctas: [ctaPrograms, ctaCounselling]
      };
    }

    // Fallback (Honest response with no hallucination)
    return {
      reply: "I don't have verified information about that specific detail at the moment. I can connect you with the VetNova admissions team who will be happy to assist you.",
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
                conversationId: state.conversationId
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
          await new Promise(res => setTimeout(res, 450)); // natural typing delay
          response = await queryKnowledgeEngine(cleanText);
        }

        removeTypingIndicator();
        appendMessage('assistant', response.reply, response.ctas);
      } catch (err) {
        removeTypingIndicator();
        appendMessage(
          'assistant',
          "I'm having trouble connecting right now. Please try again or contact the VetNova admissions team.",
          [{ label: 'Book Free Counselling Session', action: 'counselling', link: 'contact.html#enquiry' }]
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
  }

  // Global Export & Auto Initialization
  window.initVetNovaChatbot = initVetNovaChatbot;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVetNovaChatbot);
  } else {
    initVetNovaChatbot();
  }
})();
