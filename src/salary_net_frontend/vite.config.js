import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';
import environment from 'vite-plugin-environment'; // Tambahkan ini

dotenv.config({ path: '../../.env.development' });

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    environment('all', { prefix: ['CANISTER_', 'DFX_'] }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
    fs: {
      allow: ['..']
    }
  },
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(
          new URL("../declarations", import.meta.url)
        ),
      },
      {
        find: "@",
        replacement: fileURLToPath(
          new URL("./src", import.meta.url)
        ),
      },
    ],
    dedupe: ['@dfinity/agent'],
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
});