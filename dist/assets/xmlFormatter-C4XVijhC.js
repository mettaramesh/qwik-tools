function x(e){e=e.trim(),e=e.replace(/>\s*</g,"><");const l=e.split(/(<[^>]+>)/g).filter(Boolean);let o=0,c=[];for(let a=0;a<l.length;a++){const n=l[a];if(/^<[^!?][^>]*[^\/]?>\s*$/.test(n)&&a+2<l.length&&!/^<.*>/.test(l[a+1])&&/^<\//.test(l[a+2])){const b=l[a+1].replace(/</g,"&lt;").replace(/>/g,"&gt;").trim();c.push("  ".repeat(o)+n.trim()+b+l[a+2].trim()),a+=2;continue}/^<\/.+>\s*$/.test(n)?(o=Math.max(0,o-1),c.push("  ".repeat(o)+n.trim())):/^<[^!?][^>]*[^\/]?>\s*$/.test(n)?(c.push("  ".repeat(o)+n.trim()),o++):/^<.*\/?>\s*$/.test(n)?c.push("  ".repeat(o)+n.trim()):n.trim()&&c.push("  ".repeat(o)+n.trim().replace(/</g,"&lt;").replace(/>/g,"&gt;"))}return c.join(`
`)}function h(e){return e.replace(/>\s+</g,"><").replace(/\s{2,}/g," ").trim()}function d(e){try{return!new DOMParser().parseFromString(e,"application/xml").querySelector("parsererror")}catch{return!1}}function g(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function p(e){return e.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"')}function L(e){e.innerHTML=`
    <div class="tool-header"><h2>XML Formatter</h2><p>Format, beautify, minify, or escape XML</p></div>
    <div class="tool-interface">
      <div class="tool-controls">
        <button class="btn btn--secondary" id="xml-format-btn">Format</button>
        <button class="btn btn--outline" id="xml-minify-btn">Minify</button>
        <button class="btn btn--outline" id="xml-escape-btn">Escape</button>
        <button class="btn btn--outline" id="xml-unescape-btn">Unescape</button>
        <button class="btn btn--outline" id="xml-validate-btn">Syntax Validate</button>
        <button class="btn btn--outline" id="xml-clear-btn">Clear</button>
      </div>
      <div class="io-container">
        <div class="input-section">
          <div class="section-header">
            <label class="form-label">Input XML</label>
            <button class="btn btn--sm copy-btn" data-target="xml-input">Copy</button>
          </div>
          <textarea id="xml-input" class="form-control code-input" placeholder="Paste or type your XML here..." rows="10"></textarea>
        </div>
        <div class="output-section">
          <div class="section-header">
            <label class="form-label">Formatted Output</label>
            <button class="btn btn--sm copy-btn" data-target="xml-output">Copy</button>
          </div>
          <textarea id="xml-output" class="form-control code-input" readonly rows="10"></textarea>
        </div>
      </div>
      <div id="xml-error" class="error-message hidden"></div>
    </div>
  `,typeof v=="function"&&v()}function v(){const e=document.getElementById("xml-input"),l=document.getElementById("xml-output"),o=document.getElementById("xml-format-btn"),c=document.getElementById("xml-minify-btn"),a=document.getElementById("xml-escape-btn"),n=document.getElementById("xml-unescape-btn"),b=document.getElementById("xml-validate-btn"),y=document.getElementById("xml-clear-btn"),f=document.getElementById("xml-error");function r(t){f.textContent=t,f.classList.remove("hidden")}function u(){f.textContent="",f.classList.add("hidden")}const m=()=>{const t=e.value,i=/<[^>]+>/g.test(t),s=/&lt;|&gt;/g.test(t);a&&(i?(a.removeAttribute("disabled"),a.classList.remove("btn--disabled")):(a.setAttribute("disabled","true"),a.classList.add("btn--disabled"))),n&&(s?(n.removeAttribute("disabled"),n.classList.remove("btn--disabled")):(n.setAttribute("disabled","true"),n.classList.add("btn--disabled")))};e.addEventListener("input",m),m(),o.onclick=()=>{u();try{if(!d(e.value)){r("Input is not well-formed XML.");return}l.value=x(e.value)}catch(t){r("Formatting error: "+t.message)}},c.onclick=()=>{u();try{let t=e.value,i=/&lt;|&gt;/.test(t);if(i&&(t=p(t)),!d(t)){r("Input is not well-formed XML.");return}let s=h(t);i&&(s=g(s)),l.value=s}catch(t){r("Minify error: "+t.message)}},a&&(a.onclick=()=>{u();try{let t=e.value;if(/&lt;|&gt;/.test(t)&&(t=p(t)),!d(t)){r("Input is not well-formed XML.");return}const s=g(t);l.value=s,m()}catch(t){r("Escape error: "+t.message)}}),n&&(n.onclick=()=>{u();try{let t=e.value,i=/&lt;|&gt;/.test(t),s=t;if(i){if(s=p(t),!d(s)){r("Input is not well-formed XML.");return}}else if(!d(t)){r("Input is not well-formed XML.");return}l.value=p(t),m()}catch(t){r("Unescape error: "+t.message)}}),b&&(b.onclick=()=>{u();try{let t=e.value;if(/&lt;|&gt;/.test(t)&&(t=p(t)),!t.trim()){r("Input is empty.");return}d(t)?l.value="XML is well-formed.":(l.value="",r("Input is not well-formed XML."))}catch(t){r("Validation error: "+t.message)}}),y.onclick=()=>{e.value="",l.value="",u(),m()},document.querySelectorAll(".copy-btn").forEach(t=>{t.onclick=()=>{const i=t.getAttribute("data-target"),s=document.getElementById(i);s&&navigator.clipboard.writeText(s.value).then(()=>{}).catch(E=>{})}})}export{L as load,v as setup};
