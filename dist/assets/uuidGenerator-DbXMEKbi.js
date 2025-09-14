import{e as a}from"./utils-D6OBsT8e.js";function m(o){o.innerHTML=`
        <div class="tool-header">
            <h2>UUID Generator</h2>
            <p>Generate UUID version 1 and version 4</p>
        </div>
        <div class="tool-interface">
            <div class="tool-controls">
                <button class="btn btn--secondary" id="uuid-generate-v4-btn">Generate UUID v4</button>
                <button class="btn btn--outline" id="uuid-generate-v1-btn">Generate UUID v1</button>
                <button class="btn btn--outline" id="uuid-generate-multiple-btn">Generate Multiple</button>
                <button class="btn btn--outline" id="uuid-clear-btn">Clear</button>
            </div>
            <div class="tool-form-group">
                <label class="form-label">Number of UUIDs</label>
                <input type="number" id="uuid-count" class="form-control" value="1" min="1" max="100">
            </div>
            <div class="single-input-tool">
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Generated UUIDs</label>
                        <button class="btn btn--sm copy-btn" data-target="uuid-output">Copy</button>
                    </div>
                    <textarea id="uuid-output" class="form-control code-input" readonly rows="10"></textarea>
                </div>
            </div>
        </div>
    `}function I(){const o=document.getElementById("uuid-output"),u=document.getElementById("uuid-count"),i=()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){const e=Math.random()*16|0;return(t=="x"?e:e&3|8).toString(16)}),p=()=>{const t=Date.now(),e=Math.random().toString(16).substring(2,15);return`${t.toString(16)}-xxxx-1xxx-yxxx-${e}`.replace(/[xy]/g,function(n){const x=Math.random()*16|0;return(n=="x"?x:x&3|8).toString(16)})},r=t=>{t&&(t.preventDefault(),t.stopPropagation());const e=[];for(let n=0;n<parseInt(u.value);n++)e.push(i());o.value=a(e.join(`
`))},v=t=>{t&&(t.preventDefault(),t.stopPropagation());const e=[];for(let n=0;n<parseInt(u.value);n++)e.push(p());o.value=a(e.join(`
`))},b=t=>{t&&(t.preventDefault(),t.stopPropagation());const e=[];for(let n=0;n<parseInt(u.value);n++)e.push(i());o.value=a(e.join(`
`))},s=document.getElementById("uuid-generate-v4-btn"),l=document.getElementById("uuid-generate-v1-btn"),c=document.getElementById("uuid-generate-multiple-btn"),d=document.getElementById("uuid-clear-btn");s&&s.addEventListener("click",r),l&&l.addEventListener("click",v),c&&c.addEventListener("click",b),d&&d.addEventListener("click",()=>{o.value=""}),r(),typeof window.setupCopyButtons=="function"&&window.setupCopyButtons()}function U(o,u){m(o)}export{U as load,m as loadUUIDGenerator,I as setupUUIDGenerator};
