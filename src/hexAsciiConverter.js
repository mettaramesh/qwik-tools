// Hex <-> ASCII Converter Tool (Qwik style)
// Converts ASCII text to hexadecimal and vice versa

export function loadHexAsciiConverter(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2>Hex ↔ ASCII Converter</h2>
            <p class="small">Convert between ASCII text and hexadecimal representation. Non-ASCII bytes will be shown as "." in ASCII output.</p>
        </div>
        <div class="grid-hexascii">
            <div class="card">
                <h3>ASCII Input</h3>
                <textarea id="asciiInput" rows="7" placeholder="Type or paste ASCII text here..."></textarea>
                <div class="row">
                    <button class="btn btn--primary" id="btnToHex">ASCII → Hex</button>
                    <button class="btn btn--outline" id="btnClearAscii">Clear</button>
                    <button class="btn btn--outline" id="btnCopyHex">Copy Hex</button>
                </div>
                <div class="metrics" id="asciiMetrics"></div>
            </div>
            <div class="card">
                <h3>Hex Input</h3>
                <textarea id="hexInput" rows="7" placeholder="Type or paste hex codes here (e.g. 48656c6c6f)..."></textarea>
                <div class="row">
                    <button class="btn btn--primary" id="btnToAscii">Hex → ASCII</button>
                    <button class="btn btn--outline" id="btnClearHex">Clear</button>
                    <button class="btn btn--outline" id="btnCopyAscii">Copy ASCII</button>
                </div>
                <div class="metrics" id="hexMetrics"></div>
            </div>
        </div>
        <div class="row" style="margin-top:18px;justify-content:center">
            <button class="btn btn--outline" id="btnSwap">Swap ⮂</button>
        </div>
    `;
    setupHexAsciiConverter();
}

function setupHexAsciiConverter() {
    const el = id => document.getElementById(id);
    const asciiInput = el('asciiInput');
    const hexInput = el('hexInput');
    const btnToHex = el('btnToHex');
    const btnToAscii = el('btnToAscii');
    const btnClearAscii = el('btnClearAscii');
    const btnClearHex = el('btnClearHex');
    const btnCopyHex = el('btnCopyHex');
    const btnCopyAscii = el('btnCopyAscii');
    const btnSwap = el('btnSwap');
    const asciiMetrics = el('asciiMetrics');
    const hexMetrics = el('hexMetrics');

    function asciiToHex(str) {
        return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2,'0')).join('');
    }
    function hexToAscii(hex) {
        hex = hex.replace(/[^0-9a-fA-F]/g, '');
        if (hex.length % 2 !== 0) throw new Error('Hex length must be even.');
        let out = '';
        for (let i = 0; i < hex.length; i += 2) {
            const code = parseInt(hex.slice(i, i+2), 16);
            out += (code >= 32 && code <= 126) ? String.fromCharCode(code) : '.';
        }
        return out;
    }
    function setMetrics(el, {textLen=null, byteLen=null, status=null}) {
        el.innerHTML = '';
        if (textLen!=null) addPill(el, `Chars: ${textLen}`);
        if (byteLen!=null) addPill(el, `Bytes: ${byteLen}`);
        if (status) addPill(el, status.msg, status.ok ? 'ok' : 'bad');
    }
    function addPill(el, text, cls='') {
        const span = document.createElement('span');
        span.className = 'pill ' + (cls||'');
        span.textContent = text;
        el.appendChild(span);
    }
    btnToHex.addEventListener('click', () => {
        const ascii = asciiInput.value;
        const hex = asciiToHex(ascii);
        hexInput.value = hex;
        setMetrics(asciiMetrics, { textLen: ascii.length, byteLen: ascii.length, status: {ok:true, msg:'Converted to hex'} });
        setMetrics(hexMetrics, { textLen: null, byteLen: hex.length/2, status: {ok:true, msg:'Hex output'} });
    });
    btnToAscii.addEventListener('click', () => {
        try {
            const hex = hexInput.value;
            const ascii = hexToAscii(hex);
            asciiInput.value = ascii;
            setMetrics(hexMetrics, { textLen: null, byteLen: hex.replace(/[^0-9a-fA-F]/g, '').length/2, status: {ok:true, msg:'Converted to ASCII'} });
            setMetrics(asciiMetrics, { textLen: ascii.length, byteLen: ascii.length, status: {ok:true, msg:'ASCII output'} });
        } catch (e) {
            setMetrics(hexMetrics, { status: {ok:false, msg:e.message} });
        }
    });
    btnClearAscii.addEventListener('click', () => {
        asciiInput.value = '';
        asciiMetrics.innerHTML = '';
    });
    btnClearHex.addEventListener('click', () => {
        hexInput.value = '';
        hexMetrics.innerHTML = '';
    });
    btnCopyHex.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(hexInput.value);
            setMetrics(hexMetrics, { status:{ok:true, msg:'Copied to clipboard'} });
        } catch {
            alert('Clipboard copy failed.');
        }
    });
    btnCopyAscii.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(asciiInput.value);
            setMetrics(asciiMetrics, { status:{ok:true, msg:'Copied to clipboard'} });
        } catch {
            alert('Clipboard copy failed.');
        }
    });
    btnSwap.addEventListener('click', () => {
        const a = asciiInput.value;
        asciiInput.value = hexInput.value;
        hexInput.value = a;
    });
}

// Qwik expects a default export named 'load' for dynamic tool loading
export function load(container) {
    loadHexAsciiConverter(container);
}

// Add Qwik-style grid and spacing for hex-ascii tool
if (!document.getElementById('qwik-hexascii-style')) {
    const style = document.createElement('style');
    style.id = 'qwik-hexascii-style';
    style.textContent = `
    .grid-hexascii {
        display: grid;
        gap: 28px 36px;
        grid-template-columns: 1fr 1fr;
        margin-bottom: 24px;
    }
    @media (max-width: 900px) {
        .grid-hexascii { grid-template-columns: 1fr; }
    }
    .grid-hexascii label {
        font-weight: 600;
        font-size: 1.08em;
        color: var(--color-primary, #21808d);
        margin-bottom: 6px;
        display: block;
    }
    .grid-hexascii textarea {
        width: 100%;
        min-height: 120px;
        background: var(--color-background, #f9f9f9);
        border: 1.5px solid var(--color-border, #e0e0e0);
        color: var(--color-text, #13343b);
        padding: 13px 14px;
        border-radius: 10px;
        font-size: 1.08em;
        margin-bottom: 10px;
        resize: vertical;
    }
    .grid-hexascii .btn--primary {
        background: var(--color-primary, #21808d);
        color: #fff;
        border: none;
        padding: 10px 18px;
        font-size: 1em;
        border-radius: 10px;
        margin-bottom: 0;
    }
    .grid-hexascii .btn--outline {
        background: #fff;
        color: var(--color-primary, #21808d);
        border: 1.5px solid var(--color-primary, #21808d);
        padding: 10px 18px;
        font-size: 1em;
        border-radius: 10px;
        margin-bottom: 0;
    }
    .metrics {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 8px;
    }
    .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 1px dashed #2a2f47;
        border-radius: 999px;
        padding: 4px 8px;
        color: #626c71;
        font-size: 0.98em;
    }
    .pill.ok{border-color:#2b5; color:#9fd}
    .pill.bad{border-color:#c0392b; color:#ffc4c4}
    .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:10px}
    .card{background:var(--color-surface, #fff);border:1.5px solid var(--color-border, #e0e0e0);border-radius:14px;padding:18px 18px 14px 18px;box-shadow:0 2px 8px #0001;}
    h3{font-size:1.18em;margin:0 0 8px 0}
    `;
    document.head.appendChild(style);
}
