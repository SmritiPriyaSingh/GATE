// Settings & Data Backup Module

function exportUserDataBackup() {
  StorageManager.exportBackupJSON();
}

function importUserDataBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const success = StorageManager.importBackupJSON(data);
      if (success) {
        alert('🎉 Backup data imported successfully! Reloading application...');
        window.location.reload();
      } else {
        alert('Failed to import backup file. Invalid format.');
      }
    } catch (err) {
      alert('Error parsing JSON backup file.');
    }
  };
  reader.readAsText(file);
}

function confirmResetAllData() {
  if (confirm('⚠️ WARNING: This will erase all your syllabus progress, test history, bookmarks, and notes! Are you sure?')) {
    if (confirm('Are you ABSOLUTELY sure? This action cannot be undone unless you have a JSON backup.')) {
      StorageManager.resetAllData();
      alert('Application data reset successfully. Reloading...');
      window.location.reload();
    }
  }
}
