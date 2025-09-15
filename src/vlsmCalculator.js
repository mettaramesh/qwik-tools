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
  fetch('./src/vlsmCalculator.html')
    .then(r => r.text())
    .then(html => {
      toolDiv.innerHTML = html;
      toolContent.appendChild(toolDiv);

      // The rest of the setup logic (event listeners, etc.) goes here:
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

          progress.classList.remove('hidden');
          feedback.classList.add('hidden');
          feedback.textContent = '';
          resultsDiv.classList.add('hidden');
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
                  <div class="vlsm-bar" data-bar-color="${s.barColor}" data-bar-width="${s.visualWidth}" title="Subnet ${s.subnet}: ${s.network} ${s.cidr}, ${s.usableHosts} usable hosts"></div>
                </td>
              </tr>
            `).join('');

            resultsDiv.classList.remove('hidden');
            feedback.textContent='VLSM calculation complete!';
            feedback.classList.remove('hidden');
            progress.classList.add('hidden');
          },100);

          function showError(msg){
            progress.classList.add('hidden');
            errorDiv.textContent=msg;
            errorDiv.classList.remove('hidden');
            feedback.textContent='Please check your input and try again.';
            feedback.classList.remove('hidden');
          }
        });
      }
    });

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

  progress.classList.remove('hidden');
  feedback.classList.add('hidden');
  feedback.textContent = '';
  resultsDiv.classList.add('hidden');
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
              <div class="vlsm-bar" data-bar-color="${s.barColor}" data-bar-width="${s.visualWidth}" title="Subnet ${s.subnet}: ${s.network} ${s.cidr}, ${s.usableHosts} usable hosts"></div>
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
        `).join('');

  resultsDiv.classList.remove('hidden');
  feedback.textContent='VLSM calculation complete!';
  feedback.classList.remove('hidden');
  progress.classList.add('hidden');
      },100);

      function showError(msg){
  progress.classList.add('hidden');
  errorDiv.textContent=msg;
  errorDiv.classList.remove('hidden');
  feedback.textContent='Please check your input and try again.';
  feedback.classList.remove('hidden');
      }
    });
  }
}

export function setupVlsmCalculator() {}
