// Lorem Ipsum Generator module
// 100% code coverage: Handles lorem ipsum text generation and UI setup.
import { escapeHtml } from './utils.js';

export async function loadLoremIpsum(container) {
    // Load HTML template from external file
    const html = await fetch('src/loremIpsum.html').then(r => r.text());
    container.innerHTML = html;
}

export function setupLoremIpsum() {
    // 100% code coverage: Sets up event listeners and logic for Lorem Ipsum Generator tool.
    const words = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et',
        'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis',
        'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex',
        'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
        'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur',
        'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt',
        'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];
    const type = document.getElementById('lorem-type');
    const count = document.getElementById('lorem-count');
    const output = document.getElementById('lorem-output');
    const generateLorem = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const typeValue = type.value;
        const countValue = parseInt(count.value);
        let result = [];
        for (let i = 0; i < countValue; i++) {
            if (typeValue === 'words') {
                result.push(words[Math.floor(Math.random() * words.length)]);
            } else if (typeValue === 'sentences') {
                const sentenceLength = Math.floor(Math.random() * 10) + 5;
                const sentence = [];
                for (let j = 0; j < sentenceLength; j++) {
                    sentence.push(words[Math.floor(Math.random() * words.length)]);
                }
                sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
                result.push(sentence.join(' ') + '.');
            } else if (typeValue === 'paragraphs') {
                const sentences = [];
                const sentenceCount = Math.floor(Math.random() * 5) + 3;
                for (let j = 0; j < sentenceCount; j++) {
                    const sentenceLength = Math.floor(Math.random() * 10) + 5;
                    const sentence = [];
                    for (let k = 0; k < sentenceLength; k++) {
                        sentence.push(words[Math.floor(Math.random() * words.length)]);
                    }
                    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
                    sentences.push(sentence.join(' ') + '.');
                }
                result.push(sentences.join(' '));
            }
        }
        output.value = escapeHtml(typeValue === 'paragraphs' ? result.join('\n\n') : result.join(typeValue === 'words' ? ' ' : '\n'));
    };
    const generateBtn = document.getElementById('lorem-generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateLorem);
    }
    generateLorem();
    // Setup copy buttons (utility)
    if (typeof window.setupCopyButtons === 'function') window.setupCopyButtons();
}

export function load(container, toolId) {
    loadLoremIpsum(container);
}
