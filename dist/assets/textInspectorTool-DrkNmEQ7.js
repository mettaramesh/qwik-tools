function i(t){const n=t.split(/\r?\n/),e=t.match(/\b\w+\b/g)||[],s=t.length,a=new TextEncoder().encode(t).length,o=(t.match(/[^\x00-\x7F]/g)||[]).length,l=(t.match(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g)||[]).length,c=t.split(/\n{2,}/).filter(r=>r.trim()).length;return{lines:n.length,words:e.length,chars:s,bytes:a,multibyte:o,sentences:l,paragraphs:c}}function u(t){return t.toUpperCase()}function b(t){return t.toLowerCase()}function d(t){return t.replace(/\w\S*/g,n=>n.charAt(0).toUpperCase()+n.substr(1).toLowerCase())}function p(t){return t.replace(/[-_\s]+(.)?/g,(n,e)=>e?e.toUpperCase():"").replace(/^(.)/,(n,e)=>e.toLowerCase())}function m(t){return t.replace(/([a-z])([A-Z])/g,"$1_$2").replace(/\s+/g,"_").replace(/-+/g,"_").toLowerCase()}function v(t){return t.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/\s+/g,"-").replace(/_+/g,"-").toLowerCase()}function g(t){return t.replace(/[-_\s]+(.)?/g,(n,e)=>e?e.toUpperCase():"").replace(/^(.)/,(n,e)=>e.toUpperCase())}function y(t){return t.split(/\s+/).reverse().join(" ")}function C(t){return t.split(/\r?\n/).sort().join(`
`)}function h(t){return t.split(/\r?\n/).sort().reverse().join(`
`)}function f(t){return t.replace(/(^|[.!?]\s+)([a-z])/g,(n,e,s)=>e+s.toUpperCase())}function k(t){return t.trim()}function E(t){return t.replace(/\n{2,}/g,`
`)}function I(t){return t.normalize("NFD").replace(new RegExp("\\p{Diacritic}","gu"),"")}function w(t){t.innerHTML=`
        <div class="tool-header">
            <h2>Text Inspector & Case Converter</h2>
            <p>Analyze and transform your text with various tools</p>
        </div>
        <div class="tool-interface">
            <div class="button-row">
                <button class="btn btn--secondary" id="to-upper">UPPER CASE</button>
                <button class="btn btn--outline" id="to-lower">lower case</button>
                <button class="btn btn--outline" id="to-title">Title Case</button>
                <button class="btn btn--outline" id="to-camel">camelCase</button>
                <button class="btn btn--outline" id="to-pascal">PascalCase</button>
                <button class="btn btn--outline" id="to-snake">snake_case</button>
                <button class="btn btn--outline" id="to-kebab">kebab-case</button>
                <button class="btn btn--outline" id="reverse-words">Reverse Words</button>
                <button class="btn btn--outline" id="sort-asc">Sort Lines ↑</button>
                <button class="btn btn--outline" id="sort-desc">Sort Lines ↓</button>
                <button class="btn btn--outline" id="to-sentence">Sentence case</button>
                <button class="btn btn--outline" id="trim-whitespace">Trim Whitespace</button>
                <button class="btn btn--outline" id="collapse-blank">Collapse Blank Lines</button>
                <button class="btn btn--outline" id="remove-diacritics">Remove Diacritics</button>
                <button class="btn btn--outline" id="clear-btn">Clear</button>
            </div>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Input</label>
                        <button class="btn btn--sm copy-btn" data-target="text-inspector-input">Copy</button>
                    </div>
                    <textarea id="text-inspector-input" class="form-control code-input" placeholder="Paste or type text here..." rows="10"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Output</label>
                        <button class="btn btn--sm copy-btn" data-target="text-inspector-output">Copy</button>
                    </div>
                    <textarea id="text-inspector-output" class="form-control code-input" readonly rows="10"></textarea>
                </div>
            </div>
            <div id="text-inspector-stats" class="stats-box"></div>
        </div>
    `,setTimeout(()=>{const n=document.getElementById("text-inspector-input"),e=document.getElementById("text-inspector-output"),s=document.getElementById("text-inspector-stats");function a(){const o=i(n.value);s.innerHTML=`Lines: <b>${o.lines}</b> | Words: <b>${o.words}</b> | Chars: <b>${o.chars}</b> | Bytes: <b>${o.bytes}</b> | Multibyte: <b>${o.multibyte}</b> | Sentences: <b>${o.sentences}</b> | Paragraphs: <b>${o.paragraphs}</b>`}n.addEventListener("input",a),a(),document.getElementById("to-upper").onclick=()=>{e.value=u(n.value)},document.getElementById("to-lower").onclick=()=>{e.value=b(n.value)},document.getElementById("to-title").onclick=()=>{e.value=d(n.value)},document.getElementById("to-camel").onclick=()=>{e.value=p(n.value)},document.getElementById("to-pascal").onclick=()=>{e.value=g(n.value)},document.getElementById("to-snake").onclick=()=>{e.value=m(n.value)},document.getElementById("to-kebab").onclick=()=>{e.value=v(n.value)},document.getElementById("reverse-words").onclick=()=>{e.value=y(n.value)},document.getElementById("sort-asc").onclick=()=>{e.value=C(n.value)},document.getElementById("sort-desc").onclick=()=>{e.value=h(n.value)},document.getElementById("to-sentence").onclick=()=>{e.value=f(n.value)},document.getElementById("trim-whitespace").onclick=()=>{e.value=k(n.value)},document.getElementById("collapse-blank").onclick=()=>{e.value=E(n.value)},document.getElementById("remove-diacritics").onclick=()=>{e.value=I(n.value)},document.getElementById("clear-btn").onclick=()=>{n.value="",e.value="",a()},document.querySelectorAll(".copy-btn").forEach(o=>{o.onclick=function(){const l=o.getAttribute("data-target"),c=document.getElementById(l);c&&navigator.clipboard.writeText(c.value).then(()=>{const r=o.textContent;o.textContent="Copied!",setTimeout(()=>{o.textContent=r},1e3)})}})},0)}function B(t,n){w(t)}export{B as load,w as loadTextInspectorTool};
