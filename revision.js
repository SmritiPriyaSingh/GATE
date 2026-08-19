// Smart Revision Center & Knowledge Vault Platform (Anki Spaced Repetition + Notion Hub)

let activeRevisionTab = 'bookmarks'; // 'bookmarks', 'spaced_queue', 'notes', 'weak_topics', 'recent_wrong'
let searchQuery = '';
let selectedSubject = 'all';
let selectedDifficulty = 'all';

// Demo sample data for rich preview
const DEMO_REVISION_DATA = {
  bookmarks: [
    {
      id: 'cn-arp-1',
      subjectId: 'cn',
      subjectName: 'Computer Networks',
      topic: 'ARP & Address Resolution',
      difficulty: 'Hard',
      text: 'Why does the ARP (Address Resolution Protocol) request use broadcast frame encapsulation while the ARP reply uses unicast frame encapsulation?',
      solution: 'An ARP request is broadcast (FF:FF:FF:FF:FF:FF) because the sender does not yet know the target host MAC address. The target host receives the broadcast, records the sender MAC address in its ARP cache, and sends a unicast reply directly back to the sender since it now knows the sender\'s MAC address.',
      wrongCount: 2,
      lastReviewed: '5 days ago',
      dueDate: 'Due Today',
      status: 'due'
    },
    {
      id: 'algo-binary-search-2',
      subjectId: 'algo',
      subjectName: 'Algorithms',
      topic: 'Binary Search Trees & Recurrences',
      difficulty: 'Medium',
      text: 'What is the tight worst-case time complexity of searching an element in an unbalanced Binary Search Tree with N nodes?',
      solution: 'In the worst case, an unbalanced BST degrades into a skewed linked-list data structure, resulting in O(N) search time complexity.',
      wrongCount: 1,
      lastReviewed: '2 days ago',
      dueDate: 'Due Today',
      status: 'due'
    },
    {
      id: 'dbms-bplus-3',
      subjectId: 'dbms',
      subjectName: 'Databases (DBMS)',
      topic: 'B+ Tree Indexing & Order',
      difficulty: 'Hard',
      text: 'In a B+ tree index of order m, what is the minimum number of keys present in any non-root internal node?',
      solution: 'For a B+ tree of order m (where each node can have at most m pointers), every non-root internal node must contain at least ⌈m/2⌉ - 1 keys.',
      wrongCount: 3,
      lastReviewed: '8 days ago',
      dueDate: 'Due Today',
      status: 'due'
    },
    {
      id: 'os-page-replacement-4',
      subjectId: 'os',
      subjectName: 'Operating Systems',
      topic: 'Virtual Memory & Page Replacement',
      difficulty: 'Hard',
      text: 'Which of the following page replacement algorithms suffers from Belady\'s Anomaly?',
      solution: 'FIFO (First-In, First-Out) page replacement algorithm suffers from Belady\'s Anomaly, where increasing the number of memory page frames can result in more page faults.',
      wrongCount: 1,
      lastReviewed: '12 days ago',
      dueDate: 'Due Tomorrow',
      status: 'upcoming'
    }
  ],
  notes: [
    {
      id: 'note-1',
      topic: 'Recurrence Master Theorem Shortcuts',
      subject: 'Algorithms & Mathematics',
      content: 'T(n) = aT(n/b) + f(n)\n1. If f(n) = O(n^(log_b a - ε)), then T(n) = Θ(n^(log_b a))\n2. If f(n) = Θ(n^(log_b a)), then T(n) = Θ(n^(log_b a) * log n)\n3. If f(n) = Ω(n^(log_b a + ε)), then T(n) = Θ(f(n))',
      tag: '★ Essential Formula',
      date: 'Yesterday'
    },
    {
      id: 'note-2',
      topic: 'Subnetting & Host Formula',
      subject: 'Computer Networks',
      content: 'Usable Hosts per Subnet = 2^(32 - Prefix Length) - 2\n(-2 accounts for Network ID and Broadcast Address)',
      tag: '★★ Quick Trick',
      date: '3 days ago'
    }
  ]
};

