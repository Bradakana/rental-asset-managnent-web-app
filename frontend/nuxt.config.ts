// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],
  
  // CSS
  css: [
    '@mdi/font/css/materialdesignicons.css',
    'vuetify/styles'
  ],
  
  // Runtime config
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3001'
    }
  },
  
  // Build configuration
  build: {
    transpile: ['vuetify']
  },
  
  // Vite configuration
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    ssr: {
      noExternal: ['vuetify']
    },
    optimizeDeps: {
      include: ['vuetify']
    }
  },

  // SSR configuration
  ssr: true,

  // App configuration
  app: {
    head: {
      title: 'Rental Asset Management',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  // intlify хэсгийг устгана, оронд нь i18n тохиргоо нэмнэ
  i18n: {
    locales: [
      { code: 'mn', name: 'Монгол', file: 'mn.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'mn',
    lazy: true,
    langDir: '../locales/',
    vueI18n: './i18n.config.js'
  }
})
