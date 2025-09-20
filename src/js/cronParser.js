// Qwik-style Cron Tool
// Load external stylesheet for cron parser
function ensureQwikCronStyle(){
  if (!document.getElementById('qwik-cron-style-link')) {
    const link = document.createElement('link');
    link.id = 'qwik-cron-style-link';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = './cronParser.css';
    document.head.appendChild(link);
  }
}
ensureQwikCronStyle();

// Enhanced User Feedback System
function showSuccessAnimation(element) {
  if (element) {
    element.classList.add('success-animation');
    setTimeout(() => element.classList.remove('success-animation'), 600);
  }
}

function showLoadingState(element, isLoading = true) {
  if (element) {
    element.classList.toggle('loading', isLoading);
  }
}

function createToast(message, type = 'success') {
  const existingToast = document.querySelector('.cron-toast');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = `cron-toast cron-toast--${type}`;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    background: ${type === 'success' ? 'var(--cron-success)' : type === 'error' ? 'var(--cron-error)' : 'var(--cron-warning)'};
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: var(--cron-shadow-lg);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.style.transform = 'translateX(0)', 50);
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

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
  await loadScript('./cron-js-parser.min.js');
      // normalize various globals into window["cron-js-parser"]
      if (!window["cron-js-parser"]) {
        const maybe = window.CronParser || window.cronParser || window.CRON_PARSER;
        if (maybe) window["cron-js-parser"] = { CronParser: maybe };
      }
      await loadScript('cronstrue.min.js');
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
  <input id="advanced-cron" type="text" class="code cron-wide-input" placeholder="e.g. 0 0/5 1,15 * 1-5" />
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
  <input id="special-cron" type="text" class="code cron-wide-input" placeholder="e.g. 0 0 1W * ?" />
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
  <input id="parse-cron" type="text" class="code cron-wide-input" placeholder="e.g. 0 12 * * MON-FRI" />
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
  <div class="field"><label>Info</label><div class="status cron-info-box" id="cronInfoBox"></div></div>
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

  // Enhanced Presets with Visual Feedback
  const presets = document.getElementById('cronPresets');
  if (presets) {
    presets.innerHTML='';
    const addPreset=(label,expr,description)=>{
      const chip=document.createElement('div');
      chip.className='chip'; 
      chip.textContent=label; 
      chip.title=`${expr}\n${description || `Sets cron to: ${label.toLowerCase()}`}`;
      
      chip.addEventListener('click', async ()=>{
        // Visual feedback for selection
        showLoadingState(chip, true);
        
        // Remove active state from other chips
        presets.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        // Parse expression to set individual fields
        const parts = expr.split(/\s+/);
        const [min, hr, dom, mon, dow] = parts;
        
        const m=document.getElementById('simple-minute'); 
        const h=document.getElementById('simple-hour');  
        const d=document.getElementById('simple-dom');   
        const mo=document.getElementById('simple-month');
        const w=document.getElementById('simple-dow');   
        
        if(m) m.value = min || '*';
        if(h) h.value = hr || '*';
        if(d) d.value = dom || '*';
        if(mo) mo.value = mon || '*';
        if(w) w.value = dow || '*';
        
        // Update output with animation
        const out=document.getElementById('cronOut'); 
        if(out) {
          out.textContent = expr;
          showSuccessAnimation(out);
        }
        
        // Update explanation
        const ex=document.getElementById('explainText'); 
        if(ex) {
          ex.textContent = description || `Runs ${label.toLowerCase()}.`;
          showSuccessAnimation(ex);
        }
        
        // Update validation status
        const vb=document.getElementById('validBox'); 
        const vt=document.getElementById('validTitle'); 
        const vd=document.getElementById('validDetail');
        if(vb) vb.className='status ok';
        if(vt) vt.innerHTML='<strong>✓ Preset applied</strong>';
        if(vd) vd.textContent='Using predefined schedule pattern.';
        
        // Show success toast
        createToast(`Applied preset: ${label}`, 'success');
        
        // Remove loading and active states
        setTimeout(() => {
          showLoadingState(chip, false);
          chip.classList.remove('active');
        }, 1000);
      });
      presets.appendChild(chip);
    };
    
    addPreset('Every 5 Minutes','*/5 * * * *', 'Runs every 5 minutes');
    addPreset('Every 15 Minutes','*/15 * * * *', 'Runs every 15 minutes');
    addPreset('Every 30 Minutes','*/30 * * * *', 'Runs every 30 minutes');
    addPreset('Hourly','0 * * * *', 'Runs at the top of every hour');
    addPreset('Daily at Midnight','0 0 * * *', 'Runs once a day at midnight');
    addPreset('Daily at 9 AM','0 9 * * *', 'Runs every day at 9:00 AM');
    addPreset('Weekdays at 9 AM','0 9 * * 1-5', 'Runs Monday through Friday at 9:00 AM');
    addPreset('Weekly (Sunday)','0 0 * * 0', 'Runs every Sunday at midnight');
    addPreset('Monthly (1st)','0 0 1 * *', 'Runs on the 1st day of every month at midnight');
    addPreset('Quarterly','0 0 1 */3 *', 'Runs every 3 months on the 1st day at midnight');
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
    infoBox.className='status '+(type==='warn'?'warn':type==='err'?'err':'ok');
    infoBox.style.display='flex';
    if(infoBoxTimeout) clearTimeout(infoBoxTimeout);
    infoBoxTimeout=setTimeout(()=>{ infoBox.style.display='none'; }, 120000);
  }

  // Enhanced Copy Button with Visual Feedback
  const btnCopy=document.getElementById('btnCopy');
  if (btnCopy) btnCopy.addEventListener('click', async ()=>{
    const cronOut = document.getElementById('cronOut');
    const txt = cronOut?.textContent?.trim() ?? '';
    
    if (!txt || txt === '* * * * *') {
      createToast('Please generate a cron expression first!', 'warning');
      return;
    }
    
    try {
      showLoadingState(btnCopy, true);
      await navigator.clipboard.writeText(txt);
      
      // Visual success feedback
      showSuccessAnimation(cronOut);
      createToast('Cron expression copied to clipboard!', 'success');
      
      // Temporarily change button appearance
      const originalText = btnCopy.textContent;
      btnCopy.textContent = '✓ Copied!';
      btnCopy.style.background = 'var(--cron-success)';
      btnCopy.style.borderColor = 'var(--cron-success)';
      
      setTimeout(() => {
        btnCopy.textContent = originalText;
        btnCopy.style.background = '';
        btnCopy.style.borderColor = '';
      }, 2000);
    } catch (err) {
      createToast('Failed to copy to clipboard', 'error');
      console.error('Copy failed:', err);
    } finally {
      showLoadingState(btnCopy, false);
    }
  });

  // Enhanced Explain Button with Better UX
  const btnExplain=document.getElementById('btnExplain');
  if (btnExplain) btnExplain.addEventListener('click', async ()=>{
    const cronOut = document.getElementById('cronOut');
    const explainText = document.getElementById('explainText');
    const cronOutText = cronOut?.textContent?.trim();
    
    if (!cronOutText || cronOutText === '* * * * *') {
      createToast('Please generate a cron expression first!', 'warning');
      return;
    }
    
    if (!explainText) return;
    
    try {
      showLoadingState(btnExplain, true);
      showLoadingState(explainText, true);
      
      // Show immediate feedback
      explainText.textContent = 'Generating explanation...';
      
      // Simulate processing for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await ensureCronLibsLoaded();
      
      let explanation;
      if (window.cronstrue?.toString) {
        try {
          explanation = window.cronstrue.toString(cronOutText, { 
            use24HourTimeFormat: true,
            verbose: true 
          });
          createToast('Expression explained successfully!', 'success');
        } catch (cronstrueErr) {
          console.warn('cronstrue failed, using fallback:', cronstrueErr);
          explanation = explainCron(cronOutText);
          createToast('Generated basic explanation', 'warning');
        }
      } else {
        explanation = explainCron(cronOutText);
        createToast('Generated basic explanation', 'warning');
      }
      
      explainText.textContent = explanation;
      showSuccessAnimation(explainText);
      
    } catch (err) {
      explainText.textContent = 'Failed to explain expression';
      createToast('Failed to explain expression', 'error');
      console.error('Explain failed:', err);
    } finally {
      showLoadingState(btnExplain, false);
      showLoadingState(explainText, false);
    }
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

async function loadCronParserTool(container) {
  if (!container) return;
  const html = await fetch('cronParser.html').then(r => r.text());
  container.innerHTML = html;
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
  await loadCronParserTool(container);
}