function renderRevisionModule() {
  const container = document.getElementById('revision-content-area');
  if (!container) return;

  const isDemo = StorageManager.isDemoMode();

  container.innerHTML = `
    <!-- Header -->
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:16px 20px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <div style="font-size:11px; font-weight:700; color:#3B82F6; text-transform:uppercase;">Knowledge Vault</div>
        <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; color:#F5F5F5; margin-top:2px;">Smart Revision Center</h2>
        <p style="color:#9CA3AF; font-size:12px;">Review bookmarked questions, spaced repetition queues, personal notes, and weak topics.</p>
      </div>

      <!-- Quick Action Buttons -->
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button class="btn-primary" style="font-size:12px; padding:6px 12px;" onclick="switchRevisionTab('spaced_queue')">🚨 Review Due Today (8)</button>
        <button class="btn-secondary" style="font-size:12px; padding:6px 12px; color:#3B82F6; border-color:rgba(59,130,246,0.3);" onclick="switchRevisionTab('weak_topics')">⚡ Weak Topics</button>
      </div>
    </div>

    <!-- 1. Top Summary Stats Row -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:12px; margin-bottom:16px;">
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:12px 14px;">
        <div style="font-size:10px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Bookmarked Questions</div>
        <div style="font-size:22px; font-weight:700; color:#F5F5F5; margin-top:2px;">124 Bookmarks</div>
        <div style="font-size:10px; color:#3B82F6; margin-top:2px;">Saved for Revision</div>
      </div>

      <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:12px 14px;">
        <div style="font-size:10px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Personal Study Notes</div>
        <div style="font-size:22px; font-weight:700; color:#F5F5F5; margin-top:2px;">38 Notes</div>
        <div style="font-size:10px; color:#10B981; margin-top:2px;">Formulas & Shortcuts</div>
      </div>

      <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:12px 14px;">
        <div style="font-size:10px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Weak Focus Topics</div>
        <div style="font-size:22px; font-weight:700; color:#EF4444; margin-top:2px;">7 Weak Topics</div>
        <div style="font-size:10px; color:#EF4444; margin-top:2px;">Needs Reinforcement</div>
      </div>

      <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:12px 14px;">
        <div style="font-size:10px; font-weight:700; color:#9CA3AF; text-transform:uppercase;">Revision Sessions</div>
        <div style="font-size:22px; font-weight:700; color:#F5F5F5; margin-top:2px;">18 Sessions</div>
        <div style="font-size:10px; color:#10B981; margin-top:2px;">Completed Spaced Sprints</div>
      </div>
    </div>

    <!-- 2. Spaced Repetition Due Queues (Anki Queue Cards) -->
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-bottom:16px;">
      <div style="background:rgba(239,68,68,0.1); border:1px solid #EF4444; border-radius:8px; padding:12px; cursor:pointer;" onclick="switchRevisionTab('spaced_queue')">
        <div style="font-size:10px; font-weight:700; color:#EF4444; text-transform:uppercase;">Due Today (High Priority)</div>
        <div style="font-size:20px; font-weight:700; color:#F5F5F5; margin-top:2px;">8 Questions</div>
        <div style="font-size:10px; color:#EF4444; margin-top:2px;">▶ Start Review Sprint ➔</div>
      </div>

      <div style="background:rgba(245,158,11,0.1); border:1px solid #F59E0B; border-radius:8px; padding:12px; cursor:pointer;" onclick="switchRevisionTab('spaced_queue')">
        <div style="font-size:10px; font-weight:700; color:#F59E0B; text-transform:uppercase;">Due Tomorrow</div>
        <div style="font-size:20px; font-weight:700; color:#F5F5F5; margin-top:2px;">4 Questions</div>
        <div style="font-size:10px; color:#F59E0B; margin-top:2px;">Scheduled Review</div>
      </div>

      <div style="background:rgba(59,130,246,0.1); border:1px solid #3B82F6; border-radius:8px; padding:12px; cursor:pointer;" onclick="switchRevisionTab('spaced_queue')">
        <div style="font-size:10px; font-weight:700; color:#3B82F6; text-transform:uppercase;">This Week Queue</div>
        <div style="font-size:20px; font-weight:700; color:#F5F5F5; margin-top:2px;">18 Questions</div>
        <div style="font-size:10px; color:#3B82F6; margin-top:2px;">Spaced Queue Ready</div>
      </div>
    </div>

    <!-- 3. Workspace Tabs Bar -->
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #23262D; margin-bottom:16px; padding-bottom:6px; flex-wrap:wrap; gap:10px;">
      <div style="display:flex; gap:16px;">
        <button style="background:none; border:none; border-bottom:${activeRevisionTab === 'bookmarks' ? '2px solid #3B82F6' : '2px solid transparent'}; color:${activeRevisionTab === 'bookmarks' ? '#F5F5F5' : '#9CA3AF'}; font-weight:${activeRevisionTab === 'bookmarks' ? '700' : '500'}; font-size:13px; cursor:pointer; padding:4px 2px;" onclick="switchRevisionTab('bookmarks')">⭐ Bookmarks (124)</button>
        <button style="background:none; border:none; border-bottom:${activeRevisionTab === 'spaced_queue' ? '2px solid #3B82F6' : '2px solid transparent'}; color:${activeRevisionTab === 'spaced_queue' ? '#F5F5F5' : '#9CA3AF'}; font-weight:${activeRevisionTab === 'spaced_queue' ? '700' : '500'}; font-size:13px; cursor:pointer; padding:4px 2px;" onclick="switchRevisionTab('spaced_queue')">⏱️ Spaced Queue (8)</button>
        <button style="background:none; border:none; border-bottom:${activeRevisionTab === 'notes' ? '2px solid #3B82F6' : '2px solid transparent'}; color:${activeRevisionTab === 'notes' ? '#F5F5F5' : '#9CA3AF'}; font-weight:${activeRevisionTab === 'notes' ? '700' : '500'}; font-size:13px; cursor:pointer; padding:4px 2px;" onclick="switchRevisionTab('notes')">📝 Personal Notes (38)</button>
        <button style="background:none; border:none; border-bottom:${activeRevisionTab === 'weak_topics' ? '2px solid #3B82F6' : '2px solid transparent'}; color:${activeRevisionTab === 'weak_topics' ? '#F5F5F5' : '#9CA3AF'}; font-weight:${activeRevisionTab === 'weak_topics' ? '700' : '500'}; font-size:13px; cursor:pointer; padding:4px 2px;" onclick="switchRevisionTab('weak_topics')">⚠️ Weak Subjects (7)</button>
      </div>
    </div>

    <!-- 4. Filter & Search Controls Bar -->
    <div style="display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap;">
      <div style="flex:1; min-width:240px; position:relative;">
        <input type="text" id="revision-search-input" value="${searchQuery}" placeholder="🔍 Search bookmarked questions, formulas, or topic notes..." style="width:100%; background:#000000; border:1px solid #23262D; color:#F5F5F5; font-size:12px; padding:8px 12px; border-radius:6px;" oninput="onRevisionSearch(this.value)" />
      </div>

      <select id="revision-subject-filter" style="background:#000000; border:1px solid #23262D; color:#F5F5F5; font-size:12px; padding:8px; border-radius:6px; font-weight:600;" onchange="onRevisionSubjectChange(this.value)">
        <option value="all" ${selectedSubject === 'all' ? 'selected' : ''}>All Subjects</option>
        <option value="cn" ${selectedSubject === 'cn' ? 'selected' : ''}>Computer Networks</option>
        <option value="os" ${selectedSubject === 'os' ? 'selected' : ''}>Operating Systems</option>
        <option value="dbms" ${selectedSubject === 'dbms' ? 'selected' : ''}>Databases (DBMS)</option>
        <option value="algo" ${selectedSubject === 'algo' ? 'selected' : ''}>Algorithms</option>
      </select>

      <select id="revision-difficulty-filter" style="background:#000000; border:1px solid #23262D; color:#F5F5F5; font-size:12px; padding:8px; border-radius:6px; font-weight:600;" onchange="onRevisionDifficultyChange(this.value)">
        <option value="all" ${selectedDifficulty === 'all' ? 'selected' : ''}>All Difficulties</option>
        <option value="Easy" ${selectedDifficulty === 'Easy' ? 'selected' : ''}>Easy</option>
        <option value="Medium" ${selectedDifficulty === 'Medium' ? 'selected' : ''}>Medium</option>
        <option value="Hard" ${selectedDifficulty === 'Hard' ? 'selected' : ''}>Hard</option>
      </select>
    </div>

    <!-- 5. Active Tab Content Area -->
    <div id="revision-tab-content-area">
      ${renderTabContent(activeRevisionTab, isDemo)}
    </div>
  `;
}

