// Qwik XML Validator (xmllint-wasm ESM/async build)
// Uses xmllint-wasm as an ES module for browser

import * as xmllint from '/index-browser.mjs';

export async function load(container) {
  const resp = await fetch('xmlValidator.html');
  const html = await resp.text();
  container.innerHTML = html;
  setup();
}

function setup() {
  const input = document.getElementById('xml-validator-input');
  const xsdInput = document.getElementById('xml-validator-xsd');
  const output = document.getElementById('xml-validator-output');
  const validateBtn = document.getElementById('xml-validate-btn');
  const clearBtn = document.getElementById('xml-clear-btn');
  const errorDiv = document.getElementById('xml-validator-error');
  const container = document.querySelector('.tool-interface');

  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');
  }
  function clearError() {
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
  }

  function isWellFormedXML(xml) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'application/xml');
      const errorNode = doc.querySelector('parsererror');
      if (errorNode) return errorNode.textContent || 'Invalid XML';
      return true;
    } catch (e) {
      return e.message;
    }
  }

  // Fix: Add copy button logic with feedback (like other tools)
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.onclick = function() {
      const targetId = btn.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) {
        navigator.clipboard.writeText(target.value || '').then(() => {
          const oldText = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = oldText; }, 1000);
        });
      }
    };
  });

  validateBtn.onclick = async () => {
    clearError();
    const xml = input.value.trim();
    const xsd = xsdInput.value.trim();

    if (!xml) {
      showError('Please enter XML to validate.');
      return;
    }

    if (xsd.length > 0 && xsd.length < 40) {
      showError('Warning: XSD input is very short. Please check your schema.');
      return;
    }

    const wellFormed = isWellFormedXML(xml);
    if (wellFormed !== true) {
      output.value = '❌ Invalid XML: ' + wellFormed;
      return;
    }

    if (!xsd) {
      output.value = '✅ XML is well-formed.';
      return;
    }

    // Use xmllint-wasm for XSD validation (async)
    output.value = 'Validating against XSD...';
    try {
      const result = await xmllint.validateXML({
        xml: [{ fileName: 'input.xml', contents: xml }],
        schema: [xsd]
      });
      if (result.valid) {
        output.value = '✅ XML is valid against the XSD.';
      } else if (Array.isArray(result.errors) && result.errors.length > 0) {
        output.value = '❌ Schema validation failed:\n' + result.errors.map(e => e.message).join('\n');
      } else {
        output.value = '❌ XML is not valid, but no error details were returned.\nRaw result: ' + JSON.stringify(result);
      }
    } catch (e) {
      output.value = '❌ Validation error: ' + (e?.message || e);
    }
  };

  clearBtn.onclick = () => {
    input.value = '';
    xsdInput.value = '';
    output.value = '';
    clearError();
  };
}
