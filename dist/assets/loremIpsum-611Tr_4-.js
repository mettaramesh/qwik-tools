import{e as g}from"./utils-D6OBsT8e.js";function b(e){e.innerHTML=`
        <div class="tool-header">
            <h2>Lorem Ipsum Generator</h2>
            <p>Generate Lorem Ipsum placeholder text</p>
        </div>
        <div class="tool-interface">
            <div class="tool-form-row">
                <div class="form-group">
                    <label class="form-label">Type</label>
                    <select id="lorem-type" class="form-control">
                        <option value="words">Words</option>
                        <option value="sentences">Sentences</option>
                        <option value="paragraphs" selected>Paragraphs</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Count</label>
                    <input type="number" id="lorem-count" class="form-control" value="3" min="1" max="50">
                </div>
                <div class="form-group">
                    <button class="btn btn--secondary" id="lorem-generate-btn">Generate</button>
                </div>
            </div>
            <div class="single-input-tool">
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Generated Text</label>
                        <button class="btn btn--sm copy-btn" data-target="lorem-output">Copy</button>
                    </div>
                    <textarea id="lorem-output" class="form-control" readonly rows="15"></textarea>
                </div>
            </div>
        </div>
    `}function M(){const e=["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim","ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate","velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum"],i=document.getElementById("lorem-type"),m=document.getElementById("lorem-count"),f=document.getElementById("lorem-output"),c=r=>{r&&(r.preventDefault(),r.stopPropagation());const o=i.value,h=parseInt(m.value);let n=[];for(let d=0;d<h;d++)if(o==="words")n.push(e[Math.floor(Math.random()*e.length)]);else if(o==="sentences"){const l=Math.floor(Math.random()*10)+5,t=[];for(let a=0;a<l;a++)t.push(e[Math.floor(Math.random()*e.length)]);t[0]=t[0].charAt(0).toUpperCase()+t[0].slice(1),n.push(t.join(" ")+".")}else if(o==="paragraphs"){const l=[],t=Math.floor(Math.random()*5)+3;for(let a=0;a<t;a++){const v=Math.floor(Math.random()*10)+5,s=[];for(let p=0;p<v;p++)s.push(e[Math.floor(Math.random()*e.length)]);s[0]=s[0].charAt(0).toUpperCase()+s[0].slice(1),l.push(s.join(" ")+".")}n.push(l.join(" "))}f.value=g(o==="paragraphs"?n.join(`

`):n.join(o==="words"?" ":`
`))},u=document.getElementById("lorem-generate-btn");u&&u.addEventListener("click",c),c(),typeof window.setupCopyButtons=="function"&&window.setupCopyButtons()}function w(e,i){b(e)}export{w as load,b as loadLoremIpsum,M as setupLoremIpsum};
