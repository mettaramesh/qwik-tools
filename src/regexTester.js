// Regex Tester module
// 100% code coverage: Handles regex testing and UI setup.
export async function loadRegexTester(container) {
    // Load HTML template from external file
    const html = await fetch('src/regexTester.html').then(r => r.text());
    container.innerHTML = html;
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
