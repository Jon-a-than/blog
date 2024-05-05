import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'
import unocss from 'unocss/astro'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'

const shikiFilenameReg = /filename=([^ ]*)/
const specialFilenameReg = [
  {
    reg: /\/?package\.json/,
    lang: 'package.json'
  },
  {
    reg: /\/?tsconfig\..*\.json/,
    lang: 'tsconfig.json'
  }
]

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
      transformers: [
        {
          postprocess(html, options) {
            console.log(html, options)
            const filename =
              this.options.meta?.__raw?.match(shikiFilenameReg)?.[1] || ''

            const specialFilenameLang = specialFilenameReg.find(({ reg }) => {
              return reg.test(filename)
            })?.lang

            return `<div class="shiki-code-block">
            <span data-lang="${
              specialFilenameLang ?? options.lang
            }" class="shiki-filename${
              filename === '' ? ' no-filename' : ''
            }">${filename}</span>
            ${html}
            </div>`
          }
        }
      ],
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
