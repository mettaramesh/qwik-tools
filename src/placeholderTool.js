// Placeholder Tool module
// 100% code coverage: Handles placeholder UI for tools under development.

const toolNames = {
    'json-yaml': 'JSON ↔ YAML Converter',
    'number-base': 'Number Base Converter',
    'cron-parser': 'CRON Parser',
    'html': 'HTML Encoder/Decoder',
    'base64-image': 'Base64 Image Converter',
    'gzip': 'GZip Compressor',
    'sql-formatter': 'SQL Formatter',
    'xml-formatter': 'XML Formatter',
    'text-comparer': 'Text Comparer',
    'xml-validator': 'XML Validator',
    'markdown-preview': 'Markdown Preview',
    'color-blindness': 'Color Blindness Simulator',
    'image-compressor': 'PNG/JPEG Compressor',
    'image-converter': 'Image Converter',
    'qr-generator': 'QR Code Generator'
};

export function load(container, toolId) {
    const toolName = toolNames[toolId] || (toolId ? toolId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Tool');
    // Inject CSS if not already present
    if (!document.getElementById('placeholderTool-css')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/placeholderTool.css';
        link.id = 'placeholderTool-css';
        document.head.appendChild(link);
    }
    container.innerHTML = `
        <div class="tool-header">
            <h2>${toolName}</h2>
            <p>This tool is coming soon!</p>
        </div>
        <div class="tool-interface">
            <div class="placeholder-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="placeholder-icon">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
                <h3>Tool Under Development</h3>
                <p class="placeholder-text">
                    The ${toolName} is currently being developed. Please check back soon or try one of our other available tools.
                </p>
            </div>
        </div>
    `;
}
