import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import unocss from 'unocss/astro'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://beta.qingshaner.com',
  integrations: [
    unocss({
      injectReset: '@unocss/reset/normalize.css'
    }),
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'vitesse-light',
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
