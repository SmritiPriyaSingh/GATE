// Desktop Application Style GATE Syllabus Explorer & Workspace Engine

let syllabusData = null;
let selectedSubjectId = 'em'; // Default selected subject in desktop sidebar
let activeFilter = 'all'; // 'all', 'in_progress', 'mastered', 'high_weightage'
let searchQuery = '';
let activeTopicWorkspace = null; // { subjectId, uIdx, tIdx, topicName, unitName }
let collapsedUnits = {}; // { [unitKey]: true/false }

const SUBJECT_SVGS = {
  em: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 5-7 7-7-7"/><path d="m5 19 7-7 7 7"/></svg>`,
  dl: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  coa: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>`,
  pds: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><circle cx="6" cy="19" r="3"/><circle cx="18" cy="19" r="3"/><line x1="10" x2="7.5" y1="7.5" y2="16.5"/><line x1="14" x2="16.5" y1="7.5" y2="16.5"/></svg>`,
  algo: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  toc: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>`,
  cd: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  os: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
  dbms: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  cn: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><line x1="2" x2="22" y1="12" y2="12"/></svg>`,
  ga: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/><line x1="9" x2="15" y1="21" y2="21"/></svg>`
};

async function loadSyllabusData() {
  try {
    const res = await fetch('syllabus-data.json');
    syllabusData = await res.json();
    renderSyllabusAppLayout();
  } catch (err) {
    console.error('Failed to load syllabus-data.json:', err);
  }
}

function getTopicKey(subjectId, unitIndex, topicIndex) {
  return `${subjectId}_u${unitIndex}_t${topicIndex}`;
}

function calculateSubjectProgress(subject) {
  const prog = StorageManager.getSyllabusProgress();
  let total = 0;
  let completed = 0;

  subject.units.forEach((unit, uIdx) => {
    unit.topics.forEach((topic, tIdx) => {
      total++;
      const key = getTopicKey(subject.id, uIdx, tIdx);
      if (prog[key] === 'mastered') {
        completed++;
      } else if (prog[key] === 'in_progress') {
        completed += 0.5;
      }
    });
  });

  return {
    total,
    completed: Math.round(completed),
    remaining: total - Math.round(completed),
    pct: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}

function setTopicStatus(key, status) {
  const prog = StorageManager.getSyllabusProgress();
  prog[key] = status;
  StorageManager.saveSyllabusProgress(prog);
  renderSyllabusAppLayout();
  if (window.renderCommandCenter) window.renderCommandCenter();
}

function setSyllabusFilter(filterType, btn) {
  activeFilter = filterType;
  document.querySelectorAll('#syllabus-filter-pills button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderSyllabusAppLayout();
}

function handleUniversalSearch(val) {
  searchQuery = val.trim().toLowerCase();
  activeTopicWorkspace = null;
  renderSyllabusAppLayout();
}

function selectSubject(subId) {
  selectedSubjectId = subId;
  activeTopicWorkspace = null;
  renderSyllabusAppLayout();
}

function toggleUnitCollapse(unitKey) {
  collapsedUnits[unitKey] = !collapsedUnits[unitKey];
  renderSyllabusAppLayout();
}

function openTopicWorkspace(subjectId, uIdx, tIdx, topicName, unitName) {
  activeTopicWorkspace = { subjectId, uIdx, tIdx, topicName, unitName };
  renderSyllabusAppLayout();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeTopicWorkspace() {
  activeTopicWorkspace = null;
  renderSyllabusAppLayout();
}

// Render Master Desktop App Layout
function renderSyllabusAppLayout() {
  const container = document.getElementById('syllabus-main-content');
  if (!container || !syllabusData) return;

  // 1. If active search query, render Universal Search Results
  if (searchQuery) {
    renderUniversalSearchResults(container);
    return;
  }

  // 2. If active Topic Workspace, render Workspace View
  if (activeTopicWorkspace) {
    renderTopicWorkspaceView(container);
    return;
  }

  // 3. Main Desktop Explorer: Left Sidebar + Right Subject Panel
  container.innerHTML = `
    <div style="display:grid; grid-template-columns: 240px 1fr; gap:20px; align-items:start;">
      
      <!-- Persistent Desktop Left Sidebar -->
      <div class="card" style="padding:14px 10px; position:sticky; top:70px;">
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:10px; padding:0 8px;">
          Subjects Library
        </div>

        <div style="display:flex; flex-direction:column; gap:2px;">
          ${syllabusData.subjects.map(s => {
            const stats = calculateSubjectProgress(s);
            const isSelected = s.id === selectedSubjectId;
            const iconSVG = SUBJECT_SVGS[s.id] || SUBJECT_SVGS['em'];

            return `
              <div onclick="selectSubject('${s.id}')" style="display:flex; align-items:center; justify-content:space-between; padding:8px 10px; border-radius:6px; cursor:pointer; font-size:13px; font-weight:${isSelected ? '700' : '500'}; background:${isSelected ? 'var(--accent-subtle)' : 'transparent'}; color:${isSelected ? 'var(--accent-primary)' : 'var(--text-main)'}; border:1px solid ${isSelected ? 'var(--accent-primary)' : 'transparent'};">
                <div style="display:flex; align-items:center; gap:8px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                  <span>${iconSVG}</span>
                  <span style="overflow:hidden; text-overflow:ellipsis;">${s.name}</span>
                </div>
                <span style="font-size:11px; font-weight:600; opacity:0.8;">${stats.pct}%</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right Main Panel: Selected Subject Outline & Units Explorer -->
      <div>
        ${renderSelectedSubjectPanel(selectedSubjectId)}
      </div>

    </div>
  `;
}

// Right Panel Render for Selected Subject
function renderSelectedSubjectPanel(subjectId) {
  const subject = syllabusData.subjects.find(s => s.id === subjectId);
  if (!subject) return '';

  const stats = calculateSubjectProgress(subject);
  const iconSVG = SUBJECT_SVGS[subject.id] || SUBJECT_SVGS['em'];
  const prog = StorageManager.getSyllabusProgress();

  return `
    <!-- Subject Header Banner -->
    <div class="card" style="margin-bottom:16px; padding:20px 24px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="width:46px; height:46px; border-radius:10px; background:var(--bg-surface-hover); color:var(--accent-primary); display:flex; align-items:center; justify-content:center; border:1px solid var(--border-color);">
            ${iconSVG}
          </div>
          <div>
            <h1 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; margin-bottom:2px;">${subject.name}</h1>
            <div style="font-size:12px; color:var(--text-sub);">
              ${subject.code} • Weightage: <strong>${subject.weightage}</strong> • ${stats.total} Total Topics
            </div>
          </div>
        </div>

        <button class="btn-primary" style="font-size:13px; padding:8px 16px;" onclick="startSubjectPractice('${subject.id}')">
          Start Practice ➔
        </button>
      </div>

      <!-- Dense Progress Statistics Strip -->
      <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:12px 16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:600; margin-bottom:8px;">
          <span>Subject Progress Overview</span>
          <span style="color:var(--accent-primary);">${stats.pct}% Completed (${stats.completed} Completed / ${stats.remaining} Remaining)</span>
        </div>
        <div class="progress-bar-bg" style="height:8px; border-radius:4px;">
          <div class="progress-bar-fill" style="width:${stats.pct}%; height:100%; border-radius:4px; background:${stats.pct === 100 ? 'var(--color-success)' : 'var(--accent-primary)'};"></div>
        </div>
      </div>
    </div>

    <!-- Units Outline Collapsible Tree (VS Code / Notion Explorer Style) -->
    <div style="display:flex; flex-direction:column; gap:12px;">
      ${subject.units.map((unit, uIdx) => {
        const unitKey = `${subject.id}_u${uIdx}`;
        const isCollapsed = collapsedUnits[unitKey];

        const unitCompletedCount = unit.topics.filter((_, tIdx) => {
          const k = getTopicKey(subject.id, uIdx, tIdx);
          return prog[k] === 'mastered';
        }).length;

        return `
          <div class="card" style="padding:0; overflow:hidden;">
            <!-- Collapsible Unit Header -->
            <div onclick="toggleUnitCollapse('${unitKey}')" style="padding:14px 18px; background:var(--bg-surface-hover); border-bottom:${isCollapsed ? 'none' : '1px solid var(--border-color)'}; display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:12px; color:var(--text-muted); font-weight:700;">${isCollapsed ? '▶' : '▼'}</span>
                <span style="font-family:'Outfit', sans-serif; font-size:15px; font-weight:700;">Unit ${uIdx + 1}: ${unit.name}</span>
              </div>
              <div style="display:flex; align-items:center; gap:12px; font-size:12px; color:var(--text-sub);">
                <span>${unitCompletedCount} / ${unit.topics.length} Completed</span>
              </div>
            </div>

            <!-- Unit Topic Rows (Dense VS Code Explorer List) -->
            ${!isCollapsed ? `
              <div style="padding:8px 12px; display:flex; flex-direction:column; gap:4px;">
                ${unit.topics.map((topic, tIdx) => {
                  const key = getTopicKey(subject.id, uIdx, tIdx);
                  const status = prog[key] || 'not_started';

                  let statusIcon = `<span style="color:var(--text-muted); font-size:14px;">○</span>`;
                  let statusText = `Not Started`;
                  let textColor = `var(--text-sub)`;

                  if (status === 'in_progress') {
                    statusIcon = `<span style="color:var(--accent-primary); font-size:14px;">◉</span>`;
                    statusText = `In Progress`;
                    textColor = `var(--text-main)`;
                  } else if (status === 'mastered') {
                    statusIcon = `<span style="color:var(--color-success); font-size:14px;">✓</span>`;
                    statusText = `Mastered`;
                    textColor = `var(--text-muted); text-decoration:line-through;`;
                  }

                  return `
                    <div onclick="openTopicWorkspace('${subject.id}', ${uIdx}, ${tIdx}, '${topic.replace(/'/g, "\\'")}', '${unit.name.replace(/'/g, "\\'")}')" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; border-radius:6px; cursor:pointer; background:var(--bg-surface); border:1px solid transparent; transition:background 0.15s ease;" onmouseover="this.style.background='var(--bg-surface-hover)'" onmouseout="this.style.background='var(--bg-surface)'">
                      <div style="display:flex; align-items:center; gap:12px; font-size:13px;">
                        ${statusIcon}
                        <span style="${textColor}">${topic}</span>
                      </div>

                      <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:11px; color:var(--text-muted);">${statusText}</span>
                        <span style="font-size:12px; color:var(--accent-primary); font-weight:600;">Workspace ➔</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Dedicated Topic Workspace View (Drill-Down Level 4: Topic Workspace)
function renderTopicWorkspaceView(container) {
  const { subjectId, uIdx, tIdx, topicName, unitName } = activeTopicWorkspace;
  const subject = syllabusData.subjects.find(s => s.id === subjectId);
  const key = getTopicKey(subjectId, uIdx, tIdx);
  const prog = StorageManager.getSyllabusProgress();
  const currentStatus = prog[key] || 'not_started';

  container.innerHTML = `
    <!-- Top Breadcrumb Bar -->
    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:12px 18px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; position:sticky; top:70px; z-index:100; backdrop-filter:blur(10px);">
      <div style="display:flex; align-items:center; gap:8px; font-size:13px;">
        <span style="color:var(--accent-primary); font-weight:600; cursor:pointer;" onclick="closeTopicWorkspace()">Syllabus</span>
        <span style="color:var(--text-muted);">/</span>
        <span style="color:var(--accent-primary); font-weight:600; cursor:pointer;" onclick="closeTopicWorkspace()">${subject.name}</span>
        <span style="color:var(--text-muted);">/</span>
        <span style="font-weight:700; color:var(--text-main);">${topicName}</span>
      </div>

      <button class="btn-secondary" style="font-size:12px; padding:5px 12px;" onclick="closeTopicWorkspace()">
        ← Back to Subject Outline
      </button>
    </div>

    <!-- Main Workspace Title Card -->
    <div class="card" style="margin-bottom:20px; padding:24px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; margin-bottom:16px;">
        <div>
          <div style="font-size:12px; color:var(--text-muted); font-weight:600; text-transform:uppercase; margin-bottom:4px;">
            ${subject.name} • ${unitName}
          </div>
          <h1 style="font-family:'Outfit', sans-serif; font-size:24px; font-weight:700; margin-bottom:6px;">${topicName}</h1>
          <div style="display:flex; align-items:center; gap:12px;">
            <label style="font-size:12px; font-weight:600;">Status:</label>
            <select class="status-select" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:6px 12px; border-radius:6px; font-size:13px;" onchange="setTopicStatus('${key}', this.value)">
              <option value="not_started" ${currentStatus === 'not_started' ? 'selected' : ''}>Not Started</option>
              <option value="in_progress" ${currentStatus === 'in_progress' ? 'selected' : ''}>In Progress ◉</option>
              <option value="mastered" ${currentStatus === 'mastered' ? 'selected' : ''}>Mastered ✓</option>
            </select>
          </div>
        </div>

        <button class="btn-primary" style="font-size:14px; padding:10px 20px;" onclick="practiceSpecificTopic('${subjectId}', '${topicName.replace(/'/g, "\\'")}')">
          Start Topic Practice ➔
        </button>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="stats-grid" style="grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-top:20px;">
        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:12px; border-radius:8px;">
          <div style="font-size:11px; color:var(--text-muted); font-weight:600;">AVAILABLE QUESTIONS</div>
          <div style="font-size:18px; font-weight:700; margin-top:2px;">45 Questions</div>
        </div>
        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:12px; border-radius:8px;">
          <div style="font-size:11px; color:var(--text-muted); font-weight:600;">ESTIMATED TIME</div>
          <div style="font-size:18px; font-weight:700; margin-top:2px;">1h 20m</div>
        </div>
        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:12px; border-radius:8px;">
          <div style="font-size:11px; color:var(--text-muted); font-weight:600;">WEIGHTAGE RANGE</div>
          <div style="font-size:18px; font-weight:700; margin-top:2px; color:var(--accent-primary);">${subject.weightage}</div>
        </div>
      </div>
    </div>

    <!-- Workspace Action Links -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
      <div class="card" style="cursor:pointer;" onclick="practiceSpecificTopic('${subjectId}', '${topicName.replace(/'/g, "\\'")}')">
        <h4 style="font-size:15px; font-weight:700; margin-bottom:4px;">Practice Question Bank ➔</h4>
        <p style="font-size:12px; color:var(--text-sub);">Solve official GATE questions filtered specifically for ${topicName}.</p>
      </div>

      <div class="card" style="cursor:pointer;" onclick="document.querySelector('[data-view=\'revision\']').click();">
        <h4 style="font-size:15px; font-weight:700; margin-bottom:4px;">Bookmarked Formulae & Notes ➔</h4>
        <p style="font-size:12px; color:var(--text-sub);">Review your saved bookmarks and personal notes for this topic.</p>
      </div>
    </div>
  `;
}

// Universal Search Results (Search Everything Across All Subjects)
function renderUniversalSearchResults(container) {
  let matches = [];

  syllabusData.subjects.forEach(s => {
    s.units.forEach((u, uIdx) => {
      u.topics.forEach((t, tIdx) => {
        if (t.toLowerCase().includes(searchQuery) || u.name.toLowerCase().includes(searchQuery) || s.name.toLowerCase().includes(searchQuery)) {
          matches.push({ subject: s, unit: u, topic: t, uIdx, tIdx });
        }
      });
    });
  });

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align:center; padding:40px 20px;">
        <div style="font-size:15px; font-weight:600; color:var(--text-sub);">No topics matched "${searchQuery}".</div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="card" style="margin-bottom:16px;">
      <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700;">Universal Search Results (${matches.length} Matches)</h3>
    </div>

    <div style="display:flex; flex-direction:column; gap:8px;">
      ${matches.map(m => `
        <div class="card" style="padding:12px 18px; cursor:pointer;" onclick="openTopicWorkspace('${m.subject.id}', ${m.uIdx}, ${m.tIdx}, '${m.topic.replace(/'/g, "\\'")}', '${m.unit.name.replace(/'/g, "\\'")}')">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:11px; color:var(--text-muted); font-weight:600;">${m.subject.name} • ${m.unit.name}</div>
              <div style="font-size:14px; font-weight:700; margin-top:2px;">${m.topic}</div>
            </div>
            <button class="btn-secondary" style="font-size:12px; padding:4px 10px;">Open Workspace ➔</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function startSubjectPractice(subjectId) {
  document.querySelector('[data-view="practice"]')?.click();
  const select = document.getElementById('practice-subject-select');
  if (select) {
    select.value = subjectId;
    select.dispatchEvent(new Event('change'));
  }
}

function practiceSpecificTopic(subjectId, topicName) {
  document.querySelector('[data-view="practice"]')?.click();
  const select = document.getElementById('practice-subject-select');
  if (select) {
    select.value = subjectId;
    select.dispatchEvent(new Event('change'));
  }
}

window.renderSyllabusAppLayout = renderSyllabusAppLayout;
window.setSyllabusFilter = setSyllabusFilter;
window.handleUniversalSearch = handleUniversalSearch;
window.selectSubject = selectSubject;
window.toggleUnitCollapse = toggleUnitCollapse;
window.openTopicWorkspace = openTopicWorkspace;
window.closeTopicWorkspace = closeTopicWorkspace;
window.setTopicStatus = setTopicStatus;
window.startSubjectPractice = startSubjectPractice;
window.practiceSpecificTopic = practiceSpecificTopic;

document.addEventListener('DOMContentLoaded', () => {
  loadSyllabusData();
});
