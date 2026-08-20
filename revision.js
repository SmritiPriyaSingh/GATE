// Learn Center Module (Formerly Revision)

function initRevisionModule() {
  const container = document.getElementById('revision-content-area') || document.getElementById('revision-main-content');
  if (!container) return;

  container.innerHTML = `
    <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:20px; margin-bottom:16px;">
      <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:700; color:#F5F5F5; margin-bottom:4px;">Learn Center</h2>
      <p style="color:#9CA3AF; font-size:12px;">Structured learning resources, concept guides, and study materials.</p>
    </div>

    <div style="background:#0F1115; border:1px solid #23262D; border-radius:10px; padding:48px 24px; text-align:center;">
      <div style="width:48px; height:48px; border-radius:50%; background:rgba(59,130,246,0.1); color:#3B82F6; display:flex; align-items:center; justify-content:center; margin:0 auto 14px auto;">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
      </div>
      <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#F5F5F5; margin-bottom:6px;">Learn Center Ready</h3>
      <p style="color:#9CA3AF; max-width:480px; margin:0 auto 16px auto; font-size:13px; line-height:1.5;">
        This section is set up and ready for your custom learning content.
      </p>
    </div>
  `;
}

window.initRevisionModule = initRevisionModule;

document.addEventListener('DOMContentLoaded', () => {
  initRevisionModule();
});
