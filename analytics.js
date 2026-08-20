// Linear + Vercel + TradingView Single-Accent Dense Performance Analytics Engine

let activeTimeRange = '30D'; // '7D', '30D', '90D', '1Y', 'ALL'
let heatmapViewMode = 'daily'; // 'daily' or 'monthly'
let selectedSubjectFilter = 'all'; // 'all' or specific subject id
let selectedHeatmapYear = '2027';
let isReplayingProgress = false;

// Dynamic Datasets for 7D, 30D, 90D, 1Y, ALL
const CHART_DATASETS = {
  '7D': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    accuracy: [78, 80, 81, 83, 82, 85, 87],
    questions: [35, 22, 48, 15, 30, 42, 25],
    hours: [3.0, 5.2, 2.5, 1.8, 4.0, 5.5, 3.8],
    delta: '+4.2%'
  },
  '30D': {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    accuracy: [80, 82, 84, 86, 88, 90],
    questions: [140, 220, 160, 130, 195, 240],
    hours: [28, 45, 30, 24, 40, 52],
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
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px 20px; margin-bottom:16px;">
        <h2 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; color:#F5F5F5; margin-bottom:2px;">Performance Analytics</h2>
        <p style="color:#9CA3AF; font-size:12px;">Diagnostic study report, TradingView SVG charts, activity heatmap, and goal progress.</p>
      </div>

      <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; text-align:center; padding:36px 20px;">
        <div style="width:48px; height:48px; border-radius:50%; background:rgba(59,130,246,0.1); color:#3B82F6; display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </div>
        <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#F5F5F5; margin-bottom:6px;">No Study Data Recorded Yet</h3>
        <p style="color:#9CA3AF; max-width:480px; margin:0 auto 16px auto; font-size:13px; line-height:1.5;">
          Start practicing questions or attempt a mock test to build your performance analytics and diagnostic trends.
        </p>

        <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
          <button class="btn-primary" style="font-size:12px; padding:8px 16px;" onclick="navigateToView('practice')">Start Practice Center ➔</button>
          <button class="btn-secondary" style="font-size:12px; padding:8px 16px;" onclick="navigateToView('cbt')">Take Full Mock Test ➔</button>
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
    <!-- Header with Integrated Underline Time Filter -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:12px 16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <h2 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; color:#F5F5F5; margin-bottom:2px;">Performance Analytics</h2>
        <p style="color:#9CA3AF; font-size:12px;">GATE 2027 Diagnostic report, TradingView smooth curves, and GitHub study activity.</p>
      </div>

      <!-- Clean Text Link Time Selector -->
      <div style="display:flex; align-items:center; gap:14px;">
        ${['7D', '30D', '90D', '1Y', 'ALL'].map(r => `
          <button style="background:none; border:none; border-bottom:${activeTimeRange === r ? '2px solid #3B82F6' : '2px solid transparent'}; color:${activeTimeRange === r ? '#F5F5F5' : '#9CA3AF'}; font-weight:${activeTimeRange === r ? '700' : '500'}; padding:2px 4px; font-size:12px; cursor:pointer;" onclick="setTimeRangeFilter('${r}')">${r}</button>
        `).join('')}
      </div>
    </div>

    <!-- SECTION 1: Hero Stats (One Single Row - 4 KPI Cards) -->
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; margin-bottom:12px;">
      
      <!-- Card 1: Accuracy -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:10px 12px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:10px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Overall Accuracy</span>
          <span style="font-size:10px; color:#10B981; font-weight:700;">▲ ${currentSet.delta}</span>
        </div>
        <div style="font-size:22px; font-weight:700; color:#F5F5F5; margin-top:2px;">84.2%</div>
        <div style="font-size:10px; color:#9CA3AF; margin-top:1px;">Target: 90.0% &bull; <strong style="color:#10B981;">5.8% to go</strong></div>
      </div>

      <!-- Card 2: Questions Solved -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div>
            <div style="font-size:13px; font-weight:700; color:#F5F5F5;">Daily Study Hours</div>
            <div style="font-size:11px; color:#9CA3AF;">Logged Duration Area</div>
          </div>
          <span style="font-size:11px; color:#3B82F6; font-weight:700;">● Hours</span>
        </div>

        <div style="height:150px; position:relative; width:100%;">
          ${generateSplineWaveChart(currentSet.hours, currentSet.labels, '#3B82F6', 'area')}
        </div>
      </div>

      <!-- Chart 4: Subject Accuracy Horizontal Bars (Notion Style) -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px;">
        <div style="font-size:13px; font-weight:700; color:#F5F5F5; margin-bottom:12px;">Subject Accuracy Levels</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${subjectRows.slice(0, 5).map(s => `
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:#F5F5F5; margin-bottom:3px;">
                <span>${s.name}</span>
                <span style="color:${s.accuracy < 60 ? '#EF4444' : s.accuracy < 75 ? '#F59E0B' : '#10B981'};">${s.accuracy}%</span>
              </div>
              <div style="height:5px; background:#161920; border-radius:3px; overflow:hidden;">
                <div style="width:${s.accuracy}%; height:100%; background:${s.accuracy < 60 ? '#EF4444' : s.accuracy < 75 ? '#F59E0B' : '#10B981'};"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>

    <!-- 3. GitHub Activity Heatmap with Daily Inspector -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="font-size:14px; font-weight:700; color:#F5F5F5;">Study Activity Calendar</div>
          <span style="font-size:11px; color:#9CA3AF;">52 Weeks &bull; 845 Solved</span>
        </div>

        <button class="btn-secondary" style="font-size:11px; padding:4px 10px; color:#3B82F6; border-color:rgba(59,130,246,0.3);" onclick="triggerReplayProgressAnimation()">
          Replay Timeline
        </button>
      </div>

      <!-- GitHub Grid (52 Columns x 11px Compact) -->
      <div style="overflow-x:auto; padding-bottom:4px;">
        <div style="min-width:680px;">
          <div style="display:flex; justify-content:space-between; color:#9CA3AF; font-size:10px; margin-bottom:4px; padding-left:24px;">
            ${months.map(m => `<span>${m}</span>`).join('')}
          </div>

          <div style="display:flex; gap:6px; align-items:center;">
            <div style="display:flex; flex-direction:column; justify-content:space-between; height:85px; font-size:9px; color:#9CA3AF; padding-right:2px;">
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
                    title="${dayNum} Aug: ${dayNum * 3} Solved &bull; ${Math.min(95, 70 + dayNum)}% Acc">
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Heatmap Footer Legend & Muted Colors -->
      <div style="display:flex; justify-content:flex-end; align-items:center; gap:5px; font-size:10px; color:#9CA3AF; margin-top:10px;">
        <span>Less</span>
        <div style="width:9px; height:9px; background:#16181D; border-radius:2px;"></div>
        <div style="width:9px; height:9px; background:#143A26; border-radius:2px;"></div>
        <div style="width:9px; height:9px; background:#1D6B3A; border-radius:2px;"></div>
        <div style="width:9px; height:9px; background:#2D8F4C; border-radius:2px;"></div>
        <div style="width:9px; height:9px; background:#42B86D; border-radius:2px;"></div>
        <span>More</span>
      </div>

      <!-- Day Inspector Panel Container -->
      <div id="heatmap-day-inspector" style="margin-top:10px; display:none;"></div>
    </div>
  `;
}

// 🌟 TradingView Spline Curve & Area Chart Generator with Stock Chart Axis & Hover Inspector
function generateSplineWaveChart(dataPoints, labels, strokeColor, type = 'line') {
  const width = 500;
  const height = 120;
  const paddingX = 35;
  const paddingY = 18;

  const minVal = Math.floor(Math.min(...dataPoints) * 0.9);
  const maxVal = Math.ceil(Math.max(...dataPoints) * 1.05);
  const range = maxVal - minVal || 1;

  // Compute exact coordinates
  const pts = dataPoints.map((val, idx) => {
    const x = paddingX + (idx / (dataPoints.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((val - minVal) / range) * (height - 2 * paddingY);
    return { x, y, val, label: labels[idx] || '' };
  });

  // Build Cubic Spline path
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

  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${height - paddingY} L ${pts[0].x} ${height - paddingY} Z`;

  return `
    <svg viewBox="0 0 ${width} ${height + 25}" style="width:100%; height:100%; border:1px solid #23262D; border-radius:6px; background:#000000; padding:4px; box-sizing:border-box;">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.3" />
          <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <!-- Stock Chart Y-Axis Dashed Reference Lines -->
      <line x1="${paddingX}" y1="20" x2="${width - paddingX}" y2="20" stroke="#23262D" stroke-dasharray="3,3" />
      <line x1="${paddingX}" y1="55" x2="${width - paddingX}" y2="55" stroke="#23262D" stroke-dasharray="3,3" />
      <line x1="${paddingX}" y1="90" x2="${width - paddingX}" y2="90" stroke="#23262D" stroke-dasharray="3,3" />

      <!-- Y-Axis Values -->
      <text x="8" y="24" fill="#9CA3AF" font-size="9">${maxVal}</text>
      <text x="8" y="59" fill="#9CA3AF" font-size="9">${Math.round((maxVal + minVal) / 2)}</text>
      <text x="8" y="94" fill="#9CA3AF" font-size="9">${minVal}</text>

      ${type === 'area' ? `<path d="${areaD}" fill="url(#areaGrad)" />` : ''}

      <!-- Spline Curve Line -->
      <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Data Nodes & X-Axis Labels -->
      ${pts.map((p) => `
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="${strokeColor}" stroke="#000000" stroke-width="2" style="cursor:pointer;">
          <title>${p.label}: ${p.val}</title>
        </circle>
        <text x="${p.x}" y="${height + 16}" text-anchor="middle" fill="#9CA3AF" font-size="9" font-weight="500">${p.label}</text>
      `).join('')}
    </svg>
  `;
}

// Vertical Bar Velocity Chart Generator
function generateBarChart(dataPoints, labels, barColor) {
  const width = 500;
  const height = 120;
  const paddingX = 35;
  const paddingY = 18;

  const maxVal = Math.max(...dataPoints) * 1.1 || 1;

  return `
    <svg viewBox="0 0 ${width} ${height + 25}" style="width:100%; height:100%; border:1px solid #23262D; border-radius:6px; background:#000000; padding:4px; box-sizing:border-box;">
      <!-- Grid Lines -->
      <line x1="${paddingX}" y1="20" x2="${width - paddingX}" y2="20" stroke="#23262D" stroke-dasharray="3,3" />
      <line x1="${paddingX}" y1="60" x2="${width - paddingX}" y2="60" stroke="#23262D" stroke-dasharray="3,3" />
      <line x1="${paddingX}" y1="95" x2="${width - paddingX}" y2="95" stroke="#23262D" stroke-dasharray="3,3" />

      <!-- Vertical Bars -->
      ${dataPoints.map((val, idx) => {
        const barWidth = 24;
        const x = paddingX + (idx / (dataPoints.length - 1)) * (width - 2 * paddingX) - barWidth / 2;
        const barHeight = (val / maxVal) * (height - 2 * paddingY);
        const y = height - paddingY - barHeight;

        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${barColor}" rx="3" style="cursor:pointer;">
            <title>${labels[idx] || ''}: ${val} Solved</title>
          </rect>
          <text x="${x + barWidth / 2}" y="${height + 16}" text-anchor="middle" fill="#9CA3AF" font-size="9" font-weight="500">${labels[idx] || ''}</text>
        `;
      }).join('')}
    </svg>
  `;
}

function setTimeRangeFilter(range) {
  activeTimeRange = range;
  renderAnalyticsModule();
}

function inspectHeatmapDay(dateStr, qCount, timeStr, acc) {
  const container = document.getElementById('heatmap-day-inspector');
  if (!container) return;

  container.style.display = 'block';
  container.innerHTML = `
    <div style="background:#16181D; border:1px solid #3B82F6; padding:10px 14px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
      <div>
        <div style="font-size:10px; font-weight:700; color:#3B82F6; text-transform:uppercase;">Daily Inspector &bull; ${dateStr}</div>
        <div style="font-size:13px; font-weight:600; color:#F5F5F5; margin-top:2px;">
          ${qCount} Solved &bull; ${timeStr} Duration &bull; <span style="color:#10B981;">${acc}% Accuracy</span>
        </div>
      </div>
      <div style="font-size:11px; color:#9CA3AF;">Subjects: <strong>DBMS, CN, OS</strong></div>
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
    tiles[current].style.boxShadow = '0 0 6px #3B82F6';
    setTimeout(() => {
      tiles[current].style.transform = 'scale(1)';
      tiles[current].style.boxShadow = 'none';
    }, 150);

    current += 3;
  }, 40);
}

window.renderAnalyticsModule = renderAnalyticsModule;
window.setTimeRangeFilter = setTimeRangeFilter;
window.inspectHeatmapDay = inspectHeatmapDay;
window.triggerReplayProgressAnimation = triggerReplayProgressAnimation;

document.addEventListener('DOMContentLoaded', () => {
  renderAnalyticsModule();
});
