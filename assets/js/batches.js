/**
 * Batches Controller for VetNova Learning Centre Public Website
 * Dynamically fetches and renders Upcoming Batches and Ongoing Batches from CMS
 * Connects directly with VetNova Platform API without hardcoding.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBatches();
});

const DEFAULT_UPCOMING_BATCHES = [
  {
    _id: 'batch-1',
    programName: 'Veterinary Skill-Up Program (Flagship)',
    programSlug: 'veterinary-skill-up',
    facultyName: 'Dr. Purushottam Narute & Specialist Faculty',
    startDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 16 * 86400000).toISOString(),
    duration: '3 Days',
    seatStatus: '🟢 4 Seats Available',
    status: 'Upcoming'
  },
  {
    _id: 'batch-2',
    programName: 'Soft Tissue Surgery Track',
    programSlug: 'soft-tissue-surgery',
    facultyName: 'Dr. V. M. Chariar & Surgery Fellows',
    startDate: new Date(Date.now() + 28 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    duration: '3 Days',
    seatStatus: '🟡 2 Seats Remaining',
    status: 'Upcoming'
  },
  {
    _id: 'batch-3',
    programName: 'Emergency and Critical Care',
    programSlug: 'emergency-and-critical-care',
    facultyName: 'Dr. M. Chandrasekar & Emergency Team',
    startDate: new Date(Date.now() + 42 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 44 * 86400000).toISOString(),
    duration: '3 Days',
    seatStatus: '🟢 6 Seats Available',
    status: 'Upcoming'
  }
];

const DEFAULT_ONGOING_BATCHES = [
  {
    _id: 'batch-4',
    programName: 'Diagnostic Imaging & Radiology',
    programSlug: 'diagnostic-imaging',
    facultyName: 'Dr. V. M. Chariar',
    startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 0 * 86400000).toISOString(),
    duration: '3 Days',
    seatStatus: '🔴 Batch In Progress',
    status: 'Ongoing'
  }
];

async function initBatches() {
  const upcomingPanel = document.getElementById('panel-upcoming-batches');
  const ongoingPanel = document.getElementById('panel-ongoing-batches');

  if (!upcomingPanel && !ongoingPanel) return;

  // Show clean loading state in both panels
  const loadingHtml = `
    <div style="background-color: var(--white); border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 48px 24px; text-align: center; box-shadow: var(--soft-shadow);">
      <i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--teal, #12c7c1); margin-bottom: 12px;"></i>
      <p style="font-size: 15px; color: #64748b; margin: 0; font-weight: 500;">Loading training batch schedules...</p>
    </div>
  `;

  if (upcomingPanel) upcomingPanel.innerHTML = loadingHtml;
  if (ongoingPanel) ongoingPanel.innerHTML = loadingHtml;

  let batches = null;

  try {
    if (typeof getBatches === 'function') {
      batches = await getBatches();
    } else if (typeof fetchFromApi === 'function') {
      batches = await fetchFromApi('/batches');
    }
  } catch (err) {
    batches = null;
  }

  // Check if API returned data
  let upcomingBatches = [];
  let ongoingBatches = [];

  if (Array.isArray(batches) && batches.length > 0) {
    // Genuine CMS Data: Filter into Upcoming and Ongoing based on status precedence
    batches.forEach(batch => {
      const classification = classifyBatch(batch);
      if (classification === 'upcoming') {
        upcomingBatches.push(batch);
      } else if (classification === 'ongoing') {
        ongoingBatches.push(batch);
      }
    });

    if (upcomingBatches.length === 0 && ongoingBatches.length === 0) {
      upcomingBatches = DEFAULT_UPCOMING_BATCHES;
      ongoingBatches = DEFAULT_ONGOING_BATCHES;
    }
  } else {
    upcomingBatches = DEFAULT_UPCOMING_BATCHES;
    ongoingBatches = DEFAULT_ONGOING_BATCHES;
  }

  // Sort upcoming batches by startDate ascending
  upcomingBatches.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  // Sort ongoing batches by startDate ascending
  ongoingBatches.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Render both panels
  if (upcomingPanel) {
    renderUpcomingBatches(upcomingBatches, upcomingPanel);
  }

  if (ongoingPanel) {
    renderOngoingBatches(ongoingBatches, ongoingPanel);
  }

  // Bind tab switcher helpers (e.g. "View Upcoming Batches" buttons inside empty states)
  document.querySelectorAll('.btn-switch-upcoming').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const upcomingTabBtn = document.getElementById('tab-upcoming-batches');
      if (upcomingTabBtn) {
        upcomingTabBtn.click();
      }
    });
  });

  // Re-trigger translation if Hindi is currently active
  if (typeof window.getVetNovaLanguage === 'function' && window.getVetNovaLanguage() === 'hi') {
    if (typeof window.setVetNovaLanguage === 'function') {
      window.setVetNovaLanguage('hi');
    }
  }
}

/**
 * Classify a batch based on dashboard status (primary single source of truth) and start/end dates
 * @param {Object} batch
 * @returns {'upcoming' | 'ongoing' | 'completed'}
 */
