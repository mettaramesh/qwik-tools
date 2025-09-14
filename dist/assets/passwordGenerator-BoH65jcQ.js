function V(i){i.innerHTML=`
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
    `,Z()}function Z(){const i={lower:"abcdefghijklmnopqrstuvwxyz",upper:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",digits:"0123456789",symbolsDefault:"!@#$%^&*()_-+=[]{};:,.?/~"},r=new Set("O0oIl1|S5B8Z2".split("")),A=new Set("{}[]()/\\'\"`~,;:.".split("")),o=e=>document.getElementById(e),u=o("pwgen-len"),m=o("pwgen-lenNum"),b=o("pwgen-lower"),w=o("pwgen-upper"),y=o("pwgen-digits"),f=o("pwgen-symbols"),v=o("pwgen-symset"),x=o("pwgen-noSimilar"),T=o("pwgen-noRepeat"),k=o("pwgen-noAmbig"),j=o("pwgen-count"),G=o("pwgen-btnGen"),C=o("pwgen-btnCopyAll"),N=o("pwgen-btnDownload"),I=o("pwgen-list"),E=o("pwgen-allOut"),P=o("pwgen-metaLen"),O=o("pwgen-metaPool"),R=o("pwgen-metaEntropy");u.addEventListener("input",()=>{m.value=u.value,h()}),m.addEventListener("input",()=>{const e=Math.min(128,Math.max(8,parseInt(m.value||8)));m.value=e,u.value=e,h()}),[b,w,y,f,v,x,k].forEach(e=>e.addEventListener("input",h));function L(){let e="";return b.checked&&(e+=i.lower),w.checked&&(e+=i.upper),y.checked&&(e+=i.digits),f.checked&&(e+=v.value||i.symbolsDefault),x.checked&&(e=[...e].filter(t=>!r.has(t)).join("")),k.checked&&(e=[...e].filter(t=>!A.has(t)).join("")),e=Array.from(new Set(e.split(""))).join(""),e}function h(){const e=parseInt(u.value),t=L();P.textContent=`Chars: ${e}`,O.textContent=`Pool: ${t.length}`;const n=t.length?e*Math.log2(t.length):0;R.textContent=`Entropy: ${n.toFixed(1)} bits`}h();function M(e){const t=new Uint32Array(1),n=Math.floor(4294967296/e)*e;for(;;){crypto.getRandomValues(t);const l=t[0];if(l<n)return l%e}}function B(e){for(let t=e.length-1;t>0;t--){const n=M(t+1);[e[t],e[n]]=[e[n],e[t]]}return e}function D(e,t){const n=B([...Array(e.length).keys()]);let l=0;for(const s of t){if(!s||!s.length)continue;const c=n[l++%n.length];e[c]=s[M(s.length)]}}function g(e){let t=e;return x.checked&&(t=[...t].filter(n=>!r.has(n)).join("")),k.checked&&(t=[...t].filter(n=>!A.has(n)).join("")),t}function U(){const e=parseInt(u.value),t=L();if(!t.length)throw new Error("No characters selected. Enable at least one set.");const n=[];b.checked&&n.push(g(i.lower)),w.checked&&n.push(g(i.upper)),y.checked&&n.push(g(i.digits)),f.checked&&n.push(g(v.value||i.symbolsDefault));const l=new Array(e);let s=null;for(let c=0;c<e;c++){let a;do a=t[M(t.length)];while(T.checked&&a===s&&t.length>1);l[c]=a,s=a}return D(l,n),l.join("")}function $(e){const t=L();return e.length*Math.log2(t.length||1)}function H(e){const t=Math.pow(2,Math.max(e-1,0))/1e10;if(t<1)return"<1s";const n=[["yr",365*24*3600],["d",24*3600],["h",3600],["m",60],["s",1]];let l=t,s=[];for(const[c,a]of n)if(l>=a){const p=Math.floor(l/a);if(s.push(p+c),l-=p*a,s.length>=2)break}return s.join(" ")}function z(e){return e<45?"#ff6b6b":e<60?"#ffb86b":"#4cd2a0"}function F(e){I.innerHTML="";const t=[];for(const n of e){t.push(n);const l=document.createElement("div");l.className="pwd";const s=document.createElement("code");s.textContent=n;const c=document.createElement("div");c.className="meter";const a=document.createElement("div");a.className="bar";const p=$(n),q=Math.max(6,Math.min(100,Math.round(p/80*100)));a.style.width=q+"%",a.style.background=z(p),c.appendChild(a);const S=document.createElement("span");S.className="small",S.textContent=` ${p.toFixed(1)} bits • ~${H(p)}`;const d=document.createElement("button");d.className="btn btn--outline",d.textContent="Copy",d.addEventListener("click",async()=>{await navigator.clipboard.writeText(n),d.textContent="Copied!",setTimeout(()=>d.textContent="Copy",900)}),l.appendChild(s),l.appendChild(c),l.appendChild(S),l.appendChild(d),I.appendChild(l)}E.value=t.join(`
`)}G.addEventListener("click",()=>{try{const e=Math.min(200,Math.max(1,parseInt(j.value||1))),t=Array.from({length:e},U);F(t)}catch(e){alert(e.message)}}),C.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(E.value),C.textContent="Copied!",setTimeout(()=>C.textContent="Copy all",900)}catch{alert("Clipboard copy failed.")}}),N.addEventListener("click",()=>{const e=new Blob([E.value],{type:"text/plain;charset=utf-8"}),t=URL.createObjectURL(e),n=document.createElement("a");n.href=t,n.download="passwords.txt",document.body.appendChild(n),n.click(),setTimeout(()=>{URL.revokeObjectURL(t),n.remove()},0)})}function K(i){if(!document.getElementById("passwordgen-css-link")){const r=document.createElement("link");r.id="passwordgen-css-link",r.rel="stylesheet",r.href="passwordGenerator.css",document.head.appendChild(r)}V(i)}export{K as load,V as loadPasswordGeneratorTool,Z as setupPasswordGeneratorTool};
