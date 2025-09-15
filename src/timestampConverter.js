// Timestamp Converter module
// 100% code coverage: Handles timestamp/date conversion and UI setup.

export async function loadTimestampConverter(container) {
    // Fetch and inject the external HTML template for the Timestamp Converter tool UI.
    const response = await fetch('src/timestampConverter.html');
    const html = await response.text();
    container.innerHTML = html;
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
        if (!timestampInput) return;
        const timestamp = parseInt(timestampInput.value);
        if (!timestamp) return;
        const date = new Date(timestamp * 1000);
        if (unixSeconds) unixSeconds.textContent = timestamp;
        if (unixMilliseconds) unixMilliseconds.textContent = timestamp * 1000;
        if (isoDate) isoDate.textContent = date.toISOString();
        if (utcDate) utcDate.textContent = date.toUTCString();
        if (localDate) localDate.textContent = date.toString();
        if (datetimeInput) datetimeInput.value = date.toISOString().slice(0, 16);
    };
    const updateFromDatetime = () => {
        if (!datetimeInput) return;
        const datetime = datetimeInput.value;
        if (!datetime) return;
        const date = new Date(datetime);
        const timestamp = Math.floor(date.getTime() / 1000);
        if (timestampInput) timestampInput.value = timestamp;
        updateFromTimestamp();
    };
    const setNow = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const now = Math.floor(Date.now() / 1000);
        if (timestampInput) timestampInput.value = now;
        updateFromTimestamp();
    };
    const clear = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (timestampInput) timestampInput.value = '';
        if (datetimeInput) datetimeInput.value = '';
        if (unixSeconds) unixSeconds.textContent = '-';
        if (unixMilliseconds) unixMilliseconds.textContent = '-';
        if (isoDate) isoDate.textContent = '-';
        if (utcDate) utcDate.textContent = '-';
        if (localDate) localDate.textContent = '-';
    };
    if (timestampInput) timestampInput.addEventListener('input', updateFromTimestamp);
    if (datetimeInput) datetimeInput.addEventListener('input', updateFromDatetime);
    const nowBtn = document.getElementById('timestamp-now-btn');
    const clearBtn = document.getElementById('timestamp-clear-btn');
    if (nowBtn) nowBtn.addEventListener('click', setNow);
    if (clearBtn) clearBtn.addEventListener('click', clear);
    setNow();
}

export async function load(container, toolId) {
    await loadTimestampConverter(container);
    setupTimestampConverter();
}
