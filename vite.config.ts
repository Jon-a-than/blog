import unocss from 'unocss/vite'
import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig, type UserConfig } from 'vite'

export default defineConfig(({ command, isPreview }) => {
  const commonConfig = {
    build: {
      minify: false,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: 'index-dev.html'
        }
      }
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
