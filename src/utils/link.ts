import { blogConfig } from '#'

export function isExternalLink(link: string): boolean {
  if (link.startsWith(blogConfig.blog.site)) {
    return true
  }

  return /^https?:\/\//.test(link)
}
