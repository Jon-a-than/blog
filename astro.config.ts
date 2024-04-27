import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import unocss from 'unocss/astro'

export default defineConfig({
  integrations: [
    unocss({
      injectReset: '@unocss/reset/normalize.css'
    })
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'solarized-light',
        dark: 'nord'
      }
    }
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      cssMinify: 'lightningcss'
    },
    css: {
      transformer: 'lightningcss'
    }
  }
})
