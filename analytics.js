// TradingView + GitHub Insights Style SVG Line & Area Charts Engine for GATE CSE 2027

let activeTimeRange = '30D'; // '7D', '30D', '90D', '1Y', 'ALL'
let selectedSubjectFilter = 'all'; // 'all' or specific subject id
let selectedHeatmapYear = '2027';
let isReplayingProgress = false;

// Dynamic Datasets for 7D, 30D, 90D, 1Y, ALL
const CHART_DATASETS = {
  '7D': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    accuracy: [78, 80, 81, 83, 82, 85, 87],
    questions: [35, 22, 48, 15, 30, 42, 25],
    hours: [4.2, 3.0, 5.1, 2.0, 3.8, 5.5, 3.2],
    trend: 'up',
    delta: '+4.2%'
  },
  '30D': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    accuracy: [65, 72, 78, 84],
    questions: [140, 185, 210, 260],
    hours: [28, 35, 42, 48],
    trend: 'up',
    delta: '+8.4%'
  },
  '90D': {
    labels: ['Month 1', 'Month 2', 'Month 3'],
    accuracy: [58, 68, 84],
    questions: [320, 450, 680],
    hours: [75, 98, 142],
    trend: 'up',
    delta: '+14.6%'
  },
  '1Y': {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    accuracy: [52, 64, 75, 84],
    questions: [600, 950, 1400, 2100],
    hours: [120, 210, 310, 420],
    trend: 'up',
    delta: '+32.0%'
  },
  'ALL': {
    labels: ['2025 H1', '2025 H2', '2026 H1', '2026 H2'],
    accuracy: [45, 58, 72, 85],
    questions: [800, 1500, 2400, 3200],
    hours: [180, 320, 480, 640],
    trend: 'up',
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
    <!-- Linear / Vercel Aesthetic Header -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px 24px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
      <div>
        <div style="display:flex; align-items:center; gap:10px;">
          <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; color:#F5F5F5; margin-bottom:2px;">Performance Analytics</h2>
          ${selectedSubjectFilter !== 'all' ? `
            <span style="background:rgba(59,130,246,0.15); color:#3B82F6; border:1px solid #3B82F6; padding:2px 10px; border-radius:12px; font-size:11px; font-weight:700;">
              Filter: ${selectedSubjectFilter.toUpperCase()} <button onclick="setAnalyticsSubjectFilter('all')" style="background:none; border:none; color:#3B82F6; cursor:pointer; margin-left:4px;">✕</button>
            </span>
          ` : ''}
        </div>
        <p style="color:#9CA3AF; font-size:13px;">TradingView style interactive SVG curves, accuracy trends, and activity heatmap.</p>
      </div>

      <!-- Linear / Vercel Style Clean Underline Time Range Selector -->
      <div style="display:flex; align-items:center; gap:20px; border-bottom:1px solid #23262D; padding-bottom:4px;">
        <span style="font-size:12px; font-weight:600; color:#9CA3AF; text-transform:uppercase;">Time Range:</span>
        ${['7D', '30D', '90D', '1Y', 'ALL'].map(range => `
          <button style="background:none; border:none; border-bottom:${activeTimeRange === range ? '2px solid #3B82F6' : '2px solid transparent'}; color:${activeTimeRange === range ? '#F5F5F5' : '#9CA3AF'}; font-weight:${activeTimeRange === range ? '700' : '500'}; padding:4px 2px; font-size:13px; cursor:pointer; transition:all 0.2s;" onclick="setTimeRangeFilter('${range}')">${range}</button>
        `).join('')}
      </div>
    </div>

    <!-- 1. Performance Summary Metrics with Delta Trend Indicators -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:14px; margin-bottom:20px;">
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Current Accuracy</div>
        <div style="font-size:24px; font-weight:700; color:#F5F5F5; margin-top:4px;">84.2%</div>
        <div style="font-size:11px; color:#10B981; margin-top:2px;">↑ ${currentSet.delta} in ${activeTimeRange}</div>
      </div>

      <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Study Time</div>
        <div style="font-size:24px; font-weight:700; color:#F5F5F5; margin-top:4px;">146 Hours</div>
        <div style="font-size:11px; color:#10B981; margin-top:2px;">↑ +8.5h this week</div>
      </div>

      <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Questions Solved</div>
        <div style="font-size:24px; font-weight:700; color:#06B6D4; margin-top:4px;">845</div>
        <div style="font-size:11px; color:#10B981; margin-top:2px;">↑ +63 this week</div>
      </div>

      <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px;">
        <div style="font-size:11px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Current Streak</div>
        <div style="font-size:24px; font-weight:700; color:#F59E0B; margin-top:4px;">18 Days 🔥</div>
        <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">Longest: 41 Days</div>
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

    <!-- 2. TradingView & GitHub Insights Style Smooth SVG Line/Area Charts (2x2 Grid) -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
      
      <!-- Chart 1: Accuracy Trend SVG Smooth Curve Line Chart -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <div style="font-size:14px; font-weight:700; color:#F5F5F5;">Accuracy Trend Curve</div>
            <div style="font-size:11px; color:#9CA3AF;">TradingView Bézier Line &bull; <span style="color:#10B981;">${currentSet.delta} (${activeTimeRange})</span></div>
          </div>
          <span style="font-size:11px; background:rgba(16,185,129,0.15); color:#10B981; border:1px solid #10B981; padding:2px 8px; border-radius:12px; font-weight:700;">+ Upward</span>
        </div>

        <div style="height:150px; position:relative; width:100%;">
          ${generateSVGLineChart(currentSet.accuracy, currentSet.labels, '#10B981', 'accGradient')}
        </div>
      </div>

      <!-- Chart 2: Questions Solved Velocity SVG Area Chart -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <div style="font-size:14px; font-weight:700; color:#F5F5F5;">Questions Solved Velocity</div>
            <div style="font-size:11px; color:#9CA3AF;">GitHub Insights Area Graph &bull; Cyan Metric</div>
          </div>
          <span style="font-size:11px; background:rgba(6,182,212,0.15); color:#06B6D4; border:1px solid #06B6D4; padding:2px 8px; border-radius:12px; font-weight:700;">Active</span>
        </div>

        <div style="height:150px; position:relative; width:100%;">
          ${generateSVGLineChart(currentSet.questions, currentSet.labels, '#06B6D4', 'qGradient')}
        </div>
      </div>

      <!-- Chart 3: Study Hours Velocity SVG Area Chart -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <div style="font-size:14px; font-weight:700; color:#F5F5F5;">Daily Study Hours</div>
            <div style="font-size:11px; color:#9CA3AF;">Purple Time Area Graph</div>
          </div>
          <span style="font-size:11px; background:rgba(139,92,246,0.15); color:#8B5CF6; border:1px solid #8B5CF6; padding:2px 8px; border-radius:12px; font-weight:700;">Tracked</span>
        </div>

        <div style="height:150px; position:relative; width:100%;">
          ${generateSVGLineChart(currentSet.hours, currentSet.labels, '#8B5CF6', 'hrsGradient')}
        </div>
      </div>

      <!-- Chart 4: Subject Time Distribution Breakdown -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px;">
        <div style="font-size:14px; font-weight:700; color:#F5F5F5; margin-bottom:14px;">Subject Time Distribution</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div style="cursor:pointer;" onclick="setAnalyticsSubjectFilter('cn')">
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; color:#F5F5F5; margin-bottom:4px;">
              <span>Computer Networks (CN)</span><span>24%</span>
            </div>
            <div style="height:6px; background:#161920; border-radius:3px; overflow:hidden;">
              <div style="width:24%; height:100%; background:#3B82F6;"></div>
            </div>
          </div>

          <div style="cursor:pointer;" onclick="setAnalyticsSubjectFilter('os')">
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; color:#F5F5F5; margin-bottom:4px;">
              <span>Operating Systems (OS)</span><span>18%</span>
            </div>
            <div style="height:6px; background:#161920; border-radius:3px; overflow:hidden;">
              <div style="width:18%; height:100%; background:#10B981;"></div>
            </div>
          </div>

          <div style="cursor:pointer;" onclick="setAnalyticsSubjectFilter('dbms')">
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; color:#F5F5F5; margin-bottom:4px;">
              <span>Databases (DBMS)</span><span>16%</span>
            </div>
            <div style="height:6px; background:#161920; border-radius:3px; overflow:hidden;">
              <div style="width:16%; height:100%; background:#F59E0B;"></div>
            </div>
          </div>

          <div style="cursor:pointer;" onclick="setAnalyticsSubjectFilter('coa')">
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; color:#F5F5F5; margin-bottom:4px;">
              <span>COA & Algorithms</span><span>12%</span>
            </div>
            <div style="height:6px; background:#161920; border-radius:3px; overflow:hidden;">
              <div style="width:12%; height:100%; background:#8B5CF6;"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 3. Goal Progress & Recent Sessions Timeline -->
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
        <div style="font-size:15px; font-weight:700; color:#F5F5F5; margin-bottom:14px;">Recent Study Sessions Timeline</div>

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

    <!-- 4. Subject Performance Table with Interactive Row Filtering -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px; margin-bottom:20px;">
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
              <tr style="border-bottom:1px solid #161920; color:#F5F5F5; background:${selectedSubjectFilter === s.id ? 'rgba(59,130,246,0.1)' : 'transparent'}; cursor:pointer;" onclick="setAnalyticsSubjectFilter('${s.id}')">
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
                  <button class="btn-primary" style="font-size:11px; padding:4px 10px;" onclick="event.stopPropagation(); navigateToView('practice');">Practice</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- 5. Soft GitHub-Style Study Activity Heatmap with Year Selector & Replay CTA -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:12px; padding:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="font-size:15px; font-weight:700; color:#F5F5F5;">Study Activity Grid</div>
          <select id="heatmap-year-select" style="background:#000000; border:1px solid #23262D; color:#F5F5F5; font-size:12px; padding:4px 8px; border-radius:6px; font-weight:600; cursor:pointer;" onchange="setHeatmapYear(this.value)">
            <option value="2027" ${selectedHeatmapYear === '2027' ? 'selected' : ''}>2027</option>
            <option value="2026" ${selectedHeatmapYear === '2026' ? 'selected' : ''}>2026</option>
          </select>
        </div>

        <div style="display:flex; align-items:center; gap:12px;">
          <button class="btn-secondary" style="font-size:12px; padding:5px 12px; display:inline-flex; align-items:center; gap:6px; color:#3B82F6; border-color:rgba(59,130,246,0.3);" onclick="triggerReplayProgressAnimation()">
            <span>▶ Replay Timeline</span>
          </button>
          <div style="font-size:12px; color:#9CA3AF;">845 Solved &bull; 142 Hours</div>
        </div>
      </div>

      <!-- Month Labels Header -->
      <div style="display:flex; justify-content:space-between; color:#9CA3AF; font-size:11px; margin-bottom:6px; padding-left:24px;">
        ${months.map(m => `<span>${m}</span>`).join('')}
      </div>

      <!-- GitHub Grid (7 Rows x 24 Columns) -->
      <div style="display:flex; gap:6px;">
        <div style="display:flex; flex-direction:column; justify-content:space-between; font-size:10px; color:#9CA3AF; padding-right:4px;">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <div id="heatmap-tiles-grid" style="display:grid; grid-template-columns:repeat(24, 1fr); gap:4px; flex:1;">
          ${Array.from({ length: 168 }).map((_, idx) => {
            const level = (idx % 7 === 0 || idx % 5 === 0) ? (idx % 4) : 0;
            let bg = '#16181D'; // 0 activity
            if (level === 1) bg = '#143A26'; // Low
            if (level === 2) bg = '#1D6B3A'; // Medium
            if (level === 3) bg = '#2D8F4C'; // High
            if (level === 4) bg = '#42B86D'; // Very High

            const dayNum = (idx % 28) + 1;
            return `
              <div class="heatmap-tile" style="aspect-ratio:1; background:${bg}; border-radius:2px; cursor:pointer; transition:all 0.15s;" 
                onclick="inspectHeatmapDay('${dayNum} Aug ${selectedHeatmapYear}', ${dayNum * 3}, '4h 18m', ${Math.min(95, 70 + dayNum)})"
                title="${dayNum} Aug: ${dayNum * 3} Questions Solved">
              </div>
            `;
          }).join('')}
        </div>
      </div>

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

// 🌟 TradingView SVG Smooth Curve Line & Area Chart Generator
function generateSVGLineChart(dataPoints, labels, strokeColor, gradientId) {
  const width = 500;
  const height = 110;
  const padding = 15;

  const minVal = Math.min(...dataPoints) * 0.9;
  const maxVal = Math.max(...dataPoints) * 1.1 || 1;

  // Compute X and Y coordinates
  const pts = dataPoints.map((val, idx) => {
    const x = padding + (idx / (dataPoints.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    return { x, y, val };
  });

  // Construct Bézier Smooth Curve Path
  let pathD = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const xc = (pts[i].x + pts[i + 1].x) / 2;
    const yc = (pts[i].y + pts[i + 1].y) / 2;
    pathD += ` Q ${pts[i].x} ${pts[i].y}, ${xc} ${yc}`;
  }
  pathD += ` T ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;

  // Area Fill Path
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;

  return `
    <svg viewBox="0 0 ${width} ${height + 25}" style="width:100%; height:100%; overflow:visible;">
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.35" />
          <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <!-- Grid Background Lines -->
      <line x1="0" y1="20" x2="${width}" y2="20" stroke="#23262D" stroke-dasharray="3,3" />
      <line x1="0" y1="60" x2="${width}" y2="60" stroke="#23262D" stroke-dasharray="3,3" />
      <line x1="0" y1="95" x2="${width}" y2="95" stroke="#23262D" stroke-dasharray="3,3" />

      <!-- Area Fill -->
      <path d="${areaD}" fill="url(#${gradientId})" />

      <!-- Smooth Curve Stroke Line -->
      <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" />

      <!-- Data Nodes & Tooltips -->
      ${pts.map((p, i) => `
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="${strokeColor}" stroke="#0F1115" stroke-width="2" class="chart-node" style="cursor:pointer; transition:all 0.2s;">
          <title>${labels[i] || ''}: ${p.val}</title>
        </circle>
        <text x="${p.x}" y="${height + 20}" text-anchor="middle" fill="#9CA3AF" font-size="10" font-weight="600">${labels[i] || ''}</text>
      `).join('')}
    </svg>
  `;
}

function setTimeRangeFilter(range) {
  activeTimeRange = range;
  renderAnalyticsModule();
}

function setHeatmapYear(yr) {
  selectedHeatmapYear = yr;
  renderAnalyticsModule();
}

function setAnalyticsSubjectFilter(subId) {
  selectedSubjectFilter = subId;
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
window.setHeatmapYear = setHeatmapYear;
window.setAnalyticsSubjectFilter = setAnalyticsSubjectFilter;
window.inspectHeatmapDay = inspectHeatmapDay;
window.triggerReplayProgressAnimation = triggerReplayProgressAnimation;

document.addEventListener('DOMContentLoaded', () => {
  renderAnalyticsModule();
});
