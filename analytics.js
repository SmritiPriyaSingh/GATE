// Notion + TradingView + Duolingo + GitHub Insights Performance Analytics Platform

let activeTimeRange = '30D'; // '7D', '30D', '90D', '1Y', 'ALL'
let heatmapViewMode = 'daily'; // 'daily' or 'monthly'
let selectedSubjectFilter = 'all'; // 'all' or specific subject id
let selectedHeatmapYear = '2027';
let isReplayingProgress = false;
let isDropdownOpen = false;

// Dynamic Datasets for 7D, 30D, 90D, 1Y, ALL
const CHART_DATASETS = {
  '7D': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    accuracy: [65, 88, 70, 65, 80, 88, 80],
    questions: [30, 48, 25, 18, 40, 52, 35],
    hours: [3.0, 5.2, 2.5, 1.8, 4.0, 5.5, 3.8],
    delta: '+4.2%'
  },
  '30D': {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    accuracy: [65, 88, 70, 65, 80, 88, 80],
    questions: [140, 220, 160, 130, 195, 240, 210],
    hours: [28, 45, 30, 24, 40, 52, 42],
    delta: '+8.4%'
  },
  '90D': {
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    accuracy: [58, 85, 68, 62, 78, 88],
    questions: [320, 480, 360, 310, 440, 520],
    hours: [75, 110, 80, 70, 100, 125],
    delta: '+14.6%'
  },
  '1Y': {
    labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
    accuracy: [52, 78, 62, 85, 74, 88],
    questions: [600, 950, 780, 1200, 980, 1400],
    hours: [120, 210, 160, 280, 220, 340],
    delta: '+32.0%'
  },
  'ALL': {
    labels: ['2025 Q1', '2025 Q2', '2025 Q3', '2025 Q4', '2026 Q1', '2026 Q2'],
    accuracy: [45, 75, 60, 82, 70, 88],
    questions: [800, 1400, 1100, 1800, 1500, 2200],
    hours: [180, 300, 240, 400, 320, 480],
    delta: '+40.0%'
  }
};

