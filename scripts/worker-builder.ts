import { build } from 'esbuild'

build({
  target: 'es2020',
  platform: 'browser',
  entryPoints: ['service/index.ts'],
  outfile: 'public/service-worker.js'
})
