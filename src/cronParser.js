// Qwik-style Cron Tool
(function ensureQwikCronStyle(){
  let style = document.getElementById('qwik-cron-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'qwik-cron-style';
    document.head.appendChild(style);
  }
  const add = (css, test) => { if (!new RegExp(test).test(style.textContent)) style.textContent += "\n" + css; };

  /* … [styles unchanged from your version] … */

  // --- keep your original CSS block exactly as-is to avoid diff noise ---
  add(`
.grid-cron { display: grid; gap: 28px 36px; grid-template-columns: 1.1fr .9fr; margin-bottom: 24px; }
@media (max-width: 900px) { .grid-cron { grid-template-columns: 1fr; } }
.card { background: var(--color-surface, #fff); border: 1.5px solid var(--color-border, #e0e0e0); border-radius: 14px; padding: 18px 18px 22px 18px; box-shadow: 0 2px 8px #0001; }
.bar, .row, .chips, .tabs, .btns, .stack, .out, .divider, .field, .inline, .help, .status, .code, .kbd, .note, .small { }
.btn.btn--primary { background: var(--color-primary, #21808d); color: #fff; border: none; padding: 10px 18px; font-size: 1em; border-radius: 10px; }
.btn.btn--outline { background: var(--color-surface, #fff); color: var(--color-primary, #21808d); border: 1.5px solid var(--color-primary, #21808d); padding: 10px 18px; font-size: 1em; border-radius: 10px; }
.code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; background: var(--color-background, #f9f9f9); border: 1px dashed var(--color-border, #2a2f47); border-radius: 12px; padding: 10px 12px; word-break: break-all; }
.status { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; border: 1px solid var(--color-border, #2a2f47); background: var(--color-background, #f4f8fa); }
.status.ok { border-color: var(--color-success, #2b5); color: var(--color-primary, #21808d); }
.status.warn { border-color: var(--color-warning, #cc8a16); color: var(--color-warning, #ffb020); }
.status.err { border-color: var(--color-error, #c03); color: var(--color-error, #ff5978); }
.kbd { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; background: var(--color-surface, #e0e0e0); padding: 2px 6px; border-radius: 6px; border: 1px solid var(--color-border, #2a2f47); }
.note { font-size: .8rem; color: var(--color-text-secondary, #626c71); }
.small { font-size: .85rem; color: var(--color-text-secondary, #626c71); }
.divider { height: 1px; background: var(--color-border, #e0e0e0); margin: 10px 0; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { padding: 6px 10px; border: 1px solid var(--color-border, #2a2f47); background: var(--color-background, #f4f8fa); color: var(--color-text, #13343b); border-radius: 999px; cursor: pointer; user-select: none; font-size: .85rem; }
.chip:hover { border-color: var(--color-primary, #21808d); }
.tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.tab { padding: 8px 10px; border-radius: 10px; border: 1px solid var(--color-border, #e0e0e0); background: var(--color-background, #f4f8fa); cursor: pointer; font-size: .9rem; color: var(--color-text-secondary, #626c71); }
.tab.active { color: var(--color-text, #13343b); border-color: var(--color-primary, #21808d); background: var(--color-accent, #e0f7fa); }
.hidden { display: none !important; }
.inline { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.btns { display: flex; flex-wrap: wrap; gap: 8px; }
.stack { display: flex; flex-direction: column; gap: 8px; }
.field { display: flex; flex-direction: column; gap: 6px; }
label { font-size: .9rem; color: var(--color-primary, #21808d); }
.help { font-size: .9rem; color: var(--color-text-secondary, #626c71); }
`, "\\.grid-cron");

  add(`
.grid-cron .cron-right{ display:flex; flex-direction:column; min-height:0; }
.grid-cron .cron-right .stack{ overflow:auto; padding-bottom:8px; }
`, "\\.grid-cron \\.cron-right");

  add(`
.cron-actions-row-fixed{ display:flex; gap:16px; justify-content:flex-end; width:100%; margin:8px 0 0 0; position:sticky; bottom:0; z-index:20; background:var(--color-surface,#fff); padding:12px 0 8px 0; box-shadow:0 -6px 12px rgba(0,0,0,.06); }
`, "\\.cron-actions-row-fixed");

  add(`
.bar.cron-bar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.bar.cron-bar .presets-label { flex:1 1 auto; min-width:180px; }
.bar.cron-bar .switch { flex:0 0 auto; }
`, ".bar\\.cron-bar");

  add(`
.card select, .stack select, .field select { font-size:.93em; padding:7px 12px; border-radius:8px; min-width:90px; }
`, ".card select, .stack select, .field select (smaller)");

  add(`
.grid-cron { font-size:.97em; gap:22px 28px; }
.card, .card.card--section { font-size:.96em; padding:16px 12px 18px 12px; }
.stack { gap:7px; }
.row { gap:12px; margin-bottom:6px; }
.field { gap:4px; }
label { font-size:.85em; }
.card select, .stack select, .field select, .card input[type="text"], .stack input[type="text"], .field input[type="text"] { font-size:.93em; padding:7px 12px; border-radius:8px; min-width:90px; }
.card input[type="text"], .stack input[type="text"], .field input[type="text"] { width:100%; box-sizing:border-box; }
.btn, .btn.btn--primary, .btn.btn--outline { font-size:.93em; padding:7px 16px; border-radius:8px; }
`, ".grid-cron .card");

  add(`
.bar.cron-bar .presets-label { flex:1 1 220px; min-width:0; padding-right:12px; white-space:normal; word-break:break-word; }
.bar.cron-bar { align-items:flex-start; }
`, ".bar.cron-bar .presets-label");

  add(`
:root { --color-surface:#f8fafb; --color-border:#dbe6ea; --color-primary:#21808d; --color-primary-dark:#17606a; --color-accent:#ffb020; --color-success:#2b5; --color-error:#ff5978; --color-text:#13343b; --color-muted:#626c71; --color-bg-card:#fff; --color-bg-chip:#eaf6f8; --color-bg-tab:#e0f7fa; }
[data-theme="dark"], .theme-dark, body.dark { --color-surface:#1a2327; --color-border:#2c3a40; --color-primary:#4fd8e9; --color-primary-dark:#21808d; --color-accent:#ffb020; --color-success:#2b5; --color-error:#ff5978; --color-text:#eaf6f8; --color-muted:#b0bac0; --color-bg-card:#232e33; --color-bg-chip:#183a42; --color-bg-tab:#183a42; }
.card, .card.card--section { background:var(--color-bg-card); border:1.5px solid var(--color-border); color:var(--color-text); }
.bar.cron-bar, .divider { background:var(--color-surface); }
label, .tab, .chip, .btn, .btn.btn--primary, .btn.btn--outline { color:var(--color-primary); }
.tab { background:var(--color-bg-tab); border:1.5px solid var(--color-border); }
.tab.active { background:var(--color-bg-chip); color:var(--color-primary-dark); border-color:var(--color-primary); }
.chip { background:var(--color-bg-chip); border:1.5px solid var(--color-primary); color:var(--color-primary-dark); }
.chip:hover { background:var(--color-primary); color:#fff; border-color:var(--color-primary-dark); }
.btn.btn--primary { background:var(--color-primary); color:#fff; border:none; }
.btn.btn--primary:hover { background:var(--color-primary-dark); }
.btn.btn--outline { background:#fff; color:var(--color-primary); border:1.5px solid var(--color-primary); }
[data-theme="dark"] .btn.btn--outline, .theme-dark .btn.btn--outline, body.dark .btn.btn--outline { background:var(--color-bg-card); color:var(--color-primary); border:1.5px solid var(--color-primary); }
.btn.btn--outline:hover { background:var(--color-bg-tab); color:var(--color-primary-dark); border-color:var(--color-primary-dark); }
.status.ok { border-color:var(--color-success); color:var(--color-primary); }
.status.warn { border-color:var(--color-accent); color:var(--color-accent); }
.status.err { border-color:var(--color-error); color:var(--color-error); }
.code { background:#f4f8fa; border:1.5px dashed var(--color-primary); color:var(--color-text); }
[data-theme="dark"] .code, .theme-dark .code, body.dark .code { background:#232e33; border:1.5px dashed var(--color-primary); color:var(--color-text); }
.kbd { background:var(--color-bg-chip); color:var(--color-primary-dark); border:1px solid var(--color-border); }
.note, .small, .help { color:var(--color-muted); }
`, ":root color theme for cron parser");
})();

