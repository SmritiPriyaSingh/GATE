// Practice Engine - Centered Reading Layout with Learning Workspace & Clean Radio Options

let allPracticeQuestions = [];
let filteredPracticeQuestions = [];
let currentPracticeIndex = 0;
let practiceUserAnswers = {};
let practiceStartTime = Date.now();
let practiceTimerInterval = null;

async function initPracticeModule() {
  try {
    const res = await fetch('pyq-database.json');
    const data = await res.json();
    allPracticeQuestions = data.questions;
    setupPracticeFilters();
    filterPracticeQuestions();
    startPracticeTimer();
  } catch (e) {
    console.error('Failed to load pyq-database.json for practice:', e);
  }
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

function setupPracticeFilters() {
  const subjectSelect = document.getElementById('practice-subject-select');
  if (!subjectSelect) return;

  subjectSelect.innerHTML = `
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
  `;

  subjectSelect.addEventListener('change', filterPracticeQuestions);
}

function filterPracticeQuestions() {
  const sub = document.getElementById('practice-subject-select')?.value || 'all';

  filteredPracticeQuestions = allPracticeQuestions.filter(q => {
    return sub === 'all' || q.subjectId === sub;
  });

  currentPracticeIndex = 0;
  practiceUserAnswers = {};
  renderPracticeQuestion();
}

function randomizePracticeQuestions() {
  for (let i = filteredPracticeQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredPracticeQuestions[i], filteredPracticeQuestions[j]] = [filteredPracticeQuestions[j], filteredPracticeQuestions[i]];
  }
  currentPracticeIndex = 0;
  practiceUserAnswers = {};
  renderPracticeQuestion();
}

function renderPracticeQuestion() {
  const container = document.getElementById('practice-question-card');
  if (!container) return;

  if (filteredPracticeQuestions.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">No questions found matching your filter criteria.</div>`;
    return;
  }

  const q = filteredPracticeQuestions[currentPracticeIndex];
  const isBookmarked = StorageManager.getBookmarks().includes(q.id);
  const userAns = practiceUserAnswers[currentPracticeIndex];

  // Subject title for contextual header (e.g. Operating Systems • Question 5 of 38)
  const subjectName = q.subjectName || 'GATE CSE';

  // 1. Diagram HTML
  let diagramHTML = '';
  if (q.diagram) {
    diagramHTML = `
      <div style="margin:16px 0; text-align:center; background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
        <img src="${q.diagram}" onerror="this.style.display='none'" alt="Question Diagram" style="max-width:100%; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,0.15);">
      </div>
    `;
  }

  // 2. Clickable Radio Choice Options HTML
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

  // 3. Solution HTML
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

  // Centered Reading Layout (max-width: 840px)
  container.innerHTML = `
    <div style="max-width:840px; margin:0 auto;">
      
      <!-- Top Card Header: Contextual Counter & Learning Actions -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; border-bottom:1px solid var(--border-color); padding-bottom:12px; margin-bottom:14px;">
        <div>
          <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">
            ${subjectName} • ${q.type} • ${q.marks} Mark
          </div>
          <div style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:var(--accent-primary); margin-top:2px;">
            Question ${currentPracticeIndex + 1} of ${filteredPracticeQuestions.length}
          </div>
        </div>

        <!-- Learning Tools (Bookmark, Elapsed Time) -->
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="font-size:12px; color:var(--text-sub); background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:4px 10px; border-radius:6px; font-weight:600;">
            Elapsed Time: <span id="practice-elapsed-timer" style="color:var(--accent-primary);">00:00</span>
          </div>

          <button class="btn-secondary" style="font-size:12px; padding:5px 12px;" onclick="toggleBookmarkCurrent('${q.id}')">
            ${isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>
      </div>

      <!-- Question Text (Readable Font Size & Line Height) -->
      <div style="font-size:15px; font-weight:500; line-height:1.6; color:var(--text-main); margin-bottom:14px;">
        ${q.text}
      </div>

      <!-- Diagram Image (if present) -->
      ${diagramHTML}

      <!-- Options -->
      ${optionsHTML}

      <!-- Solution View -->
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
  renderPracticeQuestion();
}

function clearPracticeAnswer() {
  delete practiceUserAnswers[currentPracticeIndex];
  renderPracticeQuestion();
}

function toggleBookmarkCurrent(qId) {
  StorageManager.toggleBookmark(qId);
  renderPracticeQuestion();
}

function prevPracticeQuestion() {
  if (currentPracticeIndex > 0) {
    currentPracticeIndex--;
    renderPracticeQuestion();
  }
}

function nextPracticeQuestion() {
  if (currentPracticeIndex < filteredPracticeQuestions.length - 1) {
    currentPracticeIndex++;
    renderPracticeQuestion();
  }
}

window.renderPracticeQuestion = renderPracticeQuestion;
window.submitPracticeAnswer = submitPracticeAnswer;
window.clearPracticeAnswer = clearPracticeAnswer;
window.toggleBookmarkCurrent = toggleBookmarkCurrent;
window.prevPracticeQuestion = prevPracticeQuestion;
window.nextPracticeQuestion = nextPracticeQuestion;

document.addEventListener('DOMContentLoaded', () => {
  initPracticeModule();
});
