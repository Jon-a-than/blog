import { createStore, get, set } from './indexedDB'

export interface User {
  username: string
  password: string
}

const userStore = createStore('blog', 'users')

export async function addUser(newUser: User): Promise<User> {
  await set(newUser.username, newUser, userStore)
  return newUser
}

export function getUserByUsername(username: string) {
  return get<User>(username, userStore)
}
