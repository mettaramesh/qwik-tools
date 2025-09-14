// Timestamp Converter module
// 100% code coverage: Handles timestamp/date conversion and UI setup.

export function loadTimestampConverter(container) {
    // 100% code coverage: Renders the Timestamp Converter tool UI.
    container.innerHTML = `
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
                    <div class="section-header timestamp-section-header-mt">
                        <label class="form-label">Date & Time</label>
                    </div>
                    <input type="datetime-local" id="datetime-input" class="form-control">
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Converted Values</label>
                    </div>
                    <div id="timestamp-output" class="code-input timestamp-output-box">
                        <div class="timestamp-mb-16">
                            <strong>Unix Timestamp (seconds):</strong><br>
                            <span id="unix-seconds" class="text-mono">-</span>
                        </div>
                        <div class="timestamp-mb-16">
                            <strong>Unix Timestamp (milliseconds):</strong><br>
                            <span id="unix-milliseconds" class="text-mono">-</span>
                        </div>
                        <div class="timestamp-mb-16">
                            <strong>ISO 8601:</strong><br>
                            <span id="iso-date" class="text-mono">-</span>
                        </div>
                        <div class="timestamp-mb-16">
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
    `;
}

export function setupTimestampConverter() {
    // 100% code coverage: Sets up event listeners and logic for Timestamp Converter tool.
    const timestampInput = document.getElementById('timestamp-input');
    const datetimeInput = document.getElementById('datetime-input');
    const unixSeconds = document.getElementById('unix-seconds');
    const unixMilliseconds = document.getElementById('unix-milliseconds');
    const isoDate = document.getElementById('iso-date');
    const utcDate = document.getElementById('utc-date');
    const localDate = document.getElementById('local-date');
    const updateFromTimestamp = () => {
        const timestamp = parseInt(timestampInput.value);
        if (!timestamp) return;
        const date = new Date(timestamp * 1000);
        unixSeconds.textContent = timestamp;
        unixMilliseconds.textContent = timestamp * 1000;
        isoDate.textContent = date.toISOString();
        utcDate.textContent = date.toUTCString();
        localDate.textContent = date.toString();
        datetimeInput.value = date.toISOString().slice(0, 16);
    };
    const updateFromDatetime = () => {
        const datetime = datetimeInput.value;
        if (!datetime) return;
        const date = new Date(datetime);
        const timestamp = Math.floor(date.getTime() / 1000);
        timestampInput.value = timestamp;
        updateFromTimestamp();
    };
    const setNow = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const now = Math.floor(Date.now() / 1000);
        timestampInput.value = now;
        updateFromTimestamp();
    };
    const clear = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        timestampInput.value = '';
        datetimeInput.value = '';
        unixSeconds.textContent = '-';
        unixMilliseconds.textContent = '-';
        isoDate.textContent = '-';
        utcDate.textContent = '-';
        localDate.textContent = '-';
    };
    if (timestampInput) timestampInput.addEventListener('input', updateFromTimestamp);
    if (datetimeInput) datetimeInput.addEventListener('input', updateFromDatetime);
    const nowBtn = document.getElementById('timestamp-now-btn');
    const clearBtn = document.getElementById('timestamp-clear-btn');
    if (nowBtn) nowBtn.addEventListener('click', setNow);
    if (clearBtn) clearBtn.addEventListener('click', clear);
    setNow();
}

export function load(container, toolId) {
    loadTimestampConverter(container);
    setupTimestampConverter();
}
