import{m as F,i as v,b as f,c as x}from"./index-CbjeHrnI.js";import{c as V}from"./cssLoader-DTPWrGuQ.js";async function K(N,J){if(!N)return;N.innerHTML="";try{await V.loadCSS("vlsmCalculator.css","vlsm-calculator"),await V.loadCSS("ui-components.css","vlsm-calculator-ui")}catch(i){console.warn("Failed to load CSS:",i)}const e=document.createElement("div");e.id="vlsm-calculator-tool",e.className="tool-container",fetch("vlsmCalculator.html").then(i=>i.text()).then(i=>{e.innerHTML=i,N.appendChild(e);const p=e.querySelector("#vlsm-calc-btn");p&&p.addEventListener("click",()=>{const H=e.querySelector("#vlsm-base-ip").value.trim(),u=e.querySelector("#vlsm-base-mask").value.trim(),b=e.querySelector("#vlsm-hosts").value.trim(),L=e.querySelector("#vlsm-progress"),l=e.querySelector("#vlsm-feedback"),M=e.querySelector("#vlsm-results"),n=e.querySelector("#vlsm-error"),a=e.querySelector("#vlsm-results-table tbody");L.classList.remove("hidden"),l.classList.add("hidden"),l.textContent="",M.classList.add("hidden"),n.classList.add("hidden"),n.textContent="",a.innerHTML="",setTimeout(()=>{if(!/^[\d]{1,3}(\.[\d]{1,3}){3}$/.test(H))return d("Invalid base network address.");let r=null,S=null;if(/^\/(\d{1,2})$/.test(u)){if(r=parseInt(u.replace("/",""),10),r<0||r>32)return d("Invalid base CIDR.");S=x(r)}else if(/^[\d]{1,3}(\.[\d]{1,3}){3}$/.test(u)){if(S=u,r=F(S),r===null)return d("Invalid base subnet mask.")}else return d("Enter base subnet mask (e.g. 255.255.255.0) or CIDR (e.g. /24).");const $=b.split(",").map(s=>parseInt(s.trim(),10)).filter(s=>!isNaN(s)&&s>0);if(!$.length)return d("Enter at least one valid host count.");const E=$.slice().sort((s,o)=>o-s);let q=v(H);const B=v(S),T=(q&B)+Math.pow(2,32-r)-1,y=Math.pow(2,32-r)-2,D=["#007bff","#28a745","#ffc107","#dc3545","#6f42c1","#fd7e14","#20c997","#6610f2"],t=E.map((s,o)=>{let m=Math.ceil(Math.log2(s+2));m>32-r&&(m=32-r);let c=32-m,k=Math.pow(2,32-c)-2;c===31&&(k=2),c===32&&(k=1);const h=x(c),C=v(h),w=q&C,g=w|~C>>>0,A=c===32?w:w+1,W=c===32?w:g-1;q=g+1;const j=(k/y*100).toFixed(2),z=D[o%D.length];return{subnet:o+1,network:f(w),mask:h,cidr:"/"+c,firstHost:f(A),lastHost:f(W),broadcast:f(g),usableHosts:k,visualWidth:j,barColor:z}});if(v(t[t.length-1].broadcast)>T)return d("Not enough address space in base network for all subnets.");a.innerHTML=t.map(s=>`
              <tr>
                <td>${s.subnet}</td>
                <td>${s.network}</td>
                <td>${s.mask}</td>
                <td>${s.cidr}</td>
                <td>${s.firstHost}</td>
                <td>${s.lastHost}</td>
                <td>${s.broadcast}</td>
                <td>${s.usableHosts}</td>
                <td>
                  <div class="vlsm-bar" data-bar-color="${s.barColor}" data-bar-width="${s.visualWidth}" title="Subnet ${s.subnet}: ${s.network} ${s.cidr}, ${s.usableHosts} usable hosts"></div>
                </td>
              </tr>
            `).join(""),M.classList.remove("hidden"),l.textContent="VLSM calculation complete!",l.classList.remove("hidden"),L.classList.add("hidden")},100);function d(r){L.classList.add("hidden"),n.textContent=r,n.classList.remove("hidden"),l.textContent="Please check your input and try again.",l.classList.remove("hidden")}})});const R=e.querySelector("#vlsm-calc-btn");R&&R.addEventListener("click",()=>{const i=e.querySelector("#vlsm-base-ip").value.trim(),p=e.querySelector("#vlsm-base-mask").value.trim(),H=e.querySelector("#vlsm-hosts").value.trim(),u=e.querySelector("#vlsm-progress"),b=e.querySelector("#vlsm-feedback"),L=e.querySelector("#vlsm-results"),l=e.querySelector("#vlsm-error"),M=e.querySelector("#vlsm-results-table tbody");u.classList.remove("hidden"),b.classList.add("hidden"),b.textContent="",L.classList.add("hidden"),l.classList.add("hidden"),l.textContent="",M.innerHTML="",setTimeout(()=>{if(!/^[\d]{1,3}(\.[\d]{1,3}){3}$/.test(i))return n("Invalid base network address.");let a=null,d=null;if(/^\/(\d{1,2})$/.test(p)){if(a=parseInt(p.replace("/",""),10),a<0||a>32)return n("Invalid base CIDR.");d=x(a)}else if(/^[\d]{1,3}(\.[\d]{1,3}){3}$/.test(p)){if(d=p,a=F(d),a===null)return n("Invalid base subnet mask.")}else return n("Enter base subnet mask (e.g. 255.255.255.0) or CIDR (e.g. /24).");const r=H.split(",").map(t=>parseInt(t.trim(),10)).filter(t=>!isNaN(t)&&t>0);if(!r.length)return n("Enter at least one valid host count.");const S=r.slice().sort((t,I)=>I-t);let $=v(i);const E=v(d),B=($&E)+Math.pow(2,32-a)-1,P=Math.pow(2,32-a)-2,T=["#007bff","#28a745","#ffc107","#dc3545","#6f42c1","#fd7e14","#20c997","#6610f2"],y=S.map((t,I)=>{let s=Math.ceil(Math.log2(t+2));s>32-a&&(s=32-a);let o=32-s,m=Math.pow(2,32-o)-2;o===31&&(m=2),o===32&&(m=1);const c=x(o),k=v(c),h=$&k,C=h|~k>>>0,w=o===32?h:h+1,g=o===32?h:C-1;$=C+1;const A=(m/P*100).toFixed(2),W=T[I%T.length];return{subnet:I+1,network:f(h),mask:c,cidr:"/"+o,firstHost:f(w),lastHost:f(g),broadcast:f(C),usableHosts:m,visualWidth:A,barColor:W}});if(v(y[y.length-1].broadcast)>B)return n("Not enough address space in base network for all subnets.");M.innerHTML=y.map(t=>`
          <tr>
            <td>${t.subnet}</td>
            <td>${t.network}</td>
            <td>${t.mask}</td>
            <td>${t.cidr}</td>
            <td>${t.firstHost}</td>
            <td>${t.lastHost}</td>
            <td>${t.broadcast}</td>
            <td>${t.usableHosts}</td>
            <td>
              <div class="vlsm-bar" data-bar-color="${t.barColor}" data-bar-width="${t.visualWidth}" title="Subnet ${t.subnet}: ${t.network} ${t.cidr}, ${t.usableHosts} usable hosts"></div>
// After rendering, set bar color and width via JS for all .vlsm-bar
setTimeout(() => {
  document.querySelectorAll('.vlsm-bar').forEach(bar => {
    const color = bar.getAttribute('data-bar-color');
    const width = bar.getAttribute('data-bar-width');
    // Remove any previous color/width classes
    bar.classList.remove(...Array.from(bar.classList).filter(c => c.startsWith('bar-color-') || c.startsWith('bar-width-')));
    if (color) {
      // Sanitize color for class (e.g. #1976d2 -> 1976d2, rgb(25,118,210) -> rgb-25-118-210)
      let colorClass = 'bar-color-' + color.replace(/[^a-zA-Z0-9]/g, '-');
      bar.classList.add(colorClass);
    }
    if (width) {
      let widthClass = 'bar-width-' + String(Math.round(Number(width)));
      bar.classList.add(widthClass);
    }
  });
}, 0);
            </td>
          </tr>
        `).join(""),L.classList.remove("hidden"),b.textContent="VLSM calculation complete!",b.classList.remove("hidden"),u.classList.add("hidden")},100);function n(a){u.classList.add("hidden"),l.textContent=a,l.classList.remove("hidden"),b.textContent="Please check your input and try again.",b.classList.remove("hidden")}})}function O(){}export{K as load,O as setupVlsmCalculator};
