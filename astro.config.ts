import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import unocss from 'unocss/astro'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'

import { filenameTransformer } from './plugins/shiki-filename'

export default defineConfig({
  site: 'https://beta.qingshaner.com',
  integrations: [
    unocss({
      injectReset: '@unocss/reset/normalize.css'
    }),
    sitemap(),
    mdx()
  ],
  markdown: {
    shikiConfig: {
      transformers: [filenameTransformer()],
      themes: {
        light: 'vitesse-light',
        dark: 'nord'
      }
    }
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./blog.config', import.meta.url))
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
