import unocss from 'unocss/vite'
import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig, type UserConfig } from 'vite'
import multiPagesPromise from './scripts/prerender'

const multiPages = await multiPagesPromise

export default defineConfig(({ command, isPreview }) => {
  const commonConfig = {
    build: {
      minify: false,
      emptyOutDir: true,
      rollupOptions: {
        input: ['./index-dev.html', ...multiPages]
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
      return mergeConfig(commonConfig, { base: isPreview ? '/' : '/dist/' })
    case 'serve':
    default:
      return mergeConfig(commonConfig, {})
  }
})
