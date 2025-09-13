import './router.js';
import { Qwik } from './Qwik.js';
import { showReadmeModal } from './readmeModal.js';
import { calculateSubnet } from './subnetCalculator.js';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js'); // fixed path for Netlify root
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
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  if (modal && !localStorage.getItem(consentKey)) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Guard to prevent multiple attachments
    if (!modal._listenersAttached) {
      const acceptBtn = document.getElementById('clipboard-consent-accept');
      const denyBtn = document.getElementById('clipboard-consent-deny');
      if (acceptBtn) {
        acceptBtn.onclick = () => {
          localStorage.setItem(consentKey, 'accepted');
          closeModal();
          window.qwikApp = new Qwik();
        };
      }
      if (denyBtn) {
        denyBtn.onclick = () => {
          localStorage.setItem(consentKey, 'denied');
          closeModal();
          window.qwikApp = new Qwik();
        };
      }
      modal._listenersAttached = true;
    }
    return;
  }
  window.qwikApp = new Qwik();

  document.querySelectorAll('.nav-category').forEach(cat => {
    const items = cat.querySelector('.category-items');
    if (cat.classList.contains('nav-favourites')) {
      items.style.display = '';
    } else {
      items.style.display = 'none';
    }
  });

  document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', () => {
      const cat = header.parentElement;
      const items = cat.querySelector('.category-items');
      if (!items) return;
      items.style.display = (items.style.display === 'none') ? '' : 'none';
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
    document.querySelectorAll('.tool-container').forEach(el => el.style.display = 'none');
    const el = document.getElementById(toolId);
    if (el) el.style.display = '';
  }

});
