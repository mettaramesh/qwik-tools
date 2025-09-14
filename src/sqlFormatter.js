// SQL Formatter Tool for Qwik (robust, browser-only, no deps)
// Drop-in module: call load(container) then setup(container).
// Improved tokenizer + formatter to handle quotes, comments, parentheses, CASE, joins, subqueries, etc.

const KEYWORD_CLAUSES = new Set([
  'select','from','where','group by','order by','having','limit','offset',
  'insert','into','values','update','set','delete','with','union','except','intersect',
  'create','table','primary key','foreign key','references','alter','drop','add','column','index','view','exists'
]);

const KEYWORD_INLINE = new Set([
  'and','or','on','as','by','into','using','when','then','else'
]);

const BREAK_BEFORE = new Set([
  'select','from','where','group by','order by','having','limit','offset',
  'insert','update','delete','with','union','except','intersect'
]);

const SOFT_BREAK_AFTER_COMMA = new Set(['select','group by','order by','values','set']);

function isSpace(ch) { return /\s/.test(ch); }
function isIdentifierStart(ch) { return /[A-Za-z_@#]/.test(ch); }
function isIdentifierPart(ch) { return /[A-Za-z0-9_\$@#]/.test(ch); }

// Tokenize SQL into meaningful tokens, preserving quoted strings and comments
function tokenizeSQL(sql) {
  const tokens = [];
  let i = 0;
  const len = sql.length;

  while (i < len) {
    const ch = sql[i];

    // Whitespace (collapse to single space token to simplify)
    if (isSpace(ch)) {
      let j = i+1;
      while (j < len && isSpace(sql[j])) j++;
      tokens.push({ type: 'space', value: ' ' });
      i = j;
      continue;
    }

    // Single-line comment --
    if (ch === '-' && sql[i+1] === '-') {
      let j = i + 2;
      while (j < len && sql[j] !== '\n') j++;
      tokens.push({ type: 'comment', value: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Multi-line comment /* ... */
    if (ch === '/' && sql[i+1] === '*') {
      let j = i + 2;
      while (j < len && !(sql[j] === '*' && sql[j+1] === '/')) j++;
      j = Math.min(j+2, len);
      tokens.push({ type: 'comment', value: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Quoted strings: single ' or double " or dollar-quoted $tag$ in Postgres
    if (ch === "'" || ch === '"') {
      const quote = ch;
      let j = i + 1;
      let value = quote;
      while (j < len) {
        value += sql[j];
        if (sql[j] === quote) {
          // handle escaped quotes like '' inside single-quoted strings
          if (sql[j+1] === quote) {
            j += 2;
            value += sql[j-1] || '';
            continue;
          } else {
            j++;
            break;
          }
        }
        j++;
      }
      tokens.push({ type: 'string', value });
      i = j;
      continue;
    }

    // Backtick or square bracket identifiers (MySQL / SQL Server)
    if (ch === '`' || ch === '[') {
      const start = ch;
      const end = ch === '[' ? ']' : '`';
      let j = i + 1;
      let value = start;
      while (j < len) {
        value += sql[j];
        if (sql[j] === end) {
          j++;
          break;
        }
        j++;
      }
      tokens.push({ type: 'identifier', value });
      i = j;
      continue;
    }

    // Dollar-quoted string for Postgres $tag$...$tag$
    if (ch === '$') {
      // detect opening tag like $tag$
      const dollarTagMatch = sql.slice(i).match(/^\$[A-Za-z0-9_]*\$/);
      if (dollarTagMatch) {
        const tag = dollarTagMatch[0];
        let j = i + tag.length;
        let idx = sql.indexOf(tag, j);
        if (idx === -1) idx = len;
        const value = sql.slice(i, idx + tag.length);
        tokens.push({ type: 'string', value });
        i = idx + tag.length;
        continue;
      }
    }

    // Parentheses and punctuation
    if (ch === '(' || ch === ')' || ch === ',' || ch === ';' ) {
      tokens.push({ type: 'punct', value: ch });
      i++;
      continue;
    }

    // Operators (simple subset)
    if (['=','+','-','*','/','%','<','>','!','|','&','^','~'].includes(ch)) {
      // combine multi-char operators
      let j = i+1;
      while (j < len && /[=<>]/.test(sql[j])) j++;
      tokens.push({ type: 'op', value: sql.slice(i,j) });
      i = j;
      continue;
    }

    // Identifiers / keywords / numbers
    if (isIdentifierStart(ch) || /[0-9]/.test(ch)) {
      let j = i;
      while (j < len && (isIdentifierPart(sql[j]) || sql[j] === '.')) j++;
      const raw = sql.slice(i, j);
      tokens.push({ type: 'word', value: raw });
      i = j;
      continue;
    }

    // Anything else, take as single char token
    tokens.push({ type: 'char', value: ch });
    i++;
  }

  // Post-process: merge consecutive spaces into single space tokens already handled, but remove leading/trailing space tokens if needed later.
  return tokens;
}

// Normalize token value for keyword matching (multi-word support)
function tokenToNormalizedValue(token) {
  return token.value.replace(/\s+/g, ' ').trim().toLowerCase();
}

// Helper to peek ahead words to match multi-word keywords like "group by"
function peekPhrase(tokens, idx, phraseWords) {
  let j = idx;
  for (let w = 0; w < phraseWords.length; w++) {
    // skip space tokens if present
    while (tokens[j] && tokens[j].type === 'space') j++;
    if (!tokens[j]) return false;
    const t = tokens[j];
    if (t.type !== 'word') return false;
    if (t.value.toLowerCase() !== phraseWords[w]) return false;
    j++;
  }
  return true;
}

// Join tokens into a simple string (for final fallback)
function tokensToString(tokens) {
  return tokens.map(t => t.value).join('');
}

// Main formatting engine
function formatSQL(sql, options = {}) {
  if (!sql || !sql.trim()) return '';

  // Pre-normalize line endings
  sql = sql.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Tokenize input
  const rawTokens = tokenizeSQL(sql);

  // We'll walk tokens and produce formatted lines
  const out = [];
  let indentLevel = 0;
  const indentUnit = '  ';
  let i = 0;
  const push = (str) => {
    out.push(str);
  };

  // track context
  let lastNonSpace = null;
  let lastKeyword = null;
  let inSelect = false;
  let selectParenDepth = 0;
  let lineStarted = false;

  function writeNewline() {
    // avoid multiple blank lines
    if (out.length === 0) {
      out.push('\n');
      lineStarted = false;
      return;
    }
    const last = out[out.length-1];
    if (last.endsWith('\n')) {
      // already newline at end
      return;
    } else {
      out.push('\n');
      lineStarted = false;
    }
  }

  function writeIndent() {
    let s = '';
    for (let k = 0; k < indentLevel; k++) s += indentUnit;
    out.push(s);
    lineStarted = true;
  }

  function writeTokenText(txt) {
    out.push(txt);
    lineStarted = true;
  }

  // Helper to flush a space if previous char isn't space or a newline
  function ensureSpace() {
    const last = out.length ? out[out.length-1] : '';
    if (!last) { out.push(''); return; }
    const tail = out.join('').slice(-1);
    if (tail !== ' ' && tail !== '\n') out.push(' ');
  }

  // Utility to emit a clause header (e.g., SELECT, FROM) on its own line at current indent
  function emitClause(keyword) {
    writeNewline();
    writeIndent();
    writeTokenText(keyword.toUpperCase());
    lastKeyword = keyword.toLowerCase();
    lineStarted = true;
  }

  while (i < rawTokens.length) {
    const t = rawTokens[i];

    // skip redundant space tokens but will insert single spaces where needed
    if (t.type === 'space') {
      i++;
      continue;
    }

    // comments: place on new line
    if (t.type === 'comment') {
      writeNewline();
      writeIndent();
      writeTokenText(t.value.trim());
      writeNewline();
      i++;
      continue;
    }

    // combine multi-word clause keywords (e.g., GROUP BY, ORDER BY, LEFT JOIN)
    // We'll try to detect phrases up to 3 words.
    const look3 = (idx) => {
      const words = [];
      let j = idx;
      while (j < rawTokens.length && words.length < 3) {
        if (rawTokens[j].type === 'space') { j++; continue; }
        if (rawTokens[j].type === 'word') {
          words.push(rawTokens[j].value.toLowerCase());
          j++;
        } else break;
      }
      return words.join(' ');
    };
    const phrase = look3(i);

    // check for clause keywords (prefer longer matches)
    let matchedClause = null;
    // Try 3-word, then 2-word, then 1-word
    for (const len of [3,2,1]) {
      const words = [];
      let j = i;
      while (j < rawTokens.length && words.length < len) {
        if (rawTokens[j].type === 'space') { j++; continue; }
        if (rawTokens[j].type === 'word') {
          words.push(rawTokens[j].value.toLowerCase());
          j++;
        } else break;
      }
      if (!words.length) continue;
      const candidate = words.join(' ');
      if (BREAK_BEFORE.has(candidate) || KEYWORD_CLAUSES.has(candidate)) {
        matchedClause = candidate;
        break;
      }
    }

    // If matchedClause found, emit it on its own line (except WITH which may be initial)
    if (matchedClause) {
      // Handle UNION/EXCEPT/INTERSECT that should be surrounded by newlines
      if (['union','except','intersect'].includes(matchedClause)) {
        writeNewline();
        writeIndent();
        writeTokenText(matchedClause.toUpperCase());
        writeNewline();
        i += matchedClause.split(' ').length;
        lastKeyword = matchedClause;
        continue;
      }

      // Emit clause
      emitClause(matchedClause);
      // advance token index by clause word count
      let steps = matchedClause.split(' ').length;
      // consume words and any immediate spaces
      let consumed = 0;
      while (consumed < steps && i < rawTokens.length) {
        if (rawTokens[i].type === 'space') { i++; continue; }
        i++; consumed++;
      }
      // After certain clauses, adjust flags
      const lk = matchedClause.toLowerCase();
      inSelect = (lk === 'select');
      if (inSelect) selectParenDepth = 0;
      continue;
    }

    // Parentheses handling
    if (t.type === 'punct' && t.value === '(') {
      // if previous token was SELECT list or function, we want '(' attached
      // But we'll add space before '(' if appropriate
      ensureSpace();
      writeTokenText('(');
      indentLevel++;
      // track selectParenDepth to handle SELECT ( ... ) subqueries
      if (lastKeyword === 'select') selectParenDepth++;
      i++;
      continue;
    }
    if (t.type === 'punct' && t.value === ')') {
      indentLevel = Math.max(0, indentLevel - 1);
      writeNewline();
      writeIndent();
      writeTokenText(')');
      i++;
      continue;
    }

    // Comma handling: break lines when in SELECT/GROUP BY/ORDER BY lists
    if (t.type === 'punct' && t.value === ',') {
      writeTokenText(',');
      // If we are inside a list-like clause, break the line
      if (['select','group by','order by','values','set'].includes(lastKeyword)) {
        writeNewline();
        writeIndent();
        // indent one deeper for select list items
        if (lastKeyword === 'select') {
          // add one more indent level visually for list items
          writeIndent();
        }
      } else {
        ensureSpace();
      }
      i++;
      continue;
    }

    // Semicolon -> end of statement
    if (t.type === 'punct' && t.value === ';') {
      writeTokenText(';');
      writeNewline();
      i++;
      continue;
    }

    // Strings and identifiers: just write, preserving spacing
    if (t.type === 'string' || t.type === 'identifier') {
      ensureSpace();
      writeTokenText(t.value);
      lastNonSpace = t;
      i++;
      continue;
    }

    // Operators and punctuation
    if (t.type === 'op' || t.type === 'char') {
      ensureSpace();
      writeTokenText(t.value);
      lastNonSpace = t;
      i++;
      continue;
    }

    // Words: could be keywords or names
    if (t.type === 'word') {
      const valLower = t.value.toLowerCase();

      // Check if this starts a CASE/WHEN/END block
      if (valLower === 'case') {
        writeNewline();
        writeIndent();
        writeTokenText('CASE');
        indentLevel++;
        lastKeyword = 'case';
        i++;
        continue;
      }
      if (valLower === 'when' || valLower === 'then') {
        writeNewline();
        writeIndent();
        // indent one deeper inside CASE for WHEN/THEN
        writeIndent();
        writeTokenText(t.value.toUpperCase());
        i++;
        continue;
      }
      if (valLower === 'else') {
        writeNewline();
        writeIndent();
        writeTokenText('ELSE');
        i++;
        continue;
      }
      if (valLower === 'end') {
        indentLevel = Math.max(0, indentLevel - 1);
        writeNewline();
        writeIndent();
        writeTokenText('END');
        i++;
        continue;
      }

      // JOIN variants: newline before join and indent ON afterward
      if (valLower === 'join' || valLower.endsWith('join')) {
        writeNewline();
        writeIndent();
        writeTokenText(t.value.toUpperCase());
        lastKeyword = 'join';
        i++;
        continue;
      }

      // ON clause: newline + indent
      if (valLower === 'on') {
        writeNewline();
        writeIndent();
        writeTokenText('ON');
        ensureSpace();
        i++;
        continue;
      }

      // AND / OR conditions: break the line to show readable conditions
      if (valLower === 'and' || valLower === 'or') {
        writeNewline();
        writeIndent();
        writeTokenText(valLower.toUpperCase());
        ensureSpace();
        i++;
        continue;
      }

      // Simple keyword clauses like WHERE/HAVING (if not matched above)
      if (BREAK_BEFORE.has(valLower)) {
        emitClause(valLower);
        lastKeyword = valLower;
        i++;
        continue;
      }

      // General keyword detection to uppercase certain words (AS, DISTINCT, LIMIT, ORDER, GROUP etc.)
      const up = t.value.toUpperCase();
      if (KEYWORD_INLINE.has(valLower) || KEYWORD_CLAUSES.has(valLower) || /^[A-Za-z]+$/.test(t.value) && /[^a-z]/i.test(up) === false) {
        // If it's a recognized keyword, uppercase it
        // But avoid forcing uppercase on table/column names that might look like words; be conservative:
        // Uppercase if token matches common SQL keyword list (KEYWORD_CLAUSES ∪ KEYWORD_INLINE ∪ BREAK_BEFORE)
        if (KEYWORD_CLAUSES.has(valLower) || KEYWORD_INLINE.has(valLower) || BREAK_BEFORE.has(valLower) || ['select','from','where','group','order','having','limit','offset','insert','update','delete'].includes(valLower)) {
          // if we are at start of line, just write it
          if (!lineStarted) writeIndent();
          else ensureSpace();
          writeTokenText(up);
          lastKeyword = valLower;
          i++;
          continue;
        }
      }

      // Default: regular identifier/word (table, column, alias)
      if (!lineStarted) writeIndent();
      else ensureSpace();
      writeTokenText(t.value);
      lastNonSpace = t;
      i++;
      continue;
    }

    // Fallback: write token raw
    ensureSpace();
    writeTokenText(t.value);
    i++;
  }

  // Combine output and tidy whitespace: collapse redundant spaces and ensure newline endings
  const combined = out.join('');

  // Post-process: collapse repeated spaces except in strings
  // Simple cleanup: remove trailing spaces at line ends
  const cleaned = combined.split('\n').map(line => line.replace(/[ \t]+$/,'')).join('\n');

  // Trim leading/trailing blank lines
  return cleaned.replace(/^\n+/, '').replace(/\n+$/, '');
}

// Minify: remove comments and condense whitespace while preserving string literals
function minifySQL(sql) {
  if (!sql) return '';
  // Remove comments but not inside strings: simple state machine
  let i = 0, len = sql.length;
  let out = '';
  while (i < len) {
    // handle strings
    if (sql[i] === "'" || sql[i] === '"') {
      const quote = sql[i];
      out += quote;
      i++;
      while (i < len) {
        out += sql[i];
        if (sql[i] === quote) {
          // handle escaped quotes
          if (sql[i+1] === quote) {
            i += 2;
            out += sql[i-1] || '';
            continue;
          } else {
            i++;
            break;
          }
        }
        i++;
      }
      continue;
    }
    // single-line comment
    if (sql[i] === '-' && sql[i+1] === '-') {
      while (i < len && sql[i] !== '\n') i++;
      continue;
    }
    // block comment
    if (sql[i] === '/' && sql[i+1] === '*') {
      i += 2;
      while (i < len && !(sql[i] === '*' && sql[i+1] === '/')) i++;
      i += 2;
      continue;
    }
    // whitespace => collapse to single space
    if (isSpace(sql[i])) {
      out += ' ';
      while (i < len && isSpace(sql[i])) i++;
      continue;
    }
    out += sql[i];
    i++;
  }
  return out.trim().replace(/\s*,\s*/g, ', ').replace(/\s*\(\s*/g, '(').replace(/\s*\)\s*/g, ')');
}

// UI Module (load + setup) — container-based
export function load(container) {
  container.innerHTML = `
    <div class="tool-header"><h2>SQL Formatter</h2><p class="small">Format, beautify, or minify SQL queries — robust tokenizer & formatter.</p></div>
    <div class="card">
  <div class="sql-flex-row">
        <button class="btn btn--secondary" id="sql-format-btn">Format</button>
        <button class="btn btn--outline" id="sql-minify-btn">Minify</button>
        <button class="btn btn--outline" id="sql-clear-btn">Clear</button>
  <label class="sql-label-flex">
          <input type="checkbox" id="preserve-case" /> Preserve case (don't uppercase keywords)
        </label>
      </div>

  <div class="sql-flex-wrap">
  <div class="sql-flex-1">
          <div class="sql-flex-between">
            <label class="form-label">Input SQL</label>
            <button class="btn btn--sm copy-btn" data-target="sql-input">Copy</button>
          </div>
          <textarea id="sql-input" class="form-control code-input sql-mono" placeholder="Paste or type your SQL here..." rows="12"></textarea>
        </div>
  <div class="sql-flex-1">
          <div class="sql-flex-between">
            <label class="form-label">Formatted Output</label>
            <button class="btn btn--sm copy-btn" data-target="sql-output">Copy</button>
          </div>
          <textarea id="sql-output" class="form-control code-input sql-mono" readonly rows="12"></textarea>
        </div>
      </div>

  <div id="sql-error" class="error-message hidden sql-error-mt"></div>
    </div>
  `;
}

export function setup(container) {
  if (!container || typeof container.querySelector !== 'function') {
    throw new Error('SQL Formatter setup: container argument is required and must be a DOM element.');
  }
  // container is the parent element returned from load()
  const root = container;
  const input = root.querySelector('#sql-input');
  const output = root.querySelector('#sql-output');
  const formatBtn = root.querySelector('#sql-format-btn');
  const minifyBtn = root.querySelector('#sql-minify-btn');
  const clearBtn = root.querySelector('#sql-clear-btn');
  const errorDiv = root.querySelector('#sql-error');
  const copyButtons = root.querySelectorAll('.copy-btn');
  const preserveCaseCheckbox = root.querySelector('#preserve-case');

  // status small helper
  const statusSpan = document.createElement('span');
  statusSpan.className = 'small muted';
  statusSpan.style.marginLeft = '12px';
  output.parentElement.appendChild(statusSpan);

  function setStatus(msg, ok = true, autoClearMs = 2200) {
    statusSpan.textContent = msg || '';
    statusSpan.style.color = ok ? 'var(--color-success,#21808d)' : 'var(--color-error,#c0392b)';
    if (autoClearMs && msg) {
      setTimeout(() => {
        if (statusSpan.textContent === msg) statusSpan.textContent = '';
      }, autoClearMs);
    }
  }

  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');
  }
  function clearError() {
    if (errorDiv) {
      errorDiv.textContent = '';
      errorDiv.classList.add('hidden');
    }
  }

  formatBtn.addEventListener('click', () => {
    clearError();
    try {
      let formatted = formatSQL(input.value || '');
      if (!preserveCaseCheckbox.checked) {
        // uppercase SQL keywords — attempt conservative replacement on word boundaries
        // Only replace words that match common patterns to avoid touching identifiers containing keywords.
        formatted = formatted.replace(/\b(select|from|where|group by|order by|having|limit|offset|insert|into|values|update|set|delete|with|union|except|intersect|join|left join|right join|inner join|outer join|on|as|and|or|case|when|then|else|end|in|is|null|not|create|table|primary key|foreign key|references|alter|drop|add|column|index|view|exists|between|like|desc|asc|cast|coalesce|with|recursive)\b/gi, (m) => m.toUpperCase());
      }
      output.value = formatted;
      setStatus('Formatted', true);
    } catch (e) {
      showError('Formatting error: ' + (e && e.message ? e.message : String(e)));
    }
  });

  minifyBtn.addEventListener('click', () => {
    clearError();
    try {
      const min = minifySQL(input.value || '');
      output.value = min;
      setStatus('Minified', true);
    } catch (e) {
      showError('Minify error: ' + (e && e.message ? e.message : String(e)));
    }
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    output.value = '';
    clearError();
    setStatus('Cleared', true);
  });

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (ev) => {
      const targetId = btn.getAttribute('data-target');
      const el = root.querySelector(`#${targetId}`);
      if (!el) return;
      try {
        await navigator.clipboard.writeText(el.value);
        setStatus('Copied!', true);
      } catch (err) {
        setStatus('Copy failed.', false);
      }
    });
  });

  // smart keyboard shortcuts
  root.addEventListener('keydown', (ev) => {
    const isMac = navigator.platform.toLowerCase().includes('mac');
    const mod = isMac ? ev.metaKey : ev.ctrlKey;
    if (!mod) return;
    if (ev.shiftKey && ev.key.toLowerCase() === 'f') {
      ev.preventDefault();
      formatBtn.click();
    } else if (ev.shiftKey && ev.key.toLowerCase() === 'm') {
      ev.preventDefault();
      minifyBtn.click();
    }
  });

  // small auto-format on paste if user prefers (not enabled by default)
  // Optional: uncomment to enable auto-format on paste
  // input.addEventListener('paste', () => { setTimeout(() => formatBtn.click(), 50); });

  // initial focus
  input.addEventListener('focus', () => input.select());
}

// For backwards compatibility: default exports similar to your original pattern
export default { load, setup, formatSQL, minifySQL };
