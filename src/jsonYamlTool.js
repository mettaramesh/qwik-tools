// Robust YAML ↔ JSON Tool (browser-compatible, pure JS)

function yamlToJson(yamlStr) {
  try {
    // Use js-yaml to parse YAML, supporting anchors, aliases, types, etc.
    return window.jsyaml.load(yamlStr, {
      schema: window.jsyaml.DEFAULT_SCHEMA,
      json: true
    });
  } catch (e) {
    throw new Error('YAML → JSON parse error: ' + e.message);
  }
}

function jsonToYaml(jsonStrOrObj, forceQuotes = false) {
  try {
    // Accept either a JSON string or an object
    let obj = jsonStrOrObj;
    if (typeof obj === 'string') {
      obj = JSON.parse(obj);
    }
    return window.jsyaml.dump(obj, {
      schema: window.jsyaml.DEFAULT_SCHEMA,
      lineWidth: 80,
      noRefs: false,
      quotingType: '"',
      forceQuotes: forceQuotes
    });
  } catch (e) {
    throw new Error('JSON → YAML dump error: ' + e.message);
  }
}

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

function isValidYAML(str) {
  try {
    window.jsyaml.load(str);
    return true;
  } catch {
    return false;
  }
}

export function loadJSONYamlTool(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2>JSON ↔ YAML Converter</h2>
            <p>Convert between JSON and YAML formats</p>
        </div>
        <div class="tool-interface">
            <button class="btn btn--secondary" id="to-yaml">JSON → YAML</button>
            <button class="btn btn--outline" id="to-json">YAML → JSON</button>
            <button class="btn btn--outline" id="json-yaml-clear-btn">Clear</button>
            <label class="jsonyaml-margin-left jsonyaml-font-size jsonyaml-vertical-align">
                <input type="checkbox" id="force-quotes-checkbox" class="jsonyaml-vertical-align jsonyaml-margin-right">Quote all keys in YAML
            </label>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Input</label>
                        <button class="btn btn--sm copy-btn" data-target="json-yaml-input">Copy</button>
                    </div>
                    <textarea id="json-yaml-input" class="form-control code-input" placeholder="Paste or type JSON or YAML here..." rows="12"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Output</label>
                        <button class="btn btn--sm copy-btn" data-target="json-yaml-output">Copy</button>
                    </div>
                    <textarea id="json-yaml-output" class="form-control code-input" readonly rows="12"></textarea>
                </div>
            </div>
            <div id="json-yaml-status" class="hidden"></div>
        </div>
    `;

    setTimeout(() => {
        const input = document.getElementById('json-yaml-input');
        const output = document.getElementById('json-yaml-output');
        const status = document.getElementById('json-yaml-status');
        const forceQuotesCheckbox = document.getElementById('force-quotes-checkbox');
        function getForceQuotes() {
            return forceQuotesCheckbox && forceQuotesCheckbox.checked;
        }
        document.getElementById('to-yaml').onclick = () => {
            try {
                if (!input.value.trim()) throw new Error('Input is empty');
                if (!isValidJSON(input.value)) throw new Error('Invalid JSON');
                const yaml = jsonToYaml(input.value, getForceQuotes());
                if (!yaml) throw new Error('Could not convert JSON to YAML');
                output.value = yaml;
                status.className = 'success-message';
                status.textContent = 'Converted to YAML';
                status.classList.remove('hidden');
            } catch (e) {
                output.value = '';
                status.className = 'error-message';
                status.textContent = e.message || 'Error converting to YAML';
                status.classList.remove('hidden');
            }
        };
        document.getElementById('to-json').onclick = () => {
            try {
                if (!input.value.trim()) throw new Error('Input is empty');
                if (!isValidYAML(input.value)) throw new Error('Invalid YAML');
                const obj = yamlToJson(input.value);
                output.value = JSON.stringify(obj, null, 2);
                status.className = 'success-message';
                status.textContent = 'Converted to JSON';
                status.classList.remove('hidden');
            } catch (e) {
                output.value = '';
                status.className = 'error-message';
                status.textContent = e.message || 'Error converting to JSON';
                status.classList.remove('hidden');
            }
        };
        document.getElementById('json-yaml-clear-btn').onclick = () => {
            input.value = '';
            output.value = '';
            status.classList.add('hidden');
        };
        // Copy button logic
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.onclick = function() {
                const targetId = btn.getAttribute('data-target');
                const target = document.getElementById(targetId);
                if (target) {
                    navigator.clipboard.writeText(target.value).then(() => {
                        const oldText = btn.textContent;
                        btn.textContent = 'Copied!';
                        setTimeout(() => { btn.textContent = oldText; }, 1000);
                    });
                }
            };
        });
    }, 0);
}

export function load(container, toolId) {
    loadJSONYamlTool(container);
}
