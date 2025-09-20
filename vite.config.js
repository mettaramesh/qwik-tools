import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import { copyFileSync, readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';

// Custom plugin to copy index.html and favicons to root after build
function copyIndexToRoot() {
  return {
    name: 'copy-index-to-root',
    writeBundle() {
      try {
        // Read and modify index.html content
        let indexContent = readFileSync(resolve('dist/html/index.html'), 'utf8');
        
        // Update favicon paths to use root files instead of assets
        indexContent = indexContent.replace(
          /href="\/assets\/favicon-[^"]+\.svg"/g,
          'href="/favicon.svg"'
        );
        indexContent = indexContent.replace(
          /href="\/assets\/favicon-[^"]+\.ico"/g,
          'href="/favicon.ico"'
        );
        
        // Write the modified index.html to root
        writeFileSync(resolve('dist/index.html'), indexContent);
        console.log('✓ Copied and updated index.html to dist root');
        
        // Copy favicon files from root to dist root
        copyFileSync(
          resolve('favicon.ico'),
          resolve('dist/favicon.ico')
        );
        copyFileSync(
          resolve('favicon.svg'),
          resolve('dist/favicon.svg')
        );
        console.log('✓ Copied favicon files to dist root');
        
        // Copy service worker
        copyFileSync(
          resolve('js/service-worker.js'),
          resolve('dist/service-worker.js')
        );
        console.log('✓ Copied service worker to dist root');
        
        // Create _redirects file for Netlify SPA routing
        writeFileSync(
          resolve('dist/_redirects'),
          '/*    /index.html   200\n'
        );
        console.log('✓ Created _redirects file for Netlify');
        
        // Copy all HTML files from dist/html to dist root (except index.html)
        const htmlDir = resolve('dist/html');
        if (existsSync(htmlDir)) {
          const htmlFiles = readdirSync(htmlDir).filter(file => 
            file.endsWith('.html') && file !== 'index.html'
          );
          
          for (const file of htmlFiles) {
            copyFileSync(
              join(htmlDir, file),
              resolve('dist', file)
            );
          }
          console.log(`✓ Copied ${htmlFiles.length} HTML tool files to dist root`);
        }
      } catch (error) {
        console.error('Failed to copy files:', error);
      }
    }
  };
}

export default defineConfig({
  base: '/', // changed from '/qwik/' for Netlify root deployment
  publicDir: 'public',
  optimizeDeps: {
    exclude: ['xmllint-wasm'],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './html/index.html',
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    copyPublicDir: true
  },
  plugins: [wasm(), copyIndexToRoot()]
});
