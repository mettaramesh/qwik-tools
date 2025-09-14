// Hex Viewer Tool: UTF-8 Char to Hex
// Usage: loadHexViewerTool(container)

export function loadHexViewerTool(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2>Hex Viewer</h2>
            <p>Paste or type text below. Display each character's UTF-8 hex or code point. Hover hex to see character.</p>
        </div>
        <div class="tool-interface">
            <div class="flex-row gap-10 align-center mb-8">
                <textarea id="hexInput" rows="4" placeholder="Type or paste text here..."></textarea>
                <button id="hexShowBtn" class="hex-btn">Show Hex Codes</button>
            </div>
            <div class="hex-toggle-row">
                <label><input type="radio" name="hexViewMode" value="hex" checked> Hexcode</label>
                <label><input type="radio" name="hexViewMode" value="codepoint"> Code Point</label>
            </div>
            <div class="hex-output-toolbar flex-row gap-12 mb-8 align-center">
// Load external stylesheet for hexViewerTool
function ensureHexViewerToolStyle(){
    if (!document.getElementById('hex-viewer-tool-style-link')) {
        const link = document.createElement('link');
        link.id = 'hex-viewer-tool-style-link';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = './hexViewerTool.css';
        document.head.appendChild(link);
    }
}
ensureHexViewerToolStyle();
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

// Load CSS via <link> for CSP compliance
export function load(container) {
    // Inject CSS via <link> if not already present
    if (!document.getElementById('hexviewer-css-link')) {
        const link = document.createElement('link');
        link.id = 'hexviewer-css-link';
        link.rel = 'stylesheet';
        link.href = 'hexViewerTool.css';
        document.head.appendChild(link);
    }
    loadHexViewerTool(container);
}