function renderAnalyticsModule() {
  const container = document.getElementById('analytics-main-content');
  if (!container) return;

  const isDemo = StorageManager.isDemoMode();
  const testHistory = StorageManager.getTestHistory();

  // Onboarding Empty State (If Demo Mode is OFF and 0 real test activity exists)
  if (!isDemo && testHistory.length === 0) {
    container.innerHTML = `
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px 24px; margin-bottom:20px;">
        <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; color:#F5F5F5; margin-bottom:4px;">Performance Analytics</h2>
        <p style="color:#9CA3AF; font-size:13px;">Diagnostic study report, TradingView SVG charts, activity heatmap, and goal progress.</p>
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

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentSet = CHART_DATASETS[activeTimeRange] || CHART_DATASETS['30D'];

  const subjectRows = [
    { id: 'dbms', name: 'Databases (DBMS)', progress: 92, accuracy: 91, solved: 145 },
    { id: 'coa', name: 'Computer Organization & Architecture', progress: 88, accuracy: 88, solved: 110 },
    { id: 'cn', name: 'Computer Networks (CN)', progress: 84, accuracy: 87, solved: 165 },
    { id: 'pds', name: 'Programming & Data Structures', progress: 85, accuracy: 85, solved: 180 },
    { id: 'em', name: 'Engineering Mathematics', progress: 82, accuracy: 82, solved: 140 },
    { id: 'os', name: 'Operating Systems (OS)', progress: 84, accuracy: 82, solved: 125 },
    { id: 'toc', name: 'Theory of Computation (TOC)', progress: 80, accuracy: 79, solved: 95 },
    { id: 'dl', name: 'Digital Logic', progress: 75, accuracy: 74, solved: 70 },
    { id: 'ga', name: 'General Aptitude (GA)', progress: 95, accuracy: 95, solved: 210 },
    { id: 'cd', name: 'Compiler Design', progress: 60, accuracy: 54, solved: 45 },
    { id: 'algo', name: 'Algorithms', progress: 68, accuracy: 58, solved: 85 }
  ];

  container.innerHTML = `
    <!-- 1. Hero Journey Card (Top Header) -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:24px; margin-bottom:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:16px;">
        <div>
          <div style="font-size:11px; font-weight:700; color:#3B82F6; text-transform:uppercase;">GATE CSE 2027 Journey</div>
          <h2 style="font-family:'Outfit', sans-serif; font-size:24px; font-weight:700; color:#F5F5F5; margin-top:2px;">Study Journey &bull; Day 93 / 180</h2>
        </div>

        <div style="display:flex; align-items:center; gap:12px; font-size:13px; color:#9CA3AF;">
          <div>Started: <strong style="color:#F5F5F5;">22 Aug 2026</strong></div>
          <div>&bull;</div>
          <div>Target Exam: <strong style="color:#F5F5F5;">1 Feb 2027</strong></div>
          <div>&bull;</div>
          <div style="background:rgba(245,158,11,0.15); color:#F59E0B; border:1px solid #F59E0B; padding:3px 10px; border-radius:12px; font-weight:700; font-size:12px;">87 Days Remaining</div>
        </div>
      </div>

      <!-- Main Journey Progress Bar -->
      <div style="margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; color:#9CA3AF; margin-bottom:6px;">
          <span>GATE Preparation Timeline</span>
          <span style="color:#3B82F6; font-weight:700;">52% Completed</span>
        </div>
        <div style="height:10px; background:#161920; border-radius:5px; overflow:hidden;">
          <div style="width:52%; height:100%; background:linear-gradient(90deg, #3B82F6, #10B981); border-radius:5px;"></div>
        </div>
      </div>

      <!-- Today's Daily Target Meter -->
      <div style="background:#161920; border:1px solid #23262D; border-radius:8px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="font-size:13px; font-weight:600; color:#F5F5F5;">Today's Mission Target</div>
        <div style="display:flex; align-items:center; gap:14px; flex:1; max-width:400px;">
          <div style="flex:1; height:8px; background:#0F1115; border-radius:4px; overflow:hidden;">
            <div style="width:80%; height:100%; background:#10B981;"></div>
          </div>
          <span style="font-size:13px; font-weight:700; color:#10B981;">8 / 10 Questions (80%)</span>
        </div>
      </div>
    </div>

    <!-- 2. Emotional Quick Stats (2x2 Grid) -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-bottom:20px;">
      
      <!-- Active Study Days -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:18px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Active Study Days</div>
        <div style="font-size:24px; font-weight:700; color:#F5F5F5; margin-top:4px;">93 / 180 Days</div>
        <div style="font-size:11px; color:#10B981; margin-top:2px;">Consistency: 87% &bull; Missed: 8 Days</div>
      </div>

      <!-- Streak & Flames -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:18px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Current Streak</div>
        <div style="font-size:24px; font-weight:700; color:#F59E0B; margin-top:4px;">18 Days 🔥</div>
        <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">Longest: 41 Days &bull; Consistency: 89%</div>
      </div>

      <!-- Questions Solved & Goal Remaining -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:18px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Questions Solved</div>
        <div style="font-size:24px; font-weight:700; color:#06B6D4; margin-top:4px;">845 Solved</div>
        <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">Goal: 1000 &bull; <strong style="color:#06B6D4;">155 Remaining</strong></div>
      </div>

      <!-- Accuracy & Target Bar -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:18px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Current Accuracy</div>
        <div style="font-size:24px; font-weight:700; color:#10B981; margin-top:4px;">84.2% <span style="font-size:12px; color:#10B981;">↑ +4.8%</span></div>
        <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">Target: 90.0% &bull; <strong style="color:#10B981;">5.8% Remaining</strong></div>
      </div>

    </div>

    <!-- 3. DeepSeek Style Clean Dropdown Header & TradingView Charts -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px; margin-bottom:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; position:relative;">
        <div>
          <div style="font-size:16px; font-weight:700; color:#F5F5F5;">TradingView Accuracy & Velocity Curve</div>
          <div style="font-size:12px; color:#9CA3AF;">Smooth Spline Curve with interactive time range filter.</div>
        </div>

        <!-- DeepSeek Style Dropdown Selector -->
        <div style="position:relative;">
          <button style="background:#000000; border:1px solid #23262D; color:#F5F5F5; padding:6px 14px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:8px;" onclick="toggleTimeDropdown()">
            <span>${activeTimeRange === '7D' ? '7 Days' : activeTimeRange === '30D' ? '30 Days' : activeTimeRange === '90D' ? '90 Days' : activeTimeRange === '1Y' ? '1 Year' : 'All Time'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          <div id="analytics-time-dropdown" style="display:${isDropdownOpen ? 'block' : 'none'}; position:absolute; right:0; top:40px; background:#16181D; border:1px solid #23262D; border-radius:8px; width:140px; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.4);">
            ${['7D', '30D', '90D', '1Y', 'ALL'].map(r => `
              <div style="padding:8px 12px; font-size:12px; color:${activeTimeRange === r ? '#3B82F6' : '#9CA3AF'}; font-weight:${activeTimeRange === r ? '700' : '500'}; cursor:pointer; hover:background:#23262D;" onclick="setTimeRangeFilter('${r}')">
                ${r === '7D' ? '7 Days' : r === '30D' ? '30 Days' : r === '90D' ? '90 Days' : r === '1Y' ? '1 Year' : 'All Time'}
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- TradingView Spline Curve Graph -->
      <div style="height:180px; position:relative; width:100%;">
        ${generateSplineWaveChart(currentSet.accuracy, currentSet.labels, '#10B981')}
      </div>
    </div>

    <!-- 4. Chronological Study Timeline (Milestones & Achievements) -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px; margin-bottom:20px;">
      <div style="font-size:16px; font-weight:700; color:#F5F5F5; margin-bottom:14px;">Study Journey Timeline & Milestones</div>

      <div style="display:flex; flex-direction:column; gap:16px; position:relative; padding-left:20px; border-left:2px solid #23262D;">
        <div style="position:relative;">
          <div style="position:absolute; left:-27px; top:2px; width:12px; height:12px; border-radius:50%; background:#3B82F6;"></div>
          <div style="font-size:11px; font-weight:700; color:#3B82F6;">22 AUG 2026</div>
          <div style="font-size:14px; font-weight:600; color:#F5F5F5;">🚀 Started GATE CSE 2027 Preparation</div>
        </div>

        <div style="position:relative;">
          <div style="position:absolute; left:-27px; top:2px; width:12px; height:12px; border-radius:50%; background:#10B981;"></div>
          <div style="font-size:11px; font-weight:700; color:#10B981;">31 AUG 2026</div>
          <div style="font-size:14px; font-weight:600; color:#F5F5F5;">✔ Completed Computer Networks (CN) Syllabus</div>
        </div>

        <div style="position:relative;">
          <div style="position:absolute; left:-27px; top:2px; width:12px; height:12px; border-radius:50%; background:#F59E0B;"></div>
          <div style="font-size:11px; font-weight:700; color:#F59E0B;">14 SEP 2026</div>
          <div style="font-size:14px; font-weight:600; color:#F5F5F5;">📝 Attempted First Full CBT Mock Test (65.0 Marks)</div>
        </div>

        <div style="position:relative;">
          <div style="position:absolute; left:-27px; top:2px; width:12px; height:12px; border-radius:50%; background:#06B6D4;"></div>
          <div style="font-size:11px; font-weight:700; color:#06B6D4;">3 OCT 2026</div>
          <div style="font-size:14px; font-weight:600; color:#F5F5F5;">🎯 Reached 500 Solved Questions Milestone</div>
        </div>

        <div style="position:relative;">
          <div style="position:absolute; left:-27px; top:2px; width:12px; height:12px; border-radius:50%; background:#10B981;"></div>
          <div style="font-size:11px; font-weight:700; color:#10B981;">TODAY</div>
          <div style="font-size:14px; font-weight:600; color:#F5F5F5;">🔥 18-Day Active Study Streak &bull; 84.2% Overall Accuracy</div>
        </div>
      </div>
    </div>

    <!-- 5. Subject Mastery Table (Notion Style) -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px; margin-bottom:20px;">
      <div style="font-size:16px; font-weight:700; color:#F5F5F5; margin-bottom:14px;">Subject Mastery & Performance Breakdown</div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        ${subjectRows.map(s => `
          <div>
            <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; color:#F5F5F5; margin-bottom:4px;">
              <span>${s.name}</span>
              <span style="color:${s.accuracy < 60 ? '#EF4444' : s.accuracy < 75 ? '#F59E0B' : '#10B981'};">${s.accuracy}% Accuracy</span>
            </div>
            <div style="height:8px; background:#161920; border-radius:4px; overflow:hidden;">
              <div style="width:${s.accuracy}%; height:100%; background:${s.accuracy < 60 ? '#EF4444' : s.accuracy < 75 ? '#F59E0B' : '#10B981'};"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 6. Study Activity Heatmap with Dual View Switcher (Daily / Monthly) -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="font-size:15px; font-weight:700; color:#F5F5F5;">Study Activity Grid</div>

          <!-- Dual Mode Switcher -->
          <div style="display:flex; background:#000000; border:1px solid #23262D; padding:2px; border-radius:6px;">
            <button style="background:${heatmapViewMode === 'daily' ? '#3B82F6' : 'transparent'}; color:${heatmapViewMode === 'daily' ? '#ffffff' : '#9CA3AF'}; border:none; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;" onclick="setHeatmapViewMode('daily')">Daily Grid</button>
            <button style="background:${heatmapViewMode === 'monthly' ? '#3B82F6' : 'transparent'}; color:${heatmapViewMode === 'monthly' ? '#ffffff' : '#9CA3AF'}; border:none; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;" onclick="setHeatmapViewMode('monthly')">Monthly Overview</button>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:12px;">
          <button class="btn-secondary" style="font-size:12px; padding:5px 12px; display:inline-flex; align-items:center; gap:6px; color:#3B82F6; border-color:rgba(59,130,246,0.3);" onclick="triggerReplayProgressAnimation()">
            <span>▶ Replay Timeline</span>
          </button>
          <div style="font-size:12px; color:#9CA3AF;">845 Solved &bull; 142 Hours</div>
        </div>
      </div>

      ${heatmapViewMode === 'daily' ? `
        <!-- GitHub Grid (7 Rows x 52 Columns - Real GitHub Compact Size) -->
        <div style="overflow-x:auto; padding-bottom:4px;">
          <div style="min-width:680px;">
            <div style="display:flex; justify-content:space-between; color:#9CA3AF; font-size:11px; margin-bottom:6px; padding-left:24px;">
              ${months.map(m => `<span>${m}</span>`).join('')}
            </div>

            <div style="display:flex; gap:8px; align-items:center;">
              <div style="display:flex; flex-direction:column; justify-content:space-between; height:90px; font-size:10px; color:#9CA3AF; padding-right:4px;">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              <div id="heatmap-tiles-grid" style="display:grid; grid-template-columns:repeat(52, 11px); gap:3px;">
                ${Array.from({ length: 364 }).map((_, idx) => {
                  const level = (idx % 7 === 0 || idx % 5 === 0) ? (idx % 4) : 0;
                  let bg = '#16181D'; // 0 activity
                  if (level === 1) bg = '#143A26'; // Low
                  if (level === 2) bg = '#1D6B3A'; // Medium
                  if (level === 3) bg = '#2D8F4C'; // High
                  if (level === 4) bg = '#42B86D'; // Very High

                  const dayNum = (idx % 28) + 1;
                  return `
                    <div class="heatmap-tile" style="width:11px; height:11px; background:${bg}; border-radius:2px; cursor:pointer; transition:all 0.15s;" 
                      onclick="inspectHeatmapDay('${dayNum} Aug ${selectedHeatmapYear}', ${dayNum * 3}, '4h 18m', ${Math.min(95, 70 + dayNum)})"
                      title="${dayNum} Aug: ${dayNum * 3} Questions Solved">
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>
      ` : `
        <!-- Monthly Summary Bars View -->
        <div style="display:flex; flex-direction:column; gap:12px; padding:10px 0;">
          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#F5F5F5; font-weight:600; margin-bottom:4px;">
              <span>August 2026</span><span>185 Questions Solved &bull; 86% Acc</span>
            </div>
            <div style="height:8px; background:#161920; border-radius:4px; overflow:hidden;">
              <div style="width:75%; height:100%; background:#10B981;"></div>
            </div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#F5F5F5; font-weight:600; margin-bottom:4px;">
              <span>September 2026</span><span>240 Questions Solved &bull; 88% Acc</span>
            </div>
            <div style="height:8px; background:#161920; border-radius:4px; overflow:hidden;">
              <div style="width:90%; height:100%; background:#10B981;"></div>
            </div>
          </div>

          <div>
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#F5F5F5; font-weight:600; margin-bottom:4px;">
              <span>October 2026</span><span>310 Questions Solved &bull; 91% Acc</span>
            </div>
            <div style="height:8px; background:#161920; border-radius:4px; overflow:hidden;">
              <div style="width:100%; height:100%; background:#3B82F6;"></div>
            </div>
          </div>
        </div>
      `}

      <!-- Heatmap Footer Legend & Muted Colors -->
      <div style="display:flex; justify-content:flex-end; align-items:center; gap:6px; font-size:11px; color:#9CA3AF; margin-top:12px;">
        <span>Less</span>
        <div style="width:10px; height:10px; background:#16181D; border-radius:2px;"></div>
        <div style="width:10px; height:10px; background:#143A26; border-radius:2px;"></div>
        <div style="width:10px; height:10px; background:#1D6B3A; border-radius:2px;"></div>
        <div style="width:10px; height:10px; background:#2D8F4C; border-radius:2px;"></div>
        <div style="width:10px; height:10px; background:#42B86D; border-radius:2px;"></div>
        <span>More</span>
      </div>

      <!-- Day Inspector Panel Container -->
      <div id="heatmap-day-inspector" style="margin-top:14px; display:none;"></div>
    </div>
  `;
}

// 🌟 Spline Curve Wave Line Chart Generator (Matching User's Meta-Chart / Sine Wave Image Pattern)
function generateSplineWaveChart(dataPoints, labels, strokeColor) {
  const width = 500;
  const height = 120;
  const paddingX = 30;
  const paddingY = 20;

  const minVal = Math.min(...dataPoints);
  const maxVal = Math.max(...dataPoints);
  const range = maxVal - minVal || 1;

  // Compute exact coordinates
  const pts = dataPoints.map((val, idx) => {
    const x = paddingX + (idx / (dataPoints.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((val - minVal) / range) * (height - 2 * paddingY);
    return { x, y, val, label: labels[idx] || '' };
  });

  // Build Cubic Spline path with smooth wave controls
  let pathD = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? i : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return `
    <svg viewBox="0 0 ${width} ${height + 35}" style="width:100%; height:100%; border:1px solid #23262D; border-radius:8px; background:#000000; padding:6px; box-sizing:border-box;">
      <!-- Grid Horizontal Reference Lines -->
      <line x1="${paddingX}" y1="20" x2="${width - paddingX}" y2="20" stroke="#23262D" stroke-width="1" />
      <line x1="${paddingX}" y1="50" x2="${width - paddingX}" y2="50" stroke="#23262D" stroke-width="1" />
      <line x1="${paddingX}" y1="80" x2="${width - paddingX}" y2="80" stroke="#23262D" stroke-width="1" />
      <line x1="${paddingX}" y1="110" x2="${width - paddingX}" y2="110" stroke="#23262D" stroke-width="1" />

      <!-- Spline Wave Curve Line -->
      <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Data Point Circles & X-Axis Labels -->
      ${pts.map((p) => `
        <circle cx="${p.x}" cy="${p.y}" r="5" fill="${strokeColor}" stroke="#000000" stroke-width="2" style="cursor:pointer;" title="${p.label}: ${p.val}">
          <title>${p.label}: ${p.val}</title>
        </circle>
        <line x1="${p.x}" y1="110" x2="${p.x}" y2="115" stroke="#3B82F6" stroke-width="1" />
        <text x="${p.x}" y="130" text-anchor="middle" fill="#9CA3AF" font-size="10" font-weight="500">${p.label}</text>
      `).join('')}
    </svg>
  `;
}

function setTimeRangeFilter(range) {
  activeTimeRange = range;
  isDropdownOpen = false;
  renderAnalyticsModule();
}

function toggleTimeDropdown() {
  isDropdownOpen = !isDropdownOpen;
  renderAnalyticsModule();
}

function setHeatmapViewMode(mode) {
  heatmapViewMode = mode;
  renderAnalyticsModule();
}

function inspectHeatmapDay(dateStr, qCount, timeStr, acc) {
  const container = document.getElementById('heatmap-day-inspector');
  if (!container) return;

  container.style.display = 'block';
  container.innerHTML = `
    <div style="background:#16181D; border:1px solid #3B82F6; padding:12px 16px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <div style="font-size:11px; font-weight:700; color:#3B82F6; text-transform:uppercase;">Daily Inspector &bull; ${dateStr}</div>
        <div style="font-size:14px; font-weight:600; color:#F5F5F5; margin-top:2px;">
          ${qCount} Questions Solved &bull; ${timeStr} Duration &bull; <span style="color:#10B981;">${acc}% Accuracy</span>
        </div>
      </div>

      <div style="font-size:12px; color:#9CA3AF;">
        Subjects: <strong>DBMS, CN, OS</strong>
      </div>
    </div>
  `;
}

function triggerReplayProgressAnimation() {
  if (isReplayingProgress) return;
  isReplayingProgress = true;

  const tiles = document.querySelectorAll('.heatmap-tile');
  if (tiles.length === 0) return;

  let current = 0;
  const interval = setInterval(() => {
    if (current >= tiles.length) {
      clearInterval(interval);
      isReplayingProgress = false;
      return;
    }

    tiles[current].style.transform = 'scale(1.3)';
    tiles[current].style.boxShadow = '0 0 8px #3B82F6';
    setTimeout(() => {
      tiles[current].style.transform = 'scale(1)';
      tiles[current].style.boxShadow = 'none';
    }, 150);

    current += 3;
  }, 40);
}

window.renderAnalyticsModule = renderAnalyticsModule;
window.setTimeRangeFilter = setTimeRangeFilter;
window.toggleTimeDropdown = toggleTimeDropdown;
window.setHeatmapViewMode = setHeatmapViewMode;
window.inspectHeatmapDay = inspectHeatmapDay;
window.triggerReplayProgressAnimation = triggerReplayProgressAnimation;

document.addEventListener('DOMContentLoaded', () => {
  renderAnalyticsModule();
});
