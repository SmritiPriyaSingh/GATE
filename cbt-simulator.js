// CBT Exam Simulator Engine with Official GATE Interface, Pre-Exam Instructions & State Resume

let questionsData = [];
let cbtState = {
  active: false,
  questions: [],
  currentIndex: 0,
  userAnswers: {},
  statuses: {},
  timeRemaining: 180 * 60,
  timerInterval: null,
  examType: 'full'
};

let pendingExamConfig = null; // Stored config waiting for pre-exam instructions modal confirmation

async function loadQuestionsData() {
  try {
    const res = await fetch('pyq-database.json');
    const data = await res.json();
    questionsData = data.questions;
    renderCBTWelcomeHub();
  } catch (err) {
    console.error('Failed to load pyq-database.json:', err);
  }
}

// 1. CBT Welcome Hub (With Live Attempt History, Statistics Bar & Resume Card)
function renderCBTWelcomeHub() {
  const container = document.getElementById('cbt-welcome-screen');
  if (!container) return;

  const testHistory = JSON.parse(localStorage.getItem('gate2027_test_history')) || [];
  const fullMocksCount = testHistory.filter(t => t.maxMarks >= 60).length;
  const miniMocksCount = testHistory.filter(t => t.maxMarks < 60).length;
  
  const scores = testHistory.map(t => parseFloat(t.score) || 0);
  const bestScore = scores.length > 0 ? Math.max(...scores).toFixed(2) : '0.00';
  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '0.00';
  
  // Estimate AIR Rank
  let rankEst = 'N/A';
  if (scores.length > 0) {
    const topScore = parseFloat(bestScore);
    if (topScore >= 75) rankEst = 'AIR 1 - 50 (Top 0.1%)';
    else if (topScore >= 60) rankEst = 'AIR 51 - 300 (Top 0.5%)';
    else if (topScore >= 45) rankEst = 'AIR 301 - 1200 (Top 2%)';
    else rankEst = 'AIR 1200+';
  }

  // Resume Card HTML (If exam active)
  let resumeHTML = '';
  if (cbtState.active) {
    const hrs = Math.floor(cbtState.timeRemaining / 3600);
    const mins = Math.floor((cbtState.timeRemaining % 3600) / 60);

    resumeHTML = `
      <div class="card" style="margin-bottom:20px; padding:20px; border-left:4px solid var(--accent-primary); background:var(--accent-subtle);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
          <div>
            <div style="font-size:11px; font-weight:700; color:var(--accent-primary); text-transform:uppercase;">Exam In Progress</div>
            <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-top:2px;">Resume Last Exam Session</h3>
            <div style="font-size:13px; color:var(--text-sub); margin-top:4px;">
              Question <strong>${cbtState.currentIndex + 1} of ${cbtState.questions.length}</strong> &bull; Time Remaining: <strong style="color:var(--accent-primary);">${hrs}h ${mins}m</strong>
            </div>
          </div>
          <button class="btn-primary" style="font-size:13px; padding:10px 20px;" onclick="resumeActiveExam()">▶ Resume Exam Session</button>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    ${resumeHTML}

    <!-- Statistics Header Bar -->
    <div class="card" style="margin-bottom:20px; padding:20px 24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div>
          <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; margin-bottom:2px;">GATE CBT Exam Simulator Center</h2>
          <p style="color:var(--text-sub); font-size:13px;">Simulate official GATE Computer Science examination under strict exam conditions.</p>
        </div>

        <div style="display:flex; gap:14px; flex-wrap:wrap;">
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:8px 14px; border-radius:8px; text-align:center;">
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Full Mocks</div>
            <div style="font-size:16px; font-weight:700; color:var(--accent-primary);">${fullMocksCount} Taken</div>
          </div>
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:8px 14px; border-radius:8px; text-align:center;">
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Mini Mocks</div>
            <div style="font-size:16px; font-weight:700;">${miniMocksCount} Taken</div>
          </div>
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:8px 14px; border-radius:8px; text-align:center;">
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Best Score</div>
            <div style="font-size:16px; font-weight:700; color:var(--color-success);">${bestScore} M</div>
          </div>
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:8px 14px; border-radius:8px; text-align:center;">
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Rank Estimate</div>
            <div style="font-size:14px; font-weight:700; color:var(--accent-primary); margin-top:2px;">${rankEst}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Exam Mode Cards Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
      
      <!-- Card 1: Official Full Mock Test -->
      <div class="card" style="padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="font-size:12px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:4px;">Official Format</div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-bottom:8px;">Full Mock Test</h3>
          <p style="font-size:12px; color:var(--text-sub); margin-bottom:14px;">65 Questions &bull; 100 Marks &bull; 3 Hours &bull; MCQ + MSQ + NAT &bull; Virtual Calculator &bull; Official Marking (+1/-0.33, +2/-0.66).</p>

          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:10px 12px; border-radius:6px; font-size:12px; display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:14px;">
            <div>Attempts: <strong>${fullMocksCount}</strong></div>
            <div>Best Score: <strong style="color:var(--color-success);">${bestScore} M</strong></div>
            <div>Avg Score: <strong>${avgScore} M</strong></div>
            <div>Calculator: <strong style="color:var(--accent-primary);">Enabled</strong></div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <button class="btn-primary" style="font-size:13px; padding:10px 18px;" onclick="promptPreExamModal('full')">Start Full Mock Test ➔</button>
          <button class="btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="openInstructionsModal()">📖 Read Official Instructions</button>
        </div>
      </div>

      <!-- Card 2: Configurable Mini Mock -->
      <div class="card" style="padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="font-size:12px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:4px;">Custom Format</div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-bottom:8px;">Configurable Mini Mock</h3>
          <p style="font-size:12px; color:var(--text-sub); margin-bottom:14px;">Configure questions count and difficulty level before starting.</p>

          <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:14px;">
            <div>
              <label style="font-size:11px; font-weight:600; color:var(--text-muted); display:block; margin-bottom:4px;">Questions Count</label>
              <select id="cbt-mini-count" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:6px 10px; border-radius:6px; font-size:12px; width:100%;">
                <option value="10">10 Questions (30 Mins)</option>
                <option value="20" selected>20 Questions (60 Mins)</option>
                <option value="30">30 Questions (90 Mins)</option>
                <option value="40">40 Questions (120 Mins)</option>
              </select>
            </div>

            <div>
              <label style="font-size:11px; font-weight:600; color:var(--text-muted); display:block; margin-bottom:4px;">Difficulty Level</label>
              <select id="cbt-mini-diff" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:6px 10px; border-radius:6px; font-size:12px; width:100%;">
                <option value="all">GATE Level (Mixed 1M & 2M)</option>
                <option value="1">Easy Revision (1 Mark Questions)</option>
                <option value="2">Hard Numerical (2 Marks Questions)</option>
              </select>
            </div>
          </div>
        </div>

        <button class="btn-primary" style="font-size:13px; padding:10px 18px;" onclick="promptPreExamModal('mini')">Start Custom Mini Mock ➔</button>
      </div>

      <!-- Card 3: PYQ Exam Mode -->
      <div class="card" style="padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="font-size:12px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:4px;">Official Archives</div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-bottom:8px;">PYQ Paper Simulation</h3>
          <p style="font-size:12px; color:var(--text-sub); margin-bottom:14px;">Select an official GATE CSE paper from 2007 to 2026 under strict exam conditions.</p>

          <div style="margin-bottom:14px;">
            <label style="font-size:11px; font-weight:600; color:var(--text-muted); display:block; margin-bottom:4px;">Select Exam Year</label>
            <select id="cbt-pyq-year-select" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:6px 10px; border-radius:6px; font-size:12px; width:100%;">
              <option value="2026">GATE 2026 Paper</option>
              <option value="2025">GATE 2025 Paper</option>
              <option value="2024">GATE 2024 Paper</option>
              <option value="2023">GATE 2023 Paper</option>
              <option value="2022">GATE 2022 Paper</option>
              <option value="2021">GATE 2021 Paper</option>
              <option value="2020">GATE 2020 Paper</option>
              <option value="2019">GATE 2019 Paper</option>
              <option value="2018">GATE 2018 Paper</option>
              <option value="2017">GATE 2017 Paper</option>
              <option value="2016">GATE 2016 Paper</option>
              <option value="2015">GATE 2015 Paper</option>
            </select>
          </div>
        </div>

        <button class="btn-primary" style="font-size:13px; padding:10px 18px;" onclick="promptPreExamModal('pyq')">Start PYQ Exam Paper ➔</button>
      </div>

    </div>
  `;
}

// 2. Pre-Exam Confirmation & Instructions Modal Prompt
function promptPreExamModal(type) {
  pendingExamConfig = { type };

  let count = 65;
  let mins = 180;
  let title = 'Full GATE Mock Test';

  if (type === 'mini') {
    count = parseInt(document.getElementById('cbt-mini-count')?.value || '20', 10);
    mins = count * 3;
    title = `Custom Mini Mock (${count} Qs)`;
  } else if (type === 'pyq') {
    const yr = document.getElementById('cbt-pyq-year-select')?.value || '2026';
    title = `GATE ${yr} Official Paper Exam`;
    pendingExamConfig.year = yr;
  }

  pendingExamConfig.count = count;
  pendingExamConfig.mins = mins;
  pendingExamConfig.title = title;

  openInstructionsModal();
}

function openInstructionsModal() {
  const modal = document.getElementById('cbt-instructions-modal');
  if (!modal) return;

  const config = pendingExamConfig || { title: 'Official GATE CSE Examination', count: 65, mins: 180 };

  const detailsContainer = document.getElementById('cbt-modal-details-summary');
  if (detailsContainer) {
    detailsContainer.innerHTML = `
      <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px 18px; border-radius:8px; display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px; font-size:13px; margin-bottom:16px;">
        <div>Test Name: <strong style="color:var(--accent-primary);">${config.title}</strong></div>
        <div>Questions: <strong>${config.count} Qs</strong></div>
        <div>Duration: <strong>${config.mins} Minutes</strong></div>
        <div>Calculator: <strong style="color:var(--color-success);">Virtual Enabled</strong></div>
        <div>Marking Scheme: <strong>MCQ (+1/-0.33, +2/-0.66)</strong></div>
        <div>Negative Marking: <strong>Yes (MCQ only)</strong></div>
      </div>
    `;
  }

  modal.classList.add('active');
}

function closeInstructionsModal() {
  const modal = document.getElementById('cbt-instructions-modal');
  if (modal) modal.classList.remove('active');
}

function confirmStartExamFromModal() {
  const ackCheckbox = document.getElementById('cbt-instructions-ack');
  if (ackCheckbox && !ackCheckbox.checked) {
    alert('Please confirm that you have read all the instructions before starting the exam.');
    return;
  }

  closeInstructionsModal();

  const config = pendingExamConfig || { type: 'full' };
  startCBTExam(config.type, config);
}

// 3. Start Exam Execution
function startCBTExam(type = 'full', config = {}) {
  if (questionsData.length === 0) {
    alert('Questions database loading... Please try again in a moment.');
    return;
  }

  let selectedQuestions = [...questionsData];

  if (type === 'pyq' && config.year) {
    selectedQuestions = questionsData.filter(q => q.year == config.year);
    if (selectedQuestions.length === 0) selectedQuestions = [...questionsData];
    cbtState.timeRemaining = 180 * 60;
  } else if (type === 'mini') {
    const diff = document.getElementById('cbt-mini-diff')?.value || 'all';
    if (diff === '1') selectedQuestions = selectedQuestions.filter(q => q.marks === 1);
    else if (diff === '2') selectedQuestions = selectedQuestions.filter(q => q.marks === 2);

    for (let i = selectedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]];
    }

    const count = config.count || 20;
    selectedQuestions = selectedQuestions.slice(0, count);
    cbtState.timeRemaining = (config.mins || 60) * 60;
  } else {
    // Full Mock (65 Questions, 3 Hours)
    if (selectedQuestions.length > 65) {
      selectedQuestions = selectedQuestions.slice(0, 65);
    }
    cbtState.timeRemaining = 180 * 60;
  }

  cbtState.active = true;
  cbtState.questions = selectedQuestions;
  cbtState.currentIndex = 0;
  cbtState.userAnswers = {};
  cbtState.statuses = {};
  cbtState.examType = type;

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

