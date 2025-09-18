function O(){if(!document.getElementById("charsetconverter-css-link")){const a=document.createElement("link");a.id="charsetconverter-css-link",a.rel="stylesheet",a.type="text/css",a.href="/charsetConverterTool.css",document.head&&document.head.appendChild(a)}}O();function xe(a){a.innerHTML=`
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
        <div class="row small mt-8">
          <label><input type="checkbox" id="normalizeNEL" checked> Normalize NEL (U+0085)  LF</label>
        </div>

        <div id="fileBox" class="file row d-none">
          <input type="file" id="fileInput" />
          <span id="fileInfo" class="small"></span>
        </div>

        <textarea id="inputArea" rows="10" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" placeholder="Paste your text / Base64 / Hex / URL-encoded here..."></textarea>

        <div class="row">
          <button class="btn btn--primary" id="btnConvert">Convert 5</button>
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
            <label class="ml-10"><input type="checkbox" id="addBOM"> Add BOM</label>
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

    <!-- QUICK PANEL: EBCDIC (CP037) file  ASCII -->
    <div class="card card--quick-ebc mt-24">
      <h3 class="mb-10">Quick Convert: <span class="hl">EBCDIC (CP037)</span> file <span class="fw-400"></span> ASCII</h3>
      <div class="row mb-10 align-end">
        <div class="flex-1 minw-180">
          <label class="form-label" for="ebcFileInput">Select EBCDIC file</label>
          <input type="file" id="ebcFileInput" class="form-control w-100" />
        </div>
        <span id="ebcFileInfo" class="small ml-12"></span>
      </div>
      <div class="row small mb-10">
        <label><input type="checkbox" id="ebcNormalizeNEL" checked> Normalize NEL (U+0085)  LF</label>
        <label class="ml-18"><input type="checkbox" id="ebcCRLF"> Use CRLF line endings in download</label>
      </div>
      <div class="row mb-10">
        <button class="btn btn--primary" id="btnEbcPreview">Preview</button>
        <button class="btn btn--outline" id="btnEbcDownload">Download ASCII .txt</button>
      </div>
      <textarea id="ebcPreview" rows="8" readonly placeholder="Preview (first 2,000 chars)" class="ebc-preview"></textarea>
      <div class="footer small mt-8">This panel ignores other encoders/decoders and always treats input as CP037 bytes  ASCII/Unicode text.</div>
    </div>

    <div class="card mt-16">
      <h3>Notes</h3>
      <ul class="small">
        <li><strong>CP037</strong> is U.S./Canada EBCDIC; other locales use different pages (e.g., 1140 adds the euro symbol).</li>
        <li><strong>NEL</strong> is an EBCDIC newline; many web tools dont treat <code>U+0085</code> as a line break. Toggle normalization as needed.</li>
      </ul>
    </div>
  `}function de(a){const E=typeof window.TextDecoder=="function",z=typeof window.TextEncoder=="function",S=Uint16Array.from([0,1,2,3,156,9,134,127,151,141,142,11,12,13,14,15,16,17,18,19,157,133,8,135,24,25,146,143,28,29,30,31,128,129,130,131,132,10,23,27,136,137,138,139,140,5,6,7,144,145,22,147,148,149,150,4,152,153,154,155,20,21,158,26,32,160,226,228,224,225,227,229,231,241,162,46,60,40,43,124,38,233,234,235,232,237,238,239,236,223,33,36,42,41,59,172,45,47,194,196,192,193,195,197,199,209,166,44,37,95,62,63,248,201,202,203,200,205,206,207,204,96,58,35,64,39,61,34,216,97,98,99,100,101,102,103,104,105,171,187,240,253,254,177,176,106,107,108,109,110,111,112,113,114,170,186,230,184,198,164,181,126,115,116,117,118,119,120,121,122,161,191,208,221,222,174,94,163,165,183,169,167,182,188,189,190,91,93,175,168,180,215,123,65,66,67,68,69,70,71,72,73,173,244,246,242,243,245,125,74,75,76,77,78,79,80,81,82,185,251,252,249,250,255,92,247,83,84,85,86,87,88,89,90,178,212,214,210,211,213,48,49,50,51,52,53,54,55,56,57,179,219,220,217,218,159]),_=(()=>{const e=new Uint16Array(128);for(let t=0;t<128;t++)e[t]=111;for(let t=0;t<256;t++){const n=S[t];n<128&&(e[n]=t)}return e})(),s=e=>a.querySelector("#"+e),B=s("inputMode"),g=s("byteDecode"),j=s("normalizeNEL"),W=s("fileBox"),r=s("fileInput"),F=s("fileInfo"),C=s("inputArea"),x=s("outputArea"),D=s("outputAs"),h=s("encodeWith"),A=s("addBOM"),Z=s("btnConvert"),$=s("btnSwap"),q=s("btnClear"),K=s("btnCopy"),Q=s("btnDownload"),v=s("inMetrics"),p=s("outMetrics"),V=s("compat"),k=s("ebcFileInput"),N=s("ebcFileInfo"),G=s("btnEbcPreview"),J=s("btnEbcDownload"),L=s("ebcPreview"),T=s("ebcNormalizeNEL"),X=s("ebcCRLF");B.innerHTML=`
    <option value="text">Text</option>
    <option value="base64">Base64 (bytes)</option>
    <option value="hex">Hex (bytes)</option>
    <option value="url">URL-encoded</option>
    <option value="file">File (bytes)</option>`,D.innerHTML=`
    <option value="text">Text</option>
    <option value="base64">Base64</option>
    <option value="hex">Hex</option>
    <option value="url">URL-encoded</option>
    <option value="download">Download bytes</option>`,h.innerHTML=`
    <option value="utf-8">UTF-8</option>
    <option value="utf-16le">UTF-16LE</option>
    <option value="utf-16be">UTF-16BE</option>
    <option value="ibm-037">EBCDIC (IBM 037)</option>`;const Y=["utf-8","utf-16le","utf-16be","windows-1252","iso-8859-1","iso-8859-2","iso-8859-15","macintosh","koi8-r","koi8-u","windows-1251","windows-1250","windows-1254","windows-1255","windows-1256","windows-1257","windows-1258","shift_jis","euc-jp","iso-2022-jp","gbk","gb18030","big5","euc-kr","iso-2022-kr","iso-2022-cn"];function ee(){const e=["ibm-037"];if(E)for(const t of Y)try{new TextDecoder(t),e.push(t)}catch{}return e}g.innerHTML="";for(const e of ee()){const t=document.createElement("option");t.value=e,t.textContent=e==="ibm-037"?"EBCDIC (IBM 037)":e,g.appendChild(t)}g.value="ibm-037",h.addEventListener("change",()=>{h.value==="ibm-037"?(A.checked=!1,A.disabled=!0):A.disabled=!1}),h.dispatchEvent(new Event("change")),B.addEventListener("change",R);function R(){const e=B.value;W.style.display=e==="file"?"":"none",C.style.display=e==="file"?"none":""}R();function te(e){if(!z)throw new Error("TextEncoder not supported.");return new TextEncoder().encode(e)}function H(e,t=!0){const n=new ArrayBuffer(e.length*2),o=new DataView(n);for(let l=0;l<e.length;l++)o.setUint16(l*2,e.charCodeAt(l),t);return new Uint8Array(n)}function m(e,t){if(t==="utf-8")return te(e);if(t==="utf-16le")return H(e,!0);if(t==="utf-16be")return H(e,!1);if(t==="ibm-037")return ce(e);throw new Error("Unsupported output encoding.")}function ne(e,t){if(t==="ibm-037")return I(e,j.checked);if(!E)throw new Error("TextDecoder not supported.");return new TextDecoder(t,{fatal:!1}).decode(e)}function oe(e){const t=e.replace(/[\r\n\s]+/g,"").replace(/-/g,"+").replace(/_/g,"/");if(t&&!/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(t))throw new Error("Invalid Base64 input.");const n=t?atob(t):"",o=new Uint8Array(n.length);for(let l=0;l<n.length;l++)o[l]=n.charCodeAt(l);return o}function le(e){let n="";for(let o=0;o<e.length;o+=32768)n+=String.fromCharCode.apply(null,e.subarray(o,o+32768));return btoa(n)}function se(e){let t=e.replace(/[\s,;:_-]/g,"").toLowerCase();if(t.startsWith("0x")&&(t=t.slice(2)),t.length===0)return new Uint8Array;if(t.length%2!==0)throw new Error("Hex length must be even.");const n=new Uint8Array(t.length/2);for(let o=0;o<t.length;o+=2){const l=parseInt(t.slice(o,o+2),16);if(Number.isNaN(l))throw new Error("Invalid hex at position "+o);n[o/2]=l}return n}function ie(e){const t=new Array(e.length);for(let n=0;n<e.length;n++)t[n]=e[n].toString(16).padStart(2,"0");return t.join("")}const ae=e=>decodeURIComponent(e.replace(/\+/g,"%20")),re=e=>encodeURIComponent(e).replace(/%20/g,"+");function c(e,{textLen:t=null,byteLen:n=null,status:o=null}){e.innerHTML="",t!=null&&U(e,`Chars: ${t}`),n!=null&&U(e,`Bytes: ${n}`),o&&U(e,o.msg,o.ok?"ok":"bad")}function U(e,t,n=""){const o=document.createElement("span");o.className="pill "+(n||""),o.textContent=t,e.appendChild(o)}function I(e,t){let n="";for(let o=0;o<e.length;o++){let l=S[e[o]];t&&l===133&&(l=10),n+=String.fromCharCode(l)}return n}function ce(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++){const o=e.charCodeAt(n)&65535;o<128?t[n]=_[o]:t[n]=111}return t}let y=null,d="";Z.addEventListener("click",()=>{try{c(p,{status:{ok:!0,msg:"Converting…"}});const e=B.value,t=C.value;let n="";if(e==="text")n=t,c(v,{textLen:n.length,status:{ok:!0,msg:"Interpreted as Unicode text"}});else if(e==="url")n=ae(t),c(v,{textLen:n.length,status:{ok:!0,msg:"URL-decoded → text"}});else if(e==="base64"||e==="hex"||e==="file"){let i;if(e==="base64")i=oe(t),c(v,{byteLen:i.length,status:{ok:!0,msg:"Base64 → bytes"}});else if(e==="hex")i=se(t),c(v,{byteLen:i.length,status:{ok:!0,msg:"Hex → bytes"}});else{if(!(r.files&&r.files[0])||!r._cachedBytes)throw new Error("Select a file.");i=r._cachedBytes,c(v,{byteLen:i.length,status:{ok:!0,msg:"File bytes loaded"}})}n=ne(i,g.value)}else throw new Error("Unknown input mode.");d=n;const o=D.value,l=h.value,u=A.checked;let f="",w=null;if(o==="text")f=d,w=m(d,l);else if(o==="url")f=re(d),w=m(d,l);else if(o==="base64"){let i=m(d,l);u&&l!=="ibm-037"&&(i=M(i,l)),f=le(i),w=i}else if(o==="hex"){let i=m(d,l);u&&l!=="ibm-037"&&(i=M(i,l)),f=ie(i),w=i}else if(o==="download"){let i=m(d,l);u&&l!=="ibm-037"&&(i=M(i,l)),f="Ready to download ("+i.length+" bytes).",w=i}else throw new Error("Unknown output type.");x.value=f,y=w,c(p,{textLen:o==="text"||o==="url"?f.length:null,byteLen:y?y.length:null,status:{ok:!0,msg:"Output: "+o+" ("+l+(u&&l!=="ibm-037"?"+BOM":"")+")"}})}catch(e){console.error(e),c(p,{status:{ok:!1,msg:e.message}})}});function M(e,t){return t==="utf-8"?P(new Uint8Array([239,187,191]),e):t==="utf-16le"?P(new Uint8Array([255,254]),e):t==="utf-16be"?P(new Uint8Array([254,255]),e):e}const P=(e,t)=>{const n=new Uint8Array(e.length+t.length);return n.set(e,0),n.set(t,e.length),n};r.addEventListener("change",async()=>{F.textContent="",r._cachedBytes=null;const e=r.files&&r.files[0];if(!e)return;const t=new Uint8Array(await e.arrayBuffer());r._cachedBytes=t,F.textContent=e.name+" - "+t.length+" bytes"}),K.addEventListener("click",async()=>{try{navigator.clipboard&&window.isSecureContext?await navigator.clipboard.writeText(x.value):(x.removeAttribute("readonly"),x.select(),document.execCommand("copy"),x.setAttribute("readonly","true")),c(p,{status:{ok:!0,msg:"Copied to clipboard"}})}catch{c(p,{status:{ok:!1,msg:"Clipboard copy failed"}})}}),Q.addEventListener("click",()=>{const e=D.value;let t,n;if(e==="download"){if(!y){c(p,{status:{ok:!1,msg:"Nothing to download. Convert first."}});return}const u=h.value;t=new Blob([y],{type:"application/octet-stream"}),n="converted-"+u+".bin"}else{const u=x.value??"";t=new Blob([u],{type:"text/plain;charset=utf-8"}),n="converted-"+e+".txt"}const o=URL.createObjectURL(t),l=document.createElement("a");l.href=o,l.download=n,document.body.appendChild(l),l.click(),l.remove(),setTimeout(()=>URL.revokeObjectURL(o),0)});let b=null;if(k.addEventListener("change",async()=>{N.textContent="",b=null;const e=k.files&&k.files[0];e&&(b=new Uint8Array(await e.arrayBuffer()),N.textContent=e.name+" - "+b.length+" bytes")}),G.addEventListener("click",()=>{if(!b){L.value="Select a file first.";return}let e=I(b,T.checked);L.value=e.slice(0,2e3)}),J.addEventListener("click",()=>{if(!b){L.value="Select a file first.";return}let e=I(b,T.checked);X.checked&&(T.checked?e=e.replace(/\n/g,`\r
`):e=e.replace(/\u0085/g,`\r
`));const t=new Blob([e],{type:"text/plain;charset=us-ascii"}),n=URL.createObjectURL(t),o=document.createElement("a");o.href=n,o.download="converted-cp037.txt",document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(n),0)}),!E){const e=document.createElement("div");e.className="small",e.style.color="var(--color-error, #c0392b)",e.textContent="Limited mode: This browser lacks TextDecoder; built-in CP037 still works; other decoders unavailable.",V.appendChild(e)}typeof window.setupCopyButtons=="function"&&window.setupCopyButtons(),$.addEventListener("click",()=>{const e=C.value;C.value=x.value,x.value=e}),q.addEventListener("click",()=>{C.value="",x.value="",r&&(r.value="",r._cachedBytes=null),F.textContent="",v.innerHTML="",p.innerHTML=""})}function pe(a,E){O(),xe(a),de(a)}export{pe as load,xe as loadCharsetConverterTool,de as setupCharsetConverterTool};
