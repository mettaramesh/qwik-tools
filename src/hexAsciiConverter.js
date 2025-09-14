// Hex <-> ASCII Converter Tool (Qwik style)
// Converts ASCII text to hexadecimal and vice versa

export async function loadHexAsciiConverter(container) {
    // Load HTML template from external file (do not overwrite user manual edits)
    const html = await fetch('src/hexAsciiConverter.html').then(r => r.text());
    container.innerHTML = html;
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
    // Inject CSS via <link> if not already present
    if (!document.getElementById('hexascii-css-link')) {
        const link = document.createElement('link');
        link.id = 'hexascii-css-link';
        link.rel = 'stylesheet';
        link.href = 'hexAsciiConverter.css';
        document.head.appendChild(link);
    }
    loadHexAsciiConverter(container);
}
