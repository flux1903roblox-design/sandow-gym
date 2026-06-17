import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import path from 'node:path'

// HTTPS (mkcert) is opt-in: `HTTPS=true npm run dev` — only needed to test camera /
// install / IndexedDB persistence on a real iPhone over the LAN.
const useHttps = process.env.HTTPS === 'true'
// Base path for hosting under a sub-path (e.g. GitHub Pages project site).
// Pass the repo name WITHOUT slashes (e.g. VITE_BASE=sandow-gym) to avoid shell
// path-mangling; we normalize to "/sandow-gym/". Default is root "/".
const rawBase = process.env.VITE_BASE
const base = rawBase && rawBase !== '/' ? `/${rawBase.replace(/^\/+|\/+$/g, '')}/` : '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    ...(useHttps ? [mkcert()] : []),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg'],
      devOptions: { enabled: false },
      manifest: {
        name: 'Sandow — Fitness',
        short_name: 'Sandow',
        description: 'Offline-first fitness companion',
        lang: 'he',
        dir: 'rtl',
        theme_color: '#0A0B0D',
        background_color: '#0A0B0D',
        display: 'standalone',
        orientation: 'portrait',
        scope: base,
        start_url: base,
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff,woff2,png,svg,ico}'],
        navigateFallback: `${base}index.html`,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 600, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { host: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          map: ['leaflet', 'react-leaflet'],
          motion: ['framer-motion'],
          data: ['dexie', 'dexie-react-hooks', 'zustand', 'date-fns', 'i18next', 'react-i18next'],
        },
      },
    },
  },
})
