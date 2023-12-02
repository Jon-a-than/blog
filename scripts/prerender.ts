import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import postMetaPromise from './generate-post'
import { resolve } from 'node:path'

const postSlotRegExp = {
  Title: '<!-- POST_TITLE -->',
  Markdown: /<!-- POST_SLOT_START -->.*<!-- POST_SLOT_END -->/gs
}
export default prerender()

async function prerender() {
  const postMeta = await postMetaPromise

  const postArray = Object.entries(postMeta)
  const viteMultiPages: string[] = []

  const postGenerateDir = fileURLToPath(new URL('../posts', import.meta.url))
  const postTemplate = fileURLToPath(new URL('../post/index.html', import.meta.url))
  const postTemplateContent = await readFile(postTemplate, 'utf-8')

  postArray.forEach(async ([path, post]) => {
    const postPath = resolve(postGenerateDir, `${path.slice(0, -2)}html`)
    viteMultiPages.push(postPath)

    const postContent = postTemplateContent
      .replaceAll(postSlotRegExp.Title, post.meta.title)
      .replace(postSlotRegExp.Markdown, post.html)

    await mkdir(resolve(postPath, '..'), { recursive: true })
    writeFile(postPath, postContent)
  })

  return viteMultiPages
}
