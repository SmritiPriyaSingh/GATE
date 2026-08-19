// Performance Analytics Engine - Deep Diagnostic Study Report & Visual Progress System

function renderAnalyticsModule() {
  const container = document.getElementById('analytics-main-content');
  if (!container) return;

  const isDemo = StorageManager.isDemoMode();
  const testHistory = StorageManager.getTestHistory();

  // 1. Clean Onboarding State (If Demo Mode is OFF and 0 real test activity exists)
  if (!isDemo && testHistory.length === 0) {
    container.innerHTML = `
      <div class="card" style="margin-bottom:20px; padding:20px 24px;">
        <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; margin-bottom:4px;">Performance Analytics</h2>
        <p style="color:var(--text-sub); font-size:13px;">Diagnostic study report, subject rankings, difficulty metrics, and score forecasting.</p>
      </div>

      <div class="card" style="text-align:center; padding:48px 24px;">
        <div style="width:60px; height:60px; border-radius:50%; background:var(--accent-subtle); color:var(--accent-primary); display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </div>
        <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; margin-bottom:8px;">No Study Data Recorded Yet</h3>
        <p style="color:var(--text-sub); max-width:540px; margin:0 auto 20px auto; font-size:14px; line-height:1.6;">
          Demo Mode is currently OFF. Start practicing questions, take a mock test, or turn ON Demo Mode to preview 6 months of sample student analytics immediately.
        </p>

        <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
          <button class="btn-primary" style="font-size:13px; padding:10px 20px;" onclick="StorageManager.setDemoMode(true)">⚙️ Enable Demo Mode Now</button>
          <button class="btn-secondary" style="font-size:13px; padding:10px 20px;" onclick="navigateToView('practice')">Start Practice Center ➔</button>
          <button class="btn-secondary" style="font-size:13px; padding:10px 20px;" onclick="navigateToView('cbt')">Take Full Mock Test ➔</button>
        </div>
      </div>
    `;
    return;
  }

  // Calculate Key Metrics
  const avgAccuracy = testHistory.length > 0 
    ? Math.round(testHistory.reduce((acc, t) => acc + parseFloat(t.accuracy || 0), 0) / testHistory.length) 
    : 82;

  const scores = testHistory.map(t => parseFloat(t.score) || 0);
  const bestScore = scores.length > 0 ? Math.max(...scores).toFixed(2) : '72.10';

  // All 11 GATE CSE Subjects Ranked
  const rankedSubjects = [
    { rank: 1, name: 'General Aptitude', weightage: '15 Marks', accuracy: 95 },
    { rank: 2, name: 'Computer Organization & Architecture', weightage: '8 Marks', accuracy: 88 },
    { rank: 3, name: 'Programming & Data Structures', weightage: '15 Marks', accuracy: 85 },
    { rank: 4, name: 'Engineering Mathematics', weightage: '13 Marks', accuracy: 82 },
    { rank: 5, name: 'Databases (DBMS)', weightage: '7 Marks', accuracy: 79 },
    { rank: 6, name: 'Operating Systems', weightage: '9 Marks', accuracy: 74 },
    { rank: 7, name: 'Digital Logic', weightage: '6 Marks', accuracy: 65 },
    { rank: 8, name: 'Algorithms', weightage: '7 Marks', accuracy: 58 },
    { rank: 9, name: 'Theory of Computation', weightage: '6 Marks', accuracy: 54 },
    { rank: 10, name: 'Computer Networks', weightage: '10 Marks', accuracy: 48 },
    { rank: 11, name: 'Compiler Design', weightage: '4 Marks', accuracy: 47 }
  ];

  // GitHub Style Study Heatmap Data (4 Weeks x 7 Days)
  const heatmapDays = [
    { day: 'Mon', count: 14, intensity: 3 },
    { day: 'Tue', count: 10, intensity: 2 },
    { day: 'Wed', count: 0, intensity: 0 },
    { day: 'Thu', count: 12, intensity: 3 },
    { day: 'Fri', count: 15, intensity: 4 },
    { day: 'Sat', count: 18, intensity: 4 },
    { day: 'Sun', count: 6, intensity: 1 },
    
    { day: 'Mon', count: 11, intensity: 2 },
    { day: 'Tue', count: 16, intensity: 4 },
    { day: 'Wed', count: 9, intensity: 2 },
    { day: 'Thu', count: 14, intensity: 3 },
    { day: 'Fri', count: 20, intensity: 4 },
    { day: 'Sat', count: 12, intensity: 3 },
    { day: 'Sun', count: 8, intensity: 2 },

    { day: 'Mon', count: 15, intensity: 4 },
    { day: 'Tue', count: 13, intensity: 3 },
    { day: 'Wed', count: 7, intensity: 1 },
    { day: 'Thu', count: 10, intensity: 2 },
    { day: 'Fri', count: 18, intensity: 4 },
    { day: 'Sat', count: 22, intensity: 4 },
    { day: 'Sun', count: 9, intensity: 2 },

    { day: 'Mon', count: 16, intensity: 4 },
    { day: 'Tue', count: 12, intensity: 3 },
    { day: 'Wed', count: 14, intensity: 3 },
    { day: 'Thu', count: 19, intensity: 4 },
    { day: 'Fri', count: 11, intensity: 2 },
    { day: 'Sat', count: 15, intensity: 4 },
    { day: 'Sun', count: 10, intensity: 2 }
  ];

  container.innerHTML = `
    <!-- Top Header Banner -->
    <div class="card" style="margin-bottom:20px; padding:20px 24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; margin-bottom:2px;">Performance Analytics Dashboard</h2>
        <p style="color:var(--text-sub); font-size:13px;">Diagnostic study report, subject rankings, difficulty metrics, and score forecasting.</p>
      </div>

      ${isDemo ? `
        <div style="background:var(--accent-subtle); border:1px solid var(--accent-primary); padding:6px 14px; border-radius:20px; font-size:12px; font-weight:700; color:var(--accent-primary); display:flex; align-items:center; gap:8px;">
          <span>⚙️ Developer Demo Mode Active</span>
          <button class="btn-secondary" style="font-size:11px; padding:2px 8px;" onclick="StorageManager.setDemoMode(false)">Turn Off</button>
        </div>
      ` : ''}
    </div>

    <!-- 1. Data-Driven Smart Diagnostics Summary Box -->
    <div class="card" style="margin-bottom:20px; border-left:4px solid var(--accent-primary); padding:20px;">
      <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; margin-bottom:12px;">Diagnostic Summary</h3>
      
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; font-size:13px;">
        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:12px; border-radius:8px;">
          <div style="font-size:11px; font-weight:700; color:var(--color-danger); text-transform:uppercase;">Weakest Subject</div>
          <div style="font-size:15px; font-weight:700; margin-top:2px;">Compiler Design (47%)</div>
          <div style="font-size:11px; color:var(--text-sub); margin-top:2px;">Needs priority revision</div>
        </div>

        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:12px; border-radius:8px;">
          <div style="font-size:11px; font-weight:700; color:var(--color-success); text-transform:uppercase;">Strongest Subject</div>
          <div style="font-size:15px; font-weight:700; margin-top:2px;">General Aptitude (95%)</div>
          <div style="font-size:11px; color:var(--text-sub); margin-top:2px;">Mastered 15/15 Marks</div>
        </div>

        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:12px; border-radius:8px;">
          <div style="font-size:11px; font-weight:700; color:var(--accent-primary); text-transform:uppercase;">Attempted This Week</div>
          <div style="font-size:15px; font-weight:700; margin-top:2px;">186 Questions</div>
          <div style="font-size:11px; color:var(--text-sub); margin-top:2px;">Avg 26 Qs / Day</div>
        </div>

        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:12px; border-radius:8px;">
          <div style="font-size:11px; font-weight:700; color:var(--color-warning); text-transform:uppercase;">Revision Overdue</div>
          <div style="font-size:15px; font-weight:700; margin-top:2px;">Operating Systems</div>
          <div style="font-size:11px; color:var(--text-sub); margin-top:2px;">18 days since last review</div>
        </div>
      </div>
    </div>

    <!-- 2. Progress Forecast & Goal Target -->
    <div class="card" style="margin-bottom:20px; padding:20px;">
      <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; margin-bottom:14px;">GATE 2027 Score & AIR Rank Forecast</h3>
      
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; align-items:center;">
        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:16px; border-radius:8px; text-align:center;">
          <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Current Score Forecast</div>
          <div style="font-size:26px; font-weight:700; color:var(--color-warning); margin-top:4px;">${bestScore} / 100</div>
          <div style="font-size:11px; color:var(--text-sub); margin-top:4px;">Target: 80.00+ Marks</div>
        </div>

        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:16px; border-radius:8px; text-align:center;">
          <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Estimated AIR Rank</div>
          <div style="font-size:22px; font-weight:700; color:var(--accent-primary); margin-top:6px;">AIR 51 - 300</div>
          <div style="font-size:11px; color:var(--text-sub); margin-top:4px;">Top 0.5% Range</div>
        </div>

        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:16px; border-radius:8px; text-align:center;">
          <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Required Study Pace</div>
          <div style="font-size:22px; font-weight:700; color:var(--color-success); margin-top:6px;">+35 Qs / Week</div>
          <div style="font-size:11px; color:var(--text-sub); margin-top:4px;">To reach AIR Top 100</div>
        </div>
      </div>
    </div>

    <!-- 3. GitHub-Style Study Consistency Heatmap -->
    <div class="card" style="margin-bottom:20px; padding:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700;">Study Consistency Heatmap (Last 28 Days)</h3>
        <span style="font-size:12px; color:var(--text-sub);">845 Questions Solved</span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:8px; text-align:center;">
        ${heatmapDays.map(d => {
          let bg = 'var(--bg-surface-hover)';
          if (d.intensity === 1) bg = 'rgba(16,185,129,0.25)';
          if (d.intensity === 2) bg = 'rgba(16,185,129,0.50)';
          if (d.intensity === 3) bg = 'rgba(16,185,129,0.75)';
          if (d.intensity === 4) bg = 'var(--color-success)';
          return `
            <div style="background:${bg}; border:1px solid var(--border-color); padding:10px 4px; border-radius:6px; font-size:11px; font-weight:700; color:${d.intensity > 2 ? '#ffffff' : 'var(--text-main)'};" title="${d.count} Questions Solved">
              <div>${d.day}</div>
              <div style="font-size:13px; margin-top:2px;">${d.count > 0 ? d.count : '•'}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- 4. Subject Ranking List (All 11 Subjects Ranked) -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; align-items:start;">
      
      <!-- Full 11-Subject Ranking -->
      <div class="card" style="padding:20px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; margin-bottom:14px;">GATE CSE Subject Performance Ranking</h3>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${rankedSubjects.map(s => `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:6px; font-size:13px;">
              <div>
                <span style="font-weight:700; color:var(--accent-primary); margin-right:8px;">#${s.rank}</span>
                <span style="font-weight:600;">${s.name}</span>
                <span style="font-size:11px; color:var(--text-muted); margin-left:6px;">(${s.weightage})</span>
              </div>
              <span style="font-weight:700; color:${s.accuracy < 60 ? 'var(--color-danger)' : s.accuracy < 75 ? 'var(--color-warning)' : 'var(--color-success)'};">${s.accuracy}%</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Difficulty Level Breakdown & Format Accuracy -->
      <div style="display:flex; flex-direction:column; gap:20px;">
        
        <!-- Difficulty Breakdown -->
        <div class="card" style="padding:20px;">
          <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; margin-bottom:14px;">Accuracy by Difficulty Level</h3>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; text-align:center;">
            <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
              <div style="font-size:11px; color:var(--color-success); font-weight:700;">EASY</div>
              <div style="font-size:20px; font-weight:700; margin-top:4px;">92%</div>
              <div style="font-size:10px; color:var(--text-sub); margin-top:2px;">210/228 Correct</div>
            </div>
            <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
              <div style="font-size:11px; color:var(--color-warning); font-weight:700;">MEDIUM</div>
              <div style="font-size:20px; font-weight:700; margin-top:4px;">78%</div>
              <div style="font-size:10px; color:var(--text-sub); margin-top:2px;">410/525 Correct</div>
            </div>
            <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
              <div style="font-size:11px; color:var(--color-danger); font-weight:700;">HARD</div>
              <div style="font-size:20px; font-weight:700; margin-top:4px;">61%</div>
              <div style="font-size:10px; color:var(--text-sub); margin-top:2px;">56/92 Correct</div>
            </div>
          </div>
        </div>

        <!-- Format Accuracy (MCQ, MSQ, NAT) -->
        <div class="card" style="padding:20px;">
          <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; margin-bottom:14px;">Accuracy by Question Format</h3>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; text-align:center;">
            <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
              <div style="font-size:11px; color:var(--text-muted); font-weight:700;">MCQ</div>
              <div style="font-size:20px; font-weight:700; color:var(--color-success); margin-top:4px;">82%</div>
              <div style="font-size:10px; color:var(--text-sub); margin-top:2px;">Single Choice</div>
            </div>
            <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
              <div style="font-size:11px; color:var(--text-muted); font-weight:700;">MSQ</div>
              <div style="font-size:20px; font-weight:700; color:var(--color-warning); margin-top:4px;">69%</div>
              <div style="font-size:10px; color:var(--text-sub); margin-top:2px;">Multiple Select</div>
            </div>
            <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
              <div style="font-size:11px; color:var(--text-muted); font-weight:700;">NAT</div>
              <div style="font-size:20px; font-weight:700; color:var(--accent-primary); margin-top:4px;">74%</div>
              <div style="font-size:10px; color:var(--text-sub); margin-top:2px;">Numerical Answer</div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- 5. Advanced Time Management Diagnostics -->
    <div class="card" style="padding:20px;">
      <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; margin-bottom:14px;">Time Management & Strategy Diagnostics</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; text-align:center;">
        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
          <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Avg Question Time</div>
          <div style="font-size:18px; font-weight:700; color:var(--accent-primary); margin-top:4px;">58 sec</div>
          <div style="font-size:10px; color:var(--text-sub); margin-top:2px;">Optimal Pace</div>
        </div>

        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
          <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Time Lost on Wrongs</div>
          <div style="font-size:18px; font-weight:700; color:var(--color-danger); margin-top:4px;">24 mins</div>
          <div style="font-size:10px; color:var(--text-sub); margin-top:2px;">Negative Marking Penalty</div>
        </div>

        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
          <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Unattempted Questions</div>
          <div style="font-size:18px; font-weight:700; color:var(--color-warning); margin-top:4px;">7 Qs</div>
          <div style="font-size:10px; color:var(--text-sub); margin-top:2px;">Time Bottleneck</div>
        </div>

        <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
          <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Average Review Time</div>
          <div style="font-size:18px; font-weight:700; color:var(--color-success); margin-top:4px;">45 sec / Q</div>
          <div style="font-size:10px; color:var(--text-sub); margin-top:2px;">Good Review Habit</div>
        </div>
      </div>
    </div>
  `;
}

window.renderAnalyticsModule = renderAnalyticsModule;

document.addEventListener('DOMContentLoaded', () => {
  renderAnalyticsModule();
});
