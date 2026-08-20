// Main Application Controller & Professional Navigation Drawer Handler
import { inject } from '@vercel/analytics';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  updateBrandTitle();
  initGATE2027Countdown();
  initProfileDropdown();
  
  // Initialize Vercel Analytics
  inject();
});

function initTheme() {
  const savedTheme = localStorage.getItem('gate2027_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleAppTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('gate2027_theme', newTheme);
  if (window.renderSettingsModule) window.renderSettingsModule();
}

function updateBrandTitle() {
  const brandEl = document.getElementById('app-brand-title');
  if (!brandEl) return;

  const profile = window.StorageManager ? window.StorageManager.getProfile() : null;
  let targetYear = '2027';

  if (profile && profile.targetYear) {
    const match = profile.targetYear.match(/\b(20\d\d)\b/);
    if (match) {
      targetYear = match[1];
    }
  }

  brandEl.textContent = `GATE CSE ${targetYear}`;
}

function initGATE2027Countdown() {
  const countdownEl = document.getElementById('dash-target-countdown');
  const profile = window.StorageManager ? window.StorageManager.getProfile() : null;
  let year = 2027;

  if (profile && profile.targetYear) {
    const match = profile.targetYear.match(/\b(20\d\d)\b/);
    if (match) {
      year = parseInt(match[1], 10);
    }
  }

  // GATE exam is usually on the first Saturday of February
  const gateDate = new Date(`${year}-02-06T09:30:00+05:30`).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const diff = gateDate - now;

    if (diff <= 0) {
      if (countdownEl) countdownEl.textContent = `GATE ${year} Live!`;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (countdownEl) {
      countdownEl.textContent = `${days} Days`;
    }
  }

  updateTimer();
}

function navigateToView(targetView) {
  if (!targetView) return;

  // Strict Exam Mode Lock Check:
  if (window.cbtState && window.cbtState.active) {
    const confirmQuit = window.quitCBTExam ? window.quitCBTExam() : confirm('Quit current active exam?');
    if (!confirmQuit) return;
  }

  const navBtns = document.querySelectorAll('.nav-btn, .sidebar-item, .dropdown-item');
  const viewSections = document.querySelectorAll('.view-section');

  navBtns.forEach(b => b.classList.remove('active'));
  document.querySelectorAll(`[data-view="${targetView}"]`).forEach(b => b.classList.add('active'));

  viewSections.forEach(sec => {
    if (sec.id === `view-${targetView}`) {
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });

  if (targetView === 'dashboard' && window.renderCommandCenter) {
    window.renderCommandCenter();
  } else if (targetView === 'syllabus' && window.renderSyllabusAppLayout) {
    window.renderSyllabusAppLayout();
  } else if (targetView === 'practice' && window.renderPracticeModule) {
    window.renderPracticeModule();
  } else if (targetView === 'pyq' && window.renderPYQLibrary) {
    window.renderPYQLibrary();
  } else if (targetView === 'cbt' && window.renderCBTWelcomeHub) {
    window.renderCBTWelcomeHub();
  } else if (targetView === 'analytics' && window.renderAnalyticsModule) {
    window.renderAnalyticsModule();
  } else if (targetView === 'profile' && window.renderProfileModule) {
    window.renderProfileModule();
  } else if (targetView === 'settings' && window.renderSettingsModule) {
    window.renderSettingsModule();
  }

  closeSidebarDrawer();
  closeProfileDropdown();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initNavigation() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-view]');
    if (btn) {
      const targetView = btn.dataset.view;
      if (targetView) {
        navigateToView(targetView);
      }
    }
  });
}

// Sidebar Drawer Control
function toggleSidebarDrawer() {
  const overlay = document.getElementById('sidebar-overlay');
  const drawer = document.getElementById('sidebar-drawer');
  if (overlay && drawer) {
    overlay.classList.toggle('active');
    drawer.classList.toggle('active');
  }
}

function closeSidebarDrawer() {
  const overlay = document.getElementById('sidebar-overlay');
  const drawer = document.getElementById('sidebar-drawer');
  if (overlay && drawer) {
    overlay.classList.remove('active');
    drawer.classList.remove('active');
  }
}

// Profile Dropdown Control
function initProfileDropdown() {
  document.addEventListener('click', (e) => {
    const container = document.getElementById('profile-menu-container');
    const menu = document.getElementById('profile-dropdown-menu');
    if (container && menu) {
      if (!container.contains(e.target)) {
        menu.classList.remove('active');
      }
    }
  });
}

function toggleProfileDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('profile-dropdown-menu');
  if (menu) {
    menu.classList.toggle('active');
  }
}

function closeProfileDropdown() {
  const menu = document.getElementById('profile-dropdown-menu');
  if (menu) {
    menu.classList.remove('active');
  }
}

window.navigateToView = navigateToView;
window.toggleAppTheme = toggleAppTheme;
window.updateBrandTitle = updateBrandTitle;
window.initGATE2027Countdown = initGATE2027Countdown;
window.toggleSidebarDrawer = toggleSidebarDrawer;
window.closeSidebarDrawer = closeSidebarDrawer;
window.toggleProfileDropdown = toggleProfileDropdown;
window.closeProfileDropdown = closeProfileDropdown;
