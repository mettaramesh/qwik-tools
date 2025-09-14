function Oe(i){i.innerHTML=`
    <div class="tool-header">
      <h2>JWT Encoder/Decoder</h2>
      <p>Encode and decode JSON Web Tokens. Verify HS256, RS256, ES256 in-browser.</p>
    </div>

  <div class="security-banner jwt-border jwt-bg jwt-padding jwt-margin-bottom jwt-font-size">
      <strong>Warning:</strong> Client-side verification is for testing only. Don’t paste secrets or production tokens you don’t control.
    </div>

    <div class="tool-interface">
      <div class="tool-controls">
        <button class="btn btn--secondary" id="jwt-decode-btn">Decode</button>
        <button class="btn btn--primary" id="jwt-encode-btn">Encode</button>
        <button class="btn btn--outline" id="jwt-clear-btn">Clear</button>
      </div>

      <div class="io-container">
        <div class="input-section">
          <div class="section-header">
            <label class="form-label">JWT Token</label>
            <button class="btn btn--sm copy-btn" data-target="jwt-input">Copy</button>
          </div>
          <textarea id="jwt-input" class="form-control code-input" placeholder="Paste JWT token here or generate below..." rows="3"></textarea>
          <div id="jwt-hints" class="muted small jwt-margin-top"></div>
        </div>
      </div>

      <div class="multi-output-container">
        <div class="output-section">
          <div class="section-header">
            <label class="form-label">Header</label>
            <button class="btn btn--sm copy-btn" data-target="jwt-header">Copy</button>
          </div>
          <textarea id="jwt-header" class="form-control code-input" rows="6" placeholder='{"alg":"HS256","typ":"JWT"}'></textarea>
          <div class="small muted" id="hdr-size"></div>
        </div>

        <div class="output-section">
          <div class="section-header">
            <label class="form-label">Payload</label>
            <button class="btn btn--sm copy-btn" data-target="jwt-payload">Copy</button>
          </div>
          <textarea id="jwt-payload" class="form-control code-input" rows="8" placeholder='{"sub":"1234567890","name":"John Doe","iat":1516239022}'></textarea>
          <div class="small muted" id="pld-size"></div>
        </div>

        <div class="output-section">
          <div class="section-header">
            <label class="form-label">Signature</label>
            <button class="btn btn--sm copy-btn" data-target="jwt-signature">Copy</button>
          </div>
          <textarea id="jwt-signature" class="form-control code-input" readonly rows="2"></textarea>
        </div>
      </div>

  <div class="grid-keys jwt-grid-keys">
        <div class="output-section">
          <label class="form-label">Secret (HS256)</label>
          <div class="jwt-flex jwt-gap"></div>
            <input id="jwt-secret" class="form-control jwt-flex-1" type="password" placeholder="Enter secret for HS256 signing/verifying">
            <button class="btn btn--outline" id="jwt-forget-secret">Forget</button>
          </div>
          <div class="small muted">Secret is never stored; input is cleared on blur.</div>
        </div>

        <div class="output-section">
          <div class="section-header">
            <label class="form-label">Public Key (RS256/ES256) — JWK or PEM (SPKI)</label>
            <button class="btn btn--sm copy-btn" data-target="jwt-pubkey">Copy</button>
          </div>
          <textarea id="jwt-pubkey" class="form-control code-input" rows="6" placeholder='
JWK example:
{"kty":"RSA","n":"...","e":"AQAB"}

PEM example (SPKI):
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...
-----END PUBLIC KEY-----
          '></textarea>
          <div class="small muted">Auto-detects JWK (JSON) vs PEM. For PEM, use <code>BEGIN PUBLIC KEY</code> (SPKI).</div>
        </div>
      </div>

      <!-- NEW: JWKS input -->
  <div class="output-section jwt-margin-top-sm">
        <div class="section-header">
          <label class="form-label">JWKS (JSON Web Key Set)</label>
          <button class="btn btn--sm copy-btn" data-target="jwt-jwks">Copy</button>
        </div>
        <textarea id="jwt-jwks" class="form-control code-input" rows="6" placeholder='{
  "keys": [
    { "kid": "key-1", "kty": "RSA", "alg": "RS256", "n": "...", "e": "AQAB" },
    { "kid": "key-2", "kty": "EC",  "alg": "ES256", "crv":"P-256", "x":"...", "y":"..." }
  ]
}'></textarea>
        <div class="small muted">If Public Key is empty and token header has <code>kid</code>, the tool will auto-select the matching JWK. If there is exactly one JWKS key and no <code>kid</code>, it will try that key if the alg matches.</div>
  <div class="small muted jwt-margin-top-xs" id="jwks-note"></div>
      </div>

      <!-- Sample Token Generator (HS256) -->
  <div class="output-section jwt-margin-top-lg">
        <div class="section-header">
          <label class="form-label">Generate Sample Token (HS256)</label>
        </div>
  <div class="small muted jwt-margin-bottom-sm">
          Uses the Secret (HS256) above. If blank, defaults to <code>testsecret</code>. Outputs a fresh token into the main JWT field.
        </div>

  <div class="gen-grid jwt-gen-grid">
          <div class="jwt-grid-col-2">
            <label class="form-label">sub</label>
            <input id="gen-sub" class="form-control" type="text" placeholder="demo-user" value="demo-user">
          </div>
          <div class="jwt-grid-col-2">
            <label class="form-label">name</label>
            <input id="gen-name" class="form-control" type="text" placeholder="Alice Example" value="Alice Example">
          </div>
          <div>
            <label class="form-label">TTL</label>
            <select id="gen-ttl" class="form-control">
              <option value="300">5 min</option>
              <option value="900" selected>15 min</option>
              <option value="3600">1 hour</option>
              <option value="86400">1 day</option>
            </select>
          </div>
          <div>
            <label class="form-label">Include iat</label>
            <select id="gen-iat" class="form-control">
              <option value="yes" selected>Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div class="jwt-grid-col-6">
            <label class="form-label">Extra claims (JSON, optional)</label>
            <textarea id="gen-extra" class="form-control code-input" rows="3" placeholder='{"role":"tester"}'></textarea>
          </div>
          <div style="grid-column: span 2;">
            <button class="btn btn--primary" id="gen-button">Generate HS256</button>
          </div>
          <div class="small muted jwt-grid-col-4" id="gen-note"></div>
        </div>
      </div>

      <!-- Ephemeral Keypairs + Mint (RS256/ES256) -->
  <div class="output-section jwt-margin-top-lg">
        <div class="section-header">
          <label class="form-label">Ephemeral Keypair & Mint (RS256 / ES256)</label>
        </div>
  <div class="small muted jwt-margin-bottom-sm">
          Generates keys in-memory. Private keys are not persisted. Use the shown public key to verify minted tokens.
        </div>

  <div class="gen-grid jwt-gen-grid">
          <div>
            <label class="form-label">Algorithm</label>
            <select id="kp-alg" class="form-control">
              <option value="RS256" selected>RS256 (RSA 2048)</option>
              <option value="ES256">ES256 (P-256)</option>
            </select>
          </div>
          <div>
            <label class="form-label">TTL</label>
            <select id="kp-ttl" class="form-control">
              <option value="300">5 min</option>
              <option value="900" selected>15 min</option>
              <option value="3600">1 hour</option>
              <option value="86400">1 day</option>
            </select>
          </div>
          <div style="grid-column: span 2;">
            <label class="form-label">sub</label>
            <input id="kp-sub" class="form-control" type="text" placeholder="demo-user" value="demo-user">
          </div>
          <div style="grid-column: span 2;">
            <label class="form-label">name</label>
            <input id="kp-name" class="form-control" type="text" placeholder="Alice Example" value="Alice Example">
          </div>

          <div style="grid-column: span 2;">
            <button class="btn btn--secondary" id="kp-generate">Generate Keypair</button>
          </div>
          <div style="grid-column: span 2;">
            <button class="btn btn--primary" id="kp-mint" disabled>Mint Token</button>
          </div>
          <div class="small muted" id="kp-note" style="grid-column: span 2;"></div>

          <div style="grid-column: span 3;">
            <label class="form-label">Public Key (PEM, SPKI)</label>
            <textarea id="kp-pub" class="form-control code-input" rows="6" readonly></textarea>
          </div>
          <div style="grid-column: span 3;">
            <label class="form-label">Private Key (PEM, PKCS#8) — for demo only</label>
            <textarea id="kp-priv" class="form-control code-input" rows="6" readonly></textarea>
          </div>
        </div>
      </div>

      <!-- Human-readable claims panel -->
      <div class="output-section" style="margin-top:16px;">
        <div class="section-header">
          <label class="form-label">Claims (Human-readable)</label>
        </div>
        <div class="small muted" style="margin-bottom:8px;">
          Shows local & UTC times and relative durations for <code>iat</code>, <code>nbf</code>, and <code>exp</code>.
        </div>
        <div id="claims-human" class="small" style="display:grid; grid-template-columns: 1fr 2fr 2fr 1fr; gap:8px;">
          <div style="font-weight:600;">Claim</div>
          <div style="font-weight:600;">Local</div>
          <div style="font-weight:600;">UTC</div>
          <div style="font-weight:600;">Δ</div>
          <div>IAT</div><div id="hr-iat-local"></div><div id="hr-iat-utc"></div><div id="hr-iat-rel"></div>
          <div>NBF</div><div id="hr-nbf-local"></div><div id="hr-nbf-utc"></div><div id="hr-nbf-rel"></div>
          <div>EXP</div><div id="hr-exp-local"></div><div id="hr-exp-utc"></div><div id="hr-exp-rel"></div>
        </div>
      </div>

      <div class="grid-claims" style="display:grid; gap:16px; grid-template-columns:1fr 1fr 1fr; margin-top:16px;">
        <div>
          <label class="form-label">Clock Skew (±seconds)</label>
          <input id="jwt-skew" type="number" class="form-control" min="0" value="60">
          <div class="small muted">Applied to exp, nbf, iat checks.</div>
        </div>
        <div>
          <label class="form-label">Verify Claims</label>
          <select id="jwt-claims-mode" class="form-control">
            <option value="warn">Warn</option>
            <option value="enforce">Enforce</option>
            <option value="off">Off</option>
          </select>
          <div class="small muted">Enforce fails verification on invalid claims.</div>
        </div>
        <div>
          <label class="form-label">Auto-verify on input</label>
          <select id="jwt-auto" class="form-control">
            <option value="on">On (debounced)</option>
            <option value="off">Off</option>
          </select>
        </div>
      </div>

      <div id="jwt-status" class="hidden" style="margin-top:10px;"></div>
    </div>
  `}function Re(){const i=e=>document.getElementById(e),k=i("jwt-input"),v=i("jwt-header"),p=i("jwt-payload"),E=i("jwt-signature"),f=i("jwt-secret"),j=i("jwt-pubkey"),K=i("jwt-jwks"),J=i("jwks-note"),P=i("jwt-status"),ce=i("jwt-hints"),$=i("hdr-size"),L=i("pld-size"),V=i("jwt-skew"),q=i("jwt-claims-mode"),de=i("jwt-auto"),ue=i("gen-sub"),pe=i("gen-name"),ve=i("gen-ttl"),fe=i("gen-iat"),me=i("gen-extra"),be=i("gen-button"),Q=i("gen-note"),ye=i("kp-alg"),ge=i("kp-ttl"),he=i("kp-sub"),Se=i("kp-name"),we=i("kp-generate"),H=i("kp-mint"),Z=i("kp-note"),U=i("kp-pub"),X=i("kp-priv"),B={iat:{local:i("hr-iat-local"),utc:i("hr-iat-utc"),rel:i("hr-iat-rel")},nbf:{local:i("hr-nbf-local"),utc:i("hr-nbf-utc"),rel:i("hr-nbf-rel")},exp:{local:i("hr-exp-local"),utc:i("hr-exp-utc"),rel:i("hr-exp-rel")}};let g={alg:null,privateKey:null,publicKey:null},m={keysByKid:new Map,list:[],parsed:!1};const w=new TextEncoder,ke=new TextDecoder;function D(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function M(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");for(;t.length%4;)t+="=";const n=atob(t),a=new Uint8Array(n.length);for(let o=0;o<n.length;o++)a[o]=n.charCodeAt(o);return a}function C(e){return D(w.encode(JSON.stringify(e)))}function ee(e){return JSON.parse(ke.decode(M(e)))}function O(e){return/^[A-Za-z0-9_-]+$/.test(e)&&e.length>0}function te(e){for(let t=0;t<e.length;t++)if(e.charCodeAt(t)>127)return!0;return!1}async function ne(e){return crypto.subtle.importKey("raw",w.encode(e),{name:"HMAC",hash:"SHA-256"},!1,["sign","verify"])}async function ae(e,t){const n=await ne(t),a=await crypto.subtle.sign("HMAC",n,w.encode(e));return D(new Uint8Array(a))}async function Ee(e,t,n){const a=await ne(n);return crypto.subtle.verify("HMAC",a,M(t),w.encode(e))}async function xe(e,t){if(e.trim().startsWith("{")){const a=JSON.parse(e);return ie(a,t)}else{const o=e.replace(/\r/g,"").trim().match(/-----BEGIN PUBLIC KEY-----([A-Za-z0-9+/=\n]+)-----END PUBLIC KEY-----/);if(!o)throw new Error("PEM must be SPKI with BEGIN PUBLIC KEY / END PUBLIC KEY");const d=Uint8Array.from(atob(o[1].replace(/\s+/g,"")),r=>r.charCodeAt(0));if(t==="RS256")return crypto.subtle.importKey("spki",d.buffer,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!1,["verify"]);if(t==="ES256")return crypto.subtle.importKey("spki",d.buffer,{name:"ECDSA",namedCurve:"P-256"},!1,["verify"]);throw new Error(`Unsupported alg for PEM: ${t}`)}}async function ie(e,t){if(t==="RS256"){if(e.kty!=="RSA")throw new Error("JWK kty must be RSA for RS256");return crypto.subtle.importKey("jwk",e,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!1,["verify"])}else if(t==="ES256"){if(e.kty!=="EC"||e.crv!=="P-256")throw new Error("JWK must be EC P-256 for ES256");return crypto.subtle.importKey("jwk",e,{name:"ECDSA",namedCurve:"P-256"},!1,["verify"])}throw new Error(`Unsupported alg for JWK: ${t}`)}function Ke(e){const t=e.slice(0,32),n=e.slice(32,64);function a(l){let s=0;for(;s<l.length-1&&l[s]===0;)s++;return l.slice(s)}function o(l){let s=a(l);return s[0]&128&&(s=Uint8Array.from([0,...s])),Uint8Array.from([2,s.length,...s])}const d=o(t),r=o(n),c=d.length+r.length;return Uint8Array.from([48,c,...d,...r])}function Ce(e){let t=0;if(e[t++]!==48)throw new Error("Bad DER");if(t++,e[t++]!==2)throw new Error("Bad DER r");const n=e[t++],a=e.slice(t,t+n);if(t+=n,e[t++]!==2)throw new Error("Bad DER s");const o=e[t++],d=e.slice(t,t+o);function r(y){const b=new Uint8Array(32);return b.set(y,32-y.length),b}const c=r(a[0]===0?a.slice(1):a),l=r(d[0]===0?d.slice(1):d),s=new Uint8Array(64);return s.set(c,0),s.set(l,32),s}async function Ae(e,t,n,a){const o=typeof a=="string"?await xe(a,n):await ie(a,n),d=w.encode(e),r=M(t);if(n==="RS256")return crypto.subtle.verify({name:"RSASSA-PKCS1-v1_5"},o,r,d);if(n==="ES256"){const c=Ke(r);return crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"},o,c,d)}throw new Error(`Unsupported alg: ${n}`)}function R(){m={keysByKid:new Map,list:[],parsed:!1};const e=(K.value||"").trim();if(!e){J.textContent="";return}try{const t=JSON.parse(e);if(!t||!Array.isArray(t.keys)){J.textContent='JWKS: expected an object with "keys" array.';return}t.keys.forEach(n=>{m.list.push(n),n.kid&&m.keysByKid.set(n.kid,n)}),m.parsed=!0,J.textContent=`JWKS loaded: ${m.list.length} key(s). ${m.keysByKid.size} with kid.`}catch(t){J.textContent="JWKS parse error: "+t.message}}function je(e,t){if(!m.parsed||m.list.length===0)return null;if(t&&m.keysByKid.has(t))return m.keysByKid.get(t);if(!t&&m.list.length===1){const a=m.list[0];if(!a.alg||a.alg===e)return a}return m.list.find(a=>!a.alg||a.alg===e)||null}function u(e,t){P.className=e==="ok"?"success-message":"error-message",P.textContent=t,P.classList.remove("hidden")}function oe(){P.className="hidden",P.textContent=""}function G(e){ce.textContent=e||""}function x(e,t){try{const n=JSON.parse(e||"{}"),a=JSON.parse(t||"{}"),o=w.encode(JSON.stringify(n)).length,d=w.encode(JSON.stringify(a)).length;$.textContent=`Header size: ${o} bytes (UTF-8)`,L.textContent=`Payload size: ${d} bytes (UTF-8)`;const r=te(JSON.stringify(n)),c=te(JSON.stringify(a)),l=[];r&&l.push("Header contains non-ASCII (UTF-8 required)."),c&&l.push("Payload contains non-ASCII (UTF-8 required)."),G(l.join(" "))}catch{$.textContent="",L.textContent="",G("")}}function Je(e){return e?new Date(e*1e3).toLocaleString():"—"}function Pe(e){return e?new Date(e*1e3).toISOString().replace("T"," ").replace("Z"," UTC"):"—"}function Te(e){if(!e)return"—";const t=Math.floor(Date.now()/1e3),n=e-t,a=Math.abs(n),o=Math.floor(a/3600),d=Math.floor(a%3600/60),r=a%60,c=o?`${o}h `:"",l=d?`${d}m `:"",s=`${r}s`;return n>=0?`in ${c}${l}${s}`.trim():`${c}${l}${s} ago`.trim()}function h(e){const t=["iat","nbf","exp"];for(const n of t){const a=e&&typeof e[n]=="number"?e[n]:null;B[n].local.textContent=Je(a),B[n].utc.textContent=Pe(a),B[n].rel.textContent=Te(a)}}function Ne(){return Math.floor(Date.now()/1e3)}function He(){const e=parseInt(V.value,10);return Number.isFinite(e)&&e>=0?e:0}function Ie(){return q.value}function se(e,t){const n=Ne(),a=[];let o=!0;return typeof e.exp=="number"&&n>e.exp+t&&(a.push("Token expired (exp)."),o=!1),typeof e.nbf=="number"&&n<e.nbf-t&&(a.push("Token not yet valid (nbf)."),o=!1),typeof e.iat=="number"&&e.iat>n+t&&(a.push("Issued-at (iat) is in the future."),o=!1),{ok:o,msgs:a}}async function le(e){e&&(e.preventDefault(),e.stopPropagation());try{const t=(k.value||"").trim();if(x(v.value,p.value),!t){oe(),h(null);return}const n=t.split(".");if(![2,3].includes(n.length)||!O(n[0])||!O(n[1]))throw new Error("Invalid JWT structure or base64url segments.");const a=ee(n[0]);v.value=JSON.stringify(a,null,2);const o=ee(n[1]);if(p.value=JSON.stringify(o,null,2),x(v.value,p.value),h(o),n.length===3&&n[2]){if(!O(n[2]))throw new Error("Invalid signature encoding.");E.value=n[2]}else E.value="";const d=He(),r=Ie(),{ok:c,msgs:l}=se(o,d);if(n.length===3&&n[2]){const s=a.alg;if(!s){u("err","Missing alg in header.");return}const y=n[0]+"."+n[1];let b=!1;if(s==="HS256"){if(!f.value){u("ok",T("JWT decoded (no HS256 secret provided)",l,r,c));return}b=await Ee(y,n[2],f.value)}else if(s==="RS256"||s==="ES256"){const S=(j.value||"").trim();let A=null,I="";if(S)A=S,I="Public Key (manual)";else{const _=a.kid,W=je(s,_);W&&(A=W,I=W.kid?`JWKS (kid=${W.kid})`:"JWKS (single/fallback)")}if(!A){u("ok",T(`JWT decoded (${s} key not provided)`,l,r,c));return}try{b=await Ae(y,n[2],s,A)}catch(_){u("err",`Key import failed: ${_.message}`);return}if(!b){u("err",`Signature invalid (${I}).`);return}const Me=`Signature valid (${s}, ${I})`;if(r==="enforce"&&!c){u("err","Signature valid but claims invalid: "+l.join(" "));return}u(r==="off"||c?"ok":"err",T(Me,l,r,c))}else{u("err",`Unsupported alg="${s}". Only HS256, RS256, ES256 supported.`);return}if(s==="HS256"){if(!b){u("err","Signature invalid.");return}const S="Signature valid (HS256)";if(r==="enforce"&&!c){u("err","Signature valid but claims invalid: "+l.join(" "));return}u(r==="off"||c?"ok":"err",T(S,l,r,c))}}else if(a.alg&&a.alg!=="none")u("err",`Header alg="${a.alg}" but token is unsigned.`);else{const s="Unsigned JWT decoded";r==="enforce"&&!se(o,d).ok?u("err",s+" but claims invalid."):u("ok",T(s,l,r,c))}}catch(t){u("err","Invalid JWT: "+t.message),v.value="",p.value="",E.value="",h(null)}}function T(e,t,n,a){if(n==="off"||t.length===0)return e;const o=" "+(a?"(claims OK)":"(claims warnings)")+" "+t.join(" ");return n==="warn"?e+o:n==="enforce"?e+(a?" (claims OK)":" (claims invalid) "+t.join(" ")):e}async function We(e){e&&(e.preventDefault(),e.stopPropagation());try{let t=(v.value||"").trim(),n=(p.value||"").trim();if(!t&&!n){u("err","Header and payload cannot both be empty.");return}t||(t='{"alg":"HS256","typ":"JWT"}'),n||(n='{"sub":"1234567890","name":"John Doe","iat":1516239022}');const a=JSON.parse(t),o=JSON.parse(n),d=!!f.value||!!j.value;if(f.value){if(a.alg&&a.alg!=="HS256")throw new Error(`Header alg="${a.alg}" incompatible with HS256 signing. Use "HS256".`);a.alg="HS256"}else a.alg||(a.alg="HS256");const r=C(a),c=C(o);let l="";f.value&&a.alg==="HS256"&&(l=await ae(r+"."+c,f.value));const s=r+"."+c+(l?"."+l:"");k.value=s,E.value=l,x(v.value,p.value),h(o),u("ok",l?"JWT encoded and signed (HS256)":"JWT encoded (no signature)")}catch(t){u("err","Encode error: "+t.message)}}function z(e,t={}){if(!e||!e.trim())return t;try{return JSON.parse(e)}catch{return t}}async function $e(e){e&&(e.preventDefault(),e.stopPropagation());try{const t=Math.floor(Date.now()/1e3),n=parseInt(ve.value,10)||900,a=fe.value==="yes",o=f.value&&f.value.length>0?f.value:"testsecret",d={sub:ue.value||"demo-user",name:pe.value||"Alice Example",exp:t+n};a&&(d.iat=t);const r=z(me.value,{}),c=Object.assign({},d,r),l={alg:"HS256",typ:"JWT"};v.value=JSON.stringify(l,null,2),p.value=JSON.stringify(c,null,2),x(v.value,p.value),h(c);const s=C(l),y=C(c),b=await ae(s+"."+y,o),S=`${s}.${y}.${b}`;k.value=S,E.value=b,Q.textContent=o==="testsecret"?'Signed with default secret "testsecret". For stronger tests, enter your own secret above.':"Signed with your HS256 secret.",u("ok","Sample JWT generated and signed (HS256).")}catch(t){u("err","Sample generation failed: "+t.message)}}async function Le(e){e&&(e.preventDefault(),e.stopPropagation());try{const t=ye.value;let n;t==="RS256"?n=await crypto.subtle.generateKey({name:"RSASSA-PKCS1-v1_5",modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:"SHA-256"},!0,["sign","verify"]):n=await crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},!0,["sign","verify"]),g={alg:t,privateKey:n.privateKey,publicKey:n.publicKey};const a=new Uint8Array(await crypto.subtle.exportKey("spki",n.publicKey)),o=new Uint8Array(await crypto.subtle.exportKey("pkcs8",n.privateKey));U.value=re(a,"PUBLIC KEY"),X.value=re(o,"PRIVATE KEY"),H.disabled=!1,Z.textContent=`Keypair ready (${t}). Use the public key to verify minted tokens.`,u("ok",`Generated ${t} keypair (ephemeral).`)}catch(t){u("err","Keypair generation failed: "+t.message),H.disabled=!0}}function re(e,t){const n=btoa(String.fromCharCode(...e)).match(/.{1,64}/g).join(`
`);return`-----BEGIN ${t}-----
${n}
-----END ${t}-----`}async function Ue(e){e&&(e.preventDefault(),e.stopPropagation());try{if(!g.privateKey||!g.publicKey||!g.alg){u("err","Generate a keypair first.");return}const t=g.alg,n=Math.floor(Date.now()/1e3),a=parseInt(ge.value,10)||900,o={alg:t,typ:"JWT",kid:"ephem-1"},d={sub:he.value||"demo-user",name:Se.value||"Alice Example",iat:n,exp:n+a};v.value=JSON.stringify(o,null,2),p.value=JSON.stringify(d,null,2),x(v.value,p.value),h(d);const r=C(o),c=C(d),l=w.encode(`${r}.${c}`);let s;if(t==="RS256")s=new Uint8Array(await crypto.subtle.sign({name:"RSASSA-PKCS1-v1_5"},g.privateKey,l));else if(t==="ES256"){const A=new Uint8Array(await crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},g.privateKey,l));s=Ce(A)}else throw new Error(`Unsupported alg for mint: ${t}`);const y=D(s),b=`${r}.${c}.${y}`;k.value=b,E.value=y;const S=await crypto.subtle.exportKey("jwk",g.publicKey);S.kid="ephem-1",Be(S),j.value=U.value,u("ok",`Minted ${t} token. Auto-added public JWK to JWKS (kid=ephem-1).`)}catch(t){u("err","Mint failed: "+t.message)}}function Be(e){let t;try{t=K.value.trim()?JSON.parse(K.value):{keys:[]}}catch{t={keys:[]}}Array.isArray(t.keys)||(t.keys=[]);const n=t.keys.findIndex(a=>a.kid&&e.kid&&a.kid===e.kid);n>=0?t.keys[n]=e:t.keys.push(e),K.value=JSON.stringify(t,null,2),R()}function De(e){e&&(e.preventDefault(),e.stopPropagation()),k.value="",v.value="",p.value="",E.value="",f.value="",j.value="",K.value="",J.textContent="",U.value="",X.value="",g={alg:null,privateKey:null,publicKey:null},m={keysByKid:new Map,list:[],parsed:!1},oe(),G(""),h(null),$.textContent="",L.textContent="",Q.textContent="",Z.textContent="",H.disabled=!0}i("jwt-forget-secret").addEventListener("click",e=>{e.preventDefault(),f.value=""});let F=!1;["jwt-encode-btn","jwt-decode-btn","jwt-clear-btn","gen-button","kp-generate","kp-mint"].forEach(e=>{const t=document.getElementById(e);t&&t.addEventListener("mousedown",()=>{F=!0})}),f.addEventListener("blur",()=>{if(F){F=!1;return}f.value=""}),i("jwt-decode-btn").addEventListener("click",le),i("jwt-encode-btn").addEventListener("click",We),i("jwt-clear-btn").addEventListener("click",De),be.addEventListener("click",$e),we.addEventListener("click",Le),H.addEventListener("click",Ue),K.addEventListener("input",R);let Y=null;function N(){de.value!=="off"&&(Y&&clearTimeout(Y),Y=setTimeout(()=>le(),250))}k.addEventListener("input",N),v.addEventListener("input",()=>{x(v.value,p.value),h(z(p.value,{}))}),p.addEventListener("input",()=>{x(v.value,p.value),h(z(p.value,{}))}),V.addEventListener("change",N),q.addEventListener("change",N),j.addEventListener("input",N),f.addEventListener("input",N),typeof window.setupCopyButtons=="function"&&window.setupCopyButtons(),R()}function Ge(i,k){Oe(i),Re()}export{Ge as load,Oe as loadJWTTool,Re as setupJWTTool};
