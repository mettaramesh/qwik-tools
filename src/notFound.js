// src/notFound.js
export async function render() {
  const app = document.getElementById('app') || document.body;
  const html = await fetch('src/notFound.html').then(r => r.text());
  app.innerHTML = html;
}
