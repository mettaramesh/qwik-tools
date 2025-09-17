// Markdown Preview Tool for Qwik
// Uses the 'marked' library for full markdown support
// To use: add <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script> in your HTML, or load dynamically below

export async function load(container) {
  const html = await fetch('markdownPreview.html').then(r => r.text());
  container.innerHTML = html;
  if (typeof setup === 'function') setup();
}

export function setup() {
  const input = document.getElementById('md-input');
  const output = document.getElementById('md-output');
  const previewBtn = document.getElementById('md-preview-btn');
  const clearBtn = document.getElementById('md-clear-btn');
  const errorDiv = document.getElementById('md-error');

  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');
  }
  function clearError() {
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
  }

  // Dynamically load marked if not present
  function ensureMarked(cb) {
    if (window.marked) return cb();
    const script = document.createElement('script');
    script.src = '/public/marked.min.js';
    script.onload = cb;
    document.head.appendChild(script);
  }

  function stylePreviewImages() {
    if (!output) return;
    output.querySelectorAll('img').forEach(img => {
      img.style.maxWidth = '200px';
      img.style.maxHeight = '200px';
      img.style.width = 'auto';
      img.style.height = 'auto';
      img.style.objectFit = 'contain';
      img.style.display = 'block';
      img.style.margin = '1em auto';
    });
  }

  // Live preview as you type
  input.addEventListener('input', () => {
    ensureMarked(() => {
      try {
        const html = window.marked.parse(input.value || '');
        output.innerHTML = html;
        stylePreviewImages();
      } catch (e) {
        showError('Markdown parse error: ' + e.message);
      }
    });
  });

  previewBtn.onclick = () => {
    clearError();
    ensureMarked(() => {
      try {
        const html = window.marked.parse(input.value || '');
        output.innerHTML = html;
        stylePreviewImages();
      } catch (e) {
        showError('Markdown parse error: ' + e.message);
      }
    });
  };

  clearBtn.onclick = () => {
    input.value = '';
    output.innerHTML = '';
    clearError();
  };

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.onclick = () => {
      const target = btn.getAttribute('data-target');
      const el = document.getElementById(target);
      if (el) {
        if (el.tagName === 'TEXTAREA') {
          navigator.clipboard.writeText(el.value)
            .then(() => { console.log('Text copied to clipboard successfully!'); })
            .catch(err => { console.error('Failed to copy text: ', err); });
        } else {
          // For HTML preview, copy as plain text
          navigator.clipboard.writeText(el.innerText)
            .then(() => { console.log('Text copied to clipboard successfully!'); })
            .catch(err => { console.error('Failed to copy text: ', err); });
        }
      }
    };
  });

  if (typeof window.setupCopyButtons === 'function') window.setupCopyButtons();
}
