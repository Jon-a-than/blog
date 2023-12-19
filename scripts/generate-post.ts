import { load } from 'js-yaml'

import { extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { exec } from 'node:child_process'
import { readFile, stat, readdir, writeFile } from 'node:fs/promises'

const POST_PREFIX = '/posts/'

interface PostMeta {
  title: string
  tags: string[]
  categories: string[]
  description: string
}
export interface Post {
  meta: PostMeta
  path: string
  link: string
  updatedAt: string
  createdAt: string
}

export default parsePostMeta()

// 该脚本生成文章信息，不要手动修改config/post.json 该文件在构建前生成,可在源码中使用
async function parsePostMeta(
  output: string = fileURLToPath(new URL('../config/post.json', import.meta.url)),
  root: string = fileURLToPath(new URL('../content', import.meta.url))
): Promise<Post[]> {
  const stack = [root]
  const routerMeta: Post[] = []
  while (stack.length) {
    const path = stack.pop()!

    const pathInfo = await parsePath(path)
    if (!pathInfo) {
      continue
    } else if (Array.isArray(pathInfo)) {
      stack.push(...pathInfo)
      continue
    } else {
      const [meta, [updatedAt, createdAt]] = await Promise.all([
        parsePost(pathInfo),
        getPostDate(pathInfo)
      ])
      routerMeta.push({
        meta,
        path: pathInfo,
        link: pathToLink(pathInfo.slice(root.length + 1)),
        updatedAt,
        createdAt
      })
    }
  }

  routerMeta.reverse()
  await writeFile(output, JSON.stringify(routerMeta, null, 2))
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

async function parsePost(path: string): Promise<PostMeta> {
  const markdownFile = await readFile(path, 'utf-8')
  const yaml = markdownFile.match(/---\n([\s\S]+?)\n---/)?.[1]
  if (!yaml) {
    console.error(`${path} 文章格式错误, 请在文章开头添加yaml头部信息`)
    process.exit(1)
  }

  /** @todo 错误处理与测试 */
  const meta = load(yaml) as PostMeta

  return meta
}

function pathToLink(path: string) {
  return (
    POST_PREFIX +
    path
      .split('/')
      .map((p) => p.replace(/^\d\./, '').replace(/\.md$/, '.html'))
      .join('/')
  )
}

async function isDirectory(path: string) {
  try {
    const res = await stat(path)
    return res.isDirectory()
  } catch (e) {
    return false
  }
}

async function getPostDate(path: string): Promise<[update: string, create: string]> {
  return new Promise((res) => {
    exec(`git log --pretty=format:"%ad" --date=iso ${path}`, async (e, dateListTxt) => {
      const dateList = dateListTxt.split('\n')
      if (dateList[0] === '') {
        const now = new Date().toISOString()
        res([now, now])
      }

      const updateAt = (await hasWithoutCommitChange(path)) ? new Date().toISOString() : dateList[0]
      res([updateAt, dateList.at(-1)!])
    })
  })
}

async function hasWithoutCommitChange(path: string): Promise<boolean> {
  return new Promise((res) => {
    exec(`git status ${path}`, (e, txt) => {
      res(txt.includes('.md'))
    })
  })
}
