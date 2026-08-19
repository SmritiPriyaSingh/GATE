// Clean Platform Settings & Preferences Engine

document.addEventListener('DOMContentLoaded', () => {
  renderSettingsModule();
});

function renderSettingsModule() {
  const container = document.getElementById('settings-container');
  if (!container) return;

  const settings = StorageManager.getSettings();
  const currentTheme = localStorage.getItem('gate2027_theme') || 'dark';

  container.innerHTML = `
    <!-- 1. Appearance Settings -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-bottom:6px;">Appearance & Theme</h3>
      <p style="font-size:13px; color:var(--text-sub); margin-bottom:14px;">Select your preferred workspace theme to reduce eye fatigue during long study sessions.</p>
      <div style="display:flex; gap:12px; align-items:center;">
        <button class="btn-secondary ${currentTheme === 'dark' ? 'active' : ''}" onclick="setAppTheme('dark')">Dark Mode</button>
        <button class="btn-secondary ${currentTheme === 'light' ? 'active' : ''}" onclick="setAppTheme('light')">Light Mode</button>
      </div>
    </div>

    <!-- 2. Developer Demo Mode Toggle -->
    <div class="card" style="margin-bottom:20px; border-left:4px solid var(--accent-primary);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="font-size:11px; font-weight:700; color:var(--accent-primary); text-transform:uppercase;">Developer Tool</div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-top:2px;">⚙️ Developer Demo Mode</h3>
          <p style="font-size:13px; color:var(--text-sub); margin-top:4px; max-width:600px;">
            Populate every dashboard, analytics page, and PYQ library with 6 months of realistic student study history (800+ solved questions, mock scores, heatmaps, and weak topics).
          </p>
        </div>

        <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:14px; font-weight:700;">
          <input type="checkbox" ${StorageManager.isDemoMode() ? 'checked' : ''} onchange="StorageManager.setDemoMode(this.checked)" style="transform:scale(1.2); cursor:pointer;">
          <span>Use Demo Data State</span>
        </label>
      </div>
    </div>

    <!-- 3. Notification Preferences -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-bottom:6px;">Reminders & Notifications</h3>
      <p style="font-size:13px; color:var(--text-sub); margin-bottom:14px;">Configure local study reminders and revision alerts.</p>
      
      <div style="display:flex; flex-direction:column; gap:12px;">
        <label style="display:flex; align-items:center; justify-content:space-between; font-size:13px; cursor:pointer;">
          <span>Daily Study Targets Reminder</span>
          <input type="checkbox" ${settings.dailyReminder ? 'checked' : ''} onchange="toggleSettingPreference('dailyReminder')">
        </label>
        <div class="dropdown-divider"></div>
        <label style="display:flex; align-items:center; justify-content:space-between; font-size:13px; cursor:pointer;">
          <span>Mock Test & CBT Exam Reminder</span>
          <input type="checkbox" ${settings.testReminder ? 'checked' : ''} onchange="toggleSettingPreference('testReminder')">
        </label>
      </div>
    </div>

    <!-- 3. Data Backup, Export & Import -->
    <div class="card" style="margin-bottom:20px;">
      <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-bottom:6px;">Data Management & Backup</h3>
      <p style="font-size:13px; color:var(--text-sub); margin-bottom:14px;">
        Export your complete preparation progress, bookmarks, notes, and test history as a JSON file, or restore from a previous backup.
      </p>
      <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
        <button class="btn-primary" onclick="exportUserDataBackup()">Export Progress JSON</button>
        <label class="btn-secondary" style="cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
          Import Backup JSON
          <input type="file" accept=".json" onchange="importUserDataBackup(event)" style="display:none;">
        </label>
      </div>
    </div>

    <!-- 4. Danger Zone: Reset & Clear Progress -->
    <div class="card" style="border-color:rgba(239,68,68,0.3); margin-bottom:20px;">
      <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:var(--color-danger); margin-bottom:6px;">Danger Zone</h3>
      <p style="font-size:13px; color:var(--text-sub); margin-bottom:14px;">
        Erase all local preparation data and reset the platform to a brand-new 0% empty state.
      </p>
      <button class="btn-secondary" style="color:var(--color-danger); border-color:var(--color-danger);" onclick="confirmResetAllData()">Clear All Progress & Reset Website</button>
    </div>

    <!-- 5. About Platform -->
    <div class="card">
      <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; margin-bottom:6px;">About Platform</h3>
      <div style="font-size:13px; color:var(--text-sub); line-height:1.6;">
        <div><strong>Version:</strong> GATE CSE v2.0 (Offline Single-Page Application)</div>
        <div><strong>Data Source:</strong> Official GATE Syllabus & 2007–2026 Previous Year Papers</div>
        <div><strong>Storage:</strong> 100% Client-Side LocalStorage (No external servers or tracking)</div>
      </div>
    </div>
  `;
}

function toggleSettingPreference(key) {
  const settings = StorageManager.getSettings();
  settings[key] = !settings[key];
  StorageManager.saveSettings(settings);
}

function setAppTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('gate2027_theme', theme);
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
    settings: StorageManager.getSettings(),
    testHistory: JSON.parse(localStorage.getItem('gate2027_test_history')) || [],
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GATE_Backup_${new Date().toISOString().split('T')[0]}.json`;
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
      if (data.settings) StorageManager.saveSettings(data.settings);
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
  if (confirm('ARE YOU SURE?\n\nThis will permanently erase all syllabus progress, test history, bookmarks, and daily tasks, resetting the website to a 0% empty state.')) {
    StorageManager.clearAllData();
  }
}

window.renderSettingsModule = renderSettingsModule;
window.toggleSettingPreference = toggleSettingPreference;
window.setAppTheme = setAppTheme;
window.exportUserDataBackup = exportUserDataBackup;
window.importUserDataBackup = importUserDataBackup;
window.confirmResetAllData = confirmResetAllData;
