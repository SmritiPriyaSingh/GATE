// Main App Controller & Navigation Handler with Strict Exam Lock & Path Sync

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initGATE2027Countdown();
});

function initTheme() {
  const savedTheme = localStorage.getItem('gate2027_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButtonUI(savedTheme);
}

function toggleAppTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('gate2027_theme', newTheme);
  updateThemeButtonUI(newTheme);
}

function updateThemeButtonUI(theme) {
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  if (icon && text) {
    if (theme === 'dark') {
      icon.textContent = '🌙';
      text.textContent = 'Dark Mode';
    } else {
      icon.textContent = '☀️';
      text.textContent = 'Light Mode';
    }
  }
}

function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const viewSections = document.querySelectorAll('.view-section');

  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetView = btn.dataset.view;
      if (!targetView) return;

      // Strict Exam Mode Lock Check:
      if (window.cbtState && window.cbtState.active) {
        const confirmQuit = window.quitCBTExam ? window.quitCBTExam() : confirm('Quit current active exam?');
        if (!confirmQuit) {
          e.preventDefault();
          return;
        }
      }

      navBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`[data-view="${targetView}"]`).forEach(b => b.classList.add('active'));

      viewSections.forEach(sec => {
        if (sec.id === `view-${targetView}`) {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });

      if (targetView === 'dashboard' && window.renderDashboardStats) {
        window.renderDashboardStats();
      }

      // Smooth scroll to top of page on view change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function initGATE2027Countdown() {
  const gateDate = new Date('2027-02-06T09:30:00+05:30').getTime();
  const countdownEl = document.getElementById('dash-target-countdown');

  function updateTimer() {
    const now = new Date().getTime();
    const diff = gateDate - now;

    if (diff <= 0) {
      if (countdownEl) countdownEl.textContent = 'GATE 2027 Live!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (countdownEl) {
      countdownEl.textContent = `${days} Days`;
    }
  }

  updateTimer();
}

window.toggleAppTheme = toggleAppTheme;
