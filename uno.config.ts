import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives
} from 'unocss'

import { colors } from 'unocss/preset-mini'

export default defineConfig({
  content: {
    pipeline: {
      include: [
        /\.(vue|[jt]sx|mdx?|html)($|\?)/,
        'app.config.ts'
      ]
    }
  },
  presets: [
    presetAttributify({ prefix: 'v:' }),
    presetIcons({
      cdn: 'https://fastly.jsdelivr.net/npm/',
      extraProperties: { display: 'inline-block', 'vertical-align': 'middle' }
    }),
    presetUno()
  ],
  rules: [],
  safelist: [],
  shortcuts: {},
  theme: {
    colors: {
      ...colors,
      get primary (): typeof colors.slate {
        return this.slate
      },
      get primaryDark (): typeof colors.slate {
        return this.slate
      }
    }
  },
  transformers: [transformerDirectives()]
})
