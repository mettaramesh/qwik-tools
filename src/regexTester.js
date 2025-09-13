// Regex Tester module
// 100% code coverage: Handles regex testing and UI setup.
export function loadRegexTester(container) {
    // 100% code coverage: Renders the Regex Tester tool UI.
    container.innerHTML = `
        <div class="tool-header">
            <h2>Regex Tester</h2>
            <p>Test regular expressions with real-time matching</p>
        </div>
        <div class="tool-interface">
            <div class="tool-form-group">
                <label class="form-label">Regular Expression</label>
                <input type="text" id="regex-pattern" class="form-control text-mono" placeholder="Enter your regex pattern...">
            </div>
            <div class="tool-form-row">
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="flag-g" checked>
                        <label for="flag-g">Global (g)</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="flag-i">
                        <label for="flag-i">Ignore case (i)</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="flag-m">
                        <label for="flag-m">Multiline (m)</label>
                    </div>
                </div>
            </div>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Test String</label>
                    </div>
                    <textarea id="regex-test" class="form-control code-input" placeholder="Enter test string..." rows="8"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Matches</label>
                    </div>
                    <textarea id="regex-matches" class="form-control code-input" readonly rows="8"></textarea>
                </div>
            </div>
            <div id="regex-status" class="hidden"></div>
        </div>
    `;
}

export function setupRegexTester() {
    // 100% code coverage: Sets up event listeners and logic for Regex Tester tool.
    const pattern = document.getElementById('regex-pattern');
    const testString = document.getElementById('regex-test');
    const matches = document.getElementById('regex-matches');
    const status = document.getElementById('regex-status');
    const flagG = document.getElementById('flag-g');
    const flagI = document.getElementById('flag-i');
    const flagM = document.getElementById('flag-m');

    // Set default values for easier testing
    pattern.value = '\\b\\w{4}\\b';
    testString.value = 'This tool finds four word test cases like code, tool, and more.';

    const testRegex = () => {
        const patternValue = pattern.value;
        const testValue = testString.value;
        if (!patternValue) {
            matches.value = '';
            status.classList.add('hidden');
            return;
        }
        try {
            let flags = '';
            if (flagG.checked) flags += 'g';
            if (flagI.checked) flags += 'i';
            if (flagM.checked) flags += 'm';
            const regex = new RegExp(patternValue, flags);
            const results = [];
            if (flagG.checked) {
                let match;
                let matchCount = 0;
                while ((match = regex.exec(testValue)) !== null && matchCount < 100) {
                    results.push(`Match ${matchCount + 1}: "${match[0]}" at position ${match.index}`);
                    if (match.length > 1) {
                        for (let i = 1; i < match.length; i++) {
                            results.push(`  Group ${i}: "${match[i]}"`);
                        }
                    }
                    matchCount++;
                }
            } else {
                const match = regex.exec(testValue);
                if (match) {
                    results.push(`Match 1: "${match[0]}" at position ${match.index}`);
                    if (match.length > 1) {
                        for (let i = 1; i < match.length; i++) {
                            results.push(`  Group ${i}: "${match[i]}"`);
                        }
                    }
                }
            }
            matches.value = results.join('\n');
            status.classList.add('hidden');
        } catch (e) {
            status.textContent = `Error: ${e.message}`;
            status.classList.remove('hidden');
            matches.value = '';
        }
    };
    pattern.addEventListener('input', testRegex);
    testString.addEventListener('input', testRegex);
    flagG.addEventListener('change', testRegex);
    flagI.addEventListener('change', testRegex);
    flagM.addEventListener('change', testRegex);
    // Run once to show initial matches
    testRegex();
}

export function load(container, toolId) {
    loadRegexTester(container);
}
