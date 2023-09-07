export default defineNuxtConfig({
  app: {
    head: { title: 'Blog' }
  },
  css: ['@unocss/reset/normalize.css', 'assets/styles/global.css'],
  devtools: { enabled: false },

  modules: ['@nuxt/content', '@unocss/nuxt'],
  content: {
    documentDriven: {
      layoutFallbacks: ['post']
    }
  },

  typescript: { shim: true }

})
