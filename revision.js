// Learn Center Module - Computer Networks (CN) Study Modules

const CONCEPT_EXPLANATIONS = {
  'cidr': {
    title: '1.8 CIDR Allocation Rules & Solved GATE Example',
    html: `
      <div style="font-size:13px; line-height:1.6; color:#D1D5DB;">
        
        <div style="background:rgba(59,130,246,0.1); border-left:4px solid #3B82F6; padding:12px 14px; border-radius:4px; margin-bottom:14px;">
          <strong style="color:#3B82F6; font-size:14px;">In Plain English: What is CIDR?</strong>
          <p style="margin:4px 0 0 0; color:#F5F5F5;">
            Classless Inter-Domain Routing (CIDR) eliminates fixed Class A/B/C boundaries. Instead of buying a whole 16.7-million IP Class A network, an ISP sells you exact variable-size IP blocks written as <code>IP_Address / Prefix_Length</code> (e.g., <code>200.1.1.0 / 26</code>).
          </p>
        </div>

        <h4 style="font-family:'Outfit', sans-serif; font-size:14px; font-weight:700; color:#10B981; margin-bottom:8px;">The 3 Strict Rules Every CIDR Block Must Satisfy:</h4>
        
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
          <div style="background:#0F1115; border:1px solid #23262D; padding:10px 12px; border-radius:6px;">
            <strong style="color:#F5F5F5;">Rule 1: Contiguous IP Addresses</strong>
            <div style="color:#9CA3AF; font-size:12px; margin-top:2px;">All IP numbers in the block must form a continuous sequence without any missing numbers.</div>
          </div>
          <div style="background:#0F1115; border:1px solid #23262D; padding:10px 12px; border-radius:6px;">
            <strong style="color:#F5F5F5;">Rule 2: Block Size Must Be a Power of 2 (2<sup>N</sup>)</strong>
            <div style="color:#9CA3AF; font-size:12px; margin-top:2px;">Allowed block sizes are 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, etc. (You cannot have a block of 50 or 300 IPs!).</div>
          </div>
          <div style="background:#0F1115; border:1px solid #23262D; padding:10px 12px; border-radius:6px;">
            <strong style="color:#F5F5F5;">Rule 3: Divisibility Rule (Critical GATE Trick!)</strong>
            <div style="color:#9CA3AF; font-size:12px; margin-top:2px;">
              The numerical integer value of the <strong>First IP Address</strong> must be evenly divisible by the <strong>Block Size</strong>.<br>
              Formula: <code>(First_IP_Decimal_Value) % Block_Size == 0</code>
            </div>
          </div>
        </div>

        <!-- Solved GATE Problem -->
        <div style="background:#0F1115; border:1px solid #3B82F6; padding:14px; border-radius:8px;">
          <span style="font-size:10px; font-weight:700; color:#3B82F6; text-transform:uppercase;">Solved GATE Standard Problem</span>
          <h4 style="font-family:'Outfit', sans-serif; font-size:13px; font-weight:700; color:#F5F5F5; margin:4px 0 8px 0;">
            Question: An ISP grants a block of 64 IP addresses. Which of the following is a VALID first IP address for this block?
          </h4>
          <div style="font-size:12px; color:#9CA3AF; font-family:monospace; margin-bottom:8px;">
            A) 128.32.1.32 &nbsp;&bull;&nbsp; B) 128.32.1.64 &nbsp;&bull;&nbsp; C) 128.32.1.90 &nbsp;&bull;&nbsp; D) 128.32.1.100
          </div>
          <div style="background:rgba(16,185,129,0.1); border-left:3px solid #10B981; padding:8px 10px; border-radius:4px; font-size:12px;">
            <strong style="color:#10B981;">Correct Answer: Option B (128.32.1.64)</strong><br>
            <strong>Step 1:</strong> Check Block Size = 64 (Valid power of 2: 2<sup>6</sup>).<br>
            <strong>Step 2:</strong> Check Divisibility Rule on last octet:<br>
            &bull; Option A: 32 % 64 = 32 (Invalid)<br>
            &bull; Option B: 64 % 64 = 0 (<strong>Valid & Divisible!</strong>)<br>
            &bull; Option C: 90 % 64 = 26 (Invalid)<br>
            &bull; Option D: 100 % 64 = 36 (Invalid)
          </div>
        </div>

      </div>
    `
  },

  'supernetting': {
    title: '1.9 – 1.11 Supernetting Deep Dive & Rules',
    html: `
      <div style="font-size:13px; line-height:1.6; color:#D1D5DB;">
        
        <div style="background:rgba(245,158,11,0.1); border-left:4px solid #F59E0B; padding:12px 14px; border-radius:4px; margin-bottom:14px;">
          <strong style="color:#F59E0B; font-size:14px;">In Plain English: What is Supernetting?</strong>
          <p style="margin:4px 0 0 0; color:#F5F5F5;">
            Supernetting (CIDR Aggregation) is the reverse of subnetting. Instead of dividing 1 large network into smaller ones, we <strong>combine multiple small contiguous Class C networks into 1 large single network</strong> (e.g. combining two /24 networks into a /23 network).
          </p>
        </div>

        <h4 style="font-family:'Outfit', sans-serif; font-size:14px; font-weight:700; color:#3B82F6; margin-bottom:8px;">Why Routers Love Supernetting:</h4>
        <ul style="margin:0 0 14px 0; padding-left:18px; color:#F5F5F5;">
          <li><strong>Smaller Routing Tables:</strong> Routers only need 1 single routing table entry instead of 16 separate entries!</li>
          <li><strong>Faster Packet Lookup:</strong> Less memory search time per packet, speeding up global internet routing.</li>
        </ul>

        <h4 style="font-family:'Outfit', sans-serif; font-size:14px; font-weight:700; color:#10B981; margin-bottom:8px;">Supernetting Eligibility Rules:</h4>
        <ol style="margin:0 0 16px 0; padding-left:18px; color:#F5F5F5;">
          <li>All networks to be combined must be <strong>contiguous</strong> (adjacent).</li>
          <li>The number of networks MUST be a power of 2 (2, 4, 8, 16...).</li>
          <li>The 1st Network ID must be divisible by the total supernet size.</li>
        </ol>

        <!-- Solved GATE Problem -->
        <div style="background:#0F1115; border:1px solid #F59E0B; padding:14px; border-radius:8px;">
          <span style="font-size:10px; font-weight:700; color:#F59E0B; text-transform:uppercase;">Solved GATE Standard Problem</span>
          <h4 style="font-family:'Outfit', sans-serif; font-size:13px; font-weight:700; color:#F5F5F5; margin:4px 0 8px 0;">
            Question: Can we combine four Class C networks with Network IDs 200.10.0.0, 200.10.1.0, 200.10.2.0, 200.10.3.0 into a single supernet?
          </h4>
          <div style="background:rgba(16,185,129,0.1); border-left:3px solid #10B981; padding:8px 10px; border-radius:4px; font-size:12px;">
            <strong style="color:#10B981;">Yes, Absolutely!</strong><br>
            1. <strong>Count = 4</strong> (Valid power of 2: 2<sup>2</sup>).<br>
            2. <strong>Contiguous:</strong> 0, 1, 2, 3 are sequential.<br>
            3. <strong>First Net ID (200.10.0.0):</strong> 0 % 4 == 0 (Divisible!).<br>
            &bull; <strong>Resulting Supernet Mask:</strong> <code>255.255.252.0</code> (or <code>200.10.0.0 / 22</code>).
          </div>
        </div>

      </div>
    `
  },

  'ip_classes': {
    title: '1.1 IP Addressing Classes & Range Formulas',
    html: `
      <div style="font-size:13px; line-height:1.6; color:#D1D5DB;">
        <p style="color:#F5F5F5; margin-bottom:12px;">
          IPv4 addresses are 32-bit binary integers divided into 4 octets (8 bits each). Classful addressing categorizes addresses by inspecting the leading binary bits of the 1st octet.
        </p>

        <div style="background:#0F1115; border:1px solid #23262D; border-radius:6px; padding:12px; font-family:monospace; font-size:12px; margin-bottom:14px;">
          <div style="color:#3B82F6;">Class A: Starts with 0 &rarr; Decimal 1 to 126 &bull; (2<sup>31</sup> total IPs)</div>
          <div style="color:#3B82F6;">Class B: Starts with 10 &rarr; Decimal 128 to 191 &bull; (2<sup>30</sup> total IPs)</div>
          <div style="color:#3B82F6;">Class C: Starts with 110 &rarr; Decimal 192 to 223 &bull; (2<sup>29</sup> total IPs)</div>
          <div style="color:#8B5CF6;">Class D: Starts with 1110 &rarr; Decimal 224 to 239 &bull; Multicast</div>
          <div style="color:#F59E0B;">Class E: Starts with 1111 &rarr; Decimal 240 to 255 &bull; Experimental</div>
        </div>

        <div style="background:rgba(59,130,246,0.1); border-left:3px solid #3B82F6; padding:8px 12px; border-radius:4px; font-size:12px;">
          <strong>Exam Shortcut:</strong> Why isn't 127 in Class A? <code style="color:#10B981;">127.0.0.0 /8</code> is reserved for Loopback testing!
        </div>
      </div>
    `
  },

  'subnet_masks': {
    title: '1.2 Subnet Masking Mechanics',
    html: `
      <div style="font-size:13px; line-height:1.6; color:#D1D5DB;">
        <p style="color:#F5F5F5; margin-bottom:12px;">
          A Subnet Mask is a 32-bit mask used by routers to separate the <strong>Network ID (1's)</strong> from the <strong>Host ID (0's)</strong> via a bitwise AND operation (<code>IP & Mask = Network_ID</code>).
        </p>

        <div style="background:#0F1115; border:1px solid #23262D; border-radius:6px; padding:12px; font-family:monospace; font-size:12px;">
          Class A Default: 255.0.0.0 &rarr; /8<br>
          Class B Default: 255.255.0.0 &rarr; /16<br>
          Class C Default: 255.255.255.0 &rarr; /24
        </div>
      </div>
    `
  },

  'private_ip': {
    title: '1.3 Private IP Address Ranges',
    html: `
      <div style="font-size:13px; line-height:1.6; color:#D1D5DB;">
        <p style="color:#F5F5F5; margin-bottom:12px;">
          Private IP addresses are non-routable on the public Internet (used inside home/office LANs and translated via NAT to 1 public IP).
        </p>
        <ul style="margin:0; padding-left:18px; color:#F5F5F5; font-family:monospace; font-size:12px;">
          <li>10.0.0.0 &ndash; 10.255.255.255 (Class A: /8)</li>
          <li>172.16.0.0 &ndash; 172.31.255.255 (Class B: /12)</li>
          <li>192.168.0.0 &ndash; 192.168.255.255 (Class C: /16)</li>
        </ul>
      </div>
    `
  },

  'comm_modes': {
    title: '1.4 – 1.7 Communication Modes',
    html: `
      <div style="font-size:13px; line-height:1.6; color:#D1D5DB;">
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div style="background:#0F1115; border-left:3px solid #3B82F6; padding:10px; border-radius:4px;">
            <strong style="color:#F5F5F5;">Unicast (1 to 1):</strong> Transmits packets to 1 specific destination.
          </div>
          <div style="background:#0F1115; border-left:3px solid #10B981; padding:10px; border-radius:4px;">
            <strong style="color:#F5F5F5;">Broadcast (1 to All):</strong><br>
            &bull; Limited Broadcast: 255.255.255.255 (Stays strictly inside current LAN).<br>
            &bull; Direct Broadcast: Host bits = All 1's (Reaches all hosts on a remote destination subnet).
          </div>
          <div style="background:#0F1115; border-left:3px solid #8B5CF6; padding:10px; border-radius:4px;">
            <strong style="color:#F5F5F5;">Multicast (1 to Group):</strong> Class D addresses (224.0.0.0/4) delivering packets to subscribed group members only.
          </div>
        </div>
      </div>
    `
  }
};

