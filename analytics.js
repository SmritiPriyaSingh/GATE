// Analytics & Dashboard Progress Module

function renderDashboardStats() {
  const history = JSON.parse(localStorage.getItem('gate2027_test_history')) || [];
  
  // Overall Syllabus %
  const syllabusPct = window.calculateOverallSyllabusProgress ? window.calculateOverallSyllabusProgress() : 0;
  const sysPctEl = document.getElementById('dash-syllabus-pct');
  if (sysPctEl) sysPctEl.textContent = `${syllabusPct}%`;

  // Tests Attempted
  const testCountEl = document.getElementById('dash-tests-count');
  if (testCountEl) testCountEl.textContent = history.length;

  // Average Accuracy
  let totalAcc = 0;
  history.forEach(h => totalAcc += parseFloat(h.accuracy || 0));
  const avgAcc = history.length > 0 ? Math.round(totalAcc / history.length) : 0;
  
  const accEl = document.getElementById('dash-avg-accuracy');
  if (accEl) accEl.textContent = `${avgAcc}%`;

  // Recent Activity Table
  const recentTable = document.getElementById('dash-recent-tests-list');
  if (recentTable) {
    if (history.length === 0) {
      recentTable.innerHTML = `<div style="color:var(--text-muted); padding:16px; text-align:center;">No mock tests taken yet. Click "Start Practice CBT Exam" to begin!</div>`;
    } else {
      recentTable.innerHTML = history.slice(-5).reverse().map(h => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid var(--border-color);">
          <div>
            <div style="font-weight:600;">Mock Test &bull; ${h.date}</div>
            <div style="font-size:12px; color:var(--text-muted);">Accuracy: ${h.accuracy}% (${h.correctCount} Correct, ${h.wrongCount} Wrong)</div>
          </div>
          <div style="font-family:var(--font-heading); font-size:18px; font-weight:700; color:var(--accent-primary);">
            ${h.score} / ${h.maxMarks}
          </div>
        </div>
      `).join('');
    }
  }
}

window.renderDashboardStats = renderDashboardStats;

document.addEventListener('DOMContentLoaded', () => {
  renderDashboardStats();
});
