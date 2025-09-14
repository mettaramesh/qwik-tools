import{m as v,i as p,a as b,c as x}from"./utils-D6OBsT8e.js";function S(l,d){if(!/^\d{1,3}(\.\d{1,3}){3}$/.test(l))return{error:"Invalid IP address."};let s=null,o=null;if(/^\/(\d{1,2})$/.test(d)){if(s=parseInt(d.replace("/",""),10),isNaN(s)||s<0||s>32)return{error:"Invalid CIDR."};o=x(s)}else if(/^\d{1,3}(\.\d{1,3}){3}$/.test(d)){if(o=d,s=v(o),s===null)return{error:"Invalid subnet mask."}}else return{error:"Enter subnet mask (e.g. 255.255.255.0) or CIDR (e.g. /24)."};const n=p(l),c=p(o);if(n===null||c===null)return{error:"Invalid IP or mask."};const e=n&c,u=e|~c>>>0,y=s===32?e:e+1,m=s===32?e:u-1,k=s>=31?s===31?2:1:Math.max(0,u-e-1),h=u-e+1,C=`${b(e)} - ${b(u)}`,r=n>>>24&255;let a="";r>=1&&r<=126?a="A":r===127?a="A (Loopback)":r>=128&&r<=191?a="B":r>=192&&r<=223?a="C":r>=224&&r<=239?a="D (Multicast)":r>=240&&r<=254?a="E (Reserved)":a="Unknown";let i="Public Unicast";return r===10||r===172&&(n>>>16&240)===16||r===192&&(n>>>8&255)===168?i="Private Unicast":r===127?i="Loopback":r>=224&&r<=239?i="Multicast":r>=240&&r<=254?i="Reserved":n===4294967295&&(i="Broadcast"),{network:b(e),broadcast:b(u),firstHost:b(y),lastHost:b(m),usableHosts:k,totalHosts:h,range:C,mask:o,cidr:"/"+s,ipClass:a,ipType:i,error:null}}function g(l,d){if(!l)return;l.innerHTML="";const s=document.createElement("link");s.rel="stylesheet",s.href="/subnetCalculator.css",s.id="subnet-calc-css",document.head.appendChild(s)}if(!document.getElementById("subnet-calc-css")){const l=document.createElement("link");l.rel="stylesheet",l.href="/subnetCalculator.css",l.id="subnet-calc-css",document.head.appendChild(l)}const t=document.createElement("div");t.id="subnet-calculator-tool";t.className="tool-container";t.innerHTML=`
    <div class="tool-header">
      <h2>Subnet Calculator</h2>
      <p>Calculate network details from an IP address and subnet mask or CIDR.</p>
    </div>
    <div class="tool-interface">
      <div class="tool-controls">
        <label class="form-label" for="subnet-ip">IP Address</label>
        <input id="subnet-ip" class="form-control" type="text" placeholder="e.g. 192.168.1.10" autocomplete="off" />
        <label class="form-label" for="subnet-mask">Subnet Mask / CIDR</label>
        <input id="subnet-mask" class="form-control" type="text" placeholder="e.g. 255.255.255.0 or /24" autocomplete="off" />
        <button class="btn btn--secondary" id="subnet-calc-btn">Calculate</button>
        <span id="subnet-progress" class="progress-indicator subnet-hide subnet-margin-left">Calculating...</span>
        <span id="subnet-feedback" class="user-feedback subnet-hide subnet-margin-left"></span>
      </div>
      <div id="subnet-results" class="output-section subnet-results-hide subnet-margin-top">
        <div class="section-header"><label class="form-label">Results</label></div>
        <div id="subnet-error" class="error-message hidden"></div>
        <table class="results-table">
          <tbody>
            <tr><td>Network Address</td><td id="result-network"></td></tr>
            <tr><td>Broadcast Address</td><td id="result-broadcast"></td></tr>
            <tr><td>First Host</td><td id="result-first-host"></td></tr>
            <tr><td>Last Host</td><td id="result-last-host"></td></tr>
            <tr><td>Usable Hosts</td><td id="result-usable-hosts"></td></tr>
            <tr><td>Total Hosts</td><td id="result-total-hosts"></td></tr>
            <tr><td>Human Readable Range</td><td id="result-range"></td></tr>
            <tr><td>Subnet Mask</td><td id="result-mask"></td></tr>
            <tr><td>CIDR Notation</td><td id="result-cidr"></td></tr>
            <tr><td>IP Class</td><td id="result-class"></td></tr>
            <tr><td>IP Type</td><td id="result-type"></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;toolContent.appendChild(t);const f=t.querySelector("#subnet-calc-btn");f&&f.addEventListener("click",()=>{const l=t.querySelector("#subnet-ip").value.trim(),d=t.querySelector("#subnet-mask").value.trim(),s=t.querySelector("#subnet-progress"),o=t.querySelector("#subnet-feedback"),n=t.querySelector("#subnet-results"),c=t.querySelector("#subnet-error");o.style.display="none",o.textContent="",setTimeout(()=>{const e=S(l,d);if(s.style.display="none",e.error){c.textContent=e.error,c.classList.remove("hidden"),n.style.display="block",["network","broadcast","first-host","last-host","usable-hosts","total-hosts","range","mask","cidr","class","type"].forEach(u=>{t.querySelector("#result-"+u).textContent=""}),o.textContent="Please check your input and try again.",o.style.display="";return}c.classList.add("hidden"),t.querySelector("#result-network").textContent=e.network,t.querySelector("#result-broadcast").textContent=e.broadcast,t.querySelector("#result-first-host").textContent=e.firstHost,t.querySelector("#result-last-host").textContent=e.lastHost,t.querySelector("#result-usable-hosts").textContent=e.usableHosts,t.querySelector("#result-total-hosts").textContent=e.totalHosts,t.querySelector("#result-range").textContent=e.range,t.querySelector("#result-mask").textContent=e.mask,t.querySelector("#result-cidr").textContent=e.cidr,t.querySelector("#result-class").textContent=e.ipClass,t.querySelector("#result-type").textContent=e.ipType,n.style.display="block",o.textContent="Calculation complete!",o.style.display=""},250)});function q(){}export{S as calculateSubnet,g as load,q as setupSubnetCalculator};
