// GitHub / Discord / Notion-Style Profile Manager Engine

document.addEventListener('DOMContentLoaded', () => {
  renderProfileModule();
  updateHeaderProfileButton();

  // Prompt onboarding auth modal for first-time visitors
  if (!localStorage.getItem('gate2027_user_registered')) {
    setTimeout(() => {
      openAuthModal();
    }, 800);
  }
});

function updateHeaderProfileButton() {
  const btn = document.querySelector('.profile-trigger-btn');
  if (!btn) return;

  const profile = StorageManager.getProfile();
  const isRegistered = localStorage.getItem('gate2027_user_registered') === 'true';

  let iconHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  `;

  if (profile && profile.avatar) {
    iconHTML = `
      <img src="${profile.avatar}" alt="Avatar" style="width:22px; height:22px; border-radius:50%; object-fit:cover; border:1px solid var(--accent-primary);">
    `;
  }

  btn.innerHTML = `
    ${iconHTML}
    <span>${isRegistered && profile.name ? profile.name.split(' ')[0] : 'Profile'}</span>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
  `;

  // Update Dropdown Dynamic State
  const menuContainer = document.getElementById('profile-dropdown-menu');
  if (menuContainer) {
    if (isRegistered) {
      menuContainer.innerHTML = `
        <div style="padding:8px 12px; border-bottom:1px solid var(--border-color); font-size:11px; color:var(--text-sub);">
          Signed in as <strong style="color:var(--accent-primary); font-size:12px; display:block;">${profile.username || '@aspirant'}</strong>
        </div>
        <button class="dropdown-item" data-view="profile" onclick="navigateToView('profile')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>View Profile</span>
        </button>
        <button class="dropdown-item" onclick="openAuthModal()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <span>Edit Account Info</span>
        </button>
        <button class="dropdown-item" data-view="settings" onclick="navigateToView('settings')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span>Settings</span>
        </button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" style="color:var(--color-danger);" onclick="handleUserSignOut()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          <span>Sign Out</span>
        </button>
      `;
    } else {
      menuContainer.innerHTML = `
        <button class="dropdown-item" onclick="openAuthModal()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span style="color:var(--accent-primary); font-weight:700;">Sign In / Register</span>
        </button>
        <button class="dropdown-item" data-view="profile" onclick="navigateToView('profile')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>View Profile</span>
        </button>
        <button class="dropdown-item" data-view="settings" onclick="navigateToView('settings')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span>Settings</span>
        </button>
      `;
    }
  }
}

function renderProfileModule() {
  updateHeaderProfileButton();

  const container = document.getElementById('profile-container');
  if (!container) return;

  const profile = StorageManager.getProfile();
  const prog = StorageManager.getSyllabusProgress();
  const totalTopics = 85;
  const completedTopics = Object.values(prog).filter(v => v === 'completed').length;
  const syllabusPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const testHistory = StorageManager.getTestHistory();
  const mockCount = testHistory.length;
  let accuracy = 0;
  if (mockCount > 0) {
    const sumAcc = testHistory.reduce((acc, t) => acc + (t.accuracy || 0), 0);
    accuracy = Math.round(sumAcc / mockCount);
  }

  const heatmap = StorageManager.getHeatmapData();
  const solvedCount = Object.values(heatmap).reduce((a, b) => a + b, 0);

  const lastTopic = StorageManager.getLastTopic();
  const lastActiveText = lastTopic ? `${lastTopic.subject} (${lastTopic.topic})` : 'No active session recorded yet';
  const bookmarks = StorageManager.getBookmarks();

  const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const defaultAvatarSVG = `
    <div style="width:100px; height:100px; border-radius:50%; background:var(--accent-subtle); color:var(--accent-primary); display:flex; align-items:center; justify-content:center; font-size:32px; font-weight:700; border:2px solid var(--accent-primary);">
      ${initials || 'SP'}
    </div>
  `;

  const avatarHTML = profile.avatar 
    ? `<img src="${profile.avatar}" alt="User Avatar" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-primary); box-shadow:0 4px 12px rgba(0,0,0,0.15);">`
    : defaultAvatarSVG;

  container.innerHTML = `
    <!-- 1. Profile Header Card -->
    <div class="card" style="margin-bottom:24px; padding:24px;">
      <div style="display:flex; align-items:center; gap:24px; flex-wrap:wrap;">
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
          <div id="profile-avatar-display-box">
            ${avatarHTML}
          </div>
          <div style="display:flex; gap:6px;">
            <label class="btn-secondary" style="font-size:11px; padding:4px 10px; cursor:pointer;">
              Upload Photo
              <input type="file" id="avatar-file-input" accept="image/*" onchange="handleAvatarUpload(event)" style="display:none;">
            </label>
            ${profile.avatar ? `<button class="btn-secondary" style="font-size:11px; padding:4px 10px; color:var(--color-danger);" onclick="removeUserAvatar()">Remove</button>` : ''}
          </div>
        </div>

        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
            <div>
              <h1 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; margin-bottom:2px;" id="profile-display-name">${profile.name}</h1>
              <div style="font-size:13px; font-weight:600; color:var(--accent-primary); margin-bottom:6px;">${profile.username || '@aspirant'} &bull; <span style="color:var(--text-sub); font-weight:400;">${profile.email}</span></div>
              <div style="display:flex; gap:12px; flex-wrap:wrap; font-size:12px; color:var(--text-sub);">
                <span>Branch: <strong>${profile.branch}</strong></span>
                <span>Target: <strong>${profile.targetYear}</strong></span>
                <span>Joined: <strong>${profile.joinedDate}</strong></span>
              </div>
            </div>

            <!-- Profile Quick Actions -->
            <div style="display:flex; gap:8px;">
              <button class="btn-primary" style="font-size:13px; padding:6px 14px;" onclick="openEditProfileModal()">Edit Profile</button>
              <button class="btn-secondary" style="font-size:13px; padding:6px 14px;" onclick="navigateToView('settings')">Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. GATE Rank Prediction & Circular Progress Ring -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
      
      <!-- Rank & Score Prediction Card -->
      <div class="card" style="display:flex; justify-content:space-between; align-items:center; border-left:4px solid #10B981;">
        <div>
          <div style="font-size:11px; font-weight:700; color:#10B981; text-transform:uppercase;">GATE 2027 Prediction Engine</div>
          <div style="font-size:20px; font-weight:700; color:#F5F5F5; margin-top:2px;">Est. Score: 74.50 / 100</div>
          <div style="font-size:12px; color:#9CA3AF; margin-top:2px;">Predicted AIR Rank: <strong style="color:#10B981;">AIR < 350</strong> (Top 0.4%)</div>
        </div>
      </div>

      <!-- Circular Progress Ring Card -->
      <div class="card" style="display:flex; align-items:center; gap:16px;">
        <svg width="60" height="60" viewBox="0 0 36 36" style="transform:rotate(-90deg);">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#23262D" stroke-width="3" />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3B82F6" stroke-width="3" stroke-dasharray="${syllabusPct}, 100" />
        </svg>
        <div>
          <div style="font-size:11px; font-weight:700; color:#3B82F6; text-transform:uppercase;">Mastery Level</div>
          <div style="font-size:18px; font-weight:700; color:#F5F5F5;">${syllabusPct}% Syllabus Covered</div>
          <div style="font-size:11px; color:#9CA3AF;">${completedTopics} of 85 Core Topics Mastered</div>
        </div>
      </div>

    </div>

    <!-- 3. Achievements & Badges Bar -->
    <div class="card" style="margin-bottom:20px;">
      <div style="font-size:13px; font-weight:700; color:#F5F5F5; margin-bottom:10px;">Achievements & Badges</div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <span style="background:rgba(59,130,246,0.12); color:#3B82F6; border:1px solid rgba(59,130,246,0.3); padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700;">100+ Questions Milestone</span>
        <span style="background:rgba(16,185,129,0.12); color:#10B981; border:1px solid rgba(16,185,129,0.3); padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700;">18-Day Streak Active</span>
        <span style="background:rgba(245,158,11,0.12); color:#F59E0B; border:1px solid rgba(245,158,11,0.3); padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700;">Mock Master (70+ Marks)</span>
        <span style="background:rgba(139,92,246,0.12); color:#8B5CF6; border:1px solid rgba(139,92,246,0.3); padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700;">Fast Solver Badge</span>
      </div>
    </div>

    <!-- 4. Read-Only Automated Study Statistics Grid -->
    <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; margin-bottom:12px;">Preparation Metrics (Read-Only)</h3>
    
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); margin-bottom:20px;">
      <div class="card stat-box">
        <div>
          <div style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Syllabus Completed</div>
          <div class="stat-val" style="color:var(--accent-primary);">${syllabusPct}%</div>
        </div>
      </div>

      <div class="card stat-box">
        <div>
          <div style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Questions Solved</div>
          <div class="stat-val">${solvedCount}</div>
        </div>
      </div>

      <div class="card stat-box">
        <div>
          <div style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Overall Accuracy</div>
          <div class="stat-val" style="color:var(--color-success);">${accuracy}%</div>
        </div>
      </div>

      <div class="card stat-box">
        <div>
          <div style="font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Mock Tests Attempted</div>
          <div class="stat-val">${mockCount}</div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <h4 style="font-size:14px; font-weight:700; margin-bottom:8px;">Last Active Session</h4>
      <div style="font-size:13px; color:var(--text-sub);">${lastActiveText}</div>
    </div>

    <!-- 3. Bookmarked Questions & Saved Notes Section -->
    <div class="card" style="margin-bottom:24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div>
          <h4 style="font-size:15px; font-weight:700; color:var(--text-main);">Bookmarked Questions & Saved Items</h4>
          <div style="font-size:12px; color:var(--text-sub); margin-top:2px;">Questions saved during practice sessions for quick reference.</div>
        </div>
        <span style="font-size:11px; background:rgba(59,130,246,0.15); color:var(--accent-primary); border:1px solid var(--accent-primary); padding:2px 8px; border-radius:12px; font-weight:700;">${bookmarks.length} Saved</span>
      </div>

      ${bookmarks.length === 0 ? `
        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:20px; text-align:center;">
          <div style="font-size:13px; font-weight:600; color:var(--text-main); margin-bottom:4px;">No Bookmarked Questions Yet</div>
          <div style="font-size:12px; color:var(--text-sub); margin-bottom:12px;">Bookmark tricky or important questions during practice to view them here.</div>
          <button class="btn-primary" style="font-size:11px; padding:5px 12px;" onclick="navigateToView('practice')">Go to Practice Center ➔</button>
        </div>
      ` : `
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${bookmarks.map(bId => `
            <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:10px 14px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div>
                <span style="background:rgba(59,130,246,0.1); color:var(--accent-primary); border:1px solid var(--border-color); padding:2px 6px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">${bId.split('_')[0] || 'GATE'}</span>
                <span style="font-size:12px; font-weight:600; color:var(--text-main); margin-left:8px;">Question ID: ${bId}</span>
              </div>
              <div style="display:flex; gap:6px;">
                <button class="btn-primary" style="font-size:11px; padding:3px 8px;" onclick="navigateToView('practice')">Practice</button>
                <button class="btn-secondary" style="font-size:11px; padding:3px 8px; color:var(--color-danger); border-color:rgba(239,68,68,0.3);" onclick="removeBookmarkFromProfile('${bId}')">Remove</button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>

    <!-- Edit Profile Modal -->
    <div class="modal-overlay" id="profile-edit-modal-overlay">
      <div class="calc-modal" style="width:380px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <span style="font-weight:700; font-size:15px;">Edit Profile Information</span>
          <button style="background:none; border:none; color:var(--text-sub); font-size:18px; cursor:pointer;" onclick="closeEditProfileModal()">✕</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <div>
            <label style="font-size:12px; font-weight:600; display:block; margin-bottom:4px;">Full Name</label>
            <input type="text" id="edit-prof-name" value="${profile.name}" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:8px; border-radius:6px; width:100%; font-size:13px;">
          </div>
          <div>
            <label style="font-size:12px; font-weight:600; display:block; margin-bottom:4px;">Email Address</label>
            <input type="email" id="edit-prof-email" value="${profile.email}" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:8px; border-radius:6px; width:100%; font-size:13px;">
          </div>
          <div>
            <label style="font-size:12px; font-weight:600; display:block; margin-bottom:4px;">Target Exam</label>
            <input type="text" id="edit-prof-year" value="${profile.targetYear}" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:8px; border-radius:6px; width:100%; font-size:13px;">
          </div>
          <div>
            <label style="font-size:12px; font-weight:600; display:block; margin-bottom:4px;">Branch</label>
            <input type="text" id="edit-prof-branch" value="${profile.branch}" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:8px; border-radius:6px; width:100%; font-size:13px;">
          </div>
          
          <button class="btn-primary" style="margin-top:8px; font-size:13px;" onclick="saveProfileChanges()">Save Changes</button>
        </div>
      </div>
    </div>
  `;
}

function handleAvatarUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const img = new Image();
    img.onload = () => {
      // Compress to max 300x300 for optimal storage & instant rendering
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxDim = 300;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      StorageManager.saveAvatar(compressedDataUrl);
      renderProfileModule();
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

function removeUserAvatar() {
  StorageManager.removeAvatar();
  renderProfileModule();
}

function openEditProfileModal() {
  const modal = document.getElementById('profile-edit-modal-overlay');
  if (modal) modal.classList.add('active');
}

function closeEditProfileModal() {
  const modal = document.getElementById('profile-edit-modal-overlay');
  if (modal) modal.classList.remove('active');
}

function saveProfileChanges() {
  const name = document.getElementById('edit-prof-name')?.value || 'Student Aspirant';
  const email = document.getElementById('edit-prof-email')?.value || 'student@gate2027.edu';
  const targetYear = document.getElementById('edit-prof-year')?.value || '2027';
  const branch = document.getElementById('edit-prof-branch')?.value || 'Computer Science (CS)';

  StorageManager.saveProfile({ name, email, targetYear, branch });
  if (window.updateBrandTitle) window.updateBrandTitle();
  if (window.initGATE2027Countdown) window.initGATE2027Countdown();
  closeEditProfileModal();
  renderProfileModule();
}

function removeBookmarkFromProfile(qId) {
  StorageManager.toggleBookmark(qId);
  renderProfileModule();
}

function autoGenerateUsername(val) {
  const userIn = document.getElementById('auth-input-username');
  if (userIn && val) {
    const clean = val.toLowerCase().replace(/[^a-z0-9]/g, '');
    userIn.value = `@${clean}`;
  }
}

function openAuthModal() {
  const modal = document.getElementById('auth-modal-overlay');
  if (modal) {
    const prof = StorageManager.getProfile();
    if (prof) {
      const nameIn = document.getElementById('auth-input-name');
      const userIn = document.getElementById('auth-input-username');
      const emailIn = document.getElementById('auth-input-email');
      if (nameIn && prof.name) nameIn.value = prof.name;
      if (userIn && prof.username) userIn.value = prof.username;
      if (emailIn && prof.email) emailIn.value = prof.email;
    }
    modal.classList.add('active');
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal-overlay');
  if (modal) modal.classList.remove('active');
}

function handleUserAuthSubmit(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('auth-input-name')?.value || 'Student Aspirant';
  let username = document.getElementById('auth-input-username')?.value || `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  if (!username.startsWith('@')) username = `@${username}`;
  const email = document.getElementById('auth-input-email')?.value || 'student@gate2027.edu';
  const targetYear = document.getElementById('auth-input-target')?.value || '2027';
  const branch = document.getElementById('auth-input-branch')?.value || 'Computer Science (CS)';

  StorageManager.saveProfile({ name, username, email, targetYear, branch });
  localStorage.setItem('gate2027_user_registered', 'true');
  closeAuthModal();
  renderProfileModule();
}

function handleUserSignOut() {
  localStorage.removeItem('gate2027_user_registered');
  window.location.reload();
}

window.renderProfileModule = renderProfileModule;
window.updateHeaderProfileButton = updateHeaderProfileButton;
window.handleAvatarUpload = handleAvatarUpload;
window.removeUserAvatar = removeUserAvatar;
window.openEditProfileModal = openEditProfileModal;
window.closeEditProfileModal = closeEditProfileModal;
window.saveProfileChanges = saveProfileChanges;
window.removeBookmarkFromProfile = removeBookmarkFromProfile;
window.autoGenerateUsername = autoGenerateUsername;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.handleUserAuthSubmit = handleUserAuthSubmit;
window.handleUserSignOut = handleUserSignOut;
