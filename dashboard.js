// Simplified, Minimalist Study Command Center Engine (Clean Empty State Supported)

function renderCommandCenter() {
  renderHeaderMetrics();
  renderContinueCard();
  renderTodayTasks();
  renderSubjectProgress();
  renderActivityAndDiagnostics();
}

// 1. Top Metrics (Countdown & Overall Completion)
function renderHeaderMetrics() {
  const prog = StorageManager.getSyllabusProgress();
  const totalTopics = 85;
  const completed = Object.values(prog).filter(v => v === 'completed').length;
  const pct = totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0;

  const pctEl = document.getElementById('cmd-syllabus-pct');
  const barEl = document.getElementById('cmd-syllabus-bar');
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (barEl) barEl.style.width = `${pct}%`;
}

// 2. Continue Studying Card (Handles empty state gracefully)
function renderContinueCard() {
  const container = document.getElementById('cmd-continue-card');
  if (!container) return;

  const last = StorageManager.getLastTopic();

  if (!last) {
    container.innerHTML = `
      <div style="padding:8px 0;">
        <div style="font-size:12px; font-weight:600; color:var(--accent-primary); text-transform:uppercase; margin-bottom:4px;">🌱 Begin Your Preparation</div>
        <div style="font-size:15px; font-weight:600;">You haven't started your GATE journey yet.</div>
        <div style="font-size:13px; color:var(--text-sub); margin-top:4px;">Explore the syllabus or start practicing topic-wise questions to track your progress here.</div>
        <div style="margin-top:14px; display:flex; gap:10px;">
          <button class="btn-primary" style="font-size:13px; padding:7px 14px;" onclick="document.querySelector('[data-view=\'syllabus\']').click();">Explore Syllabus</button>
          <button class="btn-secondary" style="font-size:13px; padding:7px 14px;" onclick="document.querySelector('[data-view=\'practice\']').click();">Start Practice</button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="font-size:11px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:4px;">▶️ Resume Learning</div>
      <div style="font-size:17px; font-weight:700; font-family:'Outfit', sans-serif;">${last.subject}</div>
      <div style="font-size:13px; color:var(--text-sub); margin-top:2px;">Topic: <strong>${last.topic}</strong></div>
      <div style="margin-top:12px;">
        <button class="btn-primary" style="font-size:13px; padding:7px 14px;" onclick="resumeLastStudySession('${last.subjectId}')">Continue Practice ➔</button>
      </div>
    `;
  }
}

function resumeLastStudySession(subId) {
  document.querySelector('[data-view="practice"]')?.click();
  const select = document.getElementById('practice-subject-select');
  if (select) {
    select.value = subId || 'all';
    select.dispatchEvent(new Event('change'));
  }
}

// 3. Today's Tasks
function renderTodayTasks() {
  const tasks = StorageManager.getTodayTasks();
  const remaining = tasks.filter(t => !t.done).length;

  const listEl = document.getElementById('cmd-task-list');
  const countEl = document.getElementById('cmd-task-count');

  if (countEl) {
    countEl.textContent = tasks.length === 0 ? 'No tasks set' : `${remaining} remaining`;
  }

  if (listEl) {
    if (tasks.length === 0) {
      listEl.innerHTML = `
        <div style="font-size:13px; color:var(--text-muted); padding:10px 0;">
          No daily tasks added yet. Add a target above to structure your day!
        </div>
      `;
    } else {
      listEl.innerHTML = tasks.map(t => `
        <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:8px 12px; border-radius:6px; margin-bottom:6px;">
          <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:13px; ${t.done ? 'text-decoration:line-through; opacity:0.5;' : 'font-weight:500;'}">
            <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleMissionTask('${t.id}')" style="cursor:pointer;">
            <span>${t.text}</span>
          </label>
          <button onclick="deleteMissionTask('${t.id}')" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:13px;">✕</button>
        </div>
      `).join('');
    }
  }
}

function addMissionTask() {
  const input = document.getElementById('cmd-task-input');
  if (!input || !input.value.trim()) return;
  StorageManager.addTask(input.value);
  input.value = '';
  renderTodayTasks();
}

function toggleMissionTask(taskId) {
  StorageManager.toggleTask(taskId);
  renderTodayTasks();
}

function deleteMissionTask(taskId) {
  StorageManager.deleteTask(taskId);
  renderTodayTasks();
}

// 4. Subject Progress Overview
function renderSubjectProgress() {
  const container = document.getElementById('cmd-subject-progress-grid');
  if (!container) return;

  const prog = StorageManager.getSyllabusProgress();
  const subjects = [
    { id: 'em', name: 'Engineering Mathematics', total: 25 },
    { id: 'dl', name: 'Digital Logic', total: 16 },
    { id: 'coa', name: 'Computer Organization & Architecture', total: 20 },
    { id: 'pds', name: 'Programming & Data Structures', total: 20 },
    { id: 'algo', name: 'Algorithms', total: 20 },
    { id: 'toc', name: 'Theory of Computation', total: 18 },
    { id: 'cd', name: 'Compiler Design', total: 16 },
    { id: 'os', name: 'Operating Systems', total: 22 },
    { id: 'dbms', name: 'Databases', total: 20 },
    { id: 'cn', name: 'Computer Networks', total: 20 },
    { id: 'ga', name: 'General Aptitude', total: 20 }
  ];

  container.innerHTML = subjects.map(s => {
    // Count real completed topics from storage
    const doneCount = Object.keys(prog).filter(k => k.startsWith(s.id) && prog[k] === 'completed').length;
    const pct = Math.round((doneCount / s.total) * 100);

    return `
      <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:8px; padding:12px; margin-bottom:8px;">
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; font-weight:600;">
          <span>${s.name}</span>
          <span style="color:var(--text-sub); font-size:12px;">${pct}%</span>
        </div>
        <div class="progress-bar-bg" style="margin-top:6px; height:6px;">
          <div class="progress-bar-fill" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}

// 5. Diagnostics & Activity Feed (Shows placeholder if no real data yet)
function renderActivityAndDiagnostics() {
  const testHistory = JSON.parse(localStorage.getItem('gate2027_test_history')) || [];
  const heatmap = StorageManager.getHeatmapData();

  const activityContainer = document.getElementById('cmd-activity-feed');
  if (!activityContainer) return;

  if (testHistory.length === 0 && Object.keys(heatmap).length === 0) {
    activityContainer.innerHTML = `
      <div style="font-size:13px; color:var(--text-sub); padding:16px 0; text-align:center;">
        No study activity recorded yet. Take a mock test or practice questions to start building your activity graph!
      </div>
    `;
  } else {
    let html = '';
    if (testHistory.length > 0) {
      html += `<div style="font-size:13px; font-weight:600; margin-bottom:8px;">Recent Test Results</div>`;
      testHistory.slice(-3).reverse().forEach(t => {
        html += `
          <div style="font-size:12px; border-bottom:1px solid var(--border-color); padding:6px 0; display:flex; justify-content:space-between;">
            <span>${t.date} - Score: <strong>${t.score}</strong></span>
            <span style="color:var(--color-success);">${t.accuracy}% Acc</span>
          </div>
        `;
      });
    }
    activityContainer.innerHTML = html;
  }
}

window.renderCommandCenter = renderCommandCenter;
window.addMissionTask = addMissionTask;
window.toggleMissionTask = toggleMissionTask;
window.deleteMissionTask = deleteMissionTask;
window.resumeLastStudySession = resumeLastStudySession;

document.addEventListener('DOMContentLoaded', () => {
  renderCommandCenter();
});
