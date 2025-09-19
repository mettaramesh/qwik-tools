// Test script to check for tools with potential CSS timing issues
// Run this in browser console to quickly test all tools

const toolsWithoutDynamicCSS = [
  'base64-text', 'hash-generator', 'html', 'json-formatter', 
  'json-validator', 'json-xml', 'json-yaml', 'lorem-ipsum',
  'markdown-preview', 'qr-generator', 'regex-tester', 
  'timestamp', 'url', 'uuid-generator', 'xml-formatter', 'xml-validator'
];

function testToolLoadingTimes() {
  console.log('Testing tools without dynamic CSS loading...');
  
  toolsWithoutDynamicCSS.forEach((toolId, index) => {
    setTimeout(() => {
      console.log(`Loading ${toolId}...`);
      window.location.hash = `#${toolId}`;
      
      // Check if buttons are rendered correctly after a short delay
      setTimeout(() => {
        const buttons = document.querySelectorAll('.btn');
        const oversizedButtons = Array.from(buttons).filter(btn => {
          const rect = btn.getBoundingClientRect();
          return rect.height > 50; // Consider buttons over 50px height as oversized
        });
        
        if (oversizedButtons.length > 0) {
          console.warn(`${toolId}: Found ${oversizedButtons.length} potentially oversized buttons`);
        } else {
          console.log(`${toolId}: Buttons appear normal`);
        }
      }, 500);
    }, index * 2000); // 2 second delay between each tool
  });
}

// Run the test
// testToolLoadingTimes();
console.log('Test script loaded. Run testToolLoadingTimes() to begin testing.');