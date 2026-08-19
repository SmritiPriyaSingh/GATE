// CBT Exam Simulator Engine with Strict Exam Lock & Quit System

let questionsData = [];
let cbtState = {
  active: false,
  questions: [],
  currentIndex: 0,
  userAnswers: {},
  statuses: {},
  timeRemaining: 180 * 60,
  timerInterval: null
};

async function loadQuestionsData() {
  try {
    const res = await fetch('pyq-database.json');
    const data = await res.json();
    questionsData = data.questions;
  } catch (err) {
    console.error('Failed to load pyq-database.json:', err);
  }
}

function startCBTExam(type = 'full') {
  if (questionsData.length === 0) {
    alert('Questions database loading... Please try again in a moment.');
    return;
  }

  let selectedQuestions = [...questionsData];
  
  if (type === 'mini') {
    for (let i = selectedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]];
    }
    selectedQuestions = selectedQuestions.slice(0, 20);
    cbtState.timeRemaining = 60 * 60; // 1 hour
  } else {
    // Full Mock (65 Questions, 3 Hours)
    if (selectedQuestions.length > 65) {
      selectedQuestions = selectedQuestions.slice(0, 65);
    }
    cbtState.timeRemaining = 180 * 60; // 3 hours
  }

  cbtState.active = true;
  cbtState.questions = selectedQuestions;
  cbtState.currentIndex = 0;
  cbtState.userAnswers = {};
  cbtState.statuses = {};

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

