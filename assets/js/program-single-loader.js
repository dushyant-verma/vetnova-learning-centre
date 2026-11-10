/**
 * VetNova Program Single Page Dynamic Loader & Controller
 * Integrates Three-Stage Syllabus, Metadata, and MERN API data flow
 */

document.addEventListener("DOMContentLoaded", () => {
  initProgramSinglePage();
});

async function initProgramSinglePage() {
  const syllabusContainer = document.getElementById("three-stage-syllabus-container");
  
  // Extract slug from query param or HTML filename
  const urlParams = new URLSearchParams(window.location.search);
  const pathFile = window.location.pathname.split("/").pop() || "programs-single.html";
  let slug = urlParams.get("slug") || pathFile.replace(/\.html$/, "");

  if (!slug || slug === "programs-single" || slug === "index" || slug === "programs") {
    slug = "general-medicine";
  }

  // 1. First attempt to load verified local program data
  let program = typeof window.getProgramBySlug === "function" ? window.getProgramBySlug(slug) : null;

  // 2. Try fetching latest data from live MERN API
  if (typeof window.getProgram === "function") {
    try {
      const apiProgram = await window.getProgram(slug);
      if (apiProgram) {
        program = { ...program, ...apiProgram };
      }
    } catch (e) {
      // Gracefully use local dataset if offline
    }
  }

  if (!program) return;

  const cleanTitle = (program.title || "").replace(/^#?\d+[\.\s\-#]+\s*/, "");
  const cleanCategory = (program.category || "Clinical Track")
    .replace(/^#?\d+[\s\-\•\.\:]+\s*/, "")
    .replace(/[\s\-\•\.\:]+PROGRAM\s*#?\d+.*$/i, "");

  // Update DOM Title and Meta
  document.title = `${cleanTitle} — Three-Stage Syllabus & Clinical Training | VetNova`;
  const metaDesc = document.querySelector("meta[name='description']");
  if (metaDesc) {
    metaDesc.setAttribute("content", program.description);
  }

  // Update Breadcrumb
  const breadcrumbName = document.getElementById("breadcrumb-program-name");
  if (breadcrumbName) {
    breadcrumbName.textContent = cleanTitle;
  }

  // Update Hero elements
  const heroTitle = document.getElementById("program-single-title");
  if (heroTitle) {
    heroTitle.textContent = cleanTitle;
  }

  const heroDesc = document.getElementById("program-single-desc");
  if (heroDesc) {
    heroDesc.textContent = program.description;
  }

  const heroEyebrow = document.querySelector(".ps-hero-eyebrow");
  if (heroEyebrow && cleanCategory) {
    heroEyebrow.innerHTML = `<i class="fa-solid fa-award"></i> ${cleanCategory.toUpperCase()}`;
  }

  // Clean up Program Summary Bar: remove Level and deduplicate Availability
  const summaryBar = document.querySelector(".program-summary-bar");
  if (summaryBar) {
    // 1. Completely remove Level item if present
    summaryBar.querySelectorAll(".summary-item").forEach(item => {
      const s = item.querySelector("small");
      if (s && s.textContent.trim().toLowerCase() === "level") {
        item.remove();
      }
    });

    // 2. Ensure only a single Course Length item exists
    const availItems = Array.from(summaryBar.querySelectorAll(".summary-item")).filter(item => {
      const s = item.querySelector("small");
      const text = s ? s.textContent.trim().toLowerCase() : "";
      return text === "availability" || text === "course length";
    });
    if (availItems.length > 1) {
      availItems.slice(1).forEach(item => item.remove());
    }
  }

  // Update Duration & Course Length in summary bar & batch cards
  const summaryDuration = document.querySelectorAll(".program-summary-bar .summary-item, .batch-info-item");
  summaryDuration.forEach(item => {
    const small = item.querySelector("small");
    const strong = item.querySelector("strong");
    if (small && strong && small.textContent.trim().toLowerCase() === "duration") {
      strong.textContent = program.duration || "3 Days";
    }
    if (small && strong && (small.textContent.trim().toLowerCase() === "availability" || small.textContent.trim().toLowerCase() === "course length")) {
      small.textContent = "Daily Duration";
      strong.textContent = program.dailyDuration || program.courseLength || program.availability || "8 Hours / Day";
    }
  });

  // Update Syllabus Container
  if (syllabusContainer && typeof window.renderThreeStageSyllabusHTML === "function") {
    syllabusContainer.innerHTML = window.renderThreeStageSyllabusHTML(program);
    if (typeof window.initCurriculumAccordion === "function") {
      window.initCurriculumAccordion();
    }
  }

  // Update inquiry CTAs to include clean program context
  const applyBtns = document.querySelectorAll(".btn-apply-now, .btn-show-interest, .btn-counselling-modal, .btn-book-counselling");
  applyBtns.forEach(btn => {
    btn.setAttribute("data-context", cleanTitle);
    btn.setAttribute("data-program", cleanTitle);
    btn.setAttribute("data-action", "book-counselling");
    if (btn.tagName.toLowerCase() === "a" && btn.getAttribute("href")?.includes("contact.html")) {
      btn.setAttribute("href", `contact.html?program=${encodeURIComponent(program.slug)}#contact-form`);
    }
  });

  // Update WhatsApp enquiry buttons with official number and program-specific prefilled message
  const waNumber = (window.VETNOVA_CONTACT && window.VETNOVA_CONTACT.whatsappIntl) || '919272561089';
  const waMsg = encodeURIComponent(`Hello VetNova Academy, I would like to enquire about the ${cleanTitle} program.`);
  document.querySelectorAll("a[href*='wa.me']").forEach(btn => {
    btn.setAttribute("href", `https://wa.me/${waNumber}?text=${waMsg}`);
  });
}
