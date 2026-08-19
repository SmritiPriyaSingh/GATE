// Main Application Controller

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initGATE2027Countdown();
});

function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const viewSections = document.querySelectorAll('.view-section');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;

      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

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
    });
  });
}

function initGATE2027Countdown() {
  const gateDate = new Date('2027-02-06T09:30:00+05:30').getTime();
  const countdownEl = document.getElementById('gate-countdown-timer');

  function updateTimer() {
    const now = new Date().getTime();
    const diff = gateDate - now;

    if (diff <= 0) {
      if (countdownEl) countdownEl.textContent = 'GATE 2027 is Live!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (countdownEl) {
      countdownEl.textContent = `${days}d ${hours}h ${mins}m`;
    }
  }

  updateTimer();
  setInterval(updateTimer, 60000);
}
