function f(n){n.innerHTML=`
        <div class="tool-header">
            <h2>Hex Viewer</h2>
            <p>Paste or type text below. Display each character's UTF-8 hex or code point. Hover hex to see character.</p>
        </div>
        <div class="tool-interface">
            <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px;">
                <textarea id="hexInput" rows="4" placeholder="Type or paste text here..."></textarea>
                <button id="hexShowBtn" class="hex-btn">Show Hex Codes</button>
            </div>
            <div class="hex-toggle-row">
                <label><input type="radio" name="hexViewMode" value="hex" checked> Hexcode</label>
                <label><input type="radio" name="hexViewMode" value="codepoint"> Code Point</label>
            </div>
            <div class="hex-output-toolbar" style="display:flex;gap:12px;margin-bottom:8px;align-items:center;">
                <button id="hexCopyBtn" class="hex-btn">Copy Output</button>
                <button id="hexClearBtn" class="hex-btn">Clear Output</button>
            </div>
            <div id="hexOutput" class="hex-output"></div>
        </div>
    `,v()}function v(){const n=document.getElementById("hexInput"),t=document.getElementById("hexOutput"),i=document.getElementsByName("hexViewMode"),h=document.getElementById("hexCopyBtn"),u=document.getElementById("hexClearBtn"),x=document.getElementById("hexShowBtn");function m(e){return e.toString(16).padStart(2,"0").toUpperCase()}function s(e,c){if(!e){t.innerHTML="";return}if(c==="hex"){let l="";for(const a of e){const p=new TextEncoder().encode(a),g=Array.from(p).map(m).join(" ");l+=`<span class="hexcode" data-char="${d(a)}" title="${d(a)}">${g}</span> `}t.innerHTML=l.trim()}else{let l="";for(const a of e){const p=a.codePointAt(0);l+=`<span class="codepoint" data-char="${d(a)}">U+${p.toString(16).toUpperCase().padStart(4,"0")}</span> `}t.innerHTML=l.trim()}}function d(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function r(){var e;return((e=Array.from(i).find(c=>c.checked))==null?void 0:e.value)||"hex"}x.addEventListener("click",()=>s(n.value,r())),i.forEach(e=>e.addEventListener("change",()=>s(n.value,r()))),t.addEventListener("mouseover",e=>{if(e.target.classList.contains("hexcode")||e.target.classList.contains("codepoint")){const c=e.target.getAttribute("data-char");y(e.target,c)}}),t.addEventListener("mouseout",e=>{(e.target.classList.contains("hexcode")||e.target.classList.contains("codepoint"))&&w()}),h.addEventListener("click",()=>{const e=t.textContent||"";e&&navigator.clipboard.writeText(e)}),u.addEventListener("click",()=>{t.innerHTML="",n.value=""}),s(n.value,r())}let o;function y(n,t){o||(o=document.createElement("div"),o.className="hex-tooltip",document.body.appendChild(o)),o.textContent=t;const i=n.getBoundingClientRect();o.style.display="block",o.style.left=i.left+window.scrollX+i.width/2-12+"px",o.style.top=i.top+window.scrollY-36+"px"}function w(){o&&(o.style.display="none")}function b(n){if(!document.getElementById("hexviewer-css-link")){const t=document.createElement("link");t.id="hexviewer-css-link",t.rel="stylesheet",t.href="hexViewerTool.css",document.head.appendChild(t)}f(n)}export{b as load,f as loadHexViewerTool,v as setupHexViewerTool};
