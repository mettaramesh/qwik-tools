// Number Base Converter Tool (Qwik style)
// Supports bases 2–36 with BigInt precision, signed/unsigned, grouping, and prefix options

export function loadNumberBaseTool(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2>Number Base Converter</h2>
            <p>Type in any box. The rest update instantly. Supports bases 2–36 with BigInt precision.</p>
        </div>
        <div class="tool-interface">
            <div class="tool-controls">
                <div class="group">
                    <label for="signedToggle" class="signed-label">
                        <input id="signedToggle" type="checkbox" checked class="signed-checkbox">
                        Signed
                    </label>
                </div>
                <div class="group">
                    <label for="groupSize">Grouping</label>
                    <select id="groupSize" class="base-select">
                        <option value="0">Off</option>
                        <option value="4">Every 4</option>
                        <option value="3" selected>Every 3</option>
                        <option value="8">Every 8</option>
                    </select>
                </div>
                <div class="group">
                    <label for="prefixes">Prefixes</label>
                    <select id="prefixes" class="base-select">
                        <option value="none" selected>None</option>
                        <option value="std">Standard (0b/0o/0x)</option>
                    </select>
                </div>
                <div class="group">
                    <button id="clearAll" class="btn btn--outline" title="Clear all inputs">Clear</button>
                </div>
            </div>
            <div class="io-container grid-base">
                <div>
                    <div class="row">
                        <label>Binary</label>
                        <div class="inp"><input id="bin" type="text" placeholder="e.g. 1010" autocomplete="off" spellcheck="false"></div>
                        <button class="btn btn--sm" data-copy="bin">Copy</button>
                    </div>
                    <div id="binMsg" class="hint">Digits: 0–1</div>
                </div>
                <div>
                    <div class="row">
                        <label>Octal</label>
                        <div class="inp"><input id="oct" type="text" placeholder="e.g. 12" autocomplete="off" spellcheck="false"></div>
                        <button class="btn btn--sm" data-copy="oct">Copy</button>
                    </div>
                    <div id="octMsg" class="hint">Digits: 0–7</div>
                </div>
                <div>
                    <div class="row">
                        <label>Decimal</label>
                        <div class="inp"><input id="dec" type="text" placeholder="e.g. 10" autocomplete="off" spellcheck="false"></div>
                        <button class="btn btn--sm" data-copy="dec">Copy</button>
                    </div>
                    <div id="decMsg" class="hint">Digits: 0–9</div>
                </div>
                <div>
                    <div class="row">
                        <label>Hex</label>
                        <div class="inp"><input id="hex" type="text" placeholder="e.g. a" autocomplete="off" spellcheck="false"></div>
                        <button class="btn btn--sm" data-copy="hex">Copy</button>
                    </div>
                    <div id="hexMsg" class="hint">Digits: 0–9 a–z</div>
                </div>
                <div style="grid-column:1 / -1">
                    <div class="row">
                        <label>Custom</label>
                        <select id="customBase" class="base-select" title="Choose a base from 2 to 36"></select>
                        <div class="inp"><input id="custom" type="text" placeholder="Enter number in chosen base" autocomplete="off" spellcheck="false"></div>
                        <button class="btn btn--sm" data-copy="custom">Copy</button>
                    </div>
                    <div id="customMsg" class="hint">Base 2–36</div>
                </div>
            </div>
            <div class="footer">Tips: Use <code>-</code> for negatives (when Signed is on). Copy adds prefixes when enabled.</div>
        </div>
    `;
    setupNumberBaseTool();
}

export function load(container) {
    loadNumberBaseTool(container);
    setupNumberBaseTool();
}

export function setupNumberBaseTool() {
    const el = id => document.getElementById(id);
    const inputs = { bin: el('bin'), oct: el('oct'), dec: el('dec'), hex: el('hex'), custom: el('custom') };
    const msgs   = { bin: el('binMsg'), oct: el('octMsg'), dec: el('decMsg'), hex: el('hexMsg'), custom: el('customMsg') };
    const signedToggle = el('signedToggle');
    const groupSizeSel = el('groupSize');
    const prefixesSel  = el('prefixes');
    const customBaseSel = el('customBase');

    // Populate custom base 2..36
    for(let b=2;b<=36;b++){
        const opt=document.createElement('option');
        opt.value=String(b); opt.textContent=`Base ${b}`;
        if(b===5) opt.textContent += ' · quinary';
        if(b===8) opt.textContent += ' · octal';
        if(b===10) opt.textContent += ' · decimal';
        if(b===12) opt.textContent += ' · dozenal';
        if(b===16) opt.textContent += ' · hex';
        customBaseSel.appendChild(opt);
    }
    customBaseSel.value='7';

    const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';
    function sanitize(str){
        return (str||'').trim().toLowerCase().replace(/[_\s]/g,'');
    }
    function validRegexForBase(base, signed){
        const body = base<=10 ? `[0-${base-1}]` : `[0-9a-${DIGITS[base-1]}]`;
        const sign = signed ? '-?' : '';
        return new RegExp(`^${sign}(?:${body})+$`);
    }
    function parseToBigInt(str, base, signed){
        const s = sanitize(str);
        if(!s){ return null; }
        const re = validRegexForBase(base, signed);
        if(!re.test(s)) throw new Error(`Invalid digits for base ${base}`);
        let negative = false;
        let i = 0;
        if(signed && s[0]==='-'){ negative = true; i = 1; }
        let value = 0n;
        for(; i < s.length; i++){
            const ch = s[i];
            const idx = BigInt(DIGITS.indexOf(ch));
            if(idx < 0n || idx >= BigInt(base)) throw new Error('Bad digit');
            value = value * BigInt(base) + idx;
        }
        return negative ? -value : value;
    }
    function groupDigits(str, groupSize) {
        if (!groupSize || groupSize <= 0) return str;
        // Remove any existing spaces
        str = str.replace(/\s+/g, '');
        let out = '';
        let count = 0;
        for (let i = str.length - 1; i >= 0; i--) {
            out = str[i] + out;
            count++;
            if (count % groupSize === 0 && i !== 0) {
                out = ' ' + out;
            }
        }
        return out;
    }
    function formatFromBigInt(value, base, groupSize) {
        if (value === null || value === undefined) return '';
        const negative = value < 0n;
        let v = negative ? -value : value;
        if (v === 0n) return '0';
        let out = '';
        const B = BigInt(base);
        while (v > 0n) {
            const d = v % B;
            out = DIGITS[Number(d)] + out;
            v = v / B;
        }
        out = groupDigits(out, groupSize);
        return negative ? '-' + out : out;
    }
    function prefixFor(base){
        switch(base){
            case 2: return '0b';
            case 8: return '0o';
            case 16: return '0x';
            default: return '';
        }
    }
    function setMsg(id, text, ok=false){
        msgs[id].textContent = text;
        msgs[id].className = ok? 'ok' : /Invalid|error/i.test(text) ? 'err' : 'hint';
    }
    function copyText(id) {
        const baseMap = { bin: 2, oct: 8, dec: 10, hex: 16, custom: Number(customBaseSel.value) };
        let txt = inputs[id].value.trim();
        if (prefixesSel.value === 'std' && txt) {
            // Remove spaces for prefixing
            let sign = '';
            let rest = txt;
            if (txt.startsWith('-')) {
                sign = '-';
                rest = txt.slice(1);
            }
            rest = rest.replace(/\s|_/g, '');
            const pref = prefixFor(baseMap[id]);
            txt = sign + (pref ? pref : '') + rest;
        }
        navigator.clipboard.writeText(txt).then(() => {
            setMsg(id, 'Copied to clipboard ✔', true);
            setTimeout(() => setMsg(id, defaultHints[id]), 1400);
        }).catch(() => {
            setMsg(id, 'Clipboard error', false);
        });
    }
    const defaultHints = {
        bin: 'Digits: 0–1',
        oct: 'Digits: 0–7',
        dec: 'Digits: 0–9',
        hex: 'Digits: 0–9 a–z',
        custom: 'Base 2–36'
    };
    let updating = false;
    function updateFrom(source){
        if(updating) return; updating = true;
        const baseOf = {bin:2, oct:8, dec:10, hex:16, custom:Number(customBaseSel.value)};
        const groupSize = Number(groupSizeSel.value);
        let value = null;
        try {
            let raw = inputs[source].value;
            // Remove prefix before parsing
            raw = stripPrefix(raw, baseOf[source]);
            value = parseToBigInt(raw, baseOf[source], signedToggle.checked);
            setMsg(source, defaultHints[source]);
        } catch (err) {
            setMsg(source, String(err.message || err), false);
            updating = false; return;
        }
        const ids = ['bin', 'oct', 'dec', 'hex', 'custom'];
        ids.forEach(id => {
            if (id === source) return;
            const b = baseOf[id];
            let formatted = formatFromBigInt(value, b, groupSize);
            formatted = formatWithPrefix(formatted, b);
            inputs[id].value = formatted;
            setMsg(id, defaultHints[id]);
        });
        // Also update the source field to show prefix if needed
        const bSrc = baseOf[source];
        let srcFormatted = formatFromBigInt(value, bSrc, groupSize);
        srcFormatted = formatWithPrefix(srcFormatted, bSrc);
        inputs[source].value = srcFormatted;
        updating = false;
    }
    function stripPrefix(str, base) {
        str = str.trim();
        if (base === 2 && str.startsWith('0b')) return str.slice(2);
        if (base === 8 && str.startsWith('0o')) return str.slice(2);
        if (base === 16 && str.startsWith('0x')) return str.slice(2);
        return str;
    }
    function shouldShowPrefix(base) {
        return prefixesSel.value === 'std' && (base === 2 || base === 8 || base === 16);
    }
    function formatWithPrefix(str, base) {
        if (!str) return '';
        let sign = '';
        let rest = str;
        if (str.startsWith('-')) {
            sign = '-';
            rest = str.slice(1);
        }
        if (shouldShowPrefix(base)) {
            return sign + prefixFor(base) + rest.replace(/\s|_/g, '');
        }
        return str;
    }
    Object.keys(inputs).forEach(id=>{
        inputs[id].addEventListener('input', ()=> updateFrom(id));
        inputs[id].addEventListener('focus', ()=> msgs[id].className='hint');
    });
    document.querySelectorAll('[data-copy]').forEach(btn=>{
        btn.addEventListener('click', ()=> copyText(btn.dataset.copy));
    });
    groupSizeSel.addEventListener('change', ()=>{
        const order=['dec','hex','bin','oct','custom'];
        const src = order.find(id=> inputs[id].value.trim()!=='' ) || 'dec';
        updateFrom(src);
    });
    prefixesSel.addEventListener('change', () => {
        // Reformat all fields to show/hide prefix as needed
        const src = ['custom', 'dec', 'hex', 'bin', 'oct'].find(id => inputs[id].value.trim() !== '') || 'dec';
        updateFrom(src);
    });
    customBaseSel.addEventListener('change', ()=>{
        const src = ['custom','dec','hex','bin','oct'].find(id=> inputs[id].value.trim()!=='') || 'dec';
        updateFrom(src);
        setMsg('custom', `Digits: 0–${Number(customBaseSel.value)-1} (a–${DIGITS[Number(customBaseSel.value)-1]||''} for ≥ 10)`);
    });
    el('clearAll').addEventListener('click', ()=>{
        Object.values(inputs).forEach(i=> i.value='');
        Object.keys(msgs).forEach(k=> setMsg(k, defaultHints[k]));
    });
    document.addEventListener('keydown', (e)=>{
        if(e.key==='Enter' && (e.ctrlKey||e.metaKey)){
            const focused = document.activeElement;
            const id = Object.entries(inputs).find(([,node])=> node===focused)?.[0];
            if(id) copyText(id);
        }
    });
    inputs.dec.value = '2025';
    updateFrom('dec');
}

// Add Qwik-style grid and spacing, but use project color variables
// Add grid-base class for better spacing
// Add style block for grid-base and row spacing
if (!document.getElementById('qwik-number-base-style')) {
    const style = document.createElement('style');
    style.id = 'qwik-number-base-style';
    style.textContent = `
    .grid-base {
        display: grid;
        gap: 28px 36px;
        grid-template-columns: 1fr 1fr;
        margin-bottom: 24px;
    }
    @media (max-width: 900px) {
        .grid-base { grid-template-columns: 1fr; }
    }
    .grid-base .row {
        background: var(--color-surface, #fff);
        border: 1.5px solid var(--color-border, #e0e0e0);
        border-radius: 14px;
        padding: 18px 18px 32px 18px;
        margin-bottom: 0;
        display: flex;
        gap: 18px;
        align-items: center;
        position: relative;
    }
    .grid-base .hint, .grid-base .ok, .grid-base .err {
        position: absolute;
        left: 24px;
        bottom: 6px;
        margin-left: 0;
        font-size: 1em;
        background: transparent;
        padding: 0 2px;
        pointer-events: none;
        z-index: 2;
        opacity: 1;
    }
    .grid-base > div { position: relative; }
    .grid-base > div > .hint,
    .grid-base > div > .ok,
    .grid-base > div > .err {
        left: 24px;
        bottom: 6px;
    }
    .grid-base label {
        min-width: 90px;
        font-weight: 600;
        font-size: 1.08em;
        color: var(--color-primary, #21808d);
    }
    .grid-base .inp input[type=text] {
        width: 100%;
        background: var(--color-background, #f9f9f9);
        border: 1.5px solid var(--color-border, #e0e0e0);
        color: var(--color-text, #13343b);
        padding: 13px 14px;
        border-radius: 10px;
        font-size: 1.08em;
    }
    .grid-base .btn--sm {
        padding: 10px 18px;
        font-size: 1em;
        border-radius: 10px;
    }
    .tool-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 12px 20px;
        margin-bottom: 18px;
        align-items: flex-start;
    }
    .tool-controls .group {
        display: flex;
        align-items: center;
        gap: 10px;
        background: var(--color-surface, #fff);
        border: 1.5px solid var(--color-border, #e0e0e0);
        border-radius: 14px;
        padding: 10px 18px;
        font-size: 1.08em;
        min-width: 170px;
        margin-bottom: 0;
        flex-shrink: 0;
    }
    .tool-controls .group:last-child {
        margin-left: auto;
    }
    .tool-controls .group label,
    .tool-controls .group span {
        font-size: 1em;
        font-weight: 600;
        color: var(--color-primary, #21808d);
    }
    .tool-controls .base-select {
        font-size: 1em;
        padding: 7px 12px;
        border-radius: 8px;
        border: 1.5px solid var(--color-border, #e0e0e0);
        background: var(--color-background, #f9f9f9);
        color: var(--color-text, #13343b);
    }
    .grid-base .row select.base-select {
        min-width: 130px;
        max-width: 220px;
        font-size: 1.08em;
        padding: 11px 18px;
        border-radius: 10px;
        border: 1.5px solid var(--color-primary, #21808d);
        background: linear-gradient(90deg, var(--color-background, #f9f9f9) 80%, var(--color-surface, #fff) 100%);
        color: var(--color-primary, #21808d);
        font-weight: 600;
        box-shadow: 0 1px 4px rgba(33,128,141,0.07);
        margin-right: 10px;
        transition: border 0.2s, box-shadow 0.2s;
    }
    .grid-base .row select.base-select:focus {
        outline: none;
        border-color: var(--color-primary-hover, #1d7480);
        box-shadow: 0 2px 8px rgba(33,128,141,0.13);
    }
    .tool-controls .switch {
        width: 56px;
        height: 26px;
        border-radius: 999px;
        border: 1.5px solid var(--color-primary, #21808d);
        background: var(--color-background, #f9f9f9);
        position: relative;
        display: inline-block;
        transition: background 0.2s, border 0.2s;
        vertical-align: middle;
        cursor: pointer;
        box-shadow: 0 1px 4px rgba(33,128,141,0.07);
    }
    .tool-controls .switch .toggle-label {
        position: absolute;
        top: 0;
        left: 6px;
        right: 6px;
        width: auto;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1em;
        font-weight: 700;
        pointer-events: none;
        user-select: none;
        color: inherit;
        letter-spacing: 0.5px;
        transition: color 0.2s;
        line-height: 26px;
    }
    .tool-controls .switch .toggle-label .on,
    .tool-controls .switch .toggle-label .off {
        display: flex;
        align-items: center;
        height: 100%;
        line-height: 26px;
        transition: color 0.2s, opacity 0.2s;
    }
    .tool-controls .switch .knob {
        position: absolute;
        top: 3px;
        left: 4px;
        width: 20px;
        height: 20px;
        background: var(--color-primary, #21808d);
        border-radius: 50%;
        transition: transform 0.22s cubic-bezier(.4,1.6,.6,1), background 0.2s;
        box-shadow: 0 1px 4px rgba(33,128,141,0.13);
    }
    .tool-controls .switch input:checked + .knob {
        transform: translateX(24px);
        background: var(--color-primary-hover, #1d7480);
    }
    .tool-controls .switch input:checked ~ .toggle-label {
        color: var(--color-primary-hover, #1d7480);
    }
    .tool-controls .switch:active .knob {
        box-shadow: 0 2px 8px rgba(33,128,141,0.18);
    }
    .footer {
        margin-top: 18px;
        color: var(--color-text-secondary, #626c71);
        font-size: 1.08em;
    }
    .signed-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1em;
        font-weight: 600;
        color: var(--color-primary, #21808d);
        cursor: pointer;
    }
    .signed-checkbox {
        width: 20px;
        height: 20px;
        accent-color: var(--color-primary, #21808d);
        border-radius: 5px;
        border: 1.5px solid var(--color-primary, #21808d);
        background: var(--color-background, #f9f9f9);
        transition: box-shadow 0.2s, border 0.2s;
        margin: 0;
    }
    .signed-checkbox:focus {
        outline: 2px solid var(--color-primary-hover, #1d7480);
        outline-offset: 2px;
    }
    `;
    document.head.appendChild(style);
}

export default {
    render: loadNumberBaseTool,
    postLoad: setupNumberBaseTool
};
