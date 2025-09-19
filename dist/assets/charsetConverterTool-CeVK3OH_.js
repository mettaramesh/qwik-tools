function Z(){if(!document.getElementById("charsetconverter-css-link")){const u=document.createElement("link");u.id="charsetconverter-css-link",u.rel="stylesheet",u.type="text/css",u.href="/charsetConverterTool.css",document.head&&document.head.appendChild(u)}}Z();function le(u){u.innerHTML=`
    <div class="charset-converter-redesign">
      <!-- Header -->
      <div class="ec-header">
        <div>
          <h2>Encodings Converter</h2>
          <p>Decode bytes with legacy encodings, export as Text, Base64, Hex, URL-encoded or download bytes in UTF-8/UTF-16/EBCDIC.</p>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="main-content-grid">
        <!-- Main Input/Output Section -->
        <section class="card main-section">
          <div class="io-grid">
            <!-- INPUT PANEL -->
            <div class="panel" aria-label="Input panel">
              <div class="panel-title">
                <h3>Input</h3>
                <label class="select-row-small">Interpret as
                  <select id="inputMode" aria-label="input-format-select">
                    <option value="text">Text</option>
                    <option value="base64">Base64</option>
                    <option value="hex">Hex</option>
                    <option value="url">URL-encoded</option>
                    <option value="file">File</option>
                  </select>
                </label>
              </div>

              <div class="controls">
                <label class="select-row">Decode bytes with
                  <select id="byteDecode" aria-label="encoding-select"></select>
                </label>

                <label class="checkbox-label">
                  <input type="checkbox" id="normalizeNEL" checked /> Normalize NEL (U+0085) → LF
                </label>

                <div class="muted-note ml-auto">Tip: When using Base64/Hex as input, choose the correct decode bytes with encoding.</div>
              </div>

              <div id="fileBox" class="file-input">
                <label for="fileInput" style="cursor: pointer; font-weight: 500; color: var(--blue);">
                  📁 Choose file to upload
                </label>
                <input type="file" id="fileInput" />
                <span id="fileInfo" class="file-info">Select a file to decode its bytes with the chosen encoding</span>
              </div>

              <div class="textarea-container">
                <textarea id="inputArea" rows="10" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" placeholder="Paste your text / Base64 / Hex / URL-encoded here..."></textarea>
              </div>

              <div class="action-row">
                <button class="btn btn--primary" id="btnConvert">Convert ✨</button>
                <button class="btn btn--outline" id="btnSwap">Swap panels</button>
                <button class="btn btn--outline" id="btnClear">Clear</button>
              </div>
              <div class="metrics" id="inMetrics"></div>
            </div>

            <!-- OUTPUT PANEL -->
            <div class="panel" aria-label="Output panel">
              <div class="panel-title">
                <h3>Output</h3>
                <small id="outputModeDisplay">Export as <strong>Text</strong></small>
              </div>

              <div class="controls">
                <label class="select-row">Format
                  <select id="outputAs" aria-label="output-format-select"></select>
                </label>

                <label class="select-row">Encode string as
                  <select id="encodeWith" aria-label="output-encoding-select"></select>
                </label>

                <label class="checkbox-label">
                  <input type="checkbox" id="addBOM"> Add BOM
                </label>
              </div>

              <div class="textarea-container">
                <textarea id="outputArea" rows="10" readonly placeholder="Converted output will appear here..."></textarea>
              </div>

              <div class="action-row">
                <button class="btn btn--outline" id="btnCopy">Copy</button>
                <button class="btn btn--outline" id="btnDownload">Download</button>
              </div>
              <div class="metrics" id="outMetrics"></div>
            </div>
          </div>
        </section>

        <!-- Notes Section - Right Side -->
        <aside class="card notes-sidebar">
          <div class="note-content">
            <h4>Notes & Compatibility</h4>
            <ul>
              <li><strong>TextDecoder Support:</strong> Most modern browsers support a wide range of legacy encodings</li>
              <li><strong>File Processing:</strong> Handles binary files directly in the browser</li>
              <li><strong>Export Formats:</strong> Text, Base64, Hex, URL-encoded, and binary downloads</li>
            </ul>
          </div>
          
          <!-- Browser Support Panel -->
          <div class="browser-support-panel">
            <h4>Browser Support</h4>
            <p><code>TextDecoder</code> decodes many legacy encodings; EBCDIC CP037 is implemented here via a built-in table. <code>TextEncoder</code> officially encodes UTF-8 only; UTF-16 here is manual.</p>
          </div>
        </aside>
      </div>
    </div>
  `;const D=typeof window.TextDecoder=="function",q=typeof window.TextEncoder=="function",I=Uint16Array.from([0,1,2,3,156,9,134,127,151,141,142,11,12,13,14,15,16,17,18,19,157,133,8,135,24,25,146,143,28,29,30,31,128,129,130,131,132,10,23,27,136,137,138,139,140,5,6,7,144,145,22,147,148,149,150,4,152,153,154,155,20,21,158,26,32,160,226,228,224,225,227,229,231,241,162,46,60,40,43,124,38,233,234,235,232,237,238,239,236,223,33,36,42,41,59,172,45,47,194,196,192,193,195,197,199,209,166,44,37,95,62,63,248,201,202,203,200,205,206,207,204,96,58,35,64,39,61,34,216,97,98,99,100,101,102,103,104,105,171,187,240,253,254,177,176,106,107,108,109,110,111,112,113,114,170,186,230,184,198,164,181,126,115,116,117,118,119,120,121,122,161,191,208,221,222,174,94,163,165,183,169,167,182,188,189,190,91,93,175,168,180,215,123,65,66,67,68,69,70,71,72,73,173,244,246,242,243,245,125,74,75,76,77,78,79,80,81,82,185,251,252,249,250,255,92,247,83,84,85,86,87,88,89,90,178,212,214,210,211,213,48,49,50,51,52,53,54,55,56,57,179,219,220,217,218,159]),G=(()=>{const e=new Uint16Array(128);for(let t=0;t<128;t++)e[t]=111;for(let t=0;t<256;t++){const n=I[t];n<128&&(e[n]=t)}return e})(),s=e=>u.querySelector("#"+e),A=s("inputMode"),v=s("byteDecode"),T=s("normalizeNEL"),S=s("fileBox"),r=s("fileInput"),m=s("fileInfo"),f=s("inputArea"),a=s("outputArea"),x=s("outputAs"),H=s("outputModeDisplay"),d=s("encodeWith"),w=s("addBOM"),N=s("btnConvert"),R=s("btnSwap"),P=s("btnClear"),O=s("btnCopy"),_=s("btnDownload"),g=s("inMetrics"),p=s("outMetrics"),j=s("compat");let F="text";function k(){if(H){const e={text:"Text",base64:"Base64",hex:"Hex",url:"URL-encoded",download:"Download"};H.innerHTML=`Export as <strong>${e[x==null?void 0:x.value]||"Text"}</strong>`}}function z(){k()}x&&(x.innerHTML=`
      <option value="text">Text</option>
      <option value="base64">Base64</option>
      <option value="hex">Hex</option>
      <option value="url">URL-encoded</option>
      <option value="download">Download bytes</option>`,x.addEventListener("change",k),k()),d&&(d.innerHTML=`
      <option value="utf-8">UTF-8</option>
      <option value="utf-16le">UTF-16LE</option>
      <option value="utf-16be">UTF-16BE</option>
      <option value="ibm-037">EBCDIC (IBM 037)</option>`);const K=["utf-8","utf-16le","utf-16be","windows-1252","iso-8859-1","iso-8859-2","iso-8859-15","macintosh","koi8-r","koi8-u","windows-1251","windows-1250","windows-1254","windows-1255","windows-1256","windows-1257","windows-1258","shift_jis","euc-jp","iso-2022-jp","gbk","gb18030","big5","euc-kr","iso-2022-kr","iso-2022-cn"];function V(){const e=["ibm-037"];if(D)for(const t of K)try{new TextDecoder(t),e.push(t)}catch{}return e}if(v){v.innerHTML="";for(const e of V()){const t=document.createElement("option");t.value=e,t.textContent=e==="ibm-037"?"EBCDIC (IBM 037)":e,v.appendChild(t)}v.value="ibm-037"}if(d&&w&&(d.addEventListener("change",()=>{d.value==="ibm-037"?(w.checked=!1,w.disabled=!0):w.disabled=!1}),d.dispatchEvent(new Event("change"))),A){let e=function(){F=A.value,S&&(S.style.display=F==="file"?"":"none"),f&&(f.style.display=F==="file"?"none":"")};A.addEventListener("change",e),e()}function W(e){if(!q)throw new Error("TextEncoder not supported.");return new TextEncoder().encode(e)}function $(e,t=!0){const n=new ArrayBuffer(e.length*2),o=new DataView(n);for(let i=0;i<e.length;i++)o.setUint16(i*2,e.charCodeAt(i),t);return new Uint8Array(n)}function E(e,t){if(t==="utf-8")return W(e);if(t==="utf-16le")return $(e,!0);if(t==="utf-16be")return $(e,!1);if(t==="ibm-037")return ie(e);throw new Error("Unsupported output encoding.")}function J(e,t){if(t==="ibm-037")return oe(e,(T==null?void 0:T.checked)||!1);if(!D)throw new Error("TextDecoder not supported.");return new TextDecoder(t,{fatal:!1}).decode(e)}function Q(e){const t=e.replace(/[\r\n\s]+/g,"").replace(/-/g,"+").replace(/_/g,"/");if(t&&!/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(t))throw new Error("Invalid Base64 input.");const n=t?atob(t):"",o=new Uint8Array(n.length);for(let i=0;i<n.length;i++)o[i]=n.charCodeAt(i);return o}function X(e){let n="";for(let o=0;o<e.length;o+=32768)n+=String.fromCharCode.apply(null,e.subarray(o,o+32768));return btoa(n)}function Y(e){let t=e.replace(/[\s,;:_-]/g,"").toLowerCase();if(t.startsWith("0x")&&(t=t.slice(2)),t.length===0)return new Uint8Array;if(t.length%2!==0)throw new Error("Hex length must be even.");const n=new Uint8Array(t.length/2);for(let o=0;o<t.length;o+=2){const i=parseInt(t.slice(o,o+2),16);if(Number.isNaN(i))throw new Error("Invalid hex at position "+o);n[o/2]=i}return n}function ee(e){const t=new Array(e.length);for(let n=0;n<e.length;n++)t[n]=e[n].toString(16).padStart(2,"0");return t.join("")}const te=e=>decodeURIComponent(e.replace(/\+/g,"%20")),ne=e=>encodeURIComponent(e).replace(/%20/g,"+");function c(e,{textLen:t=null,byteLen:n=null,status:o=null}){e&&(e.innerHTML="",t!=null&&U(e,`Chars: ${t}`),n!=null&&U(e,`Bytes: ${n}`),o&&U(e,o.msg,o.ok?"ok":"bad"))}function U(e,t,n=""){const o=document.createElement("span");o.className="pill "+(n||""),o.textContent=t,e.appendChild(o)}function oe(e,t){let n="";for(let o=0;o<e.length;o++){let i=I[e[o]];t&&i===133&&(i=10),n+=String.fromCharCode(i)}return n}function ie(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++){const o=e.charCodeAt(n)&65535;o<128?t[n]=G[o]:t[n]=111}return t}let B=null,h="";N&&N.addEventListener("click",()=>{try{c(p,{status:{ok:!0,msg:"Converting…"}});const e=F,t=(f==null?void 0:f.value)||"";let n="";if(e==="text")n=t,c(g,{textLen:n.length,status:{ok:!0,msg:"Interpreted as Unicode text"}});else if(e==="url")n=te(t),c(g,{textLen:n.length,status:{ok:!0,msg:"URL-decoded → text"}});else if(e==="base64"||e==="hex"||e==="file"){let l;if(e==="base64")l=Q(t),c(g,{byteLen:l.length,status:{ok:!0,msg:"Base64 → bytes"}});else if(e==="hex")l=Y(t),c(g,{byteLen:l.length,status:{ok:!0,msg:"Hex → bytes"}});else{if(!((r==null?void 0:r.files)&&r.files[0])||!r._cachedBytes)throw new Error("Select a file.");l=r._cachedBytes,c(g,{byteLen:l.length,status:{ok:!0,msg:"File bytes loaded"}})}n=J(l,(v==null?void 0:v.value)||"ibm-037")}else throw new Error("Unknown input mode.");h=n;const o=(x==null?void 0:x.value)||"text",i=(d==null?void 0:d.value)||"utf-8",b=(w==null?void 0:w.checked)||!1;let C="",y=null;if(o==="text")C=h,y=E(h,i);else if(o==="url")C=ne(h),y=E(h,i);else if(o==="base64"){let l=E(h,i);b&&i!=="ibm-037"&&(l=L(l,i)),C=X(l),y=l}else if(o==="hex"){let l=E(h,i);b&&i!=="ibm-037"&&(l=L(l,i)),C=ee(l),y=l}else if(o==="download"){let l=E(h,i);b&&i!=="ibm-037"&&(l=L(l,i)),C="Ready to download ("+l.length+" bytes).",y=l}else throw new Error("Unknown output type.");a&&(a.value=C),B=y,c(p,{textLen:o==="text"||o==="url"?C.length:null,byteLen:B?B.length:null,status:{ok:!0,msg:"Output: "+o+" ("+i+(b&&i!=="ibm-037"?"+BOM":"")+")"}}),z()}catch(e){console.error(e),c(p,{status:{ok:!1,msg:e.message}})}});function L(e,t){return t==="utf-8"?M(new Uint8Array([239,187,191]),e):t==="utf-16le"?M(new Uint8Array([255,254]),e):t==="utf-16be"?M(new Uint8Array([254,255]),e):e}const M=(e,t)=>{const n=new Uint8Array(e.length+t.length);return n.set(e,0),n.set(t,e.length),n};if(r&&r.addEventListener("change",async()=>{m&&(m.textContent=""),r._cachedBytes=null;const e=r.files&&r.files[0];if(!e)return;const t=new Uint8Array(await e.arrayBuffer());r._cachedBytes=t,m&&(m.textContent=e.name+" - "+t.length+" bytes")}),O&&O.addEventListener("click",async()=>{try{navigator.clipboard&&window.isSecureContext&&a?await navigator.clipboard.writeText(a.value):a&&(a.removeAttribute("readonly"),a.select(),document.execCommand("copy"),a.setAttribute("readonly","true")),c(p,{status:{ok:!0,msg:"Copied to clipboard"}})}catch{c(p,{status:{ok:!1,msg:"Clipboard copy failed"}})}}),_&&_.addEventListener("click",()=>{const e=(x==null?void 0:x.value)||"text";let t,n;if(e==="download"){if(!B){c(p,{status:{ok:!1,msg:"Nothing to download. Convert first."}});return}const b=(d==null?void 0:d.value)||"utf-8";t=new Blob([B],{type:"application/octet-stream"}),n="converted-"+b+".bin"}else{const b=(a==null?void 0:a.value)??"";if(!b.trim()){c(p,{status:{ok:!1,msg:"No content to download. Convert something first."}});return}t=new Blob([b],{type:"text/plain;charset=utf-8"}),n="converted-"+e+".txt"}const o=URL.createObjectURL(t),i=document.createElement("a");i.href=o,i.download=n,document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(o),0),c(p,{status:{ok:!0,msg:"File downloaded successfully!"}})}),!D&&j){const e=document.createElement("div");e.className="compat-warning",e.textContent="Limited mode: This browser lacks TextDecoder; built-in CP037 still works; other decoders unavailable.",j.appendChild(e)}R&&f&&a&&R.addEventListener("click",()=>{const e=f.value;f.value=a.value,a.value=e}),P&&P.addEventListener("click",()=>{f&&(f.value=""),a&&(a.value=""),r&&(r.value="",r._cachedBytes=null),m&&(m.textContent=""),g&&(g.innerHTML=""),p&&(p.innerHTML="")}),z()}function ae(u,D){Z(),le(u)}export{ae as load,le as loadCharsetConverterTool};
