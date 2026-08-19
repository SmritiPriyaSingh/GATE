// Notion / Steam Style GATE Syllabus Explorer Module with Breadcrumb Navigation

let syllabusData = null;
let currentSubjectView = null; // null = grid view, or subjectId string
let activeFilter = 'all'; // 'all', 'in_progress', 'mastered', 'high_weightage'
let searchQuery = '';

const SUBJECT_SVGS = {
  em: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 5-7 7-7-7"/><path d="m5 19 7-7 7 7"/></svg>`,
  dl: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  coa: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>`,
  pds: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><circle cx="6" cy="19" r="3"/><circle cx="18" cy="19" r="3"/><line x1="10" x2="7.5" y1="7.5" y2="16.5"/><line x1="14" x2="16.5" y1="7.5" y2="16.5"/></svg>`,
  algo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  toc: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>`,
  cd: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  os: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
  dbms: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  cn: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><line x1="2" x2="22" y1="12" y2="12"/></svg>`,
  ga: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/><line x1="9" x2="15" y1="21" y2="21"/></svg>`
};

async function loadSyllabusData() {
  try {
    const res = await fetch('syllabus-data.json');
    syllabusData = await res.json();
    renderSyllabusModule();
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
    pct: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}

function setTopicStatus(key, status) {
  const prog = StorageManager.getSyllabusProgress();
  prog[key] = status;
  StorageManager.saveSyllabusProgress(prog);
  renderSyllabusModule();

  if (window.renderCommandCenter) window.renderCommandCenter();
}

function setSyllabusFilter(filterType, btn) {
  activeFilter = filterType;
  document.querySelectorAll('#syllabus-filter-pills button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderSyllabusModule();
}

function handleSyllabusSearch(val) {
  searchQuery = val.trim().toLowerCase();
  renderSyllabusModule();
}

function renderSyllabusModule() {
  const container = document.getElementById('syllabus-main-content');
  if (!container || !syllabusData) return;

  if (currentSubjectView) {
    renderSubjectExplorerView(container, currentSubjectView);
  } else {
    renderSubjectGrid(container);
  }
}

// 1. Grid of Subject Cards (Steam / Notion Style)
function renderSubjectGrid(container) {
  let filteredSubjects = syllabusData.subjects.filter(s => {
    const stats = calculateSubjectProgress(s);
    if (activeFilter === 'in_progress' && (stats.pct === 0 || stats.pct === 100)) return false;
    if (activeFilter === 'mastered' && stats.pct !== 100) return false;
    if (activeFilter === 'high_weightage' && !s.weightage.includes('8') && !s.weightage.includes('10') && !s.weightage.includes('13') && !s.weightage.includes('15')) return false;

    if (searchQuery) {
      const matchSubject = s.name.toLowerCase().includes(searchQuery);
      const matchTopic = s.units.some(u => u.topics.some(t => t.toLowerCase().includes(searchQuery)));
      return matchSubject || matchTopic;
    }
    return true;
  });

  if (filteredSubjects.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align:center; padding:40px 20px;">
        <div style="font-size:15px; font-weight:600; color:var(--text-sub);">No subjects matched your filter or search criteria.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:20px;">
      ${filteredSubjects.map(s => {
        const stats = calculateSubjectProgress(s);
        const iconSVG = SUBJECT_SVGS[s.id] || SUBJECT_SVGS['em'];
        const isMastered = stats.pct === 100;
        const isInProgress = stats.pct > 0 && stats.pct < 100;

        return `
          <div class="card subject-card-rich" style="padding:20px; display:flex; flex-direction:column; justify-space-between; cursor:pointer;" onclick="openSubjectExplorer('${s.id}')">
            <div>
              <!-- Top Row: Icon, Title, Weightage Badge -->
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:12px;">
                  <div style="width:40px; height:40px; border-radius:8px; background:var(--bg-surface-hover); color:var(--accent-primary); display:flex; align-items:center; justify-content:center; border:1px solid var(--border-color);">
                    ${iconSVG}
                  </div>
                  <div>
                    <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; line-height:1.2;">${s.name}</h3>
                    <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${s.code}</div>
                  </div>
                </div>

                <span style="font-size:11px; font-weight:600; background:var(--bg-surface-hover); border:1px solid var(--border-color); color:var(--text-sub); padding:3px 8px; border-radius:6px; white-space:nowrap;">
                  Weightage ${s.weightage}
                </span>
              </div>

              <!-- Thicker Progress Bar & Statistics -->
              <div style="margin:16px 0;">
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:600; margin-bottom:6px;">
                  <span style="color:${isMastered ? 'var(--color-success)' : isInProgress ? 'var(--accent-primary)' : 'var(--text-muted)'};">
                    ${stats.pct}% Completed
                  </span>
                  <span style="color:var(--text-sub);">${stats.completed} / ${stats.total} Topics</span>
                </div>

                <div class="progress-bar-bg" style="height:10px; border-radius:5px;">
                  <div class="progress-bar-fill" style="width:${stats.pct}%; height:100%; border-radius:5px; background:${isMastered ? 'var(--color-success)' : isInProgress ? 'var(--accent-primary)' : 'var(--border-color)'};"></div>
                </div>
              </div>
            </div>

            <!-- Footer Quick Info & Action -->
            <div style="display:flex; justify-content:space-between; align-items:center; pt:12px; border-top:1px solid var(--border-color); margin-top:12px;">
              <span style="font-size:12px; color:var(--text-sub); font-weight:500;">
                ${s.units.length} Units • ${stats.total} Topics
              </span>
              <button class="btn-secondary" style="font-size:12px; padding:5px 12px;" onclick="event.stopPropagation(); openSubjectExplorer('${s.id}')">
                Explore Outline ➔
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 2. Notion-Style Hierarchical Subject Detail Explorer with Breadcrumb Navigation
function openSubjectExplorer(subjectId) {
  currentSubjectView = subjectId;
  renderSyllabusModule();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeSubjectExplorer() {
  currentSubjectView = null;
  renderSyllabusModule();
}

function renderSubjectExplorerView(container, subjectId) {
  const subject = syllabusData.subjects.find(s => s.id === subjectId);
  if (!subject) {
    currentSubjectView = null;
    renderSubjectGrid(container);
    return;
  }

  const stats = calculateSubjectProgress(subject);
  const iconSVG = SUBJECT_SVGS[subject.id] || SUBJECT_SVGS['em'];
  const prog = StorageManager.getSyllabusProgress();

  container.innerHTML = `
    <!-- Sticky Breadcrumb & Navigation Bar -->
    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:12px 18px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; position:sticky; top:70px; z-index:100; backdrop-filter:blur(10px); box-shadow:0 4px 12px rgba(0,0,0,0.15);">
      <div style="display:flex; align-items:center; gap:8px; font-size:13px;">
        <span style="color:var(--accent-primary); font-weight:600; cursor:pointer;" onclick="closeSubjectExplorer()">Syllabus</span>
        <span style="color:var(--text-muted);">/</span>
        <span style="font-weight:700; color:var(--text-main);">${subject.name}</span>
      </div>

      <div style="display:flex; gap:8px;">
        <button class="btn-secondary" style="font-size:12px; padding:5px 12px;" onclick="closeSubjectExplorer()">
          ← Back to All Subjects
        </button>
        <button class="btn-primary" style="font-size:12px; padding:5px 14px;" onclick="startSubjectPractice('${subject.id}')">
          Practice Subject ➔
        </button>
      </div>
    </div>

    <!-- Main Explorer Header Card -->
    <div class="card" style="margin-bottom:20px; padding:20px 24px;">
      <div style="display:flex; align-items:center; gap:14px; margin-bottom:16px;">
        <div style="width:48px; height:48px; border-radius:10px; background:var(--bg-surface-hover); color:var(--accent-primary); display:flex; align-items:center; justify-content:center; border:1px solid var(--border-color);">
          ${iconSVG}
        </div>
        <div>
          <h1 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; margin-bottom:2px;">${subject.name}</h1>
          <div style="font-size:12px; color:var(--text-sub);">
            ${subject.code} • Weightage: <strong>${subject.weightage}</strong> • ${stats.total} Topics
          </div>
        </div>
      </div>

      <!-- Subject Progress Overview Bar -->
      <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:12px 16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; font-weight:600; margin-bottom:6px;">
          <span>Subject Overall Completion</span>
          <span>${stats.pct}% (${stats.completed}/${stats.total} Topics)</span>
        </div>
        <div class="progress-bar-bg" style="height:8px; border-radius:4px;">
          <div class="progress-bar-fill" style="width:${stats.pct}%; height:100%; border-radius:4px; background:${stats.pct === 100 ? 'var(--color-success)' : 'var(--accent-primary)'};"></div>
        </div>
      </div>
    </div>

    <!-- Units & Topics Outline Tree (Notion Style) -->
    <div style="display:flex; flex-direction:column; gap:16px;">
      ${subject.units.map((unit, uIdx) => {
        return `
          <div class="card" style="padding:18px 24px;">
            <div style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
              <span>Unit ${uIdx + 1}: ${unit.name}</span>
              <span style="font-size:12px; color:var(--text-sub); font-weight:500;">${unit.topics.length} Topics</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px;">
              ${unit.topics.map((topic, tIdx) => {
                const key = getTopicKey(subject.id, uIdx, tIdx);
                const status = prog[key] || 'not_started';

                const matchesSearch = searchQuery ? topic.toLowerCase().includes(searchQuery) : true;
                if (searchQuery && !matchesSearch) return '';

                return `
                  <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; flex-wrap:wrap; gap:10px;">
                    <div style="display:flex; align-items:center; gap:12px; flex:1;">
                      <span style="font-size:13px; ${status === 'mastered' ? 'opacity:0.75; text-decoration:line-through;' : 'font-weight:500;'}">${topic}</span>
                    </div>

                    <div style="display:flex; align-items:center; gap:8px;">
                      <select class="status-select" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:4px 8px; border-radius:6px; font-size:12px; cursor:pointer;" onchange="setTopicStatus('${key}', this.value)">
                        <option value="not_started" ${status === 'not_started' ? 'selected' : ''}>Not Started</option>
                        <option value="in_progress" ${status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                        <option value="mastered" ${status === 'mastered' ? 'selected' : ''}>Mastered</option>
                      </select>

                      <button class="btn-secondary" style="font-size:11px; padding:4px 10px;" onclick="practiceSpecificTopic('${subject.id}', '${topic.replace(/'/g, "\\'")}')">
                        Practice ➔
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}
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

window.renderSyllabusModule = renderSyllabusModule;
window.setSyllabusFilter = setSyllabusFilter;
window.handleSyllabusSearch = handleSyllabusSearch;
window.openSubjectExplorer = openSubjectExplorer;
window.closeSubjectExplorer = closeSubjectExplorer;
window.setTopicStatus = setTopicStatus;
window.startSubjectPractice = startSubjectPractice;
window.practiceSpecificTopic = practiceSpecificTopic;

document.addEventListener('DOMContentLoaded', () => {
  loadSyllabusData();
});
