// Practice Center Module - LeetCode / Duolingo Style Practice Hub

let allPracticeQuestions = [];
let activePracticeSession = null; // null when at Practice Home, or session config object
let currentPracticeIndex = 0;
let practiceUserAnswers = {};
let practiceStartTime = null;
let practiceTimerInterval = null;

// Practice Session Configuration State
let practiceConfig = {
  subjectId: 'all',
  unitName: 'all',
  topicName: 'all',
  difficulty: 'all',
  questionCount: 10,
  enableTimer: true,
  instantCheck: true
};

async function initPracticeModule() {
  try {
    const res = await fetch('pyq-database.json');
    const data = await res.json();
    allPracticeQuestions = data.questions;
    renderPracticeModule();
  } catch (e) {
    console.error('Failed to load pyq-database.json for practice:', e);
  }
}

function renderPracticeModule() {
  const container = document.getElementById('practice-main-content');
  if (!container) return;

  if (activePracticeSession) {
    renderActiveQuestionView(container);
  } else {
    renderPracticeHome(container);
  }
}

// 1. Practice Home Dashboard (LeetCode / HackerRank Style)
function renderPracticeHome(container) {
  if (practiceTimerInterval) clearInterval(practiceTimerInterval);

  container.innerHTML = `
    <!-- Top Header Banner -->
    <div class="card" style="margin-bottom:20px; padding:20px 24px;">
      <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; margin-bottom:4px;">Practice Center</h2>
      <p style="color:var(--text-sub); font-size:13px;">Choose how you want to structure your study session today before starting.</p>
    </div>

    <!-- Practice Modes Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
      
      <!-- Card 1: Topic-wise Custom Practice -->
      <div class="card" style="padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="font-size:12px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:4px;">Topic-Wise Practice</div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; margin-bottom:12px;">Custom Topic Session</h3>
          <p style="font-size:12px; color:var(--text-sub); margin-bottom:14px;">Select subject, topic, and difficulty to focus on specific weaknesses.</p>

          <div style="display:flex; flex-direction:column; gap:10px;">
            <div>
              <label style="font-size:11px; font-weight:600; color:var(--text-muted); display:block; margin-bottom:4px;">Subject</label>
              <select id="p-home-subject" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:6px 10px; border-radius:6px; font-size:12px; width:100%;">
                <option value="all">All Subjects</option>
                <option value="ga">General Aptitude (15 Marks)</option>
                <option value="pds">Programming & Data Structures (15 Marks)</option>
                <option value="em">Engineering Mathematics (13 Marks)</option>
                <option value="cn">Computer Networks (10 Marks)</option>
                <option value="os">Operating Systems (9 Marks)</option>
                <option value="coa">Computer Organization & Architecture (8 Marks)</option>
                <option value="dbms">Databases (7 Marks)</option>
                <option value="algo">Algorithms (7 Marks)</option>
                <option value="dl">Digital Logic (6 Marks)</option>
                <option value="toc">Theory of Computation (6 Marks)</option>
                <option value="cd">Compiler Design (4 Marks)</option>
              </select>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <div>
                <label style="font-size:11px; font-weight:600; color:var(--text-muted); display:block; margin-bottom:4px;">Questions Count</label>
                <select id="p-home-count" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:6px 10px; border-radius:6px; font-size:12px; width:100%;">
                  <option value="10">10 Questions</option>
                  <option value="20">20 Questions</option>
                  <option value="30">30 Questions</option>
                  <option value="50">50 Questions</option>
                </select>
              </div>

              <div>
                <label style="font-size:11px; font-weight:600; color:var(--text-muted); display:block; margin-bottom:4px;">Difficulty</label>
                <select id="p-home-diff" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:6px 10px; border-radius:6px; font-size:12px; width:100%;">
                  <option value="all">All Difficulties</option>
                  <option value="1">1 Mark (Easy)</option>
                  <option value="2">2 Marks (Medium/Hard)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button class="btn-primary" style="margin-top:16px; font-size:13px; padding:8px 16px;" onclick="startConfiguredPractice()">
          Start Topic Practice ➔
        </button>
      </div>

      <!-- Card 2: Subject Practice -->
      <div class="card" style="padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="font-size:12px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:4px;">Full Subject Practice</div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; margin-bottom:12px;">Subject Mastery</h3>
          <p style="font-size:12px; color:var(--text-sub); margin-bottom:14px;">Solve questions covering all units of a single chosen subject.</p>
        </div>

        <button class="btn-primary" style="font-size:13px; padding:8px 16px;" onclick="startSubjectSession('os')">
          Start OS Practice ➔
        </button>
      </div>

      <!-- Card 3: Previous Year Papers -->
      <div class="card" style="padding:20px; display:flex; flex-direction:column; justify-space-between;">
        <div>
          <div style="font-size:12px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:4px;">Official Archives</div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; margin-bottom:12px;">PYQ Question Sets</h3>
          <p style="font-size:12px; color:var(--text-sub); margin-bottom:14px;">Practice official GATE questions year by year from 2007 to 2026.</p>
        </div>

        <button class="btn-primary" style="font-size:13px; padding:8px 16px;" onclick="navigateToView('pyq')">
          Browse PYQ Papers ➔
        </button>
      </div>

      <!-- Card 4: Random Syllabus Practice -->
      <div class="card" style="padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="font-size:12px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:4px;">Mixed Practice</div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; margin-bottom:12px;">Random Syllabus Sprint</h3>
          <p style="font-size:12px; color:var(--text-sub); margin-bottom:14px;">Random selection of questions across all Computer Science subjects.</p>
        </div>

        <button class="btn-primary" style="font-size:13px; padding:8px 16px;" onclick="startRandomSession()">
          Start Random Sprint ➔
        </button>
      </div>

      <!-- Card 5: Bookmarked Questions -->
      <div class="card" style="padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="font-size:12px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:4px;">Revision Vault</div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; margin-bottom:12px;">Bookmarked Questions</h3>
          <p style="font-size:12px; color:var(--text-sub); margin-bottom:14px;">Re-solve questions you previously bookmarked for revision.</p>
        </div>

        <button class="btn-secondary" style="font-size:13px; padding:8px 16px;" onclick="startBookmarksSession()">
          Start Bookmarks Session ➔
        </button>
      </div>

    </div>
  `;
}