function quitCBTExam() {
  if (!cbtState.active) return true;

  if (confirm('⚠️ Exam in Progress! Are you sure you want to Quit? Your test progress will be lost.')) {
    if (cbtState.timerInterval) clearInterval(cbtState.timerInterval);
    cbtState.active = false;
    cbtState.userAnswers = {};
    
    document.getElementById('cbt-active-screen').style.display = 'none';
    document.getElementById('cbt-welcome-screen').style.display = 'block';
    document.getElementById('cbt-results-screen').style.display = 'none';
    return true;
  }
  return false;
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

  // 1. Diagram HTML (rendered inline if present)
  let diagramHTML = '';
  if (q.diagram) {
    diagramHTML = `
      <div style="margin:16px 0; text-align:center; background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
        <img src="${q.diagram}" onerror="this.style.display='none'" alt="Question Diagram" style="max-width:100%; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,0.15);">
      </div>
    `;
  }

  // 2. Options HTML
  let optionsHTML = '';

  if (q.type === 'MCQ' || q.type === 'MSQ') {
    optionsHTML = `<div style="display:flex; flex-direction:column; gap:10px; margin-top:16px;">`;
    q.options.forEach((opt, optIdx) => {
      const isSelected = q.type === 'MCQ'
        ? cbtState.userAnswers[index] === opt
        : (cbtState.userAnswers[index] || []).includes(opt);

      optionsHTML += `
        <div style="background:var(--bg-surface-hover); border:1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}; padding:12px 16px; border-radius:8px; cursor:pointer;" onclick="selectCBTOption(${index}, '${opt.replace(/'/g, "\\'")}', '${q.type}')">
          <input type="${q.type === 'MCQ' ? 'radio' : 'checkbox'}" name="opt_${index}" ${isSelected ? 'checked' : ''}>
          <span><strong>(${String.fromCharCode(65 + optIdx)})</strong> ${opt}</span>
        </div>
      `;
    });
    optionsHTML += `</div>`;
  } else if (q.type === 'NAT') {
    const val = cbtState.userAnswers[index] || '';
    optionsHTML = `
      <div style="margin-top:16px;">
        <label style="font-weight:600; font-size:14px; display:block; margin-bottom:6px;">Enter Numerical Answer:</label>
        <input type="number" step="any" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:10px 14px; border-radius:8px; width:200px;" value="${val}" oninput="handleNATInput(${index}, this.value)" placeholder="e.g. 13.67">
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <span style="font-size:13px; font-weight:600; color:var(--accent-primary);">Question ${index + 1} of ${cbtState.questions.length}</span>
      <span style="font-size:12px; color:var(--text-sub);">Type: <strong>${q.type}</strong> &bull; Marks: <strong>+${q.marks} / -${q.negative}</strong></span>
    </div>
    <div style="font-size:13px; color:var(--accent-primary); font-weight:600; margin-bottom:10px;">${q.subjectName} &bull; ${q.topic}</div>
    
    <div style="font-size:15px; line-height:1.6; font-weight:500;">
      ${q.text}
    </div>

    ${diagramHTML}
    ${optionsHTML}
  `;

  renderQuestionPalette();
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

function prevCBTQuestion() {
  if (cbtState.currentIndex > 0) {
    renderCBTQuestion(cbtState.currentIndex - 1);
  }
}

function markForReviewAndNext() {
  if (cbtState.userAnswers[cbtState.currentIndex] !== undefined) {
    cbtState.statuses[cbtState.currentIndex] = 'marked';
  } else {
    cbtState.statuses[cbtState.currentIndex] = 'marked';
  }

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

function formatQuestionText(text) {
  if (!text) return '';
  let clean = text.replace(/^Q\.\d+\s*[–\-]\s*Q\.\d+\s+Carry\s+\w+\s+marks?\s+Each/i, '').trim();
  clean = clean.replace(/```c([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  return clean;
}

function renderQuestionPalette() {
  const container = document.getElementById('question-palette-grid');
  if (!container) return;

  container.innerHTML = '';

  cbtState.questions.forEach((q, i) => {
    const btn = document.createElement('button');
    btn.className = `cbt-btn ${cbtState.statuses[i]} ${i === cbtState.currentIndex ? 'current' : ''}`;
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
  cbtState.active = false;

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

  resScreen.innerHTML = `
    <div class="card" style="margin-bottom:24px;">
      <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; margin-bottom:16px;">📊 Test Results</h2>
      <div class="stats-grid">
        <div class="card stat-box">
          <div class="stat-icon">🏆</div>
          <div>
            <div style="font-size:12px; color:var(--text-muted);">Score</div>
            <div class="stat-val" style="color:var(--accent-primary);">${score.toFixed(2)} / ${maxMarks}</div>
          </div>
        </div>
        <div class="card stat-box">
          <div class="stat-icon" style="color:var(--color-success);">🎯</div>
          <div>
            <div style="font-size:12px; color:var(--text-muted);">Accuracy</div>
            <div class="stat-val" style="color:var(--color-success);">${(correct + wrong) > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0}%</div>
          </div>
        </div>
      </div>
      <button class="btn-primary" onclick="startCBTExam('all')">Take Another Mock Test</button>
    </div>

    <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-bottom:16px;">Detailed Solutions</h3>
    <div style="display:flex; flex-direction:column; gap:16px;">
      ${report.map((item, idx) => `
        <div class="card">
          <div style="font-weight:600; font-size:15px; margin-bottom:8px;">Q${idx + 1}. ${item.question.text}</div>
          ${item.question.diagram ? `<div style="text-align:center; margin:10px 0;"><img src="${item.question.diagram}" style="max-width:100%; border-radius:6px;"></div>` : ''}
          <div style="font-size:14px; margin-top:8px;">Your Answer: <strong>${item.userAns || 'None'}</strong> | Correct Answer: <strong style="color:var(--color-success);">${Array.isArray(item.question.correct) ? item.question.correct.join(', ') : item.question.correct}</strong></div>
          <div style="margin-top:10px; font-size:14px; background:var(--bg-surface-hover); padding:12px; border-radius:8px;">
            <strong>Solution:</strong>
            <p style="margin-top:4px; white-space:pre-line;">${item.question.solution}</p>
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

window.cbtState = cbtState;
window.quitCBTExam = quitCBTExam;

document.addEventListener('DOMContentLoaded', () => {
  loadQuestionsData();
});
