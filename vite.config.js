import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite configuration for Health Bride project
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for src directory
    },
  },
  server: {
    port: 3000, // Development server port
    open: true, // Open the browser automatically when the server starts
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // API proxy for local development
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist', // Output directory for the production build
    sourcemap: true, // Generate source maps for easier debugging
    rollupOptions: {
      output: {
        // Configure chunking and optimization
        chunkFileNames: 'assets/[name].[hash].js', // Naming for chunk files
        entryFileNames: 'assets/[name].[hash].js', // Naming for entry files
        assetFileNames: 'assets/[name].[hash].[ext]', // Naming for asset files
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Pre-bundle dependencies for faster startup
  },
});