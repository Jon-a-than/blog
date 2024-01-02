import { serviceWorkerPromise } from '@/shared'
import type { Comment } from '@/shared/entity/comment'

hydrate()

async function hydrate() {
  const postCardList: NodeListOf<HTMLDivElement> = document.querySelectorAll('div[data-post-link]')

  postCardList.forEach((postCard) => {
    console.log(postCard)
    postCard.addEventListener('click', () => {
      const postLink = postCard.dataset.postLink
      location.pathname = `${import.meta.env.BASE_URL}${postLink!}`
    })
  })

  await serviceWorkerPromise
  renderLatestComment()
}

async function renderLatestComment(limit: number = 10) {
  const commentList = await apiGetLatestComments(limit)
  const CommentContainer = document.querySelector('#latestComments') as HTMLDivElement
  const CommentTemplate = document.querySelector('#comment') as HTMLTemplateElement
  const anchor = CommentTemplate.content.querySelector('a')!

  commentList.forEach(({ comment, postLink }) => {
    anchor.textContent = comment
    anchor.href = postLink
    const clone = document.importNode(CommentTemplate.content, true)
    CommentContainer.appendChild(clone)
  })
}

async function apiGetLatestComments(limit: number): Promise<Comment[]> {
  const response = await fetch(`api/comment?limit=${limit}&postLink=home`)
  const comments = await response.json()
  return comments
}