// ---- Helpers: script loading + parser resolution ----
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

let __cronLibsReady;
async function ensureCronLibsLoaded() {
  if (!__cronLibsReady) {
    __cronLibsReady = (async () => {
      await loadScript('/cron-js-parser.min.js');
      // normalize various globals into window["cron-js-parser"]
      if (!window["cron-js-parser"]) {
        const maybe = window.CronParser || window.cronParser || window.CRON_PARSER;
        if (maybe) window["cron-js-parser"] = { CronParser: maybe };
      }
      await loadScript('/cronstrue.min.js');
    })();
  }
  return __cronLibsReady;
}

// Return the parser ctor or null
function getCronParser() {
  const ns = window["cron-js-parser"];
  if (ns && ns.CronParser && typeof ns.CronParser.parseExpression === 'function') return ns.CronParser;
  if (window.CronParser && typeof window.CronParser.parseExpression === 'function') return window.CronParser;
  if (window.cronParser && typeof window.cronParser.parseExpression === 'function') return window.cronParser;
  return null;
}

// Cron Parser + Builder Tool (Qwik style)
function setupCronParserTool() {
  const builderPanel = document.getElementById('cronBuilderPanel');
  const outputPanel  = document.getElementById('cronOutputPanel');
  if (!builderPanel || !outputPanel) {
    console.error('cronBuilderPanel or cronOutputPanel not found in DOM');
    return;
  }
  builderPanel.innerHTML = getBuilderPanelHTML();
  outputPanel.innerHTML  = getOutputPanelHTML();
  setTimeout(cronBuilderLogic, 0);
}

