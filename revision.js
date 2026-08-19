// Revision & Topic Notes Module

let activeRevisionCategory = 'bookmarks';

function initRevisionModule() {
  renderRevisionCategory('bookmarks');
}

function renderRevisionCategory(category) {
  activeRevisionCategory = category;
  const container = document.getElementById('revision-content-area');
  if (!container) return;

  if (category === 'bookmarks') {
    const bookmarkedIds = StorageManager.getBookmarks();
    const bookmarkedQuestions = allPracticeQuestions.filter(q => bookmarkedIds.includes(q.id));

    if (bookmarkedQuestions.length === 0) {
      container.innerHTML = `
        <div class="glass-card" style="text-align:center; padding:40px; color:var(--text-muted);">
          ⭐ No bookmarked questions yet! Click the "☆ Bookmark" button while practicing to add questions here for quick revision.
        </div>
      `;
    } else {
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${bookmarkedQuestions.map((q, idx) => `
            <div class="glass-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span class="badge badge-purple">${q.subjectName} &bull; ${q.type}</span>
                <button class="btn-secondary" style="padding:4px 10px; font-size:12px;" onclick="StorageManager.toggleBookmark('${q.id}'); renderRevisionCategory('bookmarks');">Remove ⭐</button>
              </div>
              <div style="font-weight:600; font-size:15px;">${q.text}</div>
              <div class="solution-card">
                <strong>Solution:</strong>
                <p style="margin-top:4px; white-space:pre-line;">${q.solution}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  } else if (category === 'notes') {
    const notes = StorageManager.getAllTopicNotes();
    const keys = Object.keys(notes);

    container.innerHTML = `
      <div class="glass-card" style="margin-bottom:20px;">
        <h3 class="section-title">📝 My Personal Study Notes</h3>
        <p style="color:var(--text-secondary); font-size:14px; margin-bottom:16px;">Write notes for any syllabus topic below. Everything is saved automatically.</p>
        
        <div style="display:flex; gap:12px; margin-bottom:16px;">
          <input type="text" id="custom-note-key" class="search-input" placeholder="Topic name (e.g. Recurrence Relations)..." style="flex:1;">
        </div>
        <textarea id="custom-note-text" class="search-input" style="width:100%; height:120px; font-family:var(--font-main);" placeholder="Write key formulas, concepts, or shortcuts here..."></textarea>
        <button class="btn-primary" style="margin-top:12px;" onclick="saveCustomTopicNote()">💾 Save Note</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;">
        ${keys.length === 0 ? `<div style="color:var(--text-muted); text-align:center; padding:20px;">No saved notes yet. Write your first note above!</div>` :
          keys.map(k => `
            <div class="glass-card">
              <div style="font-weight:700; color:var(--accent-primary); margin-bottom:6px;">${k}</div>
              <div style="white-space:pre-line; color:var(--text-primary); font-size:14px;">${notes[k]}</div>
            </div>
          `).join('')
        }
      </div>
    `;
  }
}

function saveCustomTopicNote() {
  const key = document.getElementById('custom-note-key')?.value.trim();
  const text = document.getElementById('custom-note-text')?.value.trim();

  if (!key || !text) {
    alert('Please enter both a topic name and note text.');
    return;
  }

  StorageManager.saveTopicNotes(key, text);
  alert('Note saved successfully!');
  renderRevisionCategory('notes');
}

document.addEventListener('DOMContentLoaded', () => {
  initRevisionModule();
});
