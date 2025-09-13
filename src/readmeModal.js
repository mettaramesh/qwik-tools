// readmeModal.js - Render README.md as HTML in a glassmorphism modal, live on click

// Minimal Markdown to HTML converter (headings, bold, italics, code, links, lists, paragraphs)
function simpleMarkdownToHtml(md) {
  md = md.replace(/^# .*(\r?\n)+/, '');
  md = md.replace(/[&<>]/g, t => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[t]));
  md = md.replace(/^###### (.*)$/gm, '<h6>$1</h6>')
         .replace(/^##### (.*)$/gm, '<h5>$1</h5>')
         .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
         .replace(/^### (.*)$/gm, '<h3>$1</h3>')
         .replace(/^## (.*)$/gm, '<h2>$1</h2>')
         .replace(/^# (.*)$/gm, '<h1>$1</h1>');
  md = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
         .replace(/\*(.*?)\*/g, '<em>$1</em>');
  md = md.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  md = md.replace(/```([\s\S]*?)```/g, '<pre class="md-code-block"><code>$1</code></pre>');
  md = md.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  md = md.replace(/^(?:<li>.*<\/li>\s*)+/gm, m => `<ul>${m.replace(/\s*$/,'')}</ul>`);
  md = md.replace(/^(?!<h\d|<ul|<li|<\/ul|<\/li|<p|<strong|<em|<code|<a|<pre)(.+)$/gm, '<p>$1</p>');
  return md;
}

export function showReadmeModal() {
  let modal = document.getElementById('readmeModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'readmeModal';
    modal.className = 'rdm-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="rdm-backdrop" data-close></div>
      <div class="rdm-dialog" role="dialog" aria-modal="true" aria-labelledby="rdm-title">
        <header class="rdm-header" style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <h3 id="rdm-title" style="margin:0;">Qwik-Tools</h3>
          <button class="rdm-close" aria-label="Close" data-close style="margin-left:auto;font-size:1.4rem;background:transparent;border:0;color:var(--color-text-secondary,#9aa7b2);cursor:pointer;padding:6px 8px;border-radius:8px;">&times;</button>
        </header>
        <div class="rdm-body" id="rdm-content" tabindex="0">Loading...</div>
        <footer class="rdm-footer">
          <button class="btn btn--primary" data-close>Close</button>
        </footer>
      </div>
    `;
    document.body.appendChild(modal);
    // Add styles only once
    if (!document.getElementById('rdm-modal-style')) {
      const style = document.createElement('style');
      style.id = 'rdm-modal-style';
      style.textContent = `
      .rdm-modal { position: fixed; inset: 0; display: none; z-index: 9999; }
      .rdm-modal.is-open { display: block; }
      .rdm-backdrop {
        position: absolute; inset: 0;
        background: color-mix(in oklab, #000 55%, transparent);
        backdrop-filter: blur(6px) saturate(120%);
      }
      .rdm-dialog {
        position: relative; margin: 4vh auto 0; max-width: min(960px, 92vw);
        max-height: 88vh; display: flex; flex-direction: column;
        border-radius: 16px;
        background: #fff !important;
        border: 1px solid color-mix(in oklab, var(--color-border, #2a2f47) 70%, transparent);
        box-shadow: 0 20px 60px #0007, inset 0 1px 0 #fff2;
        backdrop-filter: blur(18px) saturate(130%);
        -webkit-backdrop-filter: blur(18px) saturate(130%);
        overflow: hidden;
      }
      .rdm-header, .rdm-footer {
        padding: 12px 16px;
        background: linear-gradient(180deg, #ffffff08, #00000010);
        border-bottom: 1px solid color-mix(in oklab, var(--color-border, #2a2f47) 70%, transparent);
      }
      .rdm-footer { border-top: 1px solid color-mix(in oklab, var(--color-border, #2a2f47) 70%, transparent); border-bottom: 0; }
      .rdm-header h3 { margin: 0; color: var(--color-text, #dfe6ea); font-size: 1.05rem; }
      .rdm-close {
        margin-left: auto; font-size: 1.4rem; line-height: 1;
        background: transparent; border: 0; color: var(--color-text-secondary, #9aa7b2);
        cursor: pointer; padding: 6px 8px; border-radius: 8px;
      }
      .rdm-close:hover { background: #ffffff12; color: var(--color-text, #e9f1f6); }
      .rdm-body {
        padding: 16px 18px; overflow: auto; color: var(--color-text, #222);
        background: #fff !important;
        --prose-muted: #444;
      }
      .rdm-body :is(p, li){ color: var(--prose-muted); line-height: 1.55; }
      .rdm-body h1, .rdm-body h2, .rdm-body h3 { color: var(--color-text, #222); margin: .6em 0 .3em; }
      .rdm-body code { background: #f5f5f5; padding: 0 .35em; border-radius: 6px; }
      .rdm-body pre { background: #f5f5f5; padding: 12px; border-radius: 10px; overflow:auto; }
      .rdm-body a { color: var(--color-accent, #21808d); text-decoration: none; }
      .rdm-body a:hover { text-decoration: underline; }
      .btn.btn--primary{ background: var(--color-primary, #21808d); color: #fff; border: none; padding: 10px 16px; border-radius: 10px; cursor: pointer; }
      .btn.btn--outline{ background: #fff; color: var(--color-primary, #21808d); border: 1.5px solid var(--color-primary, #21808d); padding: 10px 16px; border-radius: 10px; cursor: pointer; }
      @media (prefers-reduced-motion:no-preference){
        .rdm-dialog { transform: translateY(8px); opacity: 0; transition: transform .2s ease, opacity .2s ease; }
        .rdm-modal.is-open .rdm-dialog { transform: translateY(0); opacity: 1; }
      }
      `;
      document.head.appendChild(style);
    }
  }
  // Show modal
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Focus trap
  const content = modal.querySelector('#rdm-content');
  if (content) content.focus();
  // Fetch and render README.md
  fetch('./README.md')
    .then(r => r.text())
    .then(md => {
      content.innerHTML = simpleMarkdownToHtml(md);
    });
  // Close logic
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  modal.querySelectorAll('[data-close]').forEach(el => el.onclick = closeModal);
  modal.querySelector('.rdm-backdrop').onclick = closeModal;
  document.addEventListener('keydown', function esc(e){
    if (e.key === 'Escape') closeModal();
  }, { once: true });
}
