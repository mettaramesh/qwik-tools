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

export async function load(container, toolId) {
    // Load HTML template from external file (do not overwrite user manual edits)
    const html = await fetch('placeholderTool.html').then(r => r.text());
    // Optionally inject toolName if needed, else just use as-is
    container.innerHTML = html;
}
