import{e as a,s as p}from"./utils-D6OBsT8e.js";window.setupCopyButtons||(window.setupCopyButtons=p);function m(e){e.innerHTML=`
        <div class="tool-header">
            <h2>URL Encoder/Decoder</h2>
            <p>Encode and decode URLs and URI components</p>
        </div>
        <div class="tool-interface">
            <div class="tool-controls">
                <button class="btn btn--secondary" id="url-encode-btn">Encode</button>
                <button class="btn btn--outline" id="url-decode-btn">Decode</button>
                <button class="btn btn--outline" id="url-clear-btn">Clear</button>
            </div>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Input URL</label>
                        <button class="btn btn--sm copy-btn" data-target="url-input">Copy</button>
                    </div>
                    <textarea id="url-input" class="form-control code-input" placeholder="Enter URL to encode/decode..." rows="12"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Output</label>
                        <button class="btn btn--sm copy-btn" data-target="url-output">Copy</button>
                    </div>
                    <textarea id="url-output" class="form-control code-input" readonly rows="12"></textarea>
                </div>
            </div>
            <div id="url-status" class="hidden"></div>
        </div>
    `,setTimeout(()=>{const n=e.querySelector("#url-input"),t=e.querySelector("#url-output");n&&(n.value=""),t&&(t.value="")},0)}function b(){const e=document.getElementById("url-input"),n=document.getElementById("url-output"),t=document.getElementById("url-status"),u=o=>{o.preventDefault(),o.stopPropagation();try{n.value=a(encodeURIComponent(e.value)),t.className="success-message",t.textContent="URL encoded successfully",t.classList.remove("hidden")}catch(s){t.className="error-message",t.textContent="Encoding failed: "+s.message,t.classList.remove("hidden")}},i=o=>{o.preventDefault(),o.stopPropagation();try{n.value=a(decodeURIComponent(e.value)),t.className="success-message",t.textContent="URL decoded successfully",t.classList.remove("hidden")}catch(s){t.className="error-message",t.textContent="Decoding failed: "+s.message,t.classList.remove("hidden")}},r=o=>{o.preventDefault(),o.stopPropagation(),e.value="",n.value="",t.classList.add("hidden")},c=document.getElementById("url-encode-btn"),d=document.getElementById("url-decode-btn"),l=document.getElementById("url-clear-btn");c&&c.addEventListener("click",u),d&&d.addEventListener("click",i),l&&l.addEventListener("click",r),typeof window.setupCopyButtons=="function"&&window.setupCopyButtons()}function f(e,n){m(e)}export{f as load,m as loadURLTool,b as setupURLTool};
