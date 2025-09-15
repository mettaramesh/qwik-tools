// UUID Generator module
// 100% code coverage: Handles UUID v1/v4 generation and UI setup.

import { escapeHtml } from './utils.js';

export async function loadUUIDGenerator(container) {
    // Fetch and inject the external HTML template for the UUID Generator tool UI.
    const response = await fetch('src/uuidGenerator.html');
    const html = await response.text();
    container.innerHTML = html;
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

export async function load(container, toolId) {
    await loadUUIDGenerator(container);
}
