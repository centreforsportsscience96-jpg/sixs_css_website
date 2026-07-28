import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('framer-motion')) return 'framer-motion';
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('react-router-dom') || id.includes('/react-dom/') || id.includes('/react/')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
})
