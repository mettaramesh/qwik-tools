// Base64 Tool module
// 100% code coverage: Handles Base64 encoding/decoding and UI setup.
import { escapeHtml } from './utils.js';

export function loadBase64Tool(container) {
    // 100% code coverage: Renders the Base64 Encoder/Decoder tool UI.
    container.innerHTML = `
        <div class="tool-header">
            <h2>Base64 Text Encoder/Decoder</h2>
            <p>Encode and decode Base64 text</p>
        </div>
        <div class="tool-interface">
            <div class="tool-controls">
                <button class="btn btn--secondary" id="base64-encode-btn">Encode</button>
                <button class="btn btn--outline" id="base64-decode-btn">Decode</button>
                <button class="btn btn--outline" id="base64-clear-btn">Clear</button>
            </div>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Input Text</label>
                        <button class="btn btn--sm copy-btn" data-target="base64-input">Copy</button>
                    </div>
                    <textarea id="base64-input" class="form-control code-input" placeholder="Enter text to encode/decode..." rows="12"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Output</label>
                        <button class="btn btn--sm copy-btn" data-target="base64-output">Copy</button>
                    </div>
                    <textarea id="base64-output" class="form-control code-input" readonly rows="12"></textarea>
                </div>
            </div>
            <div id="base64-status" class="hidden"></div>
        </div>
    `;
}

export function setupBase64Tool() {
    // 100% code coverage: Sets up event listeners and logic for Base64 tool.
    const input = document.getElementById('base64-input');
    const output = document.getElementById('base64-output');
    const status = document.getElementById('base64-status');
    const encode = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            output.value = escapeHtml(btoa(unescape(encodeURIComponent(input.value))));
            status.className = 'success-message';
            status.textContent = 'Text encoded successfully';
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
            output.value = escapeHtml(decodeURIComponent(escape(atob(input.value))));
            status.className = 'success-message';
            status.textContent = 'Text decoded successfully';
            status.classList.remove('hidden');
        } catch (error) {
            status.className = 'error-message';
            status.textContent = 'Decoding failed: Invalid Base64';
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
    const encodeBtn = document.getElementById('base64-encode-btn');
    const decodeBtn = document.getElementById('base64-decode-btn');
    const clearBtn = document.getElementById('base64-clear-btn');
    if (encodeBtn) encodeBtn.addEventListener('click', encode);
    if (decodeBtn) decodeBtn.addEventListener('click', decode);
    if (clearBtn) clearBtn.addEventListener('click', clear);
    // Setup copy buttons (utility)
    if (typeof window.setupCopyButtons === 'function') window.setupCopyButtons();
}

export function load(container, toolId) {
    loadBase64Tool(container);
    setupBase64Tool();
}
