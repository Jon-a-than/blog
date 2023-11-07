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
    },
    highlight: {
      theme: 'vitesse-dark',
      preload: ['ts', 'vue', 'json', 'bash']
    },
    markdown: {
      toc: {
        depth: 2,
        searchDepth: 2
      }
    }
  },

  routeRules: {
    '/resume/**': {
      prerender: true
    },
    '/posts/**': {
      prerender: true
    }
  },

  typescript: { shim: true }

})
