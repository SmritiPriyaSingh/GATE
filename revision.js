// GitBook / Notion Docs-Style Learning Center Module (GATE CSE Complete Syllabus)
// Grounded in Official GATE Wallah CS/IT Handbook

let currentSelectedSubject = 'cn'; // default active subject: Computer Networks
let currentSelectedTopicId = 'cn_osi_intro';
let userCompletedTopics = {};
let userBookmarkedTopics = {};

// Complete Syllabus Hierarchy Database (11 Core GATE Subjects & Chapters)
const LEARNING_SYLLABUS_DB = {
  'cn': {
    title: 'Computer Networks',
    icon: 'Globe',
    chapters: [
      {
        name: 'OSI & TCP/IP Architectures',
        topics: [
          { id: 'cn_osi_intro', title: 'OSI 7 Layer & TCP/IP Protocol Stack', diff: 'Easy', time: '15 min' },
          { id: 'cn_ip_subnets', title: 'IP Addressing, Subnetting & Supernetting', diff: 'Hard', time: '30 min' }
        ]
      },
      {
        name: 'Data Link & Network Layer',
        topics: [
          { id: 'cn_framing_crc', title: 'Error Control (CRC, Hamming) & Flow Control (GBN, SR)', diff: 'Hard', time: '30 min' },
          { id: 'cn_mac_ethernet', title: 'Medium Access Control (ALOHA, CSMA/CD, Ethernet)', diff: 'Medium', time: '25 min' },
          { id: 'cn_routing', title: 'Routing Algorithms (DVR, LSR) & IP Protocols (ARP, ICMP)', diff: 'Hard', time: '25 min' }
        ]
      },
      {
        name: 'Transport & Application Layers',
        topics: [
          { id: 'cn_ipv4_header', title: 'IPv4 Header & Fragmentation', diff: 'Medium', time: '20 min' },
          { id: 'cn_tcp_udp', title: 'TCP/UDP Headers, 3-Way Handshake & Congestion Control', diff: 'Hard', time: '30 min' },
          { id: 'cn_app_protocols', title: 'Application Protocols (DNS, HTTP, FTP, SMTP, POP3, IMAP)', diff: 'Medium', time: '25 min' }
        ]
      }
    ]
  },
  'dbms': {
    title: 'Database Management Systems',
    icon: 'Database',
    chapters: [
      {
        name: 'Database Models & SQL',
        topics: [
          { id: 'dbms_er_model', title: 'ER Model & ER-to-Relational Mapping', diff: 'Easy', time: '15 min' },
          { id: 'dbms_rel_algebra', title: 'Relational Algebra & Relational Calculus', diff: 'Hard', time: '25 min' },
          { id: 'dbms_sql_queries', title: 'SQL Queries, Joins, Group By & Subqueries', diff: 'Medium', time: '22 min' }
        ]
      },
      {
        name: 'Normalization & Concurrency',
        topics: [
          { id: 'dbms_fd_closure', title: 'Functional Dependencies & Key Closures', diff: 'Medium', time: '20 min' },
          { id: 'dbms_normalization', title: 'Normalization (1NF, 2NF, 3NF, BCNF)', diff: 'Hard', time: '30 min' },
          { id: 'dbms_transactions', title: 'Transactions & ACID Properties', diff: 'Easy', time: '15 min' },
          { id: 'dbms_concurrency', title: 'Concurrency Control & Two-Phase Locking (2PL)', diff: 'Hard', time: '25 min' },
          { id: 'dbms_indexing', title: 'B-Trees & B+ Tree Indexing Formulas', diff: 'Hard', time: '28 min' }
        ]
      }
    ]
  },
  'os': {
    title: 'Operating Systems',
    icon: 'Server',
    chapters: [
      {
        name: 'Process & Thread Management',
        topics: [
          { id: 'os_process_states', title: 'Process States, PCB & Context Switching', diff: 'Easy', time: '15 min' },
          { id: 'os_cpu_scheduling', title: 'CPU Scheduling (FCFS, SJF, RR, Priority)', diff: 'Medium', time: '25 min' },
          { id: 'os_synch', title: 'Process Synchronization & Semaphores', diff: 'Hard', time: '30 min' },
          { id: 'os_deadlock', title: 'Deadlock 4 Conditions & Banker Algorithm', diff: 'Hard', time: '25 min' }
        ]
      },
      {
        name: 'Memory & File Systems',
        topics: [
          { id: 'os_paging', title: 'Memory Management, Paging & TLB', diff: 'Hard', time: '25 min' },
          { id: 'os_virtual_mem', title: 'Virtual Memory & Page Replacement (LRU, FIFO)', diff: 'Medium', time: '22 min' },
          { id: 'os_files', title: 'File System Allocation & Inodes', diff: 'Medium', time: '18 min' },
          { id: 'os_disk', title: 'Disk Scheduling Algorithms (SSTF, SCAN)', diff: 'Easy', time: '15 min' }
        ]
      }
    ]
  },
  'algo': {
    title: 'Algorithms',
    icon: 'Cpu',
    chapters: [
      {
        name: 'Analysis & Design Techniques',
        topics: [
          { id: 'algo_asymptotic', title: 'Asymptotic Notation (Big-O, Omega, Theta)', diff: 'Easy', time: '15 min' },
          { id: 'algo_recurrence', title: 'Recurrence Relations & Master Theorem', diff: 'Medium', time: '20 min' },
          { id: 'algo_divide', title: 'Divide & Conquer (Merge & Quick Sort)', diff: 'Medium', time: '22 min' },
          { id: 'algo_greedy', title: 'Greedy Algorithms (Knapsack & Huffman)', diff: 'Medium', time: '20 min' },
          { id: 'algo_dp', title: 'Dynamic Programming (LCS & 0/1 Knapsack)', diff: 'Hard', time: '30 min' }
        ]
      },
      {
        name: 'Graph & Advanced Algorithms',
        topics: [
          { id: 'algo_graph_traversal', title: 'BFS, DFS & Topological Sort', diff: 'Medium', time: '20 min' },
          { id: 'algo_shortest_path', title: 'Dijkstra, Bellman-Ford & Floyd-Warshall', diff: 'Hard', time: '25 min' },
          { id: 'algo_mst', title: 'Minimum Spanning Trees (Kruskal & Prim)', diff: 'Medium', time: '18 min' },
          { id: 'algo_complexity', title: 'NP-Completeness, P vs NP & Reductions', diff: 'Hard', time: '25 min' }
        ]
      }
    ]
  },
  'pds': {
    title: 'Programming & Data Structures',
    icon: 'Code',
    chapters: [
      {
        name: 'C Programming',
        topics: [
          { id: 'pds_c_basics', title: 'C Basics, Operators & Precedence', diff: 'Easy', time: '15 min' },
          { id: 'pds_c_pointers', title: 'Pointers, Arrays & Memory Addresses', diff: 'Hard', time: '25 min' },
          { id: 'pds_c_functions', title: 'Recursion, Call Stack & Variable Scope', diff: 'Medium', time: '20 min' }
        ]
      },
      {
        name: 'Linear Data Structures',
        topics: [
          { id: 'pds_ds_arrays', title: '1D/2D Array Memory Formulas', diff: 'Easy', time: '12 min' },
          { id: 'pds_ds_lists', title: 'Singly & Doubly Linked Lists', diff: 'Medium', time: '18 min' },
          { id: 'pds_ds_stack', title: 'Stacks, Infix to Postfix & Evaluation', diff: 'Medium', time: '20 min' },
          { id: 'pds_ds_queue', title: 'Queues, Circular Queue & Priority Queue', diff: 'Medium', time: '15 min' }
        ]
      },
      {
        name: 'Non-Linear Data Structures',
        topics: [
          { id: 'pds_ds_trees', title: 'Binary Trees, BST & AVL Trees', diff: 'Hard', time: '30 min' },
          { id: 'pds_ds_graphs', title: 'Graph Representations (Adjacency Matrix/List)', diff: 'Medium', time: '20 min' },
          { id: 'pds_ds_hashing', title: 'Hash Functions, Chaining & Open Addressing', diff: 'Medium', time: '20 min' }
        ]
      }
    ]
  },
  'coa': {
    title: 'Computer Organization & Architecture',
    icon: 'HardDrive',
    chapters: [
      {
        name: 'Processor & Datapath',
        topics: [
          { id: 'coa_number_sys', title: 'IEEE 754 Floating Point Representation', diff: 'Medium', time: '20 min' },
          { id: 'coa_pipelining', title: 'Instruction Pipelining & Speedup Hazards', diff: 'Hard', time: '30 min' }
        ]
      },
      {
        name: 'Memory Hierarchy & I/O',
        topics: [
          { id: 'coa_cache', title: 'Cache Memory Mapping (Direct, Set-Associative)', diff: 'Hard', time: '28 min' },
          { id: 'coa_dma', title: 'I/O Interface, Interrupts & DMA Controller', diff: 'Medium', time: '18 min' }
        ]
      }
    ]
  },
  'toc': {
    title: 'Theory of Computation',
    icon: 'Layers',
    chapters: [
      {
        name: 'Automata & Regular Languages',
        topics: [
          { id: 'toc_dfa_nfa', title: 'DFA, NFA Construction & Minimization', diff: 'Medium', time: '22 min' },
          { id: 'toc_regex', title: 'Regular Expressions & Pumping Lemma', diff: 'Hard', time: '25 min' }
        ]
      },
      {
        name: 'Grammars & Decidability',
        topics: [
          { id: 'toc_cfg_pda', title: 'Context-Free Grammars & Pushdown Automata', diff: 'Hard', time: '25 min' },
          { id: 'toc_turing', title: 'Turing Machines & Undecidability (Halting Problem)', diff: 'Hard', time: '30 min' }
        ]
      }
    ]
  },
  'cd': {
    title: 'Compiler Design',
    icon: 'Terminal',
    chapters: [
      {
        name: 'Phases of Compiler',
        topics: [
          { id: 'cd_lexical', title: 'Lexical Analysis & Tokenization', diff: 'Easy', time: '15 min' },
          { id: 'cd_parsing', title: 'Syntax Analysis (LL(1) & LR Parsing)', diff: 'Hard', time: '30 min' },
          { id: 'cd_sdt', title: 'Syntax-Directed Translation (SDT)', diff: 'Medium', time: '20 min' },
          { id: 'cd_opt', title: 'Code Optimization & Register Allocation', diff: 'Medium', time: '20 min' }
        ]
      }
    ]
  },
  'dl': {
    title: 'Digital Logic',
    icon: 'Zap',
    chapters: [
      {
        name: 'Combinational & Sequential Circuits',
        topics: [
          { id: 'dl_boolean', title: 'Boolean Algebra & K-Map Minimization', diff: 'Easy', time: '15 min' },
          { id: 'dl_combinational', title: 'Multiplexers, Decoders & Adders', diff: 'Medium', time: '20 min' },
          { id: 'dl_flipflops', title: 'Flip-Flops, Counters & Registers', diff: 'Medium', time: '22 min' }
        ]
      }
    ]
  },
  'math': {
    title: 'Engineering Mathematics',
    icon: 'Sigma',
    chapters: [
      {
        name: 'Discrete Mathematics',
        topics: [
          { id: 'math_dm_logic', title: 'Propositional & First-Order Logic', diff: 'Medium', time: '20 min' },
          { id: 'math_dm_sets', title: 'Sets, Relations & Functions', diff: 'Medium', time: '18 min' },
          { id: 'math_dm_combinatorics', title: 'Permutations, Combinations & Counting', diff: 'Hard', time: '25 min' }
        ]
      },
      {
        name: 'Calculus & Probability',
        topics: [
          { id: 'math_calc_limits', title: 'Limits, Continuity & Differentiability', diff: 'Medium', time: '20 min' },
          { id: 'math_prob_bayes', title: 'Probability Distributions & Bayes Theorem', diff: 'Hard', time: '22 min' }
        ]
      }
    ]
  },
  'aptitude': {
    title: 'General Aptitude',
    icon: 'Brain',
    chapters: [
      {
        name: 'Quantitative & Reasoning',
        topics: [
          { id: 'apt_quant_num', title: 'Percentages, Ratio & Proportions', diff: 'Easy', time: '15 min' },
          { id: 'apt_quant_speed', title: 'Time, Speed, Distance & Work', diff: 'Medium', time: '18 min' },
          { id: 'apt_lr_relations', title: 'Clocks, Calendars & Blood Relations', diff: 'Medium', time: '15 min' }
        ]
      }
    ]
  }
};

