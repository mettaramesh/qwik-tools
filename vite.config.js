import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  base: '/', // changed from '/qwik/' for Netlify root deployment
  publicDir: 'public',
  optimizeDeps: {
    exclude: ['xmllint-wasm'],
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000, // Increased from default 500 kB
    rollupOptions: {
      input: './index.html',
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('xmllint') || id.includes('js-yaml') || id.includes('cronstrue')) {
            return 'heavy-tools';
          }
        },
      },
    },
  },
  plugins: [wasm()]
});
