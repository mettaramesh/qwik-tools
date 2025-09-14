function g(e){e.innerHTML=`
        <div class="tool-header">
            <h2>Timestamp Converter</h2>
            <p>Convert Unix timestamps to dates and vice versa</p>
        </div>
        <div class="tool-interface">
            <div class="tool-controls">
                <button class="btn btn--secondary" id="timestamp-now-btn">Current Time</button>
                <button class="btn btn--outline" id="timestamp-clear-btn">Clear</button>
            </div>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Unix Timestamp (seconds)</label>
                    </div>
                    <input type="number" id="timestamp-input" class="form-control text-mono" placeholder="1609459200">
                    <div class="section-header" style="margin-top: 20px;">
                        <label class="form-label">Date & Time</label>
                    </div>
                    <input type="datetime-local" id="datetime-input" class="form-control">
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Converted Values</label>
                    </div>
                    <div id="timestamp-output" class="code-input" style="background: var(--color-background); border: 1px solid var(--color-border); border-radius: var(--radius-base); padding: 12px; min-height: 200px;">
                        <div style="margin-bottom: 16px;">
                            <strong>Unix Timestamp (seconds):</strong><br>
                            <span id="unix-seconds" class="text-mono">-</span>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <strong>Unix Timestamp (milliseconds):</strong><br>
                            <span id="unix-milliseconds" class="text-mono">-</span>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <strong>ISO 8601:</strong><br>
                            <span id="iso-date" class="text-mono">-</span>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <strong>UTC:</strong><br>
                            <span id="utc-date" class="text-mono">-</span>
                        </div>
                        <div>
                            <strong>Local Time:</strong><br>
                            <span id="local-date" class="text-mono">-</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `}function x(){const e=document.getElementById("timestamp-input"),o=document.getElementById("datetime-input"),i=document.getElementById("unix-seconds"),a=document.getElementById("unix-milliseconds"),d=document.getElementById("iso-date"),l=document.getElementById("utc-date"),c=document.getElementById("local-date"),s=()=>{const t=parseInt(e.value);if(!t)return;const n=new Date(t*1e3);i.textContent=t,a.textContent=t*1e3,d.textContent=n.toISOString(),l.textContent=n.toUTCString(),c.textContent=n.toString(),o.value=n.toISOString().slice(0,16)},u=()=>{const t=o.value;if(!t)return;const n=new Date(t),b=Math.floor(n.getTime()/1e3);e.value=b,s()},m=t=>{t&&(t.preventDefault(),t.stopPropagation());const n=Math.floor(Date.now()/1e3);e.value=n,s()},v=t=>{t&&(t.preventDefault(),t.stopPropagation()),e.value="",o.value="",i.textContent="-",a.textContent="-",d.textContent="-",l.textContent="-",c.textContent="-"};e&&e.addEventListener("input",s),o&&o.addEventListener("input",u);const r=document.getElementById("timestamp-now-btn"),p=document.getElementById("timestamp-clear-btn");r&&r.addEventListener("click",m),p&&p.addEventListener("click",v),m()}function f(e,o){g(e),x()}export{f as load,g as loadTimestampConverter,x as setupTimestampConverter};
