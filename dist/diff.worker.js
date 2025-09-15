// diff.worker.js
// Web Worker for heavy diffing (token-level diff + optional char-LCS mapping).
// This file should be served alongside your app and referenced as `new Worker('diff.worker.js')`.

self.onmessage = function(e) {
  const msg = e.data;
  if (!msg) return;
  const t0 = Date.now();
  const { id, type, left = '', right = '', opts = {}, charLcsLimit = 0 } = msg;

  if (type === 'compute') {
    try {
      // Tokenization
      const tokenize = opts.wordLevel ? (s => s.split(/(\s+)/)) : (s => s.split(''));
      let aTokens = tokenize(left), bTokens = tokenize(right);
      if (opts.ignoreWs) { aTokens = aTokens.filter(x => !/^\s+$/.test(x)); bTokens = bTokens.filter(x => !/^\s+$/.test(x)); }
      if (opts.ignoreCase) { aTokens = aTokens.map(x => x.toLowerCase()); bTokens = bTokens.map(x => x.toLowerCase()); }

      const la = aTokens.length, lb = bTokens.length;
      // Build token-level LCS
      const lcs = Array(la + 1).fill(null).map(() => Array(lb + 1).fill(0));
      for (let i = la - 1; i >= 0; i--) {
        for (let j = lb - 1; j >= 0; j--) {
          lcs[i][j] = (aTokens[i] === bTokens[j]) ? 1 + lcs[i + 1][j + 1] : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
        }
      }
      let i = 0, j = 0, html = '', adds = 0, dels = 0, sames = 0;
      while (i < la || j < lb) {
        if (i < la && j < lb && aTokens[i] === bTokens[j]) { html += escapeHtml(aTokens[i]); i++; j++; sames++; }
        else if (j < lb && (i === la || lcs[i][j + 1] >= lcs[i + 1][j])) { html += '<span class="diff-add">' + escapeHtml(bTokens[j]) + '</span>'; j++; adds++; }
        else if (i < la && (j === lb || lcs[i][j + 1] < lcs[i + 1][j])) { html += '<span class="diff-del">' + escapeHtml(aTokens[i]) + '</span>'; i++; dels++; }
        else { if (i < la) { html += escapeHtml(aTokens[i]); i++; } else if (j < lb) { html += '<span class="diff-add">' + escapeHtml(bTokens[j]) + '</span>'; j++; adds++; } }
      }

      // Decide whether to run char-LCS mapping based on provided limit
      const mapPossible = (left.length * right.length) <= charLcsLimit && charLcsLimit > 0;
      let origToMod = [], modToOrig = [];
      if (mapPossible) {
        // Character-level LCS for mapping (expensive)
        const A = left.split(''), B = right.split('');
        const laC = A.length, lbC = B.length;
        const l = Array(laC + 1).fill(null).map(() => Array(lbC + 1).fill(0));
        for (let x = laC - 1; x >= 0; x--) {
          for (let y = lbC - 1; y >= 0; y--) {
            l[x][y] = (A[x] === B[y]) ? 1 + l[x + 1][y + 1] : Math.max(l[x + 1][y], l[x][y + 1]);
          }
        }
        origToMod = new Array(laC).fill(-1);
        modToOrig = new Array(lbC).fill(-1);
        let x = 0, y = 0;
        while (x < laC && y < lbC) {
          if (A[x] === B[y]) { origToMod[x] = y; modToOrig[y] = x; x++; y++; }
          else {
            if (l[x + 1][y] >= l[x][y + 1]) x++; else y++;
          }
        }
      }

      const durationMs = Date.now() - t0;
      self.postMessage({ id, type: 'done', html, adds, dels, sames, mapPossible, origToMod, modToOrig, durationMs });
    } catch (err) {
      self.postMessage({ id, type: 'error', message: String(err || 'unknown') });
    }
  }
};

function escapeHtml(s) { return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
