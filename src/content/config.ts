import { blogConfig } from '#'
import { z, defineCollection } from 'astro:content'

const dateScheme = z.union([
  z
    .string()
    .trim()
    .transform((str) => {
      const date = new Date(str)
      if (Number.isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${str}`)
      }
      return date
    }),
  z.date()
])

const baseSchema = {
  title: z.string(),
  pubDate: z.optional(dateScheme),
  patchDate: z.optional(dateScheme),
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
    weather: z.enum(Reflect.ownKeys(blogConfig.markdown.weathers) as [string, ...string[]])
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
