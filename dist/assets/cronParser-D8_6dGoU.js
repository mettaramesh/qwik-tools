function V(){if(!document.getElementById("qwik-cron-style-link")){const d=document.createElement("link");d.id="qwik-cron-style-link",d.rel="stylesheet",d.type="text/css",d.href="./cronParser.css",document.head.appendChild(d)}}V();function O(d){return new Promise((c,b)=>{if(document.querySelector(`script[src="${d}"]`))return c();const v=document.createElement("script");v.src=d,v.onload=()=>c(),v.onerror=()=>b(new Error(`Failed to load ${d}`)),document.head.appendChild(v)})}let L;async function R(){return L||(L=(async()=>{if(await O("./cron-js-parser.min.js"),!window["cron-js-parser"]){const d=window.CronParser||window.cronParser||window.CRON_PARSER;d&&(window["cron-js-parser"]={CronParser:d})}await O("cronstrue.min.js")})()),L}function D(){const d=window["cron-js-parser"];return d&&d.CronParser&&typeof d.CronParser.parseExpression=="function"?d.CronParser:window.CronParser&&typeof window.CronParser.parseExpression=="function"?window.CronParser:window.cronParser&&typeof window.cronParser.parseExpression=="function"?window.cronParser:null}function j(){const d=document.getElementById("cronBuilderPanel"),c=document.getElementById("cronOutputPanel");if(!d||!c){console.error("cronBuilderPanel or cronOutputPanel not found in DOM");return}d.innerHTML=U(),c.innerHTML=F(),setTimeout(q,0)}function U(){return`
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
  `}function F(){return`
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
  `}function q(){function d(n,t,s,o){const e=document.getElementById(n);if(e){if(e.innerHTML="",o){const i=document.createElement("option");i.value="*",i.textContent=o,e.appendChild(i)}for(let i=t;i<=s;i++){const a=document.createElement("option");a.value=String(i),a.textContent=String(i),e.appendChild(a)}}}function c(n){const t=document.getElementById(n);if(!t)return;t.innerHTML="";const s=document.createElement("option");s.value="*",s.textContent="Every month *",t.appendChild(s);const o=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];for(let e=1;e<=12;e++){const i=document.createElement("option");i.value=String(e),i.textContent=`${e} (${o[e-1]})`,t.appendChild(i)}}function b(n,t){const s=document.getElementById(n);if(!s)return;s.innerHTML="";{const e=document.createElement("option");e.value="?",e.textContent="No specific day ?",s.appendChild(e)}const o=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];for(let e=0;e<=6;e++){const i=document.createElement("option");i.value=String(e),i.textContent=`${e} (${o[e]})`,s.appendChild(i)}}d("simple-minute",0,59,"Every minute *"),d("simple-hour",0,23,"Every hour *"),d("simple-dom",1,31,"Every day *"),c("simple-month"),b("simple-dow");const v=document.getElementById("tabs");v&&v.addEventListener("click",n=>{var o,e;const t=(e=(o=n.target).closest)==null?void 0:e.call(o,".tab");if(!t)return;[...v.children].forEach(i=>i.classList.remove("active")),t.classList.add("active");const s=t.dataset.tab;for(const i of["simple","advanced","special","parse"]){const a=document.getElementById("tab-"+i);a&&a.classList.toggle("hidden",i!==s)}});const w=document.getElementById("cronPresets");if(w){w.innerHTML="";const n=(t,s)=>{const o=document.createElement("div");o.className="chip",o.textContent=t,o.title=s,o.addEventListener("click",()=>{const e=document.getElementById("simple-minute");e&&(e.value="0");const i=document.getElementById("simple-hour");i&&(i.value="0");const a=document.getElementById("simple-dom");a&&(a.value="1");const l=document.getElementById("simple-month");l&&(l.value="1");const u=document.getElementById("simple-dow");u&&(u.value="0");const r=document.getElementById("cronOut");r&&(r.textContent=s);const p=document.getElementById("explainText");p&&(p.textContent=`At ${t.toLowerCase()}.`);const T=document.getElementById("validBox");T&&(T.className="status ok");const I=document.getElementById("validTitle");I&&(I.innerHTML="<strong>Looks good.</strong>");const $=document.getElementById("validDetail");$&&($.textContent="Expression structure is valid.")}),w.appendChild(o)};n("Every 5 Minutes","*/5 * * * *"),n("Hourly","0 * * * *"),n("Daily","0 0 * * *"),n("Weekly","0 0 * * 0"),n("Monthly","0 0 1 * *")}const x=document.getElementById("simple-minute"),g=document.getElementById("simple-hour"),f=document.getElementById("simple-dom"),E=document.getElementById("simple-month"),y=document.getElementById("simple-dow");function P(n){const t=n.trim().split(/\s+/);if(t.length<5)return"Invalid cron expression.";let[s,o,e,i,a]=t;return`Minute ${s}, hour ${o}, day-of-month ${e}, month ${i}, day-of-week ${a}`}function W(){const n=(x==null?void 0:x.value)??"*",t=(g==null?void 0:g.value)??"*",s=(f==null?void 0:f.value)??"*",o=(E==null?void 0:E.value)??"*",e=(y==null?void 0:y.value)??"*",i=`${n} ${t} ${s} ${o} ${e}`,a=document.getElementById("cronOut");a&&(a.textContent=i);const l=document.getElementById("explainText");l&&(l.textContent=P(i));const u=document.getElementById("validBox");u&&(u.className="status ok");const r=document.getElementById("validTitle");r&&(r.innerHTML="<strong>Looks good.</strong>");const p=document.getElementById("validDetail");p&&(p.textContent="Expression structure is valid.")}[x,g,f,E,y].forEach(n=>n&&n.addEventListener("change",W));const B=document.getElementById("cronInfoBox");let h=null;function m(n,t="info"){B&&(B.textContent=n,B.className="status "+(t==="warn"?"warn":t==="err"?"err":"ok"),B.style.display="flex",h&&clearTimeout(h),h=setTimeout(()=>{B.style.display="none"},12e4))}const M=document.getElementById("btnCopy");M&&M.addEventListener("click",async()=>{var t,s;const n=((s=(t=document.getElementById("cronOut"))==null?void 0:t.textContent)==null?void 0:s.trim())??"";try{await navigator.clipboard.writeText(n),m("Cron expression copied to clipboard.","info")}catch{m("Could not copy to clipboard.","warn")}});const N=document.getElementById("btnExplain");N&&N.addEventListener("click",()=>{var s,o,e,i;const n=(o=(s=document.getElementById("cronOut"))==null?void 0:s.textContent)==null?void 0:o.trim();if(!n||n==="* * * * *")return m("Nothing to explain. Generate a cron first.","warn");const t=document.getElementById("explainText");t&&(t.textContent=((i=(e=window.cronstrue)==null?void 0:e.toString)==null?void 0:i.call(e,n))??P(n)),m("Explanation updated.","info")});function C(n){const t=D();if(!t)return null;try{return t.parseExpression(n,{iterator:!0}),null}catch(s){return(s==null?void 0:s.message)||"Invalid cron expression."}}const k=document.getElementById("advanced-cron");k&&k.addEventListener("input",()=>{var a,l;const n=k.value.trim(),t=document.getElementById("validBox");if(!t)return;const s=document.getElementById("validTitle"),o=document.getElementById("validDetail"),e=document.getElementById("explainText");if(!n){t.className="status",s&&(s.innerHTML="<strong>—</strong>"),o&&(o.textContent="Enter a cron expression.");return}const i=C(n);i?(t.className="status err",s&&(s.innerHTML="<strong>Error:</strong>"),o&&(o.textContent=i),e&&(e.textContent="")):(t.className="status ok",s&&(s.innerHTML="<strong>Looks good.</strong>"),o&&(o.textContent="Expression is valid."),e&&(e.textContent=((l=(a=window.cronstrue)==null?void 0:a.toString)==null?void 0:l.call(a,n))||""))});const H=document.getElementById("btnAdvancedApply");H&&H.addEventListener("click",()=>{var u,r;const n=((r=(u=document.getElementById("advanced-cron"))==null?void 0:u.value)==null?void 0:r.trim())||"";if(!n){m("Advanced expression input is empty.","warn");const p=document.getElementById("validBox");p&&(p.className="status");return}const t=n.split(/\s+/);if(t.length<5||t.length>6){m("Invalid cron expression. Must have 5 or 6 fields.","err");return}x&&(x.value=t[0]),g&&(g.value=t[1]),f&&(f.value=t[2]),E&&(E.value=t[3]),y&&(y.value=t[4]);const s=document.getElementById("cronOut");s&&(s.textContent=n);const o=document.getElementById("explainText");o&&(o.textContent="Updated from advanced expression.");const e=C(n),i=document.getElementById("validBox"),a=document.getElementById("validTitle"),l=document.getElementById("validDetail");e?(i&&(i.className="status err"),a&&(a.innerHTML="<strong>Error:</strong>"),l&&(l.textContent=e)):(i&&(i.className="status ok"),a&&(a.innerHTML="<strong>Looks good.</strong>"),l&&(l.textContent="Expression structure is valid."))});const A=document.getElementById("btnSpecialApply");A&&A.addEventListener("click",()=>{var l,u;const n=((u=(l=document.getElementById("special-cron"))==null?void 0:l.value)==null?void 0:u.trim())||"";if(!n){m("Special expression input is empty.","warn");const r=document.getElementById("validBox");r&&(r.className="status");return}if(!/[WL\?#]/.test(n)){m("Special expression must contain W, L, ?, or #.","err");return}f&&(f.value=n.includes("L")?"31":"1"),y&&(y.value=n.includes("W")?"1":"0");const t=document.getElementById("cronOut");t&&(t.textContent=n);const s=document.getElementById("explainText");s&&(s.textContent="Updated from special expression.");const o=C(n),e=document.getElementById("validBox"),i=document.getElementById("validTitle"),a=document.getElementById("validDetail");o?(e&&(e.className="status err"),i&&(i.innerHTML="<strong>Error:</strong>"),a&&(a.textContent=o)):(e&&(e.className="status ok"),i&&(i.innerHTML="<strong>Looks good.</strong>"),a&&(a.textContent="Expression structure is valid."))});const S=document.getElementById("btnParse");S&&S.addEventListener("click",()=>{var l,u,r,p;const n=((u=(l=document.getElementById("parse-cron"))==null?void 0:l.value)==null?void 0:u.trim())||"",t=document.getElementById("parseValidBox"),s=document.getElementById("parseValidTitle"),o=document.getElementById("parseValidDetail"),e=document.getElementById("parseExplainText");if(!n){t&&(t.className="status"),s&&(s.innerHTML="<strong>—</strong>"),o&&(o.textContent="Enter a cron expression."),e&&(e.textContent="—"),m("Input is empty. Please enter a cron expression.","warn");return}const i=C(n);if(i){t&&(t.className="status err"),s&&(s.innerHTML="<strong>Error:</strong>"),o&&(o.textContent=i),e&&(e.textContent="");return}t&&(t.className="status ok"),s&&(s.innerHTML="<strong>Looks good.</strong>"),o&&(o.textContent="Expression is valid."),e&&(e.textContent=((p=(r=window.cronstrue)==null?void 0:r.toString)==null?void 0:p.call(r,n))||"Could not generate description.");const a=D();if(a)try{const I=a.parseExpression(n).next().toString();m("Next run: "+I,"info")}catch{}/^\* \* \* \* \*$/.test(n)&&m("Warning: This cron runs every minute. This can be risky!","warn")})}async function Q(d){if(!d)return;const c=await fetch("src/cronParser.html").then(b=>b.text());d.innerHTML=c,setTimeout(j,0)}async function G(d){if(!document.getElementById("cronparser-css-link")){const c=document.createElement("link");c.id="cronparser-css-link",c.rel="stylesheet",c.href="cronParser.css",document.head.appendChild(c)}await R(),await Q(d)}export{G as load};
