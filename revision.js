// Learn Center Module - Computer Networks (CN) Study Modules

const CN_TOPIC_CONTENTS = {
  'cn_1': `
    <div style="font-family:'Inter', system-ui, sans-serif; color: #E5E7EB; font-size: 13px; line-height: 1.6; max-width: 860px; margin: 0 auto;">

      <!-- 1.1 IP Addressing & Classes -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; border-bottom: 1px solid #23262D; padding-bottom: 6px; margin-bottom: 12px;">
          1.1 &bull; IP Addressing Classes
        </h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px; margin-bottom: 14px;">
          <div style="background:#0F1115; border-left: 3px solid #3B82F6; padding: 10px 12px; border-radius: 4px;">
            <div style="font-weight:700; color:#F5F5F5;">Class A</div>
            <div style="font-size:12px; color:#9CA3AF;">Prefix: <code style="color:#3B82F6;">0</code> &bull; Range: <code>1 &ndash; 126</code></div>
            <div style="font-size:11px; color:#10B981; margin-top:2px;">Total IPs = 2<sup>31</sup></div>
          </div>

          <div style="background:#0F1115; border-left: 3px solid #3B82F6; padding: 10px 12px; border-radius: 4px;">
            <div style="font-weight:700; color:#F5F5F5;">Class B</div>
            <div style="font-size:12px; color:#9CA3AF;">Prefix: <code style="color:#3B82F6;">10</code> &bull; Range: <code>128 &ndash; 191</code></div>
            <div style="font-size:11px; color:#10B981; margin-top:2px;">Total IPs = 2<sup>30</sup></div>
          </div>

          <div style="background:#0F1115; border-left: 3px solid #3B82F6; padding: 10px 12px; border-radius: 4px;">
            <div style="font-weight:700; color:#F5F5F5;">Class C</div>
            <div style="font-size:12px; color:#9CA3AF;">Prefix: <code style="color:#3B82F6;">110</code> &bull; Range: <code>192 &ndash; 223</code></div>
            <div style="font-size:11px; color:#10B981; margin-top:2px;">Total IPs = 2<sup>29</sup></div>
          </div>

          <div style="background:#0F1115; border-left: 3px solid #8B5CF6; padding: 10px 12px; border-radius: 4px;">
            <div style="font-weight:700; color:#F5F5F5;">Class D (Multicast)</div>
            <div style="font-size:12px; color:#9CA3AF;">Prefix: <code style="color:#8B5CF6;">1110</code> &bull; Range: <code>224 &ndash; 239</code></div>
            <div style="font-size:11px; color:#10B981; margin-top:2px;">Total IPs = 2<sup>28</sup></div>
          </div>

          <div style="background:#0F1115; border-left: 3px solid #F59E0B; padding: 10px 12px; border-radius: 4px;">
            <div style="font-weight:700; color:#F5F5F5;">Class E (Experimental)</div>
            <div style="font-size:12px; color:#9CA3AF;">Prefix: <code style="color:#F59E0B;">1111</code> &bull; Range: <code>240 &ndash; 255</code></div>
            <div style="font-size:11px; color:#10B981; margin-top:2px;">Total IPs = 2<sup>28</sup></div>
          </div>
        </div>
      </div>

      <!-- 1.2 & 1.3 Subnet Masks & Private Ranges -->
      <div style="margin-bottom: 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        <div>
          <h2 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; border-bottom: 1px solid #23262D; padding-bottom: 4px; margin-bottom: 10px;">
            1.2 &bull; Default Subnet Masks
          </h2>
          <div style="background:#0F1115; padding:12px; border-radius:6px; font-family:monospace; font-size:12px;">
            <div style="margin-bottom:4px;">Class A &rarr; <span style="color:#10B981; font-weight:700;">255.0.0.0</span></div>
            <div style="margin-bottom:4px;">Class B &rarr; <span style="color:#10B981; font-weight:700;">255.255.0.0</span></div>
            <div>Class C &rarr; <span style="color:#10B981; font-weight:700;">255.255.255.0</span></div>
          </div>
        </div>

        <div>
          <h2 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; border-bottom: 1px solid #23262D; padding-bottom: 4px; margin-bottom: 10px;">
            1.3 &bull; Private Address Ranges
          </h2>
          <div style="background:#0F1115; padding:12px; border-radius:6px; font-size:12px;">
            <div style="margin-bottom:4px;"><code style="color:#3B82F6;">10.0.0.0 &ndash; 10.255.255.255</code> &bull; 1 Class A</div>
            <div style="margin-bottom:4px;"><code style="color:#3B82F6;">172.16.0.0 &ndash; 172.31.255.255</code> &bull; 16 Class B</div>
            <div><code style="color:#3B82F6;">192.168.0.0 &ndash; 192.168.255.255</code> &bull; 256 Class C</div>
          </div>
        </div>
      </div>

      <!-- Class Breakdown Table -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; border-bottom: 1px solid #23262D; padding-bottom: 4px; margin-bottom: 10px;">
          Network vs Host Capacity Breakdown
        </h2>
        
        <table style="width:100%; border-collapse:collapse; font-size:12px; background:#0F1115; border-radius:6px; overflow:hidden;">
          <thead>
            <tr style="background:#161920; color:#F5F5F5; border-bottom:1px solid #23262D; text-align:left;">
              <th style="padding:10px 14px;">Class</th>
              <th style="padding:10px 14px;">Number of Networks</th>
              <th style="padding:10px 14px;">Number of Hosts per Network</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #23262D;">
              <td style="padding:10px 14px; font-weight:700; color:#3B82F6;">Class A</td>
              <td style="padding:10px 14px;">2<sup>7</sup> &ndash; 2 = <strong>126</strong></td>
              <td style="padding:10px 14px;">2<sup>24</sup> &ndash; 2 = <strong>1,67,77,214 hosts</strong></td>
            </tr>
            <tr style="border-bottom:1px solid #23262D;">
              <td style="padding:10px 14px; font-weight:700; color:#3B82F6;">Class B</td>
              <td style="padding:10px 14px;">2<sup>14</sup> = <strong>16,384</strong></td>
              <td style="padding:10px 14px;">2<sup>16</sup> &ndash; 2 = <strong>65,534 hosts</strong></td>
            </tr>
            <tr style="border-bottom:1px solid #23262D;">
              <td style="padding:10px 14px; font-weight:700; color:#3B82F6;">Class C</td>
              <td style="padding:10px 14px;">2<sup>21</sup> = <strong>20,97,152</strong></td>
              <td style="padding:10px 14px;">2<sup>8</sup> &ndash; 2 = <strong>254 hosts</strong></td>
            </tr>
            <tr style="border-bottom:1px solid #23262D;">
              <td style="padding:10px 14px; font-weight:700; color:#3B82F6;">Class D</td>
              <td style="padding:10px 14px;" colspan="2" style="color:#9CA3AF;">No NID and HID. All 28 remaining bits define multicast address.</td>
            </tr>
            <tr>
              <td style="padding:10px 14px; font-weight:700; color:#3B82F6;">Class E</td>
              <td style="padding:10px 14px;" colspan="2" style="color:#9CA3AF;">No NID and HID. Reserved for research and future purposes.</td>
            </tr>
          </tbody>
        </table>

        <div style="background:rgba(59,130,246,0.08); border-left:3px solid #3B82F6; padding:8px 12px; margin-top:10px; border-radius:4px; font-size:12px; color:#D1D5DB;">
          <strong>Important Note:</strong> <code style="color:#10B981;">127.x.y.z</code> is reserved as the <strong>Loopback Address</strong> to check internal TCP/IP software stack connectivity.
        </div>
      </div>

      <!-- 1.4 – 1.7 Communication Modes -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; border-bottom: 1px solid #23262D; padding-bottom: 4px; margin-bottom: 10px;">
          1.4 – 1.7 &bull; Communication Modes & Bit Mapping
        </h2>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:10px; margin-bottom:14px;">
          <div style="background:#0F1115; padding:12px; border-radius:6px;">
            <div style="font-weight:700; color:#F5F5F5; margin-bottom:4px;">Unicast (1 : 1)</div>
            <p style="font-size:11.5px; color:#9CA3AF; margin:0;">Transmitting data from one computer directly to another. Source and destination can be in the same or different network.</p>
          </div>

          <div style="background:#0F1115; padding:12px; border-radius:6px;">
            <div style="font-weight:700; color:#F5F5F5; margin-bottom:4px;">Broadcast (1 : All)</div>
            <p style="font-size:11.5px; color:#9CA3AF; margin:0;">
              &bull; <strong>Limited Broadcast:</strong> Same network (<code style="color:#10B981;">255.255.255.255</code>).<br>
              &bull; <strong>Direct Broadcast:</strong> Target network (Host ID set to all 1's).
            </p>
          </div>

          <div style="background:#0F1115; padding:12px; border-radius:6px;">
            <div style="font-weight:700; color:#F5F5F5; margin-bottom:4px;">Multicast (1 : Many)</div>
            <p style="font-size:11.5px; color:#9CA3AF; margin:0;">Transmitting a packet to a specific group of zero or more subscribers simultaneously.</p>
          </div>
        </div>

        <!-- Bit rules summary -->
        <table style="width:100%; border-collapse:collapse; font-size:12px; background:#0F1115; border-radius:6px; overflow:hidden;">
          <thead>
            <tr style="background:#161920; color:#F5F5F5; border-bottom:1px solid #23262D; text-align:left;">
              <th style="padding:8px 12px;">Network ID (NID)</th>
              <th style="padding:8px 12px;">Host ID (HID)</th>
              <th style="padding:8px 12px;">Address Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #23262D;"><td style="padding:8px 12px;">Given Bits</td><td style="padding:8px 12px;">All 0's</td><td style="padding:8px 12px; color:#3B82F6; font-weight:700;">Network ID (NID)</td></tr>
            <tr style="border-bottom:1px solid #23262D;"><td style="padding:8px 12px;">Given Bits</td><td style="padding:8px 12px;">All 1's</td><td style="padding:8px 12px; color:#10B981; font-weight:700;">Direct Broadcast Address (DBA)</td></tr>
            <tr style="border-bottom:1px solid #23262D;"><td style="padding:8px 12px;">All 1's</td><td style="padding:8px 12px;">All 1's</td><td style="padding:8px 12px; color:#F59E0B; font-weight:700;">Limited Broadcast Address (LBA)</td></tr>
            <tr style="border-bottom:1px solid #23262D;"><td style="padding:8px 12px;">All 0's</td><td style="padding:8px 12px;">Given Bits</td><td style="padding:8px 12px;">Specific Host within Network</td></tr>
            <tr><td style="padding:8px 12px;">All 1's</td><td style="padding:8px 12px;">All 0's</td><td style="padding:8px 12px;">Network Mask / Subnet Mask</td></tr>
          </tbody>
        </table>
      </div>

      <!-- 1.8 CIDR Rules -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; border-bottom: 1px solid #23262D; padding-bottom: 4px; margin-bottom: 10px;">
          1.8 &bull; CIDR Allocation Rules
        </h2>
        <div style="background:#0F1115; border-left: 3px solid #10B981; padding: 12px 14px; border-radius: 4px;">
          <ol style="margin: 0; padding-left: 18px; font-size: 12.5px; color: #F5F5F5; line-height: 1.7;">
            <li><strong>Contiguous Block:</strong> All IP addresses in the block must be continuous without gaps.</li>
            <li><strong>Power of 2:</strong> Block size must equal 2<sup>N</sup>.</li>
            <li><strong>Divisibility Rule:</strong> The first IP address of the block must be exactly divisible by the block size.</li>
          </ol>
        </div>
      </div>

      <!-- 1.9 – 1.11 Supernetting -->
      <div>
        <h2 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; border-bottom: 1px solid #23262D; padding-bottom: 4px; margin-bottom: 10px;">
          1.9 – 1.11 &bull; Supernetting Concept & Rules
        </h2>
        
        <div style="margin-bottom: 12px; font-size: 12.5px;">
          <strong>Supernetting Definition:</strong> The process of combining two or more contiguous smaller networks into a single larger network.
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:14px;">
          <div style="background:#0F1115; padding:12px; border-radius:6px; border-top:2px solid #10B981;">
            <div style="font-weight:700; color:#10B981; margin-bottom:6px;">Advantages of Supernetting</div>
            <ul style="margin:0; padding-left:16px; font-size:11.5px; color:#D1D5DB; line-height:1.6;">
              <li>Reduces routing table size and memory entries.</li>
              <li>Routers process and forward packets significantly faster.</li>
              <li>Flexibility in IP allocation (e.g. combine 2 Class C networks for 500 addresses without buying Class B).</li>
            </ul>
          </div>

          <div style="background:#0F1115; padding:12px; border-radius:6px; border-top:2px solid #F59E0B;">
            <div style="font-weight:700; color:#F59E0B; margin-bottom:6px;">Rules of Supernetting</div>
            <ol style="margin:0; padding-left:16px; font-size:11.5px; color:#D1D5DB; line-height:1.6;">
              <li>Network IDs must be contiguous.</li>
              <li>All candidate networks must have identical sizes, and the count of networks must be a power of 2.</li>
              <li>First Network ID must be divisible by the total supernet block size.</li>
            </ol>
          </div>
        </div>
      </div>

    </div>
  `
};

