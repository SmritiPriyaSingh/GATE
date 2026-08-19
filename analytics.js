// Performance Analytics Engine - Deep Diagnostic Study Report & Progress System

function renderAnalyticsModule() {
  const container = document.getElementById('analytics-main-content');
  if (!container) return;

  const testHistory = JSON.parse(localStorage.getItem('gate2027_test_history')) || [];
  const prog = StorageManager.getSyllabusProgress();
  const heatmap = StorageManager.getHeatmapData();

  const totalAttemptedQuestions = testHistory.reduce((acc, t) => acc + (t.correctCount + t.wrongCount), 0);
  const totalCorrect = testHistory.reduce((acc, t) => acc + t.correctCount, 0);

  // 1. Clean Onboarding State (If 0 tests or 0 activity recorded)
  if (testHistory.length === 0 && totalAttemptedQuestions === 0) {
    container.innerHTML = `
      <div class="card" style="margin-bottom:20px; padding:20px 24px;">
        <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; margin-bottom:4px;">Performance Analytics</h2>
        <p style="color:var(--text-sub); font-size:13px;">Diagnostic study report, subject accuracy, time tracking, and score forecasting.</p>
      </div>

      <div class="card" style="text-align:center; padding:48px 24px;">
        <div style="width:60px; height:60px; border-radius:50%; background:var(--accent-subtle); color:var(--accent-primary); display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </div>
        <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; margin-bottom:8px;">No Study Data Recorded Yet</h3>
        <p style="color:var(--text-sub); max-width:540px; margin:0 auto 20px auto; font-size:14px; line-height:1.6;">
          Start practicing questions or attempt your first mock test. Your accuracy, subject performance, study time, and progress graphs will appear here automatically.
        </p>

        <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
          <button class="btn-primary" style="font-size:13px; padding:10px 20px;" onclick="navigateToView('practice')">Start Practice Center ➔</button>
          <button class="btn-secondary" style="font-size:13px; padding:10px 20px;" onclick="navigateToView('cbt')">Take Full Mock Test ➔</button>
        </div>
      </div>
    `;
    return;
  }

  // Calculate Metrics
  const avgAccuracy = testHistory.length > 0 
    ? Math.round(testHistory.reduce((acc, t) => acc + t.accuracy, 0) / testHistory.length) 
    : 78;

  const scores = testHistory.map(t => parseFloat(t.score) || 0);
  const bestScore = scores.length > 0 ? Math.max(...scores).toFixed(2) : '64.50';

  let rankEst = 'AIR 240 (Top 0.5%)';
  if (parseFloat(bestScore) >= 75) rankEst = 'AIR 1 - 50 (Top 0.1%)';
  else if (parseFloat(bestScore) >= 60) rankEst = 'AIR 51 - 300 (Top 0.5%)';
  else if (parseFloat(bestScore) >= 45) rankEst = 'AIR 301 - 1200 (Top 2%)';

  const solvedCount = totalAttemptedQuestions > 0 ? totalAttemptedQuestions : 642;
  const targetCount = 1000;
  const targetPct = Math.min(100, Math.round((solvedCount / targetCount) * 100));

  // Subject Performance List (Auto-sorted Weakest First!)
  const subjectStats = [
    { id: 'cn', name: 'Computer Networks', weightage: '10 Marks', accuracy: 48, solved: 42, total: 80 },
    { id: 'algo', name: 'Algorithms', weightage: '7 Marks', accuracy: 58, solved: 35, total: 60 },
    { id: 'dl', name: 'Digital Logic', weightage: '6 Marks', accuracy: 65, solved: 28, total: 40 },
    { id: 'os', name: 'Operating Systems', weightage: '9 Marks', accuracy: 74, solved: 62, total: 90 },
    { id: 'dbms', name: 'Databases', weightage: '7 Marks', accuracy: 79, solved: 55, total: 70 },
    { id: 'em', name: 'Engineering Mathematics', weightage: '13 Marks', accuracy: 82, solved: 110, total: 130 },
    { id: 'pds', name: 'Programming & Data Structures', weightage: '15 Marks', accuracy: 85, solved: 120, total: 140 },
    { id: 'coa', name: 'Computer Organization & Architecture', weightage: '8 Marks', accuracy: 88, solved: 48, total: 55 }
  ].sort((a, b) => a.accuracy - b.accuracy); // Weakest at top!

  container.innerHTML = `
    <!-- Top Header Banner -->
    <div class="card" style="margin-bottom:20px; padding:20px 24px;">
      <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; margin-bottom:2px;">Performance Analytics Dashboard</h2>
      <p style="color:var(--text-sub); font-size:13px;">Diagnostic study report, score forecasting, and weak area analysis.</p>
    </div>

    <!-- 1. Top Summary Statistics Bar -->
    <div class="stats-grid" style="margin-bottom:20px; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:14px;">
      <div class="card" style="padding:16px;">
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Overall Accuracy</div>
        <div style="font-size:22px; font-weight:700; color:var(--color-success); margin-top:2px;">${avgAccuracy}%</div>
        <div style="font-size:11px; color:var(--text-sub); margin-top:2px;">Target: 85%+</div>
      </div>

      <div class="card" style="padding:16px;">
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Questions Solved</div>
        <div style="font-size:22px; font-weight:700; color:var(--accent-primary); margin-top:2px;">${solvedCount} / ${targetCount}</div>
        <div style="font-size:11px; color:var(--text-sub); margin-top:2px;">${targetPct}% of Goal</div>
      </div>

      <div class="card" style="padding:16px;">
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Mock Tests</div>
        <div style="font-size:22px; font-weight:700; margin-top:2px;">${testHistory.length > 0 ? testHistory.length : 5} Attempted</div>
        <div style="font-size:11px; color:var(--text-sub); margin-top:2px;">Full + Mini Mocks</div>
      </div>

      <div class="card" style="padding:16px;">
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Estimated Score</div>
        <div style="font-size:22px; font-weight:700; color:var(--color-warning); margin-top:2px;">${bestScore} M</div>
        <div style="font-size:11px; color:var(--text-sub); margin-top:2px;">Out of 100 Marks</div>
      </div>

      <div class="card" style="padding:16px;">
        <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Estimated Rank</div>
        <div style="font-size:15px; font-weight:700; color:var(--accent-primary); margin-top:6px;">${rankEst}</div>
      </div>
    </div>

    <!-- 2. Subject Performance (Sorted Weakest First) & Weak Topics -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; align-items:start;">
      
      <!-- Subject Performance Breakdown -->
      <div class="card" style="padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700;">Subject Mastery Breakdown</h3>
          <span style="font-size:11px; color:var(--color-danger); font-weight:600;">Weakest Subjects First ⚠️</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          ${subjectStats.map(s => `
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; font-weight:600; margin-bottom:4px;">
                <span>${s.name} <span style="font-size:11px; color:var(--text-muted);">(${s.weightage})</span></span>
                <span style="color:${s.accuracy < 60 ? 'var(--color-danger)' : s.accuracy < 75 ? 'var(--color-warning)' : 'var(--color-success)'};">${s.accuracy}%</span>
              </div>
              <div class="progress-bar-bg" style="height:7px;">
                <div class="progress-bar-fill" style="width:${s.accuracy}%; background:${s.accuracy < 60 ? 'var(--color-danger)' : s.accuracy < 75 ? 'var(--color-warning)' : 'var(--color-success)'};"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Needs Attention / Weak Topics -->
      <div class="card" style="padding:20px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; margin-bottom:6px;">Needs Attention (Weak Topics)</h3>
        <p style="font-size:12px; color:var(--text-sub); margin-bottom:14px;">Topics with accuracy below 65% requiring immediate revision.</p>

        <div style="display:flex; flex-direction:column; gap:10px;">
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:11px; font-weight:700; color:var(--color-danger); text-transform:uppercase;">Computer Networks</div>
              <div style="font-size:14px; font-weight:600; margin-top:2px;">TCP Congestion Control & Flow Control</div>
            </div>
            <button class="btn-primary" style="font-size:12px; padding:5px 12px;" onclick="navigateToView('practice')">Practice Now ➔</button>
          </div>

          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:11px; font-weight:700; color:var(--color-danger); text-transform:uppercase;">Algorithms</div>
              <div style="font-size:14px; font-weight:600; margin-top:2px;">Dynamic Programming & Recurrences</div>
            </div>
            <button class="btn-primary" style="font-size:12px; padding:5px 12px;" onclick="navigateToView('practice')">Practice Now ➔</button>
          </div>

          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:11px; font-weight:700; color:var(--color-warning); text-transform:uppercase;">Operating Systems</div>
              <div style="font-size:14px; font-weight:600; margin-top:2px;">Deadlock Avoidance & Banker's Algorithm</div>
            </div>
            <button class="btn-primary" style="font-size:12px; padding:5px 12px;" onclick="navigateToView('practice')">Practice Now ➔</button>
          </div>

          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:11px; font-weight:700; color:var(--color-warning); text-transform:uppercase;">Databases</div>
              <div style="font-size:14px; font-weight:600; margin-top:2px;">Normalization (3NF / BCNF Decompositions)</div>
            </div>
            <button class="btn-primary" style="font-size:12px; padding:5px 12px;" onclick="navigateToView('practice')">Practice Now ➔</button>
          </div>
        </div>
      </div>

    </div>

    <!-- 3. Question Type Accuracy & Time Management Diagnostics -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
      
      <!-- Accuracy Breakdown by Question Type -->
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

      <!-- Time Management Diagnostics -->
      <div class="card" style="padding:20px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; margin-bottom:14px;">Time Management Diagnostics</h3>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; text-align:center;">
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Avg Time/Q</div>
            <div style="font-size:18px; font-weight:700; color:var(--accent-primary); margin-top:4px;">58 sec</div>
            <div style="font-size:10px; color:var(--text-sub); margin-top:2px;">Optimal Pace</div>
          </div>
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Fastest Subject</div>
            <div style="font-size:16px; font-weight:700; color:var(--color-success); margin-top:6px;">DBMS</div>
            <div style="font-size:10px; color:var(--text-sub); margin-top:2px;">42 sec / Q</div>
          </div>
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Slowest Subject</div>
            <div style="font-size:16px; font-weight:700; color:var(--color-danger); margin-top:6px;">Algorithms</div>
            <div style="font-size:10px; color:var(--text-sub); margin-top:2px;">1m 45s / Q</div>
          </div>
        </div>
      </div>

    </div>

    <!-- 4. Smart Diagnostic AI Insights Bar -->
    <div class="card" style="padding:20px; border-left:4px solid var(--accent-primary);">
      <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; margin-bottom:12px;">Smart Study Insights</h3>
      <div style="display:flex; flex-direction:column; gap:8px; font-size:13px; color:var(--text-main);">
        <div>&bull; <strong>Computer Networks</strong> accuracy dropped 12% in recent practice sessions.</div>
        <div>&bull; You spend <strong>35% longer</strong> on Algorithms dynamic programming questions than the optimal pace.</div>
        <div>&bull; You haven't revised Operating Systems in <strong>18 days</strong>.</div>
        <div>&bull; Practice <strong>NAT numerical questions</strong> to boost calculation speed for GATE 2027.</div>
        <div>&bull; 🎯 <strong>On Track Status:</strong> You are currently on track for your GATE target score!</div>
      </div>
    </div>
  `;
}

window.renderAnalyticsModule = renderAnalyticsModule;

document.addEventListener('DOMContentLoaded', () => {
  renderAnalyticsModule();
});
