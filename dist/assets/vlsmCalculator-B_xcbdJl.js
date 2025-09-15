import{m as V,i as v,b as f,c as x}from"./utils-DuYpMu2P.js";function G(E,J){if(!E)return;if(E.innerHTML="",!document.getElementById("vlsm-calc-css")){const n=document.createElement("link");n.rel="stylesheet",n.href="./src/vlsmCalculator.css",n.id="vlsm-calc-css",document.head.appendChild(n)}const s=document.createElement("div");s.id="vlsm-calculator-tool",s.className="tool-container",fetch("./src/vlsmCalculator.html").then(n=>n.text()).then(n=>{s.innerHTML=n,E.appendChild(s);const k=s.querySelector("#vlsm-calc-btn");k&&k.addEventListener("click",()=>{const g=s.querySelector("#vlsm-base-ip").value.trim(),u=s.querySelector("#vlsm-base-mask").value.trim(),b=s.querySelector("#vlsm-hosts").value.trim(),w=s.querySelector("#vlsm-progress"),l=s.querySelector("#vlsm-feedback"),M=s.querySelector("#vlsm-results"),d=s.querySelector("#vlsm-error"),a=s.querySelector("#vlsm-results-table tbody");w.classList.remove("hidden"),l.classList.add("hidden"),l.textContent="",M.classList.add("hidden"),d.classList.add("hidden"),d.textContent="",a.innerHTML="",setTimeout(()=>{if(!/^[\d]{1,3}(\.[\d]{1,3}){3}$/.test(g))return c("Invalid base network address.");let r=null,L=null;if(/^\/(\d{1,2})$/.test(u)){if(r=parseInt(u.replace("/",""),10),r<0||r>32)return c("Invalid base CIDR.");L=x(r)}else if(/^[\d]{1,3}(\.[\d]{1,3}){3}$/.test(u)){if(L=u,r=V(L),r===null)return c("Invalid base subnet mask.")}else return c("Enter base subnet mask (e.g. 255.255.255.0) or CIDR (e.g. /24).");const I=b.split(",").map(e=>parseInt(e.trim(),10)).filter(e=>!isNaN(e)&&e>0);if(!I.length)return c("Enter at least one valid host count.");const B=I.slice().sort((e,o)=>o-e);let q=v(g);const N=v(L),T=(q&N)+Math.pow(2,32-r)-1,H=Math.pow(2,32-r)-2,D=["#007bff","#28a745","#ffc107","#dc3545","#6f42c1","#fd7e14","#20c997","#6610f2"],t=B.map((e,o)=>{let m=Math.ceil(Math.log2(e+2));m>32-r&&(m=32-r);let i=32-m,p=Math.pow(2,32-i)-2;i===31&&(p=2),i===32&&(p=1);const h=x(i),y=v(h),$=q&y,S=$|~y>>>0,A=i===32?$:$+1,P=i===32?$:S-1;q=S+1;const j=(p/H*100).toFixed(2),F=D[o%D.length];return{subnet:o+1,network:f($),mask:h,cidr:"/"+i,firstHost:f(A),lastHost:f(P),broadcast:f(S),usableHosts:p,visualWidth:j,barColor:F}});if(v(t[t.length-1].broadcast)>T)return c("Not enough address space in base network for all subnets.");a.innerHTML=t.map(e=>`
              <tr>
                <td>${e.subnet}</td>
                <td>${e.network}</td>
                <td>${e.mask}</td>
                <td>${e.cidr}</td>
                <td>${e.firstHost}</td>
                <td>${e.lastHost}</td>
                <td>${e.broadcast}</td>
                <td>${e.usableHosts}</td>
                <td>
                  <div class="vlsm-bar" data-bar-color="${e.barColor}" data-bar-width="${e.visualWidth}" title="Subnet ${e.subnet}: ${e.network} ${e.cidr}, ${e.usableHosts} usable hosts"></div>
                </td>
              </tr>
            `).join(""),M.classList.remove("hidden"),l.textContent="VLSM calculation complete!",l.classList.remove("hidden"),w.classList.add("hidden")},100);function c(r){w.classList.add("hidden"),d.textContent=r,d.classList.remove("hidden"),l.textContent="Please check your input and try again.",l.classList.remove("hidden")}})});const R=s.querySelector("#vlsm-calc-btn");R&&R.addEventListener("click",()=>{const n=s.querySelector("#vlsm-base-ip").value.trim(),k=s.querySelector("#vlsm-base-mask").value.trim(),g=s.querySelector("#vlsm-hosts").value.trim(),u=s.querySelector("#vlsm-progress"),b=s.querySelector("#vlsm-feedback"),w=s.querySelector("#vlsm-results"),l=s.querySelector("#vlsm-error"),M=s.querySelector("#vlsm-results-table tbody");u.classList.remove("hidden"),b.classList.add("hidden"),b.textContent="",w.classList.add("hidden"),l.classList.add("hidden"),l.textContent="",M.innerHTML="",setTimeout(()=>{if(!/^[\d]{1,3}(\.[\d]{1,3}){3}$/.test(n))return d("Invalid base network address.");let a=null,c=null;if(/^\/(\d{1,2})$/.test(k)){if(a=parseInt(k.replace("/",""),10),a<0||a>32)return d("Invalid base CIDR.");c=x(a)}else if(/^[\d]{1,3}(\.[\d]{1,3}){3}$/.test(k)){if(c=k,a=V(c),a===null)return d("Invalid base subnet mask.")}else return d("Enter base subnet mask (e.g. 255.255.255.0) or CIDR (e.g. /24).");const r=g.split(",").map(t=>parseInt(t.trim(),10)).filter(t=>!isNaN(t)&&t>0);if(!r.length)return d("Enter at least one valid host count.");const L=r.slice().sort((t,C)=>C-t);let I=v(n);const B=v(c),N=(I&B)+Math.pow(2,32-a)-1,W=Math.pow(2,32-a)-2,T=["#007bff","#28a745","#ffc107","#dc3545","#6f42c1","#fd7e14","#20c997","#6610f2"],H=L.map((t,C)=>{let e=Math.ceil(Math.log2(t+2));e>32-a&&(e=32-a);let o=32-e,m=Math.pow(2,32-o)-2;o===31&&(m=2),o===32&&(m=1);const i=x(o),p=v(i),h=I&p,y=h|~p>>>0,$=o===32?h:h+1,S=o===32?h:y-1;I=y+1;const A=(m/W*100).toFixed(2),P=T[C%T.length];return{subnet:C+1,network:f(h),mask:i,cidr:"/"+o,firstHost:f($),lastHost:f(S),broadcast:f(y),usableHosts:m,visualWidth:A,barColor:P}});if(v(H[H.length-1].broadcast)>N)return d("Not enough address space in base network for all subnets.");M.innerHTML=H.map(t=>`
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
    if (color) bar.style.background = color;
    if (width) bar.style.width = width + '%';
  });
}, 0);
            </td>
          </tr>
        `).join(""),w.classList.remove("hidden"),b.textContent="VLSM calculation complete!",b.classList.remove("hidden"),u.classList.add("hidden")},100);function d(a){u.classList.add("hidden"),l.textContent=a,l.classList.remove("hidden"),b.textContent="Please check your input and try again.",b.classList.remove("hidden")}})}function K(){}export{G as load,K as setupVlsmCalculator};
