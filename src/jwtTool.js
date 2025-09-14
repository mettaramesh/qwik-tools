// JWT Tool module – browser-only, no dependencies
// Adds: claim validation (exp/nbf/iat + skew), RS256/ES256 verify via JWK/PEM,
// UTF-8 safe base64url, key hygiene (forget/blur), dev hints (sizes/non-ASCII),
// security banner, HS256 Sample Generator, Ephemeral RS256/ES256 keypair + mint,
// Human-readable claims panel, and **JWKS input with kid auto-selection**.

export function loadJWTTool(container) {
  container.innerHTML = `
    <div class="tool-header">
      <h2>JWT Encoder/Decoder</h2>
      <p>Encode and decode JSON Web Tokens. Verify HS256, RS256, ES256 in-browser.</p>
    </div>

    <div class="security-banner" style="border:1px solid var(--warn,#f5a623); background:#fff7e6; padding:10px; margin-bottom:12px; font-size:0.95rem;">
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
        <div class="small muted" id="jwks-note" style="margin-top:4px;"></div>
      </div>

      <!-- Sample Token Generator (HS256) -->
      <div class="output-section" style="margin-top:16px;">
        <div class="section-header">
          <label class="form-label">Generate Sample Token (HS256)</label>
        </div>
        <div class="small muted" style="margin-bottom:8px;">
          Uses the Secret (HS256) above. If blank, defaults to <code>testsecret</code>. Outputs a fresh token into the main JWT field.
        </div>

        <div class="gen-grid" style="display:grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap:8px; align-items:end;">
          <div style="grid-column: span 2;">
            <label class="form-label">sub</label>
            <input id="gen-sub" class="form-control" type="text" placeholder="demo-user" value="demo-user">
          </div>
          <div style="grid-column: span 2;">
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
          <div style="grid-column: span 6;">
            <label class="form-label">Extra claims (JSON, optional)</label>
            <textarea id="gen-extra" class="form-control code-input" rows="3" placeholder='{"role":"tester"}'></textarea>
          </div>
          <div style="grid-column: span 2;">
            <button class="btn btn--primary" id="gen-button">Generate HS256</button>
          </div>
          <div class="small muted" id="gen-note" style="grid-column: span 4;"></div>
        </div>
      </div>

      <!-- Ephemeral Keypairs + Mint (RS256/ES256) -->
      <div class="output-section" style="margin-top:16px;">
        <div class="section-header">
          <label class="form-label">Ephemeral Keypair & Mint (RS256 / ES256)</label>
        </div>
        <div class="small muted" style="margin-bottom:8px;">
          Generates keys in-memory. Private keys are not persisted. Use the shown public key to verify minted tokens.
        </div>

        <div class="gen-grid" style="display:grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap:8px; align-items:end;">
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
  `;
}

