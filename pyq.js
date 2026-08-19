// Previous Year Papers (PYQ) Engine

let pyqDatabase = [];

async function initPYQModule() {
  try {
    const res = await fetch('pyq-database.json');
    const data = await res.json();
    pyqDatabase = data.questions;
    renderPYQYearGrid();
  } catch (e) {
    console.error('Failed to load pyq-database.json:', e);
  }
}

function renderPYQYearGrid() {
  const container = document.getElementById('pyq-years-grid');
  if (!container) return;

  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007];

  container.innerHTML = years.map(yr => {
    const count = pyqDatabase.filter(q => q.year == yr).length || 65;
    return `
      <div class="card" style="text-align:center; padding:20px;">
        <div style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; color:var(--accent-primary);">
          GATE ${yr}
        </div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:4px; margin-bottom:14px;">
          Computer Science Paper • ${count} Questions
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <button class="btn-primary" onclick="launchPYQPaper(${yr}, 'exam')">Exam Mode</button>
          <button class="btn-secondary" onclick="launchPYQPaper(${yr}, 'practice')">Practice Mode</button>
        </div>
      </div>
    `;
  }).join('');
}

function launchPYQPaper(year, mode) {
  const paperQuestions = pyqDatabase.filter(q => q.year == year);

  if (mode === 'exam') {
    document.querySelector('[data-view="cbt"]')?.click();
    cbtState.active = true;
    cbtState.questions = paperQuestions.length > 0 ? paperQuestions : pyqDatabase;
    cbtState.currentIndex = 0;
    cbtState.userAnswers = {};
    cbtState.statuses = {};
    cbtState.timeRemaining = 180 * 60;

    cbtState.questions.forEach((q, i) => cbtState.statuses[i] = 'not-visited');
    cbtState.statuses[0] = 'not-answered';

    document.getElementById('cbt-welcome-screen').style.display = 'none';
    document.getElementById('cbt-active-screen').style.display = 'grid';
    document.getElementById('cbt-results-screen').style.display = 'none';

    startCBTTimer();
    renderCBTQuestion(0);
    renderQuestionPalette();
  } else {
    document.querySelector('[data-view="practice"]')?.click();
    filteredPracticeQuestions = paperQuestions.length > 0 ? paperQuestions : pyqDatabase;
    currentPracticeIndex = 0;
    practiceUserAnswers = {};
    renderPracticeQuestion();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initPYQModule();
});
