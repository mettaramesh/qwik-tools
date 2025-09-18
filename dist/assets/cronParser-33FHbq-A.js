function Y(){if(!document.getElementById("qwik-cron-style-link")){const a=document.createElement("link");a.id="qwik-cron-style-link",a.rel="stylesheet",a.type="text/css",a.href="./cronParser.css",document.head.appendChild(a)}}Y();function P(a){a&&(a.classList.add("success-animation"),setTimeout(()=>a.classList.remove("success-animation"),600))}function b(a,d=!0){a&&a.classList.toggle("loading",d)}function f(a,d="success"){const y=document.querySelector(".cron-toast");y&&y.remove();const c=document.createElement("div");c.className=`cron-toast cron-toast--${d}`,c.style.cssText=`
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    background: ${d==="success"?"var(--cron-success)":d==="error"?"var(--cron-error)":"var(--cron-warning)"};
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: var(--cron-shadow-lg);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `,c.textContent=a,document.body.appendChild(c),setTimeout(()=>c.style.transform="translateX(0)",50),setTimeout(()=>{c.style.transform="translateX(100%)",setTimeout(()=>c.remove(),300)},3e3)}function Q(a){return new Promise((d,y)=>{if(document.querySelector(`script[src="${a}"]`))return d();const c=document.createElement("script");c.src=a,c.onload=()=>d(),c.onerror=()=>y(new Error(`Failed to load ${a}`)),document.head.appendChild(c)})}let R;async function X(){return R||(R=(async()=>{if(await Q("./cron-js-parser.min.js"),!window["cron-js-parser"]){const a=window.CronParser||window.cronParser||window.CRON_PARSER;a&&(window["cron-js-parser"]={CronParser:a})}await Q("cronstrue.min.js")})()),R}function J(){const a=window["cron-js-parser"];return a&&a.CronParser&&typeof a.CronParser.parseExpression=="function"?a.CronParser:window.CronParser&&typeof window.CronParser.parseExpression=="function"?window.CronParser:window.cronParser&&typeof window.cronParser.parseExpression=="function"?window.cronParser:null}function K(){const a=document.getElementById("cronBuilderPanel"),d=document.getElementById("cronOutputPanel");if(!a||!d){console.error("cronBuilderPanel or cronOutputPanel not found in DOM");return}a.innerHTML=Z(),d.innerHTML=ee(),setTimeout(te,0)}function Z(){return`
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
  `}function ee(){return`
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
  `}function te(){function a(t,e,s,o){const n=document.getElementById(t);if(n){if(n.innerHTML="",o){const i=document.createElement("option");i.value="*",i.textContent=o,n.appendChild(i)}for(let i=e;i<=s;i++){const r=document.createElement("option");r.value=String(i),r.textContent=String(i),n.appendChild(r)}}}function d(t){const e=document.getElementById(t);if(!e)return;e.innerHTML="";const s=document.createElement("option");s.value="*",s.textContent="Every month *",e.appendChild(s);const o=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];for(let n=1;n<=12;n++){const i=document.createElement("option");i.value=String(n),i.textContent=`${n} (${o[n-1]})`,e.appendChild(i)}}function y(t,e){const s=document.getElementById(t);if(!s)return;s.innerHTML="";{const n=document.createElement("option");n.value="?",n.textContent="No specific day ?",s.appendChild(n)}const o=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];for(let n=0;n<=6;n++){const i=document.createElement("option");i.value=String(n),i.textContent=`${n} (${o[n]})`,s.appendChild(i)}}a("simple-minute",0,59,"Every minute *"),a("simple-hour",0,23,"Every hour *"),a("simple-dom",1,31,"Every day *"),d("simple-month"),y("simple-dow");const c=document.getElementById("tabs");c&&c.addEventListener("click",t=>{var o,n;const e=(n=(o=t.target).closest)==null?void 0:n.call(o,".tab");if(!e)return;[...c.children].forEach(i=>i.classList.remove("active")),e.classList.add("active");const s=e.dataset.tab;for(const i of["simple","advanced","special","parse"]){const r=document.getElementById("tab-"+i);r&&r.classList.toggle("hidden",i!==s)}});const I=document.getElementById("cronPresets");if(I){I.innerHTML="";const t=(e,s,o)=>{const n=document.createElement("div");n.className="chip",n.textContent=e,n.title=`${s}
${o||`Sets cron to: ${e.toLowerCase()}`}`,n.addEventListener("click",async()=>{b(n,!0),I.querySelectorAll(".chip").forEach(z=>z.classList.remove("active")),n.classList.add("active");const i=s.split(/\s+/),[r,l,m,u,v]=i,H=document.getElementById("simple-minute"),L=document.getElementById("simple-hour"),F=document.getElementById("simple-dom"),V=document.getElementById("simple-month"),U=document.getElementById("simple-dow");H&&(H.value=r||"*"),L&&(L.value=l||"*"),F&&(F.value=m||"*"),V&&(V.value=u||"*"),U&&(U.value=v||"*");const N=document.getElementById("cronOut");N&&(N.textContent=s,P(N));const $=document.getElementById("explainText");$&&($.textContent=o||`Runs ${e.toLowerCase()}.`,P($));const j=document.getElementById("validBox"),q=document.getElementById("validTitle"),G=document.getElementById("validDetail");j&&(j.className="status ok"),q&&(q.innerHTML="<strong>✓ Preset applied</strong>"),G&&(G.textContent="Using predefined schedule pattern."),f(`Applied preset: ${e}`,"success"),setTimeout(()=>{b(n,!1),n.classList.remove("active")},1e3)}),I.appendChild(n)};t("Every 5 Minutes","*/5 * * * *","Runs every 5 minutes"),t("Every 15 Minutes","*/15 * * * *","Runs every 15 minutes"),t("Every 30 Minutes","*/30 * * * *","Runs every 30 minutes"),t("Hourly","0 * * * *","Runs at the top of every hour"),t("Daily at Midnight","0 0 * * *","Runs once a day at midnight"),t("Daily at 9 AM","0 9 * * *","Runs every day at 9:00 AM"),t("Weekdays at 9 AM","0 9 * * 1-5","Runs Monday through Friday at 9:00 AM"),t("Weekly (Sunday)","0 0 * * 0","Runs every Sunday at midnight"),t("Monthly (1st)","0 0 1 * *","Runs on the 1st day of every month at midnight"),t("Quarterly","0 0 1 */3 *","Runs every 3 months on the 1st day at midnight")}const h=document.getElementById("simple-minute"),w=document.getElementById("simple-hour"),x=document.getElementById("simple-dom"),C=document.getElementById("simple-month"),g=document.getElementById("simple-dow");function M(t){const e=t.trim().split(/\s+/);if(e.length<5)return"Invalid cron expression.";let[s,o,n,i,r]=e;return`Minute ${s}, hour ${o}, day-of-month ${n}, month ${i}, day-of-week ${r}`}function _(){const t=(h==null?void 0:h.value)??"*",e=(w==null?void 0:w.value)??"*",s=(x==null?void 0:x.value)??"*",o=(C==null?void 0:C.value)??"*",n=(g==null?void 0:g.value)??"*",i=`${t} ${e} ${s} ${o} ${n}`,r=document.getElementById("cronOut");r&&(r.textContent=i);const l=document.getElementById("explainText");l&&(l.textContent=M(i));const m=document.getElementById("validBox");m&&(m.className="status ok");const u=document.getElementById("validTitle");u&&(u.innerHTML="<strong>Looks good.</strong>");const v=document.getElementById("validDetail");v&&(v.textContent="Expression structure is valid.")}[h,w,x,C,g].forEach(t=>t&&t.addEventListener("change",_));const B=document.getElementById("cronInfoBox");let A=null;function E(t,e="info"){B&&(B.textContent=t,B.className="status "+(e==="warn"?"warn":e==="err"?"err":"ok"),B.style.display="flex",A&&clearTimeout(A),A=setTimeout(()=>{B.style.display="none"},12e4))}const p=document.getElementById("btnCopy");p&&p.addEventListener("click",async()=>{var s;const t=document.getElementById("cronOut"),e=((s=t==null?void 0:t.textContent)==null?void 0:s.trim())??"";if(!e||e==="* * * * *"){f("Please generate a cron expression first!","warning");return}try{b(p,!0),await navigator.clipboard.writeText(e),P(t),f("Cron expression copied to clipboard!","success");const o=p.textContent;p.textContent="✓ Copied!",p.style.background="var(--cron-success)",p.style.borderColor="var(--cron-success)",setTimeout(()=>{p.textContent=o,p.style.background="",p.style.borderColor=""},2e3)}catch(o){f("Failed to copy to clipboard","error"),console.error("Copy failed:",o)}finally{b(p,!1)}});const T=document.getElementById("btnExplain");T&&T.addEventListener("click",async()=>{var o,n;const t=document.getElementById("cronOut"),e=document.getElementById("explainText"),s=(o=t==null?void 0:t.textContent)==null?void 0:o.trim();if(!s||s==="* * * * *"){f("Please generate a cron expression first!","warning");return}if(e)try{b(T,!0),b(e,!0),e.textContent="Generating explanation...",await new Promise(r=>setTimeout(r,300)),await X();let i;if((n=window.cronstrue)!=null&&n.toString)try{i=window.cronstrue.toString(s,{use24HourTimeFormat:!0,verbose:!0}),f("Expression explained successfully!","success")}catch(r){console.warn("cronstrue failed, using fallback:",r),i=M(s),f("Generated basic explanation","warning")}else i=M(s),f("Generated basic explanation","warning");e.textContent=i,P(e)}catch(i){e.textContent="Failed to explain expression",f("Failed to explain expression","error"),console.error("Explain failed:",i)}finally{b(T,!1),b(e,!1)}});function k(t){const e=J();if(!e)return null;try{return e.parseExpression(t,{iterator:!0}),null}catch(s){return(s==null?void 0:s.message)||"Invalid cron expression."}}const S=document.getElementById("advanced-cron");S&&S.addEventListener("input",()=>{var r,l;const t=S.value.trim(),e=document.getElementById("validBox");if(!e)return;const s=document.getElementById("validTitle"),o=document.getElementById("validDetail"),n=document.getElementById("explainText");if(!t){e.className="status",s&&(s.innerHTML="<strong>—</strong>"),o&&(o.textContent="Enter a cron expression.");return}const i=k(t);i?(e.className="status err",s&&(s.innerHTML="<strong>Error:</strong>"),o&&(o.textContent=i),n&&(n.textContent="")):(e.className="status ok",s&&(s.innerHTML="<strong>Looks good.</strong>"),o&&(o.textContent="Expression is valid."),n&&(n.textContent=((l=(r=window.cronstrue)==null?void 0:r.toString)==null?void 0:l.call(r,t))||""))});const D=document.getElementById("btnAdvancedApply");D&&D.addEventListener("click",()=>{var m,u;const t=((u=(m=document.getElementById("advanced-cron"))==null?void 0:m.value)==null?void 0:u.trim())||"";if(!t){E("Advanced expression input is empty.","warn");const v=document.getElementById("validBox");v&&(v.className="status");return}const e=t.split(/\s+/);if(e.length<5||e.length>6){E("Invalid cron expression. Must have 5 or 6 fields.","err");return}h&&(h.value=e[0]),w&&(w.value=e[1]),x&&(x.value=e[2]),C&&(C.value=e[3]),g&&(g.value=e[4]);const s=document.getElementById("cronOut");s&&(s.textContent=t);const o=document.getElementById("explainText");o&&(o.textContent="Updated from advanced expression.");const n=k(t),i=document.getElementById("validBox"),r=document.getElementById("validTitle"),l=document.getElementById("validDetail");n?(i&&(i.className="status err"),r&&(r.innerHTML="<strong>Error:</strong>"),l&&(l.textContent=n)):(i&&(i.className="status ok"),r&&(r.innerHTML="<strong>Looks good.</strong>"),l&&(l.textContent="Expression structure is valid."))});const O=document.getElementById("btnSpecialApply");O&&O.addEventListener("click",()=>{var l,m;const t=((m=(l=document.getElementById("special-cron"))==null?void 0:l.value)==null?void 0:m.trim())||"";if(!t){E("Special expression input is empty.","warn");const u=document.getElementById("validBox");u&&(u.className="status");return}if(!/[WL\?#]/.test(t)){E("Special expression must contain W, L, ?, or #.","err");return}x&&(x.value=t.includes("L")?"31":"1"),g&&(g.value=t.includes("W")?"1":"0");const e=document.getElementById("cronOut");e&&(e.textContent=t);const s=document.getElementById("explainText");s&&(s.textContent="Updated from special expression.");const o=k(t),n=document.getElementById("validBox"),i=document.getElementById("validTitle"),r=document.getElementById("validDetail");o?(n&&(n.className="status err"),i&&(i.innerHTML="<strong>Error:</strong>"),r&&(r.textContent=o)):(n&&(n.className="status ok"),i&&(i.innerHTML="<strong>Looks good.</strong>"),r&&(r.textContent="Expression structure is valid."))});const W=document.getElementById("btnParse");W&&W.addEventListener("click",()=>{var l,m,u,v;const t=((m=(l=document.getElementById("parse-cron"))==null?void 0:l.value)==null?void 0:m.trim())||"",e=document.getElementById("parseValidBox"),s=document.getElementById("parseValidTitle"),o=document.getElementById("parseValidDetail"),n=document.getElementById("parseExplainText");if(!t){e&&(e.className="status"),s&&(s.innerHTML="<strong>—</strong>"),o&&(o.textContent="Enter a cron expression."),n&&(n.textContent="—"),E("Input is empty. Please enter a cron expression.","warn");return}const i=k(t);if(i){e&&(e.className="status err"),s&&(s.innerHTML="<strong>Error:</strong>"),o&&(o.textContent=i),n&&(n.textContent="");return}e&&(e.className="status ok"),s&&(s.innerHTML="<strong>Looks good.</strong>"),o&&(o.textContent="Expression is valid."),n&&(n.textContent=((v=(u=window.cronstrue)==null?void 0:u.toString)==null?void 0:v.call(u,t))||"Could not generate description.");const r=J();if(r)try{const L=r.parseExpression(t).next().toString();E("Next run: "+L,"info")}catch{}/^\* \* \* \* \*$/.test(t)&&E("Warning: This cron runs every minute. This can be risky!","warn")})}async function ne(a){if(!a)return;const d=await fetch("cronParser.html").then(y=>y.text());a.innerHTML=d,setTimeout(K,0)}async function se(a){if(!document.getElementById("cronparser-css-link")){const d=document.createElement("link");d.id="cronparser-css-link",d.rel="stylesheet",d.href="cronParser.css",document.head.appendChild(d)}await X(),await ne(a)}export{se as load};
