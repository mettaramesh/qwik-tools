import{b as p}from"./utils-D6OBsT8e.js";window.simpleMD5=p;function m(t){t.innerHTML=`
        <div class="tool-header">
            <h2>Hash Generator</h2>
            <p>Generate MD5, SHA1, SHA256, and SHA512 hashes</p>
        </div>
        <div class="tool-interface">
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Input Text</label>
                    </div>
                    <textarea id="hash-input" class="form-control code-input" placeholder="Enter text to hash..." rows="6"></textarea>
                </div>
            </div>
            <div class="multi-output-container">
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">MD5</label>
                        <button class="btn btn--sm copy-btn" data-target="md5-output">Copy</button>
                    </div>
                    <textarea id="md5-output" class="form-control code-input text-mono" readonly rows="2"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">SHA1</label>
                        <button class="btn btn--sm copy-btn" data-target="sha1-output">Copy</button>
                    </div>
                    <textarea id="sha1-output" class="form-control code-input text-mono" readonly rows="2"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">SHA256</label>
                        <button class="btn btn--sm copy-btn" data-target="sha256-output">Copy</button>
                    </div>
                    <textarea id="sha256-output" class="form-control code-input text-mono" readonly rows="2"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">SHA512</label>
                        <button class="btn btn--sm copy-btn" data-target="sha512-output">Copy</button>
                    </div>
                    <textarea id="sha512-output" class="form-control code-input text-mono" readonly rows="3"></textarea>
                </div>
            </div>
        </div>
    `}function h(){const t=document.getElementById("hash-input"),n=document.getElementById("md5-output"),r=document.getElementById("sha1-output"),i=document.getElementById("sha256-output"),l=document.getElementById("sha512-output"),d=async()=>{const a=t.value;if(!a)return;const o=new TextEncoder().encode(a);try{const s=await crypto.subtle.digest("SHA-1",o),c=await crypto.subtle.digest("SHA-256",o),u=await crypto.subtle.digest("SHA-512",o);r.value=Array.from(new Uint8Array(s)).map(e=>e.toString(16).padStart(2,"0")).join(""),i.value=Array.from(new Uint8Array(c)).map(e=>e.toString(16).padStart(2,"0")).join(""),l.value=Array.from(new Uint8Array(u)).map(e=>e.toString(16).padStart(2,"0")).join(""),n.value=typeof window.simpleMD5=="function"?window.simpleMD5(a):""}catch(s){console.error("Hash generation failed:",s)}};t&&t.addEventListener("input",d),typeof window.setupCopyButtons=="function"&&window.setupCopyButtons()}function y(t,n){m(t),h()}export{y as load,m as loadHashGenerator,h as setupHashGenerator};
