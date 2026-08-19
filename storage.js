// LocalStorage Data Management Layer & Backup System

const STORAGE_KEYS = {
  SYLLABUS_PROGRESS: 'gate2027_syllabus_progress',
  TEST_HISTORY: 'gate2027_test_history',
  BOOKMARKS: 'gate2027_bookmarks',
  TOPIC_NOTES: 'gate2027_topic_notes',
  DAILY_GOAL: 'gate2027_daily_goal',
  STUDY_HOURS: 'gate2027_study_hours',
  THEME: 'gate2027_theme'
};

class StorageManager {
  static getSyllabusProgress() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SYLLABUS_PROGRESS)) || {};
  }

  static saveSyllabusProgress(progress) {
    localStorage.setItem(STORAGE_KEYS.SYLLABUS_PROGRESS, JSON.stringify(progress));
  }

  static getTestHistory() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEST_HISTORY)) || [];
  }

  static saveTestResult(result) {
    const history = this.getTestHistory();
    history.push({
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
      ...result
    });
    localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(history));
  }

  static getBookmarks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) || [];
  }

  static toggleBookmark(questionId) {
    let bookmarks = this.getBookmarks();
    if (bookmarks.includes(questionId)) {
      bookmarks = bookmarks.filter(id => id !== questionId);
    } else {
      bookmarks.push(questionId);
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    return bookmarks.includes(questionId);
  }

  static getTopicNotes(topicKey) {
    const notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOPIC_NOTES)) || {};
    return notes[topicKey] || '';
  }

  static saveTopicNotes(topicKey, noteText) {
    const notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOPIC_NOTES)) || {};
    notes[topicKey] = noteText;
    localStorage.setItem(STORAGE_KEYS.TOPIC_NOTES, JSON.stringify(notes));
  }

  static getAllTopicNotes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TOPIC_NOTES)) || {};
  }

  static exportBackupJSON() {
    const backupData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      data: {
        syllabusProgress: this.getSyllabusProgress(),
        testHistory: this.getTestHistory(),
        bookmarks: this.getBookmarks(),
        topicNotes: this.getAllTopicNotes()
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `GATE_2027_Backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  static importBackupJSON(jsonData) {
    try {
      if (jsonData.data) {
        if (jsonData.data.syllabusProgress) localStorage.setItem(STORAGE_KEYS.SYLLABUS_PROGRESS, JSON.stringify(jsonData.data.syllabusProgress));
        if (jsonData.data.testHistory) localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(jsonData.data.testHistory));
        if (jsonData.data.bookmarks) localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(jsonData.data.bookmarks));
        if (jsonData.data.topicNotes) localStorage.setItem(STORAGE_KEYS.TOPIC_NOTES, JSON.stringify(jsonData.data.topicNotes));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }

  static resetAllData() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
}

window.StorageManager = StorageManager;
