// Load external stylesheet for EBCDIC converter tool
function ensureEbcdicConverterStyle(){
  if (!document.getElementById('ebcdic-converter-css-link')) {
    const link = document.createElement('link');
    link.id = 'ebcdic-converter-css-link';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/ebcdicConverter.css';
    if (document.head) document.head.appendChild(link);
  }
}
ensureEbcdicConverterStyle();

// EBCDIC CP037 ↔ ASCII/Unicode Converter Tool
// Standalone tool for direct EBCDIC conversion using built-in tables

export function loadEbcdicConverterTool(container) {
  container.innerHTML = `
    <div class="ebcdic-converter-redesign">
      <!-- Header -->
      <div class="ebcdic-header">
        <div>
          <h2>EBCDIC CP037 ↔ ASCII/Unicode Converter</h2>
          <p>Direct conversion between EBCDIC CP037 and ASCII/Unicode using built-in translation tables. Independent of browser TextDecoder/TextEncoder.</p>
        </div>
        <div class="chip">IBM CP037</div>
      </div>

      <!-- Main Conversion Section -->
      <section class="card">
        <div class="conversion-grid">
          <!-- INPUT PANEL -->
          <div class="panel" aria-label="Input panel">
            <div class="panel-title">
              <h3>Input</h3>
              <small id="inputModeDisplay">EBCDIC File or <strong>Text</strong></small>
            </div>

            <!-- Mode Toggle -->
            <div class="controls">
              <div class="mode-toggle">
                <label class="checkbox-label">
                  <input type="radio" name="inputMode" value="file" id="inputModeFile" checked> EBCDIC File
                </label>
                <label class="checkbox-label">
                  <input type="radio" name="inputMode" value="text" id="inputModeText"> ASCII/Unicode Text
                </label>
              </div>
            </div>

            <!-- File Input Area -->
            <div id="fileInputArea" class="file-upload-area">
              <input type="file" id="ebcdicFileInput" class="file-input" accept=".ebc,.ebcdic,.txt,.*" />
              <div class="upload-prompt">
                <p><strong>Select EBCDIC file</strong></p>
                <p>Choose a file with EBCDIC CP037 encoded data</p>
              </div>
              <div id="fileInfo" class="file-info"></div>
            </div>

            <!-- Text Input Area -->
            <div id="textInputArea" class="textarea-container hidden">
              <textarea id="inputText" placeholder="Enter ASCII/Unicode text to convert to EBCDIC..." rows="8"></textarea>
            </div>

            <!-- Processing Options -->
            <div class="controls">
              <label class="checkbox-label">
                <input type="checkbox" id="normalizeNEL" checked> Normalize NEL (U+0085) → LF
              </label>
              <label class="checkbox-label">
                <input type="checkbox" id="useCRLF"> Use CRLF line endings in output
              </label>
            </div>

            <div class="action-row">
              <button class="btn-primary" id="btnConvert">Convert</button>
              <button class="btn-ghost" id="btnClear">Clear</button>
            </div>
            <div class="metrics" id="inputMetrics"></div>
          </div>

          <!-- OUTPUT PANEL -->
          <div class="panel" aria-label="Output panel">
            <div class="panel-title">
              <h3>Output</h3>
              <small id="outputModeDisplay">Converted <strong>Text</strong></small>
            </div>

            <div class="controls">
              <div class="mode-toggle">
                <label class="checkbox-label">
                  <input type="radio" name="outputMode" value="text" id="outputModeText" checked> Show as Text
                </label>
                <label class="checkbox-label">
                  <input type="radio" name="outputMode" value="hex" id="outputModeHex"> Show as Hex
                </label>
              </div>
            </div>

            <div class="textarea-container">
              <textarea id="outputText" readonly rows="8" placeholder="Converted output will appear here..."></textarea>
            </div>

            <div class="action-row">
              <button class="btn-ghost" id="btnCopy">Copy Text</button>
              <button class="btn-ghost" id="btnDownloadText">Download as UTF-8</button>
              <button class="btn-ghost" id="btnDownloadEbcdic">Download as EBCDIC</button>
            </div>
            <div class="metrics" id="outputMetrics"></div>
          </div>
        </div>
      </section>

      <!-- Conversion Information -->
      <section class="card notes">
        <div class="note-content">
          <h4>EBCDIC CP037 Conversion Details</h4>
          <ul>
            <li><strong>Character Set:</strong> IBM Code Page 037 (EBCDIC US/Canada)</li>
            <li><strong>Coverage:</strong> Full ASCII (0x00-0x7F) mapping with built-in translation tables</li>
            <li><strong>NEL Handling:</strong> EBCDIC Next Line (0x85) can be normalized to Line Feed (0x0A)</li>
            <li><strong>Fallback:</strong> Non-ASCII characters in Unicode → ASCII text are replaced with '?' (0x6F in EBCDIC)</li>
            <li><strong>Independence:</strong> Uses built-in mapping tables, no browser TextDecoder dependency</li>
            <li><strong>File Support:</strong> Direct binary file processing for EBCDIC data</li>
          </ul>
        </div>
      </section>
    </div>
  `;

  // CP037 mapping tables (EBCDIC → Unicode)
  const CP037_E2U = Uint16Array.from([
    0x00,0x01,0x02,0x03,0x9C,0x09,0x86,0x7F,0x97,0x8D,0x8E,0x0B,0x0C,0x0D,0x0E,0x0F,
    0x10,0x11,0x12,0x13,0x9D,0x85,0x08,0x87,0x18,0x19,0x92,0x8F,0x1C,0x1D,0x1E,0x1F,
    0x80,0x81,0x82,0x83,0x84,0x0A,0x17,0x1B,0x88,0x89,0x8A,0x8B,0x8C,0x05,0x06,0x07,
    0x90,0x91,0x16,0x93,0x94,0x95,0x96,0x04,0x98,0x99,0x9A,0x9B,0x14,0x15,0x9E,0x1A,
    0x20,0xA0,0xE2,0xE4,0xE0,0xE1,0xE3,0xE5,0xE7,0xF1,0xA2,0x2E,0x3C,0x28,0x2B,0x7C,
    0x26,0xE9,0xEA,0xEB,0xE8,0xED,0xEE,0xEF,0xEC,0xDF,0x21,0x24,0x2A,0x29,0x3B,0xAC,
    0x2D,0x2F,0xC2,0xC4,0xC0,0xC1,0xC3,0xC5,0xC7,0xD1,0xA6,0x2C,0x25,0x5F,0x3E,0x3F,
    0xF8,0xC9,0xCA,0xCB,0xC8,0xCD,0xCE,0xCF,0xCC,0x60,0x3A,0x23,0x40,0x27,0x3D,0x22,
    0xD8,0x61,0x62,0x63,0x64,0x65,0x66,0x67,0x68,0x69,0xAB,0xBB,0xF0,0xFD,0xFE,0xB1,
    0xB0,0x6A,0x6B,0x6C,0x6D,0x6E,0x6F,0x70,0x71,0x72,0xAA,0xBA,0xE6,0xB8,0xC6,0xA4,
    0xB5,0x7E,0x73,0x74,0x75,0x76,0x77,0x78,0x79,0x7A,0xA1,0xBF,0xD0,0xDD,0xDE,0xAE,
    0x5E,0xA3,0xA5,0xB7,0xA9,0xA7,0xB6,0xBC,0xBD,0xBE,0x5B,0x5D,0xAF,0xA8,0xB4,0xD7,
    0x7B,0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48,0x49,0xAD,0xF4,0xF6,0xF2,0xF3,0xF5,
    0x7D,0x4A,0x4B,0x4C,0x4D,0x4E,0x4F,0x50,0x51,0x52,0xB9,0xFB,0xFC,0xF9,0xFA,0xFF,
    0x5C,0xF7,0x53,0x54,0x55,0x56,0x57,0x58,0x59,0x5A,0xB2,0xD4,0xD6,0xD2,0xD3,0xD5,
    0x30,0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0xB3,0xDB,0xDC,0xD9,0xDA,0x9F
  ]);

  // ASCII (0x00..0x7F) → CP037 byte mapping (unknown → 0x6F '?')
  const CP037_U2E_ASCII = (() => {
    const m = new Uint16Array(128);
    for (let i = 0; i < 128; i++) m[i] = 0x6F; // Default to '?'
    for (let eb = 0; eb < 256; eb++) {
      const u = CP037_E2U[eb];
      if (u < 128) m[u] = eb;
    }
    return m;
  })();

  // DOM elements
  const el = id => container.querySelector('#' + id);
  
  // Input elements
  const inputModeFile = el('inputModeFile');
  const inputModeText = el('inputModeText');
  const fileInputArea = el('fileInputArea');
  const textInputArea = el('textInputArea');
  const ebcdicFileInput = el('ebcdicFileInput');
  const inputText = el('inputText');
  const fileInfo = el('fileInfo');
  
  // Output elements
  const outputModeText = el('outputModeText');
  const outputModeHex = el('outputModeHex');
  const outputText = el('outputText');
  
  // Controls
  const normalizeNEL = el('normalizeNEL');
  const useCRLF = el('useCRLF');
  
  // Buttons
  const btnConvert = el('btnConvert');
  const btnClear = el('btnClear');
  const btnCopy = el('btnCopy');
  const btnDownloadText = el('btnDownloadText');
  const btnDownloadEbcdic = el('btnDownloadEbcdic');
  
  // Status displays
  const inputMetrics = el('inputMetrics');
  const outputMetrics = el('outputMetrics');
  const inputModeDisplay = el('inputModeDisplay');
  const outputModeDisplay = el('outputModeDisplay');

  // State
  let currentInputData = null;
  let currentOutputData = null;
  let isEbcdicToText = true; // true = EBCDIC→Text, false = Text→EBCDIC

  // Conversion functions
  function decodeCP037(bytes, normalizeNELFlag = false) {
    let out = '';
    for (let i = 0; i < bytes.length; i++) {
      let u = CP037_E2U[bytes[i]];
      if (normalizeNELFlag && u === 0x85) u = 0x0A; // NEL→LF
      out += String.fromCharCode(u);
    }
    return out;
  }

  function encodeCP037(str) {
    const out = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i) & 0xFFFF;
      if (ch < 128) {
        out[i] = CP037_U2E_ASCII[ch];
      } else {
        out[i] = 0x6F; // '?' for non-ASCII
      }
    }
    return out;
  }

  function bytesToHex(bytes) {
    const hex = new Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      hex[i] = bytes[i].toString(16).padStart(2, '0').toUpperCase();
    }
    return hex.join(' ');
  }

  // Metrics helpers
  function setMetrics(node, { textLen = null, byteLen = null, status = null }) {
    if (!node) return;
    node.innerHTML = '';
    
    // Check if there's any content to display
    const hasContent = textLen != null || byteLen != null || status != null;
    
    // Show/hide the metrics container using CSS classes
    if (hasContent) {
      node.classList.add('show');
      if (textLen != null) addPill(node, `Characters: ${textLen}`);
      if (byteLen != null) addPill(node, `Bytes: ${byteLen}`);
      if (status) addPill(node, status.msg, status.ok ? 'ok' : 'bad');
    } else {
      node.classList.remove('show');
    }
  }

  function addPill(node, text, cls = '') {
    const span = document.createElement('span');
    span.className = 'pill ' + (cls || '');
    span.textContent = text;
    node.appendChild(span);
  }

  // Mode switching
  function updateInputMode() {
    const isFileMode = inputModeFile.checked;
    
    // Use CSS classes instead of inline styles
    if (isFileMode) {
      fileInputArea.classList.remove('hidden');
      textInputArea.classList.add('hidden');
    } else {
      fileInputArea.classList.add('hidden');
      textInputArea.classList.remove('hidden');
    }
    
    isEbcdicToText = isFileMode;
    
    if (inputModeDisplay) {
      inputModeDisplay.innerHTML = isFileMode 
        ? 'EBCDIC File → <strong>Text</strong>'
        : 'ASCII/Unicode Text → <strong>EBCDIC</strong>';
    }
    
    // Update button text
    if (btnConvert) {
      btnConvert.textContent = isFileMode ? 'Convert to Text' : 'Convert to EBCDIC';
    }
    
    clearData();
  }

  function updateOutputMode() {
    if (outputModeDisplay) {
      outputModeDisplay.innerHTML = outputModeHex.checked
        ? 'Show as <strong>Hex</strong>'
        : 'Show as <strong>Text</strong>';
    }
    displayOutput();
  }

  function clearData() {
    currentInputData = null;
    currentOutputData = null;
    if (inputText) inputText.value = '';
    if (outputText) outputText.value = '';
    if (fileInfo) fileInfo.textContent = '';
    if (ebcdicFileInput) ebcdicFileInput.value = '';
    setMetrics(inputMetrics, {});
    setMetrics(outputMetrics, {});
  }

  function displayOutput() {
    if (!currentOutputData) return;
    
    if (outputModeHex.checked && currentOutputData.bytes) {
      outputText.value = bytesToHex(currentOutputData.bytes);
    } else if (currentOutputData.text) {
      outputText.value = currentOutputData.text;
    }
  }

  // File handling
  if (ebcdicFileInput) {
    ebcdicFileInput.addEventListener('change', async () => {
      fileInfo.textContent = '';
      currentInputData = null;
      
      const file = ebcdicFileInput.files && ebcdicFileInput.files[0];
      if (!file) return;
      
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        currentInputData = { bytes, filename: file.name };
        fileInfo.textContent = `${file.name} - ${bytes.length} bytes`;
        setMetrics(inputMetrics, { 
          byteLen: bytes.length, 
          status: { ok: true, msg: 'EBCDIC file loaded' }
        });
      } catch (error) {
        setMetrics(inputMetrics, { 
          status: { ok: false, msg: 'File read error: ' + error.message }
        });
      }
    });
  }

  // Conversion
  if (btnConvert) {
    btnConvert.addEventListener('click', () => {
      try {
        if (isEbcdicToText) {
          // EBCDIC file → Text
          if (!currentInputData?.bytes) {
            setMetrics(outputMetrics, { 
              status: { ok: false, msg: 'Please select an EBCDIC file first' }
            });
            return;
          }
          
          const normalizeNELFlag = normalizeNEL?.checked || false;
          let text = decodeCP037(currentInputData.bytes, normalizeNELFlag);
          
          // Apply CRLF if requested
          if (useCRLF?.checked) {
            if (normalizeNELFlag) {
              text = text.replace(/\n/g, '\r\n');
            } else {
              text = text.replace(/\u0085/g, '\r\n'); // raw NEL to CRLF
            }
          }
          
          currentOutputData = { text, bytes: new TextEncoder().encode(text) };
          setMetrics(outputMetrics, {
            textLen: text.length,
            byteLen: currentOutputData.bytes.length,
            status: { ok: true, msg: 'EBCDIC → Text conversion complete' }
          });
          
        } else {
          // Text → EBCDIC
          const text = inputText?.value || '';
          if (!text) {
            setMetrics(outputMetrics, { 
              status: { ok: false, msg: 'Please enter text to convert' }
            });
            return;
          }
          
          const bytes = encodeCP037(text);
          currentOutputData = { text, bytes };
          setMetrics(outputMetrics, {
            textLen: text.length,
            byteLen: bytes.length,
            status: { ok: true, msg: 'Text → EBCDIC conversion complete' }
          });
        }
        
        displayOutput();
        
      } catch (error) {
        setMetrics(outputMetrics, { 
          status: { ok: false, msg: 'Conversion error: ' + error.message }
        });
      }
    });
  }

  // Copy functionality
  if (btnCopy) {
    btnCopy.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext && outputText?.value) {
          await navigator.clipboard.writeText(outputText.value);
          setMetrics(outputMetrics, { 
            status: { ok: true, msg: 'Copied to clipboard' }
          });
        } else {
          // Fallback
          outputText?.select();
          document.execCommand('copy');
          setMetrics(outputMetrics, { 
            status: { ok: true, msg: 'Copied to clipboard' }
          });
        }
      } catch (error) {
        setMetrics(outputMetrics, { 
          status: { ok: false, msg: 'Copy failed: ' + error.message }
        });
      }
    });
  }

  // Download as UTF-8 text
  if (btnDownloadText) {
    btnDownloadText.addEventListener('click', () => {
      if (!currentOutputData?.text) {
        setMetrics(outputMetrics, { 
          status: { ok: false, msg: 'Nothing to download. Convert first.' }
        });
        return;
      }
      
      const blob = new Blob([currentOutputData.text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = isEbcdicToText 
        ? (currentInputData?.filename?.replace(/\.[^.]*$/, '') || 'converted') + '.txt'
        : 'converted-text.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    });
  }

  // Download as EBCDIC bytes
  if (btnDownloadEbcdic) {
    btnDownloadEbcdic.addEventListener('click', () => {
      if (!currentOutputData?.bytes) {
        setMetrics(outputMetrics, { 
          status: { ok: false, msg: 'Nothing to download. Convert first.' }
        });
        return;
      }
      
      const blob = new Blob([currentOutputData.bytes], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = isEbcdicToText 
        ? 'converted-utf8.txt'
        : 'converted-ebcdic.ebc';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    });
  }

  // Clear functionality
  if (btnClear) {
    btnClear.addEventListener('click', clearData);
  }

  // Event listeners for mode changes
  if (inputModeFile) inputModeFile.addEventListener('change', updateInputMode);
  if (inputModeText) inputModeText.addEventListener('change', updateInputMode);
  if (outputModeText) outputModeText.addEventListener('change', updateOutputMode);
  if (outputModeHex) outputModeHex.addEventListener('change', updateOutputMode);

  // Initialize
  updateInputMode();
  updateOutputMode();
}

// Qwik dynamic loader
export function load(container, toolId) {
  ensureEbcdicConverterStyle();
  loadEbcdicConverterTool(container);
}