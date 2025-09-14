// VLSM Calculator Tool with Enhanced Visual CIDR Map
import { ipToInt, intToIp, maskToCidr, cidrToMask } from './utils.js';

export function load(toolContent, toolId) {
  // Only clear the tool content area, not the whole main-content
  if (!toolContent) return;
  toolContent.innerHTML = '';

  if (!document.getElementById('vlsm-calc-css')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './src/vlsmCalculator.css';
    link.id = 'vlsm-calc-css';
    document.head.appendChild(link);
  }

  const toolDiv = document.createElement('div');
  toolDiv.id = 'vlsm-calculator-tool';
  toolDiv.className = 'tool-container';
  toolDiv.innerHTML = `
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
  <span id="vlsm-progress" class="progress-indicator hidden ml-10">Calculating...</span>
  <span id="vlsm-feedback" class="user-feedback hidden ml-10"></span>
      </div>
  <div id="vlsm-results" class="output-section hidden mt-1-5em">
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
  `;
  toolContent.appendChild(toolDiv);

  const vlsmBtn = toolDiv.querySelector('#vlsm-calc-btn');
  if (vlsmBtn) {
    vlsmBtn.addEventListener('click', () => {
      const baseIp = toolDiv.querySelector('#vlsm-base-ip').value.trim();
      const baseMask = toolDiv.querySelector('#vlsm-base-mask').value.trim();
      const hostsInput = toolDiv.querySelector('#vlsm-hosts').value.trim();
      const progress = toolDiv.querySelector('#vlsm-progress');
      const feedback = toolDiv.querySelector('#vlsm-feedback');
      const resultsDiv = toolDiv.querySelector('#vlsm-results');
      const errorDiv = toolDiv.querySelector('#vlsm-error');
      const resultsTable = toolDiv.querySelector('#vlsm-results-table tbody');

      progress.style.display = '';
      feedback.style.display = 'none';
      feedback.textContent = '';
      resultsDiv.style.display = 'none';
      errorDiv.classList.add('hidden');
      errorDiv.textContent = '';
      resultsTable.innerHTML = '';

      setTimeout(() => {
        if (!/^[\d]{1,3}(\.[\d]{1,3}){3}$/.test(baseIp)) return showError('Invalid base network address.');

        let baseCidr = null, baseMaskStr = null;
        if (/^\/(\d{1,2})$/.test(baseMask)) {
          baseCidr = parseInt(baseMask.replace('/', ''), 10);
          if (baseCidr < 0 || baseCidr > 32) return showError('Invalid base CIDR.');
          baseMaskStr = cidrToMask(baseCidr);
        } else if (/^[\d]{1,3}(\.[\d]{1,3}){3}$/.test(baseMask)) {
          baseMaskStr = baseMask;
          baseCidr = maskToCidr(baseMaskStr);
          if (baseCidr === null) return showError('Invalid base subnet mask.');
        } else return showError('Enter base subnet mask (e.g. 255.255.255.0) or CIDR (e.g. /24).');

        const hosts = hostsInput.split(',').map(h => parseInt(h.trim(), 10)).filter(h => !isNaN(h) && h > 0);
        if (!hosts.length) return showError('Enter at least one valid host count.');

        const sortedHosts = hosts.slice().sort((a,b)=>b-a);
        let currentIp = ipToInt(baseIp);
        const baseMaskInt = ipToInt(baseMaskStr);
        const baseNetwork = currentIp & baseMaskInt;
        const baseLastAddr = baseNetwork + Math.pow(2,32-baseCidr)-1;

        const maxHostsInBase = Math.pow(2,32-baseCidr)-2;
        const colorPalette = ['#007bff','#28a745','#ffc107','#dc3545','#6f42c1','#fd7e14','#20c997','#6610f2']; // rotating colors

        const subnets = sortedHosts.map((reqHosts, idx) => {
          let neededBits = Math.ceil(Math.log2(reqHosts+2));
          if (neededBits > 32-baseCidr) neededBits = 32-baseCidr;
          let subnetCidr = 32-neededBits;

          let usableHosts = Math.pow(2,32-subnetCidr)-2;
          if (subnetCidr===31) usableHosts=2;
          if (subnetCidr===32) usableHosts=1;

          const subnetMask = cidrToMask(subnetCidr);
          const subnetMaskInt = ipToInt(subnetMask);
          const network = currentIp & subnetMaskInt;
          const broadcast = network | (~subnetMaskInt >>>0);
          const firstHost = subnetCidr===32 ? network : network+1;
          const lastHost = subnetCidr===32 ? network : broadcast-1;
          currentIp = broadcast+1;

    const visualWidth = ((usableHosts / maxHostsInBase) * 100).toFixed(2);
    const barColor = colorPalette[idx % colorPalette.length];

          return {
            subnet: idx+1,
            network: intToIp(network),
            mask: subnetMask,
            cidr: '/' + subnetCidr,
            firstHost: intToIp(firstHost),
            lastHost: intToIp(lastHost),
            broadcast: intToIp(broadcast),
            usableHosts,
            visualWidth,
            barColor
          };
        });

        const lastBroadcast = ipToInt(subnets[subnets.length-1].broadcast);
        if (lastBroadcast > baseLastAddr) return showError('Not enough address space in base network for all subnets.');

        resultsTable.innerHTML = subnets.map(s => `
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
              <div class="vlsm-bar" style="background:${s.barColor};width:${s.visualWidth}%" title="Subnet ${s.subnet}: ${s.network} ${s.cidr}, ${s.usableHosts} usable hosts"></div>
            </td>
          </tr>
        `).join('');

        resultsDiv.style.display='block';
        feedback.textContent='VLSM calculation complete!';
        feedback.style.display='';
        progress.style.display='none';
      },100);

      function showError(msg){
        progress.style.display='none';
        errorDiv.textContent=msg;
        errorDiv.classList.remove('hidden');
        feedback.textContent='Please check your input and try again.';
        feedback.style.display='';
      }
    });
  }
}

export function setupVlsmCalculator() {}
