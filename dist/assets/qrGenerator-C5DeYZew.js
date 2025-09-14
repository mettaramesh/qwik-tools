function v(o){o.innerHTML=`
    <div class="tool-header">
      <h2>QR Code Generator</h2>
      <p>Create a QR code for any text, URL, or data</p>
    </div>
    <div class="tool-interface">
      <div class="tool-controls">
        <button class="btn btn--secondary" id="qr-generate-btn">Generate</button>
        <button class="btn btn--outline" id="qr-clear-btn">Clear</button>
      </div>
      <div class="io-container">
        <div class="input-section">
          <div class="section-header">
            <label class="form-label">Input Text or URL</label>
            <button class="btn btn--sm copy-btn" data-target="qr-input">Copy</button>
          </div>
          <textarea id="qr-input" class="form-control code-input" placeholder="Enter text, URL, or data for QR code..." rows="4"></textarea>
        </div>
        <div class="output-section">
          <div class="section-header">
            <label class="form-label">QR Code</label>
            <button class="btn btn--sm" id="qr-download-btn">Download</button>
          </div>
          <div id="qr-code-output" class="qr-code-output" style="text-align:center;padding:16px 0;"></div>
        </div>
        <div id="qr-error" class="error-message hidden"></div>
      </div>
    </div>
  `,m()}function m(){const o=document.getElementById("qr-input"),l=document.getElementById("qr-generate-btn"),s=document.getElementById("qr-clear-btn"),a=document.getElementById("qr-code-output"),r=document.getElementById("qr-error"),u=document.getElementById("qr-download-btn");function p(t){r.textContent=t,r.classList.remove("hidden")}function c(){r.textContent="",r.classList.add("hidden")}document.querySelectorAll(".copy-btn").forEach(t=>{t.onclick=function(){const e=t.getAttribute("data-target"),n=document.getElementById(e);n&&navigator.clipboard.writeText(n.value||"").then(()=>{const b=t.textContent;t.textContent="Copied!",setTimeout(()=>{t.textContent=b},1e3)})}});let d=null;function i(){c(),a.innerHTML="";const t=o.value.trim();if(!t){p("Please enter text or a URL to generate a QR code.");return}if(!window.QRious){const n=document.createElement("script");n.src="/public/qrious.min.js",n.onload=()=>i(),document.body.appendChild(n);return}d=new window.QRious({value:t,size:220,background:"white",foreground:"#222",level:"H"});const e=document.createElement("img");e.src=d.toDataURL(),e.alt="QR Code",e.style.maxWidth="220px",e.style.background="#fff",e.style.borderRadius="8px",e.style.boxShadow="0 2px 8px 0 rgba(0,0,0,0.07)",a.appendChild(e)}l.onclick=i,s.onclick=()=>{o.value="",a.innerHTML="",c()},u.onclick=()=>{if(!d)return;const t=document.createElement("a");t.href=d.toDataURL(),t.download="qr-code.png",t.click()}}export{v as load};
