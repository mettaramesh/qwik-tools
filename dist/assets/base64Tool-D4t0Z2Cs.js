import{e as l}from"./index-d8F-AHjr.js";function b(s){s.innerHTML=`
        <div class="tool-header">
            <h2>Base64 Text Encoder/Decoder</h2>
            <p>Encode and decode Base64 text</p>
        </div>
        <div class="tool-interface">
            <div class="tool-controls">
                <button class="btn btn--secondary" id="base64-encode-btn">Encode</button>
                <button class="btn btn--outline" id="base64-decode-btn">Decode</button>
                <button class="btn btn--outline" id="base64-clear-btn">Clear</button>
            </div>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Input Text</label>
                        <button class="btn btn--sm copy-btn" data-target="base64-input">Copy</button>
                    </div>
                    <textarea id="base64-input" class="form-control code-input" placeholder="Enter text to encode/decode..." rows="12"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Output</label>
                        <button class="btn btn--sm copy-btn" data-target="base64-output">Copy</button>
                    </div>
                    <textarea id="base64-output" class="form-control code-input" readonly rows="12"></textarea>
                </div>
            </div>
            <div id="base64-status" class="hidden"></div>
        </div>
    `}function p(){const s=document.getElementById("base64-input"),o=document.getElementById("base64-output"),e=document.getElementById("base64-status"),i=t=>{t.preventDefault(),t.stopPropagation();try{o.value=l(btoa(unescape(encodeURIComponent(s.value)))),e.className="success-message",e.textContent="Text encoded successfully",e.classList.remove("hidden")}catch(d){e.className="error-message",e.textContent="Encoding failed: "+d.message,e.classList.remove("hidden")}},u=t=>{t.preventDefault(),t.stopPropagation();try{o.value=l(decodeURIComponent(escape(atob(s.value)))),e.className="success-message",e.textContent="Text decoded successfully",e.classList.remove("hidden")}catch{e.className="error-message",e.textContent="Decoding failed: Invalid Base64",e.classList.remove("hidden")}},r=t=>{t.preventDefault(),t.stopPropagation(),s.value="",o.value="",e.classList.add("hidden")},n=document.getElementById("base64-encode-btn"),a=document.getElementById("base64-decode-btn"),c=document.getElementById("base64-clear-btn");n&&n.addEventListener("click",i),a&&a.addEventListener("click",u),c&&c.addEventListener("click",r),typeof window.setupCopyButtons=="function"&&window.setupCopyButtons()}function v(s,o){b(s),p()}export{v as load,b as loadBase64Tool,p as setupBase64Tool};
