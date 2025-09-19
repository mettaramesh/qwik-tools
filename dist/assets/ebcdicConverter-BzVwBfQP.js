function R(){if(!document.getElementById("ebcdic-converter-css-link")){const c=document.createElement("link");c.id="ebcdic-converter-css-link",c.rel="stylesheet",c.type="text/css",c.href="/ebcdicConverter.css",document.head&&document.head.appendChild(c)}}R();function _(c){c.innerHTML=`
    <div class="ebcdic-converter-redesign">
      <!-- Header -->
      <div class="ebcdic-header">
        <div>
          <h2>EBCDIC CP037 ↔ ASCII/Unicode Converter</h2>
          <p>Direct conversion between EBCDIC CP037 and ASCII/Unicode using built-in translation tables. Independent of browser TextDecoder/TextEncoder.</p>
        </div>
        <div class="chip">IBM CP037</div>
      </div>

      <!-- Main Conversion Section -->
      <section class="card">
        <div class="conversion-grid">
          <!-- INPUT PANEL -->
          <div class="panel" aria-label="Input panel">
            <div class="panel-title">
              <h3>Input</h3>
              <small id="inputModeDisplay">EBCDIC File or <strong>Text</strong></small>
            </div>

            <!-- Mode Toggle -->
            <div class="controls">
              <div class="mode-toggle">
                <label class="checkbox-label">
                  <input type="radio" name="inputMode" value="file" id="inputModeFile" checked> EBCDIC File
                </label>
                <label class="checkbox-label">
                  <input type="radio" name="inputMode" value="text" id="inputModeText"> ASCII/Unicode Text
                </label>
              </div>
            </div>

            <!-- File Input Area -->
            <div id="fileInputArea" class="file-upload-area">
              <input type="file" id="ebcdicFileInput" class="file-input" accept=".ebc,.ebcdic,.txt,.*" />
              <div class="upload-prompt">
                <p><strong>Select EBCDIC file</strong></p>
                <p>Choose a file with EBCDIC CP037 encoded data</p>
              </div>
              <div id="fileInfo" class="file-info"></div>
            </div>

            <!-- Text Input Area -->
            <div id="textInputArea" class="textarea-container hidden">
              <textarea id="inputText" placeholder="Enter ASCII/Unicode text to convert to EBCDIC..." rows="8"></textarea>
            </div>

            <!-- Processing Options -->
            <div class="controls">
              <label class="checkbox-label">
                <input type="checkbox" id="normalizeNEL" checked> Normalize NEL (U+0085) → LF
              </label>
              <label class="checkbox-label">
                <input type="checkbox" id="useCRLF"> Use CRLF line endings in output
              </label>
            </div>

            <div class="action-row">
              <button class="btn-primary" id="btnConvert">Convert</button>
              <button class="btn-ghost" id="btnClear">Clear</button>
            </div>
            <div class="metrics" id="inputMetrics"></div>
          </div>

          <!-- OUTPUT PANEL -->
          <div class="panel" aria-label="Output panel">
            <div class="panel-title">
              <h3>Output</h3>
              <small id="outputModeDisplay">Converted <strong>Text</strong></small>
            </div>

            <div class="controls">
              <div class="mode-toggle">
                <label class="checkbox-label">
                  <input type="radio" name="outputMode" value="text" id="outputModeText" checked> Show as Text
                </label>
                <label class="checkbox-label">
                  <input type="radio" name="outputMode" value="hex" id="outputModeHex"> Show as Hex
                </label>
              </div>
            </div>

            <div class="textarea-container">
              <textarea id="outputText" readonly rows="8" placeholder="Converted output will appear here..."></textarea>
            </div>

            <div class="action-row">
              <button class="btn-ghost" id="btnCopy">Copy Text</button>
              <button class="btn-ghost" id="btnDownloadText">Download as UTF-8</button>
              <button class="btn-ghost" id="btnDownloadEbcdic">Download as EBCDIC</button>
            </div>
            <div class="metrics" id="outputMetrics"></div>
          </div>
        </div>
      </section>

      <!-- Conversion Information -->
      <section class="card notes">
        <div class="note-content">
          <h4>EBCDIC CP037 Conversion Details</h4>
          <ul>
            <li><strong>Character Set:</strong> IBM Code Page 037 (EBCDIC US/Canada)</li>
            <li><strong>Coverage:</strong> Full ASCII (0x00-0x7F) mapping with built-in translation tables</li>
            <li><strong>NEL Handling:</strong> EBCDIC Next Line (0x85) can be normalized to Line Feed (0x0A)</li>
            <li><strong>Fallback:</strong> Non-ASCII characters in Unicode → ASCII text are replaced with '?' (0x6F in EBCDIC)</li>
            <li><strong>Independence:</strong> Uses built-in mapping tables, no browser TextDecoder dependency</li>
            <li><strong>File Support:</strong> Direct binary file processing for EBCDIC data</li>
          </ul>
        </div>
      </section>
    </div>
  `;const h=Uint16Array.from([0,1,2,3,156,9,134,127,151,141,142,11,12,13,14,15,16,17,18,19,157,133,8,135,24,25,146,143,28,29,30,31,128,129,130,131,132,10,23,27,136,137,138,139,140,5,6,7,144,145,22,147,148,149,150,4,152,153,154,155,20,21,158,26,32,160,226,228,224,225,227,229,231,241,162,46,60,40,43,124,38,233,234,235,232,237,238,239,236,223,33,36,42,41,59,172,45,47,194,196,192,193,195,197,199,209,166,44,37,95,62,63,248,201,202,203,200,205,206,207,204,96,58,35,64,39,61,34,216,97,98,99,100,101,102,103,104,105,171,187,240,253,254,177,176,106,107,108,109,110,111,112,113,114,170,186,230,184,198,164,181,126,115,116,117,118,119,120,121,122,161,191,208,221,222,174,94,163,165,183,169,167,182,188,189,190,91,93,175,168,180,215,123,65,66,67,68,69,70,71,72,73,173,244,246,242,243,245,125,74,75,76,77,78,79,80,81,82,185,251,252,249,250,255,92,247,83,84,85,86,87,88,89,90,178,212,214,210,211,213,48,49,50,51,52,53,54,55,56,57,179,219,220,217,218,159]),O=(()=>{const e=new Uint16Array(128);for(let t=0;t<128;t++)e[t]=111;for(let t=0;t<256;t++){const n=h[t];n<128&&(e[n]=t)}return e})(),o=e=>c.querySelector("#"+e),g=o("inputModeFile"),B=o("inputModeText"),y=o("fileInputArea"),k=o("textInputArea"),d=o("ebcdicFileInput"),u=o("inputText"),C=o("fileInfo"),w=o("outputModeText"),p=o("outputModeHex"),l=o("outputText"),E=o("normalizeNEL"),m=o("useCRLF"),b=o("btnConvert"),T=o("btnClear"),L=o("btnCopy"),M=o("btnDownloadText"),U=o("btnDownloadEbcdic"),D=o("inputMetrics"),a=o("outputMetrics"),S=o("inputModeDisplay"),P=o("outputModeDisplay");let r=null,x=null,v=!0;function j(e,t=!1){let n="";for(let i=0;i<e.length;i++){let f=h[e[i]];t&&f===133&&(f=10),n+=String.fromCharCode(f)}return n}function $(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++){const i=e.charCodeAt(n)&65535;i<128?t[n]=O[i]:t[n]=111}return t}function z(e){const t=new Array(e.length);for(let n=0;n<e.length;n++)t[n]=e[n].toString(16).padStart(2,"0").toUpperCase();return t.join(" ")}function s(e,{textLen:t=null,byteLen:n=null,status:i=null}){if(!e)return;e.innerHTML="",t!=null||n!=null||i!=null?(e.classList.add("show"),t!=null&&F(e,`Characters: ${t}`),n!=null&&F(e,`Bytes: ${n}`),i&&F(e,i.msg,i.ok?"ok":"bad")):e.classList.remove("show")}function F(e,t,n=""){const i=document.createElement("span");i.className="pill "+(n||""),i.textContent=t,e.appendChild(i)}function I(){const e=g.checked;e?(y.classList.remove("hidden"),k.classList.add("hidden")):(y.classList.add("hidden"),k.classList.remove("hidden")),v=e,S&&(S.innerHTML=e?"EBCDIC File → <strong>Text</strong>":"ASCII/Unicode Text → <strong>EBCDIC</strong>"),b&&(b.textContent=e?"Convert to Text":"Convert to EBCDIC"),N()}function A(){P&&(P.innerHTML=p.checked?"Show as <strong>Hex</strong>":"Show as <strong>Text</strong>"),H()}function N(){r=null,x=null,u&&(u.value=""),l&&(l.value=""),C&&(C.textContent=""),d&&(d.value=""),s(D,{}),s(a,{})}function H(){x&&(p.checked&&x.bytes?l.value=z(x.bytes):x.text&&(l.value=x.text))}d&&d.addEventListener("change",async()=>{C.textContent="",r=null;const e=d.files&&d.files[0];if(e)try{const t=new Uint8Array(await e.arrayBuffer());r={bytes:t,filename:e.name},C.textContent=`${e.name} - ${t.length} bytes`,s(D,{byteLen:t.length,status:{ok:!0,msg:"EBCDIC file loaded"}})}catch(t){s(D,{status:{ok:!1,msg:"File read error: "+t.message}})}}),b&&b.addEventListener("click",()=>{try{if(v){if(!(r!=null&&r.bytes)){s(a,{status:{ok:!1,msg:"Please select an EBCDIC file first"}});return}const e=(E==null?void 0:E.checked)||!1;let t=j(r.bytes,e);m!=null&&m.checked&&(e?t=t.replace(/\n/g,`\r
`):t=t.replace(/\u0085/g,`\r
`)),x={text:t,bytes:new TextEncoder().encode(t)},s(a,{textLen:t.length,byteLen:x.bytes.length,status:{ok:!0,msg:"EBCDIC → Text conversion complete"}})}else{const e=(u==null?void 0:u.value)||"";if(!e){s(a,{status:{ok:!1,msg:"Please enter text to convert"}});return}const t=$(e);x={text:e,bytes:t},s(a,{textLen:e.length,byteLen:t.length,status:{ok:!0,msg:"Text → EBCDIC conversion complete"}})}H()}catch(e){s(a,{status:{ok:!1,msg:"Conversion error: "+e.message}})}}),L&&L.addEventListener("click",async()=>{try{navigator.clipboard&&window.isSecureContext&&(l!=null&&l.value)?(await navigator.clipboard.writeText(l.value),s(a,{status:{ok:!0,msg:"Copied to clipboard"}})):(l==null||l.select(),document.execCommand("copy"),s(a,{status:{ok:!0,msg:"Copied to clipboard"}}))}catch(e){s(a,{status:{ok:!1,msg:"Copy failed: "+e.message}})}}),M&&M.addEventListener("click",()=>{var i;if(!(x!=null&&x.text)){s(a,{status:{ok:!1,msg:"Nothing to download. Convert first."}});return}const e=new Blob([x.text],{type:"text/plain;charset=utf-8"}),t=URL.createObjectURL(e),n=document.createElement("a");n.href=t,n.download=v?(((i=r==null?void 0:r.filename)==null?void 0:i.replace(/\.[^.]*$/,""))||"converted")+".txt":"converted-text.txt",document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(t),0)}),U&&U.addEventListener("click",()=>{if(!(x!=null&&x.bytes)){s(a,{status:{ok:!1,msg:"Nothing to download. Convert first."}});return}const e=new Blob([x.bytes],{type:"application/octet-stream"}),t=URL.createObjectURL(e),n=document.createElement("a");n.href=t,n.download=v?"converted-utf8.txt":"converted-ebcdic.ebc",document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(t),0)}),T&&T.addEventListener("click",N),g&&g.addEventListener("change",I),B&&B.addEventListener("change",I),w&&w.addEventListener("change",A),p&&p.addEventListener("change",A),I(),A()}function q(c,h){R(),_(c)}export{q as load,_ as loadEbcdicConverterTool};
