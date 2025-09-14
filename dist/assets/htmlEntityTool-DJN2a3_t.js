function X(w){w.innerHTML=`
    <div class="tool-header">
      <h2>HTML Encoder/Decoder</h2>
      <p class="small">Encode or decode HTML entities. Supports named and numeric entities. Useful for escaping/unescaping HTML in text, code, or data.</p>
    </div>
    <div class="card">
      <div class="row">
        <label for="htmlInput" class="form-label">Input</label>
        <textarea id="htmlInput" class="form-control" rows="6" placeholder="Paste or type HTML or text..."></textarea>
      </div>

      <div class="row" style="margin-top:12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <button class="btn btn--primary" id="btnEncode">Encode HTML</button>
        <button class="btn btn--outline" id="btnDecode">Decode HTML</button>
        <button class="btn btn--outline" id="btnClear">Clear</button>
        <button class="btn btn--outline" id="btnCopy">Copy Output</button>

        <!-- Visible toggles -->
        <label style="margin-left:8px;display:flex;align-items:center;gap:6px;font-size:.9rem;">
          <input id="toggleNumericEncode" type="checkbox" />
          Numeric-encode non-ASCII
        </label>

        <label style="display:flex;align-items:center;gap:6px;font-size:.9rem;">
          <select id="sanitizationLevel" style="font-size:.9rem;padding:4px;border-radius:4px;">
            <option value="off">Sanitize: Off</option>
            <option value="moderate" selected>Sanitize: Moderate</option>
            <option value="aggressive">Sanitize: Aggressive</option>
          </select>
        </label>
      </div>

      <div class="row" style="margin-top:12px;">
        <label for="htmlOutput" class="form-label">Output</label>
        <textarea id="htmlOutput" class="form-control" rows="6" readonly placeholder="Result will appear here..."></textarea>
      </div>
      <div class="row" style="margin-top:8px;">
        <span id="htmlStatus" class="small muted"></span>
      </div>
      <div class="row" style="margin-top:12px;">
        <button class="btn btn--outline" id="btnToggleView">Show Preview</button>
      </div>

      <!-- Preview container: iframe (rendered preview) + escaped block + caption -->
      <div class="row" style="margin-top:12px;">
        <div id="htmlPreviewContainer" class="form-control" style="min-height:120px;background:#f8f9fa;border:1.5px solid var(--color-border,#e0e0e0);border-radius:8px;padding:12px 14px;font-size:0.95rem;overflow:auto;">
          <iframe id="htmlPreviewFrame" sandbox style="width:100%;height:260px;border:1px solid rgba(0,0,0,0.06);border-radius:6px;display:none;background:white;"></iframe>
          <pre id="htmlPreviewEscaped" style="white-space:pre-wrap;word-wrap:break-word;margin:0;display:none;background:transparent;border:none;padding:0;"></pre>
          <div id="htmlPreviewCaption" class="small muted" style="margin-top:8px;color:var(--muted,#666);"></div>
        </div>
      </div>
    </div>
  `}function G(w){const m=e=>w.querySelector("#"+e),y=m("htmlInput"),f=m("htmlOutput"),g=m("btnEncode"),L=m("btnDecode"),P=m("btnClear"),z=m("btnCopy"),T=m("btnToggleView");m("htmlPreviewContainer");const v=m("htmlPreviewFrame"),C=m("htmlPreviewEscaped"),I=m("htmlPreviewCaption"),x=m("htmlStatus"),N=m("toggleNumericEncode"),k=m("sanitizationLevel");let A=!1,E="render";function h(e,t=!0,o=2500){x.textContent=e||"",x.style.color=t?"var(--color-success,#21808d)":"var(--color-error,#c0392b)",e?x.classList.remove("muted"):x.classList.add("muted"),o&&e&&setTimeout(()=>{x.textContent===e&&(x.textContent="",x.classList.add("muted"))},o)}function R(e){return e?navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(e).then(()=>!0).catch(()=>O(e)):Promise.resolve(O(e)):Promise.resolve(!1)}function O(e){try{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-9999px",document.body.appendChild(t),t.select();const o=document.execCommand&&document.execCommand("copy");return document.body.removeChild(t),!!o}catch{return!1}}function W(e){if(e==null)return"";const t=document.createElement("div");return t.appendChild(document.createTextNode(String(e))),t.innerHTML}function F(e){let t="";for(let o=0;o<e.length;o++){const d=e.charAt(o),u=e.charCodeAt(o);if(d==="&"){const n=e.indexOf(";",o);if(n>o){t+=e.slice(o,n+1),o=n;continue}}u>127?t+="&#x"+u.toString(16).toUpperCase()+";":t+=d}return t}function S(e,{toNumericNonAscii:t=!1}={}){const o=W(e);return t?F(o):o}function D(e){if(e==null)return"";const t=String(e);let o=t;if(/\<!doctype/i.test(t)||/<html[\s>]/i.test(t))try{const i=document.createElement("template");i.innerHTML=t;const c=i.content.querySelector("body");c?o=c.innerHTML:o=i.innerHTML}catch{o=t}if(!/[<>]/.test(o)&&!/&[a-zA-Z0-9#]+;/.test(o))return o.trim();const d=document.createElement("template");d.innerHTML=o;function u(i){if(i.nodeType===Node.TEXT_NODE)return i.nodeValue.replace(/\s+/g," ");if(i.nodeType!==Node.ELEMENT_NODE)return"";const c=i.tagName.toLowerCase(),p=new Set(["p","div","section","article","header","footer","aside","figure","figcaption","main","nav","address"]),l=new Set(["h1","h2","h3","h4","h5","h6"]);let r="";if(l.has(c))return r+=`
`+i.textContent.replace(/\s+/g," ").trim()+`

`,r;if(c==="br")return`
`;if(c==="hr")return`
---
`;if(c==="li"){if((i.parentElement&&i.parentElement.tagName.toLowerCase())==="ol"){const s=Array.prototype.indexOf.call(i.parentElement.children,i)+1;r+=`
`+s+". "}else r+=`
- `;for(const s of i.childNodes)r+=u(s);return r+=`
`,r}if(c==="ul"||c==="ol"){for(const a of i.childNodes)r+=u(a);return r+=`
`,r}if(c==="table"){const a=i.querySelectorAll("tr");for(const s of a){const Z=Array.from(s.children).map(B=>u(B).trim());r+=`
`+Z.join("	")+`
`}return r+=`
`,r}if(p.has(c)){r+=`
`;for(const a of i.childNodes)r+=u(a);return r+=`
`,r}if(c==="blockquote"){r+=`
> `;for(const a of i.childNodes)r+=u(a);return r+=`
`,r}if(c==="img"){const a=i.getAttribute("alt")||"",s=i.getAttribute("src")||"";return a?r+=`[img: ${a}]`:s?r+=`[img: ${s}]`:r+="[img]",r}for(const a of i.childNodes)r+=u(a);if(c==="a"){const a=i.getAttribute("href"),s=i.textContent.replace(/\s+/g," ").trim();if(a&&a.trim()&&s&&!s.includes(a))return s+" ("+a+")"}return r}let n="";for(const i of d.content.childNodes)n+=u(i);return n=n.replace(/[ \t]+\n/g,`
`).replace(/\n{3,}/g,`

`).trim(),n}function V(e){const t=document.createElement("template");t.innerHTML=e;const o=new Set(["script","iframe","object","embed","link","meta"]),d=document.createTreeWalker(t.content,NodeFilter.SHOW_ELEMENT,null,!1),u=[];for(;d.nextNode();){const n=d.currentNode,i=n.tagName&&n.tagName.toLowerCase();if(o.has(i)){u.push(n);continue}const c=Array.from(n.attributes||[]);for(const p of c){const l=p.name.toLowerCase(),r=(p.value||"").toLowerCase();if(l.startsWith("on"))n.removeAttribute(p.name);else if((l==="href"||l==="src"||l==="xlink:href")&&r.trim().startsWith("javascript:"))n.removeAttribute(p.name);else if(l==="srcset")try{const a=p.value.split(",").map(s=>s.trim()).filter(s=>!s.toLowerCase().startsWith("javascript:"));a.length?n.setAttribute("srcset",a.join(", ")):n.removeAttribute("srcset")}catch{n.removeAttribute("srcset")}else l==="style"&&/expression\s*\(|javascript\s*:/i.test(p.value)&&n.removeAttribute("style")}}for(const n of u)n&&n.parentNode&&n.parentNode.removeChild(n);return t.innerHTML}function _(e){const t=document.createElement("template");t.innerHTML=e;const o=new Set(["script","iframe","object","embed","link","meta","form","input","button","select","textarea","video","audio","source","picture","svg"]),d=document.createTreeWalker(t.content,NodeFilter.SHOW_ELEMENT,null,!1),u=[];for(;d.nextNode();){const n=d.currentNode,i=n.tagName&&n.tagName.toLowerCase();if(o.has(i)){u.push(n);continue}const c=Array.from(n.attributes||[]);for(const p of c){const l=p.name.toLowerCase(),r=(p.value||"").toLowerCase();if(l.startsWith("on")){n.removeAttribute(p.name);continue}if(l.startsWith("data-")){n.removeAttribute(p.name);continue}if(l==="style"){n.removeAttribute("style");continue}if((l==="href"||l==="src"||l==="xlink:href")&&/^\s*(javascript:|data:text\/html)/i.test(r)){n.removeAttribute(p.name);continue}if(l==="srcset")try{const a=p.value.split(",").map(s=>s.trim()).filter(s=>!/^\s*(javascript:|data:text\/html)/i.test(s.toLowerCase()));a.length?n.setAttribute("srcset",a.join(", ")):n.removeAttribute("srcset")}catch{n.removeAttribute("srcset")}if((l==="action"||l==="formaction")&&/^\s*(javascript:|data:text\/html)/i.test(r)){n.removeAttribute(p.name);continue}}}for(const n of u)n&&n.parentNode&&n.parentNode.removeChild(n);return t.innerHTML}function q(e,t){return e?t==="off"?e:t==="moderate"?V(e):t==="aggressive"?_(e):e:""}function K(){const e=y.value||"";let t=e;if(/[&][a-zA-Z0-9#]+;/.test(e)&&!/<[a-z][\s\S]*>/i.test(e))try{const d=document.createElement("div");d.innerHTML=e,t=d.innerHTML}catch{t=e}const o=k.value||"moderate";if(o==="off")return t;try{return q(t,o)}catch{return t}}function U(e){try{v.style.display="",C.style.display="none";const o=`
        <!doctype html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <style>
            :root{color-scheme:light dark;}
            html,body{margin:0;padding:12px;font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial;background:transparent;color:inherit;}
            img{max-width:100%;height:auto;border-radius:6px;}
            table{border-collapse:collapse;width:100%;}
            code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,"Roboto Mono",monospace;font-size:0.92em;}
          </style>
        </head>
        <body>${(e||"").trim()||'<div style="color:#666;font-family:system-ui;padding:12px;">(Nothing to preview)</div>'}</body>
        </html>
      `;v.srcdoc=o,v.onload=()=>{}}catch{v.style.display="none",C.style.display="",C.textContent=e||"(Nothing to preview)"}M()}function $(e){v.style.display="none",C.style.display="",C.textContent=e||"";try{v.srcdoc="",v.removeAttribute("src")}catch{}M()}function M(){const e=k.value||"moderate",t=`Sanitization: ${e.charAt(0).toUpperCase()+e.slice(1)} — preview is sandboxed.`;I.textContent=t}function b(){if(!A)return;const e=K();E==="render"?U(e):$(e)}w.addEventListener("keydown",e=>{(navigator.platform.toLowerCase().includes("mac")?e.metaKey:e.ctrlKey)&&(e.key.toLowerCase()==="e"?(e.preventDefault(),g.click()):e.key.toLowerCase()==="d"?(e.preventDefault(),L.click()):e.key.toLowerCase()==="k"?(e.preventDefault(),P.click()):e.shiftKey&&e.key.toLowerCase()==="c"&&(e.preventDefault(),z.click()))},!0);function j(){if(g.classList.contains("active")){const e=!!N.checked;f.value=S(y.value,{toNumericNonAscii:e}),h("Live encoding…")}else L.classList.contains("active")?(f.value=D(y.value),h("Live decoding…")):(f.value="",h(""));b()}y.addEventListener("input",j);function H(e){[g,L].forEach(t=>t.classList.remove("active")),e&&e.classList.add("active"),j()}T.addEventListener("click",()=>{A?(E=E==="render"?"escaped":"render",T.textContent=E==="render"?"Show Escaped":"Show Rendered",b()):(A=!0,E="render",T.textContent="Show Escaped",b())}),f.addEventListener("input",b),f.addEventListener("change",b),k.addEventListener("change",()=>{M(),b()}),N.addEventListener("change",()=>{g.classList.contains("active")&&(f.value=S(y.value,{toNumericNonAscii:!!N.checked}),b())}),g.addEventListener("click",e=>{H(g);const t=e.shiftKey===!0||N.checked;f.value=S(y.value,{toNumericNonAscii:!!t}),h(t?"Encoded (non-ASCII → numeric entities).":"Encoded!"),b()}),L.addEventListener("click",()=>{H(L),f.value=D(y.value),h("Decoded!"),b()}),P.addEventListener("click",()=>{y.value="",f.value="",h("Cleared.",!0),[g,L].forEach(e=>e.classList.remove("active")),v.style.display="none",C.style.display="none";try{v.srcdoc="",v.removeAttribute("src")}catch{}A=!1,T.textContent="Show Preview"}),z.addEventListener("click",async()=>{await R(f.value||"")?h("Output copied!",!0):h("Copy failed.",!1)}),f.addEventListener("focus",()=>{try{f.select()}catch{}}),H(g),k.value="moderate",E="render",M(),h("Ready. Sanitization: Moderate by default. Single-click preview toggle switches modes. Preview is sandboxed.",!0,9e3)}function J(w,m){X(w),G(w)}export{J as load,X as loadHTMLEntityTool,G as setupHTMLEntityTool};
