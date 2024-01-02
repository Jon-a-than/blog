import posts from '@/config/post.json'
import { getCurrentPostLink } from '@/shared/utils/postLink'

export function renderRecommendPost() {
  const relatedPosts = getRelatedPosts()

  const RecommendPostItemTemplate = document.getElementById(
    'recommendPostItem'
  ) as HTMLTemplateElement
  const ANCHOR = RecommendPostItemTemplate.content.querySelector('a')!

  const MENU_CONTAINER = document.getElementById('recommendPostContainer')!

  relatedPosts.forEach(([title, link]) => {
    ANCHOR.textContent = title
    ANCHOR.href = `${import.meta.env.BASE_URL}${link}`
    const template = document.importNode(RecommendPostItemTemplate.content, true)
    MENU_CONTAINER.appendChild(template)
  })
}

type Post = [title: string, link: string]

function getRelatedPosts(): Post[] {
  const currentPostLink = getCurrentPostLink(location.pathname).slice(1)
  const linkTokens = currentPostLink.split('/')
  const prefix = linkTokens.slice(0, -1).join('/')

  return posts
    .filter(({ link }) => {
      if (`${currentPostLink}.html` === link) return false
      return link.startsWith(prefix) && link.split('/').length === linkTokens.length
    })
    .map<Post>(({ link, meta }) => {
      return [meta.title, link]
    })
}
