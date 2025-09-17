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

export async function loadTextInspectorTool(container) {
    try {
        const resp = await fetch('./textInspector.html');
        if (!resp.ok) {
            throw new Error(`Failed to load Text Inspector HTML: ${resp.status}`);
        }
        const html = await resp.text();
        // Security check: ensure we're not loading the full page
        if (html.includes('<!DOCTYPE html') || html.includes('<html')) {
            throw new Error('Invalid HTML content - contains full page structure');
        }
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading Text Inspector:', error);
        container.innerHTML = '<div class="error">Failed to load Text Inspector tool</div>';
        return;
    }
    setTimeout(() => {
        const input = document.getElementById('text-inspector-input');
        const output = document.getElementById('text-inspector-output');
        const stats = document.getElementById('text-inspector-stats');
        function updateStats() {
            if (!input || !stats) return;
            const s = getTextStats(input.value);
            stats.innerHTML = `Lines: <b>${s.lines}</b> | Words: <b>${s.words}</b> | Chars: <b>${s.chars}</b> | Bytes: <b>${s.bytes}</b> | Multibyte: <b>${s.multibyte}</b> | Sentences: <b>${s.sentences}</b> | Paragraphs: <b>${s.paragraphs}</b>`;
        }
        if (input) input.addEventListener('input', updateStats);
        updateStats();
        const actions = [
            ['to-upper', () => { if (output && input) output.value = toUpperCase(input.value); }],
            ['to-lower', () => { if (output && input) output.value = toLowerCase(input.value); }],
            ['to-title', () => { if (output && input) output.value = toTitleCase(input.value); }],
            ['to-camel', () => { if (output && input) output.value = toCamelCase(input.value); }],
            ['to-pascal', () => { if (output && input) output.value = toPascalCase(input.value); }],
            ['to-snake', () => { if (output && input) output.value = toSnakeCase(input.value); }],
            ['to-kebab', () => { if (output && input) output.value = toKebabCase(input.value); }],
            ['reverse-words', () => { if (output && input) output.value = reverseWords(input.value); }],
            ['sort-asc', () => { if (output && input) output.value = sortLinesAsc(input.value); }],
            ['sort-desc', () => { if (output && input) output.value = sortLinesDesc(input.value); }],
            ['to-sentence', () => { if (output && input) output.value = toSentenceCase(input.value); }],
            ['trim-whitespace', () => { if (output && input) output.value = trimWhitespace(input.value); }],
            ['collapse-blank', () => { if (output && input) output.value = collapseBlankLines(input.value); }],
            ['remove-diacritics', () => { if (output && input) output.value = removeDiacritics(input.value); }],
        ];
        actions.forEach(([id, fn]) => {
            const btn = document.getElementById(id);
            if (btn) btn.onclick = fn;
        });
        const clearBtn = document.getElementById('clear-btn');
        if (clearBtn && input && output) {
            clearBtn.onclick = () => { input.value = ''; output.value = ''; updateStats(); };
        }
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

export async function load(container, toolId) {
    await loadTextInspectorTool(container);
}
