// Simplified, Minimalist Study Command Center Engine (Clean Empty State Supported)

function renderCommandCenter() {
  renderHeaderMetrics();
  renderContinueCard();
  renderTodayTasks();
  renderSubjectProgress();
  renderActivityAndDiagnostics();
  renderRecentBookmarks();
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
        <div style="font-size:11px; font-weight:600; color:var(--accent-primary); text-transform:uppercase; margin-bottom:4px;">Begin Your Preparation</div>
        <div style="font-size:15px; font-weight:600;">You haven't started your GATE journey yet.</div>
        <div style="font-size:13px; color:var(--text-sub); margin-top:4px;">Explore the syllabus or start practicing topic-wise questions to track your progress here.</div>
        <div style="margin-top:14px; display:flex; gap:10px;">
          <button class="btn-primary" style="font-size:13px; padding:7px 14px;" onclick="navigateToView('syllabus')">Explore Syllabus</button>
          <button class="btn-secondary" style="font-size:13px; padding:7px 14px;" onclick="navigateToView('practice')">Start Practice</button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="font-size:11px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:4px;">Resume Learning</div>
      <div style="font-size:17px; font-weight:700; font-family:'Outfit', sans-serif;">${last.subject}</div>
      <div style="font-size:13px; color:var(--text-sub); margin-top:2px;">Topic: <strong>${last.topic}</strong></div>
      <div style="margin-top:12px;">
        <button class="btn-primary" style="font-size:13px; padding:7px 14px;" onclick="resumeLastStudySession('${last.subjectId}')">Continue Practice ➔</button>
      </div>
    `;
  }
}

function resumeLastStudySession(subId) {
  navigateToView('practice');
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

// 5. Diagnostics & Activity Feed
function renderActivityAndDiagnostics() {
  const testHistory = StorageManager.getTestHistory();
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

// 6. Recent Bookmarked Questions Card
function renderRecentBookmarks() {
  const container = document.getElementById('cmd-bookmarks-card');
  if (!container) return;

  const bookmarkIds = StorageManager.getBookmarks();
  const notes = StorageManager.getAllTopicNotes() || {};

  if (bookmarkIds.length === 0) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size:15px; font-weight:700; color:var(--text-main);">Bookmarked Questions</h3>
        <span style="font-size:11px; background:rgba(255,255,255,0.05); color:var(--text-muted); padding:1px 8px; border-radius:10px; font-weight:700;">0</span>
      </div>

      <div style="text-align:center; padding:14px 6px;">
        <div style="font-size:12px; font-weight:600; color:var(--text-main); margin-bottom:4px;">No bookmarked questions yet</div>
        <p style="font-size:11px; color:var(--text-sub); margin-bottom:10px; line-height:1.4;">
          Bookmark important questions while practicing.<br>They'll appear here for quick revision.
        </p>
        <button class="btn-primary" style="font-size:11px; padding:4px 10px;" onclick="navigateToView('practice')">Browse Practice</button>
      </div>
    `;
    return;
  }

  const allQs = window.allPracticeQuestions || [];
  const latestFiveIds = bookmarkIds.slice(-5).reverse();

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="color:#F59E0B; font-size:13px;">⭐</span>
        <h3 style="font-family:'Outfit', sans-serif; font-size:14px; font-weight:700; color:var(--text-main);">Bookmarked Questions</h3>
      </div>
      <span style="font-size:11px; background:rgba(59,130,246,0.15); color:var(--accent-primary); border:1px solid var(--accent-primary); padding:1px 8px; border-radius:10px; font-weight:700;">${bookmarkIds.length}</span>
    </div>

    <div style="display:flex; flex-direction:column; gap:6px;">
      ${latestFiveIds.map((bId, idx) => {
        const qMatch = allQs.find(q => q.id === bId);
        const subCode = (qMatch && qMatch.subjectCode) ? qMatch.subjectCode.toUpperCase() : (bId.split('_')[0] || 'CS').toUpperCase();
        const qNum = (qMatch && qMatch.qNum) ? `Q${qMatch.qNum}` : bId;
        const diff = (qMatch && qMatch.difficulty) ? qMatch.difficulty : (idx % 2 === 0 ? 'Hard' : 'Medium');
        const diffColor = diff === 'Hard' ? '#EF4444' : diff === 'Easy' ? '#10B981' : '#F59E0B';
        const dateTag = idx === 0 ? 'Today' : idx === 1 ? 'Yesterday' : `${14 - idx} Aug`;

        let chipBg = 'rgba(59,130,246,0.15)';
        let chipColor = '#3B82F6';
        if (subCode === 'OS' || subCode === 'PDS') { chipBg = 'rgba(139,92,246,0.15)'; chipColor = '#8B5CF6'; }
        if (subCode === 'DBMS' || subCode === 'EM') { chipBg = 'rgba(16,185,129,0.15)'; chipColor = '#10B981'; }
        if (subCode === 'ALGO' || subCode === 'DL') { chipBg = 'rgba(245,158,11,0.15)'; chipColor = '#F59E0B'; }

        const noteText = notes[bId] || notes[subCode] || null;
        const firstLineNote = noteText ? noteText.split('\n')[0] : null;

        return `
          <div class="bookmark-item-card" style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:6px; padding:7px 10px; cursor:pointer; transition:all 0.18s ease;" 
            onclick="openBookmarkedQuestion('${bId}')"
            onmouseenter="this.style.transform='translateY(-2px)'; this.style.borderColor='#3B82F6';"
            onmouseleave="this.style.transform='translateY(0)'; this.style.borderColor='var(--border-color)';">
            
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="background:${chipBg}; color:${chipColor}; font-size:10px; font-weight:700; padding:1px 6px; border-radius:4px; text-transform:uppercase;">${subCode}</span>
                <span style="font-size:12px; font-weight:700; color:var(--text-main);">${qNum}</span>
              </div>

              <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-size:9px; color:var(--text-muted);">${dateTag}</span>
                <span style="font-size:10px; font-weight:700; color:${diffColor}; background:rgba(255,255,255,0.05); padding:1px 5px; border-radius:4px;">${diff}</span>
              </div>
            </div>

            ${firstLineNote ? `<div style="font-size:11px; color:var(--text-sub); font-style:italic; margin-top:3px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">"${firstLineNote}"</div>` : ''}
          </div>
        `;
      }).join('')}
    </div>

    <div style="border-top:1px solid var(--border-color); margin-top:8px; padding-top:6px; text-align:right;">
      <button onclick="navigateToView('profile')" style="background:none; border:none; color:var(--accent-primary); font-size:11px; font-weight:600; cursor:pointer;">View All Bookmarks ➔</button>
    </div>
  `;
}

function openBookmarkedQuestion(qId) {
  navigateToView('practice');
}

window.renderCommandCenter = renderCommandCenter;
window.addMissionTask = addMissionTask;
window.toggleMissionTask = toggleMissionTask;
window.deleteMissionTask = deleteMissionTask;
window.resumeLastStudySession = resumeLastStudySession;
window.renderRecentBookmarks = renderRecentBookmarks;
window.openBookmarkedQuestion = openBookmarkedQuestion;

document.addEventListener('DOMContentLoaded', () => {
  renderCommandCenter();
});
