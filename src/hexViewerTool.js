// Hex Viewer Tool: UTF-8 Char to Hex
// Usage: loadHexViewerTool(container)

function ensureHexViewerToolStyle() {
    if (document.getElementById('hex-viewer-style')) return;
    const link = document.createElement('link');
    link.id = 'hex-viewer-style';
    link.rel = 'stylesheet';
    link.href = './hexViewerTool.css';
    document.head.appendChild(link);
}

export async function loadHexViewerTool(container) {
    ensureHexViewerToolStyle();
    try {
        // Load HTML template from external file
        const response = await fetch('hexViewerTool.html');
        if (!response.ok) {
            throw new Error(`Failed to load Hex Viewer HTML: ${response.status}`);
        }
        const html = await response.text();
        
        // Security check: ensure we're not loading the full page
        if (html.includes('<!DOCTYPE html') || html.includes('<html')) {
            throw new Error('Invalid HTML content - contains full page structure');
        }
        
        container.innerHTML = html;
        setupHexViewerTool();
    } catch (error) {
        console.error('Error loading Hex Viewer:', error);
        container.innerHTML = '<div class="error">Failed to load Hex Viewer tool</div>';
    }
}

export function setupHexViewerTool() {
    const input = document.getElementById('hexInput');
    const output = document.getElementById('hexOutput');
    const modeRadios = document.getElementsByName('hexViewMode');
    const copyBtn = document.getElementById('hexCopyBtn');
    const clearBtn = document.getElementById('hexClearBtn');
    const showBtn = document.getElementById('hexShowBtn');
    
    // Check if essential elements exist
    if (!input || !output) {
        console.error('Hex Viewer: Missing essential DOM elements');
        return;
    }
    
    function toHex(byte) {
        return byte.toString(16).padStart(2, '0').toUpperCase();
    }
    function render(str, mode) {
        if (!output) return;
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
    if (showBtn) showBtn.addEventListener('click', () => render(input.value, getMode()));
    if (input) {
        input.addEventListener('input', () => render(input.value, getMode()));
    }
    
    if (modeRadios && modeRadios.length) {
        modeRadios.forEach(r => {
            if (r) r.addEventListener('change', () => render(input.value, getMode()));
        });
    }
    
    if (showBtn && input) {
        showBtn.addEventListener('click', () => render(input.value, getMode()));
    }
    // Tooltip on hover (hexcode and codepoint)
    if (output) {
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
    }
    if (copyBtn && output) {
        copyBtn.addEventListener('click', () => {
            const text = output.textContent || '';
            if (text) navigator.clipboard.writeText(text);
        });
    }
    if (clearBtn && output && input) {
        clearBtn.addEventListener('click', () => {
            output.innerHTML = '';
            input.value = '';
        });
    }
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
