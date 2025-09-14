// scripts/copy-static-to-dist.cjs
// Copies static JS files needed at the root of dist for Netlify deployment

const fs = require('fs');
const path = require('path');

// Get all .css and .js files in the project root (excluding node_modules, dist, scripts)
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

function getRootFilesByExt(ext) {
  return fs.readdirSync(rootDir)
    .filter(f => f.endsWith(ext) && fs.statSync(path.join(rootDir, f)).isFile());
}

const filesToCopy = [
  ...getRootFilesByExt('.js'),
  ...getRootFilesByExt('.css')
];

filesToCopy.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} to dist/`);
  } else {
    console.warn(`File not found: ${src}`);
  }
});
