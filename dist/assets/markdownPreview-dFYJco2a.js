function v(e){e.innerHTML=`
    <div class="tool-header"><h2>Markdown Preview</h2><p>Preview your Markdown as HTML</p></div>
    <div class="tool-interface">
      <div class="tool-controls">
        <button class="btn btn--secondary" id="md-preview-btn">Preview</button>
        <button class="btn btn--outline" id="md-clear-btn">Clear</button>
      </div>
      <div class="io-container">
        <div class="input-section">
          <div class="section-header">
            <label class="form-label">Markdown Input</label>
            <button class="btn btn--sm copy-btn" data-target="md-input">Copy</button>
          </div>
          <textarea id="md-input" class="form-control code-input" placeholder="Paste or type your Markdown here..." rows="10"></textarea>
        </div>
        <div class="output-section">
          <div class="section-header">
            <label class="form-label">HTML Preview</label>
            <button class="btn btn--sm copy-btn" data-target="md-output">Copy</button>
          </div>
          <div id="md-output" class="form-control code-input markdown-preview" style="background:#fff;color:#111; min-height:10em; overflow:auto;"></div>
        </div>
      </div>
      <div id="md-error" class="error-message hidden"></div>
    </div>
  `,typeof u=="function"&&u()}function u(){const e=document.getElementById("md-input"),o=document.getElementById("md-output"),p=document.getElementById("md-preview-btn"),m=document.getElementById("md-clear-btn"),r=document.getElementById("md-error");function i(t){r.textContent=t,r.classList.remove("hidden")}function d(){r.textContent="",r.classList.add("hidden")}function s(t){if(window.marked)return t();const n=document.createElement("script");n.src="/public/marked.min.js",n.onload=t,document.head.appendChild(n)}function l(){o&&o.querySelectorAll("img").forEach(t=>{t.style.maxWidth="200px",t.style.maxHeight="200px",t.style.width="auto",t.style.height="auto",t.style.objectFit="contain",t.style.display="block",t.style.margin="1em auto"})}e.addEventListener("input",()=>{s(()=>{try{const t=window.marked.parse(e.value||"");o.innerHTML=t,l()}catch(t){i("Markdown parse error: "+t.message)}})}),p.onclick=()=>{d(),s(()=>{try{const t=window.marked.parse(e.value||"");o.innerHTML=t,l()}catch(t){i("Markdown parse error: "+t.message)}})},m.onclick=()=>{e.value="",o.innerHTML="",d()},document.querySelectorAll(".copy-btn").forEach(t=>{t.onclick=()=>{const n=t.getAttribute("data-target"),a=document.getElementById(n);a&&(a.tagName==="TEXTAREA"?navigator.clipboard.writeText(a.value).then(()=>{console.log("Text copied to clipboard successfully!")}).catch(c=>{console.error("Failed to copy text: ",c)}):navigator.clipboard.writeText(a.innerText).then(()=>{console.log("Text copied to clipboard successfully!")}).catch(c=>{console.error("Failed to copy text: ",c)}))}}),typeof window.setupCopyButtons=="function"&&window.setupCopyButtons()}export{v as load,u as setup};
