function ce(b){b.innerHTML=`
    <div class="tool-header">
      <h2>Encodings Converter</h2>
      <p class="small">Decode bytes with legacy encodings using <code>TextDecoder</code> or built-in CP037 tables, then export as Text, Base64, Hex, URL-encoded, or download bytes in UTF-8/UTF-16/EBCDIC.</p>
    </div>

    <div class="grid-charset">
      <!-- INPUT -->
      <div class="card">
        <h3>Input</h3>
        <div class="split">
          <div class="row">
            <label for="inputMode">Interpret input as</label>
            <select id="inputMode" class="base-select"></select>
          </div>
          <div class="row">
            <label for="byteDecode">Decode bytes with</label>
            <select id="byteDecode" class="base-select"></select>
            <span class="small">Used when the input mode provides bytes (Base64/Hex/File).</span>
          </div>
        </div>
  <div class="row small charset-margin-top">
          <label><input type="checkbox" id="normalizeNEL" checked> Normalize NEL (U+0085) → LF</label>
        </div>

  <div id="fileBox" class="file row charset-hide">
          <input type="file" id="fileInput" />
          <span id="fileInfo" class="small"></span>
        </div>

        <textarea id="inputArea" rows="10" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" placeholder="Paste your text / Base64 / Hex / URL-encoded here..."></textarea>

        <div class="row">
          <button class="btn btn--primary" id="btnConvert">Convert ⮕</button>
          <button class="btn btn--outline" id="btnSwap">Swap panels</button>
          <button class="btn btn--outline" id="btnClear">Clear</button>
        </div>
        <div class="metrics" id="inMetrics"></div>
        <div class="footer small">Tip: When using Base64/Hex as input, choose the correct <span class="hl">Decode bytes with</span> encoding.</div>
      </div>

      <!-- OUTPUT -->
      <div class="card">
        <h3>Output</h3>
        <div class="split">
          <div class="row">
            <label for="outputAs">Export as</label>
            <select id="outputAs" class="base-select"></select>
          </div>
          <div class="row">
            <label for="encodeWith">Encode string as</label>
            <select id="encodeWith" class="base-select"></select>
            <label class="charset-margin-left"><input type="checkbox" id="addBOM"> Add BOM</label>
          </div>
        </div>
        <textarea id="outputArea" rows="10" readonly placeholder="Converted output will appear here..."></textarea>
        <div class="row">
          <button class="btn btn--outline" id="btnCopy">Copy</button>
          <button class="btn btn--outline" id="btnDownload">Download</button>
        </div>
        <div class="metrics" id="outMetrics"></div>
        <div class="footer small" id="compat">
          Browser support: <code>TextDecoder</code> decodes many legacy encodings; EBCDIC CP037 is implemented here via a built-in table. <code>TextEncoder</code> officially encodes UTF-8 only; UTF-16 here is manual.
        </div>
      </div>
    </div>

    <!-- QUICK PANEL: EBCDIC (CP037) file → ASCII -->
  <div class="card card--quick-ebc charset-margin-top">
  <h3 class="charset-margin-bottom">Quick Convert: <span class="hl">EBCDIC (CP037)</span> file <span class="charset-font-weight-400">→</span> ASCII</h3>
  <div class="row charset-margin-bottom charset-align-items-flex-end">
  <div class="charset-flex-minwidth">
          <label class="form-label" for="ebcFileInput">Select EBCDIC file</label>
          <input type="file" id="ebcFileInput" class="form-control charset-width-100" />
        </div>
  <span id="ebcFileInfo" class="small charset-margin-left"></span>
      </div>
  <div class="row small charset-margin-bottom">
        <label><input type="checkbox" id="ebcNormalizeNEL" checked> Normalize NEL (U+0085) → LF</label>
  <label class="charset-margin-left-lg"><input type="checkbox" id="ebcCRLF"> Use CRLF line endings in download</label>
      </div>
  <div class="row charset-margin-bottom">
        <button class="btn btn--primary" id="btnEbcPreview">Preview</button>
        <button class="btn btn--outline" id="btnEbcDownload">Download ASCII .txt</button>
      </div>
  <textarea id="ebcPreview" rows="8" readonly placeholder="Preview (first 2,000 chars)…" class="charset-preview"></textarea>
  <div class="footer small charset-margin-top">This panel ignores other encoders/decoders and always treats input as CP037 bytes → ASCII/Unicode text.</div>
    </div>

  <div class="card charset-margin-top-lg">
      <h3>Notes</h3>
      <ul class="small">
        <li><strong>CP037</strong> is U.S./Canada EBCDIC; other locales use different pages (e.g., 1140 adds the euro symbol).</li>
        <li><strong>NEL</strong> is an EBCDIC newline; many web tools don’t treat <code>U+0085</code> as a line break. Toggle normalization as needed.</li>
      </ul>
    </div>
  `}function de(b){const y=typeof window.TextDecoder=="function",h=typeof window.TextEncoder=="function",S=Uint16Array.from([0,1,2,3,156,9,134,127,151,141,142,11,12,13,14,15,16,17,18,19,157,133,8,135,24,25,146,143,28,29,30,31,128,129,130,131,132,10,23,27,136,137,138,139,140,5,6,7,144,145,22,147,148,149,150,4,152,153,154,155,20,21,158,26,32,160,226,228,224,225,227,229,231,241,162,46,60,40,43,124,38,233,234,235,232,237,238,239,236,223,33,36,42,41,59,172,45,47,194,196,192,193,195,197,199,209,166,44,37,95,62,63,248,201,202,203,200,205,206,207,204,96,58,35,64,39,61,34,216,97,98,99,100,101,102,103,104,105,171,187,240,253,254,177,176,106,107,108,109,110,111,112,113,114,170,186,230,184,198,164,181,126,115,116,117,118,119,120,121,122,161,191,208,221,222,174,94,163,165,183,169,167,182,188,189,190,91,93,175,168,180,215,123,65,66,67,68,69,70,71,72,73,173,244,246,242,243,245,125,74,75,76,77,78,79,80,81,82,185,251,252,249,250,255,92,247,83,84,85,86,87,88,89,90,178,212,214,210,211,213,48,49,50,51,52,53,54,55,56,57,179,219,220,217,218,159]),_=(()=>{const e=new Uint16Array(128);for(let t=0;t<128;t++)e[t]=111;for(let t=0;t<256;t++){const n=S[t];n<128&&(e[n]=t)}return e})(),i=e=>b.querySelector("#"+e),B=i("inputMode"),A=i("byteDecode"),j=i("normalizeNEL"),R=i("fileBox"),a=i("fileInput"),D=i("fileInfo"),v=i("inputArea"),c=i("outputArea"),L=i("outputAs"),w=i("encodeWith"),F=i("addBOM"),W=i("btnConvert"),Z=i("btnSwap"),$=i("btnClear"),q=i("btnCopy"),K=i("btnDownload"),m=i("inMetrics"),u=i("outMetrics"),Q=i("compat"),k=i("ebcFileInput"),H=i("ebcFileInfo"),V=i("btnEbcPreview"),G=i("btnEbcDownload"),T=i("ebcPreview"),U=i("ebcNormalizeNEL"),J=i("ebcCRLF");B.innerHTML=`
    <option value="text">Text</option>
    <option value="base64">Base64 (bytes)</option>
    <option value="hex">Hex (bytes)</option>
    <option value="url">URL-encoded</option>
    <option value="file">File (bytes)</option>`,L.innerHTML=`
    <option value="text">Text</option>
    <option value="base64">Base64</option>
    <option value="hex">Hex</option>
    <option value="url">URL-encoded</option>
    <option value="download">Download bytes</option>`,w.innerHTML=`
    <option value="utf-8">UTF-8</option>
    <option value="utf-16le">UTF-16LE</option>
    <option value="utf-16be">UTF-16BE</option>
    <option value="ibm-037">EBCDIC (IBM 037)</option>`;const X=["utf-8","utf-16le","utf-16be","windows-1252","iso-8859-1","iso-8859-2","iso-8859-15","macintosh","koi8-r","koi8-u","windows-1251","windows-1250","windows-1254","windows-1255","windows-1256","windows-1257","windows-1258","shift_jis","euc-jp","iso-2022-jp","gbk","gb18030","big5","euc-kr","iso-2022-kr","iso-2022-cn"];function Y(){const e=["ibm-037"];if(y)for(const t of X)try{new TextDecoder(t),e.push(t)}catch{}return e}A.innerHTML="";for(const e of Y()){const t=document.createElement("option");t.value=e,t.textContent=e==="ibm-037"?"EBCDIC (IBM 037)":e,A.appendChild(t)}A.value="ibm-037",w.addEventListener("change",()=>{w.value==="ibm-037"?(F.checked=!1,F.disabled=!0):F.disabled=!1}),w.dispatchEvent(new Event("change")),B.addEventListener("change",O);function O(){B.value==="file"?(R.classList.remove("charset-hide"),v.classList.add("charset-hide")):(R.classList.add("charset-hide"),v.classList.remove("charset-hide"))}O();function ee(e){if(!h)throw new Error("TextEncoder not supported.");return new TextEncoder().encode(e)}function z(e,t=!0){const n=new ArrayBuffer(e.length*2),o=new DataView(n);for(let s=0;s<e.length;s++)o.setUint16(s*2,e.charCodeAt(s),t);return new Uint8Array(n)}function g(e,t){if(t==="utf-8")return ee(e);if(t==="utf-16le")return z(e,!0);if(t==="utf-16be")return z(e,!1);if(t==="ibm-037")return re(e);throw new Error("Unsupported output encoding.")}function te(e,t){if(t==="ibm-037")return M(e,j.checked);if(!y)throw new Error("TextDecoder not supported.");return new TextDecoder(t,{fatal:!1}).decode(e)}function ne(e){const t=e.replace(/[\r\n\s]+/g,"").replace(/-/g,"+").replace(/_/g,"/");if(t&&!/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(t))throw new Error("Invalid Base64 input.");const n=t?atob(t):"",o=new Uint8Array(n.length);for(let s=0;s<n.length;s++)o[s]=n.charCodeAt(s);return o}function oe(e){let n="";for(let o=0;o<e.length;o+=32768)n+=String.fromCharCode.apply(null,e.subarray(o,o+32768));return btoa(n)}function se(e){let t=e.replace(/[\s,;:_-]/g,"").toLowerCase();if(t.startsWith("0x")&&(t=t.slice(2)),t.length===0)return new Uint8Array;if(t.length%2!==0)throw new Error("Hex length must be even.");const n=new Uint8Array(t.length/2);for(let o=0;o<t.length;o+=2){const s=parseInt(t.slice(o,o+2),16);if(Number.isNaN(s))throw new Error("Invalid hex at position "+o);n[o/2]=s}return n}function ie(e){const t=new Array(e.length);for(let n=0;n<e.length;n++)t[n]=e[n].toString(16).padStart(2,"0");return t.join("")}const le=e=>decodeURIComponent(e.replace(/\+/g,"%20")),ae=e=>encodeURIComponent(e).replace(/%20/g,"+");function r(e,{textLen:t=null,byteLen:n=null,status:o=null}){e.innerHTML="",t!=null&&I(e,`Chars: ${t}`),n!=null&&I(e,`Bytes: ${n}`),o&&I(e,o.msg,o.ok?"ok":"bad")}function I(e,t,n=""){const o=document.createElement("span");o.className="pill "+(n||""),o.textContent=t,e.appendChild(o)}function M(e,t){let n="";for(let o=0;o<e.length;o++){let s=S[e[o]];t&&s===133&&(s=10),n+=String.fromCharCode(s)}return n}function re(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++){const o=e.charCodeAt(n)&65535;o<128?t[n]=_[o]:t[n]=111}return t}let E=null,d="";W.addEventListener("click",()=>{try{r(u,{status:{ok:!0,msg:"Converting…"}});const e=B.value,t=v.value;let n="";if(e==="text")n=t,r(m,{textLen:n.length,status:{ok:!0,msg:"Interpreted as Unicode text"}});else if(e==="url")n=le(t),r(m,{textLen:n.length,status:{ok:!0,msg:"URL-decoded → text"}});else if(e==="base64"||e==="hex"||e==="file"){let l;if(e==="base64")l=ne(t),r(m,{byteLen:l.length,status:{ok:!0,msg:"Base64 → bytes"}});else if(e==="hex")l=se(t),r(m,{byteLen:l.length,status:{ok:!0,msg:"Hex → bytes"}});else{if(!(a.files&&a.files[0])||!a._cachedBytes)throw new Error("Select a file.");l=a._cachedBytes,r(m,{byteLen:l.length,status:{ok:!0,msg:"File bytes loaded"}})}n=te(l,A.value)}else throw new Error("Unknown input mode.");d=n;const o=L.value,s=w.value,x=F.checked;let f="",C=null;if(o==="text")f=d,C=g(d,s);else if(o==="url")f=ae(d),C=g(d,s);else if(o==="base64"){let l=g(d,s);x&&s!=="ibm-037"&&(l=P(l,s)),f=oe(l),C=l}else if(o==="hex"){let l=g(d,s);x&&s!=="ibm-037"&&(l=P(l,s)),f=ie(l),C=l}else if(o==="download"){let l=g(d,s);x&&s!=="ibm-037"&&(l=P(l,s)),f="Ready to download ("+l.length+" bytes).",C=l}else throw new Error("Unknown output type.");c.value=f,E=C,r(u,{textLen:o==="text"||o==="url"?f.length:null,byteLen:E?E.length:null,status:{ok:!0,msg:"Output: "+o+" ("+s+(x&&s!=="ibm-037"?"+BOM":"")+")"}})}catch(e){console.error(e),r(u,{status:{ok:!1,msg:e.message}})}});function P(e,t){return t==="utf-8"?N(new Uint8Array([239,187,191]),e):t==="utf-16le"?N(new Uint8Array([255,254]),e):t==="utf-16be"?N(new Uint8Array([254,255]),e):e}const N=(e,t)=>{const n=new Uint8Array(e.length+t.length);return n.set(e,0),n.set(t,e.length),n};a.addEventListener("change",async()=>{D.textContent="",a._cachedBytes=null;const e=a.files&&a.files[0];if(!e)return;const t=new Uint8Array(await e.arrayBuffer());a._cachedBytes=t,D.textContent=e.name+" - "+t.length+" bytes"}),q.addEventListener("click",async()=>{try{navigator.clipboard&&window.isSecureContext?await navigator.clipboard.writeText(c.value):(c.removeAttribute("readonly"),c.select(),document.execCommand("copy"),c.setAttribute("readonly","true")),r(u,{status:{ok:!0,msg:"Copied to clipboard"}})}catch{r(u,{status:{ok:!1,msg:"Clipboard copy failed"}})}}),K.addEventListener("click",()=>{const e=L.value;let t,n;if(e==="download"){if(!E){r(u,{status:{ok:!1,msg:"Nothing to download. Convert first."}});return}const x=w.value;t=new Blob([E],{type:"application/octet-stream"}),n="converted-"+x+".bin"}else{const x=c.value??"";t=new Blob([x],{type:"text/plain;charset=utf-8"}),n="converted-"+e+".txt"}const o=URL.createObjectURL(t),s=document.createElement("a");s.href=o,s.download=n,document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(o),0)});let p=null;if(k.addEventListener("change",async()=>{H.textContent="",p=null;const e=k.files&&k.files[0];e&&(p=new Uint8Array(await e.arrayBuffer()),H.textContent=e.name+" - "+p.length+" bytes")}),V.addEventListener("click",()=>{if(!p){T.value="Select a file first.";return}let e=M(p,U.checked);T.value=e.slice(0,2e3)}),G.addEventListener("click",()=>{if(!p){T.value="Select a file first.";return}let e=M(p,U.checked);J.checked&&(U.checked?e=e.replace(/\n/g,`\r
`):e=e.replace(/\u0085/g,`\r
`));const t=new Blob([e],{type:"text/plain;charset=us-ascii"}),n=URL.createObjectURL(t),o=document.createElement("a");o.href=n,o.download="converted-cp037.txt",document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(n),0)}),!y){const e=document.createElement("div");e.className="small charset-error-color",e.textContent="Limited mode: This browser lacks TextDecoder; built-in CP037 still works; other decoders unavailable.",Q.appendChild(e)}typeof window.setupCopyButtons=="function"&&window.setupCopyButtons(),Z.addEventListener("click",()=>{const e=v.value;v.value=c.value,c.value=e}),$.addEventListener("click",()=>{v.value="",c.value="",a&&(a.value="",a._cachedBytes=null),D.textContent="",m.innerHTML="",u.innerHTML=""})}function ue(b,y){if(!document.getElementById("charsetconverter-css-link")){const h=document.createElement("link");h.id="charsetconverter-css-link",h.rel="stylesheet",h.href="charsetConverterTool.css",document.head.appendChild(h)}ce(b),de(b)}export{ue as load,ce as loadCharsetConverterTool,de as setupCharsetConverterTool};
