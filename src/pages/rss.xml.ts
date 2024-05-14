import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context: Request) {
  const posts = await Promise.all([
    getCollection('posts'),
    getCollection('blogs'),
    getCollection('notes')
  ])

  return rss({
    title: 'QingShaner | Blog',
    description: '一个博客站点',
    site: context.url,
    items: posts.flat().map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.slug}/`
    })),
    customData: customDataHelper({
      language: 'zh-CN',
      lastBuildDate: new Date().toUTCString()
    })
  })
}

function customDataHelper(customData: Record<string, string>) {
  return Object.entries(customData).reduce(
    (xml, [key, value]) => `${xml}<${key}>${value}</${key}>`,
    ''
  )
}
