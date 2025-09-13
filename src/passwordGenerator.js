// Password Generator Tool (Qwik style)
// Category: Generators
// UI: Modern, clean, non-congested, project-style grid/cards/buttons/combos

export function loadPasswordGeneratorTool(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2>Password Generator</h2>
            <p class="small">Generate strong, random passwords using cryptographically secure randomness. Customize length, character sets, and more.</p>
        </div>
        <div class="grid-charset" style="color:#111;">
            <!-- Settings -->
            <div class="card">
                <h3>Settings</h3>
                <div class="row" style="margin-bottom:10px;">
                    <label for="pwgen-len">Length</label>
                    <input id="pwgen-len" type="range" min="8" max="128" value="16" style="flex:1;max-width:220px;">
                    <input id="pwgen-lenNum" type="number" min="8" max="128" value="16" style="width:80px;">
                </div>
                <div class="row" style="margin-bottom:10px;flex-wrap:wrap;gap:18px 18px;">
                    <label><input type="checkbox" id="pwgen-lower" checked> a–z</label>
                    <label><input type="checkbox" id="pwgen-upper" checked> A–Z</label>
                    <label><input type="checkbox" id="pwgen-digits" checked> 0–9</label>
                    <label><input type="checkbox" id="pwgen-symbols" checked> Symbols</label>
                </div>
                <div class="row" style="margin-bottom:10px;">
                    <label for="pwgen-symset">Symbol set</label>
                    <input id="pwgen-symset" type="text" value="!@#$%^&*()_-+=[]{};:,.?/~" style="min-width:180px;">
                </div>
                <div class="row" style="margin-bottom:10px;flex-wrap:wrap;gap:18px 18px;">
                    <label><input type="checkbox" id="pwgen-noSimilar"> Exclude similar (O0 l1 I| S5 B8)</label>
                    <label><input type="checkbox" id="pwgen-noRepeat"> No immediate repeats</label>
                    <label><input type="checkbox" id="pwgen-noAmbig"> Exclude ambiguous (&#123; &#125; [ ] ( ) / \\ ' &quot; &#96; ~ , ; : .)</label>
                </div>
                <div class="row" style="margin-bottom:10px;">
                    <label for="pwgen-count">How many</label>
                    <input id="pwgen-count" type="number" min="1" max="200" value="5" style="width:70px;">
                    <button id="pwgen-btnGen" class="btn btn--primary">Generate</button>
                    <button id="pwgen-btnCopyAll" class="btn btn--outline">Copy all</button>
                    <button id="pwgen-btnDownload" class="btn btn--outline">Download .txt</button>
                </div>
                <div class="small">Guarantees at least one character from each selected class; uses <code>crypto.getRandomValues</code>. Strength = estimated entropy in bits.</div>
            </div>
            <!-- Output -->
            <div class="card">
                <h3>Passwords</h3>
                <div class="row" style="margin-bottom:10px;gap:18px 18px;">
                    <span class="pill" id="pwgen-metaLen">Chars: 16</span>
                    <span class="pill" id="pwgen-metaPool">Pool: 0</span>
                    <span class="pill" id="pwgen-metaEntropy">Entropy: 0 bits</span>
                </div>
                <div id="pwgen-list" class="list"></div>
                <div class="hr"></div>
                <label>All results</label>
                <textarea id="pwgen-allOut" readonly style="min-height:120px;"></textarea>
            </div>
        </div>
        <div class="card" style="margin-top:16px">
            <h3>Notes</h3>
            <ul class="small">
                <li>Use a unique password per site. Consider a manager (Bitwarden/1Password/Keepass) so you don’t reuse secrets.</li>
                <li>Entropy estimate uses <code>log2(poolSize^length)</code>. More symbols + longer length = more entropy.</li>
                <li>“Exclude similar/ambiguous” makes passwords easier to transcribe, but slightly reduces entropy.</li>
            </ul>
        </div>
    `;
    setupPasswordGeneratorTool();
}

export function setupPasswordGeneratorTool() {
    // Character sets and helpers
    const SETS = {
        lower: "abcdefghijklmnopqrstuvwxyz",
        upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        digits: "0123456789",
        symbolsDefault: "!@#$%^&*()_-+=[]{};:,.?/~"
    };
    const SIMILAR = new Set('O0oIl1|S5B8Z2'.split(''));
    const AMBIG   = new Set('{}[]()/\\\'"`~,;:.'.split(''));
    // DOM
    const el = id => document.getElementById(id);
    const len = el('pwgen-len');
    const lenNum = el('pwgen-lenNum');
    const lower = el('pwgen-lower');
    const upper = el('pwgen-upper');
    const digits = el('pwgen-digits');
    const symbols = el('pwgen-symbols');
    const symset = el('pwgen-symset');
    const noSimilar = el('pwgen-noSimilar');
    const noRepeat = el('pwgen-noRepeat');
    const noAmbig = el('pwgen-noAmbig');
    const count = el('pwgen-count');
    const btnGen = el('pwgen-btnGen');
    const btnCopyAll = el('pwgen-btnCopyAll');
    const btnDownload = el('pwgen-btnDownload');
    const list = el('pwgen-list');
    const allOut = el('pwgen-allOut');
    const metaLen = el('pwgen-metaLen');
    const metaPool = el('pwgen-metaPool');
    const metaEntropy = el('pwgen-metaEntropy');
    // Bind length controls
    len.addEventListener('input', ()=>{ lenNum.value = len.value; updateMeta(); });
    lenNum.addEventListener('input', ()=>{
        const v = Math.min(128, Math.max(8, parseInt(lenNum.value || 8)));
        lenNum.value = v; len.value = v; updateMeta();
    });
    [lower,upper,digits,symbols,symset,noSimilar,noAmbig].forEach(el => el.addEventListener('input', updateMeta));
    // Pool build
    function buildPool(){
        let pool = "";
        if (lower.checked) pool += SETS.lower;
        if (upper.checked) pool += SETS.upper;
        if (digits.checked) pool += SETS.digits;
        if (symbols.checked) pool += (symset.value || SETS.symbolsDefault);
        if (noSimilar.checked) pool = [...pool].filter(ch => !SIMILAR.has(ch)).join("");
        if (noAmbig.checked)   pool = [...pool].filter(ch => !AMBIG.has(ch)).join("");
        pool = Array.from(new Set(pool.split(''))).join('');
        return pool;
    }
    function updateMeta(){
        const L = parseInt(len.value);
        const pool = buildPool();
        metaLen.textContent = `Chars: ${L}`;
        metaPool.textContent = `Pool: ${pool.length}`;
        const H = pool.length ? (L * Math.log2(pool.length)) : 0;
        metaEntropy.textContent = `Entropy: ${H.toFixed(1)} bits`;
    }
    updateMeta();
    // Generation
    function csprngInt(maxExclusive){
        const buf = new Uint32Array(1);
        const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
        while(true){
            crypto.getRandomValues(buf);
            const x = buf[0];
            if (x < limit) return x % maxExclusive;
        }
    }
    function shuffle(arr){
        for(let i=arr.length-1;i>0;i--){
            const j = csprngInt(i+1);
            [arr[i],arr[j]] = [arr[j],arr[i]];
        }
        return arr;
    }
    function ensureAtLeastOneFromEach(passwordArr, activeSets){
        const idxs = shuffle([...Array(passwordArr.length).keys()]);
        let k = 0;
        for (const set of activeSets){
            if (!set || !set.length) continue;
            const pos = idxs[k++ % idxs.length];
            passwordArr[pos] = set[csprngInt(set.length)];
        }
    }
    function filterSet(str){
        let s = str;
        if (noSimilar.checked) s = [...s].filter(ch => !SIMILAR.has(ch)).join("");
        if (noAmbig.checked)   s = [...s].filter(ch => !AMBIG.has(ch)).join("");
        return s;
    }
    function genOne(){
        const L = parseInt(len.value);
        const pool = buildPool();
        if (!pool.length) throw new Error("No characters selected. Enable at least one set.");
        const activeSets = [];
        if (lower.checked) activeSets.push(filterSet(SETS.lower));
        if (upper.checked) activeSets.push(filterSet(SETS.upper));
        if (digits.checked) activeSets.push(filterSet(SETS.digits));
        if (symbols.checked) activeSets.push(filterSet(symset.value || SETS.symbolsDefault));
        const out = new Array(L);
        let last = null;
        for (let i=0;i<L;i++){
            let ch;
            do {
                ch = pool[csprngInt(pool.length)];
            } while (noRepeat.checked && ch === last && pool.length > 1);
            out[i] = ch;
            last = ch;
        }
        ensureAtLeastOneFromEach(out, activeSets);
        return out.join('');
    }
    function entropyBits(pwd){
        const pool = buildPool();
        return pwd.length * Math.log2(pool.length || 1);
    }
    function crackTimeText(bits){
        const seconds = Math.pow(2, Math.max(bits-1,0)) / 1e10;
        if (seconds < 1) return "<1s";
        const units = [
            ["yr", 365*24*3600],
            ["d", 24*3600],
            ["h", 3600],
            ["m", 60],
            ["s", 1]
        ];
        let rem = seconds, r=[];
        for(const [u,sec] of units){
            if (rem >= sec){
                const v = Math.floor(rem/sec);
                r.push(v+u);
                rem -= v*sec;
                if (r.length>=2) break;
            }
        }
        return r.join(" ");
    }
    function meterColor(bits){
        if (bits < 45) return "#ff6b6b";
        if (bits < 60) return "#ffb86b";
        return "#4cd2a0";
    }
    function renderList(pwds){
        list.innerHTML = '';
        const all = [];
        for (const p of pwds){
            all.push(p);
            const item = document.createElement('div');
            item.className = 'pwd';
            const code = document.createElement('code');
            code.textContent = p;
            const meter = document.createElement('div');
            meter.className = 'meter';
            const bar = document.createElement('div');
            bar.className = 'bar';
            const bits = entropyBits(p);
            const pct = Math.max(6, Math.min(100, Math.round(bits/80*100)));
            bar.style.width = pct + '%';
            bar.style.background = meterColor(bits);
            meter.appendChild(bar);
            const info = document.createElement('span');
            info.className = 'small';
            info.textContent = ` ${bits.toFixed(1)} bits • ~${crackTimeText(bits)}`;
            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn btn--outline';
            copyBtn.textContent = 'Copy';
            copyBtn.addEventListener('click', async () => {
                await navigator.clipboard.writeText(p);
                copyBtn.textContent = 'Copied!';
                setTimeout(()=>copyBtn.textContent='Copy', 900);
            });
            item.appendChild(code);
            item.appendChild(meter);
            item.appendChild(info);
            item.appendChild(copyBtn);
            list.appendChild(item);
        }
        allOut.value = all.join('\n');
    }
    // Buttons
    btnGen.addEventListener('click', () => {
        try{
            const n = Math.min(200, Math.max(1, parseInt(count.value||1)));
            const out = Array.from({length:n}, genOne);
            renderList(out);
        }catch(e){
            alert(e.message);
        }
    });
    btnCopyAll.addEventListener('click', async ()=>{
        try{
            await navigator.clipboard.writeText(allOut.value);
            btnCopyAll.textContent = 'Copied!';
            setTimeout(()=>btnCopyAll.textContent='Copy all', 900);
        }catch{ alert('Clipboard copy failed.'); }
    });
    btnDownload.addEventListener('click', ()=>{
        const blob = new Blob([allOut.value], {type:'text/plain;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'passwords.txt';
        document.body.appendChild(a); a.click();
        setTimeout(()=>{URL.revokeObjectURL(url); a.remove();},0);
    });
}

// Qwik expects a default export named 'load' for dynamic tool loading
export function load(container) {
    loadPasswordGeneratorTool(container);
}

// Add Qwik-style grid and spacing for password generator tool
if (!document.getElementById('qwik-passwordgen-style')) {
    const style = document.createElement('style');
    style.id = 'qwik-passwordgen-style';
    style.textContent = `
    .grid-charset {
        display: grid;
        gap: 32px 40px;
        grid-template-columns: 1fr 1fr;
        margin-bottom: 32px;
    }
    @media (max-width: 900px) {
        .grid-charset { grid-template-columns: 1fr; }
    }
    .grid-charset label {
        font-weight: 600;
        font-size: 1.08em;
        color: var(--color-primary, #21808d);
        margin-bottom: 8px;
        display: block;
    }
    .grid-charset textarea {
        width: 100%;
        min-height: 120px;
        background: var(--color-background, #f9f9f9);
        border: 1.5px solid var(--color-border, #e0e0e0);
        color: var(--color-text, #13343b);
        padding: 13px 14px;
        border-radius: 10px;
        font-size: 1.08em;
        margin-bottom: 18px;
        resize: vertical;
    }
    .grid-charset .btn--primary {
        background: var(--color-primary, #21808d);
        color: #fff;
        border: none;
        padding: 10px 18px;
        font-size: 1em;
        border-radius: 10px;
        margin-bottom: 0;
    }
    .grid-charset .btn--outline {
        background: #fff;
        color: var(--color-primary, #21808d);
        border: 1.5px solid var(--color-primary, #21808d);
        padding: 10px 18px;
        font-size: 1em;
        border-radius: 10px;
        margin-bottom: 0;
    }
    .grid-charset input[type="range"] {
        width: 180px;
        margin: 0 10px;
    }
    .grid-charset input[type="number"] {
        font-size: 1.08em;
        padding: 7px 10px;
        border-radius: 8px;
        border: 1.5px solid var(--color-border, #e0e0e0);
        background: var(--color-background, #f9f9f9);
        color: var(--color-text, #13343b);
        min-width: 60px;
    }
    .grid-charset input[type="text"] {
        font-size: 1.08em;
        padding: 7px 10px;
        border-radius: 8px;
        border: 1.5px solid var(--color-border, #e0e0e0);
        background: var(--color-background, #f9f9f9);
        color: var(--color-text, #13343b);
        min-width: 120px;
    }
    .metrics {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 12px;
        margin-bottom: 8px;
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
    .pill.good{border-color:#2b5; color:#9fd}
    .pill.bad{border-color:#c0392b; color:#ffc4c4}
    .footer{opacity:.7;margin-top:12px;font-size:12px}
    .small{font-size:12px;color:#626c71}
    .kbadge{padding:2px 6px;border-radius:6px;background:#0d1020;border:1px solid #2a2f47}
    .hl{color:#a0c0ff}
    .split{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:18px;}
    .file{border:1px dashed #2a2f47;border-radius:12px;padding:10px}
    .card{background:var(--color-surface, #fff);border:1.5px solid var(--color-border, #e0e0e0);border-radius:14px;padding:22px 22px 18px 22px;box-shadow:0 2px 8px #0001;margin-bottom:24px;}
    .row{display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-bottom:18px;}
    h3{font-size:1.18em;margin:0 0 14px 0}
    .list {display:flex;flex-direction:column;gap:14px;margin-top:14px;}
    .pwd{display:flex;gap:14px;align-items:center;border:1px dashed #2a2f47;border-radius:12px;padding:10px 12px;background:var(--color-background, #f9f9f9);}
    .pwd code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px;word-break:break-all;}
    .meter{height:8px;border-radius:999px;background:#11152a;border:1px solid #2a2f47;overflow:hidden;min-width:160px;}
    .bar{height:100%;width:0%}
    .hr{height:1px;background:#20253e;border:0;margin:16px 0}
    `;
    document.head.appendChild(style);
}