function getBuilderPanelHTML() {
  return `
    <div class="tabs" id="tabs">
      <div class="tab active" data-tab="simple">Simple</div>
      <div class="tab" data-tab="advanced">Advanced</div>
      <div class="tab" data-tab="special">Special (W/L/?/#)</div>
      <div class="tab" data-tab="parse">Parse</div>
    </div>
    <div class="divider"></div>
    <div id="tab-simple" class="stack card card--section">
      <div class="row">
        <div class="field"><label>Minute</label><select id="simple-minute"></select></div>
        <div class="field"><label>Hour</label><select id="simple-hour"></select></div>
      </div>
      <div class="row">
        <div class="field"><label>Day of month</label><select id="simple-dom"></select></div>
        <div class="field"><label>Month</label><select id="simple-month"></select></div>
      </div>
      <div class="row">
        <div class="field"><label>Day of week</label><select id="simple-dow"></select></div>
      </div>
    </div>
    <div id="tab-advanced" class="hidden card card--section stack">
      <div class="field">
        <label>Advanced Expression</label>
  <input id="advanced-cron" type="text" class="code cron-input-lg" placeholder="e.g. 0 0/5 1,15 * 1-5" />
      </div>
      <div class="field">
        <label>Quick Info</label>
        <div class="help small">
          Enter a full cron expression (5 or 6 fields).<br/>Supports ranges, steps, lists, and special characters.<br/>
          Example: <span class="kbd">0 0/5 1,15 * 1-5</span>
        </div>
      </div>
      <div class="btns"><button id="btnAdvancedApply" class="btn btn--primary">Apply</button></div>
    </div>
    <div id="tab-special" class="hidden card card--section stack">
      <div class="field">
        <label>Special Expression (W/L/?/#)</label>
  <input id="special-cron" type="text" class="code cron-input-lg" placeholder="e.g. 0 0 1W * ?" />
      </div>
      <div class="field">
        <label>Quick Info</label>
        <div class="help small">
          Use <span class="kbd">W</span> (nearest weekday), <span class="kbd">L</span> (last), <span class="kbd">?</span> (no specific), <span class="kbd">#</span> (nth weekday).
        </div>
      </div>
      <div class="btns"><button id="btnSpecialApply" class="btn btn--primary">Apply</button></div>
    </div>
    <div id="tab-parse" class="hidden card card--section stack">
      <div class="field">
        <label>Paste or Enter Any Cron Expression</label>
  <input id="parse-cron" type="text" class="code cron-input-lg" placeholder="e.g. 0 12 * * MON-FRI" />
      </div>
      <div class="btns"><button id="btnParse" class="btn btn--primary">Parse</button></div>
      <div class="field"><label>Explanation</label><div class="status" id="parseExplainBox"><div id="parseExplainText" class="small">—</div></div></div>
      <div class="field">
        <label>Validation</label>
        <div class="status ok" id="parseValidBox"><div class="stack"><div id="parseValidTitle"><strong>—</strong></div><div class="small" id="parseValidDetail">—</div></div></div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="bar cron-bar">
      <div class="presets-label"><strong>Presets</strong> <span class="note">Click to fill the fields. Tweak afterward.</span></div>
    </div>
    <div class="chips" id="cronPresets"></div>
    <div class="divider"></div>
  `;
}

