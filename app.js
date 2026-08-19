// Main Application Controller & Professional Navigation Drawer Handler

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initGATE2027Countdown();
  initProfileDropdown();
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

function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn, .sidebar-item, .dropdown-item');
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

      if (targetView === 'dashboard' && window.renderCommandCenter) {
        window.renderCommandCenter();
      } else if (targetView === 'profile' && window.renderProfileModule) {
        window.renderProfileModule();
      } else if (targetView === 'settings' && window.renderSettingsModule) {
        window.renderSettingsModule();
      }

      closeSidebarDrawer();
      closeProfileDropdown();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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
window.toggleSidebarDrawer = toggleSidebarDrawer;
window.closeSidebarDrawer = closeSidebarDrawer;
window.toggleProfileDropdown = toggleProfileDropdown;
window.closeProfileDropdown = closeProfileDropdown;
