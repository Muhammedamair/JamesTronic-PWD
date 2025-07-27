import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // The VitePWA plugin has been removed to prevent service worker
    // interference in development mode. It will be re-added later
    // for production builds only.
  ],
  server: {
    host: '127.0.0.1', // Use explicit IP to avoid localhost resolution issues
    port: 5173,
    https: false, // Ensure HTTPS is disabled
    hmr: {
      protocol: 'ws',
      host: '127.0.0.1', // Explicitly match server host
      port: 5173,
      overlay: false, // Disable the error overlay
    },
  },
})
