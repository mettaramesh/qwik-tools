// text-comparer.js
// Fixed: checkboxes wired into diff algorithm + inline word-level diffs
// Usage: import { load } from './text-comparer.js'; load(document.getElementById('myContainer'));
import cssLoader from './cssLoader.js';
import { safeSetup } from './domUtils.js';

export async function load(container, toolId) {
  try {
    // Load CSS first for better visual experience
    await cssLoader.loadCSS('textComparer.css', 'text-comparer');
    await cssLoader.loadCSS('ui-components.css', 'text-comparer-ui');
    
    const resp = await fetch('textComparer.html');
    if (!resp.ok) {
      throw new Error(`Failed to load Text Comparer HTML: ${resp.status}`);
    }
    const html = await resp.text();
    // Security check: ensure we're not loading the full page
    if (html.includes('<!DOCTYPE html') || html.includes('<html')) {
      throw new Error('Invalid HTML content - contains full page structure');
    }
    container.innerHTML = html;
    
    // Critical elements that must be available before setup
    const criticalElements = [
      'tc-text1',
      'tc-text2',
      'tc-left-result',
      'tc-right-result',
      'tc-left-gutter',
      'tc-right-gutter', 
      'tc-left-content',
      'tc-right-content',
      'tc-status',
      'tc-compare',
      'tc-word-level',
      'tc-ignore-ws',
      'tc-ignore-case',
      'tc-show-lines'
    ];
    
    await safeSetup(() => setupTextComparer(), criticalElements);
    
  } catch (error) {
    console.error('Error loading Text Comparer:', error);
    container.innerHTML = '<div class="error">Failed to load Text Comparer tool</div>';
    return;
  }

  function setupTextComparer() {
  // Wait a brief moment for DOM to be ready
  // No longer needed with safeSetup, but kept for legacy compatibility

  // === refs ===
  const t1 = container.querySelector('#tc-text1');
  const t2 = container.querySelector('#tc-text2');
  const gutterLeft = container.querySelector('#gutter-left');
  const gutterRight = container.querySelector('#gutter-right');
  const compareBtn = container.querySelector('#tc-compare');
  const clearBtn = container.querySelector('#tc-clear');
  const copyBtn = container.querySelector('#tc-copy');
  const copyDiffBtn = container.querySelector('#tc-copy-diff-only');
  const copyLeftBtn = container.querySelector('#tc-copy-left');
  const copyRightBtn = container.querySelector('#tc-copy-right');
  const pasteLeftBtn = container.querySelector('#tc-paste-left');
  const pasteRightBtn = container.querySelector('#tc-paste-right');
  // Side-by-side result elements
  const leftResultEl = container.querySelector('#tc-left-result');
  const rightResultEl = container.querySelector('#tc-right-result');
  const leftGutterResult = container.querySelector('#tc-left-gutter');
  const rightGutterResult = container.querySelector('#tc-right-gutter');
  const leftContentResult = container.querySelector('#tc-left-content');
  const rightContentResult = container.querySelector('#tc-right-content');
  // Status and metadata
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

  // Check if essential elements exist
  if (!t1 || !t2 || !statusEl || !leftResultEl || !rightResultEl) {
    console.error('Text Comparer: Missing essential DOM elements');
    console.error('Debug info:', {
      't1 (tc-text1)': !!t1,
      't2 (tc-text2)': !!t2, 
      'leftResultEl (tc-left-result)': !!leftResultEl,
      'rightResultEl (tc-right-result)': !!rightResultEl,
      'leftGutterResult (tc-left-gutter)': !!leftGutterResult,
      'rightGutterResult (tc-right-gutter)': !!rightGutterResult,
      'leftContentResult (tc-left-content)': !!leftContentResult,
      'rightContentResult (tc-right-content)': !!rightContentResult,
      'statusEl (tc-status)': !!statusEl,
      'compareBtn (tc-compare)': !!compareBtn,
      'wordLevelChk (tc-word-level)': !!wordLevelChk,
      'ignoreWsChk (tc-ignore-ws)': !!ignoreWsChk,
      'ignoreCaseChk (tc-ignore-case)': !!ignoreCaseChk,
      'showLinesChk (tc-show-lines)': !!showLinesChk,
      'containerHTML': container.innerHTML.length + ' chars',
      'containerChildrenCount': container.children.length
    });
    container.innerHTML = '<div class="error">Failed to initialize Text Comparer - missing elements</div>';
    return;
  }
  
  // Warn about missing optional elements
  if (!compareBtn) console.warn('Text Comparer: Compare button not found');
  if (!wordLevelChk || !ignoreWsChk || !ignoreCaseChk || !showLinesChk) {
    console.warn('Text Comparer: Some option checkboxes not found', {
      'wordLevel': !!wordLevelChk,
      'ignoreWs': !!ignoreWsChk, 
      'ignoreCase': !!ignoreCaseChk,
      'showLines': !!showLinesChk
    });
  }

  // === utilities ===
  function setStatus(msg, ok=true){
    statusEl.textContent = msg;
    statusEl.classList.remove('status-ok', 'status-error');
    statusEl.classList.add(ok ? 'status-ok' : 'status-error');
  }
  function notice(msg){ if (metaEl) metaEl.textContent = msg || ''; }
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
    if (!t1 || !t2 || !gutterLeft || !gutterRight) return;
    
    const leftCount = Math.max(1, t1.value.split('\n').length);
    const rightCount = Math.max(1, t2.value.split('\n').length);
    const lhLeft = getLineHeightPx(t1);
    const lhRight = getLineHeightPx(t2);
    ensureGutterRows(gutterLeft, leftCount, lhLeft);
    ensureGutterRows(gutterRight, rightCount, lhRight);
    // show/hide gutter based on checkbox
    if (showLinesChk && showLinesChk.checked) {
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
    if (!t1 || !t2 || !gutterLeft || !gutterRight) return;
    
    t1.addEventListener('scroll', () => {
      if (gutterLeft) gutterLeft.scrollTop = t1.scrollTop;
      if (t2 && Math.abs(t2.scrollTop - t1.scrollTop) > 1) t2.scrollTop = t1.scrollTop;
      if (gutterRight) gutterRight.scrollTop = t1.scrollTop;
    }, { passive: true });
    
    t2.addEventListener('scroll', () => {
      if (gutterRight) gutterRight.scrollTop = t2.scrollTop;
      if (t1 && Math.abs(t1.scrollTop - t2.scrollTop) > 1) t1.scrollTop = t2.scrollTop;
      if (gutterLeft) gutterLeft.scrollTop = t2.scrollTop;
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
        out += `<span class="diff-added">${escapeHtml(String(bTokens[j]))}</span>`; j++;
      } else if (i < aTokens.length && (j === bTokens.length || dp[i][j+1] < dp[i+1][j])) {
        out += `<span class="diff-removed">${escapeHtml(String(aTokens[i]))}</span>`; i++;
      } else {
        if (i < aTokens.length) { out += `<span class="diff-removed">${escapeHtml(String(aTokens[i]))}</span>`; i++; }
        if (j < bTokens.length) { out += `<span class="diff-added">${escapeHtml(String(bTokens[j]))}</span>`; j++; }
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

  // main builder that respects options - SIDE-BY-SIDE VERSION
  function buildSideBySideDiff(leftText, rightText, opts = {}) {
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
    
    let leftResult = [];
    let rightResult = [];
    let leftLineNum = 1;
    let rightLineNum = 1;
    let i = 0, j = 0;

    while (i < leftLines.length || j < rightLines.length) {
      if (i < leftLines.length && j < rightLines.length && lineCmp(leftLines[i], rightLines[j])) {
        // Lines match - show as unchanged on both sides
        leftResult.push({
          lineNum: leftLineNum++,
          content: leftLines[i],
          type: 'unchanged'
        });
        rightResult.push({
          lineNum: rightLineNum++,
          content: rightLines[j],
          type: 'unchanged'
        });
        i++; j++;
      } else if (j < rightLines.length && (i === leftLines.length || dp[i][j+1] >= dp[i+1][j])) {
        // Line added in right side
        leftResult.push({
          lineNum: null,
          content: '',
          type: 'gap'
        });
        rightResult.push({
          lineNum: rightLineNum++,
          content: rightLines[j],
          type: 'added'
        });
        j++;
      } else if (i < leftLines.length && (j === rightLines.length || dp[i][j+1] < dp[i+1][j])) {
        // Line removed from left side
        leftResult.push({
          lineNum: leftLineNum++,
          content: leftLines[i],
          type: 'removed'
        });
        rightResult.push({
          lineNum: null,
          content: '',
          type: 'gap'
        });
        i++;
      } else {
        // Modified line - show both with word-level diff if enabled
        if (opts.wordLevel && i < leftLines.length && j < rightLines.length) {
          const inlineLeft = inlineDiffHtml(leftLines[i], rightLines[j], opts);
          const inlineRight = inlineDiffHtml(leftLines[i], rightLines[j], opts);
          
          leftResult.push({
            lineNum: leftLineNum++,
            content: inlineLeft,
            type: 'modified',
            isHtml: true
          });
          rightResult.push({
            lineNum: rightLineNum++,
            content: inlineRight,
            type: 'modified',
            isHtml: true
          });
        } else {
          leftResult.push({
            lineNum: leftLineNum++,
            content: leftLines[i] || '',
            type: 'modified'
          });
          rightResult.push({
            lineNum: rightLineNum++,
            content: rightLines[j] || '',
            type: 'modified'
          });
        }
        i++; j++;
      }
    }

    return { 
      leftResult, 
      rightResult, 
      leftFormatted: leftFmt, 
      rightFormatted: rightFmt 
    };
  }

  // Render side-by-side results
  function renderSideBySideResults(leftResult, rightResult) {
    let leftGutterHtml = '';
    let leftContentHtml = '';
    let rightGutterHtml = '';
    let rightContentHtml = '';

    const maxLines = Math.max(leftResult.length, rightResult.length);
    
    for (let i = 0; i < maxLines; i++) {
      const leftLine = leftResult[i] || { lineNum: null, content: '', type: 'gap' };
      const rightLine = rightResult[i] || { lineNum: null, content: '', type: 'gap' };
      
      // Left side
      leftGutterHtml += `<div class="ln ${leftLine.type}">${leftLine.lineNum || ''}</div>`;
      const leftContent = leftLine.isHtml ? leftLine.content : escapeHtml(leftLine.content);
      leftContentHtml += `<div class="tc-result-line diff-${leftLine.type}">${leftContent}</div>`;
      
      // Right side  
      rightGutterHtml += `<div class="ln ${rightLine.type}">${rightLine.lineNum || ''}</div>`;
      const rightContent = rightLine.isHtml ? rightLine.content : escapeHtml(rightLine.content);
      rightContentHtml += `<div class="tc-result-line diff-${rightLine.type}">${rightContent}</div>`;
    }

    // Update the side-by-side display
    if (leftGutterResult) leftGutterResult.innerHTML = leftGutterHtml;
    if (leftContentResult) leftContentResult.innerHTML = leftContentHtml;
    if (rightGutterResult) rightGutterResult.innerHTML = rightGutterHtml;
    if (rightContentResult) rightContentResult.innerHTML = rightContentHtml;
    
    // Show the result panels and hide textareas
    if (leftResultEl) leftResultEl.style.display = 'flex';
    if (rightResultEl) rightResultEl.style.display = 'flex';
  }

  // Hide side-by-side results and show textareas
  function hideSideBySideResults() {
    if (leftResultEl) leftResultEl.style.display = 'none';
    if (rightResultEl) rightResultEl.style.display = 'none';
  }

  // Add scroll synchronization for side-by-side results
  function attachResultScrollSync() {
    if (!leftContentResult || !rightContentResult) return;
    
    leftContentResult.addEventListener('scroll', () => {
      if (Math.abs(rightContentResult.scrollTop - leftContentResult.scrollTop) > 1) {
        rightContentResult.scrollTop = leftContentResult.scrollTop;
      }
    }, { passive: true });
    
    rightContentResult.addEventListener('scroll', () => {
      if (Math.abs(leftContentResult.scrollTop - rightContentResult.scrollTop) > 1) {
        leftContentResult.scrollTop = rightContentResult.scrollTop;
      }
    }, { passive: true });
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
    
    // If both texts are empty, hide results
    if (!leftText.trim() && !rightText.trim()) {
      hideSideBySideResults();
      setStatus('Ready to compare');
      if (simEl) simEl.textContent = '';
      return;
    }
    
    const opts = {
      wordLevel: wordLevelChk ? wordLevelChk.checked : false,
      ignoreWs: ignoreWsChk ? ignoreWsChk.checked : false,
      ignoreCase: ignoreCaseChk ? ignoreCaseChk.checked : false
    };
    
    try {
      const { leftResult, rightResult, leftFormatted, rightFormatted } = buildSideBySideDiff(leftText, rightText, opts);
      renderSideBySideResults(leftResult, rightResult);
      
      // Calculate similarity
      const similarity = computeSimilarity(leftText, rightText);
      if (simEl) simEl.textContent = `Similarity: ${similarity}%`;
      
      // Show diff statistics
      const addedLines = rightResult.filter(line => line.type === 'added').length;
      const removedLines = leftResult.filter(line => line.type === 'removed').length;
      const modifiedLines = leftResult.filter(line => line.type === 'modified').length;
      
      let statsMsg = '';
      if (addedLines + removedLines + modifiedLines === 0) {
        statsMsg = 'No differences found';
      } else {
        const stats = [];
        if (addedLines > 0) stats.push(`${addedLines} added`);
        if (removedLines > 0) stats.push(`${removedLines} removed`);
        if (modifiedLines > 0) stats.push(`${modifiedLines} modified`);
        statsMsg = `${stats.join(', ')} lines`;
      }
      
      setStatus(`Ready - ${statsMsg}`);
      highlightSearch(); // Update search highlights
      
    } catch (error) {
      console.error('Error computing diff:', error);
      setStatus('Error computing diff', false);
      hideSideBySideResults();
    }
  }
  function detectKind(s) {
    if (!s || !s.trim()) return null;
    const t = s.trim();
    if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) return 'JSON';
    if (t.startsWith('<')) return 'XML/HTML';
    return null;
  }

  // hook control events to update (with safety checks)
  [wordLevelChk, ignoreWsChk, ignoreCaseChk, showLinesChk].filter(Boolean).forEach(cb=>{
    if (cb && typeof cb.addEventListener === 'function') {
      cb.addEventListener('change', ()=>{
        updateGutters(); 
        scheduleUpdate(60);
      });
    }
  });
  
  if (compareBtn) compareBtn.addEventListener('click', ()=> updateResult(true));

  if (copyBtn) {
    copyBtn.addEventListener('click', async ()=>{
      try { 
        await navigator.clipboard.writeText(resultEl.innerText || ''); 
        setStatus('Result copied to clipboard'); 
        copyBtn.classList.add('tc-success');
        setTimeout(() => copyBtn.classList.remove('tc-success'), 300);
      }
      catch { setStatus('Copy failed', false); }
    });
  }

  // Copy diff only button
  if (copyDiffBtn) {
    copyDiffBtn.addEventListener('click', async ()=>{
      try {
        const diffElements = resultEl.querySelectorAll('.diff-added, .diff-removed, .diff-modified');
        const diffText = Array.from(diffElements).map(el => el.textContent).join('\n');
        await navigator.clipboard.writeText(diffText || 'No differences found'); 
        setStatus('Differences copied to clipboard'); 
        copyDiffBtn.classList.add('tc-success');
        setTimeout(() => copyDiffBtn.classList.remove('tc-success'), 300);
      }
      catch { setStatus('Copy failed', false); }
    });
  }

  // Copy left text button
  if (copyLeftBtn) {
    copyLeftBtn.addEventListener('click', async ()=>{
      try { 
        await navigator.clipboard.writeText(t1?.value || ''); 
        setStatus('Original text copied to clipboard'); 
        copyLeftBtn.classList.add('tc-success');
        setTimeout(() => copyLeftBtn.classList.remove('tc-success'), 300);
      }
      catch { setStatus('Copy failed', false); }
    });
  }

  // Copy right text button
  if (copyRightBtn) {
    copyRightBtn.addEventListener('click', async ()=>{
      try { 
        await navigator.clipboard.writeText(t2?.value || ''); 
        setStatus('Modified text copied to clipboard'); 
        copyRightBtn.classList.add('tc-success');
        setTimeout(() => copyRightBtn.classList.remove('tc-success'), 300);
      }
      catch { setStatus('Copy failed', false); }
    });
  }

  // Paste left button
  if (pasteLeftBtn) {
    pasteLeftBtn.addEventListener('click', async ()=>{
      try { 
        const text = await navigator.clipboard.readText(); 
        if (t1) {
          t1.value = text;
          updateGutters(); 
          scheduleUpdate();
          setStatus('Text pasted to original side'); 
        }
      }
      catch { setStatus('Paste failed - check clipboard permissions', false); }
    });
  }

  // Paste right button
  if (pasteRightBtn) {
    pasteRightBtn.addEventListener('click', async ()=>{
      try { 
        const text = await navigator.clipboard.readText(); 
        if (t2) {
          t2.value = text;
          updateGutters(); 
          scheduleUpdate();
          setStatus('Text pasted to modified side'); 
        }
      }
      catch { setStatus('Paste failed - check clipboard permissions', false); }
    });
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', ()=>{
      if (t1) t1.value=''; 
      if (t2) t2.value=''; 
      hideSideBySideResults();
      updateGutters(); 
      setStatus('Cleared'); 
      if (simEl) simEl.textContent=''; 
      notice(''); 
      highlightSearch(); // clear search highlights after clearing
    });
  }

  // textareas: input/paste -> update gutters & schedule diff
  [t1,t2].filter(Boolean).forEach(ta=>{
    if (ta) {
      ta.addEventListener('input', ()=>{ updateGutters(); scheduleUpdate(); });
      ta.addEventListener('paste', ()=>{ setTimeout(()=>{ updateGutters(); scheduleUpdate(); }, 20); });
      ta.addEventListener('keydown', (ev)=>{ 
        const isMac = navigator.platform.toLowerCase().includes('mac'); 
        const mod = isMac ? ev.metaKey : ev.ctrlKey; 
        if (mod && ev.key === 'Enter'){ 
          ev.preventDefault(); 
          updateResult(true); 
        } 
      });
    }
  });

  // initial sample
  if (t1 && t2 && !t1.value && !t2.value) {
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
    if (!splitter || !leftWrap || !rightWrap || !mainEl) return;
    
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
  attachResultScrollSync();

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
    const q = (searchInput ? searchInput.value || '' : '').trim();
    
    // Clear previous highlights
    [leftContentResult, rightContentResult].forEach(contentEl => {
      if (!contentEl) return;
      let html = contentEl.innerHTML;
      contentEl.innerHTML = html.replace(/<span class="tc-search-highlight"[^>]*>(.*?)<\/span>/g, '$1');
    });
    
    searchMatches = [];
    searchIndex = 0;
    
    if (!q) return;
    
    // Add new highlights to both sides
    let matchCount = 0;
    const re = new RegExp(escapeRegExp(q), 'gi');
    
    [leftContentResult, rightContentResult].forEach((contentEl, sideIndex) => {
      if (!contentEl) return;
      
      let html = contentEl.innerHTML;
      html = html.replace(re, m => {
        matchCount++;
        return `<span class="tc-search-highlight" data-match-idx="${matchCount-1}" data-side="${sideIndex}">${escapeHtml(m)}</span>`;
      });
      contentEl.innerHTML = html;
      
      // Collect highlights from this side
      const sideMatches = Array.from(contentEl.querySelectorAll('.tc-search-highlight'));
      searchMatches.push(...sideMatches);
    });
    
    scrollToCurrentMatch();
  }

  function scrollToCurrentMatch() {
    if (!searchMatches.length) return;
    
    searchMatches.forEach((el, i) => {
      el.style.outline = (i === searchIndex) ? '2px solid #2563eb' : '';
      el.style.background = (i === searchIndex) ? '#dbeafe !important' : '';
    });
    
    const el = searchMatches[searchIndex];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Also scroll the corresponding side
      const side = el.getAttribute('data-side');
      const contentEl = side === '0' ? leftContentResult : rightContentResult;
      if (contentEl) {
        contentEl.scrollTop = el.offsetTop - contentEl.clientHeight / 2;
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => { highlightSearch(); });
  }
  
  if (searchPrevBtn) {
    searchPrevBtn.addEventListener('click', () => {
      if (!searchMatches.length) return;
      searchIndex = (searchIndex - 1 + searchMatches.length) % searchMatches.length;
      scrollToCurrentMatch();
    });
  }
  
  if (searchNextBtn) {
    searchNextBtn.addEventListener('click', () => {
      if (!searchMatches.length) return;
      searchIndex = (searchIndex + 1) % searchMatches.length;
      scrollToCurrentMatch();
    });
  }
  } // end setupTextComparer
}
