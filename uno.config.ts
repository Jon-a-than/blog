import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.([jt]sx|mdx?|html|astro)($|\?)/, './blog.config.ts']
    }
  },
  presets: [
    presetIcons({
      extraProperties: { display: 'inline-block', 'vertical-align': 'middle' }
    }),
    presetUno()
  ],
  rules: [
    [
      'transition-background-size',
      {
        'transition-property': 'background-size',
        'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'transition-duration': '150ms'
      },
      { autocomplete: 'transition-background-size' }
    ]
  ],
  safelist: [],
  shortcuts: {
    divider: 'border-snow-4 dark:border-night-1 border-dashed border-x-transparent',
    'outline-animation': [
      'decoration-none bg-gradient-to-b from-[currentColor] to-frost-1',
      'bg-[length:0_2] hover:bg-[length:100%_2] bg-no-repeat bg-left-bottom',
      'transition-300 transition-background-size ease-linear'
    ].join(' '),
    link: 'decoration-none current:capitalize current:decoration-underline',
    'scrollbar-slim': [
      'scrollbar:(w-2 h-2 bg-transparent)',
      'scrollbar-corner:bg-transparent',
      'scrollbar-thumb:(rounded bg-snow-5 dark:bg-night-4 h-2 w-2)'
    ].join(' ')
  },
  theme: {
    colors: {
      bg: {
        1: 'var(--color-bg-1)',
        2: 'var(--color-bg-2)',
        3: 'var(--color-bg-3)'
      },

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
      },
      aurora: {
        1: '#BF616A',
        2: '#D08770',
        3: '#EBCB8B',
        4: '#A3BE8C',
        5: '#B48EAD'
      }
    }
  },
  transformers: [transformerDirectives()],
  variants: [
    (matcher) => {
      if (!matcher.startsWith('current:')) return matcher
      return {
        matcher: matcher.slice(8),
        selector: (s) => `${s}[data-current=true]`
      }
    },
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
    },
    (matcher) => {
      if (!matcher.startsWith('scrollbar-corner:')) return matcher
      return {
        matcher: matcher.slice(17),
        selector: (s) => `${s}::-webkit-scrollbar-corner`
      }
    }
  ]
})
