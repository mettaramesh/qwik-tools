// QR Code Generator Tool for Qwik
// Uses qrious (browser QR code lib, no dependencies)

export async function load(container) {
  // Load HTML template from external file
  const html = await fetch('src/qrGenerator.html').then(r => r.text());
  container.innerHTML = html;
  setup();
}

function setup() {

  const input = document.getElementById('qr-input');
  const generateBtn = document.getElementById('qr-generate-btn');
  const outputDiv = document.getElementById('qr-code-output');
  const errorDiv = document.getElementById('qr-error') || (() => {
    // If not present, create and append error div
    const div = document.createElement('div');
    div.id = 'qr-error';
    div.className = 'error-message hidden';
    outputDiv.parentNode.appendChild(div);
    return div;
  })();
  const downloadBtn = document.getElementById('qr-download-btn');
  const clearBtn = document.getElementById('qr-clear-btn');

  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');
  }
  function clearError() {
    errorDiv.textContent = '';
    if (!errorDiv.classList.contains('hidden')) errorDiv.classList.add('hidden');
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
  // Move all styling to CSS, just set src/alt
    outputDiv.appendChild(img);
  }

  generateBtn.onclick = renderQR;
  if (clearBtn) {
    clearBtn.onclick = () => {
      input.value = '';
      outputDiv.innerHTML = '';
      clearError();
    };
  }
  if (downloadBtn) {
    downloadBtn.onclick = () => {
      if (!qr) return;
      const a = document.createElement('a');
      a.href = qr.toDataURL();
      a.download = 'qr-code.png';
      a.click();
    };
  }
}