function getOutputPanelHTML() {
  return `
    <div class="out">
      <div class="field"><label>Generated cron</label><div class="code" id="cronOut" tabindex="0">* * * * *</div></div>
    </div>
    <div class="divider"></div>
    <div class="stack">
      <div class="field"><label>Human-readable</label><div class="status" id="explainBox"><div id="explainText">Every minute.</div></div></div>
      <div class="field">
        <label>Validation</label>
        <div class="status ok" id="validBox"><div class="stack"><div id="validTitle"><strong>Looks good.</strong></div><div class="small" id="validDetail">Expression structure is valid.</div></div></div>
      </div>
      <div class="field"><label>Notes</label><div class="help">• 5-field order is <span class="kbd">min hour dom mon dow</span>.<br/>• For specific <span class="kbd">dom</span>, set <span class="kbd">dow</span> to <span class="kbd">?</span>.<br/>• Impossible dates trigger warnings.</div></div>
  <div class="field"><label>Info</label><div class="status" id="cronInfoBox"></div></div>
      <div class="cron-actions-row-fixed">
        <button class="btn btn--outline" id="btnCopy">Copy</button>
        <button class="btn btn--primary" id="btnExplain">Explain</button>
      </div>
    </div>
  `;
}

// --- Main builder logic ---
function cronBuilderLogic() {
  // Utilities to fill selects
  function fillSelect(id, start, end, withStarLabel) {
    const sel = document.getElementById(id); if (!sel) return;
    sel.innerHTML = '';
    if (withStarLabel) {
      const o = document.createElement('option'); o.value='*'; o.textContent=withStarLabel; sel.appendChild(o);
    }
    for (let i=start;i<=end;i++){ const o=document.createElement('option'); o.value=String(i); o.textContent=String(i); sel.appendChild(o); }
  }
  function fillMonths(id){
    const sel=document.getElementById(id); if(!sel) return;
    sel.innerHTML=''; const star=document.createElement('option'); star.value='*'; star.textContent='Every month *'; sel.appendChild(star);
    const months=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    for(let i=1;i<=12;i++){ const o=document.createElement('option'); o.value=String(i); o.textContent=`${i} (${months[i-1]})`; sel.appendChild(o); }
  }
  function fillDOW(id, includeQuestion){
    const sel=document.getElementById(id); if(!sel) return;
    sel.innerHTML='';
    if(includeQuestion){ const q=document.createElement('option'); q.value='?'; q.textContent='No specific day ?'; sel.appendChild(q); }
    else { const star=document.createElement('option'); star.value='*'; star.textContent='Every day *'; sel.appendChild(star); }
    const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    for(let i=0;i<=6;i++){ const o=document.createElement('option'); o.value=String(i); o.textContent=`${i} (${days[i]})`; sel.appendChild(o); }
  }

  fillSelect('simple-minute',0,59,'Every minute *');
  fillSelect('simple-hour',0,23,'Every hour *');
  fillSelect('simple-dom',1,31,'Every day *');
  fillMonths('simple-month');
  fillDOW('simple-dow',true);

  const tabs = document.getElementById('tabs');
  if (tabs) {
    tabs.addEventListener('click', (e)=>{
      const btn = e.target.closest?.('.tab'); if(!btn) return;
      [...tabs.children].forEach(t=>t.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.dataset.tab;
      for (const el of ['simple','advanced','special','parse']){
        const node = document.getElementById('tab-'+el);
        if (node) node.classList.toggle('hidden', el!==id);
      }
    });
  }

  // Presets
  const presets = document.getElementById('cronPresets');
  if (presets) {
    presets.innerHTML='';
    const addPreset=(label,expr)=>{
      const chip=document.createElement('div');
      chip.className='chip'; chip.textContent=label; chip.title=expr;
      chip.addEventListener('click',()=>{
        const m=document.getElementById('simple-minute'); if(m) m.value='0';
        const h=document.getElementById('simple-hour');  if(h) h.value='0';
        const d=document.getElementById('simple-dom');   if(d) d.value='1';
        const mo=document.getElementById('simple-month');if(mo) mo.value='1';
        const w=document.getElementById('simple-dow');   if(w) w.value='0';
        const out=document.getElementById('cronOut'); if(out) out.textContent=expr;
        const ex=document.getElementById('explainText'); if(ex) ex.textContent=`At ${label.toLowerCase()}.`;
        const vb=document.getElementById('validBox'); if(vb) vb.className='status ok';
        const vt=document.getElementById('validTitle'); if(vt) vt.innerHTML='<strong>Looks good.</strong>';
        const vd=document.getElementById('validDetail'); if(vd) vd.textContent='Expression structure is valid.';
      });
      presets.appendChild(chip);
    };
    addPreset('Every 5 Minutes','*/5 * * * *');
    addPreset('Hourly','0 * * * *');
    addPreset('Daily','0 0 * * *');
    addPreset('Weekly','0 0 * * 0');
    addPreset('Monthly','0 0 1 * *');
  }

  // Update Simple tab → cronOut
  const minuteSel=document.getElementById('simple-minute');
  const hourSel  =document.getElementById('simple-hour');
  const domSel   =document.getElementById('simple-dom');
  const monthSel =document.getElementById('simple-month');
  const dowSel   =document.getElementById('simple-dow');

  function explainCron(expr){
    const parts = expr.trim().split(/\s+/);
    if (parts.length < 5) return 'Invalid cron expression.';
    let [min,hr,dom,mon,dow] = parts;
    return `Minute ${min}, hour ${hr}, day-of-month ${dom}, month ${mon}, day-of-week ${dow}`;
  }
  function updateSimpleCron(){
    const min=minuteSel?.value ?? '*', hr=hourSel?.value ?? '*', dom=domSel?.value ?? '*', mon=monthSel?.value ?? '*', dow=dowSel?.value ?? '*';
    const cron = `${min} ${hr} ${dom} ${mon} ${dow}`;
    const out=document.getElementById('cronOut'); if(out) out.textContent=cron;
    const ex=document.getElementById('explainText'); if(ex) ex.textContent=explainCron(cron);
    const vb=document.getElementById('validBox'); if(vb) vb.className='status ok';
    const vt=document.getElementById('validTitle'); if(vt) vt.innerHTML='<strong>Looks good.</strong>';
    const vd=document.getElementById('validDetail'); if(vd) vd.textContent='Expression structure is valid.';
  }
  [minuteSel, hourSel, domSel, monthSel, dowSel].forEach(sel => sel && sel.addEventListener('change', updateSimpleCron));

  // Info helper
  const infoBox=document.getElementById('cronInfoBox'); let infoBoxTimeout=null;
  function showInfo(msg,type='info'){
    if(!infoBox) return;
  infoBox.textContent=msg;
  infoBox.className='status '+(type==='warn'?'warn':type==='err'?'err':'ok')+' cron-info-visible';
  if(infoBoxTimeout) clearTimeout(infoBoxTimeout);
  infoBoxTimeout=setTimeout(()=>{ infoBox.classList.remove('cron-info-visible'); }, 120000);
  }

  // Copy
  const btnCopy=document.getElementById('btnCopy');
  if (btnCopy) btnCopy.addEventListener('click', async ()=>{
    const txt=document.getElementById('cronOut')?.textContent?.trim() ?? '';
    try { await navigator.clipboard.writeText(txt); showInfo('Cron expression copied to clipboard.','info'); }
    catch { showInfo('Could not copy to clipboard.','warn'); }
  });

  // Explain
  const btnExplain=document.getElementById('btnExplain');
  if (btnExplain) btnExplain.addEventListener('click', ()=>{
    const cronOut=document.getElementById('cronOut')?.textContent?.trim();
    if (!cronOut || cronOut==='* * * * *') return showInfo('Nothing to explain. Generate a cron first.','warn');
    const ex=document.getElementById('explainText'); if (ex) ex.textContent = (window.cronstrue?.toString?.(cronOut) ?? explainCron(cronOut));
    showInfo('Explanation updated.','info');
  });

  // ---- Validation helpers (DEFENSIVE) ----
  function validateCronExpression(expr){
    const Parser = getCronParser();
    if (!Parser) return null; // No strict validation if lib not ready; but no crash either
    try { Parser.parseExpression(expr, { iterator:true }); return null; }
    catch(e){ return e?.message || 'Invalid cron expression.'; }
  }

  // Advanced live validation
  const advancedCronInput=document.getElementById('advanced-cron');
  if (advancedCronInput) advancedCronInput.addEventListener('input', ()=>{
    const expr=advancedCronInput.value.trim();
    const statusBox=document.getElementById('validBox'); if(!statusBox) return;
    const vt=document.getElementById('validTitle'); const vd=document.getElementById('validDetail'); const desc=document.getElementById('explainText');

    if (!expr){ statusBox.className='status'; vt && (vt.innerHTML='<strong>—</strong>'); vd && (vd.textContent='Enter a cron expression.'); return; }

    const error = validateCronExpression(expr);
    if (error){ statusBox.className='status err'; vt && (vt.innerHTML='<strong>Error:</strong>'); vd && (vd.textContent=error); desc && (desc.textContent=''); }
    else { statusBox.className='status ok'; vt && (vt.innerHTML='<strong>Looks good.</strong>'); vd && (vd.textContent='Expression is valid.'); desc && (desc.textContent=(window.cronstrue?.toString?.(expr) || '')); }
  });

  // Apply buttons
  const btnAdvancedApply=document.getElementById('btnAdvancedApply');
  if (btnAdvancedApply) btnAdvancedApply.addEventListener('click', ()=>{
    const expr=document.getElementById('advanced-cron')?.value?.trim() || '';
    if(!expr){ showInfo('Advanced expression input is empty.','warn'); const vb=document.getElementById('validBox'); if(vb){ vb.className='status'; } return; }
    const parts=expr.split(/\s+/);
    if(parts.length<5 || parts.length>6){ showInfo('Invalid cron expression. Must have 5 or 6 fields.','err'); return; }
    if (minuteSel) minuteSel.value=parts[0]; if (hourSel) hourSel.value=parts[1]; if (domSel) domSel.value=parts[2]; if (monthSel) monthSel.value=parts[3]; if (dowSel) dowSel.value=parts[4];
    const out=document.getElementById('cronOut'); if(out) out.textContent=expr;
    const ex=document.getElementById('explainText'); if(ex) ex.textContent='Updated from advanced expression.';
    const error=validateCronExpression(expr); const vb=document.getElementById('validBox'); const vt=document.getElementById('validTitle'); const vd=document.getElementById('validDetail');
    if(error){ vb && (vb.className='status err'); vt && (vt.innerHTML='<strong>Error:</strong>'); vd && (vd.textContent=error); }
    else { vb && (vb.className='status ok'); vt && (vt.innerHTML='<strong>Looks good.</strong>'); vd && (vd.textContent='Expression structure is valid.'); }
  });

  const btnSpecialApply=document.getElementById('btnSpecialApply');
  if (btnSpecialApply) btnSpecialApply.addEventListener('click', ()=>{
    const expr=document.getElementById('special-cron')?.value?.trim() || '';
    if(!expr){ showInfo('Special expression input is empty.','warn'); const vb=document.getElementById('validBox'); if(vb){ vb.className='status'; } return; }
    if(!/[WL\?#]/.test(expr)){ showInfo('Special expression must contain W, L, ?, or #.','err'); return; }
    if (domSel) domSel.value = expr.includes('L') ? '31' : '1';
    if (dowSel) dowSel.value = expr.includes('W') ? '1' : '0';
    const out=document.getElementById('cronOut'); if(out) out.textContent=expr;
    const ex=document.getElementById('explainText'); if(ex) ex.textContent='Updated from special expression.';
    const error=validateCronExpression(expr); const vb=document.getElementById('validBox'); const vt=document.getElementById('validTitle'); const vd=document.getElementById('validDetail');
    if(error){ vb && (vb.className='status err'); vt && (vt.innerHTML='<strong>Error:</strong>'); vd && (vd.textContent=error); }
    else { vb && (vb.className='status ok'); vt && (vt.innerHTML='<strong>Looks good.</strong>'); vd && (vd.textContent='Expression structure is valid.'); }
  });

  // Parse button
  const btnParse=document.getElementById('btnParse');
  if (btnParse) btnParse.addEventListener('click', ()=>{
    const expr=document.getElementById('parse-cron')?.value?.trim() || '';
    // Use parse section fields
    const vb=document.getElementById('parseValidBox');
    const vt=document.getElementById('parseValidTitle');
    const vd=document.getElementById('parseValidDetail');
    const ex=document.getElementById('parseExplainText');
    if(!expr){
      if(vb) vb.className='status';
      if(vt) vt.innerHTML='<strong>—</strong>';
      if(vd) vd.textContent='Enter a cron expression.';
      if(ex) ex.textContent='—';
      showInfo('Input is empty. Please enter a cron expression.','warn');
      return;
    }
    const error=validateCronExpression(expr);
    if(error){
      if(vb) vb.className='status err';
      if(vt) vt.innerHTML='<strong>Error:</strong>';
      if(vd) vd.textContent=error;
      if(ex) ex.textContent='';
      return;
    }
    // Valid
    if(vb) vb.className='status ok';
    if(vt) vt.innerHTML='<strong>Looks good.</strong>';
    if(vd) vd.textContent='Expression is valid.';
    if(ex) ex.textContent = (window.cronstrue?.toString?.(expr) || 'Could not generate description.');
    // Optionally show next run info in infoBox
    const Parser = getCronParser();
    if (Parser) {
      try { const interval=Parser.parseExpression(expr); const next=interval.next().toString(); showInfo('Next run: '+next,'info'); } catch {/* ignore */}
    }
    if (/^\* \* \* \* \*$/.test(expr)) showInfo('Warning: This cron runs every minute. This can be risky!','warn');
  });
}

function loadCronParserTool(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="tool-header">
      <h2>Cron Parser + Builder</h2>
      <p class="small">Build or parse UNIX cron expressions (5 or 6 fields, with optional seconds). Includes presets, validation, and human-readable explanations.</p>
    </div>
    <div class="grid-cron">
      <div class="card cron-left" id="cronBuilderPanel"></div>
      <div class="card cron-right" id="cronOutputPanel"></div>
    </div>
  `;
  setTimeout(setupCronParserTool, 0);
}

// Public entry
export async function load(container) {
  // Inject CSS via <link> if not already present
  if (!document.getElementById('cronparser-css-link')) {
    const link = document.createElement('link');
    link.id = 'cronparser-css-link';
    link.rel = 'stylesheet';
    link.href = 'cronParser.css';
    document.head.appendChild(link);
  }
  await ensureCronLibsLoaded();
  loadCronParserTool(container);
  // No double-setup: setupCronParserTool is already called by loadCronParserTool
}
