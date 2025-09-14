// src/notFound.js
export function render() {
  const app = document.getElementById('app') || document.body;
  app.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--color-error, #c00);font-size:1.5rem;">
    <b>404</b> – Tool Not Found<br><br>
    <a href="#json-formatter" style="color:var(--color-primary, #21808d);text-decoration:underline;">Go Home</a>
  </div>`;
}
