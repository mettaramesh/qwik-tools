import{c as te}from"./cssLoader-DTPWrGuQ.js";import{s as se,c as ne}from"./domUtils-BxdcSh8e.js";function I(e){e&&(e.classList.add("success-animation"),setTimeout(()=>e.classList.remove("success-animation"),600))}function g(e,p=!0){e&&e.classList.toggle("loading",p)}function b(e,p="success"){const w=document.querySelector(".cron-toast");w&&w.remove();const m=document.createElement("div");m.className=`cron-toast cron-toast--${p}`,m.style.cssText=`
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    background: ${p==="success"?"var(--cron-success)":p==="error"?"var(--cron-error)":"var(--cron-warning)"};
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: var(--cron-shadow-lg);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `,m.textContent=e,document.body.appendChild(m),setTimeout(()=>m.style.transform="translateX(0)",50),setTimeout(()=>{m.style.transform="translateX(100%)",setTimeout(()=>m.remove(),300)},3e3)}function z(e){return new Promise((p,w)=>{if(document.querySelector(`script[src="${e}"]`))return p();const m=document.createElement("script");m.src=e,m.onload=()=>p(),m.onerror=()=>w(new Error(`Failed to load ${e}`)),document.head.appendChild(m)})}let R;async function K(){return R||(R=(async()=>{if(await z("./cron-js-parser.min.js"),!window["cron-js-parser"]){const e=window.CronParser||window.cronParser||window.CRON_PARSER;e&&(window["cron-js-parser"]={CronParser:e})}await z("cronstrue.min.js")})()),R}function Y(){const e=window["cron-js-parser"];return e&&e.CronParser&&typeof e.CronParser.parseExpression=="function"?e.CronParser:window.CronParser&&typeof window.CronParser.parseExpression=="function"?window.CronParser:window.cronParser&&typeof window.cronParser.parseExpression=="function"?window.cronParser:null}function ie(){const e=document.getElementById("cronBuilderPanel"),p=document.getElementById("cronOutputPanel");if(!e||!p){console.error("cronBuilderPanel or cronOutputPanel not found in DOM");return}e.innerHTML=oe(),p.innerHTML=ae(),setTimeout(re,0)}function oe(){return`
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
  `}function ae(){return`
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
  `}function re(){const e=ne("Cron Parser");function p(t,i,n,r){const s=e(t);if(s){if(s.innerHTML="",r){const o=document.createElement("option");o.value="*",o.textContent=r,s.appendChild(o)}for(let o=i;o<=n;o++){const l=document.createElement("option");l.value=String(o),l.textContent=String(o),s.appendChild(l)}}}function w(t){const i=e(t);if(!i)return;i.innerHTML="";const n=document.createElement("option");n.value="*",n.textContent="Every month *",i.appendChild(n);const r=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];for(let s=1;s<=12;s++){const o=document.createElement("option");o.value=String(s),o.textContent=`${s} (${r[s-1]})`,i.appendChild(o)}}function m(t,i){const n=e(t);if(!n)return;n.innerHTML="";{const s=document.createElement("option");s.value="?",s.textContent="No specific day ?",n.appendChild(s)}const r=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];for(let s=0;s<=6;s++){const o=document.createElement("option");o.value=String(s),o.textContent=`${s} (${r[s]})`,n.appendChild(o)}}p("simple-minute",0,59,"Every minute *"),p("simple-hour",0,23,"Every hour *"),p("simple-dom",1,31,"Every day *"),w("simple-month"),m("simple-dow");const N=e("tabs");N&&N.addEventListener("click",t=>{var r,s;const i=(s=(r=t.target).closest)==null?void 0:s.call(r,".tab");if(!i)return;[...N.children].forEach(o=>o.classList.remove("active")),i.classList.add("active");const n=i.dataset.tab;for(const o of["simple","advanced","special","parse"]){const l=e("tab-"+o);l&&l.classList.toggle("hidden",o!==n)}});const P=e("cronPresets");if(P){P.innerHTML="";const t=(i,n,r)=>{const s=document.createElement("div");s.className="chip",s.textContent=i,s.title=`${n}
${r||`Sets cron to: ${i.toLowerCase()}`}`,s.addEventListener("click",async()=>{g(s,!0),P.querySelectorAll(".chip").forEach(ee=>ee.classList.remove("active")),s.classList.add("active");const o=n.split(/\s+/),[l,a,c,d,u]=o,v=e("simple-minute"),x=e("simple-hour"),G=e("simple-dom"),U=e("simple-month"),q=e("simple-dow");v&&(v.value=l||"*"),x&&(x.value=a||"*"),G&&(G.value=c||"*"),U&&(U.value=d||"*"),q&&(q.value=u||"*");const F=e("cronOut");F&&(F.textContent=n,I(F));const D=e("explainText");D&&(D.textContent=r||`Runs ${i.toLowerCase()}.`,I(D));const Q=e("validBox"),X=e("validTitle"),_=e("validDetail");Q&&(Q.className="status ok"),X&&(X.innerHTML="<strong>✓ Preset applied</strong>"),_&&(_.textContent="Using predefined schedule pattern."),b(`Applied preset: ${i}`,"success"),setTimeout(()=>{g(s,!1),s.classList.remove("active")},1e3)}),P.appendChild(s)};t("Every 5 Minutes","*/5 * * * *","Runs every 5 minutes"),t("Every 15 Minutes","*/15 * * * *","Runs every 15 minutes"),t("Every 30 Minutes","*/30 * * * *","Runs every 30 minutes"),t("Hourly","0 * * * *","Runs at the top of every hour"),t("Daily at Midnight","0 0 * * *","Runs once a day at midnight"),t("Daily at 9 AM","0 9 * * *","Runs every day at 9:00 AM"),t("Weekdays at 9 AM","0 9 * * 1-5","Runs Monday through Friday at 9:00 AM"),t("Weekly (Sunday)","0 0 * * 0","Runs every Sunday at midnight"),t("Monthly (1st)","0 0 1 * *","Runs on the 1st day of every month at midnight"),t("Quarterly","0 0 1 */3 *","Runs every 3 months on the 1st day at midnight")}const L=e("simple-minute"),C=e("simple-hour"),E=e("simple-dom"),k=e("simple-month"),M=e("simple-dow");function h(t){const i=t.trim().split(/\s+/);if(i.length<5)return"Invalid cron expression.";let[n,r,s,o,l]=i;const a=[];if(n==="*"?a.push("every minute"):n.includes("/")?a.push(`every ${n.split("/")[1]} minutes`):n.includes(",")?a.push(`at minutes ${n}`):n.includes("-")?a.push(`from minute ${n.split("-")[0]} to ${n.split("-")[1]}`):a.push(`at minute ${n}`),r==="*")a.push("every hour");else if(r.includes("/"))a.push(`every ${r.split("/")[1]} hours`);else if(r.includes(","))a.push(`at hours ${r}`);else if(r.includes("-"))a.push(`from hour ${r.split("-")[0]} to ${r.split("-")[1]}`);else{const c=parseInt(r),d=c===0?12:c>12?c-12:c,u=c<12?"AM":"PM";a.push(`at ${d}:00 ${u} (${r}:00)`)}if(s==="*"?a.push("every day of the month"):s==="?"?a.push("no specific day of month"):s.includes("W")?a.push(`nearest weekday to the ${s.replace("W","")}th`):s.includes("L")?a.push("last day of the month"):s.includes(",")?a.push(`on days ${s} of the month`):s.includes("-")?a.push(`from day ${s.split("-")[0]} to ${s.split("-")[1]} of the month`):a.push(`on the ${s}${O(parseInt(s))} day of the month`),o==="*")a.push("every month");else if(o==="?")a.push("no specific month");else if(o.includes("/"))a.push(`every ${o.split("/")[1]} months`);else if(o.includes(",")){const c=o.split(",").map(d=>S(parseInt(d))).join(", ");a.push(`in ${c}`)}else if(o.includes("-")){const[c,d]=o.split("-");a.push(`from ${S(parseInt(c))} to ${S(parseInt(d))}`)}else a.push(`in ${S(parseInt(o))}`);if(l==="*")a.push("every day of the week");else if(l==="?")a.push("no specific day of week");else if(l.includes("#")){const[c,d]=l.split("#"),u=T(parseInt(c)),v=O(parseInt(d));a.push(`on the ${v} ${u} of the month`)}else if(l.includes("L")){const c=l.replace("L",""),d=T(parseInt(c));a.push(`on the last ${d} of the month`)}else if(l.includes(",")){const c=l.split(",").map(d=>T(parseInt(d))).join(", ");a.push(`on ${c}`)}else if(l.includes("-")){const[c,d]=l.split("-");a.push(`from ${T(parseInt(c))} to ${T(parseInt(d))}`)}else a.push(`on ${T(parseInt(l))}`);return`Runs ${a.join(", ")}.`}function O(t){const i=[11,12,13],n=t%10;return i.includes(t%100)?t+"th":n===1?t+"st":n===2?t+"nd":n===3?t+"rd":t+"th"}function S(t){return["","January","February","March","April","May","June","July","August","September","October","November","December"][t]||t}function T(t){return["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][t]||t}function Z(){const t=(L==null?void 0:L.value)??"*",i=(C==null?void 0:C.value)??"*",n=(E==null?void 0:E.value)??"*",r=(k==null?void 0:k.value)??"*",s=(M==null?void 0:M.value)??"*",o=`${t} ${i} ${n} ${r} ${s}`,l=e("cronOut");l&&(l.textContent=o);const a=e("explainText");a&&(a.innerHTML=h(o));const c=e("validBox");c&&(c.className="status ok");const d=e("validTitle");d&&(d.innerHTML="<strong>Looks good.</strong>");const u=e("validDetail");u&&(u.textContent="Expression structure is valid.")}[L,C,E,k,M].forEach(t=>t&&t.addEventListener("change",Z));const $=e("cronInfoBox");let B=null;function f(t,i="info"){$&&($.textContent=t,$.className="status "+(i==="warn"?"warn":i==="err"?"err":"ok"),$.style.display="flex",B&&clearTimeout(B),B=setTimeout(()=>{$.style.display="none"},12e4))}const y=e("btnCopy");y&&y.addEventListener("click",async()=>{var n;const t=e("cronOut"),i=((n=t==null?void 0:t.textContent)==null?void 0:n.trim())??"";if(!i||i==="* * * * *"){b("Please generate a cron expression first!","warning");return}try{g(y,!0),await navigator.clipboard.writeText(i),I(t),b("Cron expression copied to clipboard!","success");const r=y.textContent;y.textContent="✓ Copied!",y.style.background="var(--cron-success)",y.style.borderColor="var(--cron-success)",setTimeout(()=>{y.textContent=r,y.style.background="",y.style.borderColor=""},2e3)}catch(r){b("Failed to copy to clipboard","error"),console.error("Copy failed:",r)}finally{g(y,!1)}});const A=e("btnExplain");A&&A.addEventListener("click",async()=>{var r,s;const t=e("cronOut"),i=e("explainText");e("cronInfoBox");const n=(r=t==null?void 0:t.textContent)==null?void 0:r.trim();if(!n||n==="* * * * *"){b("Please generate a cron expression first!","warning");return}if(i)try{g(A,!0),g(i,!0),i.textContent="Generating explanation...",await new Promise(c=>setTimeout(c,300)),await K();let o,l="";const a=n.split(/\s+/);if(a.length>=5){const[c,d,u,v,x]=a;l=`
<div style="font-family: monospace; background: var(--cron-bg-secondary, #f8f9fa); padding: 12px; border-radius: 6px; margin: 8px 0;">
<strong>Breakdown:</strong><br/>
• <strong>Minutes:</strong> ${c==="*"?"Any minute (0-59)":c.includes("#")||c.includes("L")||c.includes("W")?c+" (special)":c}<br/>
• <strong>Hours:</strong> ${d==="*"?"Any hour (0-23)":d.includes("#")||d.includes("L")||d.includes("W")?d+" (special)":d+" ("+(parseInt(d)===0?"12 AM":parseInt(d)<=12?parseInt(d)+" AM":parseInt(d)-12+" PM")+")"}<br/>
• <strong>Day of Month:</strong> ${u==="*"?"Any day (1-31)":u==="?"?"No specific day":u.includes("W")?u+" (nearest weekday)":u.includes("L")?"Last day of month":u}<br/>
• <strong>Month:</strong> ${v==="*"?"Every month (1-12)":v==="?"?"No specific month":v}<br/>
• <strong>Day of Week:</strong> ${x==="*"?"Any day (0-6)":x==="?"?"No specific day":x.includes("#")?x+" (nth weekday)":x.includes("L")?x+" (last weekday)":x+" ("+T(parseInt(x))+")"}
</div>`}if((s=window.cronstrue)!=null&&s.toString)try{o=window.cronstrue.toString(n,{use24HourTimeFormat:!1,verbose:!0}),b("Expression explained successfully!","success")}catch(c){console.warn("cronstrue failed, using enhanced fallback:",c),o=h(n),b("Generated enhanced explanation","success")}else o=h(n),b("Generated enhanced explanation","success");i.innerHTML=o+l,n.includes("#")?f('This uses the # special character for "nth weekday of month" (e.g., 6#2 = second Friday)',"info"):n.includes("L")?f('This uses the L special character for "last" (e.g., L = last day of month, 5L = last Friday)',"info"):n.includes("W")&&f('This uses the W special character for "nearest weekday" (e.g., 15W = nearest weekday to 15th)',"info"),I(i)}catch(o){i.textContent="Failed to explain expression",b("Failed to explain expression","error"),console.error("Explain failed:",o)}finally{g(A,!1),g(i,!1)}});function H(t){const i=Y();if(!i)return null;try{return i.parseExpression(t,{iterator:!0}),null}catch(n){return(n==null?void 0:n.message)||"Invalid cron expression."}}const W=e("advanced-cron");W&&W.addEventListener("input",()=>{var l;const t=W.value.trim(),i=e("validBox");if(!i)return;const n=e("validTitle"),r=e("validDetail"),s=e("explainText");if(!t){i.className="status",n&&(n.innerHTML="<strong>—</strong>"),r&&(r.textContent="Enter a cron expression.");return}const o=H(t);if(o)i.className="status err",n&&(n.innerHTML="<strong>Error:</strong>"),r&&(r.textContent=o),s&&(s.innerHTML="");else{i.className="status ok",n&&(n.innerHTML="<strong>Looks good.</strong>"),r&&(r.textContent="Expression is valid.");let a="";if((l=window.cronstrue)!=null&&l.toString)try{a=window.cronstrue.toString(t,{use24HourTimeFormat:!1,verbose:!0})}catch{a=h(t)}else a=h(t);s&&(s.innerHTML=a)}});const j=e("btnAdvancedApply");j&&j.addEventListener("click",()=>{var c,d,u;const t=((d=(c=e("advanced-cron"))==null?void 0:c.value)==null?void 0:d.trim())||"";if(!t){f("Advanced expression input is empty.","warn");const v=e("validBox");v&&(v.className="status");return}const i=t.split(/\s+/);if(i.length<5||i.length>6){f("Invalid cron expression. Must have 5 or 6 fields.","err");return}/[#LW\?]/.test(t)||(L&&(L.value=i[0]),C&&(C.value=i[1]),E&&(E.value=i[2]),k&&(k.value=i[3]),M&&(M.value=i[4]));const n=e("cronOut");n&&(n.textContent=t);const r=e("explainText");if(r){let v="";if((u=window.cronstrue)!=null&&u.toString)try{v=window.cronstrue.toString(t,{use24HourTimeFormat:!1,verbose:!0})}catch{v=h(t)}else v=h(t);r.innerHTML=v}const s=H(t),o=e("validBox"),l=e("validTitle"),a=e("validDetail");s?(o&&(o.className="status err"),l&&(l.innerHTML="<strong>Error:</strong>"),a&&(a.textContent=s)):(o&&(o.className="status ok"),l&&(l.innerHTML="<strong>Looks good.</strong>"),a&&(a.textContent="Expression structure is valid."),t.includes("#")?f('Applied expression with # special character for "nth weekday of month"',"info"):t.includes("L")?f('Applied expression with L special character for "last"',"info"):t.includes("W")?f('Applied expression with W special character for "nearest weekday"',"info"):f("Advanced expression applied successfully","info"))});const V=e("btnSpecialApply");V&&V.addEventListener("click",()=>{var a,c,d;const t=((c=(a=e("special-cron"))==null?void 0:a.value)==null?void 0:c.trim())||"";if(!t){f("Special expression input is empty.","warn");const u=e("validBox");u&&(u.className="status");return}if(!/[WL\?#]/.test(t)){f("Special expression must contain W, L, ?, or #.","err");return}const i=e("cronOut");i&&(i.textContent=t);const n=e("explainText");if(n){let u="";if((d=window.cronstrue)!=null&&d.toString)try{u=window.cronstrue.toString(t,{use24HourTimeFormat:!1,verbose:!0})}catch{u=h(t)}else u=h(t);n.innerHTML=u}const r=H(t),s=e("validBox"),o=e("validTitle"),l=e("validDetail");r?(s&&(s.className="status err"),o&&(o.innerHTML="<strong>Error:</strong>"),l&&(l.textContent=r)):(s&&(s.className="status ok"),o&&(o.innerHTML="<strong>Looks good.</strong>"),l&&(l.textContent="Expression structure is valid."),f("Special expression applied successfully","info"))});const J=e("btnParse");J&&J.addEventListener("click",()=>{var a,c,d;const t=((c=(a=e("parse-cron"))==null?void 0:a.value)==null?void 0:c.trim())||"",i=e("parseValidBox"),n=e("parseValidTitle"),r=e("parseValidDetail"),s=e("parseExplainText");if(!t){i&&(i.className="status"),n&&(n.innerHTML="<strong>—</strong>"),r&&(r.textContent="Enter a cron expression."),s&&(s.textContent="—"),f("Input is empty. Please enter a cron expression.","warn");return}const o=H(t);if(o){i&&(i.className="status err"),n&&(n.innerHTML="<strong>Error:</strong>"),r&&(r.textContent=o),s&&(s.textContent="");return}if(i&&(i.className="status ok"),n&&(n.innerHTML="<strong>Looks good.</strong>"),r&&(r.textContent="Expression is valid."),s){let u="";if((d=window.cronstrue)!=null&&d.toString)try{u=window.cronstrue.toString(t,{use24HourTimeFormat:!1,verbose:!0})}catch{u=h(t)}else u=h(t);s.innerHTML=u}const l=Y();if(l)try{const v=l.parseExpression(t).next().toString();f("Next run: "+v,"info")}catch{}/^\* \* \* \* \*$/.test(t)&&f("Warning: This cron runs every minute. This can be risky!","warn"),t.includes("#")?f('This expression uses # for "nth weekday of month" (e.g., 6#2 = second Friday)',"info"):t.includes("L")?f('This expression uses L for "last" (e.g., L = last day, 5L = last Friday)',"info"):t.includes("W")&&f('This expression uses W for "nearest weekday" (e.g., 15W = nearest weekday to 15th)',"info")})}async function le(e){if(!e)return;const p=await fetch("cronParser.html").then(m=>m.text());e.innerHTML=p,await se(()=>ie(),["cronBuilderPanel","cronOutputPanel"])}async function ue(e){try{await te.loadCSS("cronParser.css","cronparser"),await K(),await le(e)}catch(p){console.error("Cron Parser load error:",p),e&&(e.innerHTML='<div class="error">Failed to load Cron Parser Tool</div>')}}export{ue as load};