export function setupJWTTool() {
  const $ = id => document.getElementById(id);

  const input = $('jwt-input');
  const header = $('jwt-header');
  const payload = $('jwt-payload');
  const signature = $('jwt-signature');
  const secret = $('jwt-secret');
  const pubkey = $('jwt-pubkey');
  const jwksBox = $('jwt-jwks');
  const jwksNote = $('jwks-note');
  const status = $('jwt-status');
  const hints = $('jwt-hints');
  const hdrSize = $('hdr-size');
  const pldSize = $('pld-size');
  const skewEl = $('jwt-skew');
  const claimsModeEl = $('jwt-claims-mode');
  const autoEl = $('jwt-auto');

  // HS256 generator
  const genSub = $('gen-sub');
  const genName = $('gen-name');
  const genTTL = $('gen-ttl');
  const genIat = $('gen-iat');
  const genExtra = $('gen-extra');
  const genBtn = $('gen-button');
  const genNote = $('gen-note');

  // Keypair/mint
  const kpAlg = $('kp-alg');
  const kpTTL = $('kp-ttl');
  const kpSub = $('kp-sub');
  const kpName = $('kp-name');
  const kpGen = $('kp-generate');
  const kpMint = $('kp-mint');
  const kpNote = $('kp-note');
  const kpPub = $('kp-pub');
  const kpPriv = $('kp-priv');

  // Human-readable claims elements
  const hr = {
    iat: { local: $('hr-iat-local'), utc: $('hr-iat-utc'), rel: $('hr-iat-rel') },
    nbf: { local: $('hr-nbf-local'), utc: $('hr-nbf-utc'), rel: $('hr-nbf-rel') },
    exp: { local: $('hr-exp-local'), utc: $('hr-exp-utc'), rel: $('hr-exp-rel') },
  };

  // In-memory state
  let ephem = { alg: null, privateKey: null, publicKey: null };
  let jwksState = { keysByKid: new Map(), list: [], parsed: false };

  // ---------- UTF-8 + base64url helpers ----------
  const te = new TextEncoder();
  const td = new TextDecoder();

  function bytesToB64url(bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'');
  }
  function b64urlToBytes(b64url) {
    let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function jsonToB64url(obj) { return bytesToB64url(te.encode(JSON.stringify(obj))); }
  function b64urlToJSON(b64) { return JSON.parse(td.decode(b64urlToBytes(b64))); }
  function isValidB64url(str) { return /^[A-Za-z0-9_-]+$/.test(str) && str.length > 0; }
  function hasNonASCII(str) { for (let i=0;i<str.length;i++) if (str.charCodeAt(i) > 127) return true; return false; }

  // ---------- Crypto helpers ----------
  async function importHmacKey(secretStr) {
    return crypto.subtle.importKey('raw', te.encode(secretStr), { name:'HMAC', hash:'SHA-256' }, false, ['sign','verify']);
  }
  async function signHS256(msgStr, secretStr) {
    const key = await importHmacKey(secretStr);
    const sig = await crypto.subtle.sign('HMAC', key, te.encode(msgStr));
    return bytesToB64url(new Uint8Array(sig));
  }
  async function verifyHS256(msgStr, sigB64url, secretStr) {
    const key = await importHmacKey(secretStr);
    return crypto.subtle.verify('HMAC', key, b64urlToBytes(sigB64url), te.encode(msgStr));
  }

  // RS/ES import & verify
  async function importPublicKeyAuto(jwkOrPem, alg) {
    const isJSON = jwkOrPem.trim().startsWith('{');
    if (isJSON) {
      const jwk = JSON.parse(jwkOrPem);
      return importPublicJWK(jwk, alg);
    } else {
      const pem = jwkOrPem.replace(/\r/g,'').trim();
      const m = pem.match(/-----BEGIN PUBLIC KEY-----([A-Za-z0-9+/=\n]+)-----END PUBLIC KEY-----/);
      if (!m) throw new Error('PEM must be SPKI with BEGIN PUBLIC KEY / END PUBLIC KEY');
      const der = Uint8Array.from(atob(m[1].replace(/\s+/g,'')), c => c.charCodeAt(0));
      if (alg === 'RS256') {
        return crypto.subtle.importKey('spki', der.buffer, { name:'RSASSA-PKCS1-v1_5', hash:'SHA-256' }, false, ['verify']);
      } else if (alg === 'ES256') {
        return crypto.subtle.importKey('spki', der.buffer, { name:'ECDSA', namedCurve:'P-256' }, false, ['verify']);
      }
      throw new Error(`Unsupported alg for PEM: ${alg}`);
    }
  }

  async function importPublicJWK(jwk, alg) {
    if (alg === 'RS256') {
      if (jwk.kty !== 'RSA') throw new Error('JWK kty must be RSA for RS256');
      return crypto.subtle.importKey('jwk', jwk, { name:'RSASSA-PKCS1-v1_5', hash:'SHA-256' }, false, ['verify']);
    } else if (alg === 'ES256') {
      if (jwk.kty !== 'EC' || jwk.crv !== 'P-256') throw new Error('JWK must be EC P-256 for ES256');
      return crypto.subtle.importKey('jwk', jwk, { name:'ECDSA', namedCurve:'P-256' }, false, ['verify']);
    }
    throw new Error(`Unsupported alg for JWK: ${alg}`);
  }

  // ECDSA DER <-> JOSE
  function joseToDerES256(sig) {
    const r = sig.slice(0, 32);
    const s = sig.slice(32, 64);
    function stripLeadingZeros(buf) { let i=0; while (i<buf.length-1 && buf[i]===0x00) i++; return buf.slice(i); }
    function toIntegerDER(bytes) {
      let v = stripLeadingZeros(bytes);
      if (v[0] & 0x80) v = Uint8Array.from([0x00, ...v]);
      return Uint8Array.from([0x02, v.length, ...v]);
    }
    const rDer = toIntegerDER(r);
    const sDer = toIntegerDER(s);
    const seqLen = rDer.length + sDer.length;
    return Uint8Array.from([0x30, seqLen, ...rDer, ...sDer]);
  }
  function derToJoseES256(derBytes) {
    let i = 0;
    if (derBytes[i++] !== 0x30) throw new Error('Bad DER');
    i++; // seq len (short form)
    if (derBytes[i++] !== 0x02) throw new Error('Bad DER r');
    const rLen = derBytes[i++]; const r = derBytes.slice(i, i + rLen); i += rLen;
    if (derBytes[i++] !== 0x02) throw new Error('Bad DER s');
    const sLen = derBytes[i++]; const s = derBytes.slice(i, i + sLen);
    function leftPad32(bytes) { const out = new Uint8Array(32); out.set(bytes, 32 - bytes.length); return out; }
    const r32 = leftPad32(r[0] === 0x00 ? r.slice(1) : r);
    const s32 = leftPad32(s[0] === 0x00 ? s.slice(1) : s);
    const out = new Uint8Array(64); out.set(r32, 0); out.set(s32, 32); return out;
  }

  async function verifyRSorES(msg, sigB64url, alg, keyMaterialOrJwk) {
    const key = (typeof keyMaterialOrJwk === 'string')
      ? await importPublicKeyAuto(keyMaterialOrJwk, alg)
      : await importPublicJWK(keyMaterialOrJwk, alg);

    const data = te.encode(msg);
    const sigBytes = b64urlToBytes(sigB64url);
    if (alg === 'RS256') {
      return crypto.subtle.verify({ name:'RSASSA-PKCS1-v1_5' }, key, sigBytes, data);
    } else if (alg === 'ES256') {
      const der = joseToDerES256(sigBytes);
      return crypto.subtle.verify({ name:'ECDSA', hash:'SHA-256' }, key, der, data);
    }
    throw new Error(`Unsupported alg: ${alg}`);
  }

  // ---------- JWKS parsing / selection ----------
  function parseJWKS() {
    jwksState = { keysByKid: new Map(), list: [], parsed: false };
    const txt = (jwksBox.value || '').trim();
    if (!txt) { jwksNote.textContent = ''; return; }
    try {
      const obj = JSON.parse(txt);
      if (!obj || !Array.isArray(obj.keys)) { jwksNote.textContent = 'JWKS: expected an object with "keys" array.'; return; }
      obj.keys.forEach(jwk => {
        jwksState.list.push(jwk);
        if (jwk.kid) jwksState.keysByKid.set(jwk.kid, jwk);
      });
      jwksState.parsed = true;
      jwksNote.textContent = `JWKS loaded: ${jwksState.list.length} key(s). ${jwksState.keysByKid.size} with kid.`;
    } catch (e) {
      jwksNote.textContent = 'JWKS parse error: ' + e.message;
    }
  }

  function pickJWKFor(hdrAlg, hdrKid) {
    if (!jwksState.parsed || jwksState.list.length === 0) return null;
    // 1) kid match
    if (hdrKid && jwksState.keysByKid.has(hdrKid)) {
      return jwksState.keysByKid.get(hdrKid);
    }
    // 2) single-key fallback if alg matches
    if (!hdrKid && jwksState.list.length === 1) {
      const only = jwksState.list[0];
      if (!only.alg || only.alg === hdrAlg) return only;
    }
    // 3) try first alg-matching key
    const m = jwksState.list.find(k => !k.alg || k.alg === hdrAlg);
    return m || null;
  }

  // ---------- Status / hints ----------
  function setStatus(kind, text) { status.className = kind === 'ok' ? 'success-message' : 'error-message'; status.textContent = text; status.classList.remove('hidden'); }
  function clearStatus() { status.className = 'hidden'; status.textContent = ''; }
  function setHints(text) { hints.textContent = text || ''; }
  function updateSizes(hStr, pStr) {
    try {
      const hdrObj = JSON.parse(hStr || '{}');
      const pldObj = JSON.parse(pStr || '{}');
      const hdrBytes = te.encode(JSON.stringify(hdrObj)).length;
      const pldBytes = te.encode(JSON.stringify(pldObj)).length;
      hdrSize.textContent = `Header size: ${hdrBytes} bytes (UTF-8)`;
      pldSize.textContent = `Payload size: ${pldBytes} bytes (UTF-8)`;
      const warnHdr = hasNonASCII(JSON.stringify(hdrObj));
      const warnPld = hasNonASCII(JSON.stringify(pldObj));
      const notes = [];
      if (warnHdr) notes.push('Header contains non-ASCII (UTF-8 required).');
      if (warnPld) notes.push('Payload contains non-ASCII (UTF-8 required).');
      setHints(notes.join(' '));
    } catch { hdrSize.textContent = ''; pldSize.textContent = ''; setHints(''); }
  }

  // ---------- Human-readable claims ----------
  function fmtLocal(ts) { return ts ? new Date(ts*1000).toLocaleString() : '—'; }
  function fmtUTC(ts) { return ts ? new Date(ts*1000).toISOString().replace('T',' ').replace('Z',' UTC') : '—'; }
  function fmtRel(ts) {
    if (!ts) return '—';
    const now = Math.floor(Date.now()/1000);
    const d = ts - now;
    const abs = Math.abs(d);
    const h = Math.floor(abs/3600), m = Math.floor((abs%3600)/60), s = abs%60;
    const hh = h ? `${h}h ` : ''; const mm = m ? `${m}m ` : ''; const ss = `${s}s`;
    return d >= 0 ? `in ${hh}${mm}${ss}`.trim() : `${hh}${mm}${ss} ago`.trim();
  }
  function updateHumanClaims(pld) {
    const fields = ['iat','nbf','exp'];
    for (const f of fields) {
      const v = (pld && typeof pld[f] === 'number') ? pld[f] : null;
      hr[f].local.textContent = fmtLocal(v);
      hr[f].utc.textContent   = fmtUTC(v);
      hr[f].rel.textContent   = fmtRel(v);
    }
  }

  // ---------- Claims ----------
  function nowSeconds() { return Math.floor(Date.now() / 1000); }
  function readSkew() { const v = parseInt(skewEl.value, 10); return Number.isFinite(v) && v >= 0 ? v : 0; }
  function claimsMode() { return claimsModeEl.value; }
  function validateClaims(payloadObj, skewSec) {
    const t = nowSeconds();
    const msgs = [];
    let ok = true;
    if (typeof payloadObj.exp === 'number') { if (t > payloadObj.exp + skewSec) { msgs.push('Token expired (exp).'); ok = false; } }
    if (typeof payloadObj.nbf === 'number') { if (t < payloadObj.nbf - skewSec) { msgs.push('Token not yet valid (nbf).'); ok = false; } }
    if (typeof payloadObj.iat === 'number') { if (payloadObj.iat > t + skewSec) { msgs.push('Issued-at (iat) is in the future.'); ok = false; } }
    return { ok, msgs };
  }

  // ---------- Decode & Verify ----------
  async function decodeJWT(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    try {
      const token = (input.value || '').trim();
      updateSizes(header.value, payload.value);
      if (!token) { clearStatus(); updateHumanClaims(null); return; }

      const parts = token.split('.');
      if (!([2,3].includes(parts.length)) || !isValidB64url(parts[0]) || !isValidB64url(parts[1])) {
        throw new Error('Invalid JWT structure or base64url segments.');
      }

      const hdr = b64urlToJSON(parts[0]);
      header.value = JSON.stringify(hdr, null, 2);

      const pld = b64urlToJSON(parts[1]);
      payload.value = JSON.stringify(pld, null, 2);
      updateSizes(header.value, payload.value);
      updateHumanClaims(pld);

      if (parts.length === 3 && parts[2]) {
        if (!isValidB64url(parts[2])) throw new Error('Invalid signature encoding.');
        signature.value = parts[2];
      } else {
        signature.value = '';
      }

      const skew = readSkew();
      const clMode = claimsMode();
      const { ok: claimsOK, msgs: claimMsgs } = validateClaims(pld, skew);

      if (parts.length === 3 && parts[2]) {
        const alg = hdr.alg;
        if (!alg) { setStatus('err', 'Missing alg in header.'); return; }
        const toVerify = parts[0] + '.' + parts[1];
        let sigOK = false;

        if (alg === 'HS256') {
          if (!secret.value) { setStatus('ok', composeStatus('JWT decoded (no HS256 secret provided)', claimMsgs, clMode, claimsOK)); return; }
          sigOK = await verifyHS256(toVerify, parts[2], secret.value);
        } else if (alg === 'RS256' || alg === 'ES256') {
          // Priority: explicit Public Key -> JWKS[kid] -> JWKS single/fallback -> none
          const explicitPK = (pubkey.value || '').trim();
          let selected = null;
          let selectedDesc = '';
          if (explicitPK) {
            selected = explicitPK; // string -> import later
            selectedDesc = 'Public Key (manual)';
          } else {
            const kid = hdr.kid;
            const jwk = pickJWKFor(alg, kid);
            if (jwk) {
              selected = jwk; // JWK object
              selectedDesc = jwk.kid ? `JWKS (kid=${jwk.kid})` : 'JWKS (single/fallback)';
            }
          }

          if (!selected) {
            setStatus('ok', composeStatus(`JWT decoded (${alg} key not provided)`, claimMsgs, clMode, claimsOK));
            return;
          }

          try {
            sigOK = await verifyRSorES(toVerify, parts[2], alg, selected);
          } catch (impErr) {
            setStatus('err', `Key import failed: ${impErr.message}`);
            return;
          }

          if (!sigOK) { setStatus('err', `Signature invalid (${selectedDesc}).`); return; }
          const baseMsg = `Signature valid (${alg}, ${selectedDesc})`;
          if (clMode === 'enforce' && !claimsOK) { setStatus('err', 'Signature valid but claims invalid: ' + claimMsgs.join(' ')); return; }
          setStatus(clMode === 'off' || claimsOK ? 'ok' : 'err', composeStatus(baseMsg, claimMsgs, clMode, claimsOK));
        } else {
          setStatus('err', `Unsupported alg="${alg}". Only HS256, RS256, ES256 supported.`);
          return;
        }

        if (alg === 'HS256') {
          if (!sigOK) { setStatus('err', 'Signature invalid.'); return; }
          const baseMsg = 'Signature valid (HS256)';
          if (clMode === 'enforce' && !claimsOK) { setStatus('err', 'Signature valid but claims invalid: ' + claimMsgs.join(' ')); return; }
          setStatus(clMode === 'off' || claimsOK ? 'ok' : 'err', composeStatus(baseMsg, claimMsgs, clMode, claimsOK));
        }
      } else {
        if (hdr.alg && hdr.alg !== 'none') {
          setStatus('err', `Header alg="${hdr.alg}" but token is unsigned.`);
        } else {
          const baseMsg = 'Unsigned JWT decoded';
          if (clMode === 'enforce' && !validateClaims(pld, skew).ok) {
            setStatus('err', baseMsg + ' but claims invalid.');
          } else {
            setStatus('ok', composeStatus(baseMsg, claimMsgs, clMode, claimsOK));
          }
        }
      }
    } catch (err) {
      setStatus('err', 'Invalid JWT: ' + err.message);
      header.value = '';
      payload.value = '';
      signature.value = '';
      updateHumanClaims(null);
    }
  }
  function composeStatus(base, claimMsgs, mode, claimsOK) {
    if (mode === 'off' || claimMsgs.length === 0) return base;
    const join = ' ' + (claimsOK ? '(claims OK)' : '(claims warnings)') + ' ' + claimMsgs.join(' ');
    if (mode === 'warn') return base + join;
    if (mode === 'enforce') return base + (claimsOK ? ' (claims OK)' : ' (claims invalid) ' + claimMsgs.join(' '));
    return base;
  }

  // ---------- Encode (manual textareas) ----------
  async function encodeJWT(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    try {
      let hdrStr = (header.value || '').trim();
      let pldStr = (payload.value || '').trim();

      if (!hdrStr && !pldStr) { setStatus('err', 'Header and payload cannot both be empty.'); return; }
      if (!hdrStr) hdrStr = '{"alg":"HS256","typ":"JWT"}';
      if (!pldStr) pldStr = '{"sub":"1234567890","name":"John Doe","iat":1516239022}';

      const hdr = JSON.parse(hdrStr);
      const pld = JSON.parse(pldStr);

      const wantsSignature = !!secret.value || !!pubkey.value;
      if (secret.value) {
        if (hdr.alg && hdr.alg !== 'HS256') throw new Error(`Header alg="${hdr.alg}" incompatible with HS256 signing. Use "HS256".`);
        hdr.alg = 'HS256';
      } else if (!hdr.alg) {
        hdr.alg = 'HS256';
      }

      const hStr = jsonToB64url(hdr);
      const pStr = jsonToB64url(pld);

      let sig = '';
      if (secret.value && hdr.alg === 'HS256') {
        sig = await signHS256(hStr + '.' + pStr, secret.value);
      }

      const jwt = hStr + '.' + pStr + (sig ? '.' + sig : '');
      input.value = jwt;
      signature.value = sig;

      updateSizes(header.value, payload.value);
      updateHumanClaims(pld);
      setStatus('ok', sig ? 'JWT encoded and signed (HS256)' : 'JWT encoded (no signature)');
    } catch (err) {
      setStatus('err', 'Encode error: ' + err.message);
    }
  }

  // ---------- Sample Generator (HS256) ----------
  function safeParseJSON(text, fallback = {}) {
    if (!text || !text.trim()) return fallback;
    try { return JSON.parse(text); } catch { return fallback; }
  }
  async function generateSampleHS256(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    try {
      const now = Math.floor(Date.now()/1000);
      const ttl = parseInt(genTTL.value, 10) || 900;
      const useIat = genIat.value === 'yes';
      const sec = (secret.value && secret.value.length > 0) ? secret.value : 'testsecret';

      const baseClaims = { sub: (genSub.value || 'demo-user'), name: (genName.value || 'Alice Example'), exp: now + ttl };
      if (useIat) baseClaims.iat = now;
      const extra = safeParseJSON(genExtra.value, {});
      const pld = Object.assign({}, baseClaims, extra);
      const hdr = { alg: 'HS256', typ: 'JWT' };

      header.value = JSON.stringify(hdr, null, 2);
      payload.value = JSON.stringify(pld, null, 2);
      updateSizes(header.value, payload.value);
      updateHumanClaims(pld);

      const hStr = jsonToB64url(hdr);
      const pStr = jsonToB64url(pld);
      const sig = await signHS256(hStr + '.' + pStr, sec);
      const jwt = `${hStr}.${pStr}.${sig}`;

      input.value = jwt;
      signature.value = sig;

      genNote.textContent = sec === 'testsecret'
        ? 'Signed with default secret "testsecret". For stronger tests, enter your own secret above.'
        : 'Signed with your HS256 secret.';
      setStatus('ok', 'Sample JWT generated and signed (HS256).');
    } catch (err) { setStatus('err', 'Sample generation failed: ' + err.message); }
  }

  // ---------- Ephemeral Keypair + Mint (RS256/ES256) ----------
  async function generateKeypair(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    try {
      const alg = kpAlg.value;
      let keyPair;
      if (alg === 'RS256') {
        keyPair = await crypto.subtle.generateKey(
          { name:'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([0x01,0x00,0x01]), hash:'SHA-256' },
          true, ['sign','verify']);
      } else {
        keyPair = await crypto.subtle.generateKey(
          { name:'ECDSA', namedCurve:'P-256' },
          true, ['sign','verify']);
      }
      ephem = { alg, privateKey: keyPair.privateKey, publicKey: keyPair.publicKey };

      const spki = new Uint8Array(await crypto.subtle.exportKey('spki', keyPair.publicKey));
      const pkcs8 = new Uint8Array(await crypto.subtle.exportKey('pkcs8', keyPair.privateKey));
      kpPub.value  = toPem(spki, 'PUBLIC KEY');
      kpPriv.value = toPem(pkcs8, 'PRIVATE KEY');
      kpMint.disabled = false;
      kpNote.textContent = `Keypair ready (${alg}). Use the public key to verify minted tokens.`;
      setStatus('ok', `Generated ${alg} keypair (ephemeral).`);
    } catch (err) {
      setStatus('err', 'Keypair generation failed: ' + err.message);
      kpMint.disabled = true;
    }
  }

  function toPem(derBytes, label) {
    const b64 = btoa(String.fromCharCode(...derBytes)).match(/.{1,64}/g).join('\n');
    return `-----BEGIN ${label}-----\n${b64}\n-----END ${label}-----`;
  }

  async function mintWithKeypair(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    try {
      if (!ephem.privateKey || !ephem.publicKey || !ephem.alg) { setStatus('err', 'Generate a keypair first.'); return; }
      const alg = ephem.alg;
      const now = Math.floor(Date.now()/1000);
      const ttl = parseInt(kpTTL.value, 10) || 900;

      const hdr = { alg, typ:'JWT', kid: 'ephem-1' };
      const pld = { sub: (kpSub.value || 'demo-user'), name: (kpName.value || 'Alice Example'), iat: now, exp: now + ttl };

      header.value = JSON.stringify(hdr, null, 2);
      payload.value = JSON.stringify(pld, null, 2);
      updateSizes(header.value, payload.value);
      updateHumanClaims(pld);

      const hStr = jsonToB64url(hdr);
      const pStr = jsonToB64url(pld);
      const data = te.encode(`${hStr}.${pStr}`);

      let sigBytes;
      if (alg === 'RS256') {
        sigBytes = new Uint8Array(await crypto.subtle.sign({ name:'RSASSA-PKCS1-v1_5' }, ephem.privateKey, data));
      } else if (alg === 'ES256') {
        const der = new Uint8Array(await crypto.subtle.sign({ name:'ECDSA', hash:'SHA-256' }, ephem.privateKey, data));
        sigBytes = derToJoseES256(der);
      } else { throw new Error(`Unsupported alg for mint: ${alg}`); }

      const sig = bytesToB64url(sigBytes);
      const jwt = `${hStr}.${pStr}.${sig}`;

      input.value = jwt;
      signature.value = sig;

      // convenience: inject this key into JWKS with kid=ephem-1 so auto-selection works
      const pubJwk = await crypto.subtle.exportKey('jwk', ephem.publicKey);
      pubJwk.kid = 'ephem-1';
      injectIntoJWKS(pubJwk);

      // also mirror into Public Key box
      pubkey.value = kpPub.value;

      setStatus('ok', `Minted ${alg} token. Auto-added public JWK to JWKS (kid=ephem-1).`);
    } catch (err) { setStatus('err', 'Mint failed: ' + err.message); }
  }

  function injectIntoJWKS(jwk) {
    let obj;
    try { obj = jwksBox.value.trim() ? JSON.parse(jwksBox.value) : { keys: [] }; } catch { obj = { keys: [] }; }
    if (!Array.isArray(obj.keys)) obj.keys = [];
    // replace by kid if exists
    const i = obj.keys.findIndex(k => k.kid && jwk.kid && k.kid === jwk.kid);
    if (i >= 0) obj.keys[i] = jwk; else obj.keys.push(jwk);
    jwksBox.value = JSON.stringify(obj, null, 2);
    parseJWKS();
  }

  // ---------- Clear ----------
  function clearAll(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    input.value = '';
    header.value = '';
    payload.value = '';
    signature.value = '';
    secret.value = '';
    pubkey.value = '';
    jwksBox.value = '';
    jwksNote.textContent = '';
    kpPub.value = '';
    kpPriv.value = '';
    ephem = { alg:null, privateKey:null, publicKey:null };
    jwksState = { keysByKid: new Map(), list: [], parsed: false };
    clearStatus();
    setHints('');
    updateHumanClaims(null);
    hdrSize.textContent = '';
    pldSize.textContent = '';
    genNote.textContent = '';
    kpNote.textContent = '';
    kpMint.disabled = true;
  }

  // ---------- Key hygiene ----------
  $('jwt-forget-secret').addEventListener('click', (e) => { e.preventDefault(); secret.value = ''; });
  //secret.addEventListener('blur', () => { secret.value = ''; }); // auto clear on blur
  let suppressSecretClear = false;
  ['jwt-encode-btn','jwt-decode-btn','jwt-clear-btn','gen-button','kp-generate','kp-mint']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('mousedown', () => { suppressSecretClear = true; });
    });

  secret.addEventListener('blur', () => {
    if (suppressSecretClear) { suppressSecretClear = false; return; }
    secret.value = '';
  });


  // ---------- Wiring ----------
  $('jwt-decode-btn').addEventListener('click', decodeJWT);
  $('jwt-encode-btn').addEventListener('click', encodeJWT);
  $('jwt-clear-btn').addEventListener('click', clearAll);
  genBtn.addEventListener('click', generateSampleHS256);
  kpGen.addEventListener('click', generateKeypair);
  kpMint.addEventListener('click', mintWithKeypair);
  jwksBox.addEventListener('input', parseJWKS);

  // Debounced auto-verify
  let t = null;
  function maybeAutoDecode() {
    if (autoEl.value === 'off') return;
    if (t) clearTimeout(t);
    t = setTimeout(() => decodeJWT(), 250);
  }
  input.addEventListener('input', maybeAutoDecode);
  header.addEventListener('input', () => { updateSizes(header.value, payload.value); updateHumanClaims(safeParseJSON(payload.value, {})); });
  payload.addEventListener('input', () => { updateSizes(header.value, payload.value); updateHumanClaims(safeParseJSON(payload.value, {})); });
  skewEl.addEventListener('change', maybeAutoDecode);
  claimsModeEl.addEventListener('change', maybeAutoDecode);
  pubkey.addEventListener('input', maybeAutoDecode);
  secret.addEventListener('input', maybeAutoDecode);

  if (typeof window.setupCopyButtons === 'function') window.setupCopyButtons();

  // Parse any prefilled JWKS on load
  parseJWKS();
}

export function load(container, toolId) {
  loadJWTTool(container);
  setupJWTTool();
}
