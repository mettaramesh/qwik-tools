import { ipToInt, intToIp, maskToCidr, cidrToMask } from './utils.js';

// Subnet Calculator Tool
// IPv4 subnet calculation logic and Qwik integration

export function calculateSubnet(ip, maskOrCidr) {
  // Validate IP
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
    return { error: 'Invalid IP address.' };
  }
  let cidr = null, mask = null;
  if (/^\/(\d{1,2})$/.test(maskOrCidr)) {
    cidr = parseInt(maskOrCidr.replace('/', ''), 10);
    if (isNaN(cidr) || cidr < 0 || cidr > 32) return { error: 'Invalid CIDR.' };
    mask = cidrToMask(cidr);
  } else if (/^\d{1,3}(\.\d{1,3}){3}$/.test(maskOrCidr)) {
    mask = maskOrCidr;
    cidr = maskToCidr(mask);
    if (cidr === null) return { error: 'Invalid subnet mask.' };
  } else {
    return { error: 'Enter subnet mask (e.g. 255.255.255.0) or CIDR (e.g. /24).' };
  }
  const ipInt = ipToInt(ip);
  const maskInt = ipToInt(mask);
  if (ipInt === null || maskInt === null) return { error: 'Invalid IP or mask.' };
  const network = ipInt & maskInt;
  const broadcast = network | (~maskInt >>> 0);
  const firstHost = cidr === 32 ? network : network + 1;
  const lastHost = cidr === 32 ? network : broadcast - 1;
  const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.max(0, (broadcast - network - 1));
  const totalHosts = broadcast - network + 1;
  const range = `${intToIp(network)} - ${intToIp(broadcast)}`;

  // IP Class
  const firstOctet = (ipInt >>> 24) & 0xFF;
  let ipClass = '';
  if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'A';
  else if (firstOctet === 127) ipClass = 'A (Loopback)';
  else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B';
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C';
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)';
  else if (firstOctet >= 240 && firstOctet <= 254) ipClass = 'E (Reserved)';
  else ipClass = 'Unknown';

  // IP Type
  let ipType = 'Public Unicast';
  if (firstOctet === 10 || (firstOctet === 172 && ((ipInt>>>16)&0xF0) === 16) || (firstOctet === 192 && ((ipInt>>>8)&0xFF) === 168)) {
    ipType = 'Private Unicast';
  } else if (firstOctet === 127) {
    ipType = 'Loopback';
  } else if (firstOctet >= 224 && firstOctet <= 239) {
    ipType = 'Multicast';
  } else if (firstOctet >= 240 && firstOctet <= 254) {
    ipType = 'Reserved';
  } else if (ipInt === 0xFFFFFFFF) {
    ipType = 'Broadcast';
  }

  return {
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    firstHost: intToIp(firstHost),
    lastHost: intToIp(lastHost),
    usableHosts,
    totalHosts,
    range,
    mask,
    cidr: '/' + cidr,
    ipClass,
    ipType,
    error: null
  };
}

// Qwik dynamic tool loader
export function load(toolContent, toolId) {
  // Only clear the tool content area, not the whole main-content
  if (!toolContent) return;
  toolContent.innerHTML = '';

  // Inject CSS if not already present
    const link = document.createElement('link');
    link.rel = 'stylesheet';
  link.href = '/subnetCalculator.css';
    link.id = 'subnet-calc-css';
    document.head.appendChild(link);
  }
  if (!document.getElementById('subnet-calc-css')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/subnetCalculator.css'; // root-relative for deployment
    link.id = 'subnet-calc-css';
    document.head.appendChild(link);
  }

  // Create tool container
  const toolDiv = document.createElement('div');
  toolDiv.id = 'subnet-calculator-tool';
  toolDiv.className = 'tool-container';
  toolDiv.innerHTML = `
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
  `;
  toolContent.appendChild(toolDiv);

  // Attach event handler after rendering
  const subnetBtn = toolDiv.querySelector('#subnet-calc-btn');
  if (subnetBtn) {
    subnetBtn.addEventListener('click', () => {
      const ip = toolDiv.querySelector('#subnet-ip').value.trim();
      const mask = toolDiv.querySelector('#subnet-mask').value.trim();
      const progress = toolDiv.querySelector('#subnet-progress');
      const feedback = toolDiv.querySelector('#subnet-feedback');
      const resultsDiv = toolDiv.querySelector('#subnet-results');
      const errorDiv = toolDiv.querySelector('#subnet-error');
      feedback.style.display = 'none';
      feedback.textContent = '';
      setTimeout(() => {
        const results = calculateSubnet(ip, mask);
        progress.style.display = 'none';
        if (results.error) {
          errorDiv.textContent = results.error;
          errorDiv.classList.remove('hidden');
          resultsDiv.style.display = 'block';
          ['network','broadcast','first-host','last-host','usable-hosts','total-hosts','range','mask','cidr','class','type'].forEach(id => {
            toolDiv.querySelector('#result-' + id).textContent = '';
          });
          feedback.textContent = 'Please check your input and try again.';
          feedback.style.display = '';
          return;
        }
        errorDiv.classList.add('hidden');
        toolDiv.querySelector('#result-network').textContent = results.network;
        toolDiv.querySelector('#result-broadcast').textContent = results.broadcast;
        toolDiv.querySelector('#result-first-host').textContent = results.firstHost;
        toolDiv.querySelector('#result-last-host').textContent = results.lastHost;
        toolDiv.querySelector('#result-usable-hosts').textContent = results.usableHosts;
        toolDiv.querySelector('#result-total-hosts').textContent = results.totalHosts;
        toolDiv.querySelector('#result-range').textContent = results.range;
        toolDiv.querySelector('#result-mask').textContent = results.mask;
        toolDiv.querySelector('#result-cidr').textContent = results.cidr;
        toolDiv.querySelector('#result-class').textContent = results.ipClass;
        toolDiv.querySelector('#result-type').textContent = results.ipType;
        resultsDiv.style.display = 'block';
        feedback.textContent = 'Calculation complete!';
        feedback.style.display = '';
      }, 250);
    });
  }

export function setupSubnetCalculator() {
  // No-op for now; could add event listeners or state here if needed
}
