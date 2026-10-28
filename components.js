/**
 * VetNova Learning Centre - Shared Component Loader (components.js)
 * Automatically fetches and injects shared components (header.html, footer.html)
 * into #global-header and #global-footer containers across all public pages.
 */
/**
 * VetNova Learning Centre - Centralized Contact Configuration
 * Official contact specifications:
 * - Indian mobile number: 9272561089
 * - International format: +91 92725 61089
 * - Tel link format: tel:+919272561089
 * - WhatsApp URL format: https://wa.me/919272561089
 */
window.VETNOVA_CONTACT = window.VETNOVA_CONTACT || {
  phoneLocal: '9272561089',
  phoneDisplay: '+91 92725 61089',
  phoneTel: 'tel:+919272561089',
  whatsappIntl: '919272561089',
  whatsappUrl: 'https://wa.me/919272561089',
  email: 'hello@vetnova.in',
  admissionsEmail: 'admissions@vetnova.in'
};

(function() {
  function syncContactElements(contact) {
    if (!contact) return;
    const phone = contact.phoneDisplay || contact.contactPhone || '+91 92725 61089';
    const tel = contact.phoneTel || contact.contactPhoneTel || 'tel:+919272561089';
    const waUrl = contact.whatsappUrl || 'https://wa.me/919272561089';

    // Update phone links and text
    document.querySelectorAll('[data-vetnova-phone]').forEach(el => {
      if (el.tagName.toLowerCase() === 'a') {
        el.setAttribute('href', tel);
      }
      const icon = el.querySelector('i');
      if (icon) {
        el.innerHTML = '';
        el.appendChild(icon);
        el.appendChild(document.createTextNode(' ' + phone));
      } else {
        el.textContent = phone;
      }
    });

    // Update WhatsApp links
    document.querySelectorAll('[data-vetnova-whatsapp]').forEach(el => {
      if (el.tagName.toLowerCase() === 'a') {
        const currentHref = el.getAttribute('href') || '';
        const matchText = currentHref.match(/[?&]text=([^&]+)/);
        if (matchText) {
          el.setAttribute('href', `https://wa.me/91${contact.phoneLocal || '9272561089'}?text=${matchText[1]}`);
        } else {
          el.setAttribute('href', waUrl);
        }
      }
    });
  }

  function fetchLiveContactSettings() {
    const apiBase = (typeof getApiBaseUrl === 'function') 
      ? getApiBaseUrl() 
      : ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? 'http://localhost:5001/api'
          : 'https://vetnova-api-utnd.onrender.com/api');

    fetch(`${apiBase}/settings/public`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.contactPhone) {
          window.VETNOVA_CONTACT.phoneDisplay = data.contactPhone;
          window.VETNOVA_CONTACT.phoneLocal = data.contactPhoneLocal || '9272561089';
          window.VETNOVA_CONTACT.phoneTel = data.contactPhoneTel || `tel:+91${window.VETNOVA_CONTACT.phoneLocal}`;
          window.VETNOVA_CONTACT.whatsappUrl = data.whatsappUrl || `https://wa.me/91${window.VETNOVA_CONTACT.phoneLocal}`;
          syncContactElements(window.VETNOVA_CONTACT);
        }
      })
      .catch(() => {
        // Fallback silently to configured defaults
      });
  }

  function loadSharedComponent(containerId, componentUrl) {
    const container = document.getElementById(containerId);
    if (!container) return Promise.resolve();

    // Do not reload if already populated
    if (container.children && container.children.length > 0) {
      syncContactElements(window.VETNOVA_CONTACT);
      return Promise.resolve();
    }

    return fetch(componentUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${componentUrl}: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        if (container && (!container.children || container.children.length === 0)) {
          container.innerHTML = html;
          syncContactElements(window.VETNOVA_CONTACT);
        }
      })
      .catch(error => {
        console.warn(`[components.js] Failed to load ${componentUrl}:`, error);
      });
  }

  function initSharedComponents() {
    loadSharedComponent('global-header', 'components/header.html');
    loadSharedComponent('global-footer', 'components/footer.html');
    syncContactElements(window.VETNOVA_CONTACT);
    fetchLiveContactSettings();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedComponents);
  } else {
    initSharedComponents();
  }
})();