// Rich Learning Content Repository (Grounded in GATE Wallah CS/IT Handbook PDF)
const RICH_TOPIC_CONTENTS = {
  'cn_osi_intro': {
    title: 'OSI 7 Layer Model & TCP/IP Protocol Stack',
    subject: 'Computer Networks',
    diff: 'Easy',
    time: '15 min',
    prereq: 'Basic Networking Principles (ISO standard proposed framework)',
    intro: 'The Open Systems Interconnection (OSI) model proposed by ISO standardizes networking into 7 separate but related layers, enabling heterogeneous systems to communicate seamlessly regardless of underlying hardware/software.',
    sections: [
      {
        heading: '1. Functions of Computer Network & Mandatory vs Optional Tasks',
        text: `
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:12px 14px; margin-bottom:14px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12px;">
              <div>
                <strong style="color:var(--accent-primary);">Mandatory Functions:</strong>
                <ul style="margin:4px 0 0 16px; padding:0; color:var(--text-sub);">
                  <li>Error Control</li>
                  <li>Flow Control</li>
                  <li>Access Control (MAC)</li>
                  <li>Multiplexing & Demultiplexing</li>
                </ul>
              </div>
              <div>
                <strong style="color:var(--color-success);">Optional Functions:</strong>
                <ul style="margin:4px 0 0 16px; padding:0; color:var(--text-sub);">
                  <li>Encryption & Decryption</li>
                  <li>Check Pointing (Session)</li>
                  <li>Routing & Path Selection</li>
                </ul>
              </div>
            </div>
          </div>
        `
      },
      {
        heading: '2. The 7 OSI Layers & PDU Architecture (Handbook Reference)',
        text: `
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:14px; margin-bottom:14px; overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-color); color:var(--accent-primary);">
                  <th style="padding:6px;">Layer #</th>
                  <th style="padding:6px;">Layer Name</th>
                  <th style="padding:6px;">PDU Unit</th>
                  <th style="padding:6px;">Key Responsibilities & Hardware</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#EF4444;">Layer 7</td>
                  <td style="padding:6px;">Application</td>
                  <td style="padding:6px;">Message</td>
                  <td style="padding:6px;">Mail services, File transfer (DNS, HTTP, FTP, SMTP, TELNET)</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#F59E0B;">Layer 6</td>
                  <td style="padding:6px;">Presentation</td>
                  <td style="padding:6px;">Data</td>
                  <td style="padding:6px;">Syntax/semantics, Character translation, Encryption/Decryption, Compression</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#F59E0B;">Layer 5</td>
                  <td style="padding:6px;">Session</td>
                  <td style="padding:6px;">Data</td>
                  <td style="padding:6px;">Network dialog controller, Authentication, Authorization, Synchronization checkpoints</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#3B82F6;">Layer 4</td>
                  <td style="padding:6px;">Transport</td>
                  <td style="padding:6px;">Segment / Datagram</td>
                  <td style="padding:6px;">Process-to-process delivery, Service-point addressing (Ports), Connection control</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#3B82F6;">Layer 3</td>
                  <td style="padding:6px;">Network</td>
                  <td style="padding:6px;">Packet</td>
                  <td style="padding:6px;">Host-to-host connectivity, Logical (IP) addressing, Routing, Switching, Fragmentation</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#10B981;">Layer 2</td>
                  <td style="padding:6px;">Data Link</td>
                  <td style="padding:6px;">Frame</td>
                  <td style="padding:6px;">Hop-to-hop frame delivery, LLC (flow/error control) + MAC (framing, physical addressing)</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:700; color:#10B981;">Layer 1</td>
                  <td style="padding:6px;">Physical</td>
                  <td style="padding:6px;">Bits</td>
                  <td style="padding:6px;">Hop-to-hop bit transmission. Copper (electrical), Fiber (light), Wireless (EM signal), Topologies</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        heading: '3. TCP/IP 5-Layer Model Mapping',
        text: `
          <div style="background:var(--bg-surface-hover); border-left:4px solid var(--accent-primary); border-radius:6px; padding:12px 14px; margin-bottom:14px; font-size:12px;">
            <strong>TCP/IP Protocol Stack Mapping:</strong><br>
            • <strong>Application Layer:</strong> DNS, SMTP, HTTP, FTP, POP, IMAP, SNMP, Telnet<br>
            • <strong>Transport Layer:</strong> TCP, UDP, SCTP<br>
            • <strong>Network Layer:</strong> IP, ARP, RARP, ICMP, IGMP<br>
            • <strong>Data Link Layer:</strong> Hardware specific framing & MAC addressing<br>
            • <strong>Physical Layer:</strong> Hardware signal transmission
          </div>
        `
      }
    ],
    summary: 'The OSI model standardizes networking into 7 layers. Physical Layer moves bits, Data Link moves frames, Network Layer moves packets host-to-host, Transport Layer delivers segments process-to-process, and Application Layer handles user services.',
    pyqs: [
      { year: '2024', q: 'In the OSI model, encryption and decryption are primary functions of which layer?', opt: ['Transport Layer', 'Presentation Layer', 'Session Layer', 'Application Layer'], ans: 1, explanation: 'Presentation Layer (Layer 6) handles syntax representation, encryption/decryption (SSL/TLS), and data compression.' }
    ]
  },

  'cn_ip_subnets': {
    title: 'IP Addressing, Subnetting & Supernetting',
    subject: 'Computer Networks',
    diff: 'Hard',
    time: '30 min',
    prereq: 'Binary numbers & bitwise arithmetic',
    intro: 'IP addressing provides 32-bit unique logical identification for hosts across a network. This module covers Classful addressing (Class A to E), default subnet masks, private IP ranges, special address types, CIDR block rules, and Supernetting.',
    sections: [
      {
        heading: '1. Classful IP Addressing Table & Ranges',
        text: `
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:14px; margin-bottom:14px; overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-color); color:var(--accent-primary);">
                  <th style="padding:6px;">Class</th>
                  <th style="padding:6px;">Prefix Bits</th>
                  <th style="padding:6px;">1st Octet Range</th>
                  <th style="padding:6px;">Total IP Addresses</th>
                  <th style="padding:6px;"># Networks</th>
                  <th style="padding:6px;"># Hosts per Network</th>
                  <th style="padding:6px;">Default Subnet Mask</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#3B82F6;">Class A</td>
                  <td style="padding:6px;">0</td>
                  <td style="padding:6px;">1 - 126</td>
                  <td style="padding:6px;">2^31</td>
                  <td style="padding:6px;">2^7 - 2 = 126</td>
                  <td style="padding:6px;">2^24 - 2 = 16,777,214</td>
                  <td style="padding:6px;">255.0.0.0</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#10B981;">Class B</td>
                  <td style="padding:6px;">10</td>
                  <td style="padding:6px;">128 - 191</td>
                  <td style="padding:6px;">2^30</td>
                  <td style="padding:6px;">2^14 = 16,384</td>
                  <td style="padding:6px;">2^16 - 2 = 65,534</td>
                  <td style="padding:6px;">255.255.0.0</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#F59E0B;">Class C</td>
                  <td style="padding:6px;">110</td>
                  <td style="padding:6px;">192 - 223</td>
                  <td style="padding:6px;">2^29</td>
                  <td style="padding:6px;">2^21 = 2,097,125</td>
                  <td style="padding:6px;">2^8 - 2 = 254</td>
                  <td style="padding:6px;">255.255.255.0</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#8B5CF6;">Class D</td>
                  <td style="padding:6px;">1110</td>
                  <td style="padding:6px;">224 - 239</td>
                  <td style="padding:6px;">2^28</td>
                  <td style="padding:6px;">Multicast Address (No NID/HID)</td>
                  <td style="padding:6px;">28 remaining bits used for multicast</td>
                  <td style="padding:6px;">N/A</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:700; color:#EF4444;">Class E</td>
                  <td style="padding:6px;">1111</td>
                  <td style="padding:6px;">240 - 255</td>
                  <td style="padding:6px;">2^28</td>
                  <td style="padding:6px;">Research & Future Purpose</td>
                  <td style="padding:6px;">No NID and HID</td>
                  <td style="padding:6px;">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); border-radius:6px; padding:8px 12px; margin-bottom:14px; font-size:11px;">
            <strong>Note:</strong> IP address <code>127.x.y.z</code> is reserved as the <strong>Loopback Address</strong> used to check internal host network stack connectivity.
          </div>
        `
      },
      {
        heading: '2. Private IP Ranges & Special Network Address Table',
        text: `
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:14px; margin-bottom:14px;">
            <div style="font-size:12px; font-weight:700; color:var(--text-main); margin-bottom:6px;">Private IP Ranges:</div>
            <ul style="font-size:12px; color:var(--text-sub); margin:0 0 12px 16px; padding:0;">
              <li><strong>Class A:</strong> 10.0.0.0 to 10.255.255.255 (1 Class A network)</li>
              <li><strong>Class B:</strong> 172.16.0.0 to 172.31.255.255 (16 Class B networks)</li>
              <li><strong>Class C:</strong> 192.168.0.0 to 192.168.255.255 (256 Class C networks)</li>
            </ul>

            <div style="font-size:12px; font-weight:700; color:var(--text-main); margin-bottom:6px;">Special Address Interpretations:</div>
            <table style="width:100%; border-collapse:collapse; font-size:11px; text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-color); color:var(--accent-primary);">
                  <th style="padding:4px;">NID Bits</th>
                  <th style="padding:4px;">HID Bits</th>
                  <th style="padding:4px;">Meaning / Function</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:4px;">-</td>
                  <td style="padding:4px;">All 0's</td>
                  <td style="padding:4px; font-weight:700; color:#3B82F6;">Network ID</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:4px;">-</td>
                  <td style="padding:4px;">All 1's</td>
                  <td style="padding:4px; font-weight:700; color:#EF4444;">Direct Broadcast Address (DBA)</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:4px;">All 1's</td>
                  <td style="padding:4px;">All 1's</td>
                  <td style="padding:4px; font-weight:700; color:#F59E0B;">Limited Broadcast Address (LBA = 255.255.255.255)</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:4px;">All 0's</td>
                  <td style="padding:4px;">-</td>
                  <td style="padding:4px;">Host within the local network</td>
                </tr>
                <tr>
                  <td style="padding:4px;">All 1's</td>
                  <td style="padding:4px;">All 0's</td>
                  <td style="padding:4px;">Subnet Mask / Network Mask</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        heading: '3. CIDR & Supernetting Rules (Handbook Summary)',
        text: `
          <div style="background:var(--bg-surface-hover); border-left:4px solid var(--color-success); border-radius:6px; padding:12px 14px; margin-bottom:14px; font-size:12px;">
            <strong style="color:var(--color-success);">3 Rules of CIDR Blocks:</strong><br>
            1. All IP addresses in the block must be <strong>contiguous</strong>.<br>
            2. Block size must be a <strong>power of 2</strong>.<br>
            3. The first IP address of the block must be <strong>divisible by the size of the block</strong>.<br><br>

            <strong style="color:var(--accent-primary);">Supernetting Advantages & Rules:</strong><br>
            • Supernetting combines two or more Class C networks to create a larger single network.<br>
            • <strong>Advantage:</strong> Reduces routing table entries in routers and allows flexible allotment (e.g. combining two Class C networks instead of purchasing a full Class B).<br>
            • <strong>Rules:</strong> Network IDs must be contiguous, sizes equal & power of 2, and 1st Network ID divisible by total supernet size.
          </div>
        `
      }
    ],
    summary: 'Class A/B/C use default masks 255.0.0.0, 255.255.0.0, 255.255.255.0. Private IP ranges are 10.x, 172.16-31.x, and 192.168.x. CIDR requires contiguous blocks divisible by power-of-2 size. Supernetting merges Class C networks to reduce router table size.',
    pyqs: [
      { year: '2023', q: 'What is the maximum number of usable hosts in a Class B network with subnet mask 255.255.240.0 (/20)?', opt: ['4094', '4096', '2046', '8190'], ans: 0, explanation: 'Host bits = 32 - 20 = 12 bits. Usable hosts = 2^12 - 2 = 4096 - 2 = 4094 hosts.' }
    ]
  },

  'cn_framing_crc': {
    title: 'Error Control (CRC, Hamming) & Flow Control (GBN, SR)',
    subject: 'Computer Networks',
    diff: 'Hard',
    time: '30 min',
    prereq: 'Data Link Layer fundamentals',
    intro: 'Error Control detects and corrects bit corruptions introduced by noise during transmission. Flow Control regulates transmission speeds so a fast sender does not overwhelm a slow receiver.',
    sections: [
      {
        heading: '1. Error Detection & Correction Formulas (Handbook Reference)',
        text: `
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:14px; margin-bottom:14px; font-size:12px;">
            <div style="margin-bottom:8px;">
              <strong>Corrupted Bits Formula:</strong> <code># Corrupted Bits = Data Rate × Noise Duration</code>
            </div>
            <table style="width:100%; border-collapse:collapse; margin-bottom:10px; text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-color); color:var(--accent-primary);">
                  <th style="padding:4px;">Mechanism</th>
                  <th style="padding:4px;">Minimum Hamming Distance Required</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:4px;">Detect 'd' bit errors</td>
                  <td style="padding:4px; font-weight:700; color:#3B82F6;">d + 1</td>
                </tr>
                <tr>
                  <td style="padding:4px;">Correct 'd' bit errors</td>
                  <td style="padding:4px; font-weight:700; color:#10B981;">2d + 1</td>
                </tr>
              </tbody>
            </table>
            <div>
              <strong>Hamming Code Inequality:</strong> <code>m + r + 1 ≤ 2^r</code> (where m = message bits, r = redundant check bits).
            </div>
          </div>
        `
      },
      {
        heading: '2. Cyclic Redundancy Check (CRC) Generator Characteristics',
        text: `
          <div style="background:var(--bg-surface-hover); border-left:4px solid #F59E0B; border-radius:6px; padding:12px 14px; margin-bottom:14px; font-size:12px;">
            <strong>CRC Polynomial Generator Properties:</strong><br>
            1. Length of divisor generator = <code>k</code> bits ➔ CRC remainder = <code>k - 1</code> bits.<br>
            2. If generator has coefficient of x^0 = 1, all <strong>single bit errors</strong> are detected.<br>
            3. If generator contains a factor of <code>(x + 1)</code>, it detects all <strong>odd-numbered errors</strong>.<br>
            4. <strong>Codeword</strong> = original message dataword + appended <code>(k - 1)</code> zeros + modulo-2 remainder CRC.
          </div>
        `
      },
      {
        heading: '3. Master Flow Control Protocol Comparison (Stop & Wait vs GBN vs SR)',
        text: `
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:14px; margin-bottom:14px; overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:11px; text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-color); color:var(--accent-primary);">
                  <th style="padding:6px;">Parameter</th>
                  <th style="padding:6px;">Stop & Wait</th>
                  <th style="padding:6px;">Go-Back-N (GBN)</th>
                  <th style="padding:6px;">Selective Repeat (SR)</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700;">Sender Window (Ws)</td>
                  <td style="padding:6px;">1</td>
                  <td style="padding:6px; font-weight:700; color:#3B82F6;">N</td>
                  <td style="padding:6px; font-weight:700; color:#10B981;">2^(K-1)</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700;">Receiver Window (Wr)</td>
                  <td style="padding:6px;">1</td>
                  <td style="padding:6px;">1 (Always 1)</td>
                  <td style="padding:6px; font-weight:700; color:#10B981;">2^(K-1) (Ws = Wr)</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700;">Efficiency (η)</td>
                  <td style="padding:6px;">Td / (Td + 2Pd)</td>
                  <td style="padding:6px;">N × Td / (Td + 2Pd)</td>
                  <td style="padding:6px;">Ws × Td / (Td + 2Pd)</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700;">ACK Type</td>
                  <td style="padding:6px;">Individual ACK</td>
                  <td style="padding:6px;">Cumulative ACK</td>
                  <td style="padding:6px;">Independent ACK + NACK</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700;">Out-of-Order Packets</td>
                  <td style="padding:6px;">Discarded</td>
                  <td style="padding:6px;">Discarded</td>
                  <td style="padding:6px;">Accepted & Sorted in Buffer</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:700;">Total Buffer Needed</td>
                  <td style="padding:6px;">1 + 1 = 2</td>
                  <td style="padding:6px;">N + 1</td>
                  <td style="padding:6px;">N + N = 2N</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      }
    ],
    summary: 'Hamming distance requires d+1 for detection and 2d+1 for correction. CRC uses polynomial modulo-2 division. GBN uses cumulative ACK with receiver window 1. Selective Repeat uses independent ACKs with equal sender and receiver windows 2^(K-1).',
    pyqs: [
      { year: '2024', q: 'In Selective Repeat ARQ protocol with 4-bit sequence numbers, what is the maximum sender window size Ws?', opt: ['7', '8', '15', '16'], ans: 1, explanation: 'For K bits sequence number in SR ARQ, Ws = Wr = 2^(K-1) = 2^(4-1) = 2^3 = 8.' }
    ]
  },

  'cn_tcp_udp': {
    title: 'TCP/UDP Headers, 3-Way Handshake & Congestion Control',
    subject: 'Computer Networks',
    diff: 'Hard',
    time: '30 min',
    prereq: 'Transport Layer Concepts',
    intro: 'TCP provides connection-oriented, reliable, in-order byte stream delivery using a 3-way handshake and congestion control algorithms. UDP is a lightweight, connectionless datagram protocol with minimal header overhead.',
    sections: [
      {
        heading: '1. Master TCP vs UDP Comparison Table (Handbook Reference)',
        text: `
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:14px; margin-bottom:14px; overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:11px; text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-color); color:var(--accent-primary);">
                  <th style="padding:6px;">Feature</th>
                  <th style="padding:6px;">TCP (Transmission Control Protocol)</th>
                  <th style="padding:6px;">UDP (User Datagram Protocol)</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700;">Connection Mode</td>
                  <td style="padding:6px; font-weight:700; color:#3B82F6;">Connection-oriented (3-way handshake)</td>
                  <td style="padding:6px; font-weight:700; color:#F59E0B;">Connectionless datagram</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700;">Reliability</td>
                  <td style="padding:6px; color:#10B981;">Reliable (in-order delivery guaranteed)</td>
                  <td style="padding:6px; color:#EF4444;">Unreliable (best effort)</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700;">Header Size</td>
                  <td style="padding:6px;">20 - 60 Bytes</td>
                  <td style="padding:6px; font-weight:700; color:#10B981;">Fixed 8 Bytes</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700;">Flow & Congestion Control</td>
                  <td style="padding:6px;">Supported (Sliding window + Slow Start)</td>
                  <td style="padding:6px;">Not supported</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700;">Checksum</td>
                  <td style="padding:6px;">Mandatory</td>
                  <td style="padding:6px;">Optional (filled with 0s if unused)</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:700;">Protocols Used By</td>
                  <td style="padding:6px;">HTTP, HTTPS, FTP, SMTP, POP3, IMAP</td>
                  <td style="padding:6px;">DNS, SNMP, TFTP, DHCP, Real-time Streaming</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        heading: '2. TCP 3-Way Handshake & Sequence Number Consumption',
        text: `
          <div style="background:var(--bg-surface-hover); border-left:4px solid var(--accent-primary); border-radius:6px; padding:12px 14px; margin-bottom:14px; font-size:12px;">
            <strong>Sequence Number Consumption Rules:</strong><br>
            • <code>SYN = 1</code> ➔ Consumes <strong>1 sequence number</strong> (Connection Request)<br>
            • <code>ACK = 1</code> ➔ Consumes <strong>0 sequence numbers</strong> (Acknowledgment)<br>
            • <code>FIN = 1</code> ➔ Consumes <strong>1 sequence number</strong> (Connection Termination)<br>
            • <code>1 Data Byte</code> ➔ Consumes <strong>1 sequence number</strong><br><br>
            <strong>Wrap Around Time (WAT) Formula:</strong><br>
            <code>WAT = Total Sequence Numbers / Bandwidth [Bytes/sec]</code>
          </div>
        `
      },
      {
        heading: '3. TCP Congestion Control & Token Bucket Leaky Bucket',
        text: `
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:14px; margin-bottom:14px; font-size:12px;">
            <strong style="color:var(--accent-primary);">TCP Congestion Control Phases:</strong><br>
            • <strong>Slow Start:</strong> Exponential growth of congestion window. On receiving ACK ➔ <code>Wc = Wc + 1</code>. After 1 RTT ➔ <code>Wc = 2 * Wc</code>.<br>
            • <strong>Congestion Avoidance:</strong> Linear growth after threshold. On receiving ACK ➔ <code>Wc = Wc + 1/Wc</code>. After 1 RTT ➔ <code>Wc = Wc + 1</code>.<br>
            • <strong>Congestion Detection:</strong> Triggered by Timeout or 3 duplicate ACKs.<br><br>

            <strong style="color:var(--color-success);">Token Bucket Burst Time Formula:</strong><br>
            Let C = Token bucket capacity, r = token arrival rate (tokens/sec), M = maximum output burst rate.<br>
            Maximum burst duration: <code>t = C / (M - r)</code>.
          </div>
        `
      }
    ],
    summary: 'TCP is connection-oriented with 20-60 byte headers, 3-way handshake, and congestion control (Slow Start & Congestion Avoidance). UDP has an 8-byte fixed header, is connectionless, and ideal for real-time video, DNS, and DHCP.',
    pyqs: [
      { year: '2023', q: 'A token bucket system has capacity C = 100 KB, arrival rate r = 10 MB/s, and maximum transmission rate M = 50 MB/s. What is the maximum burst time t?', opt: ['2.5 ms', '2.0 ms', '5.0 ms', '1.0 ms'], ans: 0, explanation: 't = C / (M - r) = 100 KB / (50 MB/s - 10 MB/s) = 100 KB / 40 MB/s = 2.5 ms.' }
    ]
  },

  'cn_app_protocols': {
    title: 'Application Protocols (DNS, HTTP, FTP, SMTP, POP3, IMAP)',
    subject: 'Computer Networks',
    diff: 'Medium',
    time: '25 min',
    prereq: 'Transport Layer Port Numbers & Socket Programming',
    intro: 'Application layer protocols provide standardized network services to end-user applications. This handbook reference summarizes port numbers, transport layer protocols, stateful/stateless behavior, and push/pull dynamics.',
    sections: [
      {
        heading: '1. Master Application Protocols Handbook Table',
        text: `
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:14px; margin-bottom:14px; overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:11px; text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-color); color:var(--accent-primary);">
                  <th style="padding:6px;">Protocol</th>
                  <th style="padding:6px;">Port #</th>
                  <th style="padding:6px;">Transport Protocol</th>
                  <th style="padding:6px;">Stateful / Stateless</th>
                  <th style="padding:6px;">Push / Pull</th>
                  <th style="padding:6px;">In-Band / Out-of-Band</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#3B82F6;">DNS</td>
                  <td style="padding:6px;">53</td>
                  <td style="padding:6px;">UDP</td>
                  <td style="padding:6px;">Stateless</td>
                  <td style="padding:6px;">-</td>
                  <td style="padding:6px;">In-band</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#10B981;">HTTP</td>
                  <td style="padding:6px;">80</td>
                  <td style="padding:6px;">TCP</td>
                  <td style="padding:6px;">Stateless</td>
                  <td style="padding:6px;">-</td>
                  <td style="padding:6px;">In-band</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#F59E0B;">SMTP</td>
                  <td style="padding:6px;">25</td>
                  <td style="padding:6px;">TCP</td>
                  <td style="padding:6px;">Stateless</td>
                  <td style="padding:6px; font-weight:700; color:#10B981;">Push Protocol</td>
                  <td style="padding:6px;">In-band</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700;">POP3</td>
                  <td style="padding:6px;">110</td>
                  <td style="padding:6px;">TCP</td>
                  <td style="padding:6px;">Stateful</td>
                  <td style="padding:6px; font-weight:700; color:#3B82F6;">Pull Protocol</td>
                  <td style="padding:6px;">In-band</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700;">IMAP4</td>
                  <td style="padding:6px;">143</td>
                  <td style="padding:6px;">TCP</td>
                  <td style="padding:6px;">Stateful</td>
                  <td style="padding:6px; font-weight:700; color:#3B82F6;">Pull Protocol</td>
                  <td style="padding:6px;">In-band</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:700; color:#8B5CF6;">FTP</td>
                  <td style="padding:6px;">20 (Data), 21 (Control)</td>
                  <td style="padding:6px;">TCP</td>
                  <td style="padding:6px;">Stateful</td>
                  <td style="padding:6px;">Control (Persistent), Data (Non-persistent)</td>
                  <td style="padding:6px; font-weight:700; color:#EF4444;">Out-of-Band</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        heading: '2. HTTP 1.0 vs HTTP 1.1 & FTP Dual Channels',
        text: `
          <div style="background:var(--bg-surface-hover); border-left:4px solid var(--accent-primary); border-radius:6px; padding:12px 14px; margin-bottom:14px; font-size:12px;">
            <strong>HTTP 1.0 vs HTTP 1.1:</strong><br>
            • <strong>HTTP 1.0:</strong> Non-persistent connection. One TCP connection per request/response. For an HTML file with N inline images, connection opens/closes <code>N + 1</code> times.<br>
            • <strong>HTTP 1.1:</strong> Persistent connection. Server leaves TCP connection open for multiple request/response cycles.<br><br>

            <strong>FTP Dual Channels (Out-of-Band):</strong><br>
            • <strong>Control Connection (Port 21):</strong> Opens first and stays connected during entire FTP session (Persistent, In-Band control commands like USER, PASS, CWD).<br>
            • <strong>Data Connection (Port 20):</strong> Opened and closed dynamically for each file transfer activity (Non-persistent).
          </div>
        `
      }
    ],
    summary: 'SMTP (port 25) is a push protocol using 7-bit ASCII text. POP3 (port 110) and IMAP4 (port 143) are pull protocols. FTP uses dual channels out-of-band (port 21 control, port 20 data). HTTP 1.0 is non-persistent while HTTP 1.1 is persistent.',
    pyqs: [
      { year: '2024', q: 'Which application layer protocol is an OUT-OF-BAND protocol using separate TCP connections for control and data?', opt: ['HTTP', 'SMTP', 'FTP', 'POP3'], ans: 2, explanation: 'FTP is an out-of-band protocol that uses Port 21 for control commands and Port 20 for actual file data transfers.' }
    ]
  },

  'dbms_normalization': {
    title: 'Normalization (1NF, 2NF, 3NF, BCNF)',
    subject: 'Database Management Systems',
    diff: 'Hard',
    time: '30 min',
    prereq: 'Functional Dependencies & Candidate Key Closures',
    intro: 'Normalization is the systematic approach of decomposing tables to eliminate data redundancy (Insertion, Deletion, and Update Anomalies) while ensuring Lossless Join and Dependency Preservation.',
    sections: [
      {
        heading: '1. Normal Form Hierarchy Rules',
        text: `
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:14px; margin-bottom:14px;">
            <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-color); color:var(--accent-primary);">
                  <th style="padding:6px;">Normal Form</th>
                  <th style="padding:6px;">Condition for Functional Dependency X ➔ Y</th>
                  <th style="padding:6px;">Eliminates</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#F5F5F5;">1NF</td>
                  <td style="padding:6px;">All attributes contain atomic values (no composite/multi-valued attributes)</td>
                  <td style="padding:6px;">Repeating groups</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#F5F5F5;">2NF</td>
                  <td style="padding:6px;">Must be in 1NF + No Partial Dependency (Non-prime attribute dependent on part of candidate key)</td>
                  <td style="padding:6px;">Partial dependencies</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#10B981;">3NF</td>
                  <td style="padding:6px;">Must be in 2NF + For every X ➔ Y, either <strong>X is a Super Key</strong> OR <strong>Y is a Prime Attribute</strong></td>
                  <td style="padding:6px;">Transitive dependencies</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:700; color:#3B82F6;">BCNF</td>
                  <td style="padding:6px;">For every non-trivial FD X ➔ Y, <strong>X MUST be a Super Key</strong></td>
                  <td style="padding:6px;">All functional dependency anomalies</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        heading: '2. BCNF vs 3NF Tradeoff Rule',
        text: `
          <div style="background:var(--bg-surface-hover); border-left:4px solid #F59E0B; border-radius:6px; padding:12px 14px; margin-bottom:14px; font-size:12px;">
            <strong style="color:#F59E0B;">Golden Rule for GATE:</strong><br>
            - Any relation can always be decomposed into <strong>3NF</strong> preserving both Lossless Join AND Dependency Preservation.<br>
            - Decomposing into <strong>BCNF</strong> guarantees Lossless Join, but might NOT preserve Dependency Preservation!
          </div>
        `
      }
    ],
    summary: '1NF = Atomic values. 2NF = No partial dependencies. 3NF = X is super key OR Y is prime attribute. BCNF = X is super key for all non-trivial FDs.',
    pyqs: [
      { year: '2025', q: 'Relation R(A,B,C,D) with FDs: {A➔B, B➔C, C➔D}. What is the highest normal form of R?', opt: ['1NF', '2NF', '3NF', 'BCNF'], ans: 0, explanation: 'Candidate Key is A. FD B➔C has B not super key and C non-prime attribute (transitive dependency). Thus R is in 1NF.' }
    ]
  }
};

