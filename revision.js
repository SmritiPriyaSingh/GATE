// Learn Center Module - Computer Networks (CN) Study Modules

const CN_TOPIC_CONTENTS = {
  'cn_1': `
    <div style="font-family: inherit; line-height: 1.6; color: #D1D5DB; font-size: 13px;">
      
      <!-- Section 1.1 -->
      <div style="margin-bottom: 20px; background: rgba(255,255,255,0.02); border: 1px solid #23262D; border-radius: 8px; padding: 14px 16px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin-bottom: 8px;">1.1 IP Addressing</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; font-family: monospace; font-size: 12px;">
          <div style="background:#0F1115; border:1px solid #23262D; padding:6px 10px; border-radius:6px;"><strong>Class A:</strong> 0 &rarr; (1 &ndash; 126)<br><span style="color:#10B981;">No. of IP Addresses = 2<sup>31</sup></span></div>
          <div style="background:#0F1115; border:1px solid #23262D; padding:6px 10px; border-radius:6px;"><strong>Class B:</strong> 10 &rarr; (128 &ndash; 191)<br><span style="color:#10B981;">No. of IP Addresses = 2<sup>30</sup></span></div>
          <div style="background:#0F1115; border:1px solid #23262D; padding:6px 10px; border-radius:6px;"><strong>Class C:</strong> 110 &rarr; (192 &ndash; 223)<br><span style="color:#10B981;">No. of IP Addresses = 2<sup>29</sup></span></div>
          <div style="background:#0F1115; border:1px solid #23262D; padding:6px 10px; border-radius:6px;"><strong>Class D:</strong> 1110 &rarr; (224 &ndash; 239)<br><span style="color:#10B981;">No. of IP Addresses = 2<sup>28</sup></span></div>
          <div style="background:#0F1115; border:1px solid #23262D; padding:6px 10px; border-radius:6px;"><strong>Class E:</strong> 1111 &rarr; (240 &ndash; 255)<br><span style="color:#10B981;">No. of IP Addresses = 2<sup>28</sup></span></div>
        </div>
      </div>

      <!-- Section 1.2 & 1.3 Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
        <div style="background: rgba(255,255,255,0.02); border: 1px solid #23262D; border-radius: 8px; padding: 14px 16px;">
          <h3 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin-bottom: 8px;">1.2 Default Subnet Mask</h3>
          <ul style="margin: 0; padding-left: 18px; font-family: monospace; font-size: 12px; color: #F5F5F5;">
            <li><strong>Class A:</strong> 255.0.0.0</li>
            <li><strong>Class B:</strong> 255.255.0.0</li>
            <li><strong>Class C:</strong> 255.255.255.0</li>
          </ul>
        </div>

        <div style="background: rgba(255,255,255,0.02); border: 1px solid #23262D; border-radius: 8px; padding: 14px 16px;">
          <h3 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin-bottom: 8px;">1.3 Private Addresses Range</h3>
          <ul style="margin: 0; padding-left: 18px; font-size: 12px;">
            <li><code style="color:#3B82F6;">10.0.0.0</code> to <code style="color:#3B82F6;">10.255.255.255</code> &rarr; 1 Class A Network</li>
            <li><code style="color:#3B82F6;">172.16.0.0</code> to <code style="color:#3B82F6;">172.31.255.255</code> &rarr; 16 Class B Networks</li>
            <li><code style="color:#3B82F6;">192.168.0.0</code> to <code style="color:#3B82F6;">192.168.255.255</code> &rarr; 256 Class C Networks</li>
          </ul>
        </div>
      </div>

      <!-- Class Table -->
      <div style="margin-bottom: 20px; overflow-x: auto;">
        <table style="width:100%; border-collapse:collapse; font-size:12px; border:1px solid #23262D; background:#0F1115; text-align:left;">
          <thead>
            <tr style="background:#161920; border-bottom:1px solid #23262D; color:#F5F5F5;">
              <th style="padding:8px 12px;">Class</th>
              <th style="padding:8px 12px;">Number of Networks</th>
              <th style="padding:8px 12px;">Number of Hosts per Network</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #23262D;">
              <td style="padding:8px 12px; font-weight:700; color:#3B82F6;">Class A</td>
              <td style="padding:8px 12px;">2<sup>7</sup> &ndash; 2 = 126</td>
              <td style="padding:8px 12px;">2<sup>24</sup> &ndash; 2 = 1,67,77,214 hosts</td>
            </tr>
            <tr style="border-bottom:1px solid #23262D;">
              <td style="padding:8px 12px; font-weight:700; color:#3B82F6;">Class B</td>
              <td style="padding:8px 12px;">2<sup>14</sup> = 16,384</td>
              <td style="padding:8px 12px;">2<sup>16</sup> &ndash; 2 = 65,534 hosts</td>
            </tr>
            <tr style="border-bottom:1px solid #23262D;">
              <td style="padding:8px 12px; font-weight:700; color:#3B82F6;">Class C</td>
              <td style="padding:8px 12px;">2<sup>21</sup> = 20,97,152</td>
              <td style="padding:8px 12px;">2<sup>8</sup> &ndash; 2 = 254 hosts</td>
            </tr>
            <tr style="border-bottom:1px solid #23262D;">
              <td style="padding:8px 12px; font-weight:700; color:#3B82F6;">Class D</td>
              <td style="padding:8px 12px;" colspan="2">No NID and HID, all 28 remaining bits define multicast address</td>
            </tr>
            <tr>
              <td style="padding:8px 12px; font-weight:700; color:#3B82F6;">Class E</td>
              <td style="padding:8px 12px;" colspan="2">No NID and HID, reserved for research and future purpose</td>
            </tr>
          </tbody>
        </table>
        <div style="font-size:11px; color:#9CA3AF; margin-top:6px; font-style:italic;">
          Note: The IP address <code style="color:#10B981;">127.x.y.z</code> is known as loopback address and is used to check local connectivity.
        </div>
      </div>

      <!-- Section 1.4 - 1.7 Communication Types -->
      <div style="margin-bottom: 20px; background: rgba(255,255,255,0.02); border: 1px solid #23262D; border-radius: 8px; padding: 14px 16px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin-bottom: 8px;">1.4 – 1.7 Types of Communication</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin-bottom:12px;">
          <div style="background:#0F1115; border:1px solid #23262D; padding:10px; border-radius:6px;">
            <strong style="color:#F5F5F5;">(i) Unicast Communication (1 : 1)</strong>
            <p style="font-size:11px; color:#9CA3AF; margin-top:4px; margin-bottom:0;">Transmitting data from one computer to another computer. Source and destination can be in the same or different network.</p>
          </div>
          <div style="background:#0F1115; border:1px solid #23262D; padding:10px; border-radius:6px;">
            <strong style="color:#F5F5F5;">(ii) Broadcast Communication (1 : All)</strong>
            <p style="font-size:11px; color:#9CA3AF; margin-top:4px; margin-bottom:0;">
              &bull; <strong>Limited Broadcast:</strong> Same network. Destination IP = <code style="color:#10B981;">255.255.255.255</code>.<br>
              &bull; <strong>Direct Broadcast:</strong> Different network. Used strictly as destination IP.
            </p>
          </div>
          <div style="background:#0F1115; border:1px solid #23262D; padding:10px; border-radius:6px;">
            <strong style="color:#F5F5F5;">(iii) Multicast Communication (1 : Many)</strong>
            <p style="font-size:11px; color:#9CA3AF; margin-top:4px; margin-bottom:0;">Transmitting a packet from one computer to many selected computers (0 or more).</p>
          </div>
        </div>

        <!-- NID / HID Summary Table -->
        <table style="width:100%; border-collapse:collapse; font-size:11px; border:1px solid #23262D; background:#0F1115;">
          <thead>
            <tr style="background:#161920; color:#F5F5F5; border-bottom:1px solid #23262D;">
              <th style="padding:6px 10px;">NID</th>
              <th style="padding:6px 10px;">HID</th>
              <th style="padding:6px 10px;">Type / Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #23262D;"><td style="padding:5px 10px;">&ndash;</td><td style="padding:5px 10px;">All 0's</td><td style="padding:5px 10px; color:#3B82F6;">Network ID</td></tr>
            <tr style="border-bottom:1px solid #23262D;"><td style="padding:5px 10px;">&ndash;</td><td style="padding:5px 10px;">All 1's</td><td style="padding:5px 10px; color:#10B981;">Direct Broadcast Address (DBA)</td></tr>
            <tr style="border-bottom:1px solid #23262D;"><td style="padding:5px 10px;">All 1's</td><td style="padding:5px 10px;">All 1's</td><td style="padding:5px 10px; color:#F59E0B;">Limited Broadcast Address (LBA)</td></tr>
            <tr style="border-bottom:1px solid #23262D;"><td style="padding:5px 10px;">0's</td><td style="padding:5px 10px;">&ndash;</td><td style="padding:5px 10px;">Host within the Network</td></tr>
            <tr><td style="padding:5px 10px;">All 1's</td><td style="padding:5px 10px;">All 0's</td><td style="padding:5px 10px;">Network Mask / Subnet Mask</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Section 1.8 CIDR Rules -->
      <div style="margin-bottom: 20px; background: rgba(255,255,255,0.02); border: 1px solid #23262D; border-radius: 8px; padding: 14px 16px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin-bottom: 8px;">1.8 CIDR Rules</h3>
        <ol style="margin: 0; padding-left: 18px; font-size: 12px; color: #F5F5F5;">
          <li>All the IP Addresses in the Block must be contiguous.</li>
          <li>Block size must be a power of 2 (2<sup>N</sup>).</li>
          <li>First IP address of the block must be divisible by the size of the block.</li>
        </ol>
      </div>

      <!-- Section 1.9 - 1.11 Supernetting -->
      <div style="background: rgba(255,255,255,0.02); border: 1px solid #23262D; border-radius: 8px; padding: 14px 16px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin-bottom: 8px;">1.9 – 1.11 Supernetting & Rules</h3>
        <p style="font-size:12px; margin-bottom:10px;"><strong>Supernetting Definition:</strong> The process of combining two or more networks to get a single network.</p>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <div style="background:#0F1115; border:1px solid #23262D; padding:10px 12px; border-radius:6px;">
            <strong style="color:#10B981; font-size:12px;">Advantages of Supernetting:</strong>
            <ul style="margin:6px 0 0 0; padding-left:16px; font-size:11px; color:#9CA3AF;">
              <li>Reduces routing table entries.</li>
              <li>Router takes less time for packet processing.</li>
              <li>Improves flexibility of IP address allotment (e.g. combine two Class C networks for 500 addresses).</li>
            </ul>
          </div>

          <div style="background:#0F1115; border:1px solid #23262D; padding:10px 12px; border-radius:6px;">
            <strong style="color:#F59E0B; font-size:12px;">Rules of Supernetting:</strong>
            <ol style="margin:6px 0 0 0; padding-left:16px; font-size:11px; color:#9CA3AF;">
              <li>Network IDs must be contiguous.</li>
              <li>Size of networks must be identical and number of networks must be a power of 2.</li>
              <li>First Network ID must be divisible by the size of the supernet.</li>
            </ol>
          </div>
        </div>
      </div>

    </div>
  `,
  'cn_2': `
    <div style="font-family: inherit; line-height: 1.6; color: #D1D5DB; font-size: 13px;">
      
      <!-- Section 2.1 Overview & Notes -->
      <div style="margin-bottom: 20px; background: rgba(255,255,255,0.02); border: 1px solid #23262D; border-radius: 8px; padding: 14px 16px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin-bottom: 8px;">2.1 Error Control Fundamentals</h3>
        
        <div style="background:#0F1115; border:1px solid #23262D; border-radius:6px; padding:10px 12px; margin-bottom:12px;">
          <strong style="color:#F59E0B; font-size:12px;">Key Formula & Concepts:</strong>
          <ul style="margin:6px 0 0 0; padding-left:16px; font-size:12px; color:#F5F5F5;">
            <li><strong>Corrupted / Affected Bits Formula:</strong> <code style="color:#10B981;">Number of Corrupted Bits = Data Rate &times; Noise Duration</code></li>
            <li>Burst errors are far more likely to occur in real networks than single-bit errors.</li>
            <li>Error correction is mathematically and computationally more complex than simple error detection.</li>
          </ul>
        </div>

        <!-- Detection vs Correction Table -->
        <table style="width:100%; border-collapse:collapse; font-size:12px; border:1px solid #23262D; background:#0F1115; text-align:left;">
          <thead>
            <tr style="background:#161920; border-bottom:1px solid #23262D; color:#F5F5F5;">
              <th style="padding:8px 12px; width:50%;">Error Detection</th>
              <th style="padding:8px 12px; width:50%;">Error Correction</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #23262D;">
              <td style="padding:8px 12px;">1. Once an error is noticed, the corrupted packet is simply discarded.</td>
              <td style="padding:8px 12px;">1. Has the internal capability to find and correct corrupted bits automatically.</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;">2. Requires asking the sender for retransmission (e.g. ARQ).</td>
              <td style="padding:8px 12px;">2. Does not require retransmission.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Error Types & Techniques Summary Grid -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-bottom:20px;">
        <div style="background: rgba(255,255,255,0.02); border: 1px solid #23262D; border-radius: 8px; padding: 14px 16px;">
          <h3 style="font-family:'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #3B82F6; margin-bottom: 8px;">Error Control Schemes</h3>
          <div style="font-size:12px; color:#F5F5F5;">
            <strong style="color:#10B981; display:block; margin-bottom:4px;">Error Detection Schemes:</strong>
            <ol style="margin:0 0 10px 0; padding-left:16px; color:#9CA3AF;">
              <li>Simple Parity</li>
              <li>2D Parity</li>
              <li>Checksum</li>
              <li>CRC (Cyclic Redundancy Check)</li>
            </ol>
            <strong style="color:#3B82F6; display:block; margin-bottom:4px;">Error Correction Scheme:</strong>
            <ol style="margin:0; padding-left:16px; color:#9CA3AF;">
              <li>Hamming Code</li>
            </ol>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.02); border: 1px solid #23262D; border-radius: 8px; padding: 14px 16px;">
          <h3 style="font-family:'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #3B82F6; margin-bottom: 8px;">Types of Errors</h3>
          <div style="font-size:12px; color:#9CA3AF;">
            <p style="margin-bottom:8px;"><strong style="color:#F5F5F5;">1. Single-Bit Error:</strong> Only 1 bit in a given data unit is altered from 1 to 0 or 0 to 1.</p>
            <p style="margin-bottom:0;"><strong style="color:#F5F5F5;">2. Burst Error:</strong> 2 or more bits in the data unit are changed. Measured from the first corrupted bit to the last corrupted bit.</p>
          </div>
        </div>
      </div>

      <!-- Section 2.1.1 - 2.1.4 Hamming Distance & Minimum Distance -->
      <div style="margin-bottom: 20px; background: rgba(255,255,255,0.02); border: 1px solid #23262D; border-radius: 8px; padding: 14px 16px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin-bottom: 8px;">2.1.1 – 2.1.4 Hamming Distance & Minimum Distance</h3>
        
        <p style="font-size:12px; margin-bottom:8px;">
          <strong>Hamming Distance d(x, y):</strong> The number of corresponding bit positions in which two equal-length binary strings differ.
        </p>

        <div style="background:#0F1115; border:1px solid #23262D; padding:8px 12px; border-radius:6px; font-family:monospace; font-size:12px; margin-bottom:12px;">
          d(000, 011) = 2 &nbsp;|&nbsp; d(100, 011) = 3 &nbsp;|&nbsp; d(10101, 11110) = 3<br>
          <span style="color:#10B981; font-size:11px;">Shortcut: Apply XOR operation (&oplus;) on the two words and count the number of 1's in the result!</span>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <div style="background:#0F1115; border:1px solid #23262D; padding:10px 12px; border-radius:6px;">
            <strong style="color:#10B981; font-size:12px;">For Error Detection:</strong>
            <p style="font-size:12px; color:#F5F5F5; margin-top:4px; margin-bottom:0;">
              To detect <strong>d-bit</strong> errors, required minimum Hamming distance:<br>
              <code style="color:#10B981; font-size:14px; font-weight:700;">d<sub>min</sub> = d + 1</code>
            </p>
          </div>

          <div style="background:#0F1115; border:1px solid #23262D; padding:10px 12px; border-radius:6px;">
            <strong style="color:#3B82F6; font-size:12px;">For Error Correction:</strong>
            <p style="font-size:12px; color:#F5F5F5; margin-top:4px; margin-bottom:0;">
              To correct <strong>d-bit</strong> errors, required minimum Hamming distance:<br>
              <code style="color:#3B82F6; font-size:14px; font-weight:700;">d<sub>min</sub> = 2d + 1</code>
            </p>
          </div>
        </div>
      </div>

      <!-- Section 2.2 & 2.3 Parity Schemes -->
      <div style="margin-bottom: 20px; background: rgba(255,255,255,0.02); border: 1px solid #23262D; border-radius: 8px; padding: 14px 16px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin-bottom: 8px;">2.2 Simple Parity & 2.3 2D Parity Check</h3>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <div style="background:#0F1115; border:1px solid #23262D; padding:10px; border-radius:6px;">
            <strong style="color:#F5F5F5; font-size:12px;">Simple Parity Check:</strong>
            <ul style="margin:4px 0 0 0; padding-left:16px; font-size:11px; color:#9CA3AF;">
              <li>Adds 1 extra parity bit to each dataword.</li>
              <li>Can detect all single-bit errors.</li>
              <li>Can detect any <strong>odd number</strong> of errors.</li>
              <li><strong style="color:#EF4444;">CANNOT</strong> detect an even number of errors.</li>
            </ul>
          </div>

          <div style="background:#0F1115; border:1px solid #23262D; padding:10px; border-radius:6px;">
            <strong style="color:#F5F5F5; font-size:12px;">2D Parity Check Code:</strong>
            <ul style="margin:4px 0 0 0; padding-left:16px; font-size:11px; color:#9CA3AF;">
              <li>Organizes data bits into a matrix of rows & columns; parity calculated for each row & column.</li>
              <li>Detects & corrects all <strong>single-bit errors</strong>.</li>
              <li>Detects 2 or 3 bit errors anywhere in matrix.</li>
              <li>Detects only specific 4+ bit error patterns.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Section 2.4 CRC -->
      <div style="background: rgba(255,255,255,0.02); border: 1px solid #23262D; border-radius: 8px; padding: 14px 16px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin-bottom: 8px;">2.4 Cyclic Redundancy Check (CRC)</h3>
        
        <div style="font-size:12px; color:#F5F5F5;">
          <div style="display:flex; gap:16px; margin-bottom:10px; font-family:monospace;">
            <span>Dataword length = <strong>n</strong></span>
            <span>Divisor length = <strong>k</strong></span>
            <span>Appended Zeros = <strong style="color:#10B981;">(k &ndash; 1)</strong></span>
          </div>

          <ol style="margin:0; padding-left:18px; color:#9CA3AF;">
            <li>Append <code style="color:#10B981;">(k &ndash; 1)</code> zeros to the original dataword message.</li>
            <li>Perform <strong>Modulo-2 Binary Division</strong> (XOR division) using generator polynomial.</li>
            <li>Remainder of the division = <strong>CRC Bits</strong>.</li>
            <li>Transmitted Codeword = Original Dataword + CRC Bits.</li>
          </ol>
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
let activeLearnTab = 'queue'; // 'queue' or 'modules'
let activeSubjectFilter = 'ALL';

function initRevisionModule() {
  const container = document.getElementById('revision-content-area') || document.getElementById('revision-main-content');
  if (!container) return;

  if (activeLearnTopicId) {
    renderLearnTopicViewer(container, activeLearnTopicId);
  } else {
    renderLearnMainView(container);
  }
}

function switchLearnTab(tabName) {
  activeLearnTab = tabName;
  initRevisionModule();
}

function filterBySubject(subj) {
  activeSubjectFilter = subj;
  initRevisionModule();
}

function renderLearnMainView(container) {
  const bookmarkIds = StorageManager.getBookmarks();
  const notes = StorageManager.getAllTopicNotes() || {};
  const allQs = window.allPracticeQuestions || [];

  container.innerHTML = `
    <!-- 1. Primary Action Hero (5-Second Clarity) -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px 20px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <div style="font-size:11px; font-weight:700; color:#3B82F6; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:2px;">Today's Revision</div>
        <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; color:#F5F5F5; margin:0;">18 Questions Due</h2>
        <div style="font-size:12px; color:#9CA3AF; margin-top:3px;">Estimated Time: <strong style="color:#F5F5F5;">32 min</strong></div>
      </div>
      <button class="btn-primary" style="font-size:13px; padding:8px 22px; height:38px; font-weight:700;" onclick="navigateToView('practice')">Start Revision ➔</button>
    </div>

    <!-- 2. Clean Navigation & Subject Filter Pills -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
      <!-- Tab Toggle -->
      <div style="display:flex; gap:6px;">
        <button style="background:${activeLearnTab === 'queue' ? '#3B82F6' : '#0F1115'}; border:1px solid ${activeLearnTab === 'queue' ? '#3B82F6' : '#23262D'}; color:${activeLearnTab === 'queue' ? '#FFF' : '#9CA3AF'}; font-size:12px; font-weight:700; padding:6px 14px; border-radius:6px; cursor:pointer;" onclick="switchLearnTab('queue')">Revision Queue (${bookmarkIds.length})</button>
        <button style="background:${activeLearnTab === 'modules' ? '#3B82F6' : '#0F1115'}; border:1px solid ${activeLearnTab === 'modules' ? '#3B82F6' : '#23262D'}; color:${activeLearnTab === 'modules' ? '#FFF' : '#9CA3AF'}; font-size:12px; font-weight:700; padding:6px 14px; border-radius:6px; cursor:pointer;" onclick="switchLearnTab('modules')">CN Study Modules (${LEARN_CN_TOPICS.length})</button>
      </div>

      <!-- Subject Filter Chips (By Subject) -->
      <div style="display:flex; gap:6px; align-items:center;">
        <span style="font-size:11px; color:#9CA3AF;">By Subject:</span>
        <button style="background:${activeSubjectFilter === 'ALL' ? 'rgba(59,130,246,0.15)' : '#0F1115'}; border:1px solid ${activeSubjectFilter === 'ALL' ? '#3B82F6' : '#23262D'}; color:${activeSubjectFilter === 'ALL' ? '#3B82F6' : '#9CA3AF'}; font-size:11px; font-weight:700; padding:3px 8px; border-radius:4px; cursor:pointer;" onclick="filterBySubject('ALL')">All</button>
        <button style="background:${activeSubjectFilter === 'CN' ? 'rgba(59,130,246,0.15)' : '#0F1115'}; border:1px solid ${activeSubjectFilter === 'CN' ? '#3B82F6' : '#23262D'}; color:${activeSubjectFilter === 'CN' ? '#3B82F6' : '#9CA3AF'}; font-size:11px; font-weight:700; padding:3px 8px; border-radius:4px; cursor:pointer;" onclick="filterBySubject('CN')">CN (12)</button>
        <button style="background:${activeSubjectFilter === 'OS' ? 'rgba(59,130,246,0.15)' : '#0F1115'}; border:1px solid ${activeSubjectFilter === 'OS' ? '#3B82F6' : '#23262D'}; color:${activeSubjectFilter === 'OS' ? '#3B82F6' : '#9CA3AF'}; font-size:11px; font-weight:700; padding:3px 8px; border-radius:4px; cursor:pointer;" onclick="filterBySubject('OS')">OS (9)</button>
        <button style="background:${activeSubjectFilter === 'DBMS' ? 'rgba(59,130,246,0.15)' : '#0F1115'}; border:1px solid ${activeSubjectFilter === 'DBMS' ? '#3B82F6' : '#23262D'}; color:${activeSubjectFilter === 'DBMS' ? '#3B82F6' : '#9CA3AF'}; font-size:11px; font-weight:700; padding:3px 8px; border-radius:4px; cursor:pointer;" onclick="filterBySubject('DBMS')">DBMS (15)</button>
        <button style="background:${activeSubjectFilter === 'COA' ? 'rgba(59,130,246,0.15)' : '#0F1115'}; border:1px solid ${activeSubjectFilter === 'COA' ? '#3B82F6' : '#23262D'}; color:${activeSubjectFilter === 'COA' ? '#3B82F6' : '#9CA3AF'}; font-size:11px; font-weight:700; padding:3px 8px; border-radius:4px; cursor:pointer;" onclick="filterBySubject('COA')">COA (8)</button>
      </div>
    </div>

    <!-- 3. TAB 1: REVISION QUEUE -->
    ${activeLearnTab === 'queue' ? `
      <!-- Due Today Section (18) -->
      <div style="margin-bottom:16px;">
        <div style="font-size:13px; font-weight:700; color:#F5F5F5; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
          <span>Due Today (18)</span>
          <span style="font-size:11px; color:#3B82F6;">18 Pending</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          ${bookmarkIds.length > 0 ? bookmarkIds.slice(0, 3).map((bId, idx) => {
            const qMatch = allQs.find(q => q.id === bId);
            const title = (qMatch && qMatch.question) ? qMatch.question.split('.')[0] : 'IP Addressing, Subnetting & Supernetting';
            const subCode = (qMatch && qMatch.subjectCode) ? qMatch.subjectCode.toUpperCase() : 'CN';
            const diff = (qMatch && qMatch.difficulty) ? qMatch.difficulty : (idx % 2 === 0 ? 'Hard' : 'Medium');
            const noteText = notes[bId] || notes[subCode] || 'Remember subnet masks and block size calculation rules.';

            return `
              <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="navigateToView('practice')">
                <div style="flex:1; padding-right:12px;">
                  <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                    <span style="font-size:13px; font-weight:700; color:#F5F5F5;">${title}</span>
                    <span style="font-size:10px; font-weight:700; color:#3B82F6; background:rgba(59,130,246,0.12); padding:1px 6px; border-radius:4px;">${subCode}</span>
                    <span style="font-size:10px; font-weight:700; color:${diff === 'Hard' ? '#EF4444' : '#F59E0B'}; background:rgba(239,68,68,0.1); padding:1px 6px; border-radius:4px;">${diff}</span>
                  </div>
                  <div style="font-size:11px; color:#9CA3AF; font-style:italic; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:480px;">"${noteText}"</div>
                  <div style="font-size:10px; color:#9CA3AF; margin-top:4px;">Last Reviewed: 3 days ago</div>
                </div>
                <button class="btn-primary" style="font-size:11px; padding:4px 12px; height:28px; font-weight:700;" onclick="event.stopPropagation(); navigateToView('practice')">Open ➔</button>
              </div>
            `;
          }).join('') : `
            <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:24px; text-align:center; color:#9CA3AF; font-size:12px;">
              No questions due today. You are completely caught up!
            </div>
          `}
        </div>
      </div>

      <!-- Review Later Section (32) -->
      <div>
        <div style="font-size:13px; font-weight:700; color:#F5F5F5; margin-bottom:8px;">Review Later (32)</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="navigateToView('practice')">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:12px; font-weight:700; color:#F5F5F5;">Banker's Algorithm & Deadlock Avoidance</span>
                <span style="font-size:10px; font-weight:700; color:#3B82F6; background:rgba(59,130,246,0.12); padding:1px 6px; border-radius:4px;">OS</span>
                <span style="font-size:10px; font-weight:700; color:#F59E0B; background:rgba(245,158,11,0.1); padding:1px 6px; border-radius:4px;">Medium</span>
              </div>
              <div style="font-size:10px; color:#9CA3AF; margin-top:2px;">Scheduled for tomorrow</div>
            </div>
            <button class="btn-secondary" style="font-size:11px; padding:4px 10px; height:26px;" onclick="event.stopPropagation(); navigateToView('practice')">Review ➔</button>
          </div>
          <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="navigateToView('practice')">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:12px; font-weight:700; color:#F5F5F5;">B+ Tree Node Splitting & Index Height</span>
                <span style="font-size:10px; font-weight:700; color:#3B82F6; background:rgba(59,130,246,0.12); padding:1px 6px; border-radius:4px;">DBMS</span>
                <span style="font-size:10px; font-weight:700; color:#10B981; background:rgba(16,185,129,0.1); padding:1px 6px; border-radius:4px;">Easy</span>
              </div>
              <div style="font-size:10px; color:#9CA3AF; margin-top:2px;">Scheduled in 2 days</div>
            </div>
            <button class="btn-secondary" style="font-size:11px; padding:4px 10px; height:26px;" onclick="event.stopPropagation(); navigateToView('practice')">Review ➔</button>
          </div>
        </div>
      </div>
    ` : `
      <!-- TAB 2: CN STUDY MODULES -->
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
    `}
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
window.switchLearnTab = switchLearnTab;
window.filterBySubject = filterBySubject;

document.addEventListener('DOMContentLoaded', () => {
  initRevisionModule();
});
