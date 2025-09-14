// QR Code Generator Tool for Qwik
// Uses qrious (browser QR code lib, no dependencies)

export function load(container) {
  container.innerHTML = `
    <div class="tool-header">
      <h2>QR Code Generator</h2>
      <p>Create a QR code for any text, URL, or data</p>
    </div>
    <div class="tool-interface">
      <div class="tool-controls">
        <button class="btn btn--secondary" id="qr-generate-btn">Generate</button>
        <button class="btn btn--outline" id="qr-clear-btn">Clear</button>
      </div>
      <div class="io-container">
        <div class="input-section">
          <div class="section-header">
            <label class="form-label">Input Text or URL</label>
            <button class="btn btn--sm copy-btn" data-target="qr-input">Copy</button>
          </div>
          <textarea id="qr-input" class="form-control code-input" placeholder="Enter text, URL, or data for QR code..." rows="4"></textarea>
        </div>
        <div class="output-section">
          <div class="section-header">
            <label class="form-label">QR Code</label>
            <button class="btn btn--sm" id="qr-download-btn">Download</button>
          </div>
          <div id="qr-code-output" class="qr-code-output" style="text-align:center;padding:16px 0;"></div>
        </div>
        <div id="qr-error" class="error-message hidden"></div>
      </div>
    </div>
  `;
  setup();
}

function setup() {
  const input = document.getElementById('qr-input');
  const generateBtn = document.getElementById('qr-generate-btn');
  const clearBtn = document.getElementById('qr-clear-btn');
  const outputDiv = document.getElementById('qr-code-output');
  const errorDiv = document.getElementById('qr-error');
  const downloadBtn = document.getElementById('qr-download-btn');

  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');
  }
  function clearError() {
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
  }

  // Copy button logic
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.onclick = function() {
      const targetId = btn.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) {
        navigator.clipboard.writeText(target.value || '').then(() => {
          const oldText = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = oldText; }, 1000);
        });
      }
    };
  });

  let qr = null;
  function renderQR() {
    clearError();
    outputDiv.innerHTML = '';
    const text = input.value.trim();
    if (!text) {
      showError('Please enter text or a URL to generate a QR code.');
      return;
    }
    // Dynamically load qrious if not present
    if (!window.QRious) {
      const script = document.createElement('script');
      script.src = '/public/qrious.min.js';
      script.onload = () => renderQR();
      document.body.appendChild(script);
      return;
    }
    qr = new window.QRious({
      value: text,
      size: 220,
      background: 'white',
      foreground: '#222',
      level: 'H',
    });
    const img = document.createElement('img');
  img.src = qr.toDataURL();
  img.alt = 'QR Code';
  img.className = 'qr-img';
  outputDiv.appendChild(img);
  }

  generateBtn.onclick = renderQR;
  clearBtn.onclick = () => {
    input.value = '';
    outputDiv.innerHTML = '';
    clearError();
  };
  downloadBtn.onclick = () => {
    if (!qr) return;
    const a = document.createElement('a');
    a.href = qr.toDataURL();
    a.download = 'qr-code.png';
    a.click();
  };
}
