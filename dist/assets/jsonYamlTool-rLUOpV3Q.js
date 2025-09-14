function u(s){try{return window.jsyaml.load(s,{schema:window.jsyaml.DEFAULT_SCHEMA,json:!0})}catch(o){throw new Error("YAML → JSON parse error: "+o.message)}}function d(s,o=!1){try{let n=s;return typeof n=="string"&&(n=JSON.parse(n)),window.jsyaml.dump(n,{schema:window.jsyaml.DEFAULT_SCHEMA,lineWidth:80,noRefs:!1,quotingType:'"',forceQuotes:o})}catch(n){throw new Error("JSON → YAML dump error: "+n.message)}}function m(s){try{return JSON.parse(s),!0}catch{return!1}}function y(s){try{return window.jsyaml.load(s),!0}catch{return!1}}function v(s){s.innerHTML=`
        <div class="tool-header">
            <h2>JSON ↔ YAML Converter</h2>
            <p>Convert between JSON and YAML formats</p>
        </div>
        <div class="tool-interface">
            <button class="btn btn--secondary" id="to-yaml">JSON → YAML</button>
            <button class="btn btn--outline" id="to-json">YAML → JSON</button>
            <button class="btn btn--outline" id="json-yaml-clear-btn">Clear</button>
            <label class="jsonyaml-margin-left jsonyaml-font-size jsonyaml-vertical-align">
                <input type="checkbox" id="force-quotes-checkbox" class="jsonyaml-vertical-align jsonyaml-margin-right">Quote all keys in YAML
            </label>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Input</label>
                        <button class="btn btn--sm copy-btn" data-target="json-yaml-input">Copy</button>
                    </div>
                    <textarea id="json-yaml-input" class="form-control code-input" placeholder="Paste or type JSON or YAML here..." rows="12"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Output</label>
                        <button class="btn btn--sm copy-btn" data-target="json-yaml-output">Copy</button>
                    </div>
                    <textarea id="json-yaml-output" class="form-control code-input" readonly rows="12"></textarea>
                </div>
            </div>
            <div id="json-yaml-status" class="hidden"></div>
        </div>
    `,setTimeout(()=>{const o=document.getElementById("json-yaml-input"),n=document.getElementById("json-yaml-output"),e=document.getElementById("json-yaml-status"),a=document.getElementById("force-quotes-checkbox");function l(){return a&&a.checked}document.getElementById("to-yaml").onclick=()=>{try{if(!o.value.trim())throw new Error("Input is empty");if(!m(o.value))throw new Error("Invalid JSON");const t=d(o.value,l());if(!t)throw new Error("Could not convert JSON to YAML");n.value=t,e.className="success-message",e.textContent="Converted to YAML",e.classList.remove("hidden")}catch(t){n.value="",e.className="error-message",e.textContent=t.message||"Error converting to YAML",e.classList.remove("hidden")}},document.getElementById("to-json").onclick=()=>{try{if(!o.value.trim())throw new Error("Input is empty");if(!y(o.value))throw new Error("Invalid YAML");const t=u(o.value);n.value=JSON.stringify(t,null,2),e.className="success-message",e.textContent="Converted to JSON",e.classList.remove("hidden")}catch(t){n.value="",e.className="error-message",e.textContent=t.message||"Error converting to JSON",e.classList.remove("hidden")}},document.getElementById("json-yaml-clear-btn").onclick=()=>{o.value="",n.value="",e.classList.add("hidden")},document.querySelectorAll(".copy-btn").forEach(t=>{t.onclick=function(){const c=t.getAttribute("data-target"),r=document.getElementById(c);r&&navigator.clipboard.writeText(r.value).then(()=>{const i=t.textContent;t.textContent="Copied!",setTimeout(()=>{t.textContent=i},1e3)})}})},0)}function p(s,o){v(s)}export{p as load,v as loadJSONYamlTool};