const LEARN_CN_TOPICS = [
  { id: 'cn_1', num: '01', title: 'IP Addressing, Subnetting & Supernetting', status: 'Ready' },
  { id: 'cn_2', num: '02', title: 'Error Control', status: 'Ready' },
  { id: 'cn_3', num: '03', title: 'Flow Control', status: 'Ready' },
  { id: 'cn_4', num: '04', title: 'IPv4 Header', status: 'Ready' },
  { id: 'cn_5', num: '05', title: 'TCP & UDP', status: 'Ready' },
  { id: 'cn_6', num: '06', title: 'Medium Access Control [MAC]', status: 'Ready' },
  { id: 'cn_7', num: '07', title: 'Routing Algorithms, Switching & IP Support Protocol', status: 'Ready' },
  { id: 'cn_8', num: '08', title: 'Application Layer Protocol', status: 'Ready' },
  { id: 'cn_9', num: '09', title: 'OSI and TCP/IP Protocol Stack', status: 'Ready' }
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
              <div style="font-size:11px; color:${CN_TOPIC_CONTENTS[t.id] ? '#10B981' : '#9CA3AF'}; margin-top:2px;">
                ${CN_TOPIC_CONTENTS[t.id] ? 'Study Material Added' : 'Workspace Ready'}
              </div>
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
  const customHTML = CN_TOPIC_CONTENTS[topicId];

  container.innerHTML = `
    <!-- Top Action Bar -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:12px 16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
      <button class="btn-secondary" style="font-size:12px; padding:4px 12px; height:30px;" onclick="closeLearnTopicViewer()">← Back to Modules</button>
      <span style="font-size:12px; color:#9CA3AF; font-weight:600;">Module ${topic.num} of 09</span>
    </div>

    <!-- Article Reader Card -->
    <div class="card" style="padding:20px;">
      <div style="border-bottom:1px solid #23262D; padding-bottom:12px; margin-bottom:16px;">
        <span style="font-size:11px; font-weight:700; color:#3B82F6; text-transform:uppercase;">Computer Networks &bull; Unit ${topic.num}</span>
        <h1 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; color:#F5F5F5; margin-top:4px;">${topic.title}</h1>
      </div>

      <!-- Module Content Body -->
      ${customHTML ? customHTML : `
        <div id="learn-topic-content-body" style="min-height:240px; background:#0A0B0E; border:1px solid #23262D; border-radius:8px; padding:24px; text-align:center;">
          <div style="width:44px; height:44px; border-radius:50%; background:rgba(59,130,246,0.12); color:#3B82F6; display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
          </div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#F5F5F5; margin-bottom:4px;">Module Workspace Ready</h3>
          <p style="color:#9CA3AF; max-width:440px; margin:0 auto; font-size:12px; line-height:1.5;">
            This study module is ready to receive your custom notes, formulas, diagrams, and explanations for <strong>${topic.title}</strong>.
          </p>
        </div>
      `}
    </div>
  `;
}

window.initRevisionModule = initRevisionModule;
window.openLearnTopic = openLearnTopic;
window.closeLearnTopicViewer = closeLearnTopicViewer;

document.addEventListener('DOMContentLoaded', () => {
  initRevisionModule();
});
