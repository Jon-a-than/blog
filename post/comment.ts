import type { BaseFields, Comment } from '@/shared/entity/comment'
import { getCurrentPostLink } from '@/shared/utils/postLink'

const COMMENT_TEXTAREA = document.querySelector('#comment-textarea')
const COMMENT_NICKNAME = document.querySelector('#comment-nickname')
const COMMENT_SUBMIT = document.querySelector('#comment-submit')

const COMMENT_FORM = document.querySelector('#comment') as HTMLFormElement

setTimeout(renderComments, 500)
async function renderComments() {
  const res = await fetch('/api/comment?limit=100')
  const comments = (await res.json()) as Comment[]
  console.log(comments)

  const commentList = comments.reduce((acc, comment) => acc + commentTemplate(comment), '')
  const commentContainer = document.querySelector('#comment-container') as HTMLDivElement
  commentContainer.innerHTML = commentList
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
  const newComment = await res.json()

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

function commentTemplate(comment: Comment) {
  return `
<div>
  <p class="mb-0">
    <span class="font-bold after:content-[':']">${comment.author}</span>
  </p>
  <p class="mt-0 flex flex-1 flex-col bg-primary-3 dark:bg-primary-6 rounded pa-2">
    <span>${comment.comment}</span>
    <span class="ml-auto text-sm text-primary-5 dark:text-primary-2">
      ${comment.position}
      <time>${new Date(comment.date).toLocaleString('zh-CN')}</time>
    </span>
  </p>
</div>`
}
