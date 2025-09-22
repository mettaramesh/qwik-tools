// Qwik-style Cron Tool
import cssLoader from './cssLoader.js';
import { safeSetup, createSafeSelector } from './domUtils.js';

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
          5-field: <span class="kbd">0 0/5 1,15 * 1-5</span> (min hr dom mon dow)<br/>
          6-field: <span class="kbd">0 0 17 ? * 6#2</span> (sec min hr dom mon dow)
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
  // Create safe selectors for all elements
  const $sel = createSafeSelector('Cron Parser');
  
  // Utilities to fill selects
  function fillSelect(id, start, end, withStarLabel) {
    const sel = $sel(id); if (!sel) return;
    sel.innerHTML = '';
    if (withStarLabel) {
      const o = document.createElement('option'); o.value='*'; o.textContent=withStarLabel; sel.appendChild(o);
    }
    for (let i=start;i<=end;i++){ const o=document.createElement('option'); o.value=String(i); o.textContent=String(i); sel.appendChild(o); }
  }
  function fillMonths(id){
    const sel=$sel(id); if(!sel) return;
    sel.innerHTML=''; const star=document.createElement('option'); star.value='*'; star.textContent='Every month *'; sel.appendChild(star);
    const months=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    for(let i=1;i<=12;i++){ const o=document.createElement('option'); o.value=String(i); o.textContent=`${i} (${months[i-1]})`; sel.appendChild(o); }
  }
  function fillDOW(id, includeQuestion){
    const sel=$sel(id); if(!sel) return;
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

  const tabs = $sel('tabs');
  if (tabs) {
    tabs.addEventListener('click', (e)=>{
      const btn = e.target.closest?.('.tab'); if(!btn) return;
      [...tabs.children].forEach(t=>t.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.dataset.tab;
      for (const el of ['simple','advanced','special','parse']){
        const node = $sel('tab-'+el);
        if (node) node.classList.toggle('hidden', el!==id);
      }
    });
  }

  // Enhanced Presets with Visual Feedback
  const presets = $sel('cronPresets');
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
        
        const m=$sel('simple-minute'); 
        const h=$sel('simple-hour');  
        const d=$sel('simple-dom');   
        const mo=$sel('simple-month');
        const w=$sel('simple-dow');   
        
        if(m) m.value = min || '*';
        if(h) h.value = hr || '*';
        if(d) d.value = dom || '*';
        if(mo) mo.value = mon || '*';
        if(w) w.value = dow || '*';
        
        // Update output with animation
        const out=$sel('cronOut'); 
        if(out) {
          out.textContent = expr;
          showSuccessAnimation(out);
        }
        
        // Update explanation
        const ex=$sel('explainText'); 
        if(ex) {
          ex.textContent = description || `Runs ${label.toLowerCase()}.`;
          showSuccessAnimation(ex);
        }
        
        // Update validation status
        const vb=$sel('validBox'); 
        const vt=$sel('validTitle'); 
        const vd=$sel('validDetail');
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
  const minuteSel=$sel('simple-minute');
  const hourSel=$sel('simple-hour');
  const domSel=$sel('simple-dom');
  const monthSel=$sel('simple-month');
  const dowSel=$sel('simple-dow');

  function explainCron(expr){
    const parts = expr.trim().split(/\s+/);
    if (parts.length < 5) return 'Invalid cron expression.';
    
    let sec, min, hr, dom, mon, dow;
    
    // Handle both 5-field and 6-field cron expressions
    if (parts.length === 6) {
      // 6-field: sec min hr dom mon dow
      [sec, min, hr, dom, mon, dow] = parts;
    } else {
      // 5-field: min hr dom mon dow
      sec = null;
      [min, hr, dom, mon, dow] = parts;
    }
    
    // Enhanced explanation for complex patterns
    const explanations = [];
    
    // Seconds (only for 6-field)
    if (sec !== null) {
      if (sec === '*') explanations.push('every second');
      else if (sec.includes('/')) explanations.push(`every ${sec.split('/')[1]} seconds`);
      else if (sec.includes(',')) explanations.push(`at seconds ${sec}`);
      else if (sec.includes('-')) explanations.push(`from second ${sec.split('-')[0]} to ${sec.split('-')[1]}`);
      else explanations.push(`at second ${sec}`);
    }
    
    // Minutes
    if (min === '*') explanations.push('every minute');
    else if (min.includes('/')) explanations.push(`every ${min.split('/')[1]} minutes`);
    else if (min.includes(',')) explanations.push(`at minutes ${min}`);
    else if (min.includes('-')) explanations.push(`from minute ${min.split('-')[0]} to ${min.split('-')[1]}`);
    else explanations.push(`at minute ${min}`);
    
    // Hours
    if (hr === '*') explanations.push('every hour');
    else if (hr.includes('/')) explanations.push(`every ${hr.split('/')[1]} hours`);
    else if (hr.includes(',')) explanations.push(`at hours ${hr}`);
    else if (hr.includes('-')) explanations.push(`from hour ${hr.split('-')[0]} to ${hr.split('-')[1]}`);
    else {
      const hour24 = parseInt(hr);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const ampm = hour24 < 12 ? 'AM' : 'PM';
      explanations.push(`at ${hour12}:00 ${ampm} (${hr}:00)`);
    }
    
    // Day of month
    if (dom === '*') explanations.push('every day of the month');
    else if (dom === '?') explanations.push('no specific day of month');
    else if (dom.includes('W')) explanations.push(`nearest weekday to the ${dom.replace('W', '')}th`);
    else if (dom.includes('L')) explanations.push('last day of the month');
    else if (dom.includes(',')) explanations.push(`on days ${dom} of the month`);
    else if (dom.includes('-')) explanations.push(`from day ${dom.split('-')[0]} to ${dom.split('-')[1]} of the month`);
    else explanations.push(`on the ${dom}${getOrdinalSuffix(parseInt(dom))} day of the month`);
    
    // Month
    if (mon === '*') explanations.push('every month');
    else if (mon === '?') explanations.push('no specific month');
    else if (mon.includes('/')) explanations.push(`every ${mon.split('/')[1]} months`);
    else if (mon.includes(',')) {
      const months = mon.split(',').map(m => getMonthName(parseInt(m))).join(', ');
      explanations.push(`in ${months}`);
    } else if (mon.includes('-')) {
      const [start, end] = mon.split('-');
      explanations.push(`from ${getMonthName(parseInt(start))} to ${getMonthName(parseInt(end))}`);
    } else explanations.push(`in ${getMonthName(parseInt(mon))}`);
    
    // Day of week (most complex)
    if (dow === '*') explanations.push('every day of the week');
    else if (dow === '?') explanations.push('no specific day of week');
    else if (dow.includes('#')) {
      const [dayNum, weekNum] = dow.split('#');
      const dayName = getDayName(parseInt(dayNum));
      const ordinal = getOrdinalSuffix(parseInt(weekNum));
      explanations.push(`on the ${ordinal} ${dayName} of the month`);
    } else if (dow.includes('L')) {
      const dayNum = dow.replace('L', '');
      const dayName = getDayName(parseInt(dayNum));
      explanations.push(`on the last ${dayName} of the month`);
    } else if (dow.includes(',')) {
      const days = dow.split(',').map(d => getDayName(parseInt(d))).join(', ');
      explanations.push(`on ${days}`);
    } else if (dow.includes('-')) {
      const [start, end] = dow.split('-');
      explanations.push(`from ${getDayName(parseInt(start))} to ${getDayName(parseInt(end))}`);
    } else explanations.push(`on ${getDayName(parseInt(dow))}`);
    
    return `Runs ${explanations.join(', ')}.`;
  }
  
  function getOrdinalSuffix(num) {
    const teens = [11, 12, 13];
    const lastDigit = num % 10;
    if (teens.includes(num % 100)) return num + 'th';
    if (lastDigit === 1) return num + 'st';
    if (lastDigit === 2) return num + 'nd';
    if (lastDigit === 3) return num + 'rd';
    return num + 'th';
  }
  
  function getMonthName(monthNum) {
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNum] || monthNum;
  }
  
  function getDayName(dayNum) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum] || dayNum;
  }
  function updateSimpleCron(){
    const min=minuteSel?.value ?? '*', hr=hourSel?.value ?? '*', dom=domSel?.value ?? '*', mon=monthSel?.value ?? '*', dow=dowSel?.value ?? '*';
    const cron = `${min} ${hr} ${dom} ${mon} ${dow}`;
    const out=$sel('cronOut'); if(out) out.textContent=cron;
    const ex=$sel('explainText'); if(ex) ex.innerHTML = explainCron(cron);
    const vb=$sel('validBox'); if(vb) vb.className='status ok';
    const vt=$sel('validTitle'); if(vt) vt.innerHTML='<strong>Looks good.</strong>';
    const vd=$sel('validDetail'); if(vd) vd.textContent='Expression structure is valid.';
  }
  [minuteSel, hourSel, domSel, monthSel, dowSel].forEach(sel => sel && sel.addEventListener('change', updateSimpleCron));

  // Info helper
  const infoBox=$sel('cronInfoBox'); let infoBoxTimeout=null;
  function showInfo(msg,type='info'){
    if(!infoBox) return;
    infoBox.textContent=msg;
    infoBox.className='status '+(type==='warn'?'warn':type==='err'?'err':'ok');
    infoBox.style.display='flex';
    if(infoBoxTimeout) clearTimeout(infoBoxTimeout);
    infoBoxTimeout=setTimeout(()=>{ infoBox.style.display='none'; }, 120000);
  }

  // Enhanced Copy Button with Visual Feedback
  const btnCopy=$sel('btnCopy');
  if (btnCopy) btnCopy.addEventListener('click', async ()=>{
    const cronOut = $sel('cronOut');
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
  const btnExplain=$sel('btnExplain');
  if (btnExplain) btnExplain.addEventListener('click', async ()=>{
    const cronOut = $sel('cronOut');
    const explainText = $sel('explainText');
    const cronInfoBox = $sel('cronInfoBox');
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
      let breakdown = '';
      
      // Generate detailed breakdown
      const parts = cronOutText.split(/\s+/);
      if (parts.length >= 5) {
        let sec, min, hr, dom, mon, dow;
        
        // Handle both 5-field and 6-field cron expressions
        if (parts.length === 6) {
          [sec, min, hr, dom, mon, dow] = parts;
        } else {
          sec = null;
          [min, hr, dom, mon, dow] = parts;
        }
        
        breakdown = `
<div style="font-family: monospace; background: var(--cron-bg-secondary, #f8f9fa); padding: 12px; border-radius: 6px; margin: 8px 0;">
<strong>Breakdown:</strong><br/>`;

        if (sec !== null) {
          breakdown += `• <strong>${sec}:</strong> Seconds ${sec === '*' ? '(every second)' : sec === '0' ? '(at the 0th second)' : sec.includes('#') || sec.includes('L') || sec.includes('W') ? '(special)' : `(at second ${sec})`}<br/>`;
        }
        
        breakdown += `• <strong>${min}:</strong> Minutes ${min === '*' ? '(every minute)' : min === '0' ? '(at the 0th minute)' : min.includes('#') || min.includes('L') || min.includes('W') ? '(special)' : `(at minute ${min})`}<br/>`;
        
        breakdown += `• <strong>${hr}:</strong> Hours ${hr === '*' ? '(every hour 0-23)' : hr.includes('#') || hr.includes('L') || hr.includes('W') ? '(special)' : `(at ${parseInt(hr) === 0 ? '12 AM' : parseInt(hr) <= 12 ? parseInt(hr) + ' AM' : (parseInt(hr) - 12) + ' PM'})`}<br/>`;
        
        breakdown += `• <strong>${dom}:</strong> Day of month ${dom === '*' ? '(every day 1-31)' : dom === '?' ? '(no specific day of the month, as day of week is used)' : dom.includes('W') ? '(nearest weekday)' : dom.includes('L') ? '(last day of month)' : `(${dom}${getOrdinalSuffix(parseInt(dom))} day)`}<br/>`;
        
        breakdown += `• <strong>${mon}:</strong> Month ${mon === '*' ? '(every month)' : mon === '?' ? '(no specific month)' : `(${getMonthName(parseInt(mon)) || mon})`}<br/>`;
        
        breakdown += `• <strong>${dow}:</strong> Day of week ${dow === '*' ? '(every day 0-6)' : dow === '?' ? '(no specific day of week)' : dow.includes('#') ? `(the ${getOrdinalSuffix(parseInt(dow.split('#')[1]))} ${getDayName(parseInt(dow.split('#')[0]))}, where ${dow.split('#')[0]} represents ${getDayName(parseInt(dow.split('#')[0]))})` : dow.includes('L') ? '(last weekday)' : `(${getDayName(parseInt(dow)) || dow})`}`;
        
        breakdown += `
</div>`;
      }
      
      // Try to use cronstrue first, fallback to enhanced explainCron
      if (window.cronstrue?.toString) {
        try {
          explanation = window.cronstrue.toString(cronOutText, { 
            use24HourTimeFormat: false,
            verbose: true 
          });
          createToast('Expression explained successfully!', 'success');
        } catch (cronstrueErr) {
          console.warn('cronstrue failed, using enhanced fallback:', cronstrueErr);
          explanation = explainCron(cronOutText);
          createToast('Generated enhanced explanation', 'success');
        }
      } else {
        explanation = explainCron(cronOutText);
        createToast('Generated enhanced explanation', 'success');
      }
      
      explainText.innerHTML = explanation + breakdown;
      
      // Show additional info for special patterns
      if (cronOutText.includes('#')) {
        showInfo('This uses the # special character for "nth weekday of month" (e.g., 6#2 = second Friday)', 'info');
      } else if (cronOutText.includes('L')) {
        showInfo('This uses the L special character for "last" (e.g., L = last day of month, 5L = last Friday)', 'info');
      } else if (cronOutText.includes('W')) {
        showInfo('This uses the W special character for "nearest weekday" (e.g., 15W = nearest weekday to 15th)', 'info');
      }
      
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
  const advancedCronInput=$sel('advanced-cron');
  if (advancedCronInput) advancedCronInput.addEventListener('input', ()=>{
    const expr=advancedCronInput.value.trim();
    const statusBox=$sel('validBox'); if(!statusBox) return;
    const vt=$sel('validTitle'); const vd=$sel('validDetail'); const desc=$sel('explainText');

    if (!expr){ statusBox.className='status'; vt && (vt.innerHTML='<strong>—</strong>'); vd && (vd.textContent='Enter a cron expression.'); return; }

    const error = validateCronExpression(expr);
    if (error){ 
      statusBox.className='status err'; 
      vt && (vt.innerHTML='<strong>Error:</strong>'); 
      vd && (vd.textContent=error); 
      desc && (desc.innerHTML=''); 
    } else { 
      statusBox.className='status ok'; 
      vt && (vt.innerHTML='<strong>Looks good.</strong>'); 
      vd && (vd.textContent='Expression is valid.'); 
      
      // Use enhanced explanation
      let explanation = '';
      if (window.cronstrue?.toString) {
        try {
          explanation = window.cronstrue.toString(expr, { use24HourTimeFormat: false, verbose: true });
        } catch {
          explanation = explainCron(expr);
        }
      } else {
        explanation = explainCron(expr);
      }
      desc && (desc.innerHTML = explanation);
    }
  });

  // Apply buttons
  const btnAdvancedApply=$sel('btnAdvancedApply');
  if (btnAdvancedApply) btnAdvancedApply.addEventListener('click', ()=>{
    const expr=$sel('advanced-cron')?.value?.trim() || '';
    if(!expr){ showInfo('Advanced expression input is empty.','warn'); const vb=$sel('validBox'); if(vb){ vb.className='status'; } return; }
    const parts=expr.split(/\s+/);
    if(parts.length<5 || parts.length>6){ showInfo('Invalid cron expression. Must have 5 or 6 fields.','err'); return; }
    
    // Don't try to set simple fields for complex expressions with special characters or 6-field expressions
    if (!/[#LW\?]/.test(expr) && parts.length === 5) {
      if (minuteSel) minuteSel.value=parts[0]; 
      if (hourSel) hourSel.value=parts[1]; 
      if (domSel) domSel.value=parts[2]; 
      if (monthSel) monthSel.value=parts[3]; 
      if (dowSel) dowSel.value=parts[4];
    } else if (parts.length === 6) {
      showInfo('6-field cron expression detected (includes seconds). Simple tab will not be updated.', 'info');
    }
    
    const out=$sel('cronOut'); if(out) out.textContent=expr;
    
    // Use enhanced explanation
    const ex=$sel('explainText'); 
    if(ex) {
      let explanation = '';
      if (window.cronstrue?.toString) {
        try {
          explanation = window.cronstrue.toString(expr, { use24HourTimeFormat: false, verbose: true });
        } catch {
          explanation = explainCron(expr);
        }
      } else {
        explanation = explainCron(expr);
      }
      ex.innerHTML = explanation;
    }
    
    const error=validateCronExpression(expr); 
    const vb=$sel('validBox'); 
    const vt=$sel('validTitle'); 
    const vd=$sel('validDetail');
    if(error){ 
      vb && (vb.className='status err'); 
      vt && (vt.innerHTML='<strong>Error:</strong>'); 
      vd && (vd.textContent=error); 
    } else { 
      vb && (vb.className='status ok'); 
      vt && (vt.innerHTML='<strong>Looks good.</strong>'); 
      vd && (vd.textContent='Expression structure is valid.'); 
      
      // Show additional info for special patterns
      if (expr.includes('#')) {
        showInfo('Applied expression with # special character for "nth weekday of month"', 'info');
      } else if (expr.includes('L')) {
        showInfo('Applied expression with L special character for "last"', 'info');
      } else if (expr.includes('W')) {
        showInfo('Applied expression with W special character for "nearest weekday"', 'info');
      } else {
        showInfo('Advanced expression applied successfully', 'info');
      }
    }
  });

  const btnSpecialApply=$sel('btnSpecialApply');
  if (btnSpecialApply) btnSpecialApply.addEventListener('click', ()=>{
    const expr=$sel('special-cron')?.value?.trim() || '';
    if(!expr){ showInfo('Special expression input is empty.','warn'); const vb=$sel('validBox'); if(vb){ vb.className='status'; } return; }
    if(!/[WL\?#]/.test(expr)){ showInfo('Special expression must contain W, L, ?, or #.','err'); return; }
    
    // Don't set simple fields for special expressions
    const out=$sel('cronOut'); if(out) out.textContent=expr;
    
    // Use enhanced explanation
    const ex=$sel('explainText'); 
    if(ex) {
      let explanation = '';
      if (window.cronstrue?.toString) {
        try {
          explanation = window.cronstrue.toString(expr, { use24HourTimeFormat: false, verbose: true });
        } catch {
          explanation = explainCron(expr);
        }
      } else {
        explanation = explainCron(expr);
      }
      ex.innerHTML = explanation;
    }
    
    const error=validateCronExpression(expr); 
    const vb=$sel('validBox'); 
    const vt=$sel('validTitle'); 
    const vd=$sel('validDetail');
    if(error){ 
      vb && (vb.className='status err'); 
      vt && (vt.innerHTML='<strong>Error:</strong>'); 
      vd && (vd.textContent=error); 
    } else { 
      vb && (vb.className='status ok'); 
      vt && (vt.innerHTML='<strong>Looks good.</strong>'); 
      vd && (vd.textContent='Expression structure is valid.'); 
      showInfo('Special expression applied successfully', 'info');
    }
  });

  // Parse button
  const btnParse=$sel('btnParse');
  if (btnParse) btnParse.addEventListener('click', ()=>{
    const expr=$sel('parse-cron')?.value?.trim() || '';
    // Use parse section fields
    const vb=$sel('parseValidBox');
    const vt=$sel('parseValidTitle');
    const vd=$sel('parseValidDetail');
    const ex=$sel('parseExplainText');
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
    
    // Use enhanced explanation
    if(ex) {
      let explanation = '';
      if (window.cronstrue?.toString) {
        try {
          explanation = window.cronstrue.toString(expr, { use24HourTimeFormat: false, verbose: true });
        } catch {
          explanation = explainCron(expr);
        }
      } else {
        explanation = explainCron(expr);
      }
      ex.innerHTML = explanation;
    }
    
    // Optionally show next run info in infoBox
    const Parser = getCronParser();
    if (Parser) {
      try { 
        const interval=Parser.parseExpression(expr); 
        const next=interval.next().toString(); 
        showInfo('Next run: '+next,'info'); 
      } catch {/* ignore */}
    }
    if (/^\* \* \* \* \*$/.test(expr)) showInfo('Warning: This cron runs every minute. This can be risky!','warn');
    
    // Show pattern info
    if (expr.includes('#')) {
      showInfo('This expression uses # for "nth weekday of month" (e.g., 6#2 = second Friday)', 'info');
    } else if (expr.includes('L')) {
      showInfo('This expression uses L for "last" (e.g., L = last day, 5L = last Friday)', 'info');
    } else if (expr.includes('W')) {
      showInfo('This expression uses W for "nearest weekday" (e.g., 15W = nearest weekday to 15th)', 'info');
    }
  });
}

async function loadCronParserTool(container) {
  if (!container) return;
  const html = await fetch('cronParser.html').then(r => r.text());
  container.innerHTML = html;
  
  // Critical elements that must be available before setup
  const criticalElements = [
    'cronBuilderPanel',
    'cronOutputPanel'
  ];
  
  await safeSetup(() => setupCronParserTool(), criticalElements);
}

// Public entry
export async function load(container) {
  try {
    // Load CSS using centralized loader
    await cssLoader.loadCSS('cronParser.css', 'cronparser');
    await ensureCronLibsLoaded();
    await loadCronParserTool(container);
  } catch (error) {
    console.error('Cron Parser load error:', error);
    if (container) {
      container.innerHTML = '<div class="error">Failed to load Cron Parser Tool</div>';
    }
  }
}
