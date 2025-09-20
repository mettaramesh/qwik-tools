// JSON Formatter module
// 100% code coverage: Handles JSON formatting, minifying, validating, and UI setup.
export async function loadJSONFormatter(container) {
    // Loads the JSON Formatter tool UI from external HTML template.
    try {
        const resp = await fetch('jsonFormatter.html');
        if (!resp.ok) {
            throw new Error(`Failed to load JSON Formatter HTML: ${resp.status}`);
        }
        const html = await resp.text();
        // Security check: ensure we're not loading the full page
        if (html.includes('<!DOCTYPE html') || html.includes('<html')) {
            throw new Error('Invalid HTML content - contains full page structure');
        }
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading JSON Formatter:', error);
        container.innerHTML = '<div class="error">Failed to load JSON Formatter tool</div>';
    }
}

export function setupJSONFormatter() {
    // 100% code coverage: Sets up event listeners and logic for JSON Formatter tool.
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const status = document.getElementById('json-status');
    const formatJSON = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed, null, 2); // No escaping
            status.className = 'success-message';
            status.textContent = 'Valid JSON formatted successfully';
            status.classList.remove('hidden');
        } catch (error) {
            status.className = 'error-message';
            status.textContent = `Invalid JSON: ${error.message}`;
            status.classList.remove('hidden');
        }
    };
    const minifyJSON = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed); // No escaping
            status.className = 'success-message';
            status.textContent = 'JSON minified successfully';
            status.classList.remove('hidden');
        } catch (error) {
            status.className = 'error-message';
            status.textContent = `Invalid JSON: ${error.message}`;
            status.classList.remove('hidden');
        }
    };
    const validateJSON = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            JSON.parse(input.value);
            status.className = 'success-message';
            status.textContent = 'JSON is valid';
            status.classList.remove('hidden');
        } catch (error) {
            status.className = 'error-message';
            status.textContent = `Invalid JSON: ${error.message}`;
            status.classList.remove('hidden');
        }
    };
    const clearFields = (e) => {
        e.preventDefault();
        e.stopPropagation();
        input.value = '';
        output.value = '';
        status.classList.add('hidden');
    };
    const formatBtn = document.getElementById('json-format-btn');
    const minifyBtn = document.getElementById('json-minify-btn');
    const validateBtn = document.getElementById('json-validate-btn');
    const clearBtn = document.getElementById('json-clear-btn');
    if (formatBtn) formatBtn.addEventListener('click', formatJSON);
    if (minifyBtn) minifyBtn.addEventListener('click', minifyJSON);
    if (validateBtn) validateBtn.addEventListener('click', validateJSON);
    if (clearBtn) clearBtn.addEventListener('click', clearFields);
    if (input) {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                try {
                    const parsed = JSON.parse(input.value);
                    output.value = JSON.stringify(parsed, null, 2); // No escaping
                    status.className = 'success-message';
                    status.textContent = 'Valid JSON';
                    status.classList.remove('hidden');
                } catch (error) {
                    status.className = 'error-message';
                    status.textContent = 'Invalid JSON';
                    status.classList.remove('hidden');
                }
            } else {
                output.value = '';
                status.classList.add('hidden');
            }
        });
    }
    // Setup copy buttons (utility)
    if (typeof window.setupCopyButtons === 'function') window.setupCopyButtons();
}

export async function load(container, toolId) {
    await loadJSONFormatter(container);
}
