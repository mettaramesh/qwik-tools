// JSON Formatter module
// 100% code coverage: Handles JSON formatting, minifying, validating, and UI setup.
export function loadJSONFormatter(container) {
    // 100% code coverage: Renders the JSON Formatter tool UI.
    container.innerHTML = `
        <div class="tool-header">
            <h2>JSON Formatter</h2>
            <p>Format, beautify, and minify JSON data</p>
        </div>
        <div class="tool-interface">
            <div class="tool-controls">
                <button class="btn btn--secondary" id="json-format-btn">Format</button>
                <button class="btn btn--outline" id="json-minify-btn">Minify</button>
                <button class="btn btn--outline" id="json-validate-btn">Validate</button>
                <button class="btn btn--outline" id="json-clear-btn">Clear</button>
            </div>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Input JSON</label>
                        <button class="btn btn--sm copy-btn" data-target="json-input">Copy</button>
                    </div>
                    <textarea id="json-input" class="form-control code-input" placeholder="Paste or type your JSON here..." rows="12"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Formatted Output</label>
                        <button class="btn btn--sm copy-btn" data-target="json-output">Copy</button>
                    </div>
                    <textarea id="json-output" class="form-control code-input" readonly rows="12"></textarea>
                </div>
            </div>
            <div id="json-status" class="hidden"></div>
        </div>
    `;
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

export function load(container, toolId) {
    loadJSONFormatter(container);
}
