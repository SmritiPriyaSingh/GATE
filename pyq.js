// PYQ Library Engine - Comprehensive Interactive Paper Hub with Attempt Tracking & Progress

let pyqDatabase = [];
let pyqSearchQuery = '';
let pyqActiveFilter = 'all'; // 'all', 'completed', 'in_progress', 'not_started'

async function initPYQModule() {
  try {
    const res = await fetch('pyq-database.json');
    const data = await res.json();
    pyqDatabase = data.questions;
    renderPYQLibrary();
  } catch (e) {
    console.error('Failed to load pyq-database.json:', e);
  }
}

function renderPYQLibrary() {
  const container = document.getElementById('pyq-main-content');
  if (!container) return;

  const testHistory = JSON.parse(localStorage.getItem('gate2027_test_history')) || [];
  const pyqProgress = JSON.parse(localStorage.getItem('gate2027_pyq_progress')) || {};

  const allYears = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007];
  
  // Calculate Top Stats
  const totalPapers = allYears.length;
  const totalQuestions = pyqDatabase.length > 0 ? pyqDatabase.length : 1300;
  
  let completedCount = 0;
  let inProgressCount = 0;
  let totalScoreAcc = 0;
  let totalTestsAcc = testHistory.length;

  allYears.forEach(yr => {
    const prog = pyqProgress[yr];
    if (prog && prog.completed >= 65) completedCount++;
    else if (prog && prog.completed > 0) inProgressCount++;
  });

  const avgAcc = totalTestsAcc > 0 
    ? Math.round(testHistory.reduce((acc, t) => acc + (t.accuracy || 0), 0) / totalTestsAcc) 
    : 0;

  // Render Top Header & Stats
  container.innerHTML = `
    <!-- Future-Proof Title Banner & Stats Bar -->
    <div class="card" style="margin-bottom:20px; padding:20px 24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div>
          <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; margin-bottom:2px;">Previous Year Papers</h2>
          <p style="color:var(--text-sub); font-size:13px;">Official GATE Computer Science question archives with step-by-step solutions and progress memory.</p>
        </div>

        <!-- Quick Stats Grid -->
        <div style="display:flex; gap:16px; flex-wrap:wrap;">
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:8px 14px; border-radius:8px; text-align:center;">
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Papers</div>
            <div style="font-size:16px; font-weight:700; color:var(--accent-primary);">${totalPapers} Papers</div>
          </div>
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:8px 14px; border-radius:8px; text-align:center;">
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Questions</div>
            <div style="font-size:16px; font-weight:700;">${totalQuestions} Qs</div>
          </div>
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:8px 14px; border-radius:8px; text-align:center;">
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Completed</div>
            <div style="font-size:16px; font-weight:700; color:var(--color-success);">${completedCount} Finished</div>
          </div>
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:8px 14px; border-radius:8px; text-align:center;">
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Avg Accuracy</div>
            <div style="font-size:16px; font-weight:700; color:var(--accent-primary);">${avgAcc}%</div>
          </div>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-top:18px; padding-top:16px; border-top:1px solid var(--border-color);">
        <!-- Search Input -->
        <div style="position:relative; flex:1; max-width:360px;">
          <input type="text" id="pyq-search-input" value="${pyqSearchQuery}" placeholder="Search papers (e.g. 2018, 2024)..." style="width:100%; background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:8px 12px 8px 34px; border-radius:6px; font-size:13px;" oninput="handlePYQSearch(this.value)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
        </div>

        <!-- Filter Pills -->
        <div style="display:flex; gap:8px;">
          <button class="btn-secondary ${pyqActiveFilter === 'all' ? 'active' : ''}" onclick="setPYQFilter('all')" style="${pyqActiveFilter === 'all' ? 'border-color:var(--accent-primary); color:var(--accent-primary);' : ''}">All Years</button>
          <button class="btn-secondary ${pyqActiveFilter === 'in_progress' ? 'active' : ''}" onclick="setPYQFilter('in_progress')" style="${pyqActiveFilter === 'in_progress' ? 'border-color:var(--accent-primary); color:var(--accent-primary);' : ''}">In Progress</button>
          <button class="btn-secondary ${pyqActiveFilter === 'completed' ? 'active' : ''}" onclick="setPYQFilter('completed')" style="${pyqActiveFilter === 'completed' ? 'border-color:var(--accent-primary); color:var(--accent-primary);' : ''}">Completed</button>
          <button class="btn-secondary ${pyqActiveFilter === 'not_started' ? 'active' : ''}" onclick="setPYQFilter('not_started')" style="${pyqActiveFilter === 'not_started' ? 'border-color:var(--accent-primary); color:var(--accent-primary);' : ''}">Not Started</button>
        </div>
      </div>
    </div>

    <!-- Timeline Group 1: Recent Papers (2020 - 2026) -->
    <div style="margin-bottom:24px;">
      <div style="font-size:13px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
        <span>Recent Exam Papers (2020 – 2026)</span>
        <div style="flex:1; height:1px; background:var(--border-color);"></div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(310px, 1fr)); gap:18px;">
        ${renderPaperCards(allYears.filter(y => y >= 2020), pyqProgress)}
      </div>
    </div>

    <!-- Timeline Group 2: Classic Papers (2007 - 2019) -->
    <div>
      <div style="font-size:13px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
        <span>Classic Exam Papers (2007 – 2019)</span>
        <div style="flex:1; height:1px; background:var(--border-color);"></div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(310px, 1fr)); gap:18px;">
        ${renderPaperCards(allYears.filter(y => y < 2020), pyqProgress)}
      </div>
    </div>
  `;
}

