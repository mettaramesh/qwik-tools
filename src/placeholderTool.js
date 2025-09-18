// Placeholder Tool module
// Dynamic placeholder with tool-specific information

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
    'qr-generator': 'QR Code Generator',
    'placeholder': 'Development Tool'
};

const toolDescriptions = {
    'json-yaml': 'Convert between JSON and YAML formats with syntax highlighting and validation.',
    'number-base': 'Convert numbers between different bases (binary, octal, decimal, hexadecimal).',
    'cron-parser': 'Parse and explain CRON expressions with visual schedule display.',
    'html': 'Encode and decode HTML entities and special characters.',
    'base64-image': 'Convert images to Base64 encoding and vice versa.',
    'gzip': 'Compress and decompress text using GZip algorithm.',
    'sql-formatter': 'Format and beautify SQL queries with syntax highlighting.',
    'xml-formatter': 'Format and validate XML documents with proper indentation.',
    'text-comparer': 'Compare two text files and highlight differences.',
    'xml-validator': 'Validate XML documents against XSD schemas.',
    'markdown-preview': 'Preview Markdown content with live rendering.',
    'color-blindness': 'Simulate different types of color blindness for accessibility testing.',
    'image-compressor': 'Compress PNG and JPEG images while maintaining quality.',
    'image-converter': 'Convert between different image formats.',
    'qr-generator': 'Generate QR codes from text with customizable options.',
    'placeholder': 'A placeholder for tools under development.'
};

export async function load(container, toolId) {
    try {
        // Load HTML template from external file
        const html = await fetch('placeholderTool.html').then(r => r.text());
        
        // Security validation: prevent loading full HTML documents
        if (html.includes('<html>') || html.includes('<head>') || html.includes('<body>')) {
            throw new Error('Invalid HTML content - contains full page structure');
        }
        
        container.innerHTML = html;
        
        // Update placeholder content dynamically based on toolId
        const descElement = container.querySelector('.placeholder-desc');
        if (descElement && toolId) {
            const toolName = toolNames[toolId] || 'Unknown Tool';
            const toolDesc = toolDescriptions[toolId] || 'This tool is currently under development.';
            
            // Create more informative placeholder content
            descElement.innerHTML = `
                <strong>${toolName}</strong><br>
                <span class="small muted">${toolDesc}</span><br><br>
                <em>Coming Soon! This tool is under active development.</em>
            `;
        }
        
        // Add some interactivity
        setupPlaceholderInteraction(container, toolId);
        
    } catch (error) {
        console.error('Failed to load placeholder tool:', error);
        container.innerHTML = '<div class="error">Failed to load placeholder tool</div>';
    }
}

function setupPlaceholderInteraction(container, toolId) {
    // Add click handler to the SVG for a little Easter egg
    const svg = container.querySelector('.placeholder-svg');
    if (svg) {
        svg.style.cursor = 'pointer';
        svg.style.transition = 'transform 0.3s ease';
        
        svg.addEventListener('click', () => {
            svg.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                svg.style.transform = 'rotate(0deg)';
            }, 300);
        });
        
        svg.addEventListener('mouseenter', () => {
            svg.style.transform = 'scale(1.1)';
        });
        
        svg.addEventListener('mouseleave', () => {
            svg.style.transform = 'scale(1)';
        });
    }
}
