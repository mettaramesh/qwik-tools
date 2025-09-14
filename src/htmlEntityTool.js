// HTML Encoder/Decoder Tool - browser-only, no dependencies
// Features:
//  - Encode / Decode HTML entities (named + numeric)
//  - Visible toggles: Numeric-encode non-ASCII
//  - Sanitization level dropdown (Off / Moderate / Aggressive)
//  - Preview isolated in sandboxed iframe (safe) OR escaped text
//  - Single-click toggle: open preview -> subsequent clicks switch Rendered <-> Escaped
//  - Shows sanitization level caption under preview
//  - Shift+Click Encode forces numeric encoding
//  - Keyboard shortcuts: Ctrl/Cmd+E (Encode), Ctrl/Cmd+D (Decode), Ctrl/Cmd+K (Clear), Ctrl/Cmd+Shift+C (Copy)

export function loadHTMLEntityTool(container) {
  container.innerHTML = `
    <div class="tool-header">
      <h2>HTML Encoder/Decoder</h2>
      <p class="small">Encode or decode HTML entities. Supports named and numeric entities. Useful for escaping/unescaping HTML in text, code, or data.</p>
    </div>
    <div class="card">
      <div class="row">
        <label for="htmlInput" class="form-label">Input</label>
        <textarea id="htmlInput" class="form-control" rows="6" placeholder="Paste or type HTML or text..."></textarea>
      </div>

      <div class="row" style="margin-top:12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <button class="btn btn--primary" id="btnEncode">Encode HTML</button>
        <button class="btn btn--outline" id="btnDecode">Decode HTML</button>
        <button class="btn btn--outline" id="btnClear">Clear</button>
        <button class="btn btn--outline" id="btnCopy">Copy Output</button>

        <!-- Visible toggles -->
        <label style="margin-left:8px;display:flex;align-items:center;gap:6px;font-size:.9rem;">
          <input id="toggleNumericEncode" type="checkbox" />
          Numeric-encode non-ASCII
        </label>

        <label style="display:flex;align-items:center;gap:6px;font-size:.9rem;">
          <select id="sanitizationLevel" style="font-size:.9rem;padding:4px;border-radius:4px;">
            <option value="off">Sanitize: Off</option>
            <option value="moderate" selected>Sanitize: Moderate</option>
            <option value="aggressive">Sanitize: Aggressive</option>
          </select>
        </label>
      </div>

      <div class="row" style="margin-top:12px;">
        <label for="htmlOutput" class="form-label">Output</label>
        <textarea id="htmlOutput" class="form-control" rows="6" readonly placeholder="Result will appear here..."></textarea>
      </div>
      <div class="row" style="margin-top:8px;">
        <span id="htmlStatus" class="small muted"></span>
      </div>
      <div class="row" style="margin-top:12px;">
        <button class="btn btn--outline" id="btnToggleView">Show Preview</button>
      </div>

      <!-- Preview container: iframe (rendered preview) + escaped block + caption -->
      <div class="row" style="margin-top:12px;">
        <div id="htmlPreviewContainer" class="form-control" style="min-height:120px;background:#f8f9fa;border:1.5px solid var(--color-border,#e0e0e0);border-radius:8px;padding:12px 14px;font-size:0.95rem;overflow:auto;">
          <iframe id="htmlPreviewFrame" sandbox style="width:100%;height:260px;border:1px solid rgba(0,0,0,0.06);border-radius:6px;display:none;background:white;"></iframe>
          <pre id="htmlPreviewEscaped" style="white-space:pre-wrap;word-wrap:break-word;margin:0;display:none;background:transparent;border:none;padding:0;"></pre>
          <div id="htmlPreviewCaption" class="small muted" style="margin-top:8px;color:var(--muted,#666);"></div>
        </div>
      </div>
    </div>
  `;
}

