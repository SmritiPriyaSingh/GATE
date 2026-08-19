// LocalStorage State Manager for GATE CSE 2027 Platform

const STORAGE_KEYS = {
  SYLLABUS_PROGRESS: 'gate2027_syllabus_progress',
  USER_NOTES: 'gate2027_user_notes',
  BOOKMARKS: 'gate2027_bookmarks',
  TEST_HISTORY: 'gate2027_test_history',
  TODAY_TASKS: 'gate2027_today_tasks',
  LAST_TOPIC: 'gate2027_last_topic',
  STUDY_HEATMAP: 'gate2027_study_heatmap',
  DAILY_HOURS: 'gate2027_daily_hours',
  USER_PROFILE: 'gate2027_user_profile',
  USER_SETTINGS: 'gate2027_user_settings'
};

const StorageManager = {
  // User Profile
  getProfile() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) || {
      name: 'Smriti Priya Singh',
      email: 'smriti.singh@gate2027.edu',
      targetYear: 'GATE 2027',
      branch: 'Computer Science & Engineering',
      joinedDate: 'August 2026',
      avatar: null
    };
  },
  saveProfile(profileData) {
    const existing = this.getProfile();
    const updated = { ...existing, ...profileData };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    return updated;
  },
  saveAvatar(base64Data) {
    const profile = this.getProfile();
    profile.avatar = base64Data;
    this.saveProfile(profile);
  },
  removeAvatar() {
    const profile = this.getProfile();
    profile.avatar = null;
    this.saveProfile(profile);
  },

  // User Settings
  getSettings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SETTINGS)) || {
      theme: 'dark',
      dailyReminder: true,
      testReminder: true
    };
  },
  saveSettings(settingsData) {
    const existing = this.getSettings();
    const updated = { ...existing, ...settingsData };
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(updated));
    return updated;
  },

  // Syllabus Progress
  getSyllabusProgress() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SYLLABUS_PROGRESS)) || {};
  },
  saveSyllabusProgress(data) {
    localStorage.setItem(STORAGE_KEYS.SYLLABUS_PROGRESS, JSON.stringify(data));
  },
  toggleTopicStatus(topicId) {
    const prog = this.getSyllabusProgress();
    const current = prog[topicId] || 'not-started';
    const nextMap = {
      'not-started': 'in-progress',
      'in-progress': 'completed',
      'completed': 'not-started'
    };
    prog[topicId] = nextMap[current];
    this.saveSyllabusProgress(prog);
    return prog[topicId];
  },

  // Today's Tasks
  getTodayTasks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TODAY_TASKS)) || [];
  },
  saveTodayTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TODAY_TASKS, JSON.stringify(tasks));
  },
  toggleTask(taskId) {
    const tasks = this.getTodayTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.done = !task.done;
      this.saveTodayTasks(tasks);
    }
    return tasks;
  },
  addTask(text) {
    if (!text.trim()) return;
    const tasks = this.getTodayTasks();
    tasks.push({ id: 't_' + Date.now(), text: text.trim(), done: false });
    this.saveTodayTasks(tasks);
    return tasks;
  },
  deleteTask(taskId) {
    const tasks = this.getTodayTasks().filter(t => t.id !== taskId);
    this.saveTodayTasks(tasks);
    return tasks;
  },

  // Last Studied Topic
  getLastTopic() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_TOPIC)) || null;
  },
  setLastTopic(subject, topic, subjectId) {
    localStorage.setItem(STORAGE_KEYS.LAST_TOPIC, JSON.stringify({
      subject,
      topic,
      subjectId,
      time: new Date().toISOString()
    }));
  },

  // Heatmap & Activity
  getHeatmapData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDY_HEATMAP)) || {};
  },
  logDailyActivity(count = 1) {
    const today = new Date().toISOString().split('T')[0];
    const map = this.getHeatmapData();
    map[today] = (map[today] || 0) + count;
    localStorage.setItem(STORAGE_KEYS.STUDY_HEATMAP, JSON.stringify(map));
  },

  // Bookmarks
  getBookmarks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) || [];
  },
  toggleBookmark(questionId) {
    const b = this.getBookmarks();
    const idx = b.indexOf(questionId);
    if (idx > -1) {
      b.splice(idx, 1);
    } else {
      b.push(questionId);
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(b));
    return b.includes(questionId);
  },

  // Notes
  getNotes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_NOTES)) || {};
  },

  // Clear All Data
  clearAllData() {
    localStorage.clear();
    window.location.reload();
  }
};

window.StorageManager = StorageManager;
