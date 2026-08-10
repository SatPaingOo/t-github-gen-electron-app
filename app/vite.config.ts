import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build into app/dist so electron/main.js can loadFile() it when packaged.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
