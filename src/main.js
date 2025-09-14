import './router.js';



if ('serviceWorker' in navigator) {
  // Dynamically determine service worker path for subdirectory support
  let swPath = '/service-worker.js';
  if (window.location.pathname && window.location.pathname !== '/' && !window.location.pathname.endsWith('.html')) {
    // If served from a subdirectory, use relative path
    swPath = './service-worker.js';
  }
  navigator.serviceWorker.register(swPath);
}

document.addEventListener('DOMContentLoaded', () => {
  // Clipboard consent modal logic
  const consentKey = 'qwik-clipboard-consent';
  const modal = document.getElementById('clipboard-consent-modal');
  if (!modal) {
    console.error('[Clipboard Modal] Modal element not found in DOM!');
  }
  function closeModal() {
  modal.classList.add('hidden');
  modal.classList.remove('modal-visible');
  document.body.classList.remove('modal-open');
  }
  if (modal && !localStorage.getItem(consentKey)) {
  modal.classList.remove('hidden');
  modal.classList.add('modal-visible');
  document.body.classList.add('modal-open');
    // Guard to prevent multiple attachments
    if (!modal._listenersAttached) {
      const acceptBtn = document.getElementById('clipboard-consent-accept');
      const denyBtn = document.getElementById('clipboard-consent-deny');
      if (acceptBtn) {
        acceptBtn.onclick = () => {
          localStorage.setItem(consentKey, 'accepted');
          closeModal();
          import('./Qwik.js').then(({ Qwik }) => {
            window.qwikApp = new Qwik();
          });
        };
      }
      if (denyBtn) {
        denyBtn.onclick = () => {
          localStorage.setItem(consentKey, 'denied');
          closeModal();
          import('./Qwik.js').then(({ Qwik }) => {
            window.qwikApp = new Qwik();
          });
        };
      }
      modal._listenersAttached = true;
    }
    return;
  }
  import('./Qwik.js').then(({ Qwik }) => {
    window.qwikApp = new Qwik();
  });

  document.querySelectorAll('.nav-category').forEach(cat => {
    const items = cat.querySelector('.category-items');
    if (cat.classList.contains('nav-favourites')) {
      items.classList.remove('nav-items-hidden');
    } else {
      items.classList.add('nav-items-hidden');
    }
  });

  document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', () => {
  const cat = header.parentElement;
  const items = cat.querySelector('.category-items');
  if (!items) return;
  items.classList.toggle('nav-items-hidden');
    });
  });

  // Remove navigation event listeners from main.js to avoid conflicts and double-handling
  // Only Qwik.js should handle navigation and nav-item click events

  // Why Qwik-tools button shows README modal as HTML
  const whyQwikBtn = document.getElementById('why-qwik-header');
  if (whyQwikBtn) {
    whyQwikBtn.addEventListener('click', () => {
      import('./readmeModal.js').then(({ showReadmeModal }) => {
        showReadmeModal();
      });
    });
  }

  // Wire up Readme button to showReadmeModal
  const readmeBtn = document.getElementById('openReadme');
  if (readmeBtn) {
    readmeBtn.addEventListener('click', showReadmeModal);
  }

  // Tool switching logic
  function showTool(toolId) {
  document.querySelectorAll('.tool-container').forEach(el => el.classList.add('tool-hidden'));
  const el = document.getElementById(toolId);
  if (el) el.classList.remove('tool-hidden');
  }

});