export function setupHTMLEntityTool(container) {
  const el = id => container.querySelector('#'+id);
  const input = el('htmlInput');
  const output = el('htmlOutput');
  const btnEncode = el('btnEncode');
  const btnDecode = el('btnDecode');
  const btnClear = el('btnClear');
  const btnCopy = el('btnCopy');
  const btnToggleView = el('btnToggleView');
  const previewContainer = el('htmlPreviewContainer');
  const previewFrame = el('htmlPreviewFrame');
  const previewEscaped = el('htmlPreviewEscaped');
  const previewCaption = el('htmlPreviewCaption');
  const status = el('htmlStatus');
  const toggleNumericEncode = el('toggleNumericEncode');
  const sanitizationLevel = el('sanitizationLevel');

  let uiPanelVisible = false;
  let previewMode = 'render'; // 'render' or 'escaped'

  // ---------- Helpers ----------
  function setStatus(msg, ok=true, autoClearMs = 2500) {
    status.textContent = msg || '';
    status.style.color = ok ? 'var(--color-success,#21808d)' : 'var(--color-error,#c0392b)';
    if (msg) status.classList.remove('muted'); else status.classList.add('muted');
    if (autoClearMs && msg) {
      setTimeout(() => {
        if (status.textContent === msg) {
          status.textContent = '';
          status.classList.add('muted');
        }
      }, autoClearMs);
    }
  }

  function copyToClipboard(text) {
    if (!text) return Promise.resolve(false);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
    } else {
      return Promise.resolve(fallbackCopy(text));
    }
  }

  function fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand && document.execCommand('copy');
      document.body.removeChild(ta);
      return !!ok;
    } catch (e) { return false; }
  }

  // Encode using DOM text node to prevent double-encoding
  function encodeHTML_DOMEscape(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  }

  // Convert non-ASCII characters (code > 127) into numeric hex entities (&#xHH;)
  function convertNonAsciiToNumericEntities(escapedHtml) {
    let out = '';
    for (let i = 0; i < escapedHtml.length; i++) {
      const ch = escapedHtml.charAt(i);
      const code = escapedHtml.charCodeAt(i);
      // Preserve entities (starting with &...;)
      if (ch === '&') {
        const semi = escapedHtml.indexOf(';', i);
        if (semi > i) {
          out += escapedHtml.slice(i, semi + 1);
          i = semi;
          continue;
        }
      }
      if (code > 127) {
        out += '&#x' + code.toString(16).toUpperCase() + ';';
      } else {
        out += ch;
      }
    }
    return out;
  }

  function encodeHTML(str, { toNumericNonAscii = false } = {}) {
    const basicEscaped = encodeHTML_DOMEscape(str);
    if (toNumericNonAscii) return convertNonAsciiToNumericEntities(basicEscaped);
    return basicEscaped;
  }

  // ---------- decodeHTML (strip tags but preserve hierarchy) ----------
  function decodeHTML(str) {
    if (str === null || str === undefined) return '';
    const s = String(str);

    // If input is a full document, attempt to extract body HTML for hierarchy extraction,
    // but still strip tags and keep text hierarchy.
    let htmlToParse = s;
    if (/\<!doctype/i.test(s) || /<html[\s>]/i.test(s)) {
      try {
        const tpl = document.createElement('template');
        tpl.innerHTML = s;
        const body = tpl.content.querySelector('body');
        if (body) htmlToParse = body.innerHTML;
        else htmlToParse = tpl.innerHTML;
      } catch (e) {
        htmlToParse = s;
      }
    }

    if (!/[<>]/.test(htmlToParse) && !/&[a-zA-Z0-9#]+;/.test(htmlToParse)) {
      return htmlToParse.trim();
    }

    const tpl = document.createElement('template');
    tpl.innerHTML = htmlToParse;

    function nodeToText(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.nodeValue.replace(/\s+/g, ' ');
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return '';

      const tag = node.tagName.toLowerCase();

      const inlineTags = new Set(['span','a','strong','b','em','i','u','small','abbr','cite','code','sub','sup','time','mark']);
      const blockTags = new Set(['p','div','section','article','header','footer','aside','figure','figcaption','main','nav','address']);
      const headingTags = new Set(['h1','h2','h3','h4','h5','h6']);
      let text = '';

      if (headingTags.has(tag)) {
        text += '\n' + node.textContent.replace(/\s+/g,' ').trim() + '\n\n';
        return text;
      }

      if (tag === 'br') return '\n';
      if (tag === 'hr') return '\n---\n';

      if (tag === 'li') {
        const parentTag = node.parentElement && node.parentElement.tagName.toLowerCase();
        if (parentTag === 'ol') {
          const idx = Array.prototype.indexOf.call(node.parentElement.children, node) + 1;
          text += '\n' + idx + '. ';
        } else {
          text += '\n- ';
        }
        for (const child of node.childNodes) text += nodeToText(child);
        text += '\n';
        return text;
      }

      if (tag === 'ul' || tag === 'ol') {
        for (const child of node.childNodes) text += nodeToText(child);
        text += '\n';
        return text;
      }

      if (tag === 'table') {
        const rows = node.querySelectorAll('tr');
        for (const r of rows) {
          const cells = Array.from(r.children).map(c => nodeToText(c).trim());
          text += '\n' + cells.join('\t') + '\n';
        }
        text += '\n';
        return text;
      }

      if (blockTags.has(tag)) {
        text += '\n';
        for (const child of node.childNodes) text += nodeToText(child);
        text += '\n';
        return text;
      }

      if (tag === 'blockquote') {
        text += '\n> ';
        for (const child of node.childNodes) text += nodeToText(child);
        text += '\n';
        return text;
      }

      if (tag === 'img') {
        const alt = node.getAttribute('alt') || '';
        const src = node.getAttribute('src') || '';
        if (alt) text += `[img: ${alt}]`;
        else if (src) text += `[img: ${src}]`;
        else text += '[img]';
        return text;
      }

      for (const child of node.childNodes) text += nodeToText(child);

      if (tag === 'a') {
        const href = node.getAttribute('href');
        const inner = node.textContent.replace(/\s+/g,' ').trim();
        if (href && href.trim() && inner && !inner.includes(href)) {
          return inner + ' (' + href + ')';
        }
      }

      return text;
    }

    let out = '';
    for (const child of tpl.content.childNodes) out += nodeToText(child);

    out = out.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    return out;
  }

  // ---------- Sanitizers ----------
  function sanitizeModerate(htmlString) {
    const tpl = document.createElement('template');
    tpl.innerHTML = htmlString;
    const forbiddenTags = new Set(['script','iframe','object','embed','link','meta']);
    const walker = document.createTreeWalker(tpl.content, NodeFilter.SHOW_ELEMENT, null, false);
    const nodesToRemove = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const tag = node.tagName && node.tagName.toLowerCase();
      if (forbiddenTags.has(tag)) { nodesToRemove.push(node); continue; }
      const attrs = Array.from(node.attributes || []);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        const val = (attr.value || '').toLowerCase();
        if (name.startsWith('on')) node.removeAttribute(attr.name);
        else if ((name === 'href' || name === 'src' || name === 'xlink:href') && val.trim().startsWith('javascript:')) node.removeAttribute(attr.name);
        else if (name === 'srcset') {
          try {
            const parts = attr.value.split(',').map(p => p.trim()).filter(p => !p.toLowerCase().startsWith('javascript:'));
            if (parts.length) node.setAttribute('srcset', parts.join(', '));
            else node.removeAttribute('srcset');
          } catch (e) { node.removeAttribute('srcset'); }
        } else if (name === 'style') {
          if (/expression\s*\(|javascript\s*:/i.test(attr.value)) node.removeAttribute('style');
        }
      }
    }
    for (const n of nodesToRemove) if (n && n.parentNode) n.parentNode.removeChild(n);
    return tpl.innerHTML;
  }

  function sanitizeAggressive(htmlString) {
    const tpl = document.createElement('template');
    tpl.innerHTML = htmlString;
    const removeTags = new Set(['script','iframe','object','embed','link','meta','form','input','button','select','textarea','video','audio','source','picture','svg']);
    const walker = document.createTreeWalker(tpl.content, NodeFilter.SHOW_ELEMENT, null, false);
    const nodesToRemove = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const tag = node.tagName && node.tagName.toLowerCase();
      if (removeTags.has(tag)) { nodesToRemove.push(node); continue; }
      const attrs = Array.from(node.attributes || []);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        const val = (attr.value || '').toLowerCase();
        if (name.startsWith('on')) { node.removeAttribute(attr.name); continue; }
        if (name.startsWith('data-')) { node.removeAttribute(attr.name); continue; }
        if (name === 'style') { node.removeAttribute('style'); continue; }
        if ((name === 'href' || name === 'src' || name === 'xlink:href') && (/^\s*(javascript:|data:text\/html)/i.test(val))) { node.removeAttribute(attr.name); continue; }
        if (name === 'srcset') {
          try {
            const parts = attr.value.split(',').map(p => p.trim()).filter(p => !/^\s*(javascript:|data:text\/html)/i.test(p.toLowerCase()));
            if (parts.length) node.setAttribute('srcset', parts.join(', '));
            else node.removeAttribute('srcset');
          } catch (e) { node.removeAttribute('srcset'); }
        }
        if ((name === 'action' || name === 'formaction') && /^\s*(javascript:|data:text\/html)/i.test(val)) { node.removeAttribute(attr.name); continue; }
      }
    }
    for (const n of nodesToRemove) if (n && n.parentNode) n.parentNode.removeChild(n);
    return tpl.innerHTML;
  }

  function sanitizeHtmlStringByLevel(htmlString, level) {
    if (!htmlString) return '';
    if (level === 'off') return htmlString;
    if (level === 'moderate') return sanitizeModerate(htmlString);
    if (level === 'aggressive') return sanitizeAggressive(htmlString);
    return htmlString;
  }

  // ---------- Preview rendering (isolated, robust) ----------
  function buildPreviewContentFromInput() {
    const rawInput = input.value || '';
    let source = rawInput;
    // If input seems entity-encoded and not markup, decode entities into markup first
    if (/[&][a-zA-Z0-9#]+;/.test(rawInput) && !/<[a-z][\s\S]*>/i.test(rawInput)) {
      try {
        const d = document.createElement('div');
        d.innerHTML = rawInput;
        source = d.innerHTML;
      } catch (e) { source = rawInput; }
    }
    const level = sanitizationLevel.value || 'moderate';
    if (level === 'off') return source;
    try { return sanitizeHtmlStringByLevel(source, level); } catch (e) { return source; }
  }

  // Write a full HTML doc to iframe.srcdoc and ensure consistent re-render
  function showRenderedPreview(content) {
    try {
      previewFrame.style.display = '';
      previewEscaped.style.display = 'none';
      const bodyContent = (content || '').trim() || '<div style="color:#666;font-family:system-ui;padding:12px;">(Nothing to preview)</div>';
      const injected = `
        <!doctype html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <style>
            :root{color-scheme:light dark;}
            html,body{margin:0;padding:12px;font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial;background:transparent;color:inherit;}
            img{max-width:100%;height:auto;border-radius:6px;}
            table{border-collapse:collapse;width:100%;}
            code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,"Roboto Mono",monospace;font-size:0.92em;}
          </style>
        </head>
        <body>${bodyContent}</body>
        </html>
      `;
      // Assign fresh srcdoc each time
      previewFrame.srcdoc = injected;
      previewFrame.onload = () => { /* stable no-op hook */ };
    } catch (e) {
      previewFrame.style.display = 'none';
      previewEscaped.style.display = '';
      previewEscaped.textContent = content || '(Nothing to preview)';
    }
    updateCaption();
  }

  function showEscapedPreview(content) {
    previewFrame.style.display = 'none';
    previewEscaped.style.display = '';
    previewEscaped.textContent = content || '';
    // clear iframe srcdoc to avoid stale blank issues
    try { previewFrame.srcdoc = ''; previewFrame.removeAttribute('src'); } catch (e) {}
    updateCaption();
  }

  function updateCaption() {
    const level = sanitizationLevel.value || 'moderate';
    const captionText = `Sanitization: ${level.charAt(0).toUpperCase() + level.slice(1)} — preview is sandboxed.`;
    previewCaption.textContent = captionText;
  }

  function renderPreviewFromOutput() {
    if (!uiPanelVisible) return;
    const content = buildPreviewContentFromInput();
    if (previewMode === 'render') showRenderedPreview(content);
    else showEscapedPreview(content);
  }

  // ---------- Keyboard shortcuts ----------
  container.addEventListener('keydown', (ev) => {
    const isMac = navigator.platform.toLowerCase().includes('mac');
    const mod = isMac ? ev.metaKey : ev.ctrlKey;
    if (!mod) return;
    if (ev.key.toLowerCase() === 'e') { ev.preventDefault(); btnEncode.click(); }
    else if (ev.key.toLowerCase() === 'd') { ev.preventDefault(); btnDecode.click(); }
    else if (ev.key.toLowerCase() === 'k') { ev.preventDefault(); btnClear.click(); }
    else if (ev.shiftKey && ev.key.toLowerCase() === 'c') { ev.preventDefault(); btnCopy.click(); }
  }, true);

  // ---------- Live behavior ----------
  function handleLive() {
    if (btnEncode.classList.contains('active')) {
      const toNumeric = !!toggleNumericEncode.checked;
      output.value = encodeHTML(input.value, { toNumericNonAscii: toNumeric });
      setStatus('Live encoding…');
    } else if (btnDecode.classList.contains('active')) {
      output.value = decodeHTML(input.value);
      setStatus('Live decoding…');
    } else {
      output.value = '';
      setStatus('');
    }
    renderPreviewFromOutput();
  }
  input.addEventListener('input', handleLive);

  // ---------- Button helpers ----------
  function setActive(btn) {
    [btnEncode, btnDecode].forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    handleLive();
  }

  // Single-click behavior:
  // - If panel closed: open and show 'render' mode
  // - If panel open: toggle between render <-> escaped
  btnToggleView.addEventListener('click', () => {
    if (!uiPanelVisible) {
      uiPanelVisible = true;
      previewMode = 'render';
      btnToggleView.textContent = 'Show Escaped';
      renderPreviewFromOutput();
    } else {
      // toggle mode
      previewMode = (previewMode === 'render') ? 'escaped' : 'render';
      btnToggleView.textContent = (previewMode === 'render') ? 'Show Escaped' : 'Show Rendered';
      renderPreviewFromOutput();
    }
  });

  // react to changes
  output.addEventListener('input', renderPreviewFromOutput);
  output.addEventListener('change', renderPreviewFromOutput);
  sanitizationLevel.addEventListener('change', () => {
    updateCaption();
    renderPreviewFromOutput();
  });
  toggleNumericEncode.addEventListener('change', () => {
    if (btnEncode.classList.contains('active')) {
      output.value = encodeHTML(input.value, { toNumericNonAscii: !!toggleNumericEncode.checked });
      renderPreviewFromOutput();
    }
  });

  // SHIFT-click on Encode enforces numeric encoding regardless of toggle
  btnEncode.addEventListener('click', (ev) => {
    setActive(btnEncode);
    const doNumeric = ev.shiftKey === true || toggleNumericEncode.checked;
    output.value = encodeHTML(input.value, { toNumericNonAscii: !!doNumeric });
    setStatus(doNumeric ? 'Encoded (non-ASCII → numeric entities).' : 'Encoded!');
    renderPreviewFromOutput();
  });

  btnDecode.addEventListener('click', () => {
    setActive(btnDecode);
    output.value = decodeHTML(input.value);
    setStatus('Decoded!');
    renderPreviewFromOutput();
  });

  btnClear.addEventListener('click', () => {
    input.value = '';
    output.value = '';
    setStatus('Cleared.', true);
    [btnEncode, btnDecode].forEach(b => b.classList.remove('active'));
    previewFrame.style.display = 'none';
    previewEscaped.style.display = 'none';
    try { previewFrame.srcdoc = ''; previewFrame.removeAttribute('src'); } catch(e){}
    uiPanelVisible = false;
    btnToggleView.textContent = 'Show Preview';
  });

  btnCopy.addEventListener('click', async () => {
    const ok = await copyToClipboard(output.value || '');
    if (ok) setStatus('Output copied!', true);
    else setStatus('Copy failed.', false);
  });

  output.addEventListener('focus', () => {
    try { output.select(); } catch (e) {}
  });

  // Initialize defaults
  setActive(btnEncode);
  sanitizationLevel.value = 'moderate';
  previewMode = 'render';
  updateCaption();
  setStatus('Ready. Sanitization: Moderate by default. Single-click preview toggle switches modes. Preview is sandboxed.', true, 9000);
}

export function load(container, toolId) {
  loadHTMLEntityTool(container);
  setupHTMLEntityTool(container);
}
