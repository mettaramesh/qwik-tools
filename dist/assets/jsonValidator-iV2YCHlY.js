import{s as v}from"./utils-D6OBsT8e.js";function p(i,s){function o(a,t,r=""){if(t.type){if(t.type==="object"&&typeof a!="object")return`${r} should be object`;if(t.type==="array"&&!Array.isArray(a))return`${r} should be array`;if(t.type==="string"&&typeof a!="string")return`${r} should be string`;if(t.type==="number"&&typeof a!="number")return`${r} should be number`;if(t.type==="boolean"&&typeof a!="boolean")return`${r} should be boolean`}if(t.required&&Array.isArray(t.required)){for(const e of t.required)if(a==null||!(e in a))return`${r}.${e} is required`}if(t.properties&&typeof t.properties=="object"){for(const e in t.properties)if(a&&e in a){const n=o(a[e],t.properties[e],r?r+"."+e:e);if(n)return n}}if(t.items&&Array.isArray(a))for(let e=0;e<a.length;e++){const n=o(a[e],t.items,r+"["+e+"]");if(n)return n}return null}return o(i,s,"")}function b(i){i.innerHTML=`
    <div class="tool-header"><h2>JSON Validator</h2><p>Validate your JSON against a JSON Schema (Draft 7 subset supported)</p></div>
    <div class="tool-interface">
      <div class="tool-controls">
        <button class="btn btn--secondary" id="json-validate-btn">Validate</button>
        <button class="btn btn--outline" id="json-clear-btn">Clear</button>
      </div>
      <div class="io-container">
        <div class="input-section">
          <div class="section-header">
            <label class="form-label">Input JSON</label>
            <button class="btn btn--sm copy-btn" data-target="json-validator-input">Copy</button>
          </div>
          <textarea id="json-validator-input" class="form-control code-input" placeholder="Paste or type your JSON here..." rows="10"></textarea>
        </div>
        <div class="input-section">
          <div class="section-header">
            <label class="form-label">JSON Schema (optional)</label>
            <button class="btn btn--sm copy-btn" data-target="json-validator-schema">Copy</button>
          </div>
          <textarea id="json-validator-schema" class="form-control code-input" placeholder="Paste your JSON Schema here..." rows="8"></textarea>
        </div>
        <div class="output-section">
          <div class="section-header">
            <label class="form-label">Validation Result</label>
            <button class="btn btn--sm copy-btn" data-target="json-validator-output">Copy</button>
          </div>
          <textarea id="json-validator-output" class="form-control code-input" readonly rows="4"></textarea>
        </div>
      </div>
      <div id="json-validator-error" class="error-message hidden"></div>
    </div>
  `,m()}function m(){const i=document.getElementById("json-validator-input"),s=document.getElementById("json-validator-schema"),o=document.getElementById("json-validator-output"),a=document.getElementById("json-validate-btn"),t=document.getElementById("json-clear-btn"),r=document.getElementById("json-validator-error");function e(l){r.textContent=l,r.classList.remove("hidden")}function n(){r.textContent="",r.classList.add("hidden")}a.onclick=()=>{n();let l,u;try{l=JSON.parse(i.value)}catch(d){e("Invalid JSON: "+d.message),o.value="";return}try{u=JSON.parse(s.value)}catch(d){e("Invalid JSON Schema: "+d.message),o.value="";return}const c=p(l,u);c?o.value="Validation failed: "+c:o.value="JSON is valid against the schema."},t.onclick=()=>{i.value="",s.value="",o.value="",n()},v()}export{b as load};
