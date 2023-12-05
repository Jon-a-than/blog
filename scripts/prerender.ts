import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile, mkdir } from 'node:fs/promises'

import { buildMarkdownParser } from './markdown'
import postMetaPromise, { type Post } from './generate-post'

const postSlotRegExp = {
  Title: '<!-- POST_TITLE -->',
  Markdown: /<!-- POST_SLOT_START -->.*<!-- POST_SLOT_END -->/gs,
  PostCard: /<!-- POST_CARD_SLOT_START -->.*<!-- POST_CARD_SLOT_END -->/gs
}
export default prerender()

async function prerender() {
  const postMetaList = await postMetaPromise
  const [viteMultiPages] = await Promise.all([
    preRenderPosts(postMetaList),
    preRenderHome(postMetaList)
  ])

  return viteMultiPages
}

async function preRenderPosts(postMetaList: Post[]) {
  const marked = await buildMarkdownParser()
  const viteMultiPages: string[] = []

  const postGenerateDir = fileURLToPath(new URL('../posts', import.meta.url))
  const postTemplate = fileURLToPath(new URL('../post/index.html', import.meta.url))
  const postTemplateContent = await readFile(postTemplate, 'utf-8')

  postMetaList.forEach(async ({ path, meta, link }) => {
    const postPath = resolve(postGenerateDir, `..${link}`)
    viteMultiPages.push(postPath)

    const post = await readFile(path, 'utf-8')
    const html = await marked.parse(post.replace(/---\n([\s\S]+?)\n---/, ''))

    const postContent = postTemplateContent
      .replaceAll(postSlotRegExp.Title, meta.title)
      .replace(postSlotRegExp.Markdown, html)

    await mkdir(resolve(postPath, '..'), { recursive: true })
    writeFile(postPath, postContent)
  })

  return viteMultiPages
}

async function preRenderHome(postMetaList: Post[]) {
  postMetaList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const postTemplate = fileURLToPath(new URL('../index-dev.html', import.meta.url))
  const postTemplateContent = await readFile(postTemplate, 'utf-8')

  const postCardList = postMetaList.map(postCard).join('\n')
  const homeContent = postTemplateContent.replace(postSlotRegExp.PostCard, postCardList)
  await writeFile(fileURLToPath(new URL('../index.html', import.meta.url)), homeContent)
}

function postCard({ meta, link, createdAt }: Post) {
  return `<div
            data-post-link="/dist${link}"
            rotate="-5 hover:0"
            border="solid 1 primary-3 dark:primary-6 rounded-lg"
            bg="primary-2 dark:primary-7 hover:primary-3 dark:hover:primary-6"
            class="dark:hover:shadow-primary-6 hover:shadow-lg transition-transform duration-300 cursor-pointer w-48 pa-2 flex flex-col gap-2"
          >
            <header>
              <h3 class="my-0">${meta.title}</h3>
            </header>
            <section>
              <p class="my-0">
                ${(meta?.tags ?? [])
                  .map((tag) => {
                    return `<span class="text-lime-8 font-extralight dark:text-lime text-xs bg-lime-2/60 dark:bg-lime-2/40 rounded-sm py-1 px-2">
                  <i class="i-uil-pricetag-alt"></i>${tag}</span>`
                  })
                  .join('\n')}
              </p>
              <p class="mb-0 mt-2 h-40 overflow-hidden dark:text-primary-2 text-primary-6 line-height-5 before:content-['摘要:'] before:font-bold">
                ${meta.description ?? ''}
              </p>
            </section>
            <footer class="text-end">
              <time class="text-slate-5">${createdAt}</time>
            </footer>
          </div>`
}
