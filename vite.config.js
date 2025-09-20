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
    rollupOptions: {
      input: './html/index.html',
    },
  },
  plugins: [wasm()]
});
