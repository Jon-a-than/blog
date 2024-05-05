import { weathers } from '@/config'
import { z, defineCollection } from 'astro:content'

const baseSchema = {
  title: z.string(),
  pubDate: z.date(),
  description: z.string()
}

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object(baseSchema)
})

const postCollection = defineCollection({
  type: 'content',
  schema: z.object({
    ...baseSchema,
    author: z.string(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    weather: z.enum(weathers)
  })
})

const noteCollection = defineCollection({
  type: 'content',
  schema: z.object({
    ...baseSchema,
    tags: z.array(z.string())
  })
})

export const collections = {
  blogs: blogCollection,
  posts: postCollection,
  notes: noteCollection,
  index: defineCollection({
    type: 'content'
  })
}
