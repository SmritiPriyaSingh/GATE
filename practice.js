// Topic Practice Module with Official Paper Diagram Viewer

let allPracticeQuestions = [];
let filteredPracticeQuestions = [];
let currentPracticeIndex = 0;
let practiceUserAnswers = {};
let showDiagramMode = false;

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

  let optionsHTML = '';
  if (q.type === 'MCQ' || q.type === 'MSQ') {
    optionsHTML = `<div style="display:flex; flex-direction:column; gap:10px; margin-top:16px;">`;
    q.options.forEach((opt, idx) => {
      const isSelected = userAns === opt;
      optionsHTML += `
        <div style="background:var(--bg-surface-hover); border:1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}; padding:12px 16px; border-radius:8px; cursor:pointer;" onclick="submitPracticeAnswer('${opt.replace(/'/g, "\\'")}')">
          <span><strong>(${String.fromCharCode(65 + idx)})</strong> ${opt}</span>
        </div>
      `;
    });
    optionsHTML += `</div>`;
  } else if (q.type === 'NAT') {
    optionsHTML = `
      <div style="margin-top:16px;">
        <label style="font-weight:600; font-size:14px; display:block; margin-bottom:6px;">Numerical Answer:</label>
        <input type="number" step="any" id="practice-nat-val" value="${userAns || ''}" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:10px 14px; border-radius:8px; width:200px;" placeholder="e.g. 15.5">
        <button class="btn-primary" style="margin-left:10px;" onclick="submitPracticeAnswer(document.getElementById('practice-nat-val').value)">Submit Answer</button>
      </div>
    `;
  }

  let diagramHTML = '';
  const pageNum = Math.ceil((q.qNum || 1) / 3);
  const paperFolder = `CS${q.year}`;
  
  if (showDiagramMode) {
    diagramHTML = `
      <div class="diagram-viewer-card">
        <div style="font-size:12px; color:var(--text-sub); margin-bottom:8px; font-weight:600;">
          📷 Official GATE ${q.year} Question View (Full Paper Page With Diagrams & Circuits)
        </div>
        <img src="assets/papers/${paperFolder}/page_${pageNum}.png" onerror="this.onerror=null; this.src='assets/papers/CS2026s1/page_1.png';" alt="GATE Question Diagram">
      </div>
    `;
  }

  let solutionHTML = '';
  if (userAns !== undefined) {
    const isCorrect = userAns === q.correct;
    solutionHTML = `
      <div style="margin-top:16px; padding:16px; border-radius:8px; border:1px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}; background:${isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'};">
        <div style="font-weight:700; font-size:15px; color:${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'};">
          ${isCorrect ? '🎉 Correct Answer!' : '❌ Incorrect Answer'}
        </div>
        <div style="font-size:14px; margin-top:6px;">Your Answer: <strong>${userAns}</strong> | Correct Answer: <strong style="color:var(--color-success);">${q.correct}</strong></div>
        <div style="margin-top:10px; font-size:14px;">
          <strong>💡 Step-by-Step Solution:</strong>
          <p style="margin-top:4px; white-space:pre-line;">${q.solution}</p>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <span style="font-size:13px; font-weight:600; color:var(--accent-primary);">Question ${currentPracticeIndex + 1} of ${filteredPracticeQuestions.length} &bull; GATE ${q.year}</span>
      <div style="display:flex; gap:10px;">
        <button class="btn-secondary" style="font-size:12px; padding:4px 10px;" onclick="toggleDiagramMode()">
          ${showDiagramMode ? '📄 Hide Diagram Page' : '📷 View Diagram / Official Page'}
        </button>
        <button class="btn-secondary" style="font-size:12px; padding:4px 10px;" onclick="toggleBookmarkCurrent('${q.id}')">
          ${isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark'}
        </button>
      </div>
    </div>
    <div style="font-size:13px; color:var(--text-sub); font-weight:600;">${q.subjectName} &bull; ${q.type} (${q.marks} Mark)</div>
    <div style="font-size:15px; font-weight:500; margin-top:10px; line-height:1.6;">
      ${q.text}
    </div>
    ${optionsHTML}
    ${diagramHTML}
    ${solutionHTML}
    <div style="display:flex; justify-content:space-between; margin-top:20px;">
      <button class="btn-secondary" onclick="prevPracticeQuestion()" ${currentPracticeIndex === 0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn-primary" onclick="nextPracticeQuestion()" ${currentPracticeIndex >= filteredPracticeQuestions.length - 1 ? 'disabled' : ''}>Next →</button>
    </div>
  `;
}

function toggleDiagramMode() {
  showDiagramMode = !showDiagramMode;
  renderPracticeQuestion();
}

function submitPracticeAnswer(ansVal) {
  if (!ansVal) return;
  practiceUserAnswers[currentPracticeIndex] = ansVal;
  renderPracticeQuestion();
}

function toggleBookmarkCurrent(qId) {
  const status = StorageManager.toggleBookmark(qId);
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
