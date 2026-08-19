// Topic Practice Module

let allPracticeQuestions = [];
let filteredPracticeQuestions = [];
let currentPracticeIndex = 0;
let practiceUserAnswers = {};

async function initPracticeModule() {
  try {
    const res = await fetch('pyq-database.json');
    const data = await res.json();
    allPracticeQuestions = data.questions;
    setupPracticeFilters();
    filterPracticeQuestions();
  } catch (e) {
    console.error('Failed to load pyq-database.json for practice:', e);
  }
}

function setupPracticeFilters() {
  const subjectSelect = document.getElementById('practice-subject-select');
  if (!subjectSelect) return;

  subjectSelect.innerHTML = `
    <option value="all">All Subjects</option>
    <option value="em">Engineering Mathematics</option>
    <option value="dl">Digital Logic</option>
    <option value="coa">Computer Organization & Architecture</option>
    <option value="pds">Programming & Data Structures</option>
    <option value="algo">Algorithms</option>
    <option value="toc">Theory of Computation</option>
    <option value="cd">Compiler Design</option>
    <option value="os">Operating Systems</option>
    <option value="dbms">Databases</option>
    <option value="cn">Computer Networks</option>
    <option value="ga">General Aptitude</option>
  `;

  subjectSelect.addEventListener('change', filterPracticeQuestions);
  document.getElementById('practice-type-select')?.addEventListener('change', filterPracticeQuestions);
}

function filterPracticeQuestions() {
  const sub = document.getElementById('practice-subject-select')?.value || 'all';
  const type = document.getElementById('practice-type-select')?.value || 'all';

  filteredPracticeQuestions = allPracticeQuestions.filter(q => {
    const matchSub = sub === 'all' || q.subjectId === sub;
    const matchType = type === 'all' || q.type === type;
    return matchSub && matchType;
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

  let optionsHTML = '';
  if (q.type === 'MCQ' || q.type === 'MSQ') {
    optionsHTML = `<div class="options-list">`;
    q.options.forEach((opt, idx) => {
      const isSelected = userAns === opt;
      optionsHTML += `
        <div class="option-item ${isSelected ? 'selected' : ''}" onclick="submitPracticeAnswer('${opt.replace(/'/g, "\\'")}')">
          <span><strong>(${String.fromCharCode(65 + idx)})</strong> ${opt}</span>
        </div>
      `;
    });
    optionsHTML += `</div>`;
  } else if (q.type === 'NAT') {
    optionsHTML = `
      <div style="margin-top:20px;">
        <label style="font-weight:600; font-size:14px; display:block; margin-bottom:8px;">Your Numerical Answer:</label>
        <input type="number" step="any" class="nat-input" id="practice-nat-val" value="${userAns || ''}" placeholder="e.g. 15.5">
        <button class="btn-primary" style="margin-left:12px;" onclick="submitPracticeAnswer(document.getElementById('practice-nat-val').value)">Submit Answer</button>
      </div>
    `;
  }

  let solutionHTML = '';
  if (userAns !== undefined) {
    const isCorrect = userAns === q.correct;
    solutionHTML = `
      <div class="solution-card" style="border-color:${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}; background:${isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};">
        <div style="font-weight:700; font-size:16px; color:${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}; margin-bottom:8px;">
          ${isCorrect ? '🎉 Correct Answer!' : '❌ Incorrect Answer'}
        </div>
        <div>Your Answer: <strong>${userAns}</strong></div>
        <div>Correct Answer: <strong style="color:var(--color-success);">${q.correct}</strong></div>
        <hr style="border:0; border-top:1px solid var(--border-color); margin:12px 0;">
        <strong>💡 Step-by-Step Solution & Concept:</strong>
        <p style="margin-top:6px; white-space:pre-line;">${q.solution}</p>
        <div style="margin-top:10px; font-size:12px; color:var(--text-secondary);">
          Concept: ${q.concept} &bull; Difficulty: ${q.difficulty}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <span class="badge badge-purple">Question ${currentPracticeIndex + 1} of ${filteredPracticeQuestions.length}</span>
      <button class="btn-secondary" onclick="toggleBookmarkCurrent('${q.id}')" style="padding:4px 12px; font-size:12px;">
        ${isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark'}
      </button>
    </div>
    <div style="font-size:13px; color:var(--accent-primary); font-weight:600;">${q.subjectName} &bull; ${q.type} (${q.marks} Mark)</div>
    <div style="font-size:16px; font-weight:500; margin-top:10px; line-height:1.7;">
      ${q.text}
    </div>
    ${optionsHTML}
    ${solutionHTML}
    <div style="display:flex; justify-content:space-between; margin-top:24px;">
      <button class="btn-secondary" onclick="prevPracticeQuestion()" ${currentPracticeIndex === 0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn-primary" onclick="nextPracticeQuestion()" ${currentPracticeIndex >= filteredPracticeQuestions.length - 1 ? 'disabled' : ''}>Next →</button>
    </div>
  `;
}

function submitPracticeAnswer(ansVal) {
  if (!ansVal) return;
  practiceUserAnswers[currentPracticeIndex] = ansVal;
  renderPracticeQuestion();
}

function toggleBookmarkCurrent(qId) {
  const status = StorageManager.toggleBookmark(qId);
  alert(status ? '⭐ Question bookmarked for revision!' : 'Removed from bookmarks.');
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

document.addEventListener('DOMContentLoaded', () => {
  initPracticeModule();
});
