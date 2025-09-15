function Re(i){i.innerHTML=`
    <div class="tool-header">
      <h2>JWT Encoder/Decoder</h2>
      <p>Encode and decode JSON Web Tokens. Verify HS256, RS256, ES256 in-browser.</p>
    </div>

  <div class="security-banner">
      <strong>Warning:</strong> Client-side verification is for testing only. Don’t paste secrets or production tokens you don’t control.
    </div>

    <div class="tool-interface">
      <div class="tool-controls">
        <button class="btn btn--secondary" id="jwt-decode-btn">Decode</button>
        <button class="btn btn--primary" id="jwt-encode-btn">Encode</button>
        <button class="btn btn--outline" id="jwt-clear-btn">Clear</button>
      </div>

      export async function loadJWTTool(container) {
        const html = await fetch('src/jwtTool.html').then(r => r.text());
        container.innerHTML = html;
  ]
}'></textarea>
        <div class="small muted">If Public Key is empty and token header has <code>kid</code>, the tool will auto-select the matching JWK. If there is exactly one JWKS key and no <code>kid</code>, it will try that key if the alg matches.</div>
  <div class="small muted jwks-note" id="jwks-note"></div>
      </div>

      <!-- Sample Token Generator (HS256) -->
  <div class="output-section jwt-mt-16">
        <div class="section-header">
          <label class="form-label">Generate Sample Token (HS256)</label>
        </div>
  <div class="small muted jwt-mb-8">
          Uses the Secret (HS256) above. If blank, defaults to <code>testsecret</code>. Outputs a fresh token into the main JWT field.
        </div>

  <div class="gen-grid jwt-gen-grid">
          <div class="jwt-col-span-2">
            <label class="form-label">sub</label>
            <input id="gen-sub" class="form-control" type="text" placeholder="demo-user" value="demo-user">
          </div>
          <div class="jwt-col-span-2">
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
          <div class="jwt-col-span-6">
            <label class="form-label">Extra claims (JSON, optional)</label>
            <textarea id="gen-extra" class="form-control code-input" rows="3" placeholder='{"role":"tester"}'></textarea>
          </div>
          <div class="jwt-col-span-2">
            <button class="btn btn--primary" id="gen-button">Generate HS256</button>
          </div>
          <div class="small muted jwt-col-span-4" id="gen-note"></div>
        </div>
      </div>

      <!-- Ephemeral Keypairs + Mint (RS256/ES256) -->
  <div class="output-section jwt-mt-16">
        <div class="section-header">
          <label class="form-label">Ephemeral Keypair & Mint (RS256 / ES256)</label>
        </div>
  <div class="small muted jwt-mb-8">
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
          <div class="jwt-col-span-2">
            <label class="form-label">sub</label>
            <input id="kp-sub" class="form-control" type="text" placeholder="demo-user" value="demo-user">
          </div>
          <div class="jwt-col-span-2">
            <label class="form-label">name</label>
            <input id="kp-name" class="form-control" type="text" placeholder="Alice Example" value="Alice Example">
          </div>

          <div class="jwt-col-span-2">
            <button class="btn btn--secondary" id="kp-generate">Generate Keypair</button>
          </div>
          <div class="jwt-col-span-2">
            <button class="btn btn--primary" id="kp-mint" disabled>Mint Token</button>
          </div>
          <div class="small muted jwt-col-span-2" id="kp-note"></div>

          <div class="jwt-col-span-3">
            <label class="form-label">Public Key (PEM, SPKI)</label>
            <textarea id="kp-pub" class="form-control code-input" rows="6" readonly></textarea>
          </div>
          <div class="jwt-col-span-3">
            <label class="form-label">Private Key (PEM, PKCS#8) — for demo only</label>
            <textarea id="kp-priv" class="form-control code-input" rows="6" readonly></textarea>
          </div>
        </div>
      </div>

      <!-- Human-readable claims panel -->
  <div class="output-section jwt-mt-16">
        <div class="section-header">
          <label class="form-label">Claims (Human-readable)</label>
        </div>
  <div class="small muted jwt-mb-8">
          Shows local & UTC times and relative durations for <code>iat</code>, <code>nbf</code>, and <code>exp</code>.
        </div>
  <div id="claims-human" class="small jwt-claims-human">
          <div class="jwt-fw-600">Claim</div>
          <div class="jwt-fw-600">Local</div>
          <div class="jwt-fw-600">UTC</div>
          <div class="jwt-fw-600">Δ</div>
          <div>IAT</div><div id="hr-iat-local"></div><div id="hr-iat-utc"></div><div id="hr-iat-rel"></div>
          <div>NBF</div><div id="hr-nbf-local"></div><div id="hr-nbf-utc"></div><div id="hr-nbf-rel"></div>
          <div>EXP</div><div id="hr-exp-local"></div><div id="hr-exp-utc"></div><div id="hr-exp-rel"></div>
        </div>
      </div>

  <div class="grid-claims jwt-grid-claims">
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

  <div id="jwt-status" class="hidden jwt-mt-10"></div>
    </div>
  `}function Be(){const i=e=>document.getElementById(e),k=i("jwt-input"),f=i("jwt-header"),p=i("jwt-payload"),E=i("jwt-signature"),v=i("jwt-secret"),A=i("jwt-pubkey"),K=i("jwt-jwks"),J=i("jwks-note"),T=i("jwt-status"),ce=i("jwt-hints"),I=i("hdr-size"),L=i("pld-size"),V=i("jwt-skew"),Z=i("jwt-claims-mode"),de=i("jwt-auto"),ue=i("gen-sub"),pe=i("gen-name"),fe=i("gen-ttl"),ve=i("gen-iat"),me=i("gen-extra"),ye=i("gen-button"),q=i("gen-note"),be=i("kp-alg"),ge=i("kp-ttl"),he=i("kp-sub"),Se=i("kp-name"),we=i("kp-generate"),N=i("kp-mint"),X=i("kp-note"),U=i("kp-pub"),Q=i("kp-priv"),D={iat:{local:i("hr-iat-local"),utc:i("hr-iat-utc"),rel:i("hr-iat-rel")},nbf:{local:i("hr-nbf-local"),utc:i("hr-nbf-utc"),rel:i("hr-nbf-rel")},exp:{local:i("hr-exp-local"),utc:i("hr-exp-utc"),rel:i("hr-exp-rel")}};let g={alg:null,privateKey:null,publicKey:null},m={keysByKid:new Map,list:[],parsed:!1};const w=new TextEncoder,ke=new TextDecoder;function O(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function M(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");for(;t.length%4;)t+="=";const n=atob(t),a=new Uint8Array(n.length);for(let o=0;o<n.length;o++)a[o]=n.charCodeAt(o);return a}function C(e){return O(w.encode(JSON.stringify(e)))}function ee(e){return JSON.parse(ke.decode(M(e)))}function R(e){return/^[A-Za-z0-9_-]+$/.test(e)&&e.length>0}function te(e){for(let t=0;t<e.length;t++)if(e.charCodeAt(t)>127)return!0;return!1}async function ne(e){return crypto.subtle.importKey("raw",w.encode(e),{name:"HMAC",hash:"SHA-256"},!1,["sign","verify"])}async function ae(e,t){const n=await ne(t),a=await crypto.subtle.sign("HMAC",n,w.encode(e));return O(new Uint8Array(a))}async function Ee(e,t,n){const a=await ne(n);return crypto.subtle.verify("HMAC",a,M(t),w.encode(e))}async function xe(e,t){if(e.trim().startsWith("{")){const a=JSON.parse(e);return ie(a,t)}else{const o=e.replace(/\r/g,"").trim().match(/-----BEGIN PUBLIC KEY-----([A-Za-z0-9+/=\n]+)-----END PUBLIC KEY-----/);if(!o)throw new Error("PEM must be SPKI with BEGIN PUBLIC KEY / END PUBLIC KEY");const d=Uint8Array.from(atob(o[1].replace(/\s+/g,"")),l=>l.charCodeAt(0));if(t==="RS256")return crypto.subtle.importKey("spki",d.buffer,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!1,["verify"]);if(t==="ES256")return crypto.subtle.importKey("spki",d.buffer,{name:"ECDSA",namedCurve:"P-256"},!1,["verify"]);throw new Error(`Unsupported alg for PEM: ${t}`)}}async function ie(e,t){if(t==="RS256"){if(e.kty!=="RSA")throw new Error("JWK kty must be RSA for RS256");return crypto.subtle.importKey("jwk",e,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},!1,["verify"])}else if(t==="ES256"){if(e.kty!=="EC"||e.crv!=="P-256")throw new Error("JWK must be EC P-256 for ES256");return crypto.subtle.importKey("jwk",e,{name:"ECDSA",namedCurve:"P-256"},!1,["verify"])}throw new Error(`Unsupported alg for JWK: ${t}`)}function Ke(e){const t=e.slice(0,32),n=e.slice(32,64);function a(r){let s=0;for(;s<r.length-1&&r[s]===0;)s++;return r.slice(s)}function o(r){let s=a(r);return s[0]&128&&(s=Uint8Array.from([0,...s])),Uint8Array.from([2,s.length,...s])}const d=o(t),l=o(n),c=d.length+l.length;return Uint8Array.from([48,c,...d,...l])}function Ce(e){let t=0;if(e[t++]!==48)throw new Error("Bad DER");if(t++,e[t++]!==2)throw new Error("Bad DER r");const n=e[t++],a=e.slice(t,t+n);if(t+=n,e[t++]!==2)throw new Error("Bad DER s");const o=e[t++],d=e.slice(t,t+o);function l(b){const y=new Uint8Array(32);return y.set(b,32-b.length),y}const c=l(a[0]===0?a.slice(1):a),r=l(d[0]===0?d.slice(1):d),s=new Uint8Array(64);return s.set(c,0),s.set(r,32),s}async function je(e,t,n,a){const o=typeof a=="string"?await xe(a,n):await ie(a,n),d=w.encode(e),l=M(t);if(n==="RS256")return crypto.subtle.verify({name:"RSASSA-PKCS1-v1_5"},o,l,d);if(n==="ES256"){const c=Ke(l);return crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"},o,c,d)}throw new Error(`Unsupported alg: ${n}`)}function B(){m={keysByKid:new Map,list:[],parsed:!1};const e=(K.value||"").trim();if(!e){J.textContent="";return}try{const t=JSON.parse(e);if(!t||!Array.isArray(t.keys)){J.textContent='JWKS: expected an object with "keys" array.';return}t.keys.forEach(n=>{m.list.push(n),n.kid&&m.keysByKid.set(n.kid,n)}),m.parsed=!0,J.textContent=`JWKS loaded: ${m.list.length} key(s). ${m.keysByKid.size} with kid.`}catch(t){J.textContent="JWKS parse error: "+t.message}}function Ae(e,t){if(!m.parsed||m.list.length===0)return null;if(t&&m.keysByKid.has(t))return m.keysByKid.get(t);if(!t&&m.list.length===1){const a=m.list[0];if(!a.alg||a.alg===e)return a}return m.list.find(a=>!a.alg||a.alg===e)||null}function u(e,t){T.className=e==="ok"?"success-message":"error-message",T.textContent=t,T.classList.remove("hidden")}function oe(){T.className="hidden",T.textContent=""}function G(e){ce.textContent=e||""}function x(e,t){try{const n=JSON.parse(e||"{}"),a=JSON.parse(t||"{}"),o=w.encode(JSON.stringify(n)).length,d=w.encode(JSON.stringify(a)).length;I.textContent=`Header size: ${o} bytes (UTF-8)`,L.textContent=`Payload size: ${d} bytes (UTF-8)`;const l=te(JSON.stringify(n)),c=te(JSON.stringify(a)),r=[];l&&r.push("Header contains non-ASCII (UTF-8 required)."),c&&r.push("Payload contains non-ASCII (UTF-8 required)."),G(r.join(" "))}catch{I.textContent="",L.textContent="",G("")}}function Je(e){return e?new Date(e*1e3).toLocaleString():"—"}function Te(e){return e?new Date(e*1e3).toISOString().replace("T"," ").replace("Z"," UTC"):"—"}function He(e){if(!e)return"—";const t=Math.floor(Date.now()/1e3),n=e-t,a=Math.abs(n),o=Math.floor(a/3600),d=Math.floor(a%3600/60),l=a%60,c=o?`${o}h `:"",r=d?`${d}m `:"",s=`${l}s`;return n>=0?`in ${c}${r}${s}`.trim():`${c}${r}${s} ago`.trim()}function h(e){const t=["iat","nbf","exp"];for(const n of t){const a=e&&typeof e[n]=="number"?e[n]:null;D[n].local.textContent=Je(a),D[n].utc.textContent=Te(a),D[n].rel.textContent=He(a)}}function Pe(){return Math.floor(Date.now()/1e3)}function Ne(){const e=parseInt(V.value,10);return Number.isFinite(e)&&e>=0?e:0}function $e(){return Z.value}function se(e,t){const n=Pe(),a=[];let o=!0;return typeof e.exp=="number"&&n>e.exp+t&&(a.push("Token expired (exp)."),o=!1),typeof e.nbf=="number"&&n<e.nbf-t&&(a.push("Token not yet valid (nbf)."),o=!1),typeof e.iat=="number"&&e.iat>n+t&&(a.push("Issued-at (iat) is in the future."),o=!1),{ok:o,msgs:a}}async function re(e){e&&(e.preventDefault(),e.stopPropagation());try{const t=(k.value||"").trim();if(x(f.value,p.value),!t){oe(),h(null);return}const n=t.split(".");if(![2,3].includes(n.length)||!R(n[0])||!R(n[1]))throw new Error("Invalid JWT structure or base64url segments.");const a=ee(n[0]);f.value=JSON.stringify(a,null,2);const o=ee(n[1]);if(p.value=JSON.stringify(o,null,2),x(f.value,p.value),h(o),n.length===3&&n[2]){if(!R(n[2]))throw new Error("Invalid signature encoding.");E.value=n[2]}else E.value="";const d=Ne(),l=$e(),{ok:c,msgs:r}=se(o,d);if(n.length===3&&n[2]){const s=a.alg;if(!s){u("err","Missing alg in header.");return}const b=n[0]+"."+n[1];let y=!1;if(s==="HS256"){if(!v.value){u("ok",H("JWT decoded (no HS256 secret provided)",r,l,c));return}y=await Ee(b,n[2],v.value)}else if(s==="RS256"||s==="ES256"){const S=(A.value||"").trim();let j=null,$="";if(S)j=S,$="Public Key (manual)";else{const Y=a.kid,W=Ae(s,Y);W&&(j=W,$=W.kid?`JWKS (kid=${W.kid})`:"JWKS (single/fallback)")}if(!j){u("ok",H(`JWT decoded (${s} key not provided)`,r,l,c));return}try{y=await je(b,n[2],s,j)}catch(Y){u("err",`Key import failed: ${Y.message}`);return}if(!y){u("err",`Signature invalid (${$}).`);return}const Me=`Signature valid (${s}, ${$})`;if(l==="enforce"&&!c){u("err","Signature valid but claims invalid: "+r.join(" "));return}u(l==="off"||c?"ok":"err",H(Me,r,l,c))}else{u("err",`Unsupported alg="${s}". Only HS256, RS256, ES256 supported.`);return}if(s==="HS256"){if(!y){u("err","Signature invalid.");return}const S="Signature valid (HS256)";if(l==="enforce"&&!c){u("err","Signature valid but claims invalid: "+r.join(" "));return}u(l==="off"||c?"ok":"err",H(S,r,l,c))}}else if(a.alg&&a.alg!=="none")u("err",`Header alg="${a.alg}" but token is unsigned.`);else{const s="Unsigned JWT decoded";l==="enforce"&&!se(o,d).ok?u("err",s+" but claims invalid."):u("ok",H(s,r,l,c))}}catch(t){u("err","Invalid JWT: "+t.message),f.value="",p.value="",E.value="",h(null)}}function H(e,t,n,a){if(n==="off"||t.length===0)return e;const o=" "+(a?"(claims OK)":"(claims warnings)")+" "+t.join(" ");return n==="warn"?e+o:n==="enforce"?e+(a?" (claims OK)":" (claims invalid) "+t.join(" ")):e}async function We(e){e&&(e.preventDefault(),e.stopPropagation());try{let t=(f.value||"").trim(),n=(p.value||"").trim();if(!t&&!n){u("err","Header and payload cannot both be empty.");return}t||(t='{"alg":"HS256","typ":"JWT"}'),n||(n='{"sub":"1234567890","name":"John Doe","iat":1516239022}');const a=JSON.parse(t),o=JSON.parse(n),d=!!v.value||!!A.value;if(v.value){if(a.alg&&a.alg!=="HS256")throw new Error(`Header alg="${a.alg}" incompatible with HS256 signing. Use "HS256".`);a.alg="HS256"}else a.alg||(a.alg="HS256");const l=C(a),c=C(o);let r="";v.value&&a.alg==="HS256"&&(r=await ae(l+"."+c,v.value));const s=l+"."+c+(r?"."+r:"");k.value=s,E.value=r,x(f.value,p.value),h(o),u("ok",r?"JWT encoded and signed (HS256)":"JWT encoded (no signature)")}catch(t){u("err","Encode error: "+t.message)}}function z(e,t={}){if(!e||!e.trim())return t;try{return JSON.parse(e)}catch{return t}}async function Ie(e){e&&(e.preventDefault(),e.stopPropagation());try{const t=Math.floor(Date.now()/1e3),n=parseInt(fe.value,10)||900,a=ve.value==="yes",o=v.value&&v.value.length>0?v.value:"testsecret",d={sub:ue.value||"demo-user",name:pe.value||"Alice Example",exp:t+n};a&&(d.iat=t);const l=z(me.value,{}),c=Object.assign({},d,l),r={alg:"HS256",typ:"JWT"};f.value=JSON.stringify(r,null,2),p.value=JSON.stringify(c,null,2),x(f.value,p.value),h(c);const s=C(r),b=C(c),y=await ae(s+"."+b,o),S=`${s}.${b}.${y}`;k.value=S,E.value=y,q.textContent=o==="testsecret"?'Signed with default secret "testsecret". For stronger tests, enter your own secret above.':"Signed with your HS256 secret.",u("ok","Sample JWT generated and signed (HS256).")}catch(t){u("err","Sample generation failed: "+t.message)}}async function Le(e){e&&(e.preventDefault(),e.stopPropagation());try{const t=be.value;let n;t==="RS256"?n=await crypto.subtle.generateKey({name:"RSASSA-PKCS1-v1_5",modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:"SHA-256"},!0,["sign","verify"]):n=await crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},!0,["sign","verify"]),g={alg:t,privateKey:n.privateKey,publicKey:n.publicKey};const a=new Uint8Array(await crypto.subtle.exportKey("spki",n.publicKey)),o=new Uint8Array(await crypto.subtle.exportKey("pkcs8",n.privateKey));U.value=le(a,"PUBLIC KEY"),Q.value=le(o,"PRIVATE KEY"),N.disabled=!1,X.textContent=`Keypair ready (${t}). Use the public key to verify minted tokens.`,u("ok",`Generated ${t} keypair (ephemeral).`)}catch(t){u("err","Keypair generation failed: "+t.message),N.disabled=!0}}function le(e,t){const n=btoa(String.fromCharCode(...e)).match(/.{1,64}/g).join(`
`);return`-----BEGIN ${t}-----
${n}
-----END ${t}-----`}async function Ue(e){e&&(e.preventDefault(),e.stopPropagation());try{if(!g.privateKey||!g.publicKey||!g.alg){u("err","Generate a keypair first.");return}const t=g.alg,n=Math.floor(Date.now()/1e3),a=parseInt(ge.value,10)||900,o={alg:t,typ:"JWT",kid:"ephem-1"},d={sub:he.value||"demo-user",name:Se.value||"Alice Example",iat:n,exp:n+a};f.value=JSON.stringify(o,null,2),p.value=JSON.stringify(d,null,2),x(f.value,p.value),h(d);const l=C(o),c=C(d),r=w.encode(`${l}.${c}`);let s;if(t==="RS256")s=new Uint8Array(await crypto.subtle.sign({name:"RSASSA-PKCS1-v1_5"},g.privateKey,r));else if(t==="ES256"){const j=new Uint8Array(await crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},g.privateKey,r));s=Ce(j)}else throw new Error(`Unsupported alg for mint: ${t}`);const b=O(s),y=`${l}.${c}.${b}`;k.value=y,E.value=b;const S=await crypto.subtle.exportKey("jwk",g.publicKey);S.kid="ephem-1",De(S),A.value=U.value,u("ok",`Minted ${t} token. Auto-added public JWK to JWKS (kid=ephem-1).`)}catch(t){u("err","Mint failed: "+t.message)}}function De(e){let t;try{t=K.value.trim()?JSON.parse(K.value):{keys:[]}}catch{t={keys:[]}}Array.isArray(t.keys)||(t.keys=[]);const n=t.keys.findIndex(a=>a.kid&&e.kid&&a.kid===e.kid);n>=0?t.keys[n]=e:t.keys.push(e),K.value=JSON.stringify(t,null,2),B()}function Oe(e){e&&(e.preventDefault(),e.stopPropagation()),k.value="",f.value="",p.value="",E.value="",v.value="",A.value="",K.value="",J.textContent="",U.value="",Q.value="",g={alg:null,privateKey:null,publicKey:null},m={keysByKid:new Map,list:[],parsed:!1},oe(),G(""),h(null),I.textContent="",L.textContent="",q.textContent="",X.textContent="",N.disabled=!0}i("jwt-forget-secret").addEventListener("click",e=>{e.preventDefault(),v.value=""});let F=!1;["jwt-encode-btn","jwt-decode-btn","jwt-clear-btn","gen-button","kp-generate","kp-mint"].forEach(e=>{const t=document.getElementById(e);t&&t.addEventListener("mousedown",()=>{F=!0})}),v.addEventListener("blur",()=>{if(F){F=!1;return}v.value=""}),i("jwt-decode-btn").addEventListener("click",re),i("jwt-encode-btn").addEventListener("click",We),i("jwt-clear-btn").addEventListener("click",Oe),ye.addEventListener("click",Ie),we.addEventListener("click",Le),N.addEventListener("click",Ue),K.addEventListener("input",B);let _=null;function P(){de.value!=="off"&&(_&&clearTimeout(_),_=setTimeout(()=>re(),250))}k.addEventListener("input",P),f.addEventListener("input",()=>{x(f.value,p.value),h(z(p.value,{}))}),p.addEventListener("input",()=>{x(f.value,p.value),h(z(p.value,{}))}),V.addEventListener("change",P),Z.addEventListener("change",P),A.addEventListener("input",P),v.addEventListener("input",P),typeof window.setupCopyButtons=="function"&&window.setupCopyButtons(),B()}function Ge(i,k){Re(i),Be()}export{Ge as load,Re as loadJWTTool,Be as setupJWTTool};
