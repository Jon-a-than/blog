import { createStore, values, del, set } from './indexedDB'

export interface BaseFields {
  id: string
  date: number
  position: string
}

export interface Comment extends BaseFields {
  comment: string
  author: string
  postLink: string
}

const commentStore = createStore('blog', 'comments')

export async function addComment(newComment: Omit<Comment, 'id' | 'date'>): Promise<Comment> {
  const id = crypto.randomUUID()
  const newCommentWithId = { id, date: Date.now(), ...newComment }
  await set(id, newCommentWithId, commentStore)
  return newCommentWithId
}

export function getComments() {
  return values<Comment>(commentStore)
}

export async function removeComment(id: string) {
  await del(id)
}
