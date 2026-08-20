// GitBook / Notion Docs-Style Learning Center Module (GATE CSE Complete Syllabus)

let currentSelectedSubject = 'cn'; // default active subject: Computer Networks
let currentSelectedTopicId = 'cn_osi_intro';
let userCompletedTopics = {};
let userBookmarkedTopics = {};

// Complete Syllabus Hierarchy Database (11 Core GATE Subjects & Chapters)
const LEARNING_SYLLABUS_DB = {
  'aptitude': {
    title: 'General Aptitude',
    icon: 'Brain',
    chapters: [
      {
        name: 'Quantitative Aptitude',
        topics: [
          { id: 'apt_quant_num', title: 'Numbers & Percentages', diff: 'Easy', time: '12 min' },
          { id: 'apt_quant_ratio', title: 'Ratio, Proportion & Mixture', diff: 'Easy', time: '15 min' },
          { id: 'apt_quant_work', title: 'Time, Work & Efficiency', diff: 'Medium', time: '18 min' },
          { id: 'apt_quant_speed', title: 'Speed, Distance & Time', diff: 'Medium', time: '15 min' }
        ]
      },
      {
        name: 'Logical Reasoning',
        topics: [
          { id: 'apt_lr_relations', title: 'Blood Relations & Family Trees', diff: 'Easy', time: '10 min' },
          { id: 'apt_lr_syllogism', title: 'Syllogism & Venn Diagrams', diff: 'Medium', time: '15 min' },
          { id: 'apt_lr_seating', title: 'Linear & Circular Seating', diff: 'Medium', time: '18 min' }
        ]
      },
      {
        name: 'Verbal Ability',
        topics: [
          { id: 'apt_verb_grammar', title: 'English Grammar & Usage', diff: 'Easy', time: '10 min' },
          { id: 'apt_verb_rc', title: 'Reading Comprehension & Inference', diff: 'Medium', time: '15 min' }
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
          { id: 'math_dm_combinatorics', title: 'Permutations, Combinations & Counting', diff: 'Hard', time: '25 min' },
          { id: 'math_dm_graphs', title: 'Graph Theory & Isomorphism', diff: 'Hard', time: '25 min' }
        ]
      },
      {
        name: 'Linear Algebra',
        topics: [
          { id: 'math_la_matrix', title: 'Matrices, Determinants & Rank', diff: 'Easy', time: '15 min' },
          { id: 'math_la_eigen', title: 'Eigenvalues, Eigenvectors & Cayley-Hamilton', diff: 'Hard', time: '25 min' }
        ]
      },
      {
        name: 'Calculus & Probability',
        topics: [
          { id: 'math_calc_limits', title: 'Limits, Continuity & Mean Value Theorems', diff: 'Medium', time: '20 min' },
          { id: 'math_prob_bayes', title: 'Conditional Probability & Bayes Theorem', diff: 'Hard', time: '22 min' },
          { id: 'math_prob_dist', title: 'Random Variables & Probability Distributions', diff: 'Medium', time: '20 min' }
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
  'cn': {
    title: 'Computer Networks',
    icon: 'Globe',
    chapters: [
      {
        name: 'OSI & TCP/IP Architectures',
        topics: [
          { id: 'cn_osi_intro', title: 'OSI 7 Layer Model & Encapsulation', diff: 'Easy', time: '15 min' },
          { id: 'cn_tcp_ip', title: 'TCP/IP Protocol Suite & PDU Mapping', diff: 'Easy', time: '12 min' }
        ]
      },
      {
        name: 'Data Link & Network Layers',
        topics: [
          { id: 'cn_framing_crc', title: 'Framing, Error Control (CRC) & Flow Control', diff: 'Medium', time: '22 min' },
          { id: 'cn_ip_subnets', title: 'IPv4 Addressing, Subnetting & CIDR', diff: 'Hard', time: '30 min' },
          { id: 'cn_routing', title: 'Routing Protocols (Distance Vector & Link State)', diff: 'Hard', time: '25 min' }
        ]
      },
      {
        name: 'Transport & Application Layers',
        topics: [
          { id: 'cn_tcp_handshake', title: 'TCP 3-Way Handshake & Flow Control', diff: 'Medium', time: '20 min' },
          { id: 'cn_congestion', title: 'TCP Congestion Control (Slow Start & Fast Retransmit)', diff: 'Hard', time: '25 min' },
          { id: 'cn_app_protocols', title: 'DNS, HTTP/1.1 vs HTTP/2, FTP, SMTP', diff: 'Medium', time: '18 min' },
          { id: 'cn_security', title: 'Network Security, RSA & Firewalls', diff: 'Medium', time: '20 min' }
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
  }
};

// Rich Learning Material Repository for Core Topics
const RICH_TOPIC_CONTENTS = {
  'cn_osi_intro': {
    title: 'OSI 7 Layer Model & Encapsulation',
    subject: 'Computer Networks',
    diff: 'Easy',
    time: '15 min',
    prereq: 'Basic Understanding of Data Transmission & Networks',
    intro: 'The Open Systems Interconnection (OSI) model is a conceptual framework created by ISO in 1984. It characterizes and standardizes the communication functions of a telecommunication or computing system into 7 distinct layers.',
    sections: [
      {
        heading: '1. The 7 OSI Layers & PDU Data Units',
        text: `
          <div style="background:var(--bg-surface-hover); border:1px solid var(--border-color); border-radius:8px; padding:14px; margin-bottom:14px;">
            <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-color); color:var(--accent-primary);">
                  <th style="padding:6px;">Layer #</th>
                  <th style="padding:6px;">Layer Name</th>
                  <th style="padding:6px;">PDU (Data Unit)</th>
                  <th style="padding:6px;">Primary Addressing / Hardware</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#EF4444;">Layer 7</td>
                  <td style="padding:6px;">Application</td>
                  <td style="padding:6px;">Data / Message</td>
                  <td style="padding:6px;">HTTP, DNS, FTP, SMTP (User Services)</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#F59E0B;">Layer 6</td>
                  <td style="padding:6px;">Presentation</td>
                  <td style="padding:6px;">Data</td>
                  <td style="padding:6px;">SSL/TLS, Encryption, Data Compression</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#F59E0B;">Layer 5</td>
                  <td style="padding:6px;">Session</td>
                  <td style="padding:6px;">Data</td>
                  <td style="padding:6px;">RPC, Session Checkpoints, Sockets</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#3B82F6;">Layer 4</td>
                  <td style="padding:6px;">Transport</td>
                  <td style="padding:6px;">Segment (TCP) / Datagram (UDP)</td>
                  <td style="padding:6px;">Port Numbers (0 - 65535), End-to-End Reliability</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#3B82F6;">Layer 3</td>
                  <td style="padding:6px;">Network</td>
                  <td style="padding:6px;">Packet</td>
                  <td style="padding:6px;">IP Address (IPv4/v6), Routers</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:6px; font-weight:700; color:#10B981;">Layer 2</td>
                  <td style="padding:6px;">Data Link</td>
                  <td style="padding:6px;">Frame</td>
                  <td style="padding:6px;">MAC Address (48-bit), Switches, CRC Header</td>
                </tr>
                <tr>
                  <td style="padding:6px; font-weight:700; color:#10B981;">Layer 1</td>
                  <td style="padding:6px;">Physical</td>
                  <td style="padding:6px;">Bits (0/1)</td>
                  <td style="padding:6px;">Hubs, Cables, Fiber Optics, Modulation</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        heading: '2. Visual Diagram: Data Encapsulation Header Stack',
        text: `
          <div style="background:#000000; border:1px solid var(--border-color); border-radius:8px; padding:16px; margin-bottom:14px; text-align:center;">
            <svg width="100%" height="160" viewBox="0 0 540 160" style="max-width:540px;">
              <!-- Application Data -->
              <rect x="20" y="20" width="100" height="36" rx="4" fill="#16181D" stroke="#EF4444" stroke-width="1.5" />
              <text x="70" y="42" fill="#F5F5F5" font-size="11" font-weight="700" text-anchor="middle">Data</text>

              <!-- Transport Header -->
              <rect x="140" y="20" width="40" height="36" rx="4" fill="rgba(59,130,246,0.2)" stroke="#3B82F6" stroke-width="1.5" />
              <text x="160" y="42" fill="#3B82F6" font-size="10" font-weight="700" text-anchor="middle">TH</text>
              <rect x="180" y="20" width="80" height="36" rx="4" fill="#16181D" stroke="#3B82F6" stroke-width="1.5" />
              <text x="220" y="42" fill="#F5F5F5" font-size="11" font-weight="700" text-anchor="middle">Data</text>

              <!-- Network Header -->
              <rect x="280" y="20" width="30" height="36" rx="4" fill="rgba(16,185,129,0.2)" stroke="#10B981" stroke-width="1.5" />
              <text x="295" y="42" fill="#10B981" font-size="9" font-weight="700" text-anchor="middle">NH</text>
              <rect x="310" y="20" width="30" height="36" rx="4" fill="rgba(59,130,246,0.2)" stroke="#3B82F6" stroke-width="1.5" />
              <text x="325" y="42" fill="#3B82F6" font-size="9" font-weight="700" text-anchor="middle">TH</text>
              <rect x="340" y="20" width="60" height="36" rx="4" fill="#16181D" stroke="#10B981" stroke-width="1.5" />
              <text x="370" y="42" fill="#F5F5F5" font-size="11" font-weight="700" text-anchor="middle">Data</text>

              <!-- Flow Arrows -->
              <path d="M 125 38 L 135 38" stroke="#9CA3AF" stroke-width="2" marker-end="url(#arrow)" />
              <path d="M 265 38 L 275 38" stroke="#9CA3AF" stroke-width="2" marker-end="url(#arrow)" />

              <!-- Labels -->
              <text x="70" y="75" fill="#9CA3AF" font-size="10" text-anchor="middle">Layer 7-5 Data</text>
              <text x="200" y="75" fill="#9CA3AF" font-size="10" text-anchor="middle">Layer 4 Segment</text>
              <text x="345" y="75" fill="#9CA3AF" font-size="10" text-anchor="middle">Layer 3 Packet</text>
            </svg>
          </div>
        `
      },
      {
        heading: '3. Key Formulas & Memory Trick Mnemonic',
        text: `
          <div style="background:var(--bg-surface-hover); border-left:4px solid var(--accent-primary); border-radius:6px; padding:12px 16px; margin-bottom:14px;">
            <div style="font-size:12px; font-weight:700; color:var(--accent-primary); margin-bottom:4px;">Mnemonic Trick to Remember OSI 7 Layers (Top to Bottom):</div>
            <div style="font-size:13px; font-weight:600; color:var(--text-main);">"<strong>A</strong>ll <strong>P</strong>eople <strong>S</strong>eem <strong>T</strong>o <strong>N</strong>eed <strong>D</strong>ata <strong>P</strong>rocessing"</div>
            <div style="font-size:11px; color:var(--text-sub); margin-top:4px;">Application &bull; Presentation &bull; Session &bull; Transport &bull; Network &bull; Data Link &bull; Physical</div>
          </div>
        `
      },
      {
        heading: '4. Common GATE Pitfalls & Exam Traps',
        text: `
          <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.3); border-radius:6px; padding:12px 14px; margin-bottom:14px; font-size:12px; color:var(--text-main);">
            <strong style="color:#EF4444;">GATE Exam Trap:</strong> A router operates at <strong>Layer 3 (Network Layer)</strong> and checks IP addresses, but it MUST also implement Layer 1 and Layer 2 to physically receive and parse the frame MAC headers!
          </div>
        `
      }
    ],
    summary: 'The OSI model standardizes networking into 7 layers. Data encapsulation travels top-down (Layer 7 ➔ Layer 1) adding headers at each layer, and decapsulation travels bottom-up (Layer 1 ➔ Layer 7) removing headers.',
    pyqs: [
      { year: '2024', q: 'In the OSI model, encryption and decryption are functions of which layer?', opt: ['Transport Layer', 'Presentation Layer', 'Session Layer', 'Application Layer'], ans: 1, explanation: 'Presentation Layer (Layer 6) handles syntax representation, encryption/decryption (SSL/TLS), and data compression.' }
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
        <p style="color:var(--text-sub); font-size:12px;">Comprehensive GATE Computer Science interactive documentation textbook.</p>
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
