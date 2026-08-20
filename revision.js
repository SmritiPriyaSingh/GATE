// Learn Center Module - Computer Networks (CN) Study Modules

const LEARN_CN_TOPICS = [
  { id: 'cn_1', num: '01', title: 'IP Addressing, Subnetting & Supernetting', pages: '11.1 – 11.3', status: 'Ready' },
  { id: 'cn_2', num: '02', title: 'Error Control', pages: '11.4 – 11.6', status: 'Ready' },
  { id: 'cn_3', num: '03', title: 'Flow Control', pages: '11.7 – 11.10', status: 'Ready' },
  { id: 'cn_4', num: '04', title: 'IPv4 Header', pages: '11.11 – 11.14', status: 'Ready' },
  { id: 'cn_5', num: '05', title: 'TCP & UDP', pages: '11.15 – 11.19', status: 'Ready' },
  { id: 'cn_6', num: '06', title: 'Medium Access Control [MAC]', pages: '11.20 – 11.22', status: 'Ready' },
  { id: 'cn_7', num: '07', title: 'Routing Algorithms, Switching & IP Support Protocol', pages: '11.23 – 11.27', status: 'Ready' },
  { id: 'cn_8', num: '08', title: 'Application Layer Protocol', pages: '11.28 – 11.33', status: 'Ready' },
  { id: 'cn_9', num: '09', title: 'OSI and TCP/IP Protocol Stack', pages: '11.34 – 11.37', status: 'Ready' }
];

let activeLearnTopicId = null;

function initRevisionModule() {
  const container = document.getElementById('revision-content-area') || document.getElementById('revision-main-content');
  if (!container) return;

  if (activeLearnTopicId) {
    renderLearnTopicViewer(container, activeLearnTopicId);
  } else {
    renderLearnTopicList(container);
  }
}

function renderLearnTopicList(container) {
  container.innerHTML = `
    <!-- Top Header Banner -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:14px 18px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <h2 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; color:#F5F5F5; margin-bottom:2px;">Learn Center</h2>
        <p style="color:#9CA3AF; font-size:12px;">Computer Networks (CN) Core Concepts & Study Modules.</p>
      </div>
      <div style="display:flex; gap:8px;">
        <span style="font-size:11px; background:rgba(59,130,246,0.15); color:#3B82F6; border:1px solid #3B82F6; padding:2px 10px; border-radius:12px; font-weight:700;">Computer Networks</span>
        <span style="font-size:11px; background:rgba(16,185,129,0.15); color:#10B981; border:1px solid #10B981; padding:2px 10px; border-radius:12px; font-weight:700;">9 Modules</span>
      </div>
    </div>

    <!-- Topics Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:10px;">
      ${LEARN_CN_TOPICS.map(t => `
        <div class="card" style="padding:12px 14px; margin-bottom:0; cursor:pointer; display:flex; justify-content:space-between; align-items:center;" onclick="openLearnTopic('${t.id}')">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:32px; height:32px; border-radius:6px; background:rgba(59,130,246,0.12); color:#3B82F6; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">
              ${t.num}
            </div>
            <div>
              <div style="font-size:13px; font-weight:700; color:#F5F5F5;">${t.title}</div>
              <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">Pages ${t.pages}</div>
            </div>
          </div>
          <button class="btn-primary" style="font-size:11px; padding:4px 10px; height:28px;" onclick="event.stopPropagation(); openLearnTopic('${t.id}')">Open ➔</button>
        </div>
      `).join('')}
    </div>
  `;
}

function openLearnTopic(topicId) {
  activeLearnTopicId = topicId;
  initRevisionModule();
}

function closeLearnTopicViewer() {
  activeLearnTopicId = null;
  initRevisionModule();
}

function renderLearnTopicViewer(container, topicId) {
  const topic = LEARN_CN_TOPICS.find(t => t.id === topicId) || LEARN_CN_TOPICS[0];

  container.innerHTML = `
    <!-- Top Action Bar -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:12px 16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
      <button class="btn-secondary" style="font-size:12px; padding:4px 12px; height:30px;" onclick="closeLearnTopicViewer()">← Back to Modules</button>
      <span style="font-size:12px; color:#9CA3AF; font-weight:600;">Module ${topic.num} of 09 &bull; Pages ${topic.pages}</span>
    </div>

    <!-- Article Reader Card -->
    <div class="card" style="padding:20px;">
      <div style="border-bottom:1px solid #23262D; padding-bottom:12px; margin-bottom:16px;">
        <span style="font-size:11px; font-weight:700; color:#3B82F6; text-transform:uppercase;">Computer Networks &bull; Unit ${topic.num}</span>
        <h1 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; color:#F5F5F5; margin-top:4px;">${topic.title}</h1>
        <div style="font-size:12px; color:#9CA3AF; margin-top:4px;">Reference Range: Pages ${topic.pages}</div>
      </div>

      <!-- Placeholder content container ready for user notes/text -->
      <div id="learn-topic-content-body" style="min-height:240px; background:#0A0B0E; border:1px solid #23262D; border-radius:8px; padding:24px; text-align:center;">
        <div style="width:44px; height:44px; border-radius:50%; background:rgba(59,130,246,0.12); color:#3B82F6; display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
        </div>
        <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#F5F5F5; margin-bottom:4px;">Module Workspace Ready</h3>
        <p style="color:#9CA3AF; max-width:440px; margin:0 auto; font-size:12px; line-height:1.5;">
          This study module is ready to receive your custom notes, formulas, diagrams, and explanations for <strong>${topic.title}</strong>.
        </p>
      </div>
    </div>
  `;
}

window.initRevisionModule = initRevisionModule;
window.openLearnTopic = openLearnTopic;
window.closeLearnTopicViewer = closeLearnTopicViewer;

document.addEventListener('DOMContentLoaded', () => {
  initRevisionModule();
});
