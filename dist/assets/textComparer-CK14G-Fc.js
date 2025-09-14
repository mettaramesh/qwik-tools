function xe(d){d.innerHTML=`
    <style>
      :root{
        --bg:#f3f6fb; --panel:#fff; --muted:#6b7280; --accent:#2563eb; --border:#e6eef8; --mono:"Consolas","Courier New",monospace;
      }
      *{box-sizing:border-box}
      .tc-app{font-family: "Segoe UI", Roboto, Arial, sans-serif; background:var(--bg); padding:14px; border-radius:10px; color:#04203a}
      .tc-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
      .tc-title{font-size:20px;font-weight:700}
      .tc-sub{font-size:12px;color:var(--muted)}
      .tc-top{display:flex;gap:12px;align-items:center}
      .tc-controls{display:flex;gap:8px;align-items:center}
      .tc-btn{background:var(--panel);border:1px solid var(--border);padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px}
      .tc-btn.primary{background:linear-gradient(180deg,var(--accent),#1e40af);color:#fff;border:0}
      .tc-options{display:flex;gap:10px;align-items:center;color:var(--muted);font-size:13px;flex-wrap:wrap}
      .tc-search{padding:8px;border-radius:8px;border:1px solid var(--border);min-width:200px}
      .tc-main{display:flex;gap:12px;margin-top:12px;align-items:stretch;min-height:380px}
      .tc-editor-wrap{flex:1;display:flex;flex-direction:column;background:var(--panel);border-radius:10px;border:1px solid var(--border);overflow:hidden;min-width:260px}
      .panel-header{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid var(--border);font-weight:600}
      .panel-body{display:flex;flex:1;min-height:320px;overflow:hidden}
      .gutter{width:56px;background:#fbfdff;border-right:1px solid var(--border);padding:8px 6px;overflow:auto;display:flex;flex-direction:column;align-items:flex-end;font-family:var(--mono);font-size:13px;color:var(--muted);user-select:none}
      .gutter .ln{display:block;width:100%;text-align:right;padding-right:6px;box-sizing:border-box}
      .editor-area{flex:1;position:relative;display:flex;flex-direction:column;background:transparent;overflow:hidden}
      .editor-scroll{flex:1;display:flex;overflow:auto;align-items:flex-start}
      .editor-text{flex:1;border:none;outline:none;padding:10px;font-family:var(--mono);font-size:13px;line-height:1.45;resize:none;background:transparent;color:#0b1220;min-height:100%;min-width:100%}
      .splitter{width:12px;cursor:col-resize;display:flex;align-items:center;justify-content:center}
      .splitter .bar{width:4px;height:40%;background:#e2e8f0;border-radius:999px}
      .tc-result-wrap{margin-top:12px;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:10px;min-height:140px}
      .tc-result{font-family:var(--mono);font-size:13px;white-space:pre-wrap;color:#08203a;overflow:auto;max-height:320px}
      .diff-add{background:#d4fcbc;border-radius:3px;padding:0 2px}
      .diff-del{background:#fbd6dc;text-decoration:line-through;border-radius:3px;padding:0 2px}
      .diff-chg{background:#fff4ce;border-radius:3px;padding:0 2px}
      .tc-status{display:flex;justify-content:space-between;margin-top:10px;color:var(--muted);font-size:13px}
      .hidden { display:none !important; }
      @media(max-width:920px){ .tc-main{flex-direction:column}.splitter{display:none} .gutter{width:48px} }
    </style>

    <div class="tc-app" role="application" aria-label="Text Comparer">
      <div class="tc-header">
        <div>
          <div class="tc-title">Text Comparer</div>
          <div class="tc-sub">Local, fast, structured-aware diffs for JSON / XML / CSV / plain text</div>
        </div>
        <div class="tc-top">
          <div class="tc-options">
            <label><input type="checkbox" id="tc-word-level"> Word-level</label>
            <label><input type="checkbox" id="tc-ignore-ws"> Ignore whitespace</label>
            <label><input type="checkbox" id="tc-ignore-case"> Ignore case</label>
            <label><input type="checkbox" id="tc-show-lines" checked> Show lines</label>
          </div>
          <input id="tc-search" class="tc-search" placeholder="Search..." aria-label="Search diff" />
          <button id="tc-search-prev" class="tc-btn" title="Previous match">&#8593;</button>
          <button id="tc-search-next" class="tc-btn" title="Next match">&#8595;</button>
          <div class="tc-controls">
            <button id="tc-compare" class="tc-btn primary" title="Compare (Ctrl/Cmd+B)">Compare</button>
            <button id="tc-clear" class="tc-btn" title="Clear editors">Clear</button>
            <button id="tc-copy" class="tc-btn" title="Copy result">Copy Output</button>
          </div>
        </div>
      </div>

      <div class="tc-main" id="tc-main">
        <div class="tc-editor-wrap" id="left-wrap">
          <div class="panel-header">Original <div style="font-weight:400;font-size:12px;color:var(--muted)">Paste / Type</div></div>
          <div class="panel-body">
            <div class="gutter" id="gutter-left" aria-hidden="true"></div>
            <div class="editor-area">
              <div class="editor-scroll"><textarea id="tc-text1" class="editor-text" spellcheck="false" placeholder="Paste or type left text..."></textarea></div>
            </div>
          </div>
        </div>

        <div class="splitter" id="splitter" role="separator" aria-orientation="vertical"><div class="bar"></div></div>

        <div class="tc-editor-wrap" id="right-wrap">
          <div class="panel-header">Modified <div style="font-weight:400;font-size:12px;color:var(--muted)">Paste / Type</div></div>
          <div class="panel-body">
            <div class="gutter" id="gutter-right" aria-hidden="true"></div>
            <div class="editor-area">
              <div class="editor-scroll"><textarea id="tc-text2" class="editor-text" spellcheck="false" placeholder="Paste or type right text..."></textarea></div>
            </div>
          </div>
        </div>
      </div>

      <div class="tc-result-wrap" aria-live="polite">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-weight:700">Comparison Result</div>
          <div id="tc-result-meta" style="font-size:13px;color:var(--muted)"></div>
        </div>
        <div id="tc-result" class="tc-result" role="region"></div>
      </div>

      <div class="tc-status">
        <div id="tc-status">Ready</div>
        <div id="tc-similarity"></div>
      </div>
    </div>
  `;const p=d.querySelector("#tc-text1"),f=d.querySelector("#tc-text2"),g=d.querySelector("#gutter-left"),m=d.querySelector("#gutter-right"),re=d.querySelector("#tc-compare"),ie=d.querySelector("#tc-clear"),le=d.querySelector("#tc-copy"),b=d.querySelector("#tc-result"),F=d.querySelector("#tc-status"),M=d.querySelector("#tc-similarity"),ne=d.querySelector("#tc-result-meta"),A=d.querySelector("#tc-search"),oe=d.querySelector("#tc-search-prev"),se=d.querySelector("#tc-search-next"),I=d.querySelector("#tc-word-level"),P=d.querySelector("#tc-ignore-ws"),B=d.querySelector("#tc-ignore-case"),D=d.querySelector("#tc-show-lines"),W=d.querySelector("#splitter"),ae=d.querySelector("#tc-main"),X=d.querySelector("#left-wrap"),ce=d.querySelector("#right-wrap");function v(r,t=!0){F.textContent=r,F.style.color=t?"var(--muted)":"var(--danger)"}function H(r){ne.textContent=r||""}function h(r){return String(r).replace(/[&<>]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[t])}function de(r){return String(r).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function q(r){const t=window.getComputedStyle(r);let e=parseFloat(t.lineHeight);if(isNaN(e)||t.lineHeight==="normal"){const i=parseFloat(t.fontSize)||13;e=Math.round(i*1.45)}return Math.round(e)}function J(r,t,e){const i=r.children.length;if(i>t)for(let n=i-1;n>=t;n--)r.removeChild(r.children[n]);else if(i<t){const n=document.createDocumentFragment();for(let o=i;o<t;o++){const l=document.createElement("div");l.className="ln",n.appendChild(l)}r.appendChild(n)}for(let n=0;n<t;n++){const o=r.children[n],l=String(n+1);o.textContent!==l&&(o.textContent=l),o.style.height=e+"px",o.style.lineHeight=e+"px"}}function S(){const r=Math.max(1,p.value.split(`
`).length),t=Math.max(1,f.value.split(`
`).length),e=q(p),i=q(f);J(g,r,e),J(m,t,i),D.checked?(g.classList.remove("hidden"),m.classList.remove("hidden")):(g.classList.add("hidden"),m.classList.add("hidden"))}function V(r,t){if(t<=0)return 0;let e=0;for(let i=0;i<t;i++){const n=r.indexOf(`
`,e);if(n===-1){e=r.length;break}e=n+1}return e}function G(r,t){return t.wordLevel?r.split(/(\s+|\b)/).map(e=>e===void 0?"":e):r.split("")}function K(r,t){let e=String(r);return t.ignoreWs&&(e=e.replace(/\s+/g,"")),t.ignoreCase&&(e=e.toLowerCase()),e}function pe(r,t,e){const i=r.length,n=t.length,o=Array(i+1).fill(null).map(()=>Array(n+1).fill(0));for(let l=i-1;l>=0;l--)for(let s=n-1;s>=0;s--)o[l][s]=e(r[l],t[s])?1+o[l+1][s+1]:Math.max(o[l+1][s],o[l][s+1]);return o}function U(r,t,e){const i=G(r,e),n=G(t,e),o=(u,y)=>K(u,e)===K(y,e),l=pe(i,n,o);let s=0,c=0,a="";for(;s<i.length||c<n.length;)s<i.length&&c<n.length&&o(i[s],n[c])?(a+=h(String(n[c])),s++,c++):c<n.length&&(s===i.length||l[s][c+1]>=l[s+1][c])?(a+=`<span class="diff-add">${h(String(n[c]))}</span>`,c++):s<i.length&&(c===n.length||l[s][c+1]<l[s+1][c])?(a+=`<span class="diff-del">${h(String(i[s]))}</span>`,s++):(s<i.length&&(a+=`<span class="diff-del">${h(String(i[s]))}</span>`,s++),c<n.length&&(a+=`<span class="diff-add">${h(String(n[c]))}</span>`,c++));return a}function Q(r){if(!r||!r.trim())return null;const t=r.trim();if(t.startsWith("{")&&t.endsWith("}")||t.startsWith("[")&&t.endsWith("]"))try{return JSON.stringify(JSON.parse(t),null,2)}catch{}if(t.startsWith("<"))try{const i=new DOMParser().parseFromString(t,"application/xml");if(!i.querySelector("parsererror"))return fe(i)}catch{}return null}function fe(r){function t(e,i=""){if(e.nodeType===3){const c=e.nodeValue.trim();return c?i+h(c)+`
`:""}if(e.nodeType===8)return i+"<!--"+h(e.nodeValue)+`-->
`;if(e.nodeType!==1)return"";const n=e.nodeName;let o="";if(e.attributes&&e.attributes.length)for(let c=0;c<e.attributes.length;c++){const a=e.attributes[c];o+=` ${a.name}="${h(a.value)}"`}const l=Array.from(e.childNodes||[]);if(!l.length)return i+`<${n}${o}/>
`;const s=l.map(c=>t(c,i+"  ")).join("");return i+`<${n}${o}>
`+s+i+`</${n}>
`}return Array.from(r.childNodes).map(e=>t(e,"")).join("")}function ue(r,t,e){const i=r.length,n=t.length;if(i===0||n===0)return{dp:[],n:i,m:n};const o=Array(i+1).fill(null).map(()=>Array(n+1).fill(0));for(let l=i-1;l>=0;l--)for(let s=n-1;s>=0;s--)o[l][s]=e(r[l],t[s])?1+o[l+1][s+1]:Math.max(o[l+1][s],o[l][s+1]);return{dp:o,n:i,m:n}}function he(r,t,e={}){const i=Q(r)||r,n=Q(t)||t,o=i.split(`
`),l=n.split(`
`),s=(k,O)=>{if(!e.ignoreWs&&!e.ignoreCase)return k===O;const ee=e.ignoreWs?k.replace(/\s+/g,""):k,te=e.ignoreWs?O.replace(/\s+/g,""):O;return e.ignoreCase?ee.toLowerCase()===te.toLowerCase():ee===te},{dp:c}=ue(o,l,s);let a=0,u=0,y="";for(;a<o.length||u<l.length;)if(a<o.length&&u<l.length&&s(o[a],l[u]))y+=`<div class="diff-line">${h(o[a])}</div>`,a++,u++;else if(u<l.length&&(a===o.length||c[a][u+1]>=c[a+1][u]))if(e.wordLevel&&a<o.length){const k=U(o[a],l[u],e);y+=`<div class="diff-line">${k}</div>`,a++,u++}else y+=`<div class="diff-line"><span class="diff-add">${h(l[u])}</span></div>`,u++;else if(a<o.length&&(u===l.length||c[a][u+1]<c[a+1][u]))if(e.wordLevel&&u<l.length){const k=U(o[a],l[u],e);y+=`<div class="diff-line">${k}</div>`,a++,u++}else y+=`<div class="diff-line"><span class="diff-del">${h(o[a])}</span></div>`,a++;else a<o.length&&(y+=`<div class="diff-line"><span class="diff-del">${h(o[a])}</span></div>`,a++),u<l.length&&(y+=`<div class="diff-line"><span class="diff-add">${h(l[u])}</span></div>`,u++);return{html:y,leftFormatted:i,rightFormatted:n}}function ge(r,t){const e=r.replace(/\s+/g,""),i=t.replace(/\s+/g,"");if(!e&&!i)return 100;const n=Math.min(e.length,i.length);let o=0;for(let l=0;l<n;l++)e[l]===i[l]&&o++;return Math.round(o/Math.max(e.length,i.length)*100)}let $=null,j=!1;function L(r=140){$&&clearTimeout($),$=setTimeout(()=>{j||(j=!0,requestAnimationFrame(()=>{E(),j=!1})),$=null},r)}let w=null,Y=0,R=null;function me(){try{const r=new Worker("diff.worker.js");return v("Worker enabled"),r}catch{return v("Worker unavailable, using main thread",!1),null}}function Z(){if(w){try{w.terminate()}catch{}w=null}}function ve(r,t,e,i,n){if(w||(w=me()),!w){n&&n("Worker unavailable");return}Y++;const o=Y;w.postMessage({id:o,type:"compute",left:r,right:t,opts:e}),R=setTimeout(()=>{Z(),v("Worker timeout, using main thread",!1),n&&n("Worker timeout")},6e3),w.onmessage=l=>{!l.data||l.data.id!==o||(clearTimeout(R),l.data.type==="done"?i&&i(l.data.html,l.data.similarity,l.data.meta):l.data.type==="error"&&n&&n(l.data.message))},w.onerror=l=>{clearTimeout(R),Z(),v("Worker error, using main thread",!1),n&&n("Worker error")}}function E(r=!1){v("Computing diff...");const t=p.value,e=f.value,i={wordLevel:I.checked,ignoreWs:P.checked,ignoreCase:B.checked};ve(t,e,i,(n,o,l)=>{b.innerHTML=n||'<div style="color:var(--muted)">No differences</div>',M.textContent=o?`Similarity: ${o}%`:"",H(l||""),v("Ready (worker)"),z()},n=>{const{html:o}=he(t,e,i);b.innerHTML=o||'<div style="color:var(--muted)">No differences</div>',M.textContent=`Similarity: ${ge(t,e)}%`,H(""),v("Ready (main thread)",!1),z()})}[I,P,B,D].forEach(r=>{r.addEventListener("change",()=>{S(),L(60)})}),re.addEventListener("click",()=>E(!0)),A.addEventListener("input",()=>L(80)),le.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(b.innerText||""),v("Result copied to clipboard")}catch{v("Copy failed",!1)}}),ie.addEventListener("click",()=>{p.value="",f.value="",b.innerHTML="",S(),v("Cleared"),M.textContent="",H(""),z()}),[p,f].forEach(r=>{r.addEventListener("input",()=>{S(),L()}),r.addEventListener("paste",()=>{setTimeout(()=>{S(),L()},20)}),r.addEventListener("keydown",t=>{(navigator.platform.toLowerCase().includes("mac")?t.metaKey:t.ctrlKey)&&t.key.toLowerCase()==="b"&&(t.preventDefault(),E())})}),!p.value&&!f.value?(p.value=`The quick brown fox
jumps over the lazy dog.
This is the left file.
It has several lines.
Some lines will be changed.`,f.value=`The quick brown fox
jumps over the lazy dog!
This is the right file.
It has several lines.
Some lines will be added.
And some will be removed.`,S(),L(20)):(S(),L(20)),function(){let t=0,e=0;W.addEventListener("pointerdown",i=>{i.preventDefault(),t=i.clientX,e=X.getBoundingClientRect().width,W.setPointerCapture(i.pointerId);function n(l){const s=l.clientX-t,c=ae.clientWidth;let a=Math.max(200,Math.min(c-200,e+s));X.style.flex=`0 0 ${a}px`,ce.style.flex=`0 0 ${Math.max(200,c-a-W.offsetWidth)}px`}function o(l){W.releasePointerCapture(l.pointerId),document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",o)}document.addEventListener("pointermove",n),document.addEventListener("pointerup",o)})}();function _(){p.addEventListener("scroll",()=>{g.scrollTop=p.scrollTop,Math.abs(f.scrollTop-p.scrollTop)>1&&(f.scrollTop=p.scrollTop),m.scrollTop=p.scrollTop},{passive:!0}),f.addEventListener("scroll",()=>{m.scrollTop=f.scrollTop,Math.abs(p.scrollTop-f.scrollTop)>1&&(p.scrollTop=f.scrollTop),g.scrollTop=f.scrollTop},{passive:!0}),g.addEventListener("click",r=>{const t=r.target.closest(".ln");if(!t)return;const e=Array.prototype.indexOf.call(g.children,t);C(p,e)}),m.addEventListener("click",r=>{const t=r.target.closest(".ln");if(!t)return;const e=Array.prototype.indexOf.call(m.children,t);C(f,e)})}_();function C(r,t){const e=V(r.value,t);r.focus(),r.setSelectionRange(e,e);const i=q(r);r.scrollTop=Math.max(0,t*i-r.clientHeight/2)}d.textComparer={update:E,getResultHtml:()=>b.innerHTML,getSimilarity:()=>M.textContent},v("Ready — checkboxes now applied to diff");let x=[],T=0;function z(){const r=(A.value||"").trim();let t=b.innerHTML;if(!r){b.innerHTML=t.replace(/<span class="diff-chg">(.*?)<\/span>/g,"$1"),x=[],T=0;return}t=t.replace(/<span class="diff-chg">(.*?)<\/span>/g,"$1");const e=new RegExp(de(r),"gi");let i=0;t=t.replace(e,n=>(i++,`<span class="diff-chg" data-match-idx="${i-1}">${h(n)}</span>`)),b.innerHTML=t,x=Array.from(b.querySelectorAll(".diff-chg")),T=0,N()}function N(){if(!x.length)return;x.forEach((t,e)=>{t.style.outline=e===T?"2px solid #2563eb":"",t.style.background=e===T?"#fff4ce":""});const r=x[T];r&&r.scrollIntoView({behavior:"smooth",block:"center"})}A.addEventListener("input",()=>{z()}),oe.addEventListener("click",()=>{x.length&&(T=(T-1+x.length)%x.length,N())}),se.addEventListener("click",()=>{x.length&&(T=(T+1)%x.length,N())})}export{xe as load};
