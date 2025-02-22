import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for src directory
    },
  },
  server: {
    port: 5173, // Development server port
    open: true, // Open browser on server start
  },
  build: {
    outDir: 'dist', // Output directory for production build
  },
});


// import { defineConfig } from "vite";
// import react from "react";

// export default defineConfig({
//   plugins: [react()], //
//   css: {
//     modules: {
//       localsConvention: "camelCaseOnly",
//     },

//   },
//   define: {
//     "process.env": process.env
//   },
// })