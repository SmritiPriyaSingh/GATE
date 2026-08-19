// Comprehensive Platform Settings & Data Management Engine

document.addEventListener('DOMContentLoaded', () => {
  renderSettingsModule();
});

function renderSettingsModule() {
  const container = document.getElementById('settings-container');
  if (!container) return;

  const profile = StorageManager.getProfile();
  const currentTheme = localStorage.getItem('gate2027_theme') || 'dark';

  container.innerHTML = `
    <!-- 1. User Profile Settings -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-bottom:14px;">👤 User Profile</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; max-width:600px;">
        <div>
          <label style="font-size:13px; font-weight:600; display:block; margin-bottom:4px;">Aspirant Name</label>
          <input type="text" id="set-profile-name" value="${profile.name}" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:8px 12px; border-radius:6px; width:100%; font-size:13px;">
        </div>
        <div>
          <label style="font-size:13px; font-weight:600; display:block; margin-bottom:4px;">Target Exam Year</label>
          <input type="text" id="set-profile-year" value="${profile.targetYear}" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:8px 12px; border-radius:6px; width:100%; font-size:13px;">
        </div>
        <div style="grid-column: span 2;">
          <label style="font-size:13px; font-weight:600; display:block; margin-bottom:4px;">Target Branch</label>
          <input type="text" id="set-profile-branch" value="${profile.targetBranch}" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:8px 12px; border-radius:6px; width:100%; font-size:13px;">
        </div>
      </div>
      <button class="btn-primary" style="margin-top:14px; font-size:13px;" onclick="saveProfileSettings()">Save Profile</button>
    </div>

    <!-- 2. Theme Selection -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-bottom:14px;">🎨 Appearance & Theme</h3>
      <div style="display:flex; gap:12px; align-items:center;">
        <button class="btn-secondary ${currentTheme === 'dark' ? 'active' : ''}" onclick="setAppTheme('dark')">🌙 Dark Mode</button>
        <button class="btn-secondary ${currentTheme === 'light' ? 'active' : ''}" onclick="setAppTheme('light')">☀️ Light Mode</button>
      </div>
    </div>

    <!-- 3. Backup, Export & Import -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-bottom:14px;">💾 Data Backup & Restore</h3>
      <p style="font-size:13px; color:var(--text-sub); margin-bottom:14px;">
        Export your complete preparation progress, bookmarks, notes, and test history as a JSON file, or restore from a previous backup.
      </p>
      <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
        <button class="btn-primary" onclick="exportUserDataBackup()">💾 Export Progress JSON</button>
        <label class="btn-secondary" style="cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
          📥 Import Backup JSON
          <input type="file" accept=".json" onchange="importUserDataBackup(event)" style="display:none;">
        </label>
      </div>
    </div>

    <!-- 4. Danger Zone: Reset & Clear Progress -->
    <div class="card" style="border-color:rgba(239,68,68,0.3); margin-bottom:20px;">
      <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:var(--color-danger); margin-bottom:6px;">⚠️ Danger Zone</h3>
      <p style="font-size:13px; color:var(--text-sub); margin-bottom:14px;">
        Erase all local preparation data and reset the platform to a brand-new 0% empty state.
      </p>
      <button class="btn-secondary" style="color:var(--color-danger); border-color:var(--color-danger);" onclick="confirmResetAllData()">Clear All Progress & Reset Website</button>
    </div>

    <!-- 5. About Platform -->
    <div class="card">
      <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-bottom:6px;">ℹ️ About Platform</h3>
      <div style="font-size:13px; color:var(--text-sub); line-height:1.6;">
        <div><strong>Version:</strong> GATE CSE 2027 v2.0 (Offline Single-Page Application)</div>
        <div><strong>Data Source:</strong> Official GATE Syllabus & 2007–2026 Previous Year Papers</div>
        <div><strong>Storage:</strong> 100% Client-Side LocalStorage (No external servers or tracking)</div>
      </div>
    </div>
  `;
}

function saveProfileSettings() {
  const name = document.getElementById('set-profile-name')?.value || 'GATE Aspirant';
  const year = document.getElementById('set-profile-year')?.value || '2027';
  const branch = document.getElementById('set-profile-branch')?.value || 'Computer Science & IT';

  StorageManager.saveProfile({ name, targetYear: year, targetBranch: branch });
  alert('Profile updated successfully!');
}

function setAppTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('gate2027_theme', theme);
  const text = document.getElementById('theme-text');
  const icon = document.getElementById('theme-icon');
  if (text) text.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
  if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  renderSettingsModule();
}

function exportUserDataBackup() {
  const backup = {
    syllabusProgress: StorageManager.getSyllabusProgress(),
    tasks: StorageManager.getTodayTasks(),
    lastTopic: StorageManager.getLastTopic(),
    bookmarks: StorageManager.getBookmarks(),
    notes: StorageManager.getNotes(),
    profile: StorageManager.getProfile(),
    testHistory: JSON.parse(localStorage.getItem('gate2027_test_history')) || [],
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GATE_2027_Backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importUserDataBackup(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = JSON.parse(evt.target.result);
      if (data.syllabusProgress) StorageManager.saveSyllabusProgress(data.syllabusProgress);
      if (data.tasks) StorageManager.saveTodayTasks(data.tasks);
      if (data.bookmarks) localStorage.setItem('gate2027_bookmarks', JSON.stringify(data.bookmarks));
      if (data.notes) localStorage.setItem('gate2027_user_notes', JSON.stringify(data.notes));
      if (data.profile) StorageManager.saveProfile(data.profile);
      if (data.testHistory) localStorage.setItem('gate2027_test_history', JSON.stringify(data.testHistory));

      alert('Backup imported successfully! Page will refresh.');
      window.location.reload();
    } catch (err) {
      alert('Invalid backup file format.');
    }
  };
  reader.readAsText(file);
}

function confirmResetAllData() {
  if (confirm('🚨 ARE YOU SURE?\n\nThis will permanently erase all syllabus progress, test history, bookmarks, and daily tasks, resetting the website to a 0% empty state.')) {
    StorageManager.clearAllData();
  }
}

window.renderSettingsModule = renderSettingsModule;
window.saveProfileSettings = saveProfileSettings;
window.setAppTheme = setAppTheme;
window.exportUserDataBackup = exportUserDataBackup;
window.importUserDataBackup = importUserDataBackup;
window.confirmResetAllData = confirmResetAllData;
