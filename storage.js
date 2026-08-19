// LocalStorage State Manager for GATE CSE 2027 Platform

const STORAGE_KEYS = {
  SYLLABUS_PROGRESS: 'gate2027_syllabus_progress',
  USER_NOTES: 'gate2027_user_notes',
  BOOKMARKS: 'gate2027_bookmarks',
  TEST_HISTORY: 'gate2027_test_history',
  TODAY_TASKS: 'gate2027_today_tasks',
  LAST_TOPIC: 'gate2027_last_topic',
  STUDY_HEATMAP: 'gate2027_study_heatmap',
  DAILY_HOURS: 'gate2027_daily_hours'
};

const StorageManager = {
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

  // Today's Mission Tasks
  getTodayTasks() {
    const saved = localStorage.getItem(STORAGE_KEYS.TODAY_TASKS);
    if (saved) return JSON.parse(saved);

    // Default missions
    return [
      { id: 't1', text: 'Finish Scheduling Algorithms (OS)', done: false },
      { id: 't2', text: 'Solve 20 Computer Networks PYQs', done: false },
      { id: 't3', text: 'Revise DBMS SQL Queries', done: true },
      { id: 't4', text: 'Attempt 1 GATE Mini Mock Test', done: false }
    ];
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

  // Last Studied Topic (Continue Card)
  getLastTopic() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_TOPIC)) || {
      subject: 'Operating Systems',
      topic: 'Deadlocks & Synchronization',
      view: 'practice',
      subjectId: 'os'
    };
  },
  setLastTopic(subject, topic, subjectId = 'os') {
    localStorage.setItem(STORAGE_KEYS.LAST_TOPIC, JSON.stringify({
      subject,
      topic,
      subjectId,
      time: new Date().toISOString()
    }));
  },

  // Study Heatmap & Activity Log
  getHeatmapData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDY_HEATMAP)) || {};
  },
  logDailyActivity(count = 1) {
    const today = new Date().toISOString().split('T')[0];
    const map = this.getHeatmapData();
    map[today] = (map[today] || 0) + count;
    localStorage.setItem(STORAGE_KEYS.STUDY_HEATMAP, JSON.stringify(map));
  },

  // Daily Study Hours
  getDailyHours() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_HOURS)) || {
      Mon: 3.5, Tue: 4.0, Wed: 5.5, Thu: 2.0, Fri: 4.5, Sat: 6.0, Sun: 3.0
    };
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

  // User Notes
  getNotes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_NOTES)) || {};
  },
  saveNote(topicId, noteContent) {
    const n = this.getNotes();
    n[topicId] = noteContent;
    localStorage.setItem(STORAGE_KEYS.USER_NOTES, JSON.stringify(n));
  }
};

window.StorageManager = StorageManager;
