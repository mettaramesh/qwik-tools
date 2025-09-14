function T(o){o.innerHTML=`
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
    `,y()}function z(o){if(!document.getElementById("numberbase-css-link")){const l=document.createElement("link");l.id="numberbase-css-link",l.rel="stylesheet",l.href="numberBaseTool.css",document.head.appendChild(l)}T(o),y()}function y(){const o=e=>document.getElementById(e),l={bin:o("bin"),oct:o("oct"),dec:o("dec"),hex:o("hex"),custom:o("custom")},v={bin:o("binMsg"),oct:o("octMsg"),dec:o("decMsg"),hex:o("hexMsg"),custom:o("customMsg")},S=o("signedToggle"),E=o("groupSize"),x=o("prefixes"),u=o("customBase");for(let e=2;e<=36;e++){const t=document.createElement("option");t.value=String(e),t.textContent=`Base ${e}`,e===5&&(t.textContent+=" · quinary"),e===8&&(t.textContent+=" · octal"),e===10&&(t.textContent+=" · decimal"),e===12&&(t.textContent+=" · dozenal"),e===16&&(t.textContent+=" · hex"),u.appendChild(t)}u.value="7";const b="0123456789abcdefghijklmnopqrstuvwxyz";function I(e){return(e||"").trim().toLowerCase().replace(/[_\s]/g,"")}function M(e,t){const n=e<=10?`[0-${e-1}]`:`[0-9a-${b[e-1]}]`,i=t?"-?":"";return new RegExp(`^${i}(?:${n})+$`)}function D(e,t,n){const i=I(e);if(!i)return null;if(!M(t,n).test(i))throw new Error(`Invalid digits for base ${t}`);let a=!1,r=0;n&&i[0]==="-"&&(a=!0,r=1);let c=0n;for(;r<i.length;r++){const h=i[r],f=BigInt(b.indexOf(h));if(f<0n||f>=BigInt(t))throw new Error("Bad digit");c=c*BigInt(t)+f}return a?-c:c}function N(e,t){if(!t||t<=0)return e;e=e.replace(/\s+/g,"");let n="",i=0;for(let s=e.length-1;s>=0;s--)n=e[s]+n,i++,i%t===0&&s!==0&&(n=" "+n);return n}function B(e,t,n){if(e==null)return"";const i=e<0n;let s=i?-e:e;if(s===0n)return"0";let a="";const r=BigInt(t);for(;s>0n;){const c=s%r;a=b[Number(c)]+a,s=s/r}return a=N(a,n),i?"-"+a:a}function C(e){switch(e){case 2:return"0b";case 8:return"0o";case 16:return"0x";default:return""}}function d(e,t,n=!1){v[e].textContent=t,v[e].className=n?"ok":/Invalid|error/i.test(t)?"err":"hint"}function w(e){const t={bin:2,oct:8,dec:10,hex:16,custom:Number(u.value)};let n=l[e].value.trim();if(x.value==="std"&&n){let i="",s=n;n.startsWith("-")&&(i="-",s=n.slice(1)),s=s.replace(/\s|_/g,"");const a=C(t[e]);n=i+(a||"")+s}navigator.clipboard.writeText(n).then(()=>{d(e,"Copied to clipboard ✔",!0),setTimeout(()=>d(e,g[e]),1400)}).catch(()=>{d(e,"Clipboard error",!1)})}const g={bin:"Digits: 0–1",oct:"Digits: 0–7",dec:"Digits: 0–9",hex:"Digits: 0–9 a–z",custom:"Base 2–36"};let m=!1;function p(e){if(m)return;m=!0;const t={bin:2,oct:8,dec:10,hex:16,custom:Number(u.value)},n=Number(E.value);let i=null;try{let c=l[e].value;c=L(c,t[e]),i=D(c,t[e],S.checked),d(e,g[e])}catch(c){d(e,String(c.message||c),!1),m=!1;return}["bin","oct","dec","hex","custom"].forEach(c=>{if(c===e)return;const h=t[c];let f=B(i,h,n);f=k(f,h),l[c].value=f,d(c,g[c])});const a=t[e];let r=B(i,a,n);r=k(r,a),l[e].value=r,m=!1}function L(e,t){return e=e.trim(),t===2&&e.startsWith("0b")||t===8&&e.startsWith("0o")||t===16&&e.startsWith("0x")?e.slice(2):e}function $(e){return x.value==="std"&&(e===2||e===8||e===16)}function k(e,t){if(!e)return"";let n="",i=e;return e.startsWith("-")&&(n="-",i=e.slice(1)),$(t)?n+C(t)+i.replace(/\s|_/g,""):e}Object.keys(l).forEach(e=>{l[e].addEventListener("input",()=>p(e)),l[e].addEventListener("focus",()=>v[e].className="hint")}),document.querySelectorAll("[data-copy]").forEach(e=>{e.addEventListener("click",()=>w(e.dataset.copy))}),E.addEventListener("change",()=>{const t=["dec","hex","bin","oct","custom"].find(n=>l[n].value.trim()!=="")||"dec";p(t)}),x.addEventListener("change",()=>{const e=["custom","dec","hex","bin","oct"].find(t=>l[t].value.trim()!=="")||"dec";p(e)}),u.addEventListener("change",()=>{const e=["custom","dec","hex","bin","oct"].find(t=>l[t].value.trim()!=="")||"dec";p(e),d("custom",`Digits: 0–${Number(u.value)-1} (a–${b[Number(u.value)-1]||""} for ≥ 10)`)}),o("clearAll").addEventListener("click",()=>{Object.values(l).forEach(e=>e.value=""),Object.keys(v).forEach(e=>d(e,g[e]))}),document.addEventListener("keydown",e=>{var t;if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){const n=document.activeElement,i=(t=Object.entries(l).find(([,s])=>s===n))==null?void 0:t[0];i&&w(i)}}),l.dec.value="2025",p("dec")}const O={render:T,postLoad:y};export{O as default,z as load,T as loadNumberBaseTool,y as setupNumberBaseTool};
