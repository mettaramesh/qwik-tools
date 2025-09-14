function y(n){n.innerHTML=`
        <div class="tool-header">
            <h2>Hex ↔ ASCII Converter</h2>
            <p class="small">Convert between ASCII text and hexadecimal representation. Non-ASCII bytes will be shown as "." in ASCII output.</p>
        </div>
        <div class="grid-hexascii">
            <div class="card">
                <h3>ASCII Input</h3>
                <textarea id="asciiInput" rows="7" placeholder="Type or paste ASCII text here..."></textarea>
                <div class="row">
                    <button class="btn btn--primary" id="btnToHex">ASCII → Hex</button>
                    <button class="btn btn--outline" id="btnClearAscii">Clear</button>
                    <button class="btn btn--outline" id="btnCopyHex">Copy Hex</button>
                </div>
                <div class="metrics" id="asciiMetrics"></div>
            </div>
            <div class="card">
                <h3>Hex Input</h3>
                <textarea id="hexInput" rows="7" placeholder="Type or paste hex codes here (e.g. 48656c6c6f)..."></textarea>
                <div class="row">
                    <button class="btn btn--primary" id="btnToAscii">Hex → ASCII</button>
                    <button class="btn btn--outline" id="btnClearHex">Clear</button>
                    <button class="btn btn--outline" id="btnCopyAscii">Copy ASCII</button>
                </div>
                <div class="metrics" id="hexMetrics"></div>
            </div>
        </div>
        <div class="row" style="margin-top:18px;justify-content:center">
            <button class="btn btn--outline" id="btnSwap">Swap ⮂</button>
        </div>
    `,g()}function g(){const n=t=>document.getElementById(t),i=n("asciiInput"),c=n("hexInput"),u=n("btnToHex"),b=n("btnToAscii"),p=n("btnClearAscii"),v=n("btnClearHex"),h=n("btnCopyHex"),x=n("btnCopyAscii"),C=n("btnSwap"),r=n("asciiMetrics"),l=n("hexMetrics");function I(t){return Array.from(t).map(e=>e.charCodeAt(0).toString(16).padStart(2,"0")).join("")}function m(t){if(t=t.replace(/[^0-9a-fA-F]/g,""),t.length%2!==0)throw new Error("Hex length must be even.");let e="";for(let a=0;a<t.length;a+=2){const s=parseInt(t.slice(a,a+2),16);e+=s>=32&&s<=126?String.fromCharCode(s):"."}return e}function o(t,{textLen:e=null,byteLen:a=null,status:s=null}){t.innerHTML="",e!=null&&d(t,`Chars: ${e}`),a!=null&&d(t,`Bytes: ${a}`),s&&d(t,s.msg,s.ok?"ok":"bad")}function d(t,e,a=""){const s=document.createElement("span");s.className="pill "+(a||""),s.textContent=e,t.appendChild(s)}u.addEventListener("click",()=>{const t=i.value,e=I(t);c.value=e,o(r,{textLen:t.length,byteLen:t.length,status:{ok:!0,msg:"Converted to hex"}}),o(l,{textLen:null,byteLen:e.length/2,status:{ok:!0,msg:"Hex output"}})}),b.addEventListener("click",()=>{try{const t=c.value,e=m(t);i.value=e,o(l,{textLen:null,byteLen:t.replace(/[^0-9a-fA-F]/g,"").length/2,status:{ok:!0,msg:"Converted to ASCII"}}),o(r,{textLen:e.length,byteLen:e.length,status:{ok:!0,msg:"ASCII output"}})}catch(t){o(l,{status:{ok:!1,msg:t.message}})}}),p.addEventListener("click",()=>{i.value="",r.innerHTML=""}),v.addEventListener("click",()=>{c.value="",l.innerHTML=""}),h.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(c.value),o(l,{status:{ok:!0,msg:"Copied to clipboard"}})}catch{alert("Clipboard copy failed.")}}),x.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(i.value),o(r,{status:{ok:!0,msg:"Copied to clipboard"}})}catch{alert("Clipboard copy failed.")}}),C.addEventListener("click",()=>{const t=i.value;i.value=c.value,c.value=t})}function A(n){if(!document.getElementById("hexascii-css-link")){const i=document.createElement("link");i.id="hexascii-css-link",i.rel="stylesheet",i.href="hexAsciiConverter.css",document.head.appendChild(i)}y(n)}export{A as load,y as loadHexAsciiConverter};
