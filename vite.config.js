import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  root: './',
  publicDir: 'public',
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    port: 3000,
    open: false
  },
  build: {
    outDir: 'dist'
  }
});
