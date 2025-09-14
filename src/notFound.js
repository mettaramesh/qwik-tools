// src/notFound.js
export function render() {
  const app = document.getElementById('app') || document.body;
  app.innerHTML = `<div class="notfound-container">
    <b>404</b> – Tool Not Found<br><br>
    <a href="#json-formatter" class="notfound-home-link">Go Home</a>
  </div>`;
}
