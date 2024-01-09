import type { BaseFields, Comment } from '@/shared/entity/comment'
import { getCurrentPostLink } from '@/shared/utils/postLink'

const COMMENT_TEXTAREA = document.querySelector('#comment-textarea')
const COMMENT_NICKNAME = document.querySelector('#comment-nickname')
const COMMENT_SUBMIT = document.querySelector('#comment-submit')
const POST_COMMENT_TEMPLATE: HTMLTemplateElement = document.querySelector('#postComment')!

const COMMENT_FORM = document.querySelector('#comment') as HTMLFormElement

export async function renderComments() {
  const res = await fetch(
    `/api/comment?limit=100&postLink=${getCurrentPostLink(location.pathname)}`
  )
  const comments = (await res.json()) as Comment[]

  const commentContainer = document.querySelector('#comment-container') as HTMLDivElement
  commentContainer.innerHTML = ''
  comments.forEach(({ author, comment, position, date }) => {
    const template = document.importNode(POST_COMMENT_TEMPLATE.content, true)
    template.querySelector('[data-type="author"]')!.textContent = author
    template.querySelector('[data-type="comment"]')!.textContent = comment
    template.querySelector('[data-type="position"]')!.textContent = position
    template.querySelector('[data-type="time"]')!.textContent = new Date(date).toLocaleString(
      'zh-CN'
    )
    commentContainer.appendChild(template)
  })
}

async function addComment(comment: string, author: string) {
  if (!comment || !author) return

  const res = await fetch('/api/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      author,
      comment,
      postLink: getCurrentPostLink(location.pathname)
    } satisfies Omit<Comment, keyof BaseFields>)
  })
  COMMENT_FORM.reset()
  await res.json()

  renderComments()
}

COMMENT_FORM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const comment = (e.target as unknown as HTMLTextAreaElement[])[0].value.trim()
  const nickname = (e.target as unknown as HTMLTextAreaElement[])[1].value.trim()

  await addComment(comment, nickname)
})

COMMENT_SUBMIT!.addEventListener('click', async () => {
  const comment = (COMMENT_TEXTAREA as HTMLTextAreaElement).value.trim()
  const nickname = (COMMENT_NICKNAME as HTMLInputElement).value.trim()

  await addComment(comment, nickname)
})
