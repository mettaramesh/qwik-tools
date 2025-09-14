const v={defaultInitialMemoryPages:256,defaultMaxMemoryPages:512,max:65536};function f(t,n){return Array.isArray(t)||(t=[t]),t.map((e,s)=>typeof e=="string"?{fileName:`file_${s}.${n}`,contents:e}:e)}function g(t){const n=f(t.xml,"xml"),e=t.extension||"schema";p(["schema","relaxng"],"extension",e);const s=f(t.schema||[],"xsd"),c=f(t.preload||[],"xml");if(!t.disableFileNameValidation){for(const r of n.concat(s))if(/(^|\s)-/.test(r.fileName))throw new Error(`Invalid file name "${r.fileName}" that would be interpreted as a command line option.`)}const i=t.normalization||"";p(["","format","c14n"],"normalization",i);const m=n.concat(s,c);let l=[];if(s.forEach(function(r){l.push(`--${e}`),l.push(r.fileName)}),i?l.push(`--${i}`):l.push("--noout"),n.forEach(function(r){l.push(r.fileName)}),t.modifyArguments&&(l=t.modifyArguments(l),!Array.isArray(l)))throw new Error("modifyArguments must return an array of arguments");const u={inputFiles:m,args:l,initialMemory:t.initialMemoryPages||v.defaultInitialMemoryPages,maxMemory:t.maxMemoryPages||v.defaultMaxMemoryPages};return h(u),u}function y(t){return t===0?!0:t===3||t===4?!1:null}function p(t,n,e){if(!t.includes(e)){const s=typeof e=="string"?`"${e}"`:e;throw new Error(`Invalid value for option ${n}: ${s}`)}}function h({initialMemory:t,maxMemory:n}){if(t<0||n<t||n>v.max)throw new Error(`Invalid memory options. Expected 0 < initialMemoryPages (${t}) <= maxMemoryPages (${n}) <= 4GiB (${v.max})`)}function b(t){return t.split(`
`).slice(0,-2).map(e=>{const[s,c,...i]=e.split(":");return s&&c&&i.length?{rawMessage:e,message:i.join(":").trim(),loc:{fileName:s,lineNumber:parseInt(c)}}:{rawMessage:e,message:e,loc:null}}).filter(e=>!(!e.loc&&e.rawMessage.trim().endsWith(" validates")))}function w(t){const n=g(t);var e;return new Promise(function(c,i){function m(r){var o=r.data;const d=y(o.exitCode);if(d===null){const a=new Error(o.stderr);a.code=o.exitCode,i(a)}else c({valid:d,normalized:o.stdout,errors:d?[]:b(o.stderr),rawOutput:o.stderr})}function l(r){i(r)}e=new Worker(new URL("/assets/xmllint-browser-D9yx92E8.js",import.meta.url),{type:"module"});var u=e.addEventListener.bind(e);u("message",m),u("error",l),e.postMessage(n)}).finally(()=>{if(e)return e.terminate()})}function E(t){t.innerHTML=`
    <div class="tool-header">
      <h2>XML Validator</h2>
      <p>Check if your XML is well-formed or valid against an XSD schema</p>
    </div>
    <div class="tool-interface xml-validator-root">
      <div class="tool-controls">
        <button class="btn btn--secondary" id="xml-validate-btn">Validate</button>
        <button class="btn btn--outline" id="xml-clear-btn">Clear</button>
      </div>
      <div class="io-container">
        <div class="input-section">
          <div class="section-header">
            <label class="form-label">Input XML</label>
            <button class="btn btn--sm copy-btn" data-target="xml-validator-input">Copy</button>
          </div>
          <textarea id="xml-validator-input" class="form-control code-input" placeholder="Paste or type your XML here..." rows="10"></textarea>
        </div>
        <div class="input-section">
          <div class="section-header">
            <label class="form-label">XSD Schema (optional)</label>
            <button class="btn btn--sm copy-btn" data-target="xml-validator-xsd">Copy</button>
          </div>
          <textarea id="xml-validator-xsd" class="form-control code-input" placeholder="Paste your XSD schema here (optional)..." rows="8"></textarea>
        </div>
        <div class="output-section">
          <div class="section-header">
            <label class="form-label">Validation Result</label>
            <button class="btn btn--sm copy-btn" data-target="xml-validator-output">Copy</button>
          </div>
          <textarea id="xml-validator-output" class="form-control code-input" readonly rows="6" placeholder="Validation result will appear here..."></textarea>
        </div>
        <div id="xml-validator-error" class="error-message hidden"></div>
      </div>
    </div>
  `,M()}function M(){const t=document.getElementById("xml-validator-input"),n=document.getElementById("xml-validator-xsd"),e=document.getElementById("xml-validator-output"),s=document.getElementById("xml-validate-btn"),c=document.getElementById("xml-clear-btn"),i=document.getElementById("xml-validator-error");document.querySelector(".tool-interface");function m(r){i.textContent=r,i.classList.remove("hidden")}function l(){i.textContent="",i.classList.add("hidden")}function u(r){try{const a=new DOMParser().parseFromString(r,"application/xml").querySelector("parsererror");return a?a.textContent||"Invalid XML":!0}catch(o){return o.message}}document.querySelectorAll(".copy-btn").forEach(r=>{r.onclick=function(){const o=r.getAttribute("data-target"),d=document.getElementById(o);d&&navigator.clipboard.writeText(d.value||"").then(()=>{const a=r.textContent;r.textContent="Copied!",setTimeout(()=>{r.textContent=a},1e3)})}}),s.onclick=async()=>{l();const r=t.value.trim(),o=n.value.trim();if(!r){m("Please enter XML to validate.");return}if(o.length>0&&o.length<40){m("Warning: XSD input is very short. Please check your schema.");return}const d=u(r);if(d!==!0){e.value="❌ Invalid XML: "+d;return}if(!o){e.value="✅ XML is well-formed.";return}e.value="Validating against XSD...";try{const a=await w({xml:[{fileName:"input.xml",contents:r}],schema:[o]});a.valid?e.value="✅ XML is valid against the XSD.":Array.isArray(a.errors)&&a.errors.length>0?e.value=`❌ Schema validation failed:
`+a.errors.map(x=>x.message).join(`
`):e.value=`❌ XML is not valid, but no error details were returned.
Raw result: `+JSON.stringify(a)}catch(a){e.value="❌ Validation error: "+((a==null?void 0:a.message)||a)}},c.onclick=()=>{t.value="",n.value="",e.value="",l()}}export{E as load};
