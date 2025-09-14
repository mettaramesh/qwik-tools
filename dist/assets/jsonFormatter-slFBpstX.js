function v(s){s.innerHTML=`
        <div class="tool-header">
            <h2>JSON Formatter</h2>
            <p>Format, beautify, and minify JSON data</p>
        </div>
        <div class="tool-interface">
            <div class="tool-controls">
                <button class="btn btn--secondary" id="json-format-btn">Format</button>
                <button class="btn btn--outline" id="json-minify-btn">Minify</button>
                <button class="btn btn--outline" id="json-validate-btn">Validate</button>
                <button class="btn btn--outline" id="json-clear-btn">Clear</button>
            </div>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Input JSON</label>
                        <button class="btn btn--sm copy-btn" data-target="json-input">Copy</button>
                    </div>
                    <textarea id="json-input" class="form-control code-input" placeholder="Paste or type your JSON here..." rows="12"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Formatted Output</label>
                        <button class="btn btn--sm copy-btn" data-target="json-output">Copy</button>
                    </div>
                    <textarea id="json-output" class="form-control code-input" readonly rows="12"></textarea>
                </div>
            </div>
            <div id="json-status" class="hidden"></div>
        </div>
    `}function p(){const s=document.getElementById("json-input"),a=document.getElementById("json-output"),t=document.getElementById("json-status"),c=e=>{e.preventDefault(),e.stopPropagation();try{const n=JSON.parse(s.value);a.value=JSON.stringify(n,null,2),t.className="success-message",t.textContent="Valid JSON formatted successfully",t.classList.remove("hidden")}catch(n){t.className="error-message",t.textContent=`Invalid JSON: ${n.message}`,t.classList.remove("hidden")}},r=e=>{e.preventDefault(),e.stopPropagation();try{const n=JSON.parse(s.value);a.value=JSON.stringify(n),t.className="success-message",t.textContent="JSON minified successfully",t.classList.remove("hidden")}catch(n){t.className="error-message",t.textContent=`Invalid JSON: ${n.message}`,t.classList.remove("hidden")}},u=e=>{e.preventDefault(),e.stopPropagation();try{JSON.parse(s.value),t.className="success-message",t.textContent="JSON is valid",t.classList.remove("hidden")}catch(n){t.className="error-message",t.textContent=`Invalid JSON: ${n.message}`,t.classList.remove("hidden")}},m=e=>{e.preventDefault(),e.stopPropagation(),s.value="",a.value="",t.classList.add("hidden")},o=document.getElementById("json-format-btn"),i=document.getElementById("json-minify-btn"),l=document.getElementById("json-validate-btn"),d=document.getElementById("json-clear-btn");o&&o.addEventListener("click",c),i&&i.addEventListener("click",r),l&&l.addEventListener("click",u),d&&d.addEventListener("click",m),s&&s.addEventListener("input",()=>{if(s.value.trim())try{const e=JSON.parse(s.value);a.value=JSON.stringify(e,null,2),t.className="success-message",t.textContent="Valid JSON",t.classList.remove("hidden")}catch{t.className="error-message",t.textContent="Invalid JSON",t.classList.remove("hidden")}else a.value="",t.classList.add("hidden")}),typeof window.setupCopyButtons=="function"&&window.setupCopyButtons()}function b(s,a){v(s)}export{b as load,v as loadJSONFormatter,p as setupJSONFormatter};
