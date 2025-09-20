// Service Worker file for Qwik Tools
// You can add your service worker logic here.
// This is a placeholder to ensure Netlify finds the file and does not return 404.

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

// Add fetch or cache logic as needed
