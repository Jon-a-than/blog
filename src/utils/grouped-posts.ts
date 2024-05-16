import { getCollection } from 'astro:content'

const posts = await getCollection('posts')

export const groupedPosts = posts.reduce<Map<string, Array<(typeof posts)[number]>>>(
  (acc, post) => {
    const { data } = post
    const { categories } = data

    for (const category of categories) {
      if (!acc.has(category)) {
        acc.set(category, [])
      }

      // biome-ignore lint/style/noNonNullAssertion: is checked above
      acc.set(category, [...acc.get(category)!, post])
    }

    return acc
  },
  new Map()
)
