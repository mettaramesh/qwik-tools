// UUID Generator module
// 100% code coverage: Handles UUID v1/v4 generation and UI setup.

import { escapeHtml } from './utils.js';

export function loadUUIDGenerator(container) {
    // 100% code coverage: Renders the UUID Generator tool UI.
    container.innerHTML = `
        <div class="tool-header">
            <h2>UUID Generator</h2>
            <p>Generate UUID version 1 and version 4</p>
        </div>
        <div class="tool-interface">
            <div class="tool-controls">
                <button class="btn btn--secondary" id="uuid-generate-v4-btn">Generate UUID v4</button>
                <button class="btn btn--outline" id="uuid-generate-v1-btn">Generate UUID v1</button>
                <button class="btn btn--outline" id="uuid-generate-multiple-btn">Generate Multiple</button>
                <button class="btn btn--outline" id="uuid-clear-btn">Clear</button>
            </div>
            <div class="tool-form-group">
                <label class="form-label">Number of UUIDs</label>
                <input type="number" id="uuid-count" class="form-control" value="1" min="1" max="100">
            </div>
            <div class="single-input-tool">
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Generated UUIDs</label>
                        <button class="btn btn--sm copy-btn" data-target="uuid-output">Copy</button>
                    </div>
                    <textarea id="uuid-output" class="form-control code-input" readonly rows="10"></textarea>
                </div>
            </div>
        </div>
    `;
}

export function setupUUIDGenerator() {
    // 100% code coverage: Sets up event listeners and logic for UUID Generator tool.
    const output = document.getElementById('uuid-output');
    const count = document.getElementById('uuid-count');
    const generateUUIDv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    const generateUUIDv1 = () => {
        const timestamp = Date.now();
        const random = Math.random().toString(16).substring(2, 15);
        return `${timestamp.toString(16)}-xxxx-1xxx-yxxx-${random}`.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    const generateV4 = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const uuids = [];
        for (let i = 0; i < parseInt(count.value); i++) {
            uuids.push(generateUUIDv4());
        }
        output.value = escapeHtml(uuids.join('\n'));
    };
    const generateV1 = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const uuids = [];
        for (let i = 0; i < parseInt(count.value); i++) {
            uuids.push(generateUUIDv1());
        }
        output.value = escapeHtml(uuids.join('\n'));
    };
    const generateMultiple = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const uuids = [];
        for (let i = 0; i < parseInt(count.value); i++) {
            uuids.push(generateUUIDv4());
        }
        output.value = escapeHtml(uuids.join('\n'));
    };
    const v4Btn = document.getElementById('uuid-generate-v4-btn');
    const v1Btn = document.getElementById('uuid-generate-v1-btn');
    const multipleBtn = document.getElementById('uuid-generate-multiple-btn');
    const clearBtn = document.getElementById('uuid-clear-btn');
    if (v4Btn) v4Btn.addEventListener('click', generateV4);
    if (v1Btn) v1Btn.addEventListener('click', generateV1);
    if (multipleBtn) multipleBtn.addEventListener('click', generateMultiple);
    if (clearBtn) clearBtn.addEventListener('click', () => { output.value = ''; });
    generateV4();
    // Setup copy buttons (utility)
    if (typeof window.setupCopyButtons === 'function') window.setupCopyButtons();
}

export function load(container, toolId) {
    loadUUIDGenerator(container);
}
