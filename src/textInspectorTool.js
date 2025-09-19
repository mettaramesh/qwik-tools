// Text Inspector & Case Converter Tool
// Provides text statistics, case conversions, and various text transformations

// Load external stylesheet for text inspector tool
function loadTextInspectorStyles() {
  // Remove any existing CSS first
  const existingLink = document.getElementById('textinspector-css-link');
  if (existingLink) {
    existingLink.remove();
  }
  
  const link = document.createElement('link');
  link.id = 'textinspector-css-link';
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = '/textInspectorTool.css?v=' + Date.now() + '&refresh=' + Math.random(); // Strong cache busting
  if (document.head) document.head.appendChild(link);
}

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
    console.log('🎯 loadTextInspectorTool called!');
    
    // Load the CSS for this tool first
    loadTextInspectorStyles();
    
    try {
        console.log('📡 Fetching textInspector.html...');
        const resp = await fetch('textInspector.html?v=' + Date.now() + '&refresh=' + Math.random());
        if (!resp.ok) {
            throw new Error(`Failed to load Text Inspector HTML: ${resp.status}`);
        }
        const html = await resp.text();
        console.log('✅ HTML loaded successfully, length:', html.length);
        
        // Security check: ensure we're not loading the full page
        if (html.includes('<!DOCTYPE html') || html.includes('<html')) {
            throw new Error('Invalid HTML content - contains full page structure');
        }
        container.innerHTML = html;
        console.log('✅ HTML inserted into container');
        
        // Add loading class to prevent FOUC
        const layout = container.querySelector('.text-inspector-layout');
        if (layout) {
            layout.classList.add('loading');
            console.log('🎨 Added loading class');
            // Wait for CSS to load before showing content
            setTimeout(() => {
                layout.classList.remove('loading');
                layout.classList.add('loaded');
                console.log('🎨 Removed loading class, added loaded class');
            }, 100); // Small delay to ensure CSS is applied
        } else {
            console.warn('⚠️ Could not find .text-inspector-layout element');
        }
    } catch (error) {
        console.error('Error loading Text Inspector:', error);
        container.innerHTML = '<div class="error">Failed to load Text Inspector tool</div>';
        return;
    }
    setTimeout(() => {
        console.log('🚀 Text Inspector JavaScript is starting...');
        console.log('🔍 Looking for DOM elements...');
        
        const input = document.getElementById('text-inspector-input');
        const output = document.getElementById('text-inspector-output');
        const stats = document.getElementById('text-inspector-stats');
        
        console.log('📝 Found elements:', {
            input: !!input,
            output: !!output,
            stats: !!stats
        });
        
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
            if (btn) {
                btn.onclick = fn;
                
                // Debug: Log when attaching event listeners
                console.log('Attaching hover events to button:', id);
                
                // Remove all CSS classes and apply base styles via JavaScript
                btn.className = ''; // Remove all CSS classes
                
                // Apply base styles
                Object.assign(btn.style, {
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: '500',
                    border: '1px solid rgba(94, 82, 64, 0.2)',
                    borderRadius: '4px',
                    background: 'transparent',
                    color: 'rgba(19, 52, 59, 1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    minWidth: '60px',
                    maxWidth: '120px',
                    height: '28px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: '0',
                    margin: '2px'
                });
                
                // Add primary button styling if needed
                if (id === 'to-upper') {
                    btn.style.background = 'rgba(33, 128, 141, 1)';
                    btn.style.color = 'white';
                    btn.style.borderColor = 'rgba(33, 128, 141, 1)';
                }
                
                // Add JavaScript hover effects
                btn.addEventListener('mouseenter', function() {
                    console.log('Mouse enter:', id);
                    Object.assign(this.style, {
                        background: '#f8f9fa',
                        borderColor: '#2196f3',
                        color: '#495057',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                    });
                });
                
                btn.addEventListener('mouseleave', function() {
                    console.log('Mouse leave:', id);
                    if (id === 'to-upper') {
                        // Primary button
                        Object.assign(this.style, {
                            background: 'rgba(33, 128, 141, 1)',
                            borderColor: 'rgba(33, 128, 141, 1)',
                            color: 'white',
                            transform: '',
                            boxShadow: ''
                        });
                    } else {
                        // Outline button
                        Object.assign(this.style, {
                            background: 'transparent',
                            borderColor: 'rgba(94, 82, 64, 0.2)',
                            color: 'rgba(19, 52, 59, 1)',
                            transform: '',
                            boxShadow: ''
                        });
                    }
                });
                
                btn.addEventListener('mousedown', function() {
                    console.log('Mouse down:', id);
                    Object.assign(this.style, {
                        background: '#e9ecef',
                        borderColor: '#1976d2',
                        color: '#495057',
                        transform: 'translateY(0)',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                    });
                });
                
                btn.addEventListener('mouseup', function() {
                    console.log('Mouse up:', id);
                    // Return to hover state
                    Object.assign(this.style, {
                        background: '#f8f9fa',
                        borderColor: '#2196f3',
                        color: '#495057',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                    });
                });
            } else {
                console.warn('Button not found:', id);
            }
        });
        
        // Handle both copy buttons and clear button with same styling
        const copyAndClearButtons = document.querySelectorAll('.copy-btn, .clear-btn');
        console.log('Found copy and clear buttons:', copyAndClearButtons.length);
        
        // Also try to find clear button by ID as backup
        const clearBtnById = document.getElementById('clear-btn');
        if (clearBtnById) {
            console.log('Found clear button by ID:', clearBtnById.textContent);
        }
        
        // Combine both approaches
        const allButtons = Array.from(copyAndClearButtons);
        if (clearBtnById && !allButtons.includes(clearBtnById)) {
            allButtons.push(clearBtnById);
            console.log('Added clear button by ID to list');
        }
        
        console.log('Total buttons to style:', allButtons.length);
        
        allButtons.forEach((btn, index) => {
            console.log(`Styling button ${index}:`, btn.textContent, btn.className, btn.id);
            
            // Remove all CSS classes and apply base styles via JavaScript
            btn.className = '';
            
            // Apply consistent base styles for copy and clear buttons using setProperty with important
            btn.style.setProperty('padding', '4px 8px', 'important');
            btn.style.setProperty('font-size', '12px', 'important');
            btn.style.setProperty('font-weight', '500', 'important');
            btn.style.setProperty('color', '#495057', 'important');
            btn.style.setProperty('background', '#f8f9fa', 'important');
            btn.style.setProperty('border', '1px solid #dee2e6', 'important');
            btn.style.setProperty('border-radius', '4px', 'important');
            btn.style.setProperty('cursor', 'pointer', 'important');
            btn.style.setProperty('text-align', 'center', 'important');
            btn.style.setProperty('text-decoration', 'none', 'important');
            btn.style.setProperty('display', 'inline-block', 'important');
            btn.style.setProperty('line-height', '1.2', 'important');
            btn.style.setProperty('min-width', '50px', 'important');
            btn.style.setProperty('transition', 'all 0.15s ease-in-out', 'important');
            btn.style.setProperty('margin-left', '8px', 'important');
            btn.style.setProperty('visibility', 'visible', 'important');
            btn.style.setProperty('opacity', '1', 'important');
            
            console.log('Applied base styles to:', btn.textContent);
            
            // Add hover effects
            btn.addEventListener('mouseenter', function() {
                console.log('Mouse enter on button:', this.textContent);
                this.style.setProperty('background', '#e9ecef', 'important');
                this.style.setProperty('border-color', '#adb5bd', 'important');
                this.style.setProperty('color', '#495057', 'important');
                this.style.setProperty('transform', 'translateY(-1px)', 'important');
                this.style.setProperty('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.1)', 'important');
            });
            
            btn.addEventListener('mouseleave', function() {
                console.log('Mouse leave on button:', this.textContent);
                this.style.setProperty('background', '#f8f9fa', 'important');
                this.style.setProperty('border-color', '#dee2e6', 'important');
                this.style.setProperty('color', '#495057', 'important');
                this.style.setProperty('transform', '', 'important');
                this.style.setProperty('box-shadow', '', 'important');
            });
            
            btn.addEventListener('mousedown', function() {
                this.style.setProperty('background', '#dee2e6', 'important');
                this.style.setProperty('border-color', '#adb5bd', 'important');
                this.style.setProperty('color', '#495057', 'important');
                this.style.setProperty('transform', 'translateY(0)', 'important');
                this.style.setProperty('box-shadow', '0 1px 2px rgba(0, 0, 0, 0.1)', 'important');
            });
            
            btn.addEventListener('mouseup', function() {
                this.style.setProperty('background', '#e9ecef', 'important');
                this.style.setProperty('border-color', '#adb5bd', 'important');
                this.style.setProperty('color', '#495057', 'important');
                this.style.setProperty('transform', 'translateY(-1px)', 'important');
                this.style.setProperty('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.1)', 'important');
            });
        });
        
        // Handle copy functionality
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
        
        // Handle clear functionality
        const clearBtn = document.getElementById('clear-btn');
        if (clearBtn && input && output) {
            clearBtn.onclick = () => { 
                input.value = ''; 
                output.value = ''; 
                updateStats(); 
                // Visual feedback
                const oldText = clearBtn.textContent;
                clearBtn.textContent = 'Cleared!';
                setTimeout(() => { clearBtn.textContent = oldText; }, 1000);
            };
        }
    }, 0);
}

export async function load(container, toolId) {
    await loadTextInspectorTool(container);
}
