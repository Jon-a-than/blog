import { load } from 'js-yaml'
import { buildMarkdownParser } from './markdown'

import { extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile, stat, readdir, writeFile } from 'node:fs/promises'

interface PostMeta {
  title: string
  updateAt: string
  tags: string[]
  categories: string[]
  description: string
}
interface Post {
  meta: PostMeta
  html: string
}

const marked = await buildMarkdownParser()
export default parsePostMeta()

// 该脚本生成文章信息，不要手动修改config/post.json 该文件在构建前生成,可在源码中使用
async function parsePostMeta(
  output: string = fileURLToPath(new URL('../config/post.json', import.meta.url)),
  root: string = fileURLToPath(new URL('../content', import.meta.url))
) {
  const stack = [root]
  const routerMeta: Record<string, Post> = {}
  while (stack.length) {
    const path = stack.pop()!

    const pathInfo = await parsePath(path)
    if (!pathInfo) {
      continue
    } else if (Array.isArray(pathInfo)) {
      stack.push(...pathInfo)
      continue
    } else {
      routerMeta[pathInfo.slice(root.length + 1)] = await parsePost(pathInfo)
    }
  }

  writeFile(output, JSON.stringify(routerMeta, null, 2))
  return routerMeta
}

/**
 * @param path
 * @return 如果是目录返回false，如果是.md文件返回文件路径, 如果是其他文件返回false
 */
async function parsePath(path: string) {
  if (await isDirectory(path)) {
    const pathList = await readdir(path)
    return pathList.map((p) => `${path}/${p}`)
  } else {
    return extname(path) === '.md' ? path : false
  }
}

async function parsePost(path: string): Promise<Post> {
  const markdownFile = await readFile(path, 'utf-8')
  const yaml = markdownFile.match(/---\n([\s\S]+?)\n---/)?.[1]
  if (!yaml) {
    console.error(`${path} 文章格式错误, 请在文章开头添加yaml头部信息`)
    process.exit(1)
  }

  /** @todo 错误处理与测试 */
  const meta = load(yaml) as PostMeta
  const html = await marked.parse(markdownFile.replace(/---\n([\s\S]+?)\n---/, ''))

  return { meta, html }
}

async function isDirectory(path: string) {
  try {
    const res = await stat(path)
    return res.isDirectory()
  } catch (e) {
    return false
  }
}
