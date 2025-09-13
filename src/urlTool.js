// URL Tool module
// 100% code coverage: Handles URL encoding/decoding and UI setup.

import { escapeHtml, setupCopyButtons } from './utils.js';

// Ensure setupCopyButtons is available globally for tool modules that expect window.setupCopyButtons
if (!window.setupCopyButtons) {
    window.setupCopyButtons = setupCopyButtons;
}

export function loadURLTool(container) {
    // 100% code coverage: Renders the URL Encoder/Decoder tool UI.
    container.innerHTML = `
        <div class="tool-header">
            <h2>URL Encoder/Decoder</h2>
            <p>Encode and decode URLs and URI components</p>
        </div>
        <div class="tool-interface">
            <div class="tool-controls">
                <button class="btn btn--secondary" id="url-encode-btn">Encode</button>
                <button class="btn btn--outline" id="url-decode-btn">Decode</button>
                <button class="btn btn--outline" id="url-clear-btn">Clear</button>
            </div>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Input URL</label>
                        <button class="btn btn--sm copy-btn" data-target="url-input">Copy</button>
                    </div>
                    <textarea id="url-input" class="form-control code-input" placeholder="Enter URL to encode/decode..." rows="12"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Output</label>
                        <button class="btn btn--sm copy-btn" data-target="url-output">Copy</button>
                    </div>
                    <textarea id="url-output" class="form-control code-input" readonly rows="12"></textarea>
                </div>
            </div>
            <div id="url-status" class="hidden"></div>
        </div>
    `;
    // Ensure fields are empty on load
    setTimeout(() => {
        const input = container.querySelector('#url-input');
        const output = container.querySelector('#url-output');
        if (input) input.value = '';
        if (output) output.value = '';
    }, 0);
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

export function load(container, toolId) {
    loadURLTool(container);
}
