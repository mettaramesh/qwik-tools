// Password Generator Tool (Qwik style)
// Category: Generators
// UI: Modern, clean, non-congested, project-style grid/cards/buttons/combos

export async function loadPasswordGeneratorTool(container) {
    // Load HTML template from external file
    try {
        const resp = await fetch('src/passwordGenerator.html');
        if (!resp.ok) {
            throw new Error(`Failed to load Password Generator HTML: ${resp.status}`);
        }
        const html = await resp.text();
        // Security check: ensure we're not loading the full page
        if (html.includes('<!DOCTYPE html') || html.includes('<html')) {
            throw new Error('Invalid HTML content - contains full page structure');
        }
        container.innerHTML = html;
        setupPasswordGeneratorTool();
    } catch (error) {
        console.error('Error loading Password Generator:', error);
        container.innerHTML = '<div class="error">Failed to load Password Generator tool</div>';
        return;
    }
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
export async function load(container) {
    // Inject CSS via <link> if not already present
    if (!document.getElementById('passwordgen-css-link')) {
        const link = document.createElement('link');
        link.id = 'passwordgen-css-link';
        link.rel = 'stylesheet';
        link.href = 'passwordGenerator.css';
        document.head.appendChild(link);
    }
    await loadPasswordGeneratorTool(container);
}
