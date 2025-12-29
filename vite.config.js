import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable JSX in .js files (not just .jsx)
      include: /\.(jsx|js)$/,
      jsxRuntime: 'automatic',
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // Map process.env to Vite's environment variables
    // Vite uses import.meta.env, but we support process.env for backward compatibility
    // This runs at build time, so we use process.env here
    'process.env.REACT_APP_BACKEND_URL': JSON.stringify(
      process.env.VITE_BACKEND_URL || 'http://localhost:8000'
    ),
    'process.env.REACT_APP_GOOGLE_CLIENT_ID': JSON.stringify(
      process.env.VITE_GOOGLE_CLIENT_ID || ''
    ),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || process.env.MODE || 'development'),
  },
});

