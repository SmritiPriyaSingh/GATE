// GitHub Insights + Apple Health + Notion Style Performance Analytics Platform

let activeTimeRange = '30D'; // '7D', '30D', '90D', '1Y', 'ALL'

function renderAnalyticsModule() {
  const container = document.getElementById('analytics-main-content');
  if (!container) return;

  const isDemo = StorageManager.isDemoMode();
  const testHistory = StorageManager.getTestHistory();

  // 1. Clean Onboarding State (If Demo Mode is OFF and 0 real test activity exists)
  if (!isDemo && testHistory.length === 0) {
    container.innerHTML = `
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px 24px; margin-bottom:20px;">
        <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; color:#F5F5F5; margin-bottom:4px;">Performance Analytics</h2>
        <p style="color:#9CA3AF; font-size:13px;">Diagnostic study report, activity heatmap, time range analytics, and goal progress.</p>
      </div>

      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; text-align:center; padding:48px 24px;">
        <div style="width:56px; height:56px; border-radius:50%; background:rgba(59,130,246,0.1); color:#3B82F6; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </div>
        <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; color:#F5F5F5; margin-bottom:8px;">No Study Data Recorded Yet</h3>
        <p style="color:#9CA3AF; max-width:540px; margin:0 auto 20px auto; font-size:14px; line-height:1.6;">
          Demo Mode is currently OFF. You can start practicing questions, take a mock test, or turn ON Demo Mode to preview 6 months of sample student analytics immediately.
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

  // 12-Month GitHub Style Contribution Grid Data (52 Weeks x 7 Days = 364 Tiles)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Clean Notion/GitHub Table of All 11 Subjects
  const subjectRows = [
    { name: 'Databases (DBMS)', progress: 92, accuracy: 91, solved: 145 },
    { name: 'Computer Organization & Architecture', progress: 88, accuracy: 88, solved: 110 },
    { name: 'Computer Networks (CN)', progress: 84, accuracy: 87, solved: 165 },
    { name: 'Programming & Data Structures', progress: 85, accuracy: 85, solved: 180 },
    { name: 'Engineering Mathematics', progress: 82, accuracy: 82, solved: 140 },
    { name: 'Operating Systems (OS)', progress: 84, accuracy: 82, solved: 125 },
    { name: 'Theory of Computation (TOC)', progress: 80, accuracy: 79, solved: 95 },
    { name: 'Digital Logic', progress: 75, accuracy: 74, solved: 70 },
    { name: 'General Aptitude (GA)', progress: 95, accuracy: 95, solved: 210 },
    { name: 'Compiler Design', progress: 60, accuracy: 54, solved: 45 },
    { name: 'Algorithms', progress: 68, accuracy: 58, solved: 85 }
  ];

  container.innerHTML = `
    <!-- Top Header & Time Range Selector -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px 24px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
      <div>
        <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; color:#F5F5F5; margin-bottom:2px;">Performance Analytics</h2>
        <p style="color:#9CA3AF; font-size:13px;">Study consistency, accuracy trends, subject rankings, and activity timeline.</p>
      </div>

      <!-- Time Range Selector Pills -->
      <div style="display:flex; background:#000000; border:1px solid #23262D; padding:3px; border-radius:8px; gap:2px;">
        ${['7D', '30D', '90D', '1Y', 'ALL'].map(range => `
          <button style="background:${activeTimeRange === range ? '#3B82F6' : 'transparent'}; color:${activeTimeRange === range ? '#ffffff' : '#9CA3AF'}; border:none; padding:6px 14px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s;" onclick="setTimeRangeFilter('${range}')">${range}</button>
        `).join('')}
      </div>
    </div>

    <!-- 1. GitHub-Style Study Activity Heatmap (12 Months / 52 Weeks Grid) -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px; margin-bottom:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div style="font-size:15px; font-weight:700; color:#F5F5F5;">Study Activity & Consistency</div>
        <div style="font-size:12px; color:#9CA3AF;">845 Questions Solved &bull; 142 Study Hours</div>
      </div>

      <!-- Month Labels Header -->
      <div style="display:flex; justify-content:space-between; color:#9CA3AF; font-size:11px; margin-bottom:6px; padding-left:24px;">
        ${months.map(m => `<span>${m}</span>`).join('')}
      </div>

      <!-- GitHub Grid (7 Rows x 24 Columns) -->
      <div style="display:flex; gap:6px;">
        <!-- Day Labels -->
        <div style="display:flex; flex-direction:column; justify-content:space-between; font-size:10px; color:#9CA3AF; padding-right:4px;">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <!-- 24 Week Columns Grid -->
        <div style="display:grid; grid-template-columns:repeat(24, 1fr); gap:4px; flex:1;">
          ${Array.from({ length: 168 }).map((_, idx) => {
            const level = (idx % 7 === 0 || idx % 5 === 0) ? (idx % 4) : 0;
            let bg = '#161920';
            if (level === 1) bg = '#0E4429';
            if (level === 2) bg = '#006D32';
            if (level === 3) bg = '#26A641';
            if (level === 4) bg = '#39D353';
            return `<div style="aspect-ratio:1; background:${bg}; border-radius:2px;" title="Activity: ${level * 15} Questions"></div>`;
          }).join('')}
        </div>
      </div>

      <!-- Heatmap Footer Legend -->
      <div style="display:flex; justify-content:flex-end; align-items:center; gap:6px; font-size:11px; color:#9CA3AF; margin-top:12px;">
        <span>Less</span>
        <div style="width:10px; height:10px; background:#161920; border-radius:2px;"></div>
        <div style="width:10px; height:10px; background:#0E4429; border-radius:2px;"></div>
        <div style="width:10px; height:10px; background:#006D32; border-radius:2px;"></div>
        <div style="width:10px; height:10px; background:#26A641; border-radius:2px;"></div>
        <div style="width:10px; height:10px; background:#39D353; border-radius:2px;"></div>
        <span>More</span>
      </div>
    </div>

    <!-- 2. Performance Summary Metrics (Notion Style Grid) -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:14px; margin-bottom:20px;">
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Current Accuracy</div>
        <div style="font-size:24px; font-weight:700; color:#F5F5F5; margin-top:4px;">84.2%</div>
        <div style="font-size:11px; color:#10B981; margin-top:2px;">+3.4% this month</div>
      </div>

      <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Study Time</div>
        <div style="font-size:24px; font-weight:700; color:#F5F5F5; margin-top:4px;">142 Hours</div>
        <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">Avg 4.2h / day</div>
      </div>

      <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Questions Solved</div>
        <div style="font-size:24px; font-weight:700; color:#3B82F6; margin-top:4px;">845</div>
        <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">Target: 5000 Qs</div>
      </div>

      <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Current Streak</div>
        <div style="font-size:24px; font-weight:700; color:#F59E0B; margin-top:4px;">18 Days 🔥</div>
        <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">Best: 41 Days</div>
      </div>

      <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Weakest Subject</div>
        <div style="font-size:16px; font-weight:700; color:#EF4444; margin-top:6px;">Algorithms</div>
        <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">58% Accuracy</div>
      </div>

      <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Strongest Subject</div>
        <div style="font-size:16px; font-weight:700; color:#10B981; margin-top:6px;">Databases (DBMS)</div>
        <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">91% Accuracy</div>
      </div>
    </div>

    <!-- 3. Visual Charts (2x2 Grid) -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
      
      <!-- Chart 1: Accuracy Trend -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px;">
        <div style="font-size:14px; font-weight:700; color:#F5F5F5; margin-bottom:14px;">Accuracy Trend Over Time</div>
        <div style="height:140px; display:flex; align-items:flex-end; gap:16px; border-bottom:1px solid #23262D; padding-bottom:8px;">
          <div style="flex:1; background:rgba(59,130,246,0.3); border-top:2px solid #3B82F6; height:65%; border-radius:4px 4px 0 0;" title="Week 1: 65%"></div>
          <div style="flex:1; background:rgba(59,130,246,0.3); border-top:2px solid #3B82F6; height:72%; border-radius:4px 4px 0 0;" title="Week 2: 72%"></div>
          <div style="flex:1; background:rgba(59,130,246,0.3); border-top:2px solid #3B82F6; height:78%; border-radius:4px 4px 0 0;" title="Week 3: 78%"></div>
          <div style="flex:1; background:rgba(59,130,246,0.3); border-top:2px solid #3B82F6; height:84%; border-radius:4px 4px 0 0;" title="Week 4: 84%"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:11px; color:#9CA3AF; margin-top:6px;">
          <span>W1 (65%)</span>
          <span>W2 (72%)</span>
          <span>W3 (78%)</span>
          <span>W4 (84%)</span>
        </div>
      </div>

      <!-- Chart 2: Questions Solved Daily -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px;">
        <div style="font-size:14px; font-weight:700; color:#F5F5F5; margin-bottom:14px;">Questions Solved This Week</div>
        <div style="height:140px; display:flex; align-items:flex-end; gap:10px; border-bottom:1px solid #23262D; padding-bottom:8px;">
          <div style="flex:1; background:#3B82F6; height:70%; border-radius:4px 4px 0 0;" title="Mon: 35 Qs"></div>
          <div style="flex:1; background:#3B82F6; height:45%; border-radius:4px 4px 0 0;" title="Tue: 22 Qs"></div>
          <div style="flex:1; background:#3B82F6; height:90%; border-radius:4px 4px 0 0;" title="Wed: 48 Qs"></div>
          <div style="flex:1; background:#3B82F6; height:30%; border-radius:4px 4px 0 0;" title="Thu: 15 Qs"></div>
          <div style="flex:1; background:#3B82F6; height:60%; border-radius:4px 4px 0 0;" title="Fri: 30 Qs"></div>
          <div style="flex:1; background:#3B82F6; height:85%; border-radius:4px 4px 0 0;" title="Sat: 42 Qs"></div>
          <div style="flex:1; background:#3B82F6; height:50%; border-radius:4px 4px 0 0;" title="Sun: 25 Qs"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:11px; color:#9CA3AF; margin-top:6px;">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>

      <!-- Chart 3: Study Hours Area -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px;">
        <div style="font-size:14px; font-weight:700; color:#F5F5F5; margin-bottom:14px;">Daily Study Hours</div>
        <div style="height:140px; display:flex; align-items:flex-end; gap:12px; border-bottom:1px solid #23262D; padding-bottom:8px;">
          <div style="flex:1; background:rgba(16,185,129,0.2); border-top:2px solid #10B981; height:80%; border-radius:4px 4px 0 0;"></div>
          <div style="flex:1; background:rgba(16,185,129,0.2); border-top:2px solid #10B981; height:60%; border-radius:4px 4px 0 0;"></div>
          <div style="flex:1; background:rgba(16,185,129,0.2); border-top:2px solid #10B981; height:95%; border-radius:4px 4px 0 0;"></div>
          <div style="flex:1; background:rgba(16,185,129,0.2); border-top:2px solid #10B981; height:40%; border-radius:4px 4px 0 0;"></div>
          <div style="flex:1; background:rgba(16,185,129,0.2); border-top:2px solid #10B981; height:75%; border-radius:4px 4px 0 0;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:11px; color:#9CA3AF; margin-top:6px;">
          <span>4.2h</span><span>3.0h</span><span>5.1h</span><span>2.0h</span><span>3.8h</span>
        </div>
      </div>

      <!-- Chart 4: Subject Distribution Breakdown -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px;">
        <div style="font-size:14px; font-weight:700; color:#F5F5F5; margin-bottom:14px;">Subject Time Distribution</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; color:#F5F5F5; margin-bottom:4px;">
              <span>Computer Networks (CN)</span><span>24%</span>
            </div>
            <div style="height:6px; background:#161920; border-radius:3px; overflow:hidden;">
              <div style="width:24%; height:100%; background:#3B82F6;"></div>
            </div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; color:#F5F5F5; margin-bottom:4px;">
              <span>Operating Systems (OS)</span><span>18%</span>
            </div>
            <div style="height:6px; background:#161920; border-radius:3px; overflow:hidden;">
              <div style="width:18%; height:100%; background:#10B981;"></div>
            </div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; color:#F5F5F5; margin-bottom:4px;">
              <span>Databases (DBMS)</span><span>16%</span>
            </div>
            <div style="height:6px; background:#161920; border-radius:3px; overflow:hidden;">
              <div style="width:16%; height:100%; background:#F59E0B;"></div>
            </div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; color:#F5F5F5; margin-bottom:4px;">
              <span>COA & Algorithms</span><span>12%</span>
            </div>
            <div style="height:6px; background:#161920; border-radius:3px; overflow:hidden;">
              <div style="width:12%; height:100%; background:#EC4899;"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 4. Goal Progress & Subject Table Grid -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; align-items:start;">
      
      <!-- Goal Progress Card -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px;">
        <div style="font-size:15px; font-weight:700; color:#F5F5F5; margin-bottom:4px;">Goal Target: AIR < 500</div>
        <div style="font-size:12px; color:#9CA3AF; margin-bottom:16px;">Target Score: 75.00+ Marks</div>

        <div style="display:flex; flex-direction:column; gap:14px;">
          <div>
            <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; color:#F5F5F5; margin-bottom:4px;">
              <span>Syllabus Completion</span><span>63%</span>
            </div>
            <div style="height:8px; background:#161920; border-radius:4px; overflow:hidden;">
              <div style="width:63%; height:100%; background:#3B82F6;"></div>
            </div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; color:#F5F5F5; margin-bottom:4px;">
              <span>Questions Solved Target</span><span>845 / 5000</span>
            </div>
            <div style="height:8px; background:#161920; border-radius:4px; overflow:hidden;">
              <div style="width:17%; height:100%; background:#10B981;"></div>
            </div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; color:#F5F5F5; margin-bottom:4px;">
              <span>Mock Tests Target</span><span>5 / 30</span>
            </div>
            <div style="height:8px; background:#161920; border-radius:4px; overflow:hidden;">
              <div style="width:16%; height:100%; background:#F59E0B;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Study Sessions Timeline -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px;">
        <div style="font-size:15px; font-weight:700; color:#F5F5F5; margin-bottom:14px;">Recent Study Sessions</div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; align-items:flex-start; gap:12px; border-left:2px solid #3B82F6; padding-left:12px;">
            <div>
              <div style="font-size:11px; font-weight:700; color:#3B82F6;">TODAY</div>
              <div style="font-size:13px; font-weight:600; color:#F5F5F5;">✔ CN Topic Practice &bull; 35 Questions</div>
              <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">Accuracy: 87% &bull; Duration: 42 mins</div>
            </div>
          </div>

          <div style="display:flex; align-items:flex-start; gap:12px; border-left:2px solid #10B981; padding-left:12px;">
            <div>
              <div style="font-size:11px; font-weight:700; color:#10B981;">YESTERDAY</div>
              <div style="font-size:13px; font-weight:600; color:#F5F5F5;">✔ Mini Mock Test Sprint &bull; 20 Questions</div>
              <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">Score: 68 Marks &bull; Duration: 58 mins</div>
            </div>
          </div>

          <div style="display:flex; align-items:flex-start; gap:12px; border-left:2px solid #F59E0B; padding-left:12px;">
            <div>
              <div style="font-size:11px; font-weight:700; color:#F59E0B;">18 AUG</div>
              <div style="font-size:13px; font-weight:600; color:#F5F5F5;">✔ DBMS Normalization Revision</div>
              <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">15 PYQs Mastered &bull; Duration: 35 mins</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 5. Subject Performance Table -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px;">
      <div style="font-size:15px; font-weight:700; color:#F5F5F5; margin-bottom:14px;">Subject Performance & Accuracy Table</div>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:13px;">
          <thead>
            <tr style="border-bottom:1px solid #23262D; color:#9CA3AF;">
              <th style="padding:10px 12px;">Subject</th>
              <th style="padding:10px 12px;">Syllabus Progress</th>
              <th style="padding:10px 12px;">Accuracy %</th>
              <th style="padding:10px 12px;">Questions Solved</th>
              <th style="padding:10px 12px; text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${subjectRows.map(s => `
              <tr style="border-bottom:1px solid #161920; color:#F5F5F5;">
                <td style="padding:12px; font-weight:600;">${s.name}</td>
                <td style="padding:12px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div style="flex:1; height:6px; background:#161920; border-radius:3px; overflow:hidden;">
                      <div style="width:${s.progress}%; height:100%; background:#3B82F6;"></div>
                    </div>
                    <span style="font-size:11px; color:#9CA3AF; width:30px;">${s.progress}%</span>
                  </div>
                </td>
                <td style="padding:12px; font-weight:700; color:${s.accuracy < 60 ? '#EF4444' : s.accuracy < 75 ? '#F59E0B' : '#10B981'};">${s.accuracy}%</td>
                <td style="padding:12px; color:#9CA3AF;">${s.solved} Qs</td>
                <td style="padding:12px; text-align:right;">
                  <button class="btn-primary" style="font-size:11px; padding:4px 10px;" onclick="navigateToView('practice')">Practice</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function setTimeRangeFilter(range) {
  activeTimeRange = range;
  renderAnalyticsModule();
}

window.renderAnalyticsModule = renderAnalyticsModule;
window.setTimeRangeFilter = setTimeRangeFilter;

document.addEventListener('DOMContentLoaded', () => {
  renderAnalyticsModule();
});
