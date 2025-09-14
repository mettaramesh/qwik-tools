// Charset Converter Tool + ASCII↔EBCDIC (IBM 037) + NEL toggle + Quick Panel
// Browser-native, no polyfills. Keeps your UI/style tokens intact.

export function loadCharsetConverterTool(container) {
  container.innerHTML = `
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
        <div class="row small" style="margin-top:8px">
          <label><input type="checkbox" id="normalizeNEL" checked> Normalize NEL (U+0085) → LF</label>
        </div>

        <div id="fileBox" class="file row" style="display:none">
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
            <label style="margin-left:10px;"><input type="checkbox" id="addBOM"> Add BOM</label>
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
    <div class="card card--quick-ebc" style="margin-top:24px;">
      <h3 style="margin-bottom:10px;">Quick Convert: <span class="hl">EBCDIC (CP037)</span> file <span style="font-weight:400">→</span> ASCII</h3>
      <div class="row" style="margin-bottom:10px;align-items:flex-end;">
        <div style="flex:1;min-width:180px;">
          <label class="form-label" for="ebcFileInput">Select EBCDIC file</label>
          <input type="file" id="ebcFileInput" class="form-control" style="width:100%;" />
        </div>
        <span id="ebcFileInfo" class="small" style="margin-left:12px;"></span>
      </div>
      <div class="row small" style="margin-bottom:10px;">
        <label><input type="checkbox" id="ebcNormalizeNEL" checked> Normalize NEL (U+0085) → LF</label>
        <label style="margin-left:18px;"><input type="checkbox" id="ebcCRLF"> Use CRLF line endings in download</label>
      </div>
      <div class="row" style="margin-bottom:10px;">
        <button class="btn btn--primary" id="btnEbcPreview">Preview</button>
        <button class="btn btn--outline" id="btnEbcDownload">Download ASCII .txt</button>
      </div>
      <textarea id="ebcPreview" rows="8" readonly placeholder="Preview (first 2,000 chars)…" style="margin-top:8px;min-height:120px;background:var(--color-background,#f9f9f9);border:1.5px solid var(--color-border,#e0e0e0);color:var(--color-text,#13343b);padding:10px 12px;border-radius:8px;font-size:1.05em;width:100%;resize:vertical;"></textarea>
      <div class="footer small" style="margin-top:8px;">This panel ignores other encoders/decoders and always treats input as CP037 bytes → ASCII/Unicode text.</div>
    </div>

    <div class="card" style="margin-top:16px">
      <h3>Notes</h3>
      <ul class="small">
        <li><strong>CP037</strong> is U.S./Canada EBCDIC; other locales use different pages (e.g., 1140 adds the euro symbol).</li>
        <li><strong>NEL</strong> is an EBCDIC newline; many web tools don’t treat <code>U+0085</code> as a line break. Toggle normalization as needed.</li>
      </ul>
    </div>
  `;
}

