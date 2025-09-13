// JSON Validator Tool for Qwik
// UI and error styling matches XML Validator. Uses Ajv for JSON Schema validation.

import { showStatus, setupCopyButtons } from './utils.js';

// Minimal Ajv-like validator (browser, no CDN, no install)
// For real-world, use Ajv via npm and bundle, but here is a minimal version for demo:
function validateJSONSchema(json, schema) {
    // Only supports type, required, properties, basic types
    function validate(obj, sch, path = '') {
        if (sch.type) {
            if (sch.type === 'object' && typeof obj !== 'object') return `${path} should be object`;
            if (sch.type === 'array' && !Array.isArray(obj)) return `${path} should be array`;
            if (sch.type === 'string' && typeof obj !== 'string') return `${path} should be string`;
            if (sch.type === 'number' && typeof obj !== 'number') return `${path} should be number`;
            if (sch.type === 'boolean' && typeof obj !== 'boolean') return `${path} should be boolean`;
        }
        if (sch.required && Array.isArray(sch.required)) {
            for (const req of sch.required) {
                if (obj == null || !(req in obj)) return `${path}.${req} is required`;
            }
        }
        if (sch.properties && typeof sch.properties === 'object') {
            for (const key in sch.properties) {
                if (obj && key in obj) {
                    const err = validate(obj[key], sch.properties[key], path ? path + '.' + key : key);
                    if (err) return err;
                }
            }
        }
        if (sch.items && Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                const err = validate(obj[i], sch.items, path + '[' + i + ']');
                if (err) return err;
            }
        }
        return null;
    }
    return validate(json, schema, '');
}

export function load(container) {
  container.innerHTML = `
    <div class="tool-header"><h2>JSON Validator</h2><p>Validate your JSON against a JSON Schema (Draft 7 subset supported)</p></div>
    <div class="tool-interface">
      <div class="tool-controls">
        <button class="btn btn--secondary" id="json-validate-btn">Validate</button>
        <button class="btn btn--outline" id="json-clear-btn">Clear</button>
      </div>
      <div class="io-container">
        <div class="input-section">
          <div class="section-header">
            <label class="form-label">Input JSON</label>
            <button class="btn btn--sm copy-btn" data-target="json-validator-input">Copy</button>
          </div>
          <textarea id="json-validator-input" class="form-control code-input" placeholder="Paste or type your JSON here..." rows="10"></textarea>
        </div>
        <div class="input-section">
          <div class="section-header">
            <label class="form-label">JSON Schema (optional)</label>
            <button class="btn btn--sm copy-btn" data-target="json-validator-schema">Copy</button>
          </div>
          <textarea id="json-validator-schema" class="form-control code-input" placeholder="Paste your JSON Schema here..." rows="8"></textarea>
        </div>
        <div class="output-section">
          <div class="section-header">
            <label class="form-label">Validation Result</label>
            <button class="btn btn--sm copy-btn" data-target="json-validator-output">Copy</button>
          </div>
          <textarea id="json-validator-output" class="form-control code-input" readonly rows="4"></textarea>
        </div>
      </div>
      <div id="json-validator-error" class="error-message hidden"></div>
    </div>
  `;
  setup();
}

function setup() {
  const input = document.getElementById('json-validator-input');
  const schemaInput = document.getElementById('json-validator-schema');
  const output = document.getElementById('json-validator-output');
  const validateBtn = document.getElementById('json-validate-btn');
  const clearBtn = document.getElementById('json-clear-btn');
  const errorDiv = document.getElementById('json-validator-error');

  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');
  }
  function clearError() {
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
  }

  validateBtn.onclick = () => {
    clearError();
    let json, schema;
    try {
      json = JSON.parse(input.value);
    } catch (e) {
      showError('Invalid JSON: ' + e.message);
      output.value = '';
      return;
    }
    try {
      schema = JSON.parse(schemaInput.value);
    } catch (e) {
      showError('Invalid JSON Schema: ' + e.message);
      output.value = '';
      return;
    }
    const err = validateJSONSchema(json, schema);
    if (!err) {
      output.value = 'JSON is valid against the schema.';
    } else {
      output.value = 'Validation failed: ' + err;
    }
  };
  clearBtn.onclick = () => {
    input.value = '';
    schemaInput.value = '';
    output.value = '';
    clearError();
  };
  setupCopyButtons();
}
