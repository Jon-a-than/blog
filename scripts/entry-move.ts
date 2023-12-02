import { copyFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function moveDistEntryToRoot() {
  const rootDir = fileURLToPath(new URL('..', import.meta.url))
  const source = resolve(rootDir, 'dist/index-dev.html')

  copyFileSync(source, resolve(rootDir, 'index.html'))
  rmSync(source)
}
