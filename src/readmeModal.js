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
      const link = document.createElement('link');
      link.rel = 'stylesheet';
  link.href = '/readmeModal.css';
      link.id = 'rdm-modal-style';
      document.head.appendChild(link);
    }
  }
  // Show modal
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
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
  document.body.classList.remove('modal-open');
  }
  modal.querySelectorAll('[data-close]').forEach(el => el.onclick = closeModal);
  modal.querySelector('.rdm-backdrop').onclick = closeModal;
  document.addEventListener('keydown', function esc(e){
    if (e.key === 'Escape') closeModal();
  }, { once: true });
}
