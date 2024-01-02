import unocss from 'unocss/vite'
import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig, type UserConfig } from 'vite'
import multiPagesPromise from './scripts/prerender'

const multiPages = multiPagesPromise

export default defineConfig(({ command, isPreview }) => {
  const commonConfig = {
    build: {
      minify: false,
      emptyOutDir: true,
      rollupOptions: {
        input: ['./index.html', './about/index.html', ...multiPages]
      }
    },
    css: {
      transformer: 'lightningcss'
    },
    plugins: [unocss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url))
      }
    }
  } satisfies UserConfig

  switch (command) {
    case 'build':
      return mergeConfig(commonConfig, {})
    case 'serve':
    default:
      return mergeConfig(commonConfig, {})
  }
})