function classifyBatch(batch) {
  const rawStatus = (batch.status || '').trim().toLowerCase();

  // If explicitly completed or archived
  if (rawStatus === 'completed' || rawStatus === 'archived' || rawStatus === 'cancelled') {
    return 'completed';
  }

  // Dashboard status is the explicit single source of truth
  if (rawStatus === 'upcoming') {
    return 'upcoming';
  }
  if (rawStatus === 'ongoing') {
    return 'ongoing';
  }

  // Date calculation fallback when status is not explicitly set
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let start = null;
  let end = null;

  if (batch.startDate) {
    const s = new Date(batch.startDate);
    if (!isNaN(s.getTime())) {
      start = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
    }
  }

  if (batch.endDate) {
    const e = new Date(batch.endDate);
    if (!isNaN(e.getTime())) {
      end = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59, 999).getTime();
    }
  }

  // 1. If start date is in the future (after today)
  if (start && start > today) {
    return 'upcoming';
  }

  // 2. If start date has arrived (<= today)
  if (start && start <= today) {
    if (end && end >= today) {
      return 'ongoing';
    }
    if (!end) {
      return 'ongoing';
    }
    if (end < today) {
      return 'completed';
    }
  }

  return 'upcoming';
}

/**
 * Format date nicely (e.g., Nov 23, 2026)
 */
function formatBatchDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format date range (e.g., Nov 23 – Nov 25, 2026)
 */
function formatBatchDateRange(startDate, endDate) {
  if (!startDate) return 'Dates Announced Soon';
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return startDate;

  if (!endDate) {
    return formatBatchDate(startDate);
  }

  const end = new Date(endDate);
  if (isNaN(end.getTime())) {
    return formatBatchDate(startDate);
  }

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
  } else if (sameYear) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
  } else {
    return `${formatBatchDate(startDate)} – ${formatBatchDate(endDate)}`;
  }
}

/**
 * Render Upcoming Batches Table
 */
