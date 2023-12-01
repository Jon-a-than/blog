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
      include: [/\.([jt]sx|mdx?|html)($|\?)/]
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
  shortcuts: {
    'scrollbar-slim':
      'scrollbar:(w-2 h-2 bg-transparent) scrollbar-corner:bg-transparent scrollbar-thumb:(rounded bg-primary dark:bg-primary-6 h-2 w-2)'
  },
  theme: {
    colors: {
      ...colors,
      get primary(): typeof colors.slate {
        return this.slate
      },
      get primaryDark(): typeof colors.slate {
        return this.slate
      }
    }
  },
  transformers: [transformerDirectives()],
  variants: [
    (matcher) => {
      if (!matcher.startsWith('scrollbar:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(10),
        selector: (s) => `${s}::-webkit-scrollbar`
      }
    },
    (matcher) => {
      if (!matcher.startsWith('scrollbar-thumb:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(16),
        selector: (s) => `${s}::-webkit-scrollbar-thumb`
      }
    },
    (matcher) => {
      if (!matcher.startsWith('scrollbar-corner:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(17),
        selector: (s) => `${s}::-webkit-scrollbar-corner`
      }
    }
  ]
})