function startConfiguredPractice() {
  const sub = document.getElementById('p-home-subject')?.value || 'all';
  const count = parseInt(document.getElementById('p-home-count')?.value || '10', 10);
  const diff = document.getElementById('p-home-diff')?.value || 'all';

  let pool = allPracticeQuestions.filter(q => {
    if (sub !== 'all' && q.subjectId !== sub) return false;
    if (diff === '1' && q.marks !== 1) return false;
    if (diff === '2' && q.marks !== 2) return false;
    return true;
  });

  if (pool.length === 0) pool = allPracticeQuestions;

  // Shuffle & Limit
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  filteredPracticeQuestions = pool.slice(0, count);
  currentPracticeIndex = 0;
  practiceUserAnswers = {};
  activePracticeSession = { type: 'custom', sub };
  startPracticeTimer();
  renderPracticeModule();
}

function startSubjectSession(subId) {
  let pool = allPracticeQuestions.filter(q => q.subjectId === subId);
  if (pool.length === 0) pool = allPracticeQuestions;

  filteredPracticeQuestions = pool;
  currentPracticeIndex = 0;
  practiceUserAnswers = {};
  activePracticeSession = { type: 'subject', subId };
  startPracticeTimer();
  renderPracticeModule();
}

function startRandomSession() {
  let pool = [...allPracticeQuestions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  filteredPracticeQuestions = pool.slice(0, 20);
  currentPracticeIndex = 0;
  practiceUserAnswers = {};
  activePracticeSession = { type: 'random' };
  startPracticeTimer();
  renderPracticeModule();
}

function startBookmarksSession() {
  const bks = StorageManager.getBookmarks();
  let pool = allPracticeQuestions.filter(q => bks.includes(q.id));
  if (pool.length === 0) {
    alert('No bookmarked questions saved yet! Bookmark questions during practice to revise them here.');
    return;
  }

  filteredPracticeQuestions = pool;
  currentPracticeIndex = 0;
  practiceUserAnswers = {};
  activePracticeSession = { type: 'bookmarks' };
  startPracticeTimer();
  renderPracticeModule();
}

function exitPracticeSession() {
  if (practiceTimerInterval) clearInterval(practiceTimerInterval);
  activePracticeSession = null;
  renderPracticeModule();
}

function startPracticeTimer() {
  if (practiceTimerInterval) clearInterval(practiceTimerInterval);
  practiceStartTime = Date.now();
  
  practiceTimerInterval = setInterval(() => {
    const timerEl = document.getElementById('practice-elapsed-timer');
    if (!timerEl) return;
    const elapsedSec = Math.floor((Date.now() - practiceStartTime) / 1000);
    const mins = Math.floor(elapsedSec / 60).toString().padStart(2, '0');
    const secs = (elapsedSec % 60).toString().padStart(2, '0');
    timerEl.textContent = `${mins}:${secs}`;
  }, 1000);
}

// 2. Active Question View (Centered Max-Width 840px)
function renderActiveQuestionView(container) {
  if (filteredPracticeQuestions.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align:center; padding:40px;">
        <div style="font-size:15px; font-weight:600; color:var(--text-sub);">No questions available for this practice session.</div>
        <button class="btn-primary" style="margin-top:14px; font-size:13px;" onclick="exitPracticeSession()">Back to Practice Center</button>
      </div>
    `;
    return;
  }

  const q = filteredPracticeQuestions[currentPracticeIndex];
  const isBookmarked = StorageManager.getBookmarks().includes(q.id);
  const userAns = practiceUserAnswers[currentPracticeIndex];
  const subjectName = q.subjectName || 'GATE CSE';

  // Diagram HTML
  let diagramHTML = '';
  if (q.diagram) {
    diagramHTML = `
      <div style="margin:16px 0; text-align:center; background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
        <img src="${q.diagram}" onerror="this.style.display='none'" alt="Question Diagram" style="max-width:100%; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,0.15);">
      </div>
    `;
  }

  // Clickable Radio Choice Options HTML
  let optionsHTML = '';
  if (q.type === 'MCQ' || q.type === 'MSQ') {
    optionsHTML = `<div style="display:flex; flex-direction:column; gap:10px; margin-top:16px;">`;
    q.options.forEach((opt, idx) => {
      const isSelected = userAns === opt;
      const optionLetter = String.fromCharCode(65 + idx);

      optionsHTML += `
        <div onclick="submitPracticeAnswer('${opt.replace(/'/g, "\\'")}')" style="display:flex; align-items:center; gap:14px; background:${isSelected ? 'var(--accent-subtle)' : 'var(--bg-surface-hover)'}; border:1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}; padding:12px 18px; border-radius:8px; cursor:pointer; transition:all 0.15s ease;">
          <div style="width:20px; height:20px; border-radius:50%; border:2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'}; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:${isSelected ? 'var(--accent-primary)' : 'transparent'};">
            ${isSelected ? `<div style="width:8px; height:8px; border-radius:50%; background:#ffffff;"></div>` : ''}
          </div>
          <span style="font-size:14px; font-weight:${isSelected ? '600' : '500'}; color:${isSelected ? 'var(--accent-primary)' : 'var(--text-main)'};">
            <strong>${optionLetter}.</strong> ${opt}
          </span>
        </div>
      `;
    });
    optionsHTML += `</div>`;
  } else if (q.type === 'NAT') {
    optionsHTML = `
      <div style="margin-top:16px; background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:16px; border-radius:8px;">
        <label style="font-weight:600; font-size:13px; display:block; margin-bottom:8px;">Numerical Answer Input:</label>
        <div style="display:flex; gap:10px;">
          <input type="number" step="any" id="practice-nat-val" value="${userAns || ''}" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:8px 12px; border-radius:6px; width:220px; font-size:14px;" placeholder="e.g. 15.5">
          <button class="btn-primary" style="font-size:13px; padding:8px 16px;" onclick="submitPracticeAnswer(document.getElementById('practice-nat-val').value)">Check Answer</button>
        </div>
      </div>
    `;
  }

  // Solution HTML
  let solutionHTML = '';
  if (userAns !== undefined) {
    const isCorrect = userAns === q.correct;
    solutionHTML = `
      <div style="margin-top:20px; padding:18px; border-radius:8px; border:1px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}; background:${isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'};">
        <div style="font-weight:700; font-size:15px; color:${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'};">
          ${isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
        </div>
        <div style="font-size:13px; margin-top:6px;">Your Selection: <strong>${userAns}</strong> | Correct Answer: <strong style="color:var(--color-success);">${q.correct}</strong></div>
        <div style="margin-top:12px; font-size:13px; border-top:1px solid var(--border-color); padding-top:10px;">
          <strong>Detailed Solution:</strong>
          <p style="margin-top:4px; white-space:pre-line; color:var(--text-sub); line-height:1.5;">${q.solution}</p>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Sticky Top Navigation Bar -->
    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:10px 16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; position:sticky; top:70px; z-index:100; backdrop-filter:blur(10px);">
      <button class="btn-secondary" style="font-size:12px; padding:5px 12px;" onclick="exitPracticeSession()">
        ← Exit Session
      </button>

      <div style="font-size:12px; color:var(--text-sub); font-weight:600;">
        Elapsed Time: <span id="practice-elapsed-timer" style="color:var(--accent-primary);">00:00</span>
      </div>
    </div>

    <!-- Centered Question Container (Max-Width 840px) -->
    <div class="card" style="max-width:840px; margin:0 auto; padding:24px;">
      
      <!-- Contextual Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; border-bottom:1px solid var(--border-color); padding-bottom:12px; margin-bottom:14px;">
        <div>
          <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">
            ${subjectName} • ${q.type} • ${q.marks} Mark
          </div>
          <div style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:var(--accent-primary); margin-top:2px;">
            Question ${currentPracticeIndex + 1} of ${filteredPracticeQuestions.length}
          </div>
        </div>

        <button class="btn-secondary" style="font-size:12px; padding:5px 12px;" onclick="toggleBookmarkCurrent('${q.id}')">
          ${isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>

      <!-- Question Text -->
      <div style="font-size:15px; font-weight:500; line-height:1.6; color:var(--text-main); margin-bottom:14px;">
        ${q.text}
      </div>

      <!-- Diagram -->
      ${diagramHTML}

      <!-- Options -->
      ${optionsHTML}

      <!-- Solution -->
      ${solutionHTML}

      <!-- Navigation & Action Controls -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:24px; padding-top:16px; border-top:1px solid var(--border-color);">
        <button class="btn-secondary" style="font-size:13px; padding:7px 16px;" onclick="prevPracticeQuestion()" ${currentPracticeIndex === 0 ? 'disabled' : ''}>← Previous</button>
        
        <div style="display:flex; gap:8px;">
          ${userAns !== undefined ? `<button class="btn-secondary" style="font-size:13px; padding:7px 14px;" onclick="clearPracticeAnswer()">Clear Choice</button>` : ''}
          <button class="btn-primary" style="font-size:13px; padding:7px 20px;" onclick="nextPracticeQuestion()" ${currentPracticeIndex >= filteredPracticeQuestions.length - 1 ? 'disabled' : ''}>Next Question ➔</button>
        </div>
      </div>

    </div>
  `;
}

function submitPracticeAnswer(ansVal) {
  if (!ansVal) return;
  practiceUserAnswers[currentPracticeIndex] = ansVal;
  renderPracticeModule();
}

function clearPracticeAnswer() {
  delete practiceUserAnswers[currentPracticeIndex];
  renderPracticeModule();
}

function toggleBookmarkCurrent(qId) {
  StorageManager.toggleBookmark(qId);
  renderPracticeModule();
}

function prevPracticeQuestion() {
  if (currentPracticeIndex > 0) {
    currentPracticeIndex--;
    renderPracticeModule();
  }
}

function nextPracticeQuestion() {
  if (currentPracticeIndex < filteredPracticeQuestions.length - 1) {
    currentPracticeIndex++;
    renderPracticeModule();
  }
}

window.renderPracticeModule = renderPracticeModule;
window.startConfiguredPractice = startConfiguredPractice;
window.startSubjectSession = startSubjectSession;
window.startRandomSession = startRandomSession;
window.startBookmarksSession = startBookmarksSession;
window.exitPracticeSession = exitPracticeSession;
window.submitPracticeAnswer = submitPracticeAnswer;
window.clearPracticeAnswer = clearPracticeAnswer;
window.toggleBookmarkCurrent = toggleBookmarkCurrent;
window.prevPracticeQuestion = prevPracticeQuestion;
window.nextPracticeQuestion = nextPracticeQuestion;

document.addEventListener('DOMContentLoaded', () => {
  initPracticeModule();
});
