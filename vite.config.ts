import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // We disable the service worker in development to avoid conflicts
      devOptions: {
        enabled: false
      },
      // The manifest is the core of the PWA
      manifest: {
        name: 'JamesTronic PWA',
        short_name: 'JamesTronic',
        description: 'On-demand electronic repair services.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // This is the key to the app-like experience
        start_url: '.',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Important for Android icons
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0', // Allow access from local network
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
