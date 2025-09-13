// text-comparer.js
// Fixed: checkboxes wired into diff algorithm + inline word-level diffs
// Usage: import { load } from './text-comparer.js'; load(document.getElementById('myContainer'));

export function load(container) {
  container.innerHTML = /*html*/`
    <style>
      :root{
        --bg:#f3f6fb; --panel:#fff; --muted:#6b7280; --accent:#2563eb; --border:#e6eef8; --mono:"Consolas","Courier New",monospace;
      }
      *{box-sizing:border-box}
      .tc-app{font-family: "Segoe UI", Roboto, Arial, sans-serif; background:var(--bg); padding:14px; border-radius:10px; color:#04203a}
      .tc-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
      .tc-title{font-size:20px;font-weight:700}
      .tc-sub{font-size:12px;color:var(--muted)}
      .tc-top{display:flex;gap:12px;align-items:center}
      .tc-controls{display:flex;gap:8px;align-items:center}
      .tc-btn{background:var(--panel);border:1px solid var(--border);padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px}
      .tc-btn.primary{background:linear-gradient(180deg,var(--accent),#1e40af);color:#fff;border:0}
      .tc-options{display:flex;gap:10px;align-items:center;color:var(--muted);font-size:13px;flex-wrap:wrap}
      .tc-search{padding:8px;border-radius:8px;border:1px solid var(--border);min-width:200px}
      .tc-main{display:flex;gap:12px;margin-top:12px;align-items:stretch;min-height:380px}
      .tc-editor-wrap{flex:1;display:flex;flex-direction:column;background:var(--panel);border-radius:10px;border:1px solid var(--border);overflow:hidden;min-width:260px}
      .panel-header{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid var(--border);font-weight:600}
      .panel-body{display:flex;flex:1;min-height:320px;overflow:hidden}
      .gutter{width:56px;background:#fbfdff;border-right:1px solid var(--border);padding:8px 6px;overflow:auto;display:flex;flex-direction:column;align-items:flex-end;font-family:var(--mono);font-size:13px;color:var(--muted);user-select:none}
      .gutter .ln{display:block;width:100%;text-align:right;padding-right:6px;box-sizing:border-box}
      .editor-area{flex:1;position:relative;display:flex;flex-direction:column;background:transparent;overflow:hidden}
      .editor-scroll{flex:1;display:flex;overflow:auto;align-items:flex-start}
      .editor-text{flex:1;border:none;outline:none;padding:10px;font-family:var(--mono);font-size:13px;line-height:1.45;resize:none;background:transparent;color:#0b1220;min-height:100%;min-width:100%}
      .splitter{width:12px;cursor:col-resize;display:flex;align-items:center;justify-content:center}
      .splitter .bar{width:4px;height:40%;background:#e2e8f0;border-radius:999px}
      .tc-result-wrap{margin-top:12px;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:10px;min-height:140px}
      .tc-result{font-family:var(--mono);font-size:13px;white-space:pre-wrap;color:#08203a;overflow:auto;max-height:320px}
      .diff-add{background:#d4fcbc;border-radius:3px;padding:0 2px}
      .diff-del{background:#fbd6dc;text-decoration:line-through;border-radius:3px;padding:0 2px}
      .diff-chg{background:#fff4ce;border-radius:3px;padding:0 2px}
      .tc-status{display:flex;justify-content:space-between;margin-top:10px;color:var(--muted);font-size:13px}
      .hidden { display:none !important; }
      @media(max-width:920px){ .tc-main{flex-direction:column}.splitter{display:none} .gutter{width:48px} }
    </style>

    <div class="tc-app" role="application" aria-label="Text Comparer">
      <div class="tc-header">
        <div>
          <div class="tc-title">Text Comparer</div>
          <div class="tc-sub">Local, fast, structured-aware diffs for JSON / XML / CSV / plain text</div>
        </div>
        <div class="tc-top">
          <div class="tc-options">
            <label><input type="checkbox" id="tc-word-level"> Word-level</label>
            <label><input type="checkbox" id="tc-ignore-ws"> Ignore whitespace</label>
            <label><input type="checkbox" id="tc-ignore-case"> Ignore case</label>
            <label><input type="checkbox" id="tc-show-lines" checked> Show lines</label>
          </div>
          <input id="tc-search" class="tc-search" placeholder="Search..." aria-label="Search diff" />
          <button id="tc-search-prev" class="tc-btn" title="Previous match">&#8593;</button>
          <button id="tc-search-next" class="tc-btn" title="Next match">&#8595;</button>
          <div class="tc-controls">
            <button id="tc-compare" class="tc-btn primary" title="Compare (Ctrl/Cmd+B)">Compare</button>
            <button id="tc-clear" class="tc-btn" title="Clear editors">Clear</button>
            <button id="tc-copy" class="tc-btn" title="Copy result">Copy Output</button>
          </div>
        </div>
      </div>

      <div class="tc-main" id="tc-main">
        <div class="tc-editor-wrap" id="left-wrap">
          <div class="panel-header">Original <div style="font-weight:400;font-size:12px;color:var(--muted)">Paste / Type</div></div>
          <div class="panel-body">
            <div class="gutter" id="gutter-left" aria-hidden="true"></div>
            <div class="editor-area">
              <div class="editor-scroll"><textarea id="tc-text1" class="editor-text" spellcheck="false" placeholder="Paste or type left text..."></textarea></div>
            </div>
          </div>
        </div>

        <div class="splitter" id="splitter" role="separator" aria-orientation="vertical"><div class="bar"></div></div>

        <div class="tc-editor-wrap" id="right-wrap">
          <div class="panel-header">Modified <div style="font-weight:400;font-size:12px;color:var(--muted)">Paste / Type</div></div>
          <div class="panel-body">
            <div class="gutter" id="gutter-right" aria-hidden="true"></div>
            <div class="editor-area">
              <div class="editor-scroll"><textarea id="tc-text2" class="editor-text" spellcheck="false" placeholder="Paste or type right text..."></textarea></div>
            </div>
          </div>
        </div>
      </div>

      <div class="tc-result-wrap" aria-live="polite">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-weight:700">Comparison Result</div>
          <div id="tc-result-meta" style="font-size:13px;color:var(--muted)"></div>
        </div>
        <div id="tc-result" class="tc-result" role="region"></div>
      </div>

      <div class="tc-status">
        <div id="tc-status">Ready</div>
        <div id="tc-similarity"></div>
      </div>
    </div>
  `;

  // === refs ===
  const t1 = container.querySelector('#tc-text1');
  const t2 = container.querySelector('#tc-text2');
  const gutterLeft = container.querySelector('#gutter-left');
  const gutterRight = container.querySelector('#gutter-right');
  const compareBtn = container.querySelector('#tc-compare');
  const clearBtn = container.querySelector('#tc-clear');
  const copyBtn = container.querySelector('#tc-copy');
  const resultEl = container.querySelector('#tc-result');
  const statusEl = container.querySelector('#tc-status');
  const simEl = container.querySelector('#tc-similarity');
  const metaEl = container.querySelector('#tc-result-meta');
  const searchInput = container.querySelector('#tc-search');
  const searchPrevBtn = container.querySelector('#tc-search-prev');
  const searchNextBtn = container.querySelector('#tc-search-next');
  const wordLevelChk = container.querySelector('#tc-word-level');
  const ignoreWsChk = container.querySelector('#tc-ignore-ws');
  const ignoreCaseChk = container.querySelector('#tc-ignore-case');
  const showLinesChk = container.querySelector('#tc-show-lines');
  const splitter = container.querySelector('#splitter');
  const mainEl = container.querySelector('#tc-main');
  const leftWrap = container.querySelector('#left-wrap');
  const rightWrap = container.querySelector('#right-wrap');

  // === utilities ===
  function setStatus(msg, ok=true){ statusEl.textContent = msg; statusEl.style.color = ok ? 'var(--muted)' : 'var(--danger)'; }
  function notice(msg){ metaEl.textContent = msg || ''; }
  function escapeHtml(s){ return String(s).replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
  function escapeRegExp(s){ return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  // === gutter helpers (reuse DOM nodes for performance) ===
  function getLineHeightPx(textarea){
    const cs = window.getComputedStyle(textarea);
    let lh = parseFloat(cs.lineHeight);
    if (isNaN(lh) || cs.lineHeight === 'normal') {
      const fs = parseFloat(cs.fontSize) || 13;
      lh = Math.round(fs * 1.45);
    }
    return Math.round(lh);
  }
  function ensureGutterRows(gutterEl, count, lh) {
    const existing = gutterEl.children.length;
    if (existing > count) {
      for (let i = existing - 1; i >= count; i--) gutterEl.removeChild(gutterEl.children[i]);
    } else if (existing < count) {
      const frag = document.createDocumentFragment();
      for (let i = existing; i < count; i++) {
        const div = document.createElement('div'); div.className = 'ln'; frag.appendChild(div);
      }
      gutterEl.appendChild(frag);
    }
    for (let i = 0; i < count; i++) {
      const row = gutterEl.children[i];
      const expected = String(i + 1);
      if (row.textContent !== expected) row.textContent = expected;
      row.style.height = lh + 'px';
      row.style.lineHeight = lh + 'px';
    }
  }
  function updateGutters() {
    const leftCount = Math.max(1, t1.value.split('\n').length);
    const rightCount = Math.max(1, t2.value.split('\n').length);
    const lhLeft = getLineHeightPx(t1);
    const lhRight = getLineHeightPx(t2);
    ensureGutterRows(gutterLeft, leftCount, lhLeft);
    ensureGutterRows(gutterRight, rightCount, lhRight);
    // show/hide gutter based on checkbox
    if (showLinesChk.checked) {
      gutterLeft.classList.remove('hidden'); gutterRight.classList.remove('hidden');
    } else {
      gutterLeft.classList.add('hidden'); gutterRight.classList.add('hidden');
    }
  }

  // clicking gutter jumps to line
  function jumpToLine(textarea, idx) {
    const pos = indexOfLineStart(textarea.value, idx);
    textarea.focus(); textarea.setSelectionRange(pos, pos);
    const lh = getLineHeightPx(textarea);
    textarea.scrollTop = Math.max(0, (idx * lh) - (textarea.clientHeight / 2));
  }
  function indexOfLineStart(text, lineIndex) {
    if (lineIndex <= 0) return 0;
    let pos = 0;
    for (let i = 0; i < lineIndex; i++) {
      const nxt = text.indexOf('\n', pos);
      if (nxt === -1) { pos = text.length; break; }
      pos = nxt + 1;
    }
    return pos;
  }

  // scroll sync
  function attachScrollSync() {
    t1.addEventListener('scroll', () => {
      gutterLeft.scrollTop = t1.scrollTop;
      if (Math.abs(t2.scrollTop - t1.scrollTop) > 1) t2.scrollTop = t1.scrollTop;
      gutterRight.scrollTop = t1.scrollTop;
    }, { passive: true });
    t2.addEventListener('scroll', () => {
      gutterRight.scrollTop = t2.scrollTop;
      if (Math.abs(t1.scrollTop - t2.scrollTop) > 1) t1.scrollTop = t2.scrollTop;
      gutterLeft.scrollTop = t2.scrollTop;
    }, { passive: true });

    gutterLeft.addEventListener('click', (ev) => {
      const target = ev.target.closest('.ln'); if (!target) return;
      const idx = Array.prototype.indexOf.call(gutterLeft.children, target);
      jumpToLine(t1, idx);
    });
    gutterRight.addEventListener('click', (ev) => {
      const target = ev.target.closest('.ln'); if (!target) return;
      const idx = Array.prototype.indexOf.call(gutterRight.children, target);
      jumpToLine(t2, idx);
    });
  }

  // === diff algorithm ===
  // Tokenize by word/char/line depending on options.
  function tokenizeLine(line, opts) {
    if (opts.wordLevel) {
      // split into words but keep separators
      return line.split(/(\s+|\b)/).map(tok => tok === undefined ? '' : tok);
    }
    // fallback: characters (makes inline marking precise)
    return line.split('');
  }

  // Normalize token for comparison (but preserve original for display)
  function normalizeToken(tok, opts) {
    let s = String(tok);
    if (opts.ignoreWs) s = s.replace(/\s+/g, '');
    if (opts.ignoreCase) s = s.toLowerCase();
    return s;
  }

  // LCS for arrays (returns boolean matrix dp)
  function lcsMatrixArr(a, b, cmpFn) {
    const n = a.length, m = b.length;
    const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = cmpFn(a[i], b[j]) ? 1 + dp[i + 1][j + 1] : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    return dp;
  }

  function inlineDiffHtml(leftLine, rightLine, opts) {
    // produce inline HTML with diff-add/diff-del/diff-chg spans
    const aTokens = tokenizeLine(leftLine, opts);
    const bTokens = tokenizeLine(rightLine, opts);
    const cmp = (x,y) => normalizeToken(x, opts) === normalizeToken(y, opts);
    const dp = lcsMatrixArr(aTokens, bTokens, cmp);
    let i=0,j=0, out='';
    while (i < aTokens.length || j < bTokens.length) {
      if (i < aTokens.length && j < bTokens.length && cmp(aTokens[i], bTokens[j])) {
        out += escapeHtml(String(bTokens[j])); i++; j++;
      } else if (j < bTokens.length && (i === aTokens.length || dp[i][j+1] >= dp[i+1][j])) {
        out += `<span class="diff-add">${escapeHtml(String(bTokens[j]))}</span>`; j++;
      } else if (i < aTokens.length && (j === bTokens.length || dp[i][j+1] < dp[i+1][j])) {
        out += `<span class="diff-del">${escapeHtml(String(aTokens[i]))}</span>`; i++;
      } else {
        if (i < aTokens.length) { out += `<span class="diff-del">${escapeHtml(String(aTokens[i]))}</span>`; i++; }
        if (j < bTokens.length) { out += `<span class="diff-add">${escapeHtml(String(bTokens[j]))}</span>`; j++; }
      }
    }
    return out;
  }

  // Try to format JSON/XML for nicer diff; returns null if not structured
  function tryFormatStructured(s) {
    if (!s || !s.trim()) return null;
    const t = s.trim();
    if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
      try { return JSON.stringify(JSON.parse(t), null, 2); } catch(e) {}
    }
    if (t.startsWith('<')) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(t, 'application/xml');
        if (!doc.querySelector('parsererror')) return formatXml(doc);
      } catch(e){}
    }
    return null;
  }
  function formatXml(xmlDoc) {
    function nodeToString(node, indent='') {
      if (node.nodeType === 3) { const txt = node.nodeValue.trim(); return txt ? indent + escapeHtml(txt) + '\n' : ''; }
      if (node.nodeType === 8) return indent + '<!--' + escapeHtml(node.nodeValue) + '-->\n';
      if (node.nodeType !== 1) return '';
      const tag = node.nodeName;
      let attrs = '';
      if (node.attributes && node.attributes.length) {
        for (let i=0;i<node.attributes.length;i++){ const a=node.attributes[i]; attrs += ` ${a.name}="${escapeHtml(a.value)}"`; }
      }
      const children = Array.from(node.childNodes || []);
      if (!children.length) return indent + `<${tag}${attrs}/>\n`;
      const inner = children.map(c=>nodeToString(c, indent + '  ')).join('');
      return indent + `<${tag}${attrs}>\n` + inner + indent + `</${tag}>\n`;
    }
    return Array.from(xmlDoc.childNodes).map(n=>nodeToString(n,'')).join('');
  }

  // LCS matrix for lines (optimized)
  function lcsMatrixLines(a, b, cmpFn) {
    const n = a.length, m = b.length;
    if (n === 0 || m === 0) return {dp:[], n, m};
    const dp = Array(n+1).fill(null).map(()=>Array(m+1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = cmpFn(a[i], b[j]) ? 1 + dp[i+1][j+1] : Math.max(dp[i+1][j], dp[i][j+1]);
      }
    }
    return {dp, n, m};
  }

  // main builder that respects options
  function buildDiffHtml(leftText, rightText, opts = {}) {
    const leftFmt = tryFormatStructured(leftText) || leftText;
    const rightFmt = tryFormatStructured(rightText) || rightText;
    const leftLines = leftFmt.split('\n');
    const rightLines = rightFmt.split('\n');

    // comparator for lines: use normalization if ignoreWs/ignoreCase
    const lineCmp = (la, rb) => {
      if (!opts.ignoreWs && !opts.ignoreCase) return la === rb;
      const nA = opts.ignoreWs ? la.replace(/\s+/g,'') : la;
      const nB = opts.ignoreWs ? rb.replace(/\s+/g,'') : rb;
      return opts.ignoreCase ? nA.toLowerCase() === nB.toLowerCase() : nA === nB;
    };

    const {dp} = lcsMatrixLines(leftLines, rightLines, lineCmp);
    let i=0,j=0, html = '';
    while (i < leftLines.length || j < rightLines.length) {
      if (i < leftLines.length && j < rightLines.length && lineCmp(leftLines[i], rightLines[j])) {
        // unchanged
        html += `<div class="diff-line">${escapeHtml(leftLines[i])}</div>`; i++; j++;
      } else if (j < rightLines.length && (i === leftLines.length || dp[i][j+1] >= dp[i+1][j])) {
        // added
        // If word-level requested and left has a corresponding changed line (i < left.length), compute inline diff
        if (opts.wordLevel && i < leftLines.length) {
          const inline = inlineDiffHtml(leftLines[i], rightLines[j], opts);
          html += `<div class="diff-line">${inline}</div>`;
          i++; j++;
        } else {
          html += `<div class="diff-line"><span class="diff-add">${escapeHtml(rightLines[j])}</span></div>`;
          j++;
        }
      } else if (i < leftLines.length && (j === rightLines.length || dp[i][j+1] < dp[i+1][j])) {
        // deleted
        if (opts.wordLevel && j < rightLines.length) {
          const inline = inlineDiffHtml(leftLines[i], rightLines[j], opts);
          html += `<div class="diff-line">${inline}</div>`;
          i++; j++;
        } else {
          html += `<div class="diff-line"><span class="diff-del">${escapeHtml(leftLines[i])}</span></div>`;
          i++;
        }
      } else {
        // fallback (both exist but dp not helpful)
        if (i < leftLines.length) { html += `<div class="diff-line"><span class="diff-del">${escapeHtml(leftLines[i])}</span></div>`; i++; }
        if (j < rightLines.length) { html += `<div class="diff-line"><span class="diff-add">${escapeHtml(rightLines[j])}</span></div>`; j++; }
      }
    }

    return { html, leftFormatted: leftFmt, rightFormatted: rightFmt };
  }

  // similarity: normalized char based
  function computeSimilarity(a,b) {
    const A = a.replace(/\s+/g,''); const B = b.replace(/\s+/g,'');
    if (!A && !B) return 100;
    const min = Math.min(A.length, B.length);
    let same=0; for (let i=0;i<min;i++) if (A[i] === B[i]) same++;
    return Math.round((same / Math.max(A.length, B.length)) * 100);
  }

  // === render & control wiring ===
  let liveTimer = null;
  let rafScheduled = false;
  function scheduleUpdate(delay=140){
    if (liveTimer) clearTimeout(liveTimer);
    liveTimer = setTimeout(()=>{
      if (!rafScheduled) {
        rafScheduled = true;
        requestAnimationFrame(()=>{ updateResult(); rafScheduled = false; });
      }
      liveTimer = null;
    }, delay);
  }

  // === Worker support for heavy diffs ===
  let worker = null;
  let workerBusy = false;
  let lastWorkerJobId = 0;
  let workerTimeout = null;
  function createWorker() {
    try {
      const w = new Worker('diff.worker.js');
      setStatus('Worker enabled');
      return w;
    } catch (e) {
      setStatus('Worker unavailable, using main thread', false);
      return null;
    }
  }
  function killWorker() {
    if (worker) { try { worker.terminate(); } catch {} worker = null; }
  }
  function useWorkerForDiff(left, right, opts, onDone, onError) {
    if (!worker) worker = createWorker();
    if (!worker) { onError && onError('Worker unavailable'); return; }
    workerBusy = true;
    lastWorkerJobId++;
    const jobId = lastWorkerJobId;
    worker.postMessage({ id: jobId, type: 'compute', left, right, opts });
    workerTimeout = setTimeout(() => {
      killWorker();
      workerBusy = false;
      setStatus('Worker timeout, using main thread', false);
      onError && onError('Worker timeout');
    }, 6000);
    worker.onmessage = (e) => {
      if (!e.data || e.data.id !== jobId) return;
      clearTimeout(workerTimeout);
      workerBusy = false;
      if (e.data.type === 'done') {
        onDone && onDone(e.data.html, e.data.similarity, e.data.meta);
      } else if (e.data.type === 'error') {
        onError && onError(e.data.message);
      }
    };
    worker.onerror = (err) => {
      clearTimeout(workerTimeout);
      workerBusy = false;
      killWorker();
      setStatus('Worker error, using main thread', false);
      onError && onError('Worker error');
    };
  }

  function updateResult(force = false) {
    setStatus('Computing diff...');
    const leftText = t1.value;
    const rightText = t2.value;
    const opts = {
      wordLevel: wordLevelChk.checked,
      ignoreWs: ignoreWsChk.checked,
      ignoreCase: ignoreCaseChk.checked
    };
    // Use worker for large files or always (here: always for demo)
    useWorkerForDiff(leftText, rightText, opts,
      (html, similarity, meta) => {
        // Worker success
        resultEl.innerHTML = html || '<div style="color:var(--muted)">No differences</div>';
        simEl.textContent = similarity ? `Similarity: ${similarity}%` : '';
        notice(meta || '');
        setStatus('Ready (worker)');
        highlightSearch(); // <-- ensure search highlights are updated after diff
      },
      (err) => {
        // Fallback to main-thread diff
        const { html, leftFormatted, rightFormatted } = buildDiffHtml(leftText, rightText, opts);
        resultEl.innerHTML = html || '<div style="color:var(--muted)">No differences</div>';
        simEl.textContent = `Similarity: ${computeSimilarity(leftText, rightText)}%`;
        notice('');
        setStatus('Ready (main thread)', false);
        highlightSearch(); // <-- ensure search highlights are updated after diff
      }
    );
  }
  function detectKind(s) {
    if (!s || !s.trim()) return null;
    const t = s.trim();
    if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) return 'JSON';
    if (t.startsWith('<')) return 'XML/HTML';
    return null;
  }

  // hook control events to update
  [wordLevelChk, ignoreWsChk, ignoreCaseChk, showLinesChk].forEach(cb=>{
    cb.addEventListener('change', ()=>{ updateGutters(); scheduleUpdate(60); });
  });
  compareBtn.addEventListener('click', ()=> updateResult(true));
  searchInput.addEventListener('input', ()=> scheduleUpdate(80));

  copyBtn.addEventListener('click', async ()=>{
    try { await navigator.clipboard.writeText(resultEl.innerText || ''); setStatus('Result copied to clipboard'); }
    catch { setStatus('Copy failed', false); }
  });
  clearBtn.addEventListener('click', ()=>{
    t1.value=''; t2.value=''; resultEl.innerHTML=''; updateGutters(); setStatus('Cleared'); simEl.textContent=''; notice(''); 
    highlightSearch(); // <-- clear search highlights after clearing
  });

  // textareas: input/paste -> update gutters & schedule diff
  [t1,t2].forEach(ta=>{
    ta.addEventListener('input', ()=>{ updateGutters(); scheduleUpdate(); });
    ta.addEventListener('paste', ()=>{ setTimeout(()=>{ updateGutters(); scheduleUpdate(); }, 20); });
    ta.addEventListener('keydown', (ev)=>{ const isMac = navigator.platform.toLowerCase().includes('mac'); const mod = isMac?ev.metaKey:ev.ctrlKey; if (mod && ev.key.toLowerCase()==='b'){ ev.preventDefault(); updateResult(); } });
  });

  // initial sample
  if (!t1.value && !t2.value) {
    t1.value = `The quick brown fox\njumps over the lazy dog.\nThis is the left file.\nIt has several lines.\nSome lines will be changed.`;
    t2.value = `The quick brown fox\njumps over the lazy dog!\nThis is the right file.\nIt has several lines.\nSome lines will be added.\nAnd some will be removed.`;
    updateGutters();
    scheduleUpdate(20);
  } else {
    updateGutters();
    scheduleUpdate(20);
  }

  // splitter logic
  (function attachSplitter(){
    let startX=0, leftWidth=0;
    splitter.addEventListener('pointerdown', (e)=>{
      e.preventDefault();
      startX = e.clientX; leftWidth = leftWrap.getBoundingClientRect().width;
      splitter.setPointerCapture(e.pointerId);
      function move(ev){ const dx = ev.clientX - startX; const parentW = mainEl.clientWidth; let newLeft = Math.max(200, Math.min(parentW-200, leftWidth + dx)); leftWrap.style.flex = `0 0 ${newLeft}px`; rightWrap.style.flex = `0 0 ${Math.max(200, parentW - newLeft - splitter.offsetWidth)}px`; }
      function up(upEv){ splitter.releasePointerCapture(upEv.pointerId); document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); }
      document.addEventListener('pointermove', move); document.addEventListener('pointerup', up);
    });
  })();

  // attach scroll sync & gutter click
  function attachScrollSync() {
    t1.addEventListener('scroll', ()=>{ gutterLeft.scrollTop = t1.scrollTop; if (Math.abs(t2.scrollTop - t1.scrollTop) > 1) t2.scrollTop = t1.scrollTop; gutterRight.scrollTop = t1.scrollTop; }, { passive:true });
    t2.addEventListener('scroll', ()=>{ gutterRight.scrollTop = t2.scrollTop; if (Math.abs(t1.scrollTop - t2.scrollTop) > 1) t1.scrollTop = t2.scrollTop; gutterLeft.scrollTop = t2.scrollTop; }, { passive:true });

    gutterLeft.addEventListener('click', (ev)=>{ const target = ev.target.closest('.ln'); if (!target) return; const idx = Array.prototype.indexOf.call(gutterLeft.children, target); jumpToLine(t1, idx); });
    gutterRight.addEventListener('click', (ev)=>{ const target = ev.target.closest('.ln'); if (!target) return; const idx = Array.prototype.indexOf.call(gutterRight.children, target); jumpToLine(t2, idx); });
  }
  attachScrollSync();

  function jumpToLine(textarea, idx) {
    const pos = indexOfLineStart(textarea.value, idx);
    textarea.focus(); textarea.setSelectionRange(pos,pos);
    const lh = getLineHeightPx(textarea);
    textarea.scrollTop = Math.max(0, (idx * lh) - (textarea.clientHeight / 2));
  }

  // expose a small API
  container.textComparer = { update: updateResult, getResultHtml: ()=> resultEl.innerHTML, getSimilarity: ()=> simEl.textContent };

  setStatus('Ready — checkboxes now applied to diff');

  let searchMatches = [];
  let searchIndex = 0;

  function highlightSearch() {
    const q = (searchInput.value || '').trim();
    let html = resultEl.innerHTML;
    if (!q) {
      // Remove all highlights
      resultEl.innerHTML = html.replace(/<span class="diff-chg">(.*?)<\/span>/g, '$1');
      searchMatches = [];
      searchIndex = 0;
      return;
    }
    // Remove old highlights
    html = html.replace(/<span class="diff-chg">(.*?)<\/span>/g, '$1');
    // Add new highlights
    const re = new RegExp(escapeRegExp(q), 'gi');
    let matchCount = 0;
    html = html.replace(re, m => {
      matchCount++;
      return `<span class="diff-chg" data-match-idx="${matchCount-1}">${escapeHtml(m)}</span>`;
    });
    resultEl.innerHTML = html;
    searchMatches = Array.from(resultEl.querySelectorAll('.diff-chg'));
    searchIndex = 0;
    scrollToCurrentMatch();
  }

  function scrollToCurrentMatch() {
    if (!searchMatches.length) return;
    searchMatches.forEach((el, i) => {
      el.style.outline = (i === searchIndex) ? '2px solid #2563eb' : '';
      el.style.background = (i === searchIndex) ? '#fff4ce' : '';
    });
    const el = searchMatches[searchIndex];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  searchInput.addEventListener('input', () => { highlightSearch(); });
  searchPrevBtn.addEventListener('click', () => {
    if (!searchMatches.length) return;
    searchIndex = (searchIndex - 1 + searchMatches.length) % searchMatches.length;
    scrollToCurrentMatch();
  });
  searchNextBtn.addEventListener('click', () => {
    if (!searchMatches.length) return;
    searchIndex = (searchIndex + 1) % searchMatches.length;
    scrollToCurrentMatch();
  });
}
