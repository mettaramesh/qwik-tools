import{s as h}from"./utils-D6OBsT8e.js";function b(e){try{return[JSON.parse(e),null]}catch(t){return[null,t.message]}}function x(e){try{const n=new DOMParser().parseFromString(e,"application/xml");return n.getElementsByTagName("parsererror").length?[null,n.getElementsByTagName("parsererror")[0].textContent]:[n,null]}catch(t){return[null,t.message]}}function u(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function p(e,t){if(e==null)return`<${t}/>`;if(typeof e!="object")return`<${t}>${u(e)}</${t}>`;let n="",o="",a=!1;for(const r in e)r.startsWith("@")?n+=` ${r.substring(1)}="${u(e[r])}"`:r==="#text"?o+=u(e[r]):r==="#mixed"?(e[r].forEach(s=>{if(typeof s=="string")o+=u(s);else{const i=Object.keys(s)[0];o+=p(s[i],i)}}),a=!0):Array.isArray(e[r])?(e[r].forEach(s=>{typeof s=="object"&&s!==null&&Object.keys(s).length===0?o+=`<${r}/>`:o+=p(s,r)}),a=!0):typeof e[r]=="object"?(o+=p(e[r],r),a=!0):(o+=`<${r}>${u(e[r])}</${r}>`,a=!0);return!a&&!o?`<${t}${n}/>`:`<${t}${n}>${o}</${t}>`}function v(e){const t=Object.keys(e);if(t.length!==1)throw new Error("JSON must have a single root element");const n=t[0];return p(e[n],n)}function y(e){return String(e).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,"&")}function g(e){const t={};if(e.attributes&&e.attributes.length>0)for(let a of e.attributes)t[`@${a.name}`]=y(a.value);const n=[];let o="";for(let a of e.childNodes)if(a.nodeType===3){const r=a.nodeValue.trim();r&&(o+=(o?" ":"")+y(r))}else if(a.nodeType===1){const r=g(a),s=Object.keys(r)[0],i=r[s];t[s]?(Array.isArray(t[s])||(t[s]=[t[s]]),t[s].push(i)):t[s]=i,n.push({[s]:i})}if(o&&n.length>0)t["#mixed"]=[],o&&t["#mixed"].push(o),t["#mixed"].push(...n);else if(o&&n.length===0){if(Object.keys(t).length===0)return{[e.nodeName]:o};t["#text"]=o}return{[e.nodeName]:t}}function w(e){if(e&&typeof e=="object"&&Object.keys(e).length===1&&Object.keys(e)[0]==="root"){const t=e.root;if(t&&typeof t=="object"&&Object.keys(t).length===1&&!Object.keys(t)[0].startsWith("@"))return{[Object.keys(t)[0]]:t[Object.keys(t)[0]]}}return e}function O(e){return e.replace(/^\s*<root>([\s\S]*)<\/root>\s*$/i,"$1").trim()}function f(e){if(Array.isArray(e))return e.map(f).filter(t=>t!==void 0);if(typeof e=="object"&&e!==null){const t={};for(const[n,o]of Object.entries(e)){if(n==="ns1:EmptyNode"||n==="ns2:Note"){t[n]=o&&typeof o=="object"&&Object.keys(o).length===0?{}:f(o);continue}o===""||o===null||typeof o=="object"&&o!==null&&Object.keys(o).length===0||(t[n]=f(o))}return Object.keys(t).length===0?void 0:t}return e}function m(e){if(Array.isArray(e))return e.map(m).filter(t=>t!==void 0);if(typeof e=="object"&&e!==null){const t={};for(const[n,o]of Object.entries(e)){if(n==="ns1:EmptyNode"||n==="ns2:Note"){t[n]=o&&typeof o=="object"&&Object.keys(o).length===0?{}:m(o);continue}o===""||o===null||typeof o=="object"&&o!==null&&Object.keys(o).length===0||(t[n]=m(o))}return Object.keys(t).length===0?void 0:t}return e}function C(e){e.innerHTML=`
        <div class="tool-header">
            <h2>JSON ↔ XML Converter</h2>
            <p>Convert between JSON and XML formats. Input must be valid and well-formed.</p>
        </div>
        <div class="tool-interface">
            <div class="tool-controls">
                <button class="btn btn--secondary" id="to-xml">JSON → XML</button>
                <button class="btn btn--outline" id="to-json">XML → JSON</button>
                <button class="btn btn--outline" id="json-xml-clear-btn">Clear</button>
            </div>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Input JSON or XML</label>
                        <button class="btn btn--sm copy-btn" data-target="json-xml-input">Copy</button>
                    </div>
                    <textarea id="json-xml-input" class="form-control code-input" placeholder="Paste or type JSON or XML here..." rows="12"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Output</label>
                        <button class="btn btn--sm copy-btn" data-target="json-xml-output">Copy</button>
                    </div>
                    <textarea id="json-xml-output" class="form-control code-input" readonly rows="12"></textarea>
                </div>
            </div>
            <div id="json-xml-status" class="hidden"></div>
        </div>
        <style>
        .tool-header { margin-bottom: 12px; }
        .tool-interface { background: var(--color-bg-card,#fff); border-radius: 14px; box-shadow: 0 2px 12px #0001; padding: 18px 18px 24px 18px; }
        .tool-controls { display: flex; gap: 12px; margin-bottom: 18px; }
        .io-container { display: flex; gap: 24px; flex-wrap: wrap; }
        .input-section, .output-section { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; }
        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
        .form-label { font-weight: 600; font-size: 1.08em; }
        .code-input { font-family: var(--font-mono,monospace); font-size: 1.08em; border-radius: 8px; border: 1px solid var(--color-border,#d0d7de); background: var(--color-bg-muted,#f7f9fa); padding: 10px 12px; }
        @media (max-width: 900px) { .io-container { flex-direction: column; gap: 0; } .input-section, .output-section { margin-bottom: 18px; } }
        </style>
    `,h(),k()}function k(){const e=document.getElementById("json-xml-input"),t=document.getElementById("json-xml-output"),n=document.getElementById("json-xml-status"),o=document.getElementById("to-xml"),a=document.getElementById("to-json"),r=document.getElementById("json-xml-clear-btn");!e||!t||!n||(o.onclick=s=>{s.preventDefault(),s.stopPropagation();const[i,d]=b(e.value);if(d){n.className="error-message",n.textContent="Error: Invalid JSON - "+d,n.classList.remove("hidden"),t.value="",window.showStatus&&window.showStatus(n.textContent,"error");return}try{let l=i;for(;l&&typeof l=="object"&&Object.keys(l).length===1&&Object.keys(l)[0]==="root"&&typeof l.root=="object"&&Object.keys(l.root).length===1&&!Object.keys(l.root)[0].startsWith("@");)l={[Object.keys(l.root)[0]]:l.root[Object.keys(l.root)[0]]};l=f(l);const c=j(v(l));t.value=c,n.className="success-message",n.textContent="Converted JSON to XML.",n.classList.remove("hidden")}catch(l){n.className="error-message",n.textContent="Error: "+l.message,n.classList.remove("hidden"),t.value="",window.showStatus&&window.showStatus(n.textContent,"error")}},a.onclick=s=>{s.preventDefault(),s.stopPropagation();let i=e.value;i=O(i);const[d,l]=x(i);if(l){n.className="error-message",n.textContent="Error: Invalid XML - "+l,n.classList.remove("hidden"),t.value="",window.showStatus&&window.showStatus(n.textContent,"error");return}try{let c=g(d.documentElement);c=w(c),c=m(c),t.value=JSON.stringify(c,null,2),n.className="success-message",n.textContent="Converted XML to JSON.",n.classList.remove("hidden")}catch(c){n.className="error-message",n.textContent="Error: "+c.message,n.classList.remove("hidden"),t.value="",window.showStatus&&window.showStatus(n.textContent,"error")}},r.onclick=s=>{s.preventDefault(),s.stopPropagation(),e.value="",t.value="",n.classList.add("hidden")},typeof window.setupCopyButtons=="function"&&window.setupCopyButtons())}function j(e){const t="  ",n=/(>)(<)(\/*)/g;let o="",a=0;return e=e.replace(n,`$1\r
$2$3`),e.split(/\r?\n/).forEach(r=>{let s=0;r.match(/^<\//)?s=-1:r.match(/^<[^!?]/)&&!r.endsWith("/>")&&(s=1),o+=t.repeat(Math.max(a,0))+r+`
`,a+=s}),o.trim()}export{C as load,k as setupJSONXmlTool};
