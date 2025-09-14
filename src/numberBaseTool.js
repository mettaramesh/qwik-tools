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
                <div class="nb-grid-span">
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
    // Inject CSS via <link> if not already present
    if (!document.getElementById('numberbase-css-link')) {
        const link = document.createElement('link');
        link.id = 'numberbase-css-link';
        link.rel = 'stylesheet';
        link.href = 'numberBaseTool.css';
        document.head.appendChild(link);
    }
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

export default {
    render: loadNumberBaseTool,
    postLoad: setupNumberBaseTool
};
