import{c as K}from"./cssLoader-DTPWrGuQ.js";import{s as Z,c as ee}from"./domUtils-BxdcSh8e.js";function S(e){e&&(e.classList.add("success-animation"),setTimeout(()=>e.classList.remove("success-animation"),600))}function y(e,l=!0){e&&e.classList.toggle("loading",l)}function m(e,l="success"){const g=document.querySelector(".cron-toast");g&&g.remove();const d=document.createElement("div");d.className=`cron-toast cron-toast--${l}`,d.style.cssText=`
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    background: ${l==="success"?"var(--cron-success)":l==="error"?"var(--cron-error)":"var(--cron-warning)"};
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: var(--cron-shadow-lg);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `,d.textContent=e,document.body.appendChild(d),setTimeout(()=>d.style.transform="translateX(0)",50),setTimeout(()=>{d.style.transform="translateX(100%)",setTimeout(()=>d.remove(),300)},3e3)}function J(e){return new Promise((l,g)=>{if(document.querySelector(`script[src="${e}"]`))return l();const d=document.createElement("script");d.src=e,d.onload=()=>l(),d.onerror=()=>g(new Error(`Failed to load ${e}`)),document.head.appendChild(d)})}let D;async function _(){return D||(D=(async()=>{if(await J("./cron-js-parser.min.js"),!window["cron-js-parser"]){const e=window.CronParser||window.cronParser||window.CRON_PARSER;e&&(window["cron-js-parser"]={CronParser:e})}await J("cronstrue.min.js")})()),D}function X(){const e=window["cron-js-parser"];return e&&e.CronParser&&typeof e.CronParser.parseExpression=="function"?e.CronParser:window.CronParser&&typeof window.CronParser.parseExpression=="function"?window.CronParser:window.cronParser&&typeof window.cronParser.parseExpression=="function"?window.cronParser:null}function te(){const e=document.getElementById("cronBuilderPanel"),l=document.getElementById("cronOutputPanel");if(!e||!l){console.error("cronBuilderPanel or cronOutputPanel not found in DOM");return}e.innerHTML=ne(),l.innerHTML=se(),setTimeout(ie,0)}function ne(){return`
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
  `}function se(){return`
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
  `}function ie(){const e=t=>ee(t);function l(t,n,i,o){const s=e(t)();if(s){if(s.innerHTML="",o){const a=document.createElement("option");a.value="*",a.textContent=o,s.appendChild(a)}for(let a=n;a<=i;a++){const r=document.createElement("option");r.value=String(a),r.textContent=String(a),s.appendChild(r)}}}function g(t){const n=e(t)();if(!n)return;n.innerHTML="";const i=document.createElement("option");i.value="*",i.textContent="Every month *",n.appendChild(i);const o=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];for(let s=1;s<=12;s++){const a=document.createElement("option");a.value=String(s),a.textContent=`${s} (${o[s-1]})`,n.appendChild(a)}}function d(t,n){const i=e(t)();if(!i)return;i.innerHTML="";{const s=document.createElement("option");s.value="?",s.textContent="No specific day ?",i.appendChild(s)}const o=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];for(let s=0;s<=6;s++){const a=document.createElement("option");a.value=String(s),a.textContent=`${s} (${o[s]})`,i.appendChild(a)}}l("simple-minute",0,59,"Every minute *"),l("simple-hour",0,23,"Every hour *"),l("simple-dom",1,31,"Every day *"),g("simple-month"),d("simple-dow");const A=e("tabs")();A&&A.addEventListener("click",t=>{var o,s;const n=(s=(o=t.target).closest)==null?void 0:s.call(o,".tab");if(!n)return;[...A.children].forEach(a=>a.classList.remove("active")),n.classList.add("active");const i=n.dataset.tab;for(const a of["simple","advanced","special","parse"]){const r=e("tab-"+a)();r&&r.classList.toggle("hidden",a!==i)}});const L=e("cronPresets")();if(L){L.innerHTML="";const t=(n,i,o)=>{const s=document.createElement("div");s.className="chip",s.textContent=n,s.title=`${i}
${o||`Sets cron to: ${n.toLowerCase()}`}`,s.addEventListener("click",async()=>{y(s,!0),L.querySelectorAll(".chip").forEach(Y=>Y.classList.remove("active")),s.classList.add("active");const a=i.split(/\s+/),[r,c,p,u,f]=a,$=e("simple-minute")(),M=e("simple-hour")(),V=e("simple-dom")(),U=e("simple-month")(),j=e("simple-dow")();$&&($.value=r||"*"),M&&(M.value=c||"*"),V&&(V.value=p||"*"),U&&(U.value=u||"*"),j&&(j.value=f||"*");const R=e("cronOut")();R&&(R.textContent=i,S(R));const O=e("explainText")();O&&(O.textContent=o||`Runs ${n.toLowerCase()}.`,S(O));const G=e("validBox")(),q=e("validTitle")(),Q=e("validDetail")();G&&(G.className="status ok"),q&&(q.innerHTML="<strong>✓ Preset applied</strong>"),Q&&(Q.textContent="Using predefined schedule pattern."),m(`Applied preset: ${n}`,"success"),setTimeout(()=>{y(s,!1),s.classList.remove("active")},1e3)}),L.appendChild(s)};t("Every 5 Minutes","*/5 * * * *","Runs every 5 minutes"),t("Every 15 Minutes","*/15 * * * *","Runs every 15 minutes"),t("Every 30 Minutes","*/30 * * * *","Runs every 30 minutes"),t("Hourly","0 * * * *","Runs at the top of every hour"),t("Daily at Midnight","0 0 * * *","Runs once a day at midnight"),t("Daily at 9 AM","0 9 * * *","Runs every day at 9:00 AM"),t("Weekdays at 9 AM","0 9 * * 1-5","Runs Monday through Friday at 9:00 AM"),t("Weekly (Sunday)","0 0 * * 0","Runs every Sunday at midnight"),t("Monthly (1st)","0 0 1 * *","Runs on the 1st day of every month at midnight"),t("Quarterly","0 0 1 */3 *","Runs every 3 months on the 1st day at midnight")}const w=e("simple-minute")(),C=e("simple-hour")(),x=e("simple-dom")(),E=e("simple-month")(),b=e("simple-dow")();function H(t){const n=t.trim().split(/\s+/);if(n.length<5)return"Invalid cron expression.";let[i,o,s,a,r]=n;return`Minute ${i}, hour ${o}, day-of-month ${s}, month ${a}, day-of-week ${r}`}function z(){const t=(w==null?void 0:w.value)??"*",n=(C==null?void 0:C.value)??"*",i=(x==null?void 0:x.value)??"*",o=(E==null?void 0:E.value)??"*",s=(b==null?void 0:b.value)??"*",a=`${t} ${n} ${i} ${o} ${s}`,r=e("cronOut")();r&&(r.textContent=a);const c=e("explainText")();c&&(c.textContent=H(a));const p=e("validBox")();p&&(p.className="status ok");const u=e("validTitle")();u&&(u.innerHTML="<strong>Looks good.</strong>");const f=e("validDetail")();f&&(f.textContent="Expression structure is valid.")}[w,C,x,E,b].forEach(t=>t&&t.addEventListener("change",z));const T=e("cronInfoBox")();let B=null;function h(t,n="info"){T&&(T.textContent=t,T.className="status "+(n==="warn"?"warn":n==="err"?"err":"ok"),T.style.display="flex",B&&clearTimeout(B),B=setTimeout(()=>{T.style.display="none"},12e4))}const v=e("btnCopy")();v&&v.addEventListener("click",async()=>{var i;const t=e("cronOut")(),n=((i=t==null?void 0:t.textContent)==null?void 0:i.trim())??"";if(!n||n==="* * * * *"){m("Please generate a cron expression first!","warning");return}try{y(v,!0),await navigator.clipboard.writeText(n),S(t),m("Cron expression copied to clipboard!","success");const o=v.textContent;v.textContent="✓ Copied!",v.style.background="var(--cron-success)",v.style.borderColor="var(--cron-success)",setTimeout(()=>{v.textContent=o,v.style.background="",v.style.borderColor=""},2e3)}catch(o){m("Failed to copy to clipboard","error"),console.error("Copy failed:",o)}finally{y(v,!1)}});const k=e("btnExplain")();k&&k.addEventListener("click",async()=>{var o,s;const t=e("cronOut")(),n=e("explainText")(),i=(o=t==null?void 0:t.textContent)==null?void 0:o.trim();if(!i||i==="* * * * *"){m("Please generate a cron expression first!","warning");return}if(n)try{y(k,!0),y(n,!0),n.textContent="Generating explanation...",await new Promise(r=>setTimeout(r,300)),await _();let a;if((s=window.cronstrue)!=null&&s.toString)try{a=window.cronstrue.toString(i,{use24HourTimeFormat:!0,verbose:!0}),m("Expression explained successfully!","success")}catch(r){console.warn("cronstrue failed, using fallback:",r),a=H(i),m("Generated basic explanation","warning")}else a=H(i),m("Generated basic explanation","warning");n.textContent=a,S(n)}catch(a){n.textContent="Failed to explain expression",m("Failed to explain expression","error"),console.error("Explain failed:",a)}finally{y(k,!1),y(n,!1)}});function P(t){const n=X();if(!n)return null;try{return n.parseExpression(t,{iterator:!0}),null}catch(i){return(i==null?void 0:i.message)||"Invalid cron expression."}}const N=e("advanced-cron")();N&&N.addEventListener("input",()=>{var r,c;const t=N.value.trim(),n=e("validBox")();if(!n)return;const i=e("validTitle")(),o=e("validDetail")(),s=e("explainText")();if(!t){n.className="status",i&&(i.innerHTML="<strong>—</strong>"),o&&(o.textContent="Enter a cron expression.");return}const a=P(t);a?(n.className="status err",i&&(i.innerHTML="<strong>Error:</strong>"),o&&(o.textContent=a),s&&(s.textContent="")):(n.className="status ok",i&&(i.innerHTML="<strong>Looks good.</strong>"),o&&(o.textContent="Expression is valid."),s&&(s.textContent=((c=(r=window.cronstrue)==null?void 0:r.toString)==null?void 0:c.call(r,t))||""))});const I=e("btnAdvancedApply")();I&&I.addEventListener("click",()=>{var p,u;const t=((u=(p=e("advanced-cron")())==null?void 0:p.value)==null?void 0:u.trim())||"";if(!t){h("Advanced expression input is empty.","warn");const f=e("validBox")();f&&(f.className="status");return}const n=t.split(/\s+/);if(n.length<5||n.length>6){h("Invalid cron expression. Must have 5 or 6 fields.","err");return}w&&(w.value=n[0]),C&&(C.value=n[1]),x&&(x.value=n[2]),E&&(E.value=n[3]),b&&(b.value=n[4]);const i=e("cronOut")();i&&(i.textContent=t);const o=e("explainText")();o&&(o.textContent="Updated from advanced expression.");const s=P(t),a=e("validBox")(),r=e("validTitle")(),c=e("validDetail")();s?(a&&(a.className="status err"),r&&(r.innerHTML="<strong>Error:</strong>"),c&&(c.textContent=s)):(a&&(a.className="status ok"),r&&(r.innerHTML="<strong>Looks good.</strong>"),c&&(c.textContent="Expression structure is valid."))});const W=e("btnSpecialApply")();W&&W.addEventListener("click",()=>{var c,p;const t=((p=(c=e("special-cron")())==null?void 0:c.value)==null?void 0:p.trim())||"";if(!t){h("Special expression input is empty.","warn");const u=e("validBox")();u&&(u.className="status");return}if(!/[WL\?#]/.test(t)){h("Special expression must contain W, L, ?, or #.","err");return}x&&(x.value=t.includes("L")?"31":"1"),b&&(b.value=t.includes("W")?"1":"0");const n=e("cronOut")();n&&(n.textContent=t);const i=e("explainText")();i&&(i.textContent="Updated from special expression.");const o=P(t),s=e("validBox")(),a=e("validTitle")(),r=e("validDetail")();o?(s&&(s.className="status err"),a&&(a.innerHTML="<strong>Error:</strong>"),r&&(r.textContent=o)):(s&&(s.className="status ok"),a&&(a.innerHTML="<strong>Looks good.</strong>"),r&&(r.textContent="Expression structure is valid."))});const F=e("btnParse")();F&&F.addEventListener("click",()=>{var c,p,u,f;const t=((p=(c=e("parse-cron")())==null?void 0:c.value)==null?void 0:p.trim())||"",n=e("parseValidBox")(),i=e("parseValidTitle")(),o=e("parseValidDetail")(),s=e("parseExplainText")();if(!t){n&&(n.className="status"),i&&(i.innerHTML="<strong>—</strong>"),o&&(o.textContent="Enter a cron expression."),s&&(s.textContent="—"),h("Input is empty. Please enter a cron expression.","warn");return}const a=P(t);if(a){n&&(n.className="status err"),i&&(i.innerHTML="<strong>Error:</strong>"),o&&(o.textContent=a),s&&(s.textContent="");return}n&&(n.className="status ok"),i&&(i.innerHTML="<strong>Looks good.</strong>"),o&&(o.textContent="Expression is valid."),s&&(s.textContent=((f=(u=window.cronstrue)==null?void 0:u.toString)==null?void 0:f.call(u,t))||"Could not generate description.");const r=X();if(r)try{const M=r.parseExpression(t).next().toString();h("Next run: "+M,"info")}catch{}/^\* \* \* \* \*$/.test(t)&&h("Warning: This cron runs every minute. This can be risky!","warn")})}async function ae(e){if(!e)return;const l=await fetch("cronParser.html").then(d=>d.text());e.innerHTML=l,await Z(()=>te(),["cronBuilderPanel","cronOutputPanel"])}async function le(e){try{await K.loadCSS("cronParser.css","cronparser"),await _(),await ae(e)}catch(l){console.error("Cron Parser load error:",l),e&&(e.innerHTML='<div class="error">Failed to load Cron Parser Tool</div>')}}export{le as load};
