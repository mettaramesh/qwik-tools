import{c as Y}from"./cssLoader-DTPWrGuQ.js";function P(r){r&&(r.classList.add("success-animation"),setTimeout(()=>r.classList.remove("success-animation"),600))}function b(r,l=!0){r&&r.classList.toggle("loading",l)}function f(r,l="success"){const y=document.querySelector(".cron-toast");y&&y.remove();const c=document.createElement("div");c.className=`cron-toast cron-toast--${l}`,c.style.cssText=`
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
  `,c.textContent=r,document.body.appendChild(c),setTimeout(()=>c.style.transform="translateX(0)",50),setTimeout(()=>{c.style.transform="translateX(100%)",setTimeout(()=>c.remove(),300)},3e3)}function Q(r){return new Promise((l,y)=>{if(document.querySelector(`script[src="${r}"]`))return l();const c=document.createElement("script");c.src=r,c.onload=()=>l(),c.onerror=()=>y(new Error(`Failed to load ${r}`)),document.head.appendChild(c)})}let R;async function X(){return R||(R=(async()=>{if(await Q("./cron-js-parser.min.js"),!window["cron-js-parser"]){const r=window.CronParser||window.cronParser||window.CRON_PARSER;r&&(window["cron-js-parser"]={CronParser:r})}await Q("cronstrue.min.js")})()),R}function J(){const r=window["cron-js-parser"];return r&&r.CronParser&&typeof r.CronParser.parseExpression=="function"?r.CronParser:window.CronParser&&typeof window.CronParser.parseExpression=="function"?window.CronParser:window.cronParser&&typeof window.cronParser.parseExpression=="function"?window.cronParser:null}function K(){const r=document.getElementById("cronBuilderPanel"),l=document.getElementById("cronOutputPanel");if(!r||!l){console.error("cronBuilderPanel or cronOutputPanel not found in DOM");return}r.innerHTML=Z(),l.innerHTML=ee(),setTimeout(te,0)}function Z(){return`
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
  `}function te(){function r(t,e,s,i){const n=document.getElementById(t);if(n){if(n.innerHTML="",i){const o=document.createElement("option");o.value="*",o.textContent=i,n.appendChild(o)}for(let o=e;o<=s;o++){const a=document.createElement("option");a.value=String(o),a.textContent=String(o),n.appendChild(a)}}}function l(t){const e=document.getElementById(t);if(!e)return;e.innerHTML="";const s=document.createElement("option");s.value="*",s.textContent="Every month *",e.appendChild(s);const i=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];for(let n=1;n<=12;n++){const o=document.createElement("option");o.value=String(n),o.textContent=`${n} (${i[n-1]})`,e.appendChild(o)}}function y(t,e){const s=document.getElementById(t);if(!s)return;s.innerHTML="";{const n=document.createElement("option");n.value="?",n.textContent="No specific day ?",s.appendChild(n)}const i=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];for(let n=0;n<=6;n++){const o=document.createElement("option");o.value=String(n),o.textContent=`${n} (${i[n]})`,s.appendChild(o)}}r("simple-minute",0,59,"Every minute *"),r("simple-hour",0,23,"Every hour *"),r("simple-dom",1,31,"Every day *"),l("simple-month"),y("simple-dow");const c=document.getElementById("tabs");c&&c.addEventListener("click",t=>{var i,n;const e=(n=(i=t.target).closest)==null?void 0:n.call(i,".tab");if(!e)return;[...c.children].forEach(o=>o.classList.remove("active")),e.classList.add("active");const s=e.dataset.tab;for(const o of["simple","advanced","special","parse"]){const a=document.getElementById("tab-"+o);a&&a.classList.toggle("hidden",o!==s)}});const I=document.getElementById("cronPresets");if(I){I.innerHTML="";const t=(e,s,i)=>{const n=document.createElement("div");n.className="chip",n.textContent=e,n.title=`${s}
${i||`Sets cron to: ${e.toLowerCase()}`}`,n.addEventListener("click",async()=>{b(n,!0),I.querySelectorAll(".chip").forEach(z=>z.classList.remove("active")),n.classList.add("active");const o=s.split(/\s+/),[a,d,m,u,v]=o,H=document.getElementById("simple-minute"),k=document.getElementById("simple-hour"),F=document.getElementById("simple-dom"),V=document.getElementById("simple-month"),U=document.getElementById("simple-dow");H&&(H.value=a||"*"),k&&(k.value=d||"*"),F&&(F.value=m||"*"),V&&(V.value=u||"*"),U&&(U.value=v||"*");const N=document.getElementById("cronOut");N&&(N.textContent=s,P(N));const $=document.getElementById("explainText");$&&($.textContent=i||`Runs ${e.toLowerCase()}.`,P($));const j=document.getElementById("validBox"),G=document.getElementById("validTitle"),q=document.getElementById("validDetail");j&&(j.className="status ok"),G&&(G.innerHTML="<strong>✓ Preset applied</strong>"),q&&(q.textContent="Using predefined schedule pattern."),f(`Applied preset: ${e}`,"success"),setTimeout(()=>{b(n,!1),n.classList.remove("active")},1e3)}),I.appendChild(n)};t("Every 5 Minutes","*/5 * * * *","Runs every 5 minutes"),t("Every 15 Minutes","*/15 * * * *","Runs every 15 minutes"),t("Every 30 Minutes","*/30 * * * *","Runs every 30 minutes"),t("Hourly","0 * * * *","Runs at the top of every hour"),t("Daily at Midnight","0 0 * * *","Runs once a day at midnight"),t("Daily at 9 AM","0 9 * * *","Runs every day at 9:00 AM"),t("Weekdays at 9 AM","0 9 * * 1-5","Runs Monday through Friday at 9:00 AM"),t("Weekly (Sunday)","0 0 * * 0","Runs every Sunday at midnight"),t("Monthly (1st)","0 0 1 * *","Runs on the 1st day of every month at midnight"),t("Quarterly","0 0 1 */3 *","Runs every 3 months on the 1st day at midnight")}const h=document.getElementById("simple-minute"),w=document.getElementById("simple-hour"),x=document.getElementById("simple-dom"),C=document.getElementById("simple-month"),g=document.getElementById("simple-dow");function M(t){const e=t.trim().split(/\s+/);if(e.length<5)return"Invalid cron expression.";let[s,i,n,o,a]=e;return`Minute ${s}, hour ${i}, day-of-month ${n}, month ${o}, day-of-week ${a}`}function _(){const t=(h==null?void 0:h.value)??"*",e=(w==null?void 0:w.value)??"*",s=(x==null?void 0:x.value)??"*",i=(C==null?void 0:C.value)??"*",n=(g==null?void 0:g.value)??"*",o=`${t} ${e} ${s} ${i} ${n}`,a=document.getElementById("cronOut");a&&(a.textContent=o);const d=document.getElementById("explainText");d&&(d.textContent=M(o));const m=document.getElementById("validBox");m&&(m.className="status ok");const u=document.getElementById("validTitle");u&&(u.innerHTML="<strong>Looks good.</strong>");const v=document.getElementById("validDetail");v&&(v.textContent="Expression structure is valid.")}[h,w,x,C,g].forEach(t=>t&&t.addEventListener("change",_));const B=document.getElementById("cronInfoBox");let S=null;function E(t,e="info"){B&&(B.textContent=t,B.className="status "+(e==="warn"?"warn":e==="err"?"err":"ok"),B.style.display="flex",S&&clearTimeout(S),S=setTimeout(()=>{B.style.display="none"},12e4))}const p=document.getElementById("btnCopy");p&&p.addEventListener("click",async()=>{var s;const t=document.getElementById("cronOut"),e=((s=t==null?void 0:t.textContent)==null?void 0:s.trim())??"";if(!e||e==="* * * * *"){f("Please generate a cron expression first!","warning");return}try{b(p,!0),await navigator.clipboard.writeText(e),P(t),f("Cron expression copied to clipboard!","success");const i=p.textContent;p.textContent="✓ Copied!",p.style.background="var(--cron-success)",p.style.borderColor="var(--cron-success)",setTimeout(()=>{p.textContent=i,p.style.background="",p.style.borderColor=""},2e3)}catch(i){f("Failed to copy to clipboard","error"),console.error("Copy failed:",i)}finally{b(p,!1)}});const T=document.getElementById("btnExplain");T&&T.addEventListener("click",async()=>{var i,n;const t=document.getElementById("cronOut"),e=document.getElementById("explainText"),s=(i=t==null?void 0:t.textContent)==null?void 0:i.trim();if(!s||s==="* * * * *"){f("Please generate a cron expression first!","warning");return}if(e)try{b(T,!0),b(e,!0),e.textContent="Generating explanation...",await new Promise(a=>setTimeout(a,300)),await X();let o;if((n=window.cronstrue)!=null&&n.toString)try{o=window.cronstrue.toString(s,{use24HourTimeFormat:!0,verbose:!0}),f("Expression explained successfully!","success")}catch(a){console.warn("cronstrue failed, using fallback:",a),o=M(s),f("Generated basic explanation","warning")}else o=M(s),f("Generated basic explanation","warning");e.textContent=o,P(e)}catch(o){e.textContent="Failed to explain expression",f("Failed to explain expression","error"),console.error("Explain failed:",o)}finally{b(T,!1),b(e,!1)}});function L(t){const e=J();if(!e)return null;try{return e.parseExpression(t,{iterator:!0}),null}catch(s){return(s==null?void 0:s.message)||"Invalid cron expression."}}const A=document.getElementById("advanced-cron");A&&A.addEventListener("input",()=>{var a,d;const t=A.value.trim(),e=document.getElementById("validBox");if(!e)return;const s=document.getElementById("validTitle"),i=document.getElementById("validDetail"),n=document.getElementById("explainText");if(!t){e.className="status",s&&(s.innerHTML="<strong>—</strong>"),i&&(i.textContent="Enter a cron expression.");return}const o=L(t);o?(e.className="status err",s&&(s.innerHTML="<strong>Error:</strong>"),i&&(i.textContent=o),n&&(n.textContent="")):(e.className="status ok",s&&(s.innerHTML="<strong>Looks good.</strong>"),i&&(i.textContent="Expression is valid."),n&&(n.textContent=((d=(a=window.cronstrue)==null?void 0:a.toString)==null?void 0:d.call(a,t))||""))});const D=document.getElementById("btnAdvancedApply");D&&D.addEventListener("click",()=>{var m,u;const t=((u=(m=document.getElementById("advanced-cron"))==null?void 0:m.value)==null?void 0:u.trim())||"";if(!t){E("Advanced expression input is empty.","warn");const v=document.getElementById("validBox");v&&(v.className="status");return}const e=t.split(/\s+/);if(e.length<5||e.length>6){E("Invalid cron expression. Must have 5 or 6 fields.","err");return}h&&(h.value=e[0]),w&&(w.value=e[1]),x&&(x.value=e[2]),C&&(C.value=e[3]),g&&(g.value=e[4]);const s=document.getElementById("cronOut");s&&(s.textContent=t);const i=document.getElementById("explainText");i&&(i.textContent="Updated from advanced expression.");const n=L(t),o=document.getElementById("validBox"),a=document.getElementById("validTitle"),d=document.getElementById("validDetail");n?(o&&(o.className="status err"),a&&(a.innerHTML="<strong>Error:</strong>"),d&&(d.textContent=n)):(o&&(o.className="status ok"),a&&(a.innerHTML="<strong>Looks good.</strong>"),d&&(d.textContent="Expression structure is valid."))});const O=document.getElementById("btnSpecialApply");O&&O.addEventListener("click",()=>{var d,m;const t=((m=(d=document.getElementById("special-cron"))==null?void 0:d.value)==null?void 0:m.trim())||"";if(!t){E("Special expression input is empty.","warn");const u=document.getElementById("validBox");u&&(u.className="status");return}if(!/[WL\?#]/.test(t)){E("Special expression must contain W, L, ?, or #.","err");return}x&&(x.value=t.includes("L")?"31":"1"),g&&(g.value=t.includes("W")?"1":"0");const e=document.getElementById("cronOut");e&&(e.textContent=t);const s=document.getElementById("explainText");s&&(s.textContent="Updated from special expression.");const i=L(t),n=document.getElementById("validBox"),o=document.getElementById("validTitle"),a=document.getElementById("validDetail");i?(n&&(n.className="status err"),o&&(o.innerHTML="<strong>Error:</strong>"),a&&(a.textContent=i)):(n&&(n.className="status ok"),o&&(o.innerHTML="<strong>Looks good.</strong>"),a&&(a.textContent="Expression structure is valid."))});const W=document.getElementById("btnParse");W&&W.addEventListener("click",()=>{var d,m,u,v;const t=((m=(d=document.getElementById("parse-cron"))==null?void 0:d.value)==null?void 0:m.trim())||"",e=document.getElementById("parseValidBox"),s=document.getElementById("parseValidTitle"),i=document.getElementById("parseValidDetail"),n=document.getElementById("parseExplainText");if(!t){e&&(e.className="status"),s&&(s.innerHTML="<strong>—</strong>"),i&&(i.textContent="Enter a cron expression."),n&&(n.textContent="—"),E("Input is empty. Please enter a cron expression.","warn");return}const o=L(t);if(o){e&&(e.className="status err"),s&&(s.innerHTML="<strong>Error:</strong>"),i&&(i.textContent=o),n&&(n.textContent="");return}e&&(e.className="status ok"),s&&(s.innerHTML="<strong>Looks good.</strong>"),i&&(i.textContent="Expression is valid."),n&&(n.textContent=((v=(u=window.cronstrue)==null?void 0:u.toString)==null?void 0:v.call(u,t))||"Could not generate description.");const a=J();if(a)try{const k=a.parseExpression(t).next().toString();E("Next run: "+k,"info")}catch{}/^\* \* \* \* \*$/.test(t)&&E("Warning: This cron runs every minute. This can be risky!","warn")})}async function ne(r){if(!r)return;const l=await fetch("cronParser.html").then(y=>y.text());r.innerHTML=l,setTimeout(K,0)}async function oe(r){try{await Y.loadCSS("cronParser.css","cronparser"),await X(),await ne(r)}catch(l){console.error("Cron Parser load error:",l),r&&(r.innerHTML='<div class="error">Failed to load Cron Parser Tool</div>')}}export{oe as load};
