import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'localhost', // localhost is allowed by default, but it's good practice to include it
      'hip-piglet-forcibly.ngrok-free.app',
      // Or, if you want to allow all ngrok-free.app subdomains:
      // '.ngrok-free.app',
    ],
    
    // Proxy API requests to avoid CSP issues
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    // Disable source maps in production to avoid eval issues
    sourcemap: false,
  },
  define: {
    // Ensure global is defined
    global: 'globalThis',
  },
  esbuild: {
    // Remove console logs in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  }
})