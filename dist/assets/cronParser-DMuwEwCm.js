import{c as Z}from"./cssLoader-DTPWrGuQ.js";import{s as ee,c as I}from"./domUtils-BxdcSh8e.js";function S(e){e&&(e.classList.add("success-animation"),setTimeout(()=>e.classList.remove("success-animation"),600))}function g(e,c=!0){e&&e.classList.toggle("loading",c)}function x(e,c="success"){const f=document.querySelector(".cron-toast");f&&f.remove();const l=document.createElement("div");l.className=`cron-toast cron-toast--${c}`,l.style.cssText=`
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    background: ${c==="success"?"var(--cron-success)":c==="error"?"var(--cron-error)":"var(--cron-warning)"};
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: var(--cron-shadow-lg);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `,l.textContent=e,document.body.appendChild(l),setTimeout(()=>l.style.transform="translateX(0)",50),setTimeout(()=>{l.style.transform="translateX(100%)",setTimeout(()=>l.remove(),300)},3e3)}function X(e){return new Promise((c,f)=>{if(document.querySelector(`script[src="${e}"]`))return c();const l=document.createElement("script");l.src=e,l.onload=()=>c(),l.onerror=()=>f(new Error(`Failed to load ${e}`)),document.head.appendChild(l)})}let D;async function z(){return D||(D=(async()=>{if(await X("./cron-js-parser.min.js"),!window["cron-js-parser"]){const e=window.CronParser||window.cronParser||window.CRON_PARSER;e&&(window["cron-js-parser"]={CronParser:e})}await X("cronstrue.min.js")})()),D}function _(){const e=window["cron-js-parser"];return e&&e.CronParser&&typeof e.CronParser.parseExpression=="function"?e.CronParser:window.CronParser&&typeof window.CronParser.parseExpression=="function"?window.CronParser:window.cronParser&&typeof window.cronParser.parseExpression=="function"?window.cronParser:null}function te(){const e=I("cronBuilderPanel"),c=I("cronOutputPanel"),f=e(),l=c();if(!f||!l){console.error("cronBuilderPanel or cronOutputPanel not found in DOM");return}f.innerHTML=ne(),l.innerHTML=se(),setTimeout(ie,0)}function ne(){return`
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
  `}function ie(){const e=t=>I(t);function c(t,n,i,o){const s=e(t)();if(s){if(s.innerHTML="",o){const a=document.createElement("option");a.value="*",a.textContent=o,s.appendChild(a)}for(let a=n;a<=i;a++){const r=document.createElement("option");r.value=String(a),r.textContent=String(a),s.appendChild(r)}}}function f(t){const n=e(t)();if(!n)return;n.innerHTML="";const i=document.createElement("option");i.value="*",i.textContent="Every month *",n.appendChild(i);const o=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];for(let s=1;s<=12;s++){const a=document.createElement("option");a.value=String(s),a.textContent=`${s} (${o[s-1]})`,n.appendChild(a)}}function l(t,n){const i=e(t)();if(!i)return;i.innerHTML="";{const s=document.createElement("option");s.value="?",s.textContent="No specific day ?",i.appendChild(s)}const o=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];for(let s=0;s<=6;s++){const a=document.createElement("option");a.value=String(s),a.textContent=`${s} (${o[s]})`,i.appendChild(a)}}c("simple-minute",0,59,"Every minute *"),c("simple-hour",0,23,"Every hour *"),c("simple-dom",1,31,"Every day *"),f("simple-month"),l("simple-dow");const A=e("tabs")();A&&A.addEventListener("click",t=>{var o,s;const n=(s=(o=t.target).closest)==null?void 0:s.call(o,".tab");if(!n)return;[...A.children].forEach(a=>a.classList.remove("active")),n.classList.add("active");const i=n.dataset.tab;for(const a of["simple","advanced","special","parse"]){const r=e("tab-"+a)();r&&r.classList.toggle("hidden",a!==i)}});const L=e("cronPresets")();if(L){L.innerHTML="";const t=(n,i,o)=>{const s=document.createElement("div");s.className="chip",s.textContent=n,s.title=`${i}
${o||`Sets cron to: ${n.toLowerCase()}`}`,s.addEventListener("click",async()=>{g(s,!0),L.querySelectorAll(".chip").forEach(K=>K.classList.remove("active")),s.classList.add("active");const a=i.split(/\s+/),[r,d,p,u,m]=a,B=e("simple-minute")(),M=e("simple-hour")(),U=e("simple-dom")(),j=e("simple-month")(),G=e("simple-dow")();B&&(B.value=r||"*"),M&&(M.value=d||"*"),U&&(U.value=p||"*"),j&&(j.value=u||"*"),G&&(G.value=m||"*");const R=e("cronOut")();R&&(R.textContent=i,S(R));const O=e("explainText")();O&&(O.textContent=o||`Runs ${n.toLowerCase()}.`,S(O));const q=e("validBox")(),Q=e("validTitle")(),J=e("validDetail")();q&&(q.className="status ok"),Q&&(Q.innerHTML="<strong>✓ Preset applied</strong>"),J&&(J.textContent="Using predefined schedule pattern."),x(`Applied preset: ${n}`,"success"),setTimeout(()=>{g(s,!1),s.classList.remove("active")},1e3)}),L.appendChild(s)};t("Every 5 Minutes","*/5 * * * *","Runs every 5 minutes"),t("Every 15 Minutes","*/15 * * * *","Runs every 15 minutes"),t("Every 30 Minutes","*/30 * * * *","Runs every 30 minutes"),t("Hourly","0 * * * *","Runs at the top of every hour"),t("Daily at Midnight","0 0 * * *","Runs once a day at midnight"),t("Daily at 9 AM","0 9 * * *","Runs every day at 9:00 AM"),t("Weekdays at 9 AM","0 9 * * 1-5","Runs Monday through Friday at 9:00 AM"),t("Weekly (Sunday)","0 0 * * 0","Runs every Sunday at midnight"),t("Monthly (1st)","0 0 1 * *","Runs on the 1st day of every month at midnight"),t("Quarterly","0 0 1 */3 *","Runs every 3 months on the 1st day at midnight")}const w=e("simple-minute")(),C=e("simple-hour")(),b=e("simple-dom")(),E=e("simple-month")(),y=e("simple-dow")();function $(t){const n=t.trim().split(/\s+/);if(n.length<5)return"Invalid cron expression.";let[i,o,s,a,r]=n;return`Minute ${i}, hour ${o}, day-of-month ${s}, month ${a}, day-of-week ${r}`}function Y(){const t=(w==null?void 0:w.value)??"*",n=(C==null?void 0:C.value)??"*",i=(b==null?void 0:b.value)??"*",o=(E==null?void 0:E.value)??"*",s=(y==null?void 0:y.value)??"*",a=`${t} ${n} ${i} ${o} ${s}`,r=e("cronOut")();r&&(r.textContent=a);const d=e("explainText")();d&&(d.textContent=$(a));const p=e("validBox")();p&&(p.className="status ok");const u=e("validTitle")();u&&(u.innerHTML="<strong>Looks good.</strong>");const m=e("validDetail")();m&&(m.textContent="Expression structure is valid.")}[w,C,b,E,y].forEach(t=>t&&t.addEventListener("change",Y));const T=e("cronInfoBox")();let H=null;function h(t,n="info"){T&&(T.textContent=t,T.className="status "+(n==="warn"?"warn":n==="err"?"err":"ok"),T.style.display="flex",H&&clearTimeout(H),H=setTimeout(()=>{T.style.display="none"},12e4))}const v=e("btnCopy")();v&&v.addEventListener("click",async()=>{var i;const t=e("cronOut")(),n=((i=t==null?void 0:t.textContent)==null?void 0:i.trim())??"";if(!n||n==="* * * * *"){x("Please generate a cron expression first!","warning");return}try{g(v,!0),await navigator.clipboard.writeText(n),S(t),x("Cron expression copied to clipboard!","success");const o=v.textContent;v.textContent="✓ Copied!",v.style.background="var(--cron-success)",v.style.borderColor="var(--cron-success)",setTimeout(()=>{v.textContent=o,v.style.background="",v.style.borderColor=""},2e3)}catch(o){x("Failed to copy to clipboard","error"),console.error("Copy failed:",o)}finally{g(v,!1)}});const k=e("btnExplain")();k&&k.addEventListener("click",async()=>{var o,s;const t=e("cronOut")(),n=e("explainText")(),i=(o=t==null?void 0:t.textContent)==null?void 0:o.trim();if(!i||i==="* * * * *"){x("Please generate a cron expression first!","warning");return}if(n)try{g(k,!0),g(n,!0),n.textContent="Generating explanation...",await new Promise(r=>setTimeout(r,300)),await z();let a;if((s=window.cronstrue)!=null&&s.toString)try{a=window.cronstrue.toString(i,{use24HourTimeFormat:!0,verbose:!0}),x("Expression explained successfully!","success")}catch(r){console.warn("cronstrue failed, using fallback:",r),a=$(i),x("Generated basic explanation","warning")}else a=$(i),x("Generated basic explanation","warning");n.textContent=a,S(n)}catch(a){n.textContent="Failed to explain expression",x("Failed to explain expression","error"),console.error("Explain failed:",a)}finally{g(k,!1),g(n,!1)}});function P(t){const n=_();if(!n)return null;try{return n.parseExpression(t,{iterator:!0}),null}catch(i){return(i==null?void 0:i.message)||"Invalid cron expression."}}const N=e("advanced-cron")();N&&N.addEventListener("input",()=>{var r,d;const t=N.value.trim(),n=e("validBox")();if(!n)return;const i=e("validTitle")(),o=e("validDetail")(),s=e("explainText")();if(!t){n.className="status",i&&(i.innerHTML="<strong>—</strong>"),o&&(o.textContent="Enter a cron expression.");return}const a=P(t);a?(n.className="status err",i&&(i.innerHTML="<strong>Error:</strong>"),o&&(o.textContent=a),s&&(s.textContent="")):(n.className="status ok",i&&(i.innerHTML="<strong>Looks good.</strong>"),o&&(o.textContent="Expression is valid."),s&&(s.textContent=((d=(r=window.cronstrue)==null?void 0:r.toString)==null?void 0:d.call(r,t))||""))});const W=e("btnAdvancedApply")();W&&W.addEventListener("click",()=>{var p,u;const t=((u=(p=e("advanced-cron")())==null?void 0:p.value)==null?void 0:u.trim())||"";if(!t){h("Advanced expression input is empty.","warn");const m=e("validBox")();m&&(m.className="status");return}const n=t.split(/\s+/);if(n.length<5||n.length>6){h("Invalid cron expression. Must have 5 or 6 fields.","err");return}w&&(w.value=n[0]),C&&(C.value=n[1]),b&&(b.value=n[2]),E&&(E.value=n[3]),y&&(y.value=n[4]);const i=e("cronOut")();i&&(i.textContent=t);const o=e("explainText")();o&&(o.textContent="Updated from advanced expression.");const s=P(t),a=e("validBox")(),r=e("validTitle")(),d=e("validDetail")();s?(a&&(a.className="status err"),r&&(r.innerHTML="<strong>Error:</strong>"),d&&(d.textContent=s)):(a&&(a.className="status ok"),r&&(r.innerHTML="<strong>Looks good.</strong>"),d&&(d.textContent="Expression structure is valid."))});const F=e("btnSpecialApply")();F&&F.addEventListener("click",()=>{var d,p;const t=((p=(d=e("special-cron")())==null?void 0:d.value)==null?void 0:p.trim())||"";if(!t){h("Special expression input is empty.","warn");const u=e("validBox")();u&&(u.className="status");return}if(!/[WL\?#]/.test(t)){h("Special expression must contain W, L, ?, or #.","err");return}b&&(b.value=t.includes("L")?"31":"1"),y&&(y.value=t.includes("W")?"1":"0");const n=e("cronOut")();n&&(n.textContent=t);const i=e("explainText")();i&&(i.textContent="Updated from special expression.");const o=P(t),s=e("validBox")(),a=e("validTitle")(),r=e("validDetail")();o?(s&&(s.className="status err"),a&&(a.innerHTML="<strong>Error:</strong>"),r&&(r.textContent=o)):(s&&(s.className="status ok"),a&&(a.innerHTML="<strong>Looks good.</strong>"),r&&(r.textContent="Expression structure is valid."))});const V=e("btnParse")();V&&V.addEventListener("click",()=>{var d,p,u,m;const t=((p=(d=e("parse-cron")())==null?void 0:d.value)==null?void 0:p.trim())||"",n=e("parseValidBox")(),i=e("parseValidTitle")(),o=e("parseValidDetail")(),s=e("parseExplainText")();if(!t){n&&(n.className="status"),i&&(i.innerHTML="<strong>—</strong>"),o&&(o.textContent="Enter a cron expression."),s&&(s.textContent="—"),h("Input is empty. Please enter a cron expression.","warn");return}const a=P(t);if(a){n&&(n.className="status err"),i&&(i.innerHTML="<strong>Error:</strong>"),o&&(o.textContent=a),s&&(s.textContent="");return}n&&(n.className="status ok"),i&&(i.innerHTML="<strong>Looks good.</strong>"),o&&(o.textContent="Expression is valid."),s&&(s.textContent=((m=(u=window.cronstrue)==null?void 0:u.toString)==null?void 0:m.call(u,t))||"Could not generate description.");const r=_();if(r)try{const M=r.parseExpression(t).next().toString();h("Next run: "+M,"info")}catch{}/^\* \* \* \* \*$/.test(t)&&h("Warning: This cron runs every minute. This can be risky!","warn")})}async function ae(e){if(!e)return;const c=await fetch("cronParser.html").then(l=>l.text());e.innerHTML=c,await ee(()=>te(),["cronBuilderPanel","cronOutputPanel"])}async function le(e){try{await Z.loadCSS("cronParser.css","cronparser"),await z(),await ae(e)}catch(c){console.error("Cron Parser load error:",c),e&&(e.innerHTML='<div class="error">Failed to load Cron Parser Tool</div>')}}export{le as load};