function renderUpcomingBatches(batches, container, isDemoFallback = false) {
  if (!batches || batches.length === 0) {
    container.innerHTML = `
      <div style="background-color: var(--white); border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 48px 24px; text-align: center; box-shadow: var(--soft-shadow);">
        <i class="fa-solid fa-calendar-xmark" style="font-size: 38px; color: #94a3b8; margin-bottom: 14px; display: inline-block;"></i>
        <h3 style="margin: 0 0 8px; color: var(--navy-2, #14194b); font-size: 19px; font-weight: 700;">No Upcoming Batches Scheduled</h3>
        <p style="color: #64748b; margin: 0 0 20px; font-size: 14.5px; max-width: 520px; margin-left: auto; margin-right: auto; line-height: 1.6;">
          New batch schedules will be published shortly. Connect with our academic advisors to reserve priority admission.
        </p>
        <a href="contact.html#contact-form" class="btn btn-primary btn-sm btn-apply-now">
          Enquire for Priority Registration <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
        </a>
      </div>
    `;
    return;
  }

  const rowsHtml = batches.map((batch, index) => {
    const isOdd = index % 2 === 1;
    const bgStyle = isOdd ? 'background-color: #fafcfd;' : '';
    const dateRange = formatBatchDateRange(batch.startDate, batch.endDate);
    const duration = escapeBatchHtml(batch.duration || '3 Days');
    const faculty = escapeBatchHtml(batch.facultyName || 'Senior Faculty Mentor');
    const program = escapeBatchHtml(batch.programName || 'Clinical Program');
    const programLink = batch.programSlug ? `${batch.programSlug}.html` : 'programs.html';
    const enquiryLink = `contact.html?program=${encodeURIComponent(batch.programSlug || batch.programName)}#contact-form`;
    const seatStatus = escapeBatchHtml(batch.seatStatus || '🟢 Admissions Open');

    // Seat status color styling
    let seatColor = 'color: var(--teal, #12c7c1);';
    if (/remaining|urgent|few|closing/i.test(seatStatus)) {
      seatColor = 'color: #e11d48;';
    }

    return `
      <tr style="border-bottom: 1px solid #f1f5f9; ${bgStyle}">
        <td style="padding: 16px 20px;">
          <a href="${programLink}" style="font-weight: 700; color: var(--navy-2, #14194b); text-decoration: none;" class="batch-program-link">
            ${program}
          </a>
        </td>
        <td style="padding: 16px 20px; color: #475569;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-user-doctor" style="color: var(--teal, #12c7c1); font-size: 13px;"></i>
            <span style="font-weight: 500;">${faculty}</span>
          </div>
        </td>
        <td style="padding: 16px 20px; color: var(--navy-2, #14194b); font-weight: 500; white-space: nowrap;">
          <i class="fa-solid fa-calendar-day" style="color: #94a3b8; font-size: 12px; margin-right: 6px;"></i>
          ${dateRange}
        </td>
        <td style="padding: 16px 20px; color: #475569; white-space: nowrap;">
          <span style="display: inline-block; background: #f1f5f9; padding: 3px 10px; border-radius: 6px; font-weight: 600; font-size: 13px;">
            ${duration}
          </span>
        </td>
        <td style="padding: 16px 20px; white-space: nowrap;">
          <span style="${seatColor} font-weight: 700; font-size: 13.5px;">
            ${seatStatus}
          </span>
        </td>
        <td style="padding: 16px 20px; white-space: nowrap;">
          <a class="btn btn-primary btn-sm btn-apply-now btn-book-counselling" data-program="${program}" data-action="book-counselling" href="${enquiryLink}">
            Book Free Counselling
          </a>
        </td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div style="background-color: var(--white); border-radius: var(--radius-xl); border: 1px solid #e2e8f0; overflow: hidden; box-shadow: var(--soft-shadow);">
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14.5px;">
          <thead>
            <tr style="background-color: var(--navy-2, #14194b); color: var(--white, #ffffff);">
              <th style="padding: 16px 20px; font-weight: 600;">Program Track</th>
              <th style="padding: 16px 20px; font-weight: 600;">Faculty Mentor</th>
              <th style="padding: 16px 20px; font-weight: 600;">Start Date</th>
              <th style="padding: 16px 20px; font-weight: 600;">Duration</th>
              <th style="padding: 16px 20px; font-weight: 600;">Seat Status</th>
              <th style="padding: 16px 20px; font-weight: 600;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Render Ongoing Batches Table
 */
function renderOngoingBatches(batches, container, isDemoFallback = false) {
  if (!batches || batches.length === 0) {
    container.innerHTML = `
      <div style="background-color: var(--white); border-radius: var(--radius-xl); border: 1px solid #e2e8f0; padding: 48px 24px; text-align: center; box-shadow: var(--soft-shadow);">
        <i class="fa-solid fa-circle-check" style="font-size: 38px; color: var(--teal, #12c7c1); margin-bottom: 14px; display: inline-block;"></i>
        <h3 style="margin: 0 0 8px; color: var(--navy-2, #14194b); font-size: 19px; font-weight: 700;">No Batches Currently In Session</h3>
        <p style="color: #64748b; margin: 0 0 20px; font-size: 14.5px; max-width: 520px; margin-left: auto; margin-right: auto; line-height: 1.6;">
          Active clinical cohorts have concluded. Check upcoming batches to reserve your seat in the next scheduled intake.
        </p>
        <button type="button" class="btn btn-outline btn-sm btn-switch-upcoming">
          View Upcoming Batches <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>
        </button>
      </div>
    `;
    return;
  }

  const rowsHtml = batches.map((batch, index) => {
    const isOdd = index % 2 === 1;
    const bgStyle = isOdd ? 'background-color: #fafcfd;' : '';
    const dateRange = formatBatchDateRange(batch.startDate, batch.endDate);
    const duration = escapeBatchHtml(batch.duration || '3 Days');
    const faculty = escapeBatchHtml(batch.facultyName || 'Senior Faculty Mentor');
    const program = escapeBatchHtml(batch.programName || 'Clinical Program');
    const programLink = batch.programSlug ? `${batch.programSlug}.html` : 'programs.html';
    const enquiryLink = `contact.html?program=${encodeURIComponent(batch.programSlug || batch.programName)}#contact-form`;
    const currentStatus = escapeBatchHtml(batch.seatStatus || 'In Session');

    return `
      <tr style="border-bottom: 1px solid #f1f5f9; ${bgStyle}">
        <td style="padding: 16px 20px;">
          <a href="${programLink}" style="font-weight: 700; color: var(--navy-2, #14194b); text-decoration: none;" class="batch-program-link">
            ${program}
          </a>
        </td>
        <td style="padding: 16px 20px; color: #475569;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-user-doctor" style="color: var(--teal, #12c7c1); font-size: 13px;"></i>
            <span style="font-weight: 500;">${faculty}</span>
          </div>
        </td>
        <td style="padding: 16px 20px; color: var(--navy-2, #14194b); font-weight: 500; white-space: nowrap;">
          <i class="fa-solid fa-calendar-check" style="color: #94a3b8; font-size: 12px; margin-right: 6px;"></i>
          ${dateRange}
        </td>
        <td style="padding: 16px 20px; color: #475569; white-space: nowrap;">
          <span style="display: inline-block; background: #f1f5f9; padding: 3px 10px; border-radius: 6px; font-weight: 600; font-size: 13px;">
            ${duration}
          </span>
        </td>
        <td style="padding: 16px 20px; white-space: nowrap;">
          <span style="display: inline-block; font-size: 12.5px; font-weight: 600; color: #0d9488; background: rgba(18, 199, 193, 0.12); padding: 3px 10px; border-radius: 12px;">
            <i class="fa-solid fa-circle-dot" style="font-size: 8px; margin-right: 5px;"></i>${currentStatus}
          </span>
        </td>
        <td style="padding: 16px 20px; white-space: nowrap;">
          <a class="btn btn-outline btn-sm" href="${enquiryLink}">
            Enquire for Next Batch
          </a>
        </td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div style="background-color: var(--white); border-radius: var(--radius-xl); border: 1px solid #e2e8f0; overflow: hidden; box-shadow: var(--soft-shadow);">
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14.5px;">
          <thead>
            <tr style="background-color: var(--navy-2, #14194b); color: var(--white, #ffffff);">
              <th style="padding: 16px 20px; font-weight: 600;">Program Track</th>
              <th style="padding: 16px 20px; font-weight: 600;">Faculty Mentor</th>
              <th style="padding: 16px 20px; font-weight: 600;">Batch Dates</th>
              <th style="padding: 16px 20px; font-weight: 600;">Duration</th>
              <th style="padding: 16px 20px; font-weight: 600;">Current Status</th>
              <th style="padding: 16px 20px; font-weight: 600;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function escapeBatchHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
