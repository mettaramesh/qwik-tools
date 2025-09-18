// Hex <-> ASCII Converter Tool (Qwik style)
// Converts ASCII text to hexadecimal and vice versa

export async function loadHexAsciiConverter(container) {
    // Create HTML structure using DOM methods to avoid CSP issues
    container.innerHTML = '';
    
    // Tool header
    const toolHeader = document.createElement('div');
    toolHeader.className = 'tool-header';
    
    const title = document.createElement('h2');
    title.textContent = 'Hex ↔ ASCII Converter';
    toolHeader.appendChild(title);
    
    const description = document.createElement('p');
    description.className = 'small';
    description.textContent = 'Convert between ASCII text and hexadecimal representation. Non-ASCII bytes will be shown as "." in ASCII output.';
    toolHeader.appendChild(description);
    
    container.appendChild(toolHeader);
    
    // Grid container
    const grid = document.createElement('div');
    grid.className = 'grid-hexascii';
    
    // ASCII Card
    const asciiCard = document.createElement('div');
    asciiCard.className = 'card';
    
    const asciiTitle = document.createElement('h3');
    asciiTitle.textContent = 'ASCII Input';
    asciiCard.appendChild(asciiTitle);
    
    const asciiInput = document.createElement('textarea');
    asciiInput.id = 'asciiInput';
    asciiInput.rows = 8;
    asciiInput.placeholder = 'Type or paste ASCII text here...';
    asciiCard.appendChild(asciiInput);
    
    const asciiRow = document.createElement('div');
    asciiRow.className = 'row';
    
    const btnToHex = document.createElement('button');
    btnToHex.className = 'btn btn--primary';
    btnToHex.id = 'btnToHex';
    btnToHex.textContent = 'ASCII → Hex';
    asciiRow.appendChild(btnToHex);
    
    const btnClearAscii = document.createElement('button');
    btnClearAscii.className = 'btn btn--outline';
    btnClearAscii.id = 'btnClearAscii';
    btnClearAscii.textContent = 'Clear';
    asciiRow.appendChild(btnClearAscii);
    
    const btnCopyHex = document.createElement('button');
    btnCopyHex.className = 'btn btn--outline';
    btnCopyHex.id = 'btnCopyHex';
    btnCopyHex.textContent = 'Copy Hex';
    asciiRow.appendChild(btnCopyHex);
    
    asciiCard.appendChild(asciiRow);
    
    const asciiMetrics = document.createElement('div');
    asciiMetrics.className = 'metrics';
    asciiMetrics.id = 'asciiMetrics';
    asciiCard.appendChild(asciiMetrics);
    
    grid.appendChild(asciiCard);
    
    // Hex Card
    const hexCard = document.createElement('div');
    hexCard.className = 'card';
    
    const hexTitle = document.createElement('h3');
    hexTitle.textContent = 'Hex Input';
    hexCard.appendChild(hexTitle);
    
    const hexInput = document.createElement('textarea');
    hexInput.id = 'hexInput';
    hexInput.rows = 8;
    hexInput.placeholder = 'Type or paste hex codes here (e.g. 48656c6c6f)...';
    hexCard.appendChild(hexInput);
    
    const hexRow = document.createElement('div');
    hexRow.className = 'row';
    
    const btnToAscii = document.createElement('button');
    btnToAscii.className = 'btn btn--primary';
    btnToAscii.id = 'btnToAscii';
    btnToAscii.textContent = 'Hex → ASCII';
    hexRow.appendChild(btnToAscii);
    
    const btnClearHex = document.createElement('button');
    btnClearHex.className = 'btn btn--outline';
    btnClearHex.id = 'btnClearHex';
    btnClearHex.textContent = 'Clear';
    hexRow.appendChild(btnClearHex);
    
    const btnCopyAscii = document.createElement('button');
    btnCopyAscii.className = 'btn btn--outline';
    btnCopyAscii.id = 'btnCopyAscii';
    btnCopyAscii.textContent = 'Copy ASCII';
    hexRow.appendChild(btnCopyAscii);
    
    hexCard.appendChild(hexRow);
    
    const hexMetrics = document.createElement('div');
    hexMetrics.className = 'metrics';
    hexMetrics.id = 'hexMetrics';
    hexCard.appendChild(hexMetrics);
    
    grid.appendChild(hexCard);
    container.appendChild(grid);
    
    // Swap button row
    const swapRow = document.createElement('div');
    swapRow.className = 'row mt-24 jc-center';
    
    const btnSwap = document.createElement('button');
    btnSwap.className = 'btn btn--outline';
    btnSwap.id = 'btnSwap';
    btnSwap.textContent = 'Swap ↔';
    swapRow.appendChild(btnSwap);
    
    container.appendChild(swapRow);
    
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
        // Clear metrics when swapping
        asciiMetrics.innerHTML = '';
        hexMetrics.innerHTML = '';
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
