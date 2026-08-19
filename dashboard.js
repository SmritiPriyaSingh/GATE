// Study Command Center Dashboard Engine

function renderCommandCenter() {
  renderMissionHeader();
  renderCommandMetrics();
  renderContinueCard();
  renderRecommendationCard();
  renderRichSubjectGrid();
  renderStudyHeatmap();
  renderWeeklyHoursChart();
  renderTimelineActivity();
}

// 1. Today's Mission & Tasks Header
function renderMissionHeader() {
  const tasks = StorageManager.getTodayTasks();
  const remaining = tasks.filter(t => !t.done).length;

  const missionListEl = document.getElementById('cmd-mission-list');
  const countEl = document.getElementById('cmd-remaining-count');

  if (countEl) {
    countEl.textContent = `${remaining} Task${remaining === 1 ? '' : 's'} Remaining`;
  }

  if (missionListEl) {
    missionListEl.innerHTML = tasks.map(t => `
      <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:10px 14px; border-radius:8px; margin-bottom:8px;">
        <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:14px; ${t.done ? 'text-decoration:line-through; opacity:0.6;' : 'font-weight:500;'}">
          <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleMissionTask('${t.id}')" style="width:16px; height:16px; cursor:pointer;">
          <span>${t.text}</span>
        </label>
        <button onclick="deleteMissionTask('${t.id}')" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:14px;">✕</button>
      </div>
    `).join('');
  }
}

function addMissionTask() {
  const input = document.getElementById('cmd-task-input');
  if (!input || !input.value.trim()) return;
  StorageManager.addTask(input.value);
  input.value = '';
  renderMissionHeader();
}

function toggleMissionTask(taskId) {
  StorageManager.toggleTask(taskId);
  renderMissionHeader();
}

function deleteMissionTask(taskId) {
  StorageManager.deleteTask(taskId);
  renderMissionHeader();
}

// 2. Command Metrics Bar
function renderCommandMetrics() {
  const prog = StorageManager.getSyllabusProgress();
  const totalTopics = 85;
  const completed = Object.values(prog).filter(v => v === 'completed').length;
  const pct = Math.round((completed / totalTopics) * 100);

  const pctEl = document.getElementById('cmd-syllabus-pct');
  const barEl = document.getElementById('cmd-syllabus-bar');
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (barEl) barEl.style.width = `${pct}%`;

  const streakEl = document.getElementById('cmd-streak-val');
  if (streakEl) streakEl.textContent = '14 Days 🔥';

  const hoursEl = document.getElementById('cmd-hours-val');
  if (hoursEl) hoursEl.textContent = '4.5 Hrs ⏳';

  const testHistory = JSON.parse(localStorage.getItem('gate2027_test_history')) || [];
  let totalAcc = 78;
  if (testHistory.length > 0) {
    const accs = testHistory.map(t => t.accuracy);
    totalAcc = Math.round(accs.reduce((a, b) => a + b, 0) / accs.length);
  }
  const accEl = document.getElementById('cmd-accuracy-val');
  if (accEl) accEl.textContent = `${totalAcc}% 🎯`;
}

// 3. Continue Studying Card
function renderContinueCard() {
  const last = StorageManager.getLastTopic();
  const container = document.getElementById('cmd-continue-card');
  if (!container) return;

  container.innerHTML = `
    <div style="font-size:12px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:6px;">▶️ Resume Learning</div>
    <div style="font-size:18px; font-weight:700; font-family:'Outfit', sans-serif;">${last.subject}</div>
    <div style="font-size:14px; color:var(--text-sub); margin-top:2px;">Topic: <strong>${last.topic}</strong></div>
    <div style="margin-top:14px;">
      <button class="btn-primary" style="font-size:13px; padding:8px 16px;" onclick="resumeLastStudySession('${last.subjectId}')">Continue Practice ➔</button>
    </div>
  `;
}

function resumeLastStudySession(subId) {
  document.querySelector('[data-view="practice"]')?.click();
  const select = document.getElementById('practice-subject-select');
  if (select) {
    select.value = subId || 'all';
    select.dispatchEvent(new Event('change'));
  }
}

// 4. Actionable Recommended Next Action
function renderRecommendationCard() {
  const container = document.getElementById('cmd-recommendation-card');
  if (!container) return;

  container.innerHTML = `
    <div style="font-size:12px; font-weight:700; color:var(--color-warning); text-transform:uppercase; margin-bottom:6px;">💡 Recommended Next Action</div>
    <div style="font-size:14px; color:var(--text-sub); margin-bottom:8px;">You haven't studied <strong>Compiler Design</strong> for 9 days.</div>
    <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:12px; border-radius:8px; margin-bottom:12px;">
      <div style="font-weight:700; font-size:15px;">Target: Parsing Techniques (LL/LR Parsers)</div>
      <div style="font-size:12px; color:var(--text-sub); margin-top:4px;">⏱️ Est. Time: 45 min &bull; Difficulty: Medium</div>
    </div>
    <button class="btn-primary" style="background:var(--color-warning); color:#000; font-size:13px;" onclick="resumeLastStudySession('cd')">Start Targeted Practice</button>
  `;
}

