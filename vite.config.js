import { defineConfig } from "vite"
import { resolve } from "path"
import { VitePWA } from 'vite-plugin-pwa'
import { createHtmlPlugin } from 'vite-plugin-html'

const isProd = process.env.NODE_ENV === 'production'
const base = isProd ? '/projets/vanlive/app/' : '/'

const appleMetaTags = [
  { injectTo: 'head', tag: 'meta', attrs: { name: 'apple-mobile-web-app-capable', content: 'yes' } },
  { injectTo: 'head', tag: 'meta', attrs: { name: 'apple-mobile-web-app-status-bar-style', content: 'default' } },
  { injectTo: 'head', tag: 'meta', attrs: { name: 'apple-mobile-web-app-title', content: 'VanLive' } },
  { injectTo: 'head', tag: 'link', attrs: { rel: 'apple-touch-icon', href: `${base}images/icons/icon-180.png` } }
]

export default defineConfig({
  base,

  plugins: [
    createHtmlPlugin({
      pages: [
        { filename: 'index.html',      template: 'index.html' },
        { filename: 'connexion.html',  template: 'connexion.html' },
        { filename: 'onboarding.html', template: 'onboarding.html' },
        { filename: 'plan.html',       template: 'plan.html' },
        { filename: 'compte.html',     template: 'compte.html' },
        { filename: 'detail.html',     template: 'detail.html' },
      ],
      inject: { tags: appleMetaTags }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      base,
      manifest: {
        name: 'VanLive',
        short_name: 'VanLive',
        start_url: base,
        display: 'standalone',
        background_color: '#0B132B',
        theme_color: '#E1E5F2',
        icons: [
          { src: `${base}images/icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${base}images/icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: `${base}images/icons/icon-180.png`, sizes: '180x180', type: 'image/png' }
        ]
      }
    })
  ],

  build: {
    rollupOptions: {
      input: {
        main:        resolve(__dirname, "index.html"),
        connexion:   resolve(__dirname, "connexion.html"),
        onboarding:  resolve(__dirname, "onboarding.html"),
        plan:        resolve(__dirname, "plan.html"),
        compte:      resolve(__dirname, "compte.html"),
      }
    }
  }
})