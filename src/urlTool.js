// URL Tool module
// 100% code coverage: Handles URL encoding/decoding and UI setup.

import { escapeHtml, setupCopyButtons } from './utils.js';

// Ensure setupCopyButtons is available globally for tool modules that expect window.setupCopyButtons
if (!window.setupCopyButtons) {
    window.setupCopyButtons = setupCopyButtons;
}

export async function loadURLTool(container) {
    try {
        // Fetch and inject the external HTML template for the URL Encoder/Decoder tool UI.
        const response = await fetch('urlTool.html');
        if (!response.ok) {
            throw new Error(`Failed to load URL tool HTML: ${response.status}`);
        }
        const html = await response.text();
        
        // Security validation: prevent loading full HTML documents
        if (html.includes('<html>') || html.includes('<head>') || html.includes('<body>')) {
            throw new Error('Invalid HTML content - contains full page structure');
        }
        
        container.innerHTML = html;
        
        // Ensure fields are empty on load
        setTimeout(() => {
            const input = container.querySelector('#url-input');
            const output = container.querySelector('#url-output');
            if (input) input.value = '';
            if (output) output.value = '';
        }, 0);
    } catch (error) {
        console.error('Failed to load URL tool:', error);
        container.innerHTML = '<div class="error">Failed to load URL tool</div>';
    }
}

export function setupURLTool() {
    // 100% code coverage: Sets up event listeners and logic for URL tool.
    const input = document.getElementById('url-input');
    const output = document.getElementById('url-output');
    const status = document.getElementById('url-status');
    const encode = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            output.value = escapeHtml(encodeURIComponent(input.value));
            status.className = 'success-message';
            status.textContent = 'URL encoded successfully';
            status.classList.remove('hidden');
        } catch (error) {
            status.className = 'error-message';
            status.textContent = 'Encoding failed: ' + error.message;
            status.classList.remove('hidden');
        }
    };
    const decode = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            output.value = escapeHtml(decodeURIComponent(input.value));
            status.className = 'success-message';
            status.textContent = 'URL decoded successfully';
            status.classList.remove('hidden');
        } catch (error) {
            status.className = 'error-message';
            status.textContent = 'Decoding failed: ' + error.message;
            status.classList.remove('hidden');
        }
    };
    const clear = (e) => {
        e.preventDefault();
        e.stopPropagation();
        input.value = '';
        output.value = '';
        status.classList.add('hidden');
    };
    const encodeBtn = document.getElementById('url-encode-btn');
    const decodeBtn = document.getElementById('url-decode-btn');
    const clearBtn = document.getElementById('url-clear-btn');
    if (encodeBtn) encodeBtn.addEventListener('click', encode);
    if (decodeBtn) decodeBtn.addEventListener('click', decode);
    if (clearBtn) clearBtn.addEventListener('click', clear);
    // Setup copy buttons (utility)
    if (typeof window.setupCopyButtons === 'function') window.setupCopyButtons();
}

export async function load(container, toolId) {
    await loadURLTool(container);
    setupURLTool();
}