function initRevisionModule() {
  const container = document.getElementById('revision-content-area') || document.getElementById('revision-main-content');
  if (!container) return;

  renderLearningCenterWorkspace(container);
}

function renderLearningCenterWorkspace(container) {
  const subData = LEARNING_SYLLABUS_DB[currentSelectedSubject] || LEARNING_SYLLABUS_DB['cn'];
  const topicContent = RICH_TOPIC_CONTENTS[currentSelectedTopicId] || buildGenericTopicFallback(currentSelectedTopicId, subData);

  container.innerHTML = `
    <!-- Top Learning Center Header Bar -->
    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:12px 16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <h2 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; color:var(--text-main); margin-bottom:2px;">Learning Center</h2>
        <p style="color:var(--text-sub); font-size:12px;">Grounded in GATE Wallah CS/IT Official Handbook Textbook.</p>
      </div>

      <!-- Subject Switcher Dropdown & Search -->
      <div style="display:flex; gap:10px; align-items:center;">
        <select id="learn-subject-switcher" onchange="switchLearnSubject(this.value)" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:6px 12px; border-radius:6px; font-size:12px; font-weight:600;">
          ${Object.keys(LEARNING_SYLLABUS_DB).map(key => `
            <option value="${key}" ${currentSelectedSubject === key ? 'selected' : ''}>${LEARNING_SYLLABUS_DB[key].title}</option>
          `).join('')}
        </select>

        <div style="position:relative;">
          <input type="text" id="learn-search-input" placeholder="Search topic or formula..." oninput="filterLearnTopics(this.value)" style="background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-main); padding:6px 10px 6px 30px; border-radius:6px; font-size:12px; width:200px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
        </div>
      </div>
    </div>

    <!-- 2-Column GitBook Layout (Left Navigation Sidebar + Right Content Area) -->
    <div style="display:grid; grid-template-columns:260px 1fr; gap:14px; align-items:start;">
      
      <!-- Left Collapsible Sidebar Navigation -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:12px; max-height:calc(100vh - 140px); overflow-y:auto;" id="learn-sidebar-nav">
        <div style="font-size:11px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
          <span>${subData.title}</span>
          <span style="font-size:10px; color:var(--text-muted);">${countTotalTopics(subData)} Topics</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          ${subData.chapters.map((chap, cIdx) => `
            <div>
              <div style="font-size:12px; font-weight:700; color:var(--text-main); margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <span style="font-size:10px; color:var(--accent-primary);">▼</span>
                <span>${chap.name}</span>
              </div>
              <div style="display:flex; flex-direction:column; gap:2px; padding-left:12px;">
                ${chap.topics.map(t => {
                  const isActive = t.id === currentSelectedTopicId;
                  const isDone = userCompletedTopics[t.id];
                  return `
                    <button class="learn-topic-btn ${isActive ? 'active' : ''}" 
                      style="background:${isActive ? 'var(--accent-subtle)' : 'transparent'}; border:none; color:${isActive ? 'var(--accent-primary)' : 'var(--text-sub)'}; font-size:11px; text-align:left; padding:5px 8px; border-radius:4px; cursor:pointer; font-weight:${isActive ? '700' : '400'}; display:flex; justify-content:space-between; align-items:center; transition:all 0.15s;"
                      onclick="selectLearnTopic('${t.id}')">
                      <span style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${t.title}</span>
                      ${isDone ? '<span style="color:var(--color-success); font-size:10px;">✓</span>' : ''}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Right Main Reading Workspace Content -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:20px;" id="learn-reading-workspace">
        ${renderTopicContentReadingView(topicContent)}
      </div>

    </div>
  `;
}

function renderTopicContentReadingView(c) {
  const isDone = userCompletedTopics[c.id || currentSelectedTopicId];
  const isBked = userBookmarkedTopics[c.id || currentSelectedTopicId];

  return `
    <!-- Topic Title & Meta Info -->
    <div style="border-bottom:1px solid var(--border-color); padding-bottom:14px; margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
        <div>
          <div style="display:flex; gap:6px; align-items:center; margin-bottom:4px;">
            <span style="background:rgba(59,130,246,0.15); color:var(--accent-primary); font-size:10px; font-weight:700; padding:2px 8px; border-radius:4px; text-transform:uppercase;">${c.subject}</span>
            <span style="font-size:10px; font-weight:700; color:${c.diff === 'Hard' ? '#EF4444' : c.diff === 'Easy' ? '#10B981' : '#F59E0B'}; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px;">${c.diff}</span>
            <span style="font-size:11px; color:var(--text-muted);">&bull; Est. ${c.time}</span>
          </div>
          <h1 style="font-family:'Outfit', sans-serif; font-size:24px; font-weight:700; color:var(--text-main); margin-bottom:4px;">${c.title}</h1>
          <p style="font-size:12px; color:var(--text-sub); margin:0;">Prerequisites: <strong>${c.prereq || 'Basic Computing Concepts'}</strong></p>
        </div>

        <!-- Action Controls -->
        <div style="display:flex; gap:8px;">
          <button class="btn-secondary" style="font-size:11px; padding:4px 10px; ${isBked ? 'border-color:#F59E0B; color:#F59E0B;' : ''}" onclick="toggleBookmarkTopic('${c.id || currentSelectedTopicId}')">
            ${isBked ? 'Bookmarked' : 'Bookmark Topic'}
          </button>
          <button class="btn-primary" style="font-size:11px; padding:4px 12px; ${isDone ? 'background:#10B981;' : ''}" onclick="toggleMarkTopicCompleted('${c.id || currentSelectedTopicId}')">
            ${isDone ? '✓ Completed' : 'Mark Completed'}
          </button>
        </div>
      </div>
    </div>

    <!-- Introduction Box -->
    <div style="background:var(--bg-surface-hover); border-left:3px solid var(--accent-primary); padding:12px 14px; border-radius:6px; font-size:13px; color:var(--text-main); line-height:1.6; margin-bottom:16px;">
      ${c.intro}
    </div>

    <!-- Topic Sections Body -->
    <div style="display:flex; flex-direction:column; gap:16px; line-height:1.6;">
      ${(c.sections || []).map(sec => `
        <div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:var(--text-main); margin-bottom:8px;">${sec.heading}</h3>
          <div style="font-size:13px; color:var(--text-main);">${sec.text}</div>
        </div>
      `).join('')}
    </div>

    <!-- One-Page Summary Box -->
    <div style="background:rgba(59,130,246,0.06); border:1px solid rgba(59,130,246,0.25); border-radius:8px; padding:14px; margin-top:20px;">
      <div style="font-size:12px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; margin-bottom:4px;">One-Page Revision Summary</div>
      <p style="font-size:12px; color:var(--text-main); margin:0; line-height:1.5;">${c.summary || 'Summary notes available upon completing topic exercises.'}</p>
    </div>

    <!-- PYQs & Practice Section -->
    ${c.pyqs && c.pyqs.length > 0 ? `
      <div style="margin-top:20px; border-top:1px solid var(--border-color); padding-top:16px;">
        <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:var(--text-main); margin-bottom:10px;">Official GATE PYQ Reference</h3>
        ${c.pyqs.map(p => `
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:12px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-bottom:6px;">
              <span>GATE ${p.year} Official Paper</span>
              <span style="color:var(--color-success); font-weight:700;">1 Mark</span>
            </div>
            <div style="font-size:13px; color:var(--text-main); margin-bottom:10px; font-weight:600;">${p.q}</div>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:12px; margin-bottom:10px;">
              ${p.opt.map((o, idx) => `
                <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:6px 10px; border-radius:4px; color:${idx === p.ans ? '#10B981' : 'var(--text-main)'};">
                  ${String.fromCharCode(65 + idx)}) ${o} ${idx === p.ans ? '✓' : ''}
                </div>
              `).join('')}
            </div>

            <div style="font-size:11px; color:var(--text-sub); background:rgba(0,0,0,0.3); padding:8px 10px; border-radius:4px;">
              <strong>Solution Explanation:</strong> ${p.explanation}
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <!-- Next & Previous Topic Navigation Footer -->
    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); margin-top:24px; padding-top:14px;">
      <button class="btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="navigateLearnTopicPrev()">← Previous Topic</button>
      <button class="btn-primary" style="font-size:12px; padding:6px 16px;" onclick="navigateLearnTopicNext()">Next Topic →</button>
    </div>
  `;
}

function buildGenericTopicFallback(topicId, subData) {
  let matchedTitle = 'GATE Core Topic Guide';
  let matchedDiff = 'Medium';
  let matchedTime = '15 min';

  subData.chapters.forEach(chap => {
    chap.topics.forEach(t => {
      if (t.id === topicId) {
        matchedTitle = t.title;
        matchedDiff = t.diff;
        matchedTime = t.time;
      }
    });
  });

  return {
    id: topicId,
    title: matchedTitle,
    subject: subData.title,
    diff: matchedDiff,
    time: matchedTime,
    prereq: 'Core Fundamental Computing Concepts',
    intro: `Welcome to the comprehensive guide for <strong>${matchedTitle}</strong>. This module covers core theorems, mathematical derivations, architecture diagrams, and GATE CSE problem-solving techniques.`,
    sections: [
      {
        heading: '1. Overview & Core Concepts',
        text: `The study of <strong>${matchedTitle}</strong> is essential for solving 1-mark and 2-mark GATE questions. Focus on understanding the underlying properties and avoiding standard time-bound pitfalls.`
      },
      {
        heading: '2. Essential Formulae & Derivations',
        text: `
          <div style="background:var(--bg-surface-hover); border-left:3px solid var(--accent-primary); padding:10px 12px; border-radius:6px; font-size:12px;">
            Key Formula: <code>Complexity T(n) = O(n log n)</code> &bull; Maximum Nodes: <code>2^(h+1) - 1</code>
          </div>
        `
      }
    ],
    summary: `${matchedTitle} forms a critical component of ${subData.title}. Master the definitions, practice PYQs, and revise the formula sheet prior to mock exams.`,
    pyqs: []
  };
}

function countTotalTopics(subData) {
  let count = 0;
  subData.chapters.forEach(c => count += c.topics.length);
  return count;
}

function switchLearnSubject(subKey) {
  currentSelectedSubject = subKey;
  const subData = LEARNING_SYLLABUS_DB[subKey];
  if (subData && subData.chapters[0] && subData.chapters[0].topics[0]) {
    currentSelectedTopicId = subData.chapters[0].topics[0].id;
  }
  const container = document.getElementById('revision-content-area') || document.getElementById('revision-main-content');
  if (container) renderLearningCenterWorkspace(container);
}

function selectLearnTopic(tId) {
  currentSelectedTopicId = tId;
  const workspace = document.getElementById('learn-reading-workspace');
  if (workspace) {
    const subData = LEARNING_SYLLABUS_DB[currentSelectedSubject] || LEARNING_SYLLABUS_DB['cn'];
    const topicContent = RICH_TOPIC_CONTENTS[tId] || buildGenericTopicFallback(tId, subData);
    workspace.innerHTML = renderTopicContentReadingView(topicContent);
  }

  // Update active state in sidebar
  document.querySelectorAll('.learn-topic-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.background = 'transparent';
    btn.style.color = 'var(--text-sub)';
  });

  const activeBtn = Array.from(document.querySelectorAll('.learn-topic-btn')).find(b => b.getAttribute('onclick')?.includes(tId));
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.style.background = 'var(--accent-subtle)';
    activeBtn.style.color = 'var(--accent-primary)';
  }
}

function toggleMarkTopicCompleted(tId) {
  userCompletedTopics[tId] = !userCompletedTopics[tId];
  selectLearnTopic(tId);
}

function toggleBookmarkTopic(tId) {
  userBookmarkedTopics[tId] = !userBookmarkedTopics[tId];
  selectLearnTopic(tId);
}

function navigateLearnTopicNext() {
  const subData = LEARNING_SYLLABUS_DB[currentSelectedSubject];
  if (!subData) return;
  
  const allTopics = [];
  subData.chapters.forEach(c => c.topics.forEach(t => allTopics.push(t.id)));

  const idx = allTopics.indexOf(currentSelectedTopicId);
  if (idx > -1 && idx < allTopics.length - 1) {
    selectLearnTopic(allTopics[idx + 1]);
  }
}

function navigateLearnTopicPrev() {
  const subData = LEARNING_SYLLABUS_DB[currentSelectedSubject];
  if (!subData) return;

  const allTopics = [];
  subData.chapters.forEach(c => c.topics.forEach(t => allTopics.push(t.id)));

  const idx = allTopics.indexOf(currentSelectedTopicId);
  if (idx > 0) {
    selectLearnTopic(allTopics[idx - 1]);
  }
}

function filterLearnTopics(query) {
  const cleanQ = query.trim().toLowerCase();
  document.querySelectorAll('.learn-topic-btn').forEach(btn => {
    const txt = btn.textContent.toLowerCase();
    if (!cleanQ || txt.includes(cleanQ)) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
    }
  });
}

window.initRevisionModule = initRevisionModule;
window.switchLearnSubject = switchLearnSubject;
window.selectLearnTopic = selectLearnTopic;
window.toggleMarkTopicCompleted = toggleMarkTopicCompleted;
window.toggleBookmarkTopic = toggleBookmarkTopic;
window.navigateLearnTopicNext = navigateLearnTopicNext;
window.navigateLearnTopicPrev = navigateLearnTopicPrev;
window.filterLearnTopics = filterLearnTopics;

document.addEventListener('DOMContentLoaded', () => {
  initRevisionModule();
});
