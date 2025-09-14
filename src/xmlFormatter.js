// XML Formatter Tool for Qwik
// No external dependencies, safe for commercial use

function formatXML(xml) {
  xml = xml.trim();
  // Remove line breaks between tags, then add a single break between tags
  xml = xml.replace(/>\s*</g, '><');
  // Split into tokens (tags and text)
  const tokens = xml.split(/(<[^>]+>)/g).filter(Boolean);
  let pad = 0;
  let result = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    // Check for <tag>text</tag> pattern
    if (
      /^<[^!?][^>]*[^\/]?>\s*$/.test(token) && // opening tag
      i + 2 < tokens.length &&
      !/^<.*>/.test(tokens[i + 1]) && // text node
      /^<\//.test(tokens[i + 2]) // closing tag
    ) {
      // Escape < and > in text node
      const textEscaped = tokens[i + 1].replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
      result.push('  '.repeat(pad) + token.trim() + textEscaped + tokens[i + 2].trim());
      i += 2;
      continue;
    }
    if (/^<\/.+>\s*$/.test(token)) {
      // Closing tag
      pad = Math.max(0, pad - 1);
      result.push('  '.repeat(pad) + token.trim());
    } else if (/^<[^!?][^>]*[^\/]?>\s*$/.test(token)) {
      // Opening tag (not self-closing)
      result.push('  '.repeat(pad) + token.trim());
      pad++;
    } else if (/^<.*\/?>\s*$/.test(token)) {
      // Self-closing tag or comment or doctype
      result.push('  '.repeat(pad) + token.trim());
    } else if (token.trim()) {
      // Text node: escape < and >
      result.push('  '.repeat(pad) + token.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    }
  }
  return result.join('\n');
}

function minifyXML(xml) {
  return xml.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
}

function isWellFormedXML(xml) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    return !doc.querySelector('parsererror');
  } catch {
    return false;
  }
}

function escapeXML(xml) {
  return xml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function unescapeXML(xml) {
  return xml.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

export async function load(container) {
  const resp = await fetch('xmlFormatter.html');
  const html = await resp.text();
  container.innerHTML = html;
  // Call setup after DOM is updated
  if (typeof setup === 'function') setup();
}

export function setup() {
  const input = document.getElementById('xml-input');
  const output = document.getElementById('xml-output');
  const formatBtn = document.getElementById('xml-format-btn');
  const minifyBtn = document.getElementById('xml-minify-btn');
  const escapeBtn = document.getElementById('xml-escape-btn');
  const unescapeBtn = document.getElementById('xml-unescape-btn');
  const validateBtn = document.getElementById('xml-validate-btn');
  const clearBtn = document.getElementById('xml-clear-btn');
  const errorDiv = document.getElementById('xml-error');

  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');
  }
  function clearError() {
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
  }

  // New function to update button states based on input content
  const updateButtonStates = () => {
    const xml = input.value;
    const hasUnescapedTags = /<[^>]+>/g.test(xml);
    const hasEscapedTags = /&lt;|&gt;/g.test(xml);

    if (escapeBtn) {
      if (hasUnescapedTags) {
        escapeBtn.removeAttribute('disabled');
        escapeBtn.classList.remove('btn--disabled');
      } else {
        escapeBtn.setAttribute('disabled', 'true');
        escapeBtn.classList.add('btn--disabled');
      }
    }

    if (unescapeBtn) {
      if (hasEscapedTags) {
        unescapeBtn.removeAttribute('disabled');
        unescapeBtn.classList.remove('btn--disabled');
      } else {
        unescapeBtn.setAttribute('disabled', 'true');
        unescapeBtn.classList.add('btn--disabled');
      }
    }
  };

  // Add event listener to input to check for content changes
  input.addEventListener('input', updateButtonStates);

  // Initial call to set button state on page load
  updateButtonStates();

  formatBtn.onclick = () => {
    clearError();
    try {
      if (!isWellFormedXML(input.value)) {
        showError('Input is not well-formed XML.');
        return;
      }
      output.value = formatXML(input.value);
    } catch (e) {
      showError('Formatting error: ' + e.message);
    }
  };
  minifyBtn.onclick = () => {
    clearError();
    try {
      let xml = input.value;
      let wasEscaped = /&lt;|&gt;/.test(xml);
      if (wasEscaped) {
        xml = unescapeXML(xml);
      }
      if (!isWellFormedXML(xml)) {
        showError('Input is not well-formed XML.');
        return;
      }
      let minified = minifyXML(xml);
      if (wasEscaped) {
        minified = escapeXML(minified);
      }
      output.value = minified;
    } catch (e) {
      showError('Minify error: ' + e.message);
    }
  };
  if (escapeBtn) {
    escapeBtn.onclick = () => {
      clearError();
      try {
        let xml = input.value;
        let wasEscaped = /&lt;|&gt;/.test(xml);
        if (wasEscaped) {
          xml = unescapeXML(xml);
        }
        if (!isWellFormedXML(xml)) {
          showError('Input is not well-formed XML.');
          return;
        }
        const escaped = escapeXML(xml);
        output.value = escaped;
        updateButtonStates();
      } catch (e) {
        showError('Escape error: ' + e.message);
      }
    };
  }

  if (unescapeBtn) {
    unescapeBtn.onclick = () => {
      clearError();
      try {
        let xml = input.value;
        let wasEscaped = /&lt;|&gt;/.test(xml);
        let unescaped = xml;
        if (wasEscaped) {
          unescaped = unescapeXML(xml);
          if (!isWellFormedXML(unescaped)) {
            showError('Input is not well-formed XML.');
            return;
          }
        } else {
          if (!isWellFormedXML(xml)) {
            showError('Input is not well-formed XML.');
            return;
          }
        }
        output.value = unescapeXML(xml);
        updateButtonStates();
      } catch (e) {
        showError('Unescape error: ' + e.message);
      }
    };
  }
  
  if (validateBtn) {
    validateBtn.onclick = () => {
      clearError();
      try {
        let xml = input.value;
        let wasEscaped = /&lt;|&gt;/.test(xml);
        if (wasEscaped) {
          xml = unescapeXML(xml);
        }
        if (!xml.trim()) {
          showError('Input is empty.');
          return;
        }
        if (isWellFormedXML(xml)) {
          output.value = 'XML is well-formed.';
        } else {
          output.value = '';
          showError('Input is not well-formed XML.');
        }
      } catch (e) {
        showError('Validation error: ' + e.message);
      }
    };
  }
  
  clearBtn.onclick = () => {
    input.value = '';
    output.value = '';
    clearError();
    updateButtonStates();
  };
  
  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.onclick = () => {
      const target = btn.getAttribute('data-target');
      const el = document.getElementById(target);
      if (el) {
        // Use the modern Clipboard API
        navigator.clipboard.writeText(el.value)
          .then(() => {
            // Text copied to clipboard successfully!
          })
          .catch(err => {
            // Failed to copy text: , err
          });
      }
    };
  });
}
