// Syllabus Tracker Module

let syllabusData = null;
let userSyllabusProgress = JSON.parse(localStorage.getItem('gate2027_syllabus_progress')) || {};

async function loadSyllabusData() {
  try {
    const res = await fetch('syllabus-data.json');
    syllabusData = await res.json();
    renderSyllabusTracker();
    updateGlobalProgressHeader();
  } catch (err) {
    console.error('Failed to load syllabus-data.json:', err);
  }
}

function getTopicKey(subjectId, unitIndex, topicIndex) {
  return `${subjectId}_u${unitIndex}_t${topicIndex}`;
}

function setTopicStatus(key, status) {
  userSyllabusProgress[key] = status;
  localStorage.setItem('gate2027_syllabus_progress', JSON.stringify(userSyllabusProgress));
  renderSyllabusTracker();
  updateGlobalProgressHeader();
  if (window.renderDashboardStats) window.renderDashboardStats();
}

function calculateSubjectProgress(subject) {
  let total = 0;
  let completed = 0;

  subject.units.forEach((unit, uIdx) => {
    unit.topics.forEach((topic, tIdx) => {
      total++;
      const key = getTopicKey(subject.id, uIdx, tIdx);
      if (userSyllabusProgress[key] === 'mastered') {
        completed++;
      } else if (userSyllabusProgress[key] === 'in_progress') {
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

function calculateOverallSyllabusProgress() {
  if (!syllabusData) return 0;
  let totalTopics = 0;
  let completedTopics = 0;

  syllabusData.subjects.forEach(subject => {
    const stats = calculateSubjectProgress(subject);
    totalTopics += stats.total;
    completedTopics += stats.completed;
  });

  return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
}

function updateGlobalProgressHeader() {
  const pct = calculateOverallSyllabusProgress();
  const fillEl = document.getElementById('global-progress-fill');
  const textEl = document.getElementById('global-progress-pct');
  if (fillEl) fillEl.style.width = `${pct}%`;
  if (textEl) textEl.textContent = `${pct}% Completed`;
}

function renderSyllabusTracker(filterText = '', filterStatus = 'all') {
  const container = document.getElementById('syllabus-subjects-list');
  if (!container || !syllabusData) return;

  container.innerHTML = '';

  syllabusData.subjects.forEach(subject => {
    const stats = calculateSubjectProgress(subject);

    const subjectCard = document.createElement('div');
    subjectCard.className = 'subject-card';

    const header = document.createElement('div');
    header.className = 'subject-header';
    header.innerHTML = `
      <div class="subject-title-group">
        <div class="subject-icon-box" style="background: ${subject.color}20; color: ${subject.color};">
          ${subject.icon}
        </div>
        <div>
          <div class="subject-name">${subject.name} <span style="font-size:12px; color:var(--text-muted);">(${subject.code})</span></div>
          <div class="subject-meta">Weightage: ${subject.weightage} • ${stats.completed}/${stats.total} topics</div>
        </div>
      </div>
      <div class="subject-progress-stats">
        <span class="badge badge-purple">${stats.pct}%</span>
        <span style="font-size:18px; color:var(--text-muted);" class="toggle-icon">▼</span>
      </div>
    `;

    const topicListContainer = document.createElement('div');
    topicListContainer.className = 'topic-list';

    let hasMatchingTopics = false;

    subject.units.forEach((unit, uIdx) => {
      const unitTitle = document.createElement('div');
      unitTitle.className = 'unit-group-title';
      unitTitle.textContent = unit.name;
      topicListContainer.appendChild(unitTitle);

      unit.topics.forEach((topic, tIdx) => {
        const key = getTopicKey(subject.id, uIdx, tIdx);
        const currentStatus = userSyllabusProgress[key] || 'not_started';

        if (filterStatus !== 'all' && currentStatus !== filterStatus) return;
        if (filterText && !topic.toLowerCase().includes(filterText.toLowerCase())) return;

        hasMatchingTopics = true;

        const topicRow = document.createElement('div');
        topicRow.className = 'topic-item';

        topicRow.innerHTML = `
          <div class="topic-label">
            <span style="color: ${currentStatus === 'mastered' ? 'var(--color-success)' : currentStatus === 'in_progress' ? 'var(--color-warning)' : 'var(--text-muted)'}; font-size:16px;">
              ${currentStatus === 'mastered' ? '✓' : currentStatus === 'in_progress' ? '⏳' : '○'}
            </span>
            <span style="${currentStatus === 'mastered' ? 'text-decoration: line-through; opacity:0.8;' : ''}">${topic}</span>
          </div>
          <div>
            <select class="status-select" onchange="setTopicStatus('${key}', this.value)">
              <option value="not_started" ${currentStatus === 'not_started' ? 'selected' : ''}>Not Started</option>
              <option value="in_progress" ${currentStatus === 'in_progress' ? 'selected' : ''}>In Progress</option>
              <option value="mastered" ${currentStatus === 'mastered' ? 'selected' : ''}>Mastered ✓</option>
            </select>
          </div>
        `;

        topicListContainer.appendChild(topicRow);
      });
    });

    if (filterText || filterStatus !== 'all') {
      if (!hasMatchingTopics) return; // Skip rendering empty subject when filtering
      topicListContainer.style.display = 'flex';
    } else {
      topicListContainer.style.display = 'none'; // Accordion collapsed by default
    }

    header.addEventListener('click', () => {
      const isVisible = topicListContainer.style.display === 'flex';
      topicListContainer.style.display = isVisible ? 'none' : 'flex';
      header.querySelector('.toggle-icon').textContent = isVisible ? '▼' : '▲';
    });

    subjectCard.appendChild(header);
    subjectCard.appendChild(topicListContainer);
    container.appendChild(subjectCard);
  });
}

// Search and Filter Listeners
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('syllabus-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSyllabusTracker(e.target.value, document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSyllabusTracker(document.getElementById('syllabus-search')?.value || '', btn.dataset.filter);
    });
  });

  loadSyllabusData();
});
