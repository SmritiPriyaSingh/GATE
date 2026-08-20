// LocalStorage State Manager with Demo Mode Architecture for GATE CSE 2027 Platform

const STORAGE_KEYS = {
  SYLLABUS_PROGRESS: 'gate2027_syllabus_progress',
  USER_NOTES: 'gate2027_user_notes',
  BOOKMARKS: 'gate2027_bookmarks',
  TEST_HISTORY: 'gate2027_test_history',
  TODAY_TASKS: 'gate2027_today_tasks',
  LAST_TOPIC: 'gate2027_last_topic',
  STUDY_HEATMAP: 'gate2027_study_heatmap',
  USER_PROFILE: 'gate2027_user_profile',
  USER_SETTINGS: 'gate2027_user_settings',
  PYQ_PROGRESS: 'gate2027_pyq_progress',
  DEMO_MODE: 'gate2027_demo_mode'
};

// 🌟 Realistic Demo Data Bundle (6 Months Progress / 800+ Solved Questions)
const DEMO_DATA = {
  totalQuestionsSolved: 845,
  overallAccuracy: 82.4,
  studyHours: 164.5,
  currentStreak: 21,

  subjectProgress: {
    'em_u0_t0': 'completed', 'em_u0_t1': 'completed', 'em_u1_t0': 'in-progress',
    'pds_u0_t0': 'completed', 'pds_u0_t1': 'completed', 'pds_u1_t0': 'completed',
    'os_u0_t0': 'completed', 'os_u1_t0': 'in-progress', 'os_u1_t1': 'not-started',
    'dbms_u0_t0': 'completed', 'dbms_u0_t1': 'completed',
    'algo_u0_t0': 'in-progress', 'cn_u0_t0': 'in-progress', 'coa_u0_t0': 'completed'
  },

  testHistory: [
    { date: '2026-08-19', score: '72.10', maxMarks: 100, accuracy: 88, correctCount: 51, wrongCount: 7, unattemptedCount: 7 },
    { date: '2026-08-15', score: '68.40', maxMarks: 100, accuracy: 85, correctCount: 48, wrongCount: 9, unattemptedCount: 8 },
    { date: '2026-08-10', score: '61.00', maxMarks: 100, accuracy: 80, correctCount: 42, wrongCount: 11, unattemptedCount: 12 },
    { date: '2026-08-04', score: '58.20', maxMarks: 100, accuracy: 78, correctCount: 40, wrongCount: 12, unattemptedCount: 13 },
    { date: '2026-07-28', score: '64.50', maxMarks: 100, accuracy: 82, correctCount: 45, wrongCount: 10, unattemptedCount: 10 }
  ],

  todayTasks: [
    { id: 'dt1', text: 'Solve 15 OS Deadlock PYQs', done: true },
    { id: 'dt2', text: 'Revise Linear Algebra Eigenvalues', done: false },
    { id: 'dt3', text: 'Attempt Custom Mini Mock (Algorithms)', done: false }
  ],

  lastTopic: {
    subject: 'Operating Systems',
    topic: 'Deadlock Avoidance & Banker Algorithm',
    subjectId: 'os',
    time: new Date().toISOString()
  },

  heatmap: {
    '2026-08-19': 14, '2026-08-18': 10, '2026-08-17': 8, '2026-08-16': 12,
    '2026-08-15': 15, '2026-08-14': 6, '2026-08-13': 9, '2026-08-12': 11,
    '2026-08-11': 7, '2026-08-10': 13, '2026-08-09': 5, '2026-08-08': 10
  },

  bookmarks: ['pyq_2026_q1', 'pyq_2025_q5', 'pyq_2024_q12'],

  notes: {
    'Linear Algebra': 'Eigenvalues: det(A - lambda*I) = 0. Trace = sum of eigenvalues.',
    'Deadlock Conditions': '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait'
  },

  pyqProgress: {
    '2026': { completed: 65, accuracy: 88, bestScore: '72.10', lastAttempt: 'Today' },
    '2025': { completed: 42, accuracy: 82, bestScore: '68.40', lastAttempt: '3 days ago' },
    '2024': { completed: 65, accuracy: 80, bestScore: '61.00', lastAttempt: '1 week ago' }
  }
};

const StorageManager = {
  // Demo Mode Control
  isDemoMode() {
    const val = localStorage.getItem(STORAGE_KEYS.DEMO_MODE);
    if (val === null) return true; // Default to Demo Mode ON so dashboards are pre-populated on first launch
    return val === 'true';
  },
  setDemoMode(enabled) {
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, enabled ? 'true' : 'false');
    
    // Instantly re-render all modules without full page reload
    if (window.renderDashboardStats) window.renderDashboardStats();
    if (window.renderCommandCenter) window.renderCommandCenter();
    if (window.renderAnalyticsModule) window.renderAnalyticsModule();
    if (window.renderPracticeModule) window.renderPracticeModule();
    if (window.renderPYQLibrary) window.renderPYQLibrary();
    if (window.renderCBTWelcomeHub) window.renderCBTWelcomeHub();
    if (window.initRevisionModule) window.initRevisionModule();
    if (window.renderProfileModule) window.renderProfileModule();
    if (window.renderSettingsModule) window.renderSettingsModule();
  },

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
  saveAvatar(avatarUrl) {
    return this.saveProfile({ avatar: avatarUrl });
  },
  removeAvatar() {
    return this.saveProfile({ avatar: null });
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
    if (this.isDemoMode()) return DEMO_DATA.subjectProgress;
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SYLLABUS_PROGRESS)) || {};
  },
  saveSyllabusProgress(data) {
    localStorage.setItem(STORAGE_KEYS.SYLLABUS_PROGRESS, JSON.stringify(data));
  },

  // Today's Tasks
  getTodayTasks() {
    if (this.isDemoMode()) return DEMO_DATA.todayTasks;
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TODAY_TASKS)) || [];
  },
  saveTodayTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TODAY_TASKS, JSON.stringify(tasks));
  },

  // Last Studied Topic
  getLastTopic() {
    if (this.isDemoMode()) return DEMO_DATA.lastTopic;
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
    if (this.isDemoMode()) return DEMO_DATA.heatmap;
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDY_HEATMAP)) || {};
  },

  // Bookmarks
  getBookmarks() {
    if (this.isDemoMode()) return DEMO_DATA.bookmarks;
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

  // Test History
  getTestHistory() {
    if (this.isDemoMode()) return DEMO_DATA.testHistory;
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEST_HISTORY)) || [];
  },
  saveTestHistory(history) {
    localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(history));
  },

  // PYQ Paper Progress
  getPYQProgress() {
    if (this.isDemoMode()) return DEMO_DATA.pyqProgress;
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PYQ_PROGRESS)) || {};
  },
  savePYQProgress(progress) {
    localStorage.setItem(STORAGE_KEYS.PYQ_PROGRESS, JSON.stringify(progress));
  },

  // Notes
  getAllTopicNotes() {
    if (this.isDemoMode()) return DEMO_DATA.notes;
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_NOTES)) || {};
  },
  saveTopicNotes(key, text) {
    const notes = this.getAllTopicNotes();
    notes[key] = text;
    localStorage.setItem(STORAGE_KEYS.USER_NOTES, JSON.stringify(notes));
  },

  // Clear All Data
  clearAllData() {
    localStorage.clear();
    window.location.reload();
  }
};

window.StorageManager = StorageManager;