// 5. Rich Color-Coded Subject Progress Grid
function renderRichSubjectGrid() {
  const container = document.getElementById('cmd-subject-grid');
  if (!container) return;

  const subjects = [
    { id: 'em', name: 'Engineering Mathematics', pct: 60, topics: '15 / 25', questions: 210, weak: 'Probability & Bayes' },
    { id: 'dl', name: 'Digital Logic', pct: 75, topics: '12 / 16', questions: 340, weak: 'Sequential Circuits' },
    { id: 'coa', name: 'Computer Organization & Architecture', pct: 45, topics: '9 / 20', questions: 190, weak: 'Cache Memory Mapping' },
    { id: 'pds', name: 'Programming & Data Structures', pct: 85, topics: '17 / 20', questions: 480, weak: 'B-Trees' },
    { id: 'algo', name: 'Algorithms', pct: 70, topics: '14 / 20', questions: 390, weak: 'Dynamic Programming' },
    { id: 'toc', name: 'Theory of Computation', pct: 30, topics: '6 / 18', questions: 130, weak: 'Pumping Lemma' },
    { id: 'cd', name: 'Compiler Design', pct: 25, topics: '4 / 16', questions: 95, weak: 'LALR Parser' },
    { id: 'os', name: 'Operating Systems', pct: 82, topics: '18 / 22', questions: 412, weak: 'Memory Management' },
    { id: 'dbms', name: 'Databases', pct: 40, topics: '8 / 20', questions: 160, weak: 'B+ Tree Indexing' },
    { id: 'cn', name: 'Computer Networks', pct: 80, topics: '16 / 20', questions: 380, weak: 'IP Subnetting' },
    { id: 'ga', name: 'General Aptitude', pct: 90, topics: '18 / 20', questions: 520, weak: 'Spatial Aptitude' }
  ];

  container.innerHTML = subjects.map(s => {
    let statusClass = 'behind';
    let statusPill = '🔴 0-30% Behind';
    if (s.pct >= 71) {
      statusClass = 'strong';
      statusPill = '🟢 71-100% Strong';
    } else if (s.pct >= 31) {
      statusClass = 'in-progress';
      statusPill = '🟡 31-70% In Progress';
    }

    return `
      <div class="card subject-card-rich ${statusClass}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <span style="font-family:'Outfit', sans-serif; font-weight:700; font-size:15px;">${s.name}</span>
          <span class="status-pill ${statusClass}">${statusPill}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px;">
          <span>Progress</span>
          <strong>${s.pct}%</strong>
        </div>
        <div class="progress-bar-bg" style="margin-bottom:12px;">
          <div class="progress-bar-fill ${statusClass}" style="width: ${s.pct}%;"></div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:12px; color:var(--text-sub);">
          <div>Topics: <strong>${s.topics}</strong></div>
          <div>Solved: <strong>${s.questions} q's</strong></div>
        </div>
        <div style="margin-top:8px; font-size:11px; color:var(--text-muted);">
          ⚠️ Focus Area: <strong style="color:var(--text-main);">${s.weak}</strong>
        </div>
      </div>
    `;
  }).join('');
}

// 6. GitHub-Style Study Consistency Heatmap
function renderStudyHeatmap() {
  const container = document.getElementById('cmd-heatmap-grid');
  if (!container) return;

  const mapData = StorageManager.getHeatmapData();
  const squares = [];
  const today = new Date();

  for (let i = 111; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = mapData[dateStr] || (i % 3 === 0 ? Math.floor(Math.random() * 25) + 5 : 0);

    let level = 'lvl-0';
    if (count > 20) level = 'lvl-4';
    else if (count > 12) level = 'lvl-3';
    else if (count > 5) level = 'lvl-2';
    else if (count > 0) level = 'lvl-1';

    squares.push(`<div class="heatmap-square ${level}" title="${dateStr}: ${count} questions solved"></div>`);
  }

  container.innerHTML = squares.join('');
}

// 7. Weekly Study Hours Bar Chart
function renderWeeklyHoursChart() {
  const container = document.getElementById('cmd-weekly-chart');
  if (!container) return;

  const hours = StorageManager.getDailyHours();
  const maxHours = 8.0;

  container.innerHTML = Object.entries(hours).map(([day, val]) => {
    const heightPct = Math.round((val / maxHours) * 100);
    return `
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px; flex:1;">
        <span style="font-size:11px; font-weight:600; color:var(--accent-primary);">${val}h</span>
        <div style="width:100%; height:120px; background:var(--bg-surface-hover); border-radius:6px; display:flex; align-items:flex-end; padding:2px;">
          <div style="width:100%; height:${heightPct}%; background:var(--accent-primary); border-radius:4px; transition:height 0.3s ease;"></div>
        </div>
        <span style="font-size:11px; color:var(--text-sub); font-weight:600;">${day}</span>
      </div>
    `;
  }).join('');
}

// 8. Timeline Recent Activity Log
function renderTimelineActivity() {
  const container = document.getElementById('cmd-timeline-feed');
  if (!container) return;

  const activities = [
    { time: 'Today', text: '✔ Solved 20 Computer Networks PYQs' },
    { time: '2 hours ago', text: '✔ Completed Deadlocks & Synchronization (OS)' },
    { time: 'Yesterday', text: '✔ Finished TOC Unit 2 & DFA Minimization' },
    { time: '3 days ago', text: '✔ Attempted GATE 2025 Full Length CBT Mock Test' }
  ];

  container.innerHTML = activities.map(act => `
    <div style="position:relative; padding-left:20px; border-left:2px solid var(--border-color); padding-bottom:14px;">
      <div style="position:absolute; left:-6px; top:2px; width:10px; height:10px; border-radius:50%; background:var(--accent-primary);"></div>
      <div style="font-size:11px; font-weight:700; color:var(--accent-primary);">${act.time}</div>
      <div style="font-size:13px; font-weight:500; margin-top:2px;">${act.text}</div>
    </div>
  `).join('');
}

window.renderCommandCenter = renderCommandCenter;
window.addMissionTask = addMissionTask;
window.toggleMissionTask = toggleMissionTask;
window.deleteMissionTask = deleteMissionTask;

document.addEventListener('DOMContentLoaded', () => {
  renderCommandCenter();
});
