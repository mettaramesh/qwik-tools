import './router.js';
import { Qwik } from './Qwik.js';
import { showReadmeModal } from './readmeModal.js';
import { calculateSubnet } from './subnetCalculator.js';

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
    modal.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
  }
  if (modal && !localStorage.getItem(consentKey)) {
    modal.classList.remove('hidden');
    modal.classList.add('modal-open');
    document.body.classList.add('modal-open');
    // Guard to prevent multiple attachments
    if (!modal._listenersAttached) {
      const acceptBtn = document.getElementById('clipboard-consent-accept');
      const denyBtn = document.getElementById('clipboard-consent-deny');
      if (acceptBtn) {
        acceptBtn.onclick = () => {
          localStorage.setItem(consentKey, 'accepted');
          closeModal();
          // Qwik is initialized in main.js - don't create duplicate instance
        };
      }
      if (denyBtn) {
        denyBtn.onclick = () => {
          localStorage.setItem(consentKey, 'denied');
          closeModal();
          // Qwik is initialized in main.js - don't create duplicate instance
        };
      }
      modal._listenersAttached = true;
    }
    return;
  }
  // Qwik is initialized in main.js - don't create duplicate instance here

  document.querySelectorAll('.nav-category').forEach(cat => {
    const items = cat.querySelector('.category-items');
    if (cat.classList.contains('nav-favourites')) {
      items.classList.remove('hidden');
    } else {
      items.classList.add('hidden');
    }
  });

  document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', () => {
      const cat = header.parentElement;
      const items = cat.querySelector('.category-items');
      if (!items) return;
      items.classList.toggle('hidden');
    });
  });

  // Remove navigation event listeners from main.js to avoid conflicts and double-handling
  // Only Qwik.js should handle navigation and nav-item click events

  // Why Qwik-tools button shows README modal as HTML
  const whyQwikBtn = document.getElementById('why-qwik-header');
  if (whyQwikBtn) {
    whyQwikBtn.addEventListener('click', showReadmeModal);
  }

  // Wire up Readme button to showReadmeModal
  const readmeBtn = document.getElementById('openReadme');
  if (readmeBtn) {
    readmeBtn.addEventListener('click', showReadmeModal);
  }

  // Tool switching logic
  function showTool(toolId) {
    document.querySelectorAll('.tool-container').forEach(el => el.classList.add('hidden'));
    const el = document.getElementById(toolId);
    if (el) el.classList.remove('hidden');
  }

});
