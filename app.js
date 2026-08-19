// Main Application Controller & Exam Mastery Lab Layout Sync

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initGATE2027Countdown();
  initTodayDatePill();
  renderSubjectProgressGrid();
});

function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-item');
  const viewPages = document.querySelectorAll('.view-page');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      if (!targetView) return;

      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      viewPages.forEach(sec => {
        if (sec.id === `view-${targetView}`) {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });

      if (targetView === 'dashboard') {
        renderSubjectProgressGrid();
        if (window.renderDashboardStats) window.renderDashboardStats();
      }
    });
  });
}

function initTodayDatePill() {
  const dateEl = document.getElementById('today-date-display');
  if (dateEl) {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options).toUpperCase();
    dateEl.textContent = `TODAY • ${dateStr}`;
  }
}

function initGATE2027Countdown() {
  const gateDate = new Date('2027-02-06T09:30:00+05:30').getTime();
  const countdownEl = document.getElementById('dash-target-countdown');

  function updateTimer() {
    const now = new Date().getTime();
    const diff = gateDate - now;

    if (diff <= 0) {
      if (countdownEl) countdownEl.textContent = 'GATE 2027 is Live!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (countdownEl) {
      countdownEl.textContent = `${days} Days`;
    }
  }

  updateTimer();
}

function renderSubjectProgressGrid() {
  const grid = document.getElementById('dash-subjects-grid');
  if (!grid || !window.syllabusData) return;

  grid.innerHTML = window.syllabusData.subjects.slice(0, 6).map(sub => {
    const stats = window.calculateSubjectProgress ? window.calculateSubjectProgress(sub) : { pct: 0, completed: 0, total: 10 };
    return `
      <div class="subject-item-card">
        <div style="display:flex; align-items:center; gap:12px; flex:1;">
          <div class="subject-icon-pill" style="background:${sub.color}20; color:${sub.color};">
            ${sub.icon}
          </div>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:14px;">${sub.name}</div>
            <div style="font-size:12px; color:var(--text-sub);">${stats.completed}/${stats.total} topics</div>
            <div class="progress-track">
              <div class="progress-fill" style="width:${stats.pct}%; background:${sub.color};"></div>
            </div>
          </div>
        </div>
        <div style="font-family:var(--font-heading); font-weight:800; font-size:18px; color:${sub.color};">
          ${stats.pct}%
        </div>
      </div>
    `;
  }).join('');
}

window.renderSubjectProgressGrid = renderSubjectProgressGrid;