function resumeActiveExam() {
  if (!cbtState.active) return;
  document.getElementById('cbt-welcome-screen').style.display = 'none';
  document.getElementById('cbt-active-screen').style.display = 'grid';
  document.getElementById('cbt-results-screen').style.display = 'none';

  renderCBTQuestion(cbtState.currentIndex);
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

  if (confirm('⚠️ Exam in Progress! Are you sure you want to Quit to the CBT Center? You can resume your test anytime.')) {
    document.getElementById('cbt-active-screen').style.display = 'none';
    document.getElementById('cbt-welcome-screen').style.display = 'block';
    document.getElementById('cbt-results-screen').style.display = 'none';
    renderCBTWelcomeHub();
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

  // Diagram HTML
  let diagramHTML = '';
  if (q.diagram) {
    diagramHTML = `
      <div style="margin:16px 0; text-align:center; background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
        <img src="${q.diagram}" onerror="this.style.display='none'" alt="Question Diagram" style="max-width:100%; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,0.15);">
      </div>
    `;
  }

  // Options HTML (Strict exam view: NO solutions, NO hints)
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
      <button class="btn-primary" style="margin-top:16px;" onclick="document.getElementById('cbt-results-screen').style.display='none'; document.getElementById('cbt-welcome-screen').style.display='block'; renderCBTWelcomeHub();">Back to CBT Center</button>
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
window.renderCBTWelcomeHub = renderCBTWelcomeHub;
window.promptPreExamModal = promptPreExamModal;
window.openInstructionsModal = openInstructionsModal;
window.closeInstructionsModal = closeInstructionsModal;
window.confirmStartExamFromModal = confirmStartExamFromModal;
window.startCBTExam = startCBTExam;
window.resumeActiveExam = resumeActiveExam;
window.quitCBTExam = quitCBTExam;

document.addEventListener('DOMContentLoaded', () => {
  loadQuestionsData();
});
