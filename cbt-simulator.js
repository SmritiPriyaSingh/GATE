// CBT Exam Simulator Engine

let questionsData = [];
let cbtState = {
  active: false,
  questions: [],
  currentIndex: 0,
  userAnswers: {},
  statuses: {}, // 'not-visited', 'not-answered', 'answered', 'marked'
  timeRemaining: 180 * 60, // 3 hours in seconds
  timerInterval: null
};

async function loadQuestionsData() {
  try {
    const res = await fetch('questions-data.json');
    const data = await res.json();
    questionsData = data.questions;
  } catch (err) {
    console.error('Failed to load questions-data.json:', err);
  }
}

function startCBTExam(subjectFilter = 'all') {
  if (questionsData.length === 0) {
    alert('Questions database loading... Please try again in a moment.');
    return;
  }

  let selectedQuestions = questionsData;
  if (subjectFilter !== 'all') {
    selectedQuestions = questionsData.filter(q => q.subjectId === subjectFilter);
  }

  if (selectedQuestions.length === 0) {
    selectedQuestions = questionsData;
  }

  cbtState.active = true;
  cbtState.questions = selectedQuestions;
  cbtState.currentIndex = 0;
  cbtState.userAnswers = {};
  cbtState.statuses = {};
  cbtState.timeRemaining = 180 * 60; // 180 mins

  cbtState.questions.forEach((q, i) => {
    cbtState.statuses[i] = 'not-visited';
  });
  cbtState.statuses[0] = 'not-answered';

  document.getElementById('cbt-welcome-screen').style.display = 'none';
  document.getElementById('cbt-active-screen').style.display = 'grid';
  document.getElementById('cbt-results-screen').style.display = 'none';

  startCBTTimer();
  renderCBTQuestion(0);
  renderQuestionPalette();
}

function startCBTTimer() {
  if (cbtState.timerInterval) clearInterval(cbtState.timerInterval);

  cbtState.timerInterval = setInterval(() => {
    if (cbtState.timeRemaining <= 0) {
      clearInterval(cbtState.timerInterval);
      submitCBTExam(true);
      return;
    }
    cbtState.timeRemaining--;
    updateCBTTimerDisplay();
  }, 1000);
}

