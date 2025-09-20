// src/router.js
// Simple hash/path router for SPA
import { getTool } from './tool-registry.js';

export function route() {
  const hash = window.location.hash.slice(1);
  const path = hash || 'json-formatter'; // Set default tool
  const toolContent = document.getElementById('tool-content');
  if (toolContent) toolContent.innerHTML = '';
  const tool = getTool(path);
  if (tool) {
    tool(path).then(mod => {
      if (mod && mod.render) mod.render();
      if (mod && mod.postLoad) mod.postLoad();
    });
  }
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
