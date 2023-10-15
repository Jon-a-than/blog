export default defineNuxtConfig({
  app: {
    head: { title: 'Blog' }
  },
  css: ['@unocss/reset/normalize.css', 'assets/styles/global.css'],
  devtools: { enabled: false },

  modules: ['@vueuse/nuxt', '@nuxt/content', '@unocss/nuxt', 'nuxt-vitest'],
  content: {
    documentDriven: {
      layoutFallbacks: ['post']
    }
  },

  routeRules: {
    '/resume/**': {
      swr: true
    }
  },

  typescript: { shim: true }

})