export function setupCharsetConverterTool(container) {
  const hasTextDecoder = typeof window.TextDecoder === 'function';
  const hasTextEncoder = typeof window.TextEncoder === 'function';

  // ----- CP037 mapping tables -----
  const CP037_E2U = Uint16Array.from([
    0x00,0x01,0x02,0x03,0x9C,0x09,0x86,0x7F,0x97,0x8D,0x8E,0x0B,0x0C,0x0D,0x0E,0x0F,
    0x10,0x11,0x12,0x13,0x9D,0x85,0x08,0x87,0x18,0x19,0x92,0x8F,0x1C,0x1D,0x1E,0x1F,
    0x80,0x81,0x82,0x83,0x84,0x0A,0x17,0x1B,0x88,0x89,0x8A,0x8B,0x8C,0x05,0x06,0x07,
    0x90,0x91,0x16,0x93,0x94,0x95,0x96,0x04,0x98,0x99,0x9A,0x9B,0x14,0x15,0x9E,0x1A,
    0x20,0xA0,0xE2,0xE4,0xE0,0xE1,0xE3,0xE5,0xE7,0xF1,0xA2,0x2E,0x3C,0x28,0x2B,0x7C,
    0x26,0xE9,0xEA,0xEB,0xE8,0xED,0xEE,0xEF,0xEC,0xDF,0x21,0x24,0x2A,0x29,0x3B,0xAC,
    0x2D,0x2F,0xC2,0xC4,0xC0,0xC1,0xC3,0xC5,0xC7,0xD1,0xA6,0x2C,0x25,0x5F,0x3E,0x3F,
    0xF8,0xC9,0xCA,0xCB,0xC8,0xCD,0xCE,0xCF,0xCC,0x60,0x3A,0x23,0x40,0x27,0x3D,0x22,
    0xD8,0x61,0x62,0x63,0x64,0x65,0x66,0x67,0x68,0x69,0xAB,0xBB,0xF0,0xFD,0xFE,0xB1,
    0xB0,0x6A,0x6B,0x6C,0x6D,0x6E,0x6F,0x70,0x71,0x72,0xAA,0xBA,0xE6,0xB8,0xC6,0xA4,
    0xB5,0x7E,0x73,0x74,0x75,0x76,0x77,0x78,0x79,0x7A,0xA1,0xBF,0xD0,0xDD,0xDE,0xAE,
    0x5E,0xA3,0xA5,0xB7,0xA9,0xA7,0xB6,0xBC,0xBD,0xBE,0x5B,0x5D,0xAF,0xA8,0xB4,0xD7,
    0x7B,0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48,0x49,0xAD,0xF4,0xF6,0xF2,0xF3,0xF5,
    0x7D,0x4A,0x4B,0x4C,0x4D,0x4E,0x4F,0x50,0x51,0x52,0xB9,0xFB,0xFC,0xF9,0xFA,0xFF,
    0x5C,0xF7,0x53,0x54,0x55,0x56,0x57,0x58,0x59,0x5A,0xB2,0xD4,0xD6,0xD2,0xD3,0xD5,
    0x30,0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0xB3,0xDB,0xDC,0xD9,0xDA,0x9F
  ]);

  // ASCII (0x00..0x7F) -> CP037 byte (unknown → 0x6F '?')
  const CP037_U2E_ASCII = (() => {
    const m = new Uint16Array(128); for (let i=0;i<128;i++) m[i]=0x6F;
    for (let eb=0; eb<256; eb++) { const u=CP037_E2U[eb]; if (u<128) m[u]=eb; }
    return m;
  })();

  // DOM (scoped to container)
  const el = id => container.querySelector('#'+id);
  const inputMode   = /** @type {HTMLSelectElement} */(el('inputMode'));
  const byteDecode  = /** @type {HTMLSelectElement} */(el('byteDecode'));
  const normalizeNEL = /** @type {HTMLInputElement} */(el('normalizeNEL'));
  const fileBox     = el('fileBox');
  const fileInput   = /** @type {HTMLInputElement} */(el('fileInput'));
  const fileInfo    = el('fileInfo');
  const inputArea   = /** @type {HTMLTextAreaElement} */(el('inputArea'));
  const outputArea  = /** @type {HTMLTextAreaElement} */(el('outputArea'));
  const outputAs    = /** @type {HTMLSelectElement} */(el('outputAs'));
  const encodeWith  = /** @type {HTMLSelectElement} */(el('encodeWith'));
  const addBOM      = /** @type {HTMLInputElement} */(el('addBOM'));
  const btnConvert  = el('btnConvert');
  const btnSwap     = el('btnSwap');
  const btnClear    = el('btnClear');
  const btnCopy     = el('btnCopy');
  const btnDownload = el('btnDownload');
  const inMetrics   = el('inMetrics');
  const outMetrics  = el('outMetrics');
  const compatBox   = el('compat');

  // Quick panel DOM
  const ebcFileInput = /** @type {HTMLInputElement} */(el('ebcFileInput'));
  const ebcFileInfo  = el('ebcFileInfo');
  const btnEbcPreview = el('btnEbcPreview');
  const btnEbcDownload = el('btnEbcDownload');
  const ebcPreview   = /** @type {HTMLTextAreaElement} */(el('ebcPreview'));
  const ebcNormalize = /** @type {HTMLInputElement} */(el('ebcNormalizeNEL'));
  const ebcCRLF      = /** @type {HTMLInputElement} */(el('ebcCRLF'));

  // Populate selects
  inputMode.innerHTML = `
    <option value="text">Text</option>
    <option value="base64">Base64 (bytes)</option>
    <option value="hex">Hex (bytes)</option>
    <option value="url">URL-encoded</option>
    <option value="file">File (bytes)</option>`;
  outputAs.innerHTML = `
    <option value="text">Text</option>
    <option value="base64">Base64</option>
    <option value="hex">Hex</option>
    <option value="url">URL-encoded</option>
    <option value="download">Download bytes</option>`;
  encodeWith.innerHTML = `
    <option value="utf-8">UTF-8</option>
    <option value="utf-16le">UTF-16LE</option>
    <option value="utf-16be">UTF-16BE</option>
    <option value="ibm-037">EBCDIC (IBM 037)</option>`;

  // Supported decoders (TextDecoder) + custom CP037
  const candidateDecoders = [
    "utf-8","utf-16le","utf-16be",
    "windows-1252","iso-8859-1","iso-8859-2","iso-8859-15",
    "macintosh","koi8-r","koi8-u",
    "windows-1251","windows-1250","windows-1254","windows-1255","windows-1256","windows-1257","windows-1258",
    "shift_jis","euc-jp","iso-2022-jp","gbk","gb18030","big5","euc-kr","iso-2022-kr","iso-2022-cn"
  ];
  function supportedDecoders() {
    const out = ["ibm-037"];
    if (hasTextDecoder) {
      for (const label of candidateDecoders) { try { new TextDecoder(label); out.push(label); } catch {} }
    }
    return out;
  }
  byteDecode.innerHTML = '';
  for (const label of supportedDecoders()) {
    const opt = document.createElement('option');
    opt.value = label;
    opt.textContent = (label === 'ibm-037' ? 'EBCDIC (IBM 037)' : label);
    byteDecode.appendChild(opt);
  }
  byteDecode.value = 'ibm-037';

  // Disable BOM toggle for EBCDIC output
  encodeWith.addEventListener('change', () => {
    if (encodeWith.value === 'ibm-037') { addBOM.checked = false; addBOM.disabled = true; }
    else { addBOM.disabled = false; }
  });
  encodeWith.dispatchEvent(new Event('change'));

  // Mode switching
  inputMode.addEventListener('change', onModeChange);
  function onModeChange() {
    const mode = inputMode.value;
    fileBox.style.display = (mode === 'file') ? '' : 'none';
    inputArea.style.display = (mode === 'file') ? 'none' : '';
  }
  onModeChange();

  // Helpers
  function utf8Encode(str){
    if (!hasTextEncoder) throw new Error('TextEncoder not supported.');
    return new TextEncoder().encode(str);
  }
  function utf16Encode(str, littleEndian=true){
    const buf = new ArrayBuffer(str.length*2), view=new DataView(buf);
    for (let i=0;i<str.length;i++) view.setUint16(i*2, str.charCodeAt(i), littleEndian);
    return new Uint8Array(buf);
  }
  function encodeString(str, enc){
    if (enc==='utf-8') return utf8Encode(str);
    if (enc==='utf-16le') return utf16Encode(str,true);
    if (enc==='utf-16be') return utf16Encode(str,false);
    if (enc==='ibm-037') return encodeCP037(str);
    throw new Error('Unsupported output encoding.');
  }
  function decodeBytes(bytes, label){
    if (label==='ibm-037') return decodeCP037(bytes, normalizeNEL.checked);
    if (!hasTextDecoder) throw new Error('TextDecoder not supported.');
    return new TextDecoder(label, {fatal:false}).decode(bytes);
  }

  function base64ToBytes(b64){
    const norm=b64.replace(/[\r\n\s]+/g,'').replace(/-/g,'+').replace(/_/g,'/');
    if (norm && !/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(norm)) throw new Error('Invalid Base64 input.');
    const bin = norm ? atob(norm) : '';
    const out = new Uint8Array(bin.length);
    for (let i=0;i<bin.length;i++) out[i]=bin.charCodeAt(i);
    return out;
  }
  function bytesToBase64(bytes){
    const chunk=0x8000; let bin='';
    for (let i=0;i<bytes.length;i+=chunk) bin += String.fromCharCode.apply(null, bytes.subarray(i,i+chunk));
    return btoa(bin);
  }
  function hexToBytes(hex){
    let s=hex.replace(/[\s,;:_-]/g,'').toLowerCase();
    if (s.startsWith('0x')) s=s.slice(2);
    if (s.length===0) return new Uint8Array();
    if (s.length%2!==0) throw new Error('Hex length must be even.');
    const out=new Uint8Array(s.length/2);
    for (let i=0;i<s.length;i+=2){
      const b=parseInt(s.slice(i,i+2),16);
      if (Number.isNaN(b)) throw new Error('Invalid hex at position '+i);
      out[i/2]=b;
    }
    return out;
  }
  function bytesToHex(bytes){
    const hex=new Array(bytes.length);
    for (let i=0;i<bytes.length;i++) hex[i]=bytes[i].toString(16).padStart(2,'0');
    return hex.join('');
  }
  const urlDecodeToText = s => decodeURIComponent(s.replace(/\+/g,'%20'));
  const urlEncodeFromText = s => encodeURIComponent(s).replace(/%20/g,'+');

  function setMetrics(node,{textLen=null,byteLen=null,status=null}){
    node.innerHTML='';
    if (textLen!=null) addPill(node,`Chars: ${textLen}`);
    if (byteLen!=null) addPill(node,`Bytes: ${byteLen}`);
    if (status) addPill(node,status.msg,status.ok?'ok':'bad');
  }
  function addPill(node,text,cls=''){
    const span=document.createElement('span'); span.className='pill '+(cls||''); span.textContent=text; node.appendChild(span);
  }

  // ----- CP037 codecs -----
  function decodeCP037(bytes, normalizeNELFlag){
    let out='';
    for (let i=0;i<bytes.length;i++){
      let u = CP037_E2U[bytes[i]];
      if (normalizeNELFlag && u===0x85) u=0x0A; // NEL→LF
      out += String.fromCharCode(u);
    }
    return out;
  }
  function encodeCP037(str){
    const out=new Uint8Array(str.length);
    for (let i=0;i<str.length;i++){
      const ch=str.charCodeAt(i)&0xFFFF;
      if (ch<128) out[i]=CP037_U2E_ASCII[ch];
      else out[i]=0x6F; // '?' for non-ASCII; extend if you need Latin-1
    }
    return out;
  }

  // ----- Main Convert -----
  let lastBytes=null;
  let middleText='';

  btnConvert.addEventListener('click', () => {
    try {
      setMetrics(outMetrics,{status:{ok:true,msg:'Converting…'}});
      const mode=inputMode.value;
      const srcText=inputArea.value;
      let decoded='';

      if (mode==='text'){
        decoded=srcText;
        setMetrics(inMetrics,{textLen:decoded.length,status:{ok:true,msg:'Interpreted as Unicode text'}});
      } else if (mode==='url'){
        decoded=urlDecodeToText(srcText);
        setMetrics(inMetrics,{textLen:decoded.length,status:{ok:true,msg:'URL-decoded → text'}});
      } else if (mode==='base64' || mode==='hex' || mode==='file'){
        let bytes;
        if (mode==='base64'){
          bytes=base64ToBytes(srcText);
          setMetrics(inMetrics,{byteLen:bytes.length,status:{ok:true,msg:'Base64 → bytes'}});
        } else if (mode==='hex'){
          bytes=hexToBytes(srcText);
          setMetrics(inMetrics,{byteLen:bytes.length,status:{ok:true,msg:'Hex → bytes'}});
        } else {
          const f=fileInput.files && fileInput.files[0];
          if (!f || !fileInput._cachedBytes) throw new Error('Select a file.');
          bytes=fileInput._cachedBytes;
          setMetrics(inMetrics,{byteLen:bytes.length,status:{ok:true,msg:'File bytes loaded'}});
        }
        decoded=decodeBytes(bytes, byteDecode.value);
      } else {
        throw new Error('Unknown input mode.');
      }

      middleText=decoded;

      const outKind=outputAs.value;
      const enc=encodeWith.value;
      const withBOM=addBOM.checked;

      let outStr=''; let outBytes=null;

      if (outKind==='text'){
        outStr=middleText; outBytes=encodeString(middleText,enc);
      } else if (outKind==='url'){
        outStr=urlEncodeFromText(middleText); outBytes=encodeString(middleText,enc);
      } else if (outKind==='base64'){
        let bytes=encodeString(middleText,enc);
        if (withBOM && enc!=='ibm-037') bytes=prependBOM(bytes,enc);
        outStr=bytesToBase64(bytes); outBytes=bytes;
      } else if (outKind==='hex'){
        let bytes=encodeString(middleText,enc);
        if (withBOM && enc!=='ibm-037') bytes=prependBOM(bytes,enc);
        outStr=bytesToHex(bytes); outBytes=bytes;
      } else if (outKind==='download'){
        let bytes=encodeString(middleText,enc);
        if (withBOM && enc!=='ibm-037') bytes=prependBOM(bytes,enc);
        outStr = 'Ready to download (' + bytes.length + ' bytes).'; outBytes = bytes;
      } else {
        throw new Error('Unknown output type.');
      }

      outputArea.value=outStr;
      lastBytes=outBytes;

      setMetrics(outMetrics,{
        textLen:(outKind==='text'||outKind==='url')?outStr.length:null,
        byteLen:lastBytes?lastBytes.length:null,
        status: { ok: true, msg: "Output: " + outKind + " (" + enc + (withBOM && enc !== 'ibm-037' ? "+BOM" : "") + ")" }
      });
    } catch(e){
      console.error(e);
      setMetrics(outMetrics,{status:{ok:false,msg:e.message}});
    }
  });

  function prependBOM(bytes, enc){
    if (enc==='utf-8') return concatBytes(new Uint8Array([0xEF,0xBB,0xBF]), bytes);
    if (enc==='utf-16le') return concatBytes(new Uint8Array([0xFF,0xFE]), bytes);
    if (enc==='utf-16be') return concatBytes(new Uint8Array([0xFE,0xFF]), bytes);
    return bytes;
  }
  const concatBytes=(a,b)=>{const o=new Uint8Array(a.length+b.length); o.set(a,0); o.set(b,a.length); return o;};

  // File handling (general)
  fileInput.addEventListener('change', async () => {
    fileInfo.textContent=''; fileInput._cachedBytes=null;
    const f=fileInput.files && fileInput.files[0]; if (!f) return;
    const arr=new Uint8Array(await f.arrayBuffer());
    fileInput._cachedBytes=arr;
    fileInfo.textContent = f.name + " - " + arr.length + " bytes";
  });

  // Clipboard / download
  btnCopy.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(outputArea.value);
      else { outputArea.removeAttribute('readonly'); outputArea.select(); document.execCommand('copy'); outputArea.setAttribute('readonly','true'); }
      setMetrics(outMetrics,{status:{ok:true,msg:'Copied to clipboard'}});
    } catch {
      setMetrics(outMetrics,{status:{ok:false,msg:'Clipboard copy failed'}});
    }
  });
  btnDownload.addEventListener('click', () => {
    const kind=outputAs.value; let blob,name;
    if (kind==='download'){
      if (!lastBytes){ setMetrics(outMetrics,{status:{ok:false,msg:'Nothing to download. Convert first.'}}); return; }
      const enc=encodeWith.value;
      blob = new Blob([lastBytes], { type: 'application/octet-stream' }); name = "converted-" + enc + ".bin";
    } else {
      const txt=outputArea.value ?? '';
      blob=new Blob([txt],{type:'text/plain;charset=utf-8'}); name="converted-"+kind+".txt";
    }
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),0);
  });

  // ----- QUICK PANEL: CP037 file → ASCII -----
  let ebcBytes=null;
  ebcFileInput.addEventListener('change', async () => {
    ebcFileInfo.textContent=''; ebcBytes=null;
    const f=ebcFileInput.files && ebcFileInput.files[0]; if (!f) return;
    ebcBytes=new Uint8Array(await f.arrayBuffer());
    ebcFileInfo.textContent = f.name + " - " + ebcBytes.length + " bytes";
  });

  btnEbcPreview.addEventListener('click', () => {
    if (!ebcBytes){ ebcPreview.value='Select a file first.'; return; }
    let txt = decodeCP037(ebcBytes, ebcNormalize.checked);
    // Preview only first 2k chars to keep UI snappy
    ebcPreview.value = txt.slice(0, 2000);
  });

  btnEbcDownload.addEventListener('click', () => {
    if (!ebcBytes){ ebcPreview.value='Select a file first.'; return; }
    let txt = decodeCP037(ebcBytes, ebcNormalize.checked);
    // Apply CRLF if requested
    if (ebcCRLF.checked){
      if (ebcNormalize.checked) txt = txt.replace(/\n/g, '\r\n');
      else txt = txt.replace(/\u0085/g, '\r\n'); // raw NEL to CRLF
    }
    const blob=new Blob([txt],{type:'text/plain;charset=us-ascii'}); // ASCII/Unicode text
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='converted-cp037.txt'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),0);
  });

  // Capability note
  if (!hasTextDecoder) {
    const warn=document.createElement('div');
    warn.className='small'; warn.style.color='var(--color-error, #c0392b)';
    warn.textContent='Limited mode: This browser lacks TextDecoder; built-in CP037 still works; other decoders unavailable.';
    compatBox.appendChild(warn);
  }

  // Extras
  if (typeof window.setupCopyButtons === 'function') window.setupCopyButtons();

  // UX helpers
  btnSwap.addEventListener('click', () => { const a=inputArea.value; inputArea.value=outputArea.value; outputArea.value=a; });
  btnClear.addEventListener('click', () => {
    inputArea.value=''; outputArea.value='';
    if (fileInput){ fileInput.value=''; fileInput._cachedBytes=null; }
    fileInfo.textContent=''; inMetrics.innerHTML=''; outMetrics.innerHTML=''; 
  });
}

// Qwik dynamic loader
export function load(container, toolId) {
  // Inject CSS via <link> if not already present
  if (!document.getElementById('charsetconverter-css-link')) {
    const link = document.createElement('link');
    link.id = 'charsetconverter-css-link';
    link.rel = 'stylesheet';
    link.href = 'charsetConverterTool.css';
    document.head.appendChild(link);
  }
  loadCharsetConverterTool(container);
  setupCharsetConverterTool(container);
}
