// Robust YAML ↔ JSON Tool (browser-compatible)

export async function loadJSONYAMLTool(container) {
  try {
    const resp = await fetch('./jsonYamlTool.html');
    if (!resp.ok) {
      throw new Error(`Failed to load JSON-YAML tool HTML: ${resp.status}`);
    }
    const html = await resp.text();
    // Security check: ensure we're not loading the full page
    if (html.includes('<!DOCTYPE html') || html.includes('<html')) {
      throw new Error('Invalid HTML content - contains full page structure');
    }
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading JSON-YAML tool:', error);
    container.innerHTML = '<div class="error">Failed to load JSON-YAML tool</div>';
    return;
  }
}

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

export async function loadJSONYamlTool(container) {
  const resp = await fetch('jsonYamlTool.html');
  const html = await resp.text();
  container.innerHTML = html;
  setTimeout(() => {
    const input = document.getElementById('json-yaml-input');
    const output = document.getElementById('json-yaml-output');
    const status = document.getElementById('json-yaml-status');
    const forceQuotesCheckbox = document.getElementById('force-quotes-checkbox');
    const toYamlBtn = document.getElementById('to-yaml');
    const toJsonBtn = document.getElementById('to-json');
    const clearBtn = document.getElementById('json-yaml-clear-btn');
    function getForceQuotes() {
      return forceQuotesCheckbox && forceQuotesCheckbox.checked;
    }
    if (toYamlBtn && input && output && status) {
      toYamlBtn.onclick = () => {
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
    }
    if (toJsonBtn && input && output && status) {
      toJsonBtn.onclick = () => {
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
    }
    if (clearBtn && input && output && status) {
      clearBtn.onclick = () => {
        input.value = '';
        output.value = '';
        status.classList.add('hidden');
      };
    }
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

export async function load(container, toolId) {
  await loadJSONYamlTool(container);
}