function renderPaperCards(yearsList, pyqProgress) {
  let filteredYears = yearsList.filter(yr => {
    if (pyqSearchQuery && !yr.toString().includes(pyqSearchQuery)) return false;

    const prog = pyqProgress[yr];
    const isCompleted = prog && prog.completed >= 65;
    const isInProgress = prog && prog.completed > 0 && prog.completed < 65;
    const isNotStarted = !prog || prog.completed === 0;

    if (pyqActiveFilter === 'completed' && !isCompleted) return false;
    if (pyqActiveFilter === 'in_progress' && !isInProgress) return false;
    if (pyqActiveFilter === 'not_started' && !isNotStarted) return false;

    return true;
  });

  if (filteredYears.length === 0) {
    return `<div style="grid-column:1/-1; padding:30px; text-align:center; color:var(--text-muted); background:var(--bg-surface); border:1px solid var(--border-color); border-radius:8px;">No papers found matching your search and filter criteria.</div>`;
  }

  return filteredYears.map(yr => {
    const qCount = pyqDatabase.filter(q => q.year == yr).length || 65;
    const prog = pyqProgress[yr] || { completed: 0, accuracy: 0, bestScore: 0, lastAttempt: null };

    const isAttempted = prog.completed > 0;

    if (isAttempted) {
      return `
        <div class="card" style="padding:20px; display:flex; flex-direction:column; justify-content:space-between; border-left:3px solid var(--accent-primary);">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700;">GATE ${yr}</h3>
              <span style="font-size:11px; font-weight:600; color:var(--accent-primary); background:var(--accent-subtle); padding:2px 8px; border-radius:4px;">
                ${prog.completed >= qCount ? 'Completed' : 'In Progress'}
              </span>
            </div>
            <div style="font-size:12px; color:var(--text-sub); margin-bottom:12px;">Computer Science &bull; ${qCount} Questions</div>

            <!-- Progress Details -->
            <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:10px 12px; border-radius:6px; display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:12px; margin-bottom:14px;">
              <div>Completed: <strong>${prog.completed} / ${qCount}</strong></div>
              <div>Accuracy: <strong style="color:var(--color-success);">${prog.accuracy}%</strong></div>
              <div>Best Score: <strong>${prog.bestScore} M</strong></div>
              <div>Last Attempt: <strong style="color:var(--text-sub);">${prog.lastAttempt || 'Recently'}</strong></div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button class="btn-primary" style="font-size:13px; padding:8px 14px;" onclick="launchPYQPaper(${yr}, 'practice')">
              ▶ Continue Practice
            </button>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button class="btn-secondary" style="font-size:12px; padding:6px 10px;" onclick="launchPYQPaper(${yr}, 'exam')">CBT Exam</button>
              <button class="btn-secondary" style="font-size:12px; padding:6px 10px;" onclick="launchPYQPaper(${yr}, 'practice')">Solutions</button>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="card" style="padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700;">GATE ${yr}</h3>
              <span style="font-size:11px; font-weight:600; color:var(--text-muted); background:var(--bg-surface-hover); padding:2px 8px; border-radius:4px;">
                Never Attempted
              </span>
            </div>
            <div style="font-size:12px; color:var(--text-sub); margin-bottom:12px;">Computer Science Paper</div>

            <!-- Empty State Details -->
            <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:10px 12px; border-radius:6px; font-size:12px; color:var(--text-sub); margin-bottom:14px;">
              <div>Expected Time: <strong>3 Hours</strong> &bull; Max Marks: <strong>100</strong></div>
              <div style="margin-top:2px;">Questions: <strong>${qCount} Qs</strong> &bull; Difficulty: <strong>★★★★☆</strong></div>
            </div>
          </div>

          <!-- Primary First Attempt Action -->
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button class="btn-primary" style="font-size:13px; padding:8px 14px;" onclick="launchPYQPaper(${yr}, 'practice')">
              Start First Attempt ➔
            </button>
            <button class="btn-secondary" style="font-size:12px; padding:6px 10px;" onclick="launchPYQPaper(${yr}, 'exam')">
              Take CBT Exam Mode
            </button>
          </div>
        </div>
      `;
    }
  }).join('');
}

function handlePYQSearch(val) {
  pyqSearchQuery = val.trim();
  renderPYQLibrary();
}

function setPYQFilter(filterKey) {
  pyqActiveFilter = filterKey;
  renderPYQLibrary();
}

function launchPYQPaper(year, mode) {
  const paperQuestions = pyqDatabase.filter(q => q.year == year);

  if (mode === 'exam') {
    navigateToView('cbt');
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
    navigateToView('practice');
    filteredPracticeQuestions = paperQuestions.length > 0 ? paperQuestions : pyqDatabase;
    currentPracticeIndex = 0;
    practiceUserAnswers = {};
    activePracticeSession = { type: 'pyq', year };
    startPracticeTimer();
    renderPracticeModule();
  }
}

window.renderPYQLibrary = renderPYQLibrary;
window.handlePYQSearch = handlePYQSearch;
window.setPYQFilter = setPYQFilter;
window.launchPYQPaper = launchPYQPaper;

document.addEventListener('DOMContentLoaded', () => {
  initPYQModule();
});
