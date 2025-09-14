// scripts/copy-static-to-dist.cjs
// Copies static JS files needed at the root of dist for Netlify deployment

const fs = require('fs');
const path = require('path');

const filesToCopy = [
  'js-yaml.min.js',
  'xmllint.js',
  'sidebar.js',
  'service-worker.js'
];

const srcDir = path.resolve(__dirname, '..');
const distDir = path.resolve(__dirname, '../dist');

filesToCopy.forEach(file => {
  const src = path.join(srcDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} to dist/`);
  } else {
    console.warn(`File not found: ${src}`);
  }
});
