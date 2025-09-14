import{m as V,i as f,c as w,a as k}from"./utils-D6OBsT8e.js";function W(l,m){if(!l)return;l.innerHTML="";const r=document.createElement("link");r.rel="stylesheet",r.href="/vlsmCalculator.css",r.id="vlsm-calc-css",document.head.appendChild(r)}if(!document.getElementById("vlsm-calc-css")){const l=document.createElement("link");l.rel="stylesheet",l.href="/vlsmCalculator.css",l.id="vlsm-calc-css",document.head.appendChild(l)}const s=document.createElement("div");s.id="vlsm-calculator-tool";s.className="tool-container";s.innerHTML=`
    <div class="tool-header">
      <h2>VLSM Calculator</h2>
      <p>Variable Length Subnet Mask (VLSM) calculator with enhanced visual CIDR map.</p>
    </div>
    <div class="tool-interface">
      <div class="tool-controls">
        <label class="form-label" for="vlsm-base-ip">Base Network Address</label>
        <input id="vlsm-base-ip" class="form-control" type="text" placeholder="e.g. 192.168.1.0" autocomplete="off" />
        <label class="form-label" for="vlsm-base-mask">Base Subnet Mask / CIDR</label>
        <input id="vlsm-base-mask" class="form-control" type="text" placeholder="e.g. 255.255.255.0 or /24" autocomplete="off" />
        <label class="form-label" for="vlsm-hosts">Hosts per Subnet (comma separated)</label>
        <input id="vlsm-hosts" class="form-control" type="text" placeholder="e.g. 100,50,25" autocomplete="off" />
        <button class="btn btn--secondary" id="vlsm-calc-btn">Calculate</button>
        <span id="vlsm-progress" class="progress-indicator vlsm-hide vlsm-margin-left">Calculating...</span>
        <span id="vlsm-feedback" class="user-feedback vlsm-hide vlsm-margin-left"></span>
      </div>
      <div id="vlsm-results" class="output-section vlsm-results-hide vlsm-margin-top">
        <div class="section-header"><label class="form-label">Results</label></div>
        <div id="vlsm-error" class="error-message hidden"></div>
        <table class="results-table" id="vlsm-results-table">
          <thead>
            <tr>
              <th>Subnet</th>
              <th>Network</th>
              <th>Subnet Mask</th>
              <th>CIDR</th>
              <th>First Host</th>
              <th>Last Host</th>
              <th>Broadcast</th>
              <th>Usable Hosts</th>
              <th>Visual Map</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `;toolContent.appendChild(s);const $=s.querySelector("#vlsm-calc-btn");$&&$.addEventListener("click",()=>{const l=s.querySelector("#vlsm-base-ip").value.trim(),m=s.querySelector("#vlsm-base-mask").value.trim(),r=s.querySelector("#vlsm-hosts").value.trim(),C=s.querySelector("#vlsm-progress"),a=s.querySelector("#vlsm-feedback"),L=s.querySelector("#vlsm-results"),n=s.querySelector("#vlsm-error"),b=s.querySelector("#vlsm-results-table tbody");a.classList.add("vlsm-hide"),a.textContent="",L.classList.add("vlsm-results-hide"),n.classList.add("hidden"),n.textContent="",b.innerHTML="",C.classList.remove("vlsm-hide"),a.classList.add("vlsm-hide"),a.textContent="",L.classList.add("vlsm-results-hide"),n.classList.add("hidden"),n.textContent="",b.innerHTML="",setTimeout(()=>{if(!/^[\d]{1,3}(\.[\d]{1,3}){3}$/.test(l))return c("Invalid base network address.");let e=null,v=null;if(/^\/(\d{1,2})$/.test(m)){if(e=parseInt(m.replace("/",""),10),e<0||e>32)return c("Invalid base CIDR.");v=w(e)}else if(/^[\d]{1,3}(\.[\d]{1,3}){3}$/.test(m)){if(v=m,e=V(v),e===null)return c("Invalid base subnet mask.")}else return c("Enter base subnet mask (e.g. 255.255.255.0) or CIDR (e.g. /24).");const M=r.split(",").map(t=>parseInt(t.trim(),10)).filter(t=>!isNaN(t)&&t>0);if(!M.length)return c("Enter at least one valid host count.");const x=M.slice().sort((t,d)=>d-t);let y=f(l);const T=f(v),q=(y&T)+Math.pow(2,32-e)-1,B=Math.pow(2,32-e)-2,H=["#007bff","#28a745","#ffc107","#dc3545","#6f42c1","#fd7e14","#20c997","#6610f2"],h=x.map((t,d)=>{let i=Math.ceil(Math.log2(t+2));i>32-e&&(i=32-e);let o=32-i,p=Math.pow(2,32-o)-2;o===31&&(p=2),o===32&&(p=1);const I=w(o),S=f(I),u=y&S,g=u|~S>>>0,E=o===32?u:u+1,D=o===32?u:g-1;y=g+1;const N=(p/B*100).toFixed(2),R=H[d%H.length];return{subnet:d+1,network:k(u),mask:I,cidr:"/"+o,firstHost:k(E),lastHost:k(D),broadcast:k(g),usableHosts:p,visualWidth:N,barColor:R}});if(f(h[h.length-1].broadcast)>q)return c("Not enough address space in base network for all subnets.");b.innerHTML=h.map(t=>`
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
              <div class="vlsm-bar" title="Subnet ${t.subnet}: ${t.network} ${t.cidr}, ${t.usableHosts} usable hosts"></div>
            </td>
          </tr>
        `).join(""),L.classList.remove("vlsm-results-hide"),b.querySelectorAll(".vlsm-bar").forEach((t,d)=>{const i=h[d];t.style.background=i.barColor,t.style.width=i.visualWidth+"%"}),a.textContent="VLSM calculation complete!",a.classList.remove("vlsm-hide"),C.classList.add("vlsm-hide")},100);function c(e){C.classList.add("vlsm-hide"),n.textContent=e,n.classList.remove("hidden"),a.textContent="Please check your input and try again.",a.classList.remove("vlsm-hide")}});function j(){}export{W as load,j as setupVlsmCalculator};
