import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.([jt]sx|mdx?|html|astro)($|\?)/]
    }
  },
  presets: [
    presetIcons({
      extraProperties: { display: 'inline-block', 'vertical-align': 'middle' }
    }),
    presetUno()
  ],
  rules: [],
  safelist: [],
  shortcuts: {
    'scrollbar-slim':
      'scrollbar:(w-2 h-2 bg-transparent) scrollbar-corner:bg-transparent scrollbar-thumb:(rounded bg-snow-5 dark:bg-night-4 h-2 w-2)'
  },
  theme: {
    colors: {
      night: {
        1: '#4C566A',
        2: '#434C5E',
        3: '#3B4252',
        4: '#2E3440',
        5: '#242933'
      },
      snow: {
        1: '#FFFFFF',
        2: '#F2F4F8',
        3: '#ECEFF4',
        4: '#E5E9F0',
        5: '#D8DEE9'
      },
      frost: {
        1: '#8FBCBB',
        2: '#88C0D0',
        3: '#81A1C1',
        4: '#5E81AC'
      }
    }
  },
  transformers: [transformerDirectives()],
  variants: [
    (matcher) => {
      if (!matcher.startsWith('scrollbar:')) return matcher
      return {
        matcher: matcher.slice(10),
        selector: (s) => `${s}::-webkit-scrollbar`
      }
    },
    (matcher) => {
      if (!matcher.startsWith('scrollbar-thumb:')) return matcher
      return {
        matcher: matcher.slice(16),
        selector: (s) => `${s}::-webkit-scrollbar-thumb`
      }
    }
  ]
})
