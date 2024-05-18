import rss, { type RSSFeedItem } from '@astrojs/rss'
import { blogConfig } from '#'
import { getCollection } from 'astro:content'
import { collectionKeys } from '@/content/config'
import { collectionDateMap } from '@/utils/auto-date'

export async function GET(context: Request) {
  const dateMap = await collectionDateMap
  const items = await Promise.all(
    collectionKeys.map(async (collection) => {
      const date = dateMap.get(collection)
      const contents = await getCollection(collection)

      return contents.map<RSSFeedItem>((content) => ({
        title: content.data.title,
        pubDate: date?.get(content.id)?.patchDate ?? new Date(),
        description: content.data.description,
        link: `/${collection}/${content.slug}`
      }))
    })
  )

  const { title, description, customData } = {
    ...blogConfig.rss
  }

  return rss({
    title,
    description,
    site: context.url,
    items: items.flat(),
    customData: customDataHelper({
      language: 'zh-CN',
      lastBuildDate: new Date().toUTCString(),
      ...customData
    })
  })
}

function customDataHelper(customData: Record<string, string>) {
  return Object.entries(customData).reduce(
    (xml, [key, value]) => `${xml}<${key}>${value}</${key}>`,
    ''
  )
}