function renderTabContent(tab, isDemo) {
  if (tab === 'bookmarks' || tab === 'spaced_queue') {
    const list = DEMO_REVISION_DATA.bookmarks.filter(b => {
      if (tab === 'spaced_queue' && b.status !== 'due') return false;
      if (selectedSubject !== 'all' && b.subjectId !== selectedSubject) return false;
      if (selectedDifficulty !== 'all' && b.difficulty !== selectedDifficulty) return false;
      if (searchQuery && !b.text.toLowerCase().includes(searchQuery.toLowerCase()) && !b.topic.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    if (list.length === 0) {
      return `
        <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; text-align:center; padding:36px 20px;">
          <div style="font-size:32px; margin-bottom:8px;">⭐</div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#F5F5F5; margin-bottom:4px;">No Bookmarked Questions Found</h3>
          <p style="color:#9CA3AF; max-width:440px; margin:0 auto 16px auto; font-size:13px; line-height:1.5;">
            Bookmark challenging questions while solving Practice questions or PYQs to build your personal revision queue.
          </p>
          <div style="display:flex; justify-content:center; gap:10px;">
            <button class="btn-primary" style="font-size:12px; padding:8px 16px;" onclick="navigateToView('practice')">Go to Practice Center ➔</button>
            <button class="btn-secondary" style="font-size:12px; padding:8px 16px;" onclick="navigateToView('pyq')">Browse PYQ Papers ➔</button>
          </div>
        </div>
      `;
    }

    return `
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${list.map(q => `
          <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="background:rgba(59,130,246,0.15); color:#3B82F6; border:1px solid #3B82F6; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700;">${q.subjectName}</span>
                <span style="font-size:12px; font-weight:600; color:#F5F5F5;">${q.topic}</span>
                <span style="font-size:10px; color:${q.difficulty === 'Hard' ? '#EF4444' : '#F59E0B'}; font-weight:700;">(${q.difficulty})</span>
              </div>

              <div style="display:flex; align-items:center; gap:10px; font-size:11px; color:#9CA3AF;">
                <span>Wrong ${q.wrongCount}x</span>
                <span>&bull;</span>
                <span>Last reviewed: ${q.lastReviewed}</span>
                <span style="background:rgba(239,68,68,0.15); color:#EF4444; border:1px solid #EF4444; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:700;">${q.dueDate}</span>
              </div>
            </div>

            <div style="font-size:13px; font-weight:600; color:#F5F5F5; margin-bottom:10px; line-height:1.5;">
              ${q.text}
            </div>

            <div style="background:#161920; border-left:3px solid #3B82F6; padding:10px 12px; border-radius:0 6px 6px 0; margin-bottom:12px;">
              <div style="font-size:11px; font-weight:700; color:#3B82F6; margin-bottom:2px;">EXPLANATION & SOLUTION</div>
              <div style="font-size:12px; color:#9CA3AF; line-height:1.5;">${q.solution}</div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:8px;">
              <button class="btn-secondary" style="font-size:11px; padding:4px 10px; color:#EF4444; border-color:rgba(239,68,68,0.3);" onclick="removeBookmark('${q.id}')">Remove ⭐</button>
              <button class="btn-primary" style="font-size:11px; padding:4px 10px;" onclick="markQuestionMastered('${q.id}')">✔ Mark Mastered</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tab === 'notes') {
    return `
      <!-- Add New Note Card -->
      <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:16px; margin-bottom:16px;">
        <div style="font-size:14px; font-weight:700; color:#F5F5F5; margin-bottom:4px;">📝 Write Topic Note & Formula Shortcut</div>
        <p style="color:#9CA3AF; font-size:12px; margin-bottom:12px;">Save key formulas, memory shortcuts, and concept notes directly to your vault.</p>

        <div style="display:flex; gap:10px; margin-bottom:10px;">
          <input type="text" id="custom-note-key" placeholder="Topic Title (e.g. Master Theorem)..." style="flex:1; background:#000000; border:1px solid #23262D; color:#F5F5F5; font-size:12px; padding:8px 12px; border-radius:6px;" />
          <input type="text" id="custom-note-subject" placeholder="Subject Name..." style="width:180px; background:#000000; border:1px solid #23262D; color:#F5F5F5; font-size:12px; padding:8px 12px; border-radius:6px;" />
        </div>
        <textarea id="custom-note-text" placeholder="Write key formulas, shortcuts, or notes here..." style="width:100%; height:90px; background:#000000; border:1px solid #23262D; color:#F5F5F5; font-size:12px; padding:8px 12px; border-radius:6px; font-family:sans-serif;"></textarea>

        <button class="btn-primary" style="font-size:12px; padding:6px 14px; margin-top:10px;" onclick="saveCustomTopicNote()">💾 Save to Vault</button>
      </div>

      <!-- Notes List -->
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${DEMO_REVISION_DATA.notes.map(n => `
          <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <div style="font-size:13px; font-weight:700; color:#3B82F6;">${n.topic}</div>
              <span style="font-size:10px; color:#F59E0B; font-weight:700;">${n.tag}</span>
            </div>
            <div style="font-size:12px; color:#F5F5F5; white-space:pre-line; line-height:1.5;">${n.content}</div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (tab === 'weak_topics') {
    return `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:14px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:13px; font-weight:700; color:#EF4444;">Algorithms &bull; Recurrence Relations & Dynamic Programming</div>
            <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">Accuracy: 58% &bull; 8 Incorrect Attempts</div>
          </div>
          <button class="btn-primary" style="font-size:11px; padding:4px 10px;" onclick="navigateToView('practice')">Practice Sprint ➔</button>
        </div>

        <div style="background:#0F1115; border:1px solid #23262D; border-radius:8px; padding:14px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:13px; font-weight:700; color:#EF4444;">Compiler Design &bull; Lexical Analysis & Parsing Tables</div>
            <div style="font-size:11px; color:#9CA3AF; margin-top:2px;">Accuracy: 54% &bull; 5 Incorrect Attempts</div>
          </div>
          <button class="btn-primary" style="font-size:11px; padding:4px 10px;" onclick="navigateToView('practice')">Practice Sprint ➔</button>
        </div>
      </div>
    `;
  }

  return '';
}

function switchRevisionTab(tab) {
  activeRevisionTab = tab;
  renderRevisionModule();
}

function onRevisionSearch(val) {
  searchQuery = val;
  renderRevisionModule();
}

function onRevisionSubjectChange(val) {
  selectedSubject = val;
  renderRevisionModule();
}

function onRevisionDifficultyChange(val) {
  selectedDifficulty = val;
  renderRevisionModule();
}

function removeBookmark(id) {
  StorageManager.toggleBookmark(id);
  alert('Bookmark removed!');
  renderRevisionModule();
}

function markQuestionMastered(id) {
  alert('Question marked as Mastered in your revision queue!');
  renderRevisionModule();
}

function saveCustomTopicNote() {
  const key = document.getElementById('custom-note-key')?.value.trim();
  const text = document.getElementById('custom-note-text')?.value.trim();

  if (!key || !text) {
    alert('Please enter both a topic title and note content.');
    return;
  }

  StorageManager.saveTopicNotes(key, text);
  alert('Note saved successfully to Knowledge Vault!');
  renderRevisionModule();
}

window.renderRevisionModule = renderRevisionModule;
window.switchRevisionTab = switchRevisionTab;
window.onRevisionSearch = onRevisionSearch;
window.onRevisionSubjectChange = onRevisionSubjectChange;
window.onRevisionDifficultyChange = onRevisionDifficultyChange;
window.removeBookmark = removeBookmark;
window.markQuestionMastered = markQuestionMastered;
window.saveCustomTopicNote = saveCustomTopicNote;

document.addEventListener('DOMContentLoaded', () => {
  renderRevisionModule();
});