const CN_TOPIC_CONTENTS = {
  'cn_1': `
    <div style="font-family:'Inter', system-ui, sans-serif; color: #E5E7EB; font-size: 13px; line-height: 1.6; max-width: 860px; margin: 0 auto;">

      <!-- Clickable Helper Banner -->
      <div style="background:rgba(59,130,246,0.12); border:1px solid #3B82F6; border-radius:6px; padding:10px 14px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:12px; color:#F5F5F5; font-weight:600;">Click any topic block below to open its Simplified Explanation & Solved GATE Example!</span>
        <span style="font-size:11px; background:#3B82F6; color:#FFF; font-weight:700; padding:2px 8px; border-radius:4px;">Interactive Mode</span>
      </div>

      <!-- 1.1 IP Addressing & Classes -->
      <div style="margin-bottom: 24px; cursor:pointer;" onclick="openConceptExplanationModal('ip_classes')">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #23262D; padding-bottom: 6px; margin-bottom: 12px;">
          <h2 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin:0;">
            1.1 &bull; IP Addressing Classes
          </h2>
          <span style="font-size:11px; color:#3B82F6; font-weight:600;">Click for Deep Dive ➔</span>
        </div>
        
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
        <div style="cursor:pointer;" onclick="openConceptExplanationModal('subnet_masks')">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #23262D; padding-bottom: 4px; margin-bottom: 10px;">
            <h2 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin:0;">
              1.2 &bull; Default Subnet Masks
            </h2>
            <span style="font-size:10px; color:#3B82F6;">Click ➔</span>
          </div>
          <div style="background:#0F1115; padding:12px; border-radius:6px; font-family:monospace; font-size:12px;">
            <div style="margin-bottom:4px;">Class A &rarr; <span style="color:#10B981; font-weight:700;">255.0.0.0</span></div>
            <div style="margin-bottom:4px;">Class B &rarr; <span style="color:#10B981; font-weight:700;">255.255.0.0</span></div>
            <div>Class C &rarr; <span style="color:#10B981; font-weight:700;">255.255.255.0</span></div>
          </div>
        </div>

        <div style="cursor:pointer;" onclick="openConceptExplanationModal('private_ip')">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #23262D; padding-bottom: 4px; margin-bottom: 10px;">
            <h2 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin:0;">
              1.3 &bull; Private Address Ranges
            </h2>
            <span style="font-size:10px; color:#3B82F6;">Click ➔</span>
          </div>
          <div style="background:#0F1115; padding:12px; border-radius:6px; font-size:12px;">
            <div style="margin-bottom:4px;"><code style="color:#3B82F6;">10.0.0.0 &ndash; 10.255.255.255</code> &bull; 1 Class A</div>
            <div style="margin-bottom:4px;"><code style="color:#3B82F6;">172.16.0.0 &ndash; 172.31.255.255</code> &bull; 16 Class B</div>
            <div><code style="color:#3B82F6;">192.168.0.0 &ndash; 192.168.255.255</code> &bull; 256 Class C</div>
          </div>
        </div>
      </div>

      <!-- Class Breakdown Table -->
      <div style="margin-bottom: 24px; cursor:pointer;" onclick="openConceptExplanationModal('ip_classes')">
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
      <div style="margin-bottom: 24px; cursor:pointer;" onclick="openConceptExplanationModal('comm_modes')">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #23262D; padding-bottom: 4px; margin-bottom: 10px;">
          <h2 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin:0;">
            1.4 – 1.7 &bull; Communication Modes & Bit Mapping
          </h2>
          <span style="font-size:11px; color:#3B82F6; font-weight:600;">Click for Explanation ➔</span>
        </div>

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

      <!-- 1.8 CIDR Rules Block (Clickable!) -->
      <div style="margin-bottom: 24px; cursor:pointer;" onclick="openConceptExplanationModal('cidr')">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #23262D; padding-bottom: 4px; margin-bottom: 10px;">
          <h2 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin:0;">
            1.8 &bull; CIDR Allocation Rules
          </h2>
          <span style="font-size:11px; background:#3B82F6; color:#FFF; font-weight:700; padding:2px 8px; border-radius:4px;">Click for Simplified GATE Example ➔</span>
        </div>

        <div style="background:#0F1115; border-left: 3px solid #10B981; padding: 12px 14px; border-radius: 4px; transition:all 0.15s;" onmouseover="this.style.borderColor='#3B82F6'" onmouseout="this.style.borderColor='#10B981'">
          <ol style="margin: 0; padding-left: 18px; font-size: 12.5px; color: #F5F5F5; line-height: 1.7;">
            <li><strong>Contiguous Block:</strong> All IP addresses in the block must be continuous without gaps.</li>
            <li><strong>Power of 2:</strong> Block size must equal 2<sup>N</sup>.</li>
            <li><strong>Divisibility Rule:</strong> The first IP address of the block must be exactly divisible by the block size.</li>
          </ol>
        </div>
      </div>

      <!-- 1.9 – 1.11 Supernetting Block (Clickable!) -->
      <div style="cursor:pointer;" onclick="openConceptExplanationModal('supernetting')">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #23262D; padding-bottom: 4px; margin-bottom: 10px;">
          <h2 style="font-family:'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #3B82F6; margin:0;">
            1.9 – 1.11 &bull; Supernetting Concept & Rules
          </h2>
          <span style="font-size:11px; background:#F59E0B; color:#000; font-weight:700; padding:2px 8px; border-radius:4px;">Click for Simplified GATE Example ➔</span>
        </div>
        
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

function openConceptExplanationModal(conceptKey) {
  const modal = document.getElementById('concept-modal-overlay');
  const titleElem = document.getElementById('concept-modal-title');
  const bodyElem = document.getElementById('concept-modal-body');

  if (!modal || !bodyElem) return;

  const explanationData = CONCEPT_EXPLANATIONS[conceptKey] || CONCEPT_EXPLANATIONS['cidr'];
  if (titleElem) titleElem.innerText = explanationData.title || 'Concept Explanation';
  bodyElem.innerHTML = explanationData.html || '<p>Detailed explanation coming soon.</p>';

  modal.classList.add('active');
}

function closeConceptModal() {
  const modal = document.getElementById('concept-modal-overlay');
  if (modal) modal.classList.remove('active');
}

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
window.openConceptExplanationModal = openConceptExplanationModal;
window.closeConceptModal = closeConceptModal;

document.addEventListener('DOMContentLoaded', () => {
  initRevisionModule();
});
