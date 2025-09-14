// Qwik Tools Service Worker
self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  self.clients.claim();
});
// Add fetch, cache, or other logic as needed
