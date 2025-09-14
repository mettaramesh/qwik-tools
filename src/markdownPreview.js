// Markdown Preview Tool for Qwik
// Uses the 'marked' library for full markdown support
// To use: add <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script> in your HTML, or load dynamically below

export function load(container) {
  container.innerHTML = `
    <div class="tool-header"><h2>Markdown Preview</h2><p>Preview your Markdown as HTML</p></div>
    <div class="tool-interface">
      <div class="tool-controls">
        <button class="btn btn--secondary" id="md-preview-btn">Preview</button>
        <button class="btn btn--outline" id="md-clear-btn">Clear</button>
      </div>
      <div class="io-container">
        <div class="input-section">
          <div class="section-header">
            <label class="form-label">Markdown Input</label>
            <button class="btn btn--sm copy-btn" data-target="md-input">Copy</button>
          </div>
          <textarea id="md-input" class="form-control code-input" placeholder="Paste or type your Markdown here..." rows="10"></textarea>
        </div>
        <div class="output-section">
          <div class="section-header">
            <label class="form-label">HTML Preview</label>
            <button class="btn btn--sm copy-btn" data-target="md-output">Copy</button>
          </div>
          <div id="md-output" class="form-control code-input markdown-preview" style="background:#fff;color:#111; min-height:10em; overflow:auto;"></div>
        </div>
      </div>
      <div id="md-error" class="error-message hidden"></div>
    </div>
  `;
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