function updateCBTTimerDisplay() {
  const hrs = Math.floor(cbtState.timeRemaining / 3600);
  const mins = Math.floor((cbtState.timeRemaining % 3600) / 60);
  const secs = cbtState.timeRemaining % 60;
  const timerEl = document.getElementById('cbt-timer-display');
  if (timerEl) {
    timerEl.textContent = `⏱️ ${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

function renderCBTQuestion(index) {
  if (index < 0 || index >= cbtState.questions.length) return;
  cbtState.currentIndex = index;

  if (cbtState.statuses[index] === 'not-visited') {
    cbtState.statuses[index] = 'not-answered';
  }

  const q = cbtState.questions[index];
  const container = document.getElementById('cbt-question-container');
  if (!container) return;

  let optionsHTML = '';

  if (q.type === 'MCQ' || q.type === 'MSQ') {
    optionsHTML = `<div class="options-list">`;
    q.options.forEach((opt, optIdx) => {
      const isSelected = q.type === 'MCQ'
        ? cbtState.userAnswers[index] === opt
        : (cbtState.userAnswers[index] || []).includes(opt);

      optionsHTML += `
        <div class="option-item ${isSelected ? 'selected' : ''}" onclick="selectCBTOption(${index}, '${opt.replace(/'/g, "\\'")}', '${q.type}')">
          <input type="${q.type === 'MCQ' ? 'radio' : 'checkbox'}" name="opt_${index}" ${isSelected ? 'checked' : ''}>
          <span><strong>(${String.fromCharCode(65 + optIdx)})</strong> ${opt}</span>
        </div>
      `;
    });
    optionsHTML += `</div>`;
  } else if (q.type === 'NAT') {
    const val = cbtState.userAnswers[index] || '';
    optionsHTML = `
      <div style="margin-top:20px;">
        <label style="font-weight:600; font-size:14px; display:block; margin-bottom:8px;">Enter Numerical Answer:</label>
        <input type="number" step="any" class="nat-input" id="nat-answer-input" value="${val}" oninput="handleNATInput(${index}, this.value)" placeholder="e.g. 13.67">
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display:flex; justify-between; align-items:center; margin-bottom:12px;">
      <span class="badge badge-purple">Question ${index + 1} of ${cbtState.questions.length}</span>
      <span style="font-size:13px; color:var(--text-secondary);">Type: <strong>${q.type}</strong> • Marks: <strong>+${q.marks} / -${q.negative}</strong></span>
    </div>
    <div style="font-size:13px; color:var(--accent-primary); font-weight:600; margin-bottom:14px;">${q.subjectName} &bull; ${q.topic}</div>
    <div style="font-size:16px; line-height:1.7; font-weight:500;">
      ${formatQuestionText(q.text)}
    </div>
    ${optionsHTML}
  `;

  renderQuestionPalette();
}

function formatQuestionText(text) {
  // Convert markdown code blocks
  return text.replace(/```c([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
}

function selectCBTOption(qIndex, optionVal, qType) {
  if (qType === 'MCQ') {
    cbtState.userAnswers[qIndex] = optionVal;
  } else if (qType === 'MSQ') {
    if (!cbtState.userAnswers[qIndex]) cbtState.userAnswers[qIndex] = [];
    const arr = cbtState.userAnswers[qIndex];
    const existingIdx = arr.indexOf(optionVal);
    if (existingIdx > -1) {
      arr.splice(existingIdx, 1);
    } else {
      arr.push(optionVal);
    }
  }

  if (cbtState.statuses[qIndex] !== 'marked') {
    cbtState.statuses[qIndex] = 'answered';
  }
  renderCBTQuestion(qIndex);
}

function handleNATInput(qIndex, val) {
  if (val.trim() !== '') {
    cbtState.userAnswers[qIndex] = val.trim();
    if (cbtState.statuses[qIndex] !== 'marked') {
      cbtState.statuses[qIndex] = 'answered';
    }
  } else {
    delete cbtState.userAnswers[qIndex];
    if (cbtState.statuses[qIndex] !== 'marked') {
      cbtState.statuses[qIndex] = 'not-answered';
    }
  }
  renderQuestionPalette();
}

function saveAndNext() {
  if (cbtState.userAnswers[cbtState.currentIndex] !== undefined) {
    if (cbtState.statuses[cbtState.currentIndex] !== 'marked') {
      cbtState.statuses[cbtState.currentIndex] = 'answered';
    }
  } else {
    if (cbtState.statuses[cbtState.currentIndex] !== 'marked') {
      cbtState.statuses[cbtState.currentIndex] = 'not-answered';
    }
  }

  if (cbtState.currentIndex < cbtState.questions.length - 1) {
    renderCBTQuestion(cbtState.currentIndex + 1);
  } else {
    renderQuestionPalette();
  }
}

function markForReviewAndNext() {
  cbtState.statuses[cbtState.currentIndex] = 'marked';
  if (cbtState.currentIndex < cbtState.questions.length - 1) {
    renderCBTQuestion(cbtState.currentIndex + 1);
  } else {
    renderQuestionPalette();
  }
}

function clearCBTResponse() {
  delete cbtState.userAnswers[cbtState.currentIndex];
  cbtState.statuses[cbtState.currentIndex] = 'not-answered';
  renderCBTQuestion(cbtState.currentIndex);
}

function renderQuestionPalette() {
  const container = document.getElementById('question-palette-grid');
  if (!container) return;

  container.innerHTML = '';

  cbtState.questions.forEach((q, i) => {
    const btn = document.createElement('button');
    btn.className = `palette-btn ${cbtState.statuses[i]} ${i === cbtState.currentIndex ? 'current' : ''}`;
    btn.textContent = i + 1;
    btn.onclick = () => renderCBTQuestion(i);
    container.appendChild(btn);
  });
}

function submitCBTExam(autoSubmitted = false) {
  if (!autoSubmitted) {
    if (!confirm('Are you sure you want to submit your GATE CBT test?')) return;
  }

  if (cbtState.timerInterval) clearInterval(cbtState.timerInterval);

  let totalMarksScored = 0;
  let maxMarks = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  const detailedReport = [];

  cbtState.questions.forEach((q, i) => {
    maxMarks += q.marks;
    const userAns = cbtState.userAnswers[i];
    let isCorrect = false;

    if (userAns === undefined || userAns === '' || (Array.isArray(userAns) && userAns.length === 0)) {
      unattemptedCount++;
    } else {
      if (q.type === 'MCQ') {
        if (userAns === q.correct) {
          isCorrect = true;
          totalMarksScored += q.marks;
          correctCount++;
        } else {
          totalMarksScored -= q.negative;
          wrongCount++;
        }
      } else if (q.type === 'NAT') {
        const numAns = parseFloat(userAns);
        const correctNum = parseFloat(q.correct);
        if (!isNaN(numAns) && Math.abs(numAns - correctNum) <= 0.1) {
          isCorrect = true;
          totalMarksScored += q.marks;
          correctCount++;
        } else {
          wrongCount++;
        }
      } else if (q.type === 'MSQ') {
        const expectedArr = Array.isArray(q.correct) ? q.correct : [q.correct];
        const userArr = Array.isArray(userAns) ? userAns : [userAns];
        if (expectedArr.length === userArr.length && expectedArr.every(val => userArr.includes(val))) {
          isCorrect = true;
          totalMarksScored += q.marks;
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    }

    detailedReport.push({ question: q, userAns, isCorrect });
  });

  // Save result to localStorage
  const testHistory = JSON.parse(localStorage.getItem('gate2027_test_history')) || [];
  testHistory.push({
    date: new Date().toLocaleDateString(),
    score: Math.max(0, totalMarksScored).toFixed(2),
    maxMarks,
    accuracy: (correctCount + wrongCount) > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0,
    correctCount,
    wrongCount,
    unattemptedCount
  });
  localStorage.setItem('gate2027_test_history', JSON.stringify(testHistory));

  renderCBTResults(totalMarksScored, maxMarks, correctCount, wrongCount, unattemptedCount, detailedReport);
  if (window.renderDashboardStats) window.renderDashboardStats();
}

function renderCBTResults(score, maxMarks, correct, wrong, unattempted, report) {
  document.getElementById('cbt-active-screen').style.display = 'none';
  const resScreen = document.getElementById('cbt-results-screen');
  resScreen.style.display = 'block';

  const pct = Math.max(0, Math.round((score / maxMarks) * 100));

  resScreen.innerHTML = `
    <div class="glass-card" style="margin-bottom:24px;">
      <h2 class="section-title">📊 GATE Test Performance Summary</h2>
      <div class="stats-grid" style="margin-top:20px;">
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <h4>Total Score</h4>
            <div class="stat-number" style="color:var(--accent-primary);">${score.toFixed(2)} / ${maxMarks}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <h4>Accuracy</h4>
            <div class="stat-number" style="color:var(--color-success);">${(correct + wrong) > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0}%</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <h4>Correct Answers</h4>
            <div class="stat-number" style="color:var(--color-success);">${correct}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">❌</div>
          <div class="stat-info">
            <h4>Incorrect Answers</h4>
            <div class="stat-number" style="color:var(--color-danger);">${wrong}</div>
          </div>
        </div>
      </div>
      <div style="margin-top:16px;">
        <button class="btn-primary" onclick="startCBTExam('all')">🔄 Take Another Mock Test</button>
      </div>
    </div>

    <h3 class="section-title">🔍 Step-by-Step Solutions & Detailed Review</h3>
    <div style="display:flex; flex-direction:column; gap:16px;">
      ${report.map((item, idx) => `
        <div class="glass-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span class="badge ${item.isCorrect ? 'badge-purple' : 'badge-purple'}" style="background:${item.isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color:${item.isCorrect ? 'var(--color-success)' : 'var(--color-danger)'};">
              Question ${idx + 1} • ${item.isCorrect ? 'CORRECT (+ ' + item.question.marks + ')' : item.userAns ? 'WRONG (- ' + item.question.negative + ')' : 'UNATTEMPTED'}
            </span>
            <span style="font-size:12px; color:var(--text-muted);">${item.question.subjectName}</span>
          </div>
          <div style="font-weight:600; font-size:15px;">${item.question.text}</div>
          <div style="margin-top:12px; font-size:14px;">
            <div>Your Answer: <strong>${item.userAns || 'None'}</strong></div>
            <div>Correct Answer: <strong style="color:var(--color-success);">${Array.isArray(item.question.correct) ? item.question.correct.join(', ') : item.question.correct}</strong></div>
          </div>
          <div class="solution-card">
            <strong style="color:var(--color-success);">💡 Solution & Explanation:</strong>
            <p style="margin-top:6px; white-space:pre-line;">${item.question.solution}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Scientific Calculator Popup Modal
function toggleCalculator() {
  const modal = document.getElementById('calc-modal-overlay');
  if (modal) {
    modal.classList.toggle('active');
  }
}

let calcExpr = '';
function calcInput(char) {
  const disp = document.getElementById('calc-display-screen');
  if (!disp) return;

  if (char === 'C') {
    calcExpr = '';
  } else if (char === '=') {
    try {
      calcExpr = eval(calcExpr.replace(/×/g, '*').replace(/÷/g, '/')).toString();
    } catch (e) {
      calcExpr = 'Error';
    }
  } else {
    calcExpr += char;
  }
  disp.textContent = calcExpr || '0';
}

document.addEventListener('DOMContentLoaded', () => {
  loadQuestionsData();
});
