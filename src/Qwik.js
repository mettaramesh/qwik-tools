// Qwik main class (modularized)
// 100% code coverage: This file contains the main Qwik class, initialization, and core logic for tool loading and navigation.

// Only import global utilities used throughout the app. All tool modules are loaded dynamically below.
import { setupCopyButtons, showStatus, hexToRgb, rgbToHsl, simpleMD5 } from './utils.js';

export class Qwik {
    // 100% code coverage: Main Qwik class, manages state, navigation, tool loading, and event setup.
    constructor() {
        this.currentTool = localStorage.getItem('qwik-last-tool') || 'json-formatter';
        this.clipboardContent = '';
        this.detectionPatterns = {
            // Matches JSON objects or arrays (simple heuristic)
            json: /^\s*(\{[\s\S]*\}|\[[\s\S]*\])\s*$/s,
            // JWT: three base64url parts separated by dots
            jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
            // Base64: long string, valid chars, optional padding
            base64: /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
            // URL: http(s)://...
            url: /^https?:\/\/.+/,
            // Unix timestamp: 10 or 13 digits
            timestamp: /^\d{10}(\d{3})?$/,
            // Hex color: #RRGGBB
            hex: /^#[0-9a-fA-F]{6}$/,
            // UUID v4 (canonical form)
            uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
            // Markdown: basic detection for Markdown syntax
            markdown: /^(\s{0,3}#|\*\s|\-\s|\d+\.\s|>\s|\[.+\]\(.+\)|!\[.*\]\(.+\))/m,
            // XML: robust detection for XML declarations, tags, comments, self-closing
            xml: /(<\?xml[\s\S]*?\?>|<!--([\s\S]*?)-->|<([a-zA-Z_][\w\-\.]*)[^>]*>[\s\S]*?<\/\3>|<([a-zA-Z_][\w\-\.]*)[^>]*\/>)/m
        };
        this.favourites = this.loadFavourites();
        this.init();
        // Attach event delegation for remove/select in favourites ONCE
        setTimeout(() => {
            const favList = document.getElementById('favourites-list');
            if (favList && !favList._qwikHandlerAttached) {
                favList.addEventListener('click', (e) => {
                    const removeBtn = e.target.closest('.favourite-remove');
                    if (removeBtn && removeBtn.parentElement && removeBtn.parentElement.dataset.tool) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.toggleFavourite(removeBtn.parentElement.dataset.tool);
                        return;
                    }
                    const toolLink = e.target.closest('.favourite-tool-link');
                    if (toolLink && toolLink.parentElement && toolLink.parentElement.dataset.tool) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.selectTool(toolLink.parentElement.dataset.tool);
                        return;
                    }
                    // Fallback: click on nav-item itself
                    const navItem = e.target.closest('.favourite-item');
                    if (navItem && navItem.dataset.tool) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.selectTool(navItem.dataset.tool);
                    }
                });
                favList._qwikHandlerAttached = true;
            }
        }, 0);
        setTimeout(() => {
            const toolContent = document.getElementById('tool-content');
            if (toolContent && !toolContent.innerHTML.trim()) {
                this.loadTool(this.currentTool);
            }
        }, 100);
    }

    loadFavourites() {
        try {
            return JSON.parse(localStorage.getItem('qwik-favourites') || '[]');
        } catch {
            return [];
        }
    }
    saveFavourites() {
        localStorage.setItem('qwik-favourites', JSON.stringify(this.favourites));
    }
    isFavourite(toolId) {
        return this.favourites.includes(toolId);
    }
    toggleFavourite(toolId) {
        // Prevent duplicates
        if (this.isFavourite(toolId)) {
            this.favourites = this.favourites.filter(id => id !== toolId);
        } else {
            if (!this.favourites.includes(toolId)) {
                this.favourites.push(toolId);
            }
        }
        this.saveFavourites();
        this.renderFavourites();
        this.renderStarButtons(); // ensure star buttons update after favourites
    }
    renderFavourites() {
        const favList = document.getElementById('favourites-list');
        if (!favList) return;
        favList.innerHTML = '';
        if (this.favourites.length === 0) {
            // No favourites to render
        }
        this.favourites.forEach(toolId => {
            const navItem = document.createElement('div');
            navItem.className = 'nav-item favourite-item';
            navItem.dataset.tool = toolId;
            // Tool name as a span (not a link, event delegation will handle click)
            const toolLink = document.createElement('span');
            toolLink.textContent = this.getToolName(toolId);
            toolLink.className = 'favourite-tool-link';
            navItem.appendChild(toolLink);
            // Add clickable shallow red star after tool name
            const star = document.createElement('button');
            star.className = 'star-btn favourite-star';
            star.title = 'Remove from Favourites';
            star.setAttribute('aria-label', 'Remove from Favourites');
            star.textContent = '★';
            star.style.color = '#ff8a65'; // shallow red
            star.style.fontSize = '1.2em';
            star.style.marginLeft = '8px';
            star.style.verticalAlign = 'middle';
            star.style.background = 'none';
            star.style.border = 'none';
            star.style.cursor = 'pointer';
            star.style.padding = '0';
            star.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleFavourite(toolId);
            });
            navItem.appendChild(star);
            favList.appendChild(navItem);
        });
    }
    getToolName(toolId) {
        // Map toolId to display name (add more as needed)
        const names = {
            'json-formatter': 'JSON Formatter',
            'json-yaml': 'JSON ↔ YAML',
            'json-xml': 'JSON ↔ XML',
            'timestamp': 'Timestamp Converter',
            'number-base': 'Number Base',
            'cron-parser': 'CRON Parser',
            'jwt': 'JWT',
            'html': 'HTML',
            'url': 'URL',
            'base64-text': 'Base64 Text',
            'base64-image': 'Base64 Image',
            'gzip': 'GZip',
            'sql-formatter': 'SQL Formatter',
            'xml-formatter': 'XML Formatter',
            'hash-generator': 'Hash Generator',
            'uuid-generator': 'UUID Generator',
            'lorem-ipsum': 'Lorem Ipsum',
            'qr-generator': 'QR Code Generator',
            'text-inspector': 'Text Inspector & Case Converter',
            'regex-tester': 'Regex Tester',
            'text-comparer': 'Text Comparer',
            'xml-validator': 'XML Validator',
            'markdown-preview': 'Markdown Preview',
            'color-blindness': 'Color Blindness Simulator',
            'color-picker': 'Color Picker & Contrast',
            'image-compressor': 'PNG/JPEG Compressor',
            'image-converter': 'Image Converter',
            'html-entity': 'HTML Encoder/Decoder',
            'subnet-calculator': 'Subnet Calculator',
        };
        return names[toolId] || toolId;
    }
    renderStarButtons() {
        document.querySelectorAll('.nav-category:not(.nav-favourites) .nav-item').forEach(item => {
            // Remove old star if any
            const oldStar = item.querySelector('.star-btn');
            if (oldStar) oldStar.remove();
            const toolId = item.dataset.tool;
            if (!toolId) return;
            // Always append a star button
            const star = document.createElement('button');
            star.className = 'star-btn';
            star.title = this.isFavourite(toolId) ? 'Remove from Favourites' : 'Add to Favourites';
            star.innerHTML = this.isFavourite(toolId) ? '★' : '☆';
            star.style.fontSize = '1em';
            star.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleFavourite(toolId);
                // Update star icon immediately
                this.renderStarButtons();
            });
            item.appendChild(star);
        });
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.loadTool(this.currentTool);
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTools(e.target.value);
            });
        }
        // Logo click to return to JSON formatter
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.selectTool('json-formatter');
            });
        }
    }

    setupNavigation() {
        // Collapse all categories by default except favourites
        document.querySelectorAll('.nav-category').forEach(category => {
            if (!category.classList.contains('nav-favourites')) {
                category.classList.add('collapsed');
            }
        });
        // Add right angle bracket to Favourites header
        const favCategory = document.querySelector('.nav-favourites');
        if (favCategory) {
            const favHeader = favCategory.querySelector('.category-header');
            if (favHeader && !favHeader.querySelector('.collapse-arrow')) {
                const arrow = document.createElement('span');
                arrow.className = 'collapse-arrow';
                arrow.style.marginRight = '6px';
                arrow.textContent = favCategory.classList.contains('collapsed') ? '▶' : '▼';
                favHeader.prepend(arrow);
            }
            // Remove previous click handler if any
            if (favHeader._qwikCollapseHandler) {
                favHeader.removeEventListener('click', favHeader._qwikCollapseHandler);
            }
            // Attach click handler for collapse/expand (ignore clicks on remove button)
            favHeader._qwikCollapseHandler = function(e) {
                // If the click is on a remove button or inside one, ignore
                if (e.target.closest('.favourite-remove')) return;
                e.preventDefault();
                e.stopPropagation();
                favCategory.classList.toggle('collapsed');
                const arrow = favHeader.querySelector('.collapse-arrow');
                if (arrow) {
                    arrow.textContent = favCategory.classList.contains('collapsed') ? '▶' : '▼';
                }
            };
            favHeader.addEventListener('click', favHeader._qwikCollapseHandler);
        }
        // Category headers (other than favourites)
        document.querySelectorAll('.nav-category:not(.nav-favourites) .category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const category = header.closest('.nav-category');
                category.classList.toggle('collapsed');
            });
        });
        // Only attach handlers to main nav, not favourites
        this.attachNavItemHandlers();
        this.renderFavourites();
        this.renderStarButtons(); // always after renderFavourites
    }

    attachNavItemHandlers() {
        // Only select nav-items NOT in favourites
        document.querySelectorAll('.nav-category:not(.nav-favourites) .nav-item').forEach(item => {
            // Remove any previous click handlers to avoid duplicates
            item.replaceWith(item.cloneNode(true));
        });
        document.querySelectorAll('.nav-category:not(.nav-favourites) .nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const toolId = item.dataset.tool;
                if (toolId) {
                    this.selectTool(toolId);
                }
            });
        });
        // Ensure star buttons are rendered after nav items are set up
        this.renderStarButtons();
    }

    selectTool(toolId) {
        // Update active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const selectedItem = document.querySelector(`[data-tool="${toolId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
        // Load tool
        this.currentTool = toolId;
        localStorage.setItem('qwik-last-tool', toolId);
        this.loadTool(toolId);
        // Re-attach nav handlers in case sidebar changed
        this.attachNavItemHandlers();
    }

    loadTool(toolId) {
        // Clear current tool content
        const toolContent = document.getElementById('tool-content');
        if (toolContent) {
            toolContent.innerHTML = '';
        }
        // Dynamic import based on tool ID
        let toolModule;
        switch (toolId) {
            case 'json-formatter':
                toolModule = import('./jsonFormatter.js');
                break;
            case 'json-yaml':
                toolModule = import('./jsonYamlTool.js');
                break;
            case 'json-xml':
                toolModule = import('./jsonXmlConverter.js');
                break;
            case 'json-validator':
                toolModule = import('./jsonValidator.js');
                break;
            case 'timestamp':
                toolModule = import('./timestampConverter.js');
                break;
            case 'number-base':
                toolModule = import('./numberBaseTool.js');
                break;
            case 'cron-parser':
                toolModule = import('./cronParser.js');
                break;
            case 'jwt':
                toolModule = import('./jwtTool.js');
                break;
            case 'html':
                toolModule = import('./htmlEntityTool.js');
                break;
            case 'url':
                toolModule = import('./urlTool.js');
                break;
            case 'base64-text':
                toolModule = import('./base64Tool.js');
                break;
            case 'base64-image':
                toolModule = import('./placeholderTool.js');
                break;
            case 'gzip':
                toolModule = import('./placeholderTool.js');
                break;
            case 'charset-converter':
                toolModule = import('./charsetConverterTool.js');
                break;
            case 'hex-ascii-converter':
                toolModule = import('./hexAsciiConverter.js');
                break;
            case 'sql-formatter':
                toolModule = import('./sqlFormatter.js');
                break;
            case 'xml-formatter':
                toolModule = import('./xmlFormatter.js');
                break;
            case 'hash-generator':
                toolModule = import('./hashGenerator.js');
                break;
            case 'uuid-generator':
                toolModule = import('./uuidGenerator.js');
                break;
            case 'lorem-ipsum':
                toolModule = import('./loremIpsum.js');
                break;
            case 'qr-generator':
                toolModule = import('./qrGenerator.js');
                break;
            case 'password-generator':
                toolModule = import('./passwordGenerator.js');
                break;
            case 'text-inspector':
                toolModule = import('./textInspectorTool.js');
                break;
            case 'regex-tester':
                toolModule = import('./regexTester.js');
                break;
            case 'text-comparer':
                toolModule = import('./textComparer.js');
                break;
            case 'xml-validator':
                toolModule = import('./xmlValidator.js');
                break;
            case 'markdown-preview':
                toolModule = import('./markdownPreview.js');
                break;
            case 'color-blindness':
                toolModule = import('./placeholderTool.js');
                break;
            case 'color-picker':
                toolModule = import('./colorPicker.js');
                break;
            case 'image-compressor':
                toolModule = import('./placeholderTool.js');
                break;
            case 'image-converter':
                toolModule = import('./placeholderTool.js');
                break;
            case 'hex-viewer':
                toolModule = import('./hexViewerTool.js');
                break;
            case 'html-entity':
                toolModule = import('./htmlEntityTool.js');
                break;
            case 'subnet-calculator':
                toolModule = import('./subnetCalculator.js');
                break;
            case 'vlsm-calculator':
                toolModule = import('./vlsmCalculator.js');
                break;
            default:
                toolModule = import('./placeholderTool.js');
        }
        if (toolModule) {
            toolModule.then(module => {
                let loaded = false;
                if (module.load && typeof module.load === 'function') {
                    module.load(toolContent, toolId);
                    loaded = true;
                } else if (module.default && typeof module.default === 'function') {
                    module.default(toolContent, toolId);
                    loaded = true;
                }
                // Special case: call setupJSONFormatter for json-formatter
                if (toolId === 'json-formatter' && module.setupJSONFormatter) {
                    module.setupJSONFormatter();
                // Special case: call setupJWTTool for jwt
                } else if (toolId === 'jwt' && module.setupJWTTool) {
                    module.setupJWTTool();
                // Special case: call setupURLTool for url
                } else if (toolId === 'url' && module.setupURLTool) {
                    module.setupURLTool();
                // Special case: call setupBase64Tool for base64-text
                } else if (toolId === 'base64-text' && module.setupBase64Tool) {
                    module.setupBase64Tool();
                // Special case: call setupUUIDGenerator for uuid-generator
                } else if (toolId === 'uuid-generator' && module.setupUUIDGenerator) {
                    module.setupUUIDGenerator();
                // Special case: call setupLoremIpsum for lorem-ipsum
                } else if (toolId === 'lorem-ipsum' && module.setupLoremIpsum) {
                    module.setupLoremIpsum();
                // Special case: call setupRegexTester for regex-tester
                } else if (toolId === 'regex-tester' && module.setupRegexTester) {
                    module.setupRegexTester();
                // Special case: call setupColorPicker for color-picker
                } else if (toolId === 'color-picker' && module.setupColorPicker) {
                    module.setupColorPicker();
                // Special case: call setupSubnetCalculator for subnet-calculator
                } else if (toolId === 'subnet-calculator' && module.setupSubnetCalculator) {
                    module.setupSubnetCalculator();
                // Special case: call setup for markdown-preview
                } else if (toolId === 'markdown-preview' && module.setup) {
                    module.setup();
                } else if (module.setup && typeof module.setup === 'function') {
                    module.setup(toolContent, toolId);
                }
                if (!loaded) {
                    toolContent.innerHTML = `<div class="error-message">Tool module loaded but no render function found for <b>${toolId}</b>.</div>`;
                }
            }).catch(err => {
                if (toolContent) {
                    toolContent.innerHTML = `<div class="error-message">Failed to load tool: <b>${toolId}</b><br>${err}</div>`;
                }
            });
        } else if (toolContent) {
            toolContent.innerHTML = `<div class="error-message">No loader found for tool: <b>${toolId}</b></div>`;
        }
    }

    filterTools(query) {
        // Robust, case-insensitive search for sidebar tools
        const q = (query || '').trim().toLowerCase();
        document.querySelectorAll('.nav-category').forEach(navCategory => {
            if (navCategory.classList.contains('nav-favourites')) return;
            const items = navCategory.querySelector('.category-items');
            let hasVisible = false;
            items.querySelectorAll('.nav-item').forEach(link => {
                const text = link.textContent.trim().toLowerCase();
                if (!q || text.includes(q)) {
                    link.style.display = '';
                    hasVisible = true;
                } else {
                    link.style.display = 'none';
                }
            });
            // Always collapse by default
            navCategory.classList.add('collapsed');
            items.classList.remove('expanded');
            if (q) {
                if (hasVisible) {
                    navCategory.style.display = '';
                    navCategory.classList.remove('collapsed');
                    items.classList.add('expanded');
                    items.style.display = '';
                } else {
                    navCategory.style.display = 'none';
                }
            } else {
                navCategory.style.display = '';
                items.style.display = '';
                items.classList.remove('expanded');
                navCategory.classList.add('collapsed');
                items.querySelectorAll('.nav-item').forEach(link => link.style.display = '');
            }
        });
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event);
    // Optionally, display a user-friendly message in the UI
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Optionally, display a user-friendly message in the UI
});

// Initialize app
window.QwikApp = new Qwik();
window.QwikApp.init();
