import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Requests to /api are proxied to the Go backend. The /api prefix is stripped
// so that /api/convert reaches the backend's /convert route. The target can be
// overridden with VITE_PROXY_TARGET (used by docker-compose to point at the
// "backend" service).
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
