// Text Inspector & Case Converter Tool
// Provides text statistics, case conversions, and various text transformations

function getTextStats(text) {
    const lines = text.split(/\r?\n/);
    const words = text.match(/\b\w+\b/g) || [];
    const chars = text.length;
    const bytes = new TextEncoder().encode(text).length;
    const multibyte = (text.match(/[^\x00-\x7F]/g) || []).length;
    const sentences = (text.match(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g) || []).length;
    const paragraphs = text.split(/\n{2,}/).filter(p => p.trim()).length;
    return {
        lines: lines.length,
        words: words.length,
        chars,
        bytes,
        multibyte,
        sentences,
        paragraphs
    };
}

function toUpperCase(text) { return text.toUpperCase(); }
function toLowerCase(text) { return text.toLowerCase(); }
function toTitleCase(text) {
    return text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
}
function toCamelCase(text) {
    return text.replace(/[-_\s]+(.)?/g, (m, c) => c ? c.toUpperCase() : '').replace(/^(.)/, (m, c) => c.toLowerCase());
}
function toSnakeCase(text) {
    return text.replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/\s+/g, '_')
        .replace(/-+/g, '_')
        .toLowerCase();
}
function toKebabCase(text) {
    return text.replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .replace(/_+/g, '-')
        .toLowerCase();
}
function toPascalCase(text) {
    return text.replace(/[-_\s]+(.)?/g, (m, c) => c ? c.toUpperCase() : '')
        .replace(/^(.)/, (m, c) => c.toUpperCase());
}
function reverseWords(text) {
    return text.split(/\s+/).reverse().join(' ');
}
function sortLinesAsc(text) {
    return text.split(/\r?\n/).sort().join('\n');
}
function sortLinesDesc(text) {
    return text.split(/\r?\n/).sort().reverse().join('\n');
}
function toSentenceCase(text) {
    return text.replace(/(^|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
}
function trimWhitespace(text) {
    return text.trim();
}
function collapseBlankLines(text) {
    return text.replace(/\n{2,}/g, '\n');
}
function removeDiacritics(text) {
    return text.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export function loadTextInspectorTool(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2>Text Inspector & Case Converter</h2>
            <p>Analyze and transform your text with various tools</p>
        </div>
        <div class="tool-interface">
            <div class="button-row">
                <button class="btn btn--secondary" id="to-upper">UPPER CASE</button>
                <button class="btn btn--outline" id="to-lower">lower case</button>
                <button class="btn btn--outline" id="to-title">Title Case</button>
                <button class="btn btn--outline" id="to-camel">camelCase</button>
                <button class="btn btn--outline" id="to-pascal">PascalCase</button>
                <button class="btn btn--outline" id="to-snake">snake_case</button>
                <button class="btn btn--outline" id="to-kebab">kebab-case</button>
                <button class="btn btn--outline" id="reverse-words">Reverse Words</button>
                <button class="btn btn--outline" id="sort-asc">Sort Lines ↑</button>
                <button class="btn btn--outline" id="sort-desc">Sort Lines ↓</button>
                <button class="btn btn--outline" id="to-sentence">Sentence case</button>
                <button class="btn btn--outline" id="trim-whitespace">Trim Whitespace</button>
                <button class="btn btn--outline" id="collapse-blank">Collapse Blank Lines</button>
                <button class="btn btn--outline" id="remove-diacritics">Remove Diacritics</button>
                <button class="btn btn--outline" id="clear-btn">Clear</button>
            </div>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Input</label>
                        <button class="btn btn--sm copy-btn" data-target="text-inspector-input">Copy</button>
                    </div>
                    <textarea id="text-inspector-input" class="form-control code-input" placeholder="Paste or type text here..." rows="10"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Output</label>
                        <button class="btn btn--sm copy-btn" data-target="text-inspector-output">Copy</button>
                    </div>
                    <textarea id="text-inspector-output" class="form-control code-input" readonly rows="10"></textarea>
                </div>
            </div>
            <div id="text-inspector-stats" class="stats-box"></div>
        </div>
    `;

    setTimeout(() => {
        const input = document.getElementById('text-inspector-input');
        const output = document.getElementById('text-inspector-output');
        const stats = document.getElementById('text-inspector-stats');
        function updateStats() {
            const s = getTextStats(input.value);
            stats.innerHTML = `Lines: <b>${s.lines}</b> | Words: <b>${s.words}</b> | Chars: <b>${s.chars}</b> | Bytes: <b>${s.bytes}</b> | Multibyte: <b>${s.multibyte}</b> | Sentences: <b>${s.sentences}</b> | Paragraphs: <b>${s.paragraphs}</b>`;
        }
        input.addEventListener('input', updateStats);
        updateStats();
        document.getElementById('to-upper').onclick = () => { output.value = toUpperCase(input.value); };
        document.getElementById('to-lower').onclick = () => { output.value = toLowerCase(input.value); };
        document.getElementById('to-title').onclick = () => { output.value = toTitleCase(input.value); };
        document.getElementById('to-camel').onclick = () => { output.value = toCamelCase(input.value); };
        document.getElementById('to-pascal').onclick = () => { output.value = toPascalCase(input.value); };
        document.getElementById('to-snake').onclick = () => { output.value = toSnakeCase(input.value); };
        document.getElementById('to-kebab').onclick = () => { output.value = toKebabCase(input.value); };
        document.getElementById('reverse-words').onclick = () => { output.value = reverseWords(input.value); };
        document.getElementById('sort-asc').onclick = () => { output.value = sortLinesAsc(input.value); };
        document.getElementById('sort-desc').onclick = () => { output.value = sortLinesDesc(input.value); };
        document.getElementById('to-sentence').onclick = () => { output.value = toSentenceCase(input.value); };
        document.getElementById('trim-whitespace').onclick = () => { output.value = trimWhitespace(input.value); };
        document.getElementById('collapse-blank').onclick = () => { output.value = collapseBlankLines(input.value); };
        document.getElementById('remove-diacritics').onclick = () => { output.value = removeDiacritics(input.value); };
        document.getElementById('clear-btn').onclick = () => { input.value = ''; output.value = ''; updateStats(); };
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.onclick = function() {
                const targetId = btn.getAttribute('data-target');
                const target = document.getElementById(targetId);
                if (target) {
                    navigator.clipboard.writeText(target.value).then(() => {
                        const oldText = btn.textContent;
                        btn.textContent = 'Copied!';
                        setTimeout(() => { btn.textContent = oldText; }, 1000);
                    });
                }
            };
        });
    }, 0);
}

export function load(container, toolId) {
    loadTextInspectorTool(container);
}
