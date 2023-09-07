import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno
} from 'unocss'

export default defineConfig({
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
  transformers: []
})
