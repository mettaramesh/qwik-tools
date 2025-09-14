function f(l){l.innerHTML=`
        <div class="tool-header">
            <h2>Regex Tester</h2>
            <p>Test regular expressions with real-time matching</p>
        </div>
        <div class="tool-interface">
            <div class="tool-form-group">
                <label class="form-label">Regular Expression</label>
                <input type="text" id="regex-pattern" class="form-control text-mono" placeholder="Enter your regex pattern...">
            </div>
            <div class="tool-form-row">
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="flag-g" checked>
                        <label for="flag-g">Global (g)</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="flag-i">
                        <label for="flag-i">Ignore case (i)</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="flag-m">
                        <label for="flag-m">Multiline (m)</label>
                    </div>
                </div>
            </div>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Test String</label>
                    </div>
                    <textarea id="regex-test" class="form-control code-input" placeholder="Enter test string..." rows="8"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Matches</label>
                    </div>
                    <textarea id="regex-matches" class="form-control code-input" readonly rows="8"></textarea>
                </div>
            </div>
            <div id="regex-status" class="hidden"></div>
        </div>
    `}function p(){const l=document.getElementById("regex-pattern"),n=document.getElementById("regex-test"),d=document.getElementById("regex-matches"),o=document.getElementById("regex-status"),r=document.getElementById("flag-g"),g=document.getElementById("flag-i"),u=document.getElementById("flag-m");l.value="\\b\\w{4}\\b",n.value="This tool finds four word test cases like code, tool, and more.";const s=()=>{const h=l.value,m=n.value;if(!h){d.value="",o.classList.add("hidden");return}try{let a="";r.checked&&(a+="g"),g.checked&&(a+="i"),u.checked&&(a+="m");const v=new RegExp(h,a),i=[];if(r.checked){let e,t=0;for(;(e=v.exec(m))!==null&&t<100;){if(i.push(`Match ${t+1}: "${e[0]}" at position ${e.index}`),e.length>1)for(let c=1;c<e.length;c++)i.push(`  Group ${c}: "${e[c]}"`);t++}}else{const e=v.exec(m);if(e&&(i.push(`Match 1: "${e[0]}" at position ${e.index}`),e.length>1))for(let t=1;t<e.length;t++)i.push(`  Group ${t}: "${e[t]}"`)}d.value=i.join(`
`),o.classList.add("hidden")}catch(a){o.textContent=`Error: ${a.message}`,o.classList.remove("hidden"),d.value=""}};l.addEventListener("input",s),n.addEventListener("input",s),r.addEventListener("change",s),g.addEventListener("change",s),u.addEventListener("change",s),s()}function x(l,n){f(l)}export{x as load,f as loadRegexTester,p as setupRegexTester};
