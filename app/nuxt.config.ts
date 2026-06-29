// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  modules: ['@nuxt/ui', '@nuxt/image'],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    dataValue: 'theme',
    storageKey: 'portfolio-theme',
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  // ─── Image Optimization ──────────────────────────────────────
  image: {
    provider: 'ipx',
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    presets: {
      avatar: {
        modifiers: {
          width: 112,
          height: 112,
          format: 'webp',
          quality: 80,
        },
      },
      thumbnail: {
        modifiers: {
          width: 600,
          format: 'webp',
          quality: 80,
        },
      },
    },
  },

  // ─── Build Optimizations — Code Splitting + Chunk Control ────
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            // Large libraries get their own chunk for parallel loading
            if (id.includes('node_modules/three')) return 'three'
            if (id.includes('node_modules/gsap')) return 'gsap'
            if (id.includes('node_modules/typed.js')) return 'typed'

            // Vue framework core (used by everything, so avoid circular deps
            // by isolating it early)
            if (id.includes('node_modules/vue')) return 'vue'
            if (id.includes('node_modules/@vue')) return 'vue'
            if (id.includes('node_modules/vue-router')) return 'vue'
            if (id.includes('node_modules/vue-demi')) return 'vue'
          },
        },
      },
      chunkSizeWarningLimit: 800,
    },
    // Pre-bundle heavy deps so Vite doesn't re-optimize them at runtime
    optimizeDeps: {
      include: [
        'gsap',
        'gsap/ScrollTrigger',
        'typed.js',
        'three',
      ],
    },
  },

  // ─── Route Rules — SSG Cache Headers (Nitro server mode) ────
  routeRules: {
    // Build artifacts: fingerprinted, never changes
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  // Strict TypeScript but skip type-check pass during build (faster)
  typescript: {
    strict: true,
    typeCheck: false,
  },
})
