// Hex Viewer Tool: UTF-8 Char to Hex
// Usage: loadHexViewerTool(container)

export function loadHexViewerTool(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2>Hex Viewer</h2>
            <p>Paste or type text below. Display each character's UTF-8 hex or code point. Hover hex to see character.</p>
        </div>
        <div class="tool-interface">
            <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px;">
                <textarea id="hexInput" rows="4" placeholder="Type or paste text here..."></textarea>
                <button id="hexShowBtn" class="hex-btn">Show Hex Codes</button>
            </div>
            <div class="hex-toggle-row">
                <label><input type="radio" name="hexViewMode" value="hex" checked> Hexcode</label>
                <label><input type="radio" name="hexViewMode" value="codepoint"> Code Point</label>
            </div>
            <div class="hex-output-toolbar" style="display:flex;gap:12px;margin-bottom:8px;align-items:center;">
                <button id="hexCopyBtn" class="hex-btn">Copy Output</button>
                <button id="hexClearBtn" class="hex-btn">Clear Output</button>
            </div>
            <div id="hexOutput" class="hex-output"></div>
        </div>
    `;
    setupHexViewerTool();
}

export function setupHexViewerTool() {
    const input = document.getElementById('hexInput');
    const output = document.getElementById('hexOutput');
    const modeRadios = document.getElementsByName('hexViewMode');
    const copyBtn = document.getElementById('hexCopyBtn');
    const clearBtn = document.getElementById('hexClearBtn');
    const showBtn = document.getElementById('hexShowBtn');
    function toHex(byte) {
        return byte.toString(16).padStart(2, '0').toUpperCase();
    }
    function render(str, mode) {
        if (!str) { output.innerHTML = ''; return; }
        if (mode === 'hex') {
            let html = '';
            for (const ch of str) {
                const utf8 = new TextEncoder().encode(ch);
                const hex = Array.from(utf8).map(toHex).join(' ');
                html += `<span class="hexcode" data-char="${escapeHtml(ch)}" title="${escapeHtml(ch)}">${hex}</span> `;
            }
            output.innerHTML = html.trim();
        } else {
            let html = '';
            for (const ch of str) {
                const code = ch.codePointAt(0);
                html += `<span class="codepoint" data-char="${escapeHtml(ch)}">U+${code.toString(16).toUpperCase().padStart(4,'0')}</span> `;
            }
            output.innerHTML = html.trim();
        }
    }
    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function getMode() {
        return Array.from(modeRadios).find(r=>r.checked)?.value || 'hex';
    }
    showBtn.addEventListener('click', () => render(input.value, getMode()));
    modeRadios.forEach(r => r.addEventListener('change', () => render(input.value, getMode())));
    // Tooltip on hover (hexcode and codepoint)
    output.addEventListener('mouseover', e => {
        if (e.target.classList.contains('hexcode') || e.target.classList.contains('codepoint')) {
            const char = e.target.getAttribute('data-char');
            showHexTooltip(e.target, char);
        }
    });
    output.addEventListener('mouseout', e => {
        if (e.target.classList.contains('hexcode') || e.target.classList.contains('codepoint')) {
            hideHexTooltip();
        }
    });
    copyBtn.addEventListener('click', () => {
        const text = output.textContent || '';
        if (text) navigator.clipboard.writeText(text);
    });
    clearBtn.addEventListener('click', () => {
        output.innerHTML = '';
        input.value = '';
    });
    render(input.value, getMode());
}

// Tooltip helpers
let hexTooltipDiv;
function showHexTooltip(target, char) {
    if (!hexTooltipDiv) {
        hexTooltipDiv = document.createElement('div');
        hexTooltipDiv.className = 'hex-tooltip';
        document.body.appendChild(hexTooltipDiv);
    }
    hexTooltipDiv.textContent = char;
    const rect = target.getBoundingClientRect();
    hexTooltipDiv.style.display = 'block';
    hexTooltipDiv.style.left = (rect.left + window.scrollX + rect.width/2 - 12) + 'px';
    hexTooltipDiv.style.top = (rect.top + window.scrollY - 36) + 'px';
}
function hideHexTooltip() {
    if (hexTooltipDiv) hexTooltipDiv.style.display = 'none';
}

// Add minimal CSS for hex output and tooltip
if (!document.getElementById('hex-viewer-style')) {
    const style = document.createElement('style');
    style.id = 'hex-viewer-style';
    style.textContent = `
    .hex-toggle-row { margin: 10px 0 8px 0; display: flex; gap: 18px; }
    .hex-toggle-row label { font-size: 1.08em; color: var(--color-primary, #21808d); font-weight: 600; cursor: pointer; }
    .hex-output-toolbar { margin: 0 0 8px 0; }
    .hex-btn { padding: 7px 18px; border-radius: 7px; border: 1.5px solid var(--color-border,#c0c0c0); background: rgba(255,255,255,0.7); color: var(--color-btn-text,#21808d); font-size: 1em; font-weight: 500; cursor: pointer; transition: background .15s, box-shadow .15s; box-shadow: 0 1px 4px #0001; }
    .hex-btn:active { background: #e0e0e0; }
    .hex-output { font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace; font-size: 1.13em; background: var(--color-background, #f9f9f9); border: 1.5px solid var(--color-border, #e0e0e0); border-radius: 8px; padding: 14px 12px; min-height: 48px; word-break: break-all; max-height: 320px; overflow-y: auto; }
    .hexcode, .codepoint { display: inline-block; margin: 0 4px 6px 0; padding: 2px 7px; border-radius: 6px; background: var(--color-surface, #fff); color: var(--color-primary, #21808d); border: 1.2px solid var(--color-border, #e0e0e0); transition: box-shadow 0.18s; cursor: pointer; }
    .hexcode:hover { background: var(--color-primary, #21808d); color: #fff; box-shadow: 0 2px 8px rgba(33,128,141,0.13); z-index: 2; }
    .hex-tooltip { position: absolute; z-index: 9999; background: var(--color-surface, #fff); color: var(--color-primary, #21808d); border: 1.5px solid var(--color-primary, #21808d); border-radius: 8px; padding: 7px 13px; font-size: 1.25em; font-family: inherit; box-shadow: 0 2px 12px rgba(33,128,141,0.13); pointer-events: none; display: none; }
    #hexInput { width: 100%; font-size: 1.12em; padding: 12px 14px; border-radius: 8px; border: 1.5px solid var(--color-border, #e0e0e0); margin-bottom: 8px; background: var(--color-background, #f9f9f9); color: var(--color-text, #13343b); }
    `;
    document.head.appendChild(style);
}

export function load(container) { loadHexViewerTool(container); }
