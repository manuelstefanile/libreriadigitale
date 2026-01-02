
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8080,
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        // Reindirizza le chiamate API al backend locale durante lo sviluppo
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    port: 8080,
    host: true,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
